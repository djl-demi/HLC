<template>
  <div class="diverManagement">
    <a-space direction="vertical" size="large" class="w100b">
      <div class="oh">
        <a-space class="fl mb10" size="middle">
          <div>
            <span>联系方式：</span>
            <div class="dib"><a-input v-model="filter.phone" placeholder="请输入联系方式" allowClear /></div>
          </div>
          <div>
            <span>姓名：</span>
            <div class="dib"><a-input v-model="filter.driverName" placeholder="请输入姓名" allowClear /></div>
          </div>
          <div>
            <span>状态：</span>
            <div class="dib"><a-select v-model="filter.isNormal" :options="stateOption" class="w200" placeholder="请选择状态" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <a-space class="fr">
          <a-button type="primary" icon="plus" @click="operation('add')">新增</a-button>
        </a-space>
      </div>

      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-space class="w100b">
            <a-button type="danger" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
          </a-space>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :loading="tableLoading" :pagination="false">
            <a-table-column title="联系方式" data-index="phone" align="center" :ellipsis="true" />
            <a-table-column title="姓名" data-index="driverName" align="center" :ellipsis="true" />
            <a-table-column title="区域" data-index="areaName" align="center" :ellipsis="true" />
            <a-table-column title="上次登录时间" data-index="loginTime" align="center" :ellipsis="true" />
            <a-table-column title="状态" data-index="state" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-popconfirm
                  v-if="dataSource.length"
                  :title="record.isNormal ? '确定要禁用吗？' : '确定恢复为启用吗？'"
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
            <a-table-column title="操作" data-index="operation" align="center" :width="250" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="operation('edit', record)">编辑</a-button>
                <a-button type="link" size="small" @click="resetPwd(record)">密码恢复</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30 mb20">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>

    <a-modal :title="operationTitle" :visible="operationVisible" :confirm-loading="operationLoading" @ok="operationOk" @cancel="operationVisible = false" :maskClosable="false" :width="600">
      <a-form-model ref="ruleForm" :model="driverForm" :rules="rules" :label-col="{ span: 6, offset: 0 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="phone" label="联系方式" prop="phone" has-feedback>
          <a-input v-model="driverForm.phone" placeholder="请输入联系方式" :disabled="disabledPhone" class="w100b" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="name" label="姓名" prop="name">
          <a-input v-model="driverForm.name" placeholder="请输入姓名" class="w100b" allowClear />
        </a-form-model-item>
        <!-- <a-form-model-item ref="green_house" label="环保屋" prop="green_house" has-feedback>
          <a-select mode="multiple" v-model="driverForm.green_house" style="width: 100%" placeholder="请选择环保屋" :filterOption="filterOption">
            <a-select-option v-for="item in greenHouseItem" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item> -->
        <a-form-model-item ref="create_account" label="是否开通小程序账号" prop="create_account">
          <a-radio-group name="create_account" v-model="driverForm.create_account">
            <a-radio :value="1"> 是 </a-radio>
            <a-radio :value="0"> 否 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="password" label="初始密码" prop="password"> a12345678 </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js"
export default {
  name: "diverManagement",
  mixins: [mixins.TableMixins],
  data() {
    return {
      filter: {
        isNormal: undefined,
        phone: "",
        driverName: ""
      },
      stateOption: [
        { value: 1, label: "启用" },
        { value: 0, label: "停用" }
      ],
      fileList: [],
      operationTitle: "新增", // 新增司机
      greenHouseItem: [],
      default_green_house: [],
      driverForm: {
        phone: "",
        name: "",
        // green_house: [],
        create_account: 1
      },
      disabledPhone: false,
      id: "",
      operationVisible: false, // 新增/编辑对话框显示隐藏
      operationLoading: false, // 新增/编辑对话框加载状态
      rules: {
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名且长度不大于128", max: 128, trigger: "blur" }],
        green_house: [{ required: true, message: "请选择环保屋", trigger: "blur" }]
      }
    }
  },
  created() {
    this.getTableList(1)
  },

  methods: {
    // 搜索表格内容
    getTableList(page) {
      if (page) this.page = page
      console.log("this.filter", this.filter)
      let data = {
        isNormal: this.filter.isNormal != undefined ? this.filter.isNormal : "",
        phone: this.filter.phone || "",
        driverName: this.filter.driverName || "",
        pageNum: this.page
      }
      this.tableLoading = true
      this.$api.driverList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          item.state = item.isNormal === 1 ? true : false
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 切换开关
    ChangeState(record) {
      this.$api
        .upDriverState({ id: record.key, isNormal: record.state ? 1 : 0 })
        .then(res => {
          this.$message.success(res.msg)
          this.getTableList(1)
        })
        .catch(err => {
          record.state = !record.state
        })
    },
    // 环保屋选择下拉列表
    garbageHouseDropList() {
      this.greenHouseItem = []
      this.$api.garbageHouseDropList().then(res => {
        res.data.map(item => {
          this.greenHouseItem.push({
            value: item.id,
            label: item.houseName
          })
        })
      })
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
            .deleteDriver({ driverIds: that.selectedRowKeys })
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
    // 新增/编辑
    operation(type, item) {
      this.clearOperation()
      this.garbageHouseDropList()
      this.type = "add"
      this.operationTitle = "新增"
      this.disabledPhone = false
      if (type === "edit") {
        this.disabledPhone = true
        this.type = "edit"
        this.operationTitle = "编辑"
        // let hosueArr = item.garbageHouseId ? item.garbageHouseId.split(",") : []
        // let house = hosueArr.map(item => {
        //   return Number(item)
        // })
        this.id = item.id
        this.driverForm.phone = item.phone
        this.driverForm.name = item.driverName
        // this.driverForm.green_house = house
        this.driverForm.create_account = item.accountType ? 1 : 0
      }
      this.operationVisible = true
      this.$validator.resetFields(this)
    },

    // 新增/编辑确定
    operationOk() {
      let data = {
        isOpenAccount: this.driverForm.create_account || 0,
        phone: this.driverForm.phone || "",
        name: this.driverForm.name || ""
        // garbageHouseId: this.driverForm.green_house.join(",")
      }

      if (this.type === "edit") {
        data.id = this.id
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let api = this.type === "add" ? this.$api.saveDriver(data) : this.$api.updateDriver(data)
          api.then(res => {
            this.getTableList()
            this.$message.success(res.msg)
            this.operationVisible = false
          })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    },

    // 清除新增/编辑数据缓存
    clearOperation() {
      this.driverForm = {
        phone: "",
        name: "",
        green_house: [],
        create_account: 1
      }
    },
    // 下拉选择筛选过滤
    filterOption(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    },

    // 密码恢复
    resetPwd(item) {
      let that = this
      this.$confirm({
        title: "密码恢复",
        content: h => <div style="color:red;">确认恢复初始密码：a12345678</div>,
        onOk() {
          that.$api.resetPwd({ id: item.id }).then(res => {
            that.$message.success(res.msg)
          })
        },
        onCancel() {
          that.$message.info("取消")
        }
      })
    }
  }
}
</script>

<style scoped></style>
