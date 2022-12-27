<template>
  <div id="TyAccountOperation">
    <a-space class="facility-title">
      <div class="facility-title-box"></div>
      <div class="facility-title-text">{{ type }}账号</div>
    </a-space>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 16, offset: 0 }">
      <a-row>
        <a-col :span="12">
          <a-form-model-item ref="account" label="账号" prop="account" required>
            <a-input v-model="form.account" :disabled="type === '编辑账号'" placeholder="请输入手机号" class="w100b" />
          </a-form-model-item>
          <a-form-model-item ref="name" label="姓名" prop="name">
            <a-input v-model="form.name" placeholder="请输入姓名" class="w100b" />
          </a-form-model-item>
          <a-form-model-item ref="department_name" label="部门" prop="department_name">
            <a-input v-model="form.department_name" placeholder="请输入部门" class="w100b"> </a-input>
          </a-form-model-item>
          <a-form-model-item ref="position_id" label="角色" prop="position_id">
            <a-select v-model="form.position_id" :options="positionList" @change="ChangePosition" placeholder="请选择角色" class="w100b"> </a-select>
          </a-form-model-item>
          <!-- <a-form-model-item ref="position_id" label="角色" prop="position_id">
            <a-cascader v-model="form.position_id" @change="ChangePosition" :options="positionList" placeholder="请选择角色" class="w100b"> </a-cascader>
          </a-form-model-item> -->
        </a-col>
        <a-col :span="12">
          <div v-for="(item, index) in form.projects" :key="item.project_id">
            <a-form-model-item ref="area" :label="item.project_name" :prop="'projects.' + index + '.area'" has-feedback>
              <a-select v-model="item.area" :filter-option="$com.filterOption" :options="item.areas" mode="multiple" placeholder="请选择项目" allowClear></a-select>
            </a-form-model-item>
          </div>
        </a-col>
      </a-row>
      <a-space class="flex-center mt30">
        <a-button @click="resetForm">取消</a-button>
        <a-button type="primary" class="ml10" @click="onSubmit">保存</a-button>
      </a-space>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: "TyAccountOperation",
  props: {
    type: String, // 新增/编辑 状态
    departmentList: Array, // 部门列表
    positionList: Array, // 岗位列表
    form: Object // 表单
  },
  data() {
    return {
      rules: {
        account: [{ validator: this.$validator.phone(), trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        department_name: [{ required: true, message: "请输入部门", trigger: "blur" }],
        position_id: [{ required: true, message: "请选择岗位操作", trigger: "blur" }]
      }
    }
  },
  created() {},
  methods: {
    // 选择岗位
    ChangePosition(id) {
      console.log(id, "id")
      if (id.length !== 0) this.$emit("ChangePosition", id)
    },

    // 取消
    resetForm() {
      this.$router.go(-1)
    },

    // 保存
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let form = this.$utils.deepCopy(this.form)
          form.projects = form.projects.filter(item => {
            if (item.area) {
              item.areas = item.area
              if (item.areas.length > 0) {
                return item
              }
            }
          })
          this.$emit("onSubmit", form)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#TyAccountOperation {
  /deep/.ant-select-selection--multiple {
    max-height: 300px !important;
    overflow: auto;
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: #f5f5f5;
  }
}
</style>
