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

    const { code } = this.$route.query;
    const response = await axios.get('https://todayapi.lexiangla.net/login_user', {
      params: {
        code,
      },
    });
    const result = await auth.customAuthProvider().signIn(response.data.data.ticket);
    console.log(result);
    const user = auth.currentUser;
    const r = this.$router;
    user.update({
      nickName: response.data.data.staff_attributes.name,
      gender: response.data.data.staff_attributes.gender == 0 ? "UNKNOWN" : response.data.data.staff_attributes.gender == 1 ? "MALE" : "FEMALE",
      avatarUrl: response.data.data.staff_attributes.avatar,
    }).then(function() {
      r.push('/home');
    });
  }
}
</script> 
