<template lang="pug">
.page-header
  .page-header__begin
    Button(
      v-for="{ event, label , ...props} of buttons"
      :key="event"
      v-bind="props"
      @click="handleClick(event)"
    ) {{  label }}

    Dropdown(
      v-if="showDropdown"
      trigger="click"
      @on-click="handleDropdown"
    )
      template(
        #list
      )
        dropdown-menu
          dropdown-item(
            v-for="item of items"
            :name="item.event"
            :key="item.event"
          ) {{  item.label }}

      Button 更多操作



  .page-header__end
    slot(
      name="end"
    )
</template>

<script>
export default {
  props: {
    actions: {
      type: Array,
      default: () => [],
    },
    showCount: {
      type: Number,
      default: 4,
    },
  },
  emits: ["act"],
  computed: {
    filteredActions() {
      return this.actions;
    },

    showDropdown() {
      return this.filteredActions.length > 4;
    },

    buttons() {
      return this.showDropdown
        ? this.filteredActions.slice(0, this.showCount - 1)
        : this.filteredActions;
    },

    items() {
      if (!this.showDropdown) {
        return [];
      }
      return this.filteredActions.slice(this.showCount - 1);
    },
  },
  methods: {
    emit(evt) {
      const action = this.actions.find((i) => evt === i.event);
      this.$emit("act", action);
    },

    isArray(source) {
      return Array.isArray(source);
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
.page-header {
  display: flex;
  justify-content: space-between;
}
</style>
