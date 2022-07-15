<template>

    <Modal v-model="show" class="contractPreview" :fullscreen="isFullscreen"  :mask-closable="false">
        <!--        <iframe :src="pdfUrl" style="width: 100%; height: 100%"></iframe>-->
        <div slot="header" style="position: relative; margin-right: 30px;display: flex;justify-content: space-between;    cursor: pointer;">
            <p>附件查看</p>
            <Icon type="md-expand" @click="changeFull" size="24" color="#ccc"></Icon>
        </div>
        <Tabs size="small" :value="tabsClickIndex" @on-click="tabsClick" style="width: 100%; height: 100%">
            <TabPane label="委托协议" name="0" v-if="!loading" style="height: 100%">
                <div class="previewIframe" style="height: 100%" v-if="groupOrderInfo && groupOrderInfo.orderPath && groupOrderInfo.orderPath.trim().length > 0">
                    <iframe  ref="previewHtmlTemplate" :src="pathLeft+groupOrderInfo.orderPath" frameborder="0" style="width: 100%; height: 100%"></iframe>
                </div>
                <div style="height: 100%" v-else>
                    <!--暂无数据-->
                    <no-data width="150" style="height: 100%;overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>
                </div>
            </TabPane>
            <TabPane label="评价报告" name="1" v-if="!loading" style="height: 100%">
                <div class="previewIframe" style="height: 100%" v-if="groupOrderInfo && groupOrderInfo.orderEvaluatePath && groupOrderInfo.orderEvaluatePath.trim().length > 0">
                    <iframe  ref="previewHtmlTemplatePS" :src="pathLeft+groupOrderInfo.orderEvaluatePath" frameborder="0" style="width: 100%; height: 100%"></iframe>
                </div>
                <div style="height: 100%" v-else>
                    <!--暂无数据-->
                    <no-data width="150" style="height: 100%;overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>
                </div>
            </TabPane>
            <TabPane label="营业执照" name="2" v-if="!loading" style="height: 100%">
                <div class="previewIframe" style="height: 100%" v-if="groupOrderInfo && groupOrderInfo.orderLicensePath && groupOrderInfo.orderLicensePath.trim().length > 0">
                    <iframe  ref="previewHtmlTemplate" :src="pathLeft+groupOrderInfo.orderLicensePath" frameborder="0" style="width: 100%; height: 100%"></iframe>
                </div>
                <div style="height: 100%" v-else>
                    <!--暂无数据-->
                    <no-data width="150" style="height: 100%;overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>
                </div>
            </TabPane>
        </Tabs>
    </Modal>
</template>

<script>
    import noData from "../../../components/no-data"

    export default {
        name: "contractPreview",
        components: {
            noData,
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            url: {
                type: String,
                default: ""
            },
            groupOrderInfo: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                isFullscreen: false,
                tabsClickIndex: 0,
                show: this.value,
                loading:false,
                btnLoading:false,
                isTemplateShow:false,
                personIds:[],
                pdfUrl:"",
                pathLeft:"",
            }
        },
        methods: {
            /**
             * tab点击事件
             * @param name
             */
            tabsClick(name) {
                this.tabsClickIndex = name;
                if(this.tabsClickIndex == 0){
                    if(!this.groupOrderInfo || !this.groupOrderInfo.orderPath || this.groupOrderInfo.orderPath.trim().length == 0){
                        this.$Message.info('委托协议暂未上传！');
                    }
                }else if(this.tabsClickIndex == 1){
                    if(!this.groupOrderInfo || !this.groupOrderInfo.orderEvaluatePath || this.groupOrderInfo.orderEvaluatePath.trim().length == 0){
                        this.$Message.info('评价报告暂未上传！');
                    }
                }else if(this.tabsClickIndex == 2){
                    if(!this.groupOrderInfo || !this.groupOrderInfo.orderLicensePath || this.groupOrderInfo.orderLicensePath.trim().length == 0){
                        this.$Message.info('营业执照暂未上传！');
                    }
                }
            },
            init() {
                let urlNew = window.location.protocol + "//" + window.location.host + "/tempFileUrl/" + this.url;
                this.pathLeft = window.location.protocol + "//" + window.location.host + "/tempFileUrl/";
                this.pdfUrl = urlNew;
                if(!this.groupOrderInfo || !this.groupOrderInfo.orderPath || this.groupOrderInfo.orderPath.trim().length == 0){
                    this.$Message.info('委托协议暂未上传！');
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
            //全屏
            changeFull() {
                this.isFullscreen = !this.isFullscreen;
                let height = document.documentElement.clientHeight;
                let element = document.querySelector(".contractPreview").querySelector(".ivu-modal-body");
                if (this.isFullscreen) {
                    element.style.height = (height - 107) + "px";
                } else {
                    element.style.height = (height - 300) + "px";
                }
            }
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
        },
        watch: {
            value(val) {
                this.show = val;
                this.pdfUrl = "";
            },
            show(val) {
                if (val) {
                    this.init();
                    /*if(this.url && this.url.trim().length>0){
                        this.init();
                    }
                    else{
                        this.$Message.error("还未上传合同 或者参数有误，请联系管理员！！");
                        this.closeModal(false)
                    }*/
                } else {
                    this.closeModal(false)
                }
            }
        }
    }
</script>

<style lang="less">
    .contractPreview {
        width: 100%;
        height: 100%;
        .ivu-modal {
            /*width: 80vw !important;*/
            min-width: 60vw ;
        }
        .ivu-modal-body {
            position: relative;
            height: 70vh;
            /* overflow-y: auto; */
            /* background-color: #e8eaec; */
        }
        .ivu-modal-body {
            position: relative;
            height: 70vh;
            /* overflow-y: auto; */
            /* background-color: #e8eaec; */
        }
        .ivu-tabs .ivu-tabs-content-animated {
            display: flex;
            flex-direction: row;
            will-change: transform;
            transition: transform .3s ease-in-out;
            height: 100%;
        }

        .ivu-modal-fullscreen .ivu-modal-body {
            width: 100%;
            overflow: auto;
            position: absolute;
            /*top: 51px;
            bottom: 61px;*/
            top: 5.1vh;
            bottom: 6vh;
            height: 89vh !important;
        }

    }
</style>