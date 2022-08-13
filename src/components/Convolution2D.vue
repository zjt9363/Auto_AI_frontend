<template>
  <div style="width: 100%" class="comp-item">
    <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-if="isTemplate">
<!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{"("+CData.id+")"}}</span>-->
      Convolution2D
    </div>
    <el-collapse v-if="!isTemplate">
      <el-form style="margin: 10px 0 0 20px" :model="CData" :rules="rules" ref="ruleForms"
               @validate="methods.validate">
        <el-collapse-item name="1">
          <template #title>
            <el-form-item label="filter" prop="filter">
              <el-input v-model="CData.filter"
                        placeholder="An integer"
                        @keyup.enter.stop
                        @keyup.space.stop
                        @click.stop
              ></el-input>
            </el-form-item>
          </template>
          <div>
            Consistent with real life: in line with the process and logic of real
            life, and comply with languages and habits that the users are used to;
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template #title>
            <el-form-item label="kernel size" prop="kernelSize">
              <el-input v-model="CData.kernelSize"
                        placeholder="Two integer separated by a comma"
                        @keyup.enter.stop
                        @keyup.space.stop
                        @click.stop></el-input>
            </el-form-item>
          </template>
          <div>
            Consistent with real life: in line with the process and logic of real
            life, and comply with languages and habits that the users are used to;
          </div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template #title>
            <el-form-item label="activation" prop="activation">
              <el-select v-model="CData.activation"
                         @keyup.enter.stop
                         @keyup.space.stop
                         @click.stop
              >
                <el-option v-for="(item,index) in activationList" :value="item.value" :key="index">{{ item.value }}
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <div>
            Consistent with real life: in line with the process and logic of real
            life, and comply with languages and habits that the users are used to;
          </div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template #title>
            <el-form-item label="padding">
              <el-select v-model="CData.padding"
                         @keyup.enter.stop
                         @keyup.space.stop
                         @click.stop
              >
                <el-option value="valid">valid</el-option>
                <el-option value="same">same</el-option>
              </el-select>
            </el-form-item>
          </template>
          <div>
            Consistent with real life: in line with the process and logic of real
            life, and comply with languages and habits that the users are used to;
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
        {required: true, message: 'Please input Activity name', trigger: 'blur'}
      ],
      kernelSize: [
        {required: true, message: 'Please input Activity name', trigger: 'blur'}
      ],
      activation: [
        {required: true, message: 'Please input Activity name', trigger: 'change'}
      ]
    })
    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('open', {type: 'Convolution2D', id: CData.id})
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