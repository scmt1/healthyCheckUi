<style lang="less">
    .tCombo {
        height: 100%;
        padding: 10px 10px 15px;
        box-sizing: border-box;

        .card {
            position: relative;
            height: calc(100vh - 80px);
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


    }
</style>
<template>
    <div class="tCombo">
        <Row :gutter="4">
            <Col span="5">
                <Card class="card">
                    <Alert class="alert">套餐列表</Alert>
                    <Row>
                        <RadioGroup v-model="searchForm.type" @on-change="getDataList('sel')" style="margin-top: 10px;margin-left: 5px;">
                            <Radio label="职业体检">职</Radio>
                            <Radio label="健康体检">健</Radio>
                            <Radio label="从业体检">从</Radio>
                            <Radio label="放射体检">放</Radio>
                        </RadioGroup>
                    </Row>

                    <Row style="margin-top: 10px;margin-bottom:10px;">
                        <Input suffix="ios-search" placeholder="请输入关键字" v-model="searchForm.name" class="search-input"
                               @keydown.native.enter="inputSearchChange"
                               clearable/>
                    </Row>

                    <Row style="justify-content: center;height: calc(100% - 120px);">
                        <!--左侧套餐列-->
                        <RadioGroup class="radio-group" v-model="isRadioChecked" v-if="comboData.length">
                            <Row :gutter="10" class="row-border" v-for="(item,index) in comboData" :key="index"
                                 @click.native="radioChooseClick(item)">
                                <Col :span="3" class="radio-group-radio">
                                    <Radio :label="item.id"></Radio>
                                </Col>
                                <Col :span="17" class="radio-group-content">
                                    {{ item.name }}
                                </Col>
                                <Col :span="4" style="padding-left: 0;">
                                    <div class="border-blue" v-if="item.type.indexOf('职业') != -1">
                                        职
                                    </div>
                                    <div class="border-green" v-if="item.type.indexOf('健康') != -1">
                                        健
                                    </div>
                                    <div class="border-yellow" v-if="item.type.indexOf('从业') != -1">
                                        从
                                    </div>
                                    <div class="border-pink" v-if="item.type.indexOf('放射') != -1">
                                        放
                                    </div>
                                </Col>
                            </Row>
                        </RadioGroup>
                        <div class="empty" v-else>暂无数据</div>
                        <Spin fix v-if="comboLoading">
                            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                            <div>加载中...</div>
                        </Spin>
                        <Page v-if="comboData.length > 0" :current="searchForm.pageNumber" :total="comboTotal" simple
                              @on-change="personChangePageNum"/>
                    </Row>
                </Card>
            </Col>
            <Col span="19">
                <Card style="height: calc(100vh - 80px);overflow-y: auto;">
                    <!--功能区-->
                    <Row style="margin-bottom: 15px;">
                        <Button type="info" @click.native="comboAddClick">
                            <Icon type="md-add-circle"/>
                            新增套餐
                        </Button>
                        <Button type="error" @click.native="handleDelClick">
                            <Icon type="ios-close-circle"/>
                            删除
                        </Button>
                        <Button type="info" @click.native="addItemClick">
                            <Icon type="md-add-circle"/>
                            添加项目
                        </Button>
                        <Button type="primary" @click="handleSubmit" :loading="submitLoading">
                            <Icon type="md-link"/>
                            提交
                        </Button>
                    </Row>

                    <choose-portfolio-project v-model="isDrawerShow" v-on:handleSearch="setTableData"
                                              :checkedList="itemSelectedData"></choose-portfolio-project>

                    <!--表单-->
                    <Form ref="tComboForm" :label-width="100" :rules="tComboFormRule" :model="tComboForm">
                        <Row>
                            <Col span="8">
                                <FormItem label="套餐类别" prop="type">
                                    <Select v-model="tComboForm.type" :disabled="disabled">
                                        <Option v-for="(item,index) in typeArr" :key="index" :value="item.title">
                                            {{ item.title }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8" v-if="tComboForm.type == '职业体检' || tComboForm.type == '放射体检'">
                                <FormItem label="危害因素" prop="hazardFactors">
                                    <!--<TreeSelect :data="hazardFactorsArr" v-model="tComboForm.hazardFactors"-->
                                    <!--            ref="hazardFactors" transfer-->
                                    <!--            @on-change="hazardFactorsChange"/>-->

                                    <Input placeholder="请输入"
                                           readonly
                                           @on-focus="handleHarmSelect"
                                           :disabled="disabled"
                                           v-model="tComboForm.hazardFactorsText"></Input>

                                </FormItem>
                            </Col>
                            <Col span="8" v-if="tComboForm.type == '职业体检' || tComboForm.type == '放射体检' ">
                                <FormItem label="在岗状态" prop="careerStage">
                                    <Select v-model="tComboForm.careerStage" :disabled="disabled"
                                            @on-select="onCareerStageSelect">
                                        <Option v-for="(item,index) in careerStageArr" :key="index" :value="item.title">
                                            {{ item.title }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="适合性别" prop="fitSex">
                                    <Select :disabled="disabled" v-model="tComboForm.fitSex">
                                        <Option value="男">男</Option>
                                        <Option value="女">女</Option>
                                        <Option value="全部">全部</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="套餐名称" prop="name">
                                    <Input placeholder="请输入"
                                           :disabled="disabled"
                                           v-model="tComboForm.name"/>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="简拼" prop="simpleSpell">
                                    <Input placeholder="请输入"
                                           :disabled="disabled"
                                           v-model="tComboForm.simpleSpell"
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row v-if="tComboForm.type =='职业体检' || tComboForm.type == '放射体检'">
                            <Col span="12">
                                <FormItem label="职业病" prop="occupationalDiseases">
                                    <Button style="position: absolute; right: -4px;bottom: 1px; z-index: 10;"
                                            type="primary"
                                            @click="handleWordChoose('disease')">选
                                    </Button>
                                    <Input placeholder="多条数据请以分号（“；”）结尾， 如中度贫血；多发性周围神经病；"
                                           v-model="tComboForm.occupationalDiseases" type="textarea"
                                           :rows="5" readonly/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="职业禁忌症" prop="occupationalTaboo">
                                    <Button style="position: absolute; right: -4px;bottom: 1px; z-index: 10;"
                                            type="primary"
                                            @click="handleWordChoose('contraindications')">选
                                    </Button>
                                    <Input placeholder="多条数据请以分号（“；”）结尾， 如中度贫血；多发性周围神经病；"
                                           v-model="tComboForm.occupationalTaboo" type="textarea"
                                           :rows="5" readonly/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <!--列表-->
                    <Table :loading="loading"
                           :max-height="tableMaxHeight"
                           border
                           :columns="columns"
                           sortable="custom"
                           show-summary
                           :summary-method="handleSummary"
                           :data="data">
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="error" size="small" icon="md-trash" @click="itemDelClick(row,index)">删除
                            </Button>
                        </template>
                    </Table>
                    <!--分页-->
                    <Page size="small" show-total :total="data.length"
                          style="margin-top: 15px;display: flex;justify-content: flex-end;"></Page>
                </Card>
            </Col>
        </Row>
        <!--术语选择-->
        <termDrawer v-model="wordChooseShow" :modalTitle="title" :checkedList="wordChooseList"
                    @getSelectedWords="getSelectedWords"
                    :type="type"></termDrawer>

        <!--危害因素-->
        <harmDrawer v-model="harmShow" :modalTitle="title" :selectedHarmList="selectedHarmList" @harmReback="harmReback"
                    :selectType="seltType"></harmDrawer>
    </div>
</template>
<script>
    import util from "../../../libs/util";
    import {deleteTCombo, queryTComboList, addTCombo, updateTCombo, getTCombo, getTcomboByName} from '@/api/healthy/tCombo'
    import {getComboItemByComboId} from "@/api/healthy/tComboItem.js"
    import termDrawer from "./termDrawer"

    const uniqBy = require("lodash.uniqby");
    const remove = require("lodash.remove");
    const differenceBy = require("lodash.differenceby");
    import * as groupPersonApi from '@/api/healthy/tGroupPerson'
    import {getAllSectionOffice} from "@/api/healthy/tSectionOffice"
    import ChoosePortfolioProject from "../tGroupOrder/choosePortfolioProject";
    import harmDrawer from "./harmDrawer";

    export default {
        components: {
            ChoosePortfolioProject,
            termDrawer,
            harmDrawer
        },
        data() {
            return {
                noMoreShow: false,
                seltType: "",
                selectedHarmList: [],
                harmShow: false,
                isRepeat: false,
                submitLoading: false,
                itemLoading: false,
                itemData: [],
                officeData: [],
                itemTotal: 0,
                itemSelectedData: [],
                itemSearchForm: {
                    pageNumber: 1, // 当前页数
                    pageSize: 10, // 页面大小
                    name: '',
                    shortName: '',
                    query: '',
                    officeId: ''
                },
                comboLoading: false,
                isDrawerShow: false,//抽屉
                disabled: false,
                loading: false,
                columns: this.getDataColumns(),
                data: [],
                comboData: [],
                searchForm: {
                    pageNumber: 1, // 当前页数
                    pageSize: 10, // 页面大小
                    name: '',
                    type:"",
                },
                tComboFormRule: this.getTComboFormRule(),
                tComboForm: {
                    name: '',
                    url: '',
                    type: '',
                    simpleSpell: '',
                    fitSex: '',
                    orderNum: 0,
                    remark: '',
                    comboItemList: [],
                    careerStage: "",
                    hazardFactors: "",
                    hazardFactorsText: "",
                    occupationalDiseases: "",
                    occupationalDiseasesCode: "",
                    occupationalTaboo: "",
                    occupationalTabooCode: "",
                },
                total: 0,
                isRadioChecked: "",
                typeArr: [],
                serviceTypeArr: [],
                careerStageArr: [],
                hazardFactorsArr: [],
                showOther: true,
                wordChooseShow: false,
                wordChooseList: [],
                type: "",
                title: "",
                occupationalDiseasesArr: [],
                occupationalTabooArr: [],
                comboTotal: 0,
                tableMaxHeight: 500
            }
        },
        methods: {
            handleHarmSelect() {
                this.harmShow = true;
                this.title = "危害因素选择";
                this.seltType = "radio";
                if (this.tComboForm.hazardFactors) {
                    this.selectedHarmList = [{typeCode: this.tComboForm.hazardFactors, typeName: this.tComboForm.hazardFactorsText}];
                } else {
                    this.selectedHarmList = [];
                }
            },
            harmReback(e) {
                if (e) {
                    this.tComboForm.hazardFactors = e[0].typeCode;
                    this.tComboForm.hazardFactorsText = e[0].typeName;
                }
                this.hazardFactorsChange();
            },
            handleWordChoose(type) {
                this.wordChooseShow = true;
                this.title = "常用术语";
                this.type = type;
                if (type == 'disease') {
                    this.wordChooseList = this.occupationalDiseasesArr;
                } else if (type == 'contraindications') {
                    this.wordChooseList = this.occupationalTabooArr;
                }
            },
            //获取专业术语回调
            getSelectedWords(word, cType) {
                if (cType == "disease") {
                    this.occupationalDiseasesArr = JSON.parse(JSON.stringify(word));
                    this.tComboForm.occupationalDiseases = "";
                    this.tComboForm.occupationalDiseasesCode = "";
                    for (let i = 0; i < word.length; i++) {
                        this.tComboForm.occupationalDiseases += ";\n" + word[i].title;
                        this.tComboForm.occupationalDiseasesCode += ";" + word[i].value
                    }
                    this.tComboForm.occupationalDiseases = this.tComboForm.occupationalDiseases.substring(2);
                    this.tComboForm.occupationalDiseasesCode = this.tComboForm.occupationalDiseasesCode.substring(1);
                } else {
                    this.occupationalTabooArr = JSON.parse(JSON.stringify(word));
                    this.tComboForm.occupationalTaboo = "";
                    this.tComboForm.occupationalTabooCode = "";
                    for (let i = 0; i < word.length; i++) {
                        this.tComboForm.occupationalTaboo += ";\n" + word[i].title;
                        this.tComboForm.occupationalTabooCode += ";" + word[i].value;
                    }
                    this.tComboForm.occupationalTaboo = this.tComboForm.occupationalTaboo.substring(2);
                    this.tComboForm.occupationalTabooCode = this.tComboForm.occupationalTabooCode.substring(1);
                }
            },
            //radio切换
            radioChooseClick(item) {
                this.isRadioChecked = item.id;
            },
            //滚动加载更多
            handleReachBottom() {
                this.searchForm.pageNumber = parseInt(this.searchForm.pageNumber) + 1;
                this.getDataList();
            },
            //套餐查询
            inputSearchChange(e) {
                this.searchForm.pageNumber = 1;
                this.comboAddClick();
                this.getDataList();
            },
            //添加套餐
            comboAddClick() {
                this.initForm();
                this.isRadioChecked = '';
                this.data = [];
                this.itemSelectedData = [];
                this.tComboForm.orderNum = this.total + 1;
            },
            // 删除套餐
            handleDelClick() {
                if (this.isRadioChecked === '') {
                    this.$Message.error("请先选择左侧套餐");
                    return;
                }
                let combo = this.comboData.filter(i => i.id == this.isRadioChecked)[0];
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '您确认要删除"' + combo.name + '"?',
                    loading: true,
                    onOk: () => {
                        deleteTCombo({ids: [combo.id]}).then(res => {
                            if (res.success) {
                                this.$Message.success("删除成功");
                                this.getOneTComboData(this.isRadioChecked);
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
            // 添加套餐项目
            addItemClick() {
                this.isDrawerShow = true;
                this.itemSelectedData = JSON.parse(JSON.stringify(this.data))
            },
            setTableData(e) {
                e.forEach(item => {
                    item.portfolioProjectId = item.id;
                    //销售价
                    let salePrice = item.salePrice;
                    salePrice = Number(salePrice);
                    if (salePrice == NaN) {
                        salePrice = 0;
                    }
                    //折扣价
                    item.discountPrice = (salePrice * 100 / 100).toFixed(2);
                })
                this.data = JSON.parse(JSON.stringify(e));
            },
            //递归
            recursion(data) {
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        data[i]._showChildren = true;
                        for (let j = 0; j < this.itemSelectedData.length; j++) {
                            if (data[i].id == this.itemSelectedData[j].portfolioProjectId) {
                                data[i]._checked = true;
                            }
                            if (data[i].children && data[i].children.length > 0) {
                                this.recursion(data[i].children);
                            }
                        }
                    }
                }
            },
            //删除选中套餐项目
            itemDelClick(row, index) {
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '您确认要删除"' + row.name + '"项目?',
                    loading: true,
                    onOk: () => {
                        //删除当前列表
                        this.data.splice(index, 1);
                        this.$Modal.remove();
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            numAdd: function (arg1, arg2, type) {
                var r1, r2, m, c;
                try {
                    r1 = arg1.toString().split(".")[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split(".")[1].length;
                } catch (e) {
                    r2 = 0;
                }
                c = Math.abs(r1 - r2);
                m = Math.pow(10, Math.max(r1, r2));
                if (c > 0) {
                    var cm = Math.pow(10, c);
                    if (r1 > r2) {
                        arg1 = Number(arg1.toString().replace(".", ""));
                        arg2 = Number(arg2.toString().replace(".", "")) * cm;
                    } else {
                        arg1 = Number(arg1.toString().replace(".", "")) * cm;
                        arg2 = Number(arg2.toString().replace(".", ""));
                    }
                } else {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
                if (type == 1) {
                    return (arg1 + arg2) / m;
                } else {
                    return (arg1 - arg2) / m;
                }
            },
            // 计算
            handleSummary({columns, data}) {
                const sums = {};
                columns.forEach((column, index) => {
                    const key = column.key;
                    if (index === 0) {
                        sums[key] = {
                            key,
                            value: '总计'
                        };
                        return;
                    }
                    const values = data.map(item => Number(item[key]));
                    if (!values.every(value => isNaN(value))) {
                        const v = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return this.numAdd(prev, curr, 1);
                            } else {
                                return prev;
                            }
                        }, 0);
                        if (key == "discount" || key == undefined || key == "introduce" || key == "serviceType" || key == "address") {
                            sums[key] = {
                                key,
                                value: '-'
                            };
                        } else {
                            sums[key] = {
                                key,
                                value: v + ' 元'
                            };
                        }
                    } else {
                        sums[key] = {
                            key,
                            value: '-'
                        };
                    }
                });
                return sums;
            },
            //提交套餐
            handleSubmit() {
                if (this.isRepeat) {
                    this.$Message.info("套餐名称重复，提交失败");
                    return;
                }
                this.submitLoading = true;
                this.$refs['tComboForm'].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        if (this.data.length > 0) {
                            this.tComboForm.comboItemList = this.data;
                        }
                        let form = JSON.stringify(this.tComboForm);
                        if (this.tComboForm.id != null && this.tComboForm.id.trim().length > 0) {
                            updateTCombo({form: form}).then(res => {
                                if (res.success) {
                                    this.handleSearch();
                                    this.$Message.success('保存成功');
                                }
                            }).finally(() => {
                                this.submitLoading = false;
                            })
                        } else {
                            addTCombo({form: form}).then(res => {
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
            //获取comboData
            getDataList(type) {
                if(type == 'sel') {
                    this.searchForm.pageNumber = 1;
                }
                this.comboLoading = true;
                queryTComboList(this.searchForm).then(res => {
                    if (res.success) {
                        this.comboData = res.data.records;
                        this.comboTotal = res.data.total;
                        if (this.comboData.length > 0) {
                            this.isRadioChecked = this.comboData[0].id;
                        }
                    }
                }).finally(() => {
                    this.comboLoading = false;
                })
            },
            //初始化comboform
            initForm() {
                this.tComboForm = {
                    name: '',
                    url: '',
                    type: '',
                    simpleSpell: '',
                    fitSex: '',
                    orderNum: 0,
                    remark: '',
                    comboItemList: [],
                    careerStage: "",
                    hazardFactors: "",
                    hazardFactorsText: "",
                    occupationalDiseases: "",
                    occupationalTaboo: "",
                };
            },
            //套餐规则验证
            getTComboFormRule() {
                return {
                    name: [
                        {required: true, message: '套餐名称不能为空！', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '套餐类别不能为空！', trigger: 'blur', pattern: /.+/},
                    ],
                    simpleSpell: [
                        {required: true, message: '简拼不能为空！', trigger: 'blur'},
                    ],
                    careerStage: [
                        {required: true, message: '在岗状态不能为空！', trigger: 'blur'},
                    ],
                    hazardFactors: [
                        {required: true, message: '危害因素不能为空！', trigger: 'blur'},
                    ],
                    fitSex: [
                        {required: true, message: '适合性别不能为空！', trigger: 'blur', pattern: /.+/},
                    ],
                    // occupationalDiseases: [
                    //     {required: true, message: '职业病不能为空！', trigger: 'blur', pattern: /.+/},
                    // ],
                    // occupationalTaboo: [
                    //     {required: true, message: '职业禁忌症不能为空！', trigger: 'blur', pattern: /.+/},
                    // ],
                    orderNum: [
                        {required: true, message: '排序不能为空！', trigger: 'blur', type: "number"}
                    ],
                }
            },
            //套餐项目字段
            getDataColumns() {
                return [
                    {
                        type: 'index',
                        key: "index",
                        width: 80,
                        align: 'center'
                    }, {
                        title: '名称',
                        align: 'left',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 180,
                        key: 'name'
                    }, {
                        title: '简拼',
                        align: 'center',
                        minWidth: 80,
                        key: 'shortName'
                    }, {
                        title: '销售价(元)',
                        align: 'center',
                        minWidth: 120,
                        key: 'salePrice'
                    }, {
                        title: '折扣(%)',
                        align: 'center',
                        minWidth: 100,
                        key: 'discount',
                        render: (h, params) => {
                            let discount = params.row.discount ? params.row.discount : 100;
                            this.data[params.index].discount = discount;
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        placeholder: '请输入',
                                        value: discount,
                                        step: 1,
                                        min: 0,
                                        max: 100,
                                    },
                                    on: {
                                        input: (val) => {
                                            //折扣
                                            let v = Number(val);
                                            if (v == NaN) {
                                                v = 0;
                                            }
                                            this.data[params.index].discount = v;

                                            //销售价
                                            let salePrice = this.data[params.index].salePrice;
                                            salePrice = Number(salePrice);
                                            if (salePrice == NaN) {
                                                salePrice = 0;
                                            }
                                            //折扣价
                                            this.data[params.index].discountPrice = (salePrice * v / 100).toFixed(2);
                                        }
                                    }
                                })
                            ]);
                        }
                    }, {
                        title: '折扣价(元)',
                        align: 'center',
                        minWidth: 100,
                        key: 'discountPrice',
                        render: (h, params) => {
                            return h('div', [
                                h('Input', {
                                    props: {
                                        placeholder: '请输入',
                                        value: params.row.discountPrice ? parseFloat(params.row.discountPrice).toFixed(2) : '',
                                        readonly: true
                                    },
                                    on: {
                                        input: (val) => {
                                            this.data[params.index].discountPrice = val;
                                        }
                                    }
                                })
                            ]);
                        }
                    }, {
                        title: '检查地址',
                        align: 'left',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 180,
                        key: 'address'
                    }, {
                        title: '操作',
                        align: 'center',
                        slot: "action",
                        minWidth: 100
                    }
                ]
            },
            //根据套餐id 加载套餐项
            getTcomboitemData(id) {
                this.itemSelectedData = [];
                this.loading = true;
                //加载套餐项
                getComboItemByComboId({comboId: id}).then(res => {
                    if (res.success) {
                        this.data = res.data;
                        this.data.forEach(item => {
                            return item.id = item.portfolioProjectId;
                        })
                    } else {
                        this.data = [];
                        this.$Message.error("加载失败");
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            hazardFactorsChange(e) {
                this.tComboForm.name = this.tComboForm.hazardFactorsText + '-' + this.tComboForm.careerStage;
                this.comboNameChange()
            },
            comboNameChange() {
                if (this.tComboForm.name) {
                    let strs = this.tComboForm.name.split("-");
                    if (strs[0] && strs[1]) {
                        getTcomboByName({name: this.tComboForm.name, id: this.tComboForm.id}).then(res => {
                            if (res.success) {//
                                if (res.data) {
                                    this.isRepeat = true;
                                    this.$Message.error("套餐名称重复，请重新选择");
                                } else {
                                    this.isRepeat = false;
                                }
                            } else {
                                this.isRepeat = false;
                            }
                        })
                    }
                }
            },
            onCareerStageSelect(e) {
                this.tComboForm.name = this.tComboForm.hazardFactorsText + '-' + e.value;
                this.comboNameChange();
            },
            //获取类型库树
            async getProTypeByTypeCode(typeCode) {
                let data = await groupPersonApi.getTypeCodeByTProType({typeCode: typeCode}).then(res => res.data);
                if (data) {
                    this.recursionType(data);
                }
                return data;
            },
            //递归
            recursionType(proTypes) {
                proTypes.forEach(item => {
                    item.value = item.typeCode;
                    item.title = item.typeName;
                    item.selected = false;
                    item.checked = false;
                    if (item.children && item.children.length > 0) {
                        item.disabled = true;
                        this.recursionType(item.children)
                    }
                })
            },
            getOneTComboData(val) {
                this.occupationalDiseasesArr = [];
                this.occupationalTabooArr = [];
                //加载套餐
                getTCombo({id: val}).then(res => {
                    this.tComboForm = res.data;
                    if (res.data.occupationalDiseasesCode) {
                        let codes = res.data.occupationalDiseasesCode.split(";");
                        let titles = res.data.occupationalDiseases.split(";");
                        for (let i = 0; i < codes.length; i++) {
                            this.occupationalDiseasesArr.push({
                                title: titles[i],
                                value: codes[i]
                            })
                        }
                    }
                    if (res.data.occupationalTabooCode) {
                        let codes = res.data.occupationalTabooCode.split(";");
                        let titles = res.data.occupationalTaboo.split(";");
                        for (let i = 0; i < codes.length; i++) {
                            this.occupationalTabooArr.push({
                                title: titles[i],
                                value: codes[i]
                            })
                        }
                    }
                })
            },
            personChangePageNum(v) {
                this.searchForm.pageNumber = v;
                this.getDataList();
            }
        },
        watch: {
            //监听radio取体检管理id
            isRadioChecked(val) {
                if (val) {
                    this.getOneTComboData(val);
                    this.getTcomboitemData(val)
                }
            }
        },
        async mounted() {
            this.getDataList();
            this.typeArr = await util.getDictionaryData("checkType");
            this.serviceTypeArr = await util.getDictionaryData("serviceType");
            this.careerStageArr = await util.getDictionaryData("workState");
            this.hazardFactorsArr = await this.getProTypeByTypeCode("TYPE_001");
            this.officeData = await getAllSectionOffice().then(res => res.data);
            // 计算高度
            let height = document.documentElement.clientHeight;
            this.tableMaxHeight = height - 480;
            window.onresize = () => {
                // 计算高度
                let height = document.documentElement.clientHeight;
                this.tableMaxHeight = height - 480;
            };
        }
    }
</script>
