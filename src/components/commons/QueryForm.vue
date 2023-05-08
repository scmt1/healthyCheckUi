<script>
import useUtils from "./hooks/useUtils";
export default {
  render(h) {
    const { resolveChild } = useUtils();

    const createCols = (h) => {
      return this.showFields
        .map((field) => {
          return h(
            "Col",
            {
              props: {
                span: this.colSpan,
              },
            },
            [
              h(
                "FormItem",
                {
                  props: {
                    label: field.label,
                    prop: field.prop ?? field.key,
                  },
                },
                [resolveChild(h, this.form, field)]
              ),
            ]
          );
        })
        .concat(createActions(h));
    };

    const createActions = (h) => {
      return h(
        "Span",
        {
          props: {
            span: this.colSpan,
          },
          class: {
            "query-form__actions": true,
          },
        },
        this.actions.map((i) => {
          const { label, render, event, ...props } = i;
          return h(
            "Button",
            {
              props,
              on: {
                click: () => this.handleClick(event),
              },
              style: {
                marginLeft: event === "toggle" ? 0 : undefined,
              },
            },
            [render ? render(h) : label]
          );
        })
      );
    };

    return h("Form", this.formProps, [
      h(
        "Row",
        {
          props: {
            gutter: this.colGutter,
          },
        },
        createCols(h)
      ),
    ]);
  },
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: {
    modelValue: {
      type: Object,
      default: undefined,
    },
    fields: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Number,
      default: 4,
    },
    colGutter: {
      type: Number,
      default: 32,
    },
    labelWidth: {
      type: Number,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      form: this.$utils.lodash.cloneDeep(this.modelValue),
      proxyForm: {},
      proxy: null,
      showAll: false,
    };
  },
  computed: {
    formProps() {
      const maxLabel = this.fields.reduce(
        (a, b) => Math.max(a, b.label?.length),
        0
      );

      const labelWidth = this.labelWidth ?? maxLabel * 14 + 28;
      return {
        props: {
          model: this.form,
          inline: true,
          labelWidth,
        },
        nativeOn: {
          submit: (e) => {
            e.preventDefault();
          },
          keyup: (e) => {
            if (e.keyCode === 13) {
              this.$emit("query", this.form);
            }
          },
        },
        class: {
          "query-form": true,
        },
        ref: "form",
      };
    },
    showToggle() {
      return this.fields.length > this.columns - 1;
    },
    colSpan() {
      return 24 / this.columns;
    },
    showFields() {
      return this.fields.slice(0, this.showAll ? undefined : this.columns - 1);
    },
    actions() {
      const actions = [
        {
          type: "primary",
          event: "query",
          icon: "ios-search",
          label: "查询",
          loading: this.loading,
        },
        {
          event: "reset",
          label: "重置",
        },
      ];

      if (this.showToggle) {
        return actions.concat({
          type: "text",
          event: "toggle",
          render: (h) =>
            h(
              "span",
              this.showAll
                ? [
                    "收起",
                    h("Icon", {
                      props: {
                        type: "ios-arrow-up",
                      },
                    }),
                  ]
                : [
                    "展开",
                    h("Icon", {
                      props: {
                        type: "ios-arrow-down",
                      },
                    }),
                  ]
            ),
        });
      }
      return actions;
    },
    cascaderFields() {
      return this.fields.filter((i) => i.cascader);
    },
  },
  watch: {
    modelValue: {
      handler(val) {
        if (val === this.form) return;

        Object.entries(val).forEach(([k, v]) => {
          this.$set(this.form, k, v);
        });
      },
      immediate: true,
      deep: true,
    },

    fields: {
      handler(val) {
        if (Array.isArray(val)) {
          val.forEach(({ key, default: defaultValue }) => {
            if (!Object.prototype.hasOwnProperty.call(this.form, key)) {
              this.$set(this.form, key, defaultValue ?? "");
            }
          });
        }
      },
      immediate: true,
    },

    form: {
      handler(val) {
        Object.entries(val).forEach(([k, v]) => {
          this.proxy[k] = v;
        });
        this.$emit("update:modelValue", val);
      },
      deep: true,
    },
  },
  created() {
    this.proxy = new Proxy(this.proxyForm, {
      set: (target, key, value) => {
        const field = this.cascaderFields.find((i) => key === i.cascader);

        if (field && value !== target[key]) {
          this.$nextTick(() => {
            this.resetField(field.key);
          });
        }

        return Reflect.set(target, key, value);
      },
    });
  },
  methods: {
    resetFields() {
      this.$refs["form"]?.resetFields();
    },

    resetField(prop) {
      const formFields = this.$refs["form"]?.fields;

      if (Array.isArray(formFields)) {
        formFields.find((i) => prop === i.prop)?.resetField();
      }
    },

    handleClick(evt) {
      if (this.loading) return;
      switch (evt) {
        case "query":
          this.$emit("query", this.form);
          break;
        case "reset":
          this.resetFields();
          break;
        case "toggle":
          this.showAll = !this.showAll;
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.query-form {
  /deep/ .ivu-form-item {
    width: 100%;
    margin-bottom: 16px !important;
  }

  /deep/ .ivu-date-picker {
    width: 100%;
  }

  &__actions {
    display: flex;
    padding-left: 16px;
    margin-bottom: 16px;

    & > * + * {
      margin-left: 16px;
    }
  }
}
</style>
