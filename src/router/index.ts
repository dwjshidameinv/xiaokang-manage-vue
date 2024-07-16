import { createRouter, createWebHistory } from 'vue-router'
import type {RouteRecordRaw} from "vue-router"
import Login from "@/views/login/index.vue"
import Layout from "@/views/Layout/index.vue"
import NoFound from "@/views/404.vue"
import Work from "@/views/Work/index.vue"
import Add from "@/views/classify/component/add.vue"
import { usePageLoadStatusStore } from '@/stores/counter'
export const asyncRoutes: RouteRecordRaw [] =[
  {
    path:"/",
    component:Layout,
    name:"Platform",
    redirect:'/work',
    meta:{
      til:"工作台",
      icon:"Platform"
    },
    children:[{
      path:"work",
      component:()=>import("@/views/Work/index.vue")
    }]
  },
  {
    path:"/statistics",
    component:Layout,
    name:"statistics",
    redirect:'/statistics/statistics',
    meta:{
      til:"数据统计",
      icon:"Document"
    },
    children:[{
      path:"statistics",
      component:()=>import("@/views/statistics/index.vue")
    }]
  },
  {
    path:"/order",
    component:Layout,
    name:"order",
    redirect:'/order/order',
    meta:{
      til:"订单管理",
      icon:"Goods"
    },
    children:[{
      path:"order",
      component:()=>import("../views/order/index.vue"),
    }]
    
  },
  {
    path:"/mealPackage",
    component:Layout,
    name:"mealPackage",
    redirect:"/mealPackage/mealPackage",
    meta:{
      til:"套餐管理",
      icon:"Bowl"
    },
    children:[{
      path:"mealPackage",
      component:()=>import("../views/mealPackage/index.vue"),
    }]
  },
  {
    path:"/dish",
    component:Layout,
    redirect:"/dish/dish",
    name:"菜品管理",
    meta:{
      til:"菜品管理",
      icon:"DishDot"
    },
    children:[{
      path:"dish",
      component:()=>import("../views/dish/index.vue"),
    }]
  },
  {  
    path: "/classify",  
    component: Layout,  
    redirect:"/classify/classify",
    name: "ClassifyManagement", // 使用英文命名  
    meta: {  
      til: "分类管理", // 更正为title  
      icon: "Calendar"  
    },  
    children: [  
      {
        path:"classify",
        component:()=>import("../views/classify/index.vue"),
      },
      {  
        path: "edit", // 去掉前导斜杠，使其成为相对路径  
        component: () => import("../views/classify/component/edit.vue"),  
        name: "EditClassify", // 使用英文命名  
      },  
      {  
        path: "add", // 去掉前导斜杠，使其成为相对路径  
        component: () => import("../views/classify/component/add.vue"),  
        name: "AddClassify", // 使用英文命名  
      }  
    ]  
  },
  {
    path:"/employee",
    component:Layout,
    name:"员工管理",
    redirect:"/employee/employee",
    meta:{
      til:"员工管理",
      icon:"UserFilled"
    },
    children:[
      {
        path:"employee",
        component:()=>import("../views/employee/index.vue"),
      },
    ]
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
