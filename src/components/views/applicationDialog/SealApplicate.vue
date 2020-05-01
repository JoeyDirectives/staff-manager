<template>
  <div>
    <v-alert
      type="success"
      class="top-show-successmsg-alert"
      v-if="showSuccessDialog"
      max-width="500px"
      dismissible
    >申请成功！</v-alert>
    <!-- 申请dialog -->
    <v-dialog v-model="showSealDialog" width="650px" persistent>
      <v-card>
        <v-card-title class="dialog-title-style">
          公章申请
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
        <!-- 申请main content部分 -->
        <v-container>
          <!-- main content -->
          <v-alert
            type="error"
            class="top-show-errormsg-alert"
            v-if="showErrorDialog"
            max-width="500px"
            dismissible
          >有未输入必填项，请检查后尝试！</v-alert>
          <div style="height: 10px"></div>
          <div class="div-display">
            <span class="span-style">资料类型</span>
            <v-select
              dense
              class="select-style"
              v-model="leaveInfo.type"
              :items="FileTypesItems"
              label="资料类型"
              outlined
            ></v-select>
            <br />
            <div style="height: 16px"></div>
            <div>
              <span class="span-style">申请事由</span>
              <v-textarea
                outlined
                label="申请事由"
                class="text-area-style"
                v-model="leaveInfo.leaveReason"
              ></v-textarea>
            </div>
          </div>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">取消</v-btn>
          <v-btn color="primary" @click="toApplication">申请</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    showSealDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showErrorDialog: false,
      showSuccessDialog: false,
      FileTypesItems: ["合同", "证明","入离职资料","政府及项目申报","其它"],
      //请假申请modeIn
      leaveInfo: {
        type: "",
        leaveReason: ""
      }
    };
  },
  methods: {
    /**
     * @description 关闭此dialog
     */
    closeDialog() {
      this.$emit("close");
    },
    /**
     * @description 申请信息提交
     */
    toApplication() {
      for (let el in this.leaveInfo) {
        if (this.leaveInfo[el] == "") {
          this.showErrorDialog = true;
          return;
        }
      }
      this.showSuccessDialog = true;
      console.log(this.leaveInfo);
      this.$emit("close");
    }
  },
  watch: {
    /**
     * @description 设置申请错误时，提示框的出现时间
     * @param newValue 提示框状态
     */
    showErrorDialog(newValue) {
      if (newValue) {
        setTimeout(() => {
          this.showErrorDialog = false;
        }, 2000);
      }
    },
    /**
     * @description 设置成功成功时，提示框的出现时间
     * @param newValue 提示框状态
     */
    showSuccessDialog(newValue) {
      if (newValue) {
        setTimeout(() => {
          this.showSuccessDialog = false;
        }, 2000);
      }
    }
  }
};
</script>
<style scoped>
.dialog-title-style {
  background: #0ca192;
  font-weight: 600;
}
.top-show-errormsg-alert,
.top-show-successmsg-alert {
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 10%;
  transform: translateX(-50%);
}
.span-style {
  font-size: 16px;
  font-weight: 600;
  margin-top: 100px;
  margin-left: 24px;
}
.span-style::after {
  content: "*";
  color: red;
}
.select-style {
  width: 220px;
  display: inline-block;
  margin-left: 40px;
}
.select-style >>> label {
  font-size: 14px;
}
.select-style >>> .v-input__control {
  max-height: 40px;
}
.text-area-style {
  display: inline-block;
  width: 468px;
  margin-left: 40px;
  vertical-align: top;
}
.top-show-errormsg-alert >>> .v-alert__content {
  width: 240px;
}
</style>