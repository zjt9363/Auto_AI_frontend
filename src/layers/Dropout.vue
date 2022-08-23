<template>
  <div style="width: 100%" class="comp-item">
<!--    <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-if="isTemplate">-->
<!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{"("+CData.id+")"}}</span> Dropout-->
<!--    </div>-->
    <el-collapse v-if="!isTemplate">
      <el-collapse-item>
        <template #title>
          <h3>Dropout</h3>
        </template>
        <div>
          The Dropout layer randomly sets input units to 0 with a frequency of `rate`
          at each step during training time, which helps prevent overfitting.
          Inputs not set to 0 are scaled up by 1/(1 - rate) such that the sum over
          all inputs is unchanged.
        </div>
      </el-collapse-item>
    </el-collapse>
    <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-else>
<!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{ "(" + CData.id + ")" }}</span>-->
      Dropout
    </div>
    <el-collapse v-if="!isTemplate">
      <el-form style="width: 80%; margin: 10px 0 0 20px"
               :model="CData"
               :rules="rules"
               ref="ruleForms"
               @validate="methods.validate"
               hide-required-asterisk=false
               label-position="left"
               label-width="120px"
      >
        <el-collapse-item name="1">
          <template #title>
            <el-form-item label="rate" prop="rate">
              <el-input
                  v-model="CData.rate"
                  placeholder="Float between 0 and 1"
                  @keyup.enter.stop
                  @keyup.space.stop
                  @click.stop
                  style="width: 250px"></el-input>
            </el-form-item>
          </template>
          <div>
            Float between 0 and 1. Fraction of the input units to drop.
          </div>
        </el-collapse-item>
      </el-form>
    </el-collapse>
  </div>
</template>

<script>
import {ComponentItem} from "@/components/ComponentItem";
import {reactive, ref} from "vue";

export default {
  name: "LCDropout",
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
    const changeTextColor = ref(props.isCurrent)
    const ruleForms = ref(null)
    const rules = reactive({
      rate: [
        {required: true, message: 'Please enter correct value', trigger: 'blur'}
      ]
    })
    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('open', {type: 'Dropout', id: CData.id})
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
        CData.isValid = isValid

      }
    }
    return {
      props,
      CData,
      methods,
      changeTextColor,
      rules,
      ruleForms
    }
  }
}
</script>

<style scoped>

</style>