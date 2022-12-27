<template>
  <div id="VideoEquipmentLive">
    <TyWatchVideo ref="TyWatchVideo" :type="type" :id="id"></TyWatchVideo>
  </div>
</template>

<script>
import TyWatchVideo from "@/components/ty-watch-video/ty-watch-video.vue"
export default {
  name: "VideoEquipmentLive",
  components: { TyWatchVideo },
  data() {
    return {
      type: null,
      id: null
    }
  },
  created() {
    this.id = +this.$route.query.id
    this.type = +this.$route.query.type
  },
  mounted() {
    this.$refs.TyWatchVideo.startVideo(this.id)
  }
}
</script>

<style></style>
