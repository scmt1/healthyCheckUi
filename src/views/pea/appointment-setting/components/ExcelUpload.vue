<template lang="pug">
Modal.excel-upload(
  title="批量导入",
  v-model="show",
  :mask-closable="false",
  :style="`--ivu-modal-width: ${modalWidth}`"
)
  //- 操作按钮
  Row
    Upload(
      action="#",
      accept=".xls,.xlsx,.csv",
      :before-upload="handleBeforeUpload"
    )
      Button(
        icon="ios-cloud-upload-outline",
        type="primary",
        :loading="uploading",
        @click="handleUploadFile"
      ) 批量导入数据
    Button(type="info", @click="handleDownloadTemplate") 模板下载

  //- 文件操作
  Row(v-if="file !== null")
    .ivu-upload-list-file
      Icon(type="ios-stats") importExcel
      span {{ file.name }}
      Icon.ivu-upload-list-remove(type="ios-close", @click="handleRemoveFile")

  //- 显示进度条
  Row(v-if="showProgress")
    Transition(name="fade")
      Progress(:percent="progressPercent", :stroke-width="2")
        Icon(type="ios-checkmark-circle")
        span 成功

  Row(style="margin-top: 16px")
    Table(
      :columns="columns",
      :data="tableData",
      :max-height="400",
      width="100%"
    )
  template(slot="footer")
    Button(type="text", @click="show = false") 取消

    Button(type="primary", @click="handleSubmit") 确定
</template>

<script>
import excelUtil from "../../../healthy/tGroupOrder/common/excel";

import { importExcel } from "../../../../api/healthy/tOrderSetting";
import { cancelGeneralInspectionByIdStatus } from "../../../../api/healthy/tGroupPerson";
export default {
  model: {
    prop: "visiable",
    event: "update:visiable",
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    size: {
      type: "small" | "middle" | "large",
      default: "small",
    },
    orgId: {
      type: String,
      default: "",
    },
  },
  emits: ["uploaded"],
  data() {
    return {
      show: this.visiable,
      uploading: false,
      tableData: [],
      columns: [],
      file: null,
      showProgress: false,
      progressPercent: 0,
    };
  },
  computed: {
    modalWidth() {
      const sizes = {
        small: "25vw",
        middle: "50vw",
        large: "75vw",
      };

      return sizes[this.size] ?? this.sizes["small"];
    },
  },
  watch: {
    visiable(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("update:visiable", val);

      if (!val) {
        this.resetData();
      }
    },
  },
  methods: {
    resetData() {
      this.file = null;
      this.showProgress = false;
      this.progressPercent = 0;
      this.tableData = [];
    },

    readFile(file) {
      const reader = new FileReader();

      reader.readAsArrayBuffer(file);

      reader.onloadstart = () => {
        this.uploading = true;
        this.showProgress = true;
      };

      reader.onprogress = (e) => {
        this.progressPercent = Math.round((e.loaded / e.total) * 100);
      };

      reader.onload = (e) => {
        this.$Message.info("文件读取成功");
        const data = e.target.result;
        const { header, results } = excelUtil.read(data, "array");
        const tableTitle = header.map((item) => {
          return { title: item, key: item, ellipsis: true, tooltip: true };
        });
        this.tableData = results;
        this.columns = tableTitle;
        this.uploading = false;
      };

      reader.onerror = (e) => {
        this.$Message.error("文件读取出错");
      };
    },

    handleUploadFile() {
      this.resetData();
    },

    handleBeforeUpload(file) {
      const fileExt = file.name.split(".").pop().toLocaleLowerCase();
      if (fileExt === "xlsx" || fileExt === "xls" || fileExt === "csv") {
        this.readFile(file);
        this.file = file;
      } else {
        this.$Notice.warning({
          title: "文件类型错误",
          desc:
            "文件：" +
            file.name +
            "不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。",
        });
      }
      return false;
    },

    handleDownloadTemplate() {
      const a = document.createElement("a");

      a.href = "/excel/体检预约模板.xlsx";
      a.click();
      window.URL.revokeObjectURL(a.href);
    },

    handleRemoveFile() {
      this.resetData();
    },

    handleSubmit() {
      if (!this.orgId) {
        this.$Message.info("请选择组织机构");
        return;
      }

      if (!this.tableData?.length) {
        this.$Message.info("请导入数据");

        return;
      }

      const params = this.tableData.map((i) => ({
        orderDate: this.$utils.formatDate(i["日期"]),
        number: i["可预约数量"],
        checkOrgId: this.orgId,
      }));

      importExcel(params).then((res) => {
        if (res?.success) {
          this.$Message.success("保存成功");
          this.show = false;

          this.$emit("uploaded", params);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.excel-upload {
  /deep/ .ivu-modal {
    width: var(--ivu-modal-width) !important;
  }

  /deep/ .ivu-table-wrapper {
    width: 100% !important;
  }
}
</style>
