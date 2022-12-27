<template>
  <div id="ActivityGoodsManagement">
    <a-tabs v-model="btnValue" @change="tabChange">
      <a-tab-pane v-for="item in tabList" :key="item.value">
        <span slot="tab">
          <span style="font-size: 16px;vertical-align: middle;">{{ item.name }}</span>
          <a-badge :count="item.num" :overflow-count="99" style="position: absolute;top: 0px;left: 65px;" />
        </span>
        <div class="oh">
          <a-space class="fl" size="middle">
            <div>
              <span>编号：</span>
              <div class="dib">
                <a-input placeholder="请输入编号" v-model="gift_no" allowClear />
              </div>
            </div>

            <div>
              <span>名称：</span>
              <div class="dib">
                <a-input placeholder="请输入名称：" v-model="gift_name" allowClear />
              </div>
            </div>
            <a-button class="m10" type="primary" @click="getTableList(1)" :loading="tableLoading">搜索</a-button>
          </a-space>
          <a-space class="fr">
            <a-button type="primary" icon="plus" @click="add">新增</a-button>
          </a-space>
        </div>
        <div class="oh w100b">
          <a-space direction="vertical" class="w100b">
            <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
            <a-table
              size="middle"
              :data-source="dataSource"
              :loading="tableLoading"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :pagination="false"
              :rowKey="record => record.id"
            >
              <a-table-column key="gift_no" title="编号" data-index="gift_no" align="center" :width="200" />
              <a-table-column key="gift_name" title="名称" data-index="gift_name" align="center" :width="200" />
              <a-table-column key="specs" title="规格" data-index="specs" align="center" :width="100" />
              <a-table-column key="brand" title="品牌" data-index="brand" align="center" :width="100" />
              <a-table-column key="unit" title="单位" data-index="unit" align="center" :width="100" />
              <a-table-column key="buy_price" title="采购价格（元）" data-index="buy_price" align="center" />
              <a-table-column key="sell_price" title="现金价格（元）" data-index="sell_price" align="center" />
              <a-table-column key="integral_price" title="积分价格（元）" data-index="integral_price" align="center" v-if="item.name === '礼品'" />
              <a-table-column key="warehouse_name" title="仓库" data-index="warehouse_name" align="center" />
              <a-table-column title="图片" data-index="pic_url" align="center">
                <template slot-scope="pic_url">
                  <span v-if="pic_url == null">--</span>
                  <img class="img" v-else @click="showPicture(pic_url)" :src="pic_url ? $com.showUpload() + pic_url : ''" />
                </template>
              </a-table-column>
              <a-table-column key="operation" title="操作" data-index="operation" align="center" fixed="right">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="edit(record.key)">编辑</a-button>
                </template>
              </a-table-column>
            </a-table>
            <div class="flex-center mt30 mb20">
              <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
            </div>
          </a-space>
        </div>
      </a-tab-pane>
    </a-tabs>

    <!-- 新增编辑弹窗 -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="gift_name" label="名称：" prop="gift_name" has-feedback>
          <a-input v-model="form.gift_name" placeholder="请输入名称" :disabled="disabled" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="brand" label="品牌：" prop="brand" has-feedback>
          <a-input v-model="form.brand" placeholder="请输入品牌" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="specs" label="规格：" prop="specs" has-feedback>
          <a-input v-model="form.specs" placeholder="请输入规格" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="unit" label="单位" prop="unit" class="flex-center">
          <a-input v-model="form.unit" placeholder="请输入单位" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="buy_price" label="采购价格：" prop="buy_price">
          <a-input v-model="form.buy_price" placeholder="请输入采购价格" prefix="￥" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="sell_price" label="现金价格：" prop="sell_price">
          <a-input v-model="form.sell_price" placeholder="请输入现金价格" prefix="￥" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="integral_price" label="积分价格：" prop="integral_price" v-if="btnValue === 1">
          <a-input v-model="form.integral_price" placeholder="请输入积分价格" prefix="￥" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="pic_url" label="图片" prop="pic_url" class="flex-center">
          <a-upload
            name="pic"
            :show-upload-list="false"
            list-type="picture-card"
            class="avatar-uploader"
            :action="$com.uploadUrl()"
            :before-upload="$utils.beforeUpload"
            @change="handleChange"
            @preview="handlePreview"
          >
            <img v-if="form.pic_url" :src="$com.showUpload() + form.pic_url" alt="pic_url" class="upImg" />
            <div v-else>
              <a-icon :type="imgLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item ref="warehouse_id" label="仓库：" prop="warehouse_id">
          <a-select v-model="form.warehouse_id" :options="warehouseList" placeholder="请选择仓库" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 图片展示 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <div class="p20"><img alt="example" style="width: 100%" :src="previewImage" /></div>
    </a-modal>
  </div>
</template>

<script>
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "ActivityGoodsManagement",
  data() {
    return {
      gift_no: "",
      gift_name: "",
      btnValue: 1,
      tabList: [
        { name: "礼品", value: 1, num: null },
        { name: "物料", value: 2, num: null }
      ],
      selectedRowKeys: [],
      dataSource: [], // 表格数据
      warehouseList: [],
      tableLoading: false, //表格
      delLoading: false,
      page: 1,
      total: 0,

      //新增编辑弹窗相关
      modelTitle: "出库新增",
      visible: false, //弹窗显示
      confirmLoading: false,
      disabled: false,
      imgLoading: false,
      previewVisible: false,
      previewImage: "",
      form: {
        gift_name: "",
        specs: "",
        brand: "",
        unit: "",
        buy_price: 0,
        sell_price: 0,
        integral_price: 0,
        remark: "",
        warehouse_id: undefined,
        pic_url: "",
        site_id: undefined,
        type: 1
      },
      rules: {
        gift_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        brand: [{ required: true, message: "请输入品牌", trigger: "change" }],
        specs: [{ required: true, message: "请输入规格", trigger: "blur" }],
        unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
        warehouse_id: [{ required: true, message: "请选择仓库", trigger: "blur" }],
        integral_price: [{ required: true, message: "请输入价格", trigger: "blur" }]
      },
      id: -1
    }
  },
  created() {
    this.getTableList() //获取列表
    this.$com.getWarehouseName(this, "warehouseList") // 仓库下拉
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
    // 列表查看图片
    showPicture(picture_url = "") {
      this.previewImage = this.$com.showUpload() + picture_url
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
    },
    // 图片预览
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$utils.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || this.$com.showUpload() + file.response.data.pic_url
      this.previewVisible = true
    },

    // 获取居民信息列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        gift_no: this.gift_no || "",
        gift_name: this.gift_name || "",
        type: this.btnValue,
        page: this.page
      }
      this.tableLoading = true
      this.$api.getActivityGoodsList(data).then(res => {
        const dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
        this.dataSource = dataSource
      })
    },
    // 切换
    tabChange() {
      setTimeout(() => {
        this.getTableList(1)
      }, 500)
    },
    // 表格删除
    deleteData(record) {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除该内容吗?",
        onOk() {
          // 入库删除
          // data.id = this.id.toString()
          that.$api
            .delActivityGoods({ id: that.selectedRowKeys })
            .then(res => {
              that.delLoading = false
              that.tableLoading = false
              that.getTableList()
              that.$message.info(res.msg)
              that.selectedRowKeys = []
            })
            .catch(err => {
              that.delLoading = false
              that.tableLoading = false
            })

          that.delLoading = true
          that.tableLoading = true
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },

    // 新增
    add() {
      this.disabled = false
      this.form = {
        gift_name: "",
        specs: "",
        brand: "",
        unit: "",
        buy_price: 0,
        sell_price: 0,
        integral_price: 0,
        remark: "",
        warehouse_id: undefined,
        pic_url: "",
        site_id: undefined,
        type: this.btnValue
      }
      this.visible = true
      this.modelTitle = "新增"
      this.$validator.resetFields(this)
    },

    // 编辑
    edit(id) {
      this.id = id
      this.visible = true
      this.disabled = true
      this.modelTitle = "编辑"
      this.$api.activityGoodsDetail({ id: this.id }).then(res => {
        this.form.gift_no = res.data.gift_no || ""
        this.form.gift_name = res.data.gift_name || ""
        this.form.specs = res.data.specs
        this.form.brand = res.data.brand
        this.form.unit = res.data.unit
        this.form.buy_price = res.data.buy_price
        this.form.sell_price = res.data.sell_price

        this.form.integral_price = res.data.integral_price
        this.form.warehouse_id = res.data.warehouse_id
        this.form.pic_url = res.data.pic_url

        this.form.type = res.data.type
        this.form.id = this.id
      })
    },
    // 弹窗确定
    handleOk() {
      // this.visible = false
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ;(this.modelTitle === "新增" ? this.$api.addActivityGoods(this.form) : this.$api.editActivityGoods(this.form)).then(res => {
            this.$message.info(res.msg)
            this.visible = false
            this.getTableList()
            this.disabled = false
            this.form = {
              gift_name: "",
              specs: "",
              brand: "",
              unit: "",
              buy_price: "",
              sell_price: "",
              integral_price: "",
              remark: "",
              warehouse_id: undefined,
              pic_url: "",
              site_id: undefined,
              type: this.btnValue
            }
          })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    },
    // 弹窗取消
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style lang="less">
#ActivityGoodsManagement {
  img {
    width: 50px;
    height: 50px;
  }
}
.upImg {
  width: 102px;
  height: 102px;
}
</style>
