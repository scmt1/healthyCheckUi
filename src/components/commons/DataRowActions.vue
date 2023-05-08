<template lang="pug">
.data-row-actions
  Button(
    v-for="({event, label, ...props}) of buttons"
    :key="event"
    v-bind="props"
    size="small"
    @click="handleClick(event)"
  ) {{  label }}

  Dropdown(
    v-if="showDropdown"
    @on-click="handleDropdown"
  )
    template(
      #list
    )
      dropdown-menu
        dropdown-item(
          v-for="{ event, label, ...props} of items"
          v-bind="props"
          :name="event"
          :key="event"
        ) {{  label }}

    Button(
      size="small"
    ) 
      span 更多操作
      icon(
        type="md-arrow-dropdown"
      )

</template>

<script>
export default {
  props: {
    model: {
      type: null,
    },
    actions: {
      type: Array,
      default: () => [],
    },
    max: {
      type: Number,
      default: 2,
    },
  },
  computed: {
    // 这里可以进行权限按钮处理
    filterActions() {
      return this.actions;
    },

    showDropdown() {
      return this.filterActions.length > this.max;
    },

    buttons() {
      return this.showDropdown
        ? this.filterActions.slice(0, this.max - 1)
        : this.filterActions;
    },

    items() {
      return this.filterActions.slice(this.max - 1);
    },
  },
  methods: {
    emit(evt) {
      const action = this.actions.find((i) => evt === i.event);
      this.$emit("act", action, this.model);
    },

    handleClick(evt) {
      this.emit(evt);
    },

    handleDropdown(name) {
      this.emit(name);
    },
  },
};
</script>

<style lang="less" scoped>
.data-row-actions {
  /deep/.ivu-dropdown-item {
    padding: 2px 16px;
  }
}
</style>
