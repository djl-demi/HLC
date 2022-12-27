<template>
  <div id="CommodityManagement">
    指令下达
    <!-- <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="fl" size="middle">
          <div>
            <span>编号：</span>
            <div class="dib"><a-input v-model="merchandise_no" placeholder="请输入编号" allowClear /></div>
          </div>
          <div>
            <span>类别：</span>
            <div class="dib"><a-input v-model="brand" placeholder="请输入类别" allowClear /></div>
          </div>
          <div>
            <span>名称：</span>
            <div class="dib"><a-input v-model="merchandise_name" placeholder="请输入名称" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList()">搜索</a-button>
        </a-space>
        <a-space class="fr">
          <a-button type="primary" @click="add">新增</a-button>
          <a-button type="primary" @click="goodsCategory">商品类型</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" style="width: 100%">
          <a-space class="w100b mt20">
            <a-button type="danger" :disabled="!hasSelected" :loading="delLoading" @click="deleteData('')">删除</a-button>
          </a-space>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column key="merchandise_no" title="商品编号" data-index="merchandise_no" align="center" :ellipsis="true" />
            <a-table-column key="merchandise_type_name" title="商品类别" data-index="merchandise_type_name" align="center" :ellipsis="true" />
            <a-table-column key="merchandise_name" title="商品名称" data-index="merchandise_name" align="center" :ellipsis="true" />
            <a-table-column key="integral_price" title="积分单价" data-index="integral_price" align="center" :ellipsis="true" />
            <a-table-column key="warehouse_name" title="仓库" data-index="warehouse_name" align="center" :ellipsis="true" />
         
            <a-table-column key="number" title="库存" data-index="number" align="center" :ellipsis="true" />
            <a-table-column key="pic" title="图片" data-index="pic" align="center">
              <template slot-scope="pic">
                <span v-for="(item, index) in pic" v-bind:key="index">
                  <img v-if="item" class="img" @click="showPicture($com.showUpload() + item)" :src="item ? $com.showUpload() + item : ''" />
                </span>
              </template>
            </a-table-column>
            <a-table-column key="update_time" title="更新时间" data-index="update_time" align="center" :ellipsis="true" />
            <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button v-if="record.state === 1" type="link" size="small" @click="upLine(record.key, record.merchandise_name)">上架</a-button>
                <a-button v-if="record.state === 2" type="link" size="small" @click="offLine(record.key, record.merchandise_name)">下架</a-button>
                <a-button v-if="record.state === 1" type="link" size="small" @click="edit(record.key)">编辑</a-button>
                <a-button v-if="record.state === 1" type="link" size="small" @click="deleteData(record.key, record.merchandise_name)">删除</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space> -->
    <!-- 新增编辑弹窗 -->
    <!-- <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" destroyOnClose @ok="handleOk" @cancel="visible = false" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="warehouse_id" label="仓库" prop="warehouse_id" has-feedback>
          <a-select v-model="form.warehouse_id" placeholder="请选择仓库" :options="wareList" allowClear :disabled="goodsTypeDisable" />
        </a-form-model-item>
        <a-form-model-item label="商品">
          <a-button type="primary" :loading="tableLoading" @click="choiceGoods()" :disabled="goodsTypeDisable">请选择商品</a-button>
        </a-form-model-item>
        <a-form-model-item ref="brand" label="商品类别" prop="brand" has-feedback>
          <a-select v-model="form.brand" placeholder="请输入商品类别" :options="goods_sataus" allowClear :disabled="goodsTypeDisable" />
        </a-form-model-item>
        <a-form-model-item ref="merchandise_name" label="商品名称" prop="merchandise_name" has-feedback>
          <a-input v-model="form.merchandise_name" placeholder="请输入商品名称" :disabled="goodsNameDisable" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="integral_price" label="积分单价" prop="integral_price" has-feedback>
          <a-input v-model="form.integral_price" placeholder="请输入积分单价" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="number" label="数量" prop="number" has-feedback>
          <a-input readOnly v-model="form.number" placeholder="请输入数量" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="pic_url" label="商品图片" prop="pic_url" class="flex-center">
          <a-upload
            name="pic"
            list-type="picture-card"
            class="avatar-uploader"
            :action="$com.uploadUrl()"
            :before-upload="$utils.beforeUpload"
            :showUploadList="{ showPreviewIcon: false, showRemoveIcon: true }"
            @change="imgHandleChange"
            :file-list="form.pic_url"
          >
            <div v-if="form.pic_url.length < 3">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传图片
              </div>
            </div>
           
          </a-upload>
        </a-form-model-item>
        <a-form-model-item ref="pic_detail_url" label="详情图片" prop="pic_detail_url" class="flex-center">
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
            <img v-if="form.pic_detail_url" :src="$com.showUpload() + form.pic_detail_url" alt="pic" class="upImg" />
            <div v-else>
              <a-icon :type="iconLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal> -->
    <!-- 选择商品 -->
    <!-- <a-modal :width="1000" title="选择商品" :visible="goodsShow" :confirm-loading="goodsLoading" destroyOnClose @ok="goodsOk" @cancel="goodsShow = false" :maskClosable="false">
      <div class="mb20">
        <a-space size="middle">
          <div>
            <span>品牌：</span>
            <div class="dib"><a-input v-model="stockObj.brand" placeholder="请输入品牌" allowClear /></div>
          </div>
          <div>
            <span>礼品名称：</span>
            <div class="dib"><a-input v-model="stockObj.gift_name" placeholder="请输入礼品名称" allowClear /></div>
          </div>
          <div>
            <span>编号：</span>
            <div class="dib"><a-input v-model="stockObj.gift_no" placeholder="请输入编号" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="choiceGoods('search')">搜索</a-button>
        </a-space>
      </div>
      <a-table
        size="middle"
        rowKey="id"
        bordered
        :data-source="dataStock"
        :pagination="false"
        :loading="tableLoading"
        :rowSelection="{
          selectedRowKeys: selectedRadio,
          onChange: radioChange,
          type: 'radio'
        }"
      >
        <a-table-column key="gift_no" title="礼品编号" data-index="gift_no" align="center" :ellipsis="true" />
        <a-table-column key="gift_name" title="名称" data-index="gift_name" align="center" :ellipsis="true" />
        <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
        <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
        <a-table-column key="residue_stock" title="剩余库存" data-index="residue_stock" align="center" :ellipsis="true" />
        <a-table-column key="endTime" title="积分价格" data-index="endTime" align="center" :ellipsis="true" />
      </a-table>
      <div class="flex-center mt30">
        <a-pagination v-model="stockObj.page" show-quick-jumper :default-current="1" :total="stockObj.total" @change="getdataStockList()" />
      </div>
    </a-modal> -->
    <!-- 总量详细 -->
    <!-- <a-modal title="总量信息" :visible="visibleForm" :confirm-loading="confirmTotalLoading" @cancel="closeTotalForm" :footer="null" :width="450">
      <a-row>
        <a-col>
          <a-table size="middle" :data-source="dataTotalSource" :pagination="false">
            <a-table-column key="update_time" title="日期" data-index="update_time" align="center" />
            <a-table-column key="remark" title="说明" data-index="remark" align="center" />
            <a-table-column key="number" title="数量" data-index="number" align="center" />
            <a-table-column key="operator_name" title="操作人" data-index="operator_name" align="center" />
          </a-table>
        </a-col>
      </a-row>
    </a-modal> -->
    <!-- 查看图片 -->
    <!-- <a-modal :visible="picVisible" :footer="null" @cancel="handlePicCancel">
      <img :src="picture" alt="example" class="picture w100b p20" />
    </a-modal> -->
  </div>
</template>

<script>
export default {
  components: {},
  name: "CommodityManagement",
  data() {
    return {
      merchandise_no: "",
      brand: "",
      merchandise_name: "",
      dataSource: [],
      total: 1,
      page: 1,
      selectedRowKeys: [],
      selectedRadio: [],
      delLoading: false,
      status: "",
      iconLoading: false,
      imgLoading: false,
      visibleForm: false,
      //弹窗相关
      modelTitle: "新增",
      visible: false, //弹窗显示
      confirmLoading: false,
      confirmTotalLoading: false,
      goods_sataus: [],
      form: {
        brand: "",
        merchandise_name: "",
        integral_price: "",
        number: "",
        pic_url: [],
        pic_detail_url: "",
        warehouse_id: "",
        gift_id: "",
        id: ""
      },
      city_name: "",
      area_name: "",
      dataTotalSource: [],
      rules: {
        warehouse_id: [{ required: true, message: "请选择仓库类别", trigger: "blur" }],
        brand: [{ required: true, message: "请输入商品类别", trigger: "blur" }],
        merchandise_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        integral_price: [{ required: true, message: "请输入积分单价", trigger: "blur" }],
        number: [{ required: true, message: "请输入数量", trigger: "blur" }],
        pic_url: [{ required: true, message: "请上传商品图片", trigger: "blur" }],
        pic_detail_url: [{ required: true, message: "请上传详情图片", trigger: "blur" }]
      },
      goodsTypeDisable: false,
      goodsNameDisable: false,
      goodsPriceDisbale: false,
      picVisible: false,
      picture: "",
      goodsShow: false,
      goodsLoading: false,
      wareList: [],
      dataStock: [],
      stockObj: {
        gift_name: "",
        gift_no: "",
        page: 1,
        warehouse_id: ""
      },
      selectGoods: {} //选中商品
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  created() {
    //获取列表
    // this.getTableList()
    // this.goodsCategoryList() // 商品类型列表
    // this.getWarehouseList() //仓库下拉
  },
  methods: {
    // 获取商品列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        merchandise_no: this.merchandise_no || "",
        brand: this.brand || "",
        merchandise_name: this.merchandise_name || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.merchandiseList(data).then(res => {
        const dataSource = res.data.data.map((item, index) => {
          item.key = item.id
          item.pic = [item.pic_url1, item.pic_url2, item.pic_url3]
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    // 表格选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 获取总量详情
    showDetail(id) {
      let data = {
        id: id
      }

      this.$api.getmerchandisenumberlog(data).then(res => {
        if (res.code == 200) {
          const dataSource = res.data.map(item => {
            item.key = item.id
            return item
          })
          this.dataTotalSource = dataSource
          this.visibleForm = true
        }
      })
    },
    // 关闭数量明细
    closeTotalForm() {
      this.visibleForm = false
    },
    // 表格删除
    deleteData(id = "", merchandise_name = "") {
      let that = this
      let data = {
        state: 0
      }
      // if (that.selectedRowKeys.length > 0) {
      //   data.id = that.selectedRowKeys
      // } else {
      //   data.id = [id]
      // }
      if (!id) {
        data.id = this.selectedRowKeys
      } else {
        data.id = [id]
      }

      this.$confirm({
        title: "删除",
        // content: '是否确认删除商品"' + merchandise_name + '"',
        content: "确定删除选中数据吗？",
        onOk() {
          that.$api.updatestate(data).then(res => {
            if (res.code == 200) {
              that.$message.success(res.msg)
              that.getTableList()
              that.selectedRowKeys = []
            }
          })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },
    //  上架
    upLine(id, merchandise_name) {
      let that = this
      that.$confirm({
        title: "上架",
        content: '是否确认上架商品"' + merchandise_name + '"?',
        onOk() {
          that.$api.updatestate({ id, state: 2 }).then(res => {
            if (res.code == 200) {
              that.$message.success(res.msg)
              that.getTableList()
            }
          })
        },
        onCancel() {}
      })
    },
    // 下架
    offLine(id, merchandise_name) {
      let that = this
      that.$confirm({
        title: "下架",
        content: '是否确认下架商品"' + merchandise_name + '"?',
        onOk() {
          that.$api.updatestate({ id, state: 1 }).then(res => {
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
      this.resetForm()
      this.visible = true
      this.modelTitle = "新增"

      this.goodsTypeDisable = false
      this.goodsNameDisable = false
      this.goodsPriceDisbale = false
      this.$validator.resetFields(this)
    },

    // 编辑
    edit(id) {
      this.resetForm()
      this.visible = true
      this.modelTitle = "编辑"

      this.goodsTypeDisable = true
      this.goodsNameDisable = true
      this.goodsPriceDisbale = true
      this.$api.merchandisedetail({ id }).then(res => {
        this.form.brand = res.data.merchandise_type_id
        this.form.warehouse_id = res.data.warehouse_id
        this.form.integral_price = res.data.integral_price
        this.form.merchandise_name = res.data.merchandise_name
        this.form.gift_id = res.data.gift_id
        this.form.id = res.data.id
        this.form.number = res.data.number
        if (res.data.pic_detail_url) this.form.pic_detail_url = res.data.pic_detail_url

        if (res.data.pic_url1) {
          this.form.pic_url.push({
            uid: 1,
            name: "pic_url1",
            status: "done",
            path: res.data.pic_url1,
            url: this.$com.showUpload() + res.data.pic_url1
          })
        }

        if (res.data.pic_url2) {
          this.form.pic_url.push({
            uid: 2,
            name: "pic_url2",
            status: "done",
            path: res.data.pic_url2,
            url: this.$com.showUpload() + res.data.pic_url2
          })
        }

        if (res.data.pic_url3) {
          this.form.pic_url.push({
            uid: 3,
            name: "pic_url3",
            status: "done",
            path: res.data.pic_url3,
            url: this.$com.showUpload() + res.data.pic_url3
          })
        }
      })
    },
    // 重置
    resetForm() {
      this.form = {
        brand: "",
        merchandise_name: "",
        integral_price: "",
        number: "",
        pic_url: [],
        pic_detail_url: "",
        warehouse_id: "",
        gift_id: "",
        id: ""
      }
    },
    // 弹窗确定
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        let data = {
          gift_id: this.form.gift_id || "",
          // id: this.form.id || "",
          warehouse_id: this.form.warehouse_id || "",
          merchandise_type_id: this.form.brand || "",
          merchandise_name: this.form.merchandise_name || "",
          integral_price: this.form.integral_price || 0,
          number: this.form.number || 0,
          pic_url1: this.form.pic_url[0] != undefined ? this.form.pic_url[0].path : "",
          pic_url2: this.form.pic_url[1] != undefined ? this.form.pic_url[1].path : "",
          pic_url3: this.form.pic_url[2] != undefined ? this.form.pic_url[2].path : "",
          pic_detail_url: this.form.pic_detail_url || ""
        }
        if (this.modelTitle !== "新增") {
          data.id = this.form.id || ""
        }

        if (valid) {
          this.confirmLoading = true
          ;(this.modelTitle === "新增" ? this.$api.addmerchandise(data) : this.$api.editmerchandise(data))
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
    // 弹窗取消
    handleCancel() {
      this.visible = false
    },
    // 图片预览
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$utils.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },

    // 图片change
    imgHandleChange({ fileList }) {
      this.form.pic_url = fileList
      // 后续提交传值
      fileList.map((item, index) => {
        this.form.pic_url[index].path = item.path == undefined && item.response != undefined ? item.response.data.pic_url : item.path
      })
      // if (info.file.status === "uploading") {
      //   this.imgLoading = true
      //   return
      // }
      // if (info.file.status === "done") {
      //   this.form.pic_url = info.file.response.data.pic_url
      //   this.imgLoading = false
      // } else {
      //   this.form.pic_url = []
      // }
    },
    // 图片详情change
    iconHandleChange(info) {
      if (info.file.status === "uploading") {
        this.imgLoading = true
        return
      }
      if (info.file.status === "done") {
        this.form.pic_detail_url = info.file.response.data.pic_url
        this.imgLoading = false
      } else {
        this.form.pic_detail_url = ""
      }
    },
    // 获取商品类型下拉列表
    goodsCategoryList() {
      this.$api
        .goodsCategoryList()
        .then(res => {
          res.data.map(item => {
            this.goods_sataus.push({
              value: item.id || "",
              label: item.type_name || ""
            })
          })
        })
        .catch(err => {})
    },
    // 商品类型
    goodsCategory() {
      this.$router.push({
        name: "CategoryManagement"
      })
    },
    // 取消查看图片
    handlePicCancel() {
      this.picVisible = false
    },
    // 查看图片
    showPicture(pic = "") {
      this.picVisible = true
      this.picture = pic
    },
    //选择商品
    choiceGoods(type) {
      this.stockObj.warehouse_id = this.form.warehouse_id
      this.$api.getStockList(this.stockObj).then(res => {
        if (res.code === 200) {
          this.dataStock = res.data.data
          this.stockObj.last_page = res.data.last_page
          this.stockObj.total = res.data.total
        }
      })
      if (type !== "search") {
        this.goodsShow = !this.goodsShow
      }
    },
    goodsOk() {
      if (!this.selectedRadio.length) {
        return this.$message.error("请选择商品！")
      }
      this.goodsShow = !this.goodsShow
      let newArr = this.dataStock.filter(t => {
        return t.id === this.selectedRadio[0]
      })
      this.selectGoods = newArr[0]
      this.form.number = newArr[0].residue_stock
      this.form.integral_price = newArr[0].integral_price
      this.form.merchandise_name = newArr[0].gift_name
      this.form.gift_id = newArr[0].gift_id
      this.form.warehouse_id = newArr[0].warehouse_id
    },
    getWarehouseList() {
      this.$api
        .goodsWarehouse()
        .then(res => {
          if (res.code === 200) {
            res.data.forEach(t => {
              this.wareList.push({
                value: t.id || "",
                label: t.name || ""
              })
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    radioChange(rows) {
      this.selectedRadio = rows
      // this.selectedRadio = rows.filter(t => {
      //   this.dataStock.fo
      // })
    },
    getdataStockList() {
      this.choiceGoods()
    }
  }
}
</script>

<style lang="less">
.upImg {
  width: 102px;
  height: 102px;
}

.img {
  width: 30px;
  height: 30px;
}
/deep/.ant-radio-inner {
  background-color: red;
}
</style>
