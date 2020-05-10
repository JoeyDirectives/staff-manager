<template>
  <div>
    <v-dialog v-model="makesureDialog" width="340px" style="overflow:hidden">
      <v-card>
        <v-card-title style="background: #0ca192!important">
          提示
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="makesureDialog=false">
                <v-icon color="black">mdi-close</v-icon>
              </v-btn>
            </template>
            <span>关闭</span>
          </v-tooltip>
        </v-card-title>
        <v-container>
          <v-radio-group v-model="radioGroup">
            <v-radio
              color="red"
              v-for="(item,index) in radioItems"
              :key="index"
              :label="item.label"
              :value="item.text"
            ></v-radio>
          </v-radio-group>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="makesureDialog = false">取消</v-btn>
          <v-btn color="primary" @click="accessApplicate">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        审批列表
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
        :items="leaveItems"
        hide-default-footer
        :items-per-page="7"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="(item,index) in items" :key="item.name">
              <td>{{item.applicateNum}}</td>
              <td>{{item.staffName}}</td>
              <td>{{item.staffNum}}</td>
              <td>{{item.leaveType}}</td>
              <td>{{item.applicateDate}}</td>
              <td>{{item.applicateReason}}</td>
              <td>
                <v-btn icon>
                  <v-icon color="#0ca192" @click="gotoApprove(index)">mdi-arrow-up-bold-box-outline</v-icon>
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
export default {
  data() {
    return {
      radioGroup: "1",
      radioItems: [
        {
          label: "同意此申请",
          text: "1"
        },
        {
          label: "驳回此申请",
          text: "2"
        }
      ],
      makesureDialog: false,
      selectedIndex: 0,
      search: "",
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
          text: "姓名",
          align: "center",
          sortable: true,
          value: "applicateName"
        },
        {
          text: "工号",
          align: "center",
          sortable: true,
          value: "staffNum"
        },
        {
          text: "资料类型",
          align: "center",
          sortable: true,
          value: "leaveType"
        },
        {
          text: "申请日期",
          align: "center",
          sortable: true,
          value: "applicateDate"
        },
        {
          text: "公章申请事由",
          align: "center",
          sortable: true,
          value: "applicateReason",
          width: "350px"
        },
        {
          text: "审批",
          align: "center",
          sortable: false,
          value: "details"
        }
      ],
      leaveItems: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$axios.get("/api/ExamineAndApprove/getleaveList").then(res => {
        this.leaveItems = res.data.filter(item => {
          return item.applicateNum.split("-")[0] == "GZ";
        });
        console.log(res.data);
      });
    },
    /**
     * @description 展示是否同意申请dialog
     * @param index item的index
     */
    gotoApprove(index) {
      this.selectedIndex = index;
      this.makesureDialog = true;
    },
    /**
     * @description 同意审批事件
     */
    accessApplicate() {
      // 同意审批
      if (this.radioGroup == "1") {
        // 删除选中审批
        this.$axios
          .get("/api/ExamineAndApprove/deleteLeaveApprove", {
            params: {
              approveId: this.leaveItems[this.selectedIndex].approveId
            }
          })
          .then(res => {
            if (res.data == "200") {
              let info = {
                applicateNum: this.leaveItems[this.selectedIndex].applicateNum,
                applicateName: "公章申请",
                applicateDate: this.leaveItems[this.selectedIndex]
                  .applicateDate,
                applicatePerson: this.leaveItems[this.selectedIndex].staffName,
                doneConditions: "已同意",
                applicateReason: this.leaveItems[this.selectedIndex]
                  .applicateReason
              };
              this.addToDone(info);
              this.deleteUnDone(
                this.leaveItems[this.selectedIndex].applicateDate
              );
              let done = this.leaveItems[this.selectedIndex];
              done.applicateType = "已同意";
              this.addToApproveDone(done);
              this.leaveItems.splice(this.selectedIndex, 1);
              //todo
              this.makesureDialog = false;
            }
          });
      } else {
        this.$axios
          .get("/api/ExamineAndApprove/deleteLeaveApprove", {
            params: {
              approveId: this.leaveItems[this.selectedIndex].approveId
            }
          })
          .then(res => {
            if (res.data == "200") {
              let info = {
                applicateNum: this.leaveItems[this.selectedIndex].applicateNum,
                applicateName: "公章申请",
                applicateDate: this.leaveItems[this.selectedIndex]
                  .applicateDate,
                applicatePerson: this.leaveItems[this.selectedIndex].staffName,
                doneConditions: "已驳回",
                applicateReason: this.leaveItems[this.selectedIndex]
                  .applicateReason
              };
              this.addToDone(info);
              this.deleteUnDone(
                this.leaveItems[this.selectedIndex].applicateDate
              );
              let done = this.leaveItems[this.selectedIndex];
              done.applicateType = "已驳回";
              this.addToApproveDone(done);
              this.leaveItems.splice(this.selectedIndex, 1);
              //todo
              this.makesureDialog = false;
            }
          });
      }
    },
    /**
     * @description 审批完成后添加至完成审批表
     * @param ApplicationEntity
     */
    addToApproveDone(ApplicationEntity) {
      this.$axios
        .post("/api/ExamineAndApprove/addApproveDone", ApplicationEntity)
        .then(res => {
          if (res.data == "200") {
            console.log("OK");
          }
        });
    },
    /**
     * @description 删除相应的未完成信息
     * @param applicateDate
     */
    deleteUnDone(applicateDate) {
      this.$axios
        .get("/api/ExamineAndApprove/deleteUndone", {
          params: {
            applicateDate
          }
        })
        .then(res => {
          if (res.data == "200") {
            console.log("删除成功");
          }
        });
    },
    /**
     * @description 同意或驳回请假审批后，添加到已完成申请表中
     * @param ApplicationEntity info
     */
    addToDone(ApplicationEntity) {
      this.$axios
        .post("/api/ExamineAndApprove/addDone", ApplicationEntity)
        .then(res => {
          if (res.data == "200") {
            console.log("OK");
          }
        });
    }
  }
};
</script>
<style scoped>
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
  width: 100%;
  height: 330px;
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
.data-table >>> td:nth-child(6) {
  text-align: justify;
  text-justify: newspaper;
  word-break: break-all;
}
.data-table >>> th:nth-child(7) {
  border: 1px solid #aaa;
}
.data-table >>> td:nth-child(7) {
  border: 1px solid #aaa;
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