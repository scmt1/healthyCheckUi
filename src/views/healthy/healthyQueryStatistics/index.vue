<template>
    <div class="queryStatistics">
        <Row style="flex-wrap: nowrap;height:100%;">
            <Col :span="outLeftSpan" v-if="outExpand">
                <Card class="card">
                    <Alert class="ivu-alert">团检订单</Alert>
                    <Input suffix="ios-search" clearable placeholder="请输入关键字" class="search-input"
                           @input="inputSearchChange"/>
                    <Checkbox style="margin: 10px 0;"
                              :indeterminate="indeterminate"
                              :value="checkAll"
                              @click.prevent.native="handleCheckAll">全选
                    </Checkbox>

                    <!--左侧套餐列-->
                    <Row v-if="groupOrderData.length>0" style="overflow-y:auto;overflow-x: hidden;">
                        <CheckboxGroup class="radio-group" v-model="radioValue" @on-change="unitChange">
                            <Row class="row-border" v-for="(item,index) in groupOrderData" :key="index">
                                <Col :span="3" class="radio-group-radio">
                                    <Checkbox class="label" :label="item.id"></Checkbox>
                                </Col>
                                <Col :span="21" class="radio-group-content">
                                    <Row style="margin-bottom: 6px;">
                                        <Col :span="20" class="date">{{ item.orderCode }}</Col>
                                    </Row>
                                    <Row>
                                        <Col span="24" :title="item.groupUnitName"
                                             style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                            {{item.groupUnitName}}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </CheckboxGroup>

                        <Row style="display: flex;justify-content: center;width:100%;margin-top: 10px;">
                            <Page style="display: flex;" :current="unitParam.pageNumber" :total="totals" simple @on-change="changePageNum"/>
                        </Row>
                    </Row>

                    <!--暂无数据-->
                    <no-data v-else></no-data>

                    <Spin fix v-if="unitLoading"></Spin>
                </Card>
            </Col>

            <div class="expand">
                <Icon :type="outExpandIcon" size="16" class="icon" @click="outChangeExpand"/>
            </div>

            <Col :span="outSpan">
                <Card v-if="groupOrderData.length>0" ref="colHeight" style="height:100%;">
                    <Row :gutter="10">
                        <Col span="24">
                            <Form ref="queryForm" :label-width="80" inline>
                                <FormItem label="体检编号">
                                    <Input v-model="queryFrom.testNum" placeholder="请输入体检编号" clearable></Input>
                                </FormItem>
                                <FormItem label="姓名">
                                    <Input v-model="queryFrom.personName" placeholder="请输入姓名" clearable></Input>
                                </FormItem>
                                <FormItem label="身份证号">
                                    <Input v-model="queryFrom.idCard" placeholder="请输入身份证号" clearable></Input>
                                </FormItem>
                                <FormItem label="状态" v-if="drop">
                                    <Select v-model="queryFrom.isPass" transfer style="width: 185px;">
                                        <Option value="89">全部</Option>
                                        <Option value="88">已总检</Option>
                                        <Option value="87">待总检</Option>
                                        <Option value="2">在体检</Option>
                                        <Option value="1">未登记</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="性别" v-if="drop">
                                    <Select v-model="queryFrom.sex" transfer clearable style="width: 185px;">
                                        <Option value="男">男</Option>
                                        <Option value="女">女</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="体检日期" v-if="drop">
                                    <DatePicker v-model="selectDate" @on-change="registDateChange"
                                                transfer :clearable="false" placeholder="请选择"
                                                style="width: 185px;"
                                                type="daterange"></DatePicker>
                                </FormItem>
                                <FormItem style="margin-left:-35px" class="br">
                                    <Button type="primary" @click="getNoCheckProjectPerson">查询</Button>
                                    <Button type="primary" @click="handleReset">重置</Button>
                                    <a class="drop-down" @click="dropDown">
                                        {{dropDownContent}}
                                        <Icon :type="dropDownIcon"></Icon>
                                    </a>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2">
                            <span class="txt">体检完成率：</span>
                        </Col>
                        <Col span="15">
                            <Progress :percent="physicalFinishRate" :stroke-width="20" text-inside/>
                        </Col>
                    </Row>
                    <Row style="margin: 10px 0 20px 0;">
                        <Col span="2">
                            <span class="txt">评价完成率：</span>
                        </Col>
                        <Col span="15">
                            <Progress :percent="evaluateFinishRate" :stroke-width="20" text-inside/>
                        </Col>
                    </Row>
                    <Row justify="end">
                        <Table :loading="tableLoading" border :columns="columns" sortable="custom" :data="tableData" ref="table"
                               style="width: 100%;" :max-height="height">
                        </Table>
                        <Row type="flex" justify="end" class="page">
                            <Page
                                    :current="queryFrom.pageNumber"
                                    :total="total"
                                    :page-size="queryFrom.pageSize"
                                    @on-change="changePage"
                                    @on-page-size-change="changePageSize"
                                    :page-size-opts="[10, 20, 50]"
                                    size="small"
                                    show-total
                                    show-elevator
                                    show-sizer
                                    transfer
                            ></Page>
                        </Row>
                    </Row>
                </Card>
                <Card v-else>
                    <no-data width="150" height="150"></no-data>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import {queryTGroupOrderList} from "@/api/healthy/tGroupOrder"
    import {
        queryNoCheckProjectPersonList,
        getPersonListNum,
        queryStatisticPersonList
    } from "../../../api/healthy/tGroupPerson"
    import {formartDate} from "../../../api/tools/tool";
    import noData from "@/components/no-data"

    export default {
        name: "queryStatistics",
        components: {noData},
        data() {
            return {
                h: 0,
                height: 400,
                totals: 0,
                indeterminate: true,
                checkAll: false,
                outLeftSpan: 4,
                outSpan: 20,
                outExpandIcon: "ios-arrow-back",
                outExpand: true,
                selectDate: null,
                radioValue: [],//是否选中
                unitAll: [],
                groupOrderData: [],//单位列表
                unitParam: {
                    groupUnitName: "",
                    pageNumber: 1,
                    pageSize: 10,
                    payStatus: 1,
                    physicalType: '',
                },
                queryFrom: {
                    testNum: "",
                    orderIdList: [],
                    personName: "",
                    sex: "",
                    idCard: "",
                    isPass: "89",
                    startDate: '',//开始时间
                    endDate: '',//结束时间
                    pageNumber: 1,
                    pageSize: 10,
                    physicalType: "",
                },
                total: 0,
                unitLoading: false,
                tableLoading: false,
                tableData: [],
                columns: [
                    {
                        title: '体检编号',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'testNum',
                        sortable: false
                    },
                    {
                        title: '姓名',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'personName',
                        sortable: false
                    },
                    {
                        title: '性别',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'sex',
                        sortable: false
                    },
                    {
                        title: '年龄',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'age',
                        sortable: false
                    },
                    {
                        title: '身份证号',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'idCard',
                        sortable: false
                    },
                    {
                        title: '体检状态',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'isPass',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.isPass == 1) {
                                return h('span', "未登记");
                            } else if (params.row.isPass == 2) {
                                return h('span', "在体检");
                            } else if (params.row.isPass == 3) {
                                return h('span', "待总检");
                            } else if (params.row.isPass == 4 || params.row.isPass == 5) {
                                return h('span', "已总检");
                            }
                        }
                    },
                    {
                        title: '体检日期',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'registDate',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.registDate) {
                                return h('span', formartDate(params.row.registDate, "yyyy-MM-dd"))
                            } else {
                                return h('span', "-")
                            }
                        }
                    },
                    {
                        title: '未完成项目',
                        align: 'center',
                        minWidth: 180,
                        ellipsis: true,
                        tooltip: true,
                        key: 'noCheckProjectName',
                        sortable: false,
                    }
                ],
                physicalFinishRate: 0,
                evaluateFinishRate: 0,
                drop: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                tableHeight: 200,
            }
        },
        methods: {
            changePageNum(v) {
                this.radioValue = [];
                this.unitParam.pageNumber = v;
                this.getGroupOrderData();
            },
            //展开 收起
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = "展开";
                    this.dropDownIcon = "ios-arrow-down";
                    this.height = this.height + 60;
                } else {
                    this.dropDownContent = "收起";
                    this.dropDownIcon = "ios-arrow-up";
                    this.height = this.height - 60;
                }
                this.drop = !this.drop;
            },
            //单位查询
            inputSearchChange(e) {
                this.radioValue = [];
                this.unitParam.groupUnitName = e;
                this.getGroupOrderData();
            },
            //tab切换
            tabsClick(e) {
                if (e == "name1") {
                    this.getNoCheckProjectPerson();
                } else if (e == "name2") {

                }
            },
            //获取团检订单数据
            getGroupOrderData() {
                this.unitLoading = true;
                this.unitParam.physicalType = this.physicalType;

                queryTGroupOrderList(this.unitParam).then(res => {
                    if (res.success) {
                        this.groupOrderData = res.data.records;
                        this.totals = res.data.total;

                        //初始化选中第一个团检订单
                        if (this.groupOrderData && this.groupOrderData.length > 0) {
                            this.$nextTick(() => {
                                this.radioValue.push(this.groupOrderData[0].id);
                                this.getPersonNum(this.radioValue);
                                this.queryFrom.orderIdList = this.radioValue;
                                this.getNoCheckProjectPerson();
                            })
                        }
                        for (let i = 0; i < this.groupOrderData.length; i++) {
                            this.unitAll.push(this.groupOrderData[i].id)
                        }
                    } else {
                        this.groupOrderData = [];
                    }
                }).finally(() => {
                    this.unitLoading = false;
                })
            },
            //查询人员信息及未检查项目
            getNoCheckProjectPerson() {
                if (this.queryFrom.orderIdList.length > 0) {
                    this.queryFrom.physicalType = this.physicalType;
                    this.tableLoading = true;
                    queryNoCheckProjectPersonList(this.queryFrom).then(res => {
                        if (res.success) {
                            this.tableData = res.data.records;
                            this.total = res.data.total;
                        }
                    }).finally(() => {
                        this.tableLoading = false;
                    })
                } else {
                    this.$Message.info("请选择单位");
                }
            },
            //全选
            handleCheckAll() {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.radioValue = this.unitAll;
                    this.queryFrom.orderIdList = this.radioValue;
                    this.getPersonNum(this.radioValue);
                    this.getNoCheckProjectPerson();
                } else {
                    this.radioValue = [];
                    this.queryFrom.orderIdList = [];
                    this.tableData = [];
                    this.physicalFinishRate = 0;
                    this.evaluateFinishRate = 0;
                }
            },
            //单位选择
            unitChange(data) {
                if (data.length === this.unitAll.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
                this.queryFrom.orderIdList = data;
                if (data.length > 0) {
                    this.getPersonNum(data);
                    this.getNoCheckProjectPerson();
                } else {
                    this.physicalFinishRate = 0;
                    this.evaluateFinishRate = 0;
                    this.tableData = [];
                    this.$Message.info("请选择单位");
                }
            },
            //体检日期改变
            registDateChange(v) {
                if (v) {
                    this.queryFrom.startDate = v[0];
                    this.queryFrom.endDate = v[1];
                }
            },
            //搜索条件重置
            handleReset() {
                this.queryFrom.personName = '';
                this.queryFrom.sex = '';
                this.queryFrom.idCard = '';
                this.queryFrom.testNum = '';
                this.queryFrom.isPass = '89';
                this.queryFrom.pageNumber = 1;
                this.queryFrom.pageSize = 10;
                this.selectDate = null;
                this.queryFrom.startDate = '';
                this.queryFrom.endDate = '';
                // 重新加载数据
                this.getNoCheckProjectPerson();
            },
            //人员检查项目页数改变
            changePage(v) {
                this.queryFrom.pageNumber = v;
                this.getNoCheckProjectPerson();
            },
            //人员检查项目展示条数改变
            changePageSize(v) {
                this.queryFrom.pageSize = v;
                this.getNoCheckProjectPerson();
            },
            outChangeExpand() {
                this.outExpand = !this.outExpand;
                if (this.outExpand) {
                    this.outExpandIcon = "ios-arrow-back";
                    this.outSpan = 20;
                    this.outLeftSpan = 4
                } else {
                    this.outExpandIcon = "ios-arrow-forward";
                    this.outSpan = 23;
                    this.outLeftSpan = 1;
                }
            },
            getPersonNum(orderIdList) {
                if (orderIdList.length > 0) {
                    getPersonListNum({orderIdList: orderIdList, physicalType: this.physicalType}).then(res => {
                        if (res.success && res.data) {
                            if (res.data.physicalFinishNum != 0) {
                                this.physicalFinishRate = parseFloat(res.data.physicalFinishNum / res.data.allNum).toFixed(2) * 100;
                            } else {
                                this.physicalFinishRate = 0;
                            }
                            if (res.data.inspectionFinishNum != 0) {
                                this.evaluateFinishRate = parseFloat(res.data.inspectionFinishNum / res.data.allNum).toFixed(2) * 100;
                            } else {
                                this.evaluateFinishRate = 0;
                            }
                        }
                    })
                } else {
                    this.$Message.info("请选择单位");
                }
            },
            //table 高度设置
            setHeight() {
                let height = window.innerHeight - 280;
                if (height <= 1220) {
                    height = height - 40;
                }
                this.height = height;

                window.onresize = () => {
                    height = window.innerHeight - 340;
                    if (height <= 1220) {
                        height = height - 40;
                    }
                    this.height = height;
                }
            }
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            }
        },
        mounted() {
            this.getGroupOrderData();
            // 计算高度
            this.setHeight();
        }
    }
</script>

<style lang="less">
    @import "../../../styles/tree&table-common.less";

    .queryStatistics {
        padding: 10px;
        box-sizing: border-box;
        height: 100%;


        .ivu-checkbox-wrapper {
            margin-right: 4px;
        }

        .card {
            height: 100%;
            overflow: auto;

            .ivu-alert {
                text-align: center;
                padding: 8px;
                font-weight: bold;
                height: 25px;
                line-height: 25px;
                box-sizing: content-box;
                font-size: 15px;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                margin-bottom: 10px !important;
            }

            .radio-group {
                width: 100%;
                font-size: 13px;
                height: calc(100vh - 300px);
                overflow: auto;

                &::-webkit-scrollbar {
                    width: 0;
                }

                .row-border {
                    padding-top: 5px;
                    padding-bottom: 5px;
                    cursor: pointer;
                    border-bottom: 1px solid #ccc;
                }

                .radio-group-radio {
                    display: flex;
                    justify-content: center;
                    align-items: center;


                    [class^=label] {
                        font-size: 0;
                    }
                }
            }
        }

        .ivu-col-span-1 {
            flex: 0 0 2.16666667% !important;
            max-width: 2.16666667% !important;
        }

        .ivu-col-span-4 {
            flex: 0 0 15% !important;
            max-width: 15% !important;
        }

        .ivu-col-span-23 {
            flex: 0 0 98% !important;
            max-width: 98% !important;
        }

        .txt {
            white-space: nowrap;
            font-weight: 600;
        }
    }
</style>
