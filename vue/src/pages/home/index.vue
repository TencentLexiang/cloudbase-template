<template>
  <div class="welcome-container">
    <img :src="require('../../assets/img/banner.png')" />
    <div class="tips">腾讯乐享欢迎您！</div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less" scoped>
.welcome-container {
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  .tips {
    position: absolute;
    top: 40%;
    left: 10%;
    color: #fff;
    font-size: 40px;
  }
}
</style>
