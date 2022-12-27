<template>
  <div id="SortingStation">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="fl" size="middle">
          <div>
            <span>名称：</span>
            <div class="dib"><a-input v-model="site_name" placeholder="请输入名称" allowClear /></div>
          </div>
          <div>
            <span>管理员：</span>
            <div class="dib"><a-input v-model="manager_name" placeholder="请输入管理员" allowClear /></div>
          </div>
          <div>
            <span>地址：</span>
            <div class="dib"><a-input v-model="site_address" placeholder="请输入地址" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <a-space class="fr">
          <a-button type="primary" icon="plus" @click="add">新增</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-button type="danger" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="site_no" title="编号" data-index="site_no" align="center" :ellipsis="true" />
            <a-table-column key="site_name" title="名称" data-index="site_name" align="center" :ellipsis="true" />
            <a-table-column key="site_address" title="地址" data-index="site_address" align="center" :ellipsis="true" />
            <a-table-column key="manager_name" title="管理员" data-index="manager_name" align="center" :ellipsis="true" />
            <a-table-column key="open_time" title="营业时间" data-index="open_time" align="center" :ellipsis="true" />
            <a-table-column key="status" title="状态" data-index="status" align="center" :ellipsis="true" />
            <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="edit(record.key)">编辑</a-button>
                <a-button type="link" size="small" @click="showVideo(record)" :disabled="record.status === false || record.is_online === 0">查看视频</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>
    <!-- 新增编辑弹窗 -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" destroyOnClose @cancel="handleCancel" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="name" label="分拣站：" prop="name" has-feedback>
          <a-input v-model="form.name" placeholder="请输入分拣站点" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="region" label="所属区域：" prop="region" has-feedback>
          <TyAreaCascader :model="form.region" @change="areaChange" placeholder="请选择省市区"></TyAreaCascader>
        </a-form-model-item>
        <a-form-model-item ref="street_name" label="街道：" prop="street_name" has-feedback>
          <a-select v-model="form.street_name" @change="getArea" :options="streets" placeholder="请选择街道" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="detail_address" label="详细地址：" prop="detail_address" has-feedback>
          <a-input v-model="form.detail_address" placeholder="请输入详细地址" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="status" label="分拣站状态：" prop="status" class="flex-center">
          <a-radio-group name="status" v-model="form.status">
            <a-radio :value="1"> 启用 </a-radio>
            <a-radio :value="0"> 停用 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="manager_name" label="管理员：" prop="manager_name">
          <a-input v-model="form.manager_name" placeholder="请输入管理员" class="w200" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="open_time" label="营业时间：" prop="open_time">
          <a-form-model-item prop="start_week" :style="{ display: 'inline-block', width: 'calc(50% - 40px)' }" has-feedback>
            <a-select v-model="form.start_week" :options="weeks" placeholder="请选择时间" style="width: 136px" allowClear />
          </a-form-model-item>
          --
          <a-form-model-item prop="end_week" :style="{ display: 'inline-block', width: 'calc(50% - 40px)' }" has-feedback>
            <a-select v-model="form.end_week" :options="weeks" placeholder="请选择时间" style="width: 136px" allowClear />
          </a-form-model-item>
          <a-form-model-item prop="start_time" :style="{ display: 'inline-block', width: 'calc(50% - 40px)' }" has-feedback>
            <a-time-picker prop="start_time" v-model="form.start_time" placeholder="请选择时间" format="HH:mm" style="width: 136px" allowClear />
          </a-form-model-item>
          --
          <a-form-model-item prop="end_time" :style="{ display: 'inline-block', width: 'calc(50% - 40px)' }" has-feedback>
            <a-time-picker prop="end_time" v-model="form.end_time" placeholder="请选择时间" format="HH:mm" style="width: 136px" allowClear />
          </a-form-model-item>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import AMap from "AMap"
import moment from "moment"
import TyAreaCascader from "@/components/ty-area-cascader/ty-area-cascader.vue"
import { log } from "@antv/g2plot/lib/utils"
export default {
  components: {
    TyAreaCascader
  },
  name: "SortingStation",

  data() {
    return {
      site_name: "",
      site_address: "",
      manager_name: "",
      dataSource: [],
      total: 1,
      page: 1,
      selectedRowKeys: [],
      delLoading: false,
      status: "",

      //弹窗相关
      modelTitle: "新增分拣站",
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        name: "",
        region: [],
        province_id: 0,
        city_id: 0,
        area_id: 0,
        detail_address: "",
        status: "",
        open_time: "",
        start_week: "",
        end_week: "",
        start_time: "",
        end_time: "",
        manager_name: "",

        // province_name: "",
        // city_name: "",
        street_name: undefined
      },
      city_name: "",
      area_name: "",
      // provinces:[],
      // citys:[],
      // districts:[],
      streets: [],
      weeks: [
        { value: "1", label: "周一" },
        { value: "2", label: "周二" },
        { value: "3", label: "周三" },
        { value: "4", label: "周四" },
        { value: "5", label: "周五" },
        { value: "6", label: "周六" },
        { value: "7", label: "周日" }
      ],
      rules: {
        name: [{ required: true, message: "请输入分拣站", trigger: "blur" }],
        region: [{ required: true, message: "请选择省市区", trigger: "change" }],
        // street_name: [{ required: true, message: "请选择街道", trigger: "change" }],
        detail_address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
        status: [{ required: true, trigger: "blur" }],
        open_time: [{ required: true, message: "", trigger: "blur" }],
        start_week: [{ required: true, message: "请选择营业日期", trigger: "change" }],
        end_week: [{ required: true, message: "请选择营业日期", trigger: "change" }],
        start_time: [{ required: true, message: "请选择营业时间", trigger: "change" }],
        end_time: [{ required: true, message: "请选择营业时间", trigger: "change" }]
      },
      id: -1
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  created() {
    //获取列表
    this.getTableList()
    // this.getAreaList({ level: 1 })
    // this.getArea()
  },
  methods: {
    // 省市区选择返回值
    areaChange(e, name) {
      console.log(e, "ee")
      this.city_name = name.city_name
      this.area_name = name.area_name
      this.getArea()
      this.form.region = e
      this.form.province_id = e[0] || 0
      this.form.city_id = e[1] || 0
      this.form.area_id = e[2] || 0
      // console.log(e, "e")
    },
    //获取街道
    getArea() {
      let that = this
      new AMap.DistrictSearch({ level: "city", subdistrict: 2 }).search(this.city_name, function(status, result) {
        if (status == "complete") {
          result.districtList[0].districtList.forEach(item => {
            if (item.name === that.area_name) {
              that.streets = item.districtList.map(item => {
                item.label = item.name
                item.value = item.name
                return item
              })
              console.log(that.streets, "that.streets")
            }
          })
        }
      })
    },
    onChange(time, timeString) {
      this.start_time = timeString
      this.end_time = timeString
    },
    // 获取分拣站列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        site_name: this.site_name || "",
        site_address: this.site_address || "",
        manager_name: this.manager_name || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getSortingStationList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.status = item.status === 0 ? "停用" : "启用"
          this.status = item.status
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    // 表格选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    addressutil() {
      let params = {
        subdistrict: 1
      }
    },

    // 表格删除
    deleteData() {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除该数据吗?",
        onOk() {
          let flag = false //停用
          that.dataSource.forEach(item => {
            that.selectedRowKeys.forEach(sitem => {
              if (sitem === item.key) {
                if (item.status === "启用") flag = true
              }
            })
          })
          if (flag) {
            that.$message.error("停止后的分拣厂才可以删除")
            return false
          } else {
            that.delLoading = true
            that.tableLoading = true
            that.$api
              .delSortingStation({ id: that.selectedRowKeys })
              .then(res => {
                that.delLoading = false
                that.tableLoading = false
                that.getTableList()
                that.$message.info(res.msg)
                that.selectedRowKeys = []
              })
              .catch(err => {
                that.delLoading = false
                that.tableLoading = false
              })
          }
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },

    // 新增
    add() {
      this.form = {
        name: "",
        region: [],
        province_id: 0,
        city_id: 0,
        area_id: 0,
        street_name: undefined,
        detail_address: "",
        status: 1,
        open_time: "",
        start_week: "",
        end_week: "",
        start_time: "",
        end_time: "",
        manager_name: ""
      }
      this.visible = true
      this.modelTitle = "新增分拣站"
      this.$validator.resetFields(this)
    },

    // 编辑
    edit(id) {
      this.id = id
      this.modelTitle = "编辑分拣站"
      this.$api.viewSortingStation({ id: this.id }).then(res => {
        const status = res.data.status ? 1 : 0
        const province_id = res.data.province_id || ""
        const city_id = res.data.city_id || ""
        const area_id = res.data.area_id || ""

        this.form.status = status
        this.form.name = res.data.site_name ? res.data.site_name : ""
        this.form.region = [province_id, city_id, area_id]
        this.form.province_id = province_id
        this.form.city_id = city_id
        this.form.area_id = area_id
        this.form.detail_address = res.data.detail_address ? res.data.detail_address : ""
        this.form.street_name = res.data.street_name ? res.data.street_name : ""
        // this.form.status = res.data.status ?res.data.status:""
        this.form.open_time = res.data.open_time ? res.data.open_time : ""
        this.form.manager_name = res.data.manager_name ? res.data.manager_name : ""
        let start_week = res.data.open_time.substring(0, 2) ? res.data.open_time.substring(0, 2) : ""
        let end_week = res.data.open_time.substring(3, 5) ? res.data.open_time.substring(3, 5) : ""
        this.weeks.forEach(item => {
          if (item.label === start_week) this.form.start_week = item.value
          if (item.label === end_week) this.form.end_week = item.value
        })
        this.form.start_time = res.data.open_time.substring(6, 11) ? moment(res.data.open_time.substring(6, 11), "hh:mm") : ""
        this.form.end_time = res.data.open_time.substring(12, 17) ? moment(res.data.open_time.substring(12, 17), "hh:mm") : ""
        this.form.id = this.id
        this.visible = true
      })
    },

    // 查看视频
    showVideo(record) {
      this.$router.push({ name: "WatchVideoPlay", query: { type: 1, id: record.id } })
    },

    // 弹窗确定
    handleOk() {
      if (!this.form.start_week || !this.form.end_week || !this.form.start_time || !this.form.end_time) {
        this.form.open_time = ""
      } else {
        this.form.open_time = `${this.form.start_week}-${this.form.end_week}|${this.form.start_time.format("HH:mm")}-${this.form.end_time.format("HH:mm")}`
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = {
            id: this.form.id,
            name: this.form.name || "",
            region: this.form.region || [],
            province_id: this.form.province_id || 0,
            city_id: this.form.city_id || 0,
            area_id: this.form.area_id || 0,
            street_name: this.form.street_name || undefined,
            detail_address: this.form.detail_address || "",
            // status: this.form.status|| "",
            status: this.form.status ? 1 : 0,
            open_time: this.form.open_time,
            manager_name: this.form.manager_name || "",
            start_week: this.form.start_week || "",
            end_week: this.form.end_week || "",
            start_time: this.form.start_time ? this.form.start_time.format("HH:mm") : "",
            end_time: this.form.end_time ? this.form.end_time.format("HH:mm") : ""
          }
          //校验时间
          // if (data.start_time > data.end_time) {
          //   this.$message.error("校验失败,请检查时间")
          //   return false
          // }
          ;(this.modelTitle === "新增分拣站" ? this.$api.addSortingStation(data) : this.$api.editSortingStation(data)).then(res => {
            this.$message.info(res.msg)
            this.visible = false
            this.getTableList()
            this.form = {
              name: "",
              region: [],
              province_id: 0,
              city_id: 0,
              area_id: 0,
              street_name: "",
              detail_address: "",
              status: "",
              open_time: "",
              start_week: "",
              end_week: "",
              start_time: "",
              end_time: "",
              manager_name: ""
            }
          })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    },
    // 弹窗取消
    handleCancel() {
      this.visible = false
    },
    // 详细地址查询 选择某项
    addressSelect(e) {
      this.form.address = e
      // this.form.plot_name = e
    },
    // 详细地址查询 搜索
    addressSearch(e) {
      if (e !== "") {
        this.form.searchAddress = e
      }
    },
    // 地图返回模糊查询的列表
    addressList(list) {
      this.form.dataSource = list
    }
  }
}
</script>

<style lang="less">
// #SortingStation {
// }
</style>
