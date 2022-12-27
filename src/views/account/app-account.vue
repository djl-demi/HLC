<template>
  <div id="AppAccount">
    <div class="oh">
      <a-space class="fl" size="middle">
        <div>
          <span>账号：</span>
          <div class="dib"><a-input v-model="filter.account" placeholder="请输入账号" /></div>
        </div>
        <div>
          <span>状态：</span>
          <a-radio-group v-model="filter.account_type" button-style="solid">
            <a-radio-button value="">全部</a-radio-button>
            <a-radio-button :value="1">正常</a-radio-button>
            <a-radio-button :value="0">停止</a-radio-button>
          </a-radio-group>
        </div>
        <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
      </a-space>
      <a-space class="fr">
        <a-button type="primary" @click="addAccount" v-if="!isSuper">新增</a-button>
      </a-space>
    </div>
    <div class="oh w100b mt20">
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
          <a-table-column title="账号" data-index="account" align="center" :ellipsis="true" />
          <a-table-column title="姓名" data-index="account_name" align="center" :ellipsis="true" />
          <a-table-column title="区域" data-index="area_restriction" align="center" :ellipsis="true" />
          <a-table-column title="上次登录时间" data-index="login_time" align="center" :ellipsis="true" />
          <a-table-column key="account_type" title="状态" data-index="account_type" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-popconfirm
                v-if="dataSource.length"
                :title="record.account_type ? '确定恢复为正常吗？' : '确定要停止吗？'"
                okText="确定"
                cancelText="取消"
                @confirm="() => ChangeAccountState(record)"
                @cancel="record.account_type = !record.account_type"
              >
                <a-switch v-model="record.account_type" checked-children="正常" un-checked-children="停止" />
              </a-popconfirm>
            </template>
          </a-table-column>
          <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-button type="link" size="small" @click="option('edit', record)" v-if="!isSuper">编辑</a-button>
              <a-button v-if="!record.account_type" type="link" class="danger" size="small" @click="option('del', record)">删除账号</a-button>
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
        <a-form-model-item ref="account_name" label="姓名" prop="account_name" has-feedback>
          <a-input v-model="form.account_name" placeholder="请输入姓名" />
        </a-form-model-item>
        <a-form-model-item ref="garbage_house" label="环保屋" prop="garbage_house" has-feedback>
          <a-select v-model="form.garbage_house" class="w200" mode="multiple" placeholder="请选择环保屋" :options="garbagehouseOptions" :filterOption="filterOption" allowClear />
        </a-form-model-item>
        <a-form-model-item label="密码">
          <span>a12345678</span>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "AppAccount",
  data() {
    return {
      tableLoading: false,
      filter: {
        account: "",
        account_type: "",
        page: 1
      },
      form: {
        account: "",
        account_name: "",
        garbage_house: []
      },
      rules: {
        account: [{ required: true, validator: this.$validator.account(), trigger: "change" }],
        account_name: [{ required: true, message: "请输入姓名", trigger: "change" }],
        garbage_house: [{ required: true, message: "请选择环保屋", trigger: "change" }]
      },
      accountTitle: "新增账号",
      accountVisible: false, // 新增/编辑账号弹窗
      confirmLoading: false, // 新增/编辑账号弹窗 加载状态
      total: 0,
      dataSource: [],
      garbagehouseOptions: [],
      isSuper: false
    }
  },
  created() {
    let user = JSON.parse(localStorage.getItem("userInfo"))
    this.isSuper = user.super

    this.getTableList()
    this.getGarbagehouseOptions()
  },
  methods: {
    getTableList(page) {
      if (page) this.filter.page = page
      this.tableLoading = true
      this.$api.getAppAccountList(this.filter).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          item.account_type = item.account_type === 1 ? true : false
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 获取所有环保屋
    getGarbagehouseOptions() {
      this.$api.getGarbagehouseOptions().then(res => {
        this.garbagehouseOptions = res.data.map(item => {
          item.label = item.house_name
          item.value = item.id
          return item
        })
      })
    },

    // 新增账号
    addAccount() {
      this.form = {
        account: "",
        account_name: "",
        garbage_house: []
      }
      this.accountTitle = "新增账号"
      this.accountVisible = true
    },

    // 账号操作
    option(type, item) {
      const that = this
      if (type === "edit") {
        this.$api.getAppAccount({ id: item.id }).then(res => {
          this.accountTitle = "编辑账号"
          this.accountVisible = true
          this.form.id = res.data.id
          this.form.account = res.data.account
          this.form.account_name = res.data.account_name
          this.form.garbage_house = res.data.site_account_garbage_house.map(item => {
            let match = this.garbagehouseOptions.find(e => {
              return e.id === item.garbage_house_id
            })
            return match && match.id
          })
          this.form.garbage_house = this.form.garbage_house.filter(e => {
            return e !== undefined
          })
        })
      }

      if (type === "del") {
        this.$confirm({
          content: `确定删除账号：${item.account} 吗？`,
          onOk() {
            that.$api.delAppAccount({ id: item.id }).then(res => {
              that.$message.success(res.msg)
              that.getTableList()
            })
          }
        })
      }
    },

    // 切换开关
    ChangeAccountState(record) {
      this.$api
        .ChangeAppAccountState({ id: record.key, type: record.account_type ? 1 : 0 })
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          record.account_type = !record.account_type
        })
    },

    // 确定新增/编辑账号
    changeAccountOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          let data = {
            account: this.form.account,
            account_name: this.form.account_name,
            garbage_house: []
          }
          if (this.form.id) data.id = this.form.id
          this.garbagehouseOptions.forEach(item => {
            this.form.garbage_house.forEach(sitem => {
              if (item.value === sitem) {
                data.garbage_house.push({
                  garbage_house_id: item.value,
                  house_name: item.label
                })
              }
            })
          })
          ;(this.accountTitle === "新增账号" ? this.$api.postAppAccount(data) : this.$api.editAppAccount(data))
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
    },
    // 下拉选择筛选过滤
    filterOption(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    }
  }
}
</script>

<style lang="less" scoped>
#AppAccount {
}
</style>
