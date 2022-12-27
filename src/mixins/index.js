// 表格混入
const TableMixins = {
  data() {
    return {
      dataSource: [], // 表格数据
      delLoading: false, // 删除按钮加载状态
      tableLoading: false, // 表格加载状态
      selectedRowKeys: [], // 表格多选数组
      total: 1, // 表格总数
      page: 1 // 表格页数
    }
  },
  computed: {
    // 表格多选
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    // 表格选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}

export default { TableMixins }
