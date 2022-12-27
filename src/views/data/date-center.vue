<template>
  <div class="dataCenter">
    <a-row>
      <a-col :span="7">
        <div class="resident_statistics">
          <div class="title">居民统计</div>
          <div class="content">
            <a-row>
              <a-col :span="8">
                <div class="box_label">
                  <a-row>
                    <a-col :span="6"><img src="../../assets/data/index/resident_nums.png" class="resirent_icon"/></a-col>
                    <a-col :span="18"><div class="box_label_title">居民户数</div></a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="6"></a-col>
                    <a-col :span="18"
                      ><div class="box_value">{{ resident_nums }}</div></a-col
                    >
                  </a-row>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="box_label">
                  <a-row>
                    <a-col :span="6"><img src="../../assets/data/index/participation.png" class="resirent_icon"/></a-col>
                    <a-col :span="18" class="box_label_title">参与数</a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="6"></a-col>
                    <a-col :span="18"
                      ><div class="box_value">{{ participation }}</div></a-col
                    >
                  </a-row>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="box_label">
                  <a-row>
                    <a-col :span="6"><img src="../../assets/data/index/register_num.png" class="resirent_icon"/></a-col>
                    <a-col :span="18" class="box_label_title">总注册户数</a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="6"></a-col>
                    <a-col :span="18"
                      ><div class="box_value">{{ register_num }}</div></a-col
                    >
                  </a-row>
                </div>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <div class="box_label">
                  <a-row>
                    <a-col :span="6"><img src="../../assets/data/index/living_num.png" class="resirent_icon"/></a-col>
                    <a-col :span="18" class="box_label_title">入住户数</a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="6"></a-col>
                    <a-col :span="18"
                      ><div class="box_value">{{ living_num }}</div></a-col
                    >
                  </a-row>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="box_label">
                  <a-row>
                    <a-col :span="6"><img src="../../assets/data/index/participation_rate.png" class="resirent_icon"/></a-col>
                    <a-col :span="18" class="box_label_title">参与率</a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="6"></a-col>
                    <a-col :span="18"
                      ><div class="box_value">{{ participation_rate }}</div></a-col
                    >
                  </a-row>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="box_label">
                  <a-row>
                    <a-col :span="6"><img src="../../assets/data/index/classification_rate.png" class="resirent_icon"/></a-col>
                    <a-col :span="18" class="box_label_title">分类准确率</a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="6"></a-col>
                    <a-col :span="18"
                      ><div class="box_value">{{ classification_rate }}</div></a-col
                    >
                  </a-row>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="month_statistics">
          <div class="title">垃圾月度回收情况</div>
          <div class="">
            <TyMonthRecycle></TyMonthRecycle>
          </div>
        </div>
        <!-- <div class="date_statistics" v-if="showSiyan">
          <div class="title">&nbsp;&nbsp;站点回收情况(单位:kg)</div>
          <div>
            <TySiyanSiteRecycle></TySiyanSiteRecycle>
          </div>
        </div> -->
        <div class="date_statistics">
          <div class="title">&nbsp;&nbsp;垃圾回收量统计(单位:kg)</div>
          <div>
            <TyRecycleWeightRing></TyRecycleWeightRing>
          </div>
        </div>
      </a-col>
      <a-col :span="10">
        <div class="resident_release">
          <div class="title">每日居民投放次数统计</div>
          <div>
            <TyDayResidentRelease></TyDayResidentRelease>
          </div>
        </div>
        <div class="month_release">
          <div class="title">年度垃圾回收情况(单位:t)</div>
          <div>
            <TyMonthRecycleBar></TyMonthRecycleBar>
          </div>
        </div>
        <a-row>
          <a-col :span="12">
            <div class="recycle_change">
              <div class="title">回收量变化情况</div>
              <div>
                <TyRecycleChange></TyRecycleChange>
              </div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="recycle_release">
              <div class="title">可回收物投放量展示</div>
              <div>
                <TyRecycleReleaseShow></TyRecycleReleaseShow>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="7">
        <div class="plot_rank">
          <div class="title">小区综合排名展示</div>
          <div>
            <TyPlotRank></TyPlotRank>
          </div>
        </div>
        <div class="resident_rank">
          <div class="title">居民实时投放数据展示</div>
          <div>
            <TyReleaseRealTimeShow></TyReleaseRealTimeShow>
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="float_button" @click="back">返回</div>
  </div>
</template>

<script>
import TyMonthRecycle from "../../components/ty-data/month_recycle.vue"
// import TySiyanSiteRecycle from "../../components/ty-data/siyan_site_recycle.vue"
import TyRecycleWeightRing from "../../components/ty-data/recycle_weight_ring.vue"
import TyDayResidentRelease from "../../components/ty-data/day_resident_release.vue"
import TyMonthRecycleBar from "../../components/ty-data/month_recycle_bar.vue"
import TyRecycleChange from "../../components/ty-data/recycle_change.vue"
import TyRecycleReleaseShow from "../../components/ty-data/recycle_release_show.vue"
import TyPlotRank from "../../components/ty-data/plot_rank.vue"
import TyReleaseRealTimeShow from "../../components/ty-data/release_realtime_show.vue"
export default {
  name: "dataCenter",
  data() {
    return {
      resident_nums: 882030,
      participation: 17237,
      register_num: 31502,
      living_num: 42331,
      participation_rate: "40.72%",
      classification_rate: "96.4%",
      showSiyan: false,
      userInfo: {}
    }
  },
  components: {
    TyMonthRecycle,
    // TySiyanSiteRecycle,
    TyRecycleWeightRing,
    TyDayResidentRelease,
    TyMonthRecycleBar,
    TyRecycleChange,
    TyRecycleReleaseShow,
    TyPlotRank,
    TyReleaseRealTimeShow
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    this.showSiyan = this.userInfo.project_id == 30 ? true : false
    this.getResidentsData()
  },
  methods: {
    // 居民统计
    getResidentsData() {
      this.$api.sumModule().then(res => {
        this.resident_nums = res.data.checkInNum
        if (this.userInfo.project_id == 30) {
          this.participation = 72438
          this.living_num = 82616
          this.resident_nums = 108464
          this.register_num = 78736 //res.data.registerNum
          this.participation_rate = "92%"
        } else if (this.userInfo.project_id == 28) {
          this.participation = 34283
          this.register_num = 36864
          this.participation_rate = "93%"
          this.living_num = res.data.residentNum
        } else {
          this.participation = res.data.participants
          this.register_num = res.data.registerNum
          this.participation_rate = res.data.participantsPercent
          this.living_num = res.data.residentNum
        }
        this.classification_rate = res.data.accuratePercent
      })
    },
    // 返回上一页
    back() {
      this.$router.push({ name: "Home" })
    }
  }
}
</script>

<style scoped lang="less">
.dataCenter {
  color: white;
  padding: 0 10px 10px 10px;
}

.resident_statistics {
  background-image: url(../../assets/data/index/resident_statistics.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 235px;
  margin: 0 10px;
}

.month_statistics {
  background-image: url(../../assets/data/index/month_statistics.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 279px;
  margin: 10px;
}

.date_statistics {
  background-image: url(../../assets/data/index/date_statistics.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 415px;
  margin: 10px;
}

.resident_release {
  background-image: url(../../assets/data/index/resident_statistics.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 258px;
  margin: 0 10px;
}

.month_release {
  background-image: url(../../assets/data/index/month_statistics.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 258px;
  margin: 10px;
}

.recycle_change {
  background-image: url(../../assets/data/index/recycle_change.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 415px;
  margin: 0 5px;
}

.recycle_release {
  background-image: url(../../assets/data/index/recycle_release.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 415px;
  margin: 0 5px;
}

.plot_rank {
  background-image: url(../../assets/data/index/plot_rank.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 464px;
  margin: 0 10px;
}

.resident_rank {
  background-image: url(../../assets/data/index/resident_rank.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 477px;
  margin: 10px;
}

.title {
  text-align: center;
  height: 38px;
  line-height: 38px;
  color: #00e4ff;
  font-size: 16px;
}

.content {
  text-align: left;
  padding: 25px;
}

.box_label {
  height: 80px;
}

.resirent_icon {
  float: right;
}

.box_label_title {
  color: #64dcf7;
  padding-left: 5px;
  overflow: hidden;
}

.box_value {
  color: #ffffff;
  padding: 10px 5px;
  font-size: 18px;
  overflow: hidden;
}

.float_button {
  color: #fff;
  /* // position: absolute; */
  position: fixed;
  right: 16px;
  bottom: 88px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  z-index: 1500;
  overflow: hidden;
  -webkit-transition-duration: 300ms;
  transition-duration: 300ms;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  background-color: #2196f3;
  opacity: 0.8;
}
</style>
