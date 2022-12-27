<template>
  <a-layout id="main" style="height: 100%">
    <a-layout-header class="header">
      <a-space :size="25">
        <!-- <img src="../assets/logo.png" class="logo" /> -->
        <span class="title">{{ projectTitle }}</span>
        <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
      </a-space>
      <a-space :size="25" class="fr">
        <a-avatar style="backgroundcolor: #31c27c" icon="user" />
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link white" @click="e => e.preventDefault()">欢迎您 ! {{ userName }} <a-icon type="down" /> </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="passwordVisible = true">修改密码</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="loginOut">退出登录</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>

        <!-- <a-dropdown :trigger="['click']" v-if="!userInfo.super">
          <a class="ant-dropdown-link white" @click="e => e.preventDefault()">{{ project_name }} <a-icon type="down" /> </a>
          <a-menu slot="overlay">
            <a-menu-item v-for="item in projects" :key="item.project_id">
              <div @click="checkoutProject(item)">
                <a href="javascript:;" class="mr10">{{ item.project_name }}</a>
                <a-icon v-if="item.project_name === project_name" type="check" style="color: #89d13f" />
              </div>
            </a-menu-item>
          </a-menu>
        </a-dropdown> -->

        <a-modal title="修改密码" :visible="passwordVisible" :confirm-loading="confirmLoading" @ok="changePasswordOk" @cancel="changePasswordCancel">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6, offset: 1 }" :wrapper-col="{ span: 14, offset: 1 }">
            <a-form-model-item ref="password" label="当前密码" prop="password" allowClear has-feedback>
              <a-input v-model="form.password" type="password" autocomplete="off" placeholder="请输入旧密码" />
            </a-form-model-item>
            <a-form-model-item ref="repassword" label="新的密码" prop="repassword" allowClear has-feedback>
              <a-input v-model="form.repassword" type="password" autocomplete="off" placeholder="请输入新密码" />
            </a-form-model-item>
            <a-form-model-item ref="confirm_password" label="确认密码" prop="confirm_password" allowClear has-feedback>
              <a-input v-model="form.confirm_password" type="password" autocomplete="off" placeholder="请输入新密码" />
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </a-space>
    </a-layout-header>

    <a-layout>
      <a-layout-sider v-model="collapsed" :trigger="null" width="230px" collapsible id="sider">
        <a-menu :selectedKeys="selectedKeys" mode="inline" theme="dark" :defaultOpenKeys="openKeys" :open-keys="openKeys" @click="clickItem" @openChange="menuOpen">
          <template v-for="item in menu">
            <a-sub-menu v-if="item.children && item.children.length > 0" :key="item.key">
              <span slot="title">
                <img :src="item.icon" class="icon anticon" />
                <span>{{ item.title }}</span>
              </span>
              <template v-for="sitem in item.children">
                <a-sub-menu v-if="sitem.children && sitem.children.length > 0" :key="sitem.key">
                  <span slot="title">{{ sitem.title }}</span>
                  <a-menu-item v-for="ssitem in sitem.children" :key="ssitem.key">{{ ssitem.title }}</a-menu-item>
                </a-sub-menu>
                <a-menu-item v-else :key="sitem.key"> {{ sitem.title }} </a-menu-item>
              </template>
            </a-sub-menu>
            <a-menu-item v-else :key="item.key">
              <img :src="item.icon" class="icon anticon" />
              <span>{{ item.title }}</span>
            </a-menu-item>
          </template>
        </a-menu>
      </a-layout-sider>

      <a-layout class="content">
        <a-layout-content class="clearfix h100b system-layout-content">
          <!-- <keep-alive>
            <router-view class="view" v-if="$route.meta.keepAlive"></router-view>
          </keep-alive> -->
          <!-- v-if="!$route.meta.keepAlive" -->
          <router-view class="view"></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  name: "Main",
  inject: ["reload"],
  components: {},
  data() {
    return {
      showDataScreen: true,
      showMNdataScreen: false,
      projectTitle: "重力储能管理系统",
      routes: {}, // vue路由对象
      userName: "", // 用户名
      selectedKeys: [],
      openKeys: [],
      collapsed: false,
      // rootSubmenuKeys: ["Community"],
      userInfo: {},
      projects: [],
      project_name: "",
      menu: [
        {
          key: "Home",
          title: "首页",
          icon: require("@/assets/icons/index-2.png")
        },
        {
          key: "dataScreen",
          title: "数据大屏",
          icon: require("@/assets/icons/shuju.png")
        },

        {
          key: "Resident",
          title: "EMS信息同步",
          icon: require("@/assets/icons/juminguanli.png"),
          children: [
            { key: "CommunityManagement", title: "任务接收" },
            { key: "CustomerInformation", title: "任务反馈" },
            { key: "CreditManagement", title: "上报心跳" }
          ]
        },
        {
          key: "Classify",
          title: "设备管理",
          icon: require("@/assets/icons/fenleiguanli.png"),
          children: [
            { key: "TradingManagement", title: "发电机" },
            { key: "InventoryManagement", title: "升降梯" },
            { key: "StockoutManagement", title: "水平车" }
          ]
        },
        {
          key: "Integral",
          title: "设备通讯管理",
          icon: require("@/assets/icons/jifen.png"),
          children: [
            { key: "CommodityManagement", title: "指令下达" },
            { key: "OrderRecords", title: "指令反馈" },
            { key: "CategoryManagement", title: "提醒管理" },
            { key: "EquipmentAlarmInfo", title: "报警管理" }
          ]
        },

        {
          key: "Operation",
          title: "充放任务管理",
          icon: require("@/assets/icons/yunyingguanli.png"),
          children: [
            {
              key: "OperationalActivities",
              title: "充放任务准备",
              children: [
                { key: "ActivityRelease", title: "功率匹配" },
                { key: "PressRelease", title: "调度策略" },
                { key: "InspectionAudit", title: "异常处理" }
              ]
            },
            {
              key: "AnswerQuestion",
              title: "充放任务执行",
              children: [
                { key: "ClassifiedQandA", title: "slice调度" },
                { key: "QandADetail", title: "任务执行反馈" },
                { key: "AnswerRecord", title: "任务异常处理" }
              ]
            }
          ]
        }
      ],
      passwordVisible: false,
      confirmLoading: false,
      form: {
        id: "",
        password: "",
        repassword: "",
        confirm_password: ""
      },
      rules: {
        password: [{ required: true, message: "请输入当前密码", trigger: "change" }],
        repassword: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入新的密码"))
              } else {
                if (this.form.confirm_password !== "") {
                  this.$refs.ruleForm.validateField("confirm_password")
                }
                callback()
              }
            },
            trigger: "change"
          }
        ],
        confirm_password: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入新的密码"))
              } else if (value !== this.form.repassword) {
                callback(new Error("两次密码不一致!"))
              } else {
                callback()
              }
            },
            trigger: "change"
          }
        ]
      }
    }
  },

  created() {
    // this.getUserProjects()
    this.handleMenu()
    this.showDataScreen = JSON.parse(localStorage.getItem("showDataScreen"))
    this.showMNdataScreen = JSON.parse(localStorage.getItem("showMNdataScreen"))

    this.userInfo = JSON.parse(localStorage.getItem("userInfo")) || "未登录"
    this.userInfo = JSON.parse(localStorage.getItem("userInfo")) || "未登录"
    // this.projectTitle = localStorage.getItem("project") || "重力储能管理系统"
    if (this.userInfo !== "未登录") {
      this.userName = this.userInfo.name
      this.form.id = this.userInfo.id
      // this.getMenu()
    } else {
      this.$router.push({ name: "Home" })
    }
  },
  computed: {
    rootSubmenuKeys: function() {
      return this.menu.map(item => {
        return item.key
      })
    }
  },

  methods: {
    // 刚进入页面处理选中的导航栏
    handleMenu() {
      const routeName = this.$route.name
      this.$route.matched.forEach(item => {
        if (item.name !== routeName) {
          this.openKeys.push(item.name)
        }
      })
      this.selectedKeys = [routeName]
    },
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    },
    getMenu() {
      // 拼接菜单数据
      let menuData = []
      let that = this
      this.userInfo.menus[0].children.map(item => {
        let first = []
        item.children.map(sitem => {
          let second = []
          sitem.children.map(ssitem => {
            if (ssitem.is_menu == 1) {
              // 非泗阳  && ssitem.key !== "siyangmonthrecycle_list"
              if (that.userInfo.project_id !== 30) {
                second.push({ key: ssitem.key, title: ssitem.title })
                const secondArr = second.filter(item => {
                  return item.key !== "siyangmonthrecycle_list"
                })
                second = secondArr
              } else {
                second.push({ key: ssitem.key, title: ssitem.title })
              }
            }
          })
          first.push({ key: sitem.key, title: sitem.title, children: second })
        })
        menuData.push({ key: item.key, title: item.title, icon: require("@/assets/icons/" + item.icon + ".png"), children: first })
      })
      let newArray = []

      if (this.showDataScreen) {
        newArray = menuData.filter(item => item.key !== "MNHome" && item.key !== "MNdataScreen" && item.key !== "dataScreenManage")
      }
      if (this.showMNdataScreen) {
        newArray = menuData.filter(item => item.key !== "Home" && item.key !== "dataScreen")
      }
      if (!this.showDataScreen && !this.showMNdataScreen) {
        newArray = menuData.filter(item => item.key !== "Home" && item.key !== "dataScreen" && item.key !== "MNHome" && item.key !== "MNdataScreen" && item.key !== "dataScreenManage")
      }
      console.log(newArray, "newArray")
      this.menu = newArray
    },

    // 展开导航菜单
    menuOpen(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },

    // 选择导航二级菜单
    clickItem(v) {
      this.selectedKeys = [v.key]
      this.$router.push({ name: v.key })
    },

    // 修改密码确定
    changePasswordOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.changePassword(this.form).then(res => {
            this.$message.success(res.msg)
            this.passwordVisible = false
            this.clearForm()
            this.loginOut()
          })
        } else {
          return false
        }
      })
    },

    // 取消修改密码
    changePasswordCancel() {
      this.passwordVisible = false
    },

    // 清空表单
    clearForm() {
      this.form.password = ""
      this.form.repassword = ""
      this.form.confirm_password = ""
      this.$validator.resetFields(this)
    },

    // 登出
    loginOut() {
      // this.$api
      //   .loginOut()
      //   .then(res => {
      //     localStorage.removeItem("token")
      //     localStorage.removeItem("userInfo")
      //     this.$message.success(res.msg)
      //     this.$router.push({ name: "Login" })
      //   })
      //   .catch(e => {
      //     localStorage.removeItem("token")
      //     localStorage.removeItem("userInfo")
      //     this.$router.push({ name: "Login" })
      //   })
    },

    // 获取账号的项目
    getUserProjects() {
      this.$api.getProjectList().then(res => {
        this.projects = res.data
        res.data.map(item => {
          if (item.is_show == 1) {
            this.project_name = item.project_name
          }
        })
      })
    },
    // 切换项目
    checkoutProject(data) {
      let param = {
        id: this.userInfo.id, // 账号id
        project_id: data.project_id // 项目id
      }
      // 更新数据库
      this.$api.switchproject(param).then(res => {
        if (res.code == 200) {
          this.$message.success("切换成功")
          this.project_name = data.project_name
          const routeList = JSON.parse(localStorage.getItem("bizMenu"))
          const jumpPage = routeList[0].children[0].key
          if (this.$route.name === jumpPage) this.reload()
          else this.$router.push({ name: jumpPage })
          this.openKeys = [] // 菜单重置
        } else {
          this.$message.success("切换失败")
        }
      })
      let userInfo = this.userInfo
      userInfo.project_id = data.project_id
      this.selectedKeys = ["Home"]
      // 更新本地缓存
      localStorage.removeItem("userInfo")
      localStorage.setItem("userInfo", JSON.stringify(userInfo))
    }
  },
  watch: {
    $route: {
      handler(val) {
        this.selectedKeys = [this.$route.name]
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
#main {
  .icon {
    height: 15px;
    margin-right: 10px;
    vertical-align: text-top;
  }
  .ant-layout-header {
    padding: 0 25px;
    background-color: #222222;
  }
  .ant-layout-sider-children {
    // height: 873px;
    overflow-y: auto;
    margin-top: -0.1px;
    padding-top: 0.1px;
  }
  .logo {
    height: 31px;
    margin: 16px 0 16px 0;
  }
  .title {
    color: #fff;
    font-size: 20px;
    vertical-align: middle;
  }
  .trigger {
    color: #fff;
    font-size: 20px;
    vertical-align: middle;
  }

  .content {
    display: inline-block;
    overflow: auto;
    height: 100%;
    background: #fff;
  }
  .view {
    background-color: #fff;
    padding: 30px 20px;
    min-width: 1100px;
    // margin: 10px;
    min-height: 90%;
  }
}
</style>
