<template lang="pug">
.geometry-picker
  .geometry-picker__trigger(@click="handleTrigger")
    i-button(type="text", icon="ios-send")
  mt-dialog(size="middle", v-model="visiable")
    baidu-map.baidu-map(
      v-if="visiable",
      :center="map.center",
      :zoom="map.zoom",
      :scroll-wheel-zoom="true",
      ref="baiduMap"
    )
      .baidu-map__search
        .search
          .search-input
            Input(v-model="keyWord", placeholder="请输入关键字查询")
          .search-result
            bm-local-search(:keyword="keyWord", @infohtmlset="handleMarkerSet")
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      visiable: false,
      keyWord: "",
      map: {
        center: { lng: 116.403959, lat: 39.915118 },
        zoom: 4,
      },
    };
  },
  watch: {
    visiable(val) {
      if (!val) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    handleTrigger() {
      this.visiable = true;
    },

    handleMarkerSet(info) {
      const { point } = info;

      Object.assign(this.map, {
        zoom: 18,
        center: point,
      });

      this.$emit("update:modelValue", point, info);
    },
  },
};
</script>

<style lang="less" scoped>
.baidu-map {
  height: 65vh;
  display: flex;
  flex-direction: column;
  position: relative;

  &__view {
    height: 100%;
  }

  &__search {
    position: absolute;
    top: 16px;
    left: 16px;
    width: 30%;
    max-height: 60%;
    display: flex;
    overflow: hidden;
  }
}

.search {
  &-input {
    flex-shrink: 0;
    height: 32px;
  }

  &-result {
    height: calc(100% - 40px);
    margin-top: 8px;
    overflow-y: auto;
  }
}
</style>