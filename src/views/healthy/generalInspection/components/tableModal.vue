<style lang="less">
    .tableModal {
        .ivu-modal {
            width: 800px !important;
        }
    }
</style>
<template>
    <Modal v-model="show" :title="modalTitle" :mask-closable="false" :draggable="false" class="tableModal" >
        <Table :loading="loading"
               height="385" border
               :columns="noInsProjectColumn"
               sortable="custom"
               :data="tableData"
               ref="table"
               style="margin-top: 10px;">
        </Table>
        <div slot="footer">
            <Button type="default" @click="show=false">取消</Button>
        </div>
    </Modal>
</template>
<script>
    import {queryNoCheckTOrderGroupItemProjectList} from "@/api/healthy/tOrderGroupItemProject";
	import {queryAbandonTOrderGroupItemProjectList} from "../../../../api/healthy/tOrderGroupItemProject";

	export default {
        name: "tableModal",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            modalTitle: {
                type: String
            },

            personInfo: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                itemId: "",
                pId: "",
                show: this.value,//是否显示
                tableData:[],
                loading: false,
                //未检项目查询参数
				noCheckProParam: {
					personId: '',
					groupOrderId: '',
					groupId: '',
				},
				noInsProjectColumn: [
					{
						title: '科室',
						align: 'center',
						minWidth: 70,
						ellipsis: true,
						tooltip: true,
						key: 'officeName',
						sortable: false,
					},
					{
						title: '项目',
						align: 'center',
						minWidth: 70,
						ellipsis: true,
						tooltip: true,
						key: 'name',
						sortable: false
					}
				],
            }
        },
        methods: {
            render(item) {
                return item.label;
            },
            //获取人员未检查项目
			getNoCheckProject() {
				this.loading = true;
				this.tableData = [];
				queryNoCheckTOrderGroupItemProjectList(this.noCheckProParam).then(res => {
					if (res.success) {
						this.tableData = res.data;
						this.modalTitle = "未检项目" + "(" + this.tableData.length + "项)";
					}
				}).finally(() => {
					this.loading = false;
				})
			},
			//获取人员弃检项目
			getAbandonCheckProject() {
				this.loading = true;
				this.tableData = [];
				queryAbandonTOrderGroupItemProjectList(this.noCheckProParam).then(res => {
					if (res.success) {
						this.tableData = res.data;
						this.modalTitle = "弃检项目" + "(" + this.tableData.length + "项)";
					}
				}).finally(() => {
					this.loading = false;
				})
			},
            //关闭弹框
            closeModal(val) {
                this.$emit('input', val);
            },
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                if (!val) {
                    this.closeModal(val);
                }else{
					this.noCheckProParam.personId = this.personInfo.id;
					if(this.personInfo.id && this.personInfo.id.trim().length>0){
						this.noCheckProParam.groupOrderId = this.personInfo.orderId||this.personInfo.order_id;
						this.noCheckProParam.groupId = this.personInfo.groupId||this.personInfo.group_id;
						if(this.modalTitle.indexOf("未检")>-1){
							this.getNoCheckProject();
						}
						else {
							this.getAbandonCheckProject();
						}
                    }
                }
            }
        }
    }
</script>
