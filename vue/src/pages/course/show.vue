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
        method: "preview",
        attributes: {
          id: courseId
        }
      }
    });
    console.log('courseId && result', courseId, result);
    courseId && result ? window.location.href = result : null;
  }
}
</script>


