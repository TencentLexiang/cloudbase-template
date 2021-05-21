const cloudBase = require('@cloudbase/node-sdk');

const app = cloudBase.init({
    env: process.env.ENV_ID,
});
const auth = app.auth();
const db = app.database();
let user;
let company;
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

    const query = event.query ? event.query: {};
    switch (event.method) {
        case "get_current_staff":
            return get_current_staff();
        case "get_env": 
            return get_env();
        case "sync_contact":
            return sync_contact();
        case "get_departments":
            return get_departments(query);
        case "get_users":
            return get_users(query);
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

function get_departments(query) {
    return db.collection("departments").where({"parent_id": query.parent_id ? query.parent_id : 0}).where({"company_id": company._id, "version": company.contact_version}).get().then(function(result) {
        return result.data;
    });
}

function get_users(query) {
    const page = query.page ? query.page : 1;
    const limit = query.limit ? query.limit : 50;
    const department_user = db.collection("department_user")
        .where({"department_lx_id": query.department_id ? query.department_id : 1})
        .where({"company_id": company._id, "version": company.contact_version})
        .orderBy("staff_id", "asc")
        .skip((page - 1) * limit)
        .limit(limit)
        .get().then(function(result) {
        return result.data;
    });
    let staff_ids = [];
    for (let i = 0; i < department_user.length; i++) {
        user.push(department_user[i].staff_id);
    }
    return db.collection("users").where({"staff_id": db.command.in(staff_ids)}).where({"company_id": company._id}).get().then(function(result) {
        return result.data;
    });
}