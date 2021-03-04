<template>
  <div>home123</div>
</template>

<script>
import cloudbase from '@cloudbase/js-sdk';

export default {
  name: 'home',
  async mounted() {
    const app = cloudbase.init({
      env: process.env.ENV_ID,
      region: process.env.REGION
    });
  }
}
</script>


