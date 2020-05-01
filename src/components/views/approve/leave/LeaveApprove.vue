<template>
  <div>
    <!-- 请假审批dialog -->
    <v-dialog
      v-model="showLeaveDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card>
        <v-card-title>
          请假审批
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="closeDialog">
                <v-icon color="black">mdi-close</v-icon>
              </v-btn>
            </template>
            <span>关闭</span>
          </v-tooltip>
        </v-card-title>
        <!-- 审批main content部分 -->
        <v-container style="margin:0 10px 0 10px;padding-top:10px;max-width: 1330px">
          <v-tabs v-model="tab" class="tab-style">
            <v-tab v-for="item in tabs" :key="item">{{ item }}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="item in tabs" :key="item">
              <div v-if="tab==0"><leave-list/></div>
              <div v-if="tab==1"><leave-list-done/></div>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import LeaveList from "./LeaveList"
import LeaveListDone from "./LeaveListDone"

export default {
  props: {
    showLeaveDialog: {
      type: Boolean,
      default: false
    }
  },
  components: {
    LeaveList,
    LeaveListDone
  },
  data() {
    return {
      tab: null,
      tabs: ["请假审批", "审批结果"]
    };
  },
  methods: {
    /**
     * @description 关闭此dialog
     */
    closeDialog() {
      this.$emit("close");
    }
  }
};
</script>
<style scoped>
.v-card >>> .v-card__title {
  background: #0ca192;
  font-size: 24px;
  font-weight: 700;
}
.tab-style {
  border-bottom: 2px solid #0ca192;
}
.theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active),
.theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active) > .v-icon,
.theme--light.v-tabs > .v-tabs-bar .v-tab--disabled {
  color: #000;
  font-size: 16px;
  font-weight: 600;
}
.tab-style >>> .v-tab--active {
  background-color: #0ca192;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.tab-style >>> .v-card__text {
  background-color: #0ca192;
}
</style>