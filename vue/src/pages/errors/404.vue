<template>
  <div class="container error-container">
    <img :src="require('../../assets/img/404.png')" />
    <div class="tips">很抱歉，您访问的页面不存在</div>
  </div>
</template>

<style lang="less" scoped>
.error-container {
  padding-top: 180px;
  text-align: center;

  img {
    width: 160px;
  }

  .tips {
    margin: 15px 0;
    color: #666;
    font-size: 18px;
  }
}
</style>