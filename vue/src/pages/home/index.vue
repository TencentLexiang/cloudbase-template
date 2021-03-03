<template>
  <div>home</div>
</template>

<script>
import cloudbase from '@cloudbase/js-sdk';

export default {
  name: 'home',
  async mounted() {
    const app = cloudbase.init({
      env: process.env.ENV_ID
    });
    const auth = app.auth();

    const loginState = await auth.getLoginState();
    console.log(loginState);
    const { company_id } = this.$route.query;
    if (!loginState) {
      window.location.href = login_url(company_id);
    }
  },
}

function login_url(company_id = null) {
    let redirect_uri = process.env.PAGE_URL + "/auth-callback";
    let params = "suite_id=" + process.env.LX_SUITE_ID +"&redirect_uri=" + encodeURIComponent(redirect_uri) + "&response_type=code&scope=snsapi_userinfo";
    if (company_id) {
        params = params + "&company_id=" + company_id;
    }
    return process.env.LX_AUTH_URL + "?" + params;
}
</script>


