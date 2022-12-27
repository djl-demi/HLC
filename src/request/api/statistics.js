// 后台账号接口
import { get, post, put, del } from "../http"

export default {
  // 居民知晓率
  getResidentTable: params => get("/api/admin/v1/resident/show", params), // 获取居民知晓率表格
  residentshowrealtime: params => get("/api/admin/v1/resident/residentshowrealtime", params), // 获取居民知晓率
  residentshowrealtimelist: params => get("/api/admin/v1/resident/residentshowrealtimelist", params), // 获取居民注册参与率

  getResidentChart: params => get("/api/admin/v1/resident/chart", params), // 获取居民知晓率图表

  // 参与率
  getPlotStock: params => get("/api/admin/v1/plotstock/participation", params), // 获取参与率统计

  // 小区投放量
  getCommunityStatistics: params => get("/api/admin/v1/plotstock/stockrate", params), // 获取个人投放量列表

  // 小区投放量
  stockraterealtime: params => get("/api/admin/v1/plotstock/stockraterealtime", params),
  // 个人投放量
  getPersonalStatistics: params => get("/api/admin/v1/user/stock/report", params), // 获取个人投放量列表
  getNewPersonalStatistics: params => get("/api/admin/v1/userstockreport/userstock", params), // 获取个人投放量列表v2
  getPersonalStatisticsDetail: params => get("/api/admin/v1/userstockreport/userstockdetail", params), // 获取个人投放量详情
  getGoodsStatistics: params => get("/api/admin/v1/userstockreport/getusergoodreport", params), // 获取个人物品投放量详情
  exportGoodsStatistics: params => get("/api/admin/v1/userstockreport/userstockexport", params), // 后台导出个人物品投放量统计

  // 每日参与率
  getDailyParticipationRate: params => get("/api/admin/v1/plot/user/participate/report", params), // 获取每日参与率列表

  // 积分汇总
  getPointsSummary: params => get("/api/admin/v1/plot/integral/report", params), // 获取积分兑换统计列表

  // 积分兑换统计
  getPointsExchangeStatistics: params => get("/api/admin/v1/integral/exchange/report", params), // 获取积分兑换统计列表

  // 积分报表
  getPointsReportGain: params => get("/api/admin/v1/integral/acquisition", params), // 获取积分获取列表
  getPointsReportExchange: params => get("/api/admin/v1/integral/exchange/month", params), // 获取积分兑换列表

  //数据分析
  getFrequencyAnalysis: params => get("/api/bid/analysis/frequency", params), // 投放频次分析
  getRecycleAnalysis: params => get("/api/bid/analysis/recycle", params), // 回收量分析
  getRecycleCharts: params => get("/api/bid/analysis/recycleCharts", params), // 回收量分析柱状图
  getRecycleRanking: params => get("/api/bid/analysis/recycleRanking", params), // 回收量排行榜
  getRecycleRankingCharts: params => get("/api/bid/analysis/recycleRankingCharts", params), // 回收量排行榜折线图

  frequencyExport: params => get("/api/bid/analysis/frequencyExport", params), // 投放频次分析导出
  recycleExport: params => get("/api/bid/analysis/recycleExport", params), // 回收量分析导出
  recycleRankingExport: params => get("/api/bid/analysis/recycleRankingExport", params), // 回收量排行榜导出
  // 数据大屏
  sumModule: params => get("/api/bid/home/sumModule", params), //获取居民统计
  getRecyclingSum: params => get("/api/bid/home/getRecyclingSum", params), //回收垃圾量统计
  getTwoWeekStockRecoed: params => get("/api/bid/home/getTwoWeekStockRecoed", params), //每日居民投放次数统计
  getMonthRecycle: params => get("/api/bid/home/getMonthRecycle", params), //月度回收统计
  getRecycleModule: params => get("/api/bid/home/getRecycleModule", params), //可回收统计
  getComprehensiveModule: params => get("/api/bid/home/getComprehensiveModule", params), //小区综合排名统计
  getResidentInvestment: params => get("/api/bid/home/getResidentInvestment", params), //居民投放统计
  getWeather: params => get("/api/bid/home/getWeather", params), //天气

  // 新大屏数据中心
  getGisFacilitesMarker: params => get("/api/admin/v1/gis/show", params), //GIS地图信息点
  getGisFacilitesMarkerDetail: params => get("/api/admin/v1/gis/info", params), //GIS地图信息点详情
  getFacilityStatistics: params => get("/api/admin/v1/facility/statistics", params), //设施统计
  getLatestStatistics: params => get("/api/admin/v1/data/week", params), //近七天各品类统计
  getStockoutCategory: params => get("/api/admin/v1/data/stockoutcategory", params), //可回收物出库情况
  getStockCategoryout: params => get("/api/admin/v1/data/stockcategoryout", params), //可回收物出库去向情况
  getMonthRecycleData: params => get("/api/admin/v1/month", params), //月度回收
  getRecoveryChangeData: params => get("/api/admin/v1/recovery", params), //回收变化

  //自定义数据
  getRecycleList: params => get("/api/admin/v1/diy/monthrecycle/list", params), //泗阳统计数据列表
  delRecycleData: params => del("/api/admin/v1/diy/monthrecycle/record", params), //泗阳统计数据删除
  putRecycleData: params => put("/api/admin/v1/diy/monthrecycle/record", params), //泗阳统计数据编辑
  importRecycleData: params => post("/api/admin/v1/diy/monthrecycle/import", params), //泗阳统计数据导入
  getGarbagehouseList: params => get("/api/admin/v1/diy/garbagehouse/droplist", params), //泗阳收集站点下拉

  getShowchartdata: params => get("/api/admin/v1/diy/monthrecycle/showchartdata", params) //泗阳统计数据柱形图
}
