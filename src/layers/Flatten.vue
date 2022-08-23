<template>
  <div style="width: 100%;" class="comp-item">
    <!--    <div @click="methods.handleClick" v-if="isTemplate" :style="{color: (CData.isActive ? 'blue' : 'black')}">-->
    <!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{"("+CData.id+")"}}</span> Flatten-->
    <!--    </div>-->
    <el-collapse v-if="!isTemplate">
      <el-collapse-item>
        <template #title>
          <h3>Flatten</h3>

        </template>
        <div>
          Generally, as the last stage of CNN, it is connected after the pooling layer or the convolution layer.
          The previous layer has completed the task of extracting the features of the sample data in a higher dimension
          and realized the simplification of the sample data.
          The full connection layer decomposes two-dimensional data into one-dimensional data.
          According to the artificial neural network model, the nonlinear combination output is performed to complete
          the training task.
        </div>
      </el-collapse-item>
    </el-collapse>
    <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-else>
      <!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{ "(" + CData.id + ")" }}</span>-->
      Flatten
    </div>
    <el-collapse v-if="!isTemplate">
      <el-form>
        <el-input type="text" disabled v-model="CData.value"
                  style="width: 200px;margin: 10px"
        />
      </el-form>
    </el-collapse>

  </div>
</template>

<script>
import {reactive} from "vue";
import {ComponentItem} from "@/components/ComponentItem";
import {onMounted} from "vue";

export default {
  name: "LCFlatten",
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
      CData.value = "Flatten"
    })
    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('open', {type: 'Flatten', id: CData.id})
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