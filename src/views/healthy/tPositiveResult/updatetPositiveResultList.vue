<style lang="less">
    .tBaseProject {
        .ivu-modal {
            width: 50vw !important;
        }
    }
</style>
<template>
    <Modal v-model="show" :title="editTitle" :mask-closable="false" class="tBaseProject">
        <Form ref="tPositiveResultRuleForm" :model="tPositiveResultRuleForm" :rules="tPositiveResultFormRule" :label-width="100">
            <Row>
                <Col span="12">
                    <FormItem label="判断条件" prop="judgmentCondition">
                        <Select v-bind:disabled="disabled" v-model="tPositiveResultRuleForm.judgmentCondition" placeholder="请选择">
                            <Option value="满足一个">满足一个</Option>
                            <Option value="满足全部">满足全部</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="适合性别" prop="genderAppropriate">

                        <Select v-bind:disabled="disabled" v-model="tPositiveResultRuleForm.genderAppropriate" placeholder="请选择">
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                            <Option value="全部">全部</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Alert>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目名称
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类型
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;规则值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;操作</Alert>
        <Row>
            <Form ref="formDynamic" :model="formDynamic" >
                <Row v-for="(item, index) in formDynamic.items" v-if="item.status === 1" :key="index">
                    <Col span="8">
                        <FormItem>
                            <Select v-model="item.projectName" filterable @on-query-change="queryTBaseProjectList">
                                <Option v-for="(items,i) in tBaseProjectData" :key="index" :value="items.name">{{items.name}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem style="margin-left: 10px;" >
                            <Select v-model="item.type">
                                <Option v-for="(items,i) in ruleTypeData" :key="item.value" :value="items.value">{{items.title}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem style="margin-left: 10px;"
                                  >
                            <Input v-model="item.regularValue" style="width: 210px;" >
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="2" style="margin-left: -10px;">
                        <Button type="error"
                                @click="removeFromRow(item,index)"
                        >删除</Button>
                    </Col>
                </Row>
                <Row>
                    <Button style="margin-left: 400px" @click="addFromRow()"> <Icon type="md-add-circle"/>新增一行</Button>
                </Row>
            </Form>
        </Row>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handelSubmit" v-if="!disabled">提交</Button>
        </div>
    </Modal>
</template>

<script>
    import {addPositiveResultRuleList,updatePositiveResultRuleList,getPositiveResultId,deletePositiveResultRule,queryPositiveResultList} from '@/api/healthy/tPositiveResultList'
    import {getDictDataByType} from "../../../api";
    import {queryTBaseProjectList,getTBaseProject} from '@/api/healthy/tBaseProject'
    export default {
        name: "updatetPositiveResultList",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            tPositiveResultId: {
                type: String
            },
            positiveId:{
                type:String
            },
            modalTitle: {
                type: String
            }
        },
        data() {
            return {
                tBaseProjectData:[],
                tBaseProjectSearchForm: {
                    // 搜索框对应data对象
                    pageNumber: 1, // 当前页数
                    pageSize: 656, // 页面大小
                    startDate: null,//开始时间
                    endDate: null,//结束时间
                    sort: 'code', // 默认排序字段
                    order: 'asc',// 默认排序方式
                    name:'',
                },
                show: this.value,
                editTitle: this.modalTitle,
                loading: true,
                disabled: false,
                columns: this.getDataColumns(),
                tPositiveResultRuleForm: {
                    id:'',
                    genderAppropriate: '',
                    projectName: '',
                    type: '',
                    regularValue: '',
                    positiveId:'',
                    judgmentCondition:'',
                    excludePositive:'',
                    rulData:[],
                },
                tPositiveResultFormRule: this.gettPositiveResultFormRule(),
                formDynamic: {
                    items: [
                        {
                            projectName: '',
                            type: '',
                            regularValue: '',
                            index: 1,
                            status: 1,
                        }
                    ]
                },
                ruleTypeData:[],
                searchForm:{
                    pageNumber:1,
                    pageSize:10,
                    name:'',
                },
            }
        },
        methods: {

            queryTBaseProjectList(){
                queryTBaseProjectList(this.tBaseProjectSearchForm).then(res=>{
                    if (res.success){
                        this.tBaseProjectData = res.data.records;
                    }
                })
            },

            //套餐项目字段
            getDataColumns() {
                return [
                    {
                        title: '项目名称',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 180,
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('Input', {
                                    props: {
                                        placeholder: '请输入',
                                        value: discount,
                                        step: 1,
                                        min: 0,
                                        max: 100,
                                    },
                                    on: {
                                        input: (val) => {
                                        }
                                    }
                                })
                            ]);
                        }
                    }, {
                        title: '类型',
                        align: 'center',
                        minWidth: 80,
                        key: 'shortName'
                    }, {
                        title: '规则值',
                        align: 'center',
                        minWidth: 120,
                        key: 'salePrice'
                    }, {
                        title: '操作',
                        align: 'center',
                        slot: "action",
                        minWidth: 100
                    }
                ]
            },

            gettPositiveResultFormRule(){
                return {
                    judgmentCondition: [
                        {required: true, message: '判断条件不能为空！', trigger: 'blur'}
                    ],
                    genderAppropriate: [
                        {required: true, message: '适合性别不能为空！', trigger: 'blur'}
                    ],
                }
            },


            // 添加一行单元信息
            addFromRow() {
                const index = this.formDynamic.items.length + 1
                this.formDynamic.items.push({
                    projectName: '',
                    type: '',
                    regularValue: '',
                    index: 1,
                    status: 1,
                })
            },
            // 删除一行单元信息
            removeFromRow(item,index) {
                this.formDynamic.items[index].status = 0
                this.formDynamic.items = this.formDynamic.items.filter(item => item.status == 1)
                deletePositiveResultRule({ids: item.id}).then((res) => {
                    this.$Modal.remove();
                    if (res.success) {
                        this.$Message.success("删除成功");
                    }
                });
            },
            handelSubmit() {
                this.$refs['tPositiveResultRuleForm'].validate((valid) => {
                    this.loading = true;
                    if (valid) {
                        let _this = this;
                        if (_this.tPositiveResultId != null && _this.tPositiveResultId.trim().length > 0) {
                            _this.tPositiveResultRuleForm.id = _this.tPositiveResultId;
                            _this.tPositiveResultRuleForm.rulData = [];
                            for (let i = 0; i < _this.formDynamic.items.length; i++) {
                                if (_this.formDynamic.items[i].status == 1 && _this.formDynamic.items[i].projectName.toString().trim().length > 0) {
                                    _this.tPositiveResultRuleForm.rulData.push(_this.formDynamic.items[i])
                                }
                            }
                            _this.tPositiveResultRuleForm.projectName = ''
                            for (let i = 0; i <_this.tPositiveResultRuleForm.rulData.length; i++){
                                _this.tPositiveResultRuleForm.projectName += _this.tPositiveResultRuleForm.rulData[i].projectName+','
                              /*  for (let j = 0; j <_this.tBaseProjectData.length; j++){
                                    if (_this.tPositiveResultRuleForm.rulData[i].projectName == _this.tBaseProjectData[j].id){
                                        _this.tPositiveResultRuleForm.projectName += _this.tBaseProjectData[j].name+','
                                    }
                                }*/
                            }
                            _this.tPositiveResultRuleForm.projectName = _this.tPositiveResultRuleForm.projectName.substr(0,_this.tPositiveResultRuleForm.projectName.length-1)
                            updatePositiveResultRuleList(_this.tPositiveResultRuleForm).then(res => {
                                _this.loading = false;
                                if (res) {
                                    if (res.code == 200) {
                                        _this.closeModal(false);
                                        _this.$emit('handleSearch');
                                        _this.$Message.success('保存成功');
                                    } else {
                                        _this.$Message.error(res.msg);
                                    }
                                } else {
                                    _this.$Message.error('保存失败');
                                }
                            }).catch(err => {
                                _this.loading = false;
                            });
                        } else {
                            this.tPositiveResultRuleForm.positiveId = this.positiveId;
                            _this.tPositiveResultRuleForm.rulData = [];
                            for (let i = 0; i < _this.formDynamic.items.length; i++) {
                                if (_this.formDynamic.items[i].status == 1 && _this.formDynamic.items[i].projectName.toString().trim().length > 0) {
                                    _this.tPositiveResultRuleForm.rulData.push(_this.formDynamic.items[i])
                                }
                            }
                            for (let i = 0; i <_this.tPositiveResultRuleForm.rulData.length; i++){
                                _this.tPositiveResultRuleForm.projectName += _this.tPositiveResultRuleForm.rulData[i].projectName+','
                             /*   for (let j = 0; j <_this.tBaseProjectData.length; j++){
                                    if (_this.tPositiveResultRuleForm.rulData[i].projectName == _this.tBaseProjectData[j].id){
                                        _this.tPositiveResultRuleForm.projectName += _this.tBaseProjectData[j].name+','
                                    }
                                }*/
                            }
                            _this.tPositiveResultRuleForm.projectName = _this.tPositiveResultRuleForm.projectName.substr(0,_this.tPositiveResultRuleForm.projectName.length-1)
                            addPositiveResultRuleList(_this.tPositiveResultRuleForm).then(res => {
                                this.loading = false;
                                if (res) {
                                    if (res.code == 200) {
                                        this.closeModal(false);
                                        this.$emit('handleSearch');
                                        this.$Message.success('保存成功');
                                    } else {
                                        this.$Message.error(res.msg);
                                    }
                                } else {
                                    this.$Message.error('保存失败');
                                }
                            }).catch(err => {
                                this.loading = false;
                            });
                        }
                    } else {
                        this.loading = false;
                        this.$Message.error('表单验证不通过！');
                    }
                });
            },
            closeModal(val) {
                this.$emit('input', val);
            },
            initForm() {
                this.tPositiveResultRuleForm = {
                    id:'',
                    genderAppropriate: '',
                    projectName: '',
                    type: '',
                    regularValue: '',
                    positiveId:'',
                    judgmentCondition:'',
                    excludePositive:'',
                    rulData:[],
                };
                this.formDynamic = {
                    items: [
                        {
                            projectName: '',
                            type: '',
                            regularValue: '',
                            index: 1,
                            status: 1,
                        }
                    ]
                };
                this.tBaseProjectSearchForm = {
                    // 搜索框对应data对象
                    pageNumber: 1, // 当前页数
                        pageSize: 656, // 页面大小
                        startDate: null,//开始时间
                        endDate: null,//结束时间
                        sort: 'code', // 默认排序字段
                        order: 'asc',// 默认排序方式
                        name:'',
                };
                this.searchForm = {
                    pageNumber:1,
                        pageSize:10,
                        name:'',
                };
            },
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                //阳性状态
                this.initForm();
                this.loading = false;
                this.editTitle = this.modalTitle;
                if (val) {
                    this.$refs['tPositiveResultRuleForm'].resetFields();
                    if (this.tPositiveResultId != null && this.tPositiveResultId.trim().length > 0) {
                        getPositiveResultId({id: this.tPositiveResultId}).then(res => {
                            if (res) {
                                if (res.code == 200) {
                                    this.tPositiveResultRuleForm = res.data;
                                    if (res.data.rulData && res.data.rulData.length > 0) {
                                        this.formDynamic.items = res.data.rulData
                                        for (let i = 0; i < this.formDynamic.items.length; i++) {
                                            this.formDynamic.items[i].name = this.formDynamic.items[i].projectName.toString();
                                            if(this.formDynamic.items[i].type){
                                                this.formDynamic.items[i].type = this.formDynamic.items[i].type.toString();
                                            }
                                            if(this.formDynamic.items[i].regularValue){
                                                this.formDynamic.items[i].regularValue = this.formDynamic.items[i].regularValue.toString();
                                            }
                                            this.formDynamic.items[i].status = 1
                                            this.formDynamic.items[i].index = i + 1
                                        }
                                    }
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
                    }
                    getDictDataByType("ruleType").then(res => {
                        if (res.success) {
                            this.ruleTypeData = res.data;
                        }
                    });
                    queryTBaseProjectList(this.tBaseProjectSearchForm).then(res=>{
                        if (res.success){
                            this.tBaseProjectData = res.data.records;
                        }
                    })
                } else {
                    this.closeModal(val);
                }
            }
        }
    }
</script>

