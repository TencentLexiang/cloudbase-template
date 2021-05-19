<template>
  <div class="container admin-container">
    <div class="left">
      <div class="font-lg mb" v-if="$auth.currentUser">你好，{{ $auth.currentUser.nickName }}{{ $auth.currentUser.gender === 'MALE' ? '先生' : '女士' }}</div>
      <div class="font-sm mb">欢迎登录【{{ $company.name }}】公司云开发管理后台</div>
      <div>{{userInfo}}</div>
      <a href="javascript:void(0);" class="btn mr" @click="getUserInfo">获取用户信息</a>
      <a href="https://lexiangla.net/settings" target="_blank" class="btn">进入乐享</a>
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
  data() {
    return {
      userInfo: {},
    };
  },
  methods: {
    async getUserInfo() {
      const { result } = await this.$app.callFunction({
        name: 'custom_apis',
        data: {
          method: 'get_current_staff'
        },
      });
      this.userInfo = result;
      console.log('response----', result);
    }
  },
};
</script>


<style lang="less" scoped>
.admin-container {
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

  .mr {
    margin-right: 20px;
  }

  .btn {
    padding: 10px 50px;
    font-size: 18px;
    color: #fff;
    background-color: hsl(210, 100%, 63%);
    border-radius: 4px;
    display: inline-block;
  }
}
</style>
