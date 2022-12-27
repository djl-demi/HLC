// 二维码模块接口
import { get, post } from "../http"

export default {
  createBatchQrcode: params => post("/api/admin/v1/qrcode/addqrcode", params), // 创建二维码批次
  qrcodeList: params => get("/api/admin/v1/qrcode/qrcodelist", params), // 二维码批次列表
  qrcodeCancelBind: params => get("/api/admin/v1/qrcode/cancelbing", params) // 取消绑定
}
