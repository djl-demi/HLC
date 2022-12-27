<template>
  <div id="CommunityManagementOperation">
    <TyReturn></TyReturn>
    <a-row>
      <a-col :span="10">
        <a-space class="facility-title">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">小区信息</div>
        </a-space>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="show">
          <a-form-model-item ref="plot_type" label="类型:" prop="plot_type" class="flex-center" has-feedback>
            <a-radio-group v-model="form.plot_type" class="w100b">
              <a-radio :value="1">
                居民小区
              </a-radio>
              <a-radio :value="2">
                事业单位
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item ref="plot_name" label="名称:" prop="plot_name" class="flex-center" has-feedback>
            <a-input v-model="form.plot_name" placeholder="请输入社区" class="w100b" allowClear />
          </a-form-model-item>
          <a-form-model-item ref="region" label="区域:" prop="region" class="flex-center">
            <TyAreaCascader :model="form.region" @change="areaChange" placeholder="请输入地址"></TyAreaCascader>
          </a-form-model-item>
          <a-form-model-item ref="street" label="街道" prop="street" class="flex-center" has-feedback>
            <a-input v-model="form.street" placeholder="请输入街道名称" class="w100b" allowClear />
          </a-form-model-item>
          <a-form-model-item ref="address" label="地址" prop="street" class="flex-center" has-feedback>
            <a-input v-model="form.address" placeholder="请输入地址" class="w100b" allowClear />
          </a-form-model-item>
          <a-form-model-item ref="community" label="社区" prop="community" class="flex-center" has-feedback>
            <a-input v-model="form.community" placeholder="请输入社区" class="w100b" allowClear />
          </a-form-model-item>
          <a-form-model-item ref="total_number" label="总户数" prop="total_number" class="flex-center">
            <a-input v-model="form.total_number" placeholder="请输入总户数" class="w100b" allowClear />
          </a-form-model-item>
          <a-form-model-item ref="at_number" label="入住户数" prop="at_number" class="flex-center">
            <a-input v-model="form.at_number" placeholder="请输入入住户数" class="w100b" allowClear />
          </a-form-model-item>
          <a-form-model-item v-if="type == 'add'" ref="is_huanbaowu" label="是否转换为环保屋" prop="is_huanbaowu" class="flex-center">
            <a-radio-group v-model="form.is_huanbaowu" class="w100b">
              <a-radio :value="2">
                是
              </a-radio>
              <a-radio :value="1">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
        <a-space class="flex-center">
          <a-button @click="resetForm">
            取消
          </a-button>
          <a-button type="primary" style="margin-left: 10px;" @click="onSubmit">
            保存
          </a-button>
        </a-space>
      </a-col>
      <a-col :span="14" style="padding: 20px">
        <TyFacilityMap
          :address="address"
          :locationArr="locationArr"
          :searchAddress="searchAddress"
          @inputChange="mapInputChange"
          @draggableChange="mapDraggableChange"
          @addressList="addressList"
        ></TyFacilityMap>
        <a-auto-complete v-model="searchAddress" :data-source="dataSource" class="addressSearch" @select="addressSelect" @search="addressSearch" allowClear placeholder="请输入地址详情" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TyAreaCascader from "@/components/ty-area-cascader/ty-area-cascader.vue"
import TyFacilityMap from "@/components/ty-facility-map.vue"
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  name: "CommunityManagement",
  components: {
    TyFacilityMap,
    TyAreaCascader,
    TyReturn
  },
  props: {
    query: Object,
    params: Object
  },
  data() {
    return {
      address: "",
      show: false,
      // query:"",
      form: {
        plot_type: 1,
        plot_name: "",
        province_id: 0,
        city_id: 0,
        area_id: 0,
        id: "", //小区id
        region: undefined,
        street: "",
        address: "",
        community: "",
        total_number: "",
        at_number: "",
        location: "",
        is_huanbaowu: 2
      },
      initLocation: "", // 新增时地图初始经纬度
      type: "add", // 页面状态 编辑/新增
      areaCascaderArea: {}, // 三级联动省市区名称
      locationArr: [], // 地图上的经纬度数组
      location: [], // 地图上的经纬度
      address_details: "", // 地图上的详细地址
      searchAddress: "", // 地址模糊查询
      labelCol: { span: 5 },
      wrapperCol: { span: 13 },
      rules: {
        plot_name: [{ required: true, message: "请输入小区名称", trigger: "blur" }],
        region: [{ required: true, message: "请选择所属区域", trigger: "change" }],
        street: [{ required: true, message: "请输入街道", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }]
      },
      dataSource: [], // 地图搜索列表
      id: 0
    }
  },
  created() {
    // this.query=this.$route.query
    // 如果是edit类型 并且有 id 就是编辑状态
    if (this.query.type === "edit" && this.query.id !== "") {
      this.editShow()
    } else {
      this.show = true
    }
  },
  methods: {
    // back() {},
    // 地图 详细地址 => 经纬度
    mapInputChange(location) {
      if (this.query.type === "add" && this.form.location === "") {
        this.initLocation = location
      }
      if (location) this.form.location = location
    },
    // 地图拖拽 返回地址, 经纬度
    mapDraggableChange(location) {
      this.form.location = location
    },
    // 详细地址查询 选择某项
    addressSelect(e) {
      this.address = e
      // this.form.plot_name = e
    },
    // 详细地址查询 搜索
    addressSearch(e) {
      if (e !== "") {
        this.searchAddress = e
      }
    },
    // 地图返回模糊查询的列表
    addressList(list) {
      this.dataSource = list
    },
    // 省市区选择返回值
    areaChange(e, name) {
      this.areaCascaderArea = name
      this.form.region = e
      this.form.province_id = e[0] || 0
      this.form.city_id = e[1] || 0
      this.form.area_id = e[2] || 0
    },

    // 如果是编辑状态,需要恢复页面数据
    editShow() {
      this.type = "edit"
      this.id = this.query.id || ""
      this.$api.viewCommunityManagement({ id: this.id }).then(res => {
        const data = res.data
        const province_id = data.province_id || ""
        const city_id = data.city_id || ""
        const area_id = data.area_id || ""
        const plot_name = data.plot_name || ""
        const plot_type = data.type || 1
        // const region = `${data.province_name}${data.city_name}${data.area_name}` || ""
        const street = data.street || ""
        const address = data.address || ""
        const community = data.community || ""
        const total_number = data.total_number || 0
        const at_number = data.at_number || 0
        const location = data.location || ""
        // const is_huanbaowu = data.is_huanbaowu || ""

        this.form.province_id = province_id
        this.form.city_id = city_id
        this.form.area_id = area_id
        this.form.region = [province_id, city_id, area_id]
        this.form.plot_type = plot_type
        this.form.plot_name = plot_name
        // this.form.region = region
        this.form.street = street
        this.form.address = address
        this.form.location = location || ""
        this.locationArr = location ? location.split(",") : []
        this.form.community = community
        this.form.total_number = total_number
        this.form.at_number = at_number
        // this.form.is_huanbaowu = is_huanbaowu

        this.show = true
      })
    },
    // 确定
    onSubmit() {
      if (this.form.location === this.initLocation) {
        this.$message.info("请拖拽地图圆点到小区对应位置")
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let that = this
            this.$confirm({
              // title: "省市区不对应",
              content: "请确认是否继续保存",
              okText: "继续保存",
              cancelText: "取消保存",
              icon: "info-circle",
              onOk() {
                that.sureSubmit()
              },
              onCancel() {
                that.$message.info("已取消")
              }
            })
          } else {
            this.$message.info("校验失败,请填写必填项")
            return false
          }
        })
      }
    },
    // 确认保存
    sureSubmit() {
      const data = {
        type: this.form.plot_type || "",
        plot_name: this.form.plot_name || "",
        area_id: this.form.area_id || "",
        // region: this.form.region || "",
        street: this.form.street || "",
        address: this.form.address || "",
        location: this.form.location || "",
        community: this.form.community || "",
        total_number: this.form.total_number || 0,
        at_number: this.form.at_number || 0
      }

      //如果获取不到经纬度坐标信息，则不允许添加
      if (this.form.location == "" || this.form.location == undefined) {
        this.$message.error("该地址定位识别不了")
        return false
      }

      if (this.query.type === "edit") {
        // 编辑
        data.id = this.id.toString()
        this.$api.editCommunityManagement(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.info(res.msg)
          }
          setTimeout(() => {
            this.$router.push({ name: "CommunityManagement" })
          }, 1000)
        })
      } else if (this.query.type === "add") {
        data.create_type = this.form.is_huanbaowu || 0
        // 添加
        this.$api.addCommunityManagement(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.info(res.msg)
          }
          setTimeout(() => {
            this.$router.push({ name: "CommunityManagement" })
          }, 1000)
        })
      }
    },

    // 取消
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
#CommunityManagementOperation {
  .addressSearch {
    position: absolute;
    z-index: 9;
    width: 300px;
    right: 40px;
    top: 40px;
  }
}
</style>
