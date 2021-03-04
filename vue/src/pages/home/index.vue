<template>
  <div>home123</div>
</template>

<script>
import axios from 'axios';
import cloudbase from '@cloudbase/js-sdk';

export default {
  name: 'home',
  async mounted() {
    const app = cloudbase.init({
      env: process.env.ENV_ID
    });
    const authHeader = await app.auth({
      persistence: "local"
    }).getAuthHeaderAsync();
    console.log(authHeader);
    await axios({
      method: "get",
      url: "https://todayapi.lexiangla.net/get_course_link",
      headers: {
        ...authHeader
      }
    }).then((res) => {
      console.log(res.data);
    });
  }
}
</script>


