<template>
    <div class="occupational">
        <!--体检异常信息-->
        <Row>
            <Collapse v-model="abnormalInfoValue" class="abnormalInformationDiv" @on-change="abnormalInformationChange">
                <Panel name="1">
                    检查类别
                    <template #content>
                        <Card>
                            <Form>
                                <Row  style="flex-wrap: nowrap;" v-if="personInfo.id && tabooList.length>0">
                                    <Col span="6" style="min-width: 120px;">
                                        <FormItem label="检查类别:" style="color: red">{{personInfo.work_state_text}}
                                        </FormItem>
                                    </Col>
                                    <Col span="18">
                                        <FormItem label="接触的职业病危害及因素：" style="color: red">
                                            {{personInfo.hazard_factors_text}}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row v-for="(item,index) in tabooListNames">
                                    <b v-if="item.taboo && item.taboo.trim().length > 0">{{item.name}}:</b>
                                    <b v-if="item.taboo && item.taboo.trim().length > 0">职业禁忌证:</b>
                                    <span style="color: #0ac1c7">{{item.taboo}}</span>
                                </Row>
                                <Row v-if="inquirys && inquirys.trim().length>0">
                                    <b>实验室和其他检查:</b>
                                    <span style="color: #0ac1c7">{{inquirys}}</span>
                                </Row>
                            </Form>
                        </Card>
                        <!-- <Input class="co" v-model="abnormalInfo" type="textarea" :autosize="{minRows: 5,maxRows: 10}"
                                placeholder="" disabled ></Input>-->
                    </template>
                </Panel>
            </Collapse>
        </Row>
        <Form style="display: flex" :labelWidth="120">
            <!--<FormItem label="总检医生:">
                <img style="width: 150px;height: 30px;"
                     :src="inspectForm.inspectionAutograph ? inspectForm.inspectionAutograph.indexOf('/dcm') > -1 ? inspectForm.inspectionAutograph : 'data:image/png;base64,' + inspectForm.inspectionAutograph:(doctorInfo &&doctorInfo.autograph)?doctorInfo.autograph:''">
            </FormItem>-->
            <FormItem label="总检医生:">
                <Select v-model="doctorId" :filterable="true" label-in-value
                        class="input" @on-select="doctorSelectChange" transfer>
                    <Option v-for="(itemD,index) in userArray" :key="index" :value="itemD.id"
                            :label="itemD.nickname">
                        {{ itemD.nickname }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="总检日期：">
                <DatePicker type="datetime" v-model="inspectForm.inspectionDate" transfer
                            placeholder="请选择总检日期" style="width: 175px"></DatePicker>
            </FormItem>
            <Button @click="resultSummary" type="primary" style="margin-left: 30px">异常结果</Button>
        </Form>
        <!-- 职业体检结论-->
        <Row>
            <Collapse class="conclusionDiv" v-model="clusionInfo">
                <Panel name="1">
                    <div style="width: 200px">职业体检结论</div>
                    <template #content>
                        <Row>
                            <Col span="12">
                                <Card class="card">
                                    <template #title>
                                        结果及建议
                                        <button v-if="firstPersonId&&firstPersonId.trim().length>0" class="cardResultButton" @click="firstPersonConclusionClick" type="primary">
                                            <Icon type="arrow-graph-down-right"></Icon>
                                            第一次体检结论
                                        </button>
                                        <button v-if="firstPersonId&&firstPersonId.trim().length>0" class="cardResultButton" @click="firstPersonItemClick" type="primary">
                                            <Icon type="arrow-graph-down-right"></Icon>
                                            第一次明细结果
                                        </button>
                                    </template>
                                    <Form :labelWidth="100" class="clusionInfoForm">
                                        <Checkbox v-model="isDifferenceModel">目前未见异常</Checkbox>
                                        <div></div>
                                        <FormItem label="危害因素" v-if="isDifferenceModel">
                                            <Select v-model="noDifferenceModel" multiple style="width:260px"
                                                    @on-change="getConclusionCode">
                                                <Option v-for="(item ,i) in hazardFactorsList" :value="item.code"
                                                        :key="i">{{ item.name }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                        <Checkbox v-model="isReviewModel">复查</Checkbox>
                                        <FormItem label="危害因素" v-if="isReviewModel">
                                            <Select v-model="reviewModel" multiple style="width:260px"
                                                    @on-change="getConclusionCode" transfer>
                                                <Option v-for="(item ,i) in hazardFactorsList" :value="item.code"
                                                        :key="i">{{ item.name }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                        <div></div>
                                        <Checkbox v-model="isDiseases" @on-change="changeDiseases">疑似职业病</Checkbox>
                                        <div v-if="isDiseases" class="diseasesDiv">
                                            <Row v-for="(itemD,i) in diseasesList">
                                                <Col span="8">
                                                    <Checkbox @on-change="changeDiseases" v-model="itemD.isCheck"
                                                              :label="itemD.name">{{itemD.name}}
                                                    </Checkbox>
                                                </Col>
                                                <Col span="16">
                                                    <Select v-model="itemD.diseasesModel" multiple style="width:260px"
                                                            @on-change="getConclusionCode" transfer>
                                                        <Option v-for="(itemS ,j) in itemD.diseases" :value="itemS.code"
                                                                :key="j">{{ itemS.name }}
                                                        </Option>
                                                    </Select>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div></div>
                                        <Checkbox v-model="isTaboo" @on-change="tabooDiseases">职业禁忌证</Checkbox>
                                        <div v-if="isTaboo" class="tabooDiv">
                                            <Row v-for="(item,i) in tabooList">
                                                <Col span="8">
                                                    <Checkbox @on-change="tabooDiseases" v-model="item.isCheck"
                                                              :label="item.name">{{item.name}}
                                                    </Checkbox>
                                                </Col>
                                                <Col span="16">
                                                    <Select v-model="item.tabooModel" multiple style="width:260px"
                                                            @on-change="getConclusionCode" transfer>
                                                        <Option v-for="(itemS ,j) in item.taboo" :value="itemS.code"
                                                                :key="j">{{ itemS.name }}
                                                        </Option>
                                                    </Select>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div></div>
                                        <Checkbox v-model="isOtherExceptionsModel">其他疾病或异常</Checkbox>
                                        <FormItem label="危害因素" v-if="isOtherExceptionsModel">
                                            <Select v-model="otherExceptionsModel" multiple style="width:260px"
                                                    @on-change="getConclusionCode">
                                                <Option v-for="(item ,i) in hazardFactorsList" :value="item.code"
                                                        :key="i">{{ item.name }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                        <FormItem label="描述" v-if="isOtherExceptionsModel">
                                            <div class="textareaResult" style="position: relative;">
                                                <Button class="choice" type="primary" style="left: 0px;"
                                                        @click="handleWordChoose('zjqtjcycjg')">选
                                                </Button>
                                                <Input @on-change="otherExceptionsChange" class="cardTextarea"
                                                       v-model="otherExceptions" type="textarea" style="width:90%"
                                                       :autosize="{minRows: 5,maxRows: 10}"
                                                       placeholder=""></Input>
                                            </div>
                                        </FormItem>
                                        <div></div>
                                    </Form>

                                </Card>
                            </Col>
                            <Col span="12">
                                <Card class="card" title="结果及建议">
                                    <template #title>
                                        结果及建议
                                        <button class="cardResultButton" @click="cardResultClick" type="primary">
                                            <Icon type="arrow-graph-down-right"></Icon>
                                            智能总检
                                        </button>
                                    </template>
                                    <Row>
                                        <div class="txt"><span
                                                style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>职业健康体检结果
                                        </div>
                                        <div class="cardTextareaResult">
                                            <div class="textareaResult" style="position: relative;">
                                                <Button class="choice" type="primary" style="left: 0px;"
                                                        @click="handleWordChoose('zjzyjcycjg')">选
                                                </Button>
                                                <Input type="textarea" class="cardTextarea"
                                                       v-model="inspectForm.conclusion"
                                                       :autosize="{maxRows: 12,minRows:8}"></Input>
                                            </div>

                                        </div>
                                    </Row>
                                    <Row>
                                        <div class="txt"><span
                                                style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>职业健康体检建议
                                        </div>
                                        <div class="cardTextareaResult">
                                            <div class="textareaResult" style="position: relative;">
                                                <Button class="choice" type="primary" style="left: 0px;"
                                                        @click="handleWordChoose('zjclyj')">选
                                                </Button>
                                                <Input type="textarea" class="cardTextarea"
                                                       v-model="inspectForm.handleOpinion"
                                                       :autosize="{maxRows: 12,minRows: 8}"></Input>
                                            </div>

                                        </div>
                                    </Row>

                                </Card>
                            </Col>
                        </Row>
                    </template>
                </Panel>
            </Collapse>
        </Row>
        <drawer v-model="wordChooseShow" width="400" :modalTitle="title" @getSelectedWords="getSelectedWords"
                :type="type" :inspectForm="inspectForm"
                :inspectType="personInfo.physical_type || personInfo.physicalType" :personInfo="personInfo"
                :hazardFactors="personInfo.hazard_factors || personInfo.hazardFactors"
                :hazardFactorsText="personInfo.hazard_factors_text || personInfo.hazardFactorsText"
                :isMultiple="isMultiple">
        </drawer>
        <positiveResult v-model="modalResult" :personId="personId"></positiveResult>
        <project-details :checkDoctor="doctorInfo.id" :tableData="firstTableData" title="明细结果查看"
                         :person-info="personInfo" :person-id="reviewFirstPersonId"
                         v-model="projectDetailReviewShow"></project-details>
        <conclusion-examination v-model="conclusionExaminationShow" :hazardFactorsList ="hazardFactorsList" :person-id="reviewFirstPersonId" modal-title="第一次体检结论"> </conclusion-examination>
    </div>
</template>

<script>
	import {changeNumToHan, formartDate} from "../../../../api/tools/tool";
	import drawer from "../../tAllInspect/drawer";
	import {getAllUserData} from "../../../../api";
	import positiveResult from '@/views/healthy/generalInspection/components/positiveResult.vue';
    import {queryTReviewRecordList} from "../../../../api/healthy/tReviewRecord.js";
    import projectDetails from "./projectDetails";
	import {queryTDepartResultList} from "../../../../api/healthy/tDepartResult";
	import conclusionExamination from "./conclusionExamination";

	export default {
		name: "occupational",
		props: {
			personId: {
				type: String,
				default: null
			},
			firstPersonId: {
				type: String,
				default: null
			},
			value: {
				type: Boolean,
				default: false
			},
			tableData: {//检查项目结果
				type: Array,
				default: []
			},
			personInfo: {//人员信息
				type: Object,
				default: null
			},
			inspectForm: {//总检结果
				type: Object,
				default: null
			},
			doctorInfo: {//医生信息
				type: Object,
				default: null
			},
			userArray: {//用户集合
				type: Array,
				default: []
			},
            reviewProjectArr:{
                type: Array,
                default: []
            }
		},
		components: {drawer, positiveResult,projectDetails,conclusionExamination},
		data() {
			return {
				abnormalInfo: "",//接触的职业病危害及因素
				abnormalInfoValue: "1",//异常信息折叠板
				contraindications: '',//职业禁忌证
				clusionInfo: "1",//职业体检折叠板
				tableDataArray: [],
				hazardFactorsList: [],//危害因素集合

				noDifferenceModel: [],//未见明显异常的危害因素集合
				isDifferenceModel: false,//是否未见明显异常

				reviewModel: [],//复查的危害因素集合
				isReviewModel: false,//是否复查

				otherExceptionsModel: [],//复查的危害因素集合
				isOtherExceptionsModel: false,//是否复查
				otherExceptions: "",//其他异常描述

				diseasesList: [{name: "11", code: "11", isCheck: false, diseases: [], diseasesModel: []}],//职业病集合
				isDiseases: false,//是否有职业病

				tabooList: [{name: "11", code: "11", isCheck: false, taboo: [], tabooModel: []}],//禁忌症集合
				tabooListNames: [],
				isTaboo: false,//是否有禁忌症
				isFirst: false,//是否首次
				timer: null,//定时执行

				isMultiple: false,
				title: "",
				wordChooseShow: false,
				type: "",//抽屉类型
				doctorId: null,//选择的医生Id
				modalResult: false,//异常结果弹框
                inquirys:"",//实验室和其他检查
                param: {
                    personId: '',
                    pageNumber: 1,
                    pageSize: 10,
                },
				projectDetailReviewShow:false,//是否展示复查时第一次体检详细结果
				reviewFirstPersonId:"",//复查时第一次体检人的Id
				firstTableData:[],//复查时第一次体检人的体检结果
				conclusionExaminationShow:false,//是否展示复查时第一次体检人的体检结论
               /* reviewProjectData:[],*/
			}
		},
		computed: {
			physicalType() {
				return this.$store.state.theme.theme.physicalType;
			},
		},
		methods: {

			//异常结果汇总
			resultSummary() {
				this.modalResult = true;
			},

			//初始化参数
			init() {
				this.doctorId = this.doctorInfo.id;
				this.noDifferenceModel = [];
				this.isDifferenceModel = false;

				this.reviewModel = [];
				this.isReviewModel = false;

				this.otherExceptionsModel = [];
				this.isOtherExceptionsModel = false;

				this.tabooList = [];
				this.tabooListNames = [];
				this.inspectForm.conclusion = '';
				this.inspectForm.handleOpinion = '';
				this.isTaboo = false;

				this.diseasesList = [];
				this.isDiseases = false;

				this.isFirst = true;//是否首次

				if (this.hazardFactorsList && this.hazardFactorsList.length > 0 && this.noDifferenceModel && this.noDifferenceModel.length === 0) {
					for (let i = 0; i < this.hazardFactorsList.length; i++) {
						if (this.hazardFactorsList[i] && this.hazardFactorsList[i].code) {
							this.noDifferenceModel.push(this.hazardFactorsList[i].code);
						}
					}
				}
				this.isFirst = false;
			},
			//初始化职业病以及禁忌症
			initDiseasesAndTaboo() {
				this.diseasesList = [];
				this.tabooList = [];
				this.tabooListNames = [];
				if (this.hazardFactorsList.length > 0) {
					for (let i = 0; i < this.hazardFactorsList.length; i++) {
						if (this.hazardFactorsList[i]) {
							let item = {name: "", code: "", isCheck: false, diseases: [], diseasesModel: []};
							item.name = this.hazardFactorsList[i].name;
							item.code = this.hazardFactorsList[i].code;
							item.diseases = this.hazardFactorsList[i].Diseases;
							this.diseasesList.push(item);

							let itemTaboo = {name: "", code: "", isCheck: false, taboo: [], tabooModel: []};
							itemTaboo.name = this.hazardFactorsList[i].name;
							itemTaboo.code = this.hazardFactorsList[i].code;
							itemTaboo.taboo = this.hazardFactorsList[i].Taboo;
							this.tabooList.push(itemTaboo);
						}
					}
				}

				let _this = this;
                _this.tabooListNames = [];
                _this.inquirys = '';
				if (_this.hazardFactorsList && _this.hazardFactorsList.length > 0) {
                    let hazardFactorsList = JSON.parse(JSON.stringify(_this.hazardFactorsList))
					for (let i = 0; i < hazardFactorsList.length; i++) {
					    if(hazardFactorsList[i]){
                            let itemTaboo = {name: "", taboo: "",criteria:"",inquiry:""};
                            itemTaboo.name = hazardFactorsList[i].name;
                            itemTaboo.code = hazardFactorsList[i].code;
                            itemTaboo.inquiry = hazardFactorsList[i].inquiry;
                            itemTaboo.criteria = hazardFactorsList[i].criteria;
                            itemTaboo.taboo = ''
                            if (hazardFactorsList[i].Taboo && hazardFactorsList[i].Taboo.length > 0) {
                                for (let j = 0; j < hazardFactorsList[i].Taboo.length; j++) {
                                    if (hazardFactorsList[i].Taboo[j].name == undefined) {
                                        itemTaboo.taboo = itemTaboo.taboo
                                    } else {
                                        itemTaboo.taboo += (j + 1) + ")、" + hazardFactorsList[i].Taboo[j].name + " "
                                    }
                                }
                            }
                            if(itemTaboo.inquiry && itemTaboo.inquiry.trim().length>0){
                                _this.inquirys+=itemTaboo.name+":"+ itemTaboo.inquiry;
                            }

                            if(itemTaboo.criteria  && itemTaboo.criteria.trim().length>0){
                                itemTaboo.taboo  =  itemTaboo.criteria;
                            }
                            if(itemTaboo.taboo && itemTaboo.taboo.trim().length>0){
                                _this.tabooListNames.push(itemTaboo);

                            }

                        }

					}
				}

			},
			//初始化体检结论
			initForm() {
				this.isFirst = true;
				if(this.firstPersonId && this.firstPersonId.trim().length>0){
					let checkProParam = {}
					checkProParam.personId = this.firstPersonId;
					checkProParam.groupId = this.personInfo.group_id;
					queryTDepartResultList(checkProParam).then(res => {
						if (res.success) {
							this.firstTableData = res.data;
						}
					}).finally(() => {

					})
                }
				let checkProParam = {};

				if (this.inspectForm && this.inspectForm.id) {
                    this.isDifferenceModel = false;
					this.isReviewModel = false;
					this.isDiseases = false;
					this.isTaboo = false;
					this.isOtherExceptionsModel = false;
					this.otherExceptions = this.inspectForm.otherCheckAbnormalResults;
					if (this.inspectForm.bairns && this.inspectForm.bairns.length > 0) {
						//未见明显异常
						let a = this.inspectForm.bairns.filter(aa => aa.examConclusionCode === "12001");
						if (a && a.length > 0) {
							this.noDifferenceModel = [];
							for (let i = 0; i < a.length; i++) {
								this.noDifferenceModel.push(a[i].badrsnCode);
							}
							this.isDifferenceModel = true;
						}
						//复查
						a = this.inspectForm.bairns.filter(aa => aa.examConclusionCode === "12002");
						if (a && a.length > 0) {
							this.reviewModel = [];
							for (let i = 0; i < a.length; i++) {
								this.reviewModel.push(a[i].badrsnCode);
							}
							this.isReviewModel = true;
						}
						//职业病
						a = this.inspectForm.bairns.filter(aa => aa.examConclusionCode === "12003");
						if (a && a.length > 0) {
							if (this.diseasesList && this.diseasesList.length > 0) {
								for (let i = 0; i < this.diseasesList.length; i++) {
									let item = this.diseasesList[i];
									item.diseasesModel = [];
									for (let ii = 0; ii < a.length; ii++) {
										if (a[ii] && item && item.code === a[ii].badrsnCode) {
											if (item.diseases && a[ii].yszybCode) {
												for (let disease in item.diseases) {
													let diseaseItem = item.diseases[disease];
													if (diseaseItem && diseaseItem.code && a[ii].yszybCode === diseaseItem.code) {
														item.isCheck = true;
														item.diseasesModel.push(diseaseItem.code);
													}
												}
											}
										}
									}

								}
							}
							this.isDiseases = true;
						}
						//职业禁忌症
						a = this.inspectForm.bairns.filter(aa => aa.examConclusionCode === "12004");
						if (a && a.length > 0) {
							if (this.tabooList && this.tabooList.length > 0) {
								for (let i = 0; i < this.tabooList.length; i++) {
									this.tabooList[i].tabooModel = [];
									for (let ii = 0; ii < a.length; ii++) {
										if (a[ii] && this.tabooList[i] && this.tabooList[i].code === a[ii].badrsnCode) {
											if (this.tabooList[i].taboo && a[ii].zyjjzCode) {
												for (let taboo in this.tabooList[i].taboo) {
													let tabooItem = this.tabooList[i].taboo[taboo];
													if (tabooItem && tabooItem.code && a[ii].zyjjzCode === tabooItem.code) {
														this.tabooList[i].tabooModel.push(tabooItem.code);
														this.tabooList[i].isCheck = true;
													}
												}
											}
										}
									}

								}
							}
							this.isTaboo = true;
						}
						//其他异常
						a = this.inspectForm.bairns.filter(aa => aa.examConclusionCode === "12005");
						if (a && a.length > 0) {
							this.otherExceptionsMode = [];
							for (let i = 0; i < a.length; i++) {
								this.otherExceptionsModel.push(a[i].badrsnCode);
							}
							this.isOtherExceptionsModel = true;
						}
					} else {
						switch (this.inspectForm.conclusionCode) {
							case "12001": {
								this.isDifferenceModel = true;
								break
							}
							case "12002": {
								this.isReviewModel = true;
								break
							}
							case "12003": {
								if (this.inspectForm.occupationalDiseasesNowCode) {
									let a = this.inspectForm.occupationalDiseasesNowCode.split(";")
									if (a && a.length > 0 && this.diseasesList && this.diseasesList.length > 0) {
										for (let i = 0; i < this.diseasesList.length; i++) {
											let item = this.diseasesList[i];
											item.diseasesModel = [];
											if (item.diseases && item.diseases.length > 0) {
												for (let disease in item.diseases) {
													let diseaseItem = item.diseases[disease];
													if (diseaseItem && diseaseItem.code && a.indexOf(diseaseItem.code) > -1) {
														item.isCheck = true;
														item.diseasesModel.push(diseaseItem.code);
													}
												}
											}

										}
									}
								}
								this.isDiseases = true;
								break
							}
							case "12004": {
								if (this.inspectForm.occupationalTabooNowCode) {
									let a = this.inspectForm.occupationalTabooNowCode.split(";")
									if (a && a.length > 0 && this.tabooList && this.tabooList.length > 0) {
										for (let i = 0; i < this.tabooList.length; i++) {
											this.tabooList[i].tabooModel = [];
											if (this.tabooList[i]) {
												if (this.tabooList[i].taboo) {
													for (let taboo in this.tabooList[i].taboo) {
														let tabooItem = this.tabooList[i].taboo[taboo];
														if (tabooItem && tabooItem.code && a.indexOf(tabooItem.code) > -1) {
															this.tabooList[i].tabooModel.push(tabooItem.code);
															this.tabooList[i].isCheck = true;
														}
													}
												}
											}
										}
									}
								}
								this.isTaboo = true;
								break
							}
							case "12005": {
								this.isOtherExceptionsModel = true;
								break
							}
							default: {

							}

						}
					}
				}
				this.isFirst = false;
			},
			//拼接异常信息
			getAbnormalInfo: function () {
				this.abnormalInfo = "";
				this.otherExceptions = "";
				if (this.tableDataArray && this.tableDataArray.length > 0) {
					let abnormalData = this.tableDataArray.filter(aa => aa.positive != '0');
					if (abnormalData != null && abnormalData.length > 0) {
						for (let i = 0; i < abnormalData.length; i++) {
							let item = abnormalData[i];
							if (item) {

								//序号
								this.abnormalInfo = this.abnormalInfo + this.changeNum(i + 1) + "、";
								//内容
								this.abnormalInfo = this.abnormalInfo + item.diagnoseSum.replace(/\r|\n/ig, "");
								//换行
								this.abnormalInfo = this.abnormalInfo + "\r"
								//未总检是才初始化异常信息
								if (this.inspectForm && (this.inspectForm.id === undefined || this.inspectForm.id == null || this.inspectForm.id.trim().length === 0
                                        ||(this.inspectForm.otherCheckAbnormalResults ===undefined || this.inspectForm.otherCheckAbnormalResults.toString().trim().length=== 0))) {
									//序号
									this.otherExceptions = this.otherExceptions + "      " + (i + 1) + ")、";
									//内容
									this.otherExceptions = this.otherExceptions + item.diagnoseSum.replace(/\r|\n/ig, "");
									//换行
									this.otherExceptions = this.otherExceptions + "\r\n";
								}

							}
						}
						if (this.inspectForm && (this.inspectForm.id === undefined || this.inspectForm.id == null || this.inspectForm.id.trim().length === 0)) {
							this.isOtherExceptionsModel = true;
							//this.changeOtherException(true);
						}


					} else {
						this.abnormalInfo = "一、未见异常";
					}
				} else {
					this.abnormalInfo = "一、未见异常";
				}
				if (this.inspectForm && (this.inspectForm.id === undefined || this.inspectForm.id == null || this.inspectForm.id.trim().length === 0)) {
					if (this.abnormalInfo === "一、未见异常") {
						this.isDifferenceModel = true;
					} else {
						if (this.otherExceptions && this.otherExceptions.trim().length == 0 && this.abnormalInfo && this.abnormalInfo.trim().length > 0) {
							this.otherExceptions = this.abnormalInfo;
						}
					}
					this.cardResultClick();
				} else {
					this.otherExceptions = this.inspectForm.otherCheckAbnormalResults ? this.inspectForm.otherCheckAbnormalResults: this.otherExceptions;
				}
				if (this.inspectForm.otherCheckAbnormalResults && this.inspectForm.otherCheckAbnormalResults.trim().length == 0) {
					this.otherExceptions = this.inspectForm.otherCheckAbnormalResults ? this.inspectForm.otherCheckAbnormalResults : "";
				}

			},
			//异常信息折叠板切换事件
			abnormalInformationChange() {

			},
			//是否未见明显异常
			changeDifference(e) {

				let _this = this;
				if (this.isDifferenceModel && _this.hazardFactorsList && _this.hazardFactorsList.length > 0 && _this.noDifferenceModel && _this.noDifferenceModel.length === 0) {
					_this.noDifferenceModel = [];
					for (let i = 0; i < _this.hazardFactorsList.length; i++) {
						if (_this.hazardFactorsList[i] && _this.hazardFactorsList[i].code) {
							_this.noDifferenceModel.push(_this.hazardFactorsList[i].code);
						}
					}
				}
				_this.getConclusionCode(this.isDifferenceModel);
			},
			//是否复查
			changeReview(e) {
				if (this.isReviewModel && this.hazardFactorsList && this.hazardFactorsList.length > 0 && this.reviewModel && this.reviewModel.length === 0) {
					for (let i = 0; i < this.hazardFactorsList.length; i++) {
						if (this.hazardFactorsList[i] && this.hazardFactorsList[i].code) {
							//this.reviewModel.push(this.hazardFactorsList[i].code);
						}
					}

				}
				this.getConclusionCode(this.isReviewModel);
			},
			//是否疑似职业病
			changeDiseases(e) {
				this.getConclusionCode(e);
			},
			//是否职业病
			tabooDiseases(e) {
				this.getConclusionCode(e);
			},
			//是否其他疾病或异常
			changeOtherException(e) {
				let _this = this;
				if (this.isOtherExceptionsModel && _this.hazardFactorsList && _this.hazardFactorsList.length > 0 && _this.otherExceptionsModel && _this.otherExceptionsModel.length === 0) {
					for (let i = 0; i < _this.hazardFactorsList.length; i++) {
						if (_this.hazardFactorsList[i] && _this.hazardFactorsList[i].code) {
							_this.otherExceptionsModel.push(_this.hazardFactorsList[i].code);
						}
					}
				}
				this.getConclusionCode(this.isOtherExceptionsModel);
			},
			//智能总检
			cardResultClick(e) {
				let isFist = false
				if (!e) {
					isFist = true;
				}
				let conclusionCode = "";

				//危害因素结论集合
				let bairns = [];
				if (this.personInfo && (this.personInfo.work_state_text || this.personInfo.workStateText)) {
					//体检结果集合
					let conclusionArr = [];
					//体检建议集合
					let handleOpinionArr = [];
					let workStateText = this.personInfo.work_state_text || this.personInfo.workStateText;
					workStateText = workStateText.trim();

					//未见明显异常
					if (this.isDifferenceModel || isFist) {
						let hazardFactors = [];
						let conclusion = "";
						let handleOpinion = "";

						if (this.noDifferenceModel && this.noDifferenceModel.length > 0) {
							for (let index in this.hazardFactorsList) {
								let item = this.hazardFactorsList[index];
								if (item && item.code && this.noDifferenceModel.indexOf(item.code) > -1) {
									hazardFactors.push(item.name);
								}
							}
							if (hazardFactors && hazardFactors.length > 0) {
								//检查种类
								switch (workStateText) {
									case '上岗前': {
										conclusion = "本次体检未发现" + hazardFactors.join("、") + "作业上岗前的职业禁忌证。"
										if(this.physicalType == "放射体检"){
											handleOpinion = "可从事" + hazardFactors.join("、") + "，加强个人防护，定期参加职业健康检查。"
										}else{
											handleOpinion = "可以从事" + hazardFactors.join("、") + "岗位作业。"
										}
										break
									}
									case '应急健康检查':
									case '在岗期间': {
										conclusion = "本次体检未发现" + hazardFactors.join("、") + "作业" + workStateText + "的疑似职业病及职业禁忌证。"
										if(this.physicalType == "放射体检"){
											handleOpinion = "可继续从事原" + hazardFactors.join("、") + "，加强个人防护，定期参加职业健康检查。"
										}else{
											handleOpinion = "可以继续从事" + hazardFactors.join("、") + "岗位作业。"
										}
										break
									}
									case '离岗后':
									case '离岗时': {
										conclusion = "本次体检未发现" + hazardFactors.join("、") + "作业" + workStateText + "疑似职业病。"
										if(this.physicalType == "放射体检"){
											handleOpinion = "本次检查未发现放射作业人员目标疾病，可以离岗。"
										}else{
											handleOpinion = "可以从事" + hazardFactors.join("、") + "岗位作业。"
										}
										break
									}
									default: {
										break
									}
								}
							}
							if (conclusion && conclusion.length > 0) {
								conclusionArr.push(conclusion);
							}
							if (handleOpinion && handleOpinion.length > 0) {
								handleOpinionArr.push(handleOpinion);
							}
						}

					}
					//复查
					if (this.isReviewModel) {
						let hazardFactors = [];
						let handleOpinion = "";
						if (this.reviewModel && this.reviewModel.length > 0) {
							for (let index in this.hazardFactorsList) {
								let item = this.hazardFactorsList[index];
								if (item && item.code && this.reviewModel.indexOf(item.code) > -1) {
									hazardFactors.push(item.name);
								}
							}
						}
						handleOpinion = "暂不作" + hazardFactors.join("、") + "职业健康评价。";
						let tableDataReview = "";
						if (this.reviewProjectArr &&this.reviewProjectArr.length>0){
							for (let i = 0; i < this.reviewProjectArr.length; i++) {
								if (this.reviewProjectArr[i].name){
									tableDataReview += this.reviewProjectArr[i].name.split("(")[0] + "、"
								}
							}
						}else {
							for (let i = 0; i < this.reviewProjectData.length; i++) {
								if (this.reviewProjectData[i].name){
									tableDataReview += this.reviewProjectData[i].name.split("(")[0] + "、"
								}
							}
						}
						tableDataReview = tableDataReview.substr(0,tableDataReview.length-1)
						if (tableDataReview){
							conclusionArr.push("需复查"+tableDataReview+"。")
						}else {
							conclusionArr.push("需复查。")
						}
						handleOpinionArr.push(handleOpinion)
					}
                    //职业病
                    if (this.isDiseases) {
                        if (this.diseasesList && this.diseasesList.length > 0) {
                            let str = "本次体检发现";
                            let hazardFactors = [];
                            for (let i = 0; i < this.diseasesList.length; i++) {
                                let item = this.diseasesList[i];
                                if (this.diseasesList[i] && this.diseasesList[i].isCheck) {
                                    let name = item.name + workStateText + "的疑似职业病";
                                    name += "(";
                                    let diseasesName = []
                                    if (this.diseasesList[i].diseases && this.diseasesList[i].diseasesModel) {
                                        for (let disease in this.diseasesList[i].diseases) {
                                            let diseaseItem = this.diseasesList[i].diseases[disease];
                                            if (diseaseItem && diseaseItem.code && this.diseasesList[i].diseasesModel.indexOf(diseaseItem.code) > -1) {
                                                diseasesName.push(diseaseItem.name);
                                            }
                                        }
                                    }
                                    if (diseasesName && diseasesName.length > 0) {
                                        name += diseasesName.join("，");
                                    }
                                    name += ")";
                                    hazardFactors.push(name);
                                }
                            }
                            if (hazardFactors && hazardFactors.length > 0) {
                                str = str + hazardFactors.join("，") + "。";
                            }
                            conclusionArr.push(str)
                            handleOpinionArr.push("建议到有资质的机构申请职业病鉴定。")
                        }
                        conclusionCode = "12003";

                    }

                    //职业禁忌证
                    if (this.isTaboo) {
                        if (this.tabooList && this.tabooList.length > 0) {
                            let str = "本次体检发现";
                            let hazardFactors = [];
                            let hazardFactorsTest = [];
                            for (let i = 0; i < this.tabooList.length; i++) {
                                let item = this.tabooList[i];
                                if (this.tabooList[i] && this.tabooList[i].isCheck) {
                                    let name = item.name + workStateText + "的职业禁忌证";
                                    hazardFactorsTest.push(item.name);
                                    name += "(";
                                    let tabooName = []
                                    if (this.tabooList[i].taboo && this.tabooList[i].tabooModel) {
                                        for (let taboo in this.tabooList[i].taboo) {
                                            let tabooItem = this.tabooList[i].taboo[taboo];
                                            if (tabooItem && tabooItem.code && this.tabooList[i].tabooModel.indexOf(tabooItem.code) > -1) {
                                                tabooName.push(tabooItem.name);
                                            }
                                        }
                                    }
                                    if (tabooName && tabooName.length > 0) {
                                        name += tabooName.join("、");
                                    }
                                    name += ")";
                                    hazardFactors.push(name);
                                }
                            }
                            if (hazardFactors && hazardFactors.length > 0) {
                                str = str + hazardFactors.join("、") + "。";
                            }
                            conclusionArr.push(str)
                            if (hazardFactorsTest && hazardFactorsTest.length > 0) {
                                handleOpinionArr.push("建议不从事" + hazardFactorsTest.join("、") + "作业。")
                            }
                        }
                        conclusionCode = "12004";

                    }
                    //其他疾病或异常
                    if (this.isOtherExceptionsModel) {
                        let str = "其他疾病及指标异常：" + "\r" + this.otherExceptions;
                        conclusionArr.push(str)
                        handleOpinionArr.push("其他疾病及指标异常，建议到临床进一步咨询。")

                    }

					let handleOpinion = "";

					if (conclusionArr && conclusionArr.length > 0) {
						this.inspectForm.conclusion = "";
						for (let i = 0; i < conclusionArr.length; i++) {
							this.inspectForm.conclusion += (i + 1) + "、" + conclusionArr[i] + "\r\n";
						}
					}
					if (handleOpinionArr && handleOpinionArr.length > 0) {
						for (let i = 0; i < handleOpinionArr.length; i++) {
							this.inspectForm.handleOpinion = "";
							for (let i = 0; i < handleOpinionArr.length; i++) {
								this.inspectForm.handleOpinion += (i + 1) + "、" + handleOpinionArr[i] + "\r\n";
							}
						}
					}
				}
			},
			//拼接危害因素结论对象
			spliceHazardsConclusion(barCode, conclusionCode, yszybCode, zyjjzCode) {
				let item = {
					badrsnCode: barCode,
					examConclusionCode: conclusionCode,
					yszybCode: yszybCode,
					zyjjzCode: zyjjzCode,
					fkBhkId: this.personId,
					qtjbName: "",
					otherBadrsn: "",
				}
				if (conclusionCode === "12005") {
					item.qtjbName = this.otherExceptions;
				}else {
                    item.qtjbName = this.inspectForm.conclusion;
                }
				let tGroupPersonForm = this.personInfo;
				if (tGroupPersonForm && tGroupPersonForm.hazard_factors && (tGroupPersonForm.hazard_factors.indexOf('110999') > -1 || tGroupPersonForm.hazard_factors.indexOf('120999') > -1
						|| tGroupPersonForm.hazard_factors.indexOf('130999') > -1 || tGroupPersonForm.hazard_factors.indexOf('140999') > -1
						|| tGroupPersonForm.hazard_factors.indexOf('150999') > -1 || tGroupPersonForm.hazard_factors.indexOf('160999') > -1)) {
					item.otherBadrsn = tGroupPersonForm.other_hazard_factors;
				}
				return item;
			},
			//获取危害因素结论集合
			getConclusionCode(e) {
				//这里是为了区分是不是点击
				if (!this.isFirst) {
					//危害因素结论集合
					let bairns = [];
					let conclusionCode = "";
					//未见明显异常
					if (this.isDifferenceModel) {
						if (this.noDifferenceModel && this.noDifferenceModel.length > 0) {
							for (let index in this.hazardFactorsList) {
								let item = this.hazardFactorsList[index];
								if (item && item.code && this.noDifferenceModel.indexOf(item.code) > -1) {
									let itemB = this.spliceHazardsConclusion(item.code, "12001", null, null);
									bairns.push(itemB);
								}
							}
						}
					}
					//职业病
					if (this.isDiseases) {
						this.inspectForm.occupationalDiseasesNow = "";
						this.inspectForm.occupationalDiseasesNowCode = "";
						if (this.diseasesList && this.diseasesList.length > 0) {
							for (let i = 0; i < this.diseasesList.length; i++) {
								let item = this.diseasesList[i];
								if (this.diseasesList[i] && this.diseasesList[i].isCheck) {
									if (this.diseasesList[i].diseases && this.diseasesList[i].diseasesModel) {
										for (let disease in this.diseasesList[i].diseases) {
											let diseaseItem = this.diseasesList[i].diseases[disease];
											if (diseaseItem && diseaseItem.code && this.diseasesList[i].diseasesModel.indexOf(diseaseItem.code) > -1) {
												let itemB = this.spliceHazardsConclusion(item.code, "12003", diseaseItem.code, null);
												bairns.push(itemB);
												this.inspectForm.occupationalDiseasesNow += diseaseItem.name;
												this.inspectForm.occupationalDiseasesNowCode += diseaseItem.code;
												this.inspectForm.occupationalDiseasesNow += ";";
												this.inspectForm.occupationalDiseasesNowCode += ";";
											}
										}
									}

								}
							}

						}
						conclusionCode = "12003";
					}
					//职业禁忌证
					if (this.isTaboo) {
						this.inspectForm.occupationalTabooNow = "";
						this.inspectForm.occupationalTabooNowCode = "";
						if (this.tabooList && this.tabooList.length > 0) {
							for (let i = 0; i < this.tabooList.length; i++) {
								let item = this.tabooList[i];
								if (this.tabooList[i] && this.tabooList[i].isCheck && item.code == this.tabooList[i].code) {
									if (this.tabooList[i].taboo && this.tabooList[i].tabooModel) {
										for (let taboo in this.tabooList[i].taboo) {
											let tabooItem = this.tabooList[i].taboo[taboo];
											if (tabooItem && tabooItem.code && this.tabooList[i].tabooModel.indexOf(tabooItem.code) > -1) {
												let itemB = this.spliceHazardsConclusion(item.code, "12004", null, tabooItem.code);
												bairns.push(itemB);
												this.inspectForm.occupationalTabooNow += tabooItem.name;
												this.inspectForm.occupationalTabooNowCode += tabooItem.code;
												this.inspectForm.occupationalTabooNow += ";";
												this.inspectForm.occupationalTabooNowCode += ";";
											}
										}
									}
								}
							}
						}
						conclusionCode = "12004";
					}
					//其他疾病或异常
					if (this.isOtherExceptionsModel) {
						if (this.otherExceptionsModel && this.otherExceptionsModel.length > 0) {
							for (let index in this.hazardFactorsList) {
								let item = this.hazardFactorsList[index];
								if (item && item.code && this.otherExceptionsModel.indexOf(item.code) > -1) {
									let itemB = this.spliceHazardsConclusion(item.code, "12005", null, null);
									bairns.push(itemB);
								}
							}
						}
						if (this.otherExceptions) {
							this.inspectForm.otherCheckAbnormalResults = this.otherExceptions;
						}
					}
					//复查
					if (this.isReviewModel) {
						if (this.reviewModel && this.reviewModel.length > 0) {
							for (let index in this.hazardFactorsList) {
								let item = this.hazardFactorsList[index];
								if (item && item.code && this.reviewModel.indexOf(item.code) > -1) {
									let itemB = this.spliceHazardsConclusion(item.code, "12002", null, null);
									bairns.push(itemB);
								}
							}
						}
					}
					if (conclusionCode.trim().length == 0) {
						if (this.isDifferenceModel) {
							conclusionCode = "12001";

						}
						if (this.isReviewModel) {
							conclusionCode = "12002";
						}
						if (this.isOtherExceptionsModel) {
							conclusionCode = "12005";
						}
					}
					this.inspectForm.conclusionCode = conclusionCode;
					this.inspectForm.bairns = bairns;
				}

			},

			//抽屉展示（术语选择）
			handleWordChoose(type) {
				if (type == "zjzybmc") {
					this.isMultiple = true;
					this.title = "主检结论";
				} else {
					this.isMultiple = false;
					this.title = "常用术语";
				}
				this.wordChooseShow = true;
				this.type = type;
			},
			//获取专业术语回调
			getSelectedWords(word, cType) {
				if (cType == "zjclyj") {
					if (word.indexOf("可继续从事") > -1) {
						let text = "可继续";
						if (this.personInfo.work_state_text && this.personInfo.work_state_text.trim() == "上岗前") {
							text = "可"
						}
						this.inspectForm.handleOpinion += text + '从事接触' + this.personInfo.hazard_factors_text + '岗位工作，加强个人防护，定期参加职业健康体检。';
					} else {
						this.inspectForm.handleOpinion += word;
					}
				} else if (cType == "zjzybmc") {
					this.inspectForm.conclusion += word[0].content;
					this.conclusionNow += word[0].content;
				} else if (cType == 'zjqtjcycjg') {
					if (!this.otherExceptions) {
						this.otherExceptions = word;
					} else {
						this.otherExceptions = this.otherExceptions + "\n" + word;
					}
				} else if (cType == 'qtjbycclyj') {
					this.inspectForm.careerIllnessName = word;
				} else if (cType == 'zjzyjcycjg') {
					if (!this.inspectForm.conclusion) {
						this.inspectForm.conclusion = word;
					} else {
						this.inspectForm.conclusion += "\n" + word;
					}
				}

			},
			//将数字转为中文
			changeNum(num) {
				return changeNumToHan(num);
			},
			//其他异常描述改变事件
			otherExceptionsChange() {
				this.inspectForm.otherCheckAbnormalResults = this.otherExceptions;
				this.getConclusionCode(this.isOtherExceptionsModel);
			},
			//检查医生选择
			doctorSelectChange(e) {
				if (e) {
					let docker = this.userArray.filter(aa => aa.id == e.value);
					if (docker && docker.length > 0) {
						let selectDocker = docker[0];
						if (selectDocker) {
							this.inspectForm.inspectionDoctor = selectDocker.nickname;//总检医生名字
							this.inspectForm.createId = selectDocker.id;//总检医生Id
							//总检医生签名
							if (selectDocker.autographFile && selectDocker.autographFile.indexOf("/dcm") > -1) {
								this.inspectForm.inspectionAutograph = selectDocker.autographFile;
							} else {
								this.inspectForm.inspectionAutograph = "data:image/png;base64," + selectDocker.autograph;
							}
						}
					}
				}
			},
            //获取复查项目
            queryTReviewRecordList(val){
                this.param.personId = val;
                queryTReviewRecordList(this.param).then(res => {
                    if (res.success) {
                        this.reviewProjectData = res.data;
                    }
                })
            },
            //第一次体检结论
			firstPersonConclusionClick(){
				this.reviewFirstPersonId = this.firstPersonId;
                this.conclusionExaminationShow = true;
            },
			//第一次体检明细结果
			firstPersonItemClick(){
				this.reviewFirstPersonId = this.firstPersonId;
				this.projectDetailReviewShow = true;
            },
		},
		mounted() {
		},
		watch: {
			'tableData'(val) {
				this.tableDataArray = val;
				if (val && val.length > 0) {
					let _this = this;
					setTimeout(function () {
						_this.getAbnormalInfo();
					}, 100);
				}
			},
			'personInfo.hazardFactorsList'(val) {
				let _this = this;
				_this.hazardFactorsList = [];
				if (val && this.personInfo && this.personInfo.hazardFactorsList) {
					_this.hazardFactorsList = this.personInfo.hazardFactorsList;
					_this.initDiseasesAndTaboo();
				}
			},
			'personInfo.id'(val) {
				let _this = this;
                this.queryTReviewRecordList(val);
				_this.init();
			},
			// 'inspectForm.personId'(val) {
			// 	let _this = this;
            //     if (_this.inspectForm && _this.inspectForm.createId && _this.inspectForm.createId.toString().trim().length > 0) {
			// 		setTimeout(function () {
			// 			_this.doctorId = _this.inspectForm.createId;
			// 		}, 1000);
            //
			// 	} else {
			// 		this.doctorId = this.doctorInfo.id;
			// 	}
			// },
			'isDifferenceModel'(val) {
				this.changeDifference();
			},
			'isReviewModel'(val) {
				this.changeReview();
			},
			'isOtherExceptionsModel'(val) {
				this.changeOtherException();
			},
			'otherExceptions'(val) {
				this.otherExceptionsChange();
			},
		},
	}
</script>

<style lang="less">
    .occupational {
        overflow-x: hidden;
        .conclusionDiv {
            width: 100%;

            .card {
                height: calc(100vh - 443px) !important;
                overflow: hidden;
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                min-height: 600px;
                .cardResultButton {
                    padding: 3px;
                    background-color: #0c69c8;
                    border-color: #2583e6;
                    text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
                    box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
                    margin-left: 20px;
                    color: white;
                }

                .cardTextareaResult {
                    width: 100%;
                }
            }
            .ivu-collapse-header {
                display: flex;
                user-select: none;
                font-size: 0.729vw;
                font-weight: 700;
                .ivu-icon-ios-arrow-forward {
                    padding-top: 10px;
                }
            }

            .ivu-form-item {
                display: flex;
            }

            .ivu-form-item-content {
                padding: 2px;
                margin-left: 10px !important;
                width: 100%;

            }

            .ivu-checkbox-wrapper {
                margin-top: 10px;
            }

            .diseasesDiv {
                .ivu-checkbox-wrapper {
                    margin-left: 20px;
                }
            }

            .tabooDiv {
                .ivu-checkbox-wrapper {
                    margin-left: 20px;
                }
            }
        }

        .clusionInfoForm {
            max-height: 100%;
            overflow-y: auto;
            min-height: 100%;
        }

        .clusionInfoForm::-webkit-scrollbar {
            width: 4px;
        }

        .clusionInfoForm::-webkit-scrollbar-track {
            background-color: #e4e4e4;
            border-radius: 100px;
        }

        .clusionInfoForm::-webkit-scrollbar-thumb {
            background-color: #2684e780;
            border-radius: 100px;
        }

        .cardTextareaResult {


        }
        .textareaResult {
            .choice {
                position: absolute;
                bottom: 0px;
                z-index: 10;
                height: 20px;
                width: 20px;
                padding: 0px;
            }
        }

        .cardTextarea > textarea::-webkit-scrollbar {
            width: 4px;
            background-color: #2684e780;
        }

        .cardTextarea > textarea::-webkit-scrollbar-track {
            background-color: #e4e4e4;
            border-radius: 100px;
        }

        .cardTextarea > textarea::-webkit-scrollbar-thumb {
            background-color: #2684e780;
            border-radius: 100px;
        }

    }

</style>