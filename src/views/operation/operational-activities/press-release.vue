<template>
  <div id="PressRelease">
    充放任务准备--调度策略
  </div>
</template>

<script>
export default {
  name: "PressRelease",
  data() {
    return {
      headline: "",
      state: undefined,
      dataSource: [],
      tableLoading: false,
      state_option: [
        { value: 1, label: "待上线" },
        { value: 2, label: "已上线" },
        { value: 3, label: "已下线" }
      ],
      total: 1,
      page: 1,
      previewVisible: false,
      modelTitle: "新增",
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        headline: "",
        synopsis: "",
        pic_url: "",
        content: ""
      },
      editorOption: {
        placeholder: "请输入内容..."
      },
      previewImage: "",
      imgLoading: false,
      imageUrl: "", //  二进制图片流
      value: [],
      rules: {
        headline: [{ required: true, message: "请输入标题", trigger: "blur" }],
        synopsis: [{ required: true, message: "请输入简介内容", trigger: "blur" }],
        pic_url: [{ required: true, message: "请选择宽大于高的图片", trigger: "change" }],
        content: [{ required: true, message: "请输入内容", trigger: "change" }]
      }
    }
  },
  created() {
    // this.getTableList()
  },
  computed: {
    // editor() {
    //   return this.$refs.myQuillEditor.quill
    // }
  },
  mounted() {},
  methods: {
    // 获取物品列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        headline: this.headline || "",
        state: this.state || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getNewManageList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    //  上线
    onLine(id, headline) {
      let that = this
      that.$confirm({
        title: "上线",
        content: '是否确认上线新闻"' + headline + '" ?',
        onOk() {
          that.$api.onlineNewManage({ id }).then(res => {
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
    offLine(id, headline) {
      let that = this
      that.$confirm({
        title: "下线",
        content: '是否确认下线新闻"' + headline + '" ?',
        onOk() {
          that.$api.offlineNewManage({ id }).then(res => {
            if (res.code == 200) {
              that.$message.success(res.msg)
              that.getTableList()
            }
          })
        },
        onCancel() {}
      })
    },
    //
    onEditorChange({ quill, html, text }) {
      console.log(quill, "quill")
      console.log(html, "html")
      console.log(text, "text")
    },

    // 新增
    add() {
      this.visible = true
      this.modelTitle = "新增"
      this.form = {
        headline: "",
        synopsis: "",
        content: "",
        pic_url: ""
      }
    },

    // 编辑
    edit(id) {
      this.visible = true
      this.modelTitle = "编辑"
      this.$api.viewNewManage({ id }).then(res => {
        this.form.headline = res.data.headline
        this.form.synopsis = res.data.synopsis
        this.form.content = res.data.content
        this.form.id = res.data.id
        if (res.data.pic_url) this.form.pic_url = res.data.pic_url
      })
    },

    // 弹窗确定
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = {
            headline: this.form.headline || "",
            synopsis: this.form.synopsis || "",
            content: this.form.content || "",
            pic_url: this.form.pic_url || ""
          }
          this.confirmLoading = true
          ;(this.modelTitle === "新增" ? this.$api.addNewManage(data) : this.$api.editNewManage({ ...data, id: this.form.id }))
            .then(res => {
              this.confirmLoading = false
              this.$message.success(res.msg)
              this.visible = false
              this.getTableList()
            })
            .catch(err => {
              this.$message.error("图片总大小不能超过800kb")
              this.confirmLoading = false
            })
        }
      })
    },
    // 表格删除
    deleteData(id, headline) {
      let that = this
      this.$confirm({
        title: "删除",
        content: '是否确认删除活动"' + headline + '" ?',
        onOk() {
          that.$api.delNewManage({ id }).then(res => {
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
      console.log(info, "infooo")
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
    },
    beforeUpload(file) {
      console.log("beforeUpload中：", file)
      const isLt2M = file.size / 1024 / 1024 < 4
      if (!isLt2M) {
        this.$message.error("图片应小于 4MB!")
        return false
      }

      let reader = new FileReader()
      console.log("reader", reader)
      reader.readAsDataURL(file)
      // console.log("reader.readAsDataURL(file)", reader.readAsDataURL(file))
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result
        image.onload = () => {
          let w = image.width
          let h = image.height
          console.log("宽高：", w, h)
          if (w < h) {
            this.$message.error("请选择宽大于高的图片")
            return false
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scope>
#PressRelease {
  .img {
    height: 24px;
  }
}
.upImg {
  width: 100px;
  height: 100px;
}

.ql-toolbar.ql-snow + .ql-container.ql-snow {
  overflow-y: auto !important;
  height: 200px;
}
.ql-snow .ql-picker {
  line-height: 24px !important;
}
</style>
