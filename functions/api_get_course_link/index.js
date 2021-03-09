const cloudBase = require('@cloudbase/node-sdk');

const app = cloudBase.init({
    env: process.env.ENV_ID
});
const auth = app.auth();
const db = app.database();

exports.main = async(event, context) => {
    const course_id = event.course_id;
    const { userInfo } = await auth.getEndUserInfo();

    let user = await db.collection("users").doc(userInfo.customUserId).get();

    const company_id = user.data[0].company_id;

    let course = await db.collection("courses").where({
        "_id": course_id,
        "company_id": company_id
    }).get();
    if (course.data) {
        return await app.getTempFileURL({
            fileList: [course.data[0].file_id]
        })
        .then((res) => {
            // fileList 是一个有如下结构的对象数组
            // [{
            //    fileID: 'cloud://webtestjimmy-5328c3.7765-webtestjimmy-5328c3-1251059088/腾讯云.png', // 文件 ID
            //    tempFileURL: '', // 临时文件网络链接
            //    maxAge: 120 * 60 * 1000, // 有效期
            // }]
            console.log(res.fileList);
            return res.fileList[0].tempFileURL;
        });
    }
}