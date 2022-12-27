// 后台账号接口
import { get, post, put, del } from "../http"

export default {
  //IC卡管理
  getICManagementList: params => get("/api/admin/v1/ic/card", params), // 获取IC卡管理列表
  viewICManagement: params => get("/api/admin/v1/ic/card/info", params), // 获取IC卡管理详情
  getUserInfoDetail: params => get("/api/admin/v1/user/name", params), // 获取用户信息
  addICManagement: params => post("/api/admin/v1/ic/card", params), // 新增IC卡管理
  editICManagement: params => put("/api/admin/v1/ic/card", params), // 编辑IC卡管理
  stateICManagement: params => put("/api/admin/v1/ic/card/state", params), // IC卡启用禁用
  delICManagement: params => del("/api/admin/v1/ic/card", params), // 删除IC卡管理
  getBindingRecord: params => get("/api/admin/v1/ic/card/binding/record", params), // 绑定记录

  // 分类投递亭
  getGarbageKioskList: params => get("/api/admin/v1/garbagehouse/houselist", params), // 获取分类亭列表
  viewGarbageKiosk: params => get("/api/admin/v1/garbagehouse/housedetail", params), // 获取分类亭详情
  addGarbageKiosk: params => post("/api/admin/v1/garbagehouse/addhouse", params), // 新增分类亭
  editGarbageKiosk: params => post("/api/admin/v1/garbagehouse/edithouse", params), // 编辑分类亭
  stateGarbageKiosk: params => get("/api/admin/v1/garbagehouse/updatestate", params), // 分类亭-启用禁用
  delGarbageKiosk: params => del("/api/admin/v1/garbagehouse/delhouse", params), // 删除分类亭

  // 智能垃圾桶
  getMintpassRubbishList: params => get("/api/bid/can/getCan", params), // 获取智能垃圾桶列表
  getMintpassRubbishChildList: params => get("/api/bid/can/getSubCanType", params), // 获取智能垃圾桶子桶列表
  getMintpassRubbishPutDetail: params => get("/api/bid/can/getAlterData", params), // 获取智能垃圾桶编辑详情
  addMintpassRubbish: params => post("/api/bid/can/addCan", params), // 新增智能垃圾桶
  putMintpassRubbish: params => put("/api/bid/can/alterCan", params), // 编辑智能垃圾桶
  delMintpassRubbish: params => del("/api/bid/can/deleteCan", params), // 编辑智能垃圾桶
  stateMintpassRubbish: params => put("/api/bid/can/alterCanState", params), // 智能垃圾桶-启用禁用
  getMintpassRubbishPlotOptions: params => get("/api/bid/can/getPlotData", params), // 所属小区 下拉列表
  getMintpassRubbishLocation: params => get("/api/bid/can/getLocation", params), // 智能垃圾桶定位
  getMintpassRubbishDetail: params => get("/api/bid/can/getCanDetail", params), // 获取智能垃圾桶详情
  getMintpassRubbishPutRecord: params => get("/api/bid/can/getCanLaunchRecord", params), // 获取智能垃圾桶投放记录
  getMintpassRubbishStatusRecord: params => get("/api/bid/can/getCanStateRecord", params), // 获取智能垃圾桶状态记录

  getClassifiedItemsList: params => get("/api/bid/can/getIntegral", params), // 获取分类物品列表
  putClassifiedItems: params => put("/api/bid/can/alterIntegral", params), // 分类物品编辑

  // 车载设备
  getVehicleOptions: params => get("/api/admin/v1/vehicle/num", params), // 获取车辆下拉列表
  getCarEquipmentList: params => get("/api/admin/v1/vehicle/card", params), // 获取车载设备列表
  getCarEquipmentDetail: params => get("/api/admin/v1/vehicle/card/info", params), // 车载设备详情
  addCarEquipment: params => post("/api/admin/v1/vehicle/card", params), // 新增车载设备
  putCarEquipment: params => put("/api/admin/v1/vehicle/card", params), // 编辑车载设备
  delCarEquipment: params => del("/api/admin/v1/vehicle/card", params), // 删除车载设备
  putCarEquipmentIsNormal: params => put("/api/admin/v1/vehicle/card/state", params), // 车载设备  正常/停止
  getCarEquipmentLocation: params => get("/api/admin/v1/location", params), // 车载设备查看定位

  // 视频设备
  getVideoEquipmentList: params => get("/api/admin/v1/station/video", params), // 获取视频设备列表
  getVideoEquipmentDetail: params => get("/api/admin/v1/station/video/info", params), // 编辑视频设备详情
  addVideoEquipment: params => post("/api/admin/v1/station/video", params), // 新增视频设备
  putVideoEquipment: params => put("/api/admin/v1/station/video", params), // 编辑视频设备
  delVideoEquipment: params => del("/api/admin/v1/station/video", params), // 删除视频设备
  putVideoEquipmentIsNormal: params => put("/api/admin/v1/station/video/state", params), // 视频设备  正常/停止

  // 车辆管理
  // getVehicleList: params => get("/api/admin/v1/vehicle/vehiclelist", params), // 获取车辆列表
  getVehicleList: params => get("/api/bid/vehicle/manageList", params), // 获取车辆列表
  getVehicleDetail: params => get("/api/admin/v1/vehicle/vehicledetail", params), // 车辆详情
  getVehicleTrack: params => get("/api/admin/v1/vehicle/getvehiclecardinfo", params), // 车辆轨迹
  // addVehicle: params => post("/api/admin/v1/vehicle/addvehicle", params), // 新增车辆
  addVehicle: params => post("/api/bid/vehicle/saveCar", params), // 新增车辆
  putVehicle: params => post("/api/admin/v1/vehicle/editvehicle", params), // 编辑车辆
  delVehicle: params => get("/api/admin/v1/vehicle/delvehicle", params), // 删除车辆
  putVehicleIsNormal: params => get("/api/admin/v1/vehicle/updatestatus", params), // 车辆  正常/停止
  getDriverList: params => get("/api/bid/driver/driverName", params), // 获取司机列表
  saveVehicleType: params => post("/api/bid/vehicleType/saveCarType", params), // 新增车辆类型
  updateVehicleType: params => put("/api/bid/vehicleType/updateCarType", params), // 编辑车辆类型
  getVehicleTypeList: params => get("/api/bid/vehicleType/type", params), // 获取车辆类型列表
  delVehicleType: params => del("/api/bid/vehicleType/deleteCarType", params), // 删除车辆类型
  upVehicleState: params => put("/api/bid/vehicle/updateCar", params), // 编辑车辆状态
  vehicleTypeDropList: params => get("/api/bid/vehicleType/typeDown", params), // 车辆类型下拉列表接口
  saveVehicleWorkType: params => post("/api/bid/taskType/saveCarType", params), // 新增作业类型
  updateVehicleWorkType: params => put("/api/bid/taskType/updateCarType", params), // 编辑作业类型
  getVehicleWorkTypeList: params => get("/api/bid/taskType/type", params), // 获取作业类型列表
  delVehicleWorkType: params => del("/api/bid/taskType/deleteCarType", params), // 删除作业类型
  vehicleWorkTypeDropList: params => get("/api/bid/taskType/typeDown", params), // 作业类型下拉列表接口
  getOilTypeList: params => get("/api/bid/oil/getOilTypeData", params), // 油型列表
  driverList: params => get("/api/bid/driver/driverManagement", params), // 司机列表
  listDriver: params => get("/api/bid/driver/selectDriverList", params), // 司机搜索列表
  upDriverState: params => put("/api/bid/driver/updateDriver", params), // 司机状态变更
  assignDriver: params => post("/api/bid/driver/assignDriver", params), // 司机分配
  vehicleDetail: params => get("/api/bid/vehicle/selectCar", params), // 车辆详情
  delBatchVehicle: params => del("/api/bid/driver/deleteVehicle", params), // 车辆批量删除
  garbageHouseDropList: params => get("/api/bid/garbageHouse/garbageHouse", params), // 环保屋下拉列表
  saveDriver: params => post("/api/bid/driver/saveDriver", params), // 新增司机
  updateDriver: params => put("/api/bid/driver/update", params), // 编辑司机
  resetPwd: params => get("/api/bid/driver/updatePassword", params), // 密码恢复
  deleteDriver: params => del("/api/bid/driver/deleteDriver", params), // 删除司机

  // 环保屋,分拣站视频监控
  getOnlineNum: params => get("/api/bid/video/getVideoStatus", params), // 获取在线离线数量
  getWatchVideoList: params => get("/api/bid/video/getVideoData", params), // 获取视频列表
  getWatchVideoUrl: params => get("/api/bid/video/getVideoUrl", params), // 获取直播地址

  //视频分组
  videoStatusCount: params => get("/api/bid/video/count", params), //统计在线离线数量
  addVideoGroup: params => post("/api/bid/video/groupAdd", params), //新增摄像头分组
  updateVideoGroup: params => post("/api/bid/video/groupUpdate", params), //编辑摄像头分组
  deleteVideoGroup: params => post("/api/bid/video/groupDelete", params), //删除摄像头分组
  getVideoGroupList: params => post("/api/bid/video/groupList", params), //摄像头分组查询
  getVideoListByGroup: params => post("/api/bid/video/list", params), //摄像头分组监控列表
  getVideoListByName: params => post("/api/bid/video/listByName", params) //模糊查询摄像头列表
}
