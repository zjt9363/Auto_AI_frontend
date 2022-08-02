<template>
<div style="width: 100%;"  class="comp-item">
  <div @click="methods.handleClick" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-if="isTemplate">Dense</div>
  <el-form style="width: 80%; margin: 10px 0 0 20px" v-if="!isTemplate">
  <el-form-item label="units">
    <el-input v-model="CData.units"></el-input>
  </el-form-item>
  <el-form-item label="activation">
    <el-input v-model="CData.activation"></el-input>
  </el-form-item>
  </el-form>
</div>
</template>

<script>
import {ComponentItem} from "@/components/ComponentItem";
import {reactive} from "vue";

export default {
  name: "LCDense",
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
        if(props.isTemplate){
          ctx.emit('open', {type: 'Dense', id: CData.id})
          if(props.isParam) {
            CData.isActive = true
          }
        }
      }
    }

    return {
      props,
      CData,
      methods
    }
  }
}
</script>

<style scoped>

</style>