<template>
  <div>auth-callback</div>
</template>

<script>
import cloudbase from '@cloudbase/js-sdk';
import axios from 'axios';

export default {
  name: 'auth-callback',
  async mounted() {
    const app = cloudbase.init({
      env: process.env.ENV_ID
    });
    const auth = app.auth();

    const loginState = await auth.getLoginState();
    const { code } = this.$route.query;
    // 1. 建议登录前检查当前是否已经登录
    if (!loginState) {
      // 2. 请求开发者自有服务接口获取ticket
      const ticket = await axios.get('/login_user', {
        params: {
          code,
        },
      });
      // 3. 登录 CloudBase
      await auth.customAuthProvider().signIn(ticket);
    }
  },
}
</script>
