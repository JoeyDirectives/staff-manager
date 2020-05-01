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
              <td>{{item.applicateName}}</td>
              <td>{{item.staffNum}}</td>
              <td>{{item.applicateDate}}</td>
              <td>{{item.startDate}}</td>
              <td>{{item.endDate}}</td>
              <td>{{item.applicateReason}}</td>
              <td>
                <v-btn icon>
                  <v-icon color="#0ca192" @click="gotoApprove(index)">{{item.details}}</v-icon>
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
          text: "申请日期",
          align: "center",
          sortable: true,
          value: "applicateDate"
        },
        {
          text: "开始时间",
          align: "center",
          sortable: true,
          value: "startDate"
        },
        {
          text: "结束时间",
          align: "center",
          sortable: true,
          value: "endDate"
        },
        {
          text: "请假事由",
          align: "center",
          sortable: true,
          value: "applicateReason"
        },
        {
          text: "审批",
          align: "center",
          sortable: false,
          value: "details"
        }
      ],
      leaveItems: [
        {
          applicateNum: "QJ-2020-02-03",
          applicateName: "张三",
          staffNum: "048",
          applicateDate: "2016-02-05 12:59:12",
          startDate: "2016-02-05 12:59:12",
          endDate: "2016-02-05 12:59:12",
          applicateReason: "啊手机打开拉萨啊大苏打实打实大苏打",
          details: "mdi-arrow-up-bold-box-outline"
        },
        {
          applicateNum: "QJ-2020-02-03",
          applicateName: "历史",
          staffNum: "048",
          applicateDate: "2016-02-05 12:59:12",
          startDate: "2016-02-05 12:59:12",
          endDate: "2016-02-05 12:59:12",
          applicateReason: "啊手机打开拉萨啊大苏打实打实大苏打",
          details: "mdi-arrow-up-bold-box-outline"
        },
        {
          applicateNum: "QJ-2020-02-03",
          applicateName: "王五",
          staffNum: "048",
          applicateDate: "2016-02-05 12:59:12",
          startDate: "2016-02-05 12:59:12",
          endDate: "2016-02-05 12:59:12",
          applicateReason: "啊手机打开拉萨啊大苏打实打实大苏打",
          details: "mdi-arrow-up-bold-box-outline"
        }
      ]
    };
  },
  methods: {
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
      this.leaveItems.splice(this.selectedIndex, 1);
      //todo
      this.makesureDialog = false;
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
.data-table >>> th:nth-child(8) {
  border: 1px solid #aaa;
}
.data-table >>> td:nth-child(8) {
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