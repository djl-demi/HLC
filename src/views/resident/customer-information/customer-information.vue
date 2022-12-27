<template>
  <div id="CustomerInformation">
    任务反馈
    <!-- <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>姓名：</span>
            <div class="dib"><a-input v-model="user_name" placeholder="请输入姓名" allowClear /></div>
          </div>
          <div>
            <span>联系方式：</span>
            <div class="dib"><a-input v-model="phone" placeholder="请输入联系方式" allowClear :maxLength="11" @change="e => $com.checkInput(this, 'phone', e)" /></div>
          </div>
          <div>
            <span>小区：</span>
            <div class="dib"><a-input v-model="plot_name" placeholder="请输入小区名称" allowClear /></div>
          </div>
          <div>
            <span>时间：</span>
            <div class="dib"><a-range-picker v-model="dateString" @change="onChange" allowClear style="width: 213px" /></div>
          </div>
          <div>
            <span>楼号：</span>
            <div class="dib"><a-input v-model="building_no" placeholder="请输入楼号" allowClear /></div>
          </div>
          <div>
            <span>居民类型：</span>
            <div class="dib"><a-select v-model="user_type" :options="user_type_list" placeholder="请选择居民类型" allowClear style="width: 213px" /></div>
          </div>
          <div>
            <span>编码：</span>
            <div class="dib"><a-input v-model="qr_no" placeholder="请输入编码" allowClear /></div>
          </div>
          <div>
            <span>门牌号：</span>
            <div class="dib"><a-input v-model="house_number" placeholder="请输入门牌号" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)" class="fl">搜索</a-button>
        </a-space>
        <a-space class="ctrl-bar">
          <a-button type="primary" icon="plus" @click="add">新增</a-button>
          <a-button icon="export" @click="trackExport">导出</a-button>
          <a-upload name="file" :action="$com.importCustomer()" :showUploadList="false" :headers="headers" @change="uploadFile">
            <a-button icon="upload">导入</a-button>
          </a-upload>
          <a href="/居民信息模板.xlsx" download="居民信息模板.xlsx">下载模板</a>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteListData">删除</a-button>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="user_name" title="姓名" data-index="user_name" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="detail(record.key)">{{ record.user_name }}</a-button>
              </template>
            </a-table-column>
            <a-table-column key="phone" title="联系方式" data-index="phone" align="center" :ellipsis="true" />
            <a-table-column key="plot_name" title="小区" data-index="plot_name" align="center" :ellipsis="true" />
            <a-table-column key="street" title="街道" data-index="street" align="center" :ellipsis="true" />
            <a-table-column key="building_no" title="楼号" data-index="building_no" align="center" :ellipsis="true" />
            <a-table-column key="element" title="单元" data-index="element" align="center" :ellipsis="true" />
            <a-table-column key="house_number" title="门牌号" data-index="house_number" align="center" :ellipsis="true" />
            <a-table-column key="total_integral" title="积分总额" data-index="total_integral" align="center" :ellipsis="true" />
            <a-table-column key="qr_no" title="编码" data-index="qr_no" align="center" :ellipsis="true" />
            <a-table-column key="integral" title="剩余积分" data-index="integral" align="center" :ellipsis="true" />
            <a-table-column key="total_money" title="垃圾分类总金额" data-index="total_money" align="center" :ellipsis="true" />
            <a-table-column key="create_time" title="注册时间" data-index="create_time" align="center" :ellipsis="true" />
            <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space> -->
    <!-- 新增编辑弹窗   -->
    <!-- <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" :maskClosable="false" destroyOnClose @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="user_name" label="姓名：" prop="user_name" has-feedback>
          <a-input v-model="form.user_name" placeholder="请输入姓名" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="phone" label="电话：" prop="phone" has-feedback>
          <a-input v-model="form.phone" placeholder="请输入电话" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="region" label="地址：" prop="region" has-feedback>
          <TyAreaCascader :model="form.region" @change="areaChange" placeholder="请输入地址"></TyAreaCascader>
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
        <a-form-model-item ref="building_no" label="楼号：" prop="building_no" has-feedback>
          <a-input v-model="form.building_no" placeholder="请输入楼号" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="element" label="单元：" prop="element" has-feedback>
          <a-input v-model="form.element" placeholder="请输入单元" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="house_number" label="门牌号：" prop="house_number" has-feedback>
          <a-input v-model="form.house_number" placeholder="请输入门牌号" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal> -->
  </div>
</template>

<script>
// import TyAreaCascader from "@/components/ty-area-cascader/ty-area-cascader.vue"
export default {
  name: "CustomerInformation",
  components: {
    // TyAreaCascader
  },
  data() {
    return {
      selectedRowKeys: [],
      delLoading: false,
      dateString: [],
      user_type_list: [
        { value: 0, label: "全部" },
        { value: 1, label: "已投递" },
        { value: 2, label: "未投递" }
      ],
      qr_no: undefined,
      user_type: undefined,
      start_time: "",
      over_time: "",
      user_name: "",
      phone: "",
      plot_name: "",
      house_number: "",
      dataSource: [], //居民信息列表
      tableLoading: false,
      total: 1,
      page: 1,
      //上传文件请求头
      headers: {
        authorization: "authorization-text"
      },
      //弹窗相关
      modelTitle: "新增居民信息",
      visible: false, //弹窗显示
      confirmLoading: false,
      building_no: undefined,
      form: {
        province_id: 0,
        city_id: 0,
        area_id: 0,
        region: undefined,
        // id: undefined,
        user_name: "",
        phone: "",
        plot_id: undefined,
        plot_name: "",
        building_no: "",
        element: "",
        house_number: ""
      },
      id: "",
      rules: {
        user_name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "change" }],
        region: [{ required: true, message: "请输入地址", trigger: "blur" }],
        plot_id: [{ required: true, message: "请输入小区", trigger: "blur" }],
        building_no: [{ required: true, message: "请输入楼号", trigger: "blur" }],
        house_number: [{ required: true, message: "请输入门牌号", trigger: "blur" }]
      },
      communityChartList: [] // 小区信息列表
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  created() {
    //获取列表
    // this.getTableList()
  },
  methods: {
    // 删除
    deleteListData() {
      let that = this
      let _page = that.selectedRowKeys.length === that.dataSource.length && that.page > 1 ? that.page - 1 : that.page
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .delCustomerInfo({ id: that.selectedRowKeys })
            .then(res => {
              that.delLoading = false
              that.getTableList(_page)
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
    // 表格选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    getCommunityChartList() {
      this.$api.getCommunityChartList({ area_id: this.form.area_id }).then(res => {
        this.communityChartList = res.data.map(item => {
          item.label = item.plot_name
          item.value = item.id
          return item
        })
      })
    },
    onChange(date, dateString) {
      this.start_time = dateString[0]
      this.over_time = dateString[1]
    },
    // 省市区选择返回值
    areaChange(e, name) {
      this.areaCascaderArea = name
      this.form.region = e
      this.form.province_id = e[0] || 0
      this.form.city_id = e[1] || 0
      this.form.area_id = e[2] || 0
      this.getCommunityChartList() // 小区信息列表
    },
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
    // 获取居民信息列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        plot_name: this.plot_name || "",
        user_name: this.user_name || "",
        phone: this.phone || "",
        start_time: this.start_time || "",
        over_time: this.over_time || "",
        building_no: this.building_no || "",
        user_type: this.user_type || "",
        qr_no: this.qr_no || "",
        house_number: this.house_number || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getCustomerInformationList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    //详情
    detail(key = "") {
      let oneData = []
      if (key) {
        oneData = this.dataSource.filter(item => {
          return item.id === key
        })
      }
      this.$router.push({
        name: "CustomerInformationDetails",
        query: { id: key },
        params: { data: oneData[0] }
      })
    },
    //导出
    trackExport() {
      let user_name = this.user_name || ""
      let phone = this.phone || ""
      let plot_name = this.plot_name || ""
      let start_time = this.start_time || ""
      let over_time = this.over_time || ""
      let building_no = this.building_no || ""
      let user_type = this.user_type || ""
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(
        `${process.env.VUE_APP_BASE_URL}/admin/v1/user/export?token=${token}&plot_name=${plot_name}&user_name=${user_name}&phone=${phone}&start_time=${start_time}&over_time=${over_time}&building_no=${building_no}&user_type=${user_type}`
      )
    },
    //上传文件 导入
    uploadFile(info) {
      if (info.file.status === "done") {
        this.getTableList()
        if (info.file.response.code !== 200) {
          this.$message.error(info.file.response.msg)
          return info.file.response.msg
        }
      }
    },
    // 新增
    add() {
      this.form = {
        province_id: 0,
        city_id: 0,
        area_id: 0,
        region: [],
        // id: undefined,
        user_name: "",
        phone: "",
        plot_id: undefined,
        plot_name: "",
        building_no: "",
        element: "",
        house_number: ""
      }
      this.visible = true
      this.modelTitle = "新增居民信息"
      this.$validator.resetFields(this)
    },

    // 编辑
    edit(e) {
      this.modelTitle = "编辑居民信息"
      this.form = {}
      this.form = this.$utils.deepCopy(e)
      this.form.region = [this.form.province_id, this.form.city_id, this.form.area_id]
      this.$validator.resetFields(this)
      this.visible = true
    },
    // 弹窗确定
    handleOk() {
      // this.visible = false
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ;(this.modelTitle === "新增居民信息" ? this.$api.addCustomerInformation(this.form) : this.$api.editCustomerInformation(this.form, this.id)).then(res => {
            this.$message.info(res.msg)
            this.visible = false
            this.getTableList()
            this.form = {
              province_id: 0,
              city_id: 0,
              area_id: 0,
              region: [],
              user_name: "",
              phone: "",
              plot_id: undefined,
              plot_name: "",
              building_no: "",
              element: "",
              house_number: ""
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
    // 表格删除
    deleteData(id) {
      let that = this
      this.$confirm({
        title: "删除",
        content: "是否确认删除此信息吗?",
        onOk() {
          that.$api.delCustomerInfo({ id }).then(res => {
            if (res.code == 200) {
              that.$message.success(res.msg)
              that.getTableList()
            }
          })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
// #CustomerInformation {
// }
.search-bar {
  display: flex;
  flex: 1;
  width: 100%;
  margin-bottom: 10px;
}
.form-line {
  width: 100%;
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.col-inline {
  white-space: nowrap;
  margin-bottom: 10px;
}

// .ctrl-bar:last-child {
//   justify-content: flex-end;
// }

.flex-start {
  justify-content: flex-start;
}

.mr10 {
  margin-right: 10px;
}
</style>
