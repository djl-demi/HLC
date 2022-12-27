<template>
  <div id="ActivityRelease">
    充放任务准备--功率匹配
  </div>
</template>

<script>
export default {
  name: "ActivityRelease",
  data() {
    return {
      activity_name: "",
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,
      previewVisible: false,
      modelTitle: "新增",
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        activity_name: "",
        start_time: null,
        end_time: null,
        pic_url: "",
        chained_address: ""
      },
      previewImage: "",
      imgLoading: false,
      imageUrl: "", //  二进制图片流
      value: [],
      rules: {
        activity_name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        start_time: [{ required: true, message: "请选择开始时间", trigger: "change" }],
        end_time: [{ required: true, message: "请选择结束时间", trigger: "change" }],
        pic_url: [{ required: true, trigger: "blur" }],
        chained_address: [{ required: true, message: "请输入链接地址", trigger: "blur" }]
      }
    }
  },
  created() {
    // this.getTableList()
  },
  methods: {
    // 获取物品列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        activity_name: this.activity_name || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getActivityManageList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    //  上线
    onLine(id, activity_name) {
      let that = this
      that.$confirm({
        title: "上线",
        content: '是否确认上线活动"' + activity_name + '" ?',
        onOk() {
          that.$api.issueActivityManage({ id }).then(res => {
            if (res.code == 200) {
              that.$message.success(res.msg)
              that.getTableList()
            }
          })
        },
        onCancel() {}
      })
    },
    // 下线
    offLine(id, activity_name) {
      let that = this
      that.$confirm({
        title: "下线",
        content: '是否确认下线活动"' + activity_name + '" ?',
        onOk() {
          that.$api.offlineActivityManage({ id }).then(res => {
            if (res.code == 200) {
              that.$message.success(res.msg)
              that.getTableList()
            }
          })
        },
        onCancel() {}
      })
    },
    // 新增
    add() {
      this.visible = true
      this.modelTitle = "新增"
      this.form = {
        activity_name: "",
        start_time: "",
        end_time: "",
        pic_url: "",
        chained_address: ""
      }
    },

    // 编辑
    edit(id) {
      this.visible = true
      this.modelTitle = "编辑"
      this.$api.viewActivityManage({ id }).then(res => {
        this.form.activity_name = res.data.activity_name
        this.form.activity_no = res.data.activity_no
        this.form.start_time = this.$moment(res.data.start_time) || undefined
        this.form.end_time = this.$moment(res.data.end_time) || undefined
        this.form.state_text = res.data.state_text
        this.form.chained_address = res.data.chained_address
        this.form.id = res.data.id
        if (res.data.pic_url) this.form.pic_url = res.data.pic_url
      })
    },

    // 弹窗确定
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = {
            activity_name: this.form.activity_name || "",
            start_time: this.form.start_time ? this.$moment(this.form.start_time).format("YYYY-MM-DD HH:mm:ss") : null,
            end_time: this.form.end_time ? this.$moment(this.form.end_time).format("YYYY-MM-DD HH:mm:ss") : null,
            pic_url: this.form.pic_url || "",
            chained_address: this.form.chained_address || ""
          }
          // console.log(data, "data")

          this.confirmLoading = true
          ;(this.modelTitle === "新增" ? this.$api.addActivityManage(data) : this.$api.editActivityManage({ ...data, id: this.form.id }))
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
    },
    // 表格删除
    deleteData(id, activity_name) {
      let that = this
      this.$confirm({
        title: "删除",

        content: '是否确认删除活动"' + activity_name + '" ?',
        onOk() {
          that.$api.delActivityManage({ id }).then(res => {
            if (res.code == 200) {
              that.$message.success(res.msg)
              that.getTableList()
            }
          })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },

    // 列表查看图片
    showPicture(picture_url = "") {
      this.previewImage = this.$com.showUpload() + picture_url
      this.previewVisible = true
    },

    // 图片预览
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$utils.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || this.$com.showUpload() + file.response.data.pic_url
      this.previewVisible = true
    },

    // 图片change
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.imgLoading = true
        return
      }
      if (info.file.status === "done") {
        this.form.pic_url = info.file.response.data.pic_url
        this.imgLoading = false
      } else {
        this.form.pic_url = ""
      }
    }

    // // 发布
    // release(id) {
    //   let that = this
    //   this.$confirm({
    //     title: "请确认",
    //     content: "是否确定发布此活动?",
    //     onOk() {
    //       that.tableLoading = true
    //       that.$api
    //         .issueActivityManage({ id })
    //         .then(res => {
    //           that.tableLoading = false
    //           that.getTableList()
    //           that.$message.success(res.msg)
    //         })
    //         .catch(err => {
    //           that.tableLoading = false
    //           that.$message.error(err.msg)
    //         })
    //     },
    //     onCancel() {
    //       that.$message.info("已取消")
    //     }
    //   })
    // }
  }
}
</script>

<style lang="less">
#ActivityRelease {
  .img {
    height: 24px;
  }
}
.upImg {
  width: 100px;
  height: 100px;
}
</style>
