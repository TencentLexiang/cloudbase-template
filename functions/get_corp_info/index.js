const axios = require('axios');
const cloudBase = require('@cloudbase/node-sdk');

const app = cloudBase.init({});

exports.main = async(event, context) => {
    const call_ref = await app.callFunction({
        name: "get_suite_access_token"
    });

    return await axios.post(process.env.LX_API_URL + "service/get_corp_info?suite_access_token=" + call_ref.result,
        {
            "auth_code": event.auth_code
        }).then(function(response) {
            console.log(response.data);
            return response.data.data;
        }
    );
}