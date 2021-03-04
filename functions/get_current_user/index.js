const cloudBase = require('@cloudbase/node-sdk');

const app = cloudBase.init({
    env: process.env.ENV_ID
});
const auth = app.auth();

exports.main = async(event, context) => {
    let company_id = event.queryStringParameters.company_id
    const user = auth.currentUser;
    console.log(user);
    if (!user) {
        return redirect_to_login(company_id);
    }

    return "ok";
}

function redirect_to_login(company_id = null) {
    let redirect_uri = process.env.PAGE_URL + "/auth-callback";
    let params = "suite_id=" + process.env.LX_SUITE_ID +"&redirect_uri=" + encodeURIComponent(redirect_uri) + "&response_type=code&scope=snsapi_userinfo";
    if (company_id) {
        params = params + "&company_id=" + company_id;
    }
    let login_url = process.env.LX_AUTH_URL + "?" + params;
    return {
        "msg": "Unauthorized",
        "code": 401,
        "data": {
            "login_url": login_url
        }
    }
}