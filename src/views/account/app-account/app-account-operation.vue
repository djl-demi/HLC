<template>
  <div id="AppAccountOperation">
    <!-- <a-space class="facility-title">
      <div class="facility-title-box"></div>
      <div class="facility-title-text">{{ type }}账号</div>
    </a-space>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 16, offset: 0 }">
      <a-row>
        <a-col :span="12">
          <a-form-model-item ref="account" label="账号" prop="account" required>
            <a-input v-model="form.account"  placeholder="请输入手机号" class="w100b" />
          </a-form-model-item>
          <a-form-model-item ref="name" label="姓名" prop="name">
            <a-input v-model="form.name" placeholder="请输入姓名" class="w100b" />
          </a-form-model-item>
          <a-form-model-item ref="department_id" label="部门" prop="department_id">
            <a-select v-model="form.department_id" :options="departmentList" placeholder="请选择部门" class="w100b"> </a-select>
          </a-form-model-item>
          <a-form-model-item ref="position_id" label="岗位操作" prop="position_id">
            <a-cascader v-model="form.position_id" @change="ChangePosition" :options="positionList" placeholder="请选择岗位操作" class="w100b"> </a-cascader>
          </a-form-model-item>
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
        <a-button type="primary" style="margin-left: 10px;" @click="onSubmit">保存</a-button>
      </a-space>
    </a-form-model> -->
    <TyReturn></TyReturn>
    <TyAccountOperation
      :type="type"
      :houseList="houseList"
      :positionList="positionList"
      :projectList="projectList"
      :form="form"
      @ChangeProject="ChangeProject"
      @ChangePosition="ChangePosition"
      @onSubmit="onSubmit"
    ></TyAccountOperation>
  </div>
</template>

<script>
import TyAccountOperation from "components/ty-account/ty-app-account-operation.vue"
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  name: "AppAccountOperation",
  components: { TyAccountOperation, TyReturn },
  data() {
    return {
      type: "新增",
      form: {
        account: "",
        account_name: "",
        department: undefined,
        position_id: undefined,
        project_id: undefined,
        house_id: undefined
      },
      projectList: [],
      // rules: {
      //   account: [{ validator: this.$validator.phone(), trigger: "blur" }],
      //   name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      //   department_id: [{ required: true, message: "请选择部门", trigger: "blur" }],
      //   position_id: [{ required: true, message: "请选择岗位操作", trigger: "blur" }]
      // },
      // departmentList: [],
      positionList: [],
      houseList: []
    }
  },
  created() {
    if (this.$route.query.type === "edit") {
      this.type = "编辑"
      this.$api.getAppAccount({ id: this.$route.query.id }).then(res => {
        console.log("详情", res)
        this.form.account = res.data.account
        this.form.account_id = res.data.id
        this.form.account_name = res.data.account_name
        this.form.department = res.data.department
        this.form.position_id = res.data.position_id
        this.form.project_id = res.data.project_id
        let house = []
        res.data.site_account_garbage_house.map(item => {
          house.push(item.garbage_house_id)
        })
        this.form.house_id = house
        //获取角色下的项目下拉
        this.ChangePosition(res.data.position_id)

        this.ChangeProject(res.data.project_id)
        // this.$api.getCompanyProjectList({ position_id: res.data.admin_position_id }).then(res2 => {
        //   this.form.projects = res2.data.map(item => {
        //     item.areas.forEach(sitem => {
        //       sitem.value = sitem.region_id
        //       sitem.label = sitem.region_name
        //     })
        //     res.data.wxsp_account_project.forEach(sitem => {
        //       if (item.project_id === sitem.project_id) {
        //         item.area = sitem.project_areas ? sitem.project_areas : []
        //       }
        //     })
        //     return item
        //   })
        // })
      })
    } else {
      this.type = "新增"
    }
    // this.getProjectList()
    this.getCompanyPositionList()
  },
  methods: {
    // 获取项目
    getProjectList() {
      this.$api.getCompanyDepartmentList().then(res => {
        this.departmentList = res.data.map(item => {
          item.value = item.id
          item.label = item.department_name
          return item
        })
      })
    },

    // 获取岗位
    getCompanyPositionList() {
      this.$api.getPositionProjectList().then(res => {
        this.positionList = res.data.map(item => {
          item.value = item.id
          item.label = item.position_name
          return item
        })
      })
    },

    // 选择项目
    ChangeProject(id) {
      console.log("选择项目", id)
      this.$api.getProjectGarbageHouses({ project_id: id }).then(res => {
        if (res.data.length > 0) {
          res.data.map(item => {
            this.houseList.push({
              label: item.house_name,
              value: item.id
            })
          })
        }
      })
      // console.log('this.houseList', this.houseList)
    },

    // 选择岗位
    ChangePosition(id) {
      console.log("选择岗位", id)
      // console.log(this.positionList)
      this.projectList = []

      this.$api.getPositionProjectList().then(res => {
        res.data.map(item => {
          if (item.id == id) {
            item.role_project_list.map(sitem => {
              this.projectList.push({
                label: sitem.project_name,
                value: sitem.project_id
              })
            })
          }
        })
      })

      // this.positionList.map((item) => {
      //   if (item.id == id) {
      //     item.role_project_list.map((sitem) => {
      //       this.projectList.push({
      //         label: sitem.project_name,
      //         value: sitem.project_id,
      //       })
      //     })
      //   }
      // })
      // this.$api.getCompanyProjectList({ position_id: id }).then(res => {
      // console.log('获取项目', res)
      // this.form.projects = res.data.map(item => {
      //   item.areas = item.areas.map(sitem => {
      //     sitem.value = sitem.region_id
      //     sitem.label = sitem.region_name
      //     return sitem
      //   })
      //   item.area = []
      //   return item
      // })
      // })
    },

    // 取消
    resetForm() {
      this.$router.go(-1)
    },

    // 保存
    onSubmit(form) {
      // 整理环保屋参数
      let house = []
      form.house_id.map(item => {
        this.houseList.map(sitem => {
          if (item == sitem.value) {
            house.push({
              garbage_house_id: item,
              house_name: sitem.label
            })
          }
        })
      })
      form.garbage_house = house

      if (this.type === "新增") {
        this.$api
          .postAppAccount(form)
          .then(res => {
            this.$message.success({ content: res.msg })
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          })
          .catch(err => {
            this.$message.error({ content: err.msg })
          })
      }
      if (this.type === "编辑") {
        form.id = form.account_id
        this.$api
          .editAppAccount(form)
          .then(res => {
            this.$message.success({ content: res.msg })
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          })
          .catch(err => {
            this.$message.error({ content: err.msg })
          })
      }
      // }
      // })
    }
  }
}
</script>

<style></style>
