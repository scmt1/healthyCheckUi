<template>
    <Modal v-model="show" :title="editTitle" :mask-closable="false" :draggable="false" class="looktTSubstances"
           width="900">
        <Upload
            type="drag"
            name="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel.sheet.macroEnabled.12"
            :format="fileTypeArr"
            :on-success="uploadSuccess"
            :data="data"
            :action="api"
            :headers="upHeaders"
            :before-upload="handleUpload"
            ref="upload">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>请选择上传的文件</p>
            </div>
        </Upload>
        <div style="color: red;font-weight: bold;margin-top: 10px;">
            <p>提示：</p>
            <p>1.请按模板填写数据，模板格式禁止调整</p>
            <p>2.导入会覆盖之前数据（请慎重操作）</p>
            <p>3.上传文件类型只能为"xls", "xlsx", "xlsm"</p>
        </div>

        <div slot="footer">
            <Button type="info" @click="handleCreateA">模板下载</Button>
            <Button type="primary" @click="show=false">关闭</Button>
        </div>
    </Modal>
</template>
<script>
import {base_Url} from '@/libs/axios'
import {getStore} from '@/libs/storage';

export default {
    name: "ExcelUpload",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String
        },
        orderId: {
            type: String,
            default: ""
        },
        groupId: {
            type: String,
            default: ""
        }
    },
    computed: {
        physicalType() {
            return this.$store.state.theme.theme.physicalType;
        }
    },
    data() {
        return {
            contentStr: [],
            fileTypeArr: ["xls", "xlsx", "xlsm"],//文件类型
            show: this.value,//是否显示
            editTitle: this.modalTitle,//标题
            loading: true,
            api: this.getApi(),
            upHeaders: {
                "User-Type": 'Gov_User',
                "accessToken": getStore("accessToken")
            },
            data: {},
        }
    },
    methods: {
        getApi() {
            return base_Url + '/tGroupPerson/importExcel?orderId=' + this.orderId + '&groupId=' + this.groupId +'&importFailure='+ this.$hospitalName.importFailure;
        },
        //创建a标签
        handleCreateA() {
            let oA = document.createElement("a");
            if (this.physicalType == '职业体检') {
                oA.href = "/excel/职业体检导入模板.xlsx";
            } else if (this.physicalType == '健康体检') {
                oA.href = "/excel/健康体检导入模板.xlsx";
            } else if (this.physicalType == '放射体检') {
                oA.href = "/excel/放射体检导入模板.xlsx";
            }
            oA.click();
            window.URL.revokeObjectURL(oA.href);
        },
        closeModal(val) {
            this.$emit('input', val);
        },
        handleUpload(file) {
            return true;
        },
        uploadSuccess(response, file, fileList) {
            if (response.success) {
                this.$Message.success(response.data);
                this.closeAllModal();
            } else {
                this.$Message.error(response.msg);
            }
        },
        closeAllModal() {//关闭
            this.closeModal(false);
            this.$emit('handleSearch');//上传完毕后再重新渲染表格
        },
    },
    watch: {
        value(val) {
            this.show = val;
        },
        show(val) {
            this.loading = false;
            this.editTitle = this.modalTitle;
            this.api = this.getApi();
            if (!val) {
                this.closeModal(val);
                this.$refs.upload.clearFiles();//清空已上传的文件列表
            }
        }
    },
    created() {
        this.height = Math.floor(document.body.scrollHeight * 0.95) + "px";
        this.width = Math.floor(document.body.scrollWidth * 0.95) + "px";
    },
}
</script>
