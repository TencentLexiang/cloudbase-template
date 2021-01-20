const cloudbase = require('@cloudbase/node-sdk')
const redis = require('redis')
const mysql = require('serverless-mysql')({
    config: {
        host: "192.168.2.77",
        port: 3306,
        database: "forest",
        user: 'forest_web',
        password: 'forest_web'
    }
})


const app = cloudbase.init({})
var db = app.database();

exports.main = async (event, context) => {
    if (event.httpMethod == "POST") {
        const body = JSON.parse(event.body)
        db.collection("suite_callback_logs").add(body)

        console.log(body.action)
        if (body.action == "service/suite_ticket") {
            redis_client = await redis.createClient({
                host: "192.168.2.49",
                port: 6379,
                password: 'edRDs41a9Xhf0ghu'
            })
            await redis_client.setex("suite_ticket", 1200, body.attributes.suite_ticket)
            redis_client.quit()
        } else if (body.action == "service/create_auth") {

            call_res = await app.callFunction({
                name: "get_suite_access_token"
            })

            suite_access_token = call_res.result
            call_res = await app.callFunction({
                name: "get_corp_info",
                data: {
                    "suite_access_token": suite_access_token,
                    "auth_code": body.attributes.auth_code
                }
            })
            let addSqlParams = [call_res.result.data.company_id, call_res.result.data.permanent_code]
            await mysql.query("INSERT INTO companies(id, lexiang_uuid, permanent_code, created_at) VALUES('', ?, ?, now())", addSqlParams)
            mysql.quit()
        } else if (body.action == "service/cancel_auth") {
            let addSqlParams = [body.attributes.company_id]
            await mysql.query("DELETE FROM companies WHERE lexiang_uuid = ?", addSqlParams)
            mysql.quit()
        }
    }
    console.log("success")
    return "success"
};