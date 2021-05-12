<template>
  <div class="container admin-container">
    <div>xxx公司</div>
    <div>xxx</div>
    <el-button type="primary" @click="goToLx">进入乐享 <i class="el-icon-right"></i></el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
    };
  },
  methods: {
    goToLx() {

    }
  },
};
</script>

<style lang="less" scoped>
.admin-container {
  text-align: center;
  font-size: 26px;
  padding-top: 100px;
}
</style>
