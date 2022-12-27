<template>
  <div id="AttendanceTeamSettings">
    <div class="oh">
      <a-space class="fr">
        <a-button type="primary" @click="addClasses">新增班次</a-button>
      </a-space>
    </div>
    <div class="oh w100b mt20">
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
          <a-table-column title="考勤组" data-index="commuting_name" align="center" :ellipsis="true" />
          <a-table-column title="工作日" data-index="week_text" align="center" :width="200" />
          <a-table-column title="工作时间" data-index="hour_text" align="center" :width="200" />
          <a-table-column title="允许迟到时间（min）" data-index="allowed_late_work_time" align="center" :ellipsis="true" />
          <!-- <a-table-column title="允许早退时间（min）" data-index="allowed_leave_early_work_time" align="center" :ellipsis="true" /> -->
          <a-table-column title="考勤成员" data-index="commuting_account" align="center" :ellipsis="true" />
          <a-table-column key="state" title="状态" data-index="state" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-popconfirm
                v-if="dataSource.length"
                :title="record.state ? '确定恢复为正常吗？' : '确定要停止吗？'"
                okText="确定"
                cancelText="取消"
                :maskClosable="false"
                @confirm="() => ChangeClassesState(record)"
                @cancel="record.state = !record.state"
              >
                <a-switch v-model="record.state" checked-children="正常" un-checked-children="停止" />
              </a-popconfirm>
            </template>
          </a-table-column>
          <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-button type="link" size="small" @click="option('edit', record)">编辑</a-button>
              <a-button type="link" class="danger" size="small" @click="option('del', record)">删除</a-button>
            </template>
          </a-table-column>
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-space>
    </div>
    <!-- 新增编辑弹窗 -->
    <a-modal :title="classesTitle" :visible="classesVisible" :confirm-loading="confirmLoading" @ok="changeClassesOk" @cancel="changeClassesCancel" destroyOnClose :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6, offset: 1 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="commuting_name" label="考勤组名称" prop="commuting_name" has-feedback>
          <a-input v-model="form.commuting_name" placeholder="请输入考勤组名称" />
        </a-form-model-item>
        <a-form-model-item ref="week" label="工作日" prop="week" has-feedback>
          <a-select v-model="form.week" :options="workDayList" mode="multiple" :filter-option="$com.filterOption" style="width: 100%" placeholder="请选择工作日" allowClear></a-select>
        </a-form-model-item>
        <a-form-model-item ref="hour" label="工作时间" prop="hour">
          <div v-for="(item, index) in form.hour" :key="item.uuid">
            <a-form-model-item prop="start_time" :style="{ display: 'inline-block' }" has-feedback>
              <a-time-picker prop="start_time" v-model="item.start_time" placeholder="请选择时间" format="HH:mm" style="width: 136px" allowClear />
            </a-form-model-item>
            <span style="margin:0 30px;">--</span>
            <a-form-model-item prop="end_time" :style="{ display: 'inline-block', width: 'calc(47% - 60px)' }" has-feedback>
              <a-time-picker prop="end_time" v-model="item.end_time" placeholder="请选择时间" format="HH:mm" style="width: 136px" allowClear />
            </a-form-model-item>

            <a-button class="dynamic-delete-button" style="margin:0 10px" type="primary" icon="plus" @click="addWorkerTime(item)" />
            <a-button v-if="index > 0" class="dynamic-delete-button" type="danger" icon="minus" @click="removeWorkerTime(item)" />
          </div>
        </a-form-model-item>

        <a-form-model-item label="允许提前上班打卡时长" prop="allowed_early_work_time" class="flex-center" has-feedback>
          <a-input v-model="form.allowed_early_work_time" placeholder="请输入时长" style="width:100%" suffix="min" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="允许迟到时长" prop="allowed_late_work_time" class="flex-center" has-feedback>
          <a-input v-model="form.allowed_late_work_time" placeholder="请输入时长" style="width:100%" suffix="min" allowClear></a-input>
        </a-form-model-item>
        <!-- <a-form-model-item label="允许早退时长" prop="allowed_leave_early_work_time" class="flex-center" has-feedback>
          <a-input v-model="form.allowed_leave_early_work_time" placeholder="请输入时长" style="width:100%" suffix="min" allowClear></a-input>
        </a-form-model-item> -->
        <a-form-model-item label="允许最晚下班打卡时长" prop="allowed_latest_work_work_time" class="flex-center" has-feedback>
          <a-input v-model="form.allowed_latest_work_work_time" placeholder="请输入时长" style="width:100%" suffix="min" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="上班超过" prop="missing_card_time" class="flex-center" has-feedback>
          <a-input v-model="form.missing_card_time" placeholder="请输入时长" style="width:75%" suffix="min" allowClear></a-input>
          <span>未打卡记为缺卡</span>
        </a-form-model-item>
        <a-form-model-item ref="commuting_account" label="考勤成员" prop="commuting_account" has-feedback>
          <a-select v-model="form.commuting_account" :options="membersList" mode="multiple" :filter-option="$com.filterOption" style="width: 100%" placeholder="请选择考勤组成员" allowClear></a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment"
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "AttendanceTeamSettings",
  components: {},
  data() {
    return {
      dataSource: [],
      tableLoading: false,
      total: 1,
      page: 1,
      form: {
        commuting_name: "",
        allowed_early_work_time: "",
        allowed_late_work_time: "",
        missing_card_time: "",
        allowed_leave_early_work_time: "0",
        allowed_latest_work_work_time: "",
        week: [],
        hour: [],
        commuting_account: []
        // commuting_account: undefined
      },
      classesTitle: "新增班次",
      classesVisible: false,
      confirmLoading: false,
      rules: {
        commuting_name: [{ required: true, message: "请输入考勤组名称", trigger: "change" }],
        allowed_early_work_time: [{ required: true, message: "请输入时长", trigger: "change" }],
        allowed_late_work_time: [{ required: true, message: "请输入时长", trigger: "change" }],
        missing_card_time: [{ required: true, message: "请输入时长", trigger: "change" }],
        allowed_leave_early_work_time: [{ required: true, message: "请输入时长", trigger: "change" }],
        allowed_latest_work_work_time: [{ required: true, message: "请输入时长", trigger: "change" }],
        week: [{ required: true, message: "请选择工作日", trigger: "change" }],
        hour: [{ required: true, message: "请选择工作时间", trigger: "change" }],
        commuting_account: [{ required: true, message: "请选择考勤成员", trigger: "change" }]
      },
      workDayList: this.$com.weekList(),
      membersList: [] //考勤组成员
    }
  },
  beforeCreate() {},
  created() {
    this.getTableList()
  },
  methods: {
    getTableList(page) {
      if (page) this.page = page
      this.tableLoading = true
      this.$api
        .getCommutingList()
        .then(res => {
          this.dataSource = res.data.data.map(item => {
            item.key = item.id
            item.state = item.state === 1 ? true : false
            return item
          })
          this.tableLoading = false
          this.total = res.data.total
        })
        .catch(err => {
          this.tableLoading = false
        })
    },
    addClasses() {
      this.$com.getCommutingAccount(this, "membersList") // 考勤成员
      this.form = {
        commuting_name: "",
        allowed_early_work_time: "",
        allowed_late_work_time: "",
        missing_card_time: "",
        allowed_latest_work_work_time: "",
        allowed_leave_early_work_time: "0",
        week: [],
        hour: [{ start_time: undefined, end_time: undefined, uuid: this.$utils.createUUID() }],
        // commuting_account: undefined,
        commuting_account: []
      }

      //   this.form.hour.push()
      this.classesTitle = "新增班次"
      this.classesVisible = true
    },
    // 切换开关
    ChangeClassesState(record) {
      this.$api
        .updateState({ id: record.key, state: record.state ? 1 : 2 })
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          record.admin_type = !record.admin_type
        })
    },

    // 获取活动成员列表
    getCommutingAccount(id) {
      console.log(id, "id")
      this.$api.getcommutingaccount({ id: id }).then(res => {
        console.log(res.data, "编辑")
        this.membersList = res.data.map(item => {
          item.label = item.site_account_name
          item.value = item.site_account_id
          return item
        })
      })
    },
    option(type, item) {
      const that = this
      if (type === "edit") {
        that.getCommutingAccount(item.id)
        this.$api.commutingDetail({ id: item.id }).then(res => {
          this.classesTitle = "编辑班次"
          this.classesVisible = true
          this.form.id = res.data.id
          this.form.commuting_name = res.data.commuting_name
          this.form.allowed_early_work_time = res.data.allowed_early_work_time
          this.form.allowed_late_work_time = res.data.allowed_late_work_time
          this.form.allowed_latest_work_work_time = res.data.allowed_latest_work_work_time
          this.form.allowed_leave_early_work_time = res.data.allowed_leave_early_work_time
          this.form.missing_card_time = res.data.missing_card_time

          this.form.week = res.data.week
          this.form.hour = res.data.hour.map(item => {
            item.start_time = this.$moment(item.start_time, "hh:mm") //标准时间转时分
            item.end_time = this.$moment(item.end_time, "hh:mm")

            return item
          })
          this.form.commuting_account = res.data.commuting_account.map(item => {
            return item.site_account_id
          })
        })
      }

      if (type === "del") {
        this.$confirm({
          content: `确定删除班次：${item.commuting_name} 吗？`,
          onOk() {
            that.$api.delCommuting({ id: item.id }).then(res => {
              that.getTableList()
              that.$message.success(res.msg)
            })
          }
        })
      }
    },
    // 确定新增/编辑账号
    changeClassesOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let form = this.$utils.deepCopy(this.form)
          console.log(this.form, "this.form")
          form.hour.forEach(item => {
            item.end_time = this.$moment(item.end_time).format("HH:mm") //时分秒转标准时间
            item.start_time = this.$moment(item.start_time).format("HH:mm")
          })
          this.confirmLoading = true
          this.form.allowed_leave_early_work_time = "0"
          ;(this.classesTitle === "新增班次" ? this.$api.addCommuting(form) : this.$api.editCommuting(form))
            .then(res => {
              this.$message.success(res.msg)
              this.confirmLoading = false
              this.getTableList()
              this.classesVisible = false
            })
            .catch(() => {
              this.confirmLoading = false
            })
        }
      })
    },

    // 取消 新增/编辑账号
    changeClassesCancel() {
      this.classesVisible = false
    },
    removeWorkerTime(e) {
      this.form.hour = this.form.hour.filter(item => item.uuid !== e.uuid)
    },
    addWorkerTime() {
      this.form.hour.push({
        start_time: undefined,
        end_time: undefined,
        uuid: this.$utils.createUUID()
      })
    }
  }
}
</script>

<style>
.ant-modal {
  width: 760px !important;
}
</style>
