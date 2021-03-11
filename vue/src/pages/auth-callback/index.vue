<template>
  <div>auth-callback</div>
</template>

<script>
import { lxStorage } from '../../utils';

export default {
  name: 'auth-callback',
  async mounted() {
    const { code, state } = this.$route.query;
    const response = await this.$app.callFunction({
      name: 'base_login_user',
      data: {
        code
      }
    });
    const { ticket, staff_attributes } = response.result.data;
    console.log('base_login_user callback', response.result.data);
    await this.$auth.customAuthProvider().signIn(ticket);

    lxStorage.setItem('company_id', staff_attributes.company_id);

    const user = this.$auth.currentUser;
    user.update({
      nickName: staff_attributes.name,
      gender: staff_attributes.gender == 0 ? 'UNKNOWN' : staff_attributes.gender == 1 ? 'MALE' : 'FEMALE',
      avatarUrl: staff_attributes.avatar,
    }).then(() => {
      if (state) {
        window.location.href = window.atob(state);
      } else {
        this.$router.push('/');
      }
    });
  }
}
</script> 
