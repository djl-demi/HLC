<template>
  <div id="ICManagement">
    <!-- IC卡管理 -->
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>设备状态：</span>
            <div class="dib"><a-select v-model="state" :options="states" placeholder="请输入设备状态" class="w200" allowClear /></div>
          </div>
          <div>
            <span>卡号：</span>
            <div class="dib"><a-input v-model="card_number" placeholder="请输入卡号" allowClear /></div>
          </div>
          <div>
            <span>姓名：</span>
            <div class="dib"><a-input v-model="user_name" placeholder="请输入姓名" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <a-space class="ctrl-bar">
          <a-upload name="file" :action="$com.importICcord()" :showUploadList="false" :headers="headers" @change="uploadFile">
            <a-button icon="upload">导入</a-button>
          </a-upload>
          <a-button icon="export" @click="trackExport">导出</a-button>
          <a href="/IC卡导入模板.xlsx" download="IC卡导入模板.xlsx">下载模板</a>
          <a-button type="primary" @click="add">新增</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-space direction="vertical" style="width: 100%">
            <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
            <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
              <a-table-column key="card_number" title="卡号" data-index="card_number" align="center" :ellipsis="true" />
              <a-table-column key="user_name" title="姓名" data-index="user_name" align="center" :ellipsis="true" />
              <a-table-column key="phone" title="联系方式" data-index="phone" align="center" :ellipsis="true" />
              <a-table-column key="state_text" title="设备状态" data-index="state_text" align="center" :ellipsis="true" />
              <a-table-column key="update_time" title="绑定时间" data-index="update_time" align="center" :ellipsis="true" />
              <a-table-column key="create_time" title="创建时间" data-index="create_time" align="center" :ellipsis="true" />
              <a-table-column title="操作" data-index="option" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
                  <a-button type="link" size="small" @click="bindingRecord(record.key)">绑定记录</a-button>
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
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" destroyOnClose @ok="handleOk" @cancel="visible = false" :maskClosable="false" :width="600">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="card_number" label="卡号：" prop="card_number" has-feedback>
          <a-input v-model="form.card_number" :disabled="disabledCard" placeholder="请输入卡号" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="user_id" label="绑定居民" prop="user_id" has-feedback>
          <!-- <a-select
            :value="form.user_id"
            :options="userNameData"
            style="width: 100%"
            placeholder="请选择姓名"
            allowClear
            show-search
            :filterOption="filteredOptions"
            @change="nameChange"
            @search="nameSearch"
            :disabled="form.state == 1 ? false : true"
          ></a-select> -->
          <a-select
            allowClear
            show-search
            placeholder="请选择姓名"
            v-model="form.user_id"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="nameSearch"
            @change="nameChange"
            :disabled="form.state == 1 ? false : true"
          >
            <a-select-option v-for="item in userNameData" :key="item.id">
              {{ item.user_name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="phone" label="联系方式：" prop="phone" has-feedback>
          <a-input v-model="form.phone" placeholder="请输入联系方式" :disabled="form.state == 1 ? false : true" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="state" label="设备状态" prop="state" class="flex-center">
          <a-radio-group name="state" v-model="form.state">
            <a-radio :value="1"> 正常 </a-radio>
            <a-radio :value="2" v-if="modelTitle == '编辑'"> 挂失 </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js"
export default {
  name: "ICManagement",
  mixins: [mixins.TableMixins],
  components: {},
  data() {
    return {
      //上传文件请求头
      headers: {
        authorization: "authorization-text"
      },
      user_name: "",
      card_number: "",
      state: undefined,
      states: [
        { value: "1", label: "正常" },
        { value: "2", label: "挂失" }
      ],
      previewVisible: false,
      modelTitle: "新增",
      visible: false, //弹窗显示
      confirmLoading: false,

      form: {
        card_number: "",
        user_name: undefined,
        phone: "",
        state: "",
        user_id: undefined
      },
      disabledCard: false,
      rules: {
        card_number: [{ required: true, message: "请输入卡号", trigger: "blur" }],
        // user_name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        // phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        state: [{ required: true, message: "请选择设备状态", trigger: "blur" }]
      },
      userNameData: []
    }
  },
  created() {
    //获取列表
    this.getTableList()
  },
  methods: {
    getTableList(page) {
      if (page) this.page = page
      const data = {
        state: this.state || "",
        card_number: this.card_number || "",
        user_name: this.user_name || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getICManagementList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 姓名搜索
    nameSearch(value) {
      console.log(value, "value")
      if (value !== "") {
        this.$api.getUserInfoDetail({ user_name: value }).then(res => {
          console.log(res, "res")
          this.userNameData = res.data
        })
      } else {
        this.form.user_id = ""
      }
    },
    // nameChange(data) {
    //   console.log(data, "dada")
    //   this.form.user_id = data
    //   this.userNameData.filter((e) => {
    //     if (e.value === data) {
    //       this.form.user_name = e.label
    //       this.form.user_id = e.value
    //       this.form.phone = e.phone
    //     }
    //   })
    // },
    // filteredOptions(value, option) {
    //   return option.componentOptions.children[0].text.indexOf(value) >= 0
    // },

    // 姓名选择
    nameChange(e) {
      this.userNameData.forEach(item => {
        if (item.id === e) {
          this.form.user_name = item.user_name
          this.form.phone = item.phone
        }
      })
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
    //导出
    trackExport() {
      let state = this.state || ""
      let card_number = this.card_number || ""
      let user_name = this.user_name || ""
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/ic/card/export?token=${token}&state=${state}&card_number=${card_number}&user_name=${user_name}`)
    },

    // 新增
    add() {
      this.form = {
        card_number: "",
        user_name: "",
        phone: "",
        state: 1,
        user_id: undefined
      }
      // this.userNameData = []
      this.visible = true
      this.modelTitle = "新增"
      this.disabledCard = false
    },

    // 编辑
    edit(record) {
      this.visible = true
      this.modelTitle = "编辑"
      this.disabledCard = true
      this.$api.viewICManagement({ id: record.id }).then(res => {
        this.form.card_number = res.data.card_number
        this.form.user_name = res.data.user_name
        this.form.phone = res.data.phone
        this.form.state = res.data.state_text === "正常" ? 1 : 2
        this.form.id = res.data.id
        if (res.data.user_id == "") {
          res.data.user_id = undefined
          this.form.user_id = res.data.user_id
        } else {
          this.$api.getUserInfoDetail({ user_name: this.form.user_name }).then(res => {
            if (res.data.length > 0) {
              this.userNameData = res.data
              this.form.user_id = res.data[0].id
            } else {
              this.userNameData = []
              this.form.user_id = undefined
            }
          })
        }
      })
    },

    // 绑定记录
    bindingRecord(key = "") {
      this.$router.push({
        name: "bindingRecord",
        query: { id: key }
        // params: { data: oneData[0] }
      })
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
            .delICManagement({ id: that.selectedRowKeys })
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
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.form.user_name == "" || this.form.user_id == undefined) this.form.user_id = ""
          ;(this.modelTitle === "新增" ? this.$api.addICManagement(this.form) : this.$api.editICManagement(this.form))
            .then(res => {
              this.confirmLoading = false
              this.$message.success(res.msg)
              this.visible = false
              this.getTableList()
            })
            .catch(err => {
              this.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
#ICManagement {
  width: 100%;
}
</style>
