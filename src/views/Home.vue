<template>

  <el-container class="container" v-loading="loading">
    <el-main>
      <el-row>
        <el-col :span="4">
          <el-row justify="end" style="margin: 10px;box-sizing:border-box;">
            <el-upload
                ref="uploadRef"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="changeUpload"
            >
              <template #trigger>
                <el-button type="primary">select file</el-button>
              </template>


            </el-upload>
            <div style="width: 10px"></div>

            <el-button type="primary" @click="submit">submit</el-button>
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
          <el-row class="file-wrap">
            <el-card class="data_area">
              <template #header>
                <div class="card-header">
                  <span>Data File</span>
                </div>
              </template>
              <draggable draggable="false"
                  :group="{
                    name: 'lowCode',
                    pull:'clone',
                    put: false
                  }"
                  :sort="true"
                  :animation="300"
                  filter=".unmover"
                  v-model="dataFiles"
                  item-key="item"
                  ghostClass="ghost"
              >
                <template v-slot:item="{ element }">
                  <component v-if="element.id" :is="element.type" :data="element" :key="element.id"
                             class="file"/>
                </template>
              </draggable>
            </el-card>
          </el-row>
        </el-col>

        <el-col :span="8">
          <el-row>
            <el-card class="code_area">
              <template #header>
                <div class="card-header">
                  <span>Model:</span>
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
            <component :is="currentComponents.type" :data="currentComponents" :key="currentComponents.id"
                       :isTemplate="false"/>
          </el-card>
          <div style="height: 10px"/>
          <el-card style="height: 400px; overflow: auto" >
            <template #header>
              <div class="card-header">
                <span>Result from Server:</span>
              </div>
            </template>
            <div>
              <pre>{{ getAllList }}</pre>
              {{ returnData }}
            </div>
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
  </el-container>
</template>

<script>
// 导入拖拽
import draggable from "vuedraggable";
import {Sort, Delete} from "@element-plus/icons-vue"

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
// import {getReturnData} from "@/api/getReturnData";


// 定义初始id
let id = 1

export default {
  name: "HomePage",
  components: {
    Sort,
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
      willDelete: false, // 是否删除
      showBin: false,
      list: [], // 拖拽的列表
      componentsList: [
        {
          type: 'Convolution2D',
          tempData: {
            text: 'Text'
          },
          data: ['filter', 'kernalSize', 'activation', 'padding', 'isActive']
        },
        {
          type: 'MaxPooling2D',
          tempData: {
            text: 'Number'
          },
          data: ['poolSize', 'padding','isActive']
        },
        {
          type: 'Dropout',
          tempData: {
            text: 'Number'
          },
          data: ['rate', 'isActive']
        },
        {
          type: 'Dense',
          tempData: {
            text: 'Object'
          },
          data: ['units', 'activation', 'isActive']
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
      dataFiles: [],
      binList: [],
      submitList: [],
      baseData: null,
      loading: false,
      returnData: null,
      currentComponents: null,
    };
  },
  created() {
    this.baseData = new ComponentItem(0, 'BaseParameter', ['numClasses', 'toCategorical', 'isActive'])
    this.currentComponents = this.baseData
  },
  computed: {
    getAllList() {
      return this.clearAttr(JSON.parse(JSON.stringify([this.baseData, ...this.list, ...this.dataFiles])))

    }
  },
  methods: {
    handleDragEnd() {
      this.showBin = false
    },
    tapComponents(e) {
      this.list.push(e.id ? e : new ComponentItem(id++, e.type, e.data || null))

    },
    clearAttr(oldArr) {
      console.log(oldArr)
      let arr = oldArr
      for (let i = 0; i < arr.length; i++) {
        if (this.hasProperty(arr[i], 'isActive')) {
          Reflect.deleteProperty(arr[i], 'isActive')
        }
      }
      return arr
    },
    hasProperty(obj, key) {
      return Object.keys(obj).includes(key)
    },
    submit() {
      this.loading = true
      this.submitList = this.clearAttr([this.baseData, ...this.list, ...this.dataFiles]);
      console.log(this.submitList)
      // getReturnData(this.submitList).then((res)=>{
      //   if(res.status === '200' ) {
      //     this.$message({
      //       message: "提交成功",
      //       type: "success"
      //     })
      //     this.loading = false
      //     this.returnData = {
      //       name: res.name,
      //       age: res.age
      //     }
      //   }else {
      //     this.$message({
      //       message: "提交失败",
      //       type: "warning"
      //     })
      //     this.loading = false
      //   }
      // })

    },
    submitUpload() {
      this.$refs.uploadRef.submit()
    },
    changeUpload(file, fileList) {
      console.log(fileList)
      let componentItem = new ComponentItem(id++, 'lc-data', ['file'])
      componentItem.set('file', file)
      this.dataFiles.push(componentItem)
    },
    deleteItem(e) {
      console.log(e);
      this.binList = [];
      this.willDelete = false
      this.showBin = false
    },
    openDiv(res) {
      console.log(res)
      if (res.type === "BaseParameter") {
        console.log(res)
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
  }
};
</script>

<style lang="scss" scoped>
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
