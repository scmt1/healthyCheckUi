<template lang="pug">
data-page
  template(#aside)
    api-based-tree(
      v-model="queryForm.checkOrgId",
      :load-method="treeLoadMethod",
      auto-select
    )

  template(#query)
    query-form(
      v-model="queryForm",
      :fields="queryFormFields",
      :loading="loading",
      ref="queryForm",
      @query="query"
    )

  //- template(#header)
  //-   page-header(:actions="pageHeaderActions", @act="handleEntityActions")

  el-tabs(v-model="queryForm.isPass", lazy)
    el-tab-pane(
      v-for="tab of tabs",
      :key="tab.value",
      :name="tab.value",
      :label="tab.label"
    )
      Table(
        :loading="tab.loading",
        :data="tab.data",
        :columns="tableColumns",
        @on-selection-change="handleSelectionChange"
      )

  data-pagination(:pagination="pagination", @paginate="query")
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      selectItems: [],
      queryForm: {
        checkOrgId: "",
        isPass: "0",
      },
      tabs: [
        {
          label: "待审核",
          value: "0",
          data: [],
        },
        {
          label: "已审核",
          value: "1",
          data: [],
        },
      ],
      pagination: {
        total: 0,
        pageNumber: 1,
        pageSize: 10,
      },
    };
  },
  computed: {
    queryFormFields() {
      return [
        {
          key: "personName",
          label: "用户姓名",
        },
        {
          key: "physicalType",
          label: "体检类别",
          as: "select",
          filterable: true,
          loadMethod: () => this.$api.getDictAsOptions("checkType"),
        },
        {
          key: "comboName",
          label: "体检套餐",
          as: "select",
          cascader: "physicalType",
          filterable: true,
          labelAsValue: true,
          loadMethod: () => this.initComboOptions(),
        },
        {
          key: "date",
          label: "体检日期",
          as: "date",
          default: new Date(),
        },
      ];
    },

    pageHeaderActions() {
      return [
        {
          label: "批量审核",
          event: "check",
        },
      ];
    },

    tableColumns() {
      return [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          type: "index",
          width: 60,
        },
        {
          key: "personName",
          title: "用户姓名",
          width: 120,
          render: (h, { row }) => h("span", row.tgroupPerson?.personName),
        },
        {
          key: "sex",
          title: "性别",
          width: 80,
          render: (h, { row }) => h("span", row.tgroupPerson?.sex),
        },
        {
          key: "physicalType",
          title: "体检类别",
          render: (h, { row }) => h("span", row.tgroupPerson?.physicalType),
        },
        {
          title: "体检套餐",
          key: "comboName",
          tooltip: true,
        },
        {
          key: "orderDate",
          title: "体检日期",
          render: (h, { row }) =>
            h("entity-field-date", {
              props: {
                value: row.createTime,
                format: "YYYY-MM-DD",
              },
            }),
        },
        {
          key: "idCard",
          title: "身份证号",
          width: 160,
          render: (h, { row }) =>
            h("span", this.$utils.formatIDCard(row.tgroupPerson?.idCard)),
        },
        {
          key: "mobile",
          title: "联系方式",
          width: 130,
          render: (h, { row }) => h("span", row.tgroupPerson?.mobile),
        },
        {
          key: "createTime",
          title: "预约日期",
          width: 120,
          render: (h, { row }) =>
            h("entity-field-date", {
              props: {
                value: row.createTime,
                format: "YYYY-MM-DD",
              },
            }),
        },
        {
          title: "操作",
          render: (h, { row }) =>
            h("DataRowActions", {
              props: {
                model: row,
                actions: [
                  {
                    label: "审核",
                    event: "check",
                  },
                ],
              },
              on: {
                act: this.handleEntityActions,
              },
            }),
          visiable: this.queryForm.isPass === "0",
        },
      ].filter((i) => i.visiable === void 0 || i.visiable);
    },
  },
  watch: {
    "queryForm.checkOrgId": {
      handler() {
        this.$refs["queryForm"]?.resetFields();
        this.query();
      },
    },
    "queryForm.isPass": {
      handler() {
        console.log(1);
        this.query();
      },
    },
    items() {
      this.selectItems = [];
    },
  },
  methods: {
    async query(q) {
      if (this.loading) return;

      this.loading = true;

      try {
        const queryParams = Object.assign(
          {},
          this.queryForm,
          this.pagination,
          q
        );

        const res = await this.$api.healthy.tOrderRecord.query(queryParams);

        if (res?.success) {
          const {
            current: pageNumber,
            size: pageSize,
            total,
            records: items,
          } = res.data;

          Object.assign(this, {
            pagination: {
              total,
              pageSize,
              pageNumber,
            },
          });

          const tab = this.tabs.find((i) => queryParams.isPass === i.value);

          if (tab) {
            this.$set(tab, "data", items);
          }
        } else {
          this.$Message.error(res.message);
        }
      } catch (err) {
        this.$Message.error(err.message);
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
        this.$Message.error(error.message);
      }
    },

    async checkRecords(records) {
      this.$Modal.confirm({
        title: "确认审核",
        content: "您确认要审核当前数据?",
        onOk: async () => {
          try {
            const params = [].concat(records).map((i) => ({
              id: records.tgroupPerson.id,
              isPass: 1,
            }));

            const res =
              await this.$api.healthy.tGroupPerson.updateTGroupPersonByIsPass(
                params[0]
              );

            if (res?.success) {
              this.$Message.success("审核成功");
              this.$Modal.remove();
              this.query({
                page: 1,
              });
            }
          } catch (error) {
            this.$Message.error(error.message);
          }
        },
        onCancel: () => {
          this.$Message.info("取消了当前的操作行为！");
        },
      });
    },

    async initComboOptions() {
      try {
        if (!this.queryForm.physicalType) return [];

        if (this.queryForm.physicalType === "职业体检") {
          const res = await this.$api.healthy.tCombo.queryTComboList({
            pageSize: 9999,
            type: "职业体检",
          });

          if (res?.success) {
            return res?.data?.records.map((i) => ({
              label: i.name,
              value: i.id,
              _raw: i,
            }));
          } else {
            return Promise.reject(res?.msg ?? "未知错误");
          }
        } else {
          const res = await this.$api.healthy.tCheckOrg.getComBos(
            Object.assign({
              combosType: this.queryForm.physicalType,
              id: this.queryForm.checkOrgId,
            })
          );

          if (res?.success) {
            return res.data.map((i) => ({
              label: i.name,
              value: i.id,
              _raw: i,
            }));
          } else {
            return Promise.reject(res?.msg ?? "未知错误");
          }
        }
      } catch (error) {
        this.$Message.error(error.message);
      }
    },

    handleEntityActions(action, model) {
      switch (action.event) {
        case "check":
          if (model === void 0 && this.selectItems.length === 0) {
            return this.$Message.warning("请选择预约记录");
          }
          this.checkRecords(model ?? this.selectItems);
          break;
      }
    },

    handleSelectionChange(selections) {
      Object.assign(this, { selectItems: selections });
    },
  },
};
</script>

<style lang="less" scoped></style>
