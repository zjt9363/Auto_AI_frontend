<template>
<div style="width: 100%"  class="comp-item">
  <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-if="isTemplate">MaxPooling2D</div>
  <el-form style="margin: 10px 0 0 20px" v-if="!isTemplate">
    <el-form-item>
      <el-input-number label="pool size"  v-model="CData.poolSize">

      </el-input-number>
    </el-form-item>
  </el-form>
</div>

</template>

<script>
import {ComponentItem} from "@/components/ComponentItem";
import {reactive} from "vue";

export default {
  name: "MaxPooling2D",
  props: {
    data: [ComponentItem, Object],
    isTemplate: {
      type: Boolean,
      default: false
    },
    isParam: {
      type: Boolean,
      default: false
    }
  },
  emits: ['open'],
  setup(props, ctx) {
    const CData = reactive(props.data)
    const methods = {
      handleClick() {
        if(props.isTemplate) {
          ctx.emit('open', {type: 'MaxPooling2D', id: CData.id})
          if (props.isParam) {
            CData.isActive = true
          }
        }
      }
    }
    return {
      CData,
      props,
      methods
    }
  }
}
</script>

<style scoped>

</style>