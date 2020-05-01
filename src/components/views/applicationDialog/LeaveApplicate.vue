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
    <!-- time-picker dialog -->
    <v-dialog v-model="showTimePicker" width="320px" persistent>
      <v-time-picker color="#0ca192" v-model="leaveInfo.startTime" format="24hr"></v-time-picker>
      <v-divider />
      <v-btn color="#0ca192" @click="showTimePicker=false">确定</v-btn>
    </v-dialog>
    <!-- date-picker dialog -->
    <v-dialog v-model="showDatePicker1" width="320px" persistent>
      <v-date-picker
        color="#0ca192"
        :allowed-dates="limitDate1"
        v-model="leaveInfo.endDate"
        :first-day-of-week="0"
        locale="zh-cn"
      ></v-date-picker>
      <v-divider />
      <v-btn color="#0ca192" @click="showDatePicker1=false">确定</v-btn>
    </v-dialog>
    <!-- time-picker dialog -->
    <v-dialog v-model="showTimePicker1" width="320px" persistent>
      <v-time-picker color="#0ca192" v-model="leaveInfo.endTime" format="24hr"></v-time-picker>
      <v-divider />
      <v-btn color="#0ca192" @click="showTimePicker1=false">确定</v-btn>
    </v-dialog>
    <!-- 申请dialog -->
    <v-dialog v-model="showQingjiaDialog" width="650px" persistent>
      <v-card>
        <v-card-title class="dialog-title-style">
          请假申请
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
            <span class="span-style">请假类型</span>
            <v-select
              dense
              class="select-style"
              v-model="leaveInfo.type"
              :items="holidayTypesItems"
              label="假期类型选择"
              outlined
            ></v-select>
            <br />
            <div style="height: 16px"></div>
            <span class="span-style">请假时间段</span>
            <v-text-field
              dense
              class="select-style"
              style="margin-left: 25px;"
              append-icon="mdi-calendar-month-outline"
              label="开始日期"
              v-model="leaveInfo.startDate"
              @focus="showDatePicker=true"
              outlined
            ></v-text-field>
            <v-text-field
              dense
              class="select-style"
              style="margin-left: 25px;"
              append-icon="mdi-alarm"
              label="开始时间"
              v-model="leaveInfo.startTime"
              @focus="showTimePicker=true"
              outlined
            ></v-text-field>
            <br />
            <div style="height: 16px"></div>
            <span class="span-style">至</span>
            <v-text-field
              dense
              class="select-style"
              style="margin-left: 90px;"
              append-icon="mdi-calendar-month-outline"
              label="结束日期"
              v-model="leaveInfo.endDate"
              @focus="showDatePicker1=true"
              outlined
            ></v-text-field>
            <v-text-field
              dense
              class="select-style"
              style="margin-left: 25px;"
              append-icon="mdi-alarm"
              label="结束时间"
              v-model="leaveInfo.endTime"
              @focus="showTimePicker1=true"
              outlined
            ></v-text-field>
            <v-spacer />
            <div style="height: 16px"></div>
            <div>
              <span class="span-style">请假事由</span>
              <v-textarea
                outlined
                label="请假事由"
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
    showQingjiaDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showErrorDialog: false,
      showSuccessDialog: false,
      showDatePicker: false,
      showTimePicker: false,
      showDatePicker1: false,
      showTimePicker1: false,
      holidayTypesItems: ["事假", "病假"],
      //请假申请modeIn
      leaveInfo: {
        type: "",
        startDate: new Date().toISOString().substr(0, 10),
        startTime: "",
        endDate: "",
        endTime: "",
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