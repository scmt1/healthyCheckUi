<template lang="pug">
.api-based-tree(
  v-loading="loadingData || loading"
)
  Tree(
    :data="treeData"
    :children-key="childrenKey"
    ref="tree"
    @on-select-change="handleSelectChange"
    :key="modelValue"
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
    data: {
      type: Array,
      default: undefined,
    },
    loadMethod: {
      type: Function,
      default: undefined,
    },
    childrenKey: {
      type: String,
      default: "children",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    autoSelect: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      loadingData: false,
      treeData: [],
      selectNode: null,
    };
  },
  computed: {
    flatTreeData() {
      return this.$$flat(this.treeData);
    },
  },
  watch: {
    selectNode(node) {
      if (node && node.value) {
        node.selected = true;
        this.$emit("update:modelValue", node.value);
      }
    },
    modelValue: {
      handler(val) {
        if (val === this.selectNode?.value) return;

        this.selectNodeByValue(val);
      },
      immediate: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.initData();

      if (this.autoSelect) {
        this.autoSelectNode();
      }

      this.$emit("init", this.treeData);
    },

    async initData() {
      if (this.loadingData) return;

      this.loadingData = true;

      if (this.data) {
        this.treeData = this.data;
      } else if (typeof this.loadMethod === "function") {
        try {
          this.treeData = await this.loadMethod();

          this.treeData;
        } catch (err) {
          this.$Message.error(err.message);
        }
      }

      this.loadingData = false;
    },

    $$flat(arr) {
      if (!Array.isArray(arr)) return [];
      return arr.reduce(
        (a, b) => a.concat(b, this.$$flat(b[this.childrenKey])),
        []
      );
    },

    selectNodeByValue(val) {
      const node = this.flatTreeData.find((i) => this.modelValue === i.value);

      if (node) {
        node.selected = true;
        this.selectNode = node;
      }
    },

    autoSelectNode() {
      if (this.modelValue) {
        this.selectNodeByValue(this.modelValue);
      } else {
        let node = this.treeData[0];
        let children = node[this.childrenKey];

        if (Array.isArray(children) && children.length) {
          node = children[0];
          children = node[this.childrenKey];
        }

        this.selectNode = node;
      }
    },

    handleSelectChange(selectNodes) {
      this.selectNode = selectNodes[0];
    },
  },
};
</script>

<style lang="less" scoped>
.api-based-tree {
  height: 100%;
  overflow-y: auto;
}
</style>
