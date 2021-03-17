<template>
  <div>
    <input type="file" webkitdirectory @change="onChange" >
  </div>
</template>

<script>
import { randomString, arrReduceWidthNumber } from '../../utils';

export default {
  name: 'course-create',
  methods: {
    async onChange($event) {
      const files = $event.target.files;
      const cloudPath = `${this.$company.id}/${randomString()}${new Date().format('yyyyMMddhhmmss')}`;
      console.log('files & cloudPath', files, cloudPath);

      let hasIndexFile = false;
      files.forEach(file => {
        if (/^[^\/]+\/index.html$/.test(file.webkitRelativePath)) {
          hasIndexFile = true;
        }
      });
      if (!hasIndexFile) {
        alert('根目录没有index.html文件');
        return;
      }

      const filesReduce = arrReduceWidthNumber(Object.values(files), 5);
      let indexFileId = '';
      console.log('filesReduce', filesReduce);

      for (const files of filesReduce) {
        console.log('fiels', files)
        await Promise.all(Object.keys(files).map(async (key) => {
          const file = files[key];
          const { fileID } = await this.$app.uploadFile({
            // 云存储的路径
            cloudPath: cloudPath + file.webkitRelativePath,
            // 需要上传的文件，File 类型
            filePath: file
          });
          if (/^[^\/]+\/index.html$/.test(file.webkitRelativePath)) {
            indexFileId = fileID;
          }
          console.log('uploadFile fileID', fileID);
        }));
      };

      const id = await this.$app.callFunction({
        name: 'third_course',
        data: {
          method: "store",
          attributes: {
            file_id: indexFileId,
            title: "today测试",
            content: "content123",
            category_id: "9c336b789de311e7aed15254002b6735"
          }
        }
      }).then(function(res) {
        return res.result.id;
      });

      await this.$app.callFunction({
        name: 'third_course',
        data: {
          method: "show",
          attributes: {
            id: id
          }
        }
      });

      await this.$app.callFunction({
        name: 'third_course',
        data: {
          method: "get_link",
          attributes: {
            id: id
          }
        }
      });

      await this.$app.callFunction({
        name: 'third_course',
        data: {
          method: "index"
        }
      });

      console.log('api_upload_course response', response);
    }
  }
};
</script>
