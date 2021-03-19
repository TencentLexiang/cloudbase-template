const cloudBase = require('@cloudbase/node-sdk');
const axios = require('axios');

const app = cloudBase.init({
    env: process.env.ENV_ID
});

let staff_id;
let corp_token;

exports.main = async(event, context) => {
    staff_id = event.staff_id;

    corp_token = await app.callFunction({
        name: "lx_get_corp_token",
        data: {
            "company_id": event.company_id
        }
    }).then(function(response) {
        return response.result;
    });

    let func = eval(event.method)
    return func(event.attributes);
}

async function list(attributes)
{
    const {target_type, parent_id} = attributes;
    return await axios.get(process.env.LX_API_URL + "v1/categories",
        {
            params: {
                target_type, parent_id
            },
            headers: {
                "StaffID": staff_id,
                "Authorization": "Bearer " + corp_token
            }
        }).then(function(response) {
            console.log(response.data);
            return response.data;
        }
    );
}