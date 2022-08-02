<template>
<div style="width: 100%"  class="comp-item">
  <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-if="isTemplate">Dropout</div>
  <el-form style="width: 80%; margin: 10px 0 0 20px" v-if="!isTemplate">
    <el-form-item label="rate">
      <el-input v-model="CData.rate" placeholder="Float between 0 and 1"></el-input>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {ComponentItem} from "@/components/ComponentItem";
import { reactive, ref} from "vue";

export default {
  name: "LCDropout",
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
    const changeTextColor = ref(props.isCurrent)
    const methods = {
      handleClick() {
        if(props.isTemplate) {
          ctx.emit('open', {type: 'Dropout', id: CData.id})
          if(props.isParam) {
            CData.isActive = true
          }
        }
      }
    }
    return {
      props,
      CData,
      methods,
      changeTextColor
    }
  }
}
</script>

<style scoped>

</style>