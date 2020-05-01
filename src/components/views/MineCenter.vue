<template>
  <div>
    <v-dialog
      v-model="showMineCenterDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card>
        <v-card-title>
          个人中心
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="closeDialog">
                <v-icon color="#fff">mdi-close</v-icon>
              </v-btn>
            </template>
            <span>关闭</span>
          </v-tooltip>
        </v-card-title>
        <!-- 审批main content部分 -->
        <v-container>
          <div class="top-file-card">
            <v-avatar size="180px" style="margin-left:100px">
              <v-img src="@/assets/avatar.jpg" />
            </v-avatar>
            <div style="margin-left:60px;width:100%;font-weight:600;color:#fff">
              <v-icon color="#fff" style="margin-right:8px">mdi-notebook-multiple</v-icon>部门：开发部
              <div style="height:2px;width:100%;border:1px solid #fff;margin:8px 0 8px 0"></div>
              <v-icon color="#fff" style="margin-right:8px">mdi-account-tie</v-icon>职位：项目经理
              <div style="height:2px;width:100%;border:1px solid #fff;margin:8px 0 8px 0"></div>
              <v-icon color="#fff" style="margin-right:8px">mdi-clipboard-account-outline</v-icon>入职日期：2020/02/09
              <div style="height:2px;width:100%;border:1px solid #fff;margin:8px 0 8px 0"></div>
              <v-icon color="#fff" style="margin-right:8px">mdi-briefcase-clock-outline</v-icon>司龄：5年
            </div>
          </div>
          <v-card max-width="100%" style="margin:8px 2px 0 0">
            <v-card-text>
              <div class="info-style">
                <div style="margin-left:250px;width:480px;display:inline-block">姓名：张三</div>
                <div style="display:inline-block">工号：048</div>
                <br />
                <br />
                <div style="margin-left:250px;width:480px;display:inline-block">职位：项目经理</div>
                <div style="display:inline-block">部门：开发部</div>
                <br />
                <br />
                <div style="margin-left:214px;width:480px;display:inline-block">
                  证件号码：
                  <v-text-field
                    dense
                    class="select-style"
                    append-icon="mdi-calendar-month-outline"
                    outlined
                  ></v-text-field>
                </div>
                <div style="display:inline-block">
                  最高学历：
                  <v-text-field
                    dense
                    class="select-style"
                    append-icon="mdi-calendar-month-outline"
                    outlined
                  ></v-text-field>
                </div>
                <br />
                <br />
                <div style="margin-left:214px;width:480px;display:inline-block">
                  手机号码：
                  <v-text-field
                    dense
                    class="select-style"
                    append-icon="mdi-calendar-month-outline"
                    outlined
                  ></v-text-field>
                </div>
                <div style="display:inline-block">
                  现住地址：
                  <v-text-field
                    dense
                    class="select-style"
                    append-icon="mdi-calendar-month-outline"
                    outlined
                  ></v-text-field>
                </div>
                <br />
                <br />
                <div style="margin-left:249px;width:446px;display:inline-block">
                  国籍：
                  <v-text-field
                    dense
                    class="select-style"
                    append-icon="mdi-calendar-month-outline"
                    outlined
                  ></v-text-field>
                </div>
                <div style="display:inline-block">
                  工作邮箱：
                  <v-text-field
                    dense
                    class="select-style"
                    append-icon="mdi-calendar-month-outline"
                    outlined
                  ></v-text-field>
                </div>
                <br />
                <br />
                <div style="margin-left:215px;width:480px;display:inline-block">
                  工作电话：
                  <v-text-field
                    dense
                    class="select-style"
                    append-icon="mdi-calendar-month-outline"
                    outlined
                  ></v-text-field>
                </div>
                <div style="display:inline-block;margin-left:36px;">
                  籍贯：
                  <v-text-field
                    dense
                    class="select-style"
                    append-icon="mdi-calendar-month-outline"
                    outlined
                  ></v-text-field>
                </div>
                <br />
                <br />
                <div style="margin-left:215px;width:480px;display:inline-block">
                  政治面貌：
                  <v-text-field
                    dense
                    class="select-style"
                    append-icon="mdi-calendar-month-outline"
                    outlined
                  ></v-text-field>
                </div>
                <div style="display:inline-block">
                  婚姻状况：
                  <v-text-field
                    dense
                    class="select-style"
                    append-icon="mdi-calendar-month-outline"
                    outlined
                  ></v-text-field>
                </div>
                <div style="height:100px"></div>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
        <div class="bottom-btn-style">
          <v-btn style="margin-right:36px" @click="closeDialog">取消</v-btn>
          <v-btn color="primary">保存</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    showMineCenterDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
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
.select-style {
  width: 270px;
  display: inline-block;
  margin-left: 40px;
}
.select-style >>> label {
  font-size: 14px;
}
.select-style >>> .v-input__control {
  max-height: 40px;
}
.info-style {
  font-size: 18px;
  font-weight: 600;
}
.v-card >>> .v-card__title {
  background: #242F42;
  font-size: 24px;
  color: #fff;
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
.top-file-card {
  width: 100%;
  height: 300px;
  background: url("../../assets/mine.jpg");
  display: flex;
  align-items: center;
}
.container {
  margin: 0 0 0 0;
  padding: 0;
  min-width: 1332px;
}
.bottom-btn-style {
  display: flex;
  justify-content: center;
  width: 100%;
  position: fixed;
  bottom: 20px;
}
</style>