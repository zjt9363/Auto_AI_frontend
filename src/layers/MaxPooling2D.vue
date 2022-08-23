<template>
  <div style="width: 100%" class="comp-item">
    <el-collapse v-if="!isTemplate">
      <el-collapse-item>
        <template #title>
          <h3>MaxPooling2D</h3>
        </template>
        <div>
          The main function is to compress the data scale and shorten the training time.
          In addition, the robustness of the training algorithm can be improved.
        </div>
      </el-collapse-item>
    </el-collapse>
    <div @click="methods.handleClick()" :style="{color: (CData.isActive ? 'blue' : 'black')}" v-else>
<!--      <span style="color: red; font-weight: bold" v-if="CData.id !== undefined">{{ "(" + CData.id + ")" }}</span>-->
      MaxPooling2D
    </div>
    <el-collapse v-if="!isTemplate">
      <el-form style="margin: 10px 0 0 20px"
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
            <el-form-item label="pool size" prop="poolSize">
              <el-input v-model="CData.poolSize"
                        placeholder="Two integer separated by a comma"
                        @keyup.enter.stop
                        @keyup.space.stop
                        @click.stop
                        style="width: 250px"
              ></el-input>
            </el-form-item>
          </template>
          <div>
            integer or tuple of 2 integers.
            <br/>
            Window size over which to take the maximum.
            `(2, 2)` will take the max value over a 2x2 pooling window.
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template #title>
            <el-form-item label="padding">
              <el-select v-model="CData.padding"
                         @keyup.enter.stop
                         @keyup.space.stop
                         @click.stop
                         style="width: 250px">
                <el-option value="valid">valid</el-option>
                <el-option value="same">same</el-option>
              </el-select>
            </el-form-item>
          </template>
          <div>
            One of `"valid"` or `"same"` (case-insensitive).
            <br/>
            "valid" means no padding. "same" results in padding evenly to
            the left/right or up/down of the input such that output has the same
            height/width dimension as the input.
          </div>
        </el-collapse-item>

      </el-form>

    </el-collapse>

  </div>

</template>

<script>
import {ComponentItem} from "@/components/ComponentItem";
import {onMounted, reactive} from "vue";
import {ref} from "vue";


export default {
  name: "MaxPooling2D",
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
    const ruleForms = ref(null)
    const rules = reactive({
      poolSize: [
        {required: true, message: 'Please input correct value', trigger: 'blur'}
      ],
      padding: [
        {required: true, message: 'Please input correct value', trigger: 'blur'}
      ]
    })
    const methods = {
      handleClick() {
        if (props.isTemplate) {
          ctx.emit('open', {type: 'MaxPooling2D', id: CData.id})
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

</style>