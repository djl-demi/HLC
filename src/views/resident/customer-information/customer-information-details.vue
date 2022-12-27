<template>
  <div id="CustomerInformationDetails">
    <TyReturn></TyReturn>
    <a-space direction="vertical" size="large" style="width: 100%">
      <a-tabs type="card" v-model="menu_select" size="small" @change="tabChange">
        <a-tab-pane v-for="(item, key) in menuList" :key="key" :tab="item"></a-tab-pane>
      </a-tabs>
      <a-row>
        <a-col>
          <a-space v-if="menu_select === 0">
            <a-descriptions layout="horizontal" class="mlr30 basic-info">
              <a-descriptions-item label="姓名"> {{ data.user_name }} </a-descriptions-item>
              <a-descriptions-item label="楼号"> {{ data.building_no }} </a-descriptions-item>
              <a-descriptions-item label="累计回收量">{{ data.recycled }} kg</a-descriptions-item>
              <a-descriptions-item label="电话"> {{ data.phone }} </a-descriptions-item>
              <a-descriptions-item label="单元"> {{ data.element }} </a-descriptions-item>
              <a-descriptions-item label="累计回收次数">{{ data.degree }} </a-descriptions-item>
              <a-descriptions-item label="小区"> {{ data.plot_name }} </a-descriptions-item>
              <a-descriptions-item label="门牌"> {{ data.house_number }} </a-descriptions-item>
              <a-descriptions-item label="垃圾分类总金额"> {{ data.total_money }} 元</a-descriptions-item>
              <a-descriptions-item label="地址"> {{ `${data.province_name}${data.city_name}${data.area_name}` }}</a-descriptions-item>
              <a-descriptions-item label="居民二维码"><div ref="qrCodeUrl" class="qrCode"></div></a-descriptions-item>
              <a-descriptions-item label="居民人脸照片" style="position:relative">
                <div class="picurl-list"><img v-if="data.face_pic" :src="(/http|https/.test(data.face_pic) ? '' : $com.showUpload()) + data.face_pic" @click="showPicture(data.face_pic)" /></div>
              </a-descriptions-item>
            </a-descriptions>
          </a-space>

          <a-space class="facility-title" v-if="menu_select === 1">
            <div class="flex-vertical-table">
              <div>
                <a-descriptions layout="horizontal">
                  <a-descriptions-item label="积分总额"> {{ data.total_integral }}</a-descriptions-item>
                  <a-descriptions-item label="兑换总额"> {{ data.convert }} </a-descriptions-item>
                  <a-descriptions-item label="剩余积分"> {{ data.integral }} </a-descriptions-item>
                  <a-descriptions-item label="垃圾分类获取积分数">{{ (Number(data.total_integral) - Number(data.out_integral)).toFixed(2) }} </a-descriptions-item>
                  <a-descriptions-item label="资源回收获取积分数">{{ data.out_integral }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div>
                <a-table size="middle" :data-source="changedetailData" :loading="changedetailTableLoading" :rowKey="record => record.id" :pagination="false">
                  <a-table-column key="type_text" title="积分类型" data-index="type_text" align="center" :ellipsis="true" />
                  <a-table-column key="integral" title="积分" data-index="integral" align="center" :ellipsis="true">
                    <template slot-scope="text, record">
                      <div :class="isPositive(record.integral) ? 'red' : 'green'">{{ record.integral }}</div>
                    </template>
                  </a-table-column>
                  <a-table-column key="create_time" title="时间" data-index="create_time" align="center" :ellipsis="true" />
                  <a-table-column key="remark" title="原因" data-index="remark" align="center" :ellipsis="true" />
                </a-table>
                <div class="flex-center mt30">
                  <a-pagination v-model="changedetailPage" show-quick-jumper :total="changedetailTotal" @change="changedetail" />
                </div>
              </div>
            </div>
          </a-space>
          <a-space direction="vertical" v-if="menu_select === 2">
            <a-table size="middle" :data-source="exchangeData" :loading="exchangeTableLoading" :rowKey="record => record.id" :pagination="{ pageSize: 10 }">
              <a-table-column key="create_time" title="兑换时间" data-index="create_time" align="center" :ellipsis="true" />
              <a-table-column key="merchandise_name" title="兑换物品" data-index="merchandise_name" align="center" :ellipsis="true" />
              <a-table-column key="unit_integral" title="单价" data-index="unit_integral" align="center" :ellipsis="true" />
              <a-table-column key="num" title="兑换数量" data-index="num" align="center" :ellipsis="true" />
              <a-table-column key="integral" title="支付积分" data-index="integral" align="center" :ellipsis="true" />
              <a-table-column key="state_text" title="状态" data-index="state_text" align="center" :ellipsis="true" />
            </a-table>
          </a-space>
          <a-space direction="vertical" v-if="menu_select === 3">
            <a-table size="middle" :data-source="orderData" :pagination="false" :loading="orderTableLoading" :rowKey="record => record.key">
              <a-table-column key="stock_no" title="订单编号" data-index="stock_no" align="center" :ellipsis="true" :width="200" />
              <a-table-column key="goods_name" title="回收物品" data-index="goods_name" align="center" :ellipsis="true" />
              <a-table-column key="net_weight" title="回收重量" data-index="net_weight" align="center" :ellipsis="true" />
              <a-table-column key="reference_price" title="现金单价" data-index="reference_price" align="center" :ellipsis="true" />
              <a-table-column key="integral_price" title="积分单价" data-index="integral_price" align="center" :ellipsis="true" />
              <a-table-column key="real_price" title="现金回收总额" data-index="real_price" align="center" :ellipsis="true" />
              <a-table-column key="integral" title="积分回收总额" data-index="integral" align="center" :ellipsis="true" />
              <a-table-column key="create_time" title="下单时间" data-index="create_time" align="center" :ellipsis="true" />
              <a-table-column key="stock_time" title="完成时间" data-index="stock_time" align="center" :ellipsis="true" />
              <a-table-column key="status" title="状态" data-index="status" align="center" :ellipsis="true"> </a-table-column>
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="orderPage" show-quick-jumper :total="orderTotal" @change="orderCustomerInfo()" />
            </div>
          </a-space>
          <a-space direction="vertical" v-if="menu_select === 4">
            <a-table size="middle" :data-source="icCardData" :pagination="false" :loading="icCardTableLoading" :rowKey="record => record.key">
              <a-table-column key="update_time" title="绑卡日期" data-index="update_time" align="center" :ellipsis="true" :width="200" />
              <a-table-column key="ic_card_number" title="卡号" data-index="ic_card_number" align="center" :ellipsis="true" />
              <a-table-column key="state_text" title="状态" data-index="state_text" align="center" :ellipsis="true" />
              <a-table-column key="create_name" title="开卡人" data-index="create_name" align="center" :ellipsis="true" />
              <a-table-column key="report_loss_name" title="挂失人" data-index="report_loss_name" align="center" :ellipsis="true" />
            </a-table>
            <div class="flex-center mt30">
              <a-pagination v-model="icCardPage" show-quick-jumper :total="icCardTotal" @change="getICCard()" />
            </div>
          </a-space>
        </a-col>
      </a-row>
    </a-space>
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="(/http|https/.test(picUrl) ? '' : $com.showUpload()) + picUrl" alt="外观" class="picture w100b" />
    </a-modal>
  </div>
</template>

<script>
import QRCode from "qrcodejs2"
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  name: "CustomerInformationDetails",
  components: {
    TyReturn
  },
  computed: {
    isPositive() {
      return function(data) {
        return Number(data) > 0
      }
    }
  },
  data() {
    return {
      data: [],
      changedetailData: [],
      changedetailTableLoading: false,
      changedetailPage: 1,
      changedetailTotal: 0,
      exchangeData: [], //兑换记录表格
      orderData: [], //订单记录表格
      icCardData: [],
      icCardPage: 1,
      icCardTotal: 0,
      exchangeTableLoading: false,
      tableLoading2: false,
      exchangeTotal: 1,
      exchangePage: 1,
      orderPage: 1,
      orderTotal: 1,
      orderTableLoading: false,
      menu_select: 0,
      icCardTableLoading: false,
      menuList: ["基本信息", "积分明细", "兑换记录", "订单记录", "居民IC卡"],
      picUrl: null,
      previewVisible: false,
      pageSize: 10
    }
  },
  props: {
    query: Object,
    params: Object
  },
  created() {
    this.id = this.query.id || ""
    this.viewCustomerInformation(0)
  },
  mounted() {},
  methods: {
    // 预览大图
    showPicture(item) {
      this.picUrl = item
      this.previewVisible = true
    },
    imgCancel() {
      // 隐藏图片展示
      this.previewVisible = false
    },
    tabChange(e) {
      switch (e) {
        case 0:
          this.viewCustomerInformation(0)
          break
        case 1:
          this.viewCustomerInformation(1)
          this.changedetail()
          break
        case 2:
          this.exchangeCustomerInfo()
          break
        case 3:
          this.orderCustomerInfo()
          break
        case 4:
          this.getICCard()
          break
      }
      // this.selectedRowKeys = []
    },
    changedetail(page) {
      if (page == undefined) {
        page = 1
      }
      this.changedetailTableLoading = true
      this.changedetailData = []
      this.$api.changedetail({ userid: this.id, page: page }).then(res => {
        this.changedetailData = res.data.data
        this.changedetailTableLoading = false

        this.changedetailTotal = res.data.total
      })
    },
    viewCustomerInformation(tabId) {
      this.$api.viewCustomerInformation({ id: this.id }).then(res => {
        this.data = res.data
        if (tabId === 0) {
          this.creatQrCode(res.data.qrcode)
        }
      })
    },
    getICCard() {
      this.icCardTableLoading = true
      this.icCardData = []
      this.$api.getICCard({ user_id: this.id, page: this.icCardPage, page_size: this.pageSize }).then(res => {
        let data = res.data.data
        data.forEach((item, key) => {
          item.key = key
        })
        this.icCardData = data
        this.icCardTableLoading = false
        this.icCardTotal = res.data.total
      })
    },
    creatQrCode(code) {
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        width: 100,
        height: 100,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.L, // 容错率，L/M/H
        text: code
      })
    },
    back() {
      this.$router.go(-1)
    },
    // 获取积分明细
    exchangeCustomerInfo() {
      this.exchangeTableLoading = true
      this.exchangeData = []
      this.$api.exchangeCustomerInfo({ user_id: this.id, page: this.exchangePage }).then(res => {
        res.data.integral_exchange.data.forEach(item => {
          item.exchange_detail.forEach((iitem, key) => {
            iitem.state_text = item.state_text
            this.exchangeData.push(iitem)
          })
        })
        console.log(this.exchangeData)
        this.exchangeTableLoading = false
        this.exchangeTotal = res.data.integral_exchange.total
      })
    },

    // 获取兑换记录
    orderCustomerInfo() {
      this.orderTableLoading = true
      this.orderData = []
      this.$api.orderCustomerInfo({ user_id: this.id, page: this.orderPage, page_size: this.pageSize }).then(res => {
        let data = res.data.data
        data.forEach((e, key) => {
          e.key = key
        })
        this.orderData = data
        this.orderTableLoading = false
        this.orderTotal = res.data.total
      })
    }
  }
}
</script>

<style lang="less" scoped>
#CustomerInformationDetails {
  .line {
    width: 100%;
    height: 1px;
    background: #bdbdbd;
  }
}

.basic-info {
  position: relative;
  .ant-descriptions-view {
    overflow: visible;
  }
  .ant-descriptions-item {
    position: relative;
  }
}

.qrCode {
  position: absolute;
  bottom: -65px;
}

.picurl-list {
  position: absolute;
  bottom: -65px;
  height: 100px;
  width: 100px;
  overflow: hidden;
  margin: 0 auto;
  img {
    max-width: 100px;
    max-height: 100px;
  }
}

.flex-vertical-table {
  display: flex;
  flex-direction: column;
}
.red {
  color: rgb(217, 0, 27);
}
.green {
  color: rgb(44, 168, 108);
}

.ant-table-pagination.ant-pagination {
  display: flex;
  justify-content: center;
  margin: 16px auto;
}
</style>
