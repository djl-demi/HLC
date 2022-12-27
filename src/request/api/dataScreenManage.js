import { get, post, put, del } from "../http"

export default {
  // 居民统计
  getUserCountSimulate: params => post("/api/bid/userCountSimulate/list", params),
  delUserCountSimulate: params => {
    let baseUrl = `/api/bid/userCountSimulate/${params.id}`
    return del(baseUrl)
  },
  //垃圾月度及年度回收情况
  getTrashRecycleSimulate: params => post("/api/bid/trashRecycleSimulate/list", params),
  delTrashRecycleSimulate: params => {
    let baseUrl = `/api/bid/trashRecycleSimulate/${params.id}`
    return del(baseUrl)
  },
  putTrashRecycleSimulate: params => put("/api/bid/trashRecycleSimulate", params),
  //每日居民投放次数统计
  getUserRecycleSimulate: params => post("/api/bid/userRecycleSimulate/list", params),
  putUserRecycleSimulate: params => put("/api/bid/userRecycleSimulate", params),
  delUserRecycleSimulate: params => {
    let baseUrl = `/api/bid/userRecycleSimulate/${params.id}`
    return del(baseUrl)
  },

  //回收量变化情况
  getRecycleSimulate: params => post("/api/bid/recycleSimulate/list", params),
  delRecycleSimulate: params => {
    let baseUrl = `/api/bid/recycleSimulate/${params.id}`
    return del(baseUrl)
  },
  putRecycleSimulate: params => put("/api/bid/recycleSimulate", params),
  //可回收物投放量展示
  getCommunitySimulate: params => post("/api/bid/communitySimulate/list", params),
  delCommunitySimulate: params => {
    let baseUrl = `/api/bid/communitySimulate/${params.id}`
    return del(baseUrl)
  },
  putCommunitySimulate: params => put("/api/bid/communitySimulate", params),
  //居民实时投递数据展示
  getUserRecycleDetailSimulate: params => post("/api/bid/userRecycleDetailSimulate/list", params),
  delUserRecycleDetailSimulate: params => {
    let baseUrl = `/api/bid/userRecycleDetailSimulate/${params.id}`
    return del(baseUrl)
  },
  putUserRecycleDetailSimulate: params => put("/api/bid/userRecycleDetailSimulate", params),

  //设施统计
  getFacilitySimulate: params => post("/api/bid/facilitySimulate/list", params),
  delFacilitySimulate: params => {
    let baseUrl = `/api/bid/facilitySimulate/${params.id}`
    return del(baseUrl)
  },
  putFacilitySimulate: params => put("/api/bid/facilitySimulate", params),
  //近七天各品类回收情况
  getRecycleTypeSimulate: params => post("/api/bid/recycleTypeSimulate/list", params),
  delRecycleTypeSimulate: params => {
    let baseUrl = `/api/bid/recycleTypeSimulate/${params.id}`
    return del(baseUrl)
  },
  putRecycleTypeSimulate: params => put("/api/bid/recycleTypeSimulate", params),
  //可回收物出库情况和去向
  getRecycleOutSimulate: params => post("/api/bid/recycleOutSimulate/list", params),
  delRecycleOutSimulate: params => {
    let baseUrl = `/api/bid/recycleOutSimulate/${params.id}`
    return del(baseUrl)
  },
  putRecycleOutSimulate: params => put("/api/bid/recycleOutSimulate", params),

  //模拟数据中心
  getUserCountSimulistAll: params => post("/api/bid/userCountSimulate/listAll", params),
  getTrashRecycleSimulistAll: params => post("/api/bid/trashRecycleSimulate/listAll", params),
  getUserRecycleSimulistAll: params => post("/api/bid/userRecycleSimulate/listAll", params),
  getRecycleSimulistAll: params => post("/api/bid/recycleSimulate/listAll", params),
  getCommunitySimulistAll: params => post("/api/bid/communitySimulate/listAll", params),
  getUserRecycleDetailSimulistAll: params => post("/api/bid/userRecycleDetailSimulate/listAll", params),

  getFacilitySimulistAll: params => post("/api/bid/facilitySimulate/listAll", params),
  getRecycleTypeSimulistAll: params => post("/api/bid/recycleTypeSimulate/listAll", params),
  getRecycleOutSimulistAll: params => post("/api/bid/recycleOutSimulate/listAll", params)
}
