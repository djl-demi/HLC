import home from "./home"
import common from "./common"
import account from "./account"
import equipment from "./equipment"
import project from "./project"
import permission from "./permission"
import dataScreenManage from "./dataScreenManage"

const api = {
  ...common,
  ...account,
  ...home,
  ...equipment,
  ...project,
  ...permission,
  ...dataScreenManage
}
export default api
