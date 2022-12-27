// 设施模块接口
import { get, post, put, del } from "../http"

export default {
  // 交投管理
  getTradingManagementList: params => get("/api/admin/v1/trade", params), // 获取交投管理列表
  postTradingManagement: params => post("/api/admin/v1/trade", params), // 取消订单
  deleteTradingManagement: params => del("/api/admin/v1/trade/delete", params), //交投订单删除
  updateTradingManagement: params => put("/api/admin/v1/trade/update", params), //交投订单编辑

  exportTradingManagement: params => get("/api/admin/v1/trade/export", params), // 交投管理导出
  precisionSet: params => put("/api/admin/v1/project/precision", params), // 分类准确率
  getPrecisionRate: params => get("/api/admin/v1/project/precision", params), // 获取分类准确率
  // s审核
  auditJiaotou: params => put("/api/admin/v1/trade/audit", params), // 审核
  //库存管理
  getInventoryManagementList: params => get("/api/admin/v1/stock", params), // 获取库存管理列表
  getInventoryList: params => get("/api/bid/management/inventory", params), // 库存列表
  getCategorySelectList: params => get("/api/admin/v1/category/name", params), // 获取品类下拉列表
  getGoodsManagementList: params => get("/api/admin/v1/goods", params), // 获取物品管理列表
  postGoods: params => post("/api/admin/v1/goods", params), // 新增物品管理
  putGoods: params => put("/api/admin/v1/goods", params), // 编辑物品管理
  getGoodsDetail: params => get("/api/admin/v1/goods/info", params), // 获取物品管理详情
  delGoods: params => del("/api/admin/v1/goods", params), // 删除物品管理
  getmerchandisenumberlog: params => get("/api/admin/v1/merchandise/getmerchandisenumberlog", params), // 数量日志
  goodsCategoryList: params => get("/api/admin/v1/merchandisetype/getalltype", params), // 商品类型列表无分页
  goodsCategory: params => get("/api/admin/v1/merchandisetype/typelist", params), // 商品类型列表
  goodsCategoryAdd: params => post("/api/admin/v1/merchandisetype/addtype", params), // 商品类型新增
  goodsCategoryEdit: params => post("/api/admin/v1/merchandisetype/edittype", params), // 商品类型编辑
  goodsCategoryState: params => get("/api/admin/v1/merchandisetype/updatestate", params), // 商品类型状态
  goodsCategoryDetail: params => get("/api/admin/v1/merchandisetype/typedetail", params), // 商品类型详情
  goodsCategoryDel: params => get("/api/admin/v1/merchandisetype/deletetype", params), // 商品类型详情
  goodsCategorys: params => get("/api/admin/v1/category/name", params), // 商品类型列表
  goodsWarehouse: params => get("/api/admin/v2/warehouse/name", params), // 仓库下拉
  getStockList: params => get("/api/admin/v1/gift/real/time/stock", params), // 商品列表
  getGoodsWeightList: params => get("/api/admin/v1/goods/weight", params), // 获取投放重量列表
  postWeight: params => post("/api/admin/v1/goods/weight", params), // 新增投放重量
  putWeight: params => put("/api/admin/v1/goods/weight", params), // 编辑投放重量
  detailWeight: params => get("/api/admin/v1/goods/weight/info", params), // 投放重量详情
  getCategoryList: params => get("/api/admin/v1/category", params), // 获取物品管理列表
  postCategory: params => post("/api/admin/v1/category", params), // 新增物品管理
  putCategory: params => put("/api/admin/v1/category", params), // 编辑物品管理
  getCategoryDetail: params => get("/api/admin/v1/category/info", params), // 获取物品管理详情
  delCategory: params => del("/api/admin/v1/category", params), // 删除物品管理
  getPriceOrderList: params => get("/api/admin/v1/goodsprice/index", params), // 获取价格表列表
  addPriceOrder: params => post("/api/admin/v1/goodsprice/addprice", params), // 新增价格表列表
  putPriceOrder: params => post("/api/admin/v1/goodsprice/editprice", params), // 编辑价格表
  getPriceOrderDetail: params => get("/api/admin/v1/goodsprice/pricedetail", params), // 价格表详情
  delPriceOrder: params => get("/api/admin/v1/goodsprice/delprice", params), // 获取价格表列表
  getPriceOrderInfo: params => get("/api/admin/v1/goodsprice/getpriceinfo", params) // 价格表新增编辑使用的数据
}
