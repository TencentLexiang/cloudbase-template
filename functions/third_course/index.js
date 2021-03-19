const cloudBase = require('@cloudbase/node-sdk');
const moment = require('moment-timezone');

const app = cloudBase.init({
    env: process.env.ENV_ID
});
const auth = app.auth();
const db = app.database();
let user;

exports.main = async(event, context) => {
    const { userInfo } = await auth.getEndUserInfo();
    user = await db.collection("users").doc(userInfo.customUserId).get().then(function(res) {
        return res.data[0];
    });
    let func = eval(event.method)
    return func(event.attributes ? event.attributes : {});
}

async function store(attributes) {
    const file_id = attributes.file_id;
    const created_at = moment().tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss');
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

    let lx_course = await app.callFunction({
        name: "lx_course",
        data: {
            "method": "store",
            "company_id": user.company_id,
            "staff_id": user.staff_id,
            "attributes": {
                "title": attributes.title,
                "content": attributes.content,
                "category_id": attributes.category_id,
                "video_link": process.env.PAGE_URL + "/courses/" + course.id + "/preview?company_id=" + user.company_id
            }
        }
    }).then(function(response) {
        return response.result;
    });

    await db.collection("courses").doc(course.id).update({
        "lx_id": lx_course.data.id
    });

    return {
        id: course.id
    };
}

async function show(attributes) {
    const id = attributes.id;
    return await db.collection("courses").where({
        "_id": id,
        "company_id": user.company_id
    }).get().then(function(res) {
        return res.data[0];
    });
}

async function list(attributes) {
    const page = attributes.page ? attributes.page : 1;
    const limit = attributes.limit ? attributes.limit : 20;
    return await db.collection("courses").where({
        "company_id": user.company_id
    }).orderBy("created_at", "desc").skip((page - 1) * limit).limit(limit).get().then(function(res) {
        return res.data;
    });
}

async function preview(attributes) {
    const id = attributes.id;
    let course = await db.collection("courses").where({
        "_id": id,
        "company_id": user.company_id
    }).get().then(function(res) {
        return res.data[0];
    });
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

    const course = await db.collection("courses").where({
        "_id": attributes.id,
        "company_id": user.company_id
    }).get().then(function(res) {
        return res.data[0];
    });
    if (course) {
        await app.deleteFile({
            fileList: [course.file_id]
        });

        await app.callFunction({
            name: "lx_course",
            data: {
                "method": "destroy",
                "company_id": user.company_id,
                "staff_id": user.staff_id,
                "attributes": {
                    "id": course.lx_id
                }
            }
        });
        await db.collection("courses").where({
            "company_id": user.company_id,
            "_id": course._id
        }).remove();
    }
}

async function getCategories(attributes) {
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
    const {parent_id} = attributes;
    if (!attributes.add_only) {
        await db.collection("course_categories")
            .where({
                is_hidden: 1
            })
            .remove();
    }
    let categories = await app.callFunction({
        name: "lx_category",
        data: {
            "method": "list",
            "company_id": user.company_id,
            "staff_id": user.staff_id,
            "attributes": {
                "target_type": 'course',
                parent_id
            }
        }
    }).then(function(response) {
        return response.result;
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
                is_hidden: 1
            });
            if (categories.data[i].meta.children_count > 0) {
                await refreshCategories({
                    parent_id: categories.data[i].id,
                    add_only: 1
                });
            }
        }
        await db.collection("course_categories").add(collection);
        if (!attributes.add_only) {
            await db.collection("course_categories")
                .where({
                    is_hidden: db.command.neq(1)
                })
                .remove();
            await db.collection("course_categories")
                .where({ is_hidden: 1 })
                .update({
                    is_hidden: 0
                });
        }
    }
    
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