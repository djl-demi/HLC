// 后台账号接口
import { get, post, put, del } from "../http"

export default {
  //加油管理
  getOilManagement: params => get("/bid/oil/getRefuelingRecord", params), // 加油管理-加油记录查询
  addOilCard: params => post("/bid/oil/addOilCard", params), // 加油管理-加油卡新增
  alterOilCard: params => put("/bid/oil/alterOilCard", params), // 加油管理-加油卡编辑
  // deleteOilCard: params => put("/bid/oil/deleteOilCard", params), // 加油管理-加油卡删除
  getOperator: params => get("/bid/oil/getOperator", params), // 加油管理-获取加油工
  getMastOilCard: params => get("/bid/oil/getMastOilCard", params), // 加油管理-获取油卡主卡
  getOilData: params => get("/bid/oil/getOilData", params), // 加油管理-获取油卡列表
  recordExport: params => get("/api/admin/v1/refueling/record/export", params), // 加油管理-记录加油导出
  getOilManagementDetail: params => get("/java/vehicle/getOilManagementDetail", params), // 加油管理-记录加油详情
  deleteOilManagement: params => post("/java/vehicle/deleteOilManagement", params), // 加油管理-删除记录加油
  vehicleType: params => get("/bid/vehicleType/type", params) // 获取车辆类型
}
