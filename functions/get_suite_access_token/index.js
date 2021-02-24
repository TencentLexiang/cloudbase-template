const cloudBase = require('@cloudbase/node-sdk');
const axios = require('axios');

const app = cloudBase.init({});
const db = app.database();

exports.main = async (event, context) => {
    let ref = await db.collection("lx_suites").doc("suite_access_token").get();
    if (ref.data[0] && ref.data[0].created_at + ref.data[0].expires_in + 2400 > new Date().getTime() && !event.refresh) {
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
    return axios.post(process.env.LX_API_URL + "service/get_suite_token",
        {
            "grant_type": "client_credentials",
            "suite_id": process.env.LX_SUITE_ID,
            "suite_secret": process.env.LX_SUITE_SECRET,
            "suite_ticket": suite_ticket
        }).then(function(response) {
            console.log(response.data);
            db.collection("lx_suites").doc("suite_access_token").set({
                "value": response.data.suite_access_token,
                "expires_in": response.data.expires_in,
                "created_at": new Date().getTime()
            });
            return response.data.suite_access_token;
        }
    )
}