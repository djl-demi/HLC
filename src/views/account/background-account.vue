<template>
  <div id="BackgroundAccount">
    <div class="oh">
      <a-space class="fl" size="middle">
        <div>
          <span>账号：</span>
          <div class="dib"><a-input v-model="filter.account" placeholder="请输入账号" /></div>
        </div>
        <div>
          <span>角色：</span>
          <div class="dib"><a-input v-model="filter.account" placeholder="请输入角色" /></div>
        </div>
        <div>
          <span>状态：</span>
          <a-radio-group v-model="filter.admin_type" button-style="solid">
            <a-radio-button value="">全部</a-radio-button>
            <a-radio-button :value="1">正常</a-radio-button>
            <a-radio-button :value="0">停止</a-radio-button>
          </a-radio-group>
        </div>
        <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
      </a-space>
      <a-space class="fr">
        <a-button type="primary" @click="addAccount">新增账号</a-button>
      </a-space>
    </div>
    <div class="oh w100b mt20">
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
          <a-table-column title="项目名称" data-index="project_name" align="center" :ellipsis="true" />
          <a-table-column title="角色" data-index="project_name" align="center" :ellipsis="true" />
          <a-table-column title="部门名称" data-index="project_name" align="center" :ellipsis="true" />

          <a-table-column title="账号" data-index="account" align="center" :ellipsis="true" />
          <a-table-column title="姓名" data-index="name" align="center" :ellipsis="true" />
          <!-- <a-table-column title="区域" data-index="area_restriction" align="center" :ellipsis="true" /> -->
          <a-table-column key="admin_type" title="状态" data-index="admin_type" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-popconfirm
                v-if="dataSource.length"
                :title="record.admin_type ? '确定恢复为正常吗？' : '确定要停止吗？'"
                okText="确定"
                cancelText="取消"
                :maskClosable="false"
                @confirm="() => ChangeAccountState(record)"
                @cancel="record.admin_type = !record.admin_type"
              >
                <a-switch v-model="record.admin_type" checked-children="正常" un-checked-children="停止" />
              </a-popconfirm>
            </template>
          </a-table-column>
          <a-table-column title="上次登录时间" data-index="login_time" align="center" :ellipsis="true" />
          <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true" :width="340">
            <template slot-scope="text, record">
              <a-button type="link" size="small" @click="option('edit', record)">编辑账号</a-button>

              <a-button type="link" size="small" @click="option('edit', record)">查看权限</a-button>
              <a-button type="link" size="small" @click="option('edit', record)">账号记录</a-button>

              <a-button v-if="record.admin_type" type="link" size="small" @click="option('reset', record)">密码恢复</a-button>
              <a-button v-else type="link" class="danger" size="small" @click="option('del', record)">删除账号</a-button>
            </template>
          </a-table-column>
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="filter.page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-space>
    </div>

    <a-modal :title="accountTitle" :visible="accountVisible" :confirm-loading="confirmLoading" @ok="changeAccountOk" @cancel="changeAccountCancel" destroyOnClose :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 14, offset: 1 }">
        <a-form-model-item ref="account" label="账号" prop="account" has-feedback>
          <a-input v-model="form.account" placeholder="请输入账号" />
        </a-form-model-item>
        <a-form-model-item label="初始密码">
          <span>a12345678</span>
        </a-form-model-item>
        <a-form-model-item ref="project_id" label="项目" prop="project_id" has-feedback>
          <a-select v-model="form.project_id" :options="projectList" placeholder="请选择项目" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="姓名" prop="name" has-feedback>
          <a-input v-model="form.name" placeholder="请输入姓名" />
        </a-form-model-item>
        <div v-for="(item, index) in form.area_restriction" :key="item.id">
          <a-form-model-item ref="region" :label="'区域' + (index + 1)" :prop="'area_restriction.' + index + '.region'" :rules="regionRule">
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
  name: "BackgroundAccount",
  components: { TyAreaCascader },
  data() {
    return {
      tableLoading: false,
      filter: {
        account: "",
        admin_type: "",
        page: 1
      },
      projectList: [], // 项目列表
      form: {
        account: "",
        name: "",
        project_id: undefined,
        area_restriction: [{ region: [], id: this.$utils.createUUID() }]
      },
      rules: {
        project_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        account: [{ required: true, validator: this.$validator.account(), trigger: "change" }],
        name: [{ required: true, message: "请输入姓名", trigger: "change" }]
      },
      // regionRule: [{ required: true, validator: this.$validator.region(), trigger: "change" }],
      regionRule: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (!value || value.length === 0) {
              callback(new Error("请选择省市区"))
            } else {
              if (value.length === 3) {
                let num = 0
                this.form.area_restriction.forEach((item, index) => {
                  if (item.region[0] === value[0] && item.region[1] === value[1] && item.region[2] === value[2]) {
                    num++
                  }
                })
                // console.log(num, "nummm")
                // if (num == 0 || num == 1) {
                //   callback()
                // } else {
                //   callback(new Error("该区域与其他区域相同"))
                // }
                // num === (0 || 1) ? callback() : callback(new Error("该区域与其他区域相同"))
                num === 0 ? callback() : num === 1 ? callback() : callback(new Error("该区域与其他区域相同"))
              } else {
                callback(new Error("请选择完整的省市区"))
              }
            }
          },
          trigger: "change"
        }
      ],
      accountTitle: "新增账号",
      accountVisible: false, // 新增/编辑账号弹窗
      confirmLoading: false, // 新增/编辑账号弹窗 加载状态
      total: 0,
      dataSource: []
    }
  },
  created() {
    this.getProjectList()
    this.getTableList()
  },
  methods: {
    // 获取项目列表
    getProjectList() {
      this.$api.getProjectSelectList().then(res => {
        this.projectList = res.data.map(item => {
          item.label = item.project_name
          item.value = item.id
          return item
        })
      })
    },
    getTableList(page) {
      if (page) this.filter.page = page
      this.tableLoading = true
      this.$api
        .getAccountList(this.filter)
        .then(res => {
          this.dataSource = res.data.data.map(item => {
            item.key = item.id
            item.admin_type = item.admin_type === 1 ? true : false
            return item
          })
          this.tableLoading = false
          this.total = res.data.total
        })
        .catch(err => {
          this.tableLoading = false
        })
    },

    // 新增账号
    addAccount() {
      this.form = {
        account: "",
        name: "",
        project_id: undefined,
        area_restriction: [{ region: [], id: this.$utils.createUUID() }]
      }
      this.accountTitle = "新增账号"
      this.accountVisible = true
    },

    // 账号操作
    option(type, item) {
      const that = this
      if (type === "edit") {
        this.$api.getAccount({ id: item.id }).then(res => {
          this.accountTitle = "编辑账号"
          this.accountVisible = true
          this.form.id = res.data.id
          this.form.account = res.data.account
          this.form.name = res.data.name
          this.form.project_id = res.data.project_id
          this.form.area_restriction = res.data.area_restriction
          this.form.area_restriction = res.data.area_restriction.map(item => {
            item.region = [item.province_id, item.city_id, item.area_id]
            item.id = this.$utils.createUUID()
            return item
          })
        })
      }
      if (type === "reset") {
        this.$confirm({
          content: `确定恢复账号：${item.account} 的密码为初始密码吗？`,
          onOk() {
            that.$api.resetPassword({ id: item.id }).then(res => {
              that.$message.success(res.msg)
            })
          }
        })
      }

      if (type === "del") {
        this.$confirm({
          content: `确定删除账号：${item.account} 吗？`,
          onOk() {
            that.$api.delAccount({ id: item.id }).then(res => {
              that.$message.success(res.msg)
            })
          }
        })
      }
    },

    // 切换开关
    ChangeAccountState(record) {
      this.$api
        .ChangeAccountState({ id: record.key, admin_type: record.admin_type ? 1 : 0 })
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          record.admin_type = !record.admin_type
        })
    },

    // 省市区选择返回值
    areaChange(e, name, id) {
      if (name !== undefined) {
        this.form.area_restriction.forEach(item => {
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
      this.form.area_restriction.splice(this.form.area_restriction.length, 0, {
        region: [],
        id: this.$utils.createUUID()
      })
    },

    // 删除省市区选择
    removeRegion(e) {
      this.form.area_restriction = this.form.area_restriction.filter(item => item.id !== e.id)
    },

    // 确定新增/编辑账号
    changeAccountOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          ;(this.accountTitle === "新增账号" ? this.$api.postAccount(this.form) : this.$api.editAccount(this.form))
            .then(res => {
              this.$message.success(res.msg)
              this.confirmLoading = false
              this.getTableList()
              this.accountVisible = false
            })
            .catch(() => {
              this.confirmLoading = false
            })
        }
      })
    },

    // 取消 新增/编辑账号
    changeAccountCancel() {
      this.accountVisible = false
    }
  }
}
</script>

<style lang="less">
#BackgroundAccount {
  .danger {
    color: #ff4d4f;
  }
}
.dynamic-action-button {
  position: absolute;
  top: -6px;
  right: -50px;
  font-size: 20px;
  .anticon {
    vertical-align: -0.125em !important;
  }
}
</style>
