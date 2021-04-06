const axios = require('axios');

exports.store = async(attributes, headers) => {
    return await axios.post(process.env.LX_API_URL + "v1/courses", {
        "data": {
            "type": "course",
            "attributes": {
                "title": attributes.title,
                "content": attributes.content,
                "media_type": attributes.media_type,
                "target_users": attributes.target_users,
                "video_link": attributes.video_link
            },
            "relationships": {
                "category": {
                    "data": {
                        "type": "category",
                        "id": attributes.category_id
                    }
                }
            }
        }
    }, {
        "headers": {
            "Content-Type": "application/vnd.api+json",
            "StaffID": headers.staff_id,
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

exports.destroy = async(attributes, headers) => {
    return await axios.delete(process.env.LX_API_URL + "v1/courses/" + attributes.id, {
        "headers": {
            "StaffID": headers.staff_id,
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

exports.show = async(attributes, headers) => {
    return await axios.get(process.env.LX_API_URL + "v1/courses/" + attributes.id, {
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