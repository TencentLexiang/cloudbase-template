<template>
  <div v-if="isShow">
    <el-menu :default-active="activeIndex" mode="horizontal">
      <el-menu-item index="home" @click="onClick(`/?company_from=${$company.id}`)">
        首页
      </el-menu-item>
      <el-menu-item index="courseIndex" @click="onClick(`/courses?company_from=${$company.id}`)">
        课件
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  computed: {
    activeIndex() {
      return this.$route.name;
    },
    isShow() {
      return ['home', 'courseIndex'].indexOf(this.$route.name) !== -1;
    }
  },
  methods: {
    onClick(path) {
      this.$router.push(path);
    },
  }
};
</script>
