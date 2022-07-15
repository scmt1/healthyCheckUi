<template>

    <Modal v-model="show" title="审核个人报告" class="auditingReport" :mask-closable="false">
        <div slot="header" style="position: relative; margin-right: 30px;display: flex;justify-content: space-between;cursor: pointer;">
            <p>模板预览</p>
            <Icon type="md-expand" size="24" color="#ccc"></Icon>
        </div>
        <templateShow ref="templateShow" style="height: 100%;" v-if="isTemplateShow" :personIds="personIds" :isBatchPrint="isBatchPrint"
                      v-on:closeLoading="closeLoading"></templateShow>
        <!-- loading -->
        <Spin fix v-show="loading">
            <div class="demo-spin-icon-load">
                <i class="iconfont icon-loader--line"></i>
            </div>
            <div style='font-size:16px'>Loading...</div>
        </Spin>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="btnLoading" @click="handelSubmit">审核</Button>
        </div>
    </Modal>
</template>

<script>
    import templateShow from "../reportReview/templateShow";
	import {updateTGroupPersonById} from "@/api/healthy/tGroupPerson";
    export default {
        name: "auditingReport",
        components: {
			templateShow
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            personId: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                show: this.value,
				loading:false,
                btnLoading:false,
				isTemplateShow:false,
				personIds:[],
                isBatchPrint: false,//是否批量打印
            }
        },
        methods: {
            init() {
                this.loading = true;
                this.isTemplateShow = true;
                this.personIds = [];
				this.personIds.push(this.personId)
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
				})
			},
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
        },
        watch: {
            value(val) {
                this.show = val;
				this.isTemplateShow = false;
            },
            show(val) {
                if (val) {
                	if(this.personId && this.personId.trim().length>0){
						this.init();
                    }
                    else{
                    	this.$Message.error("参数错误，请联系管理员！！")
                    }
                } else {
                    this.closeModal(false)
                }
            }
        }
    }
</script>

<style lang="less">
    .auditingReport {
        .ivu-modal {
            width: 80vw !important;
        }

        .ivu-modal-body {
            position: relative;
            height: 70vh;
            /*overflow-y: auto;*/
            background-color: #e8eaec;
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
