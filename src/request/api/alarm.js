// 后台账号接口
import { get, post, put, del } from "../http"

export default {
  // 设备报警信息
  getEquipmentAlarmInfoList: params => get("/api/admin/v1/give/an/alarm", params), // 获取列表
  dealEquipmentAlarm: params => put("/api/admin/v1/give/an/alarm", params) // 处理
}
