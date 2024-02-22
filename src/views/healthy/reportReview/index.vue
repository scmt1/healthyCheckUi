<template>
    <div class="reportReview">
        <Row style="height: 100%;">
            <Col v-if="expand" :style="leftSpan" style="max-height: 100%;">
                <Card style="height: 100%;overflow:hidden;">
                    <Alert class="alert">人员查询</Alert>
                    <Row style="">
                        <RadioGroup v-model="status" @on-change="statusChange">
                            <Radio label="未审"></Radio>
                            <Radio label="已审"></Radio>
                        </RadioGroup>
                        <div style="width: 50%;text-align: right;">
                            <i-switch size="large" @on-change="typeChange" v-model="typeStatus" style="text-align: center;">
                                <span slot="open">复查</span>
                                <span slot="close">非复查</span>
                            </i-switch>
                        </div>
<!--                        <div v-if="searchForm.isPass == 4">-->
                        <div v-if="personData && personData.length > 0" style="margin-top: 10px;">
                            <Button type="primary" style="" size="small" style="height: 20px;padding: 0 5px;line-height: 19px !important;" @click="downloadTemplate()" v-if="isShowButton && personData && personData.length>0">下载Word</Button>
                            <Button type="primary" style="" size="small" style="height: 20px;padding: 0 5px;line-height: 19px !important;" @click="approve" v-if="searchForm.isPass == 4 && personData.length > 0">审核</Button>
                            <Button type="error" style="" size="small" style="height: 20px;padding: 0 5px;line-height: 19px !important;" @click="approveEXE" v-if="searchForm.isPass == 5 && personData.length > 0">退回</Button>
                            <Button type="primary" style="" size="small" style="height: 20px;padding: 0 5px;line-height: 19px !important;" @click="batchPrintSelect" v-if="isShowButton && personData.length > 0">批量打印</Button>
                            <Button type="primary" style="" size="small" style="height: 20px;padding: 0 5px;line-height: 19px !important;" @click="confirmPrintSelect" v-if="isShowButton && personData.length > 0">打印确认</Button>
                            <Button type="primary" style="" size="small" style="height: 20px;padding: 0 5px;line-height: 19px !important;" @click="downloadTemplatePdf()" v-if="isShowButton && personData && personData.length>0">批量下载Pdf</Button>
                            <Button type="primary" style="" size="small"
                                    style="height: 20px;padding: 0 5px;line-height: 19px !important;"
                                    @click="cancelGeneralInspection" v-if="searchForm.isPass == 4 && personData.length > 0&& CancelTheMasterCheckButton">取消总检
                            </Button>
                        </div>
                    </Row>
                    <div style="display: flex;margin-top: 10px;">
                        <Checkbox
                                :indeterminate="indeterminate"
                                :value="checkAll"
                                @click.prevent.native="handleCheckAll">全选
                        </Checkbox>
                        <RadioGroup v-if="queryTime" type="button" size="small" class="btngroup" button-style="solid" v-model="date"
                                    @on-change="pick">
                            <Radio label="当日"></Radio>
                            <Radio label="当月"></Radio>
                            <DatePicker
                                    :open="datePickerShow"
                                    transfer
                                    type="daterange"
                                    @on-change="datePickerChange"
                            >
                                <div>
                                    <template>
                                        <Radio label="自定义" @click.native="datePickerShow = !datePickerShow"></Radio>
                                    </template>
                                </div>
                            </DatePicker>
                            <Radio label="重置"></Radio>
                        </RadioGroup>
                    </div>
                    <div v-if="!queryTime" style="display: flex;flex-wrap: nowrap;align-items: center;margin-bottom: 10px">
                        <DatePicker type="date" transfer @on-change="datePickerStartTime"  v-model="searchForm.startDate"  placeholder="开始时间" />
                        &nbsp;~&nbsp;
                        <DatePicker type="date" transfer @on-change="datePickerEndTime" v-model="searchForm.endDate" placeholder="结束时间" />

                    </div>
                    <!--<Input suffix="ios-search" placeholder="请输入关键字" v-model="searchForm.keyword" style="margin-top: 10px;" class="search-input"
                           @keypress.native.enter="inputSearchChange"
                           @on-clear="inputSearchChange"/>-->
                    <Input v-model="searchForm.personName" placeholder="请输入姓名" @on-clear="inputSearchChange('')"
                           @keypress.native.enter="inputSearchChange" style="margin-top: 10px;margin-bottom: 10px;" clearable/>
                    <Input v-model="searchForm.orderCode" placeholder="请输入订单编号" @on-clear="inputSearchChange('')"
                           @keypress.native.enter="inputSearchChange" style="margin-bottom: 10px;" clearable v-if="drop"></Input>
                    <Input v-model="searchForm.testNum" placeholder="请输入体检编号" @on-clear="inputSearchChange('')"
                           @keypress.native.enter="inputSearchChange" style="margin-bottom: 10px;" clearable v-if="drop"></Input>
                    <Input v-model="searchForm.dept" placeholder="请输入单位名称" @on-clear="inputSearchChange('')"
                           @keypress.native.enter="inputSearchChange" style="margin-bottom: 10px;" clearable v-if="drop"></Input>
                    <Button type="primary" @click="inputSearchChange" size="small">查询</Button>
                    <Button v-if="!queryTime" size="small"  @click="resetSearchForm('重置')">重置</Button>
                    <a class="drop-down" @click="dropDown">
                        {{dropDownContent}}
                        <Icon :type="dropDownIcon"></Icon>
                    </a>
                    <!--左侧套餐列-->
                    <Row :style="{'height': 'calc(100% - '+height1+')'}" style="justify-content: center;">
                        <CheckboxGroup class="radio-group" v-model="radioValue" @on-change="peopleChange" v-if="personData.length > 0">
                            <Row style="margin-left: 15px;" class="row-border" v-for="(item,index) in personData" :key="index" v-bind:class="{ 'active': item.id == personInfo.id }">
<!--                                <Col :span="3" class="radio-group-radio" v-if="searchForm.isPass == 4">-->
                                <Col :span="3" class="radio-group-radio">
                                    <Checkbox class="label"  :label="item.id"></Checkbox>
                                </Col>
                                <!--<Col :span="3" class="radio-group-radio" v-else>
                                    <Radio :label="item.id"></Radio>
                                </Col>-->
                                <Col :span="21" class="radio-group-content" @click.native="radioChooseClick(item.id)">
                                    <Row>
                                        <Col span="13" style="display: flex;">
                                            <div style="display: inline-block;width: 80px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                                                 :title="item.personName">
                                                {{ item.personName }}
                                            </div>
                                            <div style="margin-right: 10px;">{{ item.sex }}</div>
                                            <div>{{ item.age }}</div>
                                        </Col>
                                        <Col :span="11">
                                            <Row :gutter="6">
                                                <Col :span="9">
                                                    <div style="padding: 0 5px;" class="bg-audit" v-if="item.isPass == 4">
                                                        未审
                                                    </div>
                                                    <div v-else style="padding: 0 5px;" class="bg-green">
                                                        已审
                                                    </div>
                                                </Col>
                                                <Col :span="9">
                                                    <div style="padding: 0 5px;background: none;color: #426ab3;border: 1px solid #426ab3;" class="bg-audit" v-if="item.printState != 1">
                                                        未打
                                                    </div>
                                                    <div v-else style="padding: 0 5px;background: none;color: #78a355;border: 1px solid #78a355;" class="bg-green">
                                                        已打
                                                    </div>
                                                </Col>
                                                <Col :span="6">
                                                    <div class="border-purple" v-if="item.sporadicPhysical && item.sporadicPhysical == 1">
                                                        零
                                                    </div>
                                                    <div class="border-purple" v-else>
                                                        团
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </CheckboxGroup>

                        <!--暂无数据-->
                        <no-data v-else></no-data>

                        <Spin fix v-if="checkPersonLoading">
                            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                            <div>加载中...</div>
                        </Spin>
                        <Page v-if="personData.length > 0" :current="searchForm.pageNumber" :total="groupDataTotal" simple show-sizer
                              @on-change="personChangePageNum" :page-size-opts="[10,20,50]" :page-size="searchForm.pageSize"/>
                        <Select v-if="personData.length > 0" v-model="searchForm.pageSize" @on-change="changePageSize" style="width: 4.8vw;height: 2.5vh;">
                            <Option v-for="item in pageSizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <!--<Row type="flex" justify="end">
                            <Page v-if="personData.length > 0"
                                    :current="searchForm.pageNumber"
                                    :total="groupDataTotal"
                                    :page-size="searchForm.pageSize"
                                    @on-change="personChangePageNum"
                                    @on-page-size-change="changePageSize"
                                    :page-size-opts="[10,20,50]"
                                    size="small"
                                    show-total
                                    show-elevator
                                    show-sizer
                                    transfer
                            ></Page>
                        </Row>-->
                    </Row>
                </Card>
            </Col>
            <div class="expand">
                <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand"/>
            </div>
<!--            <Col :span="span" v-if="tabPanes.length >0 && personData.length>0" style="position: relative;">-->
            <Col :style="span">
                <templateShow ref="templateShow" style="height: 100vh;overflow:hidden;" v-if="isTemplateShow" :type-status="typeStatus" :isReview="searchForm.isReviewer" :personIds="personIds" :isBatchPrint="isBatchPrint" :taskNow="this.taskNow"
                              v-on:closeLoading="closeLoading"  :physicalType="physicalType"></templateShow>
            </Col>
            <!--<Col :span="span" v-else>
                <Card>
                    &lt;!&ndash;暂无数据&ndash;&gt;
                    <no-data width="150" height="150"></no-data>
                </Card>
            </Col>-->
        </Row>
        <!-- loading -->
        <Spin fix v-show="loading">
            <div class="demo-spin-icon-load">
                <i class="iconfont icon-loader--line"></i>
            </div>
            <div style='font-size:16px'>Loading...</div>
        </Spin>
    </div>
</template>
<script>
    import {
        getTGroupPersonInspection,
        getTGroupPersonInspectionTypeStatus,
        updateTGroupPerson,
        updateTGroupPersonByIsPass,
        updateTGroupPersonById,
        updateTGroupPersonByIdTypeStatus,
        updateTGroupPersonByIdRetreat,
        updateTGroupPersonByIdRetreatTypeStatus,
        updateTPrintStateById,
        updateTPrintStateByIdTypeStatus,
        cancelGeneralInspectionById,
        cancelGeneralInspectionByIdStatus
    } from "@/api/healthy/tGroupPerson";
    import {generatePhysicalExaminationReport,generateReportByPersonId,generateReportByPersonIds,generateReportByPersonIdsTJJL,generateReportByPersonIdsNotice,generateReportByPersonIdsFC,generateReportByPersonIdsfirstPage,generateWordReport,getReportWordBatch} from '@/api/healthy/tTemplate'

    import {getItemByGroupId} from "@/api/healthy/tDepartResult";
    import Viewer from "viewerjs";
    import previewPrint from "./previewPrint";
    import {getTGroupPersonWithLink} from "../../../api/healthy/tGroupPerson";
    import {formartDate} from "../../../api/tools/tool";
    import {queryAllTGroupUnitList} from "../../../api/healthy/tGroupUnit";
    import {queryRelationPersonProjectCheckAll} from "../../../api/healthy/relationPersonProjectCheck";
    import noData from "../../../components/no-data"
	import {getTOrderGroup} from "@/api/healthy/tOrderGroup"
    import util from "../../../libs/util";
    import templateJs from "./templateJs/templateJs";
    import templateShow from "./templateShow";
    import {getMonthString,getDataString} from "../../../api/tools/tool";
    import {formatDate} from "@/api/tool.js"

    import {exportWord,exportTemplatePdf,exportTemplatePdfBatch} from '@/api/healthy/tTemplate'

    export default {
        name: "reportReview",
        components: {previewPrint, noData, templateShow},
        data() {
            return {
                ids:[],
                pageSizeList: [
                    {
                        value: 10,
                        label: '10 条/页'
                    },
                    {
                        value: 20,
                        label: '20 条/页'
                    },
                    {
                        value: 50,
                        label: '50 条/页'
                    },
                    {
                        value: 100,
                        label: '100 条/页'
                    }
                ],

                CancelTheMasterCheckButton:false,//取消总检按钮展示
                isShowPageLast: false,//是否展示页面(尾页)
                isNotShowFGN: false,//是否不展示肺功能详细报告 true 不展示 false 展示
                styleRadioGroup: 'overflow: auto;width: 100%;height: 53vh;',
                isShowFirstPersonInfo: true,//是否默认加载第一个人的报告信息

                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                drop: false,
                height1: '270px',
                isShowZoncareImg: false,//是否展示心电图图片(成都新华)

                typeStatus:false,
                isShowButton: false,
                personIds: [],//选择的人员id
                isTemplateShow: false,//是否展示模板
                unitDataArry: [],
                unitId: '',
                groupDataTotal: 0,
                status: '未审',
                date: '',
                datePickerShow: false,
                checkPersonLoading: false,
                isRadioChecked: "",
                indeterminate: true,
                radioValue: [],
                checkAll: false,
                personAll: [],
                personData: [],
                expand: true,
                leftSpan: 'width: 300px;',
                span: 'position: relative;width: calc(100% - 332px);',
                tGroupUnitForm: {},
                personInfo: {},
				orderGroupData:[],//人员的 订单分组数据
                loading: false,
                data: [],
                expandIcon: "ios-arrow-back",
                searchForm: {
                    pageNumber: 1,
                    pageSize: 10,
                    isPass: 4,
                    keyword: "",
                    physicalType: '',
                    unitId: '',
                    isReviewer: false,
                    personName: "",//姓名
                    testNum: "",//体检编号
                    dept: "",//单位名称
                    orderCode:'',//订单编号
                },
                tabPanes: [],
                tabItems: [],
                selectTabName: "引导单",
                personId: "",//选择的人员Id
                groupId: "",//选择的人员的组织Id
                timer: null,//定时器
                pdfPaths: [],//合成体检报告的PDf
                previewHtmlUrl: "",//体检报告PDf
                abandonInspectionIdData: [],//弃检项目id
                departItemResults:[],//分项结果

                tabsClickIndex: 0,
                previewHtmlUrlGZS: "",//体检报告(告知书)PDf

                isShowPage: false,//是否展示页面(首页尾页及相关说明)
                isBatchPrint: false,//是否批量打印

                taskNow: "",
                queryTime:this.$hospitalName.queryTimeChange,
            }
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
        },
        methods: {
            //展开 收起
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = "展开";
                    this.dropDownIcon = "ios-arrow-down";
                    // this.styleRadioGroup = 'overflow: auto;width: 100%;height: 52vh;';
                    this.height1 = '270px';
                } else {
                    this.dropDownContent = "收起";
                    this.dropDownIcon = "ios-arrow-up";
                    // this.styleRadioGroup = 'overflow: auto;width: 100%;height: 34vh;';
                    this.height1 = '358px';
                }
                this.drop = !this.drop;
            },
            //复查选择
            typeChange(e) {
                this.searchForm.pageNumber = 1;
                if (!e) {
                    this.searchForm.isReviewer = false;

                } else {
                    this.searchForm.isReviewer = true;
                }
                this.inputSearchChange("");
            },
            //word下载
            downloadTemplate() {
                let _this = this;
                let url = "";
                let name = "";
                let previewHtmlUrl = this.$refs.templateShow.previewHtmlUrl;
                let previewHtmlUrlGZS = this.$refs.templateShow.previewHtmlUrlGZS;
                let previewHtmlUrlFM = this.$refs.templateShow.previewHtmlUrlFM;
                let previewHtmlUrlFC = this.$refs.templateShow.previewHtmlUrlFC;
                let previewHtmlUrlTJJL = this.$refs.templateShow.previewHtmlUrlTJJL;
                let previewHtmlUrlFirstFM = this.$refs.templateShow.previewHtmlUrlFirstFM;
                let tabsClickIndex = this.$refs.templateShow.tabsClickIndex;
                let personName = this.$refs.templateShow.personInfo.person_name;
                if(tabsClickIndex == 0){
                    url = previewHtmlUrl;//个检报告
                    name = "个检报告";
                }else if(tabsClickIndex == 1){
                    url = previewHtmlUrlGZS;//告知书
                    name = "告知书";
                }else if(tabsClickIndex == 2){
                    url = previewHtmlUrlFM;//封面
                    name = "封面";
                }else if(tabsClickIndex == 3){
                    url = previewHtmlUrlFC;//复查报告
                    name = "复查报告";
                }else if(tabsClickIndex == 4){
                    url = previewHtmlUrlTJJL;//个人体检结论
                    name = "个人体检结论";
                }else if(tabsClickIndex == 5){
                    url = previewHtmlUrlFirstFM;//个人报告
                    name = "个人报告(含首页封面)";
                }
                let fileName = "";
                if(!personName || personName.trim().length <= 0){
                    fileName = name+".docx";
                }else{
                    fileName = personName+ "_"+name+".docx";
                }
                exportWord({url: url}).then(res => {
                    let content = res;
                    let blob = new Blob([content], {type: 'application/ms-excel'});
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
                }).catch(function (error) {
                    _this.$Message.error('数据导出失败');
                });

            },
            //Pdf下载(可批量)
            downloadTemplatePdf() {
                if (this.radioValue.length <= 0) {
                    this.$Message.warning('您还未选择要确认的人员');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认下载',
                    content: '您确认下载所选的 ' + this.radioValue.length + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.radioValue.forEach(function (e) {
                            ids.push(e);
                        });
                        // this.downloadPdfGetData(ids);
                        this.downloadPdfGetDataShow(ids);
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });

            },
            downloadPdfGetDataShow(ids){
                this.isBatchPrint = true;
                this.personIds = ids;
                this.taskNow = "批量下载pdf";
                this.isTemplateShow = true;
                this.loading = true;
                this.$Modal.remove();
            },
            downloadPdfGetData(ids){
                this.loading = true;
                let tabsClickIndex = this.$refs.templateShow.tabsClickIndex;
                let name = "";
                if(tabsClickIndex == 0){
                    name = "个检报告";
                    generateReportByPersonIds(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandData(res.data);
                            this.downloadPdf(batchData,name);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                }else if(tabsClickIndex == 1){
                    name = "告知书";
                    generateReportByPersonIdsNotice(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandDataNotice(res.data);
                            this.downloadPdf(batchData,name);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                }else if(tabsClickIndex == 2){
                    name = "封面";
                    generateReportByPersonIdsfirstPage(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandDatafirstPage(res.data);
                            this.downloadPdf(batchData,name);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                }else if(tabsClickIndex == 3){
                    name = "复查报告";
                    generateReportByPersonIdsFC(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandDataFC(res.data);
                            this.downloadPdf(batchData,name);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                }else if(tabsClickIndex == 4){
                    name = "个人体检结论";
                    generateReportByPersonIdsTJJL(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandDataTJJL(res.data);
                            this.downloadPdf(batchData,name);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                }else if(tabsClickIndex == 5){
                    name = "个检报告(含首页封面)";
                    generateReportByPersonIds(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandFirstFM(res.data);
                            this.downloadPdf(batchData,name);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                }
            },
            downloadPdf(data,name){
                let _this = this;
                let fileName = name+".zip";
                exportTemplatePdfBatch({data: data,name: name}).then(res => {
                    var reader = new FileReader();
                    reader.readAsText(res,'utf-8');
                    reader.onload = function(e){
                        let resData = "";
                        if(reader.result && reader.result.indexOf("PK") <= -1){
                            resData = JSON.parse(reader.result);
                        }
                        if(resData && resData != "" && resData.success != undefined && !resData.success){
                            _this.$Message.error(resData.msg);
                        }else{
                            let content = res;
                            let blob = new Blob([content], {type: 'application/ms-excel'});
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
                        }
                        _this.loading = false;
                    }
                }).catch(function (error) {
                    _this.$Message.error("批量下载Pdf报告异常！");
                    _this.loading = false;
                });
            },
            //页码
            groupDataChangePageNum(v) {
                this.searchForm.pageNumber = v;
                this.inputSearchChange("");
            },
            //单页数据
            groupDataPageSize(v) {
                this.searchForm.pageSize = v;
                this.inputSearchChange("");
            },
            //状态改变
            statusChange(v) {
                this.status = v;
                this.personData = [];
                this.searchForm.keyword = '';
                this.searchForm.pageNumber = 1;
                // this.searchForm.startDate = null;
                // this.searchForm.endDate = null;
                // this.date = "当日";
                // this.searchForm.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                // this.searchForm.endDate = null;
                if (v == '未审') {
                    this.searchForm.isPass = 4;
                    this.inputSearchChange("");
                } else if (v == '已审') {
                    this.searchForm.isPass = 5;
                    this.inputSearchChange("");
                }
            },
            pick(e) {
                this.personData = [];
                if (e == '自定义') {
                    this.resetSearchForm();
                    this.datePickerShow = true;
                } else if (e == '当日') {
                    this.resetSearchForm();
                    this.searchForm.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    this.searchForm.endDate = null;
                    this.inputSearchChange("");
                } else if (e == '当月') {
                    this.resetSearchForm();
                    this.searchForm.endDate = formartDate(new Date(), 'yyyy-MM-dd  HH:mm:ss');
                    this.searchForm.startDate = null;
                    this.inputSearchChange("");
                } else if (e == "重置") {
                    this.resetSearchForm();
                }
            },
            //人员日期查询
            datePickerChange(e) {
                this.personData = [];
                if (e) {
                    this.searchForm.startDate = e[0];
                    var dateTime = new Date(e[1]);
                    dateTime = dateTime.setDate(dateTime.getDate() + 1);
                    this.searchForm.endDate = new Date(dateTime);
                    this.inputSearchChange("");
                }

            },

            //人员日期查询
            datePickerEndTime(e){
                if (e) {
                    let endTime = new Date(e);
                    endTime.setHours(23, 59, 59, 999);
                    endTime = endTime.setDate(endTime.getDate());
                    this.searchForm.endDate = formatDate(new Date(endTime), 'yyyy-MM-dd HH:mm:ss');

                }
                this.inputSearchChange();
            },

            //人员日期查询
            datePickerStartTime(e) {
                if (e){
                    let startTime = new Date(e);
                    startTime.setHours(0, 0, 0, 0);
                    startTime = startTime.setDate(startTime.getDate());
                    this.searchForm.startDate = formatDate(new Date(startTime), 'yyyy-MM-dd HH:mm:ss');

                }
                this.inputSearchChange();
            },


            resetSearchForm(e) {
                this.searchForm.pageNumber = 1;
                this.searchForm.keyword = "";
                this.searchForm.unitId = "";
                this.searchForm.personName = "";
                this.searchForm.testNum = "";
                this.searchForm.dept = "";
                if(e){
                    this.date = e;
                }
                if (this.date == "重置") {
                    let _this = this;
                    setTimeout(function () {
                        _this.date = "当日";
                        if (!_this.$hospitalName.queryTimeChange){
                            let date  = getMonthString(new Date());
                            if(date!=null && date.length == 2){
                                _this.searchForm.startDate = date[0]+ " 00:00:00";
                                _this.searchForm.endDate = date[1]+ " 23:59:59";
                            }
                        }
                        else{
                            _this.searchForm.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                            _this.searchForm.endDate = null;
                        }
                        _this.inputSearchChange("");
                    });

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
                    this.radioValue = this.personAll;
                } else {
                    this.radioValue = [];
                }
            },
            //人员选择
            peopleChange(data) {
                if (data.length === this.personAll.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
                if (data.length > 0) {
                    this.ids = [];
                    if (this.typeStatus && this.$refs.templateShow.tabsClickIndex==1){
                        for (let i = 0; i < this.personData.length ; i++) {
                            this.ids.push(this.personData[i].firstPersonId);
                        }
                    } else {
                        this.radioValue = data;
                    }
                } else {
                    this.$Message.info("请选择人员");
                }
            },

            //取消总检
            cancelGeneralInspection() {
                if (this.radioValue.length <= 0) {
                    this.$Message.warning('您还未选择要取消总检的人员');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认审核',
                    content: '您确认要取消总检所选的 ' + this.radioValue.length + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.radioValue.forEach(function (e) {
                            ids.push(e);
                        });
                        if (!this.typeStatus) {
                            cancelGeneralInspectionById(ids).then(res => {
                                if (res.success) {
                                    this.$Modal.remove();
                                    this.$Message.success('取消总检成功');
                                    this.inputSearchChange("");
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.error(res.msg);
                                }
                            }).catch(res => {
                                this.$Message.error(res.msg);
                                this.$Modal.remove();
                            })
                        } else {
                            cancelGeneralInspectionByIdStatus(ids).then(res => {
                                if (res.success) {
                                    this.$Modal.remove();
                                    this.$Message.success('取消总检成功');
                                    this.inputSearchChange("");
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.error(res.msg);
                                }
                            }).catch(res => {
                                this.$Message.error(res.msg);
                                this.$Modal.remove();
                            })
                        }
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },

            //审核记录
            approve() {
                if (this.radioValue.length <= 0) {
                    this.$Message.warning('您还未选择要审核的人员');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认审核',
                    content: '您确认要审核所选的 ' + this.radioValue.length + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.radioValue.forEach(function (e) {
                            ids.push(e);
                        });
                        if(!this.typeStatus){
                            updateTGroupPersonById(ids).then(res => {
                                if (res.success) {
                                    this.$Modal.remove();
                                    this.$Message.success('审核成功');
                                    this.inputSearchChange("");
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.error(res.msg);
                                }
                            }).catch(res => {
                                this.$Message.error(res.msg);
                                this.$Modal.remove();
                            })
                        }else{
                            updateTGroupPersonByIdTypeStatus(ids).then(res => {
                                if (res.success) {
                                    this.$Modal.remove();
                                    this.$Message.success('审核成功');
                                    this.inputSearchChange("");
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.error(res.msg);
                                }
                            }).catch(res => {
                                this.$Message.error(res.msg);
                                this.$Modal.remove();
                            })
                        }
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            //退回记录
            approveEXE() {
                if (this.radioValue.length <= 0) {
                    this.$Message.warning('您还未选择要退回的人员');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认退回',
                    content: '您确认要退回所选的 ' + this.radioValue.length + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.radioValue.forEach(function (e) {
                            ids.push(e);
                        });
                        if(!this.typeStatus){
                            updateTGroupPersonByIdRetreat(ids).then(res => {
                                if (res.success) {
                                    this.$Modal.remove();
                                    this.$Message.success('退回成功');
                                    this.inputSearchChange("");
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.error(res.msg);
                                }
                            }).catch(res => {
                                this.$Message.error(res.msg);
                                this.$Modal.remove();
                            })
                        }else{
                            updateTGroupPersonByIdRetreatTypeStatus(ids).then(res => {
                                if (res.success) {
                                    this.$Modal.remove();
                                    this.$Message.success('退回成功');
                                    this.inputSearchChange("");
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.error(res.msg);
                                }
                            }).catch(res => {
                                this.$Message.error(res.msg);
                                this.$Modal.remove();
                            })
                        }
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            changeExpand() {
                this.expand = !this.expand;
                if (this.expand) {
                    this.expandIcon = "ios-arrow-back";
                    this.span = 'position: relative;width: calc(100% - 332px);';
                    this.leftSpan = 'width: 300px;'
                } else {
                    this.expandIcon = "ios-arrow-forward";
                    this.span = 'position: relative;width: calc(100% - 32px);';
                    this.leftSpan = 'width: 0px;';
                }
            },
            //人员点击
            radioChooseClick(id) {
                this.isRadioChecked = id;
            },
            //人员查询
            inputSearchChange(e) {
                let _this = this;
                this.checkPersonLoading = true;
				this.personAll = [];
                this.searchForm.physicalType = this.physicalType;
				//输入了就不带时间
                /*if((this.searchForm.keyword && this.searchForm.keyword.trim().length>0) || (this.searchForm.personName && this.searchForm.personName.trim().length>0) || (this.searchForm.testNum && this.searchForm.testNum.trim().length>0) || (this.searchForm.dept && this.searchForm.dept.trim().length>0)){
                    this.searchForm.startDate = null;
                    this.searchForm.endDate = null;
                    this.date = '';//取消时间筛选
                }*/
                let searchForm = JSON.parse(JSON.stringify(this.searchForm));
				if(searchForm.startDate ){
					searchForm.startDate = formatDate(searchForm.startDate, 'yyyy-MM-dd HH:mm:ss');
				}
				if(searchForm.endDate ){
					searchForm.endDate = formatDate(searchForm.endDate , 'yyyy-MM-dd HH:mm:ss');
					searchForm.endDate = searchForm.endDate.replace(" 00:00:00"," 23:59:59");
				}
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
                if(!this.typeStatus){
                    getTGroupPersonInspection(searchForm).then(res => {
                        if (res.success) {
                            this.personData = res.data.records;
                            this.groupDataTotal = res.data.total;
                            if (this.personData.length > 0) {
                                this.isRadioChecked = "";
                                if(this.isShowFirstPersonInfo) {
                                    this.isRadioChecked = this.personData[0].id;
                                }
                                this.radioValue = [];
                                for (let i = 0; i < this.personData.length; i++) {
                                    this.personAll.push(this.personData[i].id);
                                }
                                if(this.isShowFirstPersonInfo) {
                                    setTimeout(() => {
                                        this.radioValue.push(this.personData[0].id);
                                    }, 100)
                                }
                            }else{
                                _this.personIds = [];
                                _this.isTemplateShow = true;
                                _this.isRadioChecked = "";
                            }
                        }
                    }).finally(() => {
                        _this.checkPersonLoading = false;
                    });
                }else{
                    getTGroupPersonInspectionTypeStatus(searchForm).then(res => {
                        if (res.success) {
                            this.personData = res.data.records;
                            this.groupDataTotal = res.data.total;
                            if (this.personData.length > 0) {
                                this.isRadioChecked = "";
                                if(this.isShowFirstPersonInfo) {
                                    this.isRadioChecked = this.personData[0].id;
                                }
                                this.radioValue = [];
                                for (let i = 0; i < this.personData.length; i++) {
                                    this.personAll.push(this.personData[i].id);
                                }
                                if(this.isShowFirstPersonInfo) {
                                    setTimeout(() => {
                                        this.radioValue.push(this.personData[0].id);
                                    }, 100)
                                }
                            }else{
                                this.personIds = [];
                                this.isTemplateShow = true;
                                this.isRadioChecked = "";
                            }
                        }
                    }).finally(() => {
                        this.checkPersonLoading = false;
                    });
                }
            },
            inputSearchChangeUitId() {
                this.searchForm.physicalType = this.physicalType;
                getTGroupPersonInspection(this.searchForm).then(res => {
                    if (res.success) {
                        this.personData = res.data.records;
                        this.groupDataTotal = res.data.total;
                        if (this.personData.length > 0) {
                            this.isRadioChecked = "";
                            if(this.isShowFirstPersonInfo) {
                                this.isRadioChecked = this.personData[0].id;
                            }
                        }
                    }
                });
            },
            //下拉加载更多
            handleReachBottom() {
                this.checkPersonLoading = true;
                this.searchForm.pageNumber = parseInt(this.searchForm.pageNumber) + 1;
                getTGroupPersonInspection(this.searchForm).then(res => {
                    if (res.success) {
                        this.personData.concat(res.data.records);
                        if (res.data.records.length > 0) {
                            for (let i = 0; i < res.data.records.length; i++) {
                                this.personAll.push(res.data.records[i].id);
                            }
                        }
                    }
                }).finally(() => {
                    this.checkPersonLoading = false;
                });
            },
            /**
             * 关闭loading
             */
            closeLoading() {
                this.loading = false;
            },
            personChangePageNum(v) {
                this.searchForm.pageNumber = v;
                this.inputSearchChange('');
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.inputSearchChange('');
            },
            //查询弃检项目
            queryRelationPersonProjectCheckAll(){
                let _this = this;
                queryRelationPersonProjectCheckAll({personId:_this.personId,state:2}).then(res => {
                    if (res.success) {
                        _this.abandonInspectionIdData = [];
                        for(let i = 0;i < res.data.length;i ++){
                            _this.abandonInspectionIdData.push(res.data[i].orderGroupItemId)//弃检项目id
                        }
                    }
                });
            },
            /**
             * 打印告知书
             * */
            noticePrint(){
                if (this.radioValue.length <= 0) {
                    this.$Message.warning('您还未选择要打印的人员');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认打印',
                    content: '您确认要打印所选的 ' + this.radioValue.length + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.radioValue.forEach(function (e) {
                            ids.push(e);
                        });
                        this.$Modal.remove();
                        this.templateShowMethod(ids);
                        this.loading = true;
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            batchPrintSelect(){
                this.batchPrint();
                /*if(this.tabsClickIndex == 0){
                    this.batchPrint();
                }else if(this.tabsClickIndex == 1){
                    this.noticePrint();
                }*/
            },
            /**
             * 打印确认
             * */
            confirmPrintSelect(){
                if (this.radioValue.length <= 0) {
                    this.$Message.warning('您还未选择要确认的人员');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认已打印',
                    content: '您确认所选的 ' + this.radioValue.length + '条数据已打印?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.radioValue.forEach(function (e) {
                            ids.push(e);
                        });
                        if(!this.typeStatus){
                            updateTPrintStateById(ids).then(res => {
                                if (res.success) {
                                    this.$Modal.remove();
                                    this.$Message.success('确认成功');
                                    this.inputSearchChange("");
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.error(res.msg);
                                }
                            }).catch(res => {
                                this.$Message.error(res.msg);
                                this.$Modal.remove();
                            })
                        }else{
                            updateTPrintStateByIdTypeStatus(ids).then(res => {
                                if (res.success) {
                                    this.$Modal.remove();
                                    this.$Message.success('确认成功');
                                    this.inputSearchChange("");
                                } else {
                                    this.$Modal.remove();
                                    this.$Message.error(res.msg);
                                }
                            }).catch(res => {
                                this.$Message.error(res.msg);
                                this.$Modal.remove();
                            })
                        }
                        this.loading = false;
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            /**
             * 批量打印
             * */
            batchPrint(){
                if (this.radioValue.length <= 0) {
                    this.$Message.warning('您还未选择要打印的人员');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认打印',
                    content: '您确认要打印所选的 ' + this.radioValue.length + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.radioValue.forEach(function (e) {
                            ids.push(e);
                        });
                        this.templateShowMethod(ids);
                        this.loading = true;
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },
            //报告展示
            templateShowMethod(ids){
                this.isBatchPrint = true;
                if (this.ids.length > 0 && this.typeStatus && this.$refs.templateShow.tabsClickIndex==1){
                    this.personIds = this.ids;
                }else {
                    this.personIds = ids;
                }

                this.isTemplateShow = true;
                this.taskNow = "";
            },
            //处理报告数据(封面)
            batchHandDatafirstPage(datas){
                let _this = this;
                if(datas == undefined || datas ==null || datas.length == 0){
                    this.$Message.info('获取报告结果失败，请联系管理员');
                    return;
                }
                let batchData = [];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    if (data !=undefined && data != null &&  data.mapPerson !=undefined) {
                        let personInfo = data.mapPerson;
                        personInfo.orderGroupData = data.orderGroup ;
                        let departItemResults = "";
                        let tabItems = "";

                        let tabPanes = [];
                        let templateId = "";
                        if(this.physicalType == '职业体检' || this.physicalType == '放射体检'){
                            templateId = "dec3b3e9294f1a169b891390984124e5";
                        }else{
                            templateId = "896641a6df5a731abe2e725dd12b9c6f";
                        }
                        tabPanes.push({
                            "name": "封面",
                            "templateId": templateId,
                            "id": "",
                            "type": "封面",
                            "baseProjectId": "",
                            "departResultId": "",
                            "groupItemId": "",
                            "checkSign": "",
                            "healthCheckup": [],
                            "opinion": "",//小结
                            "inspectResult": "",//影像所见(诊断提醒)
                            "isShow": true,
                        });


                        //检查分项的
                        if (tabPanes && tabPanes.length > 0) {
                            let wordData = [];
                            tabPanes.forEach(function(element) {
                                let resData =  templateJs.dataInit(_this,element.templateId,element.baseProjectId,element.type,personInfo.physical_type,personInfo,tabItems,element.name,element.groupItemId,element.opinion,element.inspectResult,element.checkSign,departItemResults,element.healthCheckup,element.isShow);
                                let templateData = JSON.parse(resData.templateData);

                                //医院全称
                                templateData.hospitalName = _this.$hospitalName.name;

                                resData.templateData = JSON.stringify(templateData);
                                wordData.push(resData);
                            });
                            //处理数据匹配模板
                            batchData.push({wordData: wordData, personId: personInfo.id,personName: personInfo.person_name}) ;
                        }
                    }
                }

                return batchData;
            },
            //处理报告数据(告知书)
            batchHandDataNotice(datas){
                let _this = this;
                if(datas == undefined || datas ==null || datas.length == 0){
                    this.$Message.info('获取报告结果失败，请联系管理员');
                    return;
                }
                let batchData = [];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    if (data !=undefined && data != null &&  data.mapPerson !=undefined) {
                        let personInfo = data.mapPerson;
                        personInfo.orderGroupData = data.orderGroup ;
                        let departItemResults = "";
                        let tabItems = "";

                        let tabPanes = [];
                        tabPanes.push({
                            "name": "告知书",
                            "templateId": "5a92f1958c0d5acf1f74ef2db960c5a5",
                            "id": "",
                            "type": "告知书",
                            "baseProjectId": "",
                            "departResultId": "",
                            "groupItemId": "",
                            "checkSign": "",
                            "healthCheckup": [],
                            "opinion": "",//小结
                            "inspectResult": "",//影像所见(诊断提醒)
                            "isShow": true,
                        });


                        //检查分项的
                        if (tabPanes && tabPanes.length > 0) {
                            let wordData = [];
                            tabPanes.forEach(function(element) {
                                let resData =  templateJs.dataInit(_this,element.templateId,element.baseProjectId,element.type,personInfo.physical_type,personInfo,tabItems,element.name,element.groupItemId,element.opinion,element.inspectResult,element.checkSign,departItemResults,element.healthCheckup,element.isShow);
                                let templateData = JSON.parse(resData.templateData);

                                //医院全称
                                templateData.hospitalName = _this.$hospitalName.name;

                                resData.templateData = JSON.stringify(templateData);
                                wordData.push(resData);
                            });
                            //处理数据匹配模板
                            batchData.push({wordData: wordData, personId: personInfo.id,personName: personInfo.person_name}) ;
                        }
                    }
                }

                return batchData;
            },
            //处理报告数据(首页封面)
            batchHandFirstFM(datas){
                let _this = this;
                if(datas == undefined || datas ==null || datas.length == 0){
                    this.$Message.info('获取报告结果失败，请联系管理员');
                    return;
                }
                let batchData = [];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    if (data !=undefined && data != null &&  data.mapPerson !=undefined) {
                        let personInfo = data.mapPerson;
                        personInfo.orderGroupData = data.orderGroup ;
                        let abandonInspectionIdData = [];
                        if (data.mapPerson.personProjectCheck) {

                            for(let i = 0;i < data.mapPerson.personProjectCheck.length;i ++){
                                abandonInspectionIdData.push(data.mapPerson.personProjectCheck[i].orderGroupItemId)//弃检项目id
                            }
                        }
                        let workStateText = "";
                        if (personInfo.work_state_text) {
                            workStateText = personInfo.work_state_text;//监护种类(在岗状态)
                        }
                        let templateId = "";
                        let templateTGId = "";
                        let templateYKId = "";
                        let templateIdWzk = "";
                        let physicalType = personInfo.physical_type;
                        if (physicalType == "健康体检") {
                            templateId = "fe91d48556bc54ae224beebcbaece476";
                            templateTGId = "6e53c87e7d7cea49245ee99ab95dc385";
                            templateYKId = "676c51485eab4a822ff91c635a1debd8";
                        }else if (physicalType == "职业体检") {
                            templateId = "6adc35bad272d6d87d802290cb103db7";
                            templateTGId = "67cf79eb6b0e8a9c783b71f69b0fb2bd";
                            templateYKId = "b144ea3b9afefe990cf4835c7e2475e6";
                            if(workStateText == "上岗前" || workStateText.indexOf("上岗前") > -1){
                                templateIdWzk = "5df05fdececfeca4b15a80571716a061";
                            }else{
                                templateIdWzk = "fa087787c20db9caf85026779e7ff77c";
                            }
                        }else if(physicalType == "放射体检"){
                            templateId = "9790f68f599ac47f5aa4559e818d8142";
                            templateTGId = "67cf79eb6b0e8a9c783b71f69b0fb2bd";
                            // templateYKId = "b144ea3b9afefe990cf4835c7e2475e6";
                            templateYKId = "7ec4ff0959974faf2eb0785fdf9f0812";
                            if(workStateText == "上岗前" || workStateText.indexOf("上岗前") > -1){
                                templateIdWzk = "840a45a8505f9d2a8b45d19a84aad90e";
                            }else{
                                templateIdWzk = "f4f7667c1afe0fc072cfe67834faa4b2";
                            }
                        }
                        let tabPanes = [];
                        let healthy = {
                            "name": "体格检查",
                            "templateId": templateTGId,
                            "id": "",
                            "type": "体格检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let eyeData = {
                            "name": "眼科检查",
                            "templateId": templateYKId,
                            "id": "",
                            "type": "眼科检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let fkData = {
                            "name": "妇科检查",
                            "templateId": "82309fe7c1ff6cfc117d60dd8fca5b1d",
                            "id": "",
                            "type": "妇科检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let tgfxData = {
                            "name": "分项汇总",
                            "templateId": "29e4fdfce7872e1e4e9b7df631d7013b",
                            "id": "",
                            "type": "分项汇总",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        if (physicalType && physicalType == "健康体检") {
                            tabPanes.push({
                                "name": "首页封面",
                                "templateId": "fe91d48556bc54ae224beebcbaece476",
                                "id": "",
                                "type": "首页封面",
                                "baseProjectId": "",
                                "healthCheckup": []
                            }, {
                                "name": "医学申明",
                                "templateId": "eab2a5038638c33d2f20f0c0ff5e59c1",
                                "id": "",
                                "type": "体检须知",
                                "baseProjectId": ""
                            })
                            let conclusionTemplateId = "bbff5be6d0c0f92f63e812f843628ac0"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "c159055269e6b64c7f1451ad28c5b545";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "healthCheckup": []
                            });
                        } else if (physicalType && physicalType == "职业体检") {
                            tabPanes.push({
                                "name": "首页封面",
                                "templateId": "6adc35bad272d6d87d802290cb103db7",
                                "id": "",
                                "type": "首页封面",
                                "baseProjectId": "",
                                "healthCheckup": []
                            }, {
                                "name": "说明",
                                "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                "id": "",
                                "type": "说明",
                                "baseProjectId": ""
                            })
                            let conclusionTemplateId = "8160f89d69ddb5b18f2b8f9ccd67fa28"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "b55ff67fcd359b1a1a845748c033ce06";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "healthCheckup": []
                            }, {
                                "name": "问诊科检查表",
                                "templateId": templateIdWzk,
                                "id": "",
                                "type": "问诊科检查表",
                                "baseProjectId": ""
                            });
                        } else if (physicalType && physicalType == "放射体检") {
                            tabPanes.push({
                                "name": "首页封面",
                                "templateId": "9790f68f599ac47f5aa4559e818d8142",
                                "id": "",
                                "type": "首页封面",
                                "baseProjectId": "",
                                "healthCheckup": []
                            }, {
                                "name": "说明",
                                "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                "id": "",
                                "type": "说明",
                                "baseProjectId": ""
                            })
                            let conclusionTemplateId = "2209519a9c327c9be267aa7d54ef2d51"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "b55ff67fcd359b1a1a845748c033ce06";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "healthCheckup": []
                            }, {
                                "name": "问诊科检查表",
                                "templateId": templateIdWzk,
                                "id": "",
                                "type": "问诊科检查表",
                                "baseProjectId": ""
                            });
                        }
                        let groupItemIds = [];
                        let groupItemIdsEye = [];
                        let groupItemIdsFK = [];
                        let groupItemIdsTGFX = [];
                        let healthCheckup = ["皮肤科常规(职业)","皮肤科常规(从业)","皮肤科常规（职业）","皮肤科常规（从业）","一般检查(职业)", "一般检查(健康)", "耳科常规(职业)", "耳鼻喉口腔常规（职业）", "耳鼻喉口腔常规(职业)", "耳鼻喉口腔常规(健康)", "内科常规(职业)", "内科常规(健康)", "外科检查(职业)", "外科常规(健康)", "神经系统", "神经系统(职业)", "神经系统(健康)", "体格检查", "血压"];
                        let healthCheckupEye = ["眼科", "眼科常规(视力)","眼科常规(职业)", "眼科常规（视力）", "眼科常规（色觉）", "眼科常规（色觉、视力）", "眼科常规(健康)"];
                        let healthCheckupFK = ["妇科", "妇科查体", "妇科常规", "妇科检查", "宫颈癌筛查", "白带常规", "宫颈刮片"];
                        let healthCheckupTGFX = ["皮肤科常规(职业)","一般检查","耳科听力常规","皮肤科常规(从业)","皮肤科常规（职业）","皮肤科常规（从业）","一般检查(职业)", "一般检查(健康)", "耳科常规(职业)", "耳鼻喉口腔常规（职业）", "耳鼻喉口腔常规(职业)", "耳鼻喉口腔常规(健康)", "内科常规(职业)", "内科常规(健康)", "外科检查(职业)", "外科常规(健康)", "神经系统", "神经系统(职业)", "神经系统(健康)", "体格检查", "血压"];

                        /*模板 按科室 排序展示*/
                        /*let tabItemsData = [];
                        //检验科
                        let dataJYK = data.departResults.filter(item => item.officeName.indexOf("检验科") > -1);
                        //心电图
                        let dataXDT = data.departResults.filter(item => item.officeName.indexOf("心电图") > -1);
                        //电测听
                        let dataCYCT = data.departResults.filter(item => item.officeName.indexOf("电测听") > -1);
                        //彩超
                        let dataBC = data.departResults.filter(item => item.officeName.indexOf("彩超") > -1);
                        //DR
                        let dataDR = data.departResults.filter(item => item.officeName.indexOf("DR") > -1);
                        //CT
                        let dataCT = data.departResults.filter(item => item.officeName.indexOf("CT") > -1);
                        //肺功能
                        let dataFGN = data.departResults.filter(item => item.officeName.indexOf("肺功能") > -1);
                        //其他科室
                        let dataOthers = data.departResults.filter(item => item.officeName.indexOf("肺功能") <= -1 && item.officeName.indexOf("CT") <= -1 && item.officeName.indexOf("DR") <= -1 && item.officeName.indexOf("彩超") <= -1 && item.officeName.indexOf("电测听") <= -1 && item.officeName.indexOf("心电图") <= -1 && item.officeName.indexOf("检验科") <= -1);
                        //组合项目数据录入 顺序(检验科、心电图、电测听、彩超、DR、CT、肺功能、其他科室)
                        dataJYK.forEach(item => {
                            if(item.groupItemName.indexOf("血常规") > -1){
                                tabItemsData.push(item);
                            }
                        });
                        dataJYK.forEach(item => {
                            if(item.groupItemName.indexOf("尿常规") > -1){
                                tabItemsData.push(item);
                            }
                        });
                        dataJYK.forEach(item => {
                            if(item.groupItemName.indexOf("肝肾功") > -1){
                                tabItemsData.push(item);
                            }
                        });
                        dataJYK.forEach(item => {
                            if(item.groupItemName.indexOf("血糖") > -1){
                                tabItemsData.push(item);
                            }
                        });
                        dataJYK.forEach(item => {
                            if(item.groupItemName.indexOf("血常规") <= -1 && item.groupItemName.indexOf("尿常规") <= -1 && item.groupItemName.indexOf("肝肾功") <= -1 && item.groupItemName.indexOf("血糖") <= -1){
                                tabItemsData.push(item);
                            }
                        });
                        dataXDT.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataCYCT.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataBC.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataDR.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataCT.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataFGN.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataOthers.forEach(item => {
                            tabItemsData.push(item);
                        });*/

                        let tabItems = data.departResults;
                        // let tabItems = tabItemsData;
                        let departItemResults = data.departItemResults;
                        let arrNew = [];
                        if (tabItems && tabItems.length > 0) {
                            for (let i = 0; i < tabItems.length; i++) {
                                if (tabItems[i] && tabItems[i].groupItemId && abandonInspectionIdData.indexOf(tabItems[i].groupItemId) <= -1) {

                                    if(tabItems[i].checkSignPath && tabItems[i].checkSignPath.indexOf("/dcm") > -1){
                                        tabItems[i].checkSign = tabItems[i].checkSignPath;
                                    }

                                    //复检的先不到报告里
                                    if (tabItems[i].groupItemName.indexOf("复") > -1) {
                                        let isShowReview = _this.$hospitalName.isShowReview;//是否展示复查报告
                                        if(!isShowReview){
                                            continue;
                                        }
                                    }
                                    //获取 分项汇总 检查结果数据(总览)
                                    let officeName = tabItems[i].officeName;//科室名称
                                    if(officeName){
                                        officeName = tabItems[i].officeName.trim();//科室名称
                                    }
                                    let groupItemName = tabItems[i].groupItemName;//项目名称
                                    if(groupItemName){
                                        groupItemName = tabItems[i].groupItemName.trim();
                                    }
                                    //DR、CT、彩超只展示一张报告
                                    if(officeName && tabPanes && groupItemName && groupItemName.indexOf("复") <= -1){
                                        if(officeName.indexOf("DR") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                let groupItemNameNow = item.name;
                                                if(officeNameNow && officeNameNow.indexOf("DR") > -1 && groupItemNameNow && groupItemNameNow.indexOf("胸") > -1 && groupItemName.indexOf("胸") > -1){
                                                    item.name += "、" + groupItemName;//DR项目名称合并
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }
                                        /*if(officeName.indexOf("CT") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                if(officeNameNow && officeNameNow.indexOf("CT") > -1){
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }
                                        if(officeName.indexOf("彩超") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                if(officeNameNow && officeNameNow.indexOf("彩超") > -1){
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }*/
                                    }
                                    let dataOfficeFXHZ = ["一般检查", "五官科","耳鼻喉科", "口腔科", "眼科", "内科", "外科", "皮肤科", "妇科", "肺功能", "电测听", "心电图"];//分项汇总 科室名称集
                                    let dataOfficeBoth = ["心电图", "肺功能", "电测听", "五官科","耳鼻喉科", "口腔科", "眼科"];//分项汇总和后面详细报告 都有的 科室名称集
                                    let dataGroupNameYC = ["口腔定位检查"];//牙齿画十字线(五官科、口腔科) 项目名称集
                                    if (dataOfficeFXHZ.indexOf(officeName) > -1) {
                                        groupItemIdsTGFX.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        if(dataOfficeBoth.indexOf(officeName) > -1 || groupItemName.indexOf("眼科") > -1 || dataGroupNameYC.indexOf(groupItemName) > -1 || groupItemName.indexOf("口腔定位") > -1){
                                            //继续执行
                                        }else{
                                            continue;
                                        }
                                    }
                                    //获取 体格检查 检查结果数据(详细)
                                    let dataOfficeTG = ["一般检查", "五官科","耳鼻喉科", "口腔科", "内科", "外科", "皮肤科"]
                                    if (dataOfficeTG.indexOf(officeName) > -1) {
                                        groupItemIds.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        if(groupItemName.indexOf("眼科") > -1 || dataGroupNameYC.indexOf(groupItemName) > -1 || groupItemName.indexOf("口腔定位") > -1){
                                            //继续执行
                                        }else{
                                            continue;
                                        }
                                    }
                                    //获取 眼科检查 检查结果数据(详细)
                                    if (groupItemName.indexOf("眼科") > -1 || officeName.indexOf("眼科") > -1) {
                                        groupItemIdsEye.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        continue;
                                    }
                                    //获取 妇科检查 检查结果数据(详细)
                                    if (officeName.indexOf("妇科") > -1) {
                                        groupItemIdsFK.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        continue;
                                    }
                                    //心电图图片不展示
                                    if(officeName.indexOf("心电图") > -1 && !_this.isShowZoncareImg){
                                        continue;
                                    }
                                    //其他化验项目 检查结果数据(生化合并)
                                    if(groupItemName && groupItemName.indexOf("肺功能") > -1 && this.isNotShowFGN){
                                        continue;
                                    }else{
                                        tabPanes.push({
                                            "name": tabItems[i].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": tabItems[i].portfolioProjectId,
                                            "departResultId": tabItems[i].id,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "healthCheckup": [],
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                            "officeName": officeName,//所属科室
                                            "isShow": true,//是否显示基本信息
                                        });
                                    }

                                    /*if(officeName.indexOf("检验科") > -1 && groupItemName.indexOf("尿常规") <= -1 && groupItemName.indexOf("血常规") <= -1 && groupItemName.indexOf("复") <= -1){
                                        let departItemResultsNow = _this.departItemResults.filter(ii => ii.orderGroupItemId == tabItems[i].groupItemId);
                                        departItemResultsNow = this.removeList(departItemResultsNow);
                                        let numberCount = departItemResultsNow.length
                                        if(numberCount >= 20){
                                            tabItems.push({
                                                "name": tabItems[i].groupItemName,
                                                "templateId": "",
                                                "id": "",
                                                "type": "分项报告",
                                                "baseProjectId": tabItems[i].portfolioProjectId,
                                                "departResultId": tabItems[i].id,
                                                "groupItemId": tabItems[i].groupItemId,
                                                "checkSign": tabItems[i].checkSign,
                                                "healthCheckup": [],
                                                "opinion": tabItems[i].diagnoseSum,//小结
                                                "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                                "officeName": officeName,//所属科室
                                                "isShow": false,//是否显示基本信息
                                            });
                                        }else{
                                            arrNew.push({
                                                index: i,
                                                count: numberCount,
                                            })
                                        }
                                    }else{
                                        tabPanes.push({
                                            "name": tabItems[i].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": tabItems[i].portfolioProjectId,
                                            "departResultId": tabItems[i].id,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "healthCheckup": [],
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                            "officeName": officeName,//所属科室
                                            "isShow": false,//是否显示基本信息
                                        });
                                    }*/
                                }

                            }
                        }
                        let tabItemsAdd = [];
                        if(arrNew && arrNew.length > 0){
                            let groupItemIds = [];
                            let count = 0;
                            let intNew = 0;
                            for(let n = 0;n < arrNew.length;n ++){
                                let countNow = count + arrNew[n].count;
                                if(countNow < 25){
                                    count += arrNew[n].count;
                                    let int = arrNew[n].index;
                                    intNew = int;
                                    groupItemIds.push(tabItems[int].groupItemId);
                                    if(n == arrNew.length - 1){
                                        tabItemsAdd.push({
                                            "name": tabItems[int].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": "",
                                            "departResultId": "",
                                            "groupItemId": groupItemIds,
                                            "checkSign": tabItems[int].checkSign,
                                            "healthCheckup": [],
                                            "opinion": "",//小结
                                            "inspectResult": "",//影像所见(诊断提醒)
                                            "officeName": "检验科",//所属科室
                                            "isShow": false,//是否显示基本信息
                                        })
                                    }
                                }else{
                                    tabItemsAdd.push({
                                        "name": tabItems[intNew].groupItemName,
                                        "templateId": "",
                                        "id": "",
                                        "type": "分项报告",
                                        "baseProjectId": "",
                                        "departResultId": "",
                                        "groupItemId": groupItemIds,
                                        "checkSign": tabItems[intNew].checkSign,
                                        "healthCheckup": [],
                                        "opinion": "",//小结
                                        "inspectResult": "",//影像所见(诊断提醒)
                                        "officeName": "检验科",//所属科室
                                        "isShow": false,//是否显示基本信息
                                    })
                                    groupItemIds = [];
                                    count = 0;
                                    count += arrNew[n].count;
                                    let int = arrNew[n].index;
                                    intNew = int;
                                    groupItemIds.push(tabItems[int].groupItemId);
                                }
                            }
                        }
                        if(tabItemsAdd && tabItemsAdd.length > 0){
                            for(let i = 0;i < tabPanes.length;i ++){
                                if(tabPanes[i].officeName && tabPanes[i].officeName.indexOf("检验科") > -1 && tabPanes[i+1].officeName && tabPanes[i+1].officeName.indexOf("检验科") <= -1){
                                    let intNow = i + 1;
                                    for(let j = 0;j < tabItemsAdd.length;j ++){
                                        tabPanes.splice(intNow, 0, tabItemsAdd[j]);
                                        intNow ++;
                                    }
                                    break;
                                }
                            }
                        }
                        //检验科 仅保留首页基本信息
                        for(let i = 0;i < tabPanes.length;i ++){
                            if(tabPanes[i].officeName && tabPanes[i].officeName.indexOf("检验科") > -1){
                                tabPanes[i].isShow = true;
                                break;
                            }
                        }
                        if (physicalType && physicalType == "健康体检") {
                            let startPage;
                            /*if(_this.isShowPage){
                                startPage = 4;
                            }else{
                                startPage = 1;
                            }*/
                            startPage = 4;
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }
                            // if(groupItemIdsFK.length > 0){
                            // 	fkData.healthCheckup = groupItemIdsFK;//妇科检查
                            // 	int ++;
                            // 	tabPanes.splice(int, 0, fkData);
                            // }
                            if(_this.isShowGuidancePage){
                                tabPanes.push({
                                    "name": "常见病保健指导",
                                    "templateId": "357fdd2cb29bd0ddcd87e2302ab75573",
                                    "id": "",
                                    "type": "常见病保健指导",
                                    "baseProjectId": ""
                                });
                            }
                            if(_this.isSplitConclusion){
                                tabPanes.push({
                                    "name": "健康-检查结果及处理意见",
                                    "templateId": "0fbb068c1790cb2e03b42943128cecab",
                                    "id": "",
                                    "type": "健康-检查结果及处理意见",
                                    "baseProjectId": ""
                                });
                            }
                            /*if(_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                tabPanes.push({
                                    "name": "尾页封面",
                                    "templateId": "985a3cecc26f95aecba46114302f5ed3",
                                    "id": "",
                                    "type": "尾页封面",
                                    "baseProjectId": ""
                                })
                            }*/
                        } else if (physicalType && physicalType == "职业体检") {
                            let startPage;
                            /*if(_this.isShowPage){
                                startPage = 4;
                            }else{
                                startPage = 2;
                            }*/
                            startPage = 4;
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }

                            /*if(groupItemIdsFK.length > 0){
                                fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                int ++;
                                tabPanes.splice(int, 0, fkData);
                            }*/
                            if(_this.isSplitConclusion){
                                tabPanes.push({
                                    "name": "职业-检查结果及处理意见",
                                    "templateId": "4e299e600f82e89c369b6e975595c8f7",
                                    "id": "",
                                    "type": "职业-检查结果及处理意见",
                                    "baseProjectId": ""
                                });
                            }
                            /*if(_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                tabPanes.push({
                                    "name": "尾页封面",
                                    "templateId": "f6237ffe58b22870f1ae1e98fe9a8210",
                                    "id": "",
                                    "type": "尾页封面",
                                    "baseProjectId": ""
                                })
                            }*/
                        }else if (physicalType && physicalType == "放射体检") {
                            let startPage;
                            /*if(_this.isShowPage){
                                startPage = 4;
                            }else{
                                startPage = 2;
                            }*/
                            startPage = 4;
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }
                            if(groupItemIdsEye && groupItemIdsEye.length > 0){
                                eyeData.healthCheckup = groupItemIdsEye;//眼科检查
                                tabPanes.splice(int, 0, eyeData);
                            }
                            /*if(groupItemIdsFK.length > 0){
                                fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                int ++;
                                tabPanes.splice(int, 0, fkData);
                            }*/
                            if(_this.isSplitConclusion){
                                tabPanes.push({
                                    "name": "职业-检查结果及处理意见",
                                    "templateId": "4e299e600f82e89c369b6e975595c8f7",
                                    "id": "",
                                    "type": "职业-检查结果及处理意见",
                                    "baseProjectId": ""
                                });
                            }
                            /*if(_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                tabPanes.push({
                                    "name": "尾页封面",
                                    "templateId": "55eebcf1287dee53e68d8003392a0ba3",
                                    "id": "",
                                    "type": "尾页封面",
                                    "baseProjectId": ""
                                })
                            }*/
                        }

                        //检查分项的
                        if (tabPanes && tabPanes.length > 0) {
                            let wordData = [];
                            tabPanes.forEach(function(element) {
                                let resData =  templateJs.dataInit(_this,element.templateId,element.baseProjectId,element.type,personInfo.physical_type,personInfo,tabItems,element.name,element.groupItemId,element.opinion,element.inspectResult,element.checkSign,departItemResults,element.healthCheckup,element.isShow);
                                let templateData = JSON.parse(resData.templateData);

                                //送检医生
                                if (_this.$hospitalName){
                                    if (_this.$hospitalName.isDoctor){
                                        templateData.doctor = _this.$hospitalName.DoctorToBeExamined;
                                    }else {
                                        templateData.doctor = _this.$hospitalName.legalPerson;
                                    }
                                }
                                //医院单位信息(单位地址、邮政编码、联系电话、传真号码、电子邮箱)
                                templateData.hospitalAddress = _this.$hospitalName.hospitalAddress;
                                templateData.zipCode = _this.$hospitalName.zipCode;
                                templateData.hospitalPhone = _this.$hospitalName.hospitalPhone;
                                templateData.faxNumber = _this.$hospitalName.faxNumber;
                                templateData.email = _this.$hospitalName.email;
                                //联系电话(DR、CT、B超)
                                templateData.phone = _this.$hospitalName.hospitalPhone;
                                //模板名称
                                templateData.templateName = _this.$hospitalName.templateName;
                                //医院全称
                                templateData.hospitalName = _this.$hospitalName.name;
                                //报告医生
                                if(_this.$hospitalName.isUserConfigure) {//是否使用这个配置
                                    templateData.reportDoctor = _this.$hospitalName.reportDoctor;
                                }
                                //晶体环状图 base64
                                let base64 = _this.$hospitalName.base64;
                                templateData.jthctImageL = base64[templateData.jthctNumL];
                                templateData.jthctImageR = base64[templateData.jthctNumR];
                                //标本替换
                                let specimenDatas = _this.$hospitalName.specimenDatas;
                                let officeName = "";
                                if(templateData.officeName){
                                    officeName = templateData.officeName;
                                }
                                let name = element.name;
                                if(name.indexOf("复")){
                                    name = name.replace("(复)","");
                                }
                                if(officeName && officeName != "" && officeName.indexOf("检验科") > -1){
                                    if(specimenDatas[name] && specimenDatas[name] != undefined){
                                        templateData.specimen = specimenDatas[name].specimenName;
                                    }else {
                                        if(name.indexOf("血常规") > -1){
                                            templateData.specimen = "全血";
                                        }else if(name.indexOf("尿常规") > -1){
                                            templateData.specimen = "尿液";
                                        }else{
                                            templateData.specimen = "血清";
                                        }
                                    }
                                }
                                //项目名称
                                templateData.projectNamePath = element.name;
                                //模板替换
                                let baseProjectId = resData.baseProjectId;
                                if(officeName.indexOf("检验科") > -1){
                                    if(name.indexOf("血常规") <= -1 && name.indexOf("尿常规") <= -1){
                                        if(name.indexOf("乙肝两对半") > -1){
                                            baseProjectId = "552";//乙肝两对半模板 乙肝两对半
                                        }else{
                                            baseProjectId = "1213";//血清模板 血清ALT
                                        }
                                    }else if(name.indexOf("血常规") > -1){
                                        baseProjectId = "130e9bd972973c03ddbbb227d94a0278";//血常规模板 血常规
                                    }else{
                                        baseProjectId = "954";//尿常规模板 尿常规
                                    }
                                }
                                if(name.indexOf("幽门螺旋杆菌") > -1 && _this.$hospitalName.isShowC14){
                                    baseProjectId = "e4ab65498defd56f073206395afe90cc";
                                }
                                if(!_this.$hospitalName.isShowC14){
                                    templateData.histogramImage = {"x":["参考值","检测结果"],"y":[0,0]};
                                }
                                if(officeName.indexOf("DR室") > -1){
                                    baseProjectId = "1256";//DR模板 胸部正侧位DR（不含片）
                                }
                                if(officeName.indexOf("CT室") > -1){
                                    baseProjectId = "755";//CT模板 胸椎椎体CT平扫（不含片）
                                }
                                if(officeName.indexOf("彩超室") > -1){
                                    baseProjectId = "XXM0156";//彩超模板 肝肾B超
                                }
                                if(officeName.indexOf("肺功能") > -1){
                                    baseProjectId = "1479";//肺功能模板 肺功能(职业)
                                }
                                if(officeName.indexOf("电测听") > -1){
                                    baseProjectId = "1361";//电测听模板 纯音测听
                                }
                                if(officeName.indexOf("口腔科") > -1){
                                    baseProjectId = "4f1a8bb758ae783a6d3c699f63b10832";//口腔科模板 口腔定位检查
                                }
                                if(officeName.indexOf("心电图") > -1){
                                    baseProjectId = "1279";//心电图模板 频谱心电图
                                }

                                let isShowArray = [];
                                if(templateData && templateData.isShow && officeName.indexOf("检验科") > -1){
                                    isShowArray.push({
                                        name: templateData.name,
                                        sex: templateData.sex,
                                        age: templateData.age,
                                        sectionOffice: templateData.sectionOffice,
                                        doctor: templateData.doctor,
                                        specimen: templateData.specimen,
                                        testNum: templateData.testNum,
                                        templateName: templateData.templateName,
                                        reviewName: templateData.reviewName,
                                    });
                                }
                                templateData.isShowArray = isShowArray;

                                resData.baseProjectId = baseProjectId;
                                resData.templateData = JSON.stringify(templateData);
                                wordData.push(resData);
                            });
                            //处理数据匹配模板
                            batchData.push({wordData: wordData, personId: personInfo.id, personName: personInfo.person_name}) ;
                        }
                    }
                }

                return batchData;
            },
            //处理报告数据
            batchHandData(datas){
                let _this = this;
                if(datas == undefined || datas ==null || datas.length == 0){
                    this.$Message.info('获取报告结果失败，请联系管理员');
                    return;
                }
                let batchData = [];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    if (data !=undefined && data != null &&  data.mapPerson !=undefined) {
                        let personInfo = data.mapPerson;
                        personInfo.orderGroupData = data.orderGroup ;
                        let abandonInspectionIdData = [];
                        if (data.mapPerson.personProjectCheck) {

                            for(let i = 0;i < data.mapPerson.personProjectCheck.length;i ++){
                                abandonInspectionIdData.push(data.mapPerson.personProjectCheck[i].orderGroupItemId)//弃检项目id
                            }
                        }
                        let workStateText = "";
                        if (personInfo.work_state_text) {
                            workStateText = personInfo.work_state_text;//监护种类(在岗状态)
                        }
                        let templateId = "";
                        let templateTGId = "";
                        let templateYKId = "";
                        let templateIdWzk = "";
                        let physicalType = personInfo.physical_type;
                        if (physicalType == "健康体检") {
                            templateId = "fe91d48556bc54ae224beebcbaece476";
                            templateTGId = "6e53c87e7d7cea49245ee99ab95dc385";
                            templateYKId = "676c51485eab4a822ff91c635a1debd8";
                        }else if (physicalType == "职业体检") {
                            templateId = "6adc35bad272d6d87d802290cb103db7";
                            templateTGId = "67cf79eb6b0e8a9c783b71f69b0fb2bd";
                            templateYKId = "b144ea3b9afefe990cf4835c7e2475e6";
                            if(workStateText == "上岗前" || workStateText.indexOf("上岗前") > -1){
                                templateIdWzk = "5df05fdececfeca4b15a80571716a061";
                            }else{
                                templateIdWzk = "fa087787c20db9caf85026779e7ff77c";
                            }
                        }else if(physicalType == "放射体检"){
                            templateId = "9790f68f599ac47f5aa4559e818d8142";
                            templateTGId = "67cf79eb6b0e8a9c783b71f69b0fb2bd";
                            // templateYKId = "b144ea3b9afefe990cf4835c7e2475e6";
                            templateYKId = "7ec4ff0959974faf2eb0785fdf9f0812";
                            if(workStateText == "上岗前" || workStateText.indexOf("上岗前") > -1){
                                templateIdWzk = "840a45a8505f9d2a8b45d19a84aad90e";
                            }else{
                                templateIdWzk = "f4f7667c1afe0fc072cfe67834faa4b2";
                            }
                        }
                        let tabPanes = [];
                        let healthy = {
                            "name": "体格检查",
                            "templateId": templateTGId,
                            "id": "",
                            "type": "体格检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let eyeData = {
                            "name": "眼科检查",
                            "templateId": templateYKId,
                            "id": "",
                            "type": "眼科检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let fkData = {
                            "name": "妇科检查",
                            "templateId": "82309fe7c1ff6cfc117d60dd8fca5b1d",
                            "id": "",
                            "type": "妇科检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let tgfxData = {
                            "name": "分项汇总",
                            "templateId": "29e4fdfce7872e1e4e9b7df631d7013b",
                            "id": "",
                            "type": "分项汇总",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        if (physicalType && physicalType == "健康体检") {
                            if(_this.isShowPage) {//首页封面及相关说明
                                tabPanes.push({
                                    "name": "首页封面",
                                    "templateId": "fe91d48556bc54ae224beebcbaece476",
                                    "id": "",
                                    "type": "首页封面",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                }, {
                                    "name": "医学申明",
                                    "templateId": "eab2a5038638c33d2f20f0c0ff5e59c1",
                                    "id": "",
                                    "type": "体检须知",
                                    "baseProjectId": ""
                                }, {
                                    "name": "体检须知",
                                    "templateId": "5796da0621169b42f973386594605303",
                                    "id": "",
                                    "type": "体检须知",
                                    "baseProjectId": ""
                                })
                            }
                            let conclusionTemplateId = "bbff5be6d0c0f92f63e812f843628ac0"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "c159055269e6b64c7f1451ad28c5b545";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "healthCheckup": []
                            });
                        } else if (physicalType && physicalType == "职业体检") {
                            if(_this.isShowPage) {//首页封面及相关说明
                                tabPanes.push({
                                    "name": "首页封面",
                                    "templateId": "6adc35bad272d6d87d802290cb103db7",
                                    "id": "",
                                    "type": "首页封面",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                }, {
                                    "name": "说明",
                                    "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                    "id": "",
                                    "type": "说明",
                                    "baseProjectId": ""
                                })
                            }
                            let conclusionTemplateId = "8160f89d69ddb5b18f2b8f9ccd67fa28"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "b55ff67fcd359b1a1a845748c033ce06";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "healthCheckup": []
                            }, {
                                "name": "问诊科检查表",
                                "templateId": templateIdWzk,
                                "id": "",
                                "type": "问诊科检查表",
                                "baseProjectId": ""
                            });
                        } else if (physicalType && physicalType == "放射体检") {
                            if(_this.isShowPage) {//首页封面及相关说明
                                tabPanes.push({
                                    "name": "首页封面",
                                    "templateId": "9790f68f599ac47f5aa4559e818d8142",
                                    "id": "",
                                    "type": "首页封面",
                                    "baseProjectId": "",
                                    "healthCheckup": []
                                }, {
                                    "name": "说明",
                                    "templateId": "7003c1e6e72c690fbe0b286e5944de57",
                                    "id": "",
                                    "type": "说明",
                                    "baseProjectId": ""
                                })
                            }
                            let conclusionTemplateId = "2209519a9c327c9be267aa7d54ef2d51"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "b55ff67fcd359b1a1a845748c033ce06";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "healthCheckup": []
                            }, {
                                "name": "问诊科检查表",
                                "templateId": templateIdWzk,
                                "id": "",
                                "type": "问诊科检查表",
                                "baseProjectId": ""
                            });
                        }
                        let groupItemIds = [];
                        let groupItemIdsEye = [];
                        let groupItemIdsFK = [];
                        let groupItemIdsTGFX = [];
                        let healthCheckup = ["皮肤科常规(职业)","皮肤科常规(从业)","皮肤科常规（职业）","皮肤科常规（从业）","一般检查(职业)", "一般检查(健康)", "耳科常规(职业)", "耳鼻喉口腔常规（职业）", "耳鼻喉口腔常规(职业)", "耳鼻喉口腔常规(健康)", "内科常规(职业)", "内科常规(健康)", "外科检查(职业)", "外科常规(健康)", "神经系统", "神经系统(职业)", "神经系统(健康)", "体格检查", "血压"];
                        let healthCheckupEye = ["眼科", "眼科常规(视力)","眼科常规(职业)", "眼科常规（视力）", "眼科常规（色觉）", "眼科常规（色觉、视力）", "眼科常规(健康)"];
                        let healthCheckupFK = ["妇科", "妇科查体", "妇科常规", "妇科检查", "宫颈癌筛查", "白带常规", "宫颈刮片"];
                        let healthCheckupTGFX = ["皮肤科常规(职业)","一般检查","耳科听力常规","皮肤科常规(从业)","皮肤科常规（职业）","皮肤科常规（从业）","一般检查(职业)", "一般检查(健康)", "耳科常规(职业)", "耳鼻喉口腔常规（职业）", "耳鼻喉口腔常规(职业)", "耳鼻喉口腔常规(健康)", "内科常规(职业)", "内科常规(健康)", "外科检查(职业)", "外科常规(健康)", "神经系统", "神经系统(职业)", "神经系统(健康)", "体格检查", "血压"];

                        /*模板 按科室 排序展示*/
                        /*let tabItemsData = [];
                        //检验科
                        let dataJYK = data.departResults.filter(item => item.officeName.indexOf("检验科") > -1);
                        //心电图
                        let dataXDT = data.departResults.filter(item => item.officeName.indexOf("心电图") > -1);
                        //电测听
                        let dataCYCT = data.departResults.filter(item => item.officeName.indexOf("电测听") > -1);
                        //彩超
                        let dataBC = data.departResults.filter(item => item.officeName.indexOf("彩超") > -1);
                        //DR
                        let dataDR = data.departResults.filter(item => item.officeName.indexOf("DR") > -1);
                        //CT
                        let dataCT = data.departResults.filter(item => item.officeName.indexOf("CT") > -1);
                        //肺功能
                        let dataFGN = data.departResults.filter(item => item.officeName.indexOf("肺功能") > -1);
                        //其他科室
                        let dataOthers = data.departResults.filter(item => item.officeName.indexOf("肺功能") <= -1 && item.officeName.indexOf("CT") <= -1 && item.officeName.indexOf("DR") <= -1 && item.officeName.indexOf("彩超") <= -1 && item.officeName.indexOf("电测听") <= -1 && item.officeName.indexOf("心电图") <= -1 && item.officeName.indexOf("检验科") <= -1);
                        //组合项目数据录入 顺序(检验科、心电图、电测听、彩超、DR、CT、肺功能、其他科室)
                        dataJYK.forEach(item => {
                            if(item.groupItemName.indexOf("血常规") > -1){
                                tabItemsData.push(item);
                            }
                        });
                        dataJYK.forEach(item => {
                            if(item.groupItemName.indexOf("尿常规") > -1){
                                tabItemsData.push(item);
                            }
                        });
                        dataJYK.forEach(item => {
                            if(item.groupItemName.indexOf("肝肾功") > -1){
                                tabItemsData.push(item);
                            }
                        });
                        dataJYK.forEach(item => {
                            if(item.groupItemName.indexOf("血糖") > -1){
                                tabItemsData.push(item);
                            }
                        });
                        dataJYK.forEach(item => {
                            if(item.groupItemName.indexOf("血常规") <= -1 && item.groupItemName.indexOf("尿常规") <= -1 && item.groupItemName.indexOf("肝肾功") <= -1 && item.groupItemName.indexOf("血糖") <= -1){
                                tabItemsData.push(item);
                            }
                        });
                        dataXDT.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataCYCT.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataBC.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataDR.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataCT.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataFGN.forEach(item => {
                            tabItemsData.push(item);
                        });
                        dataOthers.forEach(item => {
                            tabItemsData.push(item);
                        });*/

                        let tabItems = data.departResults;
                        // let tabItems = tabItemsData;
                        let departItemResults = data.departItemResults;
                        let arrNew = [];
                        if (tabItems && tabItems.length > 0) {
                            for (let i = 0; i < tabItems.length; i++) {
                                if (tabItems[i] && tabItems[i].groupItemId && abandonInspectionIdData.indexOf(tabItems[i].groupItemId) <= -1) {

                                    if(tabItems[i].checkSignPath && tabItems[i].checkSignPath.indexOf("/dcm") > -1){
                                        tabItems[i].checkSign = tabItems[i].checkSignPath;
                                    }

                                    //复检的先不到报告里
                                    if (tabItems[i].groupItemName.indexOf("复") > -1) {
                                        let isShowReview = _this.$hospitalName.isShowReview;//是否展示复查报告
                                        if(!isShowReview){
                                            continue;
                                        }
                                    }
                                    //获取 分项汇总 检查结果数据(总览)
                                    let officeName = tabItems[i].officeName;//科室名称
                                    if(officeName){
                                        officeName = tabItems[i].officeName.trim();//科室名称
                                    }
                                    let groupItemName = tabItems[i].groupItemName;//项目名称
                                    if(groupItemName){
                                        groupItemName = tabItems[i].groupItemName.trim();
                                    }
                                    //DR、CT、彩超只展示一张报告
                                    if(officeName && tabPanes && groupItemName && groupItemName.indexOf("复") <= -1){
                                        if(officeName.indexOf("DR") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                let groupItemNameNow = item.name;
                                                if(officeNameNow && officeNameNow.indexOf("DR") > -1 && groupItemNameNow && groupItemNameNow.indexOf("胸") > -1 && groupItemName.indexOf("胸") > -1){
                                                    item.name += "、" + groupItemName;//DR项目名称合并
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }
                                        /*if(officeName.indexOf("CT") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                if(officeNameNow && officeNameNow.indexOf("CT") > -1){
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }
                                        if(officeName.indexOf("彩超") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                if(officeNameNow && officeNameNow.indexOf("彩超") > -1){
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }*/
                                    }
                                    let dataOfficeFXHZ = ["一般检查", "五官科","耳鼻喉科", "口腔科", "眼科", "内科", "外科", "皮肤科", "妇科", "肺功能", "电测听", "心电图"];//分项汇总 科室名称集
                                    let dataOfficeBoth = ["心电图", "肺功能", "电测听", "五官科","耳鼻喉科", "口腔科", "眼科"];//分项汇总和后面详细报告 都有的 科室名称集
                                    let dataGroupNameYC = ["口腔定位检查"];//牙齿画十字线(五官科、口腔科) 项目名称集
                                    if (dataOfficeFXHZ.indexOf(officeName) > -1) {
                                        groupItemIdsTGFX.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        if(dataOfficeBoth.indexOf(officeName) > -1 || groupItemName.indexOf("眼科") > -1 || dataGroupNameYC.indexOf(groupItemName) > -1 || groupItemName.indexOf("口腔定位") > -1){
                                            //继续执行
                                        }else{
                                            continue;
                                        }
                                    }
                                    //获取 体格检查 检查结果数据(详细)
                                    let dataOfficeTG = ["一般检查", "五官科","耳鼻喉科", "口腔科", "内科", "外科", "皮肤科"]
                                    if (dataOfficeTG.indexOf(officeName) > -1) {
                                        groupItemIds.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        if(groupItemName.indexOf("眼科") > -1 || dataGroupNameYC.indexOf(groupItemName) > -1 || groupItemName.indexOf("口腔定位") > -1){
                                            //继续执行
                                        }else{
                                            continue;
                                        }
                                    }
                                    //获取 眼科检查 检查结果数据(详细)
                                    if (groupItemName.indexOf("眼科") > -1 || officeName.indexOf("眼科") > -1) {
                                        groupItemIdsEye.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        continue;
                                    }
                                    //获取 妇科检查 检查结果数据(详细)
                                    if (officeName.indexOf("妇科") > -1) {
                                        groupItemIdsFK.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        continue;
                                    }
                                    //心电图图片不展示
                                    if(officeName.indexOf("心电图") > -1 && !_this.isShowZoncareImg){
                                        continue;
                                    }
                                    //其他化验项目 检查结果数据(生化合并)
                                    if(groupItemName && groupItemName.indexOf("肺功能") > -1 && this.isNotShowFGN){
                                        continue;
                                    }else{
                                        tabPanes.push({
                                            "name": tabItems[i].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": tabItems[i].portfolioProjectId,
                                            "departResultId": tabItems[i].id,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "healthCheckup": [],
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                            "officeName": officeName,//所属科室
                                            "isShow": true,//是否显示基本信息
                                        });
                                    }
                                    /*if(officeName.indexOf("检验科") > -1 && groupItemName.indexOf("尿常规") <= -1 && groupItemName.indexOf("血常规") <= -1 && groupItemName.indexOf("复") <= -1){
                                        let departItemResultsNow = _this.departItemResults.filter(ii => ii.orderGroupItemId == tabItems[i].groupItemId);
                                        departItemResultsNow = this.removeList(departItemResultsNow);
                                        let numberCount = departItemResultsNow.length
                                        if(numberCount >= 20){
                                            tabItems.push({
                                                "name": tabItems[i].groupItemName,
                                                "templateId": "",
                                                "id": "",
                                                "type": "分项报告",
                                                "baseProjectId": tabItems[i].portfolioProjectId,
                                                "departResultId": tabItems[i].id,
                                                "groupItemId": tabItems[i].groupItemId,
                                                "checkSign": tabItems[i].checkSign,
                                                "healthCheckup": [],
                                                "opinion": tabItems[i].diagnoseSum,//小结
                                                "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                                "officeName": officeName,//所属科室
                                                "isShow": false,//是否显示基本信息
                                            });
                                        }else{
                                            arrNew.push({
                                                index: i,
                                                count: numberCount,
                                            })
                                        }
                                    }else{
                                        tabPanes.push({
                                            "name": tabItems[i].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": tabItems[i].portfolioProjectId,
                                            "departResultId": tabItems[i].id,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "healthCheckup": [],
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                            "officeName": officeName,//所属科室
                                            "isShow": false,//是否显示基本信息
                                        });
                                    }*/
                                }

                            }
                        }
                        let tabItemsAdd = [];
                        if(arrNew && arrNew.length > 0){
                            let groupItemIds = [];
                            let count = 0;
                            let intNew = 0;
                            for(let n = 0;n < arrNew.length;n ++){
                                let countNow = count + arrNew[n].count;
                                if(countNow < 25){
                                    count += arrNew[n].count;
                                    let int = arrNew[n].index;
                                    intNew = int;
                                    groupItemIds.push(tabItems[int].groupItemId);
                                    if(n == arrNew.length - 1){
                                        tabItemsAdd.push({
                                            "name": tabItems[int].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": "",
                                            "departResultId": "",
                                            "groupItemId": groupItemIds,
                                            "checkSign": tabItems[int].checkSign,
                                            "healthCheckup": [],
                                            "opinion": "",//小结
                                            "inspectResult": "",//影像所见(诊断提醒)
                                            "officeName": "检验科",//所属科室
                                            "isShow": false,//是否显示基本信息
                                        })
                                    }
                                }else{
                                    tabItemsAdd.push({
                                        "name": tabItems[intNew].groupItemName,
                                        "templateId": "",
                                        "id": "",
                                        "type": "分项报告",
                                        "baseProjectId": "",
                                        "departResultId": "",
                                        "groupItemId": groupItemIds,
                                        "checkSign": tabItems[intNew].checkSign,
                                        "healthCheckup": [],
                                        "opinion": "",//小结
                                        "inspectResult": "",//影像所见(诊断提醒)
                                        "officeName": "检验科",//所属科室
                                        "isShow": false,//是否显示基本信息
                                    })
                                    groupItemIds = [];
                                    count = 0;
                                    count += arrNew[n].count;
                                    let int = arrNew[n].index;
                                    intNew = int;
                                    groupItemIds.push(tabItems[int].groupItemId);
                                }
                            }
                        }
                        if(tabItemsAdd && tabItemsAdd.length > 0){
                            for(let i = 0;i < tabPanes.length;i ++){
                                if(tabPanes[i].officeName && tabPanes[i].officeName.indexOf("检验科") > -1 && tabPanes[i+1].officeName && tabPanes[i+1].officeName.indexOf("检验科") <= -1){
                                    let intNow = i + 1;
                                    for(let j = 0;j < tabItemsAdd.length;j ++){
                                        tabPanes.splice(intNow, 0, tabItemsAdd[j]);
                                        intNow ++;
                                    }
                                    break;
                                }
                            }
                        }
                        //检验科 仅保留首页基本信息
                        for(let i = 0;i < tabPanes.length;i ++){
                            if(tabPanes[i].officeName && tabPanes[i].officeName.indexOf("检验科") > -1){
                                tabPanes[i].isShow = true;
                                break;
                            }
                        }
                        if (physicalType && physicalType == "健康体检") {
                            let startPage;
                            if(_this.isShowPage){
                                startPage = 4;
                            }else{
                                startPage = 1;
                            }
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }
                            // if(groupItemIdsFK.length > 0){
                            // 	fkData.healthCheckup = groupItemIdsFK;//妇科检查
                            // 	int ++;
                            // 	tabPanes.splice(int, 0, fkData);
                            // }
                            tabPanes.push({
                                "name": "常见病保健指导",
                                "templateId": "357fdd2cb29bd0ddcd87e2302ab75573",
                                "id": "",
                                "type": "常见病保健指导",
                                "baseProjectId": ""
                            });
                            if(_this.isSplitConclusion){
                                tabPanes.push({
                                    "name": "健康-检查结果及处理意见",
                                    "templateId": "0fbb068c1790cb2e03b42943128cecab",
                                    "id": "",
                                    "type": "健康-检查结果及处理意见",
                                    "baseProjectId": ""
                                });
                            }
                            if(_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                tabPanes.push({
                                    "name": "尾页封面",
                                    "templateId": "985a3cecc26f95aecba46114302f5ed3",
                                    "id": "",
                                    "type": "尾页封面",
                                    "baseProjectId": ""
                                })
                            }
                        } else if (physicalType && physicalType == "职业体检") {
                            let startPage;
                            if(_this.isShowPage){
                                startPage = 4;
                            }else{
                                startPage = 2;
                            }
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }

                            /*if(groupItemIdsFK.length > 0){
                                fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                int ++;
                                tabPanes.splice(int, 0, fkData);
                            }*/
                            if(_this.isSplitConclusion){
                                tabPanes.push({
                                    "name": "职业-检查结果及处理意见",
                                    "templateId": "4e299e600f82e89c369b6e975595c8f7",
                                    "id": "",
                                    "type": "职业-检查结果及处理意见",
                                    "baseProjectId": ""
                                });
                            }
                            if(_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                tabPanes.push({
                                    "name": "尾页封面",
                                    "templateId": "f6237ffe58b22870f1ae1e98fe9a8210",
                                    "id": "",
                                    "type": "尾页封面",
                                    "baseProjectId": ""
                                })
                            }
                        }else if (physicalType && physicalType == "放射体检") {
                            let startPage;
                            if(_this.isShowPage){
                                startPage = 4;
                            }else{
                                startPage = 2;
                            }
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }
                            if(groupItemIdsEye && groupItemIdsEye.length > 0){
                                eyeData.healthCheckup = groupItemIdsEye;//眼科检查
                                tabPanes.splice(int, 0, eyeData);
                            }
                            /*if(groupItemIdsFK.length > 0){
                                fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                int ++;
                                tabPanes.splice(int, 0, fkData);
                            }*/
                            if(_this.isSplitConclusion){
                                tabPanes.push({
                                    "name": "职业-检查结果及处理意见",
                                    "templateId": "4e299e600f82e89c369b6e975595c8f7",
                                    "id": "",
                                    "type": "职业-检查结果及处理意见",
                                    "baseProjectId": ""
                                });
                            }
                            if(_this.isShowPage && _this.isShowPageLast) {//尾页封面
                                tabPanes.push({
                                    "name": "尾页封面",
                                    "templateId": "55eebcf1287dee53e68d8003392a0ba3",
                                    "id": "",
                                    "type": "尾页封面",
                                    "baseProjectId": ""
                                })
                            }
                        }

                        //检查分项的
                        if (tabPanes && tabPanes.length > 0) {
                            let wordData = [];
                            tabPanes.forEach(function(element) {
                                let resData =  templateJs.dataInit(_this,element.templateId,element.baseProjectId,element.type,personInfo.physical_type,personInfo,tabItems,element.name,element.groupItemId,element.opinion,element.inspectResult,element.checkSign,departItemResults,element.healthCheckup,element.isShow);
                                let templateData = JSON.parse(resData.templateData);

                                //送检医生
                                if (_this.$hospitalName){
                                    if (_this.$hospitalName.isDoctor){
                                        templateData.doctor = _this.$hospitalName.DoctorToBeExamined;
                                    }else {
                                        templateData.doctor = _this.$hospitalName.legalPerson;
                                    }
                                }
                                //医院单位信息(单位地址、邮政编码、联系电话、传真号码、电子邮箱)
                                templateData.hospitalAddress = _this.$hospitalName.hospitalAddress;
                                templateData.zipCode = _this.$hospitalName.zipCode;
                                templateData.hospitalPhone = _this.$hospitalName.hospitalPhone;
                                templateData.faxNumber = _this.$hospitalName.faxNumber;
                                templateData.email = _this.$hospitalName.email;
                                //联系电话(DR、CT、B超)
                                templateData.phone = _this.$hospitalName.hospitalPhone;
                                //模板名称
                                templateData.templateName = _this.$hospitalName.templateName;
                                //医院全称
                                templateData.hospitalName = _this.$hospitalName.name;
                                //报告医生
                                if(_this.$hospitalName.isUserConfigure) {//是否使用这个配置
                                    templateData.reportDoctor = _this.$hospitalName.reportDoctor;
                                }
                                //晶体环状图 base64
                                let base64 = _this.$hospitalName.base64;
                                templateData.jthctImageL = base64[templateData.jthctNumL];
                                templateData.jthctImageR = base64[templateData.jthctNumR];
                                //标本替换
                                let specimenDatas = _this.$hospitalName.specimenDatas;
                                let officeName = "";
                                if(templateData.officeName){
                                    officeName = templateData.officeName;
                                }
                                let name = element.name;
                                if(name.indexOf("复")){
                                    name = name.replace("(复)","");
                                }
                                if(officeName && officeName != "" && officeName.indexOf("检验科") > -1){
                                    if(specimenDatas[name] && specimenDatas[name] != undefined){
                                        templateData.specimen = specimenDatas[name].specimenName;
                                    }else {
                                        if(name.indexOf("血常规") > -1){
                                            templateData.specimen = "全血";
                                        }else if(name.indexOf("尿常规") > -1){
                                            templateData.specimen = "尿液";
                                        }else{
                                            templateData.specimen = "血清";
                                        }
                                    }
                                }
                                //项目名称
                                templateData.projectNamePath = element.name;
                                //模板替换
                                let baseProjectId = resData.baseProjectId;
                                if(officeName.indexOf("检验科") > -1){
                                    if(name.indexOf("血常规") <= -1 && name.indexOf("尿常规") <= -1){
                                        if(name.indexOf("乙肝两对半") > -1){
                                            baseProjectId = "552";//乙肝两对半模板 乙肝两对半
                                        }else{
                                            baseProjectId = "1213";//血清模板 血清ALT
                                        }
                                    }else if(name.indexOf("血常规") > -1){
                                        baseProjectId = "130e9bd972973c03ddbbb227d94a0278";//血常规模板 血常规
                                    }else{
                                        baseProjectId = "954";//尿常规模板 尿常规
                                    }
                                }
                                if(name.indexOf("幽门螺旋杆菌") > -1 && _this.$hospitalName.isShowC14){
                                    baseProjectId = "e4ab65498defd56f073206395afe90cc";
                                }
                                if(!_this.$hospitalName.isShowC14){
                                    templateData.histogramImage = {"x":["参考值","检测结果"],"y":[0,0]};
                                }
                                if(officeName.indexOf("DR室") > -1){
                                    baseProjectId = "1256";//DR模板 胸部正侧位DR（不含片）
                                }
                                if(officeName.indexOf("CT室") > -1){
                                    baseProjectId = "755";//CT模板 胸椎椎体CT平扫（不含片）
                                }
                                if(officeName.indexOf("彩超室") > -1){
                                    baseProjectId = "XXM0156";//彩超模板 肝肾B超
                                }
                                if(officeName.indexOf("肺功能") > -1){
                                    baseProjectId = "1479";//肺功能模板 肺功能(职业)
                                }
                                if(officeName.indexOf("电测听") > -1){
                                    baseProjectId = "1361";//电测听模板 纯音测听
                                }
                                if(officeName.indexOf("口腔科") > -1){
                                    baseProjectId = "4f1a8bb758ae783a6d3c699f63b10832";//口腔科模板 口腔定位检查
                                }
                                if(officeName.indexOf("心电图") > -1){
                                    baseProjectId = "1279";//心电图模板 频谱心电图
                                }

                                let isShowArray = [];
                                if(templateData && templateData.isShow && officeName.indexOf("检验科") > -1){
                                    isShowArray.push({
                                        name: templateData.name,
                                        sex: templateData.sex,
                                        age: templateData.age,
                                        sectionOffice: templateData.sectionOffice,
                                        doctor: templateData.doctor,
                                        specimen: templateData.specimen,
                                        testNum: templateData.testNum,
                                        templateName: templateData.templateName,
                                        reviewName: templateData.reviewName,
                                    });
                                }
                                templateData.isShowArray = isShowArray;

                                resData.baseProjectId = baseProjectId;
                                resData.templateData = JSON.stringify(templateData);
                                wordData.push(resData);
                            });
                            //处理数据匹配模板
                            batchData.push({wordData: wordData, personId: personInfo.id, personName: personInfo.person_name}) ;
                        }
                    }
                }

                return batchData;
            },
            //处理报告数据(个人体检报告)
            batchHandDataTJJL(datas){
                let _this = this;
                if(datas == undefined || datas ==null || datas.length == 0){
                    this.$Message.info('获取报告结果失败，请联系管理员');
                    return;
                }
                let batchData = [];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    if (data !=undefined && data != null &&  data.mapPerson !=undefined) {
                        let personInfo = data.mapPerson;
                        personInfo.orderGroupData = data.orderGroup ;
                        let templateId = "";
                        let physicalType = personInfo.physical_type;
                        if (physicalType == "健康体检") {
                            templateId = "fe91d48556bc54ae224beebcbaece476";
                        }else if (physicalType == "职业体检") {
                            templateId = "6adc35bad272d6d87d802290cb103db7";
                        }else if(physicalType == "放射体检"){
                            templateId = "9790f68f599ac47f5aa4559e818d8142";
                        }
                        let tabPanes = [];
                        if (physicalType && physicalType == "健康体检") {
                            let conclusionTemplateId = "bbff5be6d0c0f92f63e812f843628ac0"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "c159055269e6b64c7f1451ad28c5b545";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "departResultId": "",
                                "groupItemId": "",
                                "checkSign": "",
                                "healthCheckup": [],
                                "opinion": "",//小结
                                "inspectResult": "",//影像所见(诊断提醒)
                                "isShow": true,
                            });
                        } else if (physicalType && physicalType == "职业体检") {
                            let conclusionTemplateId = "67c97cfea33e12e838bf37c7c67309a6"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "67c97cfea33e12e838bf37c7c67309a6";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "departResultId": "",
                                "groupItemId": "",
                                "checkSign": "",
                                "healthCheckup": [],
                                "opinion": "",//小结
                                "inspectResult": "",//影像所见(诊断提醒)
                                "isShow": true,
                            });
                        } else if (physicalType && physicalType == "放射体检") {
                            let conclusionTemplateId = "67c97cfea33e12e838bf37c7c67309a6"
                            if(_this.isSplitConclusion){
                                conclusionTemplateId = "67c97cfea33e12e838bf37c7c67309a6";
                            }
                            tabPanes.push({
                                "name": "检查结果及处理意见",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "departResultId": "",
                                "groupItemId": "",
                                "checkSign": "",
                                "healthCheckup": [],
                                "opinion": "",//小结
                                "inspectResult": "",//影像所见(诊断提醒)
                                "isShow": true,
                            });
                        }



                        //检查分项的
                        if (tabPanes && tabPanes.length > 0) {
                            let wordData = [];
                            let departItemResults = [];
                            let tabItems = [];
                            tabPanes.forEach(function(element) {
                                let resData =  templateJs.dataInit(_this,element.templateId,element.baseProjectId,element.type,personInfo.physical_type,personInfo,tabItems,element.name,element.groupItemId,element.opinion,element.inspectResult,element.checkSign,departItemResults,element.healthCheckup,element.isShow);
                                let templateData = JSON.parse(resData.templateData);

                                //医院全称
                                templateData.hospitalName = _this.$hospitalName.name;

                                resData.templateData = JSON.stringify(templateData);
                                wordData.push(resData);
                            });
                            //处理数据匹配模板
                            batchData.push({wordData: wordData, personId: personInfo.id, personName: personInfo.person_name}) ;
                        }
                    }
                }

                return batchData;
            },
            //处理报告数据(复查报告)
            batchHandDataFC(datas){
                let _this = this;
                if(datas == undefined || datas ==null || datas.length == 0){
                    this.$Message.info('获取报告结果失败，请联系管理员');
                    return;
                }
                let batchData = [];
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    if (data !=undefined && data != null &&  data.mapPerson !=undefined) {
                        let personInfo = data.mapPerson;
                        let abandonInspectionIdData = [];
                        let workStateText = "";
                        if (personInfo.work_state_text) {
                            workStateText = personInfo.work_state_text;//监护种类(在岗状态)
                        }
                        let templateTGId = "";
                        let templateYKId = "";
                        let physicalType = personInfo.physical_type;
                        if (physicalType == "健康体检") {
                            templateTGId = "6e53c87e7d7cea49245ee99ab95dc385";
                            templateYKId = "676c51485eab4a822ff91c635a1debd8";
                        }else if (physicalType == "职业体检") {
                            templateTGId = "67cf79eb6b0e8a9c783b71f69b0fb2bd";
                            templateYKId = "b144ea3b9afefe990cf4835c7e2475e6";
                        }else if(physicalType == "放射体检"){
                            templateTGId = "67cf79eb6b0e8a9c783b71f69b0fb2bd";
                            templateYKId = "7ec4ff0959974faf2eb0785fdf9f0812";
                        }
                        let tabPanes = [];
                        let healthy = {
                            "name": "体格检查",
                            "templateId": templateTGId,
                            "id": "",
                            "type": "体格检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let eyeData = {
                            "name": "眼科检查",
                            "templateId": templateYKId,
                            "id": "",
                            "type": "眼科检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let fkData = {
                            "name": "妇科检查",
                            "templateId": "82309fe7c1ff6cfc117d60dd8fca5b1d",
                            "id": "",
                            "type": "妇科检查",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        let tgfxData = {
                            "name": "分项汇总",
                            "templateId": "29e4fdfce7872e1e4e9b7df631d7013b",
                            "id": "",
                            "type": "分项汇总",
                            "baseProjectId": "",
                            "healthCheckup": []
                        };
                        if (physicalType && physicalType == "健康体检") {
                            tabPanes.push({
                                "name": "个人复查报告-基本信息",
                                "templateId": "808295634be84067aea793ccb73a0fea",
                                "id": "",
                                "type": "个人复查报告-基本信息",
                                "baseProjectId": "",
                                "healthCheckup": []
                            });
                        } else if (physicalType && physicalType == "职业体检") {
                            tabPanes.push({
                                "name": "个人复查报告-基本信息",
                                "templateId": "808295634be84067aea793ccb73a0fea",
                                "id": "",
                                "type": "个人复查报告-基本信息",
                                "baseProjectId": "",
                                "healthCheckup": []
                            });
                        } else if (physicalType && physicalType == "放射体检") {
                            tabPanes.push({
                                "name": "个人复查报告-基本信息",
                                "templateId": "808295634be84067aea793ccb73a0fea",
                                "id": "",
                                "type": "个人复查报告-基本信息",
                                "baseProjectId": "",
                                "healthCheckup": []
                            });
                        }
                        let groupItemIds = [];
                        let groupItemIdsEye = [];
                        let groupItemIdsFK = [];
                        let groupItemIdsTGFX = [];
                        let healthCheckup = ["皮肤科常规(职业)","皮肤科常规(从业)","皮肤科常规（职业）","皮肤科常规（从业）","一般检查(职业)", "一般检查(健康)", "耳科常规(职业)", "耳鼻喉口腔常规（职业）", "耳鼻喉口腔常规(职业)", "耳鼻喉口腔常规(健康)", "内科常规(职业)", "内科常规(健康)", "外科检查(职业)", "外科常规(健康)", "神经系统", "神经系统(职业)", "神经系统(健康)", "体格检查", "血压"];
                        let healthCheckupEye = ["眼科", "眼科常规(视力)","眼科常规(职业)", "眼科常规（视力）", "眼科常规（色觉）", "眼科常规（色觉、视力）", "眼科常规(健康)"];
                        let healthCheckupFK = ["妇科", "妇科查体", "妇科常规", "妇科检查", "宫颈癌筛查", "白带常规", "宫颈刮片"];
                        let healthCheckupTGFX = ["皮肤科常规(职业)","一般检查","耳科听力常规","皮肤科常规(从业)","皮肤科常规（职业）","皮肤科常规（从业）","一般检查(职业)", "一般检查(健康)", "耳科常规(职业)", "耳鼻喉口腔常规（职业）", "耳鼻喉口腔常规(职业)", "耳鼻喉口腔常规(健康)", "内科常规(职业)", "内科常规(健康)", "外科检查(职业)", "外科常规(健康)", "神经系统", "神经系统(职业)", "神经系统(健康)", "体格检查", "血压"];

                        let tabItems = data.departResults;
                        let departItemResults = data.departItemResults;
                        let arrNew = [];
                        if (tabItems && tabItems.length > 0) {
                            for (let i = 0; i < tabItems.length; i++) {
                                if (tabItems[i] && tabItems[i].groupItemId && abandonInspectionIdData.indexOf(tabItems[i].groupItemId) <= -1) {
                                    if(tabItems[i].checkSignPath && tabItems[i].checkSignPath.indexOf("/dcm") > -1){
                                        tabItems[i].checkSign = tabItems[i].checkSignPath;
                                    }

                                    //只展示复查的报告
                                    if (tabItems[i].groupItemName.indexOf("复") <= -1) {
                                        continue;
                                    }
                                    //获取 分项汇总 检查结果数据(总览)
                                    let officeName = tabItems[i].officeName;//科室名称
                                    if(officeName){
                                        officeName = tabItems[i].officeName.trim();//科室名称
                                    }
                                    let groupItemName = tabItems[i].groupItemName;//项目名称
                                    if(groupItemName){
                                        groupItemName = tabItems[i].groupItemName.trim();
                                    }
                                    //DR、CT、彩超只展示一张报告
                                    if(officeName && tabPanes && groupItemName && groupItemName.indexOf("复") <= -1){
                                        if(officeName.indexOf("DR") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                let groupItemNameNow = item.name;
                                                if(officeNameNow && officeNameNow.indexOf("DR") > -1 && groupItemNameNow && groupItemNameNow.indexOf("胸") > -1 && groupItemName.indexOf("胸") > -1){
                                                    item.name += "、" + groupItemName;//DR项目名称合并
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }
                                        /*if(officeName.indexOf("CT") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                if(officeNameNow && officeNameNow.indexOf("CT") > -1){
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }
                                        if(officeName.indexOf("彩超") > -1){
                                            let flag = false;
                                            tabPanes.forEach(item => {
                                                let officeNameNow = item.officeName;
                                                if(officeNameNow && officeNameNow.indexOf("彩超") > -1){
                                                    flag = true;
                                                }
                                            })
                                            if(flag){
                                                continue;
                                            }
                                        }*/
                                    }
                                    let dataOfficeFXHZ = ["一般检查", "五官科","耳鼻喉科", "口腔科", "眼科", "内科", "外科", "皮肤科", "妇科", "肺功能", "电测听", "心电图"];//分项汇总 科室名称集
                                    let dataOfficeBoth = ["心电图", "肺功能", "电测听", "五官科","耳鼻喉科", "口腔科", "眼科"];//分项汇总和后面详细报告 都有的 科室名称集
                                    let dataGroupNameYC = ["口腔定位检查"];//牙齿画十字线(五官科、口腔科) 项目名称集
                                    if (dataOfficeFXHZ.indexOf(officeName) > -1) {
                                        groupItemIdsTGFX.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        if(dataOfficeBoth.indexOf(officeName) > -1 || groupItemName.indexOf("眼科") > -1 || dataGroupNameYC.indexOf(groupItemName) > -1 || groupItemName.indexOf("口腔定位") > -1){
                                            //继续执行
                                        }else{
                                            continue;
                                        }
                                    }
                                    //获取 体格检查 检查结果数据(详细)
                                    let dataOfficeTG = ["一般检查", "五官科","耳鼻喉科", "口腔科", "内科", "外科", "皮肤科"]
                                    if (dataOfficeTG.indexOf(officeName) > -1) {
                                        groupItemIds.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        if(groupItemName.indexOf("眼科") > -1 || dataGroupNameYC.indexOf(groupItemName) > -1 || groupItemName.indexOf("口腔定位") > -1){
                                            //继续执行
                                        }else{
                                            continue;
                                        }
                                    }
                                    //获取 眼科检查 检查结果数据(详细)
                                    if (groupItemName.indexOf("眼科") > -1 || officeName.indexOf("眼科") > -1) {
                                        groupItemIdsEye.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        continue;
                                    }
                                    //获取 妇科检查 检查结果数据(详细)
                                    if (officeName.indexOf("妇科") > -1) {
                                        groupItemIdsFK.push({
                                            "name": tabItems[i].groupItemName,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        continue;
                                    }
                                    //心电图图片不展示
                                    if(officeName.indexOf("心电图") > -1 && !_this.isShowZoncareImg){
                                        continue;
                                    }
                                    //其他化验项目 检查结果数据(生化合并)
                                    if(groupItemName && groupItemName.indexOf("肺功能") > -1 && this.isNotShowFGN){
                                        continue;
                                    }else{
                                        tabPanes.push({
                                            "name": tabItems[i].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": tabItems[i].portfolioProjectId,
                                            "departResultId": tabItems[i].id,
                                            "groupItemId": tabItems[i].groupItemId,
                                            "checkSign": tabItems[i].checkSign,
                                            "healthCheckup": [],
                                            "opinion": tabItems[i].diagnoseSum,//小结
                                            "inspectResult": tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                            "officeName": officeName,//所属科室
                                            "isShow": true,//是否显示基本信息
                                        });
                                    }
                                }

                            }
                        }
                        let tabItemsAdd = [];
                        if(arrNew && arrNew.length > 0){
                            let groupItemIds = [];
                            let count = 0;
                            let intNew = 0;
                            for(let n = 0;n < arrNew.length;n ++){
                                let countNow = count + arrNew[n].count;
                                if(countNow < 25){
                                    count += arrNew[n].count;
                                    let int = arrNew[n].index;
                                    intNew = int;
                                    groupItemIds.push(tabItems[int].groupItemId);
                                    if(n == arrNew.length - 1){
                                        tabItemsAdd.push({
                                            "name": tabItems[int].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": "",
                                            "departResultId": "",
                                            "groupItemId": groupItemIds,
                                            "checkSign": tabItems[int].checkSign,
                                            "healthCheckup": [],
                                            "opinion": "",//小结
                                            "inspectResult": "",//影像所见(诊断提醒)
                                            "officeName": "检验科",//所属科室
                                            "isShow": false,//是否显示基本信息
                                        })
                                    }
                                }else{
                                    tabItemsAdd.push({
                                        "name": tabItems[intNew].groupItemName,
                                        "templateId": "",
                                        "id": "",
                                        "type": "分项报告",
                                        "baseProjectId": "",
                                        "departResultId": "",
                                        "groupItemId": groupItemIds,
                                        "checkSign": tabItems[intNew].checkSign,
                                        "healthCheckup": [],
                                        "opinion": "",//小结
                                        "inspectResult": "",//影像所见(诊断提醒)
                                        "officeName": "检验科",//所属科室
                                        "isShow": false,//是否显示基本信息
                                    })
                                    groupItemIds = [];
                                    count = 0;
                                    count += arrNew[n].count;
                                    let int = arrNew[n].index;
                                    intNew = int;
                                    groupItemIds.push(tabItems[int].groupItemId);
                                }
                            }
                        }
                        if(tabItemsAdd && tabItemsAdd.length > 0){
                            for(let i = 0;i < tabPanes.length;i ++){
                                if(tabPanes[i].officeName && tabPanes[i].officeName.indexOf("检验科") > -1 && tabPanes[i+1].officeName && tabPanes[i+1].officeName.indexOf("检验科") <= -1){
                                    let intNow = i + 1;
                                    for(let j = 0;j < tabItemsAdd.length;j ++){
                                        tabPanes.splice(intNow, 0, tabItemsAdd[j]);
                                        intNow ++;
                                    }
                                    break;
                                }
                            }
                        }
                        //检验科 仅保留首页基本信息
                        for(let i = 0;i < tabPanes.length;i ++){
                            if(tabPanes[i].officeName && tabPanes[i].officeName.indexOf("检验科") > -1){
                                tabPanes[i].isShow = true;
                                break;
                            }
                        }
                        if (physicalType && physicalType == "健康体检") {
                            let startPage;
                            startPage = 1;
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }
                            /*tabPanes.push({
                                "name": "个人复查报告-结论",
                                "templateId": "3d916f7a0f88deac20635a9a02cc63fa",
                                "id": "",
                                "type": "个人复查报告-结论",
                                "baseProjectId": "",
                                "healthCheckup": []
                            });*/
                            // if(groupItemIdsFK.length > 0){
                            // 	fkData.healthCheckup = groupItemIdsFK;//妇科检查
                            // 	int ++;
                            // 	tabPanes.splice(int, 0, fkData);
                            // }
                        } else if (physicalType && physicalType == "职业体检") {
                            let startPage;
                            startPage = 1;
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }
                            /*tabPanes.push({
                                "name": "个人复查报告-结论",
                                "templateId": "3d916f7a0f88deac20635a9a02cc63fa",
                                "id": "",
                                "type": "个人复查报告-结论",
                                "baseProjectId": "",
                                "healthCheckup": []
                            });*/
                            /*if(groupItemIdsFK.length > 0){
                                fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                int ++;
                                tabPanes.splice(int, 0, fkData);
                            }*/
                        }else if (physicalType && physicalType == "放射体检") {
                            let startPage;
                            startPage = 1;
                            let int = startPage;
                            if(groupItemIdsTGFX && groupItemIdsTGFX.length>0){
                                tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                                tabPanes.splice(startPage, 0, tgfxData);
                                int = startPage + 1;
                            }
                            if(groupItemIdsEye.length > 0){
                                eyeData.healthCheckup = groupItemIdsEye;//眼科检查
                                tabPanes.splice(int, 0, eyeData);
                            }
                            /*tabPanes.push({
                                "name": "个人复查报告-结论",
                                "templateId": "3d916f7a0f88deac20635a9a02cc63fa",
                                "id": "",
                                "type": "个人复查报告-结论",
                                "baseProjectId": "",
                                "healthCheckup": []
                            });*/
                            /*if(groupItemIdsFK.length > 0){
                                fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                int ++;
                                tabPanes.splice(int, 0, fkData);
                            }*/
                        }

                        //检查分项的
                        if (tabPanes && tabPanes.length > 0) {
                            let wordData = [];
                            tabPanes.forEach(function(element) {
                                let resData =  templateJs.dataInit(_this,element.templateId,element.baseProjectId,element.type,personInfo.physical_type,personInfo,tabItems,element.name,element.groupItemId,element.opinion,element.inspectResult,element.checkSign,departItemResults,element.healthCheckup,element.isShow);
                                let templateData = JSON.parse(resData.templateData);

                                //送检医生
                                if (_this.$hospitalName){
                                    if (_this.$hospitalName.isDoctor){
                                        templateData.doctor = _this.$hospitalName.DoctorToBeExamined;
                                    }else {
                                        templateData.doctor = _this.$hospitalName.legalPerson;
                                    }
                                }
                                //医院单位信息(单位地址、邮政编码、联系电话、传真号码、电子邮箱)
                                templateData.hospitalAddress = _this.$hospitalName.hospitalAddress;
                                templateData.zipCode = _this.$hospitalName.zipCode;
                                templateData.hospitalPhone = _this.$hospitalName.hospitalPhone;
                                templateData.faxNumber = _this.$hospitalName.faxNumber;
                                templateData.email = _this.$hospitalName.email;
                                //联系电话(DR、CT、B超)
                                templateData.phone = _this.$hospitalName.hospitalPhone;
                                //模板名称
                                templateData.templateName = _this.$hospitalName.templateName;
                                //医院全称
                                templateData.hospitalName = _this.$hospitalName.name;
                                //报告医生
                                if(_this.$hospitalName.isUserConfigure) {//是否使用这个配置
                                    templateData.reportDoctor = _this.$hospitalName.reportDoctor;
                                }
                                //晶体环状图 base64
                                let base64 = _this.$hospitalName.base64;
                                templateData.jthctImageL = base64[templateData.jthctNumL];
                                templateData.jthctImageR = base64[templateData.jthctNumR];
                                //标本替换
                                let specimenDatas = _this.$hospitalName.specimenDatas;
                                let officeName = "";
                                if(templateData.officeName){
                                    officeName = templateData.officeName;
                                }
                                let name = element.name;
                                if(name.indexOf("复")){
                                    name = name.replace("(复)","");
                                }
                                if(officeName && officeName != "" && officeName.indexOf("检验科") > -1){
                                    if(specimenDatas[name] && specimenDatas[name] != undefined){
                                        templateData.specimen = specimenDatas[name].specimenName;
                                    }else {
                                        if(name.indexOf("血常规") > -1){
                                            templateData.specimen = "全血";
                                        }else if(name.indexOf("尿常规") > -1){
                                            templateData.specimen = "尿液";
                                        }else{
                                            templateData.specimen = "血清";
                                        }
                                    }
                                }
                                //项目名称
                                templateData.projectNamePath = element.name;
                                //模板替换
                                let baseProjectId = resData.baseProjectId;
                                if(officeName.indexOf("检验科") > -1){
                                    if(name.indexOf("血常规") <= -1 && name.indexOf("尿常规") <= -1){
                                        if(name.indexOf("乙肝两对半") > -1){
                                            baseProjectId = "552";//乙肝两对半模板 乙肝两对半
                                        }else{
                                            baseProjectId = "1213";//血清模板 血清ALT
                                        }
                                    }else if(name.indexOf("血常规") > -1){
                                        baseProjectId = "130e9bd972973c03ddbbb227d94a0278";//血常规模板 血常规
                                    }else{
                                        baseProjectId = "954";//尿常规模板 尿常规
                                    }
                                }
                                if(name.indexOf("幽门螺旋杆菌") > -1 && _this.$hospitalName.isShowC14){
                                    baseProjectId = "e4ab65498defd56f073206395afe90cc";
                                }
                                if(!_this.$hospitalName.isShowC14){
                                    templateData.histogramImage = {"x":["参考值","检测结果"],"y":[0,0]};
                                }
                                if(officeName.indexOf("DR室") > -1){
                                    baseProjectId = "1256";//DR模板 胸部正侧位DR（不含片）
                                }
                                if(officeName.indexOf("CT室") > -1){
                                    baseProjectId = "755";//CT模板 胸椎椎体CT平扫（不含片）
                                }
                                if(officeName.indexOf("彩超室") > -1){
                                    baseProjectId = "XXM0156";//彩超模板 肝肾B超
                                }
                                if(officeName.indexOf("肺功能") > -1){
                                    baseProjectId = "1479";//肺功能模板 肺功能(职业)
                                }
                                if(officeName.indexOf("电测听") > -1){
                                    baseProjectId = "1361";//电测听模板 纯音测听
                                }
                                if(officeName.indexOf("口腔科") > -1){
                                    baseProjectId = "4f1a8bb758ae783a6d3c699f63b10832";//口腔科模板 口腔定位检查
                                }
                                if(officeName.indexOf("心电图") > -1){
                                    baseProjectId = "1279";//心电图模板 频谱心电图
                                }

                                let isShowArray = [];
                                if(templateData && templateData.isShow && officeName.indexOf("检验科") > -1){
                                    isShowArray.push({
                                        name: templateData.name,
                                        sex: templateData.sex,
                                        age: templateData.age,
                                        sectionOffice: templateData.sectionOffice,
                                        doctor: templateData.doctor,
                                        specimen: templateData.specimen,
                                        testNum: templateData.testNum,
                                        templateName: templateData.templateName,
                                        reviewName: templateData.reviewName,
                                    });
                                }
                                templateData.isShowArray = isShowArray;

                                resData.baseProjectId = baseProjectId;
                                resData.templateData = JSON.stringify(templateData);
                                wordData.push(resData);
                            });
                            //处理数据匹配模板
                            batchData.push({wordData: wordData, personId: personInfo.id, personName: personInfo.person_name}) ;
                        }
                    }
                }

                return batchData;
            },
        },
        mounted() {
            let _this = this;
            this.tableHeight = document.documentElement.clientHeight - 320;
            if (this.$hospitalName && this.$hospitalName.cancelGeneralInspection){
                this.CancelTheMasterCheckButton = this.$hospitalName.cancelGeneralInspection
            }
            this.isShowButton = this.$hospitalName.isShowExaminePageButton;//是否展示审核页的按钮(下载word、批量打印)
            //是否默认加载第一个人的报告信息
            this.isShowFirstPersonInfo = this.$hospitalName.isShowFirstPersonInfo;
            //是否展示心电图图片(成都新华)
            this.isShowZoncareImg = this.$hospitalName.isShowZoncareImg;
            this.date = "当日";
            if (!this.$hospitalName.queryTimeChange){
                let date  = getMonthString(new Date());
                if(date!=null && date.length == 2){
                    this.searchForm.startDate = date[0] + " 00:00:00";
                    this.searchForm.endDate = date[1] + " 23:59:59";
                    this.inputSearchChange();
                }
            }else {
                this.pick("当日");
            }
            //体检单位
            queryAllTGroupUnitList({id: _this.unitId}).then(res => {
                if (res.success) {
                    _this.unitDataArry = res.data;
                }
            });

        },
        watch: {
            //选择的人员改变
            isRadioChecked: function (val) {
                if (val) {
                    this.loading = true;
                    this.personInfo = {};
                    let personList = this.personData.filter(item => item.id == val);
                    let _this = this;
                    if (personList && personList.length > 0) {
						_this.tabPanes = [];
						_this.groupId = personList[0].groupId;
						_this.personId = personList[0].id;

                        //是否展示尾面 false不展示 true 展示
                        _this.isShowPageLast = _this.$hospitalName.isShowPageLast;
                        //是否不展示肺功能详细报告 true 不展示 false 展示
                        _this.isNotShowFGN = this.$hospitalName.isNotShowFGN;

                        //是否展示页面(首页尾页及相关说明) false不展示 true 展示
                        _this.isShowPage = _this.$hospitalName.isShowPage;

						/*//查询人员的 订单分组数据
						getTOrderGroup({id:this.groupId}).then(res => {
							if (res.success) {
								_this.orderGroupData = res.data
								_this.queryRelationPersonProjectCheckAll();//查询弃检项目*/
								// _this.personChange();
                                _this.taskNow = "";
                                _this.personIds = [];
                                _this.personIds.push(_this.personId);
                                _this.isBatchPrint = false;
                                _this.isTemplateShow = true;

								/*if(_this.physicalType == "职业体检"){
                                    _this.noticeChange()
                                }*/
							/*}
						});*/

                    } else {
                        this.groupId = "";
                        this.personId = "";
                        this.tabPanes = [];
                        this.abandonInspectionIdData = [];
                    }
                }
            }
        }
    }
</script>

<style lang="less">
    @import "../../../styles/tree&table-common.less";

    .reportReview {
        padding: 10px;
        box-sizing: border-box;
        height: calc(100vh - 70px);
        overflow: hidden;

        .scrollDiv {
            width: 100%;

            &::-webkit-scrollbar {
                width: 0;
                /*隐藏滚轮*/
                display: none;
            }
        }

        .ivu-select-single .ivu-select-selection {
            height: 2.5vh;
            position: relative;
            min-height: 20px;
            .ivu-select-selected-value {
                display: block;
                height: 2.5vh;
                line-height: 2.5vh;
                font-size: 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-left: 8px;
                padding-right: 24px;
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

        .ivu-scroll-container {
            height: calc(100vh - 260px) !important;

            &::-webkit-scrollbar {
                width: 10px;
            }

            .ivu-scroll-loader {
                position: relative;
                bottom: -30px;
            }
        }

        .empty {
            text-align: center;
            color: #515a6e;
            margin-top: 20px;
        }

        .alert {
            margin-bottom: 10px !important;
        }

        .ivu-card-body {
            height: 100%;
        }

        //图片
        .img-wrapper {
            width: 100%;
            height: 100%;

            img {
                width: 100%;
            }
        }

        .btngroup {
            display: flex;

            .ivu-radio-group-item {
                padding: 0 6px !important;
                font-size: 13px !important;
                user-select: none;
            }
        }

        .radio-group {
            /*overflow: auto;*/
            /*width: 100%;*/
            /*padding-bottom: 30px;*/
            overflow: auto;
            width: 100%;
            /*height: 65vh;*/
            height: 90%;
            max-height: 500px;

            &::-webkit-scrollbar {
                width: 0;
            }

            .row-border {
                margin-left: 0 !important;
                padding-top: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid #ccc;
            }

            .bg-audit {
                background-color: #ff9900;
                color: #fff;
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
            }

            .bg-green {
                background-color: #42C3AF;
                color: #fff;
                border-radius: 8px;
                text-align: center;
            }

            .radio-group-radio {
                display: flex;
                justify-content: center;
                align-items: center;

                .ivu-radio-wrapper {
                    font-size: 0;
                }

                [class^=label] {
                    font-size: 0;
                }
            }

            .radio-group-content {
                cursor: pointer;
                padding-left: 0 !important;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                .border-purple {
                    border: 1px solid orangered;
                    border-radius: 8px;
                    text-align: center;
                    color: orangered;
                }
            }
        }

        .ivu-form-item {
            margin-bottom: 0 !important;
        }

        .demo-upload-list-cover {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 150px;
            line-height: 150px;
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
            margin-left: 30px;
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
                width: 150px;
                height: 150px;
                line-height: 150px;
                margin-right: 10px;
                border: 1px dashed #2988f3;
                cursor: pointer;
                flex-direction: column;
                position: relative;

                &:hover {
                    .demo-upload-list-cover {
                        display: block;
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

        /* 旋转效果 */

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
        /* 遮罩 */
        /* 假如内容过长，一屏放不下，滚动条下拉覆盖不全 */

        .ivu-spin-fix {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 8;
            width: 100%;
            height: 100%;
            background-color: hsla(0, 0%, 100%, .8);
        }
        .active{
            background: #e8eaec;
        }
        .previewIframe{
            width: 100%;
            height: calc(100vh - 120px);
        }

        .ivu-btn {
            margin-right: 4px;
        }
        .ivu-page-simple-pager input{
            width: 38px;
        }
    }
</style>
