<template>
  <div id="AnswerRecordDetail">
    <a-space class="m10">
      <a-button icon="left" @click="back">返回</a-button>
    </a-space>
    <div class="line"></div>
    <a-space direction="vertical" style="width: 100%">
      <a-space class="facility-title">
        <div class="facility-title-text">本次答题{{ data.total_classification }}个,答对{{ data.true_classification }}个,答错{{ data.false_classification }}个,奖励积分{{ data.score }}</div>
      </a-space>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">选择题:</div>
      </a-space>
      <a-table size="middle" bordered :data-source="choiceData" :pagination="false" :loading="choiceLoading" :rowKey="record => record.id">
        <a-table-column key="index" title="序号" data-index="index+1" align="center" :width="80" :ellipsis="true">
          <template slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
        </a-table-column>
        <a-table-column key="question" title="题目" data-index="question" align="center" :ellipsis="true" />
        <a-table-column key="A" title="A选项" data-index="A" align="center" :ellipsis="true" />
        <a-table-column key="B" title="B选项" data-index="B" align="center" :ellipsis="true" />
        <a-table-column key="C" title="C选项" data-index="C" align="center" :ellipsis="true" />
        <a-table-column key="D" title="D选项" data-index="D" align="center" :ellipsis="true" />
        <a-table-column key="answer" title="正确答案" data-index="answer" align="center" :ellipsis="true" />
        <a-table-column key="user_answer" title="用户答案" data-index="user_answer" align="center" :ellipsis="true" />
      </a-table>
      <div class="flex-center mt30">
        <a-pagination v-model="choicePage" show-quick-jumper :default-current="1" :total="choiceTotal" @change="getTableList()" />
      </div>
    </a-space>
    <a-space direction="vertical" style="width: 100%">
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">判断题:</div>
      </a-space>
      <a-table size="middle" bordered :data-source="judgmentData" :pagination="false" :loading="judgmentLoading" :rowKey="record => record.id">
        <a-table-column key="index" title="序号" data-index="index+1" align="center" :width="80" :ellipsis="true">
          <template slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
        </a-table-column>
        <a-table-column key="question" title="题目" data-index="question" align="center" :ellipsis="true" />
        <a-table-column key="answer" title="正确答案" data-index="answer" align="center" :ellipsis="true" />
        <a-table-column key="user_answer" title="用户答案" data-index="user_answer" align="center" :ellipsis="true" />
      </a-table>
      <div class="flex-center mt30">
        <a-pagination v-model="judgmentPage" show-quick-jumper :default-current="1" :total="judgmentTotal" @change="getTableList()" />
      </div>
    </a-space>
  </div>
</template>

<script>
export default {
  name: "AnswerRecordDetail",
  data() {
    return {
      data: {},
      choiceData: [],
      judgmentData: [],
      choiceLoading: false,
      choicePage: 1,
      choiceTotal: 0,
      judgmentLoading: false,
      judgmentPage: 1,
      judgmentTotal: 0
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
    back() {
      this.$router.go(-1)
    },
    getTableList() {
      this.$api.viewAnswerRecord({ id: this.query.id }).then(res => {
        this.data = res.data

        if (res.data.detail.choice) {
          this.choiceData = res.data.detail.choice.map(item => {
            item.key = item.id
            return item
          })
        }
        if (res.data.detail.judgment) {
          this.judgmentData = res.data.detail.judgment.map(item => {
            item.key = item.id
            item.answer = item.answer === "true" ? "√" : "×"
            item.user_answer = item.user_answer === "正确" ? "√" : "×"

            return item
          })
        }
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
</style>
