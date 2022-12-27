<template>
  <div id="WeightSetting">
    <TyReturn></TyReturn>
    <a-space class="fr">
      <a-button type="primary" icon="plus" @click="add">新增</a-button>
    </a-space>
    <a-space direction="vertical" style="width: 100%">
      <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
        <a-table-column title="垃圾类型" data-index="garbage_type_name" align="center" :ellipsis="true" />
        <a-table-column title="垃圾名称" data-index="garbage_name" align="center" :ellipsis="true" />
        <a-table-column title="单次投放重量（kg)" data-index="weight" align="center" :ellipsis="true" />
        <a-table-column title="操作" data-index="option" align="center" :ellipsis="true">
          <template slot-scope="text, record">
            <a-button type="link" size="small" @click="edit(record.key)">编辑</a-button>
          </template>
        </a-table-column>
      </a-table>
      <div class="flex-center mt30">
        <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
      </div>
    </a-space>
    <!-- 新增编辑弹窗 -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" destroyOnClose @ok="handleOk" @cancel="visible = false" :maskClosable="false">
      <a-form-model ref="ruleWeightForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="garbage_type" label="垃圾类型：" prop="garbage_type" has-feedback>
          <a-select v-model="form.garbage_type" :options="garbageTypes" placeholder="请选择垃圾类型" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="garbage_name" label="垃圾名称：" prop="garbage_name" has-feedback>
          <a-input v-model="form.garbage_name" placeholder="请输入垃圾名称" allowClear />
        </a-form-model-item>
        <a-form-model-item label="单次投放量" ref="weight" prop="weight"><a-input-number v-model="form.weight" placeholder="请输入投放量" /><span class="ant-form-text"> / kg</span></a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  components: { TyReturn },
  name: "WeightSetting",
  data() {
    return {
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,
      modelTitle: "新增",
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        garbage_type: undefined,
        garbage_name: "",
        weight: 0
      },
      garbageTypes: [
        { value: 1, label: "可回收垃圾" },
        { value: 2, label: "厨余垃圾" },
        { value: 3, label: "有害垃圾" },
        { value: 4, label: "其他垃圾" }
      ],

      value: [],
      rules: {
        garbage_type: [{ required: true, message: "请选择垃圾类型", trigger: "change" }],
        weight: [{ required: true, message: "请输入单次投放量", trigger: "blur" }]
      }
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    // 获取物品列表
    getTableList() {
      this.tableLoading = true
      this.$api.getGoodsWeightList({ page: this.page }).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 新增
    add() {
      this.resetForm()
      this.visible = true
      this.modelTitle = "新增"
    },
    setUp() {
      this.$router.push({
        name: "WeightSetting"
      })
    },

    // 编辑
    edit(id) {
      this.resetForm()
      this.visible = true
      this.modelTitle = "编辑"
      this.$api.detailWeight({ id }).then(res => {
        console.log(res.data)
        this.form.garbage_name = res.data.garbage_name
        this.form.weight = res.data.weight
        this.form.id = res.data.id
        this.form.garbage_type = res.data.garbage_type
      })
    },

    resetForm() {
      if (this.form.integral_price === null) {
        this.form.integral_price = 0
      }
      if (this.form.cash_price === null) {
        this.form.cash_price = 0
      }
      this.form = {
        garbage_name: "",
        weight: "",
        garbage_type: undefined
      }
    },

    // 弹窗确定
    handleOk() {
      if (this.form.unit === "其他") {
        this.form.unit = this.form.otherUnit
      }
      this.$refs.ruleWeightForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          ;(this.modelTitle === "新增" ? this.$api.postWeight(this.form) : this.$api.putWeight(this.form))
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

<style lang="less">
#WeightSetting {
}
</style>
