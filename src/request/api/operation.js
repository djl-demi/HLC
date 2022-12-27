// 设施模块接口
import { get, post, put, del } from "../http"

export default {
  //礼品库存
  getGiftInventoryList: params => get("/api/admin/v1/giftreport/list", params), // 获取礼品库存列表
  viewGiftInventory: params => get("/api/admin/v1/gift/giftrecord", params), // 礼品库存详情

  //定时定点活动
  getActivitylist: params => get("/api/admin/v1/giftactivity/activitylist", params), // 获取定时定点活动列表
  addActivity: params => post("/api/admin/v1/giftactivity/addactivity", params), // 新增定时定点活动
  editActivity: params => post("/api/admin/v1/giftactivity/editactivity", params), // 编辑定时定点活动
  viewActivity: params => get("/api/admin/v1/giftactivity/activitydetail", params), // 定时定点活动详情
  checkActivity: params => get("/api/admin/v1/giftactivity/examine", params), // 定时定点活动审核
  dealActivity: params => get("/api/admin/v1/giftactivity/cancelordel", params), // 删除或取消定时定点活动
  copyActivity: params => get("/api/admin/v1/giftactivity/copyactivity", params), // 复制定时定点活动
  activityGift: params => get("/api/admin/v1/gift/allgift", params), // 定时定点活动所有礼品
  getResponsiblerList: params => get("/api/admin/v1/accounts/getalllist", params), // 获取负责人列表

  //兑换记录
  getExchangeRecord: params => get("/api/admin/v1/exchange/userexchange", params), // 获取兑换记录列表
  exportExchangeRecord: params => get("/api/admin/v1/exchange/export", params), // 兑换记录导出
  cancelExchangeRecord: params => get("/api/admin/v1/exchange/cancelexchange", params), // 取消订单
  updateExchangeRecord: params => put("/api/admin/v1/exchange/update", params), // 编辑礼品兑换订单
  deleteExchangeRecord: params => del("/api/admin/v1/exchange/delete", params), // 删除礼品兑换订单

  photoInspection: params => get("/api/admin/v1/photo/inspection", params), // 拍照巡检 — 列表
  inspectionInfo: params => get("/api/admin/v1/photo/inspection/info", params), // 拍照巡检 — 详情

  //分类投放定时定点活动-活动发布
  getActivityManageList: params => get("/api/admin/v1/activity", params), // 活动发布 — 列表
  addActivityManage: params => post("/api/admin/v1/activity", params), // 活动发布-新增
  editActivityManage: params => put("/api/admin/v1/activity", params), // 活动发布 — 编辑
  viewActivityManage: params => get("/api/admin/v1/activity/info", params), // 活动发布 — 详情
  issueActivityManage: params => put("/api/admin/v1/activity/issue", params), // 活动发布 — 上线
  delActivityManage: params => del("/api/admin/v1/activity", params), // 活动发布 — 删除
  offlineActivityManage: params => put("/api/admin/v1/activity/offline", params), // 活动发布 — 下线

  //新闻管理
  getNewManageList: params => get("/api/admin/v1/journalism", params), // 新闻管理 — 列表
  addNewManage: params => post("/api/admin/v1/journalism", params), // 新闻管理-新增
  editNewManage: params => put("/api/admin/v1/journalism", params), // 新闻管理 — 编辑
  viewNewManage: params => get("/api/admin/v1/journalism/info", params), // 新闻管理 — 详情
  onlineNewManage: params => put("/api/admin/v1/journalism/online", params), // 新闻管理 — 上线
  delNewManage: params => del("/api/admin/v1/journalism", params), // 新闻管理 — 删除
  offlineNewManage: params => put("/api/admin/v1/journalism/offline", params), // 新闻管理 — 下线

  //分类问答
  getClassificationList: params => get("/api/admin/v1/classification/classificationlist", params), // 分类问答列表
  addClassification: params => post("/api/admin/v1/classification/addclassification", params), // 新增分类问答
  editClassification: params => post("/api/admin/v1/classification/editclassification", params), // 修改分类问答
  viewClassification: params => get("/api/admin/v1/classification/classificationdetail", params), // 分类问答详情
  dealClassification: params => post("/api/admin/v1/classification/updatestate", params), // 删除、上线、下线分类问答
  importClassification: params => post("/api/admin/v1/classificationdetail/import", params), // 上传分类问答题目
  getQuestion: params => get("/api/admin/v1/classification/getquestion", params), // 根据uuid获取题目

  //答题记录
  getAnswerRecordlist: params => get("/api/admin/v1/userclassification/userclassificationlist", params), // 答题记录列表
  viewAnswerRecord: params => get("/api/admin/v1/userclassification/getuserclassificationdetail", params), // 答题记录详情

  //业主巡检审核
  getInspectionList: params => get("/api/admin/v1/inspection", params), // 业主巡检审核 — 列表
  putInspectionAudit: params => put("/api/admin/v1/inspection/audit", params) // 业主巡检审核 — 审核
}
