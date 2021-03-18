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
    // const response = await this.$app.callFunction({
    //   name: 'third_course',
    //   data: {
    //     method: "show",
    //     attributes: {
    //       id: courseId
    //     }
    //   }
    // });
    // console.log('response', response)
    console.log('courseId && result', courseId, result);
    courseId && result ? window.location.href = result : null;
  }
}
</script>


