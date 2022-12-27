<template>
  <div id="CompanyManagement">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <!-- v-if="CompanyManagementSearch" -->
        <a-space class="fl" size="middle">
          <div>
            <span>项目公司：</span>
            <div class="dib"><a-input style="width: 150px" v-model="company_name" placeholder="请输入公司名称" allowClear /></div>
          </div>
          <div>
            <span>类型：</span>
            <div class="dib"><a-select style="width: 150px" :options="type_options" v-model="type" placeholder="全部" allowClear /></div>
          </div>
          <div>
            <span>状态：</span>
            <div class="dib"><a-select style="width: 150px" :options="state_options" v-model="state" placeholder="全部" allowClear /></div>
          </div>
          <a-button type="primary" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <!-- v-if="CompanyManagementAdd" -->
        <a-space class="fr">
          <a-button v-if="CompanyManagementAdd" type="primary" icon="plus-circle" @click="option('add')">新增</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-space class="w100b">
            <a-button type="danger" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
          </a-space>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :rowKey="record => record.id" :data-source="dataSource" :pagination="false">
            <a-table-column key="company_name" title="公司名称" data-index="company_name" align="center" />
            <a-table-column key="type_name" title="公司类型" data-index="type_name" align="center" />
            <a-table-column key="project_name" title="项目名称" data-index="project_name" align="center" />
            <a-table-column key="create_time" title="创建时间" data-index="create_time" align="center" />
            <a-table-column key="area_restriction" title="项目区域" data-index="area_restriction" align="center" ellipsis="true" />
            <a-table-column key="state" title="状态" data-index="state" align="center">
              <template slot-scope="text, record">
                <a-popconfirm
                  v-if="dataSource.length"
                  :title="record.state ? '确定恢复为正常吗？' : '确定要停止吗？'"
                  okText="确定"
                  cancelText="取消"
                  @confirm="() => switchChange(record)"
                  @cancel="record.state = !record.state"
                >
                  <a-switch checked-children="正常" un-checked-children="停止" v-model="record.state" />
                </a-popconfirm>
              </template>
            </a-table-column>
            <a-table-column key="option" title="操作" data-index="option" align="center">
              <template slot-scope="text, record">
                <!-- v-if="CompanyManagementEdit" -->
                <a-button v-if="CompanyManagementEdit" type="link" size="small" @click="option('edit', text, record)">编辑</a-button>
                <!-- <a-button type="link" :loading="delLoading" @click="deleteData(record.key)">删除</a-button> -->
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>

    <a-modal :title="companyTitle" :visible="visibleForm" :confirm-loading="confirmLoading" @ok="handleSave" @cancel="handleCloseFrom">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5, offset: 1 }" :wrapper-col="{ span: 14, offset: 1 }">
        <a-form-model-item ref="company_name" label="公司名称" prop="company_name" has-feedback>
          <a-input v-model="form.company_name" placeholder="请输入公司名称" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="company_type" label="公司类型" prop="company_type">
          <span v-if="companyTitle === '编辑'">{{ form.company_type === "1" ? "一级公司" : "二级公司" }}</span>
          <a-radio-group v-if="companyTitle === '新增'" v-model="form.company_type">
            <a-radio :value="'1'">一级公司</a-radio>
            <a-radio :value="'2'">二级公司</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="form.company_type !== '1'" ref="parent_company_id" label="一级公司名称" prop="parent_company_id" required has-feedback>
          <a-select v-model="form.parent_company_id" :options="firstCompanyList" placeholder="请选择公司名称" allowClear></a-select>
        </a-form-model-item>
        <a-form-model-item ref="project_name" label="项目名称" prop="project_name" has-feedback>
          <a-input v-model="form.project_name" placeholder="请输入项目名称" allowClear />
        </a-form-model-item>

        <div v-for="(item, index) in form.area" :key="item.id">
          <a-form-model-item ref="region" :label="'区域' + (index + 1)" :prop="'area.' + index + '.region'" :rules="regionRule">
            <TyAreaCascader :model="item.region" @change="(id, name) => areaChange(id, name, item.id)"></TyAreaCascader>
            <a-button v-if="index !== 0" class="dynamic-action-button" type="danger" icon="minus" @click="removeRegion(item)" />
            <a-button v-if="index === 0" class="dynamic-action-button" type="primary" icon="plus" @click="addRegion()" />
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import TyAreaCascader from "@/components/ty-area-cascader/ty-area-cascader.vue"
export default {
  name: "CompanyManagement",
  components: { TyAreaCascader },
  data() {
    return {
      state_options: [
        { value: "1", label: "正常" },
        { value: "2", label: "禁用" }
      ],
      state: undefined,
      type_options: [
        { value: "1", label: "一级" },
        { value: "2", label: "二级" }
      ],
      type: undefined,
      company_name: "",
      dataSource: [],
      selectedRowKeys: [],
      delLoading: false,
      total: 1,
      page: 1,
      form: {
        company_name: "",
        // parent_company_id: "1",
        company_type: "1",
        parent_company_id: undefined,
        project_name: "",
        area: [{ region: [], id: this.$utils.createUUID() }]
      },
      rules: {
        company_name: [{ required: true, message: "请输入公司名", trigger: "change" }],
        company_type: [{ required: true, message: "请选择公司类型", trigger: "change" }],
        project_name: [{ required: true, message: "请输入地址详情", trigger: "change" }],
        parent_company_id: [{ required: true, message: "请选择一级公司", trigger: "change" }]
      },
      regionRule: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (!value || value.length === 0) {
              callback(new Error("请选择省市区"))
            } else {
              if (value.length === 3) {
                let num = 0
                this.form.area.forEach((item, index) => {
                  if (item.region[0] === value[0] && item.region[1] === value[1] && item.region[2] === value[2]) {
                    num++
                  }
                })
                num === 0 ? callback() : num === 1 ? callback() : callback(new Error("该区域与其他区域相同"))
              } else {
                callback(new Error("请选择完整的省市区"))
              }
            }
          },
          trigger: "change"
        }
      ],
      firstCompanyList: [],
      companyTitle: "新增",
      visibleForm: false, // 新增/编辑账号弹窗
      confirmLoading: false // 新增/编辑账号弹窗 加载状态
    }
  },
  created() {
    this.getTableList()
    // if (this.CompanyManagementSearch) this.getTableList()
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },

    // CompanyManagementSearch() {
    //   return this.$com.getPermission(this.$route.matched, "CompanyManagementSearch")
    // },
    CompanyManagementAdd() {
      return this.$com.getPermission(this.$route.matched, "CompanyManagementAdd")
    },
    CompanyManagementEdit() {
      return this.$com.getPermission(this.$route.matched, "CompanyManagementEdit")
    }
  },
  methods: {
    // 表格选择项
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 获取职位
    getTableList(page) {
      if (page) this.page = page
      var data = {
        company_name: this.company_name || "",
        state: this.state || "",
        type: this.type || "",
        page: this.page
      }
      this.$api.getCompanyManagementList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.parent_company_id = item.parent_company_id === 0 ? "一级公司" : "二级公司"
          item.state = item.state === 1 ? true : false
          item.key = item.id
          return item
        })
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    switchChange(record) {
      //切换状态
      var state = record.state ? 1 : 2
      this.$api
        .stateProjectManagement({ id: record.key, state: state })
        .then(res => {
          this.$message.success({ content: res.msg })
        })
        .catch(err => {
          record.state = !record.state
        })
    },

    // 操作
    option(operation, text, record) {
      if (operation == "edit") {
        this.$com.firstCompanyList(this, "firstCompanyList") // 一级公司列表
        this.$api.viewCompanyManagement({ id: record.id }).then(res => {
          this.form.id = res.data.id
          this.form.company_name = res.data.company_name || ""
          this.form.project_name = res.data.project_name || ""
          this.form.company_type = res.data.type === 1 ? "1" : "2"
          this.form.parent_company_id = res.data.parent_company_id
          if (res.data.parent_company_id === 0) this.form.parent_company_id = ""
          this.form.area = res.data.area_restriction.map(item => {
            item.region = [item.province_id, item.city_id, item.area_id]
            item.id = this.$utils.createUUID()
            return item
          })
        })

        this.operation = "edit"
        this.companyTitle = "编辑"
        this.visibleForm = true
      } else {
        // 添加
        this.operation = "add"
        this.companyTitle = "新增"
        this.form = {
          project_name: "",
          company_name: "",
          company_type: "1",
          parent_company_id: undefined,
          area: [{ region: [], id: this.$utils.createUUID() }]
        }
        // 重置
        // this.form.company_name = ""
        // this.form.admin_position_name = ""
        this.visibleForm = true
        this.$com.firstCompanyList(this, "firstCompanyList") // 一级公司列表
      }
    },
    // 表格删除
    deleteData() {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .delCompanyManagement({ id: that.selectedRowKeys })
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
    // 省市区选择返回值
    areaChange(e, name, id) {
      if (name !== undefined) {
        this.form.area.forEach(item => {
          if (item.id === id) {
            item.region = e // 用于校验是否选择了完整的省市区
            item.province_name = name.province_name
            item.province_id = e[0]
            item.city_name = name.city_name
            item.city_id = e[1]
            item.area_name = name.area_name
            item.area_id = e[2]
          }
        })
        this.$nextTick(() => {
          this.$refs.ruleForm.validate()
        })
      }
    },

    // 新增省市区选择
    addRegion() {
      this.form.area.splice(this.form.area.length, 0, {
        region: [],
        id: this.$utils.createUUID()
      })
    },

    // 删除省市区选择
    removeRegion(e) {
      this.form.area = this.form.area.filter(item => item.id !== e.id)
    },
    handleCloseFrom() {
      this.visibleForm = false
    },
    handleSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.form.parent_company_id) this.form.parent_company_id = 0
          ;(this.operation === "add" ? this.$api.addCompanyManagement(this.form) : this.$api.editCompanyManagement(this.form)).then(res => {
            this.$message.success({ content: res.msg })
            this.visibleForm = false
            this.getTableList()
          })
        }
      })
    }
  }
}
</script>
