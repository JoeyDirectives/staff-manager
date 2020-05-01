<template>
  <!-- 导航的面包屑布局 -->
  <v-breadcrumbs :items="breadItems" light class="bread-style">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item :href="item.href" :disabled="item.disabled">
        <v-btn :color="breadText==item.text?'#0ca192':''" style="color:#000;margin-left:5px" small>
          {{item.text}}
          <v-icon right small @click.stop="deleteBread(item)">mdi-close</v-icon>
        </v-btn>
      </v-breadcrumbs-item>
    </template>
    <template v-slot:divider>
      <div></div>
    </template>
  </v-breadcrumbs>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  computed: {
    breadItems() {
      return this.$store.state.breadItems;
    },
    breadText(){
      return this.$store.state.breadText;
    }
  },
  methods: {
    deleteBread(item) {
      this.$store.commit("deleteBread",item);
    }
  }
};
</script>
<style scoped>
.bread-style >>> .v-breadcrumbs__divider {
  padding: 0 !important;
}
</style>