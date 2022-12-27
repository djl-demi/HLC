import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import utils from "./utils/utils"
import map from "./utils/map"
import com from "./utils/common"
import antd from "./utils/antd"
import G2 from "./utils/G2plot"
import validator from "./utils/validator"

import Antd from "ant-design-vue"
import moment from "moment"

import "ant-design-vue/dist/antd.less"
import "./style/common.css" // 公共样式
import "./style/ant-custom.css" // 自定义ant样式

import api from "./request/api/api"
import less from "less"

import QuillEditor from "vue-quill-editor"
import "quill/dist/quill.core.css"
import "quill/dist/quill.bubble.css"
import "quill/dist/quill.snow.css"
import { borderBox8, scrollBoard } from "@jiaminghi/data-view"
Vue.use(borderBox8)
Vue.use(scrollBoard)
Vue.use(less)
Vue.use(Antd)
Vue.use(QuillEditor)
Vue.prototype.$utils = utils
Vue.prototype.$moment = moment
Vue.prototype.$validator = validator
Vue.prototype.$com = com
Vue.prototype.$antd = antd
Vue.prototype.$G2 = G2
Vue.prototype.$map = map
Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
