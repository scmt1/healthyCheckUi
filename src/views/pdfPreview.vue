<template>
    <Modal v-model="show" title="预览" class="previewPrint" :mask-closable="false" :fullscreen="isFullscreen" :width="modalWidth">
        <div slot="header" style="position: relative; margin-right: 30px;display: flex;justify-content: space-between;cursor: pointer;">
            <p>模板预览</p>
            <Icon type="md-expand" @click="changeFull" size="24" color="#ccc"></Icon>
        </div>
        <iframe id="printPdf" :src="previewHtmlUrl" frameborder="0" style="width: 100%;" :height="height"
                class="pdfTemplate"></iframe>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
                  <Button type="primary" :loading="loading" @click="downFile()">下载</Button>
        </div>
        <Spin fix v-show="loading">
            <div class="demo-spin-icon-load">
                <!-- 这里用的是阿里图标库 -->
                <i class="iconfont icon-loader--line"></i>
            </div>
            <div style='font-size:16px'>Loading...</div>
        </Spin>
    </Modal>
</template>

<script>
    export default {
        name: "pdfPreview",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            url: {
                type: String,
                default: ""
            },
        },
        data(){
            return{
                previewHtmlUrl: this.url,

                isFullscreen: false,
                show: this.value,
                modalWidth: 800,
                height: '100%',
            }
        },
        methods:{
            //下载文件
            downFile(){
                let oA = document.createElement("a");
                oA.href = "/excel/用户手册.rar";
                oA.click();
                window.URL.revokeObjectURL(oA.href);
            },
            closeModal(val) {
                this.$emit('input', val);
            },
            changeFull() {
                this.isFullscreen = !this.isFullscreen;
                let height = document.documentElement.clientHeight;
                let element = document.querySelector(".previewPrint").querySelector(".ivu-modal-body");
                if (this.isFullscreen) {
                    element.style.height = (height - 110) + "px";
                } else {
                    element.style.height = (height - 300) + "px";
                }
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                if (val) {
                    // 计算高度
                    let height = document.documentElement.clientHeight;
                    let element = document.querySelector(".previewPrint").querySelector(".ivu-modal-body");
                    element.style.height = (height - 300) + "px";
                    this.modalWidth = (document.documentElement.clientWidth - 400);
                    window.onresize = () => {
                        // 计算高度
                        let height = document.documentElement.clientHeight;
                        element.style.height = (height - 300) + "px";
                        this.modalWidth = (document.documentElement.clientWidth - 400);
                    };
                    this.previewHtmlUrl = this.url;
                } else {
                    this.closeModal(false)
                }
            }
        }
    }
</script>

<style lang="less">
    .previewPrint {
        position: relative;

        .ivu-modal-body {
            /*overflow-y: auto;*/
            position: relative;
            background-color: #e8eaec;
            top: 0 !important;
            bottom: 0 !important;
            height: calc(100% - 110px);
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