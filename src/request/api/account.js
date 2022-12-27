// 后台账号接口
import { get, post, put, del } from "../http"

export default {
  getCompanyDepartmentList: params => get("/api/admin/v1/admin/department/name", params), // 获取公司部门列表
  getCompanyPositionList: params => get("/api/admin/v1/account/listpositions", params), // 获取公司/项目/岗位三级联动列表
  // getCompanyProjectList: params => get("/api/admin/v1/account/positionprojects", params), // 获取公司项目列表

  getPositionProjectList: params => get("/api/admin/v1/role/project", params), // 根据角色获取项目

  // 项目管理

  getProjectSelectList: params => get("/api/admin/v1/project/name", params), // 获取项目列表下拉
  getProjectList: params => get("/api/admin/v1/project/projectlist", params), // 获取项目列表
  getProject: params => get("/api/admin/v1/project/projectdetail", params), // 获取项目详情
  postProject: params => post("/api/admin/v1/project/addproject", params), // 新增项目
  editProject: params => post("/api/admin/v1/project/editproject", params), // 编辑项目
  ChangeProject: params => post("/api/admin/v1/project/updatestate", params), // 项目停止/继续

  // 后台账号
  changePassword: params => post("/api/admin/v1/adminaccount/editpass", params), // 修改账号密码
  getAccountList: params => get("/api/admin/v1/adminaccount/list", params), // 获取账号列表
  postAccount: params => post("/api/admin/v1/adminaccount/add", params), // 新增账号
  editAccount: params => post("/api/admin/v1/adminaccount/edit", params), // 编辑账号
  delAccount: params => get("/api/admin/v1/adminaccount/del", params), // 删除账号
  getAccount: params => get("/api/admin/v1/adminaccount/get", params), // 获取账号详情
  detailAccount: params => get("/api/admin/v2/account/detail", params), // 获取账号详情v2
  updateAccount: params => put("/api/admin/v2/account", params), // 编辑账号v2
  resetPassword: params => get("/api/admin/v1/adminaccount/restore", params), // 账号密码恢复
  ChangeAccountState: params => get("/api/admin/v1/adminaccount/stop", params), // 账号停止/继续
  unionLogin: params => post("/api/admin/v1/adminaccount/d05login", params), // 联合登录
  getAccountRecordList: params => get("/api/admin/v1/adminaccount/records", params), // 查看账号记录
  getAccountOperationRecordList: params => get("/api/admin/v2/action/records", params), // 查看操作记录

  // v2
  addAccount: params => post("/api/admin/v2/account", params), // 新增账号
  switchproject: params => put("/api/admin/v2/account/switchproject", params), // 切换项目

  // 小程序账号
  getAppAccountList: params => get("/api/admin/v1/accounts/list", params), // 获取账号列表
  postAppAccount: params => post("/api/admin/v1/accounts/add", params), // 新增账号
  editAppAccount: params => post("/api/admin/v1/accounts/edit", params), // 编辑账号
  delAppAccount: params => get("/api/admin/v1/accounts/del", params), // 删除账号
  getAppAccount: params => get("/api/admin/v1/accounts/get", params), // 获取账号详情
  resetAppAccountPwd: params => get("/api/admin/v1/accounts/restore", params), // 重置密码
  ChangeAppAccountState: params => get("/api/admin/v1/accounts/stopaccounts", params), // 账号停止/继续
  getAppAccountRecord: params => get("/api/admin/v1/accounts/records", params), // 查看小程序账号记录

  getProjectGarbageHouses: params => get("/api/admin/v1/garbagehouse/getprojecthouse", params) // 获取项目下的环保屋
}
