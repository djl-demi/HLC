<template>
  <!-- 车辆统计 -->
  <div class="vehicle">
    <div class="title">
      <div class="title_text">设备数据</div>
    </div>
    <div :class="theme">
      <a-row :gutter="[16, 16]">
        <a-col :span="5">
          <a-card :bodyStyle="card1" :bordered="false">
            <div class="vehicle_info">
              <div class="cicle1"></div>
              <div class="vehicle_label">发电机数量</div>
              <div class="vehicle_value" :title="vehicleData.carNum">{{ vehicleData.carNum }}17辆</div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="5">
          <a-card :bodyStyle="card2" :bordered="false">
            <div class="vehicle_info">
              <div class="cicle2"></div>
              <div :class="vehicle_label2">升降梯数量</div>
              <!-- {{ vehicleData.dailyCarMileage | ellipsis }} -->
              <div :class="vehicle_value2" :title="vehicleData.dailyCarMileage">140辆</div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="5">
          <a-card :bodyStyle="card3" :bordered="false">
            <div class="vehicle_info">
              <div class="cicle3"></div>
              <div :class="vehicle_label2">水平车数量</div>
              <div :class="vehicle_value2" :title="vehicleData.monthlyCarMileage">46辆</div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="5">
          <a-card :bodyStyle="card4" :bordered="false">
            <div class="vehicle_info">
              <div class="cicle4"></div>
              <div :class="vehicle_label2">充电板数量</div>
              <div :class="vehicle_value2" :title="vehicleData.yearlyCarMileage">500个</div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="5">
          <a-card :bodyStyle="card5" :bordered="false">
            <div class="vehicle_info">
              <div class="cicle5"></div>
              <div :class="vehicle_label2">滑轮车数量</div>
              <div :class="vehicle_value2" :title="vehicleData.dailyVehicleAvgMileage">100辆</div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "vehicle",
  data() {
    return {
      theme: "vehicle_content",
      vehicle_label2: "vehicle_label2",
      vehicle_value2: "vehicle_value2",
      card1: {
        backgroundImage: "url(" + require("../../assets/home/vehicle-bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%",
        padding: "15px 3%"
      },
      card2: {
        backgroundImage: "url(" + require("../../assets/home/card5-bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%",
        // background: "#F6F8FC",
        padding: "15px 3%",
        borderRadius: "10px"
      },
      card3: {
        backgroundImage: "url(" + require("../../assets/home/card1-bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%",
        // background: "#F6F8FC",
        padding: "15px 3%",
        borderRadius: "10px"
      },
      card4: {
        backgroundImage: "url(" + require("../../assets/home/card3-bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%",
        // background: "#F6F8FC",
        padding: "15px 3%",
        borderRadius: "10px"
      },
      card5: {
        backgroundImage: "url(" + require("../../assets/home/card2-bg.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%",
        // background: "#F6F8FC",
        padding: "15px 3%",
        borderRadius: "10px"
      }
    }
  },
  props: {
    vehicleData: Object
  },
  created() {
    // console.log(this.$store.state.menuTheme, "this.$store.state.menuTheme")
    // if (this.$store.state.menuTheme === "dark") {
    //   this.theme = "vehicle_content_dark"
    //   this.vehicle_value2 = "vehicle_value2_dark"
    //   this.vehicle_label2 = "vehicle_label2_dark"
    //   this.card2 = this.card3 = this.card4 = this.card5 = {
    //     padding: "15px 3%",
    //     borderRadius: "10px"
    //   }
    // } else {
    //   this.theme = "vehicle_content"
    //   this.vehicle_value2 = "vehicle_value2"
    //   this.vehicle_label2 = "vehicle_label2"
    //   this.card2 = this.card3 = this.card4 = this.card5 = {
    //     background: "#F6F8FC",
    //     padding: "15px 3%",
    //     borderRadius: "10px"
    //   }
    // }
  },
  watch: {
    vehicleData: {
      handler(val) {
        this.vehicleData = val
      }
    },
    // 切换背景
    "$store.state.menuTheme": {
      handler(val) {
        if (val === "dark") {
          this.theme = "vehicle_content_dark"
          this.vehicle_value2 = "vehicle_value2_dark"
          this.vehicle_label2 = "vehicle_label2_dark"
          this.card2 = this.card3 = this.card4 = this.card5 = {
            padding: "15px 3%",
            borderRadius: "10px"
          }
        } else {
          this.theme = "vehicle_content"
          this.vehicle_value2 = "vehicle_value2"
          this.vehicle_label2 = "vehicle_label2"
          this.card2 = this.card3 = this.card4 = this.card5 = {
            background: "#F6F8FC",
            padding: "15px 3%",
            borderRadius: "10px"
          }
        }
      }
    }
  },
  filters: {
    ellipsis(value) {
      if (!value) return 0
      if (String(value).length > 5 && document.documentElement.clientWidth <= 1400) {
        return String(value).slice(0, 4) + ".."
      }
      return value
    }
  }
}
</script>

<style scoped>
.title {
  padding-bottom: 20px;
}
.title_text {
  font-size: 20px;
  font-weight: 600;
  color: #565656;
}

.vehicle_content {
  padding: 20px 20px;
  height: 200px;
  background: #fff;
  box-shadow: 0px 0px 15px 8px rgba(86, 85, 241, 0.05);
  border-radius: 14px;
}

.vehicle_content_dark {
  padding: 20px 20px;
  height: 200px;
  /* background: #fff; */
  box-shadow: 0px 0px 15px 8px rgba(86, 85, 241, 0.05);
  border-radius: 14px;
}

.ant-col-5 {
  width: 20%;
}

.vehicle_info {
  height: 135px;
}

.cicle1 {
  width: 50px;
  height: 50px;
  background: #ffffff;
  border-radius: 50%;
  vertical-align: middle;
  text-align: center;
  /* padding-top: 15px; */
  color: #6158fa;
  float: left;
  margin-top: 40px;
}

.cicle2 {
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 50%;
  vertical-align: middle;
  text-align: center;
  margin-top: 40px;
  color: #ffffff;
  float: left;
}

.cicle3 {
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 50%;
  vertical-align: middle;
  text-align: center;
  margin-top: 40px;
  color: #ffffff;
  float: left;
}

.cicle4 {
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 50%;
  vertical-align: middle;
  text-align: center;
  margin-top: 40px;
  color: #ffffff;
  float: left;
}

.cicle5 {
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 50%;
  vertical-align: middle;
  text-align: center;
  margin-top: 40px;
  color: #ffffff;
  float: left;
}

.vehicle_label {
  float: left;
  font-size: 16px;
  width: 50%;
  padding: 14px 10px;
  text-align: left;
  color: #ffffff;
  overflow: hidden;
}

.vehicle_value {
  text-align: center;
  font-size: 20px;
  color: #ffffff;
  overflow: hidden;
}

.vehicle_label2 {
  float: left;
  font-size: 16px;
  /* width: 40%; */
  padding: 14px 10px;
  text-align: left;
  color: #fff;
  overflow: hidden;
}

.vehicle_label2_dark {
  float: left;
  font-size: 16px;
  width: 40%;
  padding: 14px 10px;
  text-align: left;
  color: rgba(255, 255, 255, 0.65);
  overflow: hidden;
}

.vehicle_value2 {
  text-align: center;
  font-size: 20px;
  color: #fff;
  overflow: hidden;
}

.vehicle_value2_dark {
  text-align: center;
  padding: 11px 0px;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.65);
  overflow: hidden;
}

@media only screen and (max-width: 1550px) {
  .cicle1 {
    width: 40px;
    height: 40px;
    background: #ffffff;
    border-radius: 50%;
    vertical-align: middle;
    text-align: center;
    padding-top: 10px;
    color: #6158fa;
    float: left;
  }

  .cicle2 {
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    vertical-align: middle;
    text-align: center;
    padding-top: 10px;
    color: #ffffff;
    float: left;
  }

  .cicle3 {
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    vertical-align: middle;
    text-align: center;
    padding-top: 10px;
    color: #ffffff;
    float: left;
  }

  .cicle4 {
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    vertical-align: middle;
    text-align: center;
    padding-top: 10px;
    color: #ffffff;
    float: left;
  }

  .cicle5 {
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    vertical-align: middle;
    text-align: center;
    padding-top: 10px;
    color: #ffffff;
    float: left;
  }

  .vehicle_label {
    float: left;
    font-size: 14px;
    width: 40%;
    padding: 10px 2px;
    text-align: left;
    color: #ffffff;
  }

  .vehicle_value {
    text-align: center;
    font-size: 16px;
    color: #ffffff;
  }

  .vehicle_label2 {
    float: left;
    font-size: 14px;
    width: 39%;
    padding: 10px 2px;
    text-align: left;
    color: #333333;
  }

  .vehicle_value2 {
    text-align: center;
    padding: 9px 0px;
    font-size: 16px;
    color: #333333;
  }

  .vehicle_info {
    height: 54px;
    padding: 10px 0;
  }
}
/deep/.ant-card {
  line-height: 6.5 !important;
}
</style>
