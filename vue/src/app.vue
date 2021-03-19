<template>
  <div>
    <page-header></page-header>
    <router-view></router-view>
  </div>
</template>

<script>
import pageHeader from './components/header.vue';

export default {
  name: 'app',
  components: { pageHeader },
};
</script>

<style lang="less">
@import './assets/less/common.less';
</style>