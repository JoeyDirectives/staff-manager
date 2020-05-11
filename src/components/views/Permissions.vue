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
    <v-alert
      type="success"
      class="top-show-successmsg-alert"
      v-if="showSuccessDialog"
      max-width="500px"
    >保存成功！</v-alert>
    <v-card>
      <v-card-title>
        <v-btn @click="addRole()" color="#1AB394" style="color:#fff;font-size:14px;margin-left:5px">
          新增角色
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
        :items="roleItems"
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
                  :items="roleNameItems"
                  v-model="item.roleName"
                  @focus="selectText($event)"
                ></v-overflow-btn>
              </td>
              <td style="padding:0">
                <v-overflow-btn
                  style="width:100%;height:100%;margin:0 0 2px 0"
                  :items="permisMarkItems"
                  @focus="selectText($event)"
                  v-model="item.permisMark"
                ></v-overflow-btn>
              </td>
              <td style="padding:0">
                <input
                  style="width:100%;height:100%;margin:0 0 0 5px;outline:none"
                  type="text"
                  @focus="selectText($event)"
                  v-model="item.password"
                />
              </td>
              <td>{{item.createdTime}}</td>
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
import Breadcrumbs from "./Breadcrumbs";
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
      roleNameItems: ["管理员", "普通用户"],
      permisMarkItems: ["admin", "common"],
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
          text: "角色名称",
          align: "center",
          sortable: true,
          value: "roleName"
        },
        {
          text: "权限字符",
          align: "center",
          sortable: true,
          value: "permisMark"
        },
        {
          text: "密码",
          align: "center",
          sortable: true,
          value: "password",
          width: 190
        },
        {
          text: "创建时间",
          align: "center",
          sortable: true,
          value: "createdTime"
        },
        {
          text: "保存",
          align: "center",
          sortable: false,
          value: "save",
          width: 200
        }
      ],
      roleItems: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$axios.get("/api/Permissions/List").then(res => {
        this.roleItems = res.data;
        console.log(res.data);
      });
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
      this.roleItems.splice(this.nowIndex, 1);
      this.deleteDialog = false;
    },
    /**
     * @description 添加角色
     */
    addRole() {
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
      let createdTime = date.toISOString().substr(0, 10) + time;
      this.roleItems.push({
        staffNum: "",
        staffName: "",
        roleName: "管理员",
        permisMark: "admin",
        password: "",
        createdTime: createdTime
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
      console.log(this.roleItems[index]);
      this.showSuccessDialog = true;
    },
    /**
     * @description 刷新表格数据
     */
    refresh() {
      this.$axios.get("/api/Permissions/List").then(res => {
        this.roleItems = res.data;
        console.log(res.data);
      });
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