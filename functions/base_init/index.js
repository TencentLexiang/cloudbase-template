const { init } = require('@cloudbase/manager-node');
const CloudBase = require('@cloudbase/manager-node')


const app = cloudBase.init({
    envId: process.env.ENV_ID
});
const db = app.database();

exports.main = async (event, context) => {
    // 只执行一次，无论成功与否
    const init_config = await db.collection("lx_suites").doc("init_config").get().then(function(res) {
        return res.data[0].done;
    });
    if (init_config.done) {
        return;
    }
    await db.collection("lx_suites").doc("init_config").update({done: 1});

    const api_domain = await app.commonService().call({
        Action: 'DescribeCloudBaseGWService',
        Param: {
            ServiceId: process.env.ENV_ID
        }
    })
    .then((res) => {
        return res.DefaultDomain;
    });

    const page_doamin = await app.commonService().call({
        Action: 'DescribeStaticStore',
        Param: {
            EnvId: process.env.ENV_ID
        }
    })

    let init_attributes = {
        "redirect_domain": page_doamin,
        "manage_url": "https://" + page_doamin + "/courses?company_id=$COMPANY_ID$",
        "homepage": "https://" + page_doamin + "/home",
        "callback_url": "https://" + api_domain + "/suite_callback",
    };

    await app.callFunction({
        name: "lx_apis",
        data: {
            "method": "init_config",
            "attributes": init_attributes
        }
    });

}