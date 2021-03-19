<template>
  <div v-if="isShow">
    <el-menu :default-active="activeIndex" mode="horizontal">
      <el-menu-item index="home">
        <router-link :to="`/?company_from=${$company.id}`" custom v-slot="{ navigate }">
          <span @click="navigate">首页</span>
        </router-link>
      </el-menu-item>
      <el-menu-item index="courseIndex">
        <router-link :to="`/courses?company_from=${$company.id}`" custom v-slot="{ navigate }">
          <span @click="navigate">课件</span>
        </router-link>
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
  }
};
</script>
