<template>
  <div class="recycle_weight_ring">
    <div class="switch_label">
      <a-dropdown :trigger="['click']" style="width:40px">
        <a class="ant-dropdown-link">月份：{{ month }}月<a-icon :type="dropIcon" class="icon—drop" /> </a>
        <a-menu slot="overlay" @click="showDropList">
          <a-menu-item key="1">
            <a href="javascript:;">1月</a>
          </a-menu-item>
          <a-menu-item key="2">
            <a href="javascript:;">2月</a>
          </a-menu-item>
          <a-menu-item key="3">
            <a href="javascript:;">3月</a>
          </a-menu-item>
          <a-menu-item key="4">
            <a href="javascript:;">4月</a>
          </a-menu-item>
          <a-menu-item key="5">
            <a href="javascript:;">5月</a>
          </a-menu-item>
          <a-menu-item key="6">
            <a href="javascript:;">6月</a>
          </a-menu-item>
          <a-menu-item key="7">
            <a href="javascript:;">7月</a>
          </a-menu-item>
          <a-menu-item key="8">
            <a href="javascript:;">8月</a>
          </a-menu-item>
          <a-menu-item key="9">
            <a href="javascript:;">9月</a>
          </a-menu-item>
          <a-menu-item key="10">
            <a href="javascript:;">10月</a>
          </a-menu-item>
          <a-menu-item key="11">
            <a href="javascript:;">11月</a>
          </a-menu-item>
          <a-menu-item key="12">
            <a href="javascript:;">12月</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div id="container"></div>
  </div>
</template>

<script>
export default {
  name: "recycle_weight_ring",
  data() {
    return {
      month: new Date().getMonth() + 1,
      dropIcon: "down",
      data: []
    }
  },
  mounted() {
    this.getData()
  },
  created() {},
  methods: {
    showDropList({ key }) {
      console.log(key, "keykeykeykey")
      this.month = key
      this.getData(key)
    },
    getData(month) {
      let data = {
        month: month ? month : new Date().getMonth() + 1
      }

      this.$api.getShowchartdata(data).then(res => {
        this.data = res.data.map(item => {
          item.value = +item.value
          return item
        })
        this.$G2.createRingChart(this, this.data, "container")
      })
    }
  }
}
</script>

<style scoped lang="less">
.recycle_weight_ring {
  position: relative;
  padding: 15px;
}

.switch_label {
  position: absolute;
  right: 15px;
  top: 0px;
  z-index: 999;
}

#container {
  margin-top: 10px;
  height: 345px;
  z-index: -1;
}
/deep/ .ant-dropdown-link {
  color: #00e4ff !important;
}
</style>
