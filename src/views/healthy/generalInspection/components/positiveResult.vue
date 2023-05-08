<template>
    <div class="positiveResultModal">
        <Modal title="异常结果汇总"  v-model="show" :mask-closable="false" footer-hide :width="1300" style="height:80%">
            <Row :gutter="20">
                <Col span="19">
                    <Form ref="positive" :model="positive" :label-width="95">
                        <Row>
                            <Col :span="6">
                                <FormItem label="体检科室">
                                    <Select v-model="positive.officeId" clearable>
                                        <Option v-for="item in departmentData" :value="item.id" :key="item.id">{{
                                            item.sectionName }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="7">
                                <FormItem label="体检日期">
                                    <DatePicker v-model="selectDate" type="daterange" @on-change="selectDateRange"
                                                placeholder="请选择体检日期"
                                                style="width: 100%;"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col :span="6">
                                <FormItem label="结果状态">
                                    <Select v-model="resultStatus" @on-change="resultStatusChange">
                                        <Option value="0">不正常</Option>
                                        <Option value="1">正常</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col span="5">
                    <Row>
                        <Col>
                            <Button type="primary" @click="getSummaryPersonList">查询</Button>
                        </Col>
                        <Col>
                            <Button type="primary" @click="handleReset">重置</Button>
                        </Col>
                        <Col>
                            <Button type="success" @click="exportClick">导出Excel</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Table :loading="summaryLoading" border max-height="600" :columns="summaryColumn" sortable="custom"
                   :data="summaryData"
                   ref="summaryTable">
            </Table>
            <Row type="flex" justify="end" class="page">
                <Page
                        :current="positive.pageNumber"
                        :total="summarytotal"
                        :page-size="positive.pageSize"
                        @on-change="summaryChangePage"
                        @on-page-size-change="summaryChangePageSize"
                        :page-size-opts="[10,20,50,100]"
                        size="small"
                        show-total
                        show-elevator
                        show-sizer
                        transfer
                ></Page>
            </Row>
        </Modal>
    </div>

</template>

<script>
    import {
        querySummaryResultList,
        querySummaryResultListReview,
        updateTDepartItemResult
    } from "../../../../api/healthy/tDepartItemResult";
    import {formartDate} from "../../../../api/tools/tool";
    import {queryAllSectionOfficeData} from "../../../../api/healthy/tSectionOffice";

    export default {
        name: "positiveResult",
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
                isNumber:true,
                summaryColumn: [
                    {
                        title: '姓名',
                        align: 'center',
                        minWidth: 60,
                        ellipsis: true,
                        tooltip: true,
                        key: 'personName',
                        sortable: false
                    },
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
                        title: '体检科室',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'officeName',
                        sortable: false
                    },
                    {
                        title: '体检项目',
                        align: 'center',
                        minWidth: 150,
                        ellipsis: true,
                        tooltip: true,
                        key: 'orderGroupItemProjectName',
                        sortable: false
                    },
                    {
                        title: '结果',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'result',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.result) {
                                if ((params.row.crisisDegree && (params.row.crisisDegree == "-" || params.row.crisisDegree == "正常")) || (params.row.positive && params.row.positive == "0")) {
                                    return h("span", params.row.result);
                                } else {
                                    return h("span", {
                                        style: {
                                            color: "red",
                                        }
                                    }, params.row.result);
                                }
                            } else {
                                return h("span", "-");
                            }
                        }
                    },
                    {
                        title: '单位',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'unitName',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.unitName) {
                                return h("span", params.row.unitName);
                            } else {
                                return h("span", "-");
                            }
                        }
                    },
                    {
                        title: '参考范围',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'scope',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.scope) {
                                return h("span", params.row.scope);
                            } else {
                                return h("span", "-");
                            }
                        }
                    },
                    {
                        title: '提示',
                        align: 'center',
                        minWidth: 60,
                        ellipsis: true,
                        tooltip: true,
                        key: 'arrow',
                        sortable: false
                    },
                    {
                        title: '危急程度',
                        align: 'center',
                        minWidth: 90,
                        ellipsis: true,
                        tooltip: true,
                        key: 'crisisDegree',
                        sortable: false
                    },
                    {
                        title: '体检日期',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'checkDate',
                        sortable: false,
                        render: (h, params) => {
                            return h('span', formartDate(params.row.checkDate, "yyyy-MM-dd"))
                        }
                    },
                ],
                summarytotal: 0,
                summaryData: [],//阳性结果数据
                resultStatus: "0",
                selectDate: null,
                departmentData: [], //科室
                show: this.value,
                summaryLoading: false,
                positive: {
                    personName: '',
                    officeId: '',
                    checkDoc: '',
                    arrow: '-',
                    ignoreStatus: 1,
                    pageNumber: 1,
                    pageSize: 10,
                    startDate: null,
                    endDate: null,
                    personId: null,
                },//初审条件
            }

        },
        methods: {
            init(){
                this.positive = {
                    personName: '',
                        officeId: '',
                        checkDoc: '',
                        arrow: '-',
                        ignoreStatus: 1,
                        pageNumber: 1,
                        pageSize: 10,
                        startDate: null,
                        endDate: null,
                        personId: null,
                }
                this.resultStatus = "0";
                this.selectDate =null;
            },


            //结果汇总页数改变
            summaryChangePage(v) {
                this.positive.pageNumber = v;
                this.getSummaryPerson();
            },

            //结果汇总展示条数改变
            summaryChangePageSize(v) {
                this.positive.pageSize = v;
                this.getSummaryPerson();
            },


            //阳性结果体检时间改变
            selectDateRange(v) {
                if (v) {
                    this.positive.startDate = v[0];
                    this.positive.endDate = v[1];
                }
            },

            //结果状态改变
            resultStatusChange(v) {
                if (v == 0) {
                    this.positive.arrow = "-";
                } else {
                    this.positive.arrow = "正常";
                }
            },

            //阳性结果搜索条件重置
            handleReset() {
                this.resultStatus = "0";
                this.positive.personName = '';
                this.positive.officeId = '';
                this.positive.checkDoc = '';
                this.positive.arrow = '-';
                this.positive.pageNumber = 1;
                this.positive.pageSize = 10;
                this.selectDate = null;
                this.positive.startDate = null;
                this.positive.endDate = null;
                // 重新加载数据
                this.getSummaryPerson();
            },

            //导出数据
            exportClick() {
                let excolumns = this.summaryColumn.filter(function (v) {
                    return v.title != "操作" && v.type != 'selection'
                });
                //复制data
                let data = JSON.parse(JSON.stringify(this.summaryData));
                data.forEach(item => {
                    item.testNum = '="' + item.testNum + '"';
                    item.checkDate = formartDate(item.checkDate, "yyyy-MM-dd")
                })

                this.isNumber = false;
                this.$refs.summaryTable.exportCsv({
                    filename: '结果汇总',
                    columns: excolumns,
                    data: data
                });
            },

            closeModal(val) {
                this.$emit('input', val);
            },
            //查询按钮
            getSummaryPersonList(){
                this.positive.pageNumber = 1;
                this.positive.pageSize = 10;
                this.getSummaryPerson();
            },
            //获取异常结果列表
            getSummaryPerson() {
                this.summaryLoading = true;
                this.positive.personId = this.personId;
                if (!this.typeStatus) {
                    querySummaryResultList(this.positive).then(res => {
                        if (res.success) {
                            this.summaryData = res.data.records;
                            this.summarytotal = res.data.total;
                        }
                    }).finally(() => {
                        this.summaryLoading = false;
                    })
                } else {
                    querySummaryResultListReview(this.positive).then(res => {
                        if (res.success) {
                            this.summaryData = res.data.records;
                            this.summarytotal = res.data.total;
                        }
                    }).finally(() => {
                        this.summaryLoading = false;
                    })
                }
            },
            //获取科室数据
            getAllSectionOfficeData() {
                queryAllSectionOfficeData({}).then(res => {
                    if (res.success) {
                        this.departmentData = res.data;
                    }
                })
            },

        },
        mounted() {
            this.getAllSectionOfficeData();
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                if (val) {
                    this.init();
                    this.getSummaryPerson();
                } else {
                    this.closeModal(val);
                }
            },
        }
    }

</script>
<style lang="less">
    .positiveResultModal {
        .ivu-modal {
            width: 80% !important;
            .ivu-modal-content {
                height: 100%;
            }
        }
    }
</style>