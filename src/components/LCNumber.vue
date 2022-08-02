<template>
  <div class="lc-item lc-text">
    <div class="main" @click="handleClick">
      <sort class="icon mover"/>
      <div class="template" v-if="isTemplate">
        {{ data.text }}
      </div>
      <div v-else>
        {{ cData.value }}
      </div>
    </div>
    <el-dialog
        v-model="showSetting"
        title="number"
        width="30%"
        class="settings"
    >
      <el-form label-width="120px" label-position="left" :rules="rules">
        <el-form-item label="value" prop="value">
          <el-input v-model="cData.before" type="number"/>
        </el-form-item>
        <el-form-item>

        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {Sort} from "@element-plus/icons-vue";
import {ComponentItem} from "@/components/ComponentItem";

export default {
  name: "LCText",
  components: {
    Sort
  },
  props: {
    data: [ComponentItem, Object],
    isTemplate: {
      type: Boolean,
      default: false
    },
    rules: {
      value: [{
        required: true,
        message: 'Please input a number',
        trigger: 'blur'
      }]
    }
  },
  data() {
    return {
      cData: null,
      showSetting: false
    }
  },
  created() {
    if (!this.isTemplate) {
      this.cData = this.data
      if (!this.cData.value) this.cData.value = 10
    }
  },
  methods: {
    handleClick() {
      if (this.isTemplate) return
      this.showSetting = !this.showSetting
      this.cData.before = this.cData.value
    },
    handleCancel(){
      this.showSetting = false
    },
    onSubmit() {
      console.log(this.data)
      this.cData.value = this.cData.before
      this.$emit('change', this.cData)
      this.showSetting = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import "./LCComponents.scss";
</style>
