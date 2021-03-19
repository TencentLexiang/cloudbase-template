<template>
  <div>home123</div>
</template>

<script>

export default {
  name: 'home',
  async mounted() {
    const response = await this.$app.callFunction({
      name: 'third_course',
      data: {
        method: 'getCategories',
        attributes: {}
      }
    });
    const response = await this.$app.callFunction({
      name: 'third_course',
      data: {
        method: 'refreshCategories',
        attributes: {}
      }
    });
  }
}
</script>


