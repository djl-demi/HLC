<template>
  <div>
    <a-modal :title="modalTitle" :visible="changePermission" :width="600" :confirm-loading="confirmLoading" @ok="changePermissionOk" @cancel="changePermission = false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 0 }" :wrapper-col="{ span: 18, offset: 0 }">
        <a-form-model-item ref="name" label="名称" prop="name" has-feedback>
          <a-input v-model="form.name" placeholder="请输入名称" class="w100b" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="key" label="Key" prop="key" has-feedback>
          <a-input v-model="form.key" placeholder="请输入key" allowClear />
        </a-form-model-item>
        <a-form-model-item v-if="form.level === 2" ref="icon" label="Icon" prop="icon" has-feedback>
          <a-input v-model="form.icon" placeholder="请输入icon" allowClear />
        </a-form-model-item>
        <a-form-model-item v-if="form.level === 4" ref="class" label="Class" prop="class" has-feedback>
          <a-input v-model="form.class" placeholder="请输入class" allowClear />
        </a-form-model-item>
        <a-form-model-item v-if="form.level === 4" ref="method" label="Method" prop="method" has-feedback>
          <a-input v-model="form.method" placeholder="请输入method" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="is_record" label="记录操作" prop="is_record">
          <a-radio-group name="is_record" v-model="form.is_record">
            <a-radio :value="1">记录</a-radio>
            <a-radio :value="0">不记录</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "TyPermissionOperation",
  props: {
    modalTitle: String,
    form: Object
  },
  data() {
    return {
      confirmLoading: false,
      changePermission: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
        icon: [{ required: true, message: "请输入Icon", trigger: "change" }],
        is_record: [{ required: true, message: "请选择是否记录", trigger: "change" }]
      }
    }
  },
  methods: {
    changePermissionOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          this.$emit("submit", this.form)
        }
      })
    }
  }
}
</script>

<style></style>
