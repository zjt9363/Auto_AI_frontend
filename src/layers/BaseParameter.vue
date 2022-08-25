<template>
  <Transition>
    <div style="width: 100%; margin: 5px 0">
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

          <el-collapse-item name="6">
            <template #title>
              <el-form-item label="Early Stopping">
                <el-select v-model="CData.earlyStopping"
                           @keyup.enter.stop
                           @keyup.space.stop
                           @click.stop
                           style="width: 220px"
                >
                  <el-option value="true">true</el-option>
                  <el-option value="false">false</el-option>
                </el-select>
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

          <el-form-item v-if="CData.earlyStopping==='true'"
                        label="Monitor" style="margin: 10px 0px 10px 80px"
          >
            <el-select v-model="CData.monitor"
                       @keyup.enter.stop
                       @keyup.space.stop
                       @click.stop
                       style="width: 140px"
            >
              <el-option value="val_accuracy">val_accuracy</el-option>
              <el-option value="val_loss">val_loss</el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="CData.earlyStopping==='true'"
                        label="Min Delta"
                        style="margin: 10px 0px 10px 80px"
          >
            <el-input v-model="CData.minDelta"
                      placeholder="input an integer"
                      @keyup.enter.stop
                      @keyup.space.stop
                      @click.stop
                      style="width: 140px"
            ></el-input>
          </el-form-item>

          <el-form-item v-if="CData.earlyStopping==='true'"
                        label="Patience"
                        style="margin: 10px 0px 10px 80px"
          >
            <el-input v-model="CData.patience"
                      placeholder="input an integer"
                      @keyup.enter.stop
                      @keyup.space.stop
                      @click.stop
                      style="width: 140px"
            ></el-input>
          </el-form-item>


          <el-collapse-item name="5" v-if="CData.earlyStopping ==='false'">
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
                <el-select v-model="CData.lossFunction"
                           @keyup.enter.stop
                           @keyup.space.stop
                           @click.stop
                           style="width: 220px"
                >
                  <el-option :value="item" v-for="item in optimizersOption" :key="item">{{ item }}</el-option>
                  >
                  <!--                  <el-option value="categorical_crossentropy">categorical_crossentropy</el-option>
                                    <el-option value="sparse_categorical_crossentropy">sparse_categorical_crossentropy</el-option>
                                    <el-option value="binary_crossentropy">binary_crossentropy</el-option>
                                    <el-option value="mean_squared_error">mean_squared_error</el-option>
                                    <el-option value="mean_absolute_error">mean_absolute_error</el-option>
                                    <el-option value="mean_absolute_percentage_error">mean_absolute_percentage_error</el-option>
                                    <el-option value="mean_squared_logarithmic_error">mean_squared_logarithmic_error</el-option>
                                    <el-option value="squared_hinge">squared_hinge</el-option>
                                    <el-option value="hinge">hinge</el-option>
                                    <el-option value="categorical_hinge">categorical_hinge</el-option>
                                    <el-option value="logcosh">logcosh</el-option>-->

                </el-select>
              </el-form-item>
            </template>
            <div>
              1.categorical cross-entropy: Training tags were encoded using one-hot;
              <br/>
              2.sparse categorical cross-entropy: Using digital tag;
              <br/>
              More details please see the official document:
              <a href="https://keras.io/api/losses/" target="_blank">losses</a>
            </div>
          </el-collapse-item>
          <!--          <el-collapse
                        v-if=" CData.toCategorical === 'categorical_crossentropy'"
                        style="margin: 0 0 0 100px"
                    >-->
          <el-collapse-item name="2"
                            v-if=" CData.lossFunction === 'categorical_crossentropy'"
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
              <a href="https://keras.io/api/optimizers/" target="_blank">optimizers</a>
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
    const optimizersOption = reactive(
        ['categorical_crossentropy', 'sparse_categorical_crossentropy', 'binary_crossentropy', 'mean_squared_error', 'mean_absolute_error', 'mean_absolute_percentage_error', 'mean_squared_logarithmic_error', 'squared_hinge', 'hinge', 'categorical_hinge', 'logcosh'])

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
          CData.lossFunction = 'sparse_categorical_crossentropy'
          CData.batchSize = '128'
          CData.earlyStopping = 'true'
          CData.monitor = 'val_accuracy'
          CData.minDelta = "0.001"
          CData.patience = "5"
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
      currentChild,
      optimizersOption
    }
  }
}
</script>

<style lang="sass" scoped>

</style>