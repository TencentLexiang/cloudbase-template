const axios = require('axios');

exports.show = async(attributes, headers) =>
{
    return await axios.get(process.env.LX_API_URL + "v1/staffs/" + attributes.id, {
        "params": {
            "fields[staff]": attributes.fields ? attributes.fields : "influence,point_total"
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