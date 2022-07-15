<template>
    <div class="reportPrint">
        <Row style="height: 100%;">
            <Col v-if="expand" :style="leftSpan">
                <Card style="height: 100%">
                    <Alert class="alert">人员查询</Alert>
                    <Row  style="margin-bottom: 10px;" v-if="personData && personData.length > 0">
                        <Button type="primary" style="" size="small" style="height: 20px;padding: 0 5px;line-height: 19px !important;" @click="downloadTemplate()">下载Word</Button>
                        <Button type="primary" style="" size="small" style="height: 20px;padding: 0 5px;line-height: 19px !important;" @click="batchPrintSelect">批量打印</Button>
                        <Button type="primary" style="" size="small" style="height: 20px;padding: 0 5px;line-height: 19px !important;" @click="confirmPrintSelect">打印确认</Button>
                    </Row>
                    <div style="display: flex;margin-top: 10px;">
                        <Checkbox
                                :indeterminate="indeterminate"
                                :value="checkAll"
                                @click.prevent.native="handleCheckAll">全选
                        </Checkbox>
                        <RadioGroup type="button" size="small" class="btngroup" button-style="solid" v-model="date"
                                    @on-change="pick">
                            <Radio label="当日"></Radio>
                            <Radio label="当月"></Radio>
                            <DatePicker
                                :open="datePickerShow"
                                transfer
                                type="daterange"
                                @on-change="datePickerChange">
                                <template>
                                    <Radio label="自定义" @click.native="datePickerShow = !datePickerShow"></Radio>
                                </template>
                            </DatePicker>
                            <Radio label="重置" @click="resetSearchForm"></Radio>
                        </RadioGroup>
                    </div>
                    <!--<Input suffix="ios-search" placeholder="请输入关键字" style="margin-top: 10px;" class="search-input" v-model="searchForm.keyword"
                           @keypress.native.enter="inputSearchChange"
                           clearable @on-clear="inputSearchChange"/>-->
                    <Input v-model="searchForm.personName" placeholder="请输入姓名" @on-clear="inputSearchChange('')"
                           @keypress.native.enter="inputSearchChange" style="margin-top: 10px;margin-bottom: 10px;" clearable/>
                    <Input v-model="searchForm.testNum" placeholder="请输入体检编号" @on-clear="inputSearchChange('')"
                           @keypress.native.enter="inputSearchChange" style="margin-bottom: 10px;" clearable v-if="drop"></Input>
                    <Input v-model="searchForm.dept" placeholder="请输入单位名称" @on-clear="inputSearchChange('')"
                           @keypress.native.enter="inputSearchChange" style="margin-bottom: 10px;" clearable v-if="drop"></Input>
                    <Button type="primary" @click="inputSearchChange" size="small">查询</Button>
                    <a class="drop-down" @click="dropDown">
                        {{dropDownContent}}
                        <Icon :type="dropDownIcon"></Icon>
                    </a>
                    <!--<Select v-model="searchForm.unitId" placeholder="请选择体检单位" filterable clearable style="margin-top: 10px;" @on-change="inputSearchChangeUitId">-->
                    <!--    <Option v-for="(item, i) in unitDataArry" :key="item.id" :value="item.id">{{ item.name }}</Option>-->
                    <!--</Select>-->
                    <!--左侧套餐列-->
                    <Row :style="{'height': 'calc(100% - '+height1+')'}" style="justify-content: center;">
                        <CheckboxGroup class="radio-group" v-model="radioValue" @on-change="peopleChange" v-if="personData.length > 0">
                            <Row style="margin-left: 15px;" class="row-border" v-for="(item,index) in personData" :key="index" v-bind:class="{ 'active': item.id == personInfo.id }">
                                <!--                                <Col :span="3" class="radio-group-radio" v-if="searchForm.isPass == 4">-->
                                <Col :span="3" class="radio-group-radio">
                                    <Checkbox class="label"  :label="item.id"></Checkbox>
                                </Col>
                                <!--<Col :span="3" class="radio-group-radio" v-else>
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
                                                    <div style="padding: 0 5px;" class="bg-green" v-if="item.isPass == 5">
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
                        <Page v-if="personData.length > 0" :current="searchForm.pageNumber" :total="groupDataTotal" simple
                              @on-change="personChangePageNum"/>
                    </Row>
                </Card>
            </Col>
            <div class="expand">
                <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand"/>
            </div>
            <Col :style="span" >
                <Card style="height: calc(100vh - 83px);overflow:hidden;" v-if="personData && personData.length>0">
                    <Tabs size="small" :value="tabsClickIndex" @on-click="tabsClick">
                        <TabPane label="个人体检报告" name="0">
                            <div class="previewIframe">
                                <iframe  ref="previewHtmlUrl" :src="previewHtmlUrl" frameborder="0" style="width: 100%; height: 100%"></iframe>
                            </div>
                        </TabPane>
                        <TabPane label="告知书" name="1" v-if="physicalType == '职业体检' || physicalType == '放射体检'">
                            <div class="previewIframe" >
                                <iframe  ref="previewHtmlGZS" :src="previewHtmlUrlGZS" frameborder="0" style="width: 100%; height: 100%"></iframe>
                            </div>
                        </TabPane>
                        <TabPane label="封面" name="2" v-if="(physicalType == '职业体检' || physicalType == '健康体检' || physicalType == '放射体检') && isShowFirstPage">
                            <div class="previewIframe" >
                                <iframe  ref="previewHtmlFM" :src="previewHtmlUrlFM" frameborder="0" style="width: 100%; height: 100%"></iframe>
                            </div>
                        </TabPane>
                        <div v-for="(item,i) in tabPanes" :label="item.name" :key="i"  style="display: none">
                            <preview-print  v-if="item.id!='name11'"  ref="previewPrint" :preview-id="'preview'+i"
                                           :group-item-data="tabItems"
                                           :depart-item-results="departItemResults"
                                            :t-template-id="item.templateId"
                                           :base-project-id="item.baseProjectId"
                                           :depart-result-id="item.departResultId"
                                           :group-item-id="item.groupItemId"
                                           :person-id="personId"
                                           :person-info="personInfo"
                                           :t-template-type="item.type"
                                           :checkSign="item.checkSign"
                                           :healthCheckup="item.healthCheckup"
                                           :name="item.name"
                                           :isShow="item.isShow"
                                           :opinion="item.opinion"
                                           :inspectResult="item.inspectResult"
                                           v-on:closeLoading="closeLoading"></preview-print>
<!--                            <iframe v-else :src="previewHtmlUrl" frameborder="0" style="width: 100%; height: 100%"></iframe>-->
                        </div>
                    </Tabs>
                </Card>
                <Card v-else>
                    <no-data width="150" style="height: calc(100vh - 128px);overflow:hidden;display:flex;flex-direction:row;justify-content:center;"></no-data>
                </Card>
            </Col>
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
    getTGroupPersonAndUnit,
    getTGroupPersonInspection,
    updateTGroupPersonAvatar,
    updateTPrintStateById
} from "@/api/healthy/tGroupPerson";
import {generatePhysicalExaminationReport,generateReportByPersonId,generateReportByPersonIds,generateReportByPersonIdsNotice,generateReportByPersonIdsfirstPage,generateWordReport,getReportWordBatch} from '@/api/healthy/tTemplate'

import {getItemByGroupId} from "@/api/healthy/tDepartResult";
import Viewer from "viewerjs";
import previewPrint from "./previewPrint";
import {getTGroupPersonWithLink} from "../../../api/healthy/tGroupPerson";
import {queryAllTGroupUnitList} from "../../../api/healthy/tGroupUnit";
import {getTInspectionRecordByPersonId} from "../../../api/healthy/tInspectionRecord";
import {formartDate} from "../../../api/tools/tool";
import noData from "@/components/no-data"
import {queryRelationPersonProjectCheckAll} from "../../../api/healthy/relationPersonProjectCheck";
import {getTOrderGroup} from "@/api/healthy/tOrderGroup";
import templateJs from "../reportReview/templateJs/templateJs";
import {exportWord} from '@/api/healthy/tTemplate'

export default {
    name: "reportPrint",
    components: {previewPrint,noData},
    data() {
        return {
            dropDownContent: "展开",
            dropDownIcon: "ios-arrow-down",
            drop: false,
            height1: '205px',

            isShowGuidancePage: false,//是否展示保健指导页面
            isSplitConclusion: false,//是否拆分结果页面
            isBatchPrint: false,//是否批量打印
            isShowFirstPage: false,//是否展示首页封面模板
            personAll: [],
            indeterminate: true,
            radioValue: [],
            checkAll: false,
            unitDataArry: [],
            unitId: '',
            groupDataTotal: 0,
            date: '',
            datePickerShow: false,
            currentIndex: 1,
            checkPersonLoading: false,
            isRadioChecked: "",
            personData: [],
            expand: true,
            leftSpan: 'width: 300px;',
            span: 'position: relative;width: calc(100% - 332px);',
            tGroupUnitForm: {},
            personInfo: {},
            loading: false,
            data: [],
            expandIcon: "ios-arrow-back",
            searchForm: {
                pageNumber: 1,
                pageSize: 10,
                isPass: 5,
                keyword: "",
                unitId: "",
                personName: "",//姓名
                testNum: "",//体检编号
                dept: "",//单位名称
            },
            tabPanes: [/*{
                "name": "医学声明",
                "templateId": "eab2a5038638c33d2f20f0c0ff5e59c1",
                "id": "",
                "type": "医学声明",
                "baseProjectId": ""
            }*/],
            tabItems: [],
            selectTabName: "引导单",
            personId: "",//选择的人员Id
            groupId: "",//选择的人员的组织Id
            timer: null,//定时器
            pdfPaths: [],//合成体检报告的PDf
            previewHtmlUrl: "",//体检报告PDf
            abandonInspectionIdData: [],//弃检项目id
			orderGroupData:[],//人员的 订单分组数据
			departItemResults:[],//分项结果

            tabsClickIndex: 0,
            previewHtmlUrlGZS: "",//体检报告(告知书)PDf
            previewHtmlUrlFM: "",//体检报告(封面)PDf

            isShowPage: false,//是否展示页面(首页尾页及相关说明)
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
                this.height1 = '205px';
            } else {
                this.dropDownContent = "收起";
                this.dropDownIcon = "ios-arrow-up";
                this.height1 = '294px';
            }
            this.drop = !this.drop;
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
        //人员日期查询
        datePickerChange(e) {
            this.personData = [];
            if (e) {
                this.searchForm.startDate = e[0];
                var dateTime  = new Date(e[1]);
                dateTime = dateTime.setDate(dateTime.getDate() + 1);
                this.searchForm.endDate = new Date(dateTime);
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
        resetSearchForm() {
            // this.tabPanes = [];
            // this.searchForm.pageSize = 15;
            this.searchForm.pageNumber = 1;
            this.searchForm.keyword = "";
            this.searchForm.unitId = '';
            this.searchForm.startDate = null;
            this.searchForm.endDate = null;
            this.searchForm.personName = "";
            this.searchForm.testNum = "";
            this.searchForm.dept = "";
            if (this.date == "重置") {
                this.date = "当日";
                this.searchForm.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                this.searchForm.endDate = null;
                this.inputSearchChange("");
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
                this.radioValue = data;
            } else {
                this.$Message.info("请选择人员");
            }
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
            if (this.loading) {
                return;
            }
            this.isRadioChecked = id;
        },
        //人员查询
        inputSearchChange(e) {
            // this.previewHtmlUrl="";
            this.searchForm.physicalType = this.physicalType;
            this.loading = true;
			this.personAll = [];
            //输入了就不带时间
            if((this.searchForm.keyword && this.searchForm.keyword.trim().length>0) || (this.searchForm.personName && this.searchForm.personName.trim().length>0) || (this.searchForm.testNum && this.searchForm.testNum.trim().length>0) || (this.searchForm.dept && this.searchForm.dept.trim().length>0)){
                this.searchForm.startDate = null;
                this.searchForm.endDate = null;
                this.date = '';//取消时间筛选
            }
            getTGroupPersonInspection(this.searchForm).then(res => {
				this.loading = false;
                if (res.success) {
                    this.personData = res.data.records;
                    this.groupDataTotal = res.data.total;
                    if (this.personData.length > 0) {
                        this.isRadioChecked = this.personData[0].id;
                        this.radioValue = [];
                        for (let i = 0; i < this.personData.length; i++) {
                            this.personAll.push(this.personData[i].id);
                        }
                        setTimeout(() => {
                            this.radioValue.push(this.personData[0].id);
                        },100)
                    }else{
                        this.personIds = [];
                        this.isRadioChecked = "";
                    }
                }
            }).finally(() => {
                // this.checkPersonLoading = false;
            });
        },
        inputSearchChangeUitId() {
            this.searchForm.physicalType = this.physicalType;
			this.loading = true;
            getTGroupPersonInspection(this.searchForm).then(res => {
				this.loading = false;
                if (res.success) {
                    this.personData = res.data.records;
                    this.groupDataTotal = res.data.total;
                    if (this.personData.length > 0) {
                        this.isRadioChecked = this.personData[0].id;
                    }
                }
            });
        },
        //下拉加载更多
        handleReachBottom() {
            this.searchForm.pageNumber = parseInt(this.searchForm.pageNumber) + 1;
            getTGroupPersonInspection(this.searchForm).then(res => {
                if (res.success) {
                    this.personData.concat(res.data.records);
                }
            });
        },

        /**
         * tab点击事件
         * @param name
         */
        tabsClick(name) {
            this.tabsClickIndex = name;
            // this.selectTabName = name;
        },
        /**
         * 获取体检报告
         */
        getReport() {
            let _this = this;
            generatePhysicalExaminationReport({pdfPaths: this.pdfPaths, personId: this.personId}).then(res => {
                _this.closeLoading();
                if (res.success) {
                    let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                    this.previewHtmlUrl = url;
                }
            }).catch(function (error) {
                _this.closeLoading();
            });
        },
		/**
		 * 获取体检报告
		 */
		getReportWord(data) {
			let _this = this;
			generateWordReport({wordData: data, personId: this.personId}).then(res => {
				_this.closeLoading();
				if (res.success) {
					let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
					this.previewHtmlUrl = url;
				}
			}).catch(function (error) {
				_this.closeLoading();
			});
		},
        /**
         * 获取体检报告
         */
        getReportWordBatch(data) {
            let _this = this;
            getReportWordBatch({data: data}).then(res => {
                _this.closeLoading();
                if (res.success) {
                    let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                    this.previewHtmlUrl = url;
                    if(_this.isBatchPrint){
                        setTimeout(function () {
                            _this.$refs.previewHtmlUrl.contentWindow.print();
                        }, 1000)
                    }
                }
            }).catch(function (error) {
                _this.closeLoading();
            });
        },
        /**
         * 获取体检报告(告知书)
         */
        getReportWordBatchNotice(data) {
            let _this = this;
            getReportWordBatch({data: data,name: "告知书"}).then(res => {
                _this.closeLoading();
                if (res.success) {
                    let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                    // this.previewHtmlUrl = url;
                    this.previewHtmlUrlGZS = url;
                    setTimeout(function () {
                        _this.$refs.previewHtmlGZS.contentWindow.print();
                    }, 1000)
                }
            }).catch(function (error) {
                _this.closeLoading();
            });
        },
        /**
         * 获取体检报告(封面)
         */
        getReportWordBatchfirstPage(data) {
            let _this = this;
            getReportWordBatch({data: data,name: "封面模板"}).then(res => {
                _this.closeLoading();
                if (res.success) {
                    let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                    this.previewHtmlUrlFM = url;
                    setTimeout(function () {
                        _this.$refs.previewHtmlFM.contentWindow.print();
                    }, 1000)
                }
            }).catch(function (error) {
                _this.closeLoading();
            });
        },
        getReportWordNotice(data) {
            let _this = this;
            getReportWordBatch({data: data,name: "告知书"}).then(res => {
                // _this.closeLoading();
                if (res.success) {
                    let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                    // this.previewHtmlUrl = url;
                    this.previewHtmlUrlGZS = url;
                }
            }).catch(function (error) {
                _this.closeLoading();
            });
        },
        getReportWordfirstPage(data) {
            let _this = this;
            getReportWordBatch({data: data,name: "封面模板"}).then(res => {
                if (res.success) {
                    let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + res.data;
                    this.previewHtmlUrlFM = url;
                }
            }).catch(function (error) {
                _this.closeLoading();
            });
        },
        /**
         * 关闭loading
         */
        closeLoading() {
            this.loading = false;
        },
        /**
         * 人员选择改变事件
         */
        personChange() {
            let _this = this;
            if (_this.personId) {
                _this.previewHtmlUrl = "";
                this.loading = true;
                //根据人员Id查询人员信息以及检查结果
                generateReportByPersonId({personId: _this.personId}).then(res => {
                    if (res.success && res.data && res.data.mapPerson) {
                        _this.personInfo = res.data.mapPerson;
                        _this.personInfo.orderGroupData = res.data.orderGroup ;
                        if (res.data.mapPerson.personProjectCheck) {
                            _this.abandonInspectionIdData = [];
                            for(let i = 0;i < res.data.mapPerson.personProjectCheck.length;i ++){
                                _this.abandonInspectionIdData.push(res.data.mapPerson.personProjectCheck[i].orderGroupItemId)//弃检项目id
                            }
                        }
                        let workStateText = "";
                        if (_this.personInfo.work_state_text) {
                            workStateText = _this.personInfo.work_state_text;//监护种类(在岗状态)
                        }
                        let templateId = "";
                        let templateTGId = "";
                        let templateYKId = "";
                        let templateIdWzk = "";
                        if (_this.physicalType == "健康体检") {
                            templateId = "fe91d48556bc54ae224beebcbaece476";
                            templateTGId = "6e53c87e7d7cea49245ee99ab95dc385";
                            templateYKId = "676c51485eab4a822ff91c635a1debd8";
                        }else if (_this.physicalType == "职业体检") {
                            templateId = "6adc35bad272d6d87d802290cb103db7";
                            templateTGId = "67cf79eb6b0e8a9c783b71f69b0fb2bd";
                            templateYKId = "b144ea3b9afefe990cf4835c7e2475e6";
                            if(workStateText == "上岗前" || workStateText.indexOf("上岗前") > -1){
                                templateIdWzk = "5df05fdececfeca4b15a80571716a061";
                            }else{
                                templateIdWzk = "fa087787c20db9caf85026779e7ff77c";
                            }
                        }else if(_this.physicalType == "放射体检"){
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
                        _this.tabPanes = [{
                            "name": "体检报告(汇总)",
                            "templateId": templateId,
                            "id": "name11",
                            "baseProjectId": "",
                            "healthCheckup": []
                        }];
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
                        }
                        if (_this.physicalType && _this.physicalType == "健康体检") {
                            if(_this.isShowPage) {//首页封面及相关说明
                                _this.tabPanes.push({
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
                            _this.tabPanes.push({
                                "name": "检查结果及处理意见",
                                "templateId": conclusionTemplateId,
                                "id": "",
                                "type": "检查结果及处理意见",
                                "baseProjectId": "",
                                "healthCheckup": []
                            });
                        } else if (_this.physicalType && _this.physicalType == "职业体检") {
                            if(_this.isShowPage) {//首页封面及相关说明
                                _this.tabPanes.push({
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
                            _this.tabPanes.push({
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
                        } else if (_this.physicalType && _this.physicalType == "放射体检") {
                            if(_this.isShowPage) {//首页封面及相关说明
                                _this.tabPanes.push({
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
                            _this.tabPanes.push({
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
                        let dataJYK = res.data.departResults.filter(item => item.officeName.indexOf("检验科") > -1);
                        //心电图
                        let dataXDT = res.data.departResults.filter(item => item.officeName.indexOf("心电图") > -1);
                        //电测听
                        let dataCYCT = res.data.departResults.filter(item => item.officeName.indexOf("电测听") > -1);
                        //彩超
                        let dataBC = res.data.departResults.filter(item => item.officeName.indexOf("彩超") > -1);
                        //DR
                        let dataDR = res.data.departResults.filter(item => item.officeName.indexOf("DR") > -1);
                        //CT
                        let dataCT = res.data.departResults.filter(item => item.officeName.indexOf("CT") > -1);
                        //肺功能
                        let dataFGN = res.data.departResults.filter(item => item.officeName.indexOf("肺功能") > -1);
                        //其他科室
                        let dataOthers = res.data.departResults.filter(item => item.officeName.indexOf("肺功能") <= -1 && item.officeName.indexOf("CT") <= -1 && item.officeName.indexOf("DR") <= -1 && item.officeName.indexOf("彩超") <= -1 && item.officeName.indexOf("电测听") <= -1 && item.officeName.indexOf("心电图") <= -1 && item.officeName.indexOf("检验科") <= -1);
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

                        _this.tabItems = res.data.departResults;
                        // _this.tabItems = tabItemsData;
                        _this.departItemResults = res.data.departItemResults;
                        let arrNew = [];
                        if (_this.tabItems && _this.tabItems.length > 0) {
                            for (let i = 0; i < _this.tabItems.length; i++) {
                                if (_this.tabItems[i] && _this.tabItems[i].groupItemId && _this.abandonInspectionIdData.indexOf(_this.tabItems[i].groupItemId) <= -1) {
                                    //复检的先不到报告里
                                    if (_this.tabItems[i].groupItemName.indexOf("(复)") > -1) {
                                        let isShowReview = _this.$hospitalName.isShowReview;//是否展示复查报告
                                        if(!isShowReview){
                                            continue;
                                        }
                                    }
                                    //获取 分项汇总 检查结果数据(总览)
                                    let officeName = _this.tabItems[i].officeName.replaceAll(" ", "");//科室名称
                                    let groupItemName = _this.tabItems[i].groupItemName.replaceAll(" ", "");//项目名称
                                    let dataOfficeFXHZ = ["一般检查", "五官科", "口腔科", "眼科", "内科", "外科", "皮肤科", "妇科", "肺功能", "电测听", "心电图"];//分项汇总 科室名称集
                                    let dataOfficeBoth = ["心电图", "肺功能", "电测听", "五官科", "口腔科", "眼科"];//分项汇总和后面详细报告 都有的 科室名称集
                                    let dataGroupNameYC = ["口腔定位检查"];//牙齿画十字线(五官科、口腔科) 项目名称集
                                    if (dataOfficeFXHZ.indexOf(officeName) > -1) {
                                        groupItemIdsTGFX.push({
                                            "name": _this.tabItems[i].groupItemName,
                                            "groupItemId": _this.tabItems[i].groupItemId,
                                            "checkSign": _this.tabItems[i].checkSign,
                                            "opinion": _this.tabItems[i].diagnoseSum,//小结
                                            "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        if(dataOfficeBoth.indexOf(officeName) > -1 || groupItemName.indexOf("眼科") > -1 || dataGroupNameYC.indexOf(groupItemName) > -1 || groupItemName.indexOf("口腔定位") > -1){
                                            //继续执行
                                        }else{
                                            continue;
                                        }
                                    }
                                    //获取 体格检查 检查结果数据(详细)
                                    let dataOfficeTG = ["一般检查", "五官科", "口腔科", "内科", "外科", "皮肤科"]
                                    if (dataOfficeTG.indexOf(officeName) > -1) {
                                        groupItemIds.push({
                                            "name": _this.tabItems[i].groupItemName,
                                            "groupItemId": _this.tabItems[i].groupItemId,
                                            "checkSign": _this.tabItems[i].checkSign,
                                            "opinion": _this.tabItems[i].diagnoseSum,//小结
                                            "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
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
                                            "name": _this.tabItems[i].groupItemName,
                                            "groupItemId": _this.tabItems[i].groupItemId,
                                            "checkSign": _this.tabItems[i].checkSign,
                                            "opinion": _this.tabItems[i].diagnoseSum,//小结
                                            "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        continue;
                                    }
                                    //获取 妇科检查 检查结果数据(详细)
                                    if (officeName.indexOf("妇科") > -1) {
                                        groupItemIdsFK.push({
                                            "name": _this.tabItems[i].groupItemName,
                                            "groupItemId": _this.tabItems[i].groupItemId,
                                            "checkSign": _this.tabItems[i].checkSign,
                                            "opinion": _this.tabItems[i].diagnoseSum,//小结
                                            "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        });
                                        continue;
                                    }
                                    //其他化验项目 检查结果数据(生化合并)
                                    _this.tabPanes.push({
                                        "name": _this.tabItems[i].groupItemName,
                                        "templateId": "",
                                        "id": "",
                                        "type": "分项报告",
                                        "baseProjectId": _this.tabItems[i].portfolioProjectId,
                                        "departResultId": _this.tabItems[i].id,
                                        "groupItemId": _this.tabItems[i].groupItemId,
                                        "checkSign": _this.tabItems[i].checkSign,
                                        "healthCheckup": [],
                                        "opinion": _this.tabItems[i].diagnoseSum,//小结
                                        "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
                                        "officeName": officeName,//所属科室
                                        "isShow": true,//是否显示基本信息
                                    });
                                    /*if(officeName.indexOf("检验科") > -1 && groupItemName.indexOf("尿常规") <= -1 && groupItemName.indexOf("血常规") <= -1 && groupItemName.indexOf("复") <= -1){
                                        let departItemResultsNow = _this.departItemResults.filter(ii => ii.orderGroupItemId == _this.tabItems[i].groupItemId);
                                        departItemResultsNow = this.removeList(departItemResultsNow);
                                        let numberCount = departItemResultsNow.length
                                        if(numberCount >= 20){
                                            _this.tabPanes.push({
                                                "name": _this.tabItems[i].groupItemName,
                                                "templateId": "",
                                                "id": "",
                                                "type": "分项报告",
                                                "baseProjectId": _this.tabItems[i].portfolioProjectId,
                                                "departResultId": _this.tabItems[i].id,
                                                "groupItemId": _this.tabItems[i].groupItemId,
                                                "checkSign": _this.tabItems[i].checkSign,
                                                "healthCheckup": [],
                                                "opinion": _this.tabItems[i].diagnoseSum,//小结
                                                "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
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
                                        _this.tabPanes.push({
                                            "name": _this.tabItems[i].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": _this.tabItems[i].portfolioProjectId,
                                            "departResultId": _this.tabItems[i].id,
                                            "groupItemId": _this.tabItems[i].groupItemId,
                                            "checkSign": _this.tabItems[i].checkSign,
                                            "healthCheckup": [],
                                            "opinion": _this.tabItems[i].diagnoseSum,//小结
                                            "inspectResult": _this.tabItems[i].diagnoseTip,//影像所见(诊断提醒)
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
                                    groupItemIds.push(_this.tabItems[int].groupItemId);
                                    if(n == arrNew.length - 1){
                                        tabItemsAdd.push({
                                            "name": _this.tabItems[int].groupItemName,
                                            "templateId": "",
                                            "id": "",
                                            "type": "分项报告",
                                            "baseProjectId": "",
                                            "departResultId": "",
                                            "groupItemId": groupItemIds,
                                            "checkSign": _this.tabItems[int].checkSign,
                                            "healthCheckup": [],
                                            "opinion": "",//小结
                                            "inspectResult": "",//影像所见(诊断提醒)
                                            "officeName": "检验科",//所属科室
                                            "isShow": false,//是否显示基本信息
                                        })
                                    }
                                }else{
                                    tabItemsAdd.push({
                                        "name": _this.tabItems[intNew].groupItemName,
                                        "templateId": "",
                                        "id": "",
                                        "type": "分项报告",
                                        "baseProjectId": "",
                                        "departResultId": "",
                                        "groupItemId": groupItemIds,
                                        "checkSign": _this.tabItems[intNew].checkSign,
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
                                    groupItemIds.push(_this.tabItems[int].groupItemId);
                                }
                            }
                        }
                        if(tabItemsAdd && tabItemsAdd.length > 0){
                            for(let i = 0;i < _this.tabPanes.length;i ++){
                                if(_this.tabPanes[i].officeName && _this.tabPanes[i].officeName.indexOf("检验科") > -1 && _this.tabPanes[i+1].officeName && _this.tabPanes[i+1].officeName.indexOf("检验科") <= -1){
                                    let intNow = i + 1;
                                    for(let j = 0;j < tabItemsAdd.length;j ++){
                                        _this.tabPanes.splice(intNow, 0, tabItemsAdd[j]);
                                        intNow ++;
                                    }
                                    break;
                                }
                            }
                        }
                        //检验科 仅保留首页基本信息
                        for(let i = 0;i < _this.tabPanes.length;i ++){
                            if(_this.tabPanes[i].officeName && _this.tabPanes[i].officeName.indexOf("检验科") > -1){
                                _this.tabPanes[i].isShow = true;
                                break;
                            }
                        }
                        if (_this.physicalType && _this.physicalType == "健康体检") {
                            let startPage;
                            if(_this.isShowPage){
                                startPage = 5;
                            }else{
                                startPage = 2;
                            }
                            tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                            _this.tabPanes.splice(startPage, 0, tgfxData);
                            let int = startPage + 1;
                            /*if(groupItemIds.length > 0){
                                healthy.healthCheckup = groupItemIds;//体格检查
                                // int ++;
                                _this.tabPanes.splice(int, 0, healthy);
                            }
                            if(groupItemIdsEye.length > 0){
                                eyeData.healthCheckup = groupItemIdsEye;//眼科检查
                                int ++;
                                _this.tabPanes.splice(int, 0, eyeData);
                            }*/
                            /*if(groupItemIdsFK.length > 0){
                                fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                int ++;
                                _this.tabPanes.splice(int, 0, fkData);
                            }*/
                            _this.tabPanes.push({
                                "name": "常见病保健指导",
                                "templateId": "357fdd2cb29bd0ddcd87e2302ab75573",
                                "id": "",
                                "type": "常见病保健指导",
                                "baseProjectId": ""
                            });
                            if(_this.isSplitConclusion){
                                _this.tabPanes.push({
                                    "name": "健康-检查结果及处理意见",
                                    "templateId": "0fbb068c1790cb2e03b42943128cecab",
                                    "id": "",
                                    "type": "健康-检查结果及处理意见",
                                    "baseProjectId": ""
                                });
                            }
                            if(_this.isShowPage) {//尾页封面
                                _this.tabPanes.push({
                                    "name": "尾页封面",
                                    "templateId": "985a3cecc26f95aecba46114302f5ed3",
                                    "id": "",
                                    "type": "尾页封面",
                                    "baseProjectId": ""
                                })
                            }
                        } else if (_this.physicalType && _this.physicalType == "职业体检") {
                            let startPage;
                            if(_this.isShowPage){
                                startPage = 5;
                            }else{
                                startPage = 3;
                            }
                            tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                            _this.tabPanes.splice(startPage, 0, tgfxData);
                            let int = startPage + 1;
                            /*if(groupItemIds.length > 0){
                                healthy.healthCheckup = groupItemIds;//体格检查
                                // int ++;
                                _this.tabPanes.splice(int, 0, healthy);
                            }
                            if(groupItemIdsEye.length > 0){
                                eyeData.healthCheckup = groupItemIdsEye;//眼科检查
                                int ++;
                                _this.tabPanes.splice(int, 0, eyeData);
                            }*/
                            /*if(groupItemIdsFK.length > 0){
                                fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                int ++;
                                _this.tabPanes.splice(int, 0, fkData);
                            }*/
                            if(_this.isSplitConclusion){
                                _this.tabPanes.push({
                                    "name": "职业-检查结果及处理意见",
                                    "templateId": "4e299e600f82e89c369b6e975595c8f7",
                                    "id": "",
                                    "type": "职业-检查结果及处理意见",
                                    "baseProjectId": ""
                                });
                            }
                            if(_this.isShowPage) {//尾页封面
                                _this.tabPanes.push({
                                    "name": "尾页封面",
                                    "templateId": "f6237ffe58b22870f1ae1e98fe9a8210",
                                    "id": "",
                                    "type": "尾页封面",
                                    "baseProjectId": ""
                                })
                            }
                        }else if (_this.physicalType && _this.physicalType == "放射体检") {
                            let startPage;
                            if(_this.isShowPage){
                                startPage = 5;
                            }else{
                                startPage = 3;
                            }
                            tgfxData.healthCheckup = groupItemIdsTGFX;//分项汇总
                            _this.tabPanes.splice(startPage, 0, tgfxData);
                            let int = startPage + 1;
                            /*if(groupItemIds.length > 0){
                                healthy.healthCheckup = groupItemIds;//体格检查
                                // int ++;
                                _this.tabPanes.splice(int, 0, healthy);
                            }*/
                            if(groupItemIdsEye.length > 0){
                                eyeData.healthCheckup = groupItemIdsEye;//眼科检查
                                _this.tabPanes.splice(int, 0, eyeData);
                            }
                           /* if(groupItemIdsFK.length > 0){
                                fkData.healthCheckup = groupItemIdsFK;//妇科检查
                                int ++;
                                _this.tabPanes.splice(int, 0, fkData);
                            }*/
                            if(_this.isSplitConclusion){
                                _this.tabPanes.push({
                                    "name": "职业-检查结果及处理意见",
                                    "templateId": "4e299e600f82e89c369b6e975595c8f7",
                                    "id": "",
                                    "type": "职业-检查结果及处理意见",
                                    "baseProjectId": ""
                                });
                            }
                            if(_this.isShowPage) {//尾页封面
                                _this.tabPanes.push({
                                    "name": "尾页封面",
                                    "templateId": "55eebcf1287dee53e68d8003392a0ba3",
                                    "id": "",
                                    "type": "尾页封面",
                                    "baseProjectId": ""
                                })
                            }
                        }
                        let wordData = [];
                        //检查分项的
                        if (this.tabItems && this.tabItems.length > 0) {
                            this.timer = setInterval(function () {
                                let isComplete = true;
                                _this.pdfPaths = [];
                                wordData = [];
                                if(!_this.loading){
                                    if(_this.timer){
                                        clearInterval(_this.timer);
                                        _this.timer = null;
                                    }
                                }
                                for (let i = 0; i < _this.$refs.previewPrint.length; i++) {
                                    if (_this.$refs.previewPrint[i].previewData) {
                                        wordData.push(_this.$refs.previewPrint[i].previewData)
                                    }
                                }
                                if (isComplete && wordData.length > 0 && _this.tabPanes.length - 1 == wordData.length) {
                                    _this.getReportWord(wordData);
                                    if(_this.timer){
                                        clearInterval(_this.timer);
                                        _this.timer = null;
                                    }
                                }
                            }, 100);
                        }

                    }
                    else {
                        _this.$Message.error("查询结果失败！！");
                        _this.loading = false;
                    }
                }).catch(function (error) {
                    _this.loading = false;
                });
            }
        },
        personChangePageNum(v) {
            this.searchForm.pageNumber = v;
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
         * 集合去重
         */
        removeList(arr){
            let newArr = [];
            for(let i = 0;i < arr.length;i ++){
                if(newArr.length == 0){
                    newArr.push(arr[i]);
                }else{
                    let flag = true;
                    for(let j = 0;j < newArr.length;j ++){
                        if(arr[i].orderGroupItemProjectId == newArr[j].orderGroupItemProjectId){
                            flag = false;
                        }
                    }
                    if(flag){
                        newArr.push(arr[i]);
                    }
                }
            }
            return newArr;
        },
        /**
         * 生成告知书
         * */
        noticeChange(){
            let ids = [];
            ids.push(this.personId);
            this.loading = true;
            generateReportByPersonIdsNotice(ids).then(res => {
                if (res && res.success) {
                    this.$Modal.remove();
                    //组装数据
                    let batchData = this.batchHandDataNotice(res.data);
                    //获取报告
                    this.getReportWordNotice(batchData);
                } else {
                    this.$Modal.remove();
                    this.$Message.error(res.msg);
                }
            }).catch(res => {
                this.$Message.error(res);
                this.$Modal.remove();
                this.closeLoading();
            })
        },
        /**
         * 生成封面
         * */
        firstPageChange(){
            let ids = [];
            ids.push(this.personId);
            this.loading = true;
            generateReportByPersonIdsfirstPage(ids).then(res => {
                if (res && res.success) {
                    this.$Modal.remove();
                    //组装数据
                    let batchData = this.batchHandDatafirstPage(res.data);
                    //获取报告
                    this.getReportWordfirstPage(batchData);
                } else {
                    this.$Modal.remove();
                    this.$Message.error(res.msg);
                }
            }).catch(res => {
                this.$Message.error(res);
                this.$Modal.remove();
                this.closeLoading();
            })
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
                    this.loading = true;
                    generateReportByPersonIdsNotice(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandDataNotice(res.data);
                            //获取报告
                            this.getReportWordBatchNotice(batchData);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                },
                onCancel: () => {
                    this.$Message.info('取消了当前的操作行为！');
                }
            });
        },
        /**
         * 打印封面
         * */
        batchPrintTemplateFM(){
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
                    this.loading = true;
                    generateReportByPersonIdsfirstPage(ids).then(res => {
                        if (res && res.success) {
                            this.$Modal.remove();
                            //组装数据
                            let batchData = this.batchHandDatafirstPage(res.data);
                            //获取报告
                            this.getReportWordBatchfirstPage(batchData);
                        } else {
                            this.$Modal.remove();
                            this.$Message.error(res.msg);
                        }
                    }).catch(res => {
                        this.$Message.error(res);
                        this.$Modal.remove();
                        this.closeLoading();
                    })
                },
                onCancel: () => {
                    this.$Message.info('取消了当前的操作行为！');
                }
            });
        },
        batchPrintSelect(){
            this.isBatchPrint = true;
            if(this.tabsClickIndex == 0){
                this.batchPrint();
            }else if(this.tabsClickIndex == 1){
                this.noticePrint();
            }else if(this.tabsClickIndex == 2){
                this.batchPrintTemplateFM();
            }
        },
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
                        this.$Message.error(res);
                        this.$Modal.remove();
                    })
                    this.loading = false;
                },
                onCancel: () => {
                    this.$Message.info('取消了当前的操作行为！');
                }
            });
        },
        /**
         * word下载
         * */
        downloadTemplate() {
            let _this = this;
            let url = "";
            let name = "";
            let previewHtmlUrl = this.previewHtmlUrl;
            let previewHtmlUrlGZS = this.previewHtmlUrlGZS;
            let previewHtmlUrlFM = this.previewHtmlUrlFM;
            let tabsClickIndex = this.tabsClickIndex;
            let personName = this.personInfo.person_name;
            if(tabsClickIndex == 0){
                url = previewHtmlUrl;//个检报告
                name = "个检报告";
            }else if(tabsClickIndex == 1){
                url = previewHtmlUrlGZS;//告知书
                name = "告知书";
            }else if(tabsClickIndex == 2){
                url = previewHtmlUrlFM;//封面
                name = "封面";
            }
            let fileName = personName+ "_"+name+".docx";
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
                    this.loading = true;
                    this.batchPrintMethod(ids);
                },
                onCancel: () => {
                    this.$Message.info('取消了当前的操作行为！');
                }
            });
        },
        batchPrintMethod(ids){
            generateReportByPersonIds(ids).then(res => {
                if (res && res.success) {
                    this.$Modal.remove();
                    //组装数据
                    let batchData = this.batchHandData(res.data);
                    //获取报告
                    this.getReportWordBatch(batchData);
                } else {
                    this.$Modal.remove();
                    this.$Message.error(res.msg);
                }
            }).catch(res => {
                this.$Message.error(res);
                this.$Modal.remove();
                this.closeLoading();
            })
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
                        batchData.push({wordData: wordData, personId: personInfo.id, personName: personInfo.person_name}) ;
                    }
                }
            }

            return batchData;
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
                                //复检的先不到报告里
                                if (tabItems[i].groupItemName.indexOf("(复)") > -1) {
                                    let isShowReview = _this.$hospitalName.isShowReview;//是否展示复查报告
                                    if(!isShowReview){
                                        continue;
                                    }
                                }
                                //获取 分项汇总 检查结果数据(总览)
                                let officeName = tabItems[i].officeName.replaceAll(" ", "");//科室名称
                                let groupItemName = tabItems[i].groupItemName.replaceAll(" ", "");//项目名称
                                //DR、CT、彩超只展示一张报告
                                if(officeName && tabPanes && groupItemName && groupItemName.indexOf("复") <= -1){
                                    if(officeName.indexOf("DR") > -1){
                                        let flag = false;
                                        tabPanes.forEach(item => {
                                            let officeNameNow = item.officeName;
                                            let groupItemNameNow = item.name;
                                            if(officeNameNow && officeNameNow.indexOf("DR") > -1 && groupItemNameNow && groupItemNameNow.indexOf("胸") > -1 && groupItemName.indexOf("胸") > -1){
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
                                    }*/
                                    /*if(officeName.indexOf("彩超") > -1){
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
                                let dataOfficeFXHZ = ["一般检查", "五官科", "口腔科", "眼科", "内科", "外科", "皮肤科", "妇科", "肺功能", "电测听", "心电图"];//分项汇总 科室名称集
                                let dataOfficeBoth = ["心电图", "肺功能", "电测听", "五官科", "口腔科", "眼科"];//分项汇总和后面详细报告 都有的 科室名称集
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
                                let dataOfficeTG = ["一般检查", "五官科", "口腔科", "内科", "外科", "皮肤科"]
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
                                //其他化验项目 检查结果数据(生化合并)
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
                        /*if(groupItemIdsFK.length > 0){
                            fkData.healthCheckup = groupItemIdsFK;//妇科检查
                            int ++;
                            tabPanes.splice(int, 0, fkData);
                        }*/
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
                        if(_this.isShowPage) {//尾页封面
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
                        if(_this.isShowPage) {//尾页封面
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
                        if(groupItemIdsEye.length > 0){
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
                        if(_this.isShowPage) {//尾页封面
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
                            templateData.doctor = _this.$hospitalName.legalPerson;
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
        // this.inputSearchChange();
        this.date = "当日";
        this.pick("当日");
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
                if (personList && personList.length > 0) {
                    this.tabPanes = [];
                    this.groupId = personList[0].groupId;
                    this.personId = personList[0].id;
                    this.personInfo = personList[0];
                    let _this = this;

                    //是否展示页面(首页尾页及相关说明) false不展示 true 展示
                    _this.isShowPage = _this.$hospitalName.isShowPage;

                    //是否展示首页封面模板
                    _this.isShowFirstPage = _this.$hospitalName.isShowFirstPage;
                    //是否拆分结论页(师古需求)
                    _this.isSplitConclusion = _this.$hospitalName.isSplitConclusion;
                    //是否展示保健指导页面(师古需求)
                    _this.isShowGuidancePage = _this.$hospitalName.isShowGuidancePage;

					//查询人员的 订单分组数据

					// _this.personChange();
                    this.isBatchPrint = false;
                    let ids = [];
                    ids.push(this.personId);
                    _this.batchPrintMethod(ids)

                    if(_this.physicalType == '职业体检' || _this.physicalType == '放射体检'){
                        _this.noticeChange()
                    }
                    if((_this.physicalType == '职业体检' || _this.physicalType == '健康体检'|| _this.physicalType == '放射体检') && _this.isShowFirstPage){
                        _this.firstPageChange()
                    }

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

.reportPrint {
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
        overflow: auto;
        width: 100%;
        height: 90%;
        padding-bottom: 30px;

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
}
</style>
