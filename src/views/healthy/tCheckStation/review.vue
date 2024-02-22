<style lang="less">
    .review {
        .ivu-transfer-operation {
            margin: 0 46px;
        }
    }
</style>
<template>
    <Modal v-model="show" :title="editTitle" :mask-closable="false" :draggable="false" class="review" width="900">
        <Alert>复检项目选择</Alert>
        <Transfer
                filterable
                :data="data"
                :list-style="listStyle"
                :target-keys="targetKeys"
                :titles="titles"
                :render-format="render"
                @on-change="handleChange"></Transfer>
        <Spin fix v-if="loading"></Spin>
        <Row style="margin-top: 20px;">
            <Form ref="form" :model="form" :rules="formRules" :label-width="100">
                <FormItem label="复查原因" prop="reason">
                    <Input v-model="form.reason" type="textarea"  :autosize="{maxRows: 3,minRows: 3}"></Input>
                </FormItem>
                <FormItem label="危害因素" prop="hazardousFactorsCode" v-if="showHazardousFactor">
                    <Select v-model="form.hazardousFactorsCode"  multiple label-width="165px">
                        <Option v-for="(item,i) in hazardousFactorsArr"  :value="item.name">{{item.name}}</Option>
                    </Select>
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
            },
            conclusion: {
                type: String,
                default: ""
            }
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
            showHazardousFactor() {
                return ["健康", "从业"].every(i => !this.physicalType.includes(i))
            }
        },
        data() {
            return {
                hazardousFactorsArr:[],
                form: {
                    reason: "",
                    hazardousFactorsCode:[],
                },
                formRules:{
                    reason: [
                        {required: true, message: '复查原因不能为空！', trigger: 'blur'},
                        {type: 'string', max: 500, message: '数据的最大长度为500！', trigger: 'blur'}
                    ],
                    hazardousFactorsCode:[
                        {required: true,type:'array', message: '危害因素不能为空！', trigger: 'change'},
                    ]
                },
                itemId: "",
                pId: "",
                show: this.value,//是否显示
                editTitle: "",//标题
                data: [],
                targetKeys: [],
                loading: false,
                groupItemInfo: {},
                titles: ["待选项目", "已选项目"],
                listStyle: {
                    width: '370px',
                    height: '400px'
                }
            }
        },
        methods: {
            render(item) {
                return item.label;
            },
            handleChange(newTargetKeys, direction, moveKeys) {
                this.targetKeys = newTargetKeys;
            },
            getPortfolioProject() {
                this.loading = true;
                queryAllPortfolioProjectList({}).then(res => {
                    if (res.success) {
                        if (res.data && res.data.length > 0) {
                            res.data.forEach(i => {
                                this.data.push({
                                    key: i.id,
                                    label: i.name,
                                    description: "",
                                    disable: ""
                                })
                            })
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
                let _this = this;
                this.$refs['form'].validate((valid) => {
                    if(valid) {
                        if (_this.targetKeys.length == 0) {
                            _this.$Message.info("复检项目不能为空！");
                            return;
                        }
                        _this.loading = true;
                        _this.$Modal.remove();
                        let info = {};
                        info.id = _this.personInfo.id;//人员id
                        info.personName = _this.personInfo.personName ?? _this.personInfo.person_name;//人员姓名
                        info.ids = _this.targetKeys;//复检项目id
                        info.groupId = _this.personInfo.groupId ?? _this.personInfo.group_id;//分组
                        info.orderId = _this.personInfo.orderId ?? _this.personInfo.order_id;//订单id
                        info.address = _this.personInfo.address;
                        info.reason = _this.form.reason;
                        info.physicalType = _this.$store.state.theme.theme.physicalType;
                        info.hazardFactorCode = _this.form.hazardousFactorsCode;
                        reCheckBaseProject(info).then(res => {
                            if (res.success) {
                                _this.$Message.success("保存成功");
                                _this.closeModal(false);
                                _this.$emit("getItemDataByGroupId");
                            } else {
                                _this.$Message.error(res.msg);
                            }
                        }).finally(() => {
                            _this.loading = false;
                        })
                    }
                });
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.data = [];
                this.targetKeys = [];
                this.editTitle = this.modalTitle;
                this.form.reason = "";
                this.form.hazardousFactorsCode = [];
                if(this.conclusion){
                    this.form.reason = this.conclusion;
                }

                //获取组合项目  职业体检项目
                this.getPortfolioProject();
                if (!val) {
                    this.closeModal(val);
                }
            },
            'personInfo.hazardFactorsList'(val) {
                let _this = this;
                _this.hazardousFactorsArr = [];
                if (val) {
                    _this.hazardousFactorsArr = val;
                }
            },
        }
    }
</script>
