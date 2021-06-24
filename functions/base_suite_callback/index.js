const cloudBase = require('@cloudbase/node-sdk');
const crypto = require('crypto');
const moment = require('moment-timezone');

const app = cloudBase.init({
    env: process.env.ENV_ID
});
const db = app.database();

exports.main = async (event, context) => {
    if (event.httpMethod === "POST") {
        const body = JSON.parse(event.body);
        var hash = crypto.createHash("sha1").update(body.nonce + process.env.LX_CALLBACK_SECRET + body.timestamp);
        const sign = hash.digest('hex');

        if (moment().tz("Asia/Shanghai").valueOf()/1000 - body.timestamp > 5 || sign !== body.sign) {
            return "error";
        }
        console.log(body);

        await db.collection("lx_suite_callback_logs").add(body);

        if (body.action === "service/suite_ticket") {
            await db.collection("lx_suites").doc("suite_ticket").set({
                "value": body.attributes.suite_ticket,
                "expires_in": 1800,
                "created_at": moment().tz("Asia/Shanghai").valueOf()
            });
        } else if (body.action === "service/create_auth") {
            await app.callFunction({
                name: "lx_apis",
                data: {
                    "method": "get_permanent_code",
                    "auth_code": body.attributes.auth_code
                }
            })
            .then(function(response) {
                const company_id = response.result.company_id;
                const permanent_code = response.result.permanent_code;
                delete response.result.company_id;
                delete response.result.permanent_code;
                db.collection("companies").doc(company_id).set({
                    "permanent_code": permanent_code,
                    "attributes": response.result,
                    "created_at": moment().tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss'),
                    "enabled": 1
                });
            });
        } else if (body.action === "service/cancel_auth") {
            await db.collection("companies").doc(body.attributes.company_id).update({
                "enabled": 0
            });
        }
        return "success";
    }
}