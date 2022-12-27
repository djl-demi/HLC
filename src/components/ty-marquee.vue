<template>
  <div class="home">
    <div class="home-box">
      <a-row class="thead">
        <a-col :span="items[0]" v-for="(items, indexs) in tHead" :key="indexs">
          {{ items[1] }}
        </a-col>
      </a-row>
      <div class="marquee" v-if="announcementArr.length > 0">
        <div class="marquee_box">
          <ul class="marquee_list" :class="{ marquee_top: animate }">
            <li v-for="(item, index) in announcementArr" :key="index">
              <a-row v-if="showType == 'custom'">
                <a-col :span="item2[0]" v-for="(item2, index2) in item" :key="index2">
                  <span v-if="index2 == 0" class="rank"
                    ><span v-if="item2[1] == 1"
                      ><img src="../assets/data/11.png" /><span class="ranknum">{{ item2[1] }}</span></span
                    >
                    <span v-else-if="item2[1] == 2"
                      ><img src="../assets/data/12.png" /><span class="ranknum">{{ item2[1] }}</span></span
                    >
                    <span v-else-if="item2[1] == 3"
                      ><img src="../assets/data/13.png" /><span class="ranknum">{{ item2[1] }}</span></span
                    >
                    <span v-else-if="item2[1] >= 10"
                      ><img src="../assets/data/14.png" /><span class="ranknum2">{{ item2[1] }}</span></span
                    >
                    <span v-else
                      ><img src="../assets/data/14.png" /><span class="ranknum">{{ item2[1] }}</span></span
                    >
                  </span>
                  <span v-else-if="index2 == 4"> {{ item2[1] }}</span>
                  <span v-else>{{ item2[1] }}</span>
                </a-col>
              </a-row>
              <a-row v-else>
                <a-col :span="item2[0]" v-for="(item2, index2) in item" :key="index2">
                  <span :title="item2[2]">{{ item2[1] }}</span>
                </a-col>
              </a-row>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <div>
          <img class="empty" src="@/assets/icons/empty.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "Home",
  data() {
    return {
      announcementArr: [],
      animate: false,
      spanNum: 4,
      tHead: [],
      showInfo: false,
      strokeWidth: 10
    }
  },
  props: {
    showType: String
  },
  mounted() {
    this.addAnnouncement()

    setInterval(this.showMarquee, 2000)
  },
  methods: {
    addAnnouncement: function() {
      if (this.showType == "custom") {
        this.tHead = [
          [3, "排名"],
          [5, "小区名称"],
          [4, "注册率"],
          [4, "参与率"],
          [8, "回收垃圾量（kg）"]
        ]

        this.$api.getComprehensiveModule().then(res => {
          res.data.map((item, index) => {
            this.announcementArr.push([
              [3, index + 1, index + 1],
              [5, item.plotName.substring(0, 7), item.plotName],
              [4, item.awarenessRate, item.awarenessRate],
              [4, item.participantsPercent, item.participantsPercent],
              [8, Number(item.weight), Number(item.weight)]
            ])
          })
        })
      } else if (this.showType == "common") {
        this.tHead = [
          [9, "投放时间"],
          [3, "投放人"],
          [3, "投放户号"],
          [4, "垃圾类型"],
          [5, "投放重量（kg）"]
        ]

        this.$api.getResidentInvestment().then(res => {
          res.data.map((item, index) => {
            this.announcementArr.push([
              [9, item.stockTime, item.stockTime],
              [3, item.userName.substring(0, 3), item.userName],
              [3, item.houseNumber, item.houseNumber],
              [4, item.categoryName, item.categoryName],
              [5, item.netWeight, item.netWeight]
            ])
          })
        })
      } else {
        this.tHead = [
          [12, "小区名称"],
          [12, "可回收物投放量（t）"]
        ]
        this.announcementArr = [
          [
            [12, "美景天地"],
            [12, 10.04]
          ],
          [
            [12, "水木春城	"],
            [3, 13.56]
          ],
          [
            [12, "文庭雅苑"],
            [12, 17.16]
          ],
          [
            [12, "天通苑"],
            [12, 20.9]
          ]
        ]
      }
    },
    showMarquee: function() {
      this.animate = true
      setTimeout(() => {
        this.announcementArr.push(this.announcementArr[0])
        this.announcementArr.shift()
        this.animate = false
      }, 1000)
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
.home-box {
  width: 500px;
  height: 435px;
}
.marquee {
  width: 100%;
  height: 352px;
  align-items: center;
  color: #3a3a3a;
  /* background-color: #fdfbde; */
  display: flex;
  box-sizing: border-box;
}

.marquee_box {
  display: block;
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
}

.marquee_list {
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

.marquee_list li {
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  padding-left: 20px;
}

.marquee_list li {
  padding: 0 2px;
  color: #fff;
}

.thead {
  background: #00206e;
  color: #6bddff;
  font-weight: bold;
  height: 30px;
  line-height: 30px;
}

.rank1 {
  background-image: url("../assets/data/11.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  width: 23px;
  height: 27px;
}

.ranknum {
  position: absolute;
  left: 27px;
}

.ranknum2 {
  position: absolute;
  left: 22px;
}

.progress {
  width: 80px;
  float: left;
}

.empty {
  margin-top: 80px;
  width: 229px;
  height: 189px;
}
</style>
