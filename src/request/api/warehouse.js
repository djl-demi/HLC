import { get, post, put, del } from "../http"

export default {
  //仓库管理
  getWarehouseList: params => get("/api/admin/v1/warehouse", params), // 仓库管理列表
  addWarehouse: params => post("/api/admin/v1/warehouse", params), // 新增仓库
  editWarehouse: params => put("/api/admin/v1/warehouse", params), // 编辑仓库
  warehouseDetail: params => get("/api/admin/v1/warehouse/info", params), // 仓库详情
  delWarehouse: params => del("/api/admin/v1/warehouse", params), // 删除仓库
  getAccountName: params => get("/api/admin/v1/account/name", params), // 管理员下拉

  //活动物品管理
  getActivityGoodsList: params => get("/api/admin/v2/activity/items", params), // 活动物品列表
  addActivityGoods: params => post("/api/admin/v2/activity/items", params), // 新增 活动物品
  editActivityGoods: params => put("/api/admin/v2/activity/items", params), // 编辑 活动物品
  activityGoodsDetail: params => get("/api/admin/v2/activity/items/info", params), //  活动物品详情
  delActivityGoods: params => del("/api/admin/v2/activity/items", params), // 删除 活动物品
  getWarehouseName: params => get("/api/admin/v2/warehouse/name", params), // 仓库下拉

  //库存管理
  getStockList: params => get("/api/admin/v1/gift/real/time/stock", params), // 库存实时列表
  editStock: params => put("/api/admin/v1/gift/real/time/stock", params), // 编辑 实时
  stockDetail: params => get("/api/admin/v1/gift/real/time/stock/info", params), //  实时详情
  getStockRecord: params => get("/api/admin/v1/gift/real/time/stock/record", params), // 实时操作记录
  getHistoryRecord: params => get("/api/admin/v1/gift/report/record", params), // 历史操作记录
  stockoutList: params => get("/api/admin/v1/stock/out", params), // 出库列表
  cancelStockOut: params => del("/api/admin/v1/stock/out", params), // 取消出库

  getReportList: params => get("/api/admin/v1/gift/report", params), // 历史列表

  //礼品入库
  getGiftStorageList: params => get("/api/admin/v1/gift/activity/stock/in", params), // 获取礼品入库列表
  editGiftStockIn: params => put("/api/admin/v1/gift/activity/stock/in", params), // 修改礼品入库
  viewGiftStorage: params => get("/api/admin/v1/gift/activity/stock/in/info", params), // 礼品入库详情

  addGiftStorage: params => post("/api/admin/v1/gift/addgift", params), // 新增礼品入库
  editGiftStorage: params => post("/api/admin/v1/gift/editgift", params), // 编辑礼品入库
  viewGiftStoraget: params => get("/api/admin/v1/gift/giftdetail", params), // 礼品入库详情
  delGiftStoraget: params => post("/api/admin/v1/gift/delgift", params), // 礼品入库删除

  //礼品出库
  getGiftDeliveryList: params => get("/api/admin/v1/giftstock/stocklist", params), // 获取礼品出库列表
  editGiftDelivery: params => post("/api/admin/v1/giftstock/editstock", params), // 修改礼品出库
  viewGiftDelivery: params => get("/api/admin/v1/giftstock/stockdetail", params) // 礼品出库详情
}
