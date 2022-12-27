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
          <a-form-model-item ref="account_name" label="姓名" prop="account_name">
            <a-input v-model="form.account_name" placeholder="请输入姓名" class="w100b" />
          </a-form-model-item>
          <a-form-model-item ref="department" label="部门" prop="department">
            <a-input v-model="form.department" placeholder="请输入部门" class="w100b"> </a-input>
          </a-form-model-item>
          <a-form-model-item ref="position_id" label="角色" prop="position_id">
            <a-select v-model="form.position_id" :options="positionList" @change="ChangePosition" placeholder="请选择角色" class="w100b"> </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item ref="project_id" label="项目" prop="project_id" has-feedback>
            <a-select v-model="form.project_id" :filter-option="$com.filterOption" @change="ChangeProject" :options="projectList" placeholder="请选择项目" allowClear></a-select>
          </a-form-model-item>
          <a-form-model-item ref="house_id" label="环保屋" prop="house_id">
            <!-- <a-select v-model="form.house_id" :options="houseList" @change="ChangePosition" mode="multiple" placeholder="请选择环保屋" class="w100b"> </a-select> -->
            <a-select v-model="form.house_id" mode="multiple" placeholder="请选择" class="w100b" :filterOption="filterOption">
              <a-select-option v-for="item in houseList" :key="item.value"> {{ item.label }} </a-select-option>
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider class="mtb5" />
                <a-checkbox class="m10" v-model="selectAllValue" @change="selectAll">全选</a-checkbox>
              </div>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="密码">
            a12345678
          </a-form-model-item>
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
    projectList: Array, // 项目列表
    houseList: Array, //环保屋
    form: Object // 表单
  },
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    return {
      selectAllValue: false, // 全选状态
      rules: {
        account: [{ validator: this.$validator.phone(), trigger: "blur" }],
        account_name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        department: [{ required: true, message: "请输入部门", trigger: "blur" }],
        position_id: [{ required: true, message: "请选择岗位操作", trigger: "blur" }],
        project_id: [{ required: true, message: "请选择项目", trigger: "blur" }],
        house_id: [{ required: true, message: "请选择环保屋", trigger: "blur" }]
      }
    }
  },
  created() {},
  watch: {
    houseList: {
      handler(val) {
        console.log("watch", val)
      },
      deep: true
    }
  },
  methods: {
    // 全选
    selectAll(e) {
      if (this.selectAllValue === true) {
        this.form.house_id = this.houseList.map(item => item.value)
      } else {
        this.form.house_id = []
      }
    },
    // 下拉选择筛选过滤
    filterOption(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    },
    // 选择岗位
    ChangePosition(id) {
      console.log(id, "id")
      if (id.length !== 0) this.$emit("ChangePosition", id)
    },
    // 选择项目
    ChangeProject(id) {
      if (id.length !== 0) this.$emit("ChangeProject", id)
    },

    // 取消
    resetForm() {
      this.$router.go(-1)
    },

    // 保存
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        console.log("valid", valid)
        console.log("form", this.form)

        if (valid) {
          let form = this.$utils.deepCopy(this.form)
          // form.projects = form.projects.filter(item => {
          //   if (item.area) {
          //     item.areas = item.area
          //     if (item.areas.length > 0) {
          //       return item
          //     }
          //   }
          // })

          console.log("onSubmit", form)
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
