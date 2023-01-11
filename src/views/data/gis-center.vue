<template>
  <!-- Gis中心 -->
  <div class="gisCenter">
    <div class="facilities_summary ">
      <TyLatestCategoriesRecycle></TyLatestCategoriesRecycle>
    </div>

    <!-- <div class="latest_categories_recycle">
      <TyChukuPie></TyChukuPie>
    </div> -->
    <div class="latest_categories_recycle">
      <TyChukuTrace1></TyChukuTrace1>
    </div>
    <div class="chuku_pie_chart">
      <TyFacilitesStatictis></TyFacilitesStatictis>
    </div>

    <div class="chuku_trace_chart">
      <TyChukuTrace></TyChukuTrace>
    </div>
  </div>
</template>

<script>
import TyLatestCategoriesRecycle from "../../components/ty-data/latestcatrgory_recycle.vue"
// import TyChukuPie from "../../components/ty-data/chuku_pie.vue"
import TyFacilitesStatictis from "../../components/ty-data/facilities_statictis.vue"
import TyChukuTrace from "../../components/ty-data/trace_category.vue"
import TyChukuTrace1 from "../../components/ty-data/trace_category1.vue"

export default {
  name: "gisCenter",
  data() {
    return {
      template: ""
    }
  },
  components: {
    TyFacilitesStatictis,
    TyLatestCategoriesRecycle,
    TyChukuTrace1,
    TyChukuTrace
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.gisCenter {
  height: 100%;
}

.facilities_summary {
  position: absolute;
  top: 130px;
  left: 10px;
}

.latest_categories_recycle {
  position: absolute;
  top: 590px;
  left: 10px;
}

.chuku_pie_chart {
  position: absolute;
  top: 130px;
  right: 10px;
}

.chuku_trace_chart {
  position: absolute;
  top: 590px;
  right: 10px;
}
</style>
