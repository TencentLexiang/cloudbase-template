const axios = require('axios');

exports.list = async(attributes, headers) =>
{
    const {target_type, parent_id} = attributes;
    return await axios.get(process.env.LX_API_URL + "v1/categories", {
        "params": {
            target_type, parent_id
        },
        "headers": {
            "StaffID": headers.staff_id,
            "Authorization": "Bearer " + headers.corp_token
        }
    })
    .then((response) => {
        console.log(response.data);
        return response.data;
    })
    .catch((err) => {
        console.log(err.response.data);
        throw new Error(err);
    });
}