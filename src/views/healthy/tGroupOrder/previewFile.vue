<template>

    <Modal v-model="show" class="previewFile" :fullscreen="isFullscreen" :mask-closable="false">
        <div slot="header" style="position: relative; margin-right: 30px;display: flex;justify-content: space-between;    cursor: pointer;">
            <p>附件预览</p>
            <Icon type="md-expand" @click="changeFull" size="24" color="#ccc"></Icon>
        </div>
        <iframe id="printPdf" v-if="previewHtmlUrl && previewHtmlUrl.indexOf('.pdf')>-1" :src="previewHtmlUrl" frameborder="0" style="width: 100%; height: 100%"
                class="pdfTemplate"></iframe>
        <img v-else style="overflow: hidden;width: 100%;height: 100%;" :src="previewHtmlUrl">
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
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
    import {getTemplatePreviewData,exportWord,getEntrustData} from '@/api/healthy/tTemplate'
    import pdf from 'vue-pdf'
    import {formartDate} from "../../../api/tools/tool";
    export default {
        name: "previewFile",
        components: {
            pdf
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
        },
        data() {
            return {
                show: this.value,
                previewHtml: "",//预览显示
                previewHtmlUrl: "",
                numPages: null, // pdf 总页数
                loading: false,
                printName: '转图片打印',
				btnLoading:false,
				isFullscreen: false,
            }
        },
        methods: {
            init() {
                this.previewHtmlUrl = "";
                if(this.url && this.url.trim().length>0){
                    this.previewHtmlUrl = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + "/" + this.url;
                }
                this.loading = false;
            },
            closeModal(val) {
                this.$emit('input', val);
            },
            //全屏
			changeFull() {
				this.isFullscreen = !this.isFullscreen;
				let height = document.documentElement.clientHeight;
				let element = document.querySelector(".previewOrderTemplate").querySelector(".ivu-modal-body");
				if (this.isFullscreen) {
					element.style.height = (height - 140) + "px";
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
                    this.loading = true;
                    this.init();
                } else {
                    this.closeModal(false)
                }
            }
        }
    }
</script>

<style lang="less">
    .previewFile {
        position: relative;
        width: 100%;
        height: 100%;

        .ivu-modal {
            min-width: 60vw ;
        }

        .ivu-modal-body {
            height: 70vh;
            /*overflow-y: auto;*/
            position: relative;
            background-color: #e8eaec;
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
            height: 89vh;
            overflow: auto;
            overflow-y: hidden;
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
