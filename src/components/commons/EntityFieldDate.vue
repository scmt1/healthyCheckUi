<template lang="pug">
.entity-field-date
  span {{  formatedDate }}
</template>

<script>
export default {
  props: {
    value: {
      type: null,
    },
    format: {
      type: String,
      default: "YYYY-MM-DD HH:mm:ss",
    },
  },
  computed: {
    formatedDate() {
      return this.$utils.formatDate(this.value, this.format);
    },
  },
};
</script>

<style lang="less" scoped></style>
