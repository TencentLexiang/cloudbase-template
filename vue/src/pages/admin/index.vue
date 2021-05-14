<template>
  <div class="container admin-container">
    <div>【{{ $company.name }}】公司</div>
    <div>{{ $auth.currentUser.nickName }}</div>
    <el-button type="primary" @click="goToLx">进入乐享 <i class="el-icon-right"></i></el-button>
  </div>
</template>

<script>
export default {
  methods: {
    goToLx() {
      window.open(`https://lexiangla.net/settings/apps?company_from=${this.$company.company_id}`);
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
