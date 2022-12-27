<template>
  <div class="login">
    <div class="lg">
      <div class="lg-title flex-between center">
        <!-- <img src="../assets/logo.png" class="logo" /> -->
        <span class="lg-title-text">重力储能管理系统</span>
      </div>
      <div class="lg-content">
        <!-- <div class="lg-content-title">平台登录</div> -->
        <a-form id="components-form-demo-normal-login" :form="form" @submit="handleSubmit">
          <a-form-item>
            <a-input class="phone" v-decorator="['account', { rules: [{ required: true, message: '请输入用户名!' }] }]" placeholder="请输入您的手机号">
              <!-- <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" /> -->
              <!-- <img src="../assets/zhanghu.png" slot="prefix" style="color: rgba(0,0,0,.25)" /> -->
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input class="password" v-decorator="['password', { rules: [{ required: true, message: '请输入密码!' }] }]" type="password" placeholder="请输入您的密码">
              <!-- <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" /> -->
              <!-- <img src="../assets/mima.png" slot="prefix" style="color: rgba(0,0,0,.25)" /> -->
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" class="login-form-button mt30"> 登 录 </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {
      // form: {},
      projectTitle: "重力储能管理系统"
    }
  },
  beforeCreate() {
    // 创建表单实例
    this.form = this.$form.createForm(this, { name: "login-form" })
  },
  created() {
    let project = window.location.href.split(".")[0].split("//")[1]
    if (project === "nantongfl") {
      localStorage.setItem("project", "南通开发区垃圾分类管理系统")
      this.projectTitle = "南通开发区垃圾分类管理系统"
      document.title = "南通开发区垃圾分类管理系统"
    } else {
      localStorage.setItem("project", "重力储能管理系统")
      this.projectTitle = "重力储能管理系统"
      document.title = "重力储能管理系统"
    }
    console.log(project, "project")
  },

  methods: {
    // 登录
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$api.login({ account: values.account, password: values.password }).then(res => {
            const userInfo = {
              name: res.data.name,
              account: res.data.account,
              id: res.data.id,
              level: res.data.level,
              super: res.data.super,
              areaid: res.data.area,
              area_name: res.data.area_name,
              project_id: res.data.project_id,
              menus: res.data.menus
            }

            localStorage.setItem("token", JSON.stringify(res.data.login_token))
            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            localStorage.setItem("bizMenu", JSON.stringify(res.data.menus))
            const routeList = JSON.parse(localStorage.getItem("bizMenu"))
            const jumpPage = routeList[0].children

            let keys = jumpPage.map(i => i.key)
            console.log(jumpPage, keys, "jumpPage")
            // if(keys.includes('Home')){
            //     localStorage.setItem("showDataScreen", JSON.stringify(true))
            //     localStorage.setItem("showMNdataScreen", JSON.stringify(false))
            //     this.$router.push({ name: "Home" })
            // }else if(!keys.includes('Home')&&keys.includes('MNHome')){
            //     localStorage.setItem("showDataScreen", JSON.stringify(false))
            //     localStorage.setItem("showMNdataScreen", JSON.stringify(true))
            //     this.$router.push({ name: "MNHome" })
            // }else{
            //     localStorage.setItem("showDataScreen", JSON.stringify(false))
            //     localStorage.setItem("showMNdataScreen", JSON.stringify(false))
            //     this.$router.push({ name: "ClassifyChart" })
            // }

            // localStorage.setItem("showDataScreen", JSON.stringify(keys.includes("Home")))
            // localStorage.setItem("showMNdataScreen", JSON.stringify(!keys.includes("Home") && keys.includes("MNHome")))
            // let name = keys.includes("Home") ? "Home" : !keys.includes("Home") && keys.includes("MNHome") ? "MNHome" : "ClassifyChart"
            let name = "Home"
            this.$router.push({ name })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("../assets/bg/login.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}
.lg {
  width: 450px;
  height: 600px;
  position: absolute;
  right: 50%;
  top: 45%;
  margin-top: -300px;
  margin-right: -225px;
}
.logo {
  width: 45px;
}
.lg-title {
  height: 150px;
  width: 100%;
}
.lg-title-text {
  color: #fff;
  font-size: 34px;
  /* letter-spacing: 20px; */
  /* margin-right: -20px; */
}
.center {
  justify-content: center;
}
.lg-content {
  width: 450px;
  height: 300px;
  background-color: #0e1035;
  background-color: rgba(49, 194, 124, 0.5);
  border-radius: 20px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  padding: 50px;
}
.lg-content-title {
  height: 100px;
  width: 100%;
  font-size: 30px;
  color: #fff;
  text-align: center;
}
.login-form-button {
  width: 100%;
  height: 40px;
}
img {
  width: 15px;
}
.ant-btn {
  border-radius: 20px !important;
}
.ant-btn-primary {
  font-size: initial;
  font-weight: 700;
}
.ant-input {
  border-radius: 20px !important;
  height: 40px;
}
::-webkit-input-placeholder {
  /* color: #fff; */
  font-size: 15px;
  line-height: 50px;
}
.has-error .ant-input,
.has-error .ant-input:hover {
  background-color: #fff !important;
  border-color: #fff !important;
}
.has-error .ant-input:focus {
  box-shadow: none !important;
}
</style>
