<template>
  <div id="TyTrackSetting" ref="TyTrackSetting">
    <div class="oh mb20">
      <a-space class="fl" size="middle">
        <div>
          <span>搜索日期：</span>
          <div class="dib">
            <a-date-picker v-model="start_time" format="YYYY-MM-DD HH:mm" :allowClear="false" @change="startTimeChange" />
            <a-date-picker v-model="over_time" format="YYYY-MM-DD HH:mm" :allowClear="false" @change="overTimeChange" class="ml20" />
          </div>
        </div>
        <a-button type="primary" @click="search">查询</a-button>
      </a-space>
      <a-space class="fr" size="middle">
        <a-button v-if="!play" icon="caret-right" type="primary" @click="operateTrack(true)">开启</a-button>
        <a-button v-if="play" icon="pause" type="primary" @click="operateTrack(false)">暂停</a-button>
        <a-button icon="setting" @click="openSetting">播放设置</a-button>
        <a-button icon="export" @click="trackExport">轨迹导出</a-button>
      </a-space>
    </div>
    <a-modal v-model="settingVisible" :getContainer="() => $refs.TyTrackSetting" title="播放设置" @ok="settingOk" @cancel="settingCancel">
      <a-form-model :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item label="显示详情">
          <a-switch v-model="form.showDetail" />
        </a-form-model-item>
        <a-form-model-item label="循环播放">
          <a-switch v-model="form.loopPlay" />
        </a-form-model-item>
        <a-form-model-item label="自动播放">
          <a-switch v-model="form.autoPlay" />
        </a-form-model-item>
        <a-form-model-item label="播放速度">
          <a-slider v-model="form.speed" :max="10000" :min="1" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "TyTrackSetting",
  props: {},
  inject: ["pageType", "dataId"],
  data() {
    return {
      play: true,
      settingVisible: false,
      form: {
        showDetail: true,
        loopPlay: true,
        autoPlay: true,
        speed: 2000
      },
      start_time: this.$moment()
        .subtract(1, "days")
        .hour(0)
        .minute(0)
        .second(0),
      over_time: this.$moment(),
      backForm: {}
    }
  },
  computed: {
    getDataId() {
      return this.dataId()
    }
  },

  mounted() {
    // 将本地设置取出赋值
    let TrackSet = JSON.parse(localStorage.getItem("TrackSet"))
    if (TrackSet) this.form = TrackSet
    this.play = this.form.autoPlay
  },

  methods: {
    openSetting() {
      this.settingVisible = true
      this.backForm = this.$utils.deepCopy(this.form)
    },

    // 开启/暂停
    operateTrack(e) {
      this.play = e
      this.$emit("switch", e)
    },

    // 开始时间
    startTimeChange(value, dateString) {
      let over_time = this.$moment(dateString).add(2, "days")
      if (Math.abs(this.$moment(this.over_time).diff(value, "hours")) > 48) {
        this.over_time = over_time
      }
    },

    // 结束时间
    overTimeChange(value, dateString) {
      let start_time = this.$moment(dateString).subtract(2, "days")
      if (Math.abs(this.$moment(value).diff(this.start_time, "hours")) > 48) {
        this.start_time = start_time
      }
    },

    // 查询
    search() {
      const start_time = this.$moment(this.start_time).format("YYYY-MM-DD HH:mm:ss")
      const over_time = this.$moment(this.over_time).format("YYYY-MM-DD HH:mm:ss")
      this.play = true
      this.$emit("search", { start_time, over_time })
    },

    // 轨迹导出
    trackExport() {
      const start_time = this.$moment(this.start_time).format("YYYY-MM-DD HH:mm:ss")
      const over_time = this.$moment(this.over_time).format("YYYY-MM-DD HH:mm:ss")
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/vehicle/exportvehiclecardinfo?token=${token}&start_time=${start_time}&end_time=${over_time}&id=${this.getDataId}`)
    },

    // 设置确定
    settingOk() {
      let form = this.$utils.deepCopy(this.form)
      this.$emit("settingChange", form, this.play)
      this.settingVisible = false
      // 将设置存到本地
      localStorage.setItem("TrackSet", JSON.stringify(form))
    },

    // 取消设置
    settingCancel() {
      this.form = this.$utils.deepCopy(this.backForm)
    }
  }
}
</script>

<style></style>
