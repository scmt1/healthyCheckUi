<style lang="less">
.tGroupPerson {
    overflow: hidden;

    .ivu-scroll-wrapper {
        margin: 0 !important;
        width: 100% !important;
    }

    .ivu-table .red td {
        background: rgba(230, 6, 6, .6);
        color: #fff;
    }

    .wrap {
        padding: 0px 10px;
        margin-top: 10px;

        .align {
            text-align: left;
            padding-left: 18px;
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

        .resetBtn {
            position: relative;
            left: -1px;
            font-size: 13px;
            white-space: nowrap;
            border: 1px solid #DCDEE2;
            padding: 0 8px;
            height: 24px;
            line-height: 22px;
            display: inline-block;
            border-radius: 2px;

            &:hover {
                color: #83BBF7;
            }
        }

        .ivu-card-body {
            height: 100%;
        }


        .card {
            position: relative;
            height: calc(100vh - 120px);
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            overflow: hidden;

            .btngroup {
                display: flex;

                .ivu-radio-group-item {
                    padding: 0 6px !important;
                    font-size: 13px !important;
                    user-select: none;
                }
            }

            .radio-group {
                overflow: auto;
                width: 100%;
                height: 90%;
                padding-bottom: 30px;

                &::-webkit-scrollbar {
                    width: 0;
                }

                .row-border {
                    padding-top: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #ccc;
                }

                .radio-group-radio {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .ivu-radio-wrapper {
                        margin-right: 4px;
                    }

                    .ivu-radio-group-item {
                        font-size: 0;
                    }
                }

                .radio-group-content {
                    cursor: pointer;

                    .date {
                        color: #000;
                        font-size: 13px;
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

                    .border-pink {
                        border: 1px solid hotpink;
                        border-radius: 8px;
                        text-align: center;
                        color: hotpink;
                    }

                    .bg-green {
                        background-color: #42C3AF;
                        color: #fff;
                        border-radius: 8px;
                        text-align: center;
                        line-height: 24px;
                    }

                    .bg-audit {
                        background-color: #ff9900;
                        color: #fff;
                        border-radius: 8px;
                        text-align: center;
                        line-height: 24px;
                    }

                    .bg-refute {
                        background-color: #ed4014;
                        color: #fff;
                        border-radius: 8px;
                        text-align: center;
                        line-height: 24px;
                    }

                    .bg-deflate {
                        background-color: #2db7f5;
                        color: #fff;
                        border-radius: 8px;
                        text-align: center;
                        line-height: 24px;
                    }

                    .company {
                        color: #000;
                        font-size: 13px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;

                        .ivu-tooltip {
                            width: 100%;
                        }

                        .ivu-tooltip-rel {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
        }

        .maxHeight {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }

        .empty {
            text-align: center;
            color: #515a6e;
            margin-top: 20px;
        }

        .height-auto {
            position: relative;
            height: auto;
        }

        .form {
            .ivu-form-item-label {
                font-size: 12px;
                font-weight: 800;
            }

            .ivu-form-item-content {
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .ivu-form-item {
                margin-bottom: 0px !important;
            }

            .ivu-tooltip {
                width: 100%;
            }

            .ivu-tooltip-rel {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .unit {
                .ivu-form-item-content {
                    margin-bottom: -12px;
                }
            }
        }
    }
    .expand {
        display: flex;
        align-items: center;
    }
    .ivu-card-body {
        padding: 16px;
        padding-top: 10px;
    }
}
</style>
<template>
    <div class="tGroupPerson">
        <div class="wrap">
            <Row :gutter="4">
                <Col v-if="expand" :style="leftSpan">
                    <Alert class="alert">团检订单</Alert>
                    <Card class="card">
                        <div v-if="queryTime" style="display: flex;flex-wrap: nowrap;align-items: center;margin-bottom:10px;">
                            <RadioGroup type="button" size="small" class="btngroup" button-style="solid" v-model="date"
                                        @on-change="pick">
                                <Radio label="当日"></Radio>
                                <Radio label="当月"></Radio>
                                <DatePicker :open="datePickerShow" transfer type="daterange"
                                            @on-change="datePickerChange">
                                    <div>
                                        <template>
                                            <Radio label="自定义" @click.native="datePickerShow = !datePickerShow"></Radio>
                                        </template>
                                    </div>
                                </DatePicker>
                            </RadioGroup>
                            <span class="resetBtn" style="cursor: pointer;" @click="resetClick">重置</span>
                        </div>
                        <div v-if="!queryTime" style="display: flex;flex-wrap: nowrap;align-items: center;margin-bottom:10px;">
                                <DatePicker  transfer placement="bottom-end" v-model="groupOrderSearchForm.startDate" transfer placeholder="开始时间" type="date" @on-change="datePickerStartTime">
                                </DatePicker>
                            &nbsp;~&nbsp;
                                <DatePicker  transfer type="date" v-model="groupOrderSearchForm.endDate" placeholder="结束时间" @on-change="datePickerEndTime">
                                </DatePicker>
                        </div>

                        <Input suffix="ios-search" v-model="groupOrderSearchForm.groupUnitName" placeholder="请输入关键字"  clearable @input="groupOrderInputChange"/>
                        <div v-if="!queryTime" style="display: flex;flex-wrap: nowrap;align-items: center;margin-top:5px;">
                            <Button size="small" class="resetBtn" style="cursor: pointer;" @click="resetClick">重置</Button>
                        </div>

                        <Row style="justify-content: center;height: calc(100% - 60px);">
                            <RadioGroup class="radio-group" v-model="isRadioChecked" v-if="groupOrderData.length > 0">
                                <Row class="row-border" v-for="(item,index) in groupOrderData" :key="index"
                                     @click.native="radioChooseClick(item,index)">
                                    <Col :span="3" class="radio-group-radio">
                                        <Radio :label="item.id" :disabled="radioShow"></Radio>
                                    </Col>
                                    <Col :span="21" class="radio-group-content">
                                        <Row style="margin-bottom: 6px;align-items: center;">
                                            <Col :span="19" class="date">{{ timeFormat(item.signingTime) }}</Col>
                                            <Col :span="5">
                                                <div class="border-blue" v-if="item.physicalType && item.physicalType.indexOf('职业') != -1">
                                                    职
                                                </div>
                                                <div class="border-green" v-if="item.physicalType && item.physicalType.indexOf('健康') != -1">
                                                    健
                                                </div>
                                                <div class="border-pink" v-if="item.physicalType && item.physicalType.indexOf('放射') != -1">
                                                    放
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col :span="19" class="company">
                                                <Tooltip transfer :content="item.groupUnitName">
                                                    {{ item.groupUnitName }}
                                                </Tooltip>
                                            </Col>
                                            <Col :span="5" class="bg-green" v-if="item.auditState == 4">通</Col>
                                            <Col :span="5" class="bg-audit" v-if="item.auditState == 1||item.auditState == 2||item.auditState == 3">审</Col>
                                            <Col :span="5" class="bg-refute" v-if="item.auditState == 5">驳</Col>
<!--                                            <Col :span="5" class="bg-deflate" v-if="item.auditState == 0">无</Col>-->
                                        </Row>
                                    </Col>
                                </Row>
                            </RadioGroup>
                            <Spin fix v-if="groupOrderLoading">
                                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                <div>加载中...</div>
                            </Spin>
                            <!--暂无数据-->
                            <no-data v-if="groupOrderData.length == 0"></no-data>

                            <!--<div class="empty" v-if="groupOrderData.length < 1">暂无数据</div>-->
                            <Page v-if="groupOrderData.length > 0" :current="groupOrderSearchForm.pageNumber" :total="groupOrderTotal" simple
                                  @on-change="groupOrderChangePageNum"/>
                        </Row>
                    </Card>
                </Col>
                <div class="expand">
                    <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand"/>
                </div>
                <div :style="span">
                    <Col style="width: 60%;min-width: 420px;">
                        <Alert class="alert align">
                            团检人员
                            <Button size="small" type="info" icon="md-cloud-upload"
                                    :disabled="maleLoading" v-if="this.groupOrderData && this.groupOrderData.length > 0"
                                    style="margin-left: 10px;padding-top: 1px"
                                    @click.native="handleUpload">导入
                            </Button>
                            <Button size="small" type="info" icon="md-add-circle" style="padding-top: 1px;"
                                    :disabled="maleLoading" v-if="this.groupOrderData && this.groupOrderData.length > 0"
                                    @click.native="handleAddClick">新增
                            </Button>
                            <Button size="small" type="info" icon="md-arrow-round-down"
                                    :disabled="maleLoading" v-if="this.groupOrderData && this.groupOrderData.length > 0"
                                    style="padding-top: 1px"
                                    @click.native="handleExport">导出
                            </Button>
                            <Button size="small" type="info" icon="md-arrow-round-down"
                                    :disabled="maleLoading" v-if="this.groupOrderData && this.groupOrderData.length > 0"
                                    style="padding-top: 1px"
                                    @click.native="handleSqlExport">导出订单
                            </Button>
                        </Alert>
                        <Card class="maxHeight" style="height: 100%;">
                            <el-tabs type="border-card" @tab-click="tabClick" v-if="groupData.length>0" v-model="groupPersonTabValue">
                                <el-tab-pane v-for="(item,index) in groupData" :key="index" :name="item.id"
                                             :label="item.name">
                                    <Table v-if="groupPersonTabValue == item.id"
                                           :loading="maleLoading"
                                           border
                                           :max-height="height"
                                           :columns="maleColumns"
                                           sortable="custom"
                                           :row-class-name="rowClassName"
                                           :data="groupPersonData">
                                        <template slot-scope="{ row, index }" slot="action">
                                            <Dropdown :transfer=true>
                                                <Button size="small">
                                                    更多操作
                                                    <Icon type="md-arrow-dropdown"/>
                                                </Button>
                                                <DropdownMenu slot="list">
                                                    <DropdownItem name="edit" @click.native="handleEditClick(row, index)">
                                                        <Icon type="ios-create-outline"/>
                                                        修改
                                                    </DropdownItem>
                                                    <DropdownItem name="view" @click.native="handleViewClick(row, index)">
                                                        <Icon type="ios-eye-outline"/>
                                                        查看
                                                    </DropdownItem>
                                                    <DropdownItem name="delete" @click.native="handleDelClick(row, index)">
                                                        <Icon type="md-trash"></Icon>
                                                        删除
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </template>
                                    </Table>
                                    <Row type="flex" justify="end" class="page">
                                        <Page :current="groupPersonSearchForm.pageNumber" :total="groupPersonTotal"
                                              :page-size="groupPersonSearchForm.pageSize"
                                              @on-change="groupPersonChangePageNum"
                                              @on-page-size-change="groupPersonPageSize"
                                              transfer
                                              :page-size-opts="[10,20,50]"
                                              size="small" show-total show-elevator show-sizer></Page>
                                    </Row>
                                </el-tab-pane>
                            </el-tabs>
                            <no-data v-if="groupData.length == 0" width="150" style="height: calc(100vh - 171px);overflow:hidden;display:flex;flex-direction:row;justify-content:center;"></no-data>
                        </Card>
                    </Col>
                    <Col style="width: 40%;min-width: 320px;height: calc(100vh - 79px);">
                        <Alert class="alert">订单信息</Alert>
                        <Card class="card height-auto" style="margin-bottom: 4px;">
                            <Form :label-width="80" class="form">
                                <Row>
                                    <Col span="12">
                                        <FormItem label="体检单位" class="unit">
                                            <Tooltip transfer :content="groupOrderInfo.name">
                                                {{ groupOrderInfo.name }}
                                            </Tooltip>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="体检类型">
                                            {{ groupOrderInfo.physical_type }}
                                        </FormItem>
                                    </Col>

                                    <Col span="12">
                                        <FormItem label="体检时间">
                                            {{ timeFormat(groupOrderInfo.delivery_time) }}
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="套餐金额">
                                            {{ groupOrderInfo.order_total ? groupOrderInfo.order_total + "元" : "" }}
                                        </FormItem>
                                    </Col>

                                    <Col span="12">
                                        <FormItem label="订单编号">
                                            {{ groupOrderInfo.order_code }}
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="签订时间">
                                            {{ timeFormat(groupOrderInfo.signing_time) }}
                                        </FormItem>
                                    </Col>

                                    <Col span="12">
                                        <FormItem label="检查人数">
                                            {{ groupOrderInfo.personCount }}人
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="销售人员">
                                            {{ groupOrderInfo.sales_director_name }}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                        <Alert class="alert">团体项目</Alert>
                        <Card class="card height-auto" style="height: 100%;">
                            <Table :loading="groupItemLoading"
                                   max-height="400"
                                   border
                                   show-summary
                                   :summary-method="handleSummary"
                                   :columns="groupItemColumns"
                                   sortable="custom"
                                   :data="groupItemData"></Table>
                            <Page size="small" show-total :total="groupItemData.length"
                                  style="margin-top: 15px;display: flex;justify-content: flex-end;"></Page>
                        </Card>
                    </Col>
                </div>
            </Row>
            <!--人员添加-->
            <updateTGroupPerson v-model="updateShow"
                                :tGroupPersonId="tGroupPersonId"
                                :groupName="groupName"
                                :modalTitle="title"
                                :orderId="groupPersonSearchForm.orderId"
                                :groupId="groupPersonSearchForm.groupId"
                                v-on:handleSearch="handleSearch"
            />
            <!--批量导入-->
            <excel-upload v-model="isExcelUpload" :modalTitle="title" :orderId="orderId" :groupId="groupId"
                          v-on:handleSearch="handleSearch"></excel-upload>
        </div>
    </div>
</template>
<script>
import {
    deleteTGroupPerson,
    queryTGroupPersonList,
    isContinuImport,
    getPersonNumByGroupId,
    exportPersonData,
	exportOrderData
} from '@/api/healthy/tGroupPerson'
import {
    queryTGroupOrderList,
    getTGroupOrderByIdWithLink
} from "@/api/healthy/tGroupOrder";
import {formatDate} from "@/api/tool.js"
import updateTGroupPerson from "./updateTGroupPerson";
import {formartDate} from "@/api/tools/tool.js"
import excelUpload from "./excelUpload";
import {queryTOrderGroupList} from "@/api/healthy/tOrderGroup"//分组
import {queryTOrderGroupItemList} from "@/api/healthy/tOrderGroupItem";
import noData from "../../../components/no-data"
import {getMonthString,getDataString} from "../../../api/tools/tool";

export default {
    components: {
        excelUpload,
        updateTGroupPerson,
        noData
    },
    computed: {
        physicalType() {
            return this.$store.state.theme.theme.physicalType;
        }
    },
    data() {
        return {
            expand: true,
            leftSpan: 'width: 300px;height: calc(100vh - 81px);',
            span: 'position: relative;width: calc(100% - 332px);display:flex;',
            expandIcon: "ios-arrow-back",

            height: 0,
            date: "",
            datePickerShow: false,
            noMoreShow: false,
            isExcelUpload: false,
            groupOrderData: [],
            groupOrderLoading: false,
            groupOrderSearchForm: {
                pageNumber: 1, // 当前页数
                pageSize: 10, // 页面大小
                groupUnitName: '',
                payStatus: 1,
                physicalType: "",
                startDate: "",
                endDate: ""
            },
            maleLoading: false,
            maleColumns: this.getMaleColumns(),
            maleData: [],
            femaleData: [],
            groupPersonData: [],
            groupPersonTotal: 0,
            groupPersonTabValue: "",
            maleCount: 0,
            femaleCount: 0,
            groupData: [],
            groupItemLoading: false,//分组项目
            groupItemColumns: this.getGroupItemColumns(),
            groupItemData: [],
            updateShow: false,
            tGroupPersonId: "",
            title: '',
            isRadioChecked: "",
            orderId: "",//订单id
            groupId: "",//分组id
            groupPersonSearchForm: {
                pageNumber: 1, // 当前页数
                pageSize: 10, // 页面大小
                groupId: "",//分组id
                orderId: ""
            },
            groupItemSearchForm: {//分组项目
                pageNumber: 1, // 当前页数
                pageSize: 10, // 页面大小
                groupId: "",//分组id
            },
            groupOrderInfo: {},//团检订单info
            groupOrderTotal: 0,
            groupName: "",
            radioShow: false,
            queryTime:this.$hospitalName.queryTimeChange,
        }
    },
    methods: {
        resetClick() {
            this.groupOrderSearchForm.pageNumber = 1;
            this.groupOrderSearchForm.groupUnitName = "";
            this.groupOrderSearchForm.pageSize = 10;
            this.groupOrderSearchForm.physicalType = "";
            this.groupOrderSearchForm.payStatus = 1;
            this.isCheck = 0;
            let _this = this;
            setTimeout(function () {
                _this.date = "当日";
                if (!_this.$hospitalName.queryTimeChange){
                    let date  = getMonthString(new Date());
                    if(date!=null && date.length == 2){
                        _this.groupOrderSearchForm.startDate = date[0]+ " 00:00:00";
                        _this.groupOrderSearchForm.endDate = date[1]+ " 23:59:59";
                    }
                }
                else{
                    _this.groupOrderSearchForm.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    _this.groupOrderSearchForm.endDate = null;

                }
                _this.getGroupOrderData();

            },100);
        },
        dateReset() {
            this.groupOrderSearchForm.pageNumber = 1;
            this.groupOrderSearchForm.groupUnitName = "";
            this.isRadioChecked = "";
            this.groupData = [];
            this.groupOrderInfo = {};
            this.groupItemData = [];
        },
        pick(e) {
            this.groupOrderSearchForm.pageNumber = 1;
            if (e == '自定义') {
                this.datePickerShow = true;
            } else if (e == '当日') {
                this.dateReset();
                this.groupOrderSearchForm.startDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                this.groupOrderSearchForm.endDate = null;
                this.getGroupOrderData();
            } else if (e == '当月') {
                this.dateReset();
                this.groupOrderSearchForm.endDate = formatDate(new Date(), 'yyyy-MM-dd  HH:mm:ss');
                this.groupOrderSearchForm.startDate = null;
                this.getGroupOrderData();
            }
        },
        //人员日期查询
        datePickerChange(e) {
            if (e) {
                this.groupOrderSearchForm.startDate = e[0];
                var dateTime = new Date(e[1]);
                dateTime = dateTime.setDate(dateTime.getDate() + 1);
                this.groupOrderSearchForm.endDate = new Date(dateTime);
                this.getGroupOrderData();
            }
        },

        //人员日期查询
        datePickerEndTime(e){
            if (e) {
                let endTime = new Date(e);
                endTime.setHours(23, 59, 59, 999);
                endTime = endTime.setDate(endTime.getDate());
                this.groupOrderSearchForm.endDate = formatDate(new Date(endTime), 'yyyy-MM-dd HH:mm:ss');
            }
            this.getGroupOrderData();
        },

        //人员日期查询
        datePickerStartTime(e) {
            if (e){
                let startTime = new Date(e);
                startTime.setHours(0, 0, 0, 0);
                startTime = startTime.setDate(startTime.getDate());
                this.groupOrderSearchForm.startDate = formatDate(new Date(startTime), 'yyyy-MM-dd HH:mm:ss');

            }
            this.getGroupOrderData();
        },


        //row换颜色
        rowClassName(row, index) {
            if (row.isPass == 1) {
                return "red";
            } else {
                return "";
            }
        },
        changeExpand() {
            this.expand = !this.expand;
            if (this.expand) {
                this.expandIcon = "ios-arrow-back";
                this.span = 'position: relative;width: calc(100% - 332px);display:flex;';
                this.leftSpan = 'width: 300px;height: calc(100vh - 81px);';
            } else {
                this.expandIcon = "ios-arrow-forward";
                this.span = 'position: relative;width: calc(100% - 32px);display:flex;';
                this.leftSpan = 'width: 0px;height: calc(100vh - 81px);';
            }
        },
        //获取团检订单数据
        getGroupOrderData() {
            this.groupOrderLoading = true;
            this.groupOrderSearchForm.physicalType = this.physicalType;

            let searchForm = JSON.parse(JSON.stringify(this.groupOrderSearchForm));
			if(searchForm.startDate ){
				searchForm.startDate = formatDate(searchForm.startDate, 'yyyy-MM-dd HH:mm:ss');
			}
			if(searchForm.endDate ){
				searchForm.endDate = formatDate(searchForm.endDate , 'yyyy-MM-dd HH:mm:ss');
				searchForm.endDate = searchForm.endDate.replace(" 00:00:00"," 23:59:59");
			}
			if (!this.$hospitalName.queryTimeChange){
                if(searchForm.startDate == null||searchForm.startDate .trim().length==0){
                    searchForm.startDate = "1971-01-01 00:00:00"
                }
                if(searchForm.endDate == null||searchForm.endDate .trim().length==0){
                    let endTime = getDataString(new Date);
                    searchForm.endDate = endTime + " 23:59:59"
                }
            }
			else{
                //输入了就不带时间
                if(searchForm.groupUnitName && searchForm.groupUnitName.trim().length>0 ){
                    searchForm.startDate = null;
                    searchForm.endDate = null;
                    this.date = '';//取消时间筛选
                }
            }
            queryTGroupOrderList(searchForm).then(res => {
                if (res.success) {
                    this.groupOrderData = res.data.records;
                    this.groupOrderTotal = res.data.total;
                    //初始化选中第一个团检订单
                    if (this.groupOrderData && this.groupOrderData.length > 0) {
                        this.isRadioChecked = this.groupOrderData[0].id;
                    }
                }
            }).finally(() => {
                this.groupOrderLoading = false;
            })
        },
        //根据团购订单名称查询
        groupOrderInputChange(e) {
            this.groupOrderSearchForm.pageNumber = 1;
            this.groupOrderSearchForm.groupUnitName = e;
            this.getGroupOrderData();
        },
        //根据id获取团检信息
        getGroupOrderById() {
            if (this.isRadioChecked) {
                getTGroupOrderByIdWithLink({id: this.isRadioChecked}).then(res => {
                    if (res.success) {
                        this.groupOrderInfo = res.data;
                    } else {
                        this.$Message.error("团检订单详情加载失败")
                    }
                })
            }
        },
        //批量上传
        handleUpload() {
			if (!this.isRadioChecked) {
				this.$Message.error("请先选择左侧团购订单");
				return;
			}
        	if(this.groupData && this.groupData.length==0 ){
				this.$Message.error("请先添加分组");
				return
            }
            isContinuImport({orderId: this.isRadioChecked, groupId: this.groupPersonTabValue}).then(res => {
                if (res.success && res.data) {
                    //可以导入
                    this.groupId = this.groupPersonTabValue;
                    //订单id
                    this.orderId = this.isRadioChecked;
                    this.isExcelUpload = true;
                    this.title = "人员批量导入";
                } else {
                    //不可导入
                    this.$Message.info("该分组人员已进行体检，无法重新导入，请通过新增添加人员");
                    return;
                }
            })
        },
        //添加
        handleAddClick() {
            if (!this.isRadioChecked) {
                this.$Message.error("请先选择左侧团购订单");
                return;
            }
			if(this.groupData && this.groupData.length==0 ){
				this.$Message.error("请先添加分组");
				return
			}
            //订单id
            this.orderId = this.isRadioChecked;
            //分组id
            this.groupId = this.groupPersonTabValue;
            // getPersonNumByGroupId({groupId: this.groupId}).then(res => {
            //     if (res.success) {
            //         if (res.data.personNum < res.data.groupPersonNum) {
                        this.tGroupPersonId = "";
                        this.title = "新增";
                        this.updateShow = true;
                        let find = this.groupData.find(item => item.id == this.groupId);
                        if (find) {
                            this.groupName = find.name.substring(find.name.indexOf("["), find.name.length).replace("[", "").replace("]", "");
                        }
                    // } else {
                    //     this.$Message.info("当前分组体检人员已满")
                    // }
                //}
            //})
        },
        //修改
        handleEditClick(row, index) {
            this.updateShow = true;
            this.title = "修改";
            this.tGroupPersonId = row.id.toString();
        },
        //查看
        handleViewClick(row, index) {
            this.updateShow = true;
            this.title = "查看";
            this.tGroupPersonId = row.id;
        },
        //删除
        handleDelClick(row, index) {
            this.$Modal.confirm({
                title: '删除提示',
                content: '确定删除'+ row.personName +'吗？',
                onOk: () => {
                    deleteTGroupPerson({ids: [row.id]}).then(res => {
                        if (res.success) {
                            this.$Message.success("删除成功！");
                            this.getDataList();
                            this.$Modal.remove();
                        } else {
                            this.$Message.success("删除失败！");
                        }
                    })
                },
                onCancel: () => {
                }
            });
        },
        //根据团检id获取分组信息
        getOrderGroupByOrderId() {
			this.groupOrderInfo = {};
			this.groupItemData = [];
            queryTOrderGroupList({groupOrderId: this.isRadioChecked}).then(res => {
                if (res.success) {
                    this.groupData = res.data;
                    if (this.groupData && this.groupData.length > 0) {
                        //初始化选中第一个分组
                        this.groupPersonTabValue = this.groupData[0].id;
                        //获取分组下边对应人员
                        this.groupPersonSearchForm.groupId = this.groupPersonTabValue;
                        this.groupPersonSearchForm.orderId = this.isRadioChecked;
                        this.radioShow = false;
                        this.groupPersonSearchForm.pageNumber = 1;
                        this.getDataList();
						//团检信息
						this.getGroupOrderById();
						this.groupItemData = res.data[0].projectData;
                    }
                }
            })
        },
        //加载人员信息
        getDataList() {
            this.maleLoading = true;
			// this.groupPersonSearchForm.pageNumber = 1;
            queryTGroupPersonList(this.groupPersonSearchForm).then(res => {
                if (res.success) {
                    this.maleLoading = false;
                    this.groupPersonData = res.data.records;
                    this.groupPersonTotal = res.data.total;
                }
            });
        },
        //切换分组 1.展示不同团检人员 2.展示不同分组体检项目
        tabClick(e) {
            this.groupPersonSearchForm.pageNumber = 1;
            //1.不同团检人员
            this.groupPersonSearchForm.groupId = this.groupPersonTabValue;
            this.groupPersonSearchForm.orderId = this.isRadioChecked;
            this.getDataList();
            //分组项目
            this.groupItemSearchForm.groupId = this.groupPersonTabValue;
            this.getOrderGroupItemByGroupId();
        },
        //添加人员回调查询
        handleSearch() {
            this.groupPersonSearchForm.pageNumber = 1;
            this.getDataList();
        },
        //时间格式化处理
        timeFormat(item) {
            return formartDate(item).split(" ")[0];
        },
        //点击文字选中
        radioChooseClick(item, index) {
            this.isRadioChecked = item.id;
            //订单id
            this.orderId = this.isRadioChecked;
            //分组id
            this.groupId = this.groupPersonTabValue;
        },
        //团检人员页码
        groupPersonChangePageNum(v) {
            this.groupPersonSearchForm.pageNumber = v;
            this.getDataList();
        },
        //团检人员单页数据
        groupPersonPageSize(v) {
            this.groupPersonSearchForm.pageSize = v;
            this.getDataList();
        },
        //根据分组id，获取分组下边体检项目
        getOrderGroupItemByGroupId() {
            this.groupItemLoading = true;
            queryTOrderGroupItemList(this.groupItemSearchForm).then(res => {
                if (res.success) {
                    this.groupItemData = res.data;
                }
            }).finally(() => {
                this.groupItemLoading = false;
            })
        },
        //统计
        handleSummary({columns, data}) {
            const sums = {};
            columns.forEach((column, index) => {
                const key = column.key;
                if (index === 0) {
                    sums[key] = {
                        key,
                        value: '总价'
                    };
                    return;
                }
                const values = data.map(item => Number(item[key]));
                if (!values.every(value => isNaN(value))) {
                    const v = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    if (key == "discount") {
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
        //团检个人列
        getMaleColumns() {
            return [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                }, {
                    title: '姓名',
                    align: 'center',
                    minWidth: 100,
                    key: 'personName',
                    tree: true
                }, {
                    title: '性别',
                    align: 'center',
                    minWidth: 80,
                    key: 'sex',
                    sortable: false
                }, {
                    title: '证件号码',
                    align: 'center',
                    tooltip: true,
                    ellipsis: true,
                    minWidth: 160,
                    key: 'idCard',
                    sortable: false
                }, {
                    title: '年龄',
                    align: 'center',
                    minWidth: 100,
                    key: 'age',
                    sortable: false
                }, {
                    title: '操作',
                    align: 'center',
                    slot: 'action',
                    width: 140,
                }
            ]
        },
        //分组项目列
        getGroupItemColumns() {
            return [
                {
                    title: '体检项目',
                    align: 'left',
                    minWidth: 100,
                    key: 'name',
                    tooltip: true,
                    ellipsis: true
                }, {
                    title: '原价(元)',
                    align: 'center',
                    minWidth: 90,
                    key: 'salePrice',
                    sortable: false
                }, {
                    title: '折扣(100%)',
                    align: 'center',
                    minWidth: 120,
                    key: 'discount',
                    sortable: false
                }, {
                    title: '折扣价(元)',
                    align: 'center',
                    minWidth: 100,
                    key: 'discountPrice',
                    sortable: false
                }
            ]
        },
        groupOrderChangePageNum(v) {
            this.groupOrderSearchForm.pageNumber = v;
            this.getGroupOrderData();
            this.setHeight();
        },
        //table 高度设置
        setHeight() {
            let height = window.innerHeight - 181;
            if (height <= 1220) {
                height = height - 40;
            }
            this.height = height;

            window.onresize = () => {
                height = window.innerHeight - 181;
                if (height <= 1220) {
                    height = height - 40;
                }
                this.height = height;
            }
        },
        //数据导出
        handleExport() {
            if (!this.isRadioChecked) {
                this.$Message.error("请选择订单！");
                return;
            }
            this.maleLoading = true;
            let find = this.groupOrderData.find(item => item.id == this.isRadioChecked);
            let fileName = find.groupUnitName + "体检人员数据.xlsx";
			exportPersonData({orderId: this.isRadioChecked}).then(res => {

                let content = res;
                let blob = new Blob([content], {type: 'application/octet-stream'});
                if ('download' in document.createElement('a')) { // 非IE下载
                    let elink = document.createElement('a');
                    elink.download = fileName;
                    elink.style.display = 'none';
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                } else { // IE10+下载
                    navigator.msSaveBlob(blob, fileName);
                }
				this.maleLoading = false;
            }).catch(function (error) {
                this.$Message.error('数据导出失败');
				this.maleLoading = false;
            });
        },
        //数据导出
		handleSqlExport() {
			if (!this.isRadioChecked) {
				this.$Message.error("请选择订单！");
				return;
			}
			this.maleLoading = true;
			let find = this.groupOrderData.find(item => item.id == this.isRadioChecked);
			let fileName = find.groupUnitName + "体检人员数据.sql";
			exportOrderData({orderId: this.isRadioChecked}).then(res => {
				let content = res;
				let blob = new Blob([content]);
				if ('download' in document.createElement('a')) { // 非IE下载
					let elink = document.createElement('a');
					elink.download = fileName;
					elink.style.display = 'none';
					elink.href = URL.createObjectURL(blob);
					document.body.appendChild(elink);
					elink.click();
					URL.revokeObjectURL(elink.href); // 释放URL 对象
					document.body.removeChild(elink);
				} else { // IE10+下载
					navigator.msSaveBlob(blob, fileName);
				}
				this.maleLoading = false;
			}).catch(function (error) {
				this.$Message.error('数据导出失败');
				this.maleLoading = false;
			});
		}
    },
    watch: {
        isRadioChecked(val) {
            if (val) {
                this.radioShow = true;
                //获取分组
                this.getOrderGroupByOrderId();
            }
        }
    },
    mounted() {
        this.date = "当日";
        //this.pick("当日");
        this.setHeight();
        let date  = getMonthString(new Date());
        if (!this.$hospitalName.queryTimeChange){
            if(date!=null && date.length == 2){
                this.groupOrderSearchForm.startDate = date[0]+ " 00:00:00";
                this.groupOrderSearchForm.endDate = date[1]+ " 23:59:59";
                this.getGroupOrderData();
            }
        }else {
            this.pick("当日");
        }
    }
}
</script>
