<template>
  <div id="TyWatchVideo">
    <video ref="video" id="video" controls autoplay :poster="require('@/assets/bg/playercover.jpg')" :style="{ width: '100%', minHeight: '450px' }"></video>
  </div>
</template>

<script>
import flvjs from "flv.js"
import { log } from "@antv/g2plot/lib/utils"
// import Hls from "hls.js" // https://github.com/video-dev/hls.js/blob/master/docs/API.md#first-step-setup-and-support
export default {
  name: "TyWatchVideo",
  data() {
    return {
      screenHeight: document.documentElement.clientHeight, // 屏幕高度
      hls: null,
      liveVedioUrl: []
    }
  },
  props: {
    type: {
      type: Number,
      default: 1 // 1分拣站   2环保屋
    }
  },
  mounted() {
    const that = this
    // 定义窗口大小变更通知事件
    window.onresize = () => {
      this.screenHeight = document.documentElement.clientHeight
      this.getHeight(this.screenHeight)
    }
    // 计算地图可用高度
    this.getHeight(this.screenHeight)
  },
  beforeDestroy() {
    this.videoPause()
  },
  methods: {
    // 计算地图可用高度
    getHeight(value) {
      let video = document.getElementById("video")
      video.style.maxHeight = Number(value) - 150 + "px"
    },

    // 开始播放
    startVideo(id) {
      this.$api.getWatchVideoUrl({ type: this.type, id }).then(res => {
        if (res.code === 200 && res.data) {
          this.liveVedioUrl = process.env.VUE_APP_BASE_URL + "monitor?video_url=" + res.data[0].hdFlvAddress

          if (flvjs.isSupported() && this.liveVedioUrl) {
            var videoElement = document.getElementById("video")
            this.flvPlayer = flvjs.createPlayer({
              type: "flv",
              hasAudio: false,
              url: this.liveVedioUrl
            })
            this.flvPlayer.attachMediaElement(videoElement)
            this.flvPlayer.load()
            this.flvPlayer.play()
          } else {
            this.$message.info("暂无播放信息")
          }
          // if (Hls.isSupported()) {
          //   this.videoPause()
          //   this.hls = new Hls({ autoStartLoad: true })
          //   // this.hls.loadSource(res.data[0].hlsHd)
          //   this.hls.loadSource(`${process.env.VUE_APP_BASE_URL}monitor?video_url=${res.data[0].hdFlvAddress}`)
          //   this.hls.attachMedia(this.$refs.video)
          //   this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          //     this.$refs.video.play()
          //   })
          //   this.hls.on(Hls.Events.ERROR, (event, data) => {
          //     if (data.fatal) {
          //       switch (data.type) {
          //         case Hls.ErrorTypes.NETWORK_ERROR:
          //           this.hls.startLoad()
          //           break
          //         case Hls.ErrorTypes.MEDIA_ERROR:
          //           this.hls.recoverMediaError()
          //           break
          //         default:
          //           this.hls.destroy()
          //           break
          //       }
          //     }
          //   })
          // }
        } else {
          this.$message.info("暂无视频")
          this.videoPause()
          // this.poster="require('@/assets/bg/playercover.jpg')"
        }
      })
    },

    // 停止流
    videoPause() {
      if (this.hls) {
        this.$refs.video.pause()
        this.hls.destroy()
        this.hls = null
      }
    }
  }
}
</script>

<style></style>
