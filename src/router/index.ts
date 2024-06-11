import { createRouter, createWebHistory } from 'vue-router'
import type {RouteRecordRaw} from "vue-router"
import Login from "@/views/login/index.vue"
import NoFound from "@/views/404.vue"
import Work from "@/views/Work/index.vue"
export const asyncRoutes: RouteRecordRaw [] =[
  {
    path:"/work",
    component:Work,
    name:"工作台",
    meta:{
      til:"工作台",
      icon:"Platform"
    }
  },
  {
    path:"/statistics",
    component:()=>import("../views/statistics/index.vue"),
    name:"数据统计",
    meta:{
      til:"数据统计",
      icon:"Document"
    }
  },
  {
    path:"/order",
    component:()=>import("../views/order/index.vue"),
    name:"订单管理",
    meta:{
      til:"订单管理",
      icon:"Goods"
    }
  },
  {
    path:"/mealPackage",
    component:()=>import("../views/mealPackage/index.vue"),
    name:"套餐管理",
    meta:{
      til:"套餐管理",
      icon:"Bowl"
    }
  },
  {
    path:"/dish",
    component:()=>import("../views/dish/index.vue"),
    name:"菜品管理",
    meta:{
      til:"菜品管理",
      icon:"DishDot"
    }
  },
  {
    path:"/classify",
    component:()=>import("../views/classify/index.vue"),
    name:"分类管理",
    meta:{
      til:"分类管理",
      icon:"Calendar"
    }
  },
  {
    path:"/employee",
    component:()=>import("../views/employee/index.vue"),
    name:"员工管理",
    meta:{
      til:"员工管理",
      icon:"UserFilled"
    }
  },
]
export const staticRoutes:RouteRecordRaw[]=[
  {
    path: "/login",
    component: Login,
    name: "登录",
    meta: {
      til: "请登录"
    }
  },
  {
    path: '/:catchAll(.*)',
    component: NoFound,
    name: "404",
    meta: {
      til: "页面未找到"
    }
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[...asyncRoutes, ...staticRoutes]
})

export default router
