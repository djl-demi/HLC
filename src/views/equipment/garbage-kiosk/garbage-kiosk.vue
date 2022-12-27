<template>
  <div id="GarbageKiosk">
    <!-- 分类投递亭 -->
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>名称：</span>
            <div class="dib"><a-input v-model="house_name" placeholder="请输入名称" allowClear /></div>
          </div>
          <div>
            <span>管理员：</span>
            <div class="dib"><a-input v-model="operator_name" placeholder="请输入管理员" allowClear /></div>
          </div>
          <div>
            <span>地址：</span>
            <div class="dib"><a-input v-model="address" placeholder="请输入地址" allowClear /></div>
          </div>
          <div>
            <span>是否为小区：</span>
            <div class="dib"><a-select v-model="isPlot" :options="plotOptions" placeholder="请选择是否为小区" class="w200" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
          <a-button type="primary" class="fr" @click="add">新增</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-space direction="vertical" style="width: 100%">
            <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
            <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
              <a-table-column key="type_text" title="类型" data-index="type_text" align="center" :ellipsis="true" />
              <a-table-column key="house_no" title="编号" data-index="house_no" align="center" :ellipsis="true" />
              <a-table-column key="house_name" title="名称" data-index="house_name" align="center" :ellipsis="true" />
              <a-table-column key="address" title="地址" data-index="address" align="center" :ellipsis="true" />
              <a-table-column key="operator_name" title="管理员" data-index="operator_name" align="center" :ellipsis="true" />
              <a-table-column key="time" title="营业时间" data-index="time" align="center" :ellipsis="true" />
              <a-table-column key="state" title="状态" data-index="state" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <a-popconfirm
                    v-if="dataSource.length"
                    :title="record.state ? '确定恢复为启用吗？' : '确定要禁用吗？'"
                    okText="确定"
                    cancelText="取消"
                    :maskClosable="false"
                    @confirm="() => ChangeState(record)"
                    @cancel="record.state = !record.state"
                  >
                    <a-switch v-model="record.state" checked-children="启用" un-checked-children="禁用" />
                  </a-popconfirm>
                </template>
              </a-table-column>
              <a-table-column title="操作" data-index="option" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
                  <!-- 小区环保屋类别摄视频不可用 -->
                  <a-button type="link" size="small" @click="showWatchVideo(record)" :disabled="record.state === false || record.is_online === 0 || record.create_type == 2">查看视频</a-button>
                </template>
              </a-table-column>
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="page" show-quick-jumper :total="total" @change="getTableList()" />
            </div>
          </a-space>
        </a-space>
      </div>
    </a-space>
    <!-- 新增编辑弹窗 -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" destroyOnClose @ok="handleOk" @cancel="visible = false" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="house_name" label="类型：" prop="house_name" has-feedback>
          <a-radio-group v-model="form.type">
            <a-radio :value="1">A</a-radio>
            <a-radio :value="2">B</a-radio>
            <a-radio :value="3">C</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="house_name" label="名称：" prop="house_name" has-feedback>
          <a-input v-model="form.house_name" placeholder="请输入名称" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="address" label="地址" prop="address" has-feedback>
          <a-input v-model="form.address" placeholder="请输入地址" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="plot_id" label="小区：" prop="plot_id" has-feedback>
          <a-select
            :value="form.plot_id"
            :options="communityChartList"
            style="width: 100%"
            placeholder="请选择小区"
            allowClear
            show-search
            :filterOption="filteredOptions"
            @change="changePlot"
          ></a-select>
        </a-form-model-item>

        <a-form-model-item ref="operator_name" label="管理员" prop="operator_name" has-feedback>
          <a-input v-model="form.operator_name" placeholder="请输入管理员" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="proportion" label="面积" prop="proportion" has-feedback>
          <a-input v-model="form.proportion" type="number" placeholder="请输入面积" suffix="m²" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="work_week" label="营业日期：" prop="work_week" has-feedback>
          <a-form-model-item prop="start_week" class="customFormItem" :style="{ display: 'inline-block', width: 'calc(50% - 40px)' }" has-feedback>
            <a-select v-model="form.start_week" :options="$com.weekList()" placeholder="请选择时间" style="width: 136px" allowClear />
          </a-form-model-item>
          --
          <a-form-model-item prop="end_week" class="customFormItem" :style="{ display: 'inline-block', width: 'calc(50% - 40px)' }" has-feedback>
            <a-select v-model="form.end_week" :options="$com.weekList()" placeholder="请选择时间" style="width: 136px" allowClear />
          </a-form-model-item>
        </a-form-model-item>
        <a-form-model-item ref="work_time" class="work_time" label="营业时间：" prop="work_time" has-feedback>
          <a-form-model-item prop="start_time" class="customFormItem" :style="{ display: 'inline-block', width: 'calc(50% - 40px)' }" has-feedback>
            <a-time-picker prop="start_time" v-model="form.start_time" placeholder="请选择时间" format="HH:mm" style="width: 136px" allowClear />
          </a-form-model-item>
          --
          <a-form-model-item prop="end_time" class="customFormItem" :style="{ display: 'inline-block', width: 'calc(50% - 40px)' }" has-feedback>
            <a-time-picker prop="end_time" v-model="form.end_time" placeholder="请选择时间" format="HH:mm" style="width: 136px" allowClear />
          </a-form-model-item>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment"
import mixins from "@/mixins/index.js"
import AMap from "AMap"
export default {
  name: "GarbageKiosk",
  mixins: [mixins.TableMixins],
  components: {},
  data() {
    return {
      house_name: "",
      address: "",
      operator_name: "",
      previewVisible: false,
      dataSource: [],
      modelTitle: "新增",
      visible: false, //弹窗显示
      confirmLoading: false,
      isPlot: "",
      plotOptions: [
        { label: "全部", value: "" },
        { label: "是", value: 2 },
        { label: "否", value: 1 }
      ],
      form: {
        type: 1,
        house_name: "",
        address: "",
        operator_name: "",
        proportion: "",
        work_week: "",
        work_time: "",
        start_week: undefined,
        end_week: undefined,
        start_time: "",
        end_time: "",
        lon: "",
        lat: "",
        plot_id: undefined,
        plot_name: ""
      },
      rules: {
        house_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        operator_name: [{ required: true, message: "请输入管理员", trigger: "blur" }],
        proportion: [{ required: true, message: "请输入面积", trigger: "blur" }],
        plot_id: [{ required: true, message: "请输入小区", trigger: "blur" }],
        work_week: [{ required: true, message: "", trigger: "blur" }],
        start_week: [{ required: true, message: "请选择营业日期", trigger: "change" }],
        end_week: [{ required: true, message: "请选择营业日期", trigger: "change" }],
        work_time: [{ required: true, message: "", trigger: "blur" }],
        start_time: [{ required: true, message: "请选择营业时间", trigger: "change" }],
        end_time: [{ required: true, message: "请选择营业时间", trigger: "change" }]
      },
      communityChartList: [] // 小区信息列表
    }
  },
  created() {
    //获取列表
    this.getTableList()
    this.$com.getCommunityChartList(this, "communityChartList") // 小区信息列表
  },
  computed: {},
  watch: {
    // 监听地址并转换成座标
    "form.address": {
      handler(val) {
        this.addressToLocation(val)
      }
    }
  },
  methods: {
    getTableList(page) {
      if (page) this.page = page
      const data = {
        house_name: this.house_name || "",
        address: this.address || "",
        operator_name: this.operator_name || "",
        create_type: this.isPlot || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getGarbageKioskList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.state = item.state === 1 ? false : true
          item.time = item.work_week + " " + item.work_time
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    // 切换开关
    ChangeState(record) {
      this.$api
        .stateGarbageKiosk({ id: record.key, state: record.state ? 2 : 1 })
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          record.state = !record.state
        })
    },
    //环保屋价格
    garbageKioskPrice() {
      this.$router.push({ name: "GarbageKioskPrice" })
    },
    // 新增
    add() {
      this.form = {
        type: 1,
        house_name: "",
        address: "",
        operator_name: "",
        proportion: "",
        plot_id: undefined,
        plot_name: "",
        work_week: "",
        work_time: "",
        start_week: undefined,
        end_week: undefined,
        start_time: undefined,
        end_time: undefined
      }
      this.visible = true
      this.modelTitle = "新增"
    },
    // getCommunityChartList() {
    //   this.$api.getCommunityChartList({ area_id: this.form.area_id }).then(res => {
    //     this.communityChartList = res.data.map(item => {
    //       item.label = item.plot_name
    //       item.value = item.id
    //       return item
    //     })
    //   })
    // },
    changePlot(data) {
      this.form.plot_id = data
      this.communityChartList.filter(e => {
        if (e.value === data) {
          this.form.plot_name = e.label
        }
      })
    },
    filteredOptions(value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0
    },

    // 编辑
    edit(record) {
      this.visible = true
      this.modelTitle = "编辑"
      this.$api.viewGarbageKiosk({ id: record.id }).then(res => {
        this.form.type = res.data.type
        this.form.house_name = res.data.house_name
        this.form.address = res.data.address
        this.form.operator_name = res.data.operator_name
        this.form.proportion = res.data.proportion
        this.form.work_week = res.data.start_week + "-" + res.data.end_week
        this.form.start_week = res.data.start_week + ""
        this.form.end_week = res.data.end_week + ""
        this.form.work_time = res.data.work_time
        this.form.start_time = res.data.work_time.substring(0, 4) ? moment(res.data.work_time.substring(0, 4), "hh:mm") : ""
        this.form.end_time = res.data.work_time.substring(5, 10) ? moment(res.data.work_time.substring(5, 10), "hh:mm") : ""
        this.form.id = res.data.id
        this.form.plot_id = res.data.plot_id
        this.form.plot_name = res.data.plot_name

        // 地址转换成坐标
        this.addressToLocation(this.form.address)
      })
    },

    // 查看视频
    showWatchVideo(record) {
      this.$router.push({ name: "WatchVideoPlay", query: { type: 2, id: record.id } })
    },

    // 删除
    deleteData() {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .delGarbageKiosk({ id: that.selectedRowKeys })
            .then(res => {
              that.delLoading = false
              that.getTableList()
              that.$message.success(res.msg)
              that.selectedRowKeys = []
            })
            .catch(err => {
              that.delLoading = false
            })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },

    // 弹窗确定
    handleOk() {
      if (!this.form.start_week || !this.form.end_week) {
        this.form.work_week = ""
      } else {
        this.form.work_week = `${this.form.start_week}-${this.form.end_week}`
      }
      if (!this.form.start_time || !this.form.end_time) {
        this.form.work_time = ""
      } else {
        this.form.work_time = `${this.form.start_time.format("HH:mm")}-${this.form.end_time.format("HH:mm")}`
      }

      // 判断营业时间是否合法
      if (this.form.start_week >= this.form.end_week && this.form.start_time.valueOf() > this.form.end_time.valueOf()) {
        this.$message.error("营业时期或时间有误，请重新选择")
        return false
      }

      // 校验坐标是否存在
      if (this.form.lon == "" || this.form.lat == "") {
        this.$message.error("地址不能识别，请重新填写详细地址")
        return false
      }

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = {
            id: this.form.id,
            type: this.form.type || "",
            house_name: this.form.house_name || "",
            address: this.form.address || "",
            operator_name: this.form.operator_name || "",
            proportion: this.form.proportion || "",
            work_week: this.form.work_week,
            work_time: this.form.work_time || "",
            start_week: this.form.start_week || "",
            end_week: this.form.end_week || "",
            start_time: this.form.start_time ? this.form.start_time.format("HH:mm") : "",
            end_time: this.form.end_time ? this.form.end_time.format("HH:mm") : "",
            lon: this.form.lon || "",
            lat: this.form.lat || "",
            plot_id: this.form.plot_id || "",
            plot_name: this.form.plot_name || ""
          }
          this.confirmLoading = true
          ;(this.modelTitle === "新增" ? this.$api.addGarbageKiosk(data) : this.$api.editGarbageKiosk(data))
            .then(res => {
              this.confirmLoading = false
              this.$message.success(res.msg)
              this.visible = false
              this.getTableList()
              this.form = {
                plot_id: undefined,
                plot_name: "",
                house_name: "",
                address: "",
                operator_name: "",
                work_week: "",
                work_time: "",
                start_week: "",
                end_week: "",
                start_time: "",
                end_time: "",
                proportion: ""
              }
            })
            .catch(err => {
              this.confirmLoading = false
            })
        }
      })
    },
    // 地址转坐标
    addressToLocation(address = "") {
      let that = this
      that.form.lon = ""
      that.form.lat = ""
      if (address) {
        var geocoder = new AMap.Geocoder({
          city: "全国" //城市设为北京，默认：“全国”
        })
        geocoder.getLocation(address, function(status, result) {
          if (status === "complete" && result.geocodes.length) {
            var lnglat = result.geocodes[0].location
            that.form.lon = lnglat.lng || ""
            that.form.lat = lnglat.lat || ""
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.customFormItem.ant-form-item {
  margin-bottom: 0;
}
</style>
