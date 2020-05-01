<template>
  <div>
    <ExtraWorkApprove :showExtraWorkDialog="showExtraWorkDialog" @close="close" />
    <LeaveApprove :showLeaveDialog="showLeaveDialog" @close="close" />
    <BusinessTripApprove :showBusinessTripDialog="showBusinessTripDialog" @close="close" />
    <SealApprove :showSealApproveDialog="showSealApproveDialog" @close="close" />
    <DimissionApprove :showDimissionDialog="showDimissionDialog" @close="close" />
    <!-- 导航的面包屑布局 -->
    <div style="background-color: #fff;padding:12px">
      <Breadcrumbs />
    </div>
    <div class="main-content">
      <div
        class="content-item-style"
        v-for="(item, index) in contentItems"
        :key="index"
        @click="popupDialog(index)"
      >
        <div class="icon-style" :style="'backgroundColor:'+item.color">
          <v-icon role color="#fff" size="36px">{{item.icon}}</v-icon>
        </div>
        <span style="margin-left:10px;color:#566677;font-size:20px;font-weight:600">{{item.text}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumbs from "./Breadcrumbs";
import ExtraWorkApprove from "./approve/extrawork/ExtraWorkApprove";
import LeaveApprove from "./approve/leave/LeaveApprove";
import BusinessTripApprove from "./approve/businesstrip/BusinessTripApprove"
import SealApprove from "./approve/Seal/SealApprove"
import DimissionApprove from "./approve/Dimission/DimissionApprove"

export default {
  components: {
    Breadcrumbs,
    ExtraWorkApprove,
    LeaveApprove,
    BusinessTripApprove,
    SealApprove,
    DimissionApprove
  },
  data() {
    return {
      contentItems: [
        {
          icon: "mdi-account-clock-outline",
          text: "请假审批",
          color: "#35B8F7"
        },
        {
          icon: "mdi-account-edit-outline",
          text: "加班审批",
          color: "#32B8A3"
        },
        {
          icon: "mdi-airplane-takeoff",
          text: "出差审批",
          color: "#FFAC38"
        },
        {
          icon: "mdi-account-star",
          text: "公章审批",
          color: "#62D5EE"
        },
        {
          icon: "mdi-account-off",
          text: "离职审批",
          color: "#FFBF37"
        }
      ],
      showLeaveDialog: false,
      showExtraWorkDialog: false,
      showBusinessTripDialog: false,
      showSealApproveDialog: false,
      showDimissionDialog: false
    };
  },
  methods: {
    popupDialog(index) {
      switch (index) {
        case 0:
          this.showLeaveDialog = true;
          break;
        case 1:
          this.showExtraWorkDialog = true;
          break;
        case 2:
          this.showBusinessTripDialog = true;
          break;
        case 3:
          this.showSealApproveDialog = true;
          break;
        case 4:
          this.showDimissionDialog = true;
          break;
      }
    },
    close() {
      this.showLeaveDialog = false;
      this.showExtraWorkDialog = false;
      this.showBusinessTripDialog = false;
      this.showSealApproveDialog = false;
      this.showDimissionDialog = false;
    }
  }
};
</script>
<style scoped>
.v-application ul {
  padding: 0;
}
.v-content >>> .container {
  padding: 0;
}
.main-content {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin: 10px 0 0 10px;
}
.content-item-style {
  height: 150px;
  min-width: 250px;
  margin: 10px 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(216, 214, 214);
  border-radius: 8px;
  transition: all 0.6s;
}
.content-item-style:hover {
  background-color: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}
.icon-style {
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>