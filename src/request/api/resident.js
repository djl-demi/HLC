// 设施模块接口
import { get, post, put, del } from "../http"

export default {
  //小区管理
  getCommunityManagementList: params => get("/api/admin/v1/plot", params), // 获取小区管理列表
  addCommunityManagement: params => post("/api/admin/v1/plot", params), // 新增小区管理
  editCommunityManagement: params => put("/api/admin/v1/plot", params), // 编辑小区管理
  viewCommunityManagement: params => get("/api/admin/v1/plot/info", params), // 小区管理详情
  exportCommunityManagement: params => get("/api/admin/v1/plot/export", params), // 小区管理导出
  importCommunityManagement: params => post("/api/admin/v1/plot/to/lead", params), // 小区管理导入
  getPlotLocation: params => get("/api/bid/home/getPlotLocation", params), // 获取小区信息
  delCommunityManagement: params => del("/api/admin/v1/plot", params), // 小区 删除
  //居民信息
  getCustomerInformationList: params => get("/api/admin/v1/user", params), // 获取客户信息列表
  addCustomerInformation: params => post("/api/admin/v1/user", params), // 新增客户信息
  editCustomerInformation: params => put("/api/admin/v1/user", params), // 编辑客户信息
  viewCustomerInformation: params => get("/api/admin/v1/user/info", params), // 客户信息详情
  changedetail: params => get("/api/admin/v1/integral/changedetail", params), // 积分变更详情
  exportCustomerInformation: params => get("/api/admin/v1/user/export", params), // 客户信息导出
  orderCustomerInfo: params => get("/api/admin/v1/user/stock/in", params), // 客户信息-订单记录
  exchangeCustomerInfo: params => get("/api/admin/v1/user/integral/exchange", params), // 客户信息-兑换记录
  updateintegral: params => get("/api/admin/v1/user/integral/updateintegral", params), // 修改积分
  importCustomerInfo: params => post("/api/admin/v1/user/to/lead", params), // 客户信息导入
  delCustomerInfo: params => del("/api/admin/v1/user", params), // 客户信息 删除

  getClassifiedPatrol: params => get("/api/admin/v1/classified/patrol", params), // 获取分类巡检列表
  getICCard: params => get("/api/admin/v1/user/ic/card", params) // 客户信息-兑换记录
}
