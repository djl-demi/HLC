import { get, post, put, del } from "../http"

export default {
  //考勤班组设置
  getCommutingList: params => get("/api/admin/v1/sitesignsommuting/commutinglist", params), // 考勤组列表
  addCommuting: params => post("/api/admin/v1/sitesignsommuting/addcommuting", params), // 新增考勤组
  editCommuting: params => post("/api/admin/v1/sitesignsommuting/editcommuting", params), // 编辑考勤组
  commutingDetail: params => get("/api/admin/v1/sitesignsommuting/commutingdetail", params), // 考勤组详情
  delCommuting: params => get("/api/admin/v1/sitesignsommuting/delcommuting", params), // 删除考勤组
  updateState: params => post("/api/admin/v1/sitesignsommuting/updatestate", params), // 启用禁用考勤组
  getcommutingaccount: params => get("/api/admin/v1/sitesignsommuting/getcommutingaccount", params), // 考勤组未进考勤组成员

  getallcommuting: params => get("/api/admin/v1/sitesignsommuting/getallcommuting", params), // 所有考勤组

  getDayreportlist: params => get("/api/admin/v1/sitesigndayreport/dayreportlist", params), // 日常考核统计
  getMonthreportlist: params => get("/api/admin/v1/sitesigndayreport/monthreportlist", params), // 月考核统计
  getActivityreport: params => get("/api/admin/v1/sitesigndayreport/activityreport", params) // 活动考核统计
}
