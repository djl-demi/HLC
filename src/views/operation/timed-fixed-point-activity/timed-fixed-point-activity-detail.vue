<template>
  <div id="TimedFixedPointActivityDeyail">
    <!-- 定时定点活动详情 -->
    <TyReturn></TyReturn>

    <a-tab-pane v-for="(item, key) in status_select" :key="key">
      <span slot="tab">
        <span style="font-size: 16px; vertical-align: middle">{{ item.name }}</span>
      </span>
    </a-tab-pane>
    <a-tabs type="card" v-model="menu_select" size="small">
      <a-tab-pane v-for="(item, key) in menuList" :key="key" :tab="item.name"> </a-tab-pane>
    </a-tabs>
    <a-col>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">
          {{ menuList[menu_select].name }}
          <div class="facility-status">
            <div class="status-title">状态：</div>
            <a-select v-model="feedbackVisit" :options="feedbackVisitList" placeholder="全部" allowClear class="feedbackVisit" />
          </div>
        </div>
      </a-space>
      <a-space v-if="menu_select === 0">
        <a-descriptions layout="horizontal" class="mlr30">
          <a-descriptions-item label="活动主题">{{ data.activity_name }}</a-descriptions-item>
          <a-descriptions-item label="负责人"> {{ data.site_account_name }} </a-descriptions-item>
          <a-descriptions-item label="开始时间">{{ data.start_time }} </a-descriptions-item>
          <a-descriptions-item label="地址">{{ data.address }} </a-descriptions-item>
          <a-descriptions-item label="状态">{{ data.state_text }} </a-descriptions-item>
          <a-descriptions-item label="结束时间">{{ data.end_time }} </a-descriptions-item>
          <a-descriptions-item label="审核人">{{ data.examine_name }} </a-descriptions-item>
          <a-descriptions-item label="操作人">{{ data.operator_name }} </a-descriptions-item>
          <a-descriptions-item label="创建人">{{ data.create_name }}</a-descriptions-item>
          <a-descriptions-item label="审核时间"> {{ data.examine_time }}</a-descriptions-item>
          <a-descriptions-item label="取消时间">{{ data.cancel_time }} </a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ data.create_time }}</a-descriptions-item>
          <a-descriptions-item label="成员">{{ data.activity_people }} </a-descriptions-item>
          <a-descriptions-item label="活动描述">{{ data.activity_description }} </a-descriptions-item>
          <a-descriptions-item label="仓库">{{ data.warehouse }} </a-descriptions-item>
          <a-descriptions-item label="图片">
            <!-- {{ data.pic_url }} -->
            <img :src="data.pic_url" style="width: 50px;height: 50px;" alt="暂无图片" />
            <!-- <img class="img" @click="showPicture(data.pic_url)" :src="pic_url ? $com.showUpload() + pic_url : ''" /> -->
          </a-descriptions-item>
        </a-descriptions>
      </a-space>
      <a-space v-if="menu_select === 1">
        <a-descriptions layout="horizontal" class="mlr30">
          <a-descriptions-item label="负责人">{{ data.activity_name }}</a-descriptions-item>
          <a-descriptions-item label="成员"> {{ data.site_account_name }} </a-descriptions-item>
          <a-descriptions-item label="审核时间">{{ data.start_time }} </a-descriptions-item>
          <a-descriptions-item label="完成时间">{{ data.address }} </a-descriptions-item>
          <a-descriptions-item label="取消时间">{{ data.state_text }} </a-descriptions-item>
        </a-descriptions>
      </a-space>
      <a-table size="middle" :data-source="dataSource" :loading="tableLoading" v-if="menu_select === 2">
        <a-table-column key="plot_name" title="姓名" data-index="plot_name" align="center" :ellipsis="true" />
        <a-table-column key="region" title="签到类型" data-index="region" align="center" :ellipsis="true" />
        <a-table-column key="street" title="签到时间" data-index="street" align="center" :ellipsis="true" />
        <a-table-column key="community" title="定位地址" data-index="community" align="center" :ellipsis="true" />
        <a-table-column key="total_number" title="图片" data-index="total_number" align="center" :ellipsis="true" />
        <a-table-column key="at_number1" title="拍摄时间" data-index="at_number6" align="center" :ellipsis="true" />
      </a-table>
      <a-space direction="vertical" style="width: 100%" v-if="menu_select === 3">
        <a-table size="middle" :data-source="dataSource" :scroll="{ y: 450 }" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="gift_name" title="名称" data-index="gift_name" align="center" :ellipsis="true" />
          <a-table-column key="specs" title="规格" data-index="specs" align="center" :ellipsis="true" />
          <a-table-column key="brand" title="品牌" data-index="brand" align="center" :ellipsis="true" />
          <a-table-column key="integral_price" title="积分价格" data-index="integral_price" align="center" :ellipsis="true" />
          <a-table-column key="total_number" title="申请数量" data-index="total_number" align="center" :ellipsis="true" />
          <a-table-column key="stock_number" title="出库数量" data-index="stock_number" align="center" :ellipsis="true" />
          <a-table-column key="exchange_num" title="兑换数量" data-index="exchange_num" align="center" :ellipsis="true" />
          <a-table-column key="number" title="剩余数量" data-index="number" align="center" :ellipsis="true" />
        </a-table>
      </a-space>
      <a-collapse :default-active-key="['1']" :bordered="false" v-if="menu_select === 4">
        <a-collapse-panel key="1" header="This is panel header 1"> </a-collapse-panel>
        <a-collapse-panel key="2" header="This is panel header 2" :disabled="false"> </a-collapse-panel>
        <a-collapse-panel key="3" header="This is panel header 3"> </a-collapse-panel>
      </a-collapse>
      <a-space direction="vertical" style="width: 100%" v-if="menu_select === 5">
        <a-table size="middle" :data-source="data.integral_exchange" :pagination="false" :scroll="{ y: 450 }" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="exchange_no" title="编号" data-index="exchange_no" align="center" :ellipsis="true" />
          <a-table-column key="user_name" title="居民姓名" data-index="user_name" align="center" :ellipsis="true" />
          <a-table-column key="phone" title="联系方式" data-index="phone" align="center" :ellipsis="true" />
          <a-table-column key="gift_name" title="兑换礼品名称" data-index="gift_name" align="center" :ellipsis="true" />
          <a-table-column key="unit_integral" title="积分单价" data-index="unit_integral" align="center" :ellipsis="true" />
          <a-table-column key="num" title="数量" data-index="num" align="center" :ellipsis="true" />
          <a-table-column key="integral" title="消耗积分" data-index="integral" align="center" :ellipsis="true" />
          <a-table-column key="operator_name" title="操作人" data-index="operator_name" align="center" :ellipsis="true" />
          <a-table-column key="update_time" title="兑换时间" data-index="update_time" align="center" :ellipsis="true" />
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-space>
      <a-space direction="vertical" style="width: 100%" v-if="menu_select === 6">
        <a-table size="middle" :data-source="data.integral_exchange" :pagination="false" :scroll="{ y: 450 }" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="user_name" title="居民姓名" data-index="user_name" align="center" :ellipsis="true" />
          <a-table-column key="phone" title="联系方式" data-index="phone" align="center" :ellipsis="true" />
          <a-table-column key="gift_name" title="兑换礼品名称" data-index="gift_name" align="center" :ellipsis="true" />
          <a-table-column key="unit_integral" title="积分单价" data-index="unit_integral" align="center" :ellipsis="true" />
          <a-table-column key="num" title="数量" data-index="num" align="center" :ellipsis="true" />
          <a-table-column key="integral" title="消耗积分" data-index="integral" align="center" :ellipsis="true" />
          <a-table-column key="operator_name" title="操作人" data-index="operator_name" align="center" :ellipsis="true" />
          <a-table-column key="update_time" title="兑换时间" data-index="update_time" align="center" :ellipsis="true" />
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-space>
      <a-space direction="vertical" style="width: 100%" v-if="menu_select === 7">
        <a-table size="middle" :data-source="data.integral_exchange" :pagination="false" :scroll="{ y: 450 }" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="exchange_no" title="操作人" data-index="exchange_no" align="center" :ellipsis="true" />
          <a-table-column key="exchange_no1" title="图片" data-index="exchange_no" align="center" :ellipsis="true" />
          <a-table-column key="exchange_no2" title="上传时间" data-index="exchange_no" align="center" :ellipsis="true" />
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-space>
      <a-space direction="vertical" style="width: 100%" v-if="menu_select === 8">
        <a-table size="middle" :data-source="data.activity_record" :scroll="{ y: 450 }" :loading="tableLoading" :rowKey="record => record.id">
          <a-table-column key="operator_name" title="操作人" data-index="operator_name" align="center" :ellipsis="true" />
          <a-table-column key="create_time" title="时间" data-index="create_time" align="center" :ellipsis="true" />
          <a-table-column key="create_time1" title="操作" data-index="create_time" align="center" :ellipsis="true" />
          <a-table-column key="remark" title="描述" data-index="remark" align="center" :ellipsis="true" />
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-space>
    </a-col>
  </div>
</template>

<script>
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  components: { TyReturn },
  name: "TimedFixedPointActivityDeyail",
  props: {
    query: Object,
    params: Object
  },
  data() {
    return {
      status_select: 0,
      statusList: [
        { name: "已创建", value: 1 },
        { name: "已开启", value: 2 },
        { name: "已结束", value: 3 },
        { name: "已取消", value: 4 }
      ],
      menu_select: 0,
      menuList: [
        { name: "基本信息", value: 1 },
        { name: "时间任务轴", value: 2 },
        { name: "签到信息", value: 3 },
        { name: "礼品信息", value: 4 },
        { name: "回访信息", value: 5 },
        { name: "兑换信息", value: 6 },
        { name: "回收信息", value: 7 },
        { name: "时光墙", value: 8 },
        { name: "操作记录", value: 9 }
      ],
      data: {},
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,
      id: 1,
      feedbackVisit: undefined,
      feedbackVisitList: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "已回访"
        },
        {
          value: 2,
          label: "未回访"
        }
      ]
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      this.id = this.query.id || ""
      this.tableLoading = true
      this.$api.viewActivity({ id: this.id }).then(res => {
        res.data.pic_url = this.$com.showUpload() + res.data.pic_url
        this.data = res.data
        this.data.activity_gift.map(item => {
          item.key = item.id
          item.stock_number = `${item.stock_number}/${item.unit}`
          return item
        })
        this.tableLoading = false
      })
    },
    // 查看图片
    showPicture(picture_url = "") {
      this.previewImage = this.$com.showUpload() + picture_url
      // this.previewVisible = true
    }
  }
}
</script>

<style lang="less">
#TimedFixedPointActivityDeyail {
  .img {
    height: 24px;
  }
}
.feedbackVisit {
  width: 100px;
}
.facility-status {
  display: flex;
  font-weight: normal;
  font-size: 14px;
  align-content: center;
  margin-left: 20px;
  height: 30px;
}
.status-title {
  display: flex;
  align-items: center;
}
.facility-title-text {
  display: flex;
  align-content: center;
}
</style>
