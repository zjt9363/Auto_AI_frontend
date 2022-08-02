<template>
<div style="width: 100%"  class="comp-item">
  <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-if="isTemplate">MaxPooling2D</div>
  <el-form style="margin: 10px 0 0 20px" v-if="!isTemplate">
    <el-form-item label="pool size">
      <el-input v-model="CData.poolSize" placeholder="Two integer separated by a comma"></el-input>
    </el-form-item>
    <el-form-item label="padding">
      <el-select v-model="CData.padding">
        <el-option value="valid">valid</el-option>
        <el-option value="same">same</el-option>
      </el-select>
    </el-form-item>
  </el-form>
</div>

</template>

<script>
import {ComponentItem} from "@/components/ComponentItem";
import {onMounted, reactive} from "vue";


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
    onMounted( ()=>{
          CData.padding = 'valid'
        }
    )
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