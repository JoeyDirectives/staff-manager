<template>
  <div>
    <!-- 导航的面包屑布局 -->
    <div style="background-color: #fff;padding:12px">
      <Breadcrumbs />
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
          <v-btn color="primary" @click="deleteRole">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDatePicker1" width="320px" persistent>
      <v-date-picker
        color="#0ca192"
        v-model="leaveInfo.startDate"
        :first-day-of-week="0"
        locale="zh-cn"
      ></v-date-picker>
      <v-divider />
      <v-btn color="#0ca192" @click="getDatePicker1()">确定</v-btn>
    </v-dialog>
    <v-dialog v-model="showDatePicker2" width="320px" persistent>
      <v-date-picker
        color="#0ca192"
        v-model="leaveInfo.endDate"
        :first-day-of-week="0"
        :allowed-dates="limitDate"
        locale="zh-cn"
      ></v-date-picker>
      <v-divider />
      <v-btn color="#0ca192" @click="getDatePicker1()">确定</v-btn>
    </v-dialog>
    <v-alert
      type="success"
      class="top-show-successmsg-alert"
      v-if="showSuccessDialog"
      max-width="500px"
    >保存成功！</v-alert>
    <v-card>
      <v-card-title>
        <v-btn @click="addRole()" color="#1AB394" style="color:#fff;font-size:14px;margin-left:5px">
          新增合同
          <v-icon right>mdi-plus-circle</v-icon>
        </v-btn>
        <v-btn @click="refresh()" color="#fff" style="color:#666;font-size:14px;margin-left:5px">
          刷新
          <v-icon right>mdi-refresh</v-icon>
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
        :items="contractItems"
        hide-default-footer
        :items-per-page="5"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="(item,index) in items" :key="index" @click="getIndex(index)">
              <td style="padding:0">
                <input
                  style="width:100%;height:100%;margin:0 0 0 5px;outline:none"
                  type="text"
                  @focus="selectText($event)"
                  v-model="item.staffNum"
                />
              </td>
              <td style="padding:0">
                <input
                  style="width:100%;height:100%;margin:0 0 0 5px;outline:none"
                  type="text"
                  @focus="selectText($event)"
                  v-model="item.staffName"
                />
              </td>
              <td style="padding:0">
                <input
                  style="width:100%;height:100%;margin:0 0 0 5px;outline:none"
                  type="text"
                  @focus="selectText($event)"
                  v-model="item.IDNum"
                />
              </td>
              <td style="padding:0">
                <v-overflow-btn
                  style="width:100%;height:100%;margin:0 0 2px 0"
                  :items="contractTypeItems"
                  @focus="selectText($event)"
                  v-model="item.contractType"
                ></v-overflow-btn>
              </td>
              <td style="padding:0">
                <input
                  style="width:100%;height:100%;margin:0 0 0 5px;outline:none"
                  type="text"
                  @focus="showDatePicker(index,'start')"
                  v-model="item.startDate"
                />
              </td>
              <td>
                <input
                  style="width:100%;height:100%;margin:0 0 0 5px;outline:none"
                  type="text"
                  @focus="showDatePicker(index,'end')"
                  v-model="item.endDate"
                />
              </td>
              <td>
                <v-btn @click="saveRole(index)" color="#1C84C6" style="color:#fff" small>
                  保存
                  <v-icon right small>mdi-content-save</v-icon>
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
      search: "",
      nowIndex: 0,
      page: 1,
      pageCount: 0,
      deleteDialog: false,
      showSuccessDialog: false,
      showDatePicker1: false,
      showDatePicker2: false,
      flag: "",
      contractTypeItems: ["劳动合同", "聘用合同", "劳务合同", "三方协议"],
      headers: [
        {
          text: "工号",
          align: "center",
          sortable: true,
          value: "staffNum",
          width: 80
        },
        {
          text: "姓名",
          align: "center",
          sortable: true,
          value: "staffName",
          width: 80
        },
        {
          text: "证件号",
          align: "center",
          sortable: true,
          value: "IDNum",
          width: 150
        },
        {
          text: "合同类型",
          align: "center",
          sortable: true,
          value: "contractType",
          width: 150
        },
        {
          text: "合同开始时间",
          align: "center",
          sortable: true,
          value: "startDate",
          width: 190
        },
        {
          text: "合同结束时间",
          align: "center",
          sortable: true,
          value: "endDate"
        },
        {
          text: "操作",
          align: "center",
          sortable: false,
          width: 200
        }
      ],
      contractItems: [
        {
          staffNum: "101",
          staffName: "蒋轩海",
          IDNum: "51062318521478",
          contractType: "劳动合同",
          startDate: "2000-01-14",
          endDate: "2021-12-09"
        },
        {
          staffNum: "102",
          staffName: "周存富",
          IDNum: "51062315213648",
          contractType: "劳动合同",
          startDate: "2008-10-16",
          endDate: "2021-02-18"
        },
        {
          staffNum: "103",
          staffName: "林晓霖",
          IDNum: "51062315874569",
          contractType: "劳务合同",
          startDate: "2002-02-19",
          endDate: "2021-02-25"
        },
        {
          staffNum: "104",
          staffName: "侯弘彬",
          IDNum: "51062318954569",
          contractType: "劳动合同",
          startDate: "2003-12-01",
          endDate: "2031-02-21"
        },
        {
          staffNum: "105",
          staffName: "赵丽伟",
          IDNum: "51062318954560",
          contractType: "三方协议",
          startDate: "2009-12-08",
          endDate: "2029-02-12"
        },
        {
          staffNum: "106",
          staffName: "张三",
          IDNum: "510623198715211245",
          contractType: "三方协议",
          startDate: "2019-12-08",
          endDate: "2029-02-12"
        }
      ],
      leaveInfo: {
        startDate: new Date().toISOString().substr(0, 10),
        endDate: ""
      }
    };
  },
  methods: {
    /**
     * @description 终止时间应当大于开始时间
     * @param val date-picker当月日期
     */
    limitDate(val) {
      return val >= this.leaveInfo.startDate;
    },
    showDatePicker(index, flag) {
      this.flag = flag;
      if (flag == "start") {
        this.showDatePicker1 = true;
      } else {
        this.showDatePicker2 = true;
      }
      this.nowIndex = index;
    },
    getDatePicker1() {
      if (this.flag == "start") {
        this.contractItems[this.nowIndex].startDate = this.leaveInfo.startDate;
      } else {
        this.contractItems[this.nowIndex].endDate = this.leaveInfo.endDate;
      }
      this.showDatePicker1 = false;
      this.showDatePicker2 = false;
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
    /**
     * @description 删除员工
     */
    deleteRole() {
      this.contractItems.splice(this.nowIndex, 1);
      this.deleteDialog = false;
    },
    /**
     * @description 添加角色
     */
    addRole() {
      this.contractItems.push({
        staffNum: "",
        staffName: "",
        IDNum: "",
        contractType: "劳动合同",
        startDate: "",
        endDate: ""
      });
    },
    /**
     * @description 点击input选中文本
     */
    selectText(e) {
      e.target.select();
    },
    /**
     * @description 保存修改
     */
    saveRole(index) {
      console.log(index);
      this.showSuccessDialog = true;
    },
    /**
     * @description 刷新表格数据
     */
    refresh() {}
  },
  watch: {
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
.top-show-successmsg-alert {
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 10%;
  transform: translateX(-50%);
}
.v-application ul {
  padding: 0;
}
.v-content >>> .container {
  padding: 0;
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
  height: 320px;
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
.data-table >>> th:nth-child(7) {
  border: 1px solid #aaa;
}
.data-table >>> td:nth-child(7) {
  border: 1px solid #aaa;
}
.data-table >>> input::selection {
  background-color: rgb(9, 117, 218);
  color: #fff;
}
.data-table >>> input {
  font-size: 16px;
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
  right: 200px;
}
.v-input >>> .v-input__control {
  height: 48px;
}
.v-text-field >>> input {
  height: 50px;
}
</style>