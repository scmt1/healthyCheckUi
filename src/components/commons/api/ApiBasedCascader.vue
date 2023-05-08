<template lang="pug">
.api-based-cascader
  Cascader(v-bind="$attrs", v-model="model", :data="cascaderOptions")
</template>

<script>
const AcceptType = ["array", "string"];
export default {
  inheritattrs: false,
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: {
    modelValue: {
      type: String | Array,
      default: undefined,
    },
    options: {
      type: Array,
      default: undefined,
    },
    loadMethod: {
      type: Function,
      default: undefined,
    },
    separator: {
      type: String,
      default: ";",
    },
    emitPath: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cascaderOptions: [],
      model: [],
      sourceType: "",
    };
  },
  emits: ["update:modelValue"],
  watch: {
    modelValue: {
      handler(val) {
        const rawType = this.$utils.toRawType(val);
        this.setSourceType(rawType);
        const newModel = AcceptType.includes(rawType)
          ? rawType === "array"
            ? val
            : val.length
            ? val.split(this.separator)
            : []
          : [];

        if (this.$utils.isSameArr(newModel, this.model)) return;

        this.model = newModel;
      },
      immediate: true,
    },
    model(val) {
      this.$emit(
        "update:modelValue",
        this.sourceType === "string"
          ? val.length
            ? val.join(this.separator)
            : []
          : val,
        this.cascaderOptions
      );
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      if (this.options) {
        this.cascaderOptions = this.options;
      } else if (typeof this.loadMethod === "function") {
        this.cascaderOptions = await this.loadMethod();
      }
    },
    setSourceType(rawType) {
      this.sourceType = AcceptType.includes(rawType) ? rawType : "string";
    },
  },
};
</script>

<style lang="less" scoped></style>