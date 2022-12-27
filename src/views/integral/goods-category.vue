<template>
  <div id="GoodsCategoryList">
    提醒管理
  </div>
</template>

<script>
export default {
  name: "GoodsCategoryList",
  data() {
    return {
      dataSource: [], //品类列表
      tableLoading: false,
      total: 1,
      page: 1,
      modelTitle: "新增品类",
      visible: false,
      OperateVisible: false, // 弹窗
      confirmLoading: false,
      form: {
        type_name: "",
        state: 1
      },
      rules: {
        type_name: [{ required: true, message: "请输入品类名称", trigger: "change" }]
      }
    }
  },
  created() {
    // this.getTableList()
  },
  methods: {
    // 获取品类列表
    getTableList() {
      this.tableLoading = true
      this.$api.goodsCategory({ page: this.page }).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          item.state = item.state == 1 ? true : false
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    // 切换状态
    switchChange(record) {
      let data = {
        id: record.id,
        state: record.state ? 1 : 2
      }
      this.$api.goodsCategoryState(data).then(res => {
        this.$message.info(res.msg)
      })
    },

    // 新增
    add() {
      this.OperateVisible = true
      this.modelTitle = "新增品类"
      this.form.type_name = ""
      this.form.state = 1
    },

    // 编辑
    edit(id) {
      this.OperateVisible = true
      this.modelTitle = "编辑品类"
      this.$api.goodsCategoryDetail({ id }).then(res => {
        this.form.type_name = res.data.type_name
        this.form.id = res.data.id
        this.form.state = res.data.state
      })
    },
    // 弹窗确定
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          ;(this.modelTitle === "新增品类" ? this.$api.goodsCategoryAdd(this.form) : this.$api.goodsCategoryEdit(this.form))
            .then(res => {
              this.confirmLoading = false
              this.$message.success(res.msg)
              this.OperateVisible = false
              this.getTableList()
            })
            .catch(err => {
              this.confirmLoading = false
            })
        }
      })
    },

    // 删除物品
    del(id, name) {
      let that = this
      this.$confirm({
        content: `确定删除该品类'` + name + `'吗？`,
        onOk() {
          that.$api.goodsCategoryDel({ id }).then(res => {
            that.getTableList()
            that.$message.success(res.msg)
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
#CategoryList {
  .img {
    height: 24px;
  }
}
.upImg {
  width: 100px;
  height: 100px;
}
</style>
