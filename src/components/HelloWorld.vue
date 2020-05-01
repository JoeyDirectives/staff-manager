<template>
  <v-container>
    <v-icon color="primary">mdi-anchor</v-icon>
    <router-link to="/login">
      <v-btn color="primary" small>去登陆</v-btn>
    </router-link>
    <router-view/>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {}
    }
  };
</script>
