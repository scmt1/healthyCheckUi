<template lang="pug">
data-page
  template(#query)
    query-form(v-model="queryForm", :fields="queryFormFields", @query="query")

  template(#header)
    page-header(:actions="pageHeaderActions", @act="handleEntityActions")

  Table(:data="tableData", :columns="tableColumns", v-loading="loading")

  data-pagination(:pagination="pagination", @paginate="query")

  edit-form(
    v-model="editingObj",
    :items="formItems",
    :rules="formRules",
    @validate="handleValidate",
    @close="handleFormClosed"
  )

  org-detail(:model="viewingObj", @closed="viewingObj = null")
</template>

<script>
import { save, destroy, query } from "../../../api/healthy/tCheckOrg";
import { getDictAsOptions } from "@/api";

import Uploader from "./components/Uploader.vue";
import OrgDetail from "./components/Detail.vue";

export default {
  components: {
    Uploader,
    OrgDetail,
  },
  data() {
    return {
      loading: false,
      editingObj: null,
      viewingObj: null,
      tableData: [],
      queryForm: {},
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
          label: "机构名称",
          key: "name",
        },
        {
          label: "机构位置",
          key: "address",
        },
      ];
    },
    pageHeaderActions() {
      return [
        {
          type: "primary",
          label: "新增",
          event: "add",
          icon: "md-add",
        },
      ];
    },
    tableColumns() {
      return [
        {
          title: "机构名称",
          key: "name",
          tooltip: true,
        },
        {
          title: "机构位置",
          key: "address",
          tooltip: true,
        },
        {
          title: "机构图片",
          key: "avatar",
          render: (h, { row }) =>
            h(Uploader, {
              props: {
                value: row.avatar,
                viewOnly: true,
              },
            }),
        },
        {
          title: "营业时间",
          key: "name",
        },
        {
          title: "联系方式",
          key: "phone",
        },
        {
          title: "机构简介",
          key: "introduction",
          tooltip: true,
        },
        {
          title: "到院须知",
          key: "name",
          tooltip: true,
        },
        {
          title: "操作",
          render: (h, { row }) =>
            h("DataRowActions", {
              props: {
                actions: this.rowActions,
                model: row,
              },
              on: {
                act: this.handleEntityActions,
              },
            }),
        },
      ];
    },
    rowActions() {
      return [
        {
          type: "primary",
          event: "edit",
          icon: "ios-create-outline",
          label: "修改",
        },
        {
          type: "danger",
          event: "delete",
          icon: "ios-create-outline",
          label: "删除",
        },
        {
          event: "view",
          icon: "ios-create-outline",
          label: "查看",
        },
      ];
    },
    formItems() {
      if (!this.editingObj) return [];

      return [
        {
          span: 24,
          label: "机构名称",
          key: "name",
        },

        {
          span: 24,
          label: "机构位置",
          key: "address",
        },
        {
          span: 24,
          label: "体检类别",
          key: "checkType",
          as: "check",
          mulitple: true,
          loadMethod: () => getDictAsOptions("checkType"),
        },

        {
          span: 24,
          label: "机构图片",
          key: "avatar",
          render: (h) =>
            h(Uploader, {
              props: {
                value: this.editingObj.avatar,
              },
              on: {
                input: (val) => (this.editingObj.avatar = val),
              },
            }),
        },
        {
          span: 24,
          label: "轮播图",
          key: "images",
          render: (h) =>
            h(Uploader, {
              props: {
                value: this.editingObj.images,
                multiple: true,
              },
              on: {
                input: (val) => {
                  this.editingObj.images = val;
                },
              },
            }),
        },
        {
          span: 24,
          label: "机构等级",
          key: "level",
          render: (h) =>
            h("ApiBasedCascader", {
              props: {
                modelValue: this.orgLevel,
                loadMethod: () => {
                  const levels = ["一级", "二级", "三级"];

                  const grades = ["甲等", "乙等", "丙等"];

                  return levels.map((i) => ({
                    label: i,
                    value: i,
                    children: (i === "三级" ? ["特等", ...grades] : grades).map(
                      (i) => ({
                        label: i,
                        value: i,
                      })
                    ),
                  }));
                },
              },
              attrs: {
                renderFormat: (label) =>
                  label.reduce((a, b) => a + b.slice(0, 1), ""),
              },
              on: {
                "update:modelValue": (val) => (this.orgLevel = val),
              },
            }),
        },
        {
          span: 24,
          label: "医院标签",
          key: "tags",
          render: (h) =>
            h("InputTags", {
              props: {
                modelValue: this.editingObj["tags"],
              },
              on: {
                "update:modelValue": (val) => (this.editingObj["tags"] = val),
              },
            }),
        },
        {
          span: 24,
          label: "营业时间",
          key: "businessHours",
        },

        {
          span: 24,
          label: "联系方式",
          key: "phone",
        },
        {
          span: 24,
          label: "机构简介",
          key: "introduction",
          type: "textarea",
        },
        {
          span: 24,
          label: "到院须知",
          key: "notice",
          type: "textarea",
        },
      ];
    },
    formRules() {
      return {
        name: [
          {
            required: true,
            message: "请输入机构名称",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入机构地址",
            trigger: "blur",
          },
        ],
        checkType: [
          {
            required: true,
            message: "请选择体检类别",
            trigger: "change",
          },
        ],
        avatar: [
          {
            required: true,
            message: "请上传机构图片",
            trigger: "change",
          },
        ],
        images: [
          {
            required: true,
            message: "请上传轮播图图片",
            trigger: "change",
          },
        ],
      };
    },
    orgLevel: {
      get() {
        const level = this.editingObj["level"];

        return (level === null ? "" : level)
          .split("")
          .map((v, i) => v + (i === 0 ? "级" : "等"));
      },
      set(val) {
        this.editingObj["level"] = val.length
          ? val.reduce((a, b, i) => a + b.slice(0, 1), "")
          : "";
      },
    },
  },
  created() {
    this.query();
  },
  methods: {
    query(q) {
      if (this.loading) return;
      this.loading = true;
      const queryParams = Object.assign(
        {},
        this.queryFormProps,
        this.pagination,
        q
      );

      query(queryParams)
        .then((res) => {
          if (res?.success && res?.data) {
            const {
              current: pageNumber,
              size: pageSize,
              total,
              records: tableData,
            } = res.data;

            Object.assign(this, {
              pagination: {
                total,
                pageSize,
                pageNumber,
              },
              tableData,
            });

            this.loading = false;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    $$createModel(model) {
      return Object.assign(
        {
          name: "",
          address: "",
          checkType: "",
          avatar: "",
          images: "",
          businessHours: "",
          phone: "",
          introduction: "",
          notice: "",
        },
        model
      );
    },

    handleEntityActions(action, model) {
      switch (action.event) {
        case "add":
          this.editingObj = this.$$createModel();
          break;
        case "edit":
          this.editingObj = this.$$createModel(model);
          break;
        case "delete":
          this.handleDelete(model.id);
          break;
        case "view":
          this.viewingObj = model;
          break;
      }
    },

    handleDelete(ids) {
      let loading = true;
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除当前数据！！！",
        loading,
        onOk: async () => {
          destroy(ids)
            .then((res) => {
              if (res?.success) {
                this.$Modal.remove();
                this.$Message.success("删除成功");
                this.query({
                  pageNumber: 1,
                });
              } else {
                this.$Message.error(res.message);
              }
            })
            .catch((err) => {
              this.$Message.error(err.message);
            })
            .finally(() => {
              loading = false;
            });
        },
      });
    },

    async handleValidate(form) {
      try {
        const res = await save(form);

        if (res?.success) {
          this.editingObj = null;
          this.$Message.success("保存成功");
          this.query({
            pageNumber: 1,
          });
        } else {
          this.$Message.error(res.message);
        }
      } catch (err) {
        this.$Message.error(err.message);
      }
    },

    handleFormClosed() {
      this.editingObj = null;
    },
  },
};
</script>

<style lang="less" scoped></style>
