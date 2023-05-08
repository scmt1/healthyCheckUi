<template lang="pug">
Modal.mt-dialog(
  v-bind="$attrs",
  v-model="model",
  :style="`--mt-dialog-width: ${dialogWidth}`",
  @on-visible-change="handleVisiableChange"
)
  slot
</template>

<script>
const DialogSizes = {
  mini: "20vw",
  small: "25vw",
  middle: "50vw",
  large: "75vw",
};
export default {
  inheritattrs: false,
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: {
    modelValue: {
      type: Boolean,
      default: undefined,
    },
    size: {
      type: "mini" | "small" | "middle" | "large",
      default: "small",
    },
  },
  emits: ["udpate:modelValue", "visiable-change", "open", "close"],
  data() {
    return {
      model: false,
    };
  },
  computed: {
    dialogWidth() {
      return DialogSizes[this.size] ?? DialogSizes["small"];
    },
  },
  watch: {
    modelValue(val) {
      this.model = val;
    },
    model(val) {
      this.$emit("update:modelValue", val);
    },
  },
  methods: {
    handleVisiableChange(visiable) {
      this.$emit(this.visiable ? "open" : "close");
      this.$emit("visiable-change", visiable);
    },
  },
};
</script>

<style lang="less" scoped>
.mt-dialog {
  /deep/ .ivu-modal {
    width: var(--mt-dialog-width) !important;
    .ivu-modal-content {
      max-height: 75vh;
      overflow-y: hidden;

      .ivu-modal-body {
        max-height: calc(75vh - 108px);
        overflow-y: auto;
      }
    }
  }
}
</style>