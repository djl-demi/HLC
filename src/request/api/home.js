// 公共接口
import { get, post, put } from "../http"

export default {
  getHomeData: params => get("/api/admin/v1/plot/user/participate/report/index", params), // 获取首页
  getLocalWeather: params => get("http://106.14.144.55:8083/DanShanHome/getWeather", params), // 获取天气
  residentStatistics: params => get("/api/bid/home/residentStatistics", params) // 获取居民信息
}
