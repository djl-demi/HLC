// 公共方法
const utils = {
  // 生成唯一id
  createUUID: () => {
    let d = new Date().getTime()
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
  },

  // 深拷贝
  deepCopy: obj => {
    if (!obj) return
    let newObj
    try {
      newObj = obj.constructor && obj.constructor === Array ? [] : {}
      newObj.constructor = obj.constructor
    } catch (e) {
      newObj = []
    }
    if (typeof obj !== "object") {
      return
    } else {
      for (let prop in obj) {
        if (!obj[prop] || obj[prop].constructor === RegExp || obj[prop].constructor === Date) {
          newObj[prop] = obj[prop]
        } else if (typeof obj[prop] === "object") {
          // 递归
          newObj[prop] = utils.deepCopy(obj[prop])
        } else {
          newObj[prop] = obj[prop]
        }
      }
    }
    return newObj
  },
  // 防抖
  debounce: (fn, wait = 1000, immediate = false) => {
    let timer = null
    return function(...args) {
      // 立即执行的功能（timer为空表示首次触发）
      if (immediate && !timer) {
        fn.apply(this, args)
      }
      // 有新的触发，则把定时器清空
      timer && clearTimeout(timer)
      // 重新计时
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, wait)
    }
  },

  // 节流
  throttle: (fn, wait) => {
    // 上一次执行时间
    let previous = 0
    return function(...args) {
      // 当前时间
      let now = +new Date()
      if (now - previous > wait) {
        previous = now
        fn.apply(this, args)
      }
    }
  },

  // 图片编码
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  },

  // 图片上传前校验
  beforeUpload(file, _this) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) {
      _this.$message.error("只能上传jpeg/png格式的图片!")
    }
    const isLt2M = file.size / 1024 / 1024 < 4
    if (!isLt2M) {
      _this.$message.error("图片应小于 4MB!")
    }
    return isJpgOrPng && isLt2M

    // const isLt2M = file.size / 1024 / 1024 < 4
    // if (!isLt2M) {
    //   this.$message.error("图片应小于 4MB!")
    // }
    // return isLt2M
  },

  //excel上传前校验
  checkExcelType(file) {
    let fileName = file.target.value.split(".")
    if (
      fileName[fileName.length - 1] === "xlsx" ||
      fileName[fileName.length - 1] === "xls" ||
      fileName[fileName.length - 1] === "xltx" ||
      fileName[fileName.length - 1] === "xlt" ||
      fileName[fileName.length - 1] === "xlsm" ||
      fileName[fileName.length - 1] === "xlsb" ||
      fileName[fileName.length - 1] === "xltm" ||
      fileName[fileName.length - 1] === "csv"
    ) {
      return true
    } else {
      this.$message.error("请上传正确格式的表格", true)
      return false
    }
  },

  // 中国标准时间转为常规日期格式   Thu Mar 07 2019 00:00:00 GMT+0800 (中国标准时间) => 2019-03-07 00:00:00
  forMatDate(date) {
    function formatTen(num) {
      return num > 9 ? num + "" : "0" + num
    }
    const d = new Date(date)
    return d.getFullYear() + "-" + formatTen(d.getMonth() + 1) + "-" + formatTen(d.getDate()) + " " + formatTen(d.getHours()) + ":" + formatTen(d.getMinutes()) + ":" + formatTen(d.getSeconds())
  },
  // 中国标准时间转为常规日期格式   Thu Mar 07 2019 00:00:00 GMT+0800 (中国标准时间) => 2019-03-07
  forMatDay(date) {
    function formatTen(num) {
      return num > 9 ? num + "" : "0" + num
    }
    const d = new Date(date)
    return d.getFullYear() + "-" + formatTen(d.getMonth() + 1) + "-" + formatTen(d.getDate())
  },

  // 日期转为中国标准时间  2019-03-07 00:00:00 => Thu Mar 07 2019 00:00:00 GMT+0800 (中国标准时间)
  parserDate(date) {
    let t = Date.parse(date)
    if (!isNaN(t)) {
      return new Date(Date.parse(date.replace(/-/g, "/")))
    }
  },

  // 数组分割为指定长度的数组
  sliceArrFn(array, size) {
    let result = []
    for (let x = 0; x < Math.ceil(array.length / size); x++) {
      let start = x * size
      let end = start + size
      result.push(array.slice(start, end))
    }
    return result
  },

  // 统一获取物品对应配色
  getGoodsColor(name) {
    let color = ""
    switch (name) {
      case "家电":
        color = "#66789B"
        break
      case "纸张":
        color = "#CDDDFD"
        break
      case "玻璃":
        color = "#D5FFFC"
        break
      case "金属":
        color = "#F5BD15"
        break
      case "塑料":
        color = "#9661BC"
        break
      case "织物":
        color = "#F08AB4"
        break
      case "可回收物":
        color = "#029EE6"
        break
      case "厨余垃圾":
        color = "#03AD17"
        break
      case "有害垃圾":
        color = "#CE001D"
        break
      case "有害垃圾1":
        color = "#ff0000"
        break
      default:
        color = "#999999"
    }

    return color
  },

  // 获取url后的参数   variable 参数的key
  getQueryVariable(variable) {
    var query = window.location.search.substring(1)
    var vars = query.split("&")
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=")
      if (pair[0] == variable) {
        return pair[1]
      }
    }
    return false
  },
  //导出
  trackExport(url, json, _this) {
    let param = "&"
    Object.keys(_this[json]).forEach(e => {
      param += _this[json][e] ? e + "=" + _this[json][e] + "&" : ""
    })
    param = param.substring(0, param.lastIndexOf("&"))
    const token = JSON.parse(localStorage.getItem("token"))
    window.open(`${process.env.VUE_APP_BASE_URL}${url}?token=${token}${param}`)
  }
}
export default utils
