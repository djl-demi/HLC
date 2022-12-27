<template>
  <div id="WarehouseManagement">
    报警管理
  </div>
</template>

<script>
export default {
  name: "WarehouseManagement",
  components: {},
  data() {
    return {
      name: "",
      account_name: "",
      account_phone: "",
      type: undefined,
      optionType: [
        { value: 1, label: "总仓" },
        { value: 2, label: "分仓" }
      ],
      selectedRowKeys: [],
      dataSource: [],
      tableLoading: false,
      delLoading: false,
      total: 1,
      page: 1,
      warehouseTitle: "新增仓库",
      warehouseVisible: false,
      confirmLoading: false,
      accountList: [],
      delWarehouse: false,
      form: {
        name: "",
        account_id: undefined,
        account_name: undefined,
        area_id: undefined,
        region: [],
        address: "",
        type: 1
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        account_id: [{ required: true, message: "请选择管理员", trigger: "change" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        region: [{ required: true, message: "请选择所属区域", trigger: "change" }],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }]
      }
    }
  },
  created() {
    //获取列表
    // this.getTableList()
    // this.$com.getAccountName(this, "accountList") // 管理员
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    // 表格选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 获取库存列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        name: this.name || "",
        account_name: this.account_name || "",
        account_phone: this.account_phone || "",
        type: this.type || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getWarehouseList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.type = item.type === 1 ? "总仓" : "分仓"
          item.region = [item.province_name, item.city_name, item.area_name]
          item.key = item.id
          return item
        })

        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
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
            .delWarehouse({ id: that.selectedRowKeys })
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
    // 省市区选择返回值
    areaChange(e, name) {
      this.areaCascaderArea = name
      this.form.region = e
      this.form.province_id = e[0] || 0
      this.form.city_id = e[1] || 0
      this.form.area_id = e[2] || 0
    },

    add() {
      this.form = {
        name: "",
        account_id: undefined,
        area_id: undefined,
        region: [],
        address: "",
        type: 1
      }
      this.warehouseTitle = "新增仓库"
      this.warehouseVisible = true
    },
    changeAccount(data) {
      console.log(data)
      this.form.account_id = data
      this.accountList.filter(e => {
        if (e.value === data) {
          this.form.account_name = e.label
        }
      })
    },
    filteredOptions(value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0
    },
    edit(record) {
      console.log(record, "record")
      this.warehouseVisible = true
      this.warehouseTitle = "编辑仓库"
      this.$api.warehouseDetail({ id: record.id }).then(res => {
        this.form.type = res.data.type
        this.form.name = res.data.name
        this.form.address = res.data.address
        this.form.account_id = res.data.account_id
        this.form.region = [res.data.province_id, res.data.city_id, res.data.area_id]
        this.form.id = res.data.id
      })
    },

    // 确定新增/编辑账号
    warehouseOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let form = this.$utils.deepCopy(this.form)
          console.log(this.form, "this.form")
          this.confirmLoading = true
          ;(this.warehouseTitle === "新增仓库" ? this.$api.addWarehouse(form) : this.$api.editWarehouse(form))
            .then(res => {
              this.$message.success(res.msg)
              this.confirmLoading = false
              this.getTableList()
              this.warehouseVisible = false
            })
            .catch(() => {
              this.confirmLoading = false
            })
        }
      })
    },

    // 取消 新增/编辑账号
    warehouseCancel() {
      this.warehouseVisible = false
    }
  }
}
</script>

<style lang="less">
#GiftInventory {
  .img {
    height: 24px;
  }
}
</style>
