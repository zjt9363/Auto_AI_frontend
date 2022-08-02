<template>
  <div style="width: 100%;"  class="comp-item">
    <div @click="methods.handleClick" v-if="isTemplate" :style="{color: (CData.isActive ? 'blue' : 'black')}">GlobalAveragePooling2D</div>
    <el-form v-if="!isTemplate">
      <el-form-item>
        <el-input type="text" disabled v-model="CData.value" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {reactive} from "vue";
import {ComponentItem} from "@/components/ComponentItem";
import {onMounted} from "vue";

export default {
  name: "GlobalAveragePooling2D",
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
  setup(props, ctx) {
    onMounted(() => {
      CData.value = "GlobalAveragePooling2D"
    })
    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('open', {type: 'GlobalAveragePooling2D', id: CData.id})
          if (props.isParam) {
            CData.isActive = true
          }
        }
      }
    }
    const CData = reactive(props.data)
    return {
      methods,
      CData
    }
  }
}
</script>

<style scoped>

</style>