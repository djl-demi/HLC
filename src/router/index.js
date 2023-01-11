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
    path: "/EMS",
    name: "EMS",
    meta: { title: "EMS信息同步" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "task-reception",
        name: "TaskReception",
        meta: { title: "任务接收" },
        component: () => import("@/views/EMS/task-reception/task-reception.vue")
      },

      {
        path: "task-feedback",
        name: "TaskFeedback",
        meta: { title: "任务反馈" },
        component: () => import("@/views/EMS/task-feedback/task-feedback.vue")
      },
      {
        path: "report-heartbeat",
        name: "ReportHeartbeat",
        meta: { title: "上报心跳" },
        // props: route => ({ query: route.query }),
        component: () => import("@/views/EMS/report-heartbeat/report-heartbeat.vue")
      }
    ]
  },

  {
    path: "/equipment",
    name: "Equipment",
    meta: { title: "设备管理" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "alternator",
        name: "Alternator",
        meta: { title: "发电机" },
        component: () => import("@/views/equipment/alternator.vue")
      },
      {
        path: "elevator",
        name: "Elevator",
        meta: { title: "升降梯" },
        component: () => import("@/views/equipment/elevator.vue")
      },
      {
        path: "horizontal-car",
        name: "HorizontalCar",
        meta: { title: "水平车" },
        component: () => import("@/views/equipment/horizontal-car.vue")
      }
    ]
  },
  {
    path: "/communication",
    name: "Communication",
    meta: { title: "设备通讯管理" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "order-issuance",
        name: "OrderIssuance",
        meta: { title: "指令下达" },
        component: () => import("@/views/communication/order-issuance.vue")
      },
      {
        path: "order-records",
        name: "OrderRecords",
        meta: { title: "指令反馈" },
        component: () => import("@/views/communication/order-records.vue")
      },
      {
        path: "reminder-management",
        name: "ReminderManagement",
        meta: { title: "提醒管理" },
        component: () => import("@/views/communication/reminder-management.vue")
      },
      {
        path: "equipment-alarm-info",
        name: "EquipmentAlarmInfo",
        meta: { title: "报警管理" },
        component: () => import("@/views/communication/equipment-alarm-info.vue")
      }
    ]
  },

  {
    path: "/rechargeable",
    name: "Rechargeable",
    meta: { title: "充放任务管理" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "rechargeable-prepare",
        name: "RechargeablePrepare",
        meta: { title: "充放任务准备" },
        component: {
          render(c) {
            return c("router-view")
          }
        },
        children: [
          {
            path: "power-matching",
            name: "PowerMatching",
            meta: { title: "功率匹配" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/rechargeable/rechargeable-prepare/power-matching.vue")
          },
          {
            path: "scheduling-strategy",
            name: "SchedulingStrategy",
            meta: { title: "调度策略" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/rechargeable/rechargeable-prepare/scheduling-strategy.vue")
          },
          {
            path: "exception-handling",
            name: "ExceptionHandling",
            meta: { title: "异常处理" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/rechargeable/rechargeable-prepare/exception-handling.vue")
          }
        ]
      },
      {
        path: "rechargeable-implement",
        name: "RechargeableImplement",
        meta: { title: "充放任务执行" },
        component: {
          render(c) {
            return c("router-view")
          }
        },
        children: [
          {
            path: "slice-dispatch",
            name: "SliceDispatch",
            meta: { title: "slice调度" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/rechargeable/rechargeable-implement/slice-dispatch.vue")
          },
          {
            path: "task-feedback",
            name: "TaskFeedback",
            meta: { title: "任务执行反馈" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/rechargeable/rechargeable-implement/task-feedback.vue")
          },
          {
            path: "task-handling",
            name: "TaskHandling",
            meta: { title: "任务异常处理" },
            props: route => ({ query: route.query }),
            component: () => import("@/views/rechargeable/rechargeable-implement/task-handling.vue")
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
