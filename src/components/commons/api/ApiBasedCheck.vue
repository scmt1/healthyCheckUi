<template lang="pug">
.api-based-check
  checkbox-group(v-bind="$attrs", v-model="model", ref="checkGroup")
    Checkbox(
      v-for="item of checkoptions",
      :key="item.value",
      :label="item.value"
    ) {{ item.label }}
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: "",
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
  },
  emits: ["update:modelValue"],
  data() {
    return {
      model: [],
      checkoptions: [],
    };
  },
  watch: {
    modelValue: {
      handler(val) {
        const newModel =
          val === null
            ? []
            : val.length
            ? Array.from(new Set(val.split(this.separator)))
            : [];

        if (this.$utils.isSameArr(this.model, newModel)) return;

        this.model = newModel;
      },
      immediate: true,
    },

    model(val) {
      const value = val.length ? val.join(this.separator) : "";
      this.$emit("update:modelValue", value);
      this.dispatchFormItem(value);
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      if (this.options) {
        this.checkoptions = this.options;
        return;
      }

      if (typeof this.loadMethod === "function") {
        this.checkoptions = await this.loadMethod();

        return;
      }
    },

    dispatchFormItem(data) {
      this.$refs["checkGroup"]?.dispatch("FormItem", "on-form-change", data);
    },
  },
};
</script>

<style lang="less" scoped></style>
