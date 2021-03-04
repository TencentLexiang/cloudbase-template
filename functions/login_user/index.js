const axios = require('axios');
const cloudBase = require('@cloudbase/node-sdk');

const app = cloudBase.init({
    env: process.env.ENV_ID,
    credentials: require("./tcb_custom_login_key.json")
});
const db = app.database();

exports.main = async(event, context) => {
    let call_ref = await app.callFunction({
        name: "get_user_info",
        data: {
            "code": event.code
        }
    });

    const user_info = call_ref.result;

    if (!user_info) {
        return {
            "code": 401,
            "msg": "获取用户信息失败"
        };
    }
    let company_info = await db.collection("companies").doc(user_info.company_id).get();
    if (!company_info.data[0]) {
        return {
            "code": 10001,
            "msg": "用户所在的乐享企业未开启应用"
        }
    }

    let attributes = {
        "name": user_info.staff_name,
        "avatar": user_info.staff_avatar,
        "gender": user_info.staff_gender
    };

    let user = await db.collection("users").where({
        "staff_id": user_info.staff_id,
        "company_id": user_info.company_id
    }).get();
    let user_id;
    if (!user.data[0]) {
        const res = await db.collection("users").add({
            "staff_id": user_info.staff_id,
            "company_id": user_info.company_id,
            "attributes": attributes,
            "created_at": new Date().format("yyyy-MM-dd hh:mm:ss")
        });
        user_id = res.id
    } else {
        user_id = user.data[0]._id;
    }
    
    return {
        "code": 0,
        "msg": "ok",
        "data": {
            "ticket": app.auth().createTicket(user_id, {
                refresh: 6 * 3600 * 1000,
                expire: 12 * 3600 * 1000
            }),
            "staff_attributes": attributes
        }
    };
}

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                  //小时
        "m+" : this.getMinutes(),                //分
        "s+" : this.getSeconds(),                //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()            //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}