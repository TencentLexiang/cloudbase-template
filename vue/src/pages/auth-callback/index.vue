<template>
  <div class="container auth-callback-container">正在登录中...</div>
</template>

<script>
import { lxStorage } from '../../utils';

export default {
  name: 'auth-callback',
  async mounted() {
    const { code } = this.$route.query;
    const intendUrl = sessionStorage.getItem('intendUrl');
    const response = await this.$app.callFunction({
      name: 'base_login_user',
      data: {
        code
      }
    });
    const { ticket, staff_attributes, company_attributes } = response.result.data;
    console.log('base_login_user callback', response.result.data);
    await this.$auth.customAuthProvider().signIn(ticket);

    lxStorage.setItem('company', JSON.stringify(company_attributes.auth_corp_info));

    const user = this.$auth.currentUser;
    user.update({
      nickName: staff_attributes.name,
      gender: staff_attributes.gender == 0 ? 'UNKNOWN' : staff_attributes.gender == 1 ? 'MALE' : 'FEMALE',
      avatarUrl: staff_attributes.avatar,
    }).then(() => {
      if (intendUrl) {
        window.location.href = decodeURIComponent(intendUrl);
      } else {
        this.$router.push('/');
      }
    });
  }
}
</script>

<style lang="less" scoped>
.auth-callback-container {
  text-align: center;
  padding-top: 100px;
  font-size: 26px;
}
</style>
