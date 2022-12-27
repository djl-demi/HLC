<template>
  <div id="ClassifiedQandA">
    充放任务执行--slice调度
  </div>
</template>

<script>
export default {
  name: "ClassifiedQandA",
  data() {
    return {
      classification_name: "",
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,
      previewVisible: false,
      modelTitle: "新增",
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        classification_name: "",
        classification_info: "",
        should_start_time: null,
        should_end_time: null,
        classification_detail: [
          {
            type: undefined,
            score: "",

            uuid: "",
            fileList: [],
            fileLoading: false
          }
        ]
      },

      type_text: [
        { label: "选择题", value: 1 },
        { label: "判断题", value: 2 }
      ],
      rules: {
        classification_name: [{ required: true, message: "请输入答题名称", trigger: "blur" }],
        should_start_time: [{ required: true, message: "请选择预计开始时间", trigger: "change" }],
        should_end_time: [{ required: true, message: "请选择预计结束时间", trigger: "change" }],
        classification_info: [{ required: true, message: "请输入答题说明", trigger: "blur" }]
      },
      typeRule: [{ required: true, message: "请选择题库类型", trigger: "change" }],
      scoreRule: [{ required: true, message: "请输入积分数", trigger: "blur" }],
      fileRule: [{ required: true, message: "请选择上传文件", trigger: "change" }],
      disabled: false,
      visibleTemplate: false, //模板弹窗
      loading: false
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
        classification_name: this.classification_name || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getClassificationList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    download() {
      this.visibleTemplate = true
    },
    handleClose() {
      this.visibleTemplate = false
    },
    //删除 上线 下线
    dealDate(options, id, classification_name) {
      let that = this
      if (options === "onLine") {
        that.$confirm({
          title: "上线",
          content: '是否确认上线题目"' + classification_name + '" ?',
          onOk() {
            that.$api.dealClassification({ id, state: 2 }).then(res => {
              if (res.code == 200) {
                that.$message.success(res.msg)
                that.getTableList()
              }
            })
          },
          onCancel() {}
        })
      }
      if (options === "offLine") {
        that.$confirm({
          title: "下线",
          content: '是否确认下线题目"' + classification_name + '" ?',
          onOk() {
            that.$api.dealClassification({ id, state: 3 }).then(res => {
              if (res.code == 200) {
                that.$message.success(res.msg)
                that.getTableList()
              }
            })
          },
          onCancel() {}
        })
      }
      if (options === "delete") {
        that.$confirm({
          title: "删除",
          content: '是否确认删除题目"' + classification_name + '" ?',
          onOk() {
            that.$api.dealClassification({ id, state: 0 }).then(res => {
              if (res.code == 200) {
                that.$message.success(res.msg)
                that.getTableList()
              }
            })
          },
          onCancel() {}
        })
      }
    },

    viewDetail(key = "") {
      this.$router.push({
        name: "QandADetail",
        query: { id: key }
      })
    },
    // 新增题库
    addWorker() {
      this.form.classification_detail.push({
        type: undefined,
        score: "",
        uuid: "",
        fileList: [],
        fileLoading: false
      })
    },
    // 删除题库
    removeWorker(index) {
      this.form.classification_detail.splice(index, 1)
    },
    handleRemove(file, item) {
      const index = item.fileList.indexOf(file)
      const newFileList = item.fileList.slice()
      newFileList.splice(index, 1)
      item.fileList = newFileList
    },
    beforeUpload(file, item) {
      if (item.fileList.length === 0) {
        this.disabled = false
        item.fileLoading = false
        item.fileList = [...item.fileList, file]
      } else {
        this.disabled = true
        // this.$message.error("一次上传一个文件")
        this.fileLoading = false
        return false
      }
    },

    changeFile(info, item) {
      console.log(info, "info")
      console.log(item, "itemitem")

      // 上传文件
      if (info.file.status === "uploading") {
        item.fileLoading = true
        return
      }
      if (info.file.status === "done") {
        console.log(info, "info")
        this.$message.success(`文件上传成功`)
        this.form.classification_detail.forEach(item => {
          item.uuid = info.file.response.data.uuid
        })
        item.fileLoading = false
      } else if (info.file.status === "error") {
        this.$message.error(`文件上传失败.`)
        item.fileLoading = false
      }
    },
    // 新增
    add() {
      this.visible = true
      this.modelTitle = "新增"
      this.form = {
        classification_name: "",
        classification_info: "",
        should_start_time: "",
        should_end_time: "",
        classification_detail: [{ type: undefined, score: "", uuid: "", fileList: [], fileLoading: false }]
      }
    },
    // 编辑
    edit(id) {
      this.visible = true
      this.modelTitle = "编辑"
      this.$api.viewClassification({ id }).then(res => {
        this.form.classification_name = res.data.classification_name
        this.form.classification_info = res.data.classification_info
        this.form.should_start_time = this.$moment(res.data.should_start_time) || undefined
        this.form.should_end_time = this.$moment(res.data.should_end_time) || undefined
        this.form.id = res.data.id
        this.form.classification_detail = res.data.classification_detail.map(item => {
          item.fileList = [
            {
              uid: item.uuid,
              name: item.file_name,
              status: "done"
            }
          ]
          return item
        })
      })
    },

    // 弹窗确定
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = {
            classification_name: this.form.classification_name || "",
            should_start_time: this.form.should_start_time ? this.$moment(this.form.should_start_time).format("YYYY-MM-DD HH:mm:ss") : "",
            should_end_time: this.form.should_end_time ? this.$moment(this.form.should_end_time).format("YYYY-MM-DD HH:mm:ss") : "",
            classification_info: this.form.classification_info || "",
            classification_detail: this.form.classification_detail || []
          }

          this.confirmLoading = true
          ;(this.modelTitle === "新增" ? this.$api.addClassification(data) : this.$api.editClassification({ ...data, id: this.form.id }))
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

<style lang="less" scope>
#ClassifiedQandA {
  .img {
    height: 24px;
  }
}
.upImg {
  width: 100px;
  height: 100px;
}
.muban {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
}
form .ant-select,
form .ant-cascader-picker {
  width: 85%;
}
.dynamic-delete-button {
  position: absolute;
  top: -8px;
  right: -50px;
  font-size: 20px;
}
.img {
  display: block;
  margin: 10px 13px;
}
</style>
