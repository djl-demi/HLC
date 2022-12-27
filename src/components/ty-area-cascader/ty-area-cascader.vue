<template>
  <!-- 省市区三级联动组件 -->
  <!-- 接收参数model 绑定输入框值   支持传入有值的model,自动通过传入的id查询对应的列表,并展示对应的省市区 -->
  <!-- 返回change事件,返回选择的省id,市id,区id  不是全返,选到哪个级别返到哪个 [province_id, city_id, area_id] -->
  <a-cascader placeholder="请选择省、市、区" v-model="area" :options="options" :load-data="loadData" change-on-select @change="cityChange" :defaultValue="model" :changeOnSelect="true" />
</template>

<script>
export default {
  name: "TyAreaCascader",
  props: ["model"],
  data() {
    return {
      area: [],
      options: []
    }
  },
  created() {},
  mounted() {
    this.area = this.model || []
    this.getAreaList({ level: 1 })
  },
  methods: {
    // 获取省市区
    getAreaList(data) {
      this.$api.getAreaList(data).then(res => {
        this.options = res.data.map(item => {
          item.label = item.area_name
          item.value = item.area_id
          item.isLeaf = false
          return item
        })
        // 如果长度大于0 是编辑
        if (this.model && this.model.length > 0) {
          this.editShow()
        }
      })
    },

    editShow() {
      // 查一下市/区 防止输入框显示不出市区列表
      // 通过省id,查询市列表
      const province_id = this.model[0]
      const city_id = this.model[1]
      const name = {
        province_name: "",
        city_name: "",
        area_name: ""
      }
      this.options.forEach(item => {
        if (this.area[0] === item.area_id) {
          name.province_name = item.area_name
        }
      })
      this.$api.getAreaList({ area_id: province_id, level: 2 }).then(res => {
        const city = res.data.map(item => {
          item.label = item.area_name
          item.value = item.area_id
          item.isLeaf = false
          return item
        })
        res.data.forEach(sitem => {
          if (this.area[1] === sitem.area_id) {
            name.city_name = sitem.area_name
          }
        })
        // 通过市id,查询区列表
        this.$api.getAreaList({ area_id: city_id, level: 3 }).then(res => {
          const area = res.data.map(item => {
            item.label = item.area_name
            item.value = item.area_id
            return item
          })
          res.data.forEach(ssitem => {
            if (this.area[2] === ssitem.area_id) {
              name.area_name = ssitem.area_name
              this.$emit("change", this.area, name)
            }
          })

          // 将区列表放入对应的市中
          city.forEach(item => {
            if (item.area_id === city_id) {
              item.children = area
            }
          })

          // 将市列表放入对应的省中
          this.options.forEach(item => {
            if (item.area_id === province_id) {
              item.children = city
            }
          })
          this.options = [...this.options] // 触发视图更新

          // this.cityChange()
        })
      })
    },

    // 省市区查询
    loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      const data = {
        area_id: targetOption.area_id,
        level: targetOption.level + 1
      }
      targetOption.loading = true

      // 再次查询
      this.$api.getAreaList(data).then(res => {
        targetOption.loading = false
        const children = res.data.map(item => {
          item.label = item.area_name
          item.value = item.area_id
          if (data.level < 3) item.isLeaf = false
          return item
        })
        targetOption.children = children
        this.options = [...this.options] // 触发视图更新
      })
    },

    // 省市区选择
    cityChange(value) {
      this.$emit("sourceChange", value) // 原始值
      const name = {
        province_name: "",
        city_name: "",
        area_name: ""
      }
      if (this.area.length === 0) {
        this.$emit("change", this.area)
      }

      if (this.area.length === 3) {
        this.options.forEach(item => {
          if (item.area_id === this.area[0]) {
            name.province_name = item.area_name
            item.children.forEach(sitem => {
              if (sitem.area_id === this.area[1]) {
                name.city_name = sitem.area_name
                sitem.children.forEach(ssitem => {
                  if (ssitem.area_id === this.area[2]) {
                    name.area_name = ssitem.area_name
                    this.$emit("change", this.area, name)
                  }
                })
              }
            })
          }
        })
      }
    }
  }
  // watch: {
  // model: {
  //   handler(val) {
  //     this.area = val
  //     this.getAreaList({ level: 1 })
  //   },
  //   deep: true
  // }
  // }
}
</script>

<style></style>
