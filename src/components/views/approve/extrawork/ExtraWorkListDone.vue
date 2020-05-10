<template>
  <div>
    <v-card>
      <v-card-title>
        已完成列表
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
            <tr v-for="(item) in items" :key="item.name">
              <td>{{item.applicateNum}}</td>
              <td>{{item.staffName}}</td>
              <td>{{item.staffNum}}</td>
              <td>{{item.applicateDate}}</td>
              <td>{{item.startDate}}</td>
              <td>{{item.endDate}}</td>
              <td>{{item.applicateReason}}</td>
              <td>{{item.applicateType}}</td>
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
          text: "加班事由",
          align: "center",
          sortable: true,
          value: "applicateReason",
          width: "350px"
        },
        {
          text: "审批结果",
          align: "center",
          sortable: true,
          value: "applicateType"
        }
      ],
      leaveItems: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * @description 获取完成审批表
     */
    init() {
      this.$axios.get("/api/ExamineAndApprove/getApproveDone").then(res => {
        this.leaveItems = res.data.filter(item => {
          return item.applicateNum.split("-")[0] == "EW";
        });
        console.log(res.data);
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
.data-table >>> td:nth-child(7) {
  text-align: justify;
  text-justify: newspaper;
  word-break: break-all;
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
</style>