<template>
  <div class="header-container">
    <div class="container">
      <img :src="require('../assets/img/logo.svg')" height="36" />
      <span class="text">&nbsp;Once</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header-container {
  padding: 20px 0;
  margin-bottom: 50px;
  border-bottom: 1px solid #eee;
  
  .text {
    color: #008dfc;
    font-size: 26px;
  }
}
</style>
