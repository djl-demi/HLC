// 公共接口
import { get, post, put } from "../http"

export default {
  login: params => post("/api/admin/v1/login", params), // 登录
  loginOut: params => get("/api/admin/v1/logout", params), // 登出

  getCommunityAllList: params => get("/api/admin/v1/plot/name/all", params), // 获取所有的小区
  getCommunityChartList: params => get("/api/admin/v1/plot/name", params), // 获取小区一张图 小区下拉列表
  getCommunityChart: params => get("/api/admin/v1/plot/picture/show", params), // 获取小区一张图小区点列表
  getCommunityChartDetail: params => get("/api/admin/v1/plot/picture/info", params), // 获取小区一张图小区点详情
  getVehicleTrackPoints: params => get("/api/admin/v1/picture/vehicle/card/info", params), // 获取车辆轨迹点
  getChartMarkersList: params => get("/api/admin/v1/plot/picture/page", params), // 获取分类一张图定位点列表

  getAreaList: params => get("/api/admin/v1/area/get", params), // 获取省市区列表

  getSortingStationOptions: params => get("/api/admin/v1/facility", params), // 获取分拣站/环保屋下拉列表
  getGarbagehouseOptions: params => get("/api/admin/v1/garbagehouse/getallhouse", params) // 获取所有环保屋下拉列表
}
