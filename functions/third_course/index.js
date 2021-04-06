const cloudBase = require('@cloudbase/node-sdk');
const moment = require('moment-timezone');

const app = cloudBase.init({
    env: process.env.ENV_ID
});
const auth = app.auth();
const db = app.database();
let user;
let company;

exports.main = async(event, context) => {
    const { userInfo } = await auth.getEndUserInfo();
    user = await db.collection("users").doc(userInfo.customUserId).get().then(function(res) {
        return res.data[0];
    });
    company = await db.collection("companies").doc(user.company_id).get().then(function(res) {
        return res.data[0];
    });
    if (!company || !company.enabled) {
        return {
            "code": 10001,
            "msg": "当前乐享企业未开启应用"
        }
    }

    let func = eval(event.method)
    return func(event.attributes ? event.attributes : {});
}

async function store(attributes) {
    const file_id = attributes.file_id;
    const created_at = moment().tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss');
    const preview_url = attributes.preview_url;
    const course = await db.collection("courses").add({
        "company_id": user.company_id,
        "staff_id": user.staff_id,
        "file_id": file_id,
        "file_path": attributes.file_path,
        "title": attributes.title,
        "content": attributes.content,
        "lx_category_id": attributes.category_id,
        "lx_category_name": attributes.category_name,
        "created_at": created_at,
        "updated_at": created_at
    });

    return await app.callFunction({
        name: "lx_apis",
        data: {
            "method": "course.store",
            "company_id": user.company_id,
            "staff_id": user.staff_id,
            "attributes": {
                "title": attributes.title,
                "content": attributes.content,
                "category_id": attributes.category_id,
                "media_type": 5,
                "video_link": preview_url.replace(/\{COURSE_ID\}/, course.id).replace(/\{COMPANY_ID\}/, user.company_id)
            }
        }
    }).then((res) => {
        if (res.result.status == 201) {
            db.collection("courses").doc(course.id).update({
                "lx_id": res.result.data.data.id
            });
            return {
                "code": 0,
                "msg": "ok",
                "id": course.id
            };
        } else {
            db.collection("courses").doc(course.id).remove();
            return {
                "code": 1,
                "msg": "fail"
            };
        } 
    });
}

async function show(attributes) {
    const id = attributes.id;
    return await db.collection("courses")
    .where({
        "_id": id,
        "company_id": user.company_id
    })
    .get()
    .then(function(res) {
        let result = res.data[0];
        result.code = 0;
        result.msg = "ok";
        return result;
    });
}

async function list(attributes) {
    const page = attributes.page ? attributes.page : 1;
    const limit = attributes.limit ? attributes.limit : 20;
    return {
        code: 0,
        msg: "ok",
        total: await db.collection("courses").where({
            "company_id": user.company_id
        }).count().then(function(res) {
            return res.total;
        }),
        data: await db.collection("courses").where({
            "company_id": user.company_id
        }).orderBy("created_at", "desc").skip((page - 1) * limit).limit(limit).get().then(function(res) {
            return res.data;
        })
    };
}

async function preview(attributes) {
    const course = await show(attributes);
    if (course) {
        const course_link = await app.getTempFileURL({
            fileList: [course.file_id]
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
        renameFile(course);
        return course_link;
    }
}

async function destroy(attributes) {
    const course = await show(attributes);
    if (course) {
        await app.callFunction({
            name: "lx_apis",
            data: {
                "method": "course.destroy",
                "company_id": user.company_id,
                "staff_id": user.staff_id,
                "attributes": {
                    "id": course.lx_id
                }
            }
        }).then((res) => {
            if (res.result.status != 404 && res.result.status != 204) {
                throw new Error("乐享素材删除失败");
            }
        });
        await db.collection("courses").where({
            "company_id": user.company_id,
            "_id": course._id
        }).remove();
        await app.deleteFile({
            fileList: [course.file_id]
        });
    }
}

async function askForDestroy(attributes) {
    const course = await show(attributes);
    const res = await app.callFunction({
        name: "lx_apis",
        data: {
            "method": "course.show",
            "company_id": user.company_id,
            "staff_id": user.staff_id,
            "attributes": {
                "id": course.lx_id
            }
        }
    }).then((res) => {
        return res.result.data;
    });
    if (res.data && res.data.relationships && res.data.relationships.classes) {
        return {
            code: 1,
            msg: "素材已关联课程，无法删除，请到乐享平台删除"
        };
    }
    return {
        code: 0,
        msg: "ok"
    }
}

async function getCategories(attributes = {}) {
    const cateogries = await db.collection("course_categories")
        .where({
            company_id: user.company_id,
            is_hidden : 0
        })
        .get().then(function(res) {
            return res.data;
        }
    );
    return list_to_tree(cateogries);
    
}

function list_to_tree(list) {
    var map = {}, node, roots = [], i;
    
    for (i = 0; i < list.length; i += 1) {
      map[list[i].lx_id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }
    
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parent_id !== undefined) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parent_id]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  

async function refreshCategories(attributes) {
    let {parent_id, uuid} = attributes;
    uuid = uuid ? uuid : Math.random().toString(36).substr(2, 10);
    let categories = await app.callFunction({
        name: "lx_apis",
        data: {
            "method": "category.list",
            "company_id": user.company_id,
            "staff_id": user.staff_id,
            "attributes": {
                "target_type": 'course',
                parent_id
            }
        }
    }).then(function(response) {
        return response.result.data;
    });
    if (categories.data.length > 0) {
        let collection = [];
        for (i in categories.data) {
            collection.push({
                company_id: user.company_id,
                lx_id: categories.data[i].id,
                name: categories.data[i].attributes.name,
                parent_id: parent_id,
                children_count: categories.data[i].meta.children_count,
                created_at: moment().tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss'),
                is_hidden: 1,
                version: uuid
            });
            if (categories.data[i].meta.children_count > 0) {
                await refreshCategories({
                    parent_id: categories.data[i].id,
                    looping: 1,
                    version: uuid
                });
            }
        }
        await db.collection("course_categories").add(collection);
        if (!attributes.looping) {
            await db.collection("course_categories")
                .where({
                    company_id: user.company_id,
                    version: db.command.neq(uuid)
                })
                .remove();
            await db.collection("course_categories")
                .where({ 
                    company_id: user.company_id,
                    is_hidden: 1, 
                    version: uuid 
                })
                .update({
                    is_hidden: 0
                });
        }
    } else {
        await db.collection("course_categories").remove();
    }
    return getCategories();
}

async function renameFile(course) {
    const old_file_id = course.file_id;
    const file_content = await app.downloadFile({
        fileID: old_file_id
    })
    .then((res) => {
        return res.fileContent;
    });
    let new_file_path = course.file_path;
    console.log(new_file_path);
    new_file_path = new_file_path.replace(/\/[^.\/]+.html$/, "/" + Math.random().toString(36).substr(2, 10) + ".html");
    console.log(new_file_path);
    const new_file_id = await app.uploadFile({
        cloudPath: new_file_path,
        fileContent: file_content
    })
    .then((res) => {
        return res.fileID;
    });
    await db.collection("courses").doc(course._id).update({
        "file_id": new_file_id,
        "file_path": new_file_path
    });
    setTimeout(function() {
        app.deleteFile({
            fileList: [old_file_id]
        });
    }, 10*1000);
}