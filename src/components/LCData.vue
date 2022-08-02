<template>
  <div class="lc-item">
    <Document class="icon mover"/>
    <span class="unmover">{{ data.file.name }}</span>
  </div>
</template>

<script>
import {Document} from "@element-plus/icons-vue"

export default {
  name: "LCData",
  components: {
    Document
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "LCComponents";

.lc-item {
  padding: 15px 2px;
  .icon {
    display: block;
  }
}
</style>
