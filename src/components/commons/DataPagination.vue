<template lang="pug">
.data-pagination
  Page(
    v-bind="paginationOptions",
    @on-change="handlePageChange",
    @on-prev="handlePageChange",
    @on-next="handlePageChange",
    @on-page-size-change="handlePageSizeChange"
  )
</template>

<script>
const defaultPagination = {
  total: 0,
  pageSize: 10,
  pageNumber: 1,
};

export default {
  name: "DataPagination",
  props: {
    pagination: {
      type: Object,
      default: () => defaultPagination,
    },
  },
  emits: ["paginate"],
  computed: {
    paginationOptions() {
      const { pageNumber: current, ...opts } = Object.assign(
        {},
        defaultPagination,
        this.pagination
      );

      return Object.assign(
        {
          showTotal: true,
          showElevator: true,
          showSizer: true,
          pageSizeOpts: [10, 20, 50],
        },
        opts,
        {
          current,
        }
      );
    },
  },
  methods: {
    emit(val) {
      this.$emit("paginate", Object.assign({}, this.pagination, val));
    },

    handlePageChange(pageNumber) {
      this.emit({ pageNumber });
    },

    handlePageSizeChange(pageSize) {
      this.emit({ pageSize });
    },
  },
};
</script>

<style lang="less" scoped>
.data-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>
