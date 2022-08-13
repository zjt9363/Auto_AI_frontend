<template>
  <Transition>
    <div style="width: 100%;">
      <div @click="methods.handleClick" style="cursor: pointer" :style="{color: (CData.isActive ? 'blue' : 'black')}">
        <el-collapse v-if="!isTemplate">
          <el-collapse-item>
            <template #title style="font-size: 16px">
              BaseParameter
            </template>
            <div>
              Consistent with real life: in line with the process and logic of real
              life, and comply with languages and habits that the users are used to;
            </div>
          </el-collapse-item>
        </el-collapse>
        <div v-else>
        <span style="color: red; font-weight: bold"
<!--              v-if="CData.id !== undefined && isTemplate">{{ "(" + CData.id + ")" }}</span> -->
          BaseParameter
        </div>
      </div>
      <el-collapse v-if="!isTemplate">
        <el-form style="width: 80%; margin: 10px 0 0 20px"
                 v-if="!isTemplate"
                 :rules="rules"
                 :model="CData"
                 ref="ruleForms"
                 @validate="methods.validate"
                 validate-on-rule-change="true"
        >
          <el-collapse-item name="1">
            <template #title>
              <el-form-item label="Number of classification" prop="numClasses">
                <el-input v-model="CData.numClasses"
                          placeholder="input an integer"
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
              <el-form-item label="To categorical">
                <!--      <el-input v-model="CData.toCategorical"></el-input>-->
                <el-select v-model="CData.toCategorical"
                           @keyup.enter.stop
                           @keyup.space.stop
                           @click.stop>
                  <el-option value="True">True</el-option>
                  <el-option value="False">False</el-option>
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
  </Transition>
</template>

<script>
import {ref, reactive, onMounted} from "vue";

export default {
  name: "BaseParameter",
  props: {
    data: {
      type: Object
    },
    isTemplate: {
      type: Boolean,
      default: false
    }
  },
  emits: ['getType'],
  setup(props, ctx) {
    const ruleForms = ref(null);
    const CData = reactive(props.data)
    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('getType', {type: 'BaseParameter'})
          CData.isActive = true
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
    onMounted(() => {
          CData.isActive = true
          CData.toCategorical = 'False'
        }
    )

    const rules = reactive({
      numClasses: [
        {required: true, message: 'Please input Activity name', trigger: 'blur'}
      ]
    })
    return {
      CData,
      props,
      methods,
      rules,
      ruleForms
    }
  }
}
</script>

<style scoped>
/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>