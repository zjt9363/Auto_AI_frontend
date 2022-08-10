<template>
<div style="width: 100%;">
  <div @click="methods.handleClick" style="cursor: pointer" :style="{color: (CData.isActive ? 'blue' : 'black')}"  v-if="isTemplate">
    BaseParameter
  </div>
  <el-form style="width: 80%; margin: 10px 0 0 20px" v-if="!isTemplate">
    <el-form-item label="Number of classification">
      <el-input v-model="CData.numClasses" placeholder="input an integer"></el-input>

    </el-form-item>
    <el-form-item label="To categorical">
<!--      <el-input v-model="CData.toCategorical"></el-input>-->
      <el-select v-model="CData.toCategorical">
        <el-option value = "True">True</el-option>
        <el-option value = "False">False</el-option>
      </el-select>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {reactive, onMounted} from "vue";

export default {
  name: "BaseParameter",
  props:{
    data: {
      type: Object
    },
    isTemplate: {
      type:Boolean,
      default: false
    }
  },
  emits: ['getType'],
  setup(props, ctx) {

    const CData = reactive(props.data)
    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('getType', {type: 'BaseParameter'})
          CData.isActive = true
        }
      }
    }
    onMounted(()=>{
      CData.isActive = true
      CData.toCategorical = 'False'
    })
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