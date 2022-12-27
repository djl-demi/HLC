<template>
  <div>
    <TyReturn></TyReturn>
    <TyAccountOperation :type="type" :departmentList="departmentList" :positionList="positionList" :form="form" @ChangePosition="ChangePosition" @onSubmit="onSubmit"></TyAccountOperation>
  </div>
</template>

<script>
import TyAccountOperation from "components/ty-account/ty-account-operation.vue"
import TyReturn from "@/components/ty-return/ty-return.vue"
export default {
  name: "BackgroundAccountOperation",
  components: { TyAccountOperation, TyReturn },
  data() {
    return {
      type: "新增",
      form: {
        account: "",
        name: "",
        department_name: "",
        position_id: undefined,
        projects: []
      },
      departmentList: [],
      positionList: [],
      projects: []
    }
  },
  created() {
    if (this.$route.query.type === "edit") {
      this.type = "编辑"
      this.$api.detailAccount({ id: this.$route.query.id }).then(res => {
        this.form.account = res.data.account
        this.form.account_id = res.data.id
        this.form.name = res.data.name
        this.form.department_name = res.data.department
        this.form.position_id = res.data.admin_position_id

        this.ChangePosition(res.data.admin_position_id, res.data.projects)
        // let projects = []
        // res.data.projects.map(item => {
        //   projects.push({
        //     project_name:  item.project_name,
        //     area: item.project_areas,
        //   })
        // })
        // this.form.projects = projects
        // this.$api.getCompanyProjectList({ position_id: res.data.admin_position_id }).then((res2) => {
        //   this.form.projects = res2.data.map((item) => {
        //     item.areas.forEach((sitem) => {
        //       sitem.value = sitem.region_id
        //       sitem.label = sitem.region_name
        //     })
        //     res.data.projects.forEach((sitem) => {
        //       if (item.project_id === sitem.project_id) {
        //         item.area = sitem.project_areas ? sitem.project_areas : []
        //       }
        //     })
        //     return item
        //   })
        // })
        // console.log("this.form", this.form)
      })
    } else {
      this.type = "新增"
    }
    // this.getCompanyDepartmentList()
    this.getPositionProjectList()
  },
  methods: {
    // 获取部门
    // getCompanyDepartmentList() {
    //   this.$api.getCompanyDepartmentList().then((res) => {
    //     this.departmentList = res.data.map((item) => {
    //       item.value = item.id
    //       item.label = item.department_name
    //       return item
    //     })
    //   })
    // },

    // 获取岗位
    getPositionProjectList() {
      // let project_id = localStorage.getItem("project_id")
      this.$api.getPositionProjectList().then(res => {
        // this.positionList = res.data
        this.positionList = res.data.map(item => {
          item.value = item.id
          item.label = item.position_name
          return item
        })
        console.log(this.positionList, "positionList")
      })
    },

    // 选择岗位
    ChangePosition(id, select_projects = []) {
      console.log("select_projects", select_projects)
      this.$api.getPositionProjectList().then(res => {
        res.data.map(item => {
          if (item.id == id) {
            this.form.projects = item.role_project_list.map((sitem, key) => {
              sitem.value = sitem.project_id
              sitem.label = sitem.project_name
              sitem.areas = sitem.project_area.map(ssitem => {
                if (sitem.project_id == ssitem.project_id) {
                  // sitem.region_name = [ssitem.province_name,ssitem.city_name , ssitem.area_name]
                  sitem.region_name = `${ssitem.province_name}/${ssitem.city_name}/${ssitem.area_name}`
                  // console.log(sitem.region_name, "sitem.region_name")
                  ssitem.value = ssitem.area_id
                  ssitem.label = sitem.region_name
                  return ssitem
                }
              })

              let area = []
              if (select_projects.length > 0) {
                select_projects.map(item => {
                  if (item.project_id == sitem.project_id) {
                    area = JSON.parse(item.project_areas)
                  }
                })
              }

              // if (select_projects.length > 0 && select_projects[key]['project_id'] == sitem.project_id) {
              //   area = JSON.parse(select_projects[key]["project_areas"])
              // }
              sitem.area = area
              return sitem
            })
            console.log(this.form.projects, "this.form.projects")
          }
        })
      })
    },

    // 取消
    resetForm() {
      this.$router.go(-1)
    },

    // 保存
    onSubmit(form) {
      let projects = []
      form.projects.map(item => {
        let areas = []
        item.project_area.map(pitem => {
          areas.push(pitem.area_id)
        })
        projects.push({
          project_id: item.project_id,
          areas: areas
        })
      })
      let data = {
        account: form.account,
        name: form.name,
        department_name: form.department_name,
        state: 1,
        position_id: form.position_id,
        projects: projects
      }

      console.log("data", data)
      if (this.type === "新增") {
        this.$api
          .addAccount(data)
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
      console.log("form", this.form.projects)
      if (this.type === "编辑") {
        let projects = []
        this.form.projects.map(item => {
          // let area = []
          // item.project_area.map((sitem) => {
          //   area.push(sitem.area_id)
          // })
          projects.push({
            project_id: item.project_id,
            areas: item.area
          })
        })

        let param = {
          id: this.form.account_id,
          account: this.form.account,
          name: this.form.name,
          department_name: this.form.department_name,
          state: 1,
          position_id: this.form.position_id,
          projects: projects
        }
        this.$api
          .updateAccount(param)
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
    }
  }
}
</script>

<style></style>
