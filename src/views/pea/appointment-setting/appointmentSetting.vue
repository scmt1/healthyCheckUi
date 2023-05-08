<template lang="pug">
data-page
  template(#aside)
    api-based-tree(
      v-model="queryForm.checkOrgId",
      auto-select,
      :load-method="treeLoadMethod"
    )

  template(#header)
    page-header(:actions="pageHeaderActions", @act="handleEntityActions")

  Calendar(
    v-model="calerndarProps.value",
    v-loading="loading",
    :type="calerndarProps.type",
    @on-type-change="(t) => (calerndarProps.type = t)",
    @dblclick="handleCellDblclick"
  )
    template(#[calerndarProps.type]="{ data }")
      template(v-if="getInfoProps(data.day ?? data.month)")
        appointment-info(
          v-bind="getInfoProps(data.day ?? data.month)",
          :is-year="calerndarProps.type === 'year'"
        )
  edit-form(
    :model="editingObj",
    :items="formItems",
    @validate="handleValidate",
    @closed="editingObj = null"
  )
  excel-upload(
    v-model="uploadVisiable",
    size="large",
    :org-id="queryForm.checkOrgId",
    @uploaded="() => query()"
  )
</template>

<script>
import AppointmentInfo from "./components/AppointmentInfo.vue";
import ExcelUpload from "./components/ExcelUpload.vue";
export default {
  components: {
    ExcelUpload,
    AppointmentInfo,
  },
  data() {
    return {
      loading: false,
      uploadVisiable: false,
      items: [],
      calerndarProps: {
        value: new Date(),
        type: "month",
      },
      queryForm: {
        dateTime: this.calerndarProps === "month" ? "YYYY-MM" : "YYYY",
        checkOrgId: "",
      },
      editingObj: null,
    };
  },
  computed: {
    pageHeaderActions() {
      return [
        {
          type: "primary",
          event: "import",
          label: "批量导入数据",
          icon: "ios-cloud-upload",
        },
      ];
    },
    formItems() {
      return this.editingObj
        ? [
            {
              key: "orderDate",
              label: "日期",
              render: (h) => h("span", this.editingObj.orderDate),
            },
            {
              key: "number",
              label: "可预约数量",
              render: (h) =>
                h("InputNumber", {
                  props: {
                    value: this.editingObj.number,
                    min: 0,
                    placeholder: "请输入可预约数量",
                    precision: 0,
                  },
                  on: {
                    input: (val) => (this.editingObj.number = val),
                  },
                }),
            },
            {
              label: "已预约数量",
              key: "reservations",
              disabled: true,
              visiable: this.editingObj.id !== void 0,
            },
          ].filter((i) => i.visiable === void 0 || i.visiable)
        : [];
    },
  },
  watch: {
    calerndarProps: {
      handler(prop) {
        Object.assign(this.queryForm, {
          dateTime: this.$utils.formatDate(
            prop.value,
            prop.type === "month" ? "YYYY-MM" : "YYYY"
          ),
        });
      },
      immediate: true,
      deep: true,
    },
    "calerndarProps.value": {
      handler(val) {
        if (this.$utils.date(val).date() === 1) {
          this.calerndarProps.type = "month";
        }
      },
    },
    queryForm: {
      handler() {
        this.query();
      },
      deep: true,
    },
  },
  methods: {
    async query() {
      if (this.loading) return;

      this.loading = true;
      try {
        const res = await this.$api.healthy.tOrderSetting.getInfo(
          this.queryForm
        );

        if (res?.success) {
          Object.assign(this, {
            items: res.data,
          });
        } else {
          this.$Message.error(res.message);
        }
      } catch (err) {
        console.log(err.message);
      }
      this.loading = false;
    },

    async treeLoadMethod() {
      try {
        const res = await this.$api.healthy.tCheckOrg.getAllCheckOrg();

        if (res?.success) {
          return (res.data ?? []).map((i) => ({
            title: i.name,
            value: i.id,
            _raw: i,
          }));
        } else {
          return [];
        }
      } catch (err) {
        return [];
      }
    },

    formatDate(date, format) {
      return this.$utils.formatDate(
        date,
        format ?? this.calerndarProps.type === "month"
          ? "YYYY-MM-DD"
          : "YYYY-MM"
      );
    },

    getInfoProps(date) {
      const item = this.items.find((i) => {
        return this.formatDate(date) === this.formatDate(i.orderDate);
      });

      return item
        ? {
            info: item,
          }
        : void 0;
    },

    handleEntityActions(action) {
      switch (action.event) {
        case "import":
          this.uploadVisiable = true;
          break;
      }
    },

    handleCellDblclick(date) {
      if (!this.$utils.date(date).isBefore(new Date(), "day")) {
        const item = this.items.find((i) => date === i.orderDate);

        this.editingObj = Object.assign(
          {
            orderDate: date,
            number: 50,
            checkOrgId: this.queryForm.checkOrgId,
          },
          item
        );
      }
    },

    async handleValidate(model) {
      try {
        const res = await this.$api.healthy.tOrderSetting.save(
          Object.assign({}, model, {
            orderDate: this.$utils.formatDate(model.orderDate),
          })
        );

        if (res?.success) {
          this.$Message.success("保存成功");
          this.editingObj = null;
          this.query();
        }
      } catch (error) {
        this.$Message.error(error.message);
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
