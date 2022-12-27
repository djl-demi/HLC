// 后台账号接口
import { get, post, put, del } from "../http"

export default {
  //加油管理
  getRefuelingRecord: params => get("/api/bid/oil/getRefuelingRecord", params), // 加油管理-加油记录查询
  getMonthlyRefuelingStatistics: params => get("/api/bid/oil/getMonthlyRefuelingStatistics", params), // 月度加油统计查询
  vehicleTypeTypeDown: params => get("/api/bid/vehicleType/typeDown", params), // 查询车辆类型列表下拉

  getVehicleMaintenance: params => get("/api/admin/v1/vehicle/maintenance", params), // 车辆维修-列表
  getVehicleType: params => get("/api/admin/v1/vehicle/type", params), // 车辆维修-列表
  delVehicleMaintenance: params => del("/api/admin/v1/vehicle/maintenance", params), // 车辆维修-列表

  addOilCard: params => post("/api/bid/oil/addOilCard", params), // 加油管理-加油卡新增
  alterOilCard: params => put("/api/bid/oil/alterOilCard", params), // 加油管理-加油卡编辑
  delOilCard: params => put("/api/bid/oil/deleteOilCard", params), // 加油管理-加油卡删除
  getOperator: params => get("/api/bid/oil/getOperator", params), // 加油管理-获取加油工
  getMastOilCard: params => get("/api/bid/oil/getMastOilCard", params), // 加油管理-获取油卡主卡
  getOilData: params => get("/api/bid/oil/getOilData", params), // 加油管理-获取油卡列表

  addOilType: params => post("/api/bid/oil/addOilType", params), // 加油管理-油型号新增
  alterOilType: params => put("/api/bid/oil/alterOilType", params), // 加油管理-油型编辑
  deleteOilType: params => del("/api/bid/oil/deleteOilType", params), // 加油管理-油型删除
  getOilTypeData: params => get("/api/bid/oil/getOilTypeData", params), // 加油管理-获取油型列表
  getOilType: params => get("/api/bid/oil/getOilType", params), // 加油管理-获取所有油型

  getMileage: params => get("/api/bid/oil/getMileage", params), // 里程统计查询

  getVehicleInsurance: params => get("/api/admin/v1/vehicle/insurance", params), // 车辆保险列表和搜索
  editVehicleInsurance: params => put("/api/admin/v1/vehicle/insurance", params), // 车辆保险编辑
  addVehicleInsurance: params => post("/api/admin/v1/vehicle/insurance", params), // 车辆保险新增
  delVehicleInsurance: params => del("/api/admin/v1/vehicle/insurance", params), // 车辆保险删除
  addInsurancefiles: params => post("/api/admin/v1/vehicle/insurancefiles", params), //保险附件新增
  getInsuranceDetail: params => get("/api/admin/v1/vehicle/insurance/detail", params), //车辆保险详情查看
  delInsurancefiles: params => del("/api/admin/v1/vehicle/insurancefiles", params), //车辆保险附件删除
  insuranceWarn: params => get("/api/admin/v1/vehicle/insurance/warn", params), //车辆保险提醒列表
  insuranceWarnRemove: params => put("/api/admin/v1/vehicle/insurance/warnremove", params) //车辆保险提醒处理
}
