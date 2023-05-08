<template>

    <Modal v-model="show" title="审核个人报告" class="PersonalReport" :mask-closable="false" :fullscreen="isFullscreen" :width="modalWidth">
        <div slot="header" style="position: relative; margin-right: 30px;display: flex;justify-content: space-between;cursor: pointer;">
            <p>模板预览</p>
            <Icon type="md-expand" size="24" @click="changeFull" color="#ccc"></Icon>
        </div>
        <templateShow ref="templateShow" style="height: 100%;" v-if="physicalType && physicalType!='从业体检' && isTemplateShow" :type-status="typeStatus" :personIds="personIds" :isBatchPrint="isBatchPrint"
                      v-on:closeLoading="closeLoading" :physicalType="physicalType" taskNow="报告展示"></templateShow>
        <templateCertificate ref="templateCertificate" v-if="physicalType && physicalType=='从业体检' && isTemplateShow" style="height: 100vh;overflow:hidden;"
                             v-on:closeLoadingCertificate="closeLoading" :personIds="personIds" :personInfo="TTemplateData"></templateCertificate>
        <!-- loading -->
        <Spin fix v-show="loading">
            <div class="demo-spin-icon-load">
                <i class="iconfont icon-loader--line"></i>
            </div>
            <div style='font-size:16px'>Loading...</div>
        </Spin>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" @click="downloadTemplate()">下载Word</Button>
            <Button type="primary" :loading="btnLoading" @click="handelSubmit">审核</Button>
        </div>
    </Modal>
</template>

<script>
    import templateShow from "../../reportReview/templateShow";
    import {updateTGroupPersonById,updateTGroupPersonByIdTypeStatus} from "@/api/healthy/tGroupPerson";
    import templateCertificate from "../../tHealthCertificate/templateCertificate";
    import {exportWord} from '@/api/healthy/tTemplate';

    export default {
        name: "PersonalReport",
        components: {
            templateShow,templateCertificate
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            personId: {
                type: String,
                default: ""
            },
            typeStatus: {
                type: Boolean,
                default: false
            },
            status:{
                type: String,
                default: ""
            },
            physicalType:{
                type:String,
                default:"职业体检"
            }
        },
        data() {
            return {
                TTemplateData: {},

                isFullscreen: false,
                modalWidth: 1520,
                modalWidthOld: 1520,

                footerHide:true,
                show: this.value,
                loading:false,
                btnLoading:false,
                isTemplateShow:false,
                personIds:[],
                isBatchPrint: false,//是否批量打印
            }
        },
        methods: {
            //word下载
            downloadTemplate() {
                let _this = this;
                let url = "";
                let name = "";
                let previewHtmlUrl = this.$refs.templateShow.previewHtmlUrl;
                let previewHtmlUrlGZS = this.$refs.templateShow.previewHtmlUrlGZS;
                let previewHtmlUrlFM = this.$refs.templateShow.previewHtmlUrlFM;
                let previewHtmlUrlFC = this.$refs.templateShow.previewHtmlUrlFC;
                let previewHtmlUrlTJJL = this.$refs.templateShow.previewHtmlUrlTJJL;
                let previewHtmlUrlFirstFM = this.$refs.templateShow.previewHtmlUrlFirstFM;
                let tabsClickIndex = this.$refs.templateShow.tabsClickIndex;
                let personName = this.$refs.templateShow.personInfo.person_name;
                if(tabsClickIndex == 0){
                    url = previewHtmlUrl;//个检报告
                    name = "个检报告";
                }else if(tabsClickIndex == 1){
                    url = previewHtmlUrlGZS;//告知书
                    name = "告知书";
                }else if(tabsClickIndex == 2){
                    url = previewHtmlUrlFM;//封面
                    name = "封面";
                }else if(tabsClickIndex == 3){
                    url = previewHtmlUrlFC;//复查报告
                    name = "复查报告";
                }else if(tabsClickIndex == 4){
                    url = previewHtmlUrlTJJL;//个人体检结论
                    name = "个人体检结论";
                }else if(tabsClickIndex == 5){
                    url = previewHtmlUrlFirstFM;//个人报告
                    name = "个人报告(含首页封面)";
                }
                let fileName = "";
                if(!personName || personName.trim().length <= 0){
                    fileName = name+".docx";
                }else{
                    fileName = personName+ "_"+name+".docx";
                }
                exportWord({url: url}).then(res => {
                    let content = res;
                    let blob = new Blob([content], {type: 'application/ms-excel'});
                    if ('download' in document.createElement('a')) { // 非IE下载
                        let elink = document.createElement('a');
                        elink.download = fileName;
                        elink.style.display = 'none';
                        elink.href = URL.createObjectURL(blob);
                        document.body.appendChild(elink);
                        elink.click();
                        URL.revokeObjectURL(elink.href); // 释放URL 对象
                        document.body.removeChild(elink);
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName);
                    }
                }).catch(function (error) {
                    _this.$Message.error('数据导出失败');
                });

            },
            init() {
                this.loading = true;
                if(this.physicalType && this.physicalType=='从业体检'){
                    this.loading = false;
                }
                this.isTemplateShow = true;
                this.personIds = [];
                this.personIds.push(this.personId)
                this.TTemplateData.id = this.personId;
            },
            changeFull() {
                this.isFullscreen = !this.isFullscreen;
                let height = document.documentElement.clientHeight;
                if(document.querySelector(".auditingReport")){
                    let element = document.querySelector(".auditingReport").querySelector(".ivu-modal-body");
                    if(element){
                        if (this.isFullscreen) {
                            //element.style.height = (height - 110) + "px";
                            this.modalWidth = "100%";
                        } else {
                            //element.style.height = (height - 300) + "px";
                            this.modalWidth = this.modalWidthOld;
                        }
                    }

                }

            },
            /**
             * 关闭loading
             */
            closeLoading() {
                this.loading = false;
            },
            //关闭弹框
            closeModal(val) {
                this.$emit('input', val);
            },
            //审核请求
            handelSubmit() {
                if(!this.typeStatus){
                    updateTGroupPersonById(this.personIds).then(res => {
                        if(res){
                            if (res.success) {
                                this.$Message.success('审核成功');
                                this.closeModal(false);
                            } else {
                                this.$Message.error(res.msg);
                            }
                        }
                        else {
                            this.$Message.error('审核失败');
                        }

                    }).catch(res => {
                        this.$Message.error(res.msg);
                    }).finally(() => {
                        this.$emit('handleSearch');
                    })
                }else{
                    updateTGroupPersonByIdTypeStatus(this.personIds).then(res => {
                        if(res){
                            if (res.success) {
                                this.$Message.success('审核成功');
                                this.closeModal(false);
                            } else {
                                this.$Message.error(res.msg);
                            }
                        }
                        else {
                            this.$Message.error('审核失败');
                        }

                    }).catch(res => {
                        this.$Message.error(res.msg);
                    }).finally(() => {
                        this.$emit('handleSearch');
                    })
                }
            },
        },
        computed: {
            /*physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },*/
        },
        watch: {

            value(val) {
                this.show = val;
                this.isTemplateShow = false;
            },
            show(val) {
                if (val) {
                    this.isFullscreen = false;
                    this.changeFull();
                    if(this.personId && this.personId.trim().length>0){
                        this.init();
                    }
                    else{
                        this.$Message.error("参数错误，请联系管理员！！")
                    }
                } else {
                    this.closeModal(false)
                }
            },
        }
    }
</script>

<style lang="less">
    .PersonalReport {
        .ivu-modal {
            /*width: 80vw !important;*/
        }

        .ivu-modal-body {
            position: relative;
            /*height: 70vh;*/
            /*overflow-y: auto;*/
            background-color: #e8eaec;
            height: calc(100% - 110px);
            padding: 0px;
        }

        .ivu-modal-fullscreen .ivu-modal-body {
            width: 100%;
            overflow: auto;
            position: absolute;
            top: 53px;
            bottom: 61px;

        }

        .pdfTemplate {
            span {
                margin-bottom: 10px;
            }

            ::-webkit-scrollbar {
                width: 6px;
                background-color: #d8d8d8;
            }

            /* 滚动槽 */

            ::-webkit-scrollbar-track {
                border-radius: 10px;
            }

            ::-webkit-scrollbar-thumb {
                background-color: #bfc1c4;
            }
        }

        /* 旋转效果 */

        .demo-spin-icon-load {
            animation: ani-demo-spin 1s linear infinite;
        }

        @keyframes ani-demo-spin {
            from {
                transform: rotate(0deg);
            }
            50% {
                transform: rotate(180deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        /* 遮罩 */
        /* 假如内容过长，一屏放不下，滚动条下拉覆盖不全 */

        .ivu-spin-fix {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 8;
            width: 100%;
            height: 100%;
            background-color: hsla(0, 0%, 100%, .8);
        }
    }
</style>
