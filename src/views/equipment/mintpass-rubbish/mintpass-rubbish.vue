<template>
  <div id="MintpassRubbish">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div class="flex-auto">
        <a-space class="flex-line" size="middle">
          <div>
            <span>编号：</span>
            <div class="dib"><a-input v-model="filter.canNumber" class="w200" placeholder="请输入编号" allowClear /></div>
          </div>
          <div>
            <span>所属：</span>
            <div class="dib"><a-input v-model="filter.plotName" class="w200" placeholder="请输入所属" allowClear /></div>
          </div>
          <div>
            <span>品牌：</span>
            <div class="dib"><a-input v-model="filter.canBrand" class="w200" placeholder="请输入品牌" allowClear /></div>
          </div>
          <div>
            <span>状态：</span>
            <div class="dib"><a-select v-model="filter.isOpen" :options="$com.normalList()" class="w200" placeholder="请选择状态" allowClear /></div>
          </div>
          <div>
            <span>类型：</span>
            <div class="dib"><a-select v-model="filter.canType" :options="RubbishTypeList" class="w200" placeholder="请选择类型" allowClear /></div>
          </div>
          <a-button type="primary" :loading="tableLoading" @click="getTableList()">搜索</a-button>
        </a-space>
        <a-space class="ctrl-bar">
          <a-button type="primary" icon="plus" @click="add">新增</a-button>
          <a-upload name="file" :multiple="true" :action="$com.mintpassRubbishUploadExcel()" :showUploadList="false" :headers="headers" @change="uploadChange">
            <a-button type="primary"> <a-icon type="upload" /> 导入 </a-button>
          </a-upload>
          <a-button type="primary" icon="download" @click="download">导出</a-button>
          <a-button type="primary" icon="table" @click="downloadTemplate">下载模板</a-button>
          <!-- <a-button type="primary" icon="form" @click="classifiedItems">分类物品</a-button> -->
        </a-space>
      </div>
      <div class="oh w100b">
        <a-space direction="vertical" class="w100b">
          <a-button type="danger" icon="delete" :disabled="!hasSelected" :loading="delLoading" @click="deleteData">删除</a-button>
          <a-table size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column title="编号" data-index="canNumber" align="center">
              <template slot-scope="text, record">
                <a @click="showDetails(record.id)">{{ text }}</a>
              </template>
            </a-table-column>
            <a-table-column title="名称" data-index="canName" align="center" :ellipsis="true" />
            <a-table-column title="类型" data-index="canType" align="center" :ellipsis="true" />
            <a-table-column title="品牌" data-index="canBrand" align="center" :ellipsis="true" />
            <a-table-column title="所属" data-index="plotName" align="center" :ellipsis="true" />
            <a-table-column title="状态" data-index="isOpen" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-popconfirm
                  v-if="dataSource.length"
                  :title="record.isOpen ? '确定恢复为启用吗？' : '确定要禁用吗？'"
                  okText="确定"
                  cancelText="取消"
                  :maskClosable="false"
                  @confirm="() => ChangeState(record)"
                  @cancel="record.isOpen = !record.isOpen"
                >
                  <a-switch v-model="record.isOpen" checked-children="启用" un-checked-children="禁用" />
                </a-popconfirm>
              </template>
            </a-table-column>
            <a-table-column title="图片" data-index="pictureUrl" align="center">
              <template slot-scope="pictureUrl">
                <img class="img" @click="showPicture(pictureUrl)" :src="pictureUrl ? $com.showUpload() + pictureUrl : ''" />
              </template>
            </a-table-column>
            <a-table-column title="创建时间" data-index="createTime" align="center" :ellipsis="true" />
            <a-table-column title="操作" data-index="option" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="edit(record.id)">编辑</a-button>
                <a-button :disabled="record.canType === '普通'" type="link" size="small" @click="position(record.id)">定位</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="page" show-quick-jumper :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
    </a-space>

    <a-modal :visible="previewImageVisible" :width="500" :footer="null" @cancel="previewImageVisible = false">
      <div class="p20"><img alt="example" class="w100b" :src="previewImageUrl" /></div>
    </a-modal>

    <a-modal
      :title="operationTitle"
      :visible="operationVisible"
      :confirm-loading="confirmLoading"
      @ok="operationOk"
      @cancel="operationVisible = false"
      :maskClosable="false"
      :destroyOnClose="true"
      :width="form.canType === 2 && operationTitle === '编辑' ? 1000 : 500"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 0 }" :wrapper-col="{ span: 16, offset: 1 }">
        <a-row :gutter="24">
          <a-col :span="form.canType === 2 && operationTitle === '编辑' ? 12 : 24">
            <a-form-model-item ref="canType" label="类型" prop="canType">
              <div v-if="operationTitle === '编辑'">{{ form.canType === 1 ? "普通垃圾桶" : "智能垃圾桶" }}</div>
              <a-radio-group v-else v-model="form.canType" @change="mintpassRubbishTypeChange">
                <a-radio-button :value="1">普通垃圾桶</a-radio-button>
                <a-radio-button :value="2">智能垃圾桶</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item ref="canName" label="名称" prop="canName" has-feedback>
              <a-input v-model="form.canName" placeholder="请输入名称" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="canNumber" label="编号" prop="canNumber" has-feedback>
              <a-input v-model="form.canNumber" placeholder="请输入编号" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="canBrand" label="品牌" prop="canBrand" has-feedback>
              <a-input v-model="form.canBrand" placeholder="请输入品牌" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="volume" label="容积(L)" prop="volume" has-feedback>
              <a-input v-model="form.volume" placeholder="请输入容积(L)" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="plot" label="所属" prop="plot" has-feedback>
              <a-cascader v-model="form.plot" :options="belongingList" @change="plotChange" placeholder="请选择所属" allowClear></a-cascader>
            </a-form-model-item>
            <a-form-model-item ref="address" label="位置" prop="address" has-feedback>
              <a-input v-model="form.address" placeholder="请输入位置" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="operator" label="管理员" prop="operator" has-feedback>
              <a-input v-model="form.operator" placeholder="请输入管理员" class="w100b" allowClear />
            </a-form-model-item>
            <a-form-model-item ref="pictureUrl" label="图片" prop="pictureUrl">
              <a-upload name="pic" :file-list="fileList" list-type="picture-card" :action="$com.uploadUrl()" :before-upload="$utils.beforeUpload" @change="imgChange" @preview="handlePreview">
                <div v-if="fileList.length < 1">
                  <div>
                    <a-icon :type="imgLoading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
          <a-col v-if="form.canType === 2 && operationTitle === '编辑'" :span="12">
            <div v-for="(item, index) in form.barrels" :key="item.id">
              <a-form-model-item ref="子桶" :label="'子桶' + (index + 1)" :prop="'barrels.' + index + '.barrel'" :rules="barrelRule" has-feedback>
                <a-select v-model="item.barrel" :options="barrelsList" placeholder="请选择子桶品类" allowClear></a-select>
                <a-button v-if="index !== 0" class="dynamic-delete-button" type="danger" icon="minus" @click="removeBarrel(item)" />
              </a-form-model-item>
            </div>
            <div class="plr30">
              <a-button type="dashed" class="w100b" @click="addBarrel()"> <a-icon type="plus" /> 新增子桶 </a-button>
            </div>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js"
import { log } from "@antv/g2plot/lib/utils"
export default {
  name: "MintpassRubbish",
  mixins: [mixins.TableMixins],
  data() {
    return {
      RubbishTypeList: [
        { value: 1, label: "普通" },
        { value: 2, label: "智能" }
      ],
      barrelRule: [{ required: true, message: "请选择子桶品类", trigger: "change" }],
      previewImageUrl: "", // 查看图片地址
      previewImageVisible: false, // 查看图片弹窗
      operationTitle: "新增",
      operationVisible: false,
      confirmLoading: false,
      imgLoading: false, // 图片加载状态
      fileList: [],
      filter: {
        canBrand: "",
        canNumber: "",
        canType: undefined,
        isOpen: undefined,
        plotName: "",
        page: 1
      },
      form: {
        canType: 1,
        canNumber: "",
        canName: "",
        canBrand: "",
        volume: "",
        plot: [],
        address: "",
        operator: "",
        pictureUrl: "",
        barrels: []
      },
      backForm: {
        canType: 1,
        canNumber: "",
        canName: "",
        canBrand: "",
        volume: "",
        plot: [],
        address: "",
        operator: "",
        pictureUrl: "",
        barrels: []
      },
      rules: {
        canType: [{ required: true, message: "请选择类型", trigger: "blur" }],
        canNumber: [{ required: true, message: "请输入编号", trigger: "blur" }],
        canName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        volume: [{ required: true, message: "请输入容积(L)", trigger: "blur" }],
        plot: [{ required: true, message: "请选择所属", trigger: "blur" }],
        address: [{ required: true, message: "请输入位置", trigger: "blur" }],
        operator: [{ required: true, message: "请输入管理员", trigger: "blur" }],
        pictureUrl: [{ required: true, message: "请选择图片", trigger: "change" }]
      },
      headers: {
        token: JSON.parse(localStorage.getItem("token"))
      },
      belongingList: [], // 所属
      barrelsList: [] // 子桶品类
    }
  },

  created() {
    this.getTableList()
    this.getMintpassRubbishPlotOptions()
  },

  methods: {
    // 所属下拉
    getMintpassRubbishPlotOptions() {
      this.$api.getMintpassRubbishPlotOptions().then(res => {
        this.belongingList = res.data
      })
    },

    // 搜索
    getTableList(page) {
      if (page) this.page = page
      this.filter.pageNum = this.page
      this.tableLoading = true
      let data = {
        pageNum: this.page,
        canBrand: this.filter.canBrand,
        canNumber: this.filter.canNumber,
        canType: this.filter.canType == undefined ? "" : this.filter.canType,
        isOpen: this.filter.isOpen == undefined ? "" : this.filter.isOpen,
        plotName: this.filter.plotName,
        page: this.filter.page
      }
      this.$api.getMintpassRubbishList(data).then(res => {
        this.dataSource = res.data.data.map(item => {
          item.key = item.id
          item.isOpen = item.isOpen === "1" ? true : false
          return item
        })
        this.tableLoading = false
        this.total = res.data.total
      })
    },

    // 新增
    add() {
      this.operationTitle = "新增"
      this.operationVisible = true
      this.form = this.$utils.deepCopy(this.backForm)
      this.fileList.length = 0
    },

    // 编辑
    edit(id) {
      this.$api.getMintpassRubbishPutDetail({ id }).then(res => {
        console.log(res, "获取详情")
        this.form.canType = res.data.canType
        this.form.id = id
        this.form.canName = res.data.canName
        this.form.canBrand = res.data.canBrand
        this.form.volume = res.data.volume
        this.form.plot = [res.data.plotType, res.data.plotId]
        this.form.plotType = res.data.plotType
        this.form.plotId = res.data.plotId
        this.form.plotName = res.data.plotName
        this.form.address = res.data.address
        this.form.operator = res.data.operator
        this.form.canNumber = res.data.canNumber
        if (res.data.pictureUrl) {
          this.form.pictureUrl = res.data.pictureUrl
          this.fileList = [
            {
              uid: "1",
              name: res.data.pictureUrl,
              status: "done",
              url: this.$com.showUpload() + res.data.pictureUrl
            }
          ]
        } else {
          this.form.pictureUrl = ""
          this.fileList = []
        }
        if (res.data.canType === 2) {
          this.$api.getMintpassRubbishChildList({ id }).then(res2 => {
            this.barrelsList = res2.data.map(item => {
              item.value = item.id
              item.label = item.typeName
              return item
            })
            if (res.data.canTypeId && res.data.canTypeId.length > 0) {
              this.form.barrels = res.data.canTypeId.map(item => {
                return { barrel: item }
              })
            } else {
              this.form.barrels = []
            }
          })
        }
      })
      this.operationTitle = "编辑"
      this.operationVisible = true
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
            .delMintpassRubbish({ id: that.selectedRowKeys })
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

    // 选择所属小区
    plotChange(value, item) {
      this.form.plotType = value[0]
      this.form.plotId = value[1]
      this.form.plotName = item[1].label
    },

    // 列表查看详情
    showDetails(id) {
      this.$router.push({ name: "MintpassRubbishDetail", query: { id } })
    },

    // 列表查看图片
    showPicture(picture_url = "") {
      this.previewImageUrl = this.$com.showUpload() + picture_url
      this.previewImageVisible = true
    },

    // 切换开关
    ChangeState(record) {
      this.$api
        .stateMintpassRubbish({ id: record.key, isOpen: record.isOpen ? 1 : 0 })
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          record.isOpen = !record.isOpen
        })
    },

    // 垃圾桶定位
    position(id) {
      this.$router.push({ name: "MintpassRubbishPosition", query: { id } })
    },

    // 导入
    uploadChange(info) {
      if (info.file.status === "done") {
        if (info.file.response.code === 200) {
          this.$message.success(`${info.file.name}--${info.file.response.data}`)
        } else {
          this.$message.error(`${info.file.name} --${info.file.response.msg}`)
        }
      }
      if (info.file.status === "error") {
        this.$message.error(`${info.file.name} --${info.file.response.data}`)
      }
    },

    // 导出
    download() {
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}bid/can/exportCan?token=${token}`)
    },

    // 下载模板
    downloadTemplate() {
      const token = JSON.parse(localStorage.getItem("token"))
      window.open(`${process.env.VUE_APP_BASE_URL}bid/can/exportModel?token=${token}`)
    },

    // 分类物品
    classifiedItems() {
      this.$router.push({ name: "ClassifiedItems" })
    },

    // 垃圾桶类型change
    mintpassRubbishTypeChange(e) {
      this.form.canType = e.target.value
    },

    // 新增子桶
    addBarrel() {
      if (this.form.barrels.length < 8) {
        this.form.barrels.push({ barrel: undefined })
      } else {
        this.$message.info("最多8个子桶")
      }
    },

    // 删除子桶
    removeBarrel(e) {
      this.form.barrels.splice(
        this.form.barrels.findIndex(item => item.barrel === e.barrel),
        1
      )
    },

    // 图片change
    imgChange({ fileList }) {
      this.fileList = fileList
      console.log(fileList, "fileList")
      if (fileList.length > 0) {
        // 上传中
        if (fileList[0].status === "uploading") {
          this.imgLoading = true
          return
        }
        // 上传成功
        if (fileList[0].status === "done") {
          this.imgLoading = false
          this.form.pictureUrl = fileList[0].response.data.pic_url
        }
      }
    },

    // 图片预览
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$utils.getBase64(file.originFileObj)
      }
      this.previewImageUrl = file.url || this.$com.showUpload() + file.response.data.pictureUrl
      this.previewImageVisible = true
    },

    // 新增/编辑确定
    operationOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          this.form.canTypeId = this.form.barrels.map(item => {
            return item.barrel
          })
          console.log(this.form, "form")
          ;(this.operationTitle === "新增" ? this.$api.addMintpassRubbish(this.form) : this.$api.putMintpassRubbish(this.form))
            .then(res => {
              this.confirmLoading = false
              this.$message.success(res.msg)
              this.operationVisible = false
              this.getTableList()
            })
            .catch(err => {
              this.confirmLoading = false
            })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
#MintpassRubbish {
  .img {
    height: 24px;
    width: auto;
  }
}
.dynamic-delete-button {
  position: absolute;
  top: -8px;
  right: -50px;
  font-size: 20px;
}
</style>
