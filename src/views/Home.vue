<template>

  <el-container class="container" v-loading="loading">
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-row justify="center" style="margin: 10px;box-sizing:border-box;">
            <el-col :span="5">
              <el-upload
                  ref="uploadRef"
                  class="upload-demo"
                  action="#"
                  :on-change="changeUpload"
                  :auto-upload="false"
              >
                <template #trigger>
                  <el-button type="primary">select file</el-button>
                </template>
                <template #default>
                  <el-button class="ml-3" type="success" @click="setUpload" style="margin: 0 10px">
                    upload to server
                  </el-button>
                </template>
              </el-upload>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" @click="submit">submit</el-button>
            </el-col>
            <el-col :span="5"  style="margin-right: 10px">
              <el-alert title="Please upload a file" type="error" center show-icon v-if="!fileIsUpload" :closable="false"/>
              <el-alert type="success" center show-icon v-else-if="fileIsUpload&&this.fileList.length !== 0" :closable="false">
                <template #title>
                  {{"["+this.fileList[0].name+"]--Upload Success"}}
                </template>
              </el-alert>
              <el-alert type="success" center show-icon v-else :closable="false">
                <template #title>
                  No file should be uploaded
                </template>
              </el-alert>
            </el-col>
            <el-col :span="5" v-if="fileList.length === 0">
              <el-switch v-model="fileIsUpload"/>No file should be uploaded
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>Layer</span>
              </div>
            </template>
            <el-row>
              <component v-for="(item,index) in componentsList" :is="item.type" :data="item.tempData" :isTemplate="true"
                         :key="index" @click.capture="tapComponents(item)"/>
            </el-row>
          </el-card>
          <div style="height: 10px"/>
          <!--          <el-row class="file-wrap">-->
          <!--            <el-card class="data_area">-->
          <!--              <template #header>-->
          <!--                <div class="card-header">-->
          <!--                  <span>Data File</span>-->
          <!--                </div>-->
          <!--              </template>-->
          <!--              <div v-if="!fileIsUpload">-->
          <!--                文件还未未上传-->
          <!--              </div>-->
          <!--              <div v-else>-->
          <!--                文件上传成功-->
          <!--              </div>-->
          <!--&lt;!&ndash;              <draggable&ndash;&gt;-->
          <!--&lt;!&ndash;                  draggable="false"&ndash;&gt;-->
          <!--&lt;!&ndash;                  :group="{&ndash;&gt;-->
          <!--&lt;!&ndash;                    name: 'lowCode',&ndash;&gt;-->
          <!--&lt;!&ndash;                    pull:'clone',&ndash;&gt;-->
          <!--&lt;!&ndash;                    put: false&ndash;&gt;-->
          <!--&lt;!&ndash;                  }"&ndash;&gt;-->
          <!--&lt;!&ndash;                  :sort="true"&ndash;&gt;-->
          <!--&lt;!&ndash;                  :animation="300"&ndash;&gt;-->
          <!--&lt;!&ndash;                  filter=".unmover"&ndash;&gt;-->
          <!--&lt;!&ndash;                  v-model="fileList"&ndash;&gt;-->
          <!--&lt;!&ndash;                  item-key="item"&ndash;&gt;-->
          <!--&lt;!&ndash;                  ghostClass="ghost"&ndash;&gt;-->
          <!--&lt;!&ndash;              >&ndash;&gt;-->
          <!--&lt;!&ndash;                <template v-slot:item="{ element }">&ndash;&gt;-->
          <!--&lt;!&ndash;                  <component v-if="element.id" :is="element.type" :data="element" :key="element.id" class="file"&ndash;&gt;-->
          <!--&lt;!&ndash;                             @del="delFile"/>&ndash;&gt;-->
          <!--&lt;!&ndash;                </template>&ndash;&gt;-->
          <!--&lt;!&ndash;              </draggable>&ndash;&gt;-->
          <!--            </el-card>-->
          <!--          </el-row>-->
        </el-col>

        <el-col :span="8">
          <el-row>
            <el-card class="code_area">
              <template #header>
                <div class="card-header">
                  <span>Model:</span>
                  <el-button type="danger" @click="cleanAllData">
                    <el-icon size="16px">
                      <Delete/>
                    </el-icon>
                  </el-button>
                </div>

              </template>
              <BaseParameter :data="baseData" :isTemplate="true" @getType="openDiv"></BaseParameter>
              <draggable
                  id="code"
                  group="lowCode"
                  :animation="300"
                  filter=".unmover"
                  v-model="list"
                  item-key="id"
                  ghostClass="ghost"
                  @dragstart="showBin=true"
                  @dragend="handleDragEnd"
              >

                <template v-slot:item="{element}">
                  <component v-if="element.id" :is="element.type" :data="element" :key="element.id" :isTemplate="true"
                             :isParam="true" @open="openDiv"/>
                </template>
              </draggable>
            </el-card>
          </el-row>
        </el-col>
        <el-col :span="10">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>Layer Parameter:</span>
              </div>
            </template>
            <component
                :is="currentComponents.type"
                :data="currentComponents"
                :key="currentComponents.id"
                :isTemplate="false"
                ref="childRules"
            />
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <div id="bin" :class="{'bin-show':showBin}">
      <el-icon size="32px">
        <Delete/>
      </el-icon>
      <draggable
          group="lowCode"
          v-model="binList"
          item-key="item"
          ghostClass="ghost"
          chosenClass="will_delete"
          @dragenter="willDelete=true"
          @dragleave="willDelete=false"
          @add="deleteItem"
      >
        <template v-slot:item="{element}">
          <div>{{ element.id }}</div>
        </template>
      </draggable>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="Tips"
        width="70%"
        :before-close="handleClose"
    >
      <template #header>
        <div class="card-header">
          <span>Result from Server:</span>
        </div>
      </template>
      <div style="height: 400px; overflow: auto">
        <div v-for="(item,index) in returnData" :key="index">
          {{ item }}
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
// 导入拖拽
import draggable from "vuedraggable";
import {Delete} from '@element-plus/icons-vue'

// 导入组件
import LcData from "@/components/LCData";
import LcNumber from "@/components/LCNumber";
import Convolution2D from "@/components/Convolution2D";
import MaxPooling2D from "@/components/MaxPooling2D";
import Dense from "@/components/Dense";
import Dropout from "@/components/Dropout";
import BatchNormalization from "@/components/BatchNormalization";
import GlobalAveragePooling2D from "@/components/GlobalAveragePooling2D";
import BaseParameter from "@/components/BaseParameter";
import Flatten from "@/components/Flatten";
// 导入工具
import {ComponentItem} from "@/components/ComponentItem";
import {getReturnData} from "@/api/getReturnData";
import {uploadFile} from "@/api/uploadFile";
import {stopReturnData} from "@/api/stopReturnData";


// 定义初始id
let id = 1

export default {
  name: "HomePage",
  components: {
    Delete,
    draggable,
    LcData,
    LcNumber,
    BaseParameter,
    Convolution2D,
    MaxPooling2D,
    Dropout,
    Dense,
    BatchNormalization,
    GlobalAveragePooling2D,
    Flatten,
  },
  data() {
    return {
      willDelete: false, // 是否删除已选组件
      showBin: false,
      dialogVisible: false,  //  显示隐藏对话框
      list: [], // 拖拽的列表,
      formDataT: new FormData(),  // 传给后端的文件放在这里
      componentsList: [
        {
          type: 'Convolution2D',
          tempData: {
            text: 'Text'
          },
          data: {
            filter: null,
            kernelSize: null,
            activation: '',
            padding: '',
            isActive: '',
            isValid: {
              filter: false,
              kernelSize: false,
              activation: false
            }
          },
        },
        {
          type: 'MaxPooling2D',
          tempData: {
            text: 'Number'
          },
          data: {
            poolSize: null,
            padding: null,
            isActive: '',
            isValid: {
              poolSize: false
            }
          }
        },
        {
          type: 'Dropout',
          tempData: {
            text: 'Number'
          },
          data: {rate: null, isActive: null, isValid: false},
        },
        {
          type: 'Dense',
          tempData: {
            text: 'Object'
          },
          data: {
            units: null, activation: null, isActive: '',
            isValid: {
              units: false,
              activation: false
            }
          }
        },
        {
          type: 'BatchNormalization',
          tempData: {
            text: 'Text'
          },
          data: ['value', 'isActive']
        },
        {
          type: 'GlobalAveragePooling2D',
          tempData: {
            text: 'Text'
          },
          data: ['value', 'isActive']
        },
        {
          type: 'Flatten',
          tempData: {
            text: 'Text'
          },
          data: ['value', 'isActive']
        }
      ],
      fileList: [],
      binList: [],
      submitList: [],
      baseData: null,
      loading: false,
      returnData: [],  //  后端返回的数据
      currentComponents: null,
      wsUrl: 'ws://localhost:8080/websocket',
      webSocket: null,
      fileIsUpload: false,  // 判断文件是否上传
      test: false,
      file: null
    };
  },
  created() {
    this.baseData = new ComponentItem(0, 'BaseParameter', {
      numClasses: '',
      toCategorical: '',
      isActive: '',
      isValid: false
    })
    this.currentComponents = this.baseData
  },
  mounted() {
    this.initWebSocket()
  },
  computed: {
    getAllList() {
      return this.clearAttr(JSON.parse(JSON.stringify([this.baseData, ...this.list, ...this.fileList])))
    },
  },
  methods: {
    handleDragEnd() {
      this.showBin = false
    },
    tapComponents(e) {
      const obj = new ComponentItem(id++, e.type, this.deepClone(e.data) || null)
      this.list.push(obj)
      this.currentComponents = obj
      obj.isActive = true
      this.openDiv(obj)
    },
    clearAttr(oldArr) {
      let arr = oldArr
      for (let i = 0; i < arr.length; i++) {
        if (this.hasProperty(arr[i], 'isActive')) {
          Reflect.deleteProperty(arr[i], 'isActive')
        }
        if (this.hasProperty(arr[i], 'isValid')) {
          Reflect.deleteProperty(arr[i], 'isValid')
        }
      }
      return arr
    },
    hasProperty(obj, key) {
      return Object.keys(obj).includes(key)
    },
    // delFile(id) {
    //   for (let i = 0; i < this.fileList.length; i++) {
    //     if (this.fileList[i].id === id) {
    //       this.fileList.splice(i, 1)
    //     }
    //   }
    // },
    // 修改过
    cleanAllData() {
      this.$messageBox.confirm(
          'Are you sure to clear the list?',
          'clean Message',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }).then(() => {
        this.$message({
          type: 'success',
          message: 'clean completed',
        })
        id = 1
        this.list = []
        this.baseData.isActive = true
        this.baseData.numClasses = ''
        this.baseData.toCategorical = 'False'
        this.baseData.isValid = false
        this.currentComponents = this.baseData
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: 'clean canceled',
        })
      })

    },
    validSubmit(forList) {
      for (let i = 0; i < forList.length; i++) {
        if (forList[i].isValid === false) {
          this.$notify.warning({
            title: "Submit Invalid",
            message: "id为" + forList[i].id + "的" + forList[i].type + "未写",
          })
          this.currentComponents = forList[i]
          this.openDiv(forList[i].type)
          forList[i].isActive = true
          setTimeout(() => {
            this.$refs['childRules'].methods.validateForm()
          }, 10)
          return false
        } else if (forList[i].isValid instanceof Object) {
          for (const key in forList[i].isValid) {
            if (forList[i].isValid[key]) continue
            this.$notify.warning({
              title: "Submit Invalid",
              message: "id为" + forList[i].id + "的" + forList[i].type + "的" + key + "未写",
            })
            this.currentComponents = forList[i]
            this.openDiv(forList[i].type)
            forList[i].isActive = true
            setTimeout(() => {
              this.$refs['childRules'].methods.validateForm()
            }, 10)
            return false
          }
        }
      }
      return true
    },
    // 修改提交数据
    submit: function () {
      let forList = [this.baseData, ...this.list]
      let isSubmit = this.validSubmit(forList)
      if (!isSubmit) {
        return
      }
      if (!this.fileIsUpload) {
        this.$notify.warning({
          title: "file err",
          message: "文件还未上传",
        })
        return;
      }
      this.dialogVisible = true
      this.submitList = this.clearAttr([this.baseData, ...this.list, this.file]);
      getReturnData(this.submitList).then((res) => {
        console.log(res)
        if (res === "200") {
          this.$message({
            message: "success",
            type: "success"
          })
        } else {
          this.$message({
            message: "failure",
            type: "warning"
          })
        }
      })
    },
    // 新增文件上传
    setUpload() {
      //确认上传
      const _this = this;
      //如果没有选择文件则不允许点击,并给出提示选择文件后点击上传按钮
      if (_this.fileList == '') {
        this.$notify.warning({
          title: 'message',
          message: 'Please click the [select file] to upload the file'
        });
      } else {
        //创建formData对象
        const param = new FormData();
        //将文件append到formData对象
        param.append("file", _this.fileList[0].raw);
        param.append("name", _this.fileList[0].name);
        console.log(_this.fileList)
        uploadFile(param).then(() => {
          this.fileIsUpload = true
        })
      }
    },

    // 新增数据对话框被关闭之前
    handleClose() {
      this.$messageBox.confirm(
          'you want to stop?',
          'stop Message',
          {
            confirmButtonText: 'yes',
            cancelButtonText: 'no',
            type: 'warning',
          }).then(() => {
        stopReturnData(false).then((res) => {
          if (res) {
            this.returnData = []
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: 'already stopped',
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: 'stop canceled',
        })
      })

    },
    changeUpload(file, fileList) {
      this.fileIsUpload = false
      let componentItem = new ComponentItem(id++, 'lc-data', ['file'])
      componentItem.set('file', file)
      this.fileList = fileList;
      this.file = componentItem
    },
    deleteItem() {
      this.binList = [];
      this.willDelete = false
      this.showBin = false
    },
    openDiv(res) {
      if (res.type === "BaseParameter") {
        this.currentComponents = this.baseData
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].isActive = false
        }
      } else {
        this.baseData.isActive = false
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].type === res.type && this.list[i].id === res.id) {
            this.currentComponents = this.list[i]
          } else {
            this.list[i].isActive = false
          }
        }
      }
    },
    judgeType(obj) {
      // tostring会返回对应不同的标签的构造函数
      const toString = Object.prototype.toString
      const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
      }
      if (obj instanceof Element) {
        return 'element'
      }
      return map[toString.call(obj)]
    },
    deepClone(data) {
      const type = this.judgeType(data)
      let obj
      if (type === 'array') {
        obj = []
      } else if (type === 'object') {
        obj = {}
      } else {
        // 不再具有下一层次
        return data
      }
      if (type === 'array') {
        for (let i = 0, len = data.length; i < len; i++) {
          obj.push(this.deepClone(data[i]))
        }
      } else if (type === 'object') {
        // 对原型上的方法也拷贝了....
        for (const key in data) {
          obj[key] = this.deepClone(data[key])
        }
      }
      return obj
    },
    initWebSocket() {
      if (typeof WebSocket === 'undefined')
        return console.log('您的浏览器不支持websocket')
      this.websock = new WebSocket(this.wsUrl)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() {
      console.log('open')
      // 连接建立之后执行send方法发送数据
      // let actions = this.submitList
      // this.websocketsend()
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) {
      // 数据接收
      const redata = (e.data)

      this.returnData.push(redata)
      console.log('接收的数据', redata)
    },
    websocketsend(Data) {
      console.log("send", Data)
      // 数据发送
      this.websock.send(Data)
    },
    websocketclose(e) {
      // 关闭
      console.log('断开连接', e)
    },
  }
}
;
</script>

<style lang="scss" scoped>
@import "src/components/LCComponents.scss";

.container {
  width: 100vw;
  min-height: 100vh;
}

.code_area,
.data_area {
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
}

.code_area {
  overflow: visible;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

#code {
  min-height: 200px;

  .lc-item {
    width: 10%;
  }
}

#bin {
  position: fixed;
  width: 100vw;
  height: 100vh;
  bottom: -110vh;
  left: 0;
  border-radius: 50%;
  box-shadow: 0 0 60px 30px rgba(255, 0, 0, 0.3) inset;
  overflow: hidden;
  transition: .3s bottom ease-out;

  &.bin-show {
    bottom: -90vh;
  }

  .el-icon {
    top: calc((10vh - 32px) / 2);
    left: calc((100% - 32px) / 2);
    color: red;
    position: absolute;
  }

  draggable {
    min-height: 100%;
  }

  .ghost {
    opacity: 0;
  }

  .will_delete,
  .sortable-chosen {
    background: rgba(255, 0, 0, 0.3);
  }

}

.comp-item {
  cursor: pointer;
  margin: 10px 0;
}

.file-wrap > div > div > div {
  display: flex;
  flex-wrap: wrap;

  > div {
    width: 30%;
  }

  .file {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }

}
</style>
