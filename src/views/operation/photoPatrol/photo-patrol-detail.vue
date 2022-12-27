<template>
  <div id="AnswerRecordDetail">
    <a-space class="m10">
      <a-button icon="left" @click="back">返回</a-button>
    </a-space>
    <div class="line"></div>
    <a-space direction="vertical" style="width: 700px">
      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="create_time" label="提交时间:" prop="create_time" class="flex-center" has-feedback>{{ form.create_time }}</a-form-model-item>
        <a-form-model-item ref="picture" label="上传照片:" prop="picture" class="flex-center">
          <div class="picurl-list">
            <div v-for="(item, key) in form.picture && ((Array.isArray(form.picture) && form.picture) || form.picture.split(','))" :key="key" class="picture">
              <img :src="$com.showUpload() + item" @click="showPicture(item)" />
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item ref="remarks" label="备注信息:" prop="remarks" class="flex-center">{{ form.remarks }}</a-form-model-item>
      </a-form-model>
    </a-space>
    <a-modal :visible="previewVisible" :footer="null" @cancel="imgCancel" :closable="false">
      <img :src="$com.showUpload() + picUrl" alt="外观" class="picture w100b" />
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "AnswerRecordDetail",
  computed: {},
  data() {
    return {
      form: { create_time: "", picture: "", remarks: "" },
      wrapperCol: { span: 20 },
      labelCol: { span: 4 },
      data: {},
      choiceData: [],
      judgmentData: [],
      choiceLoading: false,
      choicePage: 1,
      choiceTotal: 0,
      judgmentLoading: false,
      judgmentPage: 1,
      judgmentTotal: 0,
      previewVisible: false,
      picUrl: ""
    }
  },
  props: {
    query: Object,
    params: Object
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
    back() {
      this.$router.go(-1)
    },
    getTableList() {
      this.$api.inspectionInfo({ id: this.query.id }).then(res => {
        Object.keys(res.data).map(e => {
          this.form[e] = res.data[e]
        })
      })
    }
  }
}
</script>

<style lang="less">
#AnswerRecordDetail {
  .line {
    width: 100%;
    height: 1px;
    background: #bdbdbd;
  }
}

.picurl-list {
  display: flex;
  width: 500px;
  flex-wrap: wrap;
  .picture {
    width: 73px;
    height: 75px;
    overflow: hidden;
    margin: 0 20px 20px 0;
  }
  img {
    height: 75px;
  }
}
</style>
