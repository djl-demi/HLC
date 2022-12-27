import home from "./home"
import common from "./common"
import account from "./account"
import resident from "./resident"
import classify from "./classify"
import sorting from "./sorting"
import operation from "./operation"
import statistics from "./statistics"
import equipment from "./equipment"
import alarm from "./alarm"
import performance from "./performance"
import warehouse from "./warehouse"
import vehicleAnalysis from "./vehicleAnalysis"
import activityManagement from "./activityManagement"
import qrcode from "./qrcode"
import project from "./project"
import permission from "./permission"
import dataScreenManage from "./dataScreenManage"

const api = {
  ...common,
  ...account,
  ...resident,
  ...classify,
  ...sorting,
  ...operation,
  ...statistics,
  ...home,
  ...equipment,
  ...alarm,
  ...performance,
  ...warehouse,
  ...vehicleAnalysis,
  ...activityManagement,
  ...qrcode,
  ...project,
  ...permission,
  ...dataScreenManage
}
export default api
