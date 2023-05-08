<template>
    <Modal v-model="show" title="单机版数据导入" :mask-closable="false" :draggable="false" class="dataBaseUpload"
           width="900">
        <Upload
            type="drag"
            name="file"
            accept=".zip"
            :format="fileTypeArr"
            :on-success="uploadSuccess"
            :data="data"
            :action="api"
            :headers="upHeaders"
            :before-upload="handleUpload"
            ref="uploadDataBase">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>请选择上传的文件</p>
            </div>
        </Upload>
        <div style="color: red;font-weight: bold;margin-top: 10px;">
            <p>提示：</p>
            <p>1.请上传单机版导出的数据</p>
            <p>2.导入会覆盖之前数据，并且只能导入一次（请慎重操作）</p>
            <p>3.上传文件类型只能为"zip",</p>
        </div>

        <div slot="footer">
            <Button type="primary" :loading="loading" @click="show=false">关闭</Button>
        </div>
    </Modal>
</template>
<script>
import {base_Url} from '@/libs/axios'
import {getStore} from '@/libs/storage';

export default {
    name: "DataBaseUpload",
    props: {
		value: {
			type: Boolean,
			default: false
		},
		modalTitle: {
			type: String
		},
	},
    computed: {
        physicalType() {
            return this.$store.state.theme.theme.physicalType;
        }
    },
    data() {
        return {
            contentStr: [],
            fileTypeArr: ["zip"],//文件类型
            show: this.value,//是否显示
            editTitle: this.modalTitle,//标题
            loading: false,
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
            return base_Url + '/dataBase/import';
        },

        closeModal(val) {
            this.$emit('input', val);
        },
        handleUpload(file) {
			this.loading = true;
            return true;
        },
        uploadSuccess(response, file, fileList) {
			this.loading = false;
            if (response.success) {
                this.$Message.success(response.msg);
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
                this.$refs.uploadDataBase.clearFiles();//清空已上传的文件列表
            }
        }
    },
    created() {
        this.height = Math.floor(document.body.scrollHeight * 0.95) + "px";
        this.width = Math.floor(document.body.scrollWidth * 0.95) + "px";
    },
}
</script>
