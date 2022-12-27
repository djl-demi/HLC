<template>
  <div id="GoodsList">
    <a-space class="fl" size="middle">
      <div>
        <span>垃圾类型：</span>
        <div class="dib"><a-select v-model="garbage_type" class="w200" placeholder="全部类型" :options="garbageTypes" allowClear /></div>
      </div>
      <div>
        <span>物品名称：</span>
        <div class="dib"><a-input v-model="garbage_name" class="w200" placeholder="请输入物品名称" allowClear /></div>
      </div>
      <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
    </a-space>
    <a-space class="fr">
      <!-- <a-button type="primary" @click="setUp">投放总量设置</a-button> -->
      <a-button type="primary" icon="plus-circle" @click="add">新增</a-button>
    </a-space>
    <a-space direction="vertical" style="width: 100%">
      <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
        <a-table-column title="编号" data-index="goods_coding" align="center" :ellipsis="true" />
        <a-table-column title="垃圾类型" data-index="category_name" align="center" :ellipsis="true" />
        <a-table-column title="物品名称" data-index="goods_name" align="center" :ellipsis="true" />
        <a-table-column key="pic" title="物品图片" data-index="pic" align="center">
          <template slot-scope="pic">
            <img class="img" @click="showPicture(pic)" :src="pic ? $com.showUpload() + pic : ''" />
          </template>
        </a-table-column>
        <!-- <a-table-column title="积分价格" data-index="integral_price" align="center" :ellipsis="true" /> -->
        <!-- <a-table-column title="现金价格" data-index="cash_price" align="center" :ellipsis="true" /> -->
        <a-table-column title="操作" data-index="option" align="center" :ellipsis="true">
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
        <a-form-model-item ref="category_id" label="垃圾类型：" prop="category_id" has-feedback>
          <a-select v-model="form.category_id" :options="garbageTypes" placeholder="请选择垃圾类型" :disabled="disabled" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="goods_name" label="物品名称：" prop="goods_name" has-feedback>
          <a-input v-model="form.goods_name" placeholder="请输入物品名称" allowClear />
        </a-form-model-item>
        <a-form-model-item v-if="form.unit === '其他'" ref="otherUnit" label="单位：" prop="otherUnit" has-feedback>
          <a-input v-model="form.otherUnit" placeholder="请输入物品单位" allowClear />
        </a-form-model-item>
        <!-- <a-form-model-item ref="integral_price" prop="integral_price" label="积分价格"
          ><a-input-number v-model="form.integral_price" :step="0.01" /><span class="ant-form-text"> / 积分</span></a-form-model-item
        >
        <a-form-model-item ref="cash_price" prop="cash_price" label="现金价格"><a-input-number v-model="form.cash_price" :step="0.01" /><span class="ant-form-text"> / 元</span></a-form-model-item> -->
        <a-form-model-item ref="pic" label="物品图片" prop="pic" class="flex-center">
          <a-upload
            name="pic"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="$com.uploadUrl()"
            :before-upload="$utils.beforeUpload"
            @change="handleChange"
            @preview="handlePreview"
          >
            <img v-if="form.pic" :src="$com.showUpload() + form.pic" alt="pic" class="upImg" />
            <div v-else>
              <a-icon :type="imgLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal :visible="previewVisible" :width="500" :footer="null" @cancel="previewVisible = false">
      <div class="p20"><img alt="example" class="w100b" :src="previewImage" /></div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "GoodsList",
  data() {
    return {
      garbage_type: undefined,
      garbage_name: "",
      dataSource: [], // 物品列表
      categoryList: [], // 品类列表
      tableLoading: false,
      total: 1,
      page: 1,
      previewVisible: false,
      modelTitle: "新增物品",
      visible: false, //弹窗显示
      disabled: false,
      confirmLoading: false,
      form: {
        category_id: undefined,
        goods_name: "",
        pic: "",
        unit: undefined,
        otherUnit: ""
        // integral_price: "",
        // cash_price: ""
      },
      garbageTypes: [
        // { value: 1, label: "可回收物" },
        // { value: 2, label: "厨余垃圾" },
        // { value: 3, label: "有害垃圾" },
        // { value: 4, label: "其他垃圾" }
      ],
      previewImage: "",
      imgLoading: false,
      imageUrl: "", //  二进制图片流
      value: [],
      rules: {
        category_id: [{ required: true, message: "请选择垃圾类型", trigger: "change" }],
        goods_name: [{ required: true, message: "请输入物品名称", trigger: "change" }]
        // integral_price: [{ required: true, trigger: "blur" }],
        // cash_price: [{ required: true, trigger: "blur" }]
      }
    }
  },
  created() {
    this.goodsCategorys()
    this.getTableList()
  },
  methods: {
    // 获取物品类型
    goodsCategorys() {
      this.$api.goodsCategorys().then(res => {
        this.garbageTypes = res.data.map(item => {
          item.value = item.id
          item.label = item.category_name
          return item
        })

        console.log(this.garbageTypes)
      })
    },
    // 获取物品列表
    getTableList(page) {
      if (page) this.page = page
      // 参数
      let data = {
        category_id: this.garbage_type || "",
        goods_name: this.garbage_name || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.getGoodsManagementList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          // item.integral_price = `${item.integral_price}积分 / ${item.unit}`
          // item.cash_price = `${item.cash_price}元 / ${item.unit}`
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
      this.disabled = false
      this.modelTitle = "新增物品"
    },
    // 编辑
    edit(id) {
      this.resetForm()
      this.visible = true
      this.disabled = true
      this.modelTitle = "编辑物品"
      this.$api.getGoodsDetail({ id }).then(res => {
        this.form.goods_name = res.data.goods_name
        // this.form.integral_price = res.data.integral_price
        // this.form.cash_price = res.data.cash_price
        this.form.id = res.data.id
        this.form.category_id = res.data.category_id
        if (res.data.pic) this.form.pic = res.data.pic
      })
    },

    resetForm() {
      // if (this.form.integral_price === null) {
      //   this.form.integral_price = 0
      // }
      // if (this.form.cash_price === null) {
      //   this.form.cash_price = 0
      // }
      this.form = {
        category_id: undefined,
        goods_name: "",
        pic: "",
        unit: undefined
        // integral_price: 0,
        // cash_price: 0
      }
    },

    // 弹窗确定
    handleOk() {
      if (this.form.unit === "其他") {
        this.form.unit = this.form.otherUnit
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // if (this.form.integral_price <= 0 && this.form.cash_price <= 0) {
          //   this.$message.error("积分价格和现金价格不能同时为空且值要大于0")
          //   return false
          // }
          // if (this.form.integral_price === null) {
          //   this.form.integral_price = 0
          // }
          // if (this.form.cash_price === null) {
          //   this.form.cash_price = 0
          // }
          this.confirmLoading = true
          ;(this.modelTitle === "新增物品" ? this.$api.postGoods(this.form) : this.$api.putGoods(this.form))
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
        this.form.pic = info.file.response.data.pic_url
        this.imgLoading = false
      } else {
        this.form.pic = ""
      }
    },

    // 删除物品
    del(id) {
      let that = this
      this.$confirm({
        content: `确定删除该物品吗？`,
        onOk() {
          that.$api.delGoods({ id }).then(res => {
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
#GoodsList {
  .img {
    height: 24px;
  }
}
.upImg {
  width: 100px;
  height: 100px;
}
</style>
