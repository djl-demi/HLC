<template>
  <div id="SortingStationInAndOut">
    <a-tabs v-model="btnValue" @change="tabChange">
      <a-tab-pane v-for="item in tabList" :key="item.value">
        <span slot="tab">
          <span style="font-size: 16px;vertical-align: middle;">{{ item.name }}</span>
          <a-badge :count="item.num" :overflow-count="99" style="position: absolute;top: 0px;left: 65px;" />
        </span>
        <div class="oh">
          <a-space class="fl" size="middle">
            <div>
              <span>分拣站：</span>
              <div class="dib">
                <a-input placeholder="请输入分拣站" style="width: 213px" v-model="site_name" allowClear />
              </div>
            </div>
            <div v-if="item.name === '入库'">
              <span>来源：</span>
              <div class="dib">
                <a-input placeholder="请输入来源" style="width: 213px" v-model="house_name" allowClear />
              </div>
            </div>

            <div>
              <span class="tip">时间筛选：</span>
              <a-range-picker v-model="dateString" @change="onChange" allowClear style="width: 213px" />
            </div>
            <a-button class="m10" type="primary" @click="getTableList(1)" :loading="tableLoading">搜索</a-button>
          </a-space>
          <a-space class="fr">
            <a-button type="primary" v-if="btnValue === 2" icon="plus" @click="add">新增</a-button>
          </a-space>
        </div>
        <div class="oh w100b">
          <a-space direction="vertical" class="w100b">
            <a-table size="middle" :data-source="dataSource" :loading="tableLoading" :scroll="{ x: 1800 }" :pagination="false" :rowKey="record => record.stock_no">
              <a-table-column key="stock_no" title="入库编号" data-index="stock_no" align="center" :width="140" v-if="item.name === '入库'" />
              <a-table-column key="stock_no" title="出库编号" data-index="stock_no" align="center" :width="160" v-if="item.name === '出库'" />

              <a-table-column key="house_name" title="来源" data-index="house_name" align="center" :width="140" v-if="item.name === '入库'" />

              <a-table-column key="site_name" title="分拣站" data-index="site_name" align="center" :width="100" />
              <a-table-column key="category_name" title="品类" data-index="category_name" align="center" :width="100" />
              <a-table-column key="goods_name" title="物品" data-index="goods_name" align="center" :width="100" />
              <a-table-column key="unit" title="单位" data-index="unit" align="center" :width="100" />
              <a-table-column key="driver_name" title="司机" data-index="driver_name" align="center" :width="80" />
              <a-table-column key="merchant_name" title="商家" data-index="merchant_name" align="center" :width="120" v-if="item.name === '出库'" />
              <a-table-column key="net_weight" title="入库重量" data-index="net_weight" align="center" :width="120" v-if="item.name === '入库'" />
              <a-table-column key="weight" title="出库重量" data-index="weight" align="center" :width="120" v-if="item.name === '出库'" />
              <a-table-column key="money" title="金额(元)" data-index="money" align="center" :width="120" v-if="item.name === '出库'" />
              <a-table-column key="stock_time" title="入库时间" data-index="stock_time" align="center" :width="120" v-if="item.name === '入库'" />
              <a-table-column key="stock_time" title="出库时间" data-index="stock_time" align="center" :width="120" v-if="item.name === '出库'" />
              <a-table-column key="operator" title="操作人" data-index="operator" align="center" :width="100" v-if="item.name === '入库'" />
              <a-table-column key="operator_name" title="操作人" data-index="operator_name" align="center" :width="100" v-if="item.name === '出库'" />
              <a-table-column key="note" title="备注" data-index="note" align="center" :width="80" v-if="item.name === '入库'" />
              <a-table-column key="remark" title="备注" data-index="remark" align="center" :width="80" v-if="item.name === '出库'" />
              <a-table-column key="operation" title="操作" data-index="operation" align="center" :width="150" fixed="right">
                <template slot-scope="text, record">
                  <a-button type="link" v-if="btnValue === 2" size="small" @click="edit(record)">编辑</a-button>
                  <!-- 入库删除按钮是需要在入库,出库时间等于当天的时间才显示 -->
                  <a-button
                    type="link"
                    size="small"
                    :loading="delLoading"
                    v-if="item.name === '入库' && $moment().format('YYYY-MM-DD') === record.stock_time.substring(0, 10)"
                    @click="deleteData(record)"
                    >删除</a-button
                  >
                  <a-button type="link" size="small" @click="deleteData(record)" v-if="item.name === '出库'">删除</a-button>
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
        <a-form-model-item ref="site_id" label="分拣站：" prop="site_id" has-feedback>
          <a-select v-model="form.site_id" :options="sortingList" placeholder="请选择分拣站" allowClear v-if="modelTitle === '出库新增'" />
          <a-input v-model="form.site_name" v-else disabled />
        </a-form-model-item>
        <a-form-model-item ref="category_id" label="品类：" prop="category_id" has-feedback>
          <a-select v-model="form.category_id" :options="categoryList" @change="handleChange" placeholder="请选择品类" allowClear v-if="modelTitle === '出库新增'" />
          <a-input v-model="form.category_name" v-else disabled />
        </a-form-model-item>
        <a-form-model-item ref="goods_id" label="物品：" prop="goods_id" has-feedback>
          <a-select @change="getStock" v-model="form.goods_id" :options="goodsList" placeholder="请选择物品" allowClear v-if="modelTitle === '出库新增'" />
          <a-input v-model="form.goods_name" v-else disabled />
        </a-form-model-item>
        <a-form-model-item label="剩余库存" class="flex-center">
          <a-input :value="stock" placeholder="请输入司机" suffix="kg" disabled allowClear />
        </a-form-model-item>
        <a-form-model-item ref="driver_name" label="司机" prop="driver_name" class="flex-center">
          <a-input v-model="form.driver_name" placeholder="请输入司机" allowClear />
        </a-form-model-item>

        <a-form-model-item ref="weight" label="出库重量：" prop="weight">
          <a-input v-model="form.weight" placeholder="请输入入库数量" suffix="kg" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="merchant_id" label="出库至：" prop="merchant_id">
          <a-select v-model="form.merchant_id" :options="merchantList" @change="merchantChange" placeholder="请选择商家" allowClear v-if="modelTitle === '出库新增'" />
          <a-input v-model="form.merchant_name" v-else disabled />
        </a-form-model-item>
        <a-form-model-item ref="money" label="金额：" prop="money">
          <a-input v-model="form.money" placeholder="请输入金额" allowClear />
        </a-form-model-item>

        <a-form-model-item ref="remark" label="备注：" prop="remark">
          <a-input v-model="form.remark" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "SortingStationInAndOut",
  data() {
    return {
      delVisible: false,
      sortingList: [], //分拣站列表
      categoryList: [], // 品类列表
      merchantList: [], //商家列表
      goodsList: [], //物品列表
      type: [],
      house_name: "",
      btnValue: 1,
      tabList: [
        { name: "入库", value: 1, num: null },
        { name: "出库", value: 2, num: null }
      ],
      site_name: "",
      stock_no: "",
      order_no: "",
      dateString: [],
      start_time: "",
      over_time: "",
      dataSource: [], // 表格数据
      tableLoading: false, //表格
      delLoading: false,
      page: 1,
      total: 0,
      in_time: "",

      //新增编辑弹窗相关
      modelTitle: "出库新增",
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        site_name: "",
        category_name: "",
        goods_name: "",
        driver_name: "",
        weight: "",
        merchant_name: "",
        money: "",
        remark: "",
        merchant_id: undefined,
        category_id: undefined,
        site_id: undefined,
        goods_id: undefined
      },
      rules: {
        site_id: [{ required: true, message: "请选择分拣站", trigger: "blur" }],
        category_id: [{ required: true, message: "请选择品类", trigger: "change" }],
        goods_id: [{ required: true, message: "请选择物品", trigger: "blur" }],
        driver_name: [{ required: true, message: "请输入司机", trigger: "blur" }],
        weight: [{ required: true, message: "请输入出库重量", trigger: "blur" }],
        merchant_id: [{ required: true, message: "请选择商家", trigger: "blur" }]
      },
      id: -1,
      stock: 0
    }
  },
  created() {
    this.$com.sortingStationList(this, "sortingList") //分拣站列表
    this.$com.getCategorySelectList(this, "categoryList") // 品类列表
    this.$com.getMerchantList(this, "merchantList") //商家列表
    this.getTableList() //获取列表
  },
  methods: {
    handleChange(data) {
      this.getGoodsList() //物品列表
      console.log(data, "1111")
      this.form.category_id = data
      console.log(this.categoryList, "this.goodsList")
      this.categoryList.filter(e => {
        console.log(e, "e3")
        if (e.value === data) {
          this.form.category_name = e.label
        }
      })
    },
    merchantChange(data) {
      this.form.merchant_id = data
      this.merchantList.filter(e => {
        console.log(e, "e3")
        if (e.value === data) {
          this.form.merchant_name = e.label
        }
      })
    },
    //获取物品列表
    getGoodsList() {
      console.log(1111)
      this.$api.getGoodsList({ category_id: this.form.category_id }).then(res => {
        this.goodsList = res.data.map(item => {
          item.label = item.goods_name
          item.value = item.id
          return item
        })
      })
    },
    // 获取库存
    getStock(data) {
      let category_name = ""
      this.categoryList.forEach(item => {
        if (item.id == this.form.category_id) {
          category_name = item.category_name
        }
      })
      let goods_name = ""
      this.goodsList.forEach(item => {
        if (item.id == this.form.goods_id) {
          goods_name = item.goods_name
        }
      })
      this.getLeftStock(category_name, goods_name)

      this.form.goods_id = data
      // console.log(this.categoryList, "this.goodsList")
      this.goodsList.filter(e => {
        console.log(e, "e3")
        if (e.value === data) {
          this.form.goods_name = e.label
        }
      })
    },
    getLeftStock(category_name, goods_name) {
      let data = {
        site_info_id: this.form.site_id,
        category_name: category_name,
        goods_name: goods_name
      }
      this.$api.getGoodsStock(data).then(res => {
        this.stock = res.data.residue_stock || 0
      })
    },
    // 获取居民信息列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        site_name: this.site_name || "",
        start_time: this.start_time || "",
        over_time: this.over_time || "",
        house_name: this.house_name || "",
        page: this.page
      }
      this.tableLoading = true
      if (this.btnValue === 1) {
        this.$api.getSortingInList(data).then(res => {
          const dataSource = res.data.data.map(item => {
            item.key = item.id
            return item
          })
          this.tableLoading = false
          this.total = res.data.total
          this.dataSource = dataSource
        })
      } else if (this.btnValue === 2) {
        this.$api.getSortingOutList({ ...data, site_type: 2 }).then(res => {
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
    // 切换
    tabChange() {
      setTimeout(() => {
        this.getTableList(1)
      }, 500)
    },
    onChange(date, dateString) {
      this.start_time = dateString[0]
      this.over_time = dateString[1]
    },

    // 表格删除
    deleteData(record) {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除该内容吗?",
        onOk() {
          if (that.btnValue === 1) {
            // 入库删除
            // data.id = this.id.toString()
            that.$api
              .delSortingIn({ stock_no: record.stock_no })
              .then(res => {
                that.delLoading = false
                that.tableLoading = false
                that.getTableList()
                that.$message.info(res.msg)
                // that.selectedRowKeys = []
              })
              .catch(err => {
                that.delLoading = false
                that.tableLoading = false
              })
          } else if (that.btnValue === 2) {
            // 出库删除
            that.$api
              .delSortingOut({ id: record.id.toString() })
              .then(res => {
                that.delLoading = false
                that.tableLoading = false
                that.getTableList()
                that.$message.info(res.msg)
                // that.selectedRowKeys = []
              })
              .catch(err => {
                that.delLoading = false
                that.tableLoading = false
              })
          }
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
      this.form = {
        // site_name: "",
        category_name: "",
        goods_name: "",
        driver_name: "",
        weight: "",
        merchant_name: "",
        money: "",
        remark: "",
        merchant_id: undefined,
        category_id: undefined,
        site_id: undefined,
        goods_id: undefined
      }
      this.visible = true
      this.modelTitle = "出库新增"
      this.$validator.resetFields(this)
    },

    // 编辑
    edit(record) {
      this.id = record.id
      this.visible = true
      this.modelTitle = "出库编辑"
      this.stock = 0
      this.$api.viewSortingOut({ id: this.id }).then(res => {
        const category_name = res.data.category_name || ""
        const goods_name = res.data.goods_name || ""
        const driver_name = res.data.driver_name || ""
        const weight = res.data.weight || ""
        const merchant_name = res.data.merchant_name || ""
        const money = res.data.money || ""
        const remark = res.data.remark || ""
        const merchant_id = res.data.merchant_id || ""
        const category_id = res.data.category_id || ""
        const site_id = res.data.site_id || ""
        const site_name = res.data.site_name || ""
        const goods_id = res.data.goods_id || ""

        this.form.category_name = category_name
        this.form.goods_name = goods_name
        this.form.driver_name = driver_name
        this.form.weight = weight
        this.form.money = money
        this.form.remark = remark
        this.form.merchant_id = merchant_id
        this.form.category_id = category_id
        this.form.site_id = site_id
        this.form.site_name = site_name
        this.form.goods_id = goods_id
        this.form.merchant_name = merchant_name
        this.form.id = this.id

        // 展示库存
        this.getLeftStock(category_name, goods_name)
      })
    },
    // 弹窗确定
    handleOk() {
      // this.visible = false
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 库存验证
          if (this.form.weight > this.stock) {
            this.$message.warn("出库重量不能大于当前库存")
            return false
          }

          ;(this.modelTitle === "出库新增" ? this.$api.addSortingOut(this.form) : this.$api.editSortingOut(this.form)).then(res => {
            this.$message.info(res.msg)
            this.visible = false
            this.getTableList()
            this.form = {
              // site_name: "",
              category_name: "",
              goods_name: "",
              driver_name: "",
              weight: "",
              merchant_name: "",
              money: "",
              remark: "",
              merchant_id: undefined,
              category_id: undefined,
              site_id: undefined,
              goods_id: undefined
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
// #SortingStationInAndOut {
// }
</style>
