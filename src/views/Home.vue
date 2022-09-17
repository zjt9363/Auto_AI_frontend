<template>

  <el-container class="container" v-loading="loading">
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-row justify="left" style="margin: 10px;box-sizing:border-box;height: 60px">
            <el-col :span="7">
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
                  <el-button class="ml-3" type="primary" @click="setUpload" style="margin: 0 0 0 10px">upload to
                    server
                  </el-button>
                  <el-button type="primary" @click="submit">submit</el-button>
                </template>
              </el-upload>
            </el-col>

            <el-col :span="11" style="margin-right: 10px">
              <el-alert title="Please upload serialized training and test sets.(Use gzip and pkl package)"
                        type="error" center show-icon v-if="!fileIsUpload"
                        :closable="false"/>
              <el-alert type="success" center show-icon v-else-if="fileIsUpload&&this.fileList.length !== 0"
                        :closable="false">
                <template #title>
                  {{ "[" + this.fileList[0].name + "]--Upload Success" }}
                </template>
              </el-alert>
              <el-alert type="success" center show-icon v-else :closable="false">
                <template #title>
                  No file should be uploaded
                </template>
              </el-alert>
            </el-col>
          </el-row>
        </el-col>
      </el-row>


      <el-row :gutter="20">

        <el-col :span="5">
          <el-row>
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>Layer</span>
                </div>
              </template>
              <el-row>
                <component v-for="(item,index) in componentsList" :is="item.type" :data="item.tempData"
                           :isTemplate="true"
                           :key="index" @click.capture="tapComponents(item)"/>
              </el-row>
            </el-card>
          </el-row>
          <div style="height: 10px"/>
          <el-row style="height: 80px;">
            <el-col :span="5">
              <el-tag
                  v-for="(tag, index) in parameterSetList"
                  :key="tag.title"
                  style="margin: 4px 10px;justify-content: space-between"
                  closable
                  effect="dark"
                  type="warning"
                  size="large"
                  @click="addParamterSet(tag)"
                  @close="delParamterSet(tag.title, index)"
              >
                {{ tag.title }}
              </el-tag>
            </el-col>
          </el-row>
        </el-col>


        <el-col :span="8">
          <el-row>
            <el-card class="code_area">
              <template #header>
                <div class="card-header">
                  <span>Model:</span>
                  <div>
                    <el-button type="primary" @click="saveParam">
                      <el-icon size="16px">
                        <UploadFilled/>
                      </el-icon>
                    </el-button>

                    <el-button type="danger" @click="cleanAllData">
                      <el-icon size="16px">
                        <Delete/>
                      </el-icon>
                    </el-button>
                  </div>
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


        <el-col :span="11">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>Layer Parameter:</span>
              </div>
            </template>
            <keep-alive>
            <component
                :is="currentComponents.type"
                :data="currentComponents"
                :key="currentComponents.id"
                :isTemplate="false"
                ref="childRules"
            />
            </keep-alive>
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
<!--    <div>
      <xmp>{{baseData}}</xmp>
      <xmp>{{list}}</xmp>

    </div>-->

    <el-dialog
        v-model="dialogVisible"
        title="Tips"
        width="60%"
        :before-close="handleClose"
    >
      <template #header>
        <div class="card-header">
          <span>Result from Server:</span>
        </div>
      </template>
      <div style="height: 500px; overflow: auto" ref="autoToBottom">
        <div ref="content">
          <div v-for="(item,index) in returnData" :key="index">
            <xmp>
              {{ item }}
            </xmp>
          </div>
          <div v-if="imgLIst.length !== 0">
            <img :src="item" v-for="item in imgLIst" :key="item" style="width: 50%">
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="downloadPyFile">
          Download Python File
        </el-button>
        <el-button type="primary" @click="downloadModelFile">
          Download Model File
        </el-button>
        <el-button type="primary" @click="downloadGraph">
          Download Graph
        </el-button>
      </template>
    </el-dialog>
  </el-container>

</template>

<script>
// 导入拖拽
import draggable from "vuedraggable";
import {Delete, UploadFilled} from '@element-plus/icons-vue'

// 导入组件
import Convolution2D from "@/layers/Convolution2D";
import MaxPooling2D from "@/layers/MaxPooling2D";
import Dense from "@/layers/Dense";
import Dropout from "@/layers/Dropout";
import BatchNormalization from "@/layers/BatchNormalization";
import GlobalAveragePooling2D from "@/layers/GlobalAveragePooling2D";
import BaseParameter from "@/layers/BaseParameter";
import Flatten from "@/layers/Flatten";
// 导入工具
import {ComponentItem} from "@/components/ComponentItem";
import {getReturnData} from "@/api/getReturnData";
import {uploadFile} from "@/api/uploadFile";
import {stopReturnData} from "@/api/stopReturnData";
import {downloadPyFile, downloadImg} from "@/api/fileDownload";


// 定义初始id
let id = 1

export default {
  name: "HomePage",
  components: {
    Delete,
    UploadFilled,
    draggable,
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
      parameterSetList: [],
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
      file: null,
      imgLIst: []
    };
  },
  created() {
    this.baseData = new ComponentItem(0, 'BaseParameter', {
      numClasses: '',
      lossFunction: '',
      optimizer: '',
      isActive: '',
      isValid: false
    })
    this.currentComponents = this.baseData
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      this.parameterSetList.push({
        title: key,
        value: localStorage.getItem(key)
      })
    }

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
    showJpg() {
      return true
    },
    addParamterSet(tag) {
      this.clear()
      setTimeout(()=>{
        this.list = []
        const list = JSON.parse(tag.value)
        for (let i = 0; i < list.length; i++) {
          list[i].isActive = false
        }
        {
          this.baseData.lossFunction = list[0].lossFunction
          this.baseData.optimizer = list[0].optimizer
          this.baseData.batchSize = list[0].batchSize
          this.baseData.earlyStopping = list[0].earlyStopping
          this.baseData.monitor = list[0].monitor
          this.baseData.minDelta = list[0].minDelta
          this.baseData.patience = list[0].patience
          this.baseData.numClasses = list[0].numClasses
          this.baseData.isActive = list[0].isActive
          this.baseData.epochs = list[0].epochs
          this.currentComponents = this.baseData
          this.currentComponents.isActive = true
        }
        list.shift()
        this.list = []
        this.list = list
      })
    },
    delParamterSet(title, index) {
      this.$messageBox.confirm(
          'Are you sure to delete the parameter set?',
          'Delete parameter set',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }).then(() => {
        this.parameterSetList.splice(index, 1)
        localStorage.removeItem(title)
      })

    },
    saveParam() {
      this.$messageBox.prompt("set a name for parameters", "save parameters", {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputPattern: /^[a-zA-Z0-9]{1,20}/,
        inputErrorMessage: "The length of name should less than 20"
      })
          .then(({value}) => {
            const data = JSON.stringify(([this.baseData, ...this.list]))
            localStorage.setItem(value, data)
            this.parameterSetList.push({
              title: value,
              value: JSON.stringify([this.baseData, ...this.list]),
            })
          })
    },
    downloadModelFile() {
      let path = "C:\\Users\\Zarrow\\IdeaProjects\\SelfStudy\\web_AI_springboot\\demo\\model.h5"

      downloadPyFile(path).then(res => {
        console.log(res);
        let blob = new Blob([res], {
          type: "application/vnd.ms-excel"    // 这边的类型需要改
        });
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.download = 'model.h5'  //  这边的名字需要改
        link.href = url
        document.body.appendChild(link)
        link.click()

      })
    },
    downloadPyFile() {

      let path = "C:\\Users\\Zarrow\\IdeaProjects\\SelfStudy\\web_AI_springboot\\demo\\main.py"

      downloadPyFile(path).then(res => {
        console.log(res);
        let blob = new Blob([res], {
          type: "application/vnd.ms-excel"    // 这边的类型需要改
        });
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.download = 'main.py'  //  这边的名字需要改
        link.href = url
        document.body.appendChild(link)
        link.click()

      })
    },
    downloadGraph() {
      downloadImg("C:\\Users\\Zarrow\\IdeaProjects\\SelfStudy\\web_AI_springboot\\demo\\accuracy.jpg").then(res => {
        let url = window.URL.createObjectURL(res)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.download = 'accuracy.jpg'
        link.href = url
        document.body.appendChild(link)
        link.click()
      })
      downloadImg("C:\\Users\\Zarrow\\IdeaProjects\\SelfStudy\\web_AI_springboot\\demo\\loss.jpg").then(res => {
        let url = window.URL.createObjectURL(res)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.download = 'loss.jpg'
        link.href = url
        document.body.appendChild(link)
        link.click()
      })
    },
    handleDragEnd() {
      this.showBin = false
    }
    ,
    tapComponents(e) {

      const obj = new ComponentItem(this.list.length + 1, e.type, this.deepClone(e.data) || null)
      this.list.push(obj)
      this.currentComponents = obj
      obj.isActive = true
      this.openDiv(obj)
    }
    ,
    clearAttr(oldArr) {
      let arr = oldArr
      for (let i = 0; i < arr.length; i++) {
        // if (this.hasProperty(arr[i], 'isActive')) {
        //   Reflect.deleteProperty(arr[i], 'isActive')
        // }
        if (this.hasProperty(arr[i], 'isValid')) {
          Reflect.deleteProperty(arr[i], 'isValid')
        }
      }
      return arr
    }
    ,
    hasProperty(obj, key) {
      return Object.keys(obj).includes(key)
    }
    ,
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
        this.clear()
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: 'clean canceled',
        })
      })

    },
    clear() {
      id = 1
      this.list = []
      this.baseData.isActive = true
      this.baseData.numClasses = ''
      this.baseData.lossFunction = 'sparse_categorical_crossentropy'
      this.baseData.isValid = false
      this.currentComponents = this.baseData
    },
    validSubmit(forList) {
      for (let i = 0; i < forList.length; i++) {
        if (forList[i].isValid === false) {
          this.$notify.warning({
            title: "Submit Invalid",
            message: "id for " + forList[i].id + " in " + forList[i].type + "should be entered",
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
    }
    ,
    // 修改提交数据
    submit: function () {
      /* let forList = [this.baseData, ...this.list]
       let isSubmit = this.validSubmit(forList)
       if (!isSubmit) {
         return
       }*/

      if (!this.fileIsUpload) {
        this.$notify.warning({
          title: "file err",
          message: "File has not been uploaded!",
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
            message: "Success",
            type: "success"
          })
        }
      })
    }
    ,
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
    }
    ,

    // Close the Result window
    handleClose() {
      this.$messageBox.confirm(
          'Please save. Data will be lost.',
          'Close Window',
          {
            confirmButtonText: 'yes',
            cancelButtonText: 'no',
            type: 'warning',
          }).then(() => {
        stopReturnData(false).then((res) => {
          if (res) {
            this.imgLIst = []
            this.returnData = []
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: 'Finish',
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: 'stop canceled',
        })
      })

    }
    ,
    changeUpload(file, fileList) {
      console.log(this.$refs.uploadRef);

      if (fileList.length>1) {
        this.$refs.uploadRef.handleRemove(fileList[0])
      }
      this.fileIsUpload = false
      let componentItem = new ComponentItem(id++, 'lc-data', ['file'])
      componentItem.set('file', file)
      this.fileList = fileList;
      this.file = componentItem
    }
    ,
    deleteItem() {
      this.binList = [];
      this.willDelete = false
      this.showBin = false
    }
    ,
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
      console.log(this.list)
    }
    ,
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
    }
    ,
    initWebSocket() {
      if (typeof WebSocket === 'undefined')
        return console.log('Your browser does not support websocket')
      this.websock = new WebSocket(this.wsUrl)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    }
    ,
    websocketonopen() {
      console.log('open')
    }
    ,
    websocketonerror() {
      this.initWebSocket()
    }
    ,
    websocketonmessage(e) {
      const redata = (e.data)

      this.returnData.push(redata)

      if (redata.search("Test accuracy") !== -1) {
        downloadImg("C:\\Users\\Zarrow\\IdeaProjects\\SelfStudy\\web_AI_springboot\\demo\\accuracy.jpg").then(res => {
          let url = window.URL.createObjectURL(res)
          this.imgLIst.push(url)
          /*    let link = document.createElement('a')
              link.style.display = 'none'
              link.download = 'a.jpg'  //  这边的名字需要改
              link.href = url
              document.body.appendChild(link)
              link.click()*/
        }).then(()=>{
          downloadImg("C:\\Users\\Zarrow\\IdeaProjects\\SelfStudy\\web_AI_springboot\\demo\\loss.jpg").then(res => {
            let url = window.URL.createObjectURL(res)
            this.imgLIst.push(url)
          }).then(()=>{
            this.$nextTick(() => {
              console.log(this.$refs.content.scrollHeight)

              this.$refs.autoToBottom.scrollTop = this.$refs.content.scrollHeight;
            })
          })
        }).then(()=>{
          this.$nextTick(() => {
            console.log(this.$refs.content.scrollHeight)

            this.$refs.autoToBottom.scrollTop = this.$refs.content.scrollHeight;
          })
        })


      }
      this.$nextTick(() => {
        console.log(this.$refs.content.scrollHeight)

        this.$refs.autoToBottom.scrollTop = this.$refs.content.scrollHeight;
      })

      console.log('Accept data', redata)
    }
    ,
    websocketsend(Data) {
      console.log("send", Data)
      this.websock.send(Data)
    }
    ,
    websocketclose(e) {
      console.log('Break connection', e)
    }
    ,
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
  margin: 5px 0;
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
