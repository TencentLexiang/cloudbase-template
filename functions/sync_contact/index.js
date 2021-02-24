const axios = require('axios');
const cloudBase = require('@cloudbase/node-sdk');
const uuid = require('uuid');

const app = cloudBase.init({});
const db = app.database();

exports.main = async(event, context) => {
    async_contact(event.company_id, uuid.v4());
}

async function async_contact(company_id, version) {
    // 获取 corp_token
    const corp_token = await app.callFunction({
        name: "get_corp_token",
        data: {
            "company_id": company_id
        }
    }).then(function(response) {
        return response.result;
    });
    // 同步部门
    await axios.get(process.env.LX_API_URL + "v1/contact/department/index?access_token=" + corp_token)
        .then(function(response) {
            if (response.data.code == 0) {
                addDepartmentsToDB([response.data.data], company_id, version);
            }
        }
    )

    // 同步成员
    let page = 1;
    while (page) {
        await axios.get(process.env.LX_API_URL + "v1/contact/user/list?department_id=1&fetch_child=1&per_page=2000&page=" + page + "&access_token=" + corp_token)
            .then(function(response) {
                if (response.data.code == 0) {
                    for (let i = 0; i < response.data.user_list.length; i++) {
                        addUserToDB(response.data.user_list[i], company_id, version);
                    }
                }
                if (response.data.has_more) {
                    page++;
                } else {
                    page = 0;
                }
            }
        )
    }
    
    // 检查新version
    let ok = 1; // checkDepartment();
    if (ok) {
        db.collection('companies').where({'_id': company_id}).update({"contact_version": version});
        db.collection("departments").where({"company_id": company_id, "version": db.command.neq(version)}).remove();
        db.collection("department_user").where({"company_id": company_id, "version": db.command.neq(version)}).remove();
    } else {
        db.collection("departments").where({"company_id": company_id, "version": version}).remove();
        db.collection("department_user").where({"company_id": company_id, "version": version}).remove();
        // 上报同步失败
    }
}

function addDepartmentsToDB(departments, company_id, version) {
    if (!departments) {
        return null;
    }

    for(let i = 0; i < departments.length; i++) {
        db.collection("departments").add({
            "lx_id": departments[i].id,
            "company_id": company_id,
            "name": departments[i].name,
            "parent_id": departments[i].parent_id,
            "path": departments[i].path,
            "order": departments[i].order,
            "version": version
        });
        addDepartmentsToDB(departments[i].children, company_id, version);
    }
}

function addUserToDB(user, company_id, version) {
    let staff_id = user.staff_id;
    db.collection("users").where({"company_id": company_id, "staff_id": staff_id}).get().then(function(response) {
        if (response.data[0]) {
            // db.collection("users").doc(response.data[0]._id).update({
            //     attributes: {}
            // });
        } else {
            db.collection("users").add({
                "company_id": company_id,
                "staff_id": staff_id,
                "created_at": new Date().format("yyyy-MM-dd hh:mm:ss"),
                "attributes": {}
            });
        }
    });
    
    for(let i = 0; i < user.departments.length; i++) {
        db.collection("department_user").add({
            "company_id": company_id, 
            "staff_id": staff_id, 
            "department_id": user.departments[i].id,
            "version": version
        });
    }
}

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                  //小时
        "m+" : this.getMinutes(),                //分
        "s+" : this.getSeconds(),                //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()            //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}