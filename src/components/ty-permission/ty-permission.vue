<template>
  <div id="TyPermission">
    <a-row class="mb20" v-if="checked || edit">
      <a-col :span="14">
        <a-checkbox v-if="checked" v-model="checkAll" @change="selectedAll"> 全选 </a-checkbox>
      </a-col>
      <a-col :span="10" class="flex-right">
        <div class="flex-right" v-if="checked">
          <a-button @click="cancel"> 取消 </a-button>
          <a-button :loading="saveLoading" type="primary" class="ml20" @click="submit"> 保存 </a-button>
        </div>
        <a-button v-if="PermissionAdd && edit" class="fr" @click="clickOperation('add', {}, 0)" type="primary">新增系统</a-button>
      </a-col>
    </a-row>
    <div :class="$store.state.menuTheme === 'light' ? 'light' : 'dark'" ref="tableBox" @scroll="scrool()" :style="{ height: tableHeight, overflowY: 'auto' }">
      <a-table :loading="tableLoading" bordered :columns="columns" :data-source="sourceData" :pagination="false"></a-table>
    </div>
  </div>
</template>
<script>
import utils from "@/utils/utils"
export default {
  name: "TyPermission",
  props: {
    // 选择框
    checked: {
      type: Boolean,
      default: false
    },
    // 操作框
    edit: {
      type: Boolean,
      default: false
    },
    // 数据
    sourceData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格加载状态
    tableLoading: {
      type: Boolean,
      default: false
    },
    PermissionAdd: Boolean,
    PermissionEdit: Boolean,
    PermissionDel: Boolean
  },
  data() {
    return {
      scrollTop: 0,
      tableHeight: 0,
      saveLoading: false,
      checkAll: false,
      renderIcon: (row, level, showAdd = true) => {
        return [
          this.PermissionAdd && showAdd
            ? this.$createElement("img", {
                class: "ml10 cp",
                attrs: { src: require("@/assets/icons/add.png") },
                on: {
                  click: () => {
                    this.clickOperation("add", row, level)
                  }
                }
              })
            : null,
          this.PermissionEdit &&
            this.$createElement("img", {
              class: "ml10 cp",
              attrs: { src: require("@/assets/icons/edit.png") },
              on: {
                click: () => {
                  this.clickOperation("edit", row, level)
                }
              }
            }),
          this.PermissionDel &&
            this.$createElement("img", {
              class: "ml10 cp",
              attrs: { src: require("@/assets/icons/del.png") },
              on: {
                click: () => {
                  this.clickOperation("del", row, level)
                }
              }
            })
        ]
      },
      columns: [
        {
          title: "系统名称",
          key: "system",
          dataIndex: "system",
          customRender: (value, row, index) => {
            const obj = {
              children: [
                this.checked
                  ? this.$createElement("a-checkbox", {
                      class: "mr10 vatt",
                      attrs: {
                        checked: row.checked1
                      },
                      on: {
                        change: e => {
                          this.selectedOperation(e, row, 0)
                          this.checkAllchecked(e)
                        }
                      }
                    })
                  : null,
                this.$createElement("span", { class: "vatt" }, value),
                this.edit ? [...this.renderIcon(row, 1)] : null
              ],
              attrs: {}
            }
            if (index === row.system_num_start) {
              obj.attrs.rowSpan = row.system_num
            }
            if (index > row.system_num_start && index < row.system_num + row.system_num_start) {
              obj.attrs.rowSpan = 0
            }
            return obj
          }
        },
        {
          title: "一级模块",
          key: "one_module",
          dataIndex: "one_module",
          customRender: (value, row, index) => {
            if (value) {
              const obj = {
                children: [
                  this.checked
                    ? this.$createElement("a-checkbox", {
                        class: "mr10 vatt",
                        attrs: {
                          checked: row.checked2
                        },
                        on: {
                          change: e => {
                            this.selectedOperation(e, row, 1)
                            this.checkAllchecked(e)
                            console.log(row, "row")

                            // this.clickOneModule("one_module", e, row)
                          }
                        }
                      })
                    : null,
                  this.$createElement("span", { class: "vatt" }, value),
                  this.edit ? [...this.renderIcon(row, 2)] : null
                ],
                attrs: {}
              }
              if (index === row.one_module_num_start) {
                obj.attrs.rowSpan = row.one_module_num
              }
              if (index > row.one_module_num_start && index < row.one_module_num + row.one_module_num_start) {
                obj.attrs.rowSpan = 0
              }
              return obj
            } else {
              return null
            }
          }
        },
        {
          title: "二级模块",
          key: "two_module",
          dataIndex: "two_module",
          customRender: (value, row, index) => {
            if (value) {
              const obj = {
                children: [
                  this.checked
                    ? this.$createElement("a-checkbox", {
                        class: "mr10 vatt",
                        attrs: {
                          checked: row.checked3
                        },
                        on: {
                          change: e => {
                            this.selectedOperation(e, row, 2)
                            this.checkAllchecked(e)
                          }
                        }
                      })
                    : null,
                  this.$createElement("span", { class: "vatt" }, value),
                  this.edit ? [...this.renderIcon(row, 3)] : null
                ],
                attrs: {}
              }
              if (index === row.two_module_num_start) {
                obj.attrs.rowSpan = row.two_module_num
              }
              if (index > row.two_module_num_start && index < row.two_module_num + row.two_module_num_start) {
                obj.attrs.rowSpan = 0
              }
              return obj
            } else {
              return null
            }
          }
        },
        {
          title: "操作",
          key: "operation",
          dataIndex: "operation",
          customRender: (value, row, index) => {
            if (value) {
              return {
                children: [
                  this.checked
                    ? this.$createElement("a-checkbox", {
                        class: "mr10 vatt",
                        attrs: {
                          checked: row.checked4
                        },
                        on: {
                          change: e => {
                            this.selectedOperation(e, row, 3)
                            this.checkAllchecked(e)
                          }
                        }
                      })
                    : null,
                  this.$createElement("span", { class: "vatt" }, value),
                  this.edit ? [...this.renderIcon(row, 4, false)] : null
                ],
                attrs: {}
              }
            } else {
              return null
            }
          }
        }
      ]
    }
  },
  created() {},
  mounted() {
    this.getHeight(document.documentElement.clientHeight) // 设置地图可用高度
    window.onresize = () => this.getHeight(document.documentElement.clientHeight) // 定义窗口大小变更通知事件
  },
  updated() {
    // 如果滚动条高度不为0且表格有数据 就在视图更新完后将滚动条恢复到上次的位置
    if (this.scrollTop && this.sourceData.length) {
      this.$refs.tableBox.scrollBy(0, this.scrollTop)
    }
    this.checkAllchecked()
  },
  methods: {
    // 防抖 获取滚动条滚动的高度
    scrool: utils.debounce(function() {
      if (this.$refs.tableBox.scrollTop !== 0) this.scrollTop = this.$refs.tableBox.scrollTop
    }, 1000),

    // 计算表格可用高度
    getHeight(value) {
      this.tableHeight = Number(value) - 260 + "px"
    },

    // 全选
    selectedAll(e) {
      this.sourceData.forEach(item => {
        item.checked1 = e.target.checked
        item.checked2 = e.target.checked
        item.checked3 = e.target.checked
        item.checked4 = e.target.checked
      })
    },

    // 检查全选
    checkAllchecked(e) {
      let flag = true
      this.sourceData.forEach(item => {
        //  名称为空代表着没有权限需要控制 但是为空时对应的checked也会为false 这时会影响全选判断  所以名称不为空时才判断是否选中
        if (
          (item.system !== "" && item.checked1 !== true) ||
          (item.one_module !== "" && item.checked2 !== true) ||
          (item.two_module !== "" && item.checked3 !== true) ||
          (item.operation !== "" && item.checked4 !== true)
        ) {
          flag = false
        }
      })
      this.checkAll = flag
    },

    //点击单元格复选框
    selectedOperation(e, row, level) {
      const checked = e.target.checked
      if (level === 0) {
        this.sourceData.map(item => {
          if (row.system_id === item.system_id) {
            item.checked1 = e.target.checked
            item.checked2 = e.target.checked
            item.checked3 = e.target.checked
            item.checked4 = e.target.checked
          }
        })
      }

      if (level === 1) {
        this.sourceData.forEach(item => {
          if (row.one_module_id === item.one_module_id) {
            item.checked2 = e.target.checked
            item.checked3 = e.target.checked
            item.checked4 = e.target.checked
          }
        })
        this.checked1(row)
      }
      if (level === 2) {
        this.sourceData.map(item => {
          if (row.two_module_id === item.two_module_id) {
            item.checked3 = e.target.checked
            item.checked4 = e.target.checked
          }
        })
        this.checked2(row)
        this.checked1(row)
      }
      if (level === 3) {
        this.sourceData.forEach(item => {
          if (row.operation_id === item.operation_id) {
            item.checked4 = e.target.checked
          }
        })
        this.checked3(row)
        this.checked2(row)
        this.checked1(row)
      }
    },
    checked1(row) {
      let checked1 = this.sourceData.some(item => {
        if (row.system_id === item.system_id) return item.checked2
      })
      this.sourceData.forEach(item => {
        if (row.system_id === item.system_id) {
          item.checked1 = checked1
        }
      })
    },
    checked2(row) {
      let checked2 = this.sourceData.some(item => {
        if (row.one_module_id === item.one_module_id) return item.checked3
      })
      this.sourceData.forEach(item => {
        if (row.one_module_id === item.one_module_id) {
          item.checked2 = checked2
        }
      })
    },
    checked3(row) {
      let checked3 = this.sourceData.some(item => {
        if (row.two_module_id === item.two_module_id) return item.checked4
      })
      this.sourceData.forEach(item => {
        if (row.two_module_id === item.two_module_id) {
          item.checked3 = checked3
        }
      })
    },

    // 取消
    cancel() {
      this.$emit("cancel")
    },

    // 保存
    submit() {
      this.$emit("sureSubmit")
    },

    // 点击单元格操作图标
    clickOperation(operation, row, level) {
      this.$emit("editOperation", operation, row, level)
    }
  }
}
</script>

<style lang="less">
#TyPermission {
  .ant-table-tbody > tr > td {
    padding: 0px 15px;
  }
  .light {
    .ant-table-row {
      background: #fff;
    }
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid #e8e8e8 !important;
    }
  }
  .dark {
    .ant-table-row {
      background: #1a222b;
    }
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid #eee !important;
    }
  }
}
</style>
