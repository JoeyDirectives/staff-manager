import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/views/Home'
import Login from "@/components/views/Login";
import HomePage from "@/components/views/HomePage"
import Permissions  from "@/components/views/Permissions"
import ApplicationPortal from "@/components/views/ApplicationPortal"
import Backlog from "@/components/views/Backlog"
import News from "@/components/views/News"
import MakeNews from "@/components/views/MakeNews"
import ExamineAndApprove from "@/components/views/ExamineAndApprove"
import TrainManage from "@/components/views/TrainManage"
import StaffRoster from "@/components/views/staffmanage/StaffRoster"
import StaffRecord from "@/components/views/staffmanage/StaffRecord"
import StaffContract from "@/components/views/staffmanage/StaffContract"

Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    component: Home,
    children:[
      {path:'/HomePage',component:HomePage,name:"系统首页"},
      {path:'/Permissions',component:Permissions,name:"添加用户"},
      {path:'/ApplicationPortal',component:ApplicationPortal,name:"申请门户"},
      {path:'/Backlog',component:Backlog,name:"代办事项"},
      {path:'/News',component:News,name:"新闻公告"},
      {path:'/MakeNews',component:MakeNews,name:"发布新闻公告"},
      {path:'/ExamineAndApprove',component:ExamineAndApprove,name:"审批中心"},
      {path:'/TrainManage',component:TrainManage,name:"培训管理"},
      {path:'/StaffRoster',component:StaffRoster,name:"员工花名册"},
      {path:'/StaffRecord',component:StaffRecord,name:"员工档案"},
      {path:'/StaffContract',component:StaffContract,name:"合同记录"},
    ]
  },
  {
    path: '/',
    component: Login
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
