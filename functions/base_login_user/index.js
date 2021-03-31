const cloudBase = require('@cloudbase/node-sdk');
const moment = require('moment-timezone');

const app = cloudBase.init({
    env: process.env.ENV_ID,
    credentials: require("./tcb_custom_login_key.json")
});
const db = app.database();

exports.main = async(event, context) => {
    let call_ref = await app.callFunction({
        name: "lx_apis",
        data: {
            "method": "get_user_info",
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
    let company = await db.collection("companies").doc(user_info.company_id).get().then(function(res) {
        return res.data[0];
    });
    if (!company || !company.enabled) {
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
    }).get().then(function(res) {
        return res.data[0];
    });
    let user_id;
    if (!user) {
        const res = await db.collection("users").add({
            "staff_id": user_info.staff_id,
            "company_id": user_info.company_id,
            "attributes": attributes,
            "created_at": moment().tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss')
        });
        user_id = res.id
    } else {
        await db.collection("users").doc(user._id).update({
            "attributes": attributes
        });
        user_id = user._id;
    }

    let company_attributes = company.attributes;
    company_attributes.id = user_info.company_id;

    return {
        "code": 0,
        "msg": "ok",
        "data": {
            "ticket": app.auth().createTicket(user_id, {
                refresh: 6 * 3600 * 1000,
                expire: 12 * 3600 * 1000
            }),
            "staff_attributes": attributes,
            "company_attributes": company_attributes,
        }
    };
}