<template lang="pug">
.input-tags
  .input-tags__tags
    Tag(
      v-for="item of tags",
      :key="item",
      :closable="!readOnly",
      :name="item",
      color="primary",
      @on-close="handleRemove"
    ) {{ item }}
  .input-tags__input(v-if="!readOnly")
    Input(
      v-model="tagName",
      size="small",
      placeholder="+ 添加标签",
      @keyup.enter.native="handleAddTag"
    )
</template>

<script>
export default {
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    separator: {
      type: String,
      default: ";",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tagName: "",
      tags: [],
    };
  },
  watch: {
    modelValue: {
      handler(val) {
        if (val === null) return;
        const newTags = val.split(this.separator).filter((a) => a);

        this.tags = this.$utils.isSameArr(newTags, this.tags)
          ? this.tags
          : newTags;
      },
      immediate: true,
    },

    tags(val) {
      this.$emit(
        "update:modelValue",
        val.length ? val.join(this.separator) : ""
      );
    },
  },

  methods: {
    handleRemove(_e, name) {
      this.tags = this.tags.filter((t) => name !== t);
    },

    handleAddTag() {
      if (this.tagName) {
        this.tags.push(this.tagName);
        this.tagName = "";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.input-tags {
  display: flex;
  align-items: center;

  &__tags {
    display: flex;
    /deep/ .ivu-tag {
      display: flex;
      align-items: center;
    }
  }
  &__input {
    width: 120px;
  }
}
</style>