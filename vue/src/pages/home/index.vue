<template>
  <div class="container welcome-container">
    <div class="left">
      <div class="font-lg">可一键部署的第三方应用框架</div>
      <div class="font-sm">集成所有乐享应用接口、通讯录接口、凭证接口、单点登录流程</div>
      <div class="font-sm">开发者只需关注业务而无需关注接口细节</div>
    </div>
    <div class="right">
      <div class="mb">
        <img :src="require('../../assets/img/lx-logo.png')" /> 腾讯乐享
      </div>
      <div>
        <img :src="require('../../assets/img/cloudbase-logo.svg')" width="50" /> 腾讯云开发
      </div>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less" scoped>
.welcome-container {
  display: flex;
  line-height: 2;

  .font-lg {
    font-size: 30px;
  }

  .font-sm {
    font-size: 18px;
    color: #666;
  }

  .left {
    flex: 2;
  }

  .right {
    flex: 1;
    font-size: 24px;
  }

  .mb {
    margin-bottom: 20px;
  }
}
</style>
