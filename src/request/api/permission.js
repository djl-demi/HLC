// 设施模块接口
import { get, post, put, del } from "../http"

export default {
  //权限细目列表
  getPermissionList: params => get("/api/admin/v1/permission/all", params), // 获取权限细目列表
  addPermission: params => post("/api/admin/v1/permission", params), // 新增权限细目
  getPermissionDetail: params => get("/api/admin/v1/permission/detail", params), // 新增权限详情
  editPermission: params => put("/api/admin/v1/permission", params), // 编辑权限
  delPermission: params => del("/api/admin/v1/permission", params) // 删除权限
}
