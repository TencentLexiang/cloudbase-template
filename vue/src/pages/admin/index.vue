<template>
  <div class="container admin-container">
    <div class="left">
      <div class="font-lg mb" v-if="$auth.currentUser">你好，{{ $auth.currentUser.nickName }}{{ $auth.currentUser.gender === 'MALE' ? '先生' : '女士' }}</div>
      <div class="font-sm mb">欢迎登录【{{ $company.name }}】公司云开发管理后台</div>
      <div class="font-sm mb" v-if="userInfo.name">影响力：{{userInfo.influence}}，积分：{{userInfo.point_total}}</div>
      <a href="javascript:void(0);" class="btn mr" @click="getUserInfo" v-else>获取用户信息</a>
      <a href="javascript:void(0);" class="btn" @click="getEnvFile">获取环境配置文件</a>
    </div>
    <div class="right">
      <div class="mb">
        <a href="https://lexiangla.net/settings" target="_blank">
          <img :src="require('../../assets/img/lx-logo.png')" /> 腾讯乐享
        </a>
      </div>
      <div>
        <a href="https://console.cloud.tencent.com/tcb/env/overview?envId=once-test-3gsc1t9n1093c388" target="_blank">
          <img :src="require('../../assets/img/cloudbase-logo.svg')" width="50" /> 云开发
        </a>
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
      console.log('getUserInfo----', result);
    },
    async getEnvFile() {
      const { result } = await this.$app.callFunction({
        name: 'custom_apis',
        data: {
          method: 'get_env'
        },
      });
      console.log('getEnvInfo----', result);

      let fileText = '';
      Object.keys(result).forEach(key => {
        fileText += `${key}=${result[key]}\n`;
      });
      console.log('file:', '\n', fileText);
      this.download('.env', fileText);
    },
    download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
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
    padding: 6px 40px;
    font-size: 18px;
    color: #fff;
    background-color: hsl(210, 100%, 63%);
    border-radius: 4px;
    display: inline-block;
  }
}
</style>
