<template>
  <div id="AnswerRecord">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>时间：</span>
            <div class="dib">
              <a-range-picker v-model="time" @change="timeChange" format="YYYY-MM-DD" allowClear />
            </div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
        </a-space>
        <a-button icon="export" @click="trackExport">导出</a-button>
      </div>
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
          <a-table-column key="create_time" title="提交日期" data-index="create_time" align="center" :ellipsis="true" />
          <a-table-column key="picture" title="上传照片" data-index="picture" align="center" width="350px">
            <template slot-scope="text, record">
              <div class="picurl-list">
                <div v-for="(item, key) in record.picture && ((Array.isArray(record.picture) && record.picture) || record.picture.split(','))" :key="key" class="picture">
                  <img :src="$com.showUpload() + item" @click="showPicture(item)" />
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column key="remarks" title="备注" data-index="remarks" align="center" :ellipsis="true" />
          <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-button size="small" type="link" @click="viewDetail(record.key)">查看详情</a-button>
            </template>
          </a-table-column>
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-space>
    </a-space>
    <!-- 审核 -->
    <!-- <a-modal v-model="visible" :width="400" on-ok="handleClose">
      <template slot="title"> </template>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          不通过
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          通过
        </a-button>
      </template>
      <p class="audit">请确认是否通过审核?</p>
    </a-modal> -->
    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="$com.showUpload() + picUrl" alt="外观" class="picture w100b" />
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "AnswerRecord",
  data() {
    return {
      phone: "",
      // time: [this.$moment().subtract(1, "days"), this.$moment().subtract(1, "days")],
      // start_time: this.$moment()
      //   .subtract(1, "days")
      //   .format("YYYY-MM-DD"),
      // end_time: this.$moment()
      //   .subtract(1, "days")
      //   .format("YYYY-MM-DD"),
      time: [],
      start_time: null,
      over_time: null,
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,
      loading: false,
      visible: false,
      id: 0,
      picUrl: "",
      picture: "",
      previewVisible: false
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    showPicture(item) {
      this.picUrl = item
      this.previewVisible = true
    },
    imgCancel() {
      // 隐藏图片展示
      this.previewVisible = false
    },
    // 轨迹导出
    trackExport() {
      let start_time = ""
      let over_time = ""
      if (this.time.length === 2) {
        start_time = this.$moment(this.time[0]).format("YYYY-MM-DD")
        over_time = this.$moment(this.time[1]).format("YYYY-MM-DD")
      }
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}/admin/v1/photo/inspection/export?token=${token}&start_time=${start_time}&end_time=${over_time}`)
    },
    timeChange(e, v) {
      this.start_time = v[0]
      this.end_time = v[1]
    },
    // 获取物品列表
    getTableList(page) {
      if (page) this.page = page
      const data = {
        start_time: this.start_time || "",
        end_time: this.end_time || "",
        page: this.page
      }
      this.tableLoading = true
      this.$api.photoInspection(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },
    viewDetail(id) {
      this.$router.push({ name: "photoPatrolDetail", query: { id: id } })
    }
  }
}
</script>

<style lang="less" scoped>
#AnswerRecord {
}
.audit {
  margin: 10px 0 0 20px;
  font-size: 16px;
}
.ant-modal-footer {
  border-top: none;
}

.picurl-list {
  display: flex;
  width: 350px;
  flex-wrap: wrap;
  justify-content: center;
  .picture {
    width: 54px;
    height: 42px;
    overflow: hidden;
    margin: 0 10px 10px 0;
  }
  img {
    height: 52px;
  }
}
</style>
