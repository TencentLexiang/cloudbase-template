const cloudBase = require('@cloudbase/node-sdk');
const moment = require('moment-timezone');
const uuid = require('uuid');


const app = cloudBase.init({
    env: process.env.ENV_ID
});
const db = app.database();

exports.main = async(event, context) => {
    if (!event.company_id) {
        return null;
    }
    async_contact(event.company_id, uuid.v4());
}

async function async_contact(company_id, version) {
    
    // 同步部门
    const departments = await app.callFunction({
        name: "lx_apis",
        data: {
            "method": "department.list",
            "company_id": company_id,
            "attributes": {
                "id": 1,
                "with_descendant": 1
            }
        }
    }).then(function(response) {
        return response.result.data.data;
    });
    await addDepartmentsToDB([departments], company_id, version);

    // 同步成员
    let page = 1;
    while (page) {
        let response = await app.callFunction({
            name: "lx_apis",
            data: {
                "method": "user.list",
                "company_id": company_id,
                "attributes": {
                    "department_id": 1,
                    "fetch_child": 1,
                    "per_page": 100,
                    "page": page
                }
            }
        })
        if (response.result.data.has_more && page < 1) {
            page++;
        } else {
            page = 0;
        }
        for(let i = 0; i < response.result.data.user_list.length; i++) {
            await addUserToDB(response.result.data.user_list[i], company_id, version);
        }
    }
    
    // 检查新version
    let ok = 1; // checkDepartment();
    if (ok) {
        await db.collection('companies').where({'_id': company_id}).update({"contact_version": version});
        await db.collection("departments").where({"company_id": company_id, "version": db.command.neq(version)}).remove();
        await db.collection("department_user").where({"company_id": company_id, "version": db.command.neq(version)}).remove();
    } else {
        await db.collection("departments").where({"company_id": company_id, "version": version}).remove();
        await db.collection("department_user").where({"company_id": company_id, "version": version}).remove();
        // 上报同步失败
    }
}

async function addDepartmentsToDB(departments, company_id, version) {
    if (departments.length == 0) {
        return null;
    }

    for(let i = 0; i < departments.length; i++) {
        await db.collection("departments").add({
            "lx_id": departments[i].id,
            "company_id": company_id,
            "name": departments[i].name,
            "parent_id": departments[i].parent_id,
            "path": departments[i].path,
            "order": departments[i].order,
            "version": version
        });
        await addDepartmentsToDB(departments[i].children, company_id, version);
    }
}

async function addUserToDB(user, company_id, version) {
    let staff_id = user.staff_id;
    let response = await db.collection("users").where({"company_id": company_id, "staff_id": staff_id}).get();
    if (response.data[0]) {
        await db.collection("users").doc(response.data[0]._id).update({
            attributes: {
                "name": user.name,
                "gender": user.gender,
                "avatar": user.avatar
            }
        });
    } else {
        await db.collection("users").add({
            "company_id": company_id,
            "staff_id": staff_id,
            "created_at": moment().tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss'),
            "attributes": {
                "name": user.name,
                "gender": user.gender,
                "avatar": user.avatar
            }
        });
    }
    
    for(let i = 0; i < user.departments.length; i++) {
        await db.collection("department_user").add({
            "company_id": company_id, 
            "staff_id": staff_id, 
            "department_lx_id": user.departments[i].id,
            "version": version
        });
    }
}