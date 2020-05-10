<template>
  <div v-if="newsItems!=null">
    <!-- time-picker dialog -->
    <v-dialog v-model="showTimePicker" width="320px" persistent>
      <v-time-picker color="#0ca192" v-model="scheduleItem.doneTime" format="24hr"></v-time-picker>
      <v-divider />
      <v-btn color="#0ca192" @click="showTimePicker=false">确定</v-btn>
    </v-dialog>
    <!-- 详细公告查看dialog -->
    <v-dialog v-model="showDetailNewsDialog" width="350px">
      <v-card id="dialogMove">
        <v-card-title style="background: #0ca192;">
          公告详细
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="showDetailNewsDialog=false">
                <v-icon color="black">mdi-close</v-icon>
              </v-btn>
            </template>
            <span>关闭</span>
          </v-tooltip>
        </v-card-title>
        <v-container>
          公告类型: {{newsItems[showDetailNewsIndex].newsType}}
          <br />
          <v-divider />
          详细内容: {{newsItems[showDetailNewsIndex].newsContent}}
          <br />
          <v-divider />
          发布时间: {{newsItems[showDetailNewsIndex].newsTime}}
          <v-divider />
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDetailNewsDialog=false">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 添加待办事项dialog -->
    <v-dialog v-model="addScheduleDialog" width="500px" persistent>
      <v-card>
        <v-card-title style="background: #0ca192;">
          {{scheduleTitle}}
          <v-alert
            type="error"
            class="top-show-errormsg-alert"
            v-if="showErrorDialog"
            max-width="500px"
            dismissible
          >代办内容或完成时间未输入!</v-alert>
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="closeScheduleDialog">
                <v-icon color="black">mdi-close</v-icon>
              </v-btn>
            </template>
            <span>关闭</span>
          </v-tooltip>
        </v-card-title>
        <v-container>
          <!-- main content -->
          <div>
            <label for="text-style" style="padding-left:30px">代办内容:</label>
            <input type="text" class="text-style" v-model="scheduleItem.text" />
          </div>
          <div style="margin-top: 30px">
            <label for="text-style" style="padding-left:30px">完成时间:</label>
            <input
              type="text"
              class="text-style"
              @focus="showTimePicker = true"
              v-model="scheduleItem.doneTime"
            />
          </div>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="addScheduleDialog = false">取消</v-btn>
          <v-btn color="primary" @click="saveSchedule">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteScheduleDialog" width="380px">
      <v-card>
        <v-card-title style="background: #0ca192;">
          提示
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="deleteScheduleDialog=false">
                <v-icon color="black">mdi-close</v-icon>
              </v-btn>
            </template>
            <span>关闭</span>
          </v-tooltip>
        </v-card-title>
        <v-container>
          <v-icon color="#E6A23C" large style="margin-left:15px">mdi-alert-circle-outline</v-icon>确定要删除吗？
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteScheduleDialog = false">取消</v-btn>
          <v-btn color="primary" @click="deleteSchedule">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 该div属于管理员，此处添加v-if="管理员标识" -->
    <div v-if="true">
      <!-- 导航的面包屑布局 -->
      <div style="background-color: #fff;padding:12px">
        <Breadcrumbs />
      </div>
      <!-- 登录用户基本信息 -->
      <v-card max-width="344" style="margin:10px 0 0 10px">
        <v-card-text>
          <v-avatar size="150px">
            <v-img v-if="staffInfo =='蒋轩海'" src="@/assets/avatar.jpg" />
            <v-img v-else src="@/assets/avatar2.jpeg" />
          </v-avatar>
          <div class="card-main-content">
            <h2 style="margin: 0 0 8px 0">欢迎，{{staffName}}</h2>
            <div style="font-weight: 700;color: gray">{{roleName}}</div>
          </div>
        </v-card-text>
        <div style="padding: 0 8px;width:100%;height:2px">
          <div style="background: #CCCCCC;width:100%;height:2px"></div>
        </div>
        <v-card-actions>
          <span
            class="gray"
            style="font-weight: 600;color: gray;font-size: 15px"
          >当前时间: {{nowTime | formatterDate()}}</span>
        </v-card-actions>
      </v-card>
      <!-- 员工状态判断，转正，离职，调动等 -->
      <div class="main-staffmanage-style">
        <div class="child-div1" v-for="(item, index) in staffConditionItems" :key="index">
          <span style="font-weight: 400;font-size: 38px;margin-left: 18px">{{item.value}}</span>
          <span style="font-size: 18px">人</span>
          <v-icon
            size="64px"
            style="position: absolute;right:8px"
            :style="{color:item.color}"
          >{{item.icon}}</v-icon>
          <div :style="{'background':item.divColor}">
            {{item.text}}
            <v-icon color="#fff">mdi-chevron-right</v-icon>
          </div>
        </div>
      </div>
      <!-- 代办事项 -->
      <div class="main-todo-style" :class="fullScreen==1?'change-height':''">
        <div style="font-weight: 600;padding: 14px;font-size: 18px;border-bottom:1px solid #ccc">
          <span>待办事项</span>
          <v-btn
            text
            color="primary"
            @click="addSchedule"
            style="line-height: 18px;position: absolute;right:10px;top:6px"
          >添加</v-btn>
        </div>
        <div
          style="border-bottom:1px solid #ccc"
          v-for="(item, index) in scheduleItems"
          :key="index"
        >
          <div style="display: inline-block">
            <v-checkbox
              class="checkbox-style"
              :class="item.isDone?'checkbox-label-style':''"
              dense
              :true-value="1"
              :false-value="0"
              color="primary"
              v-model="item.isDone"
              :label="item.text+'。请在'+item.doneTime+'前完成。'"
            ></v-checkbox>
          </div>
          <div style="float: right;margin-right:16px">
            <v-btn icon style="width:24px" @click="changeSchedule(item.text,item.doneTime,index)">
              <v-icon size="16px" color="#409EFF">mdi-lead-pencil</v-icon>
            </v-btn>
            <v-btn icon style="width:24px" @click="showDeleteScheduleDialog(index)">
              <v-icon size="16px" color="#FF0000">mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <!-- 公告查看 -->
      <div class="news-look-style" :class="fullScreen==1?'change-gonggao-height':''">
        <h3 style="text-align: center;padding: 8px">公司公告</h3>
        <v-divider></v-divider>
        <div
          class="news-main-content"
          @click="showDetailNews(index)"
          v-for="(item, index) in newsItems"
          :key="index"
          :title="item.text"
        >{{index+1}}、{{item.newsContent}}</div>
      </div>
    </div>
    <v-speed-dial
      v-show="roleName=='管理员'"
      v-model="fab"
      bottom
      right
      fixed
      open-on-hover
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="#0ca192" dark fab>
          <v-icon v-if="fab" size="32px">mdi-close</v-icon>
          <v-icon v-else size="32px">mdi-account-cog-outline</v-icon>
        </v-btn>
      </template>
      <v-tooltip left color="green">
        <template v-slot:activator="{ on }">
          <v-btn fab dark small color="green" v-on="on" @click="floatBtn('审批中心')">
            <v-icon>mdi-file-document-edit</v-icon>
          </v-btn>
        </template>
        <span style="color: #fff">审批</span>
      </v-tooltip>
      <v-tooltip left color="indigo">
        <template v-slot:activator="{ on }">
          <v-btn fab dark small color="indigo" v-on="on" @click="floatBtn('添加用户')">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span style="color: #fff">添加用户</span>
      </v-tooltip>
      <v-tooltip left color="red">
        <template v-slot:activator="{ on }">
          <v-btn fab dark small color="red" v-on="on" @click="floatBtn('员工花名册')">
            <v-icon>mdi-account-group</v-icon>
          </v-btn>
        </template>
        <span style="color: #fff">花名册</span>
      </v-tooltip>
    </v-speed-dial>
  </div>
</template>
<script>
import Breadcrumbs from "./Breadcrumbs";

export default {
  components: {
    Breadcrumbs
  },
  data() {
    return {
      roleName: "",
      staffName: "",
      fab: false,
      //当前时间
      nowTime: null,
      selectedScheduleIndex: 0,
      //待办事项dialog的标题
      scheduleTitle: "添加待办事项",
      deleteScheduleDialog: false,
      showDetailNewsDialog: false,
      showDetailNewsIndex: 0,
      showErrorDialog: false,
      //show待办事项的dialog
      addScheduleDialog: false,
      //添加待办事项文本框的value
      scheduleItem: {
        doneTime: "",
        text: ""
      },
      //待办事项列表数组
      scheduleItems: [],
      //公告列表
      newsItems: null,
      showTimePicker: false,
      //顶部面包屑数组
      breadItems: [
        {
          text: "首页",
          disabled: false,
          href: "#"
        },
        {
          text: "Link 1",
          disabled: false,
          href: "#"
        },
        {
          text: "待实现",
          disabled: false,
          href: "#"
        }
      ],
      staffConditionItems: [
        {
          text: "在职",
          value: 0,
          icon: "mdi-file-account",
          color: "#19AA8D",
          divColor: "linear-gradient(to right, #19AA8D,#7DEFDC)"
        },
        {
          text: "实习",
          value: 0,
          icon: "mdi-calendar-plus",
          color: "#3391C1",
          divColor: "linear-gradient(to right, #3391C1,#79D0FD)"
        },
        {
          text: "兼职",
          value: 0,
          icon: "mdi-account-switch",
          color: "#DFB54F",
          divColor: "linear-gradient(to right, #DFB54F,#F0D9A4)"
        },
        {
          text: "离职",
          value: 0,
          icon: "mdi-briefcase-remove",
          color: "rgb(11, 253, 241)",
          divColor:
            "linear-gradient(to right, rgb(11, 253, 241),rgb(114, 190, 200))"
        }
      ]
    };
  },
  computed: {
    /**
     * @description 全屏切换时，各盒子拉伸以适应高度
     */
    fullScreen() {
      return this.$store.state.fullscreenFlag;
    },
    staffInfo() {
      return this.$store.state.staffName;
    }
  },
  /**
   * @description 挂载后立即开启定时器
   */
  mounted() {
    this.startInterval();
    this.init();
  },
  methods: {
    init() {
      this.$axios
        .get("/api/HomePage")
        .then(res => {
          this.scheduleItems = res.data;
          console.log(this.scheduleItems);
        })
        .catch(reason => {
          console.log(reason);
        });
      this.$axios
        .get("/api/HomePage/newsInfo")
        .then(res => {
          this.newsItems = res.data;
          console.log("newsItems");
          console.log(this.newsItems);
        })
        .catch(reason => {
          console.log(reason);
        });
      this.$axios
        .get("/api/HomePage/UserInfo", {
          params: {
            staffNum: this.$store.state.staffNum
          }
        })
        .then(res => {
          console.log(res.data);
          this.staffName = res.data.staffName;
          this.roleName = res.data.roleName;
          this.$store.commit("getStaffName", this.staffName);
        });
      this.$axios
        .get("/api/HomePage/staffInfo")
        .then(res => {
          console.log(res.data);
          this.staffConditionItems[0].value = res.data.filter(item => {
            return item.workType == "在职";
          }).length;
          this.staffConditionItems[1].value = res.data.filter(item => {
            return item.workType == "实习";
          }).length;
          this.staffConditionItems[2].value = res.data.filter(item => {
            return item.workType == "兼职";
          }).length;
          this.staffConditionItems[3].value = res.data.filter(item => {
            return item.workType == "离职";
          }).length;
        })
        .catch(reason => {
          console.log(reason);
        });
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
    floatBtn(val) {
      switch (val) {
        case "审批中心":
          this.$store.commit("addBread", {
            text: val,
            disabled: false,
            href: this.changeRouterNametoUrl(val)
          });
          this.$router.push({ name: val });
          break;
        case "员工花名册":
          this.$store.commit("addBread", {
            text: val,
            disabled: false,
            href: this.changeRouterNametoUrl(val)
          });
          this.$router.push({ name: val });
          break;
        case "添加用户":
          this.$store.commit("addBread", {
            text: val,
            disabled: false,
            href: this.changeRouterNametoUrl(val)
          });
          this.$router.push({ name: val });
          break;
      }
    },
    /**
     * @description 时间查看
     */
    startInterval() {
      setInterval(() => {
        this.nowTime = new Date();
      }, 800);
    },
    /**
     * @description 保存待办事项保存
     */
    saveSchedule() {
      if (this.scheduleItem.doneTime == "" || this.scheduleItem.text == "") {
        this.showErrorDialog = true;
        return;
      }
      let copyDoneTime = this.scheduleItem.doneTime;
      let copyText = this.scheduleItem.text;
      if (this.scheduleTitle == "添加待办事项") {
        this.$axios
          .post("/api/HomePage/add", {
            isDone: 0,
            doneTime: this.scheduleItem.doneTime,
            text: this.scheduleItem.text
          })
          .then(res => {
            if (res.data == "200") {
              this.scheduleItems.push({
                isDone: 0,
                doneTime: copyDoneTime,
                text: copyText
              });
            }
          })
          .catch(reason => {
            console.log(reason);
          });
      } else {
        this.$axios
          .post("/api/HomePage/update", {
            scheduleId: this.scheduleItems[this.selectedScheduleIndex]
              .scheduleId,
            isDone: 0,
            doneTime: this.scheduleItem.doneTime,
            text: this.scheduleItem.text
          })
          .then(res => {
            if (res.data == "200") {
              this.scheduleItems[
                this.selectedScheduleIndex
              ].doneTime = copyDoneTime;
              this.scheduleItems[this.selectedScheduleIndex].text = copyText;
            }
          })
          .catch(reason => {
            console.log(reason);
          });
      }
      this.closeScheduleDialog();
    },
    /**
     * @description 关闭‘添加代办事项’dialog
     */
    closeScheduleDialog() {
      this.addScheduleDialog = false;
      this.$nextTick(() => {
        this.scheduleItem.doneTime = "";
        this.scheduleItem.text = "";
      });
    },
    /**
     * @description 添加待办事项
     */
    addSchedule() {
      this.scheduleTitle = "添加待办事项";
      this.addScheduleDialog = true;
    },
    /**
     * @description 修改待办事项
     * @param text 选择待办事项内容
     * @param doneTime 选择待办事项完成时间
     * @param index 当前选择的索引
     */
    changeSchedule(text, doneTime, index) {
      this.scheduleItem.text = text;
      this.scheduleItem.doneTime = doneTime;
      this.scheduleTitle = "编辑待办事项";
      this.selectedScheduleIndex = index;
      this.addScheduleDialog = true;
    },
    /**
     * @description show删除dialog
     */
    showDeleteScheduleDialog(index) {
      this.selectedScheduleIndex = index;
      this.deleteScheduleDialog = true;
    },
    /**
     * @description 删除所选择的待办事项
     * @param index 当前选择的索引
     */
    deleteSchedule() {
      this.$axios
        .post("/api/HomePage/delete", {
          text: this.scheduleItems[this.selectedScheduleIndex].text
        })
        .then(res => {
          if (res.data == "200") {
            this.scheduleItems.splice(this.selectedScheduleIndex, 1);
            this.deleteScheduleDialog = false;
          }
        })
        .catch(reason => {
          console.log(reason);
        });
    },
    /**
     * @description show公告详细
     * @param index 当前选择的索引
     */
    showDetailNews(index) {
      this.showDetailNewsDialog = true;
      this.showDetailNewsIndex = index;
    }
  },

  filters: {
    /**
     * @description 时间格式化
     */
    formatterDate(val) {
      let date = new Date(val);
      let month = date.getMonth() + 1;
      return `${date.getFullYear()}/${month.toString().padStart(2, 0)}/${date
        .getDate()
        .toString()
        .padStart(2, 0)} ${date
        .getHours()
        .toString()
        .padStart(2, 0)}:${date
        .getMinutes()
        .toString()
        .padStart(2, 0)}:${date
        .getSeconds()
        .toString()
        .padStart(2, 0)}`;
    }
  },
  watch: {
    /**
     * @description 添加待办事项有未输入项时，提示框的出现时间
     * @param newValue 提示框状态
     */
    showErrorDialog(newValue) {
      if (newValue) {
        setTimeout(() => {
          this.showErrorDialog = false;
        }, 2000);
      }
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
.v-card {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}
.v-card >>> .v-card__text {
  position: relative;
}
.v-card >>> .v-card__actions {
  background-image: url("../../assets/home-back.jpg") no-repeat;
}
.card-main-content {
  display: inline-block;
  padding-bottom: 16px;
  padding-right: 24px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -28%);
}
.card-main-content h1,
div {
  color: black;
}
.main-staffmanage-style {
  width: 700px;
  height: 120px;
  position: absolute;
  padding: 5px;
  top: 55px;
  left: 370px;
  display: flex;
}
.child-div1 {
  flex: 1;
  height: 100px;
  background-color: #fff;
  margin: 0 5px;
  border-radius: 5px;
  position: relative;
}
.child-div1 div {
  height: 30px;
  width: 100%;
  text-align: right;
  position: absolute;
  bottom: 0;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  line-height: 30px;
}
.main-todo-style {
  width: 680px;
  height: 320px;
  position: absolute;
  overflow: auto;
  overflow-x: hidden;
  top: 180px;
  left: 380px;
  border-radius: 5px;
  background-color: #fff;
}
.change-height {
  min-height: 462px;
}
.checkbox-style {
  padding-left: 10px;
  margin-top: 0 !important;
  padding-top: 8px !important;
}
.checkbox-style >>> .v-input__control {
  max-height: 30px;
}
.checkbox-style >>> .v-icon.v-icon--dense {
  font-size: 20px;
  color: #2b81d6;
}
.checkbox-style >>> .v-label {
  font-size: 14px;
  color: #666;
}
.v-btn >>> .v-btn__content {
  width: 24px;
}
.news-look-style {
  width: 344px;
  height: 200px;
  margin: 20px 0 0 8px;
  background-color: #fff;
  border-radius: 5px;
  overflow: auto;
}
.change-gonggao-height {
  min-height: 345px;
}
.text-style {
  border: 1px solid #ccc;
  width: 320px;
  margin-left: 15px;
  outline: 0;
  border-radius: 5px;
}
.text-style:focus {
  border: 1px solid #2b81d6;
}
.top-show-errormsg-alert {
  z-index: 10;
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
}
.top-show-errormsg-alert >>> .v-alert__content {
  width: 220px;
}
.checkbox-label-style >>> .v-label {
  color: rgb(165, 162, 162);
  text-decoration: line-through;
}
.news-main-content {
  border-bottom: 1px solid #aaa;
  padding-left: 0 8px 0 8px;
  cursor: pointer;
}
.news-main-content:hover {
  background-color: #60d6ca;
  border-radius: 5px;
}
</style>