<template>
  <div>
    <v-dialog v-model="showDetailNewsDialog" width="320px">
      <v-card>
        <v-card-title style="background: #0ca192;">
          提示
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
          <v-icon color="#E6A23C" large style="margin-left:15px">mdi-alert-circle-outline</v-icon>确定要删除吗？
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDetailNewsDialog = false">取消</v-btn>
          <v-btn color="primary" @click="deleteHistory">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      class="data-table"
      dense
      :page.sync="page"
      @page-count="pageCount = $event"
      :headers="headers"
      :items="historyNewsItems"
      hide-default-footer
      :items-per-page="5"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="(item,index) in items" :key="index">
            <td>{{item.newsId}}</td>
            <td>{{item.newsType}}</td>
            <td :title="item.newsContent">{{item.newsContent}}</td>
            <td>{{item.newsTime}}</td>
            <td>
              <v-btn icon @click="deleteHistoryDialog(index)">
                <v-icon size="16px" color="#FF0000">mdi-delete</v-icon>
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
          text: "公告序号",
          align: "center",
          sortable: true,
          value: "newsId",
          width: "80px"
        },
        {
          text: "公告类型",
          align: "center",
          sortable: true,
          value: "newsType",
          width: "100px"
        },
        {
          text: "公告内容",
          align: "center",
          sortable: true,
          value: "newsContent",
          width: "100px"
        },
        {
          text: "发布时间",
          align: "center",
          sortable: true,
          value: "newsTime",
          width: "100px"
        },
        {
          text: "操作",
          align: "center",
          sortable: false,
          value: "operate",
          width: "60px"
        }
      ],
      historyNewsItems: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$axios.get("/api/HomePage/newsInfo").then(res => {
        this.historyNewsItems = res.data;
      });
    },
    /**
     * @deprecated 展示删除dialog
     * @param index 当前所选择行的index
     */
    deleteHistoryDialog(index) {
      this.showDetailNewsIndex = index;
      this.showDetailNewsDialog = true;
    },
    /**
     * @description 确认删除事件
     */
    deleteHistory() {
      this.$axios
        .get("/api/News/deleteNews", {
          params: {
            newsId: this.historyNewsItems[this.showDetailNewsIndex].newsId
          }
        })
        .then(res => {
          if (res.data == "200") {
            this.historyNewsItems.splice(this.showDetailNewsIndex, 1);
            this.showDetailNewsDialog = false;
          }
        });
    }
  }
};
</script>
<style scoped>
.data-table {
  width: 100%;
  height: 290px;
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
.data-table >>> td:nth-child(5) {
  border-right: 1px solid #aaa !important;
}
.data-table >>> td:nth-child(3) {
  text-align: left;
}
.data-table >>> th:nth-child(5) {
  border-right: 1px solid #aaa !important;
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