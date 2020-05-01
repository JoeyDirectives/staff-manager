<template>
  <v-app id="inspire">
    <MineCenter :showMineCenterDialog="showMineCenterDialog" @close="close" />
    <v-navigation-drawer
      v-model="drawer"
      :color="themeMode=='nights_stay'?nightColor:''"
      permanent
      :mini-variant="miniVariant"
      :clipped="$vuetify.breakpoint.lgAndUp"
      :dark="themeMode=='nights_stay'"
      app
    >
      <v-list dense>
        <template v-for="(item,index) in items">
          <v-list-group
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            @click="changeMainContent(item.text,item.model,index)"
            append-icon
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title style="font-size:15px">{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              link
              @click="mulitChange(child.text)"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ child.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      :color="themeMode=='nights_stay'?barNightColor:''"
      :dark="themeMode=='nights_stay'"
    >
      <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">人力资源管理系统</span>
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="ChangeFullScreen">
            <v-icon color="primary">zoom_out_map</v-icon>
          </v-btn>
        </template>
        <span>网页全屏</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="changeTheme">
            <v-icon :color="themeMode=='nights_stay'?'yellow':'red'">{{themeMode}}</v-icon>
          </v-btn>
        </template>
        <span>切换主题</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon large @click="showMineCenter">
            <v-avatar size="32px" item>
              <v-img src="@/assets/avatar.jpg" />
            </v-avatar>
          </v-btn>
        </template>
        <span>个人中心</span>
      </v-tooltip>
      <v-flex class="flex-select-style" style="max-width:80px;margin-top:20px">
        <v-select
          dense
          class="select-hidden-decoration"
          :items="selectItems"
          v-model="selectingItem"
          @change="selectChanged(selectingItem)"
        />
      </v-flex>
    </v-app-bar>
    <v-content style="background-color: #F0F0F0">
      <v-container style="padding:0;margin:0;max-width:100%">
        <!--        主界面-->
        <router-view />
        <v-footer absolute class="font-weight-medium" style="background-color: #fff">
          <v-col class="text-center" cols="12">
            <strong>Copyright &copy; 2020/04/18 TJ — All Rights Reserved.</strong>
          </v-col>
        </v-footer>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MineCenter from "./MineCenter";

export default {
  components: {
    MineCenter
  },
  data() {
    return {
      clickItem: "默认",
      drawer: null,
      miniVariant: false,
      themeMode: "nights_stay",
      nightColor: "#324157",
      barNightColor: "#242F42",
      items: [
        {
          icon: "mdi-home",
          "icon-alt": "mdi-home",
          text: "系统首页",
          children: []
        },

        {
          icon: "mdi-application",
          "icon-alt": "mdi-application",
          text: "申请门户",
          children: []
        },
        {
          icon: "mdi-newspaper-plus",
          "icon-alt": "mdi-newspaper-plus",
          text: "新闻公告",
          children: []
        },
        {
          icon: "mdi-file-document-edit",
          "icon-alt": "mdi-file-document-edit",
          text: "审批中心",
          children: []
        },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: "人事管理",
          model: false,
          children: [
            { icon: "mdi-account-group", text: "员工花名册", children: [] },
            { icon: "mdi-file-account", text: "员工档案", children: [] },
            { icon: "mdi-file-alert-outline", text: "合同记录", children: [] }
          ]
        },
        {
          icon: "mdi-account-key",
          "icon-alt": "mdi-account-key",
          text: "添加用户",
          children: []
        }
      ],
      selectItems: ["注销"],
      selectingItem: "",
      showMineCenterDialog: false
    };
  },
  mounted() {
    this.$axios
      .get("/api/HomePage/UserInfo", {
        params: {
          staffNum: this.$store.state.staffNum
        }
      })
      .then(res => {
        this.selectItems.unshift(res.data.staffName);
        this.selectingItem = res.data.staffName;
      });
  },
  methods: {
    /**
     * @description 关闭个人中心popup
     */
    close() {
      this.showMineCenterDialog = false;
    },
    /**
     * @description 个人中心popup
     */
    showMineCenter() {
      this.showMineCenterDialog = true;
    },
    /**
     * @description 路由名转url
     */
    changeRouterNametoUrl(name) {
      switch (name) {
        case "系统首页":
          return "HomePage";
        case "添加用户":
          return "Permissions";
        case "申请门户":
          return "ApplicationPortal";
        case "代办事项":
          return "Backlog";
        case "新闻公告":
          return "News";
        case "发布新闻公告":
          return "MakeNews";
        case "审批中心":
          return "ExamineAndApprove";
        case "员工花名册":
          return "StaffRoster";
        case "员工档案":
          return "StaffRecord";
        case "合同记录":
          return "StaffContract";
      }
    },
    /**
     * @description 路由跳转
     */
    changeMainContent(val, model, index) {
      this.items[index].model = !model;
      if (val != "人事管理") {
        this.$router.push({ name: val });
        this.$store.commit("addBread", {
          text: val,
          disabled: false,
          href: this.changeRouterNametoUrl(val)
        });
      }
    },
    /**
     * @description 列表路由跳转
     */
    mulitChange(val) {
      this.$router.push({ name: val });
      this.$store.commit("addBread", {
        text: val,
        disabled: false,
        href: this.changeRouterNametoUrl(val)
      });
    },
    /**
     * @description 切换夜间白天模式
     */
    changeTheme() {
      if (this.themeMode == "nights_stay") {
        this.themeMode = "wb_sunny";
      } else {
        this.themeMode = "nights_stay";
      }
    },
    /**
     * @description 切换全屏
     */
    ChangeFullScreen() {
      this.$store.commit("clickFullScreen");
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    },
    /**
     * @description 选择下拉框事件
     * @param val 选择的下拉框item值
     */
    selectChanged(val) {
      if (val === "注销") {
        this.$router.replace({ path: "/" });
      }
    }
  }
};
</script>
<style scoped>
.v-list >>> .v-list-group__items {
  margin-left: 20px;
}
.v-text-field >>> .v-input__slot::before {
  width: 0 !important;
  border-style: none !important;
}
.v-text-field >>> .v-input__slot::after {
  width: 0 !important;
  border-style: none !important;
}
.v-text-field >>> .v-select__selection {
  font-size: 14px;
  overflow: visible !important;
}
</style>