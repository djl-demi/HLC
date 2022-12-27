// 设施模块接口
import { get, post, put, del } from "../http"

export default {
  //分拣站
  getSortingStationList: params => get("/api/admin/v1/site/info", params), // 获取分拣站列表
  addSortingStation: params => post("/api/admin/v1/site/info", params), // 新增分拣站
  editSortingStation: params => put("/api/admin/v1/site/info", params), // 编辑分拣站
  delSortingStation: params => del("/api/admin/v1/site/info", params), // 删除分拣站
  viewSortingStation: params => get("/api/admin/v1/site/info/info", params), // 分拣站详情
  //分拣站库存
  getHistoryStockList: params => get("/api/admin/v1/site/info/stock", params), // 获取分拣站历史库存列表
  getRealStockList: params => get("/api/admin/v1/site/info/realstock", params), // 分拣站库存 — 列表实时
  updateRealStock: params => post("/api/admin/v1/site/info/updatestock", params), // 站点实时库存修改
  getGoodsStock: params => get("/api/admin/v1/site/info/getonegoodrealtimeweight", params), // 分拣站库存 — 列表实时

  //分拣站入库 sorting-station-inventory
  getSortingInList: params => get("/api/admin/v1/stock/in", params), // 获取分拣站入库列表
  addSortingIn: params => post("/api/admin/v1/stock/in", params), // 新增分拣站入库
  editSortingIn: params => put("/api/admin/v1/stock/in", params), // 编辑分拣站入库
  viewSortingIn: params => get("/api/admin/v1/stock/in/info", params), // 分拣站入库详情
  delSortingIn: params => del("/api/admin/v1/stock/in", params), // 删除分拣站入库
  sortingStationList: params => get("/api/admin/v1/site/info/name", params), // 分拣站下拉
  getGoodsList: params => get("/api/admin/v1/goods/name", params), // 物品下拉

  //分拣站出库
  getSortingOutList: params => get("/api/admin/v1/stock/out", params), // 获取分拣站出库列表
  addSortingOut: params => post("/api/admin/v1/stock/out", params), // 新增分拣站出库
  editSortingOut: params => put("/api/admin/v1/stock/out", params), // 编辑分拣站出库
  viewSortingOut: params => get("/api/admin/v1/stock/out/info", params), // 分拣站出库详情
  delSortingOut: params => del("/api/admin/v1/stock/out", params), // 删除分拣站出库
  getMerchantList: params => get("/api/admin/v1/merchant/name", params), // 商家下拉
  //商家管理
  getBusinessManagementList: params => get("/api/admin/v1/merchant", params), // 获取商家管理列表
  addBusinessManagement: params => post("/api/admin/v1/merchant", params), // 新增商家管理
  editBusinessManagement: params => put("/api/admin/v1/merchant", params), // 编辑商家管理
  viewBusinessManagement: params => get("/api/admin/v1/merchant/info", params), // 商家管理详情
  // 商品管理
  merchandiseList: params => get("/api/admin/v1/merchandise/merchandiselist", params), // 新增商品
  addmerchandise: params => post("/api/admin/v1/merchandise/addmerchandise", params), // 新增商品
  editmerchandise: params => post("/api/admin/v1/merchandise/editmerchandise", params), // 编辑商品
  merchandisedetail: params => get("/api/admin/v1/merchandise/merchandisedetail", params), // 商品详情
  updatestate: params => post("/api/admin/v1/merchandise/updatestate", params), // 商品状态
  orderList: params => get("/api/admin/v1/merchandiseexchange/exchangelist", params), // 订单记录
  orderCancel: params => get("/api/admin/v1/merchandiseexchange/cancelexchange", params), // 订单取消
  orderSend: params => get("/api/admin/v1/merchandiseexchange/couriernumber", params) // 订单发货
}
