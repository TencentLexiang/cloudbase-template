const cloudBase = require('@cloudbase/node-sdk');

const app = cloudBase.init({
    env: process.env.ENV_ID
});
const auth = app.auth();

exports.main = async(event, context) => {
    const user = auth.currentUser;
    console.log(user);

    return "ok";
}