<template>
  <div style="width: 100%" class="comp-item">
    <!--    <div @click="methods.handleClick" v-if="isTemplate" :style="{color: (CData.isActive ? 'blue' : 'black')}">-->
    <!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{"("+CData.id+")"}}</span> BatchNormalization-->
    <!--    </div>-->
    <el-collapse v-if="!isTemplate" >
      <el-collapse-item>
        <template #title>
          <h3> BatchNormalization </h3>
        </template>
        <div>
          As the depth of the network increases,
          the eigenvalue distribution of each layer will gradually approach the upper and lower ends of the output
          interval of the activation function.
          If this continues, the gradient will disappear.
          BN pulls the eigenvalue distribution of this layer back to the standard normal distribution.
          The eigenvalue will fall in the region where the activation function is sensitive to the input.
          A small change in input can lead to a large change in the loss function, making the gradient larger.
          Avoid gradient disappearance and accelerate convergence
        </div>
      </el-collapse-item>
    </el-collapse>
    <div @click="methods.handleClick()"  :style="{color: (CData.isActive ? 'blue' : 'black')}" v-else >
      <!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{ "(" + CData.id + ")" }}</span>-->
      BatchNormalization
    </div>

    <el-form :model="CData" v-if="!isTemplate"  >

      <el-input type="text"
                disabled v-model="CData.value"
                @keyup.enter.stop
                @keyup.space.stop
                @click.stop
                style="width: 200px;margin: 10px"
      />

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
    isParam: {
      type: Boolean,
      default: false
    }
  },
  emits: ['open'],
  setup(props, ctx) {
    onMounted(() => {
      CData.value = "BatchNormalization"
    })
    const CData = reactive(props.data)

    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('open', {type: 'BatchNormalization', id: CData.id})
          console.log(props.isParam)
          if (props.isParam) {
            console.log(12)
            CData.isActive = true
          }
        }

      }
    }
    return {
      CData,
      methods
    }
  }
}
</script>

<style scoped>
@import "../components/LCComponents.scss";
</style>