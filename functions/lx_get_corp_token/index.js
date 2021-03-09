const cloudBase = require('@cloudbase/node-sdk');
const axios = require('axios');

const app = cloudBase.init({
    env: process.env.ENV_ID
});
const db = app.database();

exports.main = async (event, context) => {
    const company_id = event.company_id;
    if (!company_id) {
        const companies = await db.collection("companies").get().then(function(response) {
            return response.data;
        });
        for (let i =0; i<companies.length; i++) {
            app.callFunction({
                name: "lx_get_corp_token",
                data: {
                    "company_id": companies[i]._id
                }
            });
        }
        return null;
    }
    let ref = await db.collection("lx_suites").doc("company_" + company_id + "_token").get();
    if (ref.data[0] && ref.data[0].created_at + ref.data[0].expires_in + 2400 > new Date().getTime() && !event.refresh) {
        // corp_token DB存在且距离过期还有40分钟以上，可直接取出使用
        return ref.data[0].value;
    }

    const company = await db.collection("companies").doc(company_id).get().then(function(response) {
        return response.data[0];
    });

    const suite_access_token = await app.callFunction({
        name: "lx_get_suite_access_token"
    }).then(function(response) {
        return response.result;
    });

    return axios.post(process.env.LX_API_URL + "service/get_corp_token?suite_access_token=" + suite_access_token,
        {
            "grant_type": "client_credentials",
            "company_id": company_id,
            "permanent_code": company.permanent_code
        }).then(function(response) {
            console.log(response.data);
            db.collection("lx_suites").doc("company_" + company_id + "_token").set({
                "value": response.data.access_token,
                "expires_in": response.data.expires_in,
                "created_at": new Date().getTime()
            });
            return response.data.access_token;
        }
    )
}