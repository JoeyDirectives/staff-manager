<template>
  <div>
    <!-- 导航的面包屑布局 -->
    <div style="background-color: #fff;padding:12px">
      <Breadcrumbs />
    </div>
    <v-alert
      type="success"
      class="top-show-successmsg-alert"
      v-if="showSuccessDialog"
      max-width="500px"
      dismissible
    >发布成功！</v-alert>
    <v-card width="100%">
      <v-tabs v-model="tab" class="tab-style">
        <v-tab v-for="item in tabs" :key="item">{{ item }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in tabs" :key="item">
          <v-card>
            <v-card-text v-if="tab==0">
              <div class="div-display">
                <span class="span-style">公告类型</span>
                <v-select
                  dense
                  class="select-style"
                  :items="NewsTypeItems"
                  label="公告类型选择"
                  v-model="newsItem.newsType"
                  outlined
                ></v-select>
                <div style="height: 16px"></div>
                <div>
                  <span class="span-style">公告内容</span>
                  <v-textarea
                    outlined
                    label="公告内容"
                    class="text-area-style"
                    v-model="newsItem.newsContent"
                  ></v-textarea>
                </div>
                <div style="position: absolute;right:228px">
                  <v-btn @click="clearContent">清除</v-btn>
                  <v-btn @click="issueContent" color="primary" style="margin-left:10px">发布</v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <v-card>
            <v-card-text v-if="tab==1">
              <history-news />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
import Breadcrumbs from "./Breadcrumbs";
import HistoryNews from "./HistoryNews";

export default {
  components: {
    Breadcrumbs,
    HistoryNews
  },
  data() {
    return {
      showSuccessDialog: false,
      tab: null,
      tabs: ["发布公告", "历史公告"],
      NewsTypeItems: ["HR公告", "培训公告", "企业周知"],
      newsItem: {
        newsType: "",
        newsContent: "",
        newsTime: ""
      }
    };
  },
  methods: {
    /**
     * @description 清空列表
     */
    clearContent() {
      this.newsItem.newsType = this.newsItem.newsContent = "";
    },
    /**
     * @description 公告发布
     */
    issueContent() {
      let date = new Date();
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
      this.newsItem.newsTime = date.toISOString().substr(0, 10) + time;
      this.$axios
        .post("/api/News/issueNews", this.newsItem)
        .then(res => {
          if (res.data == "200") {
            this.showSuccessDialog = true;
            this.clearContent();
          }
        });
    }
  },
  watch: {
    /**
     * @description 设置成功时，提示框的出现时间
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
.tab-style {
  padding-top: 10px;
  margin-left: 10px;
  border-bottom: 2px solid #0ca192;
}
.tab-style >>> .v-tab--active {
  background-color: #0ca192;
  color: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.tab-style >>> .v-card__text {
  background-color: #0ca192;
}
.v-card {
  box-shadow: none;
}
.v-card >>> .v-card__text {
  height: 400px;
  background-color: #f0f0f0;
}
.span-style {
  font-size: 16px;
  font-weight: 600;
  color: black;
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
.text-area-style {
  display: inline-block;
  margin-left: 40px;
  vertical-align: top;
}
.text-area-style >>> textarea {
  resize: none !important;
  width: 700px;
  height: 200px;
}
.top-show-successmsg-alert {
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 10%;
  transform: translateX(-50%);
}
</style>