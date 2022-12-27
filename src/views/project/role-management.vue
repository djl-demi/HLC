<template>
  <div id="PositionManagement">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <!-- v-if="PositionManagementSearch" -->
        <a-space class="fl" size="middle">
          <div>
            <span>职位：</span>
            <div class="dib"><a-input style="width: 150px" v-model="position" placeholder="请输入职位" allowClear /></div>
          </div>
          <div>
            <span>状态：</span>
            <div class="dib"><a-select style="width: 150px" :options="state_options" v-model="state" placeholder="全部" allowClear /></div>
          </div>
          <a-button type="primary" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <!-- v-if="PositionManagementAdd" -->
        <a-space class="fr">
          <a-button type="primary" icon="plus-circle" @click="option('add')">新增职位</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-space class="w100b">
            <a-button type="danger" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
          </a-space>
          <a-table
            size="middle"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :loading="tableLoading"
            :data-source="dataSource"
            :pagination="false"
            :rowKey="record => record.id"
            :scroll="{ x: 1500 }"
          >
            <!-- <a-table-column key="company_name" title="运营公司" data-index="company_name" align="center" ellipsis="ture" /> -->
            <a-table-column key="projects" title="项目名称" data-index="projects" align="center" ellipsis="ture" />
            <a-table-column key="position_name" title="操作岗位" data-index="position_name" align="center" />
            <a-table-column key="members_num" title="人数" data-index="members_num" align="center" :width="120" />
            <!-- v-if="PositionManagementViewBG" -->
            <a-table-column key="action" title="后台权限" data-index="option" align="center" :width="120">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="viewBackground(record.key)">查看权限</a-button>
              </template>
            </a-table-column>
            <!-- v-if="PositionManagementViewApp" -->
            <a-table-column key="action1" title="小程序权限" data-index="option" align="center" :width="120">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="checkApp(record.key)">查看权限</a-button>
              </template>
            </a-table-column>
            <!-- v-if="PositionManagementIsNormal" -->
            <a-table-column key="state" title="状态" data-index="state" align="center" :width="120">
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
            <!-- v-if="PositionManagementEditBG || PositionManagementEditApp || PositionManagementEdit || PositionManagementDel" -->
            <a-table-column key="option" title="操作" data-index="option" align="center" :width="500">
              <template slot-scope="text, record">
                <!-- v-if="PositionManagementEditBG" v-if="PositionManagementEditApp" v-if="PositionManagementEdit" v-if="PositionManagementDel" -->
                <a-button type="link" size="small" @click="editBackground(record.key)">编辑后台权限</a-button>
                <a-button type="link" @click="editApp(record.key)">编辑小程序权限</a-button>
                <a-button type="link" @click="option('edit', text, record)">编辑职位</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>

    <a-modal :title="form_title" :visible="visibleForm" :confirm-loading="confirmLoading" @ok="handleSave" @cancel="handleCloseFrom">
      <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 14, offset: 1 }">
        <a-form-model-item ref="position" label="操作岗位" prop="position" has-feedback>
          <a-input v-model="form.position" placeholder="请输入职位" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="project_id" class="project_id" label="项目名称" prop="project_id">
          <a-select v-model="form.project_id" :options="projectList" mode="multiple" @change="selectChange" :filter-option="$com.filterOption" placeholder="请选择项目名称" allowClear />
        </a-form-model-item>
        <a-checkbox v-model="checkAll" class="checkbox" @change="allChange"> 全选 </a-checkbox>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "PositionManagement",
  data() {
    return {
      state_options: [
        { value: "0", label: "停止" },
        { value: "1", label: "正常" }
      ],
      state: undefined,
      position: "",
      dataSource: [{}],
      total: 1,
      page: 1,
      position_id: "",
      form: {
        // company_id: undefined,
        position: "",
        project_id: [],
        project: []
      },
      rules: {
        // company_id: [{ required: true, message: "请选择公司名称", trigger: "change" }],
        project_id: [{ required: true, message: "请选择项目名称", trigger: "change" }],
        position: [{ required: true, message: "请输入职位", trigger: "change" }]
      },
      delLoading: false,
      selectedRowKeys: [],
      checkAll: false,
      projectList: [], // 公司项目列表
      allCompanyList: [], // 公司列表
      form_title: "新增职位",
      tableLoading: false,
      visibleForm: false, // 新增/编辑弹窗
      confirmLoading: false // 新增/编辑弹窗 加载状态
    }
  },
  created() {
    console.log("this.form.project", this.form.project)
    // this.$com.getAllCompanyList(this, "allCompanyList") // 公司列表
    // if (this.PositionManagementSearch) this.getTableList()
    this.getTableList()
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
    // PositionManagementSearch() {
    //   return this.$com.getPermission(this.$route.matched, "PositionManagementSearch")
    // },
    // PositionManagementAdd() {
    //   return this.$com.getPermission(this.$route.matched, "PositionManagementAdd")
    // },
    // PositionManagementViewBG() {
    //   return this.$com.getPermission(this.$route.matched, "PositionManagementViewBG")
    // },
    // PositionManagementViewApp() {
    //   return this.$com.getPermission(this.$route.matched, "PositionManagementViewApp")
    // },
    // PositionManagementIsNormal() {
    //   return this.$com.getPermission(this.$route.matched, "PositionManagementIsNormal")
    // },
    // PositionManagementEditBG() {
    //   return this.$com.getPermission(this.$route.matched, "PositionManagementEditBG")
    // },
    // PositionManagementEditApp() {
    //   return this.$com.getPermission(this.$route.matched, "PositionManagementEditApp")
    // },
    // PositionManagementEdit() {
    //   return this.$com.getPermission(this.$route.matched, "PositionManagementEdit")
    // },
    // PositionManagementDel() {
    //   return this.$com.getPermission(this.$route.matched, "PositionManagementDel")
    // }
  },
  methods: {
    //  表格选择项
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 获取职位
    getTableList(page) {
      if (page) this.page = page
      var data = {
        position: this.position || "",
        state: this.state || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api
        .getPositionManagementList(data)
        .then(res => {
          const dataSource = res.data.data.map(item => {
            item.key = item.id
            item.state = item.state ? true : false
            return item
          })
          // console.log("dataSource", dataSource)
          this.total = res.data.total
          this.dataSource = dataSource
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    switchChange(record) {
      //切换状态
      var state = record.state ? 1 : 0
      this.$api
        .statePositionManagement({ id: record.key, state: state })
        .then(res => {
          this.$message.success({ content: res.msg })
        })
        .catch(err => {
          record.state = !record.state
        })
    },
    // 操作
    option(type, text, record) {
      const that = this
      this.form.company_id = undefined
      this.form.project_id = []
      this.form.project = []
      this.form.position = ""

      if (type == "edit") {
        this.companyChange(record.company_id)
        this.$api
          .viewPositionManagement({ id: record.id })
          .then(res => {
            console.log(res.data, "res.data")
            this.form.id = res.data.id
            // this.position_id = res.data.id
            // const company_id = res.data.company_id
            // this.form.company_id = company_id

            this.form.position = res.data.position_name
            this.form.project_id = res.data.project_ids
            this.selectChange()
            this.visibleForm = true
          })
          .catch(err => {
            this.visibleForm = true
          })
        this.type = "edit"
        this.form_title = "编辑职位"
      }
      if (type === "add") {
        this.companyChange()
        ;(this.form = {
          // company_id: undefined,
          // project_id: undefined,
          project: [],
          position: ""
        }),
          // 添加
          (this.type = "add")
        this.form_title = "新增职位"
        this.visibleForm = true
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
            .delPosition({ ids: that.selectedRowKeys })
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
    //获取公司下项目列表
    companyChange(value) {
      // console.log(value, "value")
      let data = {}
      if (value != undefined) {
        data = {
          company_id: value
        }
      }
      this.$api.getProjectList(data).then(res => {
        if (res.code === 200) {
          this.projectList = res.data.map(item => {
            item.label = item.project_name
            item.value = item.project_id
            return item
          })
        }
      })
      this.form.project_id = []
      this.checkAll = false
    },
    allChange(e) {
      if (this.checkAll) {
        this.form.project_id = []
        console.log("e", e.target.checked)
        console.log("e1", this.projectList)
        this.projectList.map(item => {
          this.form.project_id.push(item.project_id)
        })
      } else {
        this.form.project_id = []
      }
    },
    // 项目选择
    selectChange(e) {
      console.log(e, "selectChange")
      let flag = true
      if (this.form.project_id.length !== this.projectList.length) {
        flag = false
      }
      this.checkAll = flag
    },
    handleCloseFrom() {
      this.visibleForm = false
    },
    // handleSave() {
    //   this.$refs.ruleForm.validate((valid) => {
    //     if (valid) {
    //       if (this.form_title === "新增职位") {
    //         //新增
    //         this.$api.addPositionManagement(this.form).then((res) => {
    //           this.$message.success({ content: res.msg })
    //           this.confirmLoading = false
    //           this.visibleForm = false
    //           this.getTableList()
    //         })
    //       }
    //       if (this.form_title === "编辑职位") {
    //         this.form.id = this.position_id
    //         console.log(this.form, "this.form")
    //         // 编辑
    //         this.$api.editPositionManagement(this.form).then((res) => {
    //           this.$message.success({ content: res.msg })
    //           this.confirmLoading = false
    //           this.visibleForm = false
    //           this.getTableList()
    //         })
    //       }
    //     }
    //   })
    // },
    handleSave() {
      this.$refs.ruleForm.validate(valid => {
        console.log(valid, "valid")
        if (valid) {
          let project = []
          this.form.project.forEach(item => {
            project.push(item)
          })
          this.form.project = this.form.project_id
          // console.log(this.form.project, "this.form.project")
          if (this.form_title === "新增职位") {
            //新增
            this.$api.addPositionManagement(this.form).then(res => {
              this.$message.success({ content: res.msg })
              this.confirmLoading = false
              this.visibleForm = false
              this.getTableList()
            })
          }
          if (this.form_title === "编辑职位") {
            // 编辑
            this.$api.editPositionManagement(this.form).then(res => {
              this.$message.success({ content: res.msg })
              this.confirmLoading = false
              this.visibleForm = false
              this.getTableList()
            })
          }
        }
      })
    },

    // 查看后台权限
    viewBackground(id) {
      this.$router.push({
        name: "BgPermissionView",
        query: { id, system: "background" }
      })
    },

    // 查看小程序权限
    checkApp(id) {
      this.$router.push({
        name: "BgPermissionView",
        query: { id, system: "app" }
      })
    },

    // 编辑后台权限
    editBackground(id) {
      this.$router.push({ name: "BgPermissionEdit", query: { id, system: "background" } })
    },

    // 编辑小程序权限
    editApp(id) {
      this.$router.push({ name: "BgPermissionEdit", query: { id, system: "app" } })
    }
  }
}
</script>
<style lang="less">
.company {
  height: 55px;
}
.project {
  // height: 40px;
}
.checkbox {
  position: absolute;
  top: 150px;
  right: 30px;
}
.ant-form-item-control {
  line-height: 0px !important;
}
</style>
