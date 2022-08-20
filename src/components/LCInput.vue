<template>
  <div class="lc-item">
    <sort class="icon mover"/>
    <el-input class="unmover"/>
  </div>
</template>

<script>
import {Sort} from "@element-plus/icons-vue";

export default {
  name: "LCInput",
  components:{
    Sort
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
    console.log(this.data)
  }
}
</script>

<style lang="scss" scoped>
@import "./LCComponents.scss";
</style>
