const axios = require('axios');

exports.list = async(attributes, headers) =>
{
    const {id, with_descendant} = attributes;
    return await axios.get(process.env.LX_API_URL + "v1/contact/department/index", {
        "params": {
            id, with_descendant
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