// 表单校验函数
const validator = {
  // 重新校验  再次打开对话框时需要重新校验
  resetFields(that, name = "ruleForm") {
    if (that.$refs[name]) {
      that.$refs[name].resetFields()
    }
  },

  // 手机号校验
  phone() {
    return (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"))
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"))
        } else {
          callback()
        }
      }
    }
  },

  // 账号校验
  account() {
    return (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"))
      } else {
        if (!/^\w+$/.test(value)) {
          callback(new Error("账号仅支持英文、数字、下划线"))
        } else {
          callback()
        }
      }
    }
  },

  // 省市区三级联动校验
  region() {
    return (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error("请选择省市区"))
      } else {
        if (value.length === 3) {
          callback()
        } else {
          callback(new Error("请选择完整的省市区"))
        }
      }
    }
  }
}
export default validator
