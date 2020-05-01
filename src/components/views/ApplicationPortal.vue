<template>
  <div>
    <!-- 导航的面包屑布局 -->
    <div style="background-color: #fff;padding:12px">
      <Breadcrumbs />
    </div>
    <div class="main-portal-style">
      <leave-applicate @close="close" :showQingjiaDialog="showQingjiaDialog" />
      <extra-work-applicate @close="close" :showExtraWorkDialog="showExtraWorkDialog" />
      <business-trip-applicate @close="close" :showBusinessTripDialog="showBusinessTripDialog" />
      <seal-applicate @close="close" :showSealDialog="showSealDialog" />
      <dimission-applicate @close="close" :showDimissionDialog="showDimissionDialog" />
      <v-card width="100%">
        <v-tabs v-model="tab" class="tab-style">
          <v-tab v-for="item in tabs" :key="item">{{ item }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="item in tabs" :key="item">
            <v-card>
              <v-card-text v-if="tab==0">
                <div class="main-portal-style">
                  <div
                    class="content-style"
                    @click="toApplicate(index)"
                    v-for="(item, index) in contentItems"
                    :key="index"
                  >
                    <div>
                      <v-icon size="82px" color="#0CA192">{{item.icon}}</v-icon>
                      <div
                        style="margin-top: 10px;font-weight: 600;text-align: center;color: #0CA192;font-size:16px"
                      >{{item.text}}</div>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-text v-if="tab==1">
                <applicate-undone />
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-text v-if="tab==2">
                <applicate-done />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
  </div>
</template>
<script>
import Breadcrumbs from "./Breadcrumbs";
import LeaveApplicate from "./applicationDialog/LeaveApplicate";
import ExtraWorkApplicate from "./applicationDialog/ExtraWorkApplicate";
import BusinessTripApplicate from "./applicationDialog/BusinessTripApplicate";
import SealApplicate from "./applicationDialog/SealApplicate";
import DimissionApplicate from "./applicationDialog/DimissionApplicate";
import ApplicateDone from "./applicationChildren/ApplicateDone";
import ApplicateUndone from "./applicationChildren/ApplicateUndone"

export default {
  components: {
    Breadcrumbs,
    LeaveApplicate,
    ExtraWorkApplicate,
    BusinessTripApplicate,
    SealApplicate,
    DimissionApplicate,
    ApplicateDone,
    ApplicateUndone
  },
  data() {
    return {
      showQingjiaDialog: false,
      showExtraWorkDialog: false,
      showBusinessTripDialog: false,
      showSealDialog: false,
      showDimissionDialog: false,
      tab: null,
      tabs: ["发起申请", "未完成", "已完成"],
      contentItems: [
        {
          icon: "mdi-account-clock-outline",
          text: "请假申请"
        },
        {
          icon: "mdi-account-edit-outline",
          text: "加班申请"
        },
        {
          icon: "mdi-airplane-takeoff",
          text: "出差申请"
        },
        {
          icon: "mdi-account-star",
          text: "公章申请"
        },
        {
          icon: "mdi-account-off",
          text: "离职申请"
        }
      ]
    };
  },
  methods: {
    toApplicate(val) {
      switch (val) {
        case 0:
          this.showQingjiaDialog = true;
          break;
        case 1:
          this.showExtraWorkDialog = true;
          break;
        case 2:
          this.showBusinessTripDialog = true;
          break;
        case 3:
          this.showSealDialog = true;
          break;
        case 4:
          this.showDimissionDialog = true;
          break;
      }
    },
    test(tab) {
      console.log(tab);
    },
    close() {
      this.showQingjiaDialog = false;
      this.showExtraWorkDialog = false;
      this.showBusinessTripDialog = false;
      this.showSealDialog = false;
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
.main-portal-style {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.content-style {
  height: 230px;
  cursor: pointer;
  flex: 1;
  margin: 10px 10px;
  border: 1px solid rgb(216, 214, 214);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.6s;
  border-radius: 8px;
}
.content-style:hover {
  background-color: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}
.tab-style {
  margin: 10px 0 0 10px;
  border-bottom: 2px solid #0ca192;
}
.tab-style >>> .v-tab--active {
  background-color: #0ca192;
  color: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.tab-style >>> .v-card__text {
  background-color: #0ca192;
}
.v-card {
  box-shadow: none;
}
.v-card >>> .v-card__text {
  height: 400px;
  background-color: #f0f0f0;
}
</style>