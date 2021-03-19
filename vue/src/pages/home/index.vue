<template>
  <div>home123</div>
</template>

<script>

export default {
  name: 'home',
  async mounted() {
    await this.$app.callFunction({
      name: 'third_course',
      data: {
        method: 'getCategories',
        attributes: {}
      }
    });
     await this.$app.callFunction({
      name: 'third_course',
      data: {
        method: 'refreshCategories',
        attributes: {}
      }
    });
  }
}
</script>


