<template>
  <div style="width: 100%" class="comp-item">
    <el-collapse v-if="!isTemplate">
      <el-collapse-item>
        <template #title>
          <h3>Convolution 2D</h3>
        </template>
        <div>
          2D convolution layer (e.g. spatial convolution over images).
          <br/>
          This layer creates a convolution kernel that is convolved
          with the layer input to produce a tensor of
          outputs.
          <br/>
          The purpose of convolution operation is to extract different features of the input.
          The first convolution layer may only extract some low-level features, such as edges, lines and corners.
          The network of more layers can iteratively extract more complex features from the low-level features.
        </div>
      </el-collapse-item>
    </el-collapse>
    <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-if="isTemplate">
      <!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{"("+CData.id+")"}}</span>
            -->
      Convolution2D
    </div>
    <el-collapse v-if="!isTemplate">
      <el-form style="margin: 10px 0 0 20px" :model="CData" :rules="rules" ref="ruleForms"
               @validate="methods.validate"
               hide-required-asterisk=false
               label-position="left"
               label-width="120px"
      >
        <el-collapse-item name="1">
          <template #title>
            <el-form-item label="filter" prop="filter">
              <el-input v-model="CData.filter"
                        placeholder="An integer"
                        @keyup.enter.stop
                        @keyup.space.stop
                        @click.stop
                        style="width: 250px"
              ></el-input>
            </el-form-item>
          </template>
          <div>
            Integer, the dimensionality of the output space (i.e. the number of
            convolution kernels in the convolution).
            <br/>
            Convolution kernels can represent certain characteristics.
            It performs convolution operation with sample data to obtain samples containing convolution features.
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template #title>
            <el-form-item label="kernel size" prop="kernelSize">
              <el-input v-model="CData.kernelSize"
                        placeholder="Two integer separated by a comma"
                        @keyup.enter.stop
                        @keyup.space.stop
                        @click.stop
                        style="width: 250px"></el-input>
            </el-form-item>
          </template>
          <div>
            An integer or tuple/list of 2 integers, specifying the height
            and width of the 2D convolution kernel.
          </div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template #title>
            <el-form-item label="activation" prop="activation">
              <el-select v-model="CData.activation"
                         @keyup.enter.stop
                         @keyup.space.stop
                         @click.stop
                         style="width: 250px"
              >
                <el-option v-for="(item,index) in activationList" :value="item.value" :key="index">{{ item.value }}
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <div>
            Using the activation function, the input can be nonlinear transformed, enabling it to learn and perform more
            complex tasks.
            <br/>
            Read keras.activations file to get more detail about every kind of activation function.
          </div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template #title>
            <el-form-item label="padding">
              <el-select v-model="CData.padding"
                         @keyup.enter.stop
                         @keyup.space.stop
                         @click.stop
                         style="width: 250px"
              >
                <el-option value="valid">valid</el-option>
                <el-option value="same">same</el-option>
              </el-select>
            </el-form-item>
          </template>
          <div>
            "valid" means no padding. "same" results in padding with zeros evenly
            to the left/right or up/down of the input. When `padding="same"` and
            `strides=1`, the output has the same size as the input.
          </div>
        </el-collapse-item>


      </el-form>
    </el-collapse>

  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {ComponentItem} from "@/components/ComponentItem";
import {ref} from "vue";

export default {
  name: "LCConvolution2D",
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
    const activationList = reactive([
      {value: "relu"},
      {value: "softmax"},
      {value: "elu"},
      {value: "selu"},
      {value: "softplus"},
      {value: "softsign"},
      {value: "tanh"},
      {value: "sigmoid"},
      {value: "linear"}
    ])
    const CData = reactive(props.data)
    const ruleForms = ref(null)
    const rules = reactive({
      filter: [
        {required: true, message: 'Please enter correct value', trigger: 'blur'}
      ],
      kernelSize: [
        {required: true, message: 'Please enter correct value', trigger: 'blur'}
      ],
      activation: [
        {required: true, message: 'Please enter correct value', trigger: 'change'}
      ]
    })
    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('open', {type: 'Convolution2D', id: CData.id})
          console.log(props.isParam)
          if (props.isParam) {
            CData.isActive = true
          }
        }
      },
      async validateForm() {
        await ruleForms.value.validate(valid => {
          if (valid) {
            CData.isValid = true
          }
        })
        return CData.isValid
      },
      validate(prop, isValid) {
        CData.isValid[prop] = isValid
      }
    }
    onMounted(() => {
          CData.padding = 'valid'
        }
    )
    return {
      props,
      CData,
      methods,
      activationList,
      ruleForms,
      rules
    }
  }
}
</script>

<style scoped>

</style>