<template>
  <div>
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
          <v-icon color="#E6A23C" large style="margin-left:15px">mdi-alert-circle-outline</v-icon>确定要撤回吗？
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteScheduleDialog = false">取消</v-btn>
          <v-btn color="primary" @click="deleteApplicate">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      class="data-table"
      dense
      :page.sync="page"
      @page-count="pageCount = $event"
      :headers="headers"
      :items="undoneItems"
      hide-default-footer
      :items-per-page="7"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="(item,index) in items" :key="item.name">
            <td>{{item.applicateNum}}</td>
            <td>{{item.applicateName}}</td>
            <td>{{item.applicateDate}}</td>
            <td>{{item.applicatePerson}}</td>
            <td>{{item.doneConditions}}</td>
            <td>
              <v-btn icon>
                <v-icon
                  color="#0ca192"
                  @click="recallApplicate(index,item.applicateId)"
                >mdi-call-missed</v-icon>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      deleteScheduleDialog: false,
      selectedIndex: 0,
      selectedId: 0,
      page: 1,
      pageCount: 0,
      headers: [
        {
          text: "申请号",
          align: "center",
          sortable: true,
          value: "applicateNum"
        },
        {
          text: "申请类型",
          align: "center",
          sortable: true,
          value: "applicateName"
        },
        {
          text: "申请日",
          align: "center",
          sortable: true,
          value: "applicateDate"
        },
        {
          text: "申请人",
          align: "center",
          sortable: true,
          value: "applicatePerson"
        },
        {
          text: "完成状态",
          align: "center",
          sortable: true,
          value: "doneConditions"
        },
        {
          text: "撤回",
          align: "center",
          sortable: false,
          value: "recall"
        }
      ],
      undoneItems: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * @description 获取undone表
     */
    init() {
      this.$axios
        .get("/api/ApplicationPortal/undoneList")
        .then(res => {
          let name = this.$store.state.staffName;
          this.undoneItems = res.data.filter(item => {
            return name == item.applicatePerson;
          });
        })
        .catch(reason => {
          console.log(reason);
        });
    },
    /**
     * @description 点击撤回
     * @param index 撤回item的index
     */
    recallApplicate(index, id) {
      this.selectedIndex = index;
      this.selectedId = id;
      this.deleteScheduleDialog = true;
    },
    /**
     * @description 确认撤回事件
     */
    deleteApplicate() {
      this.$axios
        .get("/api/ApplicationPortal/deleteUndoneList", {
          params: {
            applicateId: this.selectedId
          }
        })
        .then(res => {
          if (res.data == "200") {
            //删除审批表对应数据
            console.log(this.undoneItems);
            this.$axios
              .get("/api/ApplicationPortal/deleteLeaveList", {
                params: {
                  applicateDate: this.undoneItems[this.selectedIndex]
                    .applicateDate
                }
              })
              .then(res => {
                if (res.data == "200") {
                  this.undoneItems.splice(this.selectedIndex, 1);
                  this.deleteScheduleDialog = false;
                }
              });
          }
        });
    }
  }
};
</script>
<style scoped>
.data-table {
  width: 100%;
  height: 300px;
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
.data-table >>> td:nth-child(6) {
  border-right: 1px solid #aaa;
}
.data-table >>> th:nth-child(6) {
  border-right: 1px solid #aaa;
}
.pagination-style {
  position: absolute;
  right: 10px;
  font-size: 16px;
  font-weight: 600;
  top: 30px;
}
.page-count-style {
  width: 280px;
  position: absolute;
  right: 150px;
}
</style>