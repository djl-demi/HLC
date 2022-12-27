// 高德地图用到的公共函数
import utils from "./utils"
import AMap from "AMap"

const map = {
  // 区域路径
  // 将经纬度转换为详细地址
  getAddress(path, geocoder) {
    return new Promise((resolve, reject) => {
      geocoder.getAddress(path, (status, result) => {
        if (status === "complete" && result.regeocodes.length) {
          resolve(result.regeocodes)
        } else {
          reject()
        }
      })
    })
  },

  // 将经纬度转换为详细地址,并直接返回给父组件
  addressReturn(e, that, type, mapObj) {
    // 20个一组进行分割
    let arr = utils.sliceArrFn(e, 20)

    // 由于高德的getAddress限制最多20个批量转换, 所以用promise.all 进行无限次的经纬度转换详细地址
    Promise.all(
      arr.map(item => {
        return map.getAddress(item, that.geocoder)
      })
    ).then(result => {
      let path = []
      let allAddress = []
      result.forEach(item => {
        allAddress.push(...item)
      })
      e.forEach((item, index) => {
        allAddress.forEach((sitem, sindex) => {
          if (index === sindex) {
            path.push({
              position: item,
              address: sitem.formattedAddress,
              id: utils.createUUID()
            })
          }
        })
      })
      let data = { path }
      if (type === "regional") data.area = mapObj.getArea()
      if (type === "route") data.length = Math.round(AMap.GeometryUtil.distanceOfLine(e))
      that.$emit("pathChange", data)
    })
  },

  // 测距工具
  rangingTool(that) {
    //自定义样式
    let startMarkerOptions = {
      icon: new AMap.Icon({
        size: new AMap.Size(19, 31), //图标大小
        imageSize: new AMap.Size(19, 31),
        image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
      })
    }
    let endMarkerOptions = {
      icon: new AMap.Icon({
        size: new AMap.Size(19, 31), //图标大小
        imageSize: new AMap.Size(19, 31),
        image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
      }),
      offset: new AMap.Pixel(-9, -31)
    }
    let midMarkerOptions = {
      icon: new AMap.Icon({
        size: new AMap.Size(19, 31), //图标大小
        imageSize: new AMap.Size(19, 31),
        image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
      }),
      offset: new AMap.Pixel(-9, -31)
    }
    let lineOptions = {
      strokeStyle: "solid",
      strokeColor: "#FF33FF",
      strokeOpacity: 1,
      strokeWeight: 2
    }
    let rulerOptions = {
      startMarkerOptions: startMarkerOptions,
      midMarkerOptions: midMarkerOptions,
      endMarkerOptions: endMarkerOptions,
      lineOptions: lineOptions
    }
    let rangingTool = new AMap.RangingTool(that.map, rulerOptions)
    return rangingTool
  },

  // 详细地址 => 经纬度
  getLocation(address, that) {
    that.geocoder.getLocation(address, (status, result) => {
      if (status === "complete" && result.geocodes.length) {
        const lnglat = result.geocodes[0].location
        const position = new AMap.LngLat(lnglat.lng, lnglat.lat)
        that.map.setCenter(position)
        that.map.setZoom(16)
      }
    })
  },

  // 详细地址 模糊查询
  getVagueAddress(vagueAddress, that) {
    that.autoComplete.search(vagueAddress, (status, result) => {
      if (result.tips) {
        const dataSource = result.tips.map(item => {
          // 整合地址信息,改为组件支持的字段名
          item.text = `${item.district}${item.address}${item.name}`
          item.value = `${item.district}${item.address}${item.name}`
          return item
        })
        that.$emit("addressLists", dataSource)
      }
    })
  }
}

export default map
