<template lang="pug">
.info-divider
  Divider(
    v-bind="$attrs"
  )
    slot
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
.info-divider {
  /deep/.ivu-divider-inner-text {
    font-weight: 600;
    color: #409eff;
  }
  /deep/.ivu-divider-horizontal.ivu-divider-with-text-left {
    &::before,
    &::after {
      border-top: 2px solid #409eff;
    }
  }
}
</style>
