const cloudBase = require('@cloudbase/node-sdk');

const app = cloudBase.init({});
const db = app.database();

exports.main = async (event, context) => {
    if (event.httpMethod === "POST") {
        const body = JSON.parse(event.body);
        db.collection("lx_suite_callback_logs").add(body);
        console.log(body);

        if (body.action === "service/suite_ticket") {
            db.collection("lx_suites").doc("suite_ticket").set({
                "value": body.attributes.suite_ticket,
                "expires_in": 1800,
                "created_at": new Date().getTime()
            });
        } else if (body.action === "service/create_auth") {
            const call_ref = await app.callFunction({
                name: "get_corp_info",
                data: {
                    "auth_code": body.attributes.auth_code
                }
            });
            console.log(call_ref);
            const company_id = call_ref.result.company_id;
            const permanent_code = call_ref.result.permanent_code;
            delete call_ref.result.company_id;
            delete call_ref.result.permanent_code;
            db.collection("companies").add({
                "_id": company_id,
                "permanent_code": permanent_code,
                "attributes": call_ref.result,
                "created_at": new Date().format("yyyy-MM-dd hh:mm:ss")
            });
        } else if (body.action === "service/cancel_auth") {
            db.collection("companies").doc(body.attributes.company_id).remove();
        }
    }
    return "success";
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