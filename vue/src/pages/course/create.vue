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
      const cloudPath = `${this.$company.id}/${randomString()}/`;
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
            const response = await this.$app.callFunction({
              name: 'api_post_course',
              data: {
                file_id: fileID,
                title: "today测试",
                content: "content123",
                category_id: "9c336b789de311e7aed15254002b6735"
              }
            });
            console.log('api_upload_course response', response);
          }
          console.log('uploadFile fileID', fileID);
        }));
      };
    }
  }
};
</script>
