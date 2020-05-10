import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        //全屏标志
        fullscreenFlag: 0,
        staffNum: 0,
        staffName: "",
        //公告列表
        newsItems: [],
        //面包屑items
        breadItems: [{
            text: "系统首页",
            disabled: false,
            href: "HomePage"
        }],
        breadText: "系统首页"
    },
    mutations: {
        /**
         * @description 切换用户后，复原面包屑
         * @param {breadItems} state
         */
        reset(state) {
            state.breadItems = [{
                text: "系统首页",
                disabled: false,
                href: "HomePage"
            }]
        },
        /**
         * @description 点击全屏按钮触发，拉伸主页面盒子大小
         * @param {fullscreenFlag} state 全屏状态
         */
        clickFullScreen(state) {
            if (state.fullscreenFlag) {
                state.fullscreenFlag = 0;
            } else {
                state.fullscreenFlag = 1;
            }
        },
        /**
         * @description 公告操作
         * @param {newsItems} state 公告列表
         */
        changeNews(state, newsItem) {
            state.newsItems.unshift({
                type: newsItem.newsType,
                text: newsItem.newsContent,
                issueTime: newsItem.issueTime
            })
        },
        /**
         * @description 面包屑
         * @param {item} state 面包屑item
         */
        deleteBread(state, item) {
            if (item.text == "系统首页") {
                return;
            }
            let index = state.breadItems.findIndex(el => {
                return el.text == item.text;
            });
            state.breadItems.splice(index, 1);
            this.$router.push({
                name: state.breadItems[index].text
            });
        },
        /**
         * @description 面包屑
         * @param {item} state 面包屑item
         */
        addBread(state, item) {
            state.breadText = item.text;
            for (let index = 0; index < state.breadItems.length; index++) {
                const element = state.breadItems[index];
                if (element.text == item.text) {
                    return;
                }
            }
            state.breadItems.push(item);
        },
        /**
         * @description 获取登录用户员工号
         * @param {item} state 员工号
         */
        changeUserInfo(state, staffNum) {
            state.staffNum = staffNum;
        },
        /**
         * @description 获取登录用户员名
         * @param {item} state 员工名
         */
        getStaffName(state, staffName) {
            state.staffName = staffName;
        }
    }
})

export default store;