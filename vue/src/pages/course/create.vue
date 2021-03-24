<template>
  <div>
    <el-page-header @back="goBack" content="创建课件">
    </el-page-header>
    <div class="container">
      <el-form ref="courseForm" :rules="rules" :model="course" label-width="80px">
        <el-form-item label="课件标题" prop="title">
          <el-input v-model="course.title"></el-input>
        </el-form-item>
        <el-form-item label="课件内容">
          <el-input type="textarea" v-model="course.content"></el-input>
        </el-form-item>
        <el-form-item label="课件分类" prop="category_id">
          <el-select v-model="course.category_id" placeholder="请选择课件分类">
            <el-option
              v-for="category in categories"
              :key="category._id"
              :label="category.name"
              :value="category.lx_id">
            </el-option>
          </el-select>
          <span @click="refreshCategories"><i class="el-icon-refresh-right"></i></span>
        </el-form-item>
        <el-form-item label="上传课件" prop="file_id">
          <input type="file" webkitdirectory @change="onFileUpload" />
          <el-progress :percentage="uploadPercent" v-if="uploadPercent"></el-progress>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="isSubmiting">立即创建</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { randomString, arrReduceWidthNumber } from '../../utils';

export default {
  name: 'course-create',
  data() {
    return {
      course: {
        title: '',
        content: '',
        category_id: '',
        file_id: '',
        file_path: '',
        preview_url: '',
      },
      categories: {},
      files: [],
      rules: {
        title: [
          { required: true, message: '请输入课件标题', trigger: 'blur' },
        ],
        category_id: [
          { required: true, message: '请选择课件分类', trigger: 'change' },
        ],
        file_id: [
          { required: true, message: '请上传课件', trigger: 'change' },
        ]
      },
      isSubmiting: false,
      uploadFileCount: 0,
    };
  },
  computed: {
    uploadPercent() {
      return !this.files.length ? 0 : Number((this.uploadFileCount / this.files.length * 100).toFixed(2));
    },
  },
  mounted () {
    this.getCategories();
  },
  methods: {
    goBack() {
      this.$router.push(`/courses?company_from=${this.$company.id}`);
    },
    async getCategories() {
      const { result } = await this.$app.callFunction({
        name: 'third_course',
        data: {
          method: 'getCategories',
        }
      });
      this.categories = result;
    },
    async refreshCategories() {
      this.isSubmiting = true;
      const { result } = await this.$app.callFunction({
        name: 'third_course',
        data: {
          method: 'refreshCategories',
          attributes: {}
        }
      }).catch(() => this.isSubmiting = false);
      this.categories = result;
      this.isSubmiting = false;
    },
    onFileUpload($event) {
      const files = $event.target.files;
      console.log('files', files);

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
      this.files = files;
      this.course.file_id = 'fake_id';
    },
    async onFileUploading() {
      const cloudPath = `${this.$company.id}/${randomString()}${new Date().format('yyyyMMddhhmmss')}/`;
      const filesReduce = arrReduceWidthNumber(Object.values(this.files), 5);
      console.log('cloudPath', cloudPath);
      console.log('filesReduce', filesReduce);

      for (const files of filesReduce) {
        console.log('files', files)
        await Promise.all(Object.keys(files).map(async (key) => {
          const file = files[key];
          const { fileID } = await this.$app.uploadFile({
            // 云存储的路径
            cloudPath: cloudPath + file.webkitRelativePath,
            // 需要上传的文件，File 类型
            filePath: file
          });
          if (/^[^\/]+\/index.html$/.test(file.webkitRelativePath)) {
            this.course.file_id = fileID;
            this.course.file_path = cloudPath + file.webkitRelativePath;
            this.course.preview_url = `${window._tcbEnv.PAGE_URL || process.env.PAGE_URL}/courses/{COURSE_ID}/preview?company_id={COMPANY_ID}`;
          }
          this.uploadFileCount++;
          console.log('uploadFile fileID', fileID);
        }));
      }
    },
    async onSubmit() {
      this.$refs['courseForm'].validate(async (valid) => {
        if (!valid) return false;

        this.isSubmiting = true;
        await this.onFileUploading();
        const response = await this.$app.callFunction({
          name: 'third_course',
          data: {
            method: 'store',
            attributes: this.course,
          }
        });
        this.isSubmiting = false;
        this.goBack();
        console.log('api_upload_course response', response);
      });
    },
  }
};
</script>

<style lang="less" scoped>
.el-page-header {
  padding: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #dcdfe6;
}
.el-icon-refresh-right {
  font-size: 20px;
  vertical-align: middle;
  margin-left: 5px;
  color: #606266;
}
</style>
