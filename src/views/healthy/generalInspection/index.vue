<template>
    <div class="generalInspection">
        <Row :gutter="4" style="flex-wrap: nowrap;max-height: 100%;">
            <Col :style="outLeftSpan" style="min-width: 300px;" v-if="outExpand">
                <Card class="card">
                    <Row style="display: flex;">
                        <RadioGroup v-if="isAllInspect" v-model="status" @on-change="statusChange" style="margin-bottom: 10px;width: 80%;">
                            <Radio label="在检"></Radio>
                            <Radio label="待总检"></Radio>
                            <Radio label="已总检"></Radio>
                        </RadioGroup>
                        <RadioGroup v-if="!isAllInspect" v-model="status" @on-change="statusChange" style="margin-bottom: 10px;width: 80%;">
                            <Radio label="未审"></Radio>
                            <Radio label="已审"></Radio>
                        </RadioGroup>
                        <div style="width: 20%;text-align: right;">
                            <i-switch size="large" @on-change="typeChange" v-model="typeStatus"
                                      style="text-align: center;">
                                <span slot="open">复查</span>
                                <span slot="close">非复查</span>
                            </i-switch>
                        </div>
                    </Row>
                    <RadioGroup v-if="queryTime" type="button" size="small" class="btngroup" button-style="solid"
                                v-model="date"
                                @on-change="pick">
                        <Radio label="当日"></Radio>
                        <Radio label="当月"></Radio>
                        <DatePicker
                                :open="datePickerShow"
                                transfer
                                type="daterange"
                                @on-change="datePickerChange">
                            <div>
                                <template>
                                    <Radio label="自定义" @click.native="datePickerShow = !datePickerShow"></Radio>
                                </template>
                            </div>
                        </DatePicker>
                        <Radio label="重置" style="cursor: pointer;"></Radio>
                    </RadioGroup>
                    <div v-if="!queryTime"
                         style="display: flex;flex-wrap: nowrap;align-items: center;margin-bottom: 10px">
                        <DatePicker type="date" transfer @on-change="datePickerStartTime"
                                    v-model="personParam.startDate" placeholder="开始时间"/>
                        &nbsp;~&nbsp;
                        <DatePicker type="date" transfer @on-change="datePickerEndTime" v-model="personParam.endDate"
                                    placeholder="结束时间"/>
                    </div>
                    <Row style="display: flex;flex-wrap: wrap;">
                        <Input v-model="personParam.personName" placeholder="请输入姓名"
                               @on-clear="inputSearchChange('')"
                               @keypress.native.enter="inputSearchChange" style="margin-bottom: 10px;" clearable/>

                        <Input v-model="personParam.testNum" placeholder="请输入体检编号" @on-clear="inputSearchChange('')"
                               @keypress.native.enter="inputSearchChange" style="margin-bottom: 10px;" clearable
                               v-if="drop"></Input>
                        <Input v-model="personParam.dept" placeholder="请输入单位名称" @on-clear="inputSearchChange('')"
                               @keypress.native.enter="inputSearchChange" style="margin-bottom: 10px;" clearable
                               v-if="drop"></Input>
                        <Button type="primary" @click="inputSearchChange" size="small">查询</Button>
                        <Button v-if="!queryTime" @click="resetSearchForm('重置')" size="small">重置</Button>
                        <a class="drop-down" @click="dropDown">
                            {{dropDownContent}}
                            <Icon :type="dropDownIcon"></Icon>
                        </a>
                    </Row>
                    <!--左侧人员信息列-->
                    <Row :style="{'height': 'calc(100% - '+height1+')'}" style="justify-content: center;">
                        <RadioGroup class="radio-group" v-model="radioValue" v-if="personList.length > 0">
                            <Row style="margin-left: 15px;" class="row-border" v-for="(item,index) in personList"
                                 :key="index" @click.native="radioChooseClick(item)">
                                <Col :span="4" class="radio-group-radio">
                                    <Radio class="label" :label="item.id" :disabled="radioShow"></Radio>
                                </Col>
                                <Col :span="15" class="radio-group-content">
                                    <div style="display: inline-block;width: 80px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                                         :title="item.personName">
                                        {{ item.personName }}
                                    </div>
                                    <div style="margin-right: 10px;">{{ item.sex }}</div>
                                    <div>{{ item.age }}</div>
                                </Col>
                                <Col :span="5" style="padding-left: 0;">
                                    <Row :gutter="6">
                                        <Col :span="12">
                                            <div class="border-blue"
                                                 v-if="item.physicalType && item.physicalType.indexOf('职业') !== -1">
                                                职
                                            </div>
                                            <div class="border-green"
                                                 v-if="item.physicalType && item.physicalType.indexOf('健康') !== -1">
                                                健
                                            </div>
                                            <div class="border-yellow"
                                                 v-if="item.physicalType && item.physicalType.indexOf('从业') !== -1">
                                                从
                                            </div>
                                            <div class="border-purple" v-if="item.physicalType.indexOf('放射') !== -1">
                                                放
                                            </div>
                                        </Col>
                                        <Col :span="12">
                                            <div class="border-purple"
                                                 v-if="item.sporadicPhysical && item.sporadicPhysical === 1">
                                                零
                                            </div>
                                            <div class="border-purple" v-else>
                                                团
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </RadioGroup>
                        <!--暂无数据-->
                        <no-data v-if="personList.length < 1"></no-data>
                        <Spin fix v-if="checkPersonLoading">
                            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                            <div>加载中...</div>
                        </Spin>
                        <Page v-if="personList.length > 0" :current="personParam.pageNumber" :total="personTotal" simple
                              @on-change="personChangePageNum"/>
                    </Row>
                </Card>
            </Col>
            <Col style="width: 17vw;min-width: 300px;">
                <Card class="card" title="体检综述">
                    <template #extra>
                        <Button @click="tableModelClick('abandonInspection')"> 弃检项目</Button>
                        <Button @click="tableModelClick('notChecked')"> 未检项目</Button>
                    </template>
                    <ul style="" class="resultCardUl" v-if="tableData && tableData.length > 0">
                        <li v-for="(item,i) in tableData" @dblclick="projectDetailClick(item.id)">
                            <div class="title">{{changeNum(i+1)}}、 {{item.groupItemName}} <span style="color: red"
                                                                                                v-if="item.positive!='0'">(异常)</span>
                            </div>
                            <div class="list" :class="{'pricesData': item.positive!='0'}">{{item.diagnoseSum}}</div>
                        </li>
                    </ul>
                    <Spin fix v-if="tableLoading">
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>加载中...</div>
                    </Spin>
                    <!--暂无数据-->
                    <no-data v-if="!tableData || tableData.length < 1"></no-data>
                </Card>

            </Col>
            <Col style="width: 66vw;max-height: 100%;overflow: auto;" class="occupationalCol">
                <!--人员信息-->
                <Row>
                    <person-info ref="personInfo" :person-id="radioValue" v-on:personInfoChang="personInfoChang"></person-info>
                </Row>
                <occupational ref="occupational" v-if="physicalType == '职业体检'||physicalType == '放射体检'" :doctor-info="doctorInfo"
                              :inspectForm="inspectForm" :person-info="personInfo" :tableData="tableData" :first-person-id="personInfo.first_person_id"
                              :person-id="personInfo.id" :user-array="userArray" :reviewProjectArr="reviewProjectData"></occupational>
                <positive-rule ref="positiveRule" v-else :person-info="personInfo" :inspectForm="inspectForm"
                               :doctor-info="doctorInfo"
                               :inspectType="personInfo.physicalType||personInfo.physical_type" :user-array="userArray"
                               :tableData="tableData" :tDiseaseDiagnosis="inspectForm.tDiseaseDiagnosis" @getPositiveResultData="getPositiveResultData"></positive-rule>
            </Col>
            <Row class="middleBottomRow" justify="center" align="middle" v-if="isAllInspect">
                <Button type="primary" @click="addRecordClick"
                        v-if="(personInfo.is_pass == 3 || personInfo.isPass == 3) || (personInfo.is_pass == 4 || personInfo.isPass == 4) || (personInfo.is_pass == 5 || personInfo.isPass == 5)"
                        :loading="inspectionLoading">保存
                </Button>
                <Button type="warning"
                        @click="addRecordClick"
                        v-else-if="(personInfo.is_pass  == 4 || personInfo.isPass == 4)"
                        :loading="inspectionLoading">已总检
                </Button>
                <Button type="primary" @click="CancelGeneralInspection"
                        v-if="((personInfo.is_pass == 4 || personInfo.isPass == 4) || (personInfo.is_pass == 5 || personInfo.isPass == 5))&& CancelTheMasterCheckButton"
                        :loading="inspectionLoading">取消总检
                </Button>
                <!--                <Button type="primary" @click="reportPreview" v-show="personList.length > 0">报告总览</Button>-->
                <Button type="primary" @click="reviewRecordClick"
                        v-show="physicalType != '从业体检' && physicalType != '健康体检' &&(personInfo.is_pass == 3 || personInfo.isPass == 3)||(personInfo.is_pass == 4 || personInfo.isPass == 4) || (personInfo.is_pass == 5 || personInfo.isPass == 5)">
                    复查
                </Button>
                <Button type="primary" @click="auditingReportClick"
                        v-show="((personInfo.is_pass == 2 || personInfo.isPass == 2) || (personInfo.is_pass == 3 || personInfo.isPass == 3)||(personInfo.is_pass == 4 || personInfo.isPass == 4) || (personInfo.is_pass == 5 || personInfo.isPass == 5))">
                    {{PersonalReport}}
                </Button>
            </Row>
            <Row class="middleBottomRow" justify="center" align="middle" v-if="!isAllInspect">

                <Button type="primary" @click="CancelGeneralInspection" v-if="personInfo.is_pass == 4||personInfo.isPass == 4"
                        :loading="inspectionLoading">取消总检
                </Button>
                <Button type="primary" @click="reportSubmit()" v-if="personInfo.is_pass == 4||personInfo.isPass == 4"
                        :loading="inspectionLoading">审核通过
                </Button>
                <Button type="primary" @click="auditingReportClick">
                    {{PersonalReport}}
                </Button>
            </Row>
        </Row>
        <review-record-list v-model="reviewRecordShow" :tableDataReview="tableDataReview" :personInfo="personInfo"
                            :conclusion="inspectForm.conclusion" :typeStatus="typeStatus" :physicalType="physicalType" v-on:reviewProject="reviewProject"></review-record-list>
        <preview-template v-model="previewShow" :status="status" :TTemplateId="TTemplateId"></preview-template>
        <auditing-report v-model="auditingReportShow"  :physicalType="physicalType" :type-status="typeStatus" :person-id="personInfo.id"
                         :status="status"></auditing-report>
        <PersonalReport v-model="PersonalReportShow" :physicalType="physicalType" :type-status="typeStatus" :person-id="personInfo.id" :status="status"
                        v-on:handleSearch="handleSearch"></PersonalReport>
        <project-details :checkDoctor="checkDoctor" :tableData="tableData" :project-row="projectRow" title="明细结果查看"
                         :person-info="personInfo" :person-id="radioValue"
                         v-model="projectDetailShow"></project-details>

        <table-modal :modal-title="tableModalTitle" v-model="tableModalShow" :person-info="personInfo"></table-modal>
    </div>
</template>

<script>
    import {formartDate, getDataString, getMonthString, changeNumToHan} from "../../../api/tools/tool";
    import {
        getInspectionTGroupPersonList,
        getInspectionTGroupPersonReviewList,
		updateTGroupPersonById,
        updateTGroupPersonByIdTypeStatus
    } from "../../../api/healthy/tGroupPerson";
    import noData from "../../../components/no-data"
    import {queryTDepartResultList} from "../../../api/healthy/tDepartResult"
    import personInfo from "./components/personInfo";
    import occupational from "./components/occupational";
    import projectDetails from "./components/projectDetails";
    import auditingReport from "../tAllInspect/auditingReport";
    import positiveRule from "./components/positiveRule";
    import PersonalReport from "./components/PersonalReport"
    import {formatDate,groupBy} from "@/api/tool.js"
    import {
        addTInspectionRecord,
        getTInspectionRecordByPersonId,
        updateTInspectionRecord,
        CancelGeneralInspection
    } from "../../../api/healthy/tInspectionRecord";
    import previewTemplate from "../tAllInspect/previewTemplate";
    import reviewRecordList from "../tAllInspect/reviewRecordList";
    import {getAllUserData, userInfo} from "../../../api";
    import Cookies from "js-cookie";
    import {getTPositivePersonId} from '@/api/healthy/tPositivePerson';
    import BreadcrumbNav from "../../main-components/breadcrumb-nav";
    import tableModal from "./components/tableModal";
    import templateCertificate from "../tHealthCertificate/templateCertificate";

    import {
        addTDiseaseDiagnosis,
        updateTDiseaseDiagnosis
    } from "../../../api/healthy/tDiseaseDiagnosis";

    export default {
        name: "generalInspection",
        components: {
            BreadcrumbNav,
            noData, personInfo, occupational, projectDetails, auditingReport, previewTemplate,
            reviewRecordList, positiveRule, tableModal,templateCertificate,PersonalReport
        },
        data() {
            return {
                reviewProjectData:[],//复查项目
                PersonalReport: '预览报告',
                status: '待总检',//体检状态筛选

                outLeftSpan: 'width: 17vw;',
                outSpan: 'position: relative;width: calc(100% - 332px);',
                maxHeight: "500px",
                expandIcon: "ios-arrow-back",
                outExpandIcon: "ios-arrow-back",
                outExpand: true,
                isReviewer: false,
                typeStatus: false,
                checkPersonLoading: false,//左侧查询人员等待条
                personTotal: 0,//查询的人员总数
                personList: [],//人员列表
                personParam: {//人员查询参数
                    keyword: "",
                    personId: "",
                    pageNumber: 1,
                    pageSize: 10,
                    isPass: 3,
                    startDate: null,
                    endDate: null,
                    personName: "",//姓名
                    testNum: "",//体检编号
                    dept: "",//单位名称
					sort: "t_group_person.update_time",//排序字段
					order: "desc",//排序方式：倒序
                },
                //查询检查组合项结果
                checkProParam: {
                    personId: '',
                    groupId: '',
                },
                date: null,//自定义时间 按钮选择的时间 绑定的对象
                datePickerShow: false,//自定义时间选择框是否显示
                personInfo: {},//人员信息
                queryTime: this.$hospitalName.queryTimeChange,//是否展示时间选择框

                /**
                 * 搜索框显示隐藏相关
                 **/
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                ShutDownIcon: "ios-arrow-up",
                drop: false,
                ShutDown: true,
                height1: '147px',
                inspectForm: {//右侧人员信息
                    id: "",
                    personId: '',
                    orderId: "",
                    inspectionType: 1,
                    inspectionDoctor: '',// 总检医生
                    inspectionAutograph: '',//总检医生签名
                    inspectionDate: formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),//总检日期
                    operator: '',//操作员
                    healthCertificateConditions: '合格',//健康证条件
                    conclusion: '',//结论
                    conclusionCode: "12001",//结论代码
                    handleOpinion: '',//处理意见
                    careerIllnessName: "",
                    otherCheckAbnormalResults: "",
                    positiveResultData: [],
                    cancelInspection: false,
                    tDiseaseDiagnosis: null,
                },

                radioShow: false,
                radioValue: "",//人员Id
                tableData: [],//检查项目结果
                tableLoading: false,//检查项目等待控制参数
                projectDetailShow: false,//明细结果显示
                projectRow: null,//选中的项目
                //报告预览参数
                TTemplateId: {
                    id: "dd6ca5975f9b12aa70d49dbba769013a",
                    handleOpinion: "",
                    inspectionDate: formartDate(new Date(), 'yyyy-MM-dd'),
                },
                inspectionLoading: false,//总检等待条
                reviewRecordShow: false,
                tableDataReview: null,
                tableDataReviews: null,
                auditingReportShow: false,//审核页面查看
                previewShow: false,
                PersonalReportShow:false,
                checkDoctor: "",//当前医生
                userInfo: null,//用户信息
                doctorInfo: null,//医生信息
                conclusionNow: "",//当前主检结论内容
                conclusionCodeNowData: [],//当前主检结论数据集合
                tableModalShow: false,//是否显示未检/弃检弹框
                tableModalTitle: "",//未检/弃检弹框 标题
                userArray: [],//用户集合
                CancelTheMasterCheckButton:false,//取消总检按钮
				isAllInspect:false,//是否是总检页面

            }
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
        },
        methods: {
            reviewProject(val){
                if (val){
                    this.reviewProjectData = val;
                }
            },
            //添加人员回调查询
            handleSearch(){
                if (this.status == '未审'){
                    this.personParam.pageNumber = 1;
                    this.getPersonList();
                }
            },
            //获取阳性结果建议
            getPositiveResultData(val) {
                let _this = this;
                if (val) {
                    if (_this.physicalType == '健康体检') {
                        _this.inspectForm.positiveResultData = val;
                        _this.inspectForm.handleOpinion = ''
                        if (_this.inspectForm.positiveResultData) {
                            for (let i = 0; i < _this.inspectForm.positiveResultData.length; i++) {
                                let index = i + 1
                                _this.inspectForm.handleOpinion += index + ":" + _this.inspectForm.positiveResultData[i].positiveName + "\n"
                                _this.inspectForm.handleOpinion += _this.inspectForm.positiveResultData[i].positiveSuggestion + "\n"
                            }
                        } else {
                            this.inspectForm.handleOpinion = this.inspectForm.handleOpinion
                        }
                    }
                }
            },
            //状态改变
            statusChange(v) {
                this.status = v;
                this.personList = [];
                this.inspectionInfoList = [];
                this.inspectForm.handleOpinion = '无';
                this.inspectForm.inspectionAutograph = "";
                this.personParam.keyword = '';
                this.personParam.pageNumber = 1;
                if (v == '待总检') {
                    this.PersonalReport = '预览报告'
                    this.currentIndex = 3;
                    this.personParam.isPass = 3;
                    this.inspectForm.inspectionDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');//总检日期
                    this.getPersonList();
                } else if (v == '已总检') {
                    this.PersonalReport = '审核个人报告'
                    this.currentIndex = 4;
                    this.personParam.isPass = 88;
                    this.getPersonList();
                }else if (v == '未审') {
					this.PersonalReport = '审核个人报告'
					this.currentIndex = 5;
					this.personParam.isPass = 4;
					this.getPersonList();
				} else if (v == '已审') {
					this.personParam.isPass = 5;
					this.PersonalReport = '预览报告'
					this.currentIndex = 6;
					this.getPersonList();
				}
                else {
                    this.PersonalReport = '预览报告'
                    this.currentIndex = 2;
                    this.personParam.isPass = 2;
                    this.getPersonList();
                }

            },
            //复查选择
            typeChange(e) {
                this.personParam.pageNumber = 1;
                if (!e) {
                    this.isReviewer = false;

                } else {
                    this.isReviewer = true;
                }
                this.getPersonList();
            },
            //当日当月切换
            pick(e) {
                this.personList = [];
                this.inspectionInfoList = [];
                this.personParam.pageNumber = 1;
                if (e == '自定义') {
                    this.resetSearchForm();
                    this.datePickerShow = true;
                } else if (e == '当日') {
                    this.resetSearchForm();
                    this.personParam.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    this.personParam.endDate = null;
                    this.getPersonList();
                } else if (e == '当月') {
                    this.resetSearchForm();
                    this.personParam.endDate = formartDate(new Date(), 'yyyy-MM-dd  HH:mm:ss');
                    this.personParam.startDate = null;
                    this.getPersonList();
                } else if (e == "重置") {
                    this.resetSearchForm();
                }
            },

            //重置搜索框
            resetSearchForm(e) {
                this.personParam.pageNumber = 1;
                this.personParam.personId = "";
                this.personParam.keyword = "";
                this.personParam.personName = "";
                this.personParam.testNum = "";
                this.personParam.dept = "";
                if (e) {
                    this.date = e;
                }
                if (this.date == "重置") {
                    let _this = this;
                    setTimeout(function () {
                        _this.date = "当日";
                        if (!_this.$hospitalName.queryTimeChange) {
                            let date = getMonthString(new Date());
                            if (date != null && date.length == 2) {
                                _this.personParam.startDate = date[0] + " 00:00:00";
                                _this.personParam.endDate = date[1] + " 23:59:59";
                            }
                        } else {
                            _this.personParam.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                            _this.personParam.endDate = null;
                        }
                        _this.inputSearchChange("");
                    }, 100);

                }
            },
            //日期改变（自定义）
            datePickerChange(e) {
                this.personList = [];
                this.inspectionInfoList = [];
                if (e) {
                    this.personParam.startDate = e[0];
                    var dateTime = new Date(e[1]);
                    dateTime = dateTime.setDate(dateTime.getDate() + 1);
                    this.personParam.endDate = new Date(dateTime);
                }
                this.getPersonList();
            },
            //结束日期改变
            datePickerEndTime(e) {
                if (e) {
                    let endTime = new Date(e);
                    endTime.setHours(23, 59, 59, 999);
                    endTime = endTime.setDate(endTime.getDate());
                    this.personParam.endDate = formatDate(new Date(endTime), 'yyyy-MM-dd HH:mm:ss');
                }
                this.getPersonList();
            },

            //开始日期改变
            datePickerStartTime(e) {
                if (e) {
                    let startTime = new Date(e);
                    startTime.setHours(0, 0, 0, 0);
                    startTime = startTime.setDate(startTime.getDate());
                    this.personParam.startDate = formatDate(new Date(startTime), 'yyyy-MM-dd HH:mm:ss');

                }
                this.getPersonList();
            },
            //展开、收起搜索框
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = "展开";
                    this.dropDownIcon = "ios-arrow-down";
                    this.height1 = '147px';
                } else {
                    this.dropDownContent = "收起";
                    this.dropDownIcon = "ios-arrow-up";
                    this.height1 = '234px';
                }
                this.drop = !this.drop;
            },
            //格式化时间
            formatTime(e) {
                return formartDate(e, "yyyy-MM-dd");
            },
            //切换已、未总检
            radioChooseClick(item) {
                this.remind = "";
                this.radioValue = item.id;
                this.checkProParam.personId = this.radioValue;
                this.conclusionNow = "";

                let checkResultNow = item.isRecheck;//是否复查（0-不复查，1-复查）
                this.checkResultNow = checkResultNow;
                let checkResult = "";
                if (item.checkResult) {
                    checkResult = item.checkResult;
                } else {
                    checkResult = "0";
                }

            },
            //未检已检项目
            tableModelClick(e) {
                if (e) {
                    if (e === "notChecked") {
                        this.tableModalShow = true;
                        this.tableModalTitle = "未检项目";
                    } else if (e === "abandonInspection") {
                        this.tableModalShow = true;
                        this.tableModalTitle = "弃检项目";
                    }

                }
            },
            //人员查询
            inputSearchChange(e) {
                this.personList = [];
                this.inspectionInfoList = [];
                this.personParam.pageNumber = 1;
                this.getPersonList();
            },
            //分页页数改变
            personChangePageNum(v) {
                this.personParam.pageNumber = v;
                this.getPersonList();
            },
            //获取人员列表
            async getPersonList() {
                this.checkPersonLoading = true;
                this.inspectionLoading = true;
                this.personParam.physicalType = this.physicalType;
                this.radioValue = "";
                this.conclusionNow = "";
                let _this = this;
                let searchForm = JSON.parse(JSON.stringify(_this.personParam));
                if (searchForm.startDate) {
                    searchForm.startDate = formatDate(searchForm.startDate, 'yyyy-MM-dd HH:mm:ss');
                }
                if (searchForm.endDate) {
                    searchForm.endDate = formatDate(searchForm.endDate, 'yyyy-MM-dd HH:mm:ss');
                    searchForm.endDate = searchForm.endDate.replace(" 00:00:00", " 23:59:59");
                }
                //输入了就不带时间
                if (_this.$hospitalName.queryTimeChange) {
                    if ((_this.personParam.keyword && _this.personParam.keyword.trim().length > 0) || (_this.personParam.personName && _this.personParam.personName.trim().length > 0) || (_this.personParam.testNum && _this.personParam.testNum.trim().length > 0) || (_this.personParam.dept && this.personParam.dept.trim().length > 0)) {
                        _this.personParam.startDate = null;
                        _this.personParam.endDate = null;
                        _this.date = '';//取消时间筛选
                    }
                    searchForm = JSON.parse(JSON.stringify(_this.personParam));
                } else {
                    if (searchForm.startDate == null || searchForm.startDate.trim().length == 0) {
                        searchForm.startDate = "0000-00-00 00:00:00"
                    }
                    if (searchForm.endDate == null || searchForm.endDate.trim().length == 0) {
                        let endTime = getDataString(new Date);
                        searchForm.endDate = endTime + " 23:59:59"
                    }
                }

                if (_this.isReviewer) {
                    getInspectionTGroupPersonReviewList(searchForm).then(res => {
                        if (res.success) {
                            _this.personList = res.data.records;
                            _this.personTotal = res.data.total;
                            _this.inspectForm.id = "";
                            if (_this.personList.length > 0) {
                                _this.personInfo = _this.personList[0];
                                _this.personInfo.unitName = _this.personList[0].dept;
                                _this.radioValue = _this.personList[0].id;
                                //查询第一个人员检查项目
                                _this.checkProParam.personId = _this.radioValue;
                                _this.checkProParam.groupId = _this.personList[0].groupId;
                                // _this.getCheckProject();
                            } else {
                                _this.personInfo.id = "";
                            }
                        } else {
                            _this.personInfo = {};
                            _this.remind = "";
                            _this.tableData = [];
                            _this.crisisData = [];
                            _this.noInsProjectData = [];
                            _this.noInsProject = "未检项目";
                            _this.treeData = [];
                            _this.resultData = [];
                            _this.tabsArr = [];
                            _this.radioValue = "";
                        }
                    }).finally(() => {
                        _this.checkPersonLoading = false;
                        _this.inspectionLoading = false;

                    })
                } else {
                    getInspectionTGroupPersonList(searchForm).then(res => {
                        if (res.success) {
                            _this.personList = res.data.records;
                            _this.personTotal = res.data.total;
                            _this.inspectForm.id = "";
                            if (_this.personList.length > 0) {
                                _this.personInfo = this.personList[0];
                                _this.personInfo.unitName = this.personList[0].dept;
                                _this.radioValue = this.personList[0].id;
                                //查询第一个人员检查项目
                                _this.checkProParam.personId = this.radioValue;
                                _this.checkProParam.groupId = this.personList[0].groupId;
                                // _this.getCheckProject();

                            } else {
                                _this.personInfo.id = "";
                            }
                        } else {
                            _this.personInfo = {};
                            _this.remind = "";
                            _this.tableData = [];
                            _this.radioValue = "";
                        }
                    }).finally(() => {
                        _this.checkPersonLoading = false;
                        _this.inspectionLoading = false;
                    })
                }
            },
            //左侧显示隐藏
            outChangeExpand() {
                this.outExpand = !this.outExpand;
                if (this.outExpand) {
                    this.outExpandIcon = "ios-arrow-back";
                    this.outSpan = 'position: relative;width: calc(100% - 332px);';
                    this.outLeftSpan = 'width: 17vw;'
                } else {
                    this.outExpandIcon = "ios-arrow-forward";
                    this.outSpan = 'position: relative;width: calc(100% - 32px);';
                    this.outLeftSpan = 'width: 0px;';
                }
            },
            //获取人员检查项目
            getCheckProject() {
                let _this = this;
                _this.tableLoading = true;
                _this.remind = "";
                if (_this.personInfo && _this.personInfo.group_id) {
                    _this.checkProParam.groupId = _this.personInfo.group_id;
                }
                queryTDepartResultList(_this.checkProParam).then(res => {
                    if (res.success) {
                        _this.tableData = res.data;
                    }
                }).finally(() => {
                    _this.tableLoading = false;
                })
            },
            //将数字转为中文
            changeNum(num) {
                return changeNumToHan(num);
            },
            //人员详细信息
            personInfoChang(val) {
                this.personInfo = val;
				this.getInsRecord(this.personInfo.id);
                this.radioShow = false;
            },
            //项目详情
            projectDetailClick(id) {
                this.projectDetailShow = true;
                this.projectRow = null;
                if (this.tableData && this.tableData.length > 0) {
                    let data = this.tableData.filter(aa => aa.id === id);
                    if (data && data.length > 0) {
                        this.projectRow = data[0];
                    }
                }
            },
            //查询人员总检记录
            getInsRecord(id) {
                let _this = this;
				// _this.inspectForm= {};
                _this.inspectForm.tDiseaseDiagnosis = null;
                getTInspectionRecordByPersonId({personId: id}).then(res => {
					_this.inspectForm.id="";
                    if (res.success && res.data) {
                        _this.inspectForm.id = res.data.id;
                        if(res.data.tdiseaseDiagnosis){
                            _this.inspectForm.tDiseaseDiagnosis = res.data.tdiseaseDiagnosis;
                        }else{
                            _this.inspectForm.tDiseaseDiagnosis = null;
                        }
                        _this.inspectForm.inspectionDoctor = res.data.inspectionDoctor;
                        _this.inspectForm.inspectionAutograph = res.data.inspectionAutograph;
                        _this.inspectForm.reviewResult = res.data.reviewResult;
                        _this.inspectForm.reviewResultCode = res.data.reviewResultCode;
                        _this.inspectForm.reviewOpinion = res.data.reviewOpinion;
                        _this.TTemplateId.doctor = res.data.inspectionAutograph;

                        _this.inspectForm.createId = res.data.createId;
                        if (_this.status === "待总检" && !_this.isReviewer) {//待总检且非复查，获取当前时间作为总检日期
                            _this.TTemplateId.inspectionDate = formartDate(new Date(), 'yyyy-MM-dd');
                            _this.inspectForm.inspectionDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');//总检日期
                        } else {
                            if (res.data.reviewInspectDate) {
                                _this.inspectForm.reviewInspectDate = res.data.reviewInspectDate;//复查总检日期
                                _this.TTemplateId.reviewInspectDate = formartDate(this.inspectForm.reviewInspectDate, 'yyyy-MM-dd');
                            } else {
                                _this.inspectForm.reviewInspectDate = null;//复查总检日期
                            }
                            _this.inspectForm.inspectionDate = res.data.inspectionDate;
                            _this.TTemplateId.inspectionDate = formartDate(this.inspectForm.inspectionDate, 'yyyy-MM-dd');
                        }
                        _this.inspectForm.operator = res.data.operator;
                        _this.inspectForm.healthCertificateConditions = res.data.healthCertificateConditions;
                        if (_this.physicalType == "职业体检" || _this.physicalType == "放射体检" ||_this.physicalType == "从业体检") {
                            _this.inspectForm.conclusion = res.data.conclusion;
                            _this.inspectForm.conclusionCode = res.data.conclusionCode;
                        }

                        _this.inspectForm.otherCheckAbnormalResults = res.data.otherCheckAbnormalResults;
                        _this.inspectForm.careerIllnessName = res.data.careerIllnessName;
                        _this.inspectForm.handleOpinion = res.data.handleOpinion;
                        _this.inspectForm.occupationalTabooNowCode = res.data.occupationalTabooNowCode;
                        _this.inspectForm.occupationalDiseasesNowCode = res.data.occupationalDiseasesNowCode;
                        if (res.data.conclusionCode && res.data.conclusionCode.trim().length > 0) {
                            for (let i = 0; i < this.conclusionCodeNowData.length; i++) {
                                if (_this.physicalType == "职业体检" || _this.physicalType == "放射体检") {
                                    if (_this.conclusionCodeNowData[i].value == res.data.conclusionCode) {
                                        _this.conclusionNow = _this.conclusionCodeNowData[i].title;
                                    }
                                } else {
                                    if (_this.conclusionCodeNowData[i].id == res.data.conclusionCode) {
                                        _this.conclusionNow = _this.conclusionCodeNowData[i].content;
                                    }
                                }
                            }
                        }
						if (_this.personInfo. physical_type == "职业体检" || _this.personInfo. physical_type == "放射体检") {
                            _this.inspectForm.bairns = res.data.bairns;
                            if (_this.inspectForm.bairns && _this.personInfo.hazardFactorsList && _this.personInfo.hazardFactorsList.length>0) {
								_this.$refs.occupational.inspectForm = _this.inspectForm;
                            	_this.$refs.occupational.initForm();
                                if ( _this.inspectForm.createId && _this.inspectForm.createId.toString().trim().length > 0) {
                                    _this.$refs.occupational.doctorId = _this.inspectForm.createId;
                                }
                            }
						}
                    }
                })
            },
            //取消总检
            CancelGeneralInspection(){
                this.$Modal.confirm({
                        title: "确认保存",
                        content: "当前人员已总检,确定退回到待总检",
                        loading: true,
                        onOk: () => {
                            let _this= this;
                            CancelGeneralInspection({personId:_this.personInfo.id}).then(res => {
                                this.inspectionLoading = false;
                                if (res.success) {
                                    this.$Message.success("修改成功");
                                }
                        }).finally(() => {
                                this.getPersonList();
                                this.$Modal.remove();
                            })
            }
                })},
            //总检点击
            addRecordClick() {
                let hazardFactorsList = [];

                if (this.$refs.personInfo && this.$refs.personInfo.getPersonInfo()) {
                    this.personInfo =  this.$refs.personInfo.getPersonInfo();
                    if(this.$refs.personInfo.getPersonInfo().hazardFactorsList){
						hazardFactorsList = this.personInfo.hazardFactorsList;
                    }

                }
                if(hazardFactorsList && hazardFactorsList.length>0 && (this.personInfo.physical_type == "职业体检" || this.personInfo.physical_type == "放射体检")){
                    if(this.inspectForm && this.inspectForm.bairns && this.inspectForm.bairns.length>0){
                        for(let i = 0;i < hazardFactorsList.length;i ++){
                            if(hazardFactorsList[i] && hazardFactorsList[i].code){
                                let hazardFactorsNow = this.inspectForm.bairns.filter(item => item.badrsnCode && item.badrsnCode == hazardFactorsList[i].code);
                                if(!hazardFactorsNow || hazardFactorsNow.length==0){
                                    this.$Message.error(""+hazardFactorsList[i].name+"结论未下，暂不能总检");
                                    return

                                }else if(hazardFactorsNow && hazardFactorsNow.length>1){
                                    this.$Message.error(""+hazardFactorsList[i].name+"结论重复，暂不能总检");
                                    return
                                }
                            }
                        }
                    }else{
                        this.$Message.error("危害因素结论未下，暂不能总检");
                        return
                    }
                }
                if (this.checkNum > 0) {
                    this.$Message.error("还有未检项目，暂不能总检");
                } else if (!this.inspectForm.conclusionCode && (this.personInfo.physical_type == "职业体检" || this.personInfo.physical_type == "放射体检")) {
                    this.$Message.error("体检结论未选，暂不能总检");
                } else if (!this.inspectForm.conclusion && (this.personInfo.physical_type == "职业体检" || this.personInfo.physical_type == "放射体检")) {
                    this.$Message.error("体检结论内容为空，暂不能总检");
                } else if (!this.inspectForm.handleOpinion && (this.personInfo.physical_type == "职业体检" || this.personInfo.physical_type == "放射体检")) {
                    this.$Message.error("处理意见为空，暂不能总检");
                } else if (this.isContraindication && this.occupationalTabooNow == "") {
                    this.$Message.error("职业禁忌证未选择，暂不能总检");
                } else if (this.isDiseases && this.occupationalDiseasesNow == "") {
                    this.$Message.error("职业病未选择，暂不能总检");
                } else if ((this.personInfo.physical_type == '从业体检' || this.personInfo.physicalType == '从业体检') && (this.inspectForm.healthCertificateConditions && this.inspectForm.healthCertificateConditions=="不合格" && !this.inspectForm.handleOpinion)) {
                    this.$Message.error("不合格时，异常描述不能为空");
                } else {
                    if (this.inspectForm.personId) {
                        /*if (!this.inspectForm.handleOpinion) {
                            this.$Message.error('处理意见不能为空！');
                        }*/
                        this.addRecord();
                    } else {
                        this.$Message.error("请先选择体检人员");
                    }
                }
            },
            //新增总检记录
            addRecord() {
                //拼接阳性结果
                if (this.$refs.positiveRule && this.$refs.positiveRule.getPositiveResultData()) {
                    this.getPositiveResultData(this.$refs.positiveRule.getPositiveResultData());
                }
                //获取疾病诊断
                if(this.$refs.positiveRule && this.$refs.positiveRule.getDiseaseDiagnosisData()){
                    let diseaseDiagnosisForm = this.$refs.positiveRule.getDiseaseDiagnosisData();
                    this.inspectForm.tDiseaseDiagnosis = diseaseDiagnosisForm;
                    this.inspectForm.tDiseaseDiagnosis.personId =this.inspectForm.personId;
                    this.inspectForm.tDiseaseDiagnosisString= JSON.stringify(diseaseDiagnosisForm);
                    /*this.inspectForm.tDiseaseDiagnosis = {
                        isDiseaseOne: "0",//细菌性痢疾
                        isDiseaseTwo: "0",//伤寒和副伤寒
                        isDiseaseThree: "0",//病毒性肝炎（甲型、戊型）
                        isDiseaseFour: "0",//活动性肺结核
                        isDiseaseFive: "0",//化脓性或渗出性皮肤病
                        isDiseaseSix: "0",//手癣、指甲癣
                        isDiseaseSeven: "0",//手部湿疹
                        isDiseaseEight: "1",//手部的银屑病或者鳞屑
                    };*/
                }
                this.inspectionLoading = true;
                let name = "";
                if (this.personInfo.person_name) {
                    name = this.personInfo.person_name;
                } else if (this.personInfo.personName) {
                    name = this.personInfo.personName;
                }
                if (this.personInfo.physical_type != "从业体检") {
                    this.inspectForm.healthCertificateConditions = "";
                }

                if ((this.personInfo.physical_type && this.personInfo.physical_type != '职业体检' && this.personInfo.physical_type != '放射体检') || (this.personInfo.physicalType && this.personInfo.physicalType != '职业体检' && this.personInfo.physicalType != '放射体检')) {
                    this.inspectForm.otherCheckAbnormalResults = "";
                    this.inspectForm.careerIllnessName = "";
                }
                let content = '';
                if (this.personInfo.is_pass >= 4 || this.personInfo.isPass >= 4) {
                    content = "当前人员已总检,是否确定保存";
                } else {
                    content = "您确认要保存 " + name + " 的总检记录";
                }
                this.$Modal.confirm({
                    title: "确认保存",
                    content: content,
                    loading: true,
                    onOk: () => {
                        if (this.occupationalTabooNow) {//当前所选职业禁忌证
                            this.inspectForm.occupationalTabooNow = this.occupationalTabooNow;
                        }
                        if (this.occupationalTabooNowCode) {//当前所选职业禁忌证code
                            this.inspectForm.occupationalTabooNowCode = this.occupationalTabooNowCode;
                        }
                        if (this.occupationalDiseasesNow) {//当前所选职业病
                            this.inspectForm.occupationalDiseasesNow = this.occupationalDiseasesNow;
                        }
                        if (this.occupationalDiseasesNowCode) {//当前所选职业病code
                            this.inspectForm.occupationalDiseasesNowCode = this.occupationalDiseasesNowCode;
                        }
                        //职业病12003 禁忌症12004
                        if (this.inspectForm && this.inspectForm.conclusionCode && this.inspectForm.conclusionCode != undefined) {
                            if (this.inspectForm.conclusionCode == "12003") {
                                this.inspectForm.occupationalTabooNow = "";
                                this.inspectForm.occupationalTabooNowCode = "";
                            } else if (this.inspectForm.conclusionCode == "12004") {
                                this.inspectForm.occupationalDiseasesNow = "";
                                this.inspectForm.occupationalDiseasesNowCode = "";
                            } else {
                                this.inspectForm.occupationalTabooNow = "";
                                this.inspectForm.occupationalTabooNowCode = "";
                                this.inspectForm.occupationalDiseasesNow = "";
                                this.inspectForm.occupationalDiseasesNowCode = "";
                            }
                        }
                        if (this.inspectForm && this.inspectForm.inspectionDate) {
                            this.inspectForm.inspectionDate = formartDate(this.inspectForm.inspectionDate, 'yyyy-MM-dd HH:mm:ss')
                        }
                        if (this.inspectForm.id && this.inspectForm.id.length > 0) {
                            if (this.status == "待总检") {
                                this.inspectForm.isRecheck = 1;
                            }
                            updateTInspectionRecord(this.inspectForm).then(res => {
                                this.inspectionLoading = false;
                                if (res.success) {
                                    this.$Message.success("保存成功");

                                    if ("已总检" !== this.status) {
                                        this.getPersonList();
                                    }
                                    if (this.inspectionInfoList && this.inspectionInfoList.length > 0) {
                                        this.inspectionInfoList = this.inspectionInfoList.filter(item => item.personId != this.personInfo.id);
                                    }
                                }
                                /*if((this.personInfo.physical_type == '从业体检' || this.personInfo.physicalType == '从业体检')){
                                    if(this.inspectForm.tDiseaseDiagnosis && this.inspectForm.tDiseaseDiagnosis.id){
                                        updateTDiseaseDiagnosis(this.inspectForm.tDiseaseDiagnosis).then(res => {
                                            if (res.success) {
                                                this.$Message.success('成功修改疾病诊断');
                                            }else{
                                                this.$Message.error('疾病诊断修改失败');
                                            }
                                        })
                                    }else{
                                        addTDiseaseDiagnosis(this.inspectForm.tDiseaseDiagnosis).then(res => {
                                            if (res.success) {
                                                this.$Message.success('成功添加疾病诊断');
                                            }else{
                                                this.$Message.error('疾病诊断添加失败');
                                            }
                                        })
                                    }
                                }*/
                            }).finally(() => {
                                if (this.inspectForm.cancelInspection){
                                    this.getPersonList();
                                }
                                this.$Modal.remove();
                            })
                        } else {
                            addTInspectionRecord(this.inspectForm).then(res => {
                                this.inspectionLoading = false;
                                if (res.success) {
                                    // this.personParam.keyword = "";
                                    this.personParam.pageNumber = 1;
                                    this.$Message.success('成功添加总检记录');
                                    if ("已总检" !== this.status) {
                                        this.getPersonList();
                                    }
                                    if (this.inspectionInfoList && this.inspectionInfoList.length > 0) {
                                        this.inspectionInfoList = this.inspectionInfoList.filter(item => item.personId != this.personInfo.id);
                                    }
                                }
                                /*if((this.personInfo.physical_type == '从业体检' || this.personInfo.physicalType == '从业体检')){
                                    if(this.inspectForm.tDiseaseDiagnosis && this.inspectForm.tDiseaseDiagnosis.id){
                                        updateTDiseaseDiagnosis(this.inspectForm.tDiseaseDiagnosis).then(res => {
                                            if (res.success) {
                                                this.$Message.success('成功修改疾病诊断');
                                            }else{
                                                this.$Message.error('疾病诊断修改失败');
                                            }
                                        })
                                    }else{
                                        addTDiseaseDiagnosis(this.inspectForm.tDiseaseDiagnosis).then(res => {
                                            if (res.success) {
                                                this.$Message.success('成功添加疾病诊断');
                                            }else{
                                                this.$Message.error('疾病诊断添加失败');
                                            }
                                        })
                                    }
                                }*/
                            }).finally(() => {
                                this.$Modal.remove();
                            })
                        }
                    },
                    onCancel: () => {
                        this.inspectionLoading = false;
                    }
                });
            },
            //总检报告预览
            reportPreview() {
                //判定总检类型
                let templateId = "";
                if (this.personInfo.physical_type && this.personInfo.physical_type == "职业体检") {
                    templateId = "912a58d9604775cc399b44020efa3e3a";
                } else if (this.personInfo.physical_type && this.personInfo.physical_type == "从业体检") {
                    templateId = "efc9ac2f1e298225e75306cee33f5d52";
                } else if (this.personInfo.physical_type && this.personInfo.physical_type == "放射体检") {
                    templateId = "912a58d9604775cc399b44020efa3e3a";
                } else {
                    templateId = "dd6ca5975f9b12aa70d49dbba769013a";
                }
                this.TTemplateId.id = templateId;
                this.TTemplateId.handleOpinion = this.inspectForm.handleOpinion
                if (this.personInfo.physical_type == "放射体检" || this.personInfo.physical_type == "职业体检") {
                    this.TTemplateId.conclusion = this.inspectForm.conclusion;
                }

                this.TTemplateId.otherCheckAbnormalResults = this.inspectForm.otherCheckAbnormalResults
                this.TTemplateId.careerIllnessName = this.inspectForm.careerIllnessName;
                this.TTemplateId.reviewResult = this.inspectForm.reviewResult;
                this.TTemplateId.personInfo = this.personInfo;
                this.previewShow = true;
            },
            //复查记录
            reviewRecordClick() {
                this.tableDataReview = [];
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].groupItemName.indexOf("复") > -1) {
                        this.tableDataReview.push(this.tableData[i].groupItemId)
                    }
                }
                let _this = this;

                _this.reviewRecordShow = true;

            },
            //审核
            auditingReportClick() {
                if ((this.personParam.isPass == 4||this.personParam.isPass == 88)&& this.PersonalReport === "审核个人报告"){
                    this.PersonalReportShow = true;
                }else {
                    this.auditingReportShow = true;
                }
            },
			//审核通过请求
			reportSubmit() {
            	this.inspectionLoading = true;
            	let personIds = [this.personInfo.id];
				if(!this.typeStatus){
					updateTGroupPersonById(personIds).then(res => {
						this.inspectionLoading = false;
						if(res){
							if (res.success) {
								this.$Message.success('审核成功');
								this.closeModal(false);
							} else {
								this.$Message.error(res.msg);
							}
						}
						else {
							this.$Message.error('审核失败');
						}

					}).catch(res => {
						this.$Message.error(res.msg);
					}).finally(() => {
                        this.getPersonList();
                    })
				}else{
					updateTGroupPersonByIdTypeStatus(personIds).then(res => {
						this.inspectionLoading = false;
						if(res){
							if (res.success) {
								this.$Message.success('审核成功');
								this.closeModal(false);
							} else {
								this.$Message.error(res.msg);
							}
						}
						else {
							this.$Message.error('审核失败');
						}

					}).catch(res => {
						this.$Message.error(res.msg);
					}).finally(() => {
                        this.getPersonList();
                    })
				}
			},
        },
        created() {
            this.userInfo = JSON.parse(Cookies.get("userInfo"));
            let userInfo = this.userInfo;
            if (userInfo) {
                if (userInfo.autograph) {
                    if (userInfo.autographFile && userInfo.autographFile.indexOf("/dcm") > -1) {
                        this.checkDoctor = userInfo.autographFile;
                    } else {
                        this.checkDoctor = "data:image/png;base64," + res.data.autograph;
                    }
                }
                this.inspectForm.inspectionDoctor = userInfo.nickname;
                this.TTemplateId.doctor = userInfo.autograph;
                this.doctorInfo = userInfo;
                if (this.doctorInfo.autograph) {
                    if (this.doctorInfo.autographFile && this.doctorInfo.autographFile.indexOf("/dcm") > -1) {
                        this.doctorInfo.autograph = this.doctorInfo.autographFile;
                    } else {
                        this.doctorInfo.autograph = "data:image/png;base64," + this.doctorInfo.autograph;
                    }
                }
            }

			getAllUserData().then(res => {
				if (res.success && res.data) {
					if (res.data) {
						this.userArray = res.data;
					}
				}
			});
        },
        mounted() {
			this.isAllInspect = false;
			this.status = "待总检";
			this.personParam.isPass=3;
        	//区分是不是审核页面
			if(this.$router.currentRoute){
				let currentRoute = this.$router.currentRoute
				if(currentRoute.name && currentRoute.name=="tAllInspect"){
					this.isAllInspect = true;
					this.status = "待总检";
					this.personParam.isPass=3;
				}
				else if(currentRoute.name && currentRoute.name=="bgsh"){
					this.isAllInspect = false;
					this.status = "未审";
					this.personParam.isPass=4;
                    this.PersonalReport = '审核个人报告'
				}
			}
            if (this.$hospitalName && this.$hospitalName.cancelGeneralInspection){
                this.CancelTheMasterCheckButton = this.$hospitalName.cancelGeneralInspection
            }

            this.isInspectionChange = false;
            //是否变更总检样式
            if (this.$hospitalName && this.$hospitalName.isInspectionChange) {
                this.isInspectionChange = this.$hospitalName.isInspectionChange;
            }
            if (this.$hospitalName.isUpdateUnitPage) {
                this.isUpdateUnitPage = this.$hospitalName.isUpdateUnitPage;
                if (this.isUpdateUnitPage) {
                    this.nametjjl = "体检结果";
                } else {
                    this.nametjjl = "体检结果";
                }
            }

            this.date = "当日";
            let date = getMonthString(new Date());
            if (!this.$hospitalName.queryTimeChange) {
                if (date != null && date.length == 2) {
                    this.personParam.startDate = date[0] + " 00:00:00";
                    this.personParam.endDate = date[1] + " 23:59:59";
                    this.getPersonList();
                }
            } else {
                this.pick("当日");
            }

            /*userInfo().then(res => {
                if (res.success) {
                    if(res.data.autograph){
                        if(res.data.autographFile && res.data.autographFile.indexOf("/dcm") > -1){
                            this.checkDoctor = res.data.autographFile;
                        }else{
                            this.checkDoctor = "data:image/png;base64," + res.data.autograph;
                        }
                    }
                    this.inspectForm.inspectionDoctor = res.data.nickname;
                    this.TTemplateId.doctor = res.data.autograph;
                    this.doctorInfo = res.data;
                    if (this.doctorInfo.autograph) {
                        if(this.doctorInfo.autographFile && this.doctorInfo.autographFile.indexOf("/dcm") > -1){
                            this.doctorInfo.autograph = this.doctorInfo.autographFile;
                        }else{
                            this.doctorInfo.autograph = "data:image/png;base64," + this.doctorInfo.autograph;
                        }
                    }
                }
            });*/
        },

        watch: {
            radioValue(val) {
                if (val) {
                    //清空体检结果及意见
                    this.isContraindication = false;
                    this.isDiseases = false;
                    this.isReviewResult = false;
                    this.radioShow = true;
                    this.personInfo = {};
                    this.checkProParam = {};
                    this.tableData = [];
                    if (this.personList && this.personList.length > 0) {
                        let persons = this.personList.filter(aa => aa.id === this.radioValue);
                        if (persons && persons.length > 0) {
                            this.personInfo = persons[0];
                            this.checkProParam.personId = this.personInfo.id;
                            this.checkProParam.groupId = this.personInfo.groupId;

                            this.getPositiveResultData();
                            this.inspectForm.personId = this.personInfo.id;
                        }
                    }
                }
            },
            'personInfo.id'(val) {
                this.tableData = [];
                if (this.$refs.positiveRule && this.$refs.positiveRule.positiveResultData) {
                    this.$refs.positiveRule.positiveResultData = [];
                }
                if (this.$refs.positiveRule && this.$refs.positiveRule.abnormalInfo) {
                    this.$refs.positiveRule.abnormalInfo = '';
                }
                if (val) {
                    this.getCheckProject();
                }


            },
        },
    }
</script>

<style lang="less">
    @import "../../../styles/tree&table-common.less";

    .generalInspection {
        padding: 10px;
        box-sizing: border-box;
        height: 100%;

        .card {
            height: calc(100vh - 80px);
            overflow: hidden;
            border-top-left-radius: 0;
            border-top-right-radius: 0;

            .btngroup {
                margin-bottom: 10px;

                .ivu-radio-group-item {
                    padding: 0 6px !important;
                    font-size: 13px !important;
                    user-select: none;
                }
            }

            .ivu-scroll-container {
                height: calc(100vh - 260px) !important;

                &::-webkit-scrollbar {
                    width: 0px;
                }

                .ivu-scroll-loader {
                    position: relative;
                    bottom: -30px;
                }
            }

            .radio-group {
                overflow: auto;
                width: 100%;
                height: 92%;
                padding-bottom: 30px;

                &::-webkit-scrollbar {
                    width: 0;
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
                    border: 1px solid magenta;
                    border-radius: 8px;
                    text-align: center;
                    color: magenta;
                }

                .border-purple {
                    border: 1px solid orangered;
                    border-radius: 8px;
                    text-align: center;
                    color: orangered;
                }

                .row-border {
                    margin-left: 0 !important;
                    padding-top: 10px;
                    padding-bottom: 10px;
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

                .radio-group-content {
                    padding-left: 0 !important;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: flex;
                }
            }
        }

        .ivu-form-item {
            margin-bottom: 0 !important;
        }

        .icon-menu-unfold {
            font-size: 20px;
        }

        .pic {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .pic-box {
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1px;
                box-sizing: border-box;
                width: 150px;
                height: 150px;
                line-height: 150px;
                margin-right: 10px;
                border: 1px dashed #ccc;
                cursor: pointer;

                &:hover {
                    .demo-upload-list-cover {
                        display: block;
                    }
                }
            }
        }

        .txtFrom {
            .ivu-form {
                .ivu-form-item-label {
                    font-weight: bold;
                    line-height: 1.9;
                }

                .ivu-form-item-content {
                    line-height: 46px;
                }
            }

            height: 34px;
        }


        .details-result {
            .ivu-table td, .ivu-table th {
                height: 32px;
            }

            .ivu-tabs .ivu-tabs-tabpane {
                height: 515px !important;
            }

        }

        .ivu-card-head {
            padding: 10px 16px;
            background-color: #f7f7f7;
            user-select: none;
        }

        .ivu-card-head p {
            font-size: .729vw;
            font-weight: 700;
        }

        .ivu-card-body {
            height: 100%;
            min-width: 235px;
            padding-right: 0px;
        }

        .resultCardUl {
            max-height: calc(100% - 30px);
            overflow-y: auto;
            list-style: none;

            .title {
            }

            .list {
                padding-left: 1.406vw;
                line-height: 1.354vw;
            }

            li {
                margin-bottom: 0.521vw;
                cursor: pointer;
                /*user-select: none;*/

            }

            .pricesData {
                color: red;
                font-weight: 700;
            }
        }

        .resultCardUl::-webkit-scrollbar {
            width: 4px;
        }

        .resultCardUl::-webkit-scrollbar-track {
            background-color: #e4e4e4;
            border-radius: 100px;
        }

        .resultCardUl::-webkit-scrollbar-thumb {
            background-color: #2684e780;
            border-radius: 100px;
        }

        .abnormalInformationDiv {
            width: 100%;

            .ivu-collapse-header {
                user-select: none;
                font-size: 0.729vw;
                font-weight: 700;
            }
        }



        .middleBottomRow {
            position: absolute;
            bottom: 10px;
            right: 50px;
        }

        .ivu-card-extra {
            top: 6px;
        }

        .occupationalCol::-webkit-scrollbar {
            width: 4px;
        }

        .occupationalCol::-webkit-scrollbar-track {
            background-color: #e4e4e4;
            border-radius: 100px;
        }

        .occupationalCol::-webkit-scrollbar-thumb {
            background-color: #2684e780;
            border-radius: 100px;
        }
    }
</style>