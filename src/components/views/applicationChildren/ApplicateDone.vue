<template>
  <div>
    <v-dialog v-model="showDetailNewsDialog" width="320px">
      <v-card>
        <v-card-title style="background: #0ca192;">
          详情
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
        <v-container v-if="item!=null">
          申请类型: {{item.applicateName}}
          <br />
          <v-divider />
          申请日: {{item.applicateDate}}
          <br />
          <v-divider />
          申请人: {{item.applicatePerson}}
          <br />
          <v-divider />
          申请事由: {{item.applicateReason}}
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDetailNewsDialog=false">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      class="data-table"
      dense
      :page.sync="page"
      @page-count="pageCount = $event"
      :headers="headers"
      :items="doneItems"
      hide-default-footer
      :items-per-page="7"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="(item,index) in items" :key="item.name" @click="getNowItem(item)">
            <td>{{item.applicateNum}}</td>
            <td>{{item.applicateName}}</td>
            <td>{{item.applicateDate}}</td>
            <td>{{item.applicatePerson}}</td>
            <td>{{item.doneConditions}}</td>
            <td>
              <v-btn icon>
                <v-icon color="#0ca192" @click="showDetails(index)">mdi-clipboard-list-outline</v-icon>
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
      showDetailNewsDialog: false,
      showDetailNewsIndex: 0,
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
          text: "详情",
          align: "center",
          sortable: false,
          value: "details"
        }
      ],
      item: null,
      doneItems: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * @description 获取done表
     */
    init() {
      this.$axios.get("/api/ApplicationPortal/doneList").then(res => {
        let name = this.$store.state.staffName;
        this.doneItems = res.data.filter(item => {
          return name == item.applicatePerson;
        });
      });
    },
    /**
     * @description 获取当前选择行item
     */
    getNowItem(item) {
      this.item = item;
      console.log("item", this.item);
    },
    /**
     * @deprecated 展示当前已完成的选中的申请详细
     * @param index 当前所选择行的index
     */
    showDetails(index) {
      this.showDetailNewsIndex = index;
      this.showDetailNewsDialog = true;
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