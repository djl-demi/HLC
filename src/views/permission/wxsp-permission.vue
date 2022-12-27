<template>
  <div id="AppPermission">
    <TyPermission
      :tableLoading="tableLoading"
      :PermissionAdd="AppPermissionAdd"
      :PermissionEdit="AppPermissionEdit"
      :PermissionDel="AppPermissionDel"
      :edit="true"
      :sourceData="sourceData"
      @editOperation="editOperation"
    ></TyPermission>

    <TyPermissionOperation ref="TyPermissionOperation" :modalTitle="modalTitle" :form="form" @submit="submit"></TyPermissionOperation>
  </div>
</template>

<script>
import TyPermission from "@/components/ty-permission/ty-permission.vue"
import TyPermissionOperation from "@/components/ty-permission/ty-permission-operation.vue"

export default {
  name: "AppPermission",
  components: { TyPermission, TyPermissionOperation },
  data() {
    return {
      tableLoading: false,
      sourceData: [],
      modalTitle: "", // 对话框名称
      changePermission: false, // 新增/编辑对话框显示
      confirmLoading: false, // 新增/编辑对话框加载状态
      form: {
        name: "",
        key: "",
        icon: "",
        class: "",
        method: "",
        is_record: 1,
        level: 0,
        parent_id: 0
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
        icon: [{ required: true, message: "请输入Icon", trigger: "change" }],
        is_record: [{ required: true, message: "请选择是否记录", trigger: "change" }]
      }
    }
  },
  created() {
    console.log(this.AppPermissionSearch, "this.AppPermissionSearch")
    this.AppPermissionSearch && this.getTableList()
  },
  computed: {
    AppPermissionSearch() {
      return this.$com.getPermission(this.$route.matched, "AppPermissionSearch")
    },
    AppPermissionAdd() {
      return this.$com.getPermission(this.$route.matched, "AppPermissionAdd")
    },
    AppPermissionEdit() {
      return this.$com.getPermission(this.$route.matched, "AppPermissionEdit")
    },
    AppPermissionDel() {
      return this.$com.getPermission(this.$route.matched, "AppPermissionDel")
    }
  },
  methods: {
    // 获取数据
    getTableList() {
      this.tableLoading = true
      this.$api
        .getPermissionList({ sys: 2 })
        .then(res => {
          this.tableLoading = false
          this.sourceData = res.data.map((item, index) => {
            item.key = this.$utils.createUUID()
            return item
          })
        })
        .catch(() => {
          this.tableLoading = false
        })
    },

    // 操作
    editOperation(operation, row, level) {
      const id = level === 1 ? row.system_id : level === 2 ? row.one_module_id : level === 3 ? row.two_module_id : row.operation_id

      if (operation === "add") {
        this.modalTitle = "新增权限"
        this.form.level = level + 1
        this.form.parent_id = this.form.level === 1 ? 0 : this.form.level === 2 ? row.system_id : this.form.level === 3 ? row.one_module_id : row.two_module_id
        this.form.name = ""
        this.form.key = ""
        this.form.icon = ""
        this.form.class = ""
        this.form.method = ""
        this.form.is_record = 1
        this.$refs.TyPermissionOperation.changePermission = true
      }

      if (operation === "edit") {
        this.modalTitle = "编辑权限"
        this.$api.getPermissionDetail({ id }).then(res => {
          if (res.code === 200) {
            this.form.parent_id = level === 1 ? 0 : level === 2 ? row.system_id : level === 3 ? row.one_module_id : row.two_module_id
            this.form.level = level
            this.form.name = res.data.name
            this.form.id = res.data.id
            this.form.key = res.data.key
            this.form.icon = res.data.icon
            this.form.class = res.data.class
            this.form.method = res.data.method
            this.form.is_record = res.data.is_record
            console.log(this.form, "form")
          } else {
            this.$message.error({ content: res.msg })
          }
          this.$refs.TyPermissionOperation.changePermission = true
        })
      }

      if (operation === "del") {
        let that = this
        this.$confirm({
          title: "请确认",
          content: "确定删除该权限吗?",
          onOk() {
            that.$api
              .delPermission({ id })
              .then(res => {
                that.getTableList()
                that.$message.success({ content: res.msg })
              })
              .catch(err => {
                console.log(err.msg)
                // that.$message.error({ content: err.msg })
              })
          },
          onCancel() {
            that.$message.info({ content: "已取消" })
          }
        })
      }
    },

    // 权限新增/编辑 确定
    submit() {
      if (this.modalTitle === "新增权限") {
        if (this.form.id || this.form.id != undefined) {
          this.form.id = ""
        }
        this.form.system = 2
        this.$api
          .addPermission(this.form)
          .then(res => {
            this.$message.success({ content: res.msg })
            this.$refs.TyPermissionOperation.changePermission = false
            this.$refs.TyPermissionOperation.confirmLoading = false
            this.sourceData = []
            this.getTableList()
          })
          .catch(err => {
            this.$refs.TyPermissionOperation.confirmLoading = false
          })
      }

      if (this.modalTitle === "编辑权限") {
        this.form.system = 2
        this.$api
          .editPermission(this.form)
          .then(res => {
            this.$message.success({ content: res.msg })
            this.$refs.TyPermissionOperation.changePermission = false
            this.$refs.TyPermissionOperation.confirmLoading = false
            this.sourceData = []
            this.getTableList()
          })
          .catch(err => {
            this.$refs.TyPermissionOperation.confirmLoading = false
          })
      }
    }
  }
}
</script>

<style></style>
