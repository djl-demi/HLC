<template>
  <div id="TyAccount" ref="TyAccount">
    <a-space direction="vertical" size="large" class="w100b">
      <div class="oh">
        <!-- v-if="AccountSearch" -->
        <a-space class="fl" size="middle">
          <div>
            <span>账号：</span>
            <div class="dib"><a-input v-model="account" placeholder="请输入账号" /></div>
          </div>
          <div>
            <span>角色：</span>
            <div class="dib"><a-input v-model="position" placeholder="请输入角色" /></div>
          </div>
          <div>
            <span>状态：</span>
            <a-radio-group v-model="admin_type" button-style="solid">
              <a-radio-button value="">全部</a-radio-button>
              <a-radio-button :value="1">正常</a-radio-button>
              <a-radio-button :value="0">停止</a-radio-button>
            </a-radio-group>
          </div>
          <a-button type="primary" @click="getTableList(1)">查询</a-button>
        </a-space>
        <!-- v-if="AccountAdd" -->
        <a-space class="fr">
          <a-button type="primary" icon="plus-circle" @click="option('add')">新增账号</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-table size="middle" :loading="tableLoading" :data-source="dataSource" :pagination="false">
            <a-table-column title="项目名称" data-index="project_name" align="center" :ellipsis="true" />
            <a-table-column title="角色" data-index="admin_position_name" align="center" :ellipsis="true" />
            <a-table-column title="部门名称" data-index="department" align="center" :ellipsis="true" />

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
            <a-table-column key="option" title="操作" data-index="option" align="center" :width="320">
              <template slot-scope="text, record">
                <!-- v-if="AccountEdit"  v-if="AccountPermission"  v-if="AccountOperationRecord" v-if="AccountRecord" AccountResetPwd &&   AccountDel && -->
                <a-button type="link" size="small" @click="option('edit', record, record.id)">编辑账号</a-button>
                <a-button type="link" size="small" @click="option('permission', record, record.admin_position_id)">查看权限</a-button>
                <!-- <a-button  type="link" size="small" @click="option('operationRecord', record, record.id)">操作记录</a-button> -->
                <a-button type="link" size="small" @click="option('accountRecord', record, record.id)">账号记录</a-button>
                <a-button v-if="record.state && isApp" type="link" size="small" @click="option('resetPwd', record, record.id)">密码恢复</a-button>
                <a-button v-if="!record.admin_type" type="link" style="color: #ff4d4f" size="small" @click="option('del', record, record.id)">删除账号</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>

    <a-modal title="账号记录" :visible="visibleAccountRecord" :footer="null" @cancel="visibleAccountRecord = false" :getContainer="() => $refs.TyAccount" :width="700">
      <a-space direction="vertical" class="w100b">
        <a-table size="middle" :data-source="accountRecordDataSource" :loading="accountRecordTableLoading" :pagination="false">
          <a-table-column title="时间" data-index="create_time" align="center" />
          <a-table-column title="操作" data-index="operation_record" align="center" />
        </a-table>
        <div class="flex-center mt10">
          <a-pagination v-model="accountRecordPage" show-quick-jumper :total="accountRecordTotal" @change="getAccountRecordList()" />
        </div>
      </a-space>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "TyAccount",
  props: {
    dataSource: Array,
    total: Number,
    accountRecordDataSource: Array,
    accountRecordTotal: Number,
    AccountSearch: Boolean,
    AccountAdd: Boolean,
    AccountEdit: Boolean,
    AccountIsNormal: Boolean,
    AccountPermission: Boolean,
    AccountOperationRecord: Boolean,
    AccountRecord: Boolean,
    AccountResetPwd: Boolean,
    AccountDel: Boolean,
    isDel: {
      default: false,
      type: Boolean
    },
    isApp: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      account: "",
      position: "",
      // stateOptions: [
      //   { value: 1, label: "正常" },
      //   { value: 0, label: "停止" },
      // ],
      admin_type: "",
      // company_name: "",
      page: 1,
      type: "add",
      tableLoading: false,
      visibleAccountRecord: false,
      currentAccountId: -1,
      accountRecordPage: 1,
      accountRecordTableLoading: false
    }
  },
  mounted() {
    // this.AccountSearch && this.getTableList()
    this.getTableList()
  },
  methods: {
    // 账号列表
    getTableList(page) {
      if (page != undefined) {
        this.page = page
      }

      const data = {
        account: this.account,
        admin_type: this.admin_type === 0 || this.admin_type === 1 ? this.admin_type : "",
        position: this.position,
        page: this.page || 1
      }
      this.tableLoading = true
      this.$emit("search")
    },

    // 切换开关
    ChangeAccountState(record) {
      let state = record.admin_type ? 1 : 0
      this.$emit("switchChange", record, state)
    },

    // 获取账号记录列表
    getAccountRecordList() {
      this.accountRecordTableLoading = true
      this.$emit("getAccountRecordList", { account: this.currentAccount, platform: 1, page: this.accountRecordPage })
    },

    // 操作
    option(type, record) {
      this.$emit("operation", type, record)
    }
  }
}
</script>
