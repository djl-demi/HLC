// 设施模块接口
import { get, post, put, del } from "../http"

export default {
  //项目公司
  addCompanyManagement: params => post("/api/admin/v1/project/addproject", params), // 新增公司管理
  getCompanyManagementList: params => get("/api/admin/v1/project/projectlist", params), // 获取公司管理列表
  editCompanyManagement: params => post("/api/admin/v1/project/editproject", params), // 编辑公司管理
  viewCompanyManagement: params => get("/api/admin/v1/project/projectdetail", params), // 详情公司管理
  firstCompanyList: params => get("/api/admin/v1/company/name", params), //公司管理 — 一级公司下拉
  delCompanyManagement: params => del("/api/admin/v1/project", params), // 删除
  stateProjectManagement: params => post("/api/admin/v1/project/updatestate", params), // 项目停止/继续

  // 岗位管理
  getPositionManagementList: params => get("/api/admin/v1/position", params), // 获取岗位管理列表
  addPositionManagement: params => post("/api/admin/v1/position", params), // 新增岗位管理
  editPositionManagement: params => put("/api/admin/v1/position", params), // 编辑岗位管理
  viewPositionManagement: params => get("/api/admin/v1/position/detail", params), // 详情岗位管理
  statePositionManagement: params => put("/api/admin/v1/position/state", params), // 正常或者禁用职位
  delPosition: params => del("/api/admin/v1/position", params), // 删除职位
  getProjectList: params => get("/api/admin/v1/project/name", params), // 岗位公司下项目

  // 后台
  viewPositionPermission: params => get("/api/admin/v1/permission/position", params), // 查看权限
  viewEditPermission: params => get("/api/admin/v1/position/detailpermission", params), // 查看待编辑权限
  // viewBgPermission: params => get("/api/admin/v1/adminposition/getmenus", params), // 查看后台权限
  // editBgPermission: params => get("/api/admin/v1/adminposition/menusdetail", params), // 编辑后台权限
  putPermission: params => put("/api/admin/v1/position/permission", params), // 编辑权限-保存

  // 小程序
  // viewAppBgPermission: params => get("/api/admin/v1/adminposition/getsitemenus", params), // 查看后台权限
  // editAppBgPermission: params => get("/api/admin/v1/adminposition/sitemenusdetail", params), // 编辑后台权限
  // putAppBgPermission: params => put("/api/admin/v1/menus/updatesitemenuspermission", params), // 编辑后台权限-保存

  // 数据中心
  viewDataCenterBgPermission: params => get("/api/admin/v1/adminposition/getsitemenus", params), // 查看后台权限
  editDataCenterBgPermission: params => get("/api/admin/v1/adminposition/sitemenusdetail", params), // 编辑后台权限
  putDataCenterBgPermission: params => put("/api/admin/v1/menus/updatesitemenuspermission", params) // 编辑后台权限-保存
}
