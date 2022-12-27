<template>
  <div id="MintpassRubbishDetail">
    <TyReturn></TyReturn>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="基础信息">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="名称"> {{ detail.canName }} </a-descriptions-item>
          <a-descriptions-item label="状态"> {{ detail.isOpen === 1 ? "正常" : "停止" }} </a-descriptions-item>
          <a-descriptions-item label="品牌"> {{ detail.canBrand }} </a-descriptions-item>
          <a-descriptions-item label="类型"> {{ detail.canType === 2 ? "智能" : "普通" }} </a-descriptions-item>
          <a-descriptions-item label="所属"> {{ detail.plotName }} </a-descriptions-item>
          <a-descriptions-item label="图片">
            <img :src="$com.showUpload() + detail.pictureUrl" class="img" @click="showPicture(detail.pictureUrl)" alt="暂无图片" />
          </a-descriptions-item>
          <a-descriptions-item label="位置"> {{ detail.address }} </a-descriptions-item>
          <a-descriptions-item label="容积"> {{ detail.volume }} </a-descriptions-item>
          <a-descriptions-item label="温度"> {{ detail.temperature }} </a-descriptions-item>
          <a-descriptions-item label="管理员"> </a-descriptions-item>
        </a-descriptions>
      </a-tab-pane>

      <a-tab-pane v-if="detail.canType === 2" key="2" tab="投放记录">
        <a-table size="middle" :data-source="putRecordDataSource" :pagination="false" :loading="putRecordTableLoading">
          <a-table-column title="投放居民" data-index="launchResident" align="center" :ellipsis="true" />
          <a-table-column title="投放子桶" data-index="canName" align="center" :ellipsis="true" />
          <a-table-column title="垃圾类型" data-index="typeName" align="center" :ellipsis="true" />
          <a-table-column title="投放重量(千克)" data-index="weight" align="center" :ellipsis="true" />
          <a-table-column title="积分单价" data-index="integralPrice" align="center" :ellipsis="true" />
          <a-table-column title="获得积分" data-index="integralFraction" align="center" :ellipsis="true" />
          <a-table-column title="投放时间" data-index="createTime" align="center" :ellipsis="true" />
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="putRecordPage" show-quick-jumper :total="putRecordTotal" @change="getMintpassRubbishPutRecord(curId, putRecordPage)" />
        </div>
      </a-tab-pane>

      <a-tab-pane v-if="detail.canType === 2" key="3" tab="状态记录">
        <a-table size="middle" :data-source="statusRecordDataSource" :columns="statusRecordColumns" :scroll="{ x: 1500 }" :pagination="false" :loading="statusRecordTableLoading">
          <a-table-column title="名称" data-index="site_name" align="center" :ellipsis="true" />
          <a-table-column title="名称" data-index="site_name" align="center" :ellipsis="true" />
          <a-table-column title="名称" data-index="site_name" align="center" :ellipsis="true" />
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="statusRecordPage" show-quick-jumper :total="statusRecordTotal" @change="getMintpassRubbishStatusRecord(curId, statusRecordPage)" />
        </div>
      </a-tab-pane>
    </a-tabs>

    <a-modal :visible="previewImageVisible" :width="500" :footer="null" @cancel="previewImageVisible = false">
      <div class="p20"><img alt="example" class="w100b" :src="previewImageUrl" /></div>
    </a-modal>
  </div>
</template>

<script>
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  name: "MintpassRubbishDetail",
  components: { TyReturn },
  data() {
    return {
      curId: null,
      detail: {},
      putRecordDataSource: [],
      putRecordTableLoading: false,
      putRecordPage: 1,
      putRecordTotal: 1,
      statusRecordDataSource: [],
      statusRecordColumns: [],
      statusRecordTableLoading: false,
      statusRecordPage: 1,
      statusRecordTotal: 1,
      previewImageUrl: "",
      previewImageVisible: false
    }
  },

  created() {
    if (this.$route.query.id) {
      this.curId = this.$route.query.id
      this.getData(this.curId)
    }
  },

  methods: {
    getData(id) {
      // 垃圾桶详情
      this.$api.getMintpassRubbishDetail({ id }).then(res => {
        this.detail = res.data
        if (res.data.canType === 2) {
          this.getMintpassRubbishPutRecord(id, 1)
          this.getMintpassRubbishStatusRecord(id, 1)
        }
      })
    },

    // 垃圾桶投放记录
    getMintpassRubbishPutRecord(id, page) {
      this.$api.getMintpassRubbishPutRecord({ id, pageNum: page }).then(res => {
        this.putRecordDataSource = res.data.data.map(item => {
          item.key = this.$utils.createUUID()
          return item
        })
        this.putRecordTotal = res.data.total
      })
    },

    // 垃圾桶状态记录
    getMintpassRubbishStatusRecord(id, page) {
      this.$api.getMintpassRubbishStatusRecord({ id, pageNum: page }).then(res => {
        this.statusRecordDataSource = res.data.data.list.map(item => {
          item.key = this.$utils.createUUID()
          return item
        })
        this.statusRecordColumns = res.data.data.column.map(item => {
          if (item.dataIndex === "updateTime") {
            item.fixed = "left"
          }
          item.key = item.dataIndex
          item.align = "center"
          if (item.children) {
            item.children.forEach(sitem => {
              sitem.align = "center"
              sitem.key = sitem.dataIndex
            })
          }
          return item
        })
        this.statusRecordTotal = res.data.total

        console.log(this.statusRecordColumns, "this.statusRecordColumns")
      })
    },

    // 列表查看图片
    showPicture(picture_url = "") {
      this.previewImageUrl = this.$com.showUpload() + picture_url
      this.previewImageVisible = true
    }
  }
}
</script>

<style lang="less">
#MintpassRubbishDetail {
  .img {
    height: 24px;
    width: auto;
  }
}
</style>
