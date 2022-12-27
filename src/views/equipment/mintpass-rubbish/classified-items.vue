<template>
  <div id="ClassifiedItems">
    <TyReturn></TyReturn>
    <div>
      <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
        <a-table-column title="垃圾类型" data-index="categoryName" align="center" :ellipsis="true" />
        <a-table-column title="物品名称" data-index="goodsName" align="center" :ellipsis="true" />
        <a-table-column title="单价(积分)" data-index="integralPrice" align="center" :ellipsis="true" />
        <a-table-column title="单次投放量(kg)" data-index="weight" align="center" :ellipsis="true" />
        <a-table-column title="操作" data-index="operation" align="center" :width="250" :ellipsis="true">
          <template slot-scope="text, record">
            <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
          </template>
        </a-table-column>
      </a-table>
      <div class="flex-center mt30">
        <a-pagination v-model="page" show-quick-jumper :total="total" @change="getTableList()" />
      </div>
    </div>

    <!-- 新增编辑弹窗 -->
    <a-modal title="编辑" :visible="visible" :confirm-loading="confirmLoading" destroyOnClose @ok="handleOk" @cancel="visible = false" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5, offset: 1 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="categoryName" label="垃圾类型：" prop="categoryName" has-feedback>
          <a-input v-model="form.categoryName" disabled />
        </a-form-model-item>
        <a-form-model-item ref="goodsName" label="物品名称：" prop="goodsName" has-feedback>
          <a-input v-model="form.goodsName" disabled />
        </a-form-model-item>
        <a-form-model-item ref="weight" label="单次投放量：" prop="weight" has-feedback>
          <a-input-number v-model="form.weight" style="width: 315px;" :min="0" placeholder="请输入单次投放量" suffix="kg" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js"
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  name: "ClassifiedItems",
  mixins: [mixins.TableMixins],
  components: { TyReturn },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: {
        categoryName: "",
        goodsName: "",
        weight: ""
      },
      rules: {
        weight: [{ required: true, message: "请输入投放量", trigger: "blur" }]
      }
    }
  },

  created() {
    this.getTableList()
  },

  methods: {
    // 列表
    getTableList() {
      this.tableLoading = true
      this.$api.getClassifiedItemsList({ pageNum: this.page }).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 编辑
    edit(record) {
      this.visible = true
      this.form = this.$utils.deepCopy(record)
    },

    // 编辑确定
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          this.$api
            .putClassifiedItems(this.form)
            .then(res => {
              this.confirmLoading = false
              this.$message.success(res.msg)
              this.visible = false
              this.getTableList()
            })
            .catch(err => {
              this.confirmLoading = false
            })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    }
  }
}
</script>
