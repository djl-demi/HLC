<template>
  <div id="BusinessManagement">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="fl" size="middle">
          <div>
            <span>名称：</span>
            <!-- 模糊搜索 -->
            <div class="dib"><a-input v-model="merchant_name" placeholder="请输入名称" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <a-space class="fr">
          <a-button type="primary" icon="plus" @click="add">新增</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="merchant_name" title="名称" data-index="merchant_name" align="center" :ellipsis="true" />
            <a-table-column key="region" title="地址" data-index="region" align="center" :ellipsis="true" />
            <a-table-column key="contacts" title="联系人" data-index="contacts" align="center" :ellipsis="true" />

            <a-table-column key="phone" title="电话" data-index="phone" align="center" :ellipsis="true" />
            <a-table-column key="line_of_business" title="业务范围" data-index="line_of_business" align="center" :ellipsis="true" />

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
    </a-space>
    <!-- 新增编辑弹窗 -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" destroyOnClose @cancel="handleCancel" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="merchant_name" label="名称：" prop="merchant_name" has-feedback>
          <a-input v-model="form.merchant_name" placeholder="请输入名称" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="region" label="所属区域：" prop="region" has-feedback>
          <TyAreaCascader :model="form.region" @change="areaChange" placeholder="请选择所属区域"></TyAreaCascader>
        </a-form-model-item>
        <a-form-model-item ref="address" label="详细地址：" prop="address" has-feedback>
          <a-input v-model="form.address" placeholder="请输入详细地址" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="contacts" label="联系人" prop="contacts" class="flex-center">
          <a-input v-model="form.contacts" placeholder="请输入姓名" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="phone" label="联系电话：" prop="phone">
          <a-input v-model="form.phone" placeholder="请输入联系电话" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="line_of_business" label="业务范围：" prop="line_of_business">
          <a-input v-model="form.line_of_business" placeholder="请输入业务范围" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import TyAreaCascader from "@/components/ty-area-cascader/ty-area-cascader.vue"
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "BusinessManagement",
  components: {
    TyAreaCascader
  },
  data() {
    return {
      merchant_name: "",
      dataSource: [],
      // area_id:"",

      tableLoading: false,
      total: 1,
      page: 1,

      //弹窗相关
      modelTitle: "新增商家管理",
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        merchant_name: "",
        province_id: 0,
        city_id: 0,
        area_id: 0,
        region: undefined,
        address: "",
        contacts: "",
        phone: "",
        line_of_business: ""
      },
      rules: {
        merchant_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        region: [{ required: true, message: "请选择所属区域", trigger: "blur" }],
        address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
        contacts: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }]
      }
    }
  },
  created() {
    //获取列表
    this.getTableList()
  },
  methods: {
    // 获取商家管理列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        merchant_name: this.merchant_name || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getBusinessManagementList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          item.region = `${item.province_name}${item.city_name}${item.area_name}${item.address}`
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    // 省市区选择返回值
    areaChange(e, name) {
      this.areaCascaderArea = name
      this.form.region = e
      this.form.province_id = e[0] || 0
      this.form.city_id = e[1] || 0
      this.form.area_id = e[2] || 0
    },
    // 新增
    add() {
      this.form = {
        province_id: 0,
        city_id: 0,
        area_id: 0,
        region: undefined,
        merchant_name: "",
        address: "",
        contacts: "",
        phone: "",
        line_of_business: ""
      }
      this.visible = true
      this.modelTitle = "新增商家管理"
      this.$validator.resetFields(this)
    },

    // 编辑
    edit(e) {
      this.form = {}
      this.visible = true
      this.modelTitle = "编辑商家管理"
      this.form = this.$utils.deepCopy(e)
      this.form.region = [this.form.province_id, this.form.city_id, this.form.area_id]
      this.$validator.resetFields(this)
    },
    // 弹窗确定
    handleOk() {
      // this.visible = false
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          ;(this.modelTitle === "新增商家管理" ? this.$api.addBusinessManagement(this.form) : this.$api.editBusinessManagement(this.form, this.id))
            .then(res => {
              this.confirmLoading = false
              this.$message.success(res.msg)
              this.visible = false
              this.getTableList()
              this.form = {
                province_id: 0,
                city_id: 0,
                area_id: 0,
                region: undefined,
                merchant_name: "",
                address: "",
                contacts: "",
                phone: "",
                line_of_business: ""
              }
            })
            .catch(() => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    },
    // 弹窗取消
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style lang="less">
// #BusinessManagement {
// }
</style>
