<template>
  <div>
    <v-alert
      type="success"
      class="top-show-successmsg-alert"
      v-if="showSuccessDialog"
      max-width="500px"
      dismissible
    >申请成功！</v-alert>
    <!-- date-picker dialog -->
    <v-dialog v-model="showDatePicker" width="320px" persistent>
      <v-date-picker
        color="#0ca192"
        :allowed-dates="limitDate"
        v-model="leaveInfo.startDate"
        :first-day-of-week="0"
        locale="zh-cn"
      ></v-date-picker>
      <v-divider />
      <v-btn color="#0ca192" @click="showDatePicker=false">确定</v-btn>
    </v-dialog>
    <!-- 申请dialog -->
    <v-dialog v-model="showDimissionDialog" width="650px" persistent>
      <v-card>
        <v-card-title class="dialog-title-style">
          离职申请
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
            <span class="span-style">申请人</span>
            <v-text-field
              dense
              class="select-style"
              style="margin-left: 58px;"
              append-icon="mdi-account-cancel"
              label="申请人"
              readonly
              v-model="leaveInfo.person"
              outlined
            ></v-text-field>
            <br />
            <div style="height: 16px"></div>
            <span class="span-style">期望离职日</span>
            <v-text-field
              dense
              class="select-style"
              style="margin-left: 25px;"
              append-icon="mdi-calendar-month-outline"
              label="期望离职日"
              v-model="leaveInfo.startDate"
              @focus="showDatePicker=true"
              outlined
            ></v-text-field>
            <v-spacer />
            <div style="height: 16px"></div>
            <span class="span-style">离职原因</span>
            <v-select
              dense
              class="select-style"
              v-model="leaveInfo.leaveReason"
              :items="FileTypesItems"
              label="离职原因"
              outlined
            ></v-select>
            <div style="height: 16px"></div>
            <div>
              <span class="span-style1">备注</span>
              <v-textarea
                outlined
                label="备注"
                class="text-area-style"
                style="margin-left:80px"
                v-model="leaveInfo.ps"
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
    showDimissionDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showErrorDialog: false,
      showSuccessDialog: false,
      showDatePicker: false,
      FileTypesItems: [
        "薪酬原因",
        "领导原因",
        "同事关系",
        "工作环境",
        "培训机会",
        "家庭原因",
        "地域原因",
        "身体原因",
        "其它"
      ],
      //请假申请modeIn
      leaveInfo: {
        person: "张三",
        startDate: new Date().toISOString().substr(0, 10),
        leaveReason: "",
        ps:""
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
    },
    /**
     * @description 限制选择今日之前的时间
     * @param val date-picker当月日期
     */
    limitDate: val => val >= new Date().toISOString().substr(0, 10),
    /**
     * @description 终止时间应当大于开始时间
     * @param val date-picker当月日期
     */
    limitDate1(val) {
      return val >= this.leaveInfo.startDate;
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
.span-style,
.span-style1 {
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