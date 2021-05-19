const cloudBase = require('@cloudbase/node-sdk');

const app = cloudBase.init({
    env: process.env.ENV_ID,
});
const auth = app.auth();
const db = app.database();
let user;
exports.main = async(event, context) => {

    const { userInfo } = await auth.getEndUserInfo();
    user = await db.collection("users").doc(userInfo.customUserId).get().then(function(res) {
        return res.data[0];
    });
    company = await db.collection("companies").doc(user.company_id).get().then(function(res) {
        return res.data[0];
    });
    if (!company || !company.enabled) {
        return {
            "code": 10001,
            "msg": "当前乐享企业未开启应用"
        }
    }

    switch (event.method) {
        case "get_current_staff":
            return get_current_staff();
        case "get_env": 
            return get_env();
    }
}

async function get_current_staff() {
    return await app.callFunction({
        name: "lx_apis",
        data: {
            "method": "staff.show",
            "company_id": user.company_id,
            "staff_id": user.staff_id,
            "attributes": {
                id: user.staff_id
            }
        }
    }).then(function(response) {
        return response.result.data.data.attributes;
    });
}

function get_env() {
    const {ENV_ID, LX_SUITE_ID, LX_SUITE_SECRET, LX_CALLBACK_SECRET, LX_API_URL, LX_AUTH_URL, PERSISTENCE} = process.env;
    return {ENV_ID, LX_SUITE_ID, LX_SUITE_SECRET, LX_CALLBACK_SECRET, LX_API_URL, LX_AUTH_URL, PERSISTENCE};
}