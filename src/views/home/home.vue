<template>
  <div id="home">
    首页
    <!-- <div class="gutter-example">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card size="default" :bordered="false" class="card resident">
            <div class="card-title">居民统计</div>
            <a-row :gutter="16">
              <a-col :span="12">
                <div class="card-content flex-center">
                  <div class="tac">
                    <p class="card-num">{{ data.residentNum }} <span class="card-unit">户</span></p>
                    <p class="card-text">居民户数</p>
                  </div>
                </div>
              </a-col>
              <a-divider type="vertical" class="card-line" />
              <a-col :span="12">
                <div class="card-content flex-center">
                  <div class="tac">
                    <p class="card-num">{{ data.checkInNum }} <span class="card-unit">户</span></p>
                    <p class="card-text">入住户数</p>
                  </div>
                </div>
              </a-col>
            </a-row>
          </a-card>

          <a-card size="default" :bordered="false" class="card partake">
            <div class="card-title">参与统计</div>
            <a-row :gutter="16">
              <a-col :span="12">
                <div class="card-content flex-center">
                  <div class="tac">
                    <p class="card-num">{{ data.participants }} <span class="card-unit">户</span></p>
                    <p class="card-text">参与数</p>
                    <p class="card-num">{{ data.participantsPercent }} <span class="card-unit">%</span></p>
                    <p class="card-text">参与率</p>
                  </div>
                </div>
              </a-col>
              <a-divider type="vertical" class="card-line" />
              <a-col :span="12">
                <div class="card-content flex-center">
                  <a-progress type="circle" :strokeWidth="12" strokeColor="#5F39E3" :width="180" :percent="data.participantsPercent">
                    <template #format="percent">
                      <span style="color: #31c27c">{{ percent }}%</span>
                    </template>
                  </a-progress>
                </div>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card size="default" :bordered="false" class="card recover">
            <div class="card-title">注册统计</div>
            <a-row :gutter="16">
              <a-col :span="12">
                <div class="card-content flex-center">
                  <div class="tac">
                    <p class="card-num">{{ data.registerNum }} <span class="card-unit">户</span></p>
                    <p class="card-text">注册数</p>
                    <p class="card-num">{{ data.registerPercent }}<span class="card-unit">%</span></p>
                    <p class="card-text">知晓率</p>
                  </div>
                </div>
              </a-col>
              <a-divider type="vertical" class="card-line" />
              <a-col :span="12">
                <div class="card-content flex-center">
                  <a-progress type="circle" :strokeWidth="12" strokeColor="#FF2F4C" :width="180" :percent="data.registerPercent">
                    <template #format="percent">
                      <span style="color: #31c27c">{{ percent }}%</span>
                    </template>
                  </a-progress>
                </div>
              </a-col>
            </a-row>
          </a-card>
          <a-card size="default" :bordered="false" class="card recovery">
            <div class="card-title">回收统计</div>
            <a-row :gutter="16" style="margin-top: 40px;">
              <a-col :span="12">
                <div class="card-content flex-center">
                  <div class="tac">
                    <p class="card-num">{{ data.totalWeight }} <span class="card-unit">kg</span></p>
                    <p class="card-text">回收总量</p>
                    <p class="card-num">{{ precision }} <span class="card-unit">%</span></p>
                    <p class="card-text">投放准确率</p>
                  </div>
                </div>
              </a-col>
              <a-divider type="vertical" class="card-line" />
              <a-col :span="12">
                <div class="card-content flex-center">
                  <a-progress type="circle" :strokeWidth="12" strokeColor="#FF2F4C" :width="180" :percent="precision">
                    <template #format="percent">
                      <span style="color: #31c27c">{{ percent }}%</span>
                    </template>
                  </a-progress>
                </div>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      precision: 0,
      data: {
        residentNum: 0,
        checkInNum: 0,
        registerNum: 0,
        registerPercent: 0,
        participants: 0,
        participantsPercent: 0,
        totalWeight: 0
      }
    }
  },
  created() {
    // this.getHomeData()
    // 获取分类准确率
    // this.getLaunchRate()
  },
  methods: {
    getHomeData() {
      this.$api.residentStatistics().then(res => {
        let userInfo = localStorage.getItem("userInfo")
        let user = JSON.parse(userInfo)
        if (res.data) {
          this.data = res.data
          this.data.totalWeight = res.data.totalWeight ? res.data.totalWeight : 0
          // 泗阳数据临时造
          if (user.project_id == 30) {
            this.data.residentNum = 108464
            this.data.participants = 72438
            this.data.checkInNum = 82616
            this.data.registerNum = 78736
            this.data.registerPercent = 100 //res.data.registerPercent != 0 ? parseFloat(res.data.registerPercent.slice(0, res.data.registerPercent.length - 1)) : 0
            this.data.participantsPercent = 92 //res.data.participantsPercent != 0 ? parseFloat(res.data.participantsPercent.slice(0, res.data.participantsPercent.length - 1)) : 0
          } else if (user.project_id == 28) {
            this.data.registerNum = 36864
            this.data.participants = 34283
            this.data.registerPercent = 96 //res.data.registerPercent != 0 ? parseFloat(res.data.registerPercent.slice(0, res.data.registerPercent.length - 1)) : 0
            this.data.participantsPercent = 93 //res.data.participantsPercent != 0 ? parseFloat(res.data.participantsPercent.slice(0, res.data.participantsPercent.length - 1)) : 0
          } else {
            this.data.registerPercent = res.data.registerPercent != 0 ? parseFloat(res.data.registerPercent.slice(0, res.data.registerPercent.length - 1)) : 0
            this.data.participantsPercent = res.data.participantsPercent != 0 ? parseFloat(res.data.participantsPercent.slice(0, res.data.participantsPercent.length - 1)) : 0
          }
        }
      })
    },
    // 获取投放准确
    getLaunchRate() {
      this.$api.getPrecisionRate().then(res => {
        if (res.data) {
          this.precision = Number(res.data.precision)
        }
      })
    }
  }
}
</script>

<style lang="less">
#home {
  .ant-progress-text {
    color: #31c27c;
    font-size: 24px;
  }
  .ant-card {
    color: rgba(0, 0, 0, 0.85);
  }
  .card {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.1);
    .card-title {
      font-size: 26px;
      margin-left: 20px;
      font-weight: 700;
    }
    .card-num {
      font-size: 50px;
      margin-bottom: 0;
      .card-unit {
        font-size: 26px;
      }
    }
    .card-text {
      font-size: 26px;
    }
  }
  .resident {
    background-color: #31c27c;
    color: #fff;
    height: 350px;
    .card-line {
      position: absolute;
      left: 50%;
      height: 150px;
      top: 50%;
      margin-top: -75px;
    }
    .card-content {
      height: 230px;
      width: 100%;
    }
  }
  .partake {
    margin: 20px 0px;
  }
  .partake,
  .register {
    .ant-divider {
      background-color: #a0a0a0;
    }
    height: 410px;
    .card-line {
      position: absolute;
      left: 50%;
      height: 250px;
      top: 50%;
      margin-top: -125px;
    }
    .card-content {
      height: 380px;
      width: 100%;
    }
    .card-num {
      color: #31c27c;
    }
  }
  .recover {
    // margin: 20px 0px;
    height: 380px;
    .card-line {
      position: absolute;
      left: 50%;
      height: 250px;
      top: 50%;
      margin-top: -125px;
      background-color: #a0a0a0;
    }
    .card-content {
      height: 315px;
      width: 100%;
    }
    .card-num {
      color: #31c27c;
    }
  }
  .recovery {
    margin: 20px 0px;
    height: 380px;
    .card-line {
      position: absolute;
      left: 50%;
      height: 250px;
      top: 50%;
      margin-top: -125px;
      background-color: #a0a0a0;
    }
    .card-content {
      height: 230px;
      width: 100%;
    }
    .card-num {
      color: #31c27c;
    }
  }
  // .gutter-example .ant-row > div {
  //   background: transparent;
  //   border: 0;
  //   margin-bottom: 20px;
  // }
  // .gutter-box {
  //   padding: 5px;
  //   border-radius: 5px;
  //   display: flex;
  //   align-items: center;
  //   flex-wrap: wrap;
  //   color: #fff;
  //   .gutter-text {
  //     font-size: 48px;
  //   }
  //   .gutter-text-company {
  //     font-size: 24px;
  //   }
  //   .gutter-name {
  //     font-size: 30px;
  //   }
  // }
  // .ant-card-body {
  //   padding-left: 40px;
  //   width: 100%;
  // }
}
</style>
