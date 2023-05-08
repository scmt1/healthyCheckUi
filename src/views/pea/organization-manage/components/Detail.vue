<template lang="pug">
.org-detail
  mt-dialog(title="机构详情", v-model="visiable")
    description-list.mt-description-list(
      v-loading="loading",
      :col="1",
      :key="detail?.id"
    )
      description(term="机构名称") {{ detail?.name }}
      description(term="机构位置") {{ detail?.address }}
      description(term="体检类别") {{ detail?.checkType }}
      description(term="机构图片")
        Uploader(:value="detail?.avatar", view-only)
      description(term="轮播图")
        Uploader(:value="detail?.images", view-only)
      description(term="机构等级") {{ detail?.level }}
      description(term="医院标签")
        input-tags(:model-value="detail?.tags", read-only)
      description(term="营业时间") {{ detail?.businessHours }}
      description(term="联系方式") {{ detail?.phone }}
      description(term="机构简介")
        Input(type="textarea", disabled, :value="detail?.introduction")
      description(term="到院须知")
        Input(type="textarea", disabled, :value="detail?.notice")
</template>

<script>
import Uploader from "./Uploader.vue";
export default {
  components: {
    Uploader,
  },
  props: {
    model: {
      type: Object,
      default: undefined,
    },
  },
  emits: ["closed"],
  data() {
    return {
      detail: null,
      loading: false,
    };
  },
  computed: {
    visiable: {
      get() {
        return !!this.model;
      },
      set(val) {
        if (val) {
          this.init();
        } else {
          this.$emit("closed");
        }
      },
    },
  },
  methods: {
    init() {
      if (this.model?.id) {
        this.getDetail(this.model.id);
      }
    },
    async getDetail(orgId) {
      this.loading = true;
      try {
        const res = await this.$api.healthy.tCheckOrg.get(orgId);

        if (res?.success) {
          this.detail = res.data;
        }
      } catch (err) {
        this.$Message.error(err.message);
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.mt-description-list {
  /deep/.ivu-col {
    display: flex;
    .ivu-description-term {
      text-align: right;
      width: 80px;
      &:after {
        content: "：";
      }
    }
  }
}
</style>