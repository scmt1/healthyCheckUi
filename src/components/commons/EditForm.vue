<script>
// const FormItemProp = {
// span: Number;
// key: String;
// label: String;
// render?: (h) => vnode,
// }
import useUtils from "./hooks/useUtils";

export default {
  model: {
    prop: "model",
    event: "update:model",
  },
  render(h) {
    const { resolveChild } = useUtils();

    const createModalFooter = () =>
      h(
        "template",
        {
          slot: "footer",
        },
        [
          h(
            "Button",
            {
              props: {
                type: "text",
              },
              on: {
                click: () => (this.visiable = false),
              },
            },
            "取消"
          ),
          h(
            "Button",
            {
              props: {
                type: "primary",
              },
              on: {
                click: () => this.handleSubmit(),
              },
            },
            "确定"
          ),
        ]
      );

    const resolveFormItem = (h, opts) => {
      //这里可以设置一些内置的公共属性 不如 clearable
      const { render, key, label, prop, ...props } = Object.assign(
        { clearable: true },
        opts
      );

      return h(
        "FormItem",
        {
          props: {
            label,
            prop: prop ?? key,
          },
        },
        [
          render
            ? render(h)
            : resolveChild(h, this.form, {
                key,
                label,
                ...props,
              }),
        ]
      );
    };

    const createForm = (h) => {
      return h("Form", this.formProps, [
        this.$slots["default"] ??
          h(
            "Row",
            this.items.map((i) => {
              const { span, ...opts } = i;

              return h(
                "Col",
                {
                  props: {
                    span: span ?? 24,
                  },
                },
                [resolveFormItem(h, opts)]
              );
            })
          ),
      ]);
    };

    return h("Modal", this.modalProps, [
      this.form ? createForm(h) : undefined,
      // 底部按钮
      createModalFooter(h),
    ]);
  },
  inheritAttrs: false,
  props: {
    // 控制模态框显示与隐藏 以及 form model属性
    model: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:model"],
  data() {
    return {
      form: {},
      visiable: false,
    };
  },
  computed: {
    modalProps() {
      return {
        class: {
          "edit-form-modal": true,
        },
        props: {
          value: this.visiable,
          mask: true,
          maskClosable: false,
          draggable: true,
          sticky: true,
          resetDragPosition: true,
          title: this.title ?? this.model.id ? "编辑" : "新增",
        },
        on: {
          input: (val) => (this.visiable = val),
          onVisiableChange: (val) => {
            if (!val) {
              this.form = null;
            }
          },
        },
      };
    },
    formProps() {
      const maxTextLength = Math.max(...this.items.map((i) => i.label?.length));
      return {
        props: Object.assign({}, this.$attrs, {
          model: this.form,
          labelWidth: this.items.length ? maxTextLength * 14 + 12 : 80,
        }),
        ref: "form",
      };
    },
  },
  watch: {
    model: {
      handler(val) {
        this.visiable = !!val;

        if (val === this.form) return;

        if (
          val &&
          Object.prototype.toString.call(this.model).includes("Object")
        ) {
          this.form = this.model;
        } else {
          this.form = val;
        }
      },
    },
    form: {
      handler(val) {
        this.$emit("update:model", val);
      },
      deep: true,
    },
    items(val) {
      val.forEach(({ key, default: defaultValue }) => {
        if (!Object.prototype.hasOwnProperty.call(this.form, key)) {
          this.$set(this.form, key, defaultValue ?? "");
        }
      });
    },
    visiable(val) {
      if (!val) {
        this.$emit("close");
        this.resetFields();
      }
    },
  },
  methods: {
    validateField(prop) {
      this.$refs["form"]?.validateField(prop);
    },

    resetFields() {
      this.$refs["form"]?.resetFields();
    },

    handleSubmit() {
      this.$refs["form"]?.validate().then((valid) => {
        if (valid) {
          this.$emit("validate", this.form);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.edit-form-modal {
  /deep/ .ivu-modal-content {
    max-height: 75vh;
    overflow-y: hidden;

    .ivu-modal-body {
      max-height: calc(75vh - 108px);
      overflow-y: auto;
    }
  }
}
</style>
