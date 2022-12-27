<template>
  <div id="RecyClingPriceListOperation">
    <div>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">价格表名称：</div>
      </a-space>
      <div class="plr20 pb20 ">
        <a-input v-model="name" class="w300" placeholder="请输入价格表名称" />
      </div>
    </div>

    <div>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">设施类型：</div>
      </a-space>
      <div class="plr20 pb20 ">
        <a-radio-group v-model="type" @change="typeChange">
          <a-radio :disabled="query.type === 'edit'" :value="1">环保屋</a-radio>
          <a-radio :disabled="query.type === 'edit'" :value="2">智能桶</a-radio>
          <a-radio :disabled="query.type === 'edit'" :value="3">小区及事业单位</a-radio>
        </a-radio-group>
      </div>
    </div>

    <div>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">{{ type === 1 ? "环保屋：" : type === 2 ? "智能桶：" : "小区及事业单位" }}</div>
      </a-space>
      <div class="plr20 mb20">
        <a-select v-model="facilitiesValue" mode="multiple" placeholder="请选择" class="w100b" :filterOption="filterOption">
          <a-select-option v-for="item in facilitiesList" :key="item.house_id"> {{ item.house_name }} </a-select-option>
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu" />
            <a-divider class="mtb5" />
            <a-checkbox class="m10" v-model="selectAllValue" @change="selectAll">全选</a-checkbox>
          </div>
        </a-select>
      </div>
    </div>

    <div>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">物品：</div>
      </a-space>
      <div class="oh plr20 w100b">
        <a-table
          size="middle"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ y: 320 }"
          :data-source="dataSource"
          :pagination="false"
          :loading="tableLoading"
        >
          <a-table-column title="垃圾类型" data-index="category_name" align="center" :ellipsis="true" />
          <a-table-column title="物品名称" data-index="goods_name" align="center" :ellipsis="true" />
          <a-table-column v-if="type === 2" title="单次投放量" data-index="weight" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-input-number id="inputNumber1" size="small" class="w100" v-model="record.weight" :min="0" :formatter="$antd.limitNumber" :parser="$antd.limitNumber" /> / 千克
            </template>
          </a-table-column>
          <a-table-column title="现金价格" data-index="cash_price" align="center">
            <template slot-scope="text, record"> <a-input-number id="inputNumber2" size="small" class="w100" v-model="record.cash_price" :min="0" :step="0.01" /> 元 / 千克 </template>
          </a-table-column>
          <a-table-column title="积分价格" data-index="integral_price" align="center">
            <template slot-scope="text, record"> <a-input-number id="inputNumber3" size="small" class="w100" v-model="record.integral_price" :min="0" :step="0.01" /> 积分 / 千克 </template>
          </a-table-column>
        </a-table>
      </div>
    </div>
    <div class="tac mt30">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" class="ml20" @click="save">保存</a-button>
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js"
export default {
  name: "RecyClingPriceListOperation",
  mixins: [mixins.TableMixins],
  props: { query: Object },
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    return {
      name: "",
      type: 1,
      selectAllValue: false, // 全选状态
      facilitiesValue: [], // 选中的设施
      facilitiesList: []
    }
  },
  created() {
    if (this.query.type === "edit") this.type = +this.query.no_type
    // 获取列表
    this.getTableList()
  },
  methods: {
    // 获取数据
    getTableList() {
      this.tableLoading = true
      const data = { type: this.type, price_table_no: this.query.no || "" }
      this.$api.getPriceOrderInfo(data).then(res => {
        this.dataSource = res.data.goods.all_goods.map(item => {
          item.key = item.goods_id
          return item
        })
        this.facilitiesList = res.data.house.list
        if (this.query.type === "edit") {
          this.name = res.data.price_info.price_table_name
          this.facilitiesValue = res.data.house.house_id
          this.selectedRowKeys = res.data.goods.goods_id
        }
        this.tableLoading = false
      })
    },

    // 切换设施类型
    typeChange() {
      this.selectAllValue = false
      this.facilitiesValue = []
      this.selectedRowKeys = []
      this.getTableList()
    },

    // 全选
    selectAll(e) {
      if (this.selectAllValue === true) {
        this.facilitiesValue = this.facilitiesList.map(item => item.house_id)
      } else {
        this.facilitiesValue = []
      }
    },

    // 取消
    cancel() {
      this.$router.go(-1)
    },

    // 保存
    save() {
      if (this.name === "") {
        this.$message.info("请输入价格表名称")
        return false
      }
      if (this.facilitiesValue.length < 1) {
        this.$message.info(`请选择${this.type === 1 ? "环保屋" : this.type === 2 ? "智能桶" : "小区或事业单位"}`)
        return false
      }
      if (this.selectedRowKeys.length < 1) {
        this.$message.info("请选择物品")
        return false
      }
      let house_info = this.facilitiesList.filter(item => {
        if (this.facilitiesValue.indexOf(item.house_id) !== -1) {
          return item
        }
      })
      let good_price = this.dataSource.filter(item => {
        if (this.selectedRowKeys.indexOf(item.goods_id) !== -1) {
          return item
        }
      })
      const data = {
        price_table_name: this.name,
        type: this.type,
        house_info,
        good_price
      }
      if (this.query.type === "edit") data.price_table_no = this.query.no
      ;(this.query.type === "edit" ? this.$api.putPriceOrder(data) : this.$api.addPriceOrder(data)).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.$router.go(-1)
        } else this.$message.error(res.msg)
      })
    },
    // 下拉选择筛选过滤
    filterOption(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    }
  }
}
</script>

<style lang="less">
// #RecyclingPriceListOperation {}
</style>

<style scoped>
.facility-title {
  margin-bottom: 10px;
}
</style>
