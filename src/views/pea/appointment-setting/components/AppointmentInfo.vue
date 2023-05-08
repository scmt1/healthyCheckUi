<template lang="pug">
.appointment-info(@dblclick="handleDoubleClick")
  .appointment-info__desc 可预约 {{ totalNum }} 人
  .appointment-info__desc 已预约 {{ info.reservations ?? 0 }} 人

  edit-form(:model="editingObj")
</template>

<script>
const BASENUMBER = 50;
export default {
  props: {
    info: {
      type: Object,
      defauly: undefined,
      required: true,
    },
    isYear: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editingObj: null,
    };
  },
  computed: {
    totalNum() {
      const { date, number } = Object.assign({}, this.info);

      if (number !== void 0) return number;
      return (
        BASENUMBER * (this.isYear ? this.$utils.date(date).daysInMonth() : 1)
      );
    },
  },
  methods: {
    handleDoubleClick() {
      // this.editingObj = {};
    },
  },
};
</script>

<style lang="less" scoped>
.appointment-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #2d8cf099;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  padding: 4px 0;
  user-select: none;
}
</style>