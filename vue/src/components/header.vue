<template>
  <div v-if="isShow">
    <el-menu :default-active="activeIndex" mode="horizontal">
      <el-menu-item>
        <span class="logo">
          <img src="../assets/img/logo.png" width="36" />&nbsp;腾讯乐享
        </span>
      </el-menu-item>
      <el-menu-item index="home" @click="onClick(`/?company_id=${$company.id}`)">
        首页
      </el-menu-item>
      <el-menu-item index="adminIndex" @click="onClick(`/admin?company_id=${$company.id}`)">
        管理后台
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  computed: {
    activeIndex() {
      return this.$route.name;
    },
    isShow() {
      return true;
      // return ['home', 'adminIndex'].indexOf(this.$route.name) !== -1;
    }
  },
  methods: {
    onClick(path) {
      this.$router.push(path);
    },
  }
};
</script>

<style lang="less" scoped>
.logo {
  color: #303133;
  font-size: 20px;
}
</style>
