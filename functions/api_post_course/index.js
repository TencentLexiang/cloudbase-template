const cloudBase = require('@cloudbase/node-sdk');

const app = cloudBase.init({
    env: process.env.ENV_ID
});
const auth = app.auth();
const db = app.database();

exports.main = async(event, context) => {
    const file_id = event.file_id;
    const { userInfo } = await auth.getEndUserInfo();

    const user = await db.collection("users").doc(userInfo.customUserId).get();

    const created_at = new Date().format("yyyy-MM-dd hh:mm:ss");
    const course = await db.collection("courses").add({
        "company_id": user.data[0].company_id,
        "staff_id": user.data[0].staff_id,
        "file_id": file_id,
        "title": event.title,
        "content": event.content,
        "lx_category_id": event.category_id,
        "lx_category_name": event.category_name,
        "created_at": created_at,
        "updated_at": created_at
    });

    let lx_course = await app.callFunction({
        name: "lx_post_course",
        data: {
            "company_id": user.data[0].company_id,
            "staff_id": user.data[0].staff_id,
            "attributes": {
                "title": event.title,
                "content": event.content,
                "category_id": event.category_id,
                "video_link": process.env.PAGE_URL + "/courses/" + course.id + "?company_id=" + user.data[0].company_id
            }
        }
    }).then(function(response) {
        return response.result;
    });

    await db.collection("courses").doc(course.id ).update({
        "lx_id": lx_course.data.id
    });

    return {
        "code": 0,
        "msg": "ok",
        "data": {
            course_id: course.id
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