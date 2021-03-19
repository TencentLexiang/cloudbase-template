<template>
  <div>
    <div v-for="course in courses" :key="course._id" v-if="course.title" class="lists">
      <router-link :to="`/courses/${course._id}?company_from=${$company.id}`">{{ course.title }}</router-link>
      <div class="mt">
        <span class="font-sm secondary mr">{{ course.staff_id }}</span>
        <span class="font-sm secondary">{{ course.created_at }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courses: [],
    };
  },
  async mounted() {
    const { result } = await this.$app.callFunction({
      name: 'third_course',
      data: {
        method: 'list',
        attributes: {}
      }
    });
    this.courses = result;
    console.log('response', result);
  }
}
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
</style>