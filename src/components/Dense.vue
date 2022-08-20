<template>
  <div style="width: 100%;" class="comp-item">
<!--    <div @click="methods.handleClick" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-if="isTemplate">-->
<!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{"("+CData.id+")"}}</span> Dense-->
<!--    </div>-->
    <el-collapse v-if="!isTemplate">
      <el-collapse-item>
        <template #title>
          Dense
        </template>
        <div>
          `Dense` implements the operation:
          `output = activation(dot(input, kernel) + bias)`
          where `activation` is the element-wise activation function
          passed as the `activation` argument, `kernel` is a weights matrix
          created by the layer, and `bias` is a bias vector created by the layer
          (only applicable if `use_bias` is `True`). These are all attributes of
          `Dense`.

        </div>
      </el-collapse-item>
    </el-collapse>
    <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-else>
<!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{ "(" + CData.id + ")" }}</span>-->
      Dense
    </div>
    <el-collapse v-if="!isTemplate">
      <el-form style="width: 80%; margin: 10px 0 0 20px"
               :model="CData"
               :rules="rules"
               ref="ruleForms"
               @validate="methods.validate"
      >
        <el-collapse-item name="1">
          <template #title>
            <el-form-item label="units" prop="units">
              <el-input v-model="CData.units"
                        placeholder="Positive integer"
                        @keyup.enter.stop
                        @keyup.space.stop
                        @click.stop
              ></el-input>
            </el-form-item>
          </template>
          <div>
            Positive integer, dimensionality of the output space.
          </div>
        </el-collapse-item>

        <el-collapse-item name="2">
          <template #title>
            <el-form-item label="activation" prop="activation">
              <el-select v-model="CData.activation"
                         @keyup.enter.stop
                         @keyup.space.stop
                         @click.stop
              >
                <el-option
                    v-for="(item,index) in activationList"
                    :value="item.value"
                    :key="index">
                  {{ item.value }}
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <div>
            Using the activation function, the input can be nonlinear transformed, enabling it to learn and perform more complex tasks.
            <br/>
            Read keras.activations file to get more detail about every kind of activation function.
          </div>
        </el-collapse-item>
      </el-form>
    </el-collapse>
  </div>
</template>

<script>
import {ComponentItem} from "@/components/ComponentItem";
import {reactive} from "vue";
import {ref} from "vue";

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
      units: [
        {required: true, message: 'Please input units', trigger: 'blur'}
      ],
      activation: [
        {required: true, message: 'Please input activation', trigger: 'change'}
      ]
    })
    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('open', {type: 'Dense', id: CData.id})
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

    return {
      props,
      CData,
      methods,
      activationList,
      rules,
      ruleForms
    }
  }
}
</script>

<style scoped>

</style>