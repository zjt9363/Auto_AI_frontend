<template>
 <div style="width: 100%" class="comp-item">
   <div @click="methods.handleClick" v-if="isTemplate" :style="{color: (CData.isActive ? 'blue' : 'black')}" >
     BatchNormalization
   </div>
   <el-form v-if="!isTemplate">
     <el-form-item prop="value">
       <el-input type="text" disabled v-model="CData.value"/>
     </el-form-item>
   </el-form>
 </div>
</template>

<script>
import {reactive, onMounted} from 'vue'
import {ComponentItem} from "@/components/ComponentItem";

export default {
  name: "BatchNormalization",
  props: {
    data: [ComponentItem, Object],
    isTemplate: {
      type: Boolean,
      default: false
    },
    isParam:{
      type: Boolean,
      default: false
    }
  },
  emits:['open'],
  setup(props, ctx) {
    onMounted(()=>{
      CData.value = "BatchNormalization"
    })
    const CData = reactive(props.data)
    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('open', {type: 'BatchNormalization', id: CData.id})
          if(props.isParam) {
            CData.isActive = true
          }
        }

      }
    }
    return  {
      CData,
      methods
    }
  }
}
</script>

<style scoped>
@import "./LCComponents.scss";
</style>