export default function useUtils() {
  const resolveInput = (h, model, { key, label, ...props }) => {
    return h("Input", {
      props: Object.assign({ placeholder: `请输入${label}` }, props, {
        value: model[key],
      }),

      on: {
        input: (val) => (model[key] = val),
      },
    });
  };

  const resolveSelect = (h, model, { key, label, cascader, ...props }) => {
    const selectProps = Object.assign(
      { placeholder: `请选择${label}` },
      props,
      {
        modelValue: model[key],
      }
    );

    return h("ApiBasedSelect", {
      props: selectProps,
      attrs: selectProps,
      on: {
        "update:modelValue": (val) => (model[key] = val),
      },
      key: model[cascader],
    });
  };

  const resolveCheck = (h, model, { key, label, ...props }) => {
    const checkProps = Object.assign(props, {
      modelValue: model[key],
    });

    return h("ApiBasedCheck", {
      props: checkProps,
      on: {
        "update:modelValue": (val) => (model[key] = val),
      },
    });
  };

  const resolveCascader = (h, model, { key, label, ...props }) => {
    const cascaderProps = Object.assign(props, {
      modelValue: model[key],
    });

    return h("ApiBasedCascader", {
      props: cascaderProps,
      attrs: cascaderProps,
      on: {
        "update:modelValue": (val) => (model[key] = val),
      },
    });
  };

  const resovleDate = (h, model, { key, label, ...props }) => {
    const dateProps = Object.assign({ placeholder: `请选择${label}` }, props, {
      value: model[key],
    });

    return h("DatePicker", {
      props: dateProps,
      on: {
        input: (val) => (model[key] = val),
      },
    });
  };

  /**
   *
   * @param {*} h 渲染函数h
   * @param {*} source
   * @param {*} opts
   */
  const resolveChild = (h, source, opts) => {
    const args = [h, source, Object.assign({ clearable: true }, opts)];

    switch (opts?.as) {
      case "input":
        return resolveInput(...args);
      case "select":
        return resolveSelect(...args);
      case "cascader":
        return resolveCascader(...args);
      case "date":
        return resovleDate(...args);
      case "check":
        return resolveCheck(...args);
      default:
        return resolveInput(...args);
    }
  };

  return {
    resolveInput,
    resolveSelect,
    resolveCheck,
    resolveChild,
  };
}
