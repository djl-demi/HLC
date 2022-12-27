// 后台账号接口
import { get, post, put, del } from "../http"

export default {
  // 操作

  cancelActivity: params => put("/api/bid/baseActivity/cancelActivity", params), //取消活动
  deleteActivity: params => put("/api/bid/baseActivity/deleteActivity", params), //删除上门回收活动
  checkActivity: params => put("/api/bid/baseActivity/checkActivity", params), //活动审核
  // 宣传活动
  warehouseName: params => get("/api/admin/v2/warehouse/name", params), // 获取仓库下拉
  memberList: params => get("/api/bid/propaganda/memberList", params), // 活动成员名字列表下拉
  giftAndMaterial: params => get("/api/bid/propaganda/giftAndMaterial", params), // 礼品和物料列表查询
  propagandaSave: params => post("/api/bid/propaganda/save", params), // 宣传活动新增
  propagandaSupplement: params => put("/api/bid/propaganda/supplement", params), // 宣传活动新增
  activityList: params => get("/api/bid/propaganda/activityList", params), //宣传活动列表
  activityDetails: params => get("/api/bid/propaganda/activityDetails", params), //宣传活动基本信息&任务时间轴
  signIn: params => get("/api/bid/propaganda/signIn", params), //签到信息
  exchange: params => get("/api/bid/propaganda/exchange", params), //兑换信息
  recovery: params => get("/api/bid/propaganda/recovery", params), //回收活动
  activityUpdate: params => put("/api/bid/propaganda/activityUpdate", params), //宣传活动编辑
  propagandaPost: params => put("/api/bid/propaganda/post", params), //宣传活动编辑
  getVisit: params => get("/api/bid/returnVisit/getVisit", params), //获取回访信息
  endActivity: params => put("/api/bid/baseActivity/endActivity", params), //结束活动
  giftsMaterialsDetails: params => get("/api/bid/propaganda/giftsMaterialsDetails", params), //礼品和物料详情
  getUserData: params => get("/api/bid/comeToTheDoor/getUserData", params), // 获取用户信息
  addActivity: params => post("/api/bid/comeToTheDoor/addActivity", params), // 新增上门回收活动
  getGoodsData: params => get("/api/bid/comeToTheDoor/getGoodsData", params), // 获取物品列表信息
  alterActivity: params => put("/api/bid/comeToTheDoor/alterActivity", params), // 编辑上门回收活动

  dispatchActivity: params => post("/api/bid/comeToTheDoor/dispatchActivity", params), // 上门回收活动派单
  // cancelActivity: params => get("/api/bid/comeToTheDoor/cancelActivity", params), // 取消上门回收活动
  // deleteActivity: params => get("/api/bid/comeToTheDoor/deleteActivity", params), // 删除上门回收活动
  getActivity: params => get("/api/bid/comeToTheDoor/getActivity", params), // 获取上门回收活动
  getActivityDetail: params => get("/api/bid/comeToTheDoor/getActivityDetail", params), //获取上门回收活动详情
  getUserList: params => get("/api/bid/returnVisit/getUserList", params), //获取居民列表
  assignmentUser: params => get("/api/bid/returnVisit/assignmentUser", params) //获取居民列表
}
