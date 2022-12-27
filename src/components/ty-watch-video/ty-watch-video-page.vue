<template>
  <div id="TyWatchVideoPage">
    <a-space class="facility-title">
      <div class="facility-title-box"></div>
      <div class="facility-title-text">视频监控</div>
    </a-space>

    <a-row type="flex" :gutter="[36, 36]" justify="space-between">
      <a-col :span="12">
        <a-row type="flex" :gutter="[36, 36]" justify="start">
          <a-col :xs="12" :xl="8">
            <div class="box" :class="checked === -1 ? 'checkedBox' : 'unCheckedBox'" @click="checkState(-1)">
              <div class="box-text">{{ type === 1 ? "分拣站" : "环保屋" }}</div>
              <div class="box-num">{{ allTotal }}</div>
            </div>
          </a-col>
          <a-col :xs="12" :xl="8">
            <div class="box" :class="checked === 1 ? 'checkedBox' : 'unCheckedBox'" @click="checkState(1)">
              <div class="box-text">在线</div>
              <div class="box-num">{{ onLine }}</div>
            </div>
          </a-col>
          <a-col :xs="12" :xl="8">
            <div class="box" :class="checked === 0 ? 'checkedBox' : 'unCheckedBox'" @click="checkState(0)">
              <div class="box-text">离线</div>
              <div class="box-num">{{ offLine }}</div>
            </div>
          </a-col>
        </a-row>

        <a-space direction="vertical" size="large" class="w100b mt30">
          <div class="oh">
            <a-space class="fl" size="middle">
              <div>
                <span>名称：</span>
                <div class="dib"><a-input v-model="stationName" placeholder="请输入名称" allowClear /></div>
              </div>
              <div>
                <span>管理员：</span>
                <div class="dib"><a-input v-model="operator" placeholder="请输入管理员" allowClear /></div>
              </div>

              <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
            </a-space>
          </div>
          <div class="oh w100b">
            <a-space direction="vertical" class="w100b">
              <a-space direction="vertical" class="w100b">
                <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
                  <a-table-column :title="type === 1 ? '分拣中心' : '环保屋'" data-index="stationName" align="center" :ellipsis="true" />
                  <a-table-column title="管理员" data-index="operator" align="center" :ellipsis="true" />
                  <a-table-column title="播放/暂停" data-index="option" align="center" :ellipsis="true">
                    <template slot-scope="text, record">
                      <a-button type="link" size="small" :disabled="record.isOnline === 0" @click="clickPlay(record.id)">播放</a-button>
                    </template>
                  </a-table-column>
                </a-table>
                <div class="flex-center mt30">
                  <a-pagination v-model="page" show-quick-jumper :total="total" @change="getTableList()" />
                </div>
              </a-space>
            </a-space>
          </div>
        </a-space>
      </a-col>

      <a-col :span="12">
        <TyWatchVideo ref="TyWatchVideo" :type="type" :id="id"></TyWatchVideo>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js"
import TyWatchVideo from "@/components/ty-watch-video/ty-watch-video"
export default {
  name: "TyWatchVideoPage",
  mixins: [mixins.TableMixins],
  components: { TyWatchVideo },
  data() {
    return {
      checked: -1,
      stationName: "", // 名称
      operator: "", // 管理员
      offLine: 0,
      onLine: 0,
      allTotal: 0,
      id: 0
    }
  },
  props: {
    type: {
      type: Number,
      default: 1 // 1分拣站   2环保屋
    }
  },
  created() {
    this.getOnlineNum()
    this.getTableList(1)
  },

  methods: {
    // 获取在线数量
    getOnlineNum() {
      this.$api.getOnlineNum({ type: this.type }).then(res => {
        this.offLine = res.data.offLine || 0
        this.onLine = res.data.onLine || 0
        this.allTotal = res.data.total || 0
      })
    },

    // 选择状态
    checkState(state) {
      if (!this.tableLoading) {
        this.checked = state
        this.getTableList()
      }
    },

    // 获取表格数据
    getTableList(page) {
      if (page) this.page = page
      const data = {
        stationName: this.stationName || "",
        operator: this.operator || "",
        pageNum: this.page,
        isOnline: this.checked === -1 ? "" : this.checked,
        type: this.type
      }
      this.tableLoading = true

      this.$api.getWatchVideoList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 点击播放
    clickPlay(id) {
      this.id = id
      this.$refs.TyWatchVideo.startVideo(id)
    }
  }
}
</script>

<style lang="less">
#TyWatchVideoPage {
  .facility-title {
    margin-left: 0;
  }
  .box {
    background: #ffffff;
    box-shadow: 0px 2px 8px 2px rgba(130, 130, 130, 0.15);
    border-radius: 8px;
    border: 1px solid #f2f2f2;
    height: 120px;
    display: flex;
    align-items: center;
    flex-flow: column;
    justify-content: space-around;
    padding: 15px 0;
    font-size: 16px;
    cursor: pointer;
    .box-num {
      color: #31c27c;
      font-weight: 700;
      font-size: 24px;
    }
  }

  .checkedBox {
    background-color: #31c27c;
    .box-text {
      color: #fff;
    }
    .box-num {
      color: #fff;
    }
  }

  .unCheckedBox {
    background-color: #fff;
    .box-text {
      color: #2c3e50;
    }
    .box-num {
      color: #31c27c;
    }
  }
}
</style>
