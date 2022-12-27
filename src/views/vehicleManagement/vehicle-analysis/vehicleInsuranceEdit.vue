<template>
  <div id="CommunityManagementOperation">
    <TyReturn></TyReturn>
    <a-row>
      <a-col>
        <a-space class="facility-title">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">保险信息</div>
        </a-space>

        <a-form-model ref="ruleForm" :model="insuranceDetailForm" :rules="insuranceDetailRules" :label-col="labelCol" :wrapper-col="wrapperCol" style="width: 800px">
          <a-form-model-item label="车牌号:" prop="vehicle_no" has-feedback>
            {{ !showInput ? insuranceDetailForm.vehicle_no : "" }}
            <a-input v-model="insuranceDetailForm.vehicle_no" v-if="showInput" :disabled="query.type == 'edit'" placeholder="请输入车牌号" allowClear class="aInput" />
          </a-form-model-item>
          <a-form-model-item label="保险类型:" has-feedback required>
            <a-radio-group v-model="insuranceType">
              <a-radio-button :value="key" v-for="(item, key) in insuranceTabList" :key="key">{{ item }}</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <div v-show="insuranceType === 0">
            <a-form-model-item :label="insuranceTabList[insuranceType] + '险保单号:'" prop="fi_no" has-feedback>
              {{ !showInput ? insuranceDetailForm.fi_no : "" }}
              <a-input v-model="insuranceDetailForm.fi_no" v-if="showInput" :placeholder="'请输入' + insuranceTabList[insuranceType] + '保单号'" allowClear class="aInput" />
            </a-form-model-item>
            <a-form-model-item label="保险公司:" prop="fi_company" has-feedback>
              {{ !showInput ? insuranceDetailForm.fi_company : "" }}
              <a-input v-model="insuranceDetailForm.fi_company" v-if="showInput" placeholder="请输入保险公司" allowClear />
            </a-form-model-item>
            <a-form-model-item label="投保日期:" ref="fi_date" prop="fi_date" has-feedback>
              {{ !showInput ? insuranceDetailForm.fi_date : "" }}
              <a-date-picker prop="fi_date" v-if="showInput" v-model="insuranceDetailForm.fi_date" placeholder="请选择投保日期" allowClear />
            </a-form-model-item>
            <a-form-model-item label="投保金额:" prop="fi_amount" has-feedback>
              {{ !showInput ? insuranceDetailForm.fi_amount : "" }}
              <a-input v-model="insuranceDetailForm.fi_amount" v-if="showInput" placeholder="请输入投保金额" allowClear class="aInput" />
            </a-form-model-item>
            <a-form-model-item label="到期日期:" ref="fi_expire" prop="fi_expire" has-feedback>
              {{ !showInput ? insuranceDetailForm.fi_expire : "" }}
              <a-date-picker prop="fi_expire" v-if="showInput" v-model="insuranceDetailForm.fi_expire" placeholder="请选择到期日期" allowClear />
            </a-form-model-item>
          </div>

          <div v-show="insuranceType === 1">
            <a-form-model-item :label="insuranceTabList[insuranceType] + '险保单号:'" prop="ci_no" has-feedback>
              {{ !showInput ? insuranceDetailForm.ci_no : "" }}
              <a-input v-model="insuranceDetailForm.ci_no" v-if="showInput" :placeholder="'请输入' + insuranceTabList[insuranceType] + '保单号'" allowClear class="aInput" />
            </a-form-model-item>
            <a-form-model-item label="保险公司:" prop="ci_company" has-feedback>
              {{ !showInput ? insuranceDetailForm.ci_company : "" }}
              <a-input v-model="insuranceDetailForm.ci_company" v-if="showInput" placeholder="请输入保险公司" allowClear />
            </a-form-model-item>
            <a-form-model-item label="投保日期:" ref="ci_date" prop="ci_date" has-feedback>
              {{ !showInput ? insuranceDetailForm.ci_date : "" }}
              <a-date-picker prop="ci_date" v-if="showInput" v-model="insuranceDetailForm.ci_date" placeholder="请选择投保日期" allowClear />
            </a-form-model-item>
            <a-form-model-item label="投保金额:" prop="ci_amount" has-feedback>
              {{ !showInput ? insuranceDetailForm.ci_amount : "" }}
              <a-input v-model="insuranceDetailForm.ci_amount" v-if="showInput" placeholder="请输入投保金额" allowClear class="aInput" />
            </a-form-model-item>
            <a-form-model-item label="到期日期:" ref="ci_expire" prop="ci_expire" has-feedback>
              {{ !showInput ? insuranceDetailForm.ci_expire : "" }}
              <a-date-picker prop="start_time" v-if="showInput" v-model="insuranceDetailForm.ci_expire" placeholder="请选择到期日期" allowClear />
            </a-form-model-item>
          </div>
          <div v-show="insuranceType === 2">
            <a-form-model-item :label="insuranceTabList[insuranceType] + '险保单号:'" prop="v_tax_no" has-feedback>
              {{ !showInput ? insuranceDetailForm.v_tax_no : "" }}
              <a-input v-model="insuranceDetailForm.v_tax_no" v-if="showInput" :placeholder="'请输入' + insuranceTabList[insuranceType] + '保单号'" allowClear class="aInput" />
            </a-form-model-item>
            <a-form-model-item label="保险公司:" prop="v_tax_company" has-feedback>
              {{ !showInput ? insuranceDetailForm.v_tax_company : "" }}
              <a-input v-model="insuranceDetailForm.v_tax_company" v-if="showInput" placeholder="请输入保险公司" allowClear />
            </a-form-model-item>
            <a-form-model-item label="投保日期:" ref="v_tax_date" prop="v_tax_date" has-feedback>
              {{ !showInput ? insuranceDetailForm.v_tax_date : "" }}
              <a-date-picker prop="v_tax_date" v-if="showInput" v-model="insuranceDetailForm.v_tax_date" placeholder="请选择投保日期" allowClear />
            </a-form-model-item>
            <a-form-model-item label="投保金额:" prop="v_tax_amount" has-feedback>
              {{ !showInput ? insuranceDetailForm.v_tax_amount : "" }}
              <a-input v-model="insuranceDetailForm.v_tax_amount" v-if="showInput" placeholder="请输入投保金额" allowClear class="aInput" />
            </a-form-model-item>
            <a-form-model-item label="到期日期:" ref="v_tax_expire" prop="v_tax_expire" has-feedback>
              {{ !showInput ? insuranceDetailForm.v_tax_expire : "" }}
              <a-date-picker prop="v_tax_expire" v-if="showInput" v-model="insuranceDetailForm.v_tax_expire" placeholder="请选择到期日期" allowClear />
            </a-form-model-item>
          </div>
          <a-form-model-item ref="remark" label="备注:" prop="remark" has-feedback>
            <a-input v-model="insuranceDetailForm.remark" :disabled="query.type == 'detail'" placeholder="请输入备注" allowClear />
          </a-form-model-item>
        </a-form-model>
        <a-space class="facility-title">
          <div class="facility-title-box"></div>
          <div class="facility-title-text">保险附件</div>
        </a-space>

        <div class="upLoadInsuranceList">
          <div class="upLoadInsuranceBtn">
            <a-button style="margin-left: 10px;" @click="upLoadInsurance" v-if="showInput">
              上传
            </a-button>
          </div>
          <a-table
            size="middle"
            :data-source="attachmentDataSource"
            :loading="tableLoading"
            :pagination="false"
            class="upLoadInsuranceTbl"
            :rowKey="
              (record, index) => {
                return index
              }
            "
          >
            <a-table-column title="序号" data-index="simNo" align="center">
              <template slot-scope="text, record, index">
                {{ index + 1 }}
              </template>
            </a-table-column>
            <a-table-column title="附件名称" data-index="name" align="center" />
            <a-table-column title="附件类型" data-index="fileType" align="center" />
            <a-table-column title="格式类型" data-index="format" align="center" />
            <a-table-column title="附件大小" data-index="size" align="center" :width="100" />
            <a-table-column key="operation" title="操作" data-index="operation" align="center">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="operate(record, 'download')">下载</a-button>
                <a-button type="link" size="small" @click="operate(record, 'del')" v-if="/edit|add/.test(query.type)">删除</a-button>
              </template>
            </a-table-column>
          </a-table>
        </div>
        <a-space class="flex-center" v-if="showInput">
          <a-button @click="resetForm">
            取消
          </a-button>
          <a-button type="primary" style="margin-left: 10px;" @click="onSubmit">
            保存
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel" :closable="false" :width="previewWidth">
      <div v-if="previewType === 'doc'" id="wordView" v-html="vHtml" class="officeFile" />
      <div v-if="previewType === 'pdf' && pdfUrl" class="officeFile">
        <pdf :src="pdfUrl" class="pdf"></pdf>
      </div>
      <img v-if="new RegExp(imgFormat).test(previewType)" :src="(/http|https/.test(picUrl) ? '' : $com.showUpload()) + picUrl" alt="外观" class="picture w100b" />
    </a-modal>

    <a-modal :title="modelTitle" :visible="uploadFileVisible" :footer="null" @cancel="uploadFileCancel" :closable="false" :width="600">
      <a-form-model ref="uploadFileForm" :model="uploadFileForm" :rules="uploadFileRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item label="保险附件名称:" prop="name" has-feedback>
          <a-input v-model="uploadFileForm.name" placeholder="请输入保险附件名称" allowClear class="aInput" />
        </a-form-model-item>
        <a-form-model-item label="选择上传文件:" prop="file" has-feedback>
          <a-upload name="file" list-type="picture" :show-upload-list="false" :action="$com.uploadFileUrl()" @change="handleChange">
            <a-button type="primary" @click="clearUpload">
              选择上传文件
            </a-button>
          </a-upload>
          <div class="percent-bar">
            <a-progress :percent="percent" v-if="processZero" />
          </div>
        </a-form-model-item>
        <a-form-model-item label="附件类型:" prop="type" has-feedback>
          <a-radio-group v-model="uploadFileForm.type">
            <a-radio :value="item.value" v-for="(item, key) in uploadFileTypeList" :key="key">{{ item.label }}</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
      <a-space class="flex-center" v-if="showInput">
        <a-button @click="uploadFileCancel">
          取消
        </a-button>
        <a-button type="primary" style="margin-left: 10px;" @click="uploadFileSubmit">
          确定
        </a-button>
      </a-space>
    </a-modal>
  </div>
</template>

<script>
import TyReturn from "@/components/ty-return/ty-return.vue"
import mammoth from "mammoth"
import pdf from "vue-pdf"
import { relativeTimeRounding } from "moment"

export default {
  name: "CommunityManagement",
  components: {
    TyReturn,
    pdf
  },
  computed: {
    showInput() {
      return /add|edit/.test(this.query.type)
    }
  },
  props: {
    query: Object,
    params: Object
  },
  data() {
    return {
      processZero: true,
      activeKey: 0,
      modelTitle: "上传保险附件",
      uploadFileType: 0,
      uploadFileTypeList: [
        { label: "交强险", value: 1 },
        { label: "商业险", value: 2 },
        { label: "车船税", value: 3 },
        { label: "其他", value: 0 }
      ],
      insuranceTabList: ["商业险", "交强险", "车船税"],
      insuranceEditConfirmLoading: false,
      insuranceEditVisible: false,
      tableLoading: false,
      insuranceType: 0,
      insuranceDetailForm: {
        vehicle_no: undefined,
        ci_no: undefined,
        ci_company: undefined,
        ci_date: undefined,
        ci_amount: undefined,
        ci_expire: undefined,
        fi_no: undefined,
        fi_company: undefined,
        fi_date: undefined,
        fi_amount: undefined,
        fi_expire: undefined,
        v_tax_no: undefined,
        v_tax_company: undefined,
        v_tax_date: undefined,
        v_tax_amount: undefined,
        v_tax_expire: undefined,
        remark: undefined,
        files: []
      },
      insuranceDetailRules: {
        vehicle_no: [{ required: true, message: "请输入车牌号", trigger: ["blur", "change"] }],
        fi_no: [{ required: true, message: "请输入商业险保单号", trigger: ["blur", "change"] }],
        fi_company: [{ required: true, message: "请输入商业险保险公司", trigger: ["blur", "change"] }],
        fi_date: [
          { required: true, message: "请输入商业险投保日期", trigger: ["blur", "change"] },
          {
            validator: this.checkTimeBetween
          }
        ],
        fi_amount: [
          { required: true, message: "请输入商业险投保金额", trigger: ["blur", "change"] },
          {
            validator: this.checkAmount
          }
        ],
        fi_expire: [
          { required: true, message: "请选择商业险到期日期", trigger: ["blur", "change"] },
          {
            validator: this.checkTimeBetween
          }
        ],
        ci_no: [{ required: true, message: "请输入交强险保单号", trigger: ["blur", "change"] }],
        ci_company: [{ required: true, message: "请输入交强险保险公司", trigger: ["blur", "change"] }],
        ci_date: [
          { required: true, message: "请输入交强险投保日期", trigger: ["blur", "change"] },
          {
            validator: this.checkTimeBetween
          }
        ],
        ci_amount: [
          { required: true, message: "请输入交强险投保金额", trigger: ["blur", "change"] },
          {
            validator: this.checkAmount
          }
        ],
        ci_expire: [
          { required: true, message: "请选择交强险到期日期", trigger: ["blur", "change"] },
          {
            validator: this.checkTimeBetween
          }
        ],
        v_tax_no: [{ required: true, message: "请输入车船税保单号", trigger: ["blur", "change"] }],
        v_tax_company: [{ required: true, message: "请输入车船税保险公司", trigger: ["blur", "change"] }],
        v_tax_date: [
          { required: true, message: "请输入车船税投保日期", trigger: ["blur", "change"] },
          {
            validator: this.checkTimeBetween
          }
        ],
        v_tax_amount: [
          { required: true, message: "请输入车船税投保金额", trigger: ["blur", "change"] },
          {
            validator: this.checkAmount
          }
        ],
        v_tax_expire: [
          { required: true, message: "请选择车船税到期日期", trigger: ["blur", "change"] },
          {
            validator: this.checkTimeBetween
          }
        ]
      },
      attachmentDataSource: [
        // { simNo: "", type: "doc", url: "/testdoc.docx" },
        // { simNo: "", type: "pdf", url: "/testpdf.pdf" },
        // { simNo: "", type: "jpg", url: "http://www.qianduanheidong.com/static/img/gongzhonghao.jpg" }
      ],
      uploadFileInfo: null,
      imgFormat: "jpg|png|jpeg",
      previewVisible: false,
      previewType: "",
      pdfPages: null,
      pdfUrl: null,
      picUrl: null,
      previewWidth: undefined,
      address: "",
      show: false,
      imgLoading: false,
      uploadFileForm: { name: undefined, file: undefined, type: 1 },
      uploadFileRules: {
        name: [{ required: true, message: "请输入保险附件名称", trigger: ["blur", "change"] }],
        file: [{ required: true, message: "请选择上传文件", trigger: [] }],
        type: [{ required: true, message: "请选择附件类型", trigger: [] }]
      },
      uploadFileVisible: false,
      percent: 0,
      // query:"",
      form: {
        plot_type: 1,
        plot_name: "",
        province_id: 0,
        city_id: 0,
        area_id: 0,
        id: "", //小区id
        region: undefined,
        street: "",
        address: "",
        community: "",
        total_number: "",
        at_number: "",
        location: "",
        is_huanbaowu: 2
      },

      initLocation: "", // 新增时地图初始经纬度
      type: "add", // 页面状态 编辑/新增
      areaCascaderArea: {}, // 三级联动省市区名称
      locationArr: [], // 地图上的经纬度数组
      location: [], // 地图上的经纬度
      address_details: "", // 地图上的详细地址
      searchAddress: "", // 地址模糊查询
      labelCol: { span: 5 },
      wrapperCol: { span: 13 },
      dataSource: [], // 地图搜索列表
      id: 0,
      ci_check: false,
      fi_check: false,
      v_tax_check: false,
      vHtml: ""
    }
  },
  created() {
    // this.query=this.$route.query
    // 如果是edit类型 并且有 id 就是编辑状态
    if (/detail|edit/.test(this.query.type) && this.query.id !== "") {
      this.editShow()
    } else {
      this.show = true
    }
  },
  methods: {
    checkTimeBetween(rule, value, callback) {
      let currentName = rule.field
      let type = currentName.replace(/(ci|fi|v_tax)_(date|expire)/, "$1")
      let name = type + "_" + (currentName.replace(/(ci|fi|v_tax)_(date|expire)/, "$2") === "date" ? "expire" : "date")
      if (!this.insuranceDetailForm[currentName] || !this.insuranceDetailForm[name]) {
        callback()
        return
      }
      if (+new Date(this.insuranceDetailForm[type + "_date"].format("YYYY-MM-DD").replace("-", "/")) > +new Date(this.insuranceDetailForm[type + "_expire"].format("YYYY-MM-DD").replace("-", "/"))) {
        this[type + "_check"] ? callback() : callback("到期日期不能大于投保日期！")
        if (!this[type + "_check"]) {
          this[type + "_check"] = true
          this.insuranceDetailForm[name] ? this.$refs[name].onFieldChange() : null
        } else {
          this[type + "_check"] = false
        }
      } else {
        if (!this[type + "_check"]) {
          this[type + "_check"] = true
          this.insuranceDetailForm[name] ? this.$refs[name].onFieldChange() : null
        } else {
          this[type + "_check"] = false
        }
        callback()
      }
    },
    checkAmount(rule, value, callback) {
      console.log(this.insuranceDetailForm[rule.field])
      if (!/^([1-9][0-9]*|[0-9]|[0-9]\.|[1-9][0-9]*\.|[0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})$/.test(this.insuranceDetailForm[rule.field])) {
        this.insuranceDetailForm[rule.field] = undefined
        callback("请输入有效金额")
      } else {
        callback()
      }
    },
    getfilesize(size) {
      if (!size) return "0K"
      var num = 1024.0 //byte
      if (size < num) return size + "B"
      if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "K" //kb
      if (size < Math.pow(num, 3)) return (size / Math.pow(num, 2)).toFixed(2) + "M" //M
      if (size < Math.pow(num, 4)) return (size / Math.pow(num, 3)).toFixed(2) + "G" //G
      return (size / Math.pow(num, 4)).toFixed(2) + "T" //T
    },
    uploadFileSubmit() {
      let fileInfo = this.uploadFileInfo
      if (fileInfo) {
        let uploadFileForm = this.uploadFileForm
        this.$api.addInsurancefiles({ name: uploadFileForm.name, type: uploadFileForm.type, file: uploadFileForm.file }).then(res => {
          console.log(res)
          if (res.code === 200) {
            let file = fileInfo.file
            let fileType = ""
            this.uploadFileTypeList.map(e => {
              if (e.value === uploadFileForm.type) {
                fileType = e.label
              }
            })
            let _file = { id: res.data, name: uploadFileForm.name, format: file.name.substring(file.name.lastIndexOf(".") + 1), size: this.getfilesize(file.size), fileType }
            this.attachmentDataSource = [...this.attachmentDataSource, _file]
            this.uploadFileCancel()
            this.uploadFileVisible = false
          }
        })
      }
    },
    clearUpload() {
      this.processZero = false
      setTimeout(e => {
        this.percent = 0
        this.processZero = true
      }, 0)
    },
    handleChange(info) {
      console.log(info)
      const event = info.event
      if (event) {
        // 一定要加判断，不然会报错
        this.percent = Math.floor((event.loaded / event.total) * 100)
        console.log(this.percent, event.loaded, event.total) // percent就是进度条的数值
      }

      console.log(info)
      if (info.file.status === "uploading") {
        this.imgLoading = true
        return
      }
      if (info.file.status === "done" && info.file.response.data) {
        this.uploadFileForm.file = info.file.response.data.file_url
        this.uploadFileInfo = info
        this.imgLoading = false
      } else {
        this.uploadFileForm.file = ""
        this.uploadFileInfo = null
      }
    },
    upLoadInsurance() {
      this.uploadFileVisible = true
    },
    uploadFileCancel() {
      this.$refs.uploadFileForm.resetFields()
      this.uploadFileVisible = false
      Object.keys(this.uploadFileForm).forEach(e => {
        this.uploadFileForm[e] = e === "type" ? 1 : undefined
      })
      this.uploadFileInfo = null
      this.percent = 0
    },
    previewCancel() {
      this.previewVisible = false
    },
    pdfGet(url) {
      console.log(url + "$$$")
      this.pdfUrl = url
      let loadingTask = pdf.createLoadingTask(url)
      loadingTask.promise
        .then(pdf => {
          console.log(pdf.numPages)
          this.pdfPages = pdf.numPages
        })
        .catch(err => {
          console.error("pdf 加载失败", err)
        })
    },

    operate(record, type) {
      if (type === "download") {
        const a = document.createElement("a")
        let file_path = "https://zbapip.jsyinghuan.com/storage/" + record.file
        a.setAttribute("href", file_path)
        a.setAttribute("download", record.name)
        a.click()
      } else if (type === "del") {
        this.$api.delInsurancefiles({ insurance_file_id: record.id }).then(res => {
          this.$message.info(res.msg)
          this.attachmentDataSource = this.attachmentDataSource.filter(e => {
            return e.id !== record.id
          })
        })
      }
    },
    preview(record) {
      this.previewType = record.type
      if (record.type === "doc") {
        this.previewWidth = 800
        this.docGet(record.url)
      } else if (record.type === "pdf") {
        this.previewWidth = 800
        this.pdfGet(record.url)
      } else if (new RegExp(this.imgFormat).test(record.url)) {
        this.picUrl = record.url
        this.previewWidth = undefined
      }
      this.previewVisible = true
    },
    docGet: function(url) {
      console.log(url)
      var vm = this
      var xhr = new XMLHttpRequest()
      xhr.open("get", url, true)
      xhr.responseType = "arraybuffer"
      xhr.onload = function() {
        console.log("dddd")
        if (xhr.status == 200) {
          mammoth.convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) }).then(function(resultObject) {
            vm.$nextTick(() => {
              // document.querySelector("#wordView").innerHTML =
              //   resultObject.value;

              vm.vHtml = resultObject.value
            })
          })
        }
      }
      xhr.send()
    },
    // back() {},
    // 地图 详细地址 => 经纬度
    mapInputChange(location) {
      if (this.query.type === "add" && this.form.location === "") {
        this.initLocation = location
      }
      if (location) this.form.location = location
    },
    // 地图拖拽 返回地址, 经纬度
    mapDraggableChange(location) {
      this.form.location = location
    },
    // 详细地址查询 选择某项
    addressSelect(e) {
      this.address = e
      // this.form.plot_name = e
    },
    // 详细地址查询 搜索
    addressSearch(e) {
      if (e !== "") {
        this.searchAddress = e
      }
    },
    // 地图返回模糊查询的列表
    addressList(list) {
      this.dataSource = list
    },
    // 省市区选择返回值
    areaChange(e, name) {
      this.areaCascaderArea = name
      this.form.region = e
      this.form.province_id = e[0] || 0
      this.form.city_id = e[1] || 0
      this.form.area_id = e[2] || 0
    },

    // 如果是编辑状态,需要恢复页面数据
    editShow() {
      this.type = "edit"
      this.id = this.query.id || ""
      this.$api.getInsuranceDetail({ insurance_id: this.id }).then(res => {
        const data = res.data
        Object.keys(this.insuranceDetailForm).forEach(e => {
          if (e === "files") {
            this.attachmentDataSource = data[e].map(fileCol => {
              let type = this.uploadFileTypeList.filter(fileType => {
                return fileType.value === fileCol["type"]
              })
              type = type.length ? type[0].label : ""

              return { id: fileCol["id"], size: this.getfilesize(fileCol["size"]), name: fileCol["name"], fileType: type, format: fileCol["format"], file: fileCol["file"] }
            })
          } else {
            data[e]
              ? (this.insuranceDetailForm[e] = /(ci|fi|v_tax)_(date|expire)/.test(e) ? (this.query.type === "edit" ? this.$moment(data[e]) : this.$moment(data[e]).format("YYYY-MM-DD")) : data[e])
              : null
          }
        })
        this.show = true
      })
    },
    // 确定
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let that = this
          this.$confirm({
            // title: "省市区不对应",
            content: "请确认是否继续保存",
            okText: "继续保存",
            cancelText: "取消保存",
            icon: "info-circle",
            onOk() {
              that.sureSubmit()
            },
            onCancel() {
              that.$message.info("已取消")
            }
          })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    },
    // 确认保存
    sureSubmit() {
      const data = {}
      console.log(this.insuranceDetailForm)
      Object.keys(this.insuranceDetailForm).forEach(e => {
        if (this.insuranceDetailForm[e]) {
          data[e] = /(ci|fi|v_tax)_(date|expire)/.test(e) ? this.$moment(this.insuranceDetailForm[e]).format("YYYY-MM-DD") : this.insuranceDetailForm[e]
        }
      })
      let userInfo = JSON.parse(localStorage.getItem("userInfo"))
      if (userInfo) {
        data.creater_name = userInfo.name
      }
      data.files = this.attachmentDataSource.map(e => {
        return e.id
      })
      if (this.query.type === "edit") {
        // 编辑
        if (!this.id) return
        data.insurance_id = Number(this.id)
        this.$api.editVehicleInsurance(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.info(res.msg)
          }
          setTimeout(() => {
            this.$router.push({ name: "vehicleInsuranceManagement" })
          }, 1000)
        })
      } else if (this.query.type === "add") {
        // 添加
        this.$api.addVehicleInsurance(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.info(res.msg)
          }
          setTimeout(() => {
            this.$router.push({ name: "vehicleInsuranceManagement" })
          }, 1000)
        })
      }
    },

    // 取消
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
#CommunityManagementOperation {
  .addressSearch {
    position: absolute;
    z-index: 9;
    width: 300px;
    right: 40px;
    top: 40px;
  }
}

.upLoadInsuranceList {
  display: flex;
  margin-left: 20px;
}
.upLoadInsuranceTbl {
  width: 100%;
}

.upLoadInsuranceBtn {
  width: 100px;
  margin-bottom: 10px;
}

.officeFile {
  height: 700px;
  overflow-y: scroll;
}
.percent-bar {
  height: 40px;
}
</style>
