const axios = require('axios');

exports.list = async(attributes, headers) =>
{
    const {per_page, page, department_id, fetch_child} = attributes;
    return await axios.get(process.env.LX_API_URL + "v1/contact/user/list", {
        "params": {
            per_page, page, department_id, fetch_child
        },
        "headers": {
            "Authorization": "Bearer " + headers.corp_token
        }
    })
    .then((response) => {
        console.log(response.data);
        let {status, data} = response;
        return {status, data};
    })
    .catch((err) => {
        console.log(err.response.data);
        let {status, data} = err.response;
        return {status, data};
    });
}