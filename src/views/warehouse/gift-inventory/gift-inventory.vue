<template>
  <div id="GiftInventory">
    <a-tabs v-model="btnValue" @change="tabChange">
      <a-tab-pane v-for="item in tabList" :key="item.value">
        <span slot="tab">
          <span style="font-size: 16px;vertical-align: middle;">{{ item.name }}</span>
          <a-badge :count="item.num" :overflow-count="99" style="position: absolute;top: 0px;left: 65px;" />
        </span>
        <!-- 礼品库存 -->
        <div class="oh">
          <a-space class="fl" size="middle">
            <div>
              <span>名称：</span>
              <div class="dib"><a-input v-model="gift_name" placeholder="请输入名称" allowClear /></div>
            </div>
            <div>
              <span>仓库：</span>
              <div class="dib"><a-select style="width:213px" v-model="warehouse_id" placeholder="请选择仓库" :options="warehouseList" allowClear /></div>
            </div>
            <div>
              <span>类型：</span>
              <div class="dib"><a-select style="width:213px" v-model="type" placeholder="请选择类型" :options="typeList" allowClear /></div>
            </div>
            <div v-if="item.name === '历史'">
              <span>时间筛选：</span>
              <div class="dib"><a-range-picker v-model="dateString" @change="onChange" allowClear class="w200" /></div>
            </div>
            <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
          </a-space>
          <a-space class="fr">
            <!-- <a-button type="primary" icon="plus" @click="add">新增</a-button> -->
            <a-button icon="export" @click="trackExport">导出</a-button>
          </a-space>
        </div>
        <div class="oh w100b">
          <a-space direction="vertical" style="width: 100%">
            <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
              <a-table-column key="update_time" title="更新时间" data-index="update_time" align="center" :ellipsis="true" :width="200" v-if="item.name === '实时'" />
              <a-table-column key="date" title="时间" data-index="date" align="center" :ellipsis="true" :width="200" v-if="item.name === '历史'" />

              <a-table-column key="gift_name" title="名称" data-index="gift_name" align="center" :ellipsis="true">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="detail(record)">{{ record.gift_name }}</a-button>
                </template>
              </a-table-column>
              <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
              <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
              <a-table-column key="unit" title="单位" data-index="unit" align="center" :ellipsis="true" />
              <a-table-column key="same_day_return" title="当日退回" data-index="same_day_return" align="center" v-if="item.name === '实时'" />
              <a-table-column key="same_day_stock_out" title="当日出库" data-index="same_day_stock_out" align="center" v-if="item.name === '实时'" />
              <a-table-column key="residue_stock" title="剩余库存" data-index="residue_stock" align="center" v-if="item.name === '实时'" />

              <a-table-column key="day_return_number" title="当日退回" data-index="day_return_number" align="center" v-if="item.name === '历史'" />
              <a-table-column key="day_exchange_number" title="当日出库" data-index="day_exchange_number" align="center" v-if="item.name === '历史'" />
              <a-table-column key="number" title="剩余库存" data-index="number" align="center" v-if="item.name === '历史'" />
              <a-table-column key="pic_url" title="图片" data-index="pic_url" align="center" :ellipsis="true">
                <template slot-scope="pic_url">
                  <img class="img" @click="showPicture(pic_url)" :src="pic_url ? $com.showUpload() + pic_url : ''" />
                </template>
              </a-table-column>
              <a-table-column key="max_stock" title="最大库存" data-index="max_stock" align="center" :ellipsis="true" />
              <a-table-column key="min_stock" title="最小库存" data-index="min_stock" align="center" :ellipsis="true" />
              <a-table-column key="warehouse_name" title="仓库" data-index="warehouse_name" align="center" :ellipsis="true" />
              <a-table-column key="operation" title="操作" data-index="operation" align="center" fixed="right" v-if="item.name === '实时'">
                <template slot-scope="text, record">
                  <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
                </template>
              </a-table-column>
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
            </div>
          </a-space>
        </div>
      </a-tab-pane>
    </a-tabs>
    <!-- 编辑弹窗 -->
    <a-modal title="编辑库存" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="gift_no" label="编号：" prop="gift_no" has-feedback>
          <a-input v-model="form.gift_name" placeholder="请输入编号" :disabled="disabled" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="gift_name" label="名称：" prop="gift_name" has-feedback>
          <a-input v-model="form.gift_name" placeholder="请输入名称" :disabled="disabled" allowClear />
        </a-form-model-item>

        <a-form-model-item ref="specs" label="规格：" prop="specs" has-feedback>
          <a-input v-model="form.specs" placeholder="请输入规格" :disabled="disabled" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="brand" label="品牌：" prop="brand" has-feedback>
          <a-input v-model="form.brand" placeholder="请输入品牌" :disabled="disabled" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="warehouse_id" label="仓库：" prop="warehouse_id">
          <a-select v-model="form.warehouse_id" :options="warehouseList" :disabled="disabled" placeholder="请选择仓库" allowClear />
        </a-form-model-item>

        <a-form-model-item ref="min_stock" label="最小值" prop="min_stock" class="flex-center">
          <a-input-number id="inputNumber" v-model="form.min_stock" :min="0"></a-input-number>
        </a-form-model-item>
        <a-form-model-item ref="max_stock" label="最大值：" prop="max_stock">
          <a-input-number id="inputNumber" v-model="form.max_stock" :max="10000"></a-input-number>
        </a-form-model-item>
        <a-form-model-item ref="residue_stock" label="剩余库存：" prop="residue_stock">
          <a-input-number id="inputNumber" v-model="form.residue_stock"></a-input-number>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 查看图片 -->
    <a-modal :visible="previewVisible" :width="500" :footer="null" @cancel="previewVisible = false">
      <img :src="previewImage" alt="example" class="picture w100b p20" />
    </a-modal>
  </div>
</template>

<script>
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "GiftInventory",
  data() {
    return {
      btnValue: 1,
      tabList: [
        { name: "实时", value: 1, num: null },
        { name: "历史", value: 2, num: null }
      ],
      type: undefined,
      typeList: [
        { label: "礼品", value: 1 },
        { label: "物料", value: 2 }
      ],
      gift_name: "",
      // start_time: null,
      // over_time: null,
      dateString: [this.$moment().subtract(15, "days"), this.$moment().subtract(1, "days")],
      start_time: this.$moment()
        .subtract(15, "days")
        .format("YYYY-MM-DD"),
      over_time: this.$moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD"),
      warehouse_id: undefined,
      // dateString: [],
      warehouseList: [],
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,

      previewVisible: false,
      previewImage: "",

      form: {
        id: 0,
        gift_id: "",
        gift_no: "",
        gift_name: "",
        specs: "",
        brand: "",
        warehouse_id: undefined,
        residue_stock: 0,
        max_stock: 0,
        min_stock: 0
      },
      visible: false,
      disabled: true,
      confirmLoading: false,
      imgLoading: false,
      rules: {
        // gift_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      }
    }
  },
  created() {
    //获取列表
    this.getTableList()
    this.$com.getWarehouseName(this, "warehouseList") // 仓库下拉
  },
  methods: {
    // 切换
    tabChange() {
      setTimeout(() => {
        this.getTableList(1)
        this.type = undefined
      }, 500)
    },
    onChange(date, dateString) {
      this.start_time = dateString[0]
      this.over_time = dateString[1]
    },
    // 获取库存列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        warehouse_id: this.warehouse_id || "",
        gift_name: this.gift_name || "",
        type: this.type || "",
        page: this.page
      }
      this.tableLoading = true
      if (this.btnValue == 1) {
        this.$api.getStockList(data).then(res => {
          const dataSource = res.data.data.map(item => {
            item.key = item.id
            return item
          })

          this.tableLoading = false
          this.total = res.data.total
          this.dataSource = dataSource
        })
      }
      if (this.btnValue == 2) {
        this.$api.getReportList({ ...data, start_time: this.start_time, over_time: this.over_time }).then(res => {
          const dataSource = res.data.data.map(item => {
            item.key = item.id
            return item
          })

          this.tableLoading = false
          this.total = res.data.total
          this.dataSource = dataSource
        })
      }
    },

    // 导出
    trackExport() {
      const warehouse_id = this.warehouse_id || ""
      const gift_name = this.gift_name || ""
      const token = JSON.parse(localStorage.getItem("token"))
      if (this.btnValue === 1) {
        window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/gift/real/time/stock/export?token=${token}&warehouse_id=${warehouse_id}&gift_name=${gift_name}`)
      }
      if (this.btnValue === 2) {
        window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/gift/report/export?token=${token}&warehouse_id=${warehouse_id}&gift_name=${gift_name}`)
      }
    },
    //礼品详情
    detail(record) {
      this.$router.push({
        name: "GiftInventoryDetails",
        query: { btnValue: this.btnValue, gift_id: record.gift_id }
      })
    },
    // 查看图片
    showPicture(picture_url = "") {
      this.previewImage = this.$com.showUpload() + picture_url
      this.previewVisible = true
    },
    // 编辑
    edit(record) {
      this.visible = true
      // this.modelTitle = "编辑"
      this.$api.stockDetail({ id: record.id, gift_id: record.gift_id }).then(res => {
        this.form.gift_no = res.data.gift_no || ""
        this.form.gift_id = res.data.gift_id || ""
        this.form.gift_name = res.data.gift_name || ""
        this.form.specs = res.data.specs
        this.form.brand = res.data.brand
        this.form.warehouse_id = res.data.warehouse_id

        this.form.residue_stock = res.data.residue_stock
        this.form.max_stock = res.data.max_stock
        this.form.min_stock = res.data.min_stock
        this.form.id = res.data.id
      })
    },
    // 弹窗确定
    handleOk() {
      // this.visible = false
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // this.form.id = this.id
          console.log(this.form, "forrrr")
          this.$api.editStock(this.form).then(res => {
            this.$message.info(res.msg)
            this.visible = false
            this.getTableList()
            this.form = {
              id: "",
              gift_id: "",
              gift_no: "",
              gift_name: "",
              specs: "",
              brand: "",
              min_stock: 0,
              max_stock: 0,
              residue_stock: 0,
              warehouse_id: undefined
              // type: this.btnValue
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
#GiftInventory {
  .img {
    height: 24px;
  }
}
</style>
