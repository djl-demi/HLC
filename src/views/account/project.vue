<template>
  <div id="Project">
    <div class="oh">
      <a-space class="fr">
        <a-button type="primary" @click="addAccount">新增</a-button>
      </a-space>
    </div>
    <div class="oh w100b mt20">
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
          <a-table-column title="项目名称" data-index="project_name" align="center" :ellipsis="true" />
          <a-table-column key="area_restriction" title="区域" data-index="area_restriction" align="center" :ellipsis="true" />
          <a-table-column key="state" title="状态" data-index="state" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-popconfirm
                v-if="dataSource.length"
                :title="record.state ? '确定恢复为正常吗？' : '确定要停止吗？'"
                okText="确定"
                cancelText="取消"
                :maskClosable="false"
                @confirm="() => ChangeAccountState(record)"
                @cancel="record.state = !record.state"
              >
                <a-switch v-model="record.state" checked-children="正常" un-checked-children="停止" />
              </a-popconfirm>
            </template>
          </a-table-column>
          <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-button type="link" size="small" @click="option('edit', record)">编辑</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-space>
    </div>

    <a-modal :title="accountTitle" :visible="accountVisible" :confirm-loading="confirmLoading" @ok="changeAccountOk" @cancel="accountVisible = false" destroyOnClose :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 14, offset: 1 }">
        <a-form-model-item ref="project_name" label="项目名称" prop="project_name" has-feedback>
          <a-input v-model="form.project_name" placeholder="请输入项目名称" />
        </a-form-model-item>
        <div v-for="(item, index) in form.area" :key="item.id">
          <a-form-model-item ref="region" :label="'区域' + (index + 1)" :prop="'area.' + index + '.region'" :rules="regionRule">
            <TyAreaCascader :model="item.region" @change="(id, name) => areaChange(id, name, item.id)"></TyAreaCascader>
            <a-button v-if="index !== 0" class="dynamic-action-button" type="danger" icon="minus" @click="removeRegion(item)" />
            <a-button v-if="index === 0" class="dynamic-action-button" type="primary" icon="plus" @click="addRegion()" />
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import TyAreaCascader from "@/components/ty-area-cascader/ty-area-cascader.vue"
export default {
  name: "AppAccount",
  components: { TyAreaCascader },
  data() {
    return {
      tableLoading: false,
      dataSource: [],
      form: {
        project_name: "",
        area: [{ region: [], id: this.$utils.createUUID() }]
      },
      accountTitle: "新增项目",
      accountVisible: false, // 新增/编辑项目弹窗
      confirmLoading: false, // 新增/编辑项目弹窗 加载状态
      rules: {
        project_name: [{ required: true, message: "请输入项目名称", trigger: "change" }]
      },
      regionRule: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (!value || value.length === 0) {
              callback(new Error("请选择省市区"))
            } else {
              if (value.length === 3) {
                let num = 0
                this.form.area.forEach((item, index) => {
                  if (item.region[0] === value[0] && item.region[1] === value[1] && item.region[2] === value[2]) {
                    num++
                  }
                })
                // console.log(num, "nummm")
                // if (num == 0 || num == 1) {
                //   callback()
                // } else {
                //   callback(new Error("该区域与其他区域相同"))
                // }
                num === 0 ? callback() : num === 1 ? callback() : callback(new Error("该区域与其他区域相同"))
              } else {
                callback(new Error("请选择完整的省市区"))
              }
            }
          },
          trigger: "change"
        }
      ]
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      this.tableLoading = true
      this.$api.getProjectList().then(res => {
        this.dataSource = res.data.map(item => {
          item.key = item.id
          item.state = item.state === 1 ? true : false
          return item
        })
        this.tableLoading = false
      })
    },

    // 新增项目
    addAccount() {
      this.form = {
        project_name: "",
        area: [{ region: [], id: this.$utils.createUUID() }]
      }
      this.accountTitle = "新增项目"
      this.accountVisible = true
    },

    // 项目操作
    option(type, item) {
      if (type === "edit") {
        this.$api.getProject({ id: item.id }).then(res => {
          this.accountTitle = "编辑项目"
          this.accountVisible = true
          this.form.project_name = res.data.project_name
          this.form.id = res.data.id

          this.form.area = res.data.area_restriction
          this.form.area = res.data.area_restriction.map(item => {
            item.region = [item.province_id, item.city_id, item.area_id]
            item.id = this.$utils.createUUID()
            return item
          })
        })
      }
    },

    // 切换开关
    ChangeAccountState(record) {
      this.$api
        .ChangeProject({ id: record.key, state: record.state ? 1 : 2 })
        .then(res => {
          this.$message.success(res.msg)
          this.getTableList()
        })
        .catch(err => {
          record.state = !record.state
        })
    },

    // 确定新增/编辑项目
    changeAccountOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          ;(this.accountTitle === "新增项目" ? this.$api.postProject(this.form) : this.$api.editProject(this.form))
            .then(res => {
              this.$message.success(res.msg)
              this.confirmLoading = false
              this.getTableList()
              this.accountVisible = false
            })
            .catch(() => {
              this.confirmLoading = false
            })
        } else {
          this.$message.info("校验失败,请填写必填项")
          return false
        }
      })
    },
    // 省市区选择返回值
    areaChange(e, name, id) {
      if (name !== undefined) {
        this.form.area.forEach(item => {
          if (item.id === id) {
            item.region = e // 用于校验是否选择了完整的省市区
            item.province_name = name.province_name
            item.province_id = e[0]
            item.city_name = name.city_name
            item.city_id = e[1]
            item.area_name = name.area_name
            item.area_id = e[2]
          }
        })
        this.$nextTick(() => {
          this.$refs.ruleForm.validate()
        })
      }
    },
    // 删除省市区选择
    removeRegion(e) {
      this.form.area = this.form.area.filter(item => item.id !== e.id)
    },
    // 新增省市区选择
    addRegion() {
      this.form.area.splice(this.form.area.length, 0, {
        region: [],
        id: this.$utils.createUUID()
      })
    }
  }
}
</script>

<style lang="less"></style>
