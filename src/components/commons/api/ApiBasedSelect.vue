<template lang="pug">
.api-based-select
  Select(v-bind="$attrs", :multiple="multiple", v-model="model")
    Option(
      v-for="item of selectOptions",
      :key="item.value",
      :value="item.value",
      :label="item.label"
    ) {{ item.label }}
</template>

<script>
export default {
  inheritAttrs: false,
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: {
    modelValue: {
      type: Array | String,
      default: "",
    },
    modelLabel: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
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
    labelAsValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      model: "",
      selectOptions: [],
    };
  },
  watch: {
    modelValue(val) {
      const source =
        this.multiple && this.separator
          ? val.length
            ? val.split(this.separator)
            : []
          : val;

      const options = []
        .concat(source)
        .map((s) =>
          this.selectOptions.find(
            (o) => s === o[this.labelAsValue ? "label" : "value"]
          )
        )
        .filter(Boolean);

      if (options.length) {
        if (this.multiple) {
          const newModel = options.map((i) => i.value);

          if (this.$utils.isSameArr(this.model, newModel)) return;

          this.model = newModel;
        } else {
          this.model = options[0].value;
        }
      } else {
        this.model = this.multiple ? [] : "";
      }
    },

    model(val) {
      let value = val;
      let options = []
        .concat(val)
        .map((v) => this.selectOptions.find((i) => v === i.value))
        .filter(Boolean);
      let labels = options.map((i) => i.label);

      if (this.multiple) {
        if (this.separator !== void 0) {
          value = value.length ? val.join(this.separator) : "";
          labels = labels.length ? labels.join(this.separator) : "";
        }
      } else {
        labels = labels[0];
        options = options[0];
      }

      this.$emit(
        "update:modelValue",
        this.labelAsValue ? labels : value,
        options
      );
      this.$emit("update:modelLabel", labels, options);
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      if (this.options) {
        this.selectOptions = this.options;
      } else if (typeof this.loadMethod === "function") {
        this.selectOptions = await this.loadMethod();
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
