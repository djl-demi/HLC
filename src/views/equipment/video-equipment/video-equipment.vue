<template>
  <div id="VideoEquipment">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="oh">
        <a-space class="fl" size="middle">
          <div>
            <span>设备序列号：</span>
            <div class="dib"><a-input v-model="filter.number" class="w200" placeholder="请输入设备序列号" allowClear /></div>
          </div>
          <div>
            <span>SIM卡号：</span>
            <div class="dib"><a-input v-model="filter.phone" class="w200" placeholder="请输入SIM卡号" allowClear /></div>
          </div>
          <div>
            <span>分拣站：</span>
            <div class="dib"><a-input v-model="filter.station_name" class="w200" placeholder="请输入分拣站名称" allowClear /></div>
          </div>
          <div>
            <span>状态：</span>
            <div class="dib"><a-select v-model="filter.is_online" :options="$com.onlineList()" class="w200" placeholder="请选择状态" allowClear /></div>
          </div>
          <div>
            <span>是否正常：</span>
            <div class="dib"><a-select v-model="filter.is_normal" :options="$com.normalList()" class="w200" placeholder="请选择是否正常" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">搜索</a-button>
        </a-space>
        <a-space class="fr">
          <a-button type="primary" icon="plus-square" @click="cameraGroup">摄像头分组</a-button>
          <a-button type="primary" icon="plus-square" @click="add">新增</a-button>
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column title="设备序列号" data-index="number" align="center" :ellipsis="true" />
            <a-table-column title="SIM卡号" data-index="phone" align="center" :ellipsis="true" />
            <a-table-column title="品牌" data-index="brand" align="center" :ellipsis="true" />
            <a-table-column title="摄像头" data-index="camera" align="center" :ellipsis="true" />
            <a-table-column title="摄像头名称" data-index="name" align="center" :ellipsis="true" />
            <a-table-column title="状态" data-index="is_online_text" align="center" :ellipsis="true" />
            <a-table-column title="关联设施" data-index="station_name" align="center" :ellipsis="true" />
            <a-table-column title="小区名称" data-index="comName" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ record.garbage_house.plot_name }}</span>
              </template></a-table-column
            >
            <a-table-column title="状态" data-index="is_normal" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-popconfirm
                  v-if="dataSource.length"
                  :title="record.is_normal ? '确定恢复为启用吗？' : '确定要禁用吗？'"
                  okText="确定"
                  cancelText="取消"
                  :maskClosable="false"
                  @confirm="() => ChangeState(record)"
                  @cancel="record.is_normal = !record.is_normal"
                >
                  <a-switch v-model="record.is_normal" checked-children="启用" un-checked-children="禁用" />
                </a-popconfirm>
              </template>
            </a-table-column>
            <a-table-column title="创建时间" data-index="create_time" align="center" :ellipsis="true" />
            <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="edit(record.key)">编辑</a-button>
                <a-button type="link" size="small" @click="showVideo(record)" :disabled="record.is_normal === false || record.is_online === 0">查看视频</a-button>
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
        <a-form-model-item ref="brand" label="品牌：" prop="brand" has-feedback>
          <a-input v-model="form.brand" placeholder="请输入品牌" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="video_name" label="摄像头名称：" prop="video_name" has-feedback>
          <a-input v-model="form.video_name" placeholder="请输入摄像头名称" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="number" label="设备序列号：" prop="number" has-feedback>
          <a-input v-model="form.number" placeholder="请输入设备序列号" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="phone" label="SIM卡号：" prop="phone" has-feedback>
          <a-input v-model="form.phone" placeholder="请输入SIM卡号" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="station" label="关联设施：" prop="station" :rules="stationRule" has-feedback>
          <a-cascader v-model="form.station" :options="stationOptions" placeholder="请选择关联设施" />
        </a-form-model-item>
        <!-- <a-form-model-item ref="phone" label="SIM卡号：" prop="phone" has-feedback>
          <a-input v-model="form.phone" placeholder="请输入SIM卡号" allowClear />
        </a-form-model-item> -->
        <a-form-model-item ref="app_key" label="app_key：" prop="app_key" has-feedback>
          <a-input v-model="form.app_key" placeholder="请输入app_key" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="app_secret" label="app_secret：" prop="app_secret" has-feedback>
          <a-input v-model="form.app_secret" placeholder="请输入app_secret" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="is_normal" label="设备状态" prop="is_normal" class="flex-center">
          <a-radio-group name="is_normal" v-model="form.is_normal">
            <a-radio :value="1"> 正常 </a-radio>
            <a-radio :value="0"> 停用 </a-radio>
          </a-radio-group>
        </a-form-model-item>
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
      filter: {
        number: "",
        is_normal: undefined,
        is_online: undefined,
        phone: "",
        station_name: ""
      },
      visible: false,
      modelTitle: "新增",
      confirmLoading: false,
      form: {
        brand: "",
        number: "",
        phone: "",
        video_name: "",
        station: [],
        app_key: "",
        app_secret: "",
        is_normal: 1
      },
      rules: {
        brand: [{ required: true, message: "请输入品牌", trigger: "blur" }],
        video_name: [{ required: true, message: "请输入摄像头名称", trigger: "blur" }],
        number: [{ required: true, message: "请输入设备序列号", trigger: "blur" }],
        phone: [{ required: true, message: "请输入SIM卡号", trigger: "blur" }],
        app_key: [{ required: true, message: "请输入app_key", trigger: "blur" }],
        app_secret: [{ required: true, message: "请输入app_secret", trigger: "blur" }],
        is_normal: [{ required: true, message: "请选择是否正常", trigger: "blur" }]
      },
      stationOptions: [], // 关联设施列表
      stationRule: [
        { type: "array", required: true, message: "请选择关联设施", trigger: "change" },
        {
          validator(rule, value, callback) {
            if (value.length === 2) {
              callback()
            } else {
              callback(new Error("请选择关联设施以及设施名称"))
            }
          },
          trigger: "blur"
        }
      ] // 选择司机和车牌的校验
    }
  },

  created() {
    this.getTableList(1)
    this.getSortingStationOptions()
  },

  methods: {
    // 获取环保屋,分拣站下拉
    getSortingStationOptions() {
      this.$api.getSortingStationOptions().then(res => {
        this.stationOptions = [
          {
            value: 1,
            label: "分拣站",
            children: []
          },
          {
            value: 2,
            label: "环保屋",
            children: []
          }
        ]
        res.data.forEach(item => {
          if (item.type === 1) {
            this.stationOptions[0].children.push({
              value: item.id,
              label: item.name
            })
          }
          if (item.type === 2) {
            this.stationOptions[1].children.push({
              value: item.id,
              label: item.name
            })
          }
        })
      })
    },

    // 搜索
    getTableList(page) {
      if (page) this.page = page
      let new_is_normal = ""
      let new_is_online = ""

      if (this.filter.is_normal != undefined) {
        new_is_normal = this.filter.is_normal
      }
      if (this.filter.is_online != undefined) {
        new_is_online = this.filter.is_online
      }
      const data = {
        is_normal: new_is_normal,
        is_online: new_is_online,
        number: this.filter.number || "",
        phone: this.filter.phone || "",
        station_name: this.filter.station_name || "",
        page: this.page
      }

      this.tableLoading = true
      this.$api.getVideoEquipmentList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          item.is_normal = item.is_normal === 1 ? true : false
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 新增
    add() {
      this.form = {
        brand: "",
        number: "",
        phone: "",
        app_secret: "",
        video_name: "",
        app_key: "",
        station: [],
        is_normal: 1
      }
      this.visible = true
      this.modelTitle = "新增"
    },

    // 编辑
    edit(id) {
      this.modelTitle = "编辑"
      this.$api.getVideoEquipmentDetail({ id }).then(res => {
        this.visible = true
        this.form.brand = res.data.brand
        this.form.video_name = res.data.name
        this.form.number = res.data.number
        this.form.phone = res.data.phone
        this.form.is_normal = res.data.is_normal
        this.form.app_key = res.data.app_key
        this.form.app_secret = res.data.app_secret
        this.form.id = res.data.id
        this.form.station = [res.data.type, res.data.station_id]
      })
    },

    // 删除
    deleteData() {
      let that = this
      this.$confirm({
        title: "请确认",
        content: "确定删除选中数据吗?",
        onOk() {
          that.delLoading = true
          that.$api
            .delVideoEquipment({ id: that.selectedRowKeys })
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

    // 切换开关
    ChangeState(record) {
      this.$api
        .putVideoEquipmentIsNormal({ id: record.key, is_normal: record.is_normal ? 1 : 0 })
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          record.is_normal = !record.is_normal
        })
    },

    // 弹窗确定
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          const form = { ...this.form, type: this.form.station[0], station_id: this.form.station[1] }
          console.log(form, "form")
          ;(this.modelTitle === "新增" ? this.$api.addVideoEquipment(form) : this.$api.putVideoEquipment(form))
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
    },

    // 查看视频
    showVideo(record) {
      this.$router.push({ name: "WatchVideoPlay", query: { type: record.type, id: record.station_id } })
    },

    cameraGroup() {
      this.$router.push({ name: "CameraGroup" })
    }
  }
}
</script>

<style></style>
