import Vue from "vue"
import VueRouter from "vue-router"
import { Layout, message } from "ant-design-vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "登录" },
    component: () => import("@/views/login.vue")
  },

  {
    path: "/data",
    name: "data",
    meta: { title: "数据中心" },
    component: () => import("@/views/data/data.vue")
  },
  {
    path: "/dataScreen",
    name: "dataScreen",
    meta: { title: "数据大屏中心" },
    component: () => import("@/views/data/index.vue")
  },

  {
    path: "/",
    name: "Main",
    meta: { title: "首页" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        meta: { title: "首页" },
        component: () => import("@/views/home/home.vue")
      }
    ]
  },

  {
    path: "/resident",
    name: "Resident",
    meta: { title: "居民管理" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "community-management",
        name: "CommunityManagement",
        meta: { title: "任务接收" },
        component: () => import("@/views/resident/community-management/community-management.vue")
      },

      {
        path: "customer-information",
        name: "CustomerInformation",
        meta: { title: "任务反馈" },
        component: () => import("@/views/resident/customer-information/customer-information.vue")
      },
      {
        path: "credit-management",
        name: "CreditManagement",
        meta: { title: "上报心跳" },
        // props: route => ({ query: route.query }),
        component: () => import("@/views/resident/credit/credit-management.vue")
      }
    ]
  },

  {
    path: "/classify",
    name: "Classify",
    meta: { title: "设备管理" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "trading-management",
        name: "TradingManagement",
        meta: { title: "发电机" },
        component: () => import("@/views/classify/trading-management.vue")
      },
      {
        path: "inventory-management",
        name: "InventoryManagement",
        meta: { title: "升降梯" },
        component: () => import("@/views/classify/stock/stock_index.vue")
      },
      {
        path: "stockout-management",
        name: "StockoutManagement",
        meta: { title: "水平车" },
        component: () => import("@/views/classify/stockout.vue")
      }
    ]
  },
  {
    path: "/integral",
    name: "Integral",
    meta: { title: "设备通讯管理" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "commodity-management",
        name: "CommodityManagement",
        meta: { title: "指令下达" },
        component: () => import("@/views/integral/commodity-management.vue")
      },
      {
        path: "order-records",
        name: "OrderRecords",
        meta: { title: "指令反馈" },
        component: () => import("@/views/integral/order-records.vue")
      },
      {
        path: "category-management",
        name: "CategoryManagement",
        meta: { title: "提醒管理" },
        component: () => import("@/views/integral/goods-category.vue")
      },
      {
        path: "equipment-alarm-info",
        name: "EquipmentAlarmInfo",
        meta: { title: "报警管理" },
        component: () => import("@/views/alarm/equipment-alarm-info.vue")
      }
    ]
  },

  {
    path: "/operation",
    name: "Operation",
    meta: { title: "充放任务管理" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "operational-activities",
        name: "OperationalActivities",
        meta: { title: "充放任务准备" },
        component: {
          render(c) {
            return c("router-view")
          }
        },
        children: [
          {
            path: "activity-release",
            name: "ActivityRelease",
            meta: { title: "功率匹配" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/operation/operational-activities/activity-release.vue")
          },
          {
            path: "press-release",
            name: "PressRelease",
            meta: { title: "调度策略" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/operation/operational-activities/press-release.vue")
          },
          {
            path: "inspection-audit",
            name: "InspectionAudit",
            meta: { title: "异常处理" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/operation/operational-activities/inspection-audit.vue")
          }
        ]
      },
      {
        path: "answer-question",
        name: "AnswerQuestion",
        meta: { title: "充放任务执行" },
        component: {
          render(c) {
            return c("router-view")
          }
        },
        children: [
          {
            path: "classified-QandA",
            name: "ClassifiedQandA",
            meta: { title: "slice调度" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/operation/answer-question/classified-QandA.vue")
          },
          {
            path: "QandA-detail",
            name: "QandADetail",
            meta: { title: "任务执行反馈" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/operation/answer-question/QandA-detail.vue")
          },
          {
            path: "answer-record",
            name: "AnswerRecord",
            meta: { title: "任务异常处理" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/operation/answer-question/answer-record.vue")
          }
        ]
      }
    ]
  },

  {
    path: "/project",
    name: "Project",
    meta: { title: "项目管理" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "project-company",
        name: "ProjectCompany",
        meta: { title: "项目公司" },
        component: () => import("@/views/project/project-company.vue")
      },
      {
        path: "role-management",
        name: "RoleManagement",
        meta: { title: "角色管理" },
        component: () => import("@/views/project/role-management.vue")
      },
      {
        path: "bg-permission-view",
        name: "BgPermissionView",
        props: route => ({ query: route.query }),
        meta: { title: "查看后台管理", breadName: "BgPermissionView" },
        component: () => import("@/views/project/bg-permission-view.vue")
      },
      {
        path: "bg-permission-edit",
        name: "BgPermissionEdit",
        props: route => ({ query: route.query }),
        meta: { title: "编辑后台管理", breadName: "BgPermissionEdit" },
        component: () => import("@/views/project/bg-permission-edit.vue")
      }
    ]
  },
  {
    path: "/permission",
    name: "Permission",
    meta: { title: "权限管理" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "admin-permission",
        name: "AdminPermission",
        meta: { title: "后台权限" },
        component: () => import("@/views/permission/admin-permission.vue")
      },
      {
        path: "wxsp-permission",
        name: "WxspPermission",
        meta: { title: "小程序权限" },
        component: () => import("@/views/permission/wxsp-permission.vue")
      }
    ]
  }
]

const router = new VueRouter({
  mode: "history",
  // base: process.env.VUE_APP_BASE_URL,
  routes
})

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

router.beforeEach((to, from, next) => {
  const token = JSON.parse(localStorage.getItem("token"))
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  if (to.path === "/login" || to.path === "/middle-page") {
    next()
  } else {
    if (token) {
      // 判断是一类账号还是二类账号  二类账号不能进入账号管理
      // if (userInfo.level === 2 && (to.name === "AppAccount" || to.name === "BackgroundAccount")) {
      //   next("/home")
      // } else {
      //   next()
      // }

      next()
    } else {
      message.info("请登录")
      next("/login")
    }
  }
})

export default router
