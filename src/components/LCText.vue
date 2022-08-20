<template>
  <div class="lc-item lc-text">
    <sort class="icon mover"/>
    Text
  </div>
</template>

<script>
import {Sort} from "@element-plus/icons-vue";

export default {
  name: "LCText",
  components:{
    Sort
  }
}
</script>

<style lang="scss" scoped>
@import "./LCComponents.scss";
</style>
