<template>
    <Modal v-model="show" :title="editTitle" :mask-closable="false" :draggable="false" class="orderFlowModal"
           width="750">
        <Alert class="ivu-alert-left">
            审批流程
        </Alert>
        <Row >
            <Steps :current="(current-1)">
                <Step title="提交审核"></Step>
                <Step title="主检医生审核"></Step>
                <Step title="体检中心主任审核"></Step>
                <Step title="技术负责人审核"></Step>
                <Step title="完成"></Step>
            </Steps>
        </Row>
        <Alert class="ivu-alert-left">
            审批节点
        </Alert>
        <Timeline class="rightTimeLine">
            <TimelineItem
                    :color="item.auditState ==  1 ? 'green' : item.auditState ==  4 ? 'red': '#808695' "
                    v-for="(item,index) in flowData"
                    :key="item.id">
                <Row>
                    <!--                                        <Col span="24" style="padding: 0 3px 3px 0" v-if="index == 0">提交人:{{-->
                    <!--                                            item.createUserName }}-->
                    <!--                                        </Col>-->
                    <!--                                        <Col span="24" style="padding: 3px 3px 3px 0" v-if="index == 0">提交时间：{{-->
                    <!--                                            item.createTime }}-->
                    <!--                                        </Col>-->
                    <Col span="24" style="padding: 3px 3px 3px 0">审批人：{{ item.auditUserName }}</Col>
                    <!--                                        <Col span="24" style="padding: 3px 3px 3px 0" v-if="index == 0">抄送人：{{-->
                    <!--                                            item.showUserName }}-->
                    <!--                                        </Col>-->
                    <Col span="24" style="padding: 3px 3px 3px 0">审核时间：{{ item.auditTime }}</Col>
                    <Col span="24" style="padding: 3px 3px 3px 0;background: #ccc;color: #0000FF">
                        意见：{{ item.auditContent }}
                    </Col>
                </Row>
            </TimelineItem>
        </Timeline>
        <div slot="footer">
            <Button :loading="loading" type="primary" @click="show=false">关闭</Button>
        </div>
    </Modal>
</template>
<script>
import {base_Url} from '@/libs/axios'
import {getStore} from '@/libs/storage';
import {queryAllTOrderFlowList} from "../../../api/healthy/tOrderFlow";
import util from "../../../libs/util";

export default {
    name: "OrderFlow",
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
		current: {
			type: Number,
            default:0
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
            show: this.value,//是否显示
            editTitle: this.modalTitle,//标题
            loading: true,
            data: {},
			flowData: [],
        }
    },
    methods: {
        //获取流程信息
		getFlowData() {
			this.flowData = [];
			queryAllTOrderFlowList({groupOrderId: this.orderId}).then(res => {
				if (res.success && res.data && res.data.data) {
					this.flowData = res.data.data;
				} else {
					this.$Message.error(res.msg)
				}
			});
		},
        closeModal(val) {
            this.$emit('input', val);
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
            if (!val) {
                this.closeModal(val);
            }
            else{
				this.getFlowData()
            }
        }
    },
    created() {
        this.height = Math.floor(document.body.scrollHeight * 0.95) + "px";
        this.width = Math.floor(document.body.scrollWidth * 0.95) + "px";
    },
}
</script>
<style lang="less">
    .orderFlowModal{
        .ivu-alert-left{
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .ivu-modal-body{
            max-height: 80vh;
            overflow-y: auto;
        }

    }
</style>
