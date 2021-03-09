<template>
  <div>show-course</div>
</template>

<script>

export default {
  name: 'showCourse',
  async mounted() {
    const url = await this.$app.callFunction({
      name: "api_get_course_link",
      data: {
        course_id: this.$route.query.course_id
      }
    }).then(function(response) {
      console.log(response.result);
      return response.result;
    })
    window.location.href = url;
  }
}
</script>


