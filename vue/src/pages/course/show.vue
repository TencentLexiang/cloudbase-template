<template>
  <div>show-course</div>
</template>

<script>

export default {
  name: 'course-show',
  async mounted() {
    const { courseId } = this.$route.params;
    const { result } = await this.$app.callFunction({
        name: 'third_course',
        data: {
          method: "getLink",
          attributes: {
            id: courseId
          }
        }
      });
    window.location.href = result;
  }
}
</script>


