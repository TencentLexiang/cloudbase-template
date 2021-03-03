const cloudBase = require('@cloudbase/node-sdk');

const app = cloudBase.init({});
const auth = app.auth();

exports.main = async(event, context) => {
    const user = auth.currentUser;
    console.log(user);

    return "ok";
}