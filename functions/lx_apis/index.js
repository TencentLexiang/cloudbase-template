const cloudBase = require('@cloudbase/node-sdk');
const axios = require('axios');
const moment = require('moment-timezone');
const app = cloudBase.init({
    env: process.env.ENV_ID
});
const db = app.database();
const staff = require('./staff.js');
const category = require('./category.js');
const course = require('./course.js');
const user = require('./user.js');
const department = require('./department.js');

exports.main = async(event, context) => {
    const method = event.method ? event.method : "get_suite_access_token";
    switch (method) {
        case "get_suite_access_token":
            return await get_suite_access_token(event.refresh);
        case "get_corp_token":
            return await get_corp_token(event.company_id, event.refresh);
        case "get_permanent_code":
            return await get_permanent_code(event.auth_code);
        case "get_user_info":
            return await get_user_info(event.code);
        case "init_config":
            return await init_config(event.attributes);
    }
    const staff_id = event.staff_id;
    const corp_token = await get_corp_token(event.company_id);
    const func = eval(method)
    return func(event.attributes ? event.attributes : {}, {staff_id, corp_token});
}

const get_corp_token = async(company_id, refresh = false) => {
    let ref = await db.collection("lx_suites").doc("company_" + company_id + "_token").get();
    if (ref.data[0] && moment().tz("Asia/Shanghai").valueOf() < ref.data[0].created_at + (ref.data[0].expires_in - 2400) * 1000 && !refresh) {
        // corp_token DB存在且距离过期还有40分钟以上，可直接取出使用
        return ref.data[0].value;
    }

    const company = await db.collection("companies").doc(company_id).get().then(function(response) {
        return response.data[0];
    });

    const suite_access_token = await get_suite_access_token();

    return await axios.post(process.env.LX_API_URL + "service/get_corp_token?suite_access_token=" + suite_access_token, {
        "grant_type": "client_credentials",
        "company_id": company_id,
        "permanent_code": company.permanent_code
    })
    .then((response) => {
        console.log(response.data);
        db.collection("lx_suites").doc("company_" + company_id + "_token").set({
            "value": response.data.access_token,
            "expires_in": response.data.expires_in,
            "created_at": moment().tz("Asia/Shanghai").valueOf()
        });
        return response.data.access_token;
    })
    .catch((err) => {
        console.log(err.response.data);
        throw err;
    });
}

const get_suite_access_token = async(refresh = false) => {
    let ref = await db.collection("lx_suites").doc("suite_access_token").get();
    if (ref.data[0] && moment().tz("Asia/Shanghai").valueOf() < ref.data[0].created_at + (ref.data[0].expires_in - 2400) * 1000  && !refresh) {
        // suite_access_token DB存在且距离过期还有40分钟以上，可直接取出使用
        return ref.data[0].value;
    }

    // 重新获取 suite_access_token 并写入DB
    ref = await db.collection('lx_suites')
        .doc("suite_ticket")
        .get();
    if (!ref.data[0]) {
        console.log("suite_ticket is required")
        return "";
    }
    const suite_ticket = ref.data[0].value;
    return await axios.post(process.env.LX_API_URL + "service/get_suite_token", {
        "grant_type": "client_credentials",
        "suite_id": process.env.LX_SUITE_ID,
        "suite_secret": process.env.LX_SUITE_SECRET,
        "suite_ticket": suite_ticket
    })
    .then(function(response) {
        console.log(response.data);
        db.collection("lx_suites").doc("suite_access_token").set({
            "value": response.data.suite_access_token,
            "expires_in": response.data.expires_in,
            "created_at": moment().tz("Asia/Shanghai").valueOf()
        });
        return response.data.suite_access_token;
    })
    .catch((err) => {
        console.log(err.response.data);
        throw err;
    });
}

const get_permanent_code = async(auth_code) => {
    const suite_access_token = await get_suite_access_token();
    return await axios.post(process.env.LX_API_URL + "service/get_permanent_code?suite_access_token=" + suite_access_token, {
        "auth_code": auth_code
    })
    .then(function(response) {
        console.log(response.data);
        return response.data.data;
    })
    .catch((err) => {
        console.log(err.response.data);
        throw err;
    });
}

const get_user_info = async(code) => {
    const suite_access_token = await get_suite_access_token();
    return await axios.post(process.env.LX_API_URL + "service/get_user_info?suite_access_token=" + suite_access_token, {
        "code": code
    })
    .then(function(response) {
        console.log(response.data);
        return response.data.data;
    })
    .catch((err) => {
        console.log(err.response.data);
        throw err;
    });
}

const init_config = async(attributes) => {
    return await axios.post(process.env.LX_API_URL + "service/init", {
        "suite_id": process.env.LX_SUITE_ID,
        "suite_secret": process.env.LX_SUITE_SECRET,
        "redirect_domain": attributes.redirect_domain,
        "manage_url": attributes.manage_url,
        "homepage": attributes.homepage,
        "callback_url": attributes.callback_url,
    })
    .then(function(response) {
        console.log(response.data);
        return true;
    })
    .catch((err) => {
        console.log(err.response.data);
        throw err;
    });
}