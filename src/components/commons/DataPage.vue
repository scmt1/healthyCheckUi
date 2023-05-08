<template lang="pug">
Row.data-page(
  :style="`width: calc(100% - ${ $slots['aside'] ? 16 : 0}px)`"
)
  Col.data-page__aside(
    :span="5"
    v-show="showAside"
  )
    Card
      slot(
        name="aside"
      )

  .data-page__expend(
    v-if="$slots['aside']"
  )
    icon.toggle-icon(
      @click="expend = !expend"
      :type="expend ? 'ios-arrow-back' : 'ios-arrow-forward'"
    )



  Col.data-page__content(
    :span="showAside ? 19 : 24"
  )
    Card
      .content__query(
        v-if="$slots['query']"
      )
        slot(
          name="query"
        )

      .content__header(
        v-if="$slots['header']"
      )
        slot(
          name="header"
        )

      .content__body
        slot
</template>

<script>
export default {
  data() {
    return {
      expend: true,
    };
  },
  computed: {
    showAside() {
      return !!this.$slots["aside"] && this.expend;
    },
  },
};
</script>

<style lang="less" scoped>
.data-page {
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  background-clip: content-box;

  > * {
    height: 100%;
  }

  /deep/ .ivu-card {
    height: 100%;
    overflow: hidden;
  }

  /deep/ .ivu-card-body {
    height: 100%;
    overflow: hidden;
  }

  &__aside {
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
  }

  &__expend {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    .toggle-icon {
      position: relative;
      cursor: pointer;
      font-size: 16px;

      &::after {
        content: "";
        position: absolute;
        top: -2px;
        right: -2px;
        bottom: -2px;
        left: -2px;
      }
    }
  }
}

.content {
  &__query,
  &__header {
    margin-bottom: 16px;
  }

  &__body {
    overflow: hidden;
  }
}
</style>
