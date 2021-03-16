<template>
  <div>
    <input type="file" webkitdirectory @change="onChange" >
  </div>
</template>

<script>
import { lxStorage } from '../../utils';

export default {
  name: 'course-create',
  methods: {
    async onChange($event) {
      const files = $event.target.files;
      console.log('files', files);
      const loginCompanyId = lxStorage.getItem('companyId');
      const cloudPath = loginCompanyId + "/" + new Date().getTime() + "/";
      for (const file of files) {
        const { fileID } = await this.$app.uploadFile({
          // 云存储的路径
          cloudPath: cloudPath + file.webkitRelativePath,
          // 需要上传的文件，File 类型
          filePath: file
        });
        console.log('fileID--', fileID)
      }
    }
  }
};
</script>
