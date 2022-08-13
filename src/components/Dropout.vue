<template>
  <div style="width: 100%" class="comp-item">
<!--    <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-if="isTemplate">-->
<!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{"("+CData.id+")"}}</span> Dropout-->
<!--    </div>-->
    <el-collapse v-if="!isTemplate">
      <el-collapse-item>
        <template #title>
          Dropout
        </template>
        <div>
          content
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
      >
        <el-collapse-item name="1">
          <template #title>
            <el-form-item label="rate" prop="rate">
              <el-input
                  v-model="CData.rate"
                  placeholder="Float between 0 and 1"
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
        {required: true, message: 'Please input Activity name', trigger: 'blur'}
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