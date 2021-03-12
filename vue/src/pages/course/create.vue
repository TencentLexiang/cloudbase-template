<template>
  <div>
    <input type="file" webkitdirectory @change="onChange" >
  </div>
</template>

<script>
export default {
  name: 'course-create',
  methods: {
    async onChange($event) {
      const files = $event.target.files;
      console.log('files', files);

      const response = await this.$app.callFunction({
        name: 'api_upload_course',
        data: {
          files
        }
      });
      console.log('response', response);

      // files.forEach(file => {
      //   this.$app.uploadFile({
      //     // 云存储的路径
      //     cloudPath: 'dirname/filename',
      //     // 需要上传的文件，File 类型
      //     filePath: file
      //   }).then(res => {
      //     // 返回文件 ID
      //     console.log(res.fileID);
      //   });
      // });
    }
  }
};
</script>
