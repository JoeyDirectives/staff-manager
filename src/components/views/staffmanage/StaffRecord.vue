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
          <v-btn color="primary" @click="deleteRecord">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert
      type="success"
      class="top-show-successmsg-alert"
      v-if="showSuccessDialog"
      max-width="500px"
    >保存成功！</v-alert>
    <v-card>
      <v-card-title>
        <v-btn
          @click="addRecord()"
          color="#1AB394"
          style="color:#fff;font-size:14px;margin-left:5px"
        >
          新增档案
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
        :items="recordItems"
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
                <v-overflow-btn
                  style="width:100%;height:100%;margin:0 0 2px 0"
                  :items="positionItems"
                  v-model="item.position"
                  @focus="selectText($event)"
                ></v-overflow-btn>
              </td>
              <td style="padding:0">
                <v-overflow-btn
                  style="width:100%;height:100%;margin:0 0 2px 0"
                  :items="departmentItems"
                  @focus="selectText($event)"
                  v-model="item.department"
                ></v-overflow-btn>
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
                  :items="educationItems"
                  @focus="selectText($event)"
                  v-model="item.education"
                ></v-overflow-btn>
              </td>
              <td style="padding:0">
                <input
                  style="width:100%;height:100%;margin:0 0 0 5px;outline:none"
                  type="text"
                  @focus="selectText($event)"
                  v-model="item.phoneNum"
                />
              </td>
              <td style="padding:0">
                <input
                  style="width:100%;height:100%;margin:0 0 0 5px;outline:none"
                  type="text"
                  @focus="selectText($event)"
                  v-model="item.address"
                />
              </td>
              <td style="padding:0">
                <input
                  style="width:100%;height:100%;margin:0 0 0 5px;outline:none"
                  type="text"
                  @focus="selectText($event)"
                  v-model="item.nationality"
                />
              </td>
              <td style="padding:0">
                <input
                  style="width:100%;height:100%;margin:0 0 0 5px;outline:none"
                  type="text"
                  @focus="selectText($event)"
                  v-model="item.workEmail"
                />
              </td>
              <td style="padding:0">
                <v-overflow-btn
                  style="width:100%;height:100%;margin:0 0 2px 0"
                  :items="politicsStatusItems"
                  @focus="selectText($event)"
                  v-model="item.politicsStatus"
                ></v-overflow-btn>
              </td>
              <td style="padding:0">
                <v-overflow-btn
                  style="width:100%;height:100%;margin:0 0 2px 0"
                  :items="maritalStatusItems"
                  @focus="selectText($event)"
                  v-model="item.maritalStatus"
                ></v-overflow-btn>
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
      positionItems: [
        "董事长",
        "人事部长",
        "项目经理",
        "部长",
        "项目组长",
        "程序员"
      ],
      departmentItems: ["开发部", "设计部", "人事部", "后勤部"],
      educationItems: ["大专", "本科", "研究生"],
      politicsStatusItems: ["党员", "团员", "群众"],
      maritalStatusItems: ["已婚", "未婚"],
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
          width: 100
        },
        {
          text: "职位",
          align: "center",
          sortable: true,
          value: "position",
          width: 130
        },
        {
          text: "部门",
          align: "center",
          sortable: true,
          value: "department",
          width: 130
        },
        {
          text: "证件号码",
          align: "center",
          sortable: true,
          value: "IDNum",
          width: 150
        },
        {
          text: "学历",
          align: "center",
          sortable: true,
          value: "education",
          width: 130
        },
        {
          text: "手机号码",
          align: "center",
          sortable: true,
          value: "phoneNum",
          width: 150
        },
        {
          text: "籍贯",
          align: "center",
          sortable: true,
          value: "address",
          width: 130
        },
        {
          text: "国籍",
          align: "center",
          sortable: true,
          value: "nationality",
          width: 100
        },
        {
          text: "工作邮箱",
          align: "center",
          sortable: true,
          value: "workEmail",
          width: 150
        },
        {
          text: "政治面貌",
          align: "center",
          sortable: true,
          value: "politicsStatus",
          width: 100
        },
        {
          text: "婚姻状况",
          align: "center",
          sortable: true,
          value: "maritalStatus",
          width: 100
        },
        {
          text: "操作",
          align: "center",
          sortable: false,
          width: 200
        }
      ],
      recordItems: [
        {
          staffNum: "101",
          staffName: "蒋轩海",
          position: "人事部长",
          department: "人事部",
          IDNum: "51062318521478",
          education: "研究生",
          phoneNum: "12345678902",
          address: "四川德阳",
          nationality: "中国",
          workEmail: "12345678902@136.com",
          politicsStatus: "党员",
          maritalStatus: "已婚"
        },
        {
          staffNum: "102",
          staffName: "周存富",
          position: "程序员",
          department: "开发部",
          IDNum: "51062315213648",
          education: "研究生",
          phoneNum: "13625214568",
          address: "四川成都",
          nationality: "中国",
          workEmail: "13625214568@136.com",
          politicsStatus: "团员",
          maritalStatus: "未婚"
        },
        {
          staffNum: "103",
          staffName: "林晓霖",
          position: "项目经理",
          department: "开发部",
          IDNum: "51062315874569",
          education: "本科",
          phoneNum: "17785261547",
          address: "四川南充",
          nationality: "中国",
          workEmail: "17785261547@136.com",
          politicsStatus: "党员",
          maritalStatus: "已婚"
        },
        {
          staffNum: "104",
          staffName: "侯弘彬",
          position: "程序员",
          department: "设计部",
          IDNum: "51062318954569",
          education: "本科",
          phoneNum: "14525896324",
          address: "四川绵阳",
          nationality: "中国",
          workEmail: "14525896324@136.com",
          politicsStatus: "党员",
          maritalStatus: "已婚"
        },
        {
          staffNum: "105",
          staffName: "赵丽伟",
          position: "项目组长",
          department: "开发部",
          IDNum: "51062318954560",
          education: "本科",
          phoneNum: "14527896324",
          address: "北京朝阳",
          nationality: "中国",
          workEmail: "14527896324@136.com",
          politicsStatus: "党员",
          maritalStatus: "未婚"
        },
        {
          staffNum: "106",
          staffName: "文祥",
          position: "项目组长",
          department: "开发部",
          IDNum: "51062319871521",
          education: "本科",
          phoneNum: "22378514524",
          address: "四川南充",
          nationality: "中国",
          workEmail: "22378514524@136.com",
          politicsStatus: "党员",
          maritalStatus: "未婚"
        },
        {
          staffNum: "107",
          staffName: "李四",
          position: "程序员",
          department: "开发部",
          IDNum: "51062319781471",
          education: "本科",
          phoneNum: "14785236923",
          address: "四川广安",
          nationality: "中国",
          workEmail: "14785236923@136.com",
          politicsStatus: "党员",
          maritalStatus: "未婚"
        }
      ]
    };
  },
  methods: {
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
     * @description 删除员工档案
     */
    deleteRecord() {
      this.recordItems.splice(this.nowIndex, 1);
      this.deleteDialog = false;
    },
    /**
     * @description 添加员工档案
     */
    addRecord() {
      this.recordItems.push({
        staffNum: "",
        staffName: "",
        position: "董事长",
        department: "开发部",
        IDNum: "",
        education: "大专",
        phoneNum: "",
        address: "",
        nationality: "",
        workEmail: "",
        politicsStatus: "党员",
        maritalStatus: "已婚"
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
    refresh() {
      this.recordItems = [
        {
          staffNum: "101",
          staffName: "蒋轩海",
          position: "人事部长",
          department: "人事部",
          IDNum: "51062318521478",
          education: "研究生",
          phoneNum: "12345678902",
          address: "四川德阳",
          nationality: "中国",
          workEmail: "12345678902@136.com",
          politicsStatus: "党员",
          maritalStatus: "已婚"
        },
        {
          staffNum: "102",
          staffName: "周存富",
          position: "程序员",
          department: "开发部",
          IDNum: "51062315213648",
          education: "研究生",
          phoneNum: "13625214568",
          address: "四川成都",
          nationality: "中国",
          workEmail: "13625214568@136.com",
          politicsStatus: "团员",
          maritalStatus: "未婚"
        },
        {
          staffNum: "103",
          staffName: "林晓霖",
          position: "项目经理",
          department: "开发部",
          IDNum: "51062315874569",
          education: "本科",
          phoneNum: "17785261547",
          address: "四川南充",
          nationality: "中国",
          workEmail: "17785261547@136.com",
          politicsStatus: "党员",
          maritalStatus: "已婚"
        },
        {
          staffNum: "104",
          staffName: "侯弘彬",
          position: "程序员",
          department: "设计部",
          IDNum: "51062318954569",
          education: "本科",
          phoneNum: "14525896324",
          address: "四川绵阳",
          nationality: "中国",
          workEmail: "14525896324@136.com",
          politicsStatus: "党员",
          maritalStatus: "已婚"
        },
        {
          staffNum: "105",
          staffName: "赵丽伟",
          position: "项目组长",
          department: "开发部",
          IDNum: "51062318954560",
          education: "本科",
          phoneNum: "14527896324",
          address: "北京朝阳",
          nationality: "中国",
          workEmail: "14527896324@136.com",
          politicsStatus: "党员",
          maritalStatus: "未婚"
        },
        {
          staffNum: "106",
          staffName: "文祥",
          position: "项目组长",
          department: "开发部",
          IDNum: "51062319871521",
          education: "本科",
          phoneNum: "22378514524",
          address: "四川南充",
          nationality: "中国",
          workEmail: "22378514524@136.com",
          politicsStatus: "党员",
          maritalStatus: "未婚"
        },
        {
          staffNum: "107",
          staffName: "李四",
          position: "程序员",
          department: "开发部",
          IDNum: "51062319781471",
          education: "本科",
          phoneNum: "14785236923",
          address: "四川广安",
          nationality: "中国",
          workEmail: "14785236923@136.com",
          politicsStatus: "党员",
          maritalStatus: "未婚"
        }
      ];
    }
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
.data-table >>> th:nth-child(13) {
  border: 1px solid #aaa;
}
.data-table >>> td:nth-child(13) {
  border: 1px solid #aaa;
}
.data-table >>> td:nth-child(10) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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