<template>
  <div class="lc-item">
    <el-button circle size="small" class="del" type="danger" @click="methods.del">x</el-button>
    <Document class="icon mover"/>
    <span class="unmover">{{ data.file.name }}</span>
  </div>
</template>

<script>
import {Document} from "@element-plus/icons-vue"
import {reactive} from "vue";

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
  },
  emits: ['del'],
  setup(props, ctx) {
    const CData = reactive(props.data)
    const methods={
      del() {
        ctx.emit('del', CData.id)
      }
    }
    return {
      methods
    }
  }
}
</script>

<style lang="scss" scoped>
@import "LCComponents";

.lc-item {
  position: relative;
  .del {
    position: absolute;
    top: 0;
    right: 15px;
    display: none;
  }
  &:hover .del{
    display: block;
  }
  .icon {
    display: block;
    width: 60%;
  }
}
</style>
