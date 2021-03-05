<template>
  <div>home123</div>
</template>

<script>

export default {
  name: 'home',
  async mounted() {
    const response = await this.$app.callFunction({
      name: "api_upload_course",
      data: {
      }
    }).then(function(response) {
      console.log(response.result);
      return response.result;
    })
  }
}
</script>


