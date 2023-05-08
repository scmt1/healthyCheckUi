<style lang="less">
    .tPositiveResult {
        height: 100%;
        padding: 10px 10px 15px;
        box-sizing: border-box;

        .ivu-row {
            height: 100%;
            overflow: auto;
            .ivu-col {
                height: 100%;
            }
        }
        .ivu-row::-webkit-scrollbar {
            width: 4px;

        }
        .ivu-scroll-wrapper {
            width: 100%;
            margin: 0;
            position: relative;
            outline: 0;
            height: 100%;
        }
        .ivu-scroll-wrapper::-webkit-scrollbar{
            display: none;
        }
        .yourCssName{
            ivu-scroll-wrapper: none;
            -ms-overflow-style: none;
            overflow-x: hidden;
            overflow-y: auto;
        }


        .ivu-row::-webkit-scrollbar-track {
            background-color: #e4e4e4;
            border-radius: 100px;
        }

        .ivu-row::-webkit-scrollbar-thumb {
            background-color: #2684e780;
            border-radius: 100px;
        }
        .card {
            position: relative;
            height: calc(100% - 50px);
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            overflow: hidden;

            .radio-group {
                overflow: auto;
                width: 100%;
                height: 90%;
                padding-bottom: 30px;

                &::-webkit-scrollbar {
                    width: 0;
                }

                .row-border {
                    padding-top: 15px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #d0d0d0;

                    .radio-group-radio {
                        padding-left: 10px !important;

                        .ivu-radio-group-item {
                            font-size: 0 !important;
                        }
                    }

                    .radio-group-content {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }

                .radio-group-radio {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .ivu-radio-wrapper {
                        margin-right: 5px;
                        font-size: 0 !important;
                    }

                    .ivu-radio-group-item {
                        font-size: 0 !important;
                    }
                }
            }
        }

        .empty {
            position: absolute;
            top: 150px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            color: #515a6e;
            margin-top: 20px;
        }

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

        .demo-spin-col {
            height: 100px;
            position: relative;
            border: 1px solid #eee;
        }

        .demo-upload-list-cover {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 200px;
            line-height: 200px;
            background: rgba(0, 0, 0, .6);
            text-align: center;

            &:hover {
                display: block;
                background: rgba(0, 0, 0, .6);
            }
        }

        .demo-upload-list-cover i {
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
        }

        .pic {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;

            .pic-box {
                display: flex;
                justify-content: center;
                padding: 2px;
                box-sizing: border-box;
                align-items: center;
                width: 80px;
                height: 90px;
                line-height: 80px;
                margin-right: 10px;
                border: 1px dashed #2988f3;
                cursor: pointer;
                flex-direction: column;
                position: relative;

                &:hover {
                    .demo-upload-list-cover {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }

            .re-upload {
                width: 100%;
                flex: 1;
                color: #2e58d6;
                font-size: 13px;

                span {
                    cursor: pointer;
                }
            }

            .pic-text {
                font-size: 13px;
                color: #cbcfd6;
            }
        }

        .drawer-footer {
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            border-top: 1px solid #e8e8e8;
            padding: 10px 16px;
            text-align: right;
            background: #fff;
        }

        .wrapper {
            height: calc(100vh - 51px - 73px);
            overflow-y: auto;
            overflow-x: hidden;
            padding-bottom: 10px;
        }

        .border-blue {
            border: 1px solid #0000FF;
            border-radius: 8px;
            text-align: center;
            color: #0000FF;
        }

        .border-green {
            border: 1px solid green;
            border-radius: 8px;
            text-align: center;
            color: green;
        }

        .border-yellow {
            border: 1px solid #ebb02d;
            border-radius: 8px;
            text-align: center;
            color: #ebb02d;
        }

        .border-pink {
            border: 1px solid magenta;
            border-radius: 8px;
            text-align: center;
            color: magenta;
        }

        .ivu-card-body {
            height: 100%;
        }
        .ivu-scroll-container {
            overflow-y: hidden;
        }

    }
</style>

<template>
    <div class="tPositiveResult">
        <Row :gutter="4">
            <Col span="5">
                <Card class="card">
                    <Alert class="alert">阳性结果列表</Alert>
                    <Row style="margin-top: 10px;margin-bottom:10px;">
                        <Input suffix="ios-search" placeholder="请输入关键字" v-model="searchForm.name" class="search-input"
                               @input="inputSearchChange"
                               clearable/>
                        <!--左侧套餐列-->
                        <Scroll :on-reach-bottom="handleScroll" height="calc(100% - 20px)"
                                style="justify-content: center; overflow-y:auto">
                            <RadioGroup class="radio-group" v-model="isRadioChecked" v-if="positiveResultData.length">
                                <Row :gutter="10" class="row-border" v-for="(item,index) in positiveResultData"
                                     :key="index"
                                     @click.native="radioChooseClick(item)">
                                    <Col :span="3" class="radio-group-radio">
                                        <Radio :label="item.id"></Radio>
                                    </Col>
                                    <Col :span="17" class="radio-group-content">
                                        {{ item.name }}
                                    </Col>
                                </Row>
                            </RadioGroup>

                            <div class="empty" v-else>暂无数据</div>
                            <Spin fix v-if="comboLoading">
                                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                <div>加载中...</div>
                            </Spin>
                            <!--   <Page v-if="positiveResultData.length > 0" :current="searchForm.pageNumber" :total="positiveResultTotal" simple
                                     @on-change="personChangePageNum"/>-->
                        </Scroll>
                    </Row>
                </Card>
            </Col>
            <Col span="10">
                <Card class="card">
                    <Alert>阳性结果</Alert>
                    <Form style="padding-left: 20px" ref="tPositiveResultForm" :label-width="100"
                          :rules="tPositiveResultFormRule" :model="tPositiveResultForm">
                        <Row>
                            <Col span="20">
                                <FormItem label="名称" prop="name">
                                    <Input v-model="tPositiveResultForm.name" :disabled="disabled"
                                           placeholder="请输入名称">
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="20">
                                <FormItem label="简拼">
                                    <Input placeholder="请输入简拼"
                                           :disabled="disabled"
                                           v-model="tPositiveResultForm.namePinyin"
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="20">
                                <FormItem label="是否重度" prop="degree">
                                    <Select v-model="tPositiveResultForm.degree" :disabled="disabled" transfer>
                                        <Option v-for="(item,i) in positiveData" :value="item.value">{{item.title}}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="20">
                                <FormItem label="是否阳性" prop="positive">
                                    <Select :disabled="disabled" v-model="tPositiveResultForm.positive" transfer>
                                        <Option v-for="(item,i) in positiveData" :value="item.value">{{item.title}}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="20">
                                <FormItem label="科室">
                                    <Select :disabled="disabled" v-model="tPositiveResultForm.deptId" transfer>
                                        <Option v-for="(item,i) in officeData" :value="item.id">{{item.sectionName}}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="20">
                                <FormItem label="职业建议" prop="advise">
                                    <Input placeholder="请输入职业建议"
                                           type="textarea"
                                           :rows="4"
                                           :disabled="disabled"
                                           v-model="tPositiveResultForm.advise"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="20">
                                <FormItem label="健康建议" prop="healthAdvice">
                                    <Input placeholder="请输入健康建议"
                                           type="textarea"
                                           :rows="4"
                                           :disabled="disabled"
                                           v-model="tPositiveResultForm.healthAdvice"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Row style="margin-bottom: 15px; margin-left: 200px">
                        <Button type="info" @click="tPosittveAddClick">
                            <Icon type="md-add-circle"/>
                            新增
                        </Button>
                        <Button type="primary" @click="handleSubmit" :loading="submitLoading">
                            <Icon type="md-link"/>
                            保存
                        </Button>
                        <Button type="error" @click="handleDelClick">
                            <Icon type="ios-close-circle"/>
                            删除
                        </Button>
                    </Row>
                </Card>
            </Col>
            <Col span="9">
                <Card class="card">
                    <Alert>阳性结果规则&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button @click="addtPosittveRule"
                                                                                      type="info">
                            <Icon type="md-add-circle"/>
                            新增
                        </Button>
                    </Alert>
                    <Row>
                        <Table :loading="loading"
                               border
                               :columns="columns"
                               sortable="custom"
                               :data="positiveResultRuleData">
                            <template slot-scope="{ row, index }" slot="action">
                                <a @click="handleEdit(row)">编辑
                                </a>
                                <Divider type="vertical"></Divider>
                                <a @click="handleDelRuleClick(row)">删除
                                </a>
                            </template>
                        </Table>
                    </Row>
                </Card>
                <updatetPositiveResultList v-model="updateShow" :tPositiveResultId="tPositiveResultId"
                                           :modalTitle="title" :positiveId="positiveId"
                                           v-on:handleSearch="getDataList"></updatetPositiveResultList>
            </Col>
        </Row>
    </div>
</template>
<script>
    import util from "../../../libs/util";
    import {
        deletePositiveResultList,
        queryPositiveResultList,
        addPositiveResultList,
        updatePositiveResultList,
        getPositiveResult,
        getPositiveResultRuleId,
        deletePositiveResultRuleList,
        getPositiveResultId
    } from '@/api/healthy/tPositiveResultList'

    const uniqBy = require("lodash.uniqby");
    const remove = require("lodash.remove");
    const differenceBy = require("lodash.differenceby");
    import {getAllSectionOffice} from "@/api/healthy/tSectionOffice"
    import ChoosePortfolioProject from "../tGroupOrder/choosePortfolioProject";
    import {getDictDataByType} from "../../../api";
    import {queryTSectionOfficeList} from '@/api/healthy/tSectionOffice'
    import {queryAllSectionOfficeData} from "../../../api/healthy/tSectionOffice";
    import updatetPositiveResultList from './updatetPositiveResultList'

    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            },
            tPositiveResulShow: {
                type: Boolean,
                default: false
            },
            PositiveResultId:{
                type: String,
                default: '00DE59CCC6B147A1A16E1BEE01F717F0'
            }
        },
        name: "tPositiveResultList",
        components: {
            ChoosePortfolioProject,
            updatetPositiveResultList
        },
        data() {
            return {
                show: this.value,
                searchForm: {
                    pageNumber: 1,
                    pageSize: 20,
                    name: '',
                },
                offset: 0,
                loading: false,
                noMore: false,
                positiveData: [],
                disabled: false,
                tPositiveResultForm: {
                    id: '',
                    name: '',
                    positive: '',
                    status: '',
                    advise: '',
                    namePinyin: '',
                    healthAdvice: '',
                    degree: '',
                    deptId: '',
                },
                isRadioChecked: '',
                positiveResultData: [],
                positiveResultRuleData: [],
                officeData: [],
                comboLoading: false,
                positiveResultTotal: 0,
                tPositiveResultFormRule: this.gettPositiveResultFormRule(),
                columns: this.getDataColumns(),
                submitLoading: false,
                LOCK_STATUS: false,
                updateShow: false,
                tPositiveResultId: '',
                title: '',
                positiveId: '',
            }
        },
        methods: {

            //套餐项目字段
            getDataColumns() {
                return [
                    {
                        title: '规则',
                        align: 'center',
                        minWidth: 180,
                        key: 'projectName'
                    }, {
                        title: '条件',
                        align: 'center',
                        minWidth: 80,
                        key: 'judgmentCondition'
                    }, {
                        title: '适合性别',
                        align: 'center',
                        minWidth: 120,
                        key: 'genderAppropriate'
                    }, {
                        title: '操作',
                        align: 'center',
                        slot: "action",
                        minWidth: 100
                    }
                ]
            },


            handleScroll() {
                return new Promise(resolve => {
                        setTimeout(() => {
                            this.searchForm.pageSize = this.searchForm.pageSize + 10
                            this.getDataList()
                            resolve();
                        }, 100)
                    },
                )
            },
            tPosittveAddClick() {
                this.initForm();
                this.isRadioChecked = '';
            },

            //新增
            addtPosittveRule() {
                this.positiveId = this.isRadioChecked;
                this.title = '操作阳性结果规则';
                this.updateShow = true
                this.tPositiveResultId = '';
            },
            //编辑
            handleEdit(row, index) {
                this.title = '操作阳性结果规则';
                this.tPositiveResultId = row.id.toString();
                this.updateShow = true;
            },

            //初始化tPositiveResultForm
            initForm() {
                this.tPositiveResultForm = {
                    id: '',
                    name: '',
                    positive: '',
                    status: '',
                    advise: '',
                    namePinyin: '',
                    healthAdvice: '',
                    degree: '',
                    deptId: '',
                };
                this.searchForm = {
                    pageNumber: 1,
                    pageSize: 20,
                    name: '',
                };
            },
            personChangePageNum(v) {
                this.searchForm.pageNumber = v;
                this.getDataList();
            },

            //根据id获取数据
            getPositiveResultId(val) {
                getPositiveResult({id: val}).then(res => {
                    this.tPositiveResultForm = res.data;
                })
            },
            //获取阳性结果
            getDataList() {
                this.comboLoading = true;
                queryPositiveResultList(this.searchForm).then(res => {
                    if (res.success) {
                        this.positiveResultData = res.data.records;
                        this.positiveResultTotal = res.data.total;
                        if (this.positiveResultData.length > 0) {
                            this.isRadioChecked = this.positiveResultData[0].id;
                            this.getPositiveResultRuleId(this.isRadioChecked);
                        }
                    }
                }).finally(() => {
                    this.comboLoading = false;
                })
            },
            //获取阳性结果规则
            getPositiveResultRuleId(val) {
                this.comboLoading = true;
                getPositiveResultRuleId({positiveId: val}).then(res => {
                    if (res.success) {
                        this.positiveResultRuleData = res.data;
                    }
                }).finally(() => {
                    this.comboLoading = false;
                })
            },
            //套餐查询
            inputSearchChange(e) {
                this.searchForm.pageNumber = 1;
                this.getDataList();
            },
            radioChooseClick(item) {
                this.isRadioChecked = item.id;
                this.tPositiveResultForm.id = item.id;
                this.getPositiveResultRuleId(this.isRadioChecked);
            },
            gettPositiveResultFormRule() {
                return {
                    name: [
                        {required: true, message: '名称不能为空！', trigger: 'blur'}
                    ],
                    degree: [
                        {required: true, message: '是否重度不能为空！', trigger: 'blur'}
                    ],
                    positive: [
                        {required: true, message: '是否阳性不能为空！', trigger: 'blur'}
                    ],
                    advise: [
                        {required: true, message: '职业建议不能为空！', trigger: 'blur'}
                    ],
                    healthAdvice: [
                        {required: true, message: '健康建议不能为空！', trigger: 'blur'}
                    ],
                }
            },

            // 删除阳性结果规则
            handleDelRuleClick(v) {
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要删除阳性规则 " + v.projectName + " ?",
                    loading: true,
                    onOk: () => {
                        deletePositiveResultRuleList({ids: v.id}).then((res) => {
                            this.$Modal.remove();
                            if (res.success) {
                                this.$Message.success("删除成功");
                                this.getDataList();
                            }
                        });
                    },
                });
            },


            // 删除套餐
            handleDelClick() {
                let combo = this.positiveResultData.filter(i => i.id == this.isRadioChecked)[0];
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '您确认要删除"' + combo.name + '"?',
                    loading: true,
                    onOk: () => {
                        deletePositiveResultList({ids: [combo.id]}).then(res => {
                            if (res.success) {
                                this.$Message.success("删除成功");
                                this.handleSearch();
                            } else {
                                this.$Message.error("删除失败");
                            }
                        }).catch(err => {
                            this.$Message.error("删除失败");
                        }).finally(() => {
                            this.$Modal.remove();
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },

            //提交阳性结果
            handleSubmit() {
                this.submitLoading = true;
                this.$refs['tPositiveResultForm'].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        if (this.tPositiveResultForm.id != null && this.tPositiveResultForm.id.trim().length > 0) {
                            updatePositiveResultList(this.tPositiveResultForm).then(res => {
                                if (res.success) {
                                    this.handleSearch();
                                    this.$Message.success('保存成功');
                                }
                            }).finally(() => {
                                this.submitLoading = false;
                            })
                        } else {
                            addPositiveResultList(this.tPositiveResultForm).then(res => {
                                if (res.success) {
                                    this.handleSearch();
                                    this.$Message.success('保存成功');
                                }
                            }).finally(() => {
                                this.submitLoading = false;
                            })
                        }
                    } else {
                        this.submitLoading = false;
                        this.$Message.error('表单验证不通过！');
                    }
                });
            },
            //重置查询
            handleSearch() {
                this.searchForm.pageNumber = 1;
                this.isRadioChecked = "";
                this.getDataList();
            },
        },


        mounted() {
            //阳性状态
            getDictDataByType("positive").then(res => {
                if (res.success) {
                    this.positiveData = res.data;
                }
            });
            queryAllSectionOfficeData({}).then(res => {
                if (res && res.success) {
                    this.officeData = res.data;
                }
            })
            this.getDataList();
        },
        watch: {
            //监听radio取体检管理id
            isRadioChecked(val) {
                if (val) {
                    this.getPositiveResultId(val)
                }
            },
            tPositiveResulShow(val) {
                if (val) {
                    this.initForm()
                    this.getPositiveResultId(this.PositiveResultId)
                }
            }
        },
    }
</script>
