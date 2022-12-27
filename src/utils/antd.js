// 项目组件公共函数
const antd = {
  // 数字输入框处理为整数
  limitNumber(value) {
    if (typeof value === "string") {
      return !isNaN(Number(value)) ? value.replace(/\./g, "") : 0
    } else if (typeof value === "number") {
      return !isNaN(value) ? String(value).replace(/\./g, "") : 0
    } else {
      return 0
    }
  }
}

export default antd
