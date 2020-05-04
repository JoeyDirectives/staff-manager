<template>
  <v-app>
    <router-link to="/"></router-link>
    <router-view />
  </v-app>
</template>
<script>
export default {
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    console.log(sessionStorage.getItem("store"))
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  }
};
</script>
<style scoped>
#app {
  background: url("assets/login.jpg") no-repeat;
  min-height: 100%;
  min-width: 100%;
  background-size: 100%;
}
</style>