const axios = require('axios');

exports.main = (event, context) => {
    return axios.post(process.env.LX_API_URL + "service/get_corp_info?suite_access_token=" + event.suite_access_token,
        {
            "auth_code": event.auth_code
        }).then(function(response) {
            return response.data.data;
        }
    );
}