import { log } from "@antv/g2plot/lib/utils"

// 项目组件公共函数
const com = {
  // 获取token
  getToken() {
    return JSON.parse(localStorage.getItem("token"))
  },

  // 选择器过滤函数
  filterOption(input, option) {
    return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  },

  // 上传文件地址（图片）
  uploadUrl() {
    return process.env.VUE_APP_BASE_URL + "/admin/v1/upload?token=" + com.getToken()
  },
  // 通用文件上传（jpeg、gif、png、jpg、doc、docx、pdf）
  uploadFileUrl() {
    return process.env.VUE_APP_BASE_URL + "/admin/v1/upload/file?token=" + com.getToken()
  },

  // 智能垃圾桶 上传excel文件地址
  mintpassRubbishUploadExcel() {
    return process.env.VUE_APP_BASE_URL + "/bid/can/uploadFile?token=" + com.getToken()
  },

  // 上传excel文件地址
  uploadExcel() {
    return process.env.VUE_APP_BASE_URL + "/admin/v1/classificationdetail/import?token=" + com.getToken()
  },

  //小区管理文件导入
  importCommunity() {
    return process.env.VUE_APP_BASE_URL + "/admin/v1/plot/to/lead?token=" + com.getToken()
  },

  //居民信息文件导入
  importCustomer() {
    return process.env.VUE_APP_BASE_URL + "/admin/v1/user/to/lead?token=" + com.getToken()
  },

  //ic卡管理文件导入
  importICcord() {
    return process.env.VUE_APP_BASE_URL + "/admin/v1/ic/card/import?token=" + com.getToken()
  },
  //泗阳统计数据导入
  importRecycleData(id) {
    return process.env.VUE_APP_BASE_URL + "/admin/v1/diy/monthrecycle/import?garbage_house_id=" + id + "&token=" + com.getToken()
  },
  // 居民统计
  importResidentStatistics() {
    return process.env.VUE_APP_BASE_URL + "api/bid/userCountSimulate/import?token=" + com.getToken()
  },

  importGarbageRecovery() {
    return process.env.VUE_APP_BASE_URL + "api/bid/trashRecycleSimulate/import?token=" + com.getToken()
  },
  importResidentLaunch() {
    return process.env.VUE_APP_BASE_URL + "api/bid/userRecycleSimulate/import?token=" + com.getToken()
  },
  importRecoveryChange() {
    return process.env.VUE_APP_BASE_URL + "api/bid/recycleSimulate/import?token=" + com.getToken()
  },

  importRecyclableLaunch() {
    return process.env.VUE_APP_BASE_URL + "api/bid/communitySimulate/import?token=" + com.getToken()
  },
  importRealtimeDelivery() {
    return process.env.VUE_APP_BASE_URL + "api/bid/userRecycleDetailSimulate/import?token=" + com.getToken()
  },

  importFacilityStatistics() {
    return process.env.VUE_APP_BASE_URL + "api/bid/facilitySimulate/import?token=" + com.getToken()
  },

  importWeeklyRecovery() {
    return process.env.VUE_APP_BASE_URL + "api/bid/recycleTypeSimulate/import?token=" + com.getToken()
  },
  importOutboundGoing() {
    return process.env.VUE_APP_BASE_URL + "api/bid/recycleOutSimulate/import?token=" + com.getToken()
  },
  // 显示图片地址的 前缀
  showUpload() {
    return process.env.VUE_APP_BASE_URL + "/storage/"
  },
  checkInput(that, checkType, e) {
    that[checkType] = that[checkType].replace(/[^0-9]/g, "")
    if (that[checkType].length === 11 && !/^[1][3-9][\d]{9}$/.test(that[checkType])) {
      that.$set(that, checkType, undefined)
    }
  },
  // 星期列表
  weekList() {
    return [
      { label: "星期一", value: "1" },
      { label: "星期二", value: "2" },
      { label: "星期三", value: "3" },
      { label: "星期四", value: "4" },
      { label: "星期五", value: "5" },
      { label: "星期六", value: "6" },
      { label: "星期日", value: "7" }
    ]
  },
  // 月份列表
  monthList() {
    return [
      { label: "1月", value: "1" },
      { label: "2月", value: "2" },
      { label: "3月", value: "3" },
      { label: "4月", value: "4" },
      { label: "5月", value: "5" },
      { label: "6月", value: "6" },
      { label: "7月", value: "7" },
      { label: "8月", value: "8" },
      { label: "9月", value: "9" },
      { label: "10月", value: "10" },
      { label: "11月", value: "11" },
      { label: "12月", value: "12" }
    ]
  },

  onlineList() {
    return [
      { label: "在线", value: 1 },
      { label: "离线", value: 0 }
    ]
  },

  normalList() {
    return [
      { label: "正常", value: 1 },
      { label: "停止", value: 0 }
    ]
  },

  /* 
    获取管理员列表
    第一个参数传入this
    第二个参数为this对象里需要赋值数据的数组名
  */
  getAccountName(that, name, data = {}) {
    that.$api.getAccountName(data).then(res => {
      that[name] = res.data.map(item => {
        item.label = item.account_name
        item.value = item.id
        return item
      })
    })
  },

  /* 
    获取所有小区的列表
    第一个参数传入this
    第二个参数为this对象里需要赋值数据的数组名
  */
  getCommunityAllList(that, name, data = {}) {
    that.$api.getCommunityAllList(data).then(res => {
      that[name] = res.data.map(item => {
        item.label = item.plot_name
        item.value = item.id
        return item
      })
    })
  },

  /* 
    获取小区信息列表 可根据区域id过滤
    第一个参数传入this
    第二个参数为this对象里需要赋值数据的数组名
  */
  getCommunityChartList(that, name, data = {}) {
    that.$api.getCommunityChartList(data).then(res => {
      that[name] = res.data.map(item => {
        item.label = item.plot_name
        item.value = item.id
        return item
      })
    })
  },

  /* 
    获取品类列表
    第一个参数传入this
    第二个参数为this对象里需要赋值数据的数组名
  */
  getCategorySelectList(that, name, data = {}) {
    that.$api.getCategorySelectList(data).then(res => {
      that[name] = res.data.map(item => {
        item.label = item.category_name
        item.value = item.id
        return item
      })
    })
  },
  /* 
    获取分拣站下拉列表
    第一个参数传入this
    第二个参数为this对象里需要赋值数据的数组名
  */
  sortingStationList(that, name, data = {}) {
    that.$api.sortingStationList(data).then(res => {
      that[name] = res.data.map(item => {
        item.label = item.site_name
        item.value = item.id
        return item
      })
    })
  },
  /* 
    获取负责人列表
    第一个参数传入this
    第二个参数为this对象里需要赋值数据的数组名
  */
  getResponsiblerList(that, name, data = {}) {
    that.$api.getResponsiblerList(data).then(res => {
      that[name] = res.data.map(item => {
        item.label = item.account_name
        item.value = item.id
        return item
      })
    })
  },
  /* 
    考勤组成员列表
    第一个参数传入this
    第二个参数为this对象里需要赋值数据的数组名
  */
  getCommutingAccount(that, name, data = {}) {
    that.$api.getcommutingaccount(data).then(res => {
      that[name] = res.data.map(item => {
        item.label = item.site_account_name
        item.value = item.site_account_id
        return item
      })
    })
  },

  /* 
    所有考勤组
    第一个参数传入this
    第二个参数为this对象里需要赋值数据的数组名
  */
  getallcommuting(that, name, data = {}) {
    that.$api.getallcommuting(data).then(res => {
      that[name] = res.data.map(item => {
        item.label = item.commuting_name
        item.value = item.id
        return item
      })
    })
  },
  /* 
    获取商家下拉列表
    第一个参数传入this
    第二个参数为this对象里需要赋值数据的数组名
  */
  getMerchantList(that, name, data = {}) {
    that.$api.getMerchantList(data).then(res => {
      that[name] = res.data.map(item => {
        item.label = item.merchant_name
        item.value = item.id
        return item
      })
    })
  },
  /* 
    获取仓库下拉列表
    第一个参数传入this
    第二个参数为this对象里需要赋值数据的数组名
  */
  getWarehouseName(that, name, data = {}) {
    that.$api.getWarehouseName(data).then(res => {
      that[name] = res.data.map(item => {
        item.label = item.name
        item.value = item.id
        return item
      })
    })
  },

  getUserInfo(that, name, data = {}) {
    that.$api.getUserInfoDetail({ user_name: data }).then(res => {
      let userNameData = []
      res.data.forEach(item => {
        userNameData.push({
          phone: item.phone,
          user_name: item.user_name,
          user_id: item.id
        })
        that[name] = userNameData.map(item => {
          item.label = item.user_name
          item.value = item.user_id
          return item
        })
      })
    })
  },

  //获取一级公司下拉
  firstCompanyList(that, name) {
    that.$api.firstCompanyList().then(res => {
      if (res.code === 200) {
        that[name] = res.data.map(item => {
          item.label = item.company_name
          item.value = item.id
          return item
        })
      }
    })
  },

  // 登录后的设置
  loginSet(data) {
    localStorage.clear()
    localStorage.setItem("token", JSON.stringify(data.login_token))
    localStorage.setItem("userInfo", JSON.stringify(data))
    localStorage.setItem("project", data.project)

    this.$router.push({ name: "Home" })
  },

  /* 
    获取权限  
    1. route信息
    2. 当前权限对应的key
    3. 是否是特殊权限 2级页面以下的权限 不能通过目录匹配到 需要全局匹配
  */
  getPermission: (routeMatched, key) => {
    let permission = false
    let menu = []
    const oneModule = routeMatched[0].name
    const twoModule = routeMatched[routeMatched.length - 1].name
    // const systemModule = localStorage.getItem("systemModule") || "bizCloud"
    // if (systemModule === "bizCloud") menu = JSON.parse(localStorage.getItem("bizMenu"))
    let bizMenu = localStorage.getItem("bizMenu")
    menu = bizMenu ? JSON.parse(bizMenu) : []
    menu.forEach(item => {
      if (item.key === oneModule) {
        item.children.forEach(sitem => {
          if (sitem.key === twoModule) {
            sitem.children.forEach(ssitem => {
              if (ssitem.key === key) permission = true
            })
          }
        })
      }
    })
    // 部分页面的按钮实际上是三级页面的按钮 无法根据路由匹配到
    // 如果根据路由没有匹配到  就在每个二级目录下全匹配
    if (!permission) {
      menu.forEach(item => {
        item.children.forEach(sitem => {
          if (sitem.key === key) {
            permission = true
          } else {
            sitem.children.forEach(ssitem => {
              if (ssitem.key === key) {
                permission = true
              } else {
                ssitem.children.forEach(sssitem => {
                  if (sssitem.key === key) permission = true
                })
              }
            })
          }
        })
      })
    }
    return permission
  }
}
export default com
