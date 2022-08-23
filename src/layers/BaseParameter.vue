<template>
  <Transition>
    <div style="width: 100%;">
      <div @click="methods.handleClick" style="cursor: pointer" :style="{color: (CData.isActive ? 'blue' : 'black')}">
        <el-collapse v-if="!isTemplate">
          <el-collapse-item>
            <template #title>
              <h3>BaseParameter</h3>
            </template>
            <div>
              Some base parameter
            </div>
          </el-collapse-item>
        </el-collapse>
        <div v-else>
          <!--        <span style="color: red; font-weight: bold"
                        v-if="CData.id !== undefined && isTemplate">{{ "(" + CData.id + ")" }}</span> -->
          BaseParameter
        </div>
      </div>


      <el-collapse v-if="!isTemplate">
        <el-form style="width: 90%; margin: 10px 0 0 20px"
                 v-if="!isTemplate"
                 :rules="rules"
                 :model="CData"
                 ref="ruleForms"
                 @validate="methods.validate"
                 :validate-on-rule-change="true"
                 hide-required-asterisk=false
                 label-position="left"
                 label-width="120px"
        >

          <el-collapse-item name="4">
            <template #title>
              <el-form-item label="Batch Size">
                <el-input v-model="CData.batchSize"
                          placeholder="input an integer"
                          @keyup.enter.stop
                          @keyup.space.stop
                          @click.stop
                          style="width: 220px"
                ></el-input>
              </el-form-item>
            </template>
            <div>
              Size of mini-batch.
              <br/>
              Please enter an integer or 'None'.
              <br/>
              'None' means that don't use mini-batch to train.
            </div>
          </el-collapse-item>

          <el-collapse-item name="5">
            <template #title>
              <el-form-item label="Epochs">
                <el-input v-model="CData.epochs"
                          placeholder="input an integer"
                          @keyup.enter.stop
                          @keyup.space.stop
                          @click.stop
                          style="width: 220px"
                ></el-input>
              </el-form-item>
            </template>
            <div>
              Size of mini-batch.
              <br/>
              Please enter an integer or 'None'.
              <br/>
              'None' means that don't use mini-batch to train.
            </div>
          </el-collapse-item>


          <el-collapse-item name="1">
            <template #title>
              <el-form-item label="Loss Function">
                <!--      <el-input v-model="CData.toCategorical"></el-input>-->
                <el-select v-model="CData.toCategorical"
                           @keyup.enter.stop
                           @keyup.space.stop
                           @click.stop
                           style="width: 220px"
                >
                  <el-option value="categorical_crossentropy">categorical_crossentropy</el-option>
                  <el-option value="sparse_categorical_crossentropy">sparse_categorical_crossentropy</el-option>
                  <el-option value="binary_crossentropy">binary_crossentropy</el-option>
                  <el-option value="mean_squared_error">mean_squared_error</el-option>
                  <el-option value="mean_absolute_error">mean_absolute_error</el-option>
                  <el-option value="mean_absolute_percentage_error">mean_absolute_percentage_error</el-option>
                  <el-option value="mean_squared_logarithmic_error">mean_squared_logarithmic_error</el-option>
                  <el-option value="squared_hinge">squared_hinge</el-option>
                  <el-option value="hinge">hinge</el-option>
                  <el-option value="categorical_hinge">categorical_hinge</el-option>
                  <el-option value="logcosh">logcosh</el-option>

                </el-select>
              </el-form-item>
            </template>
            <div>
              1.categorical cross-entropy: Training tags were encoded using one-hot;
              <br/>
              2.sparse categorical cross-entropy: Using digital tag;
              <br/>
              More details please see the official document:
              <a href="https://keras.io/zh/losses/#sparse_categorical_crossentropy">losses</a>
            </div>
          </el-collapse-item>
          <!--          <el-collapse
                        v-if=" CData.toCategorical === 'categorical_crossentropy'"
                        style="margin: 0 0 0 100px"
                    >-->
          <el-collapse-item name="2"
                            v-if=" CData.toCategorical === 'categorical_crossentropy'"
                            style="margin: 0 0 0 100px"
          >
            <template #title>
              <el-form-item label="Classification">
                <el-input v-model="CData.numClasses"
                          placeholder="input an integer"
                          @keyup.enter.stop
                          @keyup.space.stop
                          @click.stop
                          style="width: 120px"
                ></el-input>
              </el-form-item>
            </template>
            <div>
              Number of Classification
            </div>
          </el-collapse-item>
          <!--          </el-collapse>-->

          <el-collapse-item name="3">
            <template #title>
              <el-form-item label="Optimizers">
                <el-select v-model="CData.optimizer.value"
                           @keyup.enter.stop
                           @keyup.space.stop
                           @click.stop
                           @change="methods.handleChange"
                           style="width: 220px"
                >
                  <el-option :value="item.value" v-for="item in options" :key="item.value">{{ item.value }}</el-option>
                </el-select>
              </el-form-item>
            </template>
            <div>
              If you don't know how to use it, use the default value.
              <br/>
              More details please see the official document:
              <a href="https://keras.io/api/optimizers/">optimizers</a>
            </div>
          </el-collapse-item>

          <el-form-item :label="item.name"
                        v-for="(item,index) in CData.optimizer.child"
                        :key="index"
                        style="margin: 10px 0px 10px 100px"
          >
            <el-input v-model="item.value"
                      placeholder="input a float"
                      @keyup.enter.stop
                      @keyup.space.stop
                      @click.stop
                      style="width: 120px"
            ></el-input>
          </el-form-item>
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
    const currentChild = ref({})
    const options = reactive([
      {
        value: 'Adam',
        child: [
          {
            name: 'learning rate',
            type: 'learning_rate',
            value: '0.001'
          },
          {
            name: 'beta1',
            type: 'beta_1',
            value: '0.9'
          },
          {
            name: 'beta2',
            type: 'beta_2',
            value: '0.999'
          },
          {
            name: 'epsilon',
            type: 'epsilon',
            value: '1e-08'
          }
        ]
      },
      {
        value: 'SGD',
        child: [
          {
            name: 'learning rate',
            type: 'learning_rate',
            value: '0.01'
          },
          {
            name: 'momentum',
            type: 'momentum',
            value: '0.0'
          },
          {
            name: 'decay',
            type: 'decay',
            value: '0.0'
          },
          {
            name: 'nesterov',
            type: 'nesterov',
            value: 'False'
          }
        ]
      },
      {
        value: 'RMSprop',
        child: [
          {
            name: 'learning rate',
            type: 'learning_rate',
            value: '0.001'
          },
          {
            name: 'rho',
            type: 'rho',
            value: '0.9'
          },
          {
            name: 'epsilon',
            type: 'epsilon',
            value: '1e-06'
          }
        ]
      },
      {
        value: 'Adagrad',
        child: [
          {
            name: 'learning rate',
            type: 'learning_rate',
            value: '0.01'
          },
          {
            name: 'epsilon',
            type: 'epsilon',
            value: '1e-06'
          }
        ]
      },
      {
        value: 'Adadelta',
        child: [
          {
            name: 'learning rate',
            type: 'learning_rate',
            value: '1.0'
          },
          {
            name: 'rho',
            type: 'rho',
            value: '0.95'
          },
          {
            name: 'epsilon',
            type: 'epsilon',
            value: '1e-06'
          }
        ]
      },
      {
        value: 'Adamax',
        child: [
          {
            name: 'learning rate',
            type: 'learning_rate',
            value: '0.002'
          },
          {
            name: 'beta1',
            type: 'beta_1',
            value: '0.9'
          },
          {
            name: 'beta2',
            type: 'beta_2',
            value: '0.999'
          },
          {
            name: 'epsilon',
            type: 'epsilon',
            value: '1e-08'
          }
        ]
      },
      {
        value: 'Nadam',
        child: [
          {
            name: 'learning rate',
            type: 'learning_rate',
            value: '0.002'
          },
          {
            name: 'beta1',
            type: 'beta_1',
            value: '0.9'
          },
          {
            name: 'beta2',
            type: 'beta_2',
            value: '0.999'
          },
          {
            name: 'epsilon',
            type: 'epsilon',
            value: '1e-08'
          },
          {
            name: 'schedule decay',
            type: 'schedule_decay',
            value: '0.004'
          }
        ]
      }
    ])
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

      },
      handleChange(value) {
        console.log(value)
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === value) {
            CData.optimizer.value = options[i].value
            CData.optimizer.child = options[i].child
            // console.log(options)
          }
        }
      }
    }
    onMounted(() => {
          CData.isActive = true
          CData.toCategorical = 'sparse_categorical_crossentropy'
          CData.batchSize = '128'
          CData.optimizer = {
            value: options[0].value,
            child: options[0].child
          }
          currentChild.value = options[0].child
        }
    )

    const rules = reactive({
      numClasses: [
        {required: true, message: 'Please input correct value', trigger: 'blur'}
      ]
    })
    return {
      CData,
      props,
      methods,
      rules,
      ruleForms,
      options,
      currentChild
    }
  }
}
</script>

<style lang="sass" scoped>

</style>