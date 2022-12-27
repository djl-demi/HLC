<template>
  <div id="VideoEquipment">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="fr">
          <a-button type="primary" icon="plus-square" @click="add">新增</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading" :rowKey="dataSource => dataSource.id">
            <a-table-column title="分组名称" data-index="name" align="center" :ellipsis="true" />
            <a-table-column title="摄像头" data-index="videoList" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ record.videoList.map(item => item.name).join() }}</span>
              </template>
            </a-table-column>
            <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="deleteData(record)">删除</a-button>
                <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>

    <!-- 新增编辑弹窗 -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" destroyOnClose @ok="handleOk" @cancel="visible = false" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5, offset: 1 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-form-model-item ref="groupName" label="分组名称：" prop="groupName" has-feedback>
          <a-input v-model="form.groupName" placeholder="请输入分组名称" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="cameras" label="摄像头名称：" has-feedback>
          <a-select
            mode="multiple"
            size="default"
            placeholder="请选择摄像头名称"
            v-model="form.videoIds"
            v-decorator="['cameras', { rules: [{ required: true, message: 'Please select your gender!' }] }]"
            @change="handleChange"
          >
            <a-select-option v-for="i in cameras" :key="i.id">
              {{ i.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- <a-form-model-item ref="is_normal" label="设备状态" prop="is_normal" class="flex-center">
          <a-radio-group name="is_normal" v-model="form.is_normal">
            <a-radio :value="1"> 正常 </a-radio>
            <a-radio :value="0"> 停用 </a-radio>
          </a-radio-group>
        </a-form-model-item> -->
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js"
export default {
  name: "VideoEquipment",
  mixins: [mixins.TableMixins],
  data() {
    return {
      visible: false,
      modelTitle: "新增",
      confirmLoading: false,
      dataSource: [],
      defaultValue: [],
      cameras: [],
      form: {
        groupName: "",
        videoIds: []
      },
      rules: {
        groupName: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
        cameras: [{ required: true, message: "请选择摄像头", trigger: "change" }]
      }
      // camerasRules: [
      //   { required: true, message: "请选择摄像头", trigger: "change" },
      //   {
      //     validator(rule, value, callback) {
      //       console.log(value);
      //       // if (value.length === 2) {
      //       //   callback()
      //       // } else {
      //         callback(new Error("请选择关联设施以及设施名称"))
      //       // }
      //     },
      //     trigger: "change"
      //   }
      // ]
    }
  },

  created() {
    this.getTableList(1)
  },

  methods: {
    getCameras(id = "") {
      const data = {
        id: id,
        videoName: ""
      }
      this.$api.getVideoListByName(data).then(res => {
        this.cameras = res.data.map(item => {
          return {
            id: item.id,
            name: item.name
          }
        })
      })
    },
    // 搜索
    getTableList(page) {
      if (page) this.page = page
      const data = {
        pageNum: this.page,
        pageSize: 10
      }
      this.tableLoading = true
      this.$api.getVideoGroupList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    handleChange(data) {
      console.log(data)
    },

    // 新增
    add() {
      this.form = {
        groupName: "",
        videoIds: []
      }
      this.getCameras()
      this.visible = true
      this.modelTitle = "新增"
    },

    // 编辑
    edit({ id, name, videoList }) {
      this.getCameras(id)
      this.visible = true
      this.modelTitle = "编辑"
      this.form.id = id
      this.form.groupName = name
      this.form.videoIds = videoList.map(item => item.id)
    },

    // 删除
    deleteData({ id }) {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .deleteVideoGroup({ id })
            .then(res => {
              that.delLoading = false
              that.getTableList()
              that.$message.success(res.msg)
              that.selectedRowKeys = []
            })
            .catch(err => {
              that.delLoading = false
            })
        },
        onCancel() {
          that.$message.info("已取消")
        }
      })
    },

    // 弹窗确定
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          ;(this.modelTitle === "新增" ? this.$api.addVideoGroup(this.form) : this.$api.updateVideoGroup(this.form))
            .then(res => {
              this.confirmLoading = false
              this.$message.success(res.msg)
              this.visible = false
              this.getTableList()
            })
            .catch(err => {
              this.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>

<style></style>
