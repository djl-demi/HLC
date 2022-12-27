<template>
  <div id="CategoryList">
    <a-space class="fr">
      <a-button type="primary" icon="plus" @click="add">新增</a-button>
    </a-space>
    <a-space direction="vertical" style="width: 100%">
      <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
        <a-table-column title="编号" data-index="category_coding" align="center" :ellipsis="true" />
        <a-table-column title="品类名称" data-index="category_name" align="center" :ellipsis="true" />
        <a-table-column title="品类图片" data-index="category_pic" align="center">
          <template slot-scope="category_pic">
            <img class="img" @click="showPicture(category_pic)" :src="category_pic ? $com.showUpload() + category_pic : ''" />
          </template>
        </a-table-column>
        <a-table-column title="品类icon" data-index="category_icon" align="center">
          <template slot-scope="category_icon">
            <img class="img" @click="showPicture(category_icon)" :src="category_icon ? $com.showUpload() + category_icon : ''" />
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="option" align="center">
          <template slot-scope="text, record">
            <a-button type="link" size="small" @click="edit(record.key)">编辑</a-button>
            <a-button type="link" size="small" @click="del(record.key)">删除</a-button>
          </template>
        </a-table-column>
      </a-table>
      <div class="flex-center mt30">
        <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
      </div>
    </a-space>
    <!-- 新增编辑弹窗 -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" destroyOnClose @ok="handleOk" @cancel="visible = false" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="category_name" label="品类名称：" prop="category_name" has-feedback>
          <a-input v-model="form.category_name" placeholder="请输入品类名称" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="category_pic" label="品类图片" prop="category_pic" class="flex-center">
          <a-upload
            name="pic"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="$com.uploadUrl()"
            :before-upload="$utils.beforeUpload"
            @change="imgHandleChange"
            @preview="handlePreview"
          >
            <img v-if="form.category_pic" :src="$com.showUpload() + form.category_pic" alt="pic" class="upImg" />
            <div v-else>
              <a-icon :type="imgLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item ref="category_icon" label="品类icon" prop="category_icon" class="flex-center">
          <a-upload
            name="pic"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="$com.uploadUrl()"
            :before-upload="$utils.beforeUpload"
            @change="iconHandleChange"
            @preview="handlePreview"
          >
            <img v-if="form.category_icon" :src="$com.showUpload() + form.category_icon" alt="pic" class="upImg" />
            <div v-else>
              <a-icon :type="iconLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <div class="p20"><img alt="example" style="width: 100%" :src="previewImage" /></div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "CategoryList",
  data() {
    return {
      dataSource: [], //品类列表
      tableLoading: false,
      total: 1,
      page: 1,
      imgLoading: false,
      iconLoading: false,
      modelTitle: "新增品类",
      visible: false, //弹窗显示
      confirmLoading: false,
      imageUrl: "", //  二进制图片流
      iconUrl: "",
      previewVisible: false, // 预览图片
      form: {
        category_name: "",
        category_pic: "",
        category_icon: ""
      },
      rules: {
        category_name: [{ required: true, message: "请输入品类名称", trigger: "change" }],
        category_pic: [{ required: true, message: "请选择品类图片", trigger: "change" }],
        category_icon: [{ required: true, message: "请输入品类图标", trigger: "change" }]
      },
      previewImage: ""
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    // 获取品类列表
    getTableList() {
      this.tableLoading = true
      this.$api.getCategoryList({ page: this.page }).then(res => {
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
      this.modelTitle = "新增品类"
    },

    // 编辑
    edit(id) {
      this.resetForm()
      this.visible = true
      this.modelTitle = "编辑品类"
      this.$api.getCategoryDetail({ id }).then(res => {
        this.form.category_name = res.data.category_name
        this.form.id = res.data.id
        this.form.category_pic = res.data.category_pic
        this.form.category_icon = res.data.category_icon
      })
    },

    // 重置
    resetForm() {
      this.form = {
        category_name: "",
        category_pic: "",
        category_icon: ""
      }
    },

    // 弹窗确定
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          ;(this.modelTitle === "新增品类" ? this.$api.postCategory(this.form) : this.$api.putCategory(this.form))
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

    // 删除图片
    handlePicCancel() {
      this.previewVisible = false
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
    imgHandleChange(info) {
      if (info.file.status === "uploading") {
        this.imgLoading = true
        return
      }
      if (info.file.status === "done") {
        this.form.category_pic = info.file.response.data.pic_url
        this.imgLoading = false
      } else {
        this.form.category_pic = ""
      }
    },

    // 图片change
    iconHandleChange(info) {
      if (info.file.status === "uploading") {
        this.iconLoading = true
        return
      }
      if (info.file.status === "done") {
        this.form.category_icon = info.file.response.data.pic_url
        this.iconLoading = false
      } else {
        this.form.category_icon = ""
      }
    },

    // 删除物品
    del(id) {
      let that = this
      this.$confirm({
        content: `确定删除该品类吗？`,
        onOk() {
          that.$api.delCategory({ id }).then(res => {
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
