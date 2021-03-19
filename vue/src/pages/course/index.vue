<template>
  <div>
    <el-button type="primary" @click="onCreate">创建课件</el-button>
    <div v-for="(course, index) in courses" :key="course._id" v-if="course.title" class="lists" ref="courses">
      <router-link :to="`/courses/${course._id}/preview?company_from=${$company.id}`">{{ course.title }}</router-link>
      <div class="font-sm secondary mt">
        <span class="mr">{{ course.staff_id }}</span>
        <span class="mr">{{ course.created_at }}</span>
        <router-link :to="`/courses/${course._id}/preview?company_from=${$company.id}`" class="mr">预览</router-link>
        <a href="javascript:void(0);" @click="onDestory(course._id, index)">删除</a>
      </div>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :hide-on-single-page="true"
      :page-size="limit"
      :total="total"
      @current-change="onPageChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courses: [],
      limit: 20,
      total: 0,
    };
  },
  async mounted() {
    this.onPageChange();
  },
  methods: {
    async onPageChange(page) {
      const { result } = await this.$app.callFunction({
        name: 'third_course',
        data: {
          method: 'list',
          attributes: {
            page: page || this.$route.query.page || 1,
            limit: this.limit,
          }
        }
      });
      this.courses = result.data;
      this.total = result.total;
      page ? this.$router.push(`/courses?page=${page}&company_from${this.$company.id}`) : null;
    },
    async onDestory(id, index) {
      if (confirm('你确定删除吗？')) {
        await this.$app.callFunction({
          name: 'third_course',
          data: {
            method: 'destroy',
            attributes: {
              id,
            },
          },
        });
        this.$refs.courses[index].remove();
      }
    },
    onCreate() {
      this.$router.push(`/courses/create?company_from=${this.$company.id}`);
    }
  },
};
</script>

<style lang="less" scoped>
.lists {
  padding: 10px;
  border-bottom: 1px solid #e1e1e1;

  .mt {
    margin-top: 10px;
  }

  .mr {
    margin-right: 15px;
  }
}

.el-button {
  margin: 10px;
}

.el-pagination {
  margin-top: 10px;
  text-align: center;
}
</style>