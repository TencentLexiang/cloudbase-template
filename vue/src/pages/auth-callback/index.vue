<template>
  <div>auth-callback123</div>
</template>

<script>
export default {
  name: 'auth-callback',
  async mounted() {
    const { code } = this.$route.query;
    const state = this.$route.query.state;
    const response = await this.$app.callFunction({
      // 云函数名称
      name: "login_user",
      data: {
        code
      }
    }).then(function(response) {
      console.log(response.result.data);
      return response.result.data;
    })
    const ss = await this.$auth.customAuthProvider().signIn(response.ticket);
    console.log(ss);
    const user = this.$auth.currentUser;
    const r = this.$router;
    user.update({
      nickName: response.staff_attributes.name,
      gender: response.staff_attributes.gender == 0 ? "UNKNOWN" : response.staff_attributes.gender == 1 ? "MALE" : "FEMALE",
      avatarUrl: response.staff_attributes.avatar,
    }).then(function() {
      if (state) {
        console.log("go");
        window.location.href = state;
      } else {
        console.log("go2");
        r.push("/");
      }
    });
  }
}
</script> 
