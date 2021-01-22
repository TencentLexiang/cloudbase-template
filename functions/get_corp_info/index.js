const axios = require('axios');

exports.main = async (event, context) => {
    const result = axios.post(process.env.LX_API_URL + "service/get_corp_info?suite_access_token=" + event.suite_access_token,
        {
            "auth_code": event.auth_code
        }).then(function(response) {
            return response.data.data;
        }
    );
    return result;
}