<style lang="less">
    .review {
        .ivu-transfer-operation {
            margin: 0 46px;
        }
    }
</style>
<template>
    <Modal v-model="show" :title="editTitle" :mask-closable="false" :draggable="false" class="review" width="900" >
        <Alert>复检项目选择</Alert>
        <Transfer ref="Transfer"
                filterable
                :data="data"
                :target-keys="targetKeys1"
                :list-style="listStyle"
                :titles="titles"
                :render-format="render"></Transfer>
        <Spin fix v-if="loading"></Spin>
        <Row style="margin-top: 20px;">
            <Form ref="form" :model="form" :rules="formRules" :label-width="100">
                <FormItem label="复查原因" prop="reason">
                    <Input v-model="form.reason" type="textarea"  :autosize="{maxRows: 3,minRows: 3}"></Input>
                </FormItem>
            </Form>
        </Row>
        <div slot="footer">
            <Button type="default" @click="show=false">关闭</Button>
            <Button type="primary" :loading="loading" @click="handleSubmit">保存</Button>
        </div>
    </Modal>
</template>
<script>
    import {getTPortfolioProject} from "@/api/healthy/tPortfolioProject";
    import {reCheckBaseProject} from "@/api/healthy/tReviewProject"
    import {queryAllPortfolioProjectList} from "@/api/healthy/tPortfolioProject"
    import {userInfo} from "../../../api";
	import {queryTReviewRecordList} from "../../../api/healthy/tReviewRecord";

    export default {
        name: "review",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            modalTitle: {
                type: String
            },
            groupItemId: {
                type: String,
                default: ""
            },
            personInfo: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                form: {
                    reason: ""
                },
                formRules:{
                    reason: [
                        {required: true, message: '复查原因不能为空！', trigger: 'blur'},
                        {type: 'string', max: 50, message: '数据的最大长度为100！', trigger: 'blur'}
                    ]
                },
                itemId: "",
                pId: "",
                show: this.value,//是否显示
                editTitle: "",//标题
                data: [],
				targetKeys1: [],
                loading: false,
                groupItemInfo: {},
                titles: ["待选项目", "已选项目"],
                listStyle: {
                    width: '370px',
                    height: '400px'
                },
				tableData:[],
				transferShow:false,
            }
        },
        methods: {
            render(item) {
                return item.label;
            },
            //获取组合项目  职业体检项目
            getPortfolioProject() {
                this.loading = true;
                queryAllPortfolioProjectList({}).then(res => {
                    if (res.success) {
                        if (res.data && res.data.length > 0) {
                            res.data.forEach(i => {
								this.data.push({
                                    key: i.id.toString(),
                                    label: i.name,
                                })


                            });
							//this.getRecord();
                        }
                    }
                }).finally(() => {
					this.loading = false;
                })
            },
            //关闭弹框
            closeModal(val) {
                this.$emit('input', val);
            },
            //保存
            handleSubmit() {
                this.$refs['form'].validate((valid) => {
                    if(valid) {
                        if (this.targetKeys1.length == 0) {
                            this.$Message.info("复检项目不能为空！");
                            return;
                        }
                        this.loading = true;
                        this.$Modal.remove();
                        let info = {};
                        info.id = this.personInfo.id;//人员id
                        info.personName = this.personInfo.person_name;//人员姓名
                        info.ids = this.targetKeys1;//复检项目id
                        info.groupId = this.personInfo.group_id;//分组
                        info.orderId = this.personInfo.order_id;//订单id
                        info.address = this.personInfo.address;
                        info.reason = this.form.reason;
                        info.physicalType = this.$store.state.theme.theme.physicalType;
                        reCheckBaseProject(info).then(res => {
                            if (res.success) {
                                this.$Message.success("保存成功");
                                this.form.reason = "";
                                this.closeModal(false);
                                this.$emit("getItemDataByGroupId");
                            } else {
                                this.$Message.error(res.msg);
                            }
                        }).finally(() => {
                            this.loading = false;
                        })
                    }
                });
            },
			//查询复查记录
			getRecord() {
				this.loading = true;
				this.transferShow = false;
				queryTReviewRecordList({personId:this.personInfo.id}).then(res => {
					if (res.success) {
						this.tableData = res.data;
						res.data.forEach(i => {
							if(this.targetKeys1.indexOf(i.portfolioProjectId)==-1){
								this.targetKeys1.push(i.portfolioProjectId)
                            }

						});
						if(this.data){
							this.data = this.data.filter(ii=>this.targetKeys1.indexOf(ii.key)>-1);
						}
					}
				}).finally(() => {
					this.loading = false;
					this.transferShow = true;
				})
			},
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.data = [];
				this.tableData = [];
                this.targetKeys1 = [];
                this.form.reason = "";
                this.editTitle = this.modalTitle;
                this.itemId = this.groupItemId;
                if (!val) {
                    this.closeModal(val);
                }else{
					//获取组合项目  职业体检项目
					this.getPortfolioProject();
                }
            }
        }
    }
</script>
