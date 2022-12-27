<template>
  <div class="home">
    <div class="home-box2">
      <a-row class="thead2">
        <a-col :span="items[0]" v-for="(items, indexs) in tHead" :key="indexs">
          {{ items[1] }}
        </a-col>
      </a-row>
      <div class="marquee2" v-if="announcementArr.length > 0">
        <div class="marquee_box2">
          <ul class="marquee_list2" :class="{ marquee_top: animate }">
            <li v-for="(item, index) in announcementArr" :key="index">
              <a-row>
                <a-col :span="item2[0]" v-for="(item2, index2) in item" :key="index2">
                  <span>{{ item2[1] }}</span>
                </a-col>
              </a-row>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <div>
          <img style="width:120px; height:120px; margin-top:10px" src="@/assets/icons/empty.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      announcementArr: [],
      animate: false,
      spanNum: 4,
      tHead: []
    }
  },
  mounted() {
    this.addAnnouncement()
    this.getRecycleModule()
    setInterval(this.showMarquee, 2000)
  },
  methods: {
    addAnnouncement: function() {
      this.tHead = [
        [12, "小区名称"],
        [12, "可回收物投放量（kg）"]
      ]
      this.announcementArr = []
    },
    showMarquee: function() {
      this.animate = true
      setTimeout(() => {
        this.announcementArr.push(this.announcementArr[0])
        this.announcementArr.shift()
        this.animate = false
      }, 1000)
    },
    // 可回收统计
    getRecycleModule() {
      this.$api.getRecycleModule().then(res => {
        res.data.map(item => {
          this.announcementArr.push([
            [12, item.plotName],
            [12, item.weight]
          ])
        })
      })
    }
  }
}
</script>
<style type="text/css">
.home {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.home-box2 {
  width: 500px;
  height: 125px;
}
.marquee2 {
  width: 100%;
  height: 125px;
  align-items: center;
  color: #3a3a3a;
  /* background-color: #fdfbde; */
  display: flex;
  box-sizing: border-box;
}

.marquee_box2 {
  display: block;
  position: relative;
  width: 100%;
  height: 125px;
  overflow: hidden;
}

.marquee_list2 {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.marquee_top {
  transition: all 0.5s;
  margin-top: -30px;
}

.marquee_list2 li {
  /* height: 30px;
  line-height: 30px; */
  font-size: 14px;
  padding-left: 20px;
  padding: 0 2px;
  color: #fff;
  border-bottom: dotted 1px #2e3364;
  height: 40px;
  line-height: 40px;
}

.thead2 {
  background: #00206e;
  color: #fff;
  font-weight: bold;
  height: 40px;
  line-height: 40px;
}
</style>
