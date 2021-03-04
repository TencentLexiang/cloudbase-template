<template>
  <div>auth-callback123</div>
</template>

<script>
import cloudbase from '@cloudbase/js-sdk';
import axios from 'axios';

export default {
  name: 'auth-callback',
  async mounted() {
    const app = cloudbase.init({
      env: process.env.ENV_ID,
      region: process.env.REGION
    });
    const auth = app.auth({
      persistence: "local"
    });
    const { code } = this.$route.query;
    const state = this.$route.query.state;
    const response = await axios.get('https://todayapi.lexiangla.net/login_user', {
      params: {
        code,
      },
    });
    await auth.customAuthProvider().signIn(response.data.data.ticket);
    const user = auth.currentUser;
    const r = this.$router;
    user.update({
      nickName: response.data.data.staff_attributes.name,
      gender: response.data.data.staff_attributes.gender == 0 ? "UNKNOWN" : response.data.data.staff_attributes.gender == 1 ? "MALE" : "FEMALE",
      avatarUrl: response.data.data.staff_attributes.avatar,
    }).then(function() {
      if (state) {
        console.log("go");
        window.location.href = state;
      } else {
        r.push("/");
      }
    });
  }
}
</script> 
