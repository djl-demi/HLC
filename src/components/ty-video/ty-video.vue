<template>
  <div id="TyVideo">
    <a-tabs v-model="tabsValue">
      <a-tab-pane key="live" tab="查看直播">
        <div class="p30">
          <video id="liveBox" controls autoplay width="100%" height="700px" :poster="posterSrc"></video>
        </div>
      </a-tab-pane>

      <!-- <a-tab-pane key="playback" force-render tab="视频回放">
        <a-row align="middle" justify="space-around" class="mt20">
          <a-col :span="12">
            <a-space direction="vertical" size="large" class="w100b">
              <div class="oh">
                <span>日期：</span>
                <a-range-picker v-model="filter.time" format="YYYY-MM-DD" />
                <a-button type="primary" class="fr" @click="getTableList(1)">搜索</a-button>
              </div>
              <div>
                <a-table size="middle" :data-source="dataSource" :loading="tableLoading" :pagination="false">
                  <a-table-column title="序号" data-index="simNo" align="center" />
                  <a-table-column title="开始时间" data-index="startTime" align="center" />
                  <a-table-column title="结束时间" data-index="endTime" align="center" />
                  <a-table-column title="文件大小(M)" data-index="size" align="center" :width="100" />
                  <a-table-column key="operation" title="操作" data-index="operation" align="center" :width="80">
                    <template slot-scope="text, record">
                      <a-button type="link" size="small" @click="showDetails(record)">播放</a-button>
                    </template>
                  </a-table-column>
                </a-table>
                <div class="flex-center mt30 mb20">
                  <a-pagination v-model="filter.page" show-quick-jumper :total="total" @change="getTableList()" />
                </div>
              </div>
            </a-space>
          </a-col>
          <a-col :span="12">
            <video id="historyBox" controls autoplay width="100%" height="auto" class="pl20" :poster="posterSrc"></video>
          </a-col>
        </a-row>
      </a-tab-pane> -->
    </a-tabs>
  </div>
</template>

<script>
import flvjs from "flv.js"
export default {
  name: "TyVideo",
  data() {
    return {
      tabsValue: "live",
      posterSrc: require("@/assets/bg/playercover.jpg"),
      tableLoading: false,
      filter: {
        page: 1,
        sim: [],
        time: undefined
      },
      simOptions: [], // 卡号列表
      dataSource: [],
      liveVedioUrl: [], // 直播地址
      videotapeUrl: "", // 回放地址
      total: 0,
      liveShow: true
    }
  },
  props: {
    query: Object,
    pageType: String
  },
  created() {},
  mounted() {
    //获取sim与通道号联动
    // this.simOptions = []
    // this.$api.getSimByCar({ carId: this.$route.query.vehicle_id || "" }).then(res => {
    //   this.simOptions = res.data
    // })
  },
  methods: {
    // 获取视频直播源
    postVehicleVideoList() {
      let carId = this.$route.query.vehicle_id || ""
      this.$api.postVehicleVideoList({ carId: carId }).then(res => {
        if (res.code === 1002) {
          this.$message("车辆未工作")
        } else {
          this.liveVedioUrl = res.data.map(item => {
            item.name = "videoElement" + item.channelNo
            return item
          })

          // 通过直播地址判断是否显示直播信息。否则提示
          // this.liveVedioUrl.length == 0 ? this.$message.info("车辆未运行，暂无直播信息") : ""
          this.liveShow = this.liveVedioUrl.length == 0 ? false : true
        }
      })
    },

    // 加载直播
    loadLiveVideo() {
      if (flvjs.isSupported() && this.liveVedioUrl) {
        var videoElement = document.getElementById("liveBox")
        this.flvPlayer = flvjs.createPlayer({
          type: "flv",
          isLive: true,
          hasAudio: false,
          hasVideo: true,
          url: this.liveVedioUrl
        })
        this.flvPlayer.attachMediaElement(videoElement)
        this.flvPlayer.load()
        this.flvPlayer.play()
      }
    },

    // 获取录播列表表格数据
    getTableList() {
      // console.log(this.filter, "filter")
      let sim = []
      sim.push(Number(this.filter.sim[1]))
      let data = {
        simNo: this.filter.sim[0] || "",
        channelNo: this.filter.sim.length > 0 ? sim : [],
        startTime: this.filter.time ? this.filter.time.format("YYYY-MM-DD") : "",
        endTime: this.filter.time ? this.filter.time.format("YYYY-MM-DD") : "",
        taskNum: ""
      }
      this.$api.avresourcelist(data).then(res => {
        const dataSource = res.data.map(item => {
          item.key = item.id
          return item
        })

        this.dataSource = dataSource
      })
    },

    // 播放视频
    showDetails(val) {
      if (flvjs.isSupported() && val) {
        var videoElementList = this.$refs.videoElementList
        this.flvPlayer = flvjs.createPlayer({
          type: "flv",
          hasAudio: false,
          url: val.httpUrl
        })
        this.flvPlayer.attachMediaElement(videoElementList)
        this.flvPlayer.load()
        this.flvPlayer.play()
      } else {
        this.$message.info("暂无播放信息")
      }
    }
  }
}
</script>

<style lang="less">
#TyVideo {
  .ant-tabs-tab {
    font-size: 16px;
  }
}
</style>
