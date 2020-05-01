<template>
  <div>
    <!-- 导航的面包屑布局 -->
    <div style="background-color: #fff;padding:12px">
      <Breadcrumbs />
    </div>
    <div class="top-div-style">
      <div class="top-in-div-style" v-for="(item, index) in topItems" :key="index">
        <div>
          <div>{{item.text}}</div>
          <div>{{item.count}}人</div>
        </div>
      </div>
    </div>
    <v-dialog v-model="deleteDialog" width="380px">
      <v-card>
        <v-card-title style="background: #0ca192;">
          提示
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="deleteDialog=false">
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
          <v-btn @click="deleteDialog = false">取消</v-btn>
          <v-btn color="primary" @click="deleteStaff">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert
      type="success"
      class="top-show-successmsg-alert"
      v-if="showSuccessDialog"
      max-width="500px"
      dismissible
    >添加成功！</v-alert>
    <v-dialog v-model="showAddStaffDialog" width="750px" persistent>
      <v-card>
        <v-card-title style="background: #0ca192!important;font-weight: 600">
          {{title}}
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="close">
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
          <v-form v-model="valid">
            <div style="height: 10px"></div>
            <div class="div-display">
              <span class="span-style">工号</span>
              <v-text-field
                dense
                class="select-style"
                style="margin-left: 73px;"
                label="请输入工号"
                :rules="numRules"
                v-model="addStaffInmode.staffNum"
                outlined
              ></v-text-field>
              <br />
              <div style="height: 16px"></div>
              <span class="span-style">姓名</span>
              <v-text-field
                dense
                class="select-style"
                style="margin-left: 73px;"
                label="请输入姓名"
                v-model="addStaffInmode.staffName"
                outlined
              ></v-text-field>
              <span class="span-style">部门</span>
              <v-select
                dense
                class="select-style"
                style="margin-left: 55px;"
                v-model="addStaffInmode.staffPart"
                :items="staffPartItems"
                label="请输入部门"
                outlined
              ></v-select>
              <br />
              <div style="height: 16px"></div>
              <span class="span-style">证件类型</span>
              <v-select
                dense
                class="select-style"
                style="margin-left: 40px;"
                v-model="addStaffInmode.cardType"
                :items="cardTypeItems"
                label="请输入证件类型"
                outlined
              ></v-select>
              <span class="span-style">证件号</span>
              <v-text-field
                dense
                class="select-style"
                style="margin-left: 40px;"
                label="请输入证件号"
                :rules="numRules"
                v-model="addStaffInmode.cardNum"
                outlined
              ></v-text-field>
              <br />
              <div style="height: 16px"></div>
              <span class="span-style">手机号码</span>
              <v-text-field
                dense
                class="select-style"
                style="margin-left: 40px;"
                label="请输入手机号码"
                :rules="numRules"
                v-model="addStaffInmode.phoneNum"
                outlined
              ></v-text-field>
              <span class="span-style">在职状态</span>
              <v-select
                dense
                class="select-style"
                style="margin-left: 25px;"
                v-model="addStaffInmode.workType"
                :items="workSelectItems"
                label="请输入在职状态"
                outlined
              ></v-select>
              <div style="height:100px"></div>
            </div>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="close">取消</v-btn>
          <v-btn color="primary" @click="addStaff(1)">{{btnInfo}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        <v-btn
          @click="showAddDialog()"
          color="#1AB394"
          style="color:#fff;font-size:14px;margin-left:5px"
        >
          新增员工
          <v-icon right>mdi-plus-circle</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          dense
          class="select-style"
          v-model="search"
          append-icon="mdi-magnify"
          label="输入检索关键字"
          outlined
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        class="data-table"
        dense
        :page.sync="page"
        @page-count="pageCount = $event"
        :search="search"
        :headers="headers"
        :items="staffItems"
        hide-default-footer
        :items-per-page="4"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="(item,index) in items" :key="index" @click="getIndex(index)">
              <td>{{item.staffNum}}</td>
              <td>{{item.staffName}}</td>
              <td>{{item.staffPart}}</td>
              <td>{{item.entryDate}}</td>
              <td>{{item.cardType}}</td>
              <td>{{item.cardNum}}</td>
              <td>{{item.phoneNum}}</td>
              <td>{{item.workType}}</td>
              <td>
                <v-btn @click="changeStaffinfo(index)" color="#1C84C6" style="color:#fff" small>
                  修改
                  <v-icon right small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  @click="showDeleteDialog()"
                  color="#ED5565"
                  style="color:#fff;margin-left:5px"
                  small
                >
                  删除
                  <v-icon right small>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
      <div style="position: relative;background:#fff;height:80px">
        <v-pagination v-model="page" class="my-4 page-count-style" :length="pageCount"></v-pagination>
        <span class="pagination-style">当前第{{page}}页，共{{pageCount}}页</span>
      </div>
    </v-card>
  </div>
</template>
<script>
import Breadcrumbs from "../Breadcrumbs";

export default {
  components: {
    Breadcrumbs
  },
  data() {
    return {
      valid: false,
      title: "",
      btnInfo: "",
      numRules: [v => isNaN(Number(v)) == false || "工号只能为数字"],
      showErrorDialog: false,
      showSuccessDialog: false,
      showAddStaffDialog: false,
      deleteDialog: false,
      nowIndex: 0,
      workSelectItems: ["在职", "实习", "兼职", "离职"],
      staffPartItems: ["开发部", "设计部", "人事部", "后勤部"],
      cardTypeItems: ["居民身份证", "户口簿"],
      topItems: [
        {
          text: "在职",
          count: 0
        },
        {
          text: "实习",
          count: 0
        },
        {
          text: "兼职",
          count: 0
        },
        {
          text: "离职",
          count: 0
        }
      ],
      search: "",
      page: 1,
      pageCount: 0,
      headers: [
        {
          text: "工号",
          align: "center",
          sortable: true,
          value: "staffNum"
        },
        {
          text: "姓名",
          align: "center",
          sortable: true,
          value: "staffName"
        },
        {
          text: "部门",
          align: "center",
          sortable: true,
          value: "staffPart"
        },
        {
          text: "入职时间",
          align: "center",
          sortable: true,
          value: "entryDate"
        },
        {
          text: "证件类型",
          align: "center",
          sortable: true,
          value: "cardType"
        },
        {
          text: "证件号",
          align: "center",
          sortable: true,
          value: "cardNum"
        },
        {
          text: "手机号码",
          align: "center",
          sortable: true,
          value: "phoneNum"
        },
        {
          text: "在职状态",
          align: "center",
          sortable: true,
          value: "workType"
        },
        {
          text: "操作",
          align: "center",
          sortable: false,
          value: "workType"
        }
      ],
      addStaffInmode: {
        staffNum: "",
        staffName: "",
        staffPart: "",
        entryDate: "",
        cardType: "",
        cardNum: "",
        phoneNum: "",
        workType: ""
      },
      staffItems: [
        {
          staffNum: "001",
          staffName: "张三",
          staffPart: "开发部",
          entryDate: "2020-12-01 12:08:12",
          cardType: "居民身份证",
          cardNum: "51062319851318",
          phoneNum: "1234567890",
          workType: "在职"
        },
        {
          staffNum: "002",
          staffName: "历史",
          staffPart: "开发部",
          entryDate: "2020-12-01 12:08:12",
          cardType: "居民身份证",
          cardNum: "51062319851318",
          phoneNum: "1234567890",
          workType: "在职"
        },
        {
          staffNum: "002",
          staffName: "历史",
          staffPart: "开发部",
          entryDate: "2020-12-01 12:08:12",
          cardType: "居民身份证",
          cardNum: "51062319851318",
          phoneNum: "1234567890",
          workType: "实习"
        }
      ]
    };
  },
  created() {
    this.judgeType();
  },
  updated() {
    this.judgeType();
  },
  methods: {
    /**
     * @description 关闭对话框
     */
    close() {
      this.showAddStaffDialog = false;
      for (let el in this.addStaffInmode) {
        this.addStaffInmode[el] = "";
      }
    },
    /**
     * @description 修改员工信息
     */
    changeStaffinfo(index) {
      for (let el in this.addStaffInmode) {
        this.addStaffInmode[el] = this.staffItems[index][el];
      }
      this.title = "修改员工";
      this.btnInfo = "保存";
      this.showAddStaffDialog = true;
    },
    /**
     * @description 删除员工
     */
    deleteStaff() {
      this.staffItems.splice(this.nowIndex, 1);
      this.deleteDialog = false;
    },
    /**
     * @description 获取选取行索引
     */
    getIndex(index) {
      this.nowIndex = index;
      console.log(index);
    },
    /**
     * @description 删除popup
     */
    showDeleteDialog() {
      this.deleteDialog = true;
    },
    showAddDialog() {
      this.title = "新增员工";
      this.btnInfo = "添加";
      this.showAddStaffDialog = true;
    },
    /**
     * @description 根据在职状态分类员工
     */
    judgeType() {
      this.topItems[0].count = this.staffItems.filter(item => {
        return item.workType == "在职";
      }).length;
      this.topItems[1].count = this.staffItems.filter(item => {
        return item.workType == "实习";
      }).length;
      this.topItems[2].count = this.staffItems.filter(item => {
        return item.workType == "兼职";
      }).length;
      this.topItems[3].count = this.staffItems.filter(item => {
        return item.workType == "离职";
      }).length;
    },
    /**
     * @description 添加员工
     */
    addStaff() {
      let date = new Date();
      // 设置添加时间
      let time = ` ${date
        .getHours()
        .toString()
        .padStart(2, 0)}:${date
        .getMinutes()
        .toString()
        .padStart(2, 0)}:${date
        .getSeconds()
        .toString()
        .padStart(2, 0)}`;
      this.addStaffInmode.entryDate = date.toISOString().substr(0, 10) + time;
      for (let el in this.addStaffInmode) {
        if (this.addStaffInmode[el] == "") {
          this.showErrorDialog = true;
          return;
        }
      }
      if (this.title == "新增员工") {
        this.staffItems.push({
          staffNum: this.addStaffInmode.staffNum,
          staffName: this.addStaffInmode.staffName,
          staffPart: this.addStaffInmode.staffPart,
          entryDate: this.addStaffInmode.entryDate,
          cardType: this.addStaffInmode.cardType,
          cardNum: this.addStaffInmode.cardNum,
          phoneNum: this.addStaffInmode.phoneNum,
          workType: this.addStaffInmode.workType
        });
        this.showSuccessDialog = true;
      } else {
        for (let el in this.addStaffInmode) {
          this.staffItems[this.nowIndex][el] = this.addStaffInmode[el];
        }
      }
      for (let el in this.addStaffInmode) {
        this.addStaffInmode[el] = "";
      }
      this.showAddStaffDialog = false;
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
.v-application ul {
  padding: 0;
}
.v-content >>> .container {
  padding: 0;
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
.top-show-errormsg-alert >>> .v-alert__content {
  width: 240px;
}
.top-div-style {
  width: 1070px;
  margin: 10px 100px 0 10px;
  display: flex;
  height: 80px;
  border-top: 8px solid #0ca192 !important;
  border-left: 2px solid #0ca192 !important;
  border: 1px solid #0ca192;
  background-color: #e8f5f4;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.top-in-div-style {
  border-right: 1px solid #0ca192;
  font-size: 18px;
  font-weight: 600;
  color: #0ca192;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.select-style {
  max-width: 350px;
}
.select-style >>> label {
  font-size: 14px;
}
.select-style >>> .v-input__control {
  max-height: 40px;
}
.v-card >>> .v-card__title {
  background: #fff !important;
  font-size: 16px !important;
}
.data-table {
  margin-left: 10px;
  width: 1070px;
  height: 230px;
}
.data-table >>> td {
  height: 42px;
}
.data-table >>> th {
  background: linear-gradient(to bottom, #0ca192, #aec9c6);
  font-size: 15px;
  border-bottom: none !important;
}
.data-table >>> th .v-icon {
  font-size: 0 !important;
}
.data-table >>> th,
td {
  border: 1px solid #aaa;
  text-align: center;
  border-right: none;
}
.data-table >>> th:nth-child(9) {
  border: 1px solid #aaa;
}
.data-table >>> td:nth-child(9) {
  border: 1px solid #aaa;
}
.pagination-style {
  position: absolute;
  right: 70px;
  font-size: 16px;
  font-weight: 600;
  top: 30px;
}
.page-count-style {
  width: 280px;
  position: absolute;
  right: 150px;
}
.v-radio {
  margin-left: 10px;
}
.v-radio >>> .v-label {
  color: black;
  font-family: monospace;
}
.v-radio >>> .v-icon {
  color: black;
}
</style>