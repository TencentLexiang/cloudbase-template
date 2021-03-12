<template>
  <div>show-course</div>
</template>

<script>

export default {
  name: 'course-show',
  async mounted() {
    const { courseId } = this.$route.params;
    const { result } = await this.$app.callFunction({
      name: 'api_get_course_link',
      data: {
        course_id: courseId
      }
    });
    window.location.href = result;
  }
}
</script>


