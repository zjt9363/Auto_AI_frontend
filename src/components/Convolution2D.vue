<template>
<div style="width: 100%"  class="comp-item">
  <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-if="isTemplate">
    Convolution2D
  </div>
  <el-form style="margin: 10px 0 0 20px" v-if="!isTemplate">
    <el-form-item label="filter">
      <el-input v-model="CData.filter" placeholder="An integer"></el-input>
    </el-form-item>
    <el-form-item label="kernal size">
      <el-input v-model="CData.kernalSize" placeholder="Two integer separated by a comma"></el-input>
    </el-form-item>
    <el-form-item label="activation">
      <el-select v-model="CData.activation">
        <el-option v-for="(item,index) in activationList" :value="item.value" :key="index">{{item.value}}</el-option>
      </el-select>
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
import {onMounted, reactive} from "vue";
import {ComponentItem} from "@/components/ComponentItem";

export default {
  name: "LCConvolution2D",
  props: {
    data: [ComponentItem, Object],
    isTemplate:{
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
    const activationList = reactive([
      {
        value:"softmax"
      },
      {
        value: "relu"
      },
      {
        value: "elu"
      },
      {
        value: "selu"
      },
      {
        value: "softplus"
      },
      {
        value: "softsign"
      },
      {
        value: "tanh"
      },
      {
        value: "sigmoid"
      },
      {
        value: "linear"
      }
    ])
    const CData = reactive(props.data)
    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('open', {type: 'Convolution2D', id: CData.id})
          if(props.isParam) {
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
      props,
      CData,
      methods,
      activationList
    }
  }
}
</script>

<style scoped>

</style>