<template>
  <v-content>
    <v-alert
      type="error"
      class="top-show-errormsg-alert"
      v-if="showErrorDialog"
      max-width="500px"
      dismissible
    >用户名或密码错误，请重新输入！</v-alert>
    <v-alert
      type="success"
      class="top-show-successmsg-alert"
      v-if="showSuccessDialog"
      max-width="500px"
      dismissible
    >登录成功！</v-alert>
    <v-content class="container-style">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12" style="background-color: #E6E6E6;">
              <v-toolbar color="#242F42" dark flat>
                <v-toolbar-title style="margin:0 auto">人力资源管理系统</v-toolbar-title>
              </v-toolbar>
              <v-card-text style="background-color: #E6E6E6;margin-top:20px">
                <v-form v-model="valid">
                  <v-text-field
                    class="login-text-text"
                    label="工号"
                    hint="请输入员工号"
                    :rules="numRules"
                    autofocus
                    outlined
                    dense
                    v-model="staffNum"
                    prepend-icon="person"
                    color="primary"
                    type="text"
                    @keyup.enter="toLogin"
                  />

                  <v-text-field
                    class="login-text-text"
                    hint="请输入员工密码"
                    :rules="passwordRules"
                    outlined
                    dense
                    label="密码"
                    color="primary"
                    v-model="password"
                    prepend-icon="lock"
                    type="password"
                    @keyup.enter="toLogin"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <div class="card-action-style">
                  <v-btn
                    style="flex: 1;border-radius: 10px;max-width: 180px"
                    color="primary"
                    @click="toLogin"
                  >登录</v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-content>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      valid: false,
      numRules: [
        v => !!v || "请输入工号",
        v => isNaN(Number(v)) == false || "工号只能为数字",
        v => v.length <= 3 || "工号最多3位"
      ],
      passwordRules: [
        v => !!v || "请输入密码",
        v => v.length <= 6 || "密码最多6位"
      ],
      staffNum: "",
      password: "",
      showErrorDialog: false,
      showSuccessDialog: false
    };
  },
  methods: {
    /**
     * @description 登录请求
     */
    toLogin() {
      this.$axios
        .post("/api/login", {
          staffNum: this.staffNum,
          password: this.password
        })
        .then(res => {
          if (res.data == "200") {
            this.showErrorDialog = false;
            this.showSuccessDialog = true;
            //登录成功，路由跳转到主页面
            setTimeout(() => {
              this.$router.push({ path: "/HomePage" });
            }, 100);
            this.$store.commit("changeUserInfo",this.staffNum);
          } else {
            this.showSuccessDialog = false;
            this.showErrorDialog = true;
          }
        })
        .catch(reason => {
          window.console.log(reason);
        });
    }
  },
  watch: {
    /**
     * @description 设置登录错误时，提示框的出现时间
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
     * @description 设置登录成功时，提示框的出现时间
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
.container-style {
  width: 100%;
  height: 100%;
  opacity: 0.9;
  position: relative;
}
.top-show-errormsg-alert,
.top-show-successmsg-alert {
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 10%;
  transform: translateX(-55%);
}
.card-action-style {
  width: 100%;
  height: 100%;
  background-color: #e6e6e6;
  display: flex;
  padding: 0 8px 0 8px;
  justify-content: center;
}
.v-card >>> .v-card__actions {
  padding: 0 0 8px 0;
}
.v-btn {
  font-size: 16px;
  font-weight: 600;
}
</style>