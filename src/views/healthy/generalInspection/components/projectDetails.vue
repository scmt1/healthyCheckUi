<template>
    <Modal :title="modelTitle" v-model="modalVisible" :mask-closable="false" class="result projectDetailsClass" >
        <el-tabs value="name1" class="details-result">
            <el-tab-pane label="明细结果" name="name1">
                <Card>
                    <Row type="flex" justify="space-between">
                        <Col span="3" style="position: relative">
                            <div style="position: relative">
                                <div class="tree-bar" :style="{ maxHeight: maxHeight }">
                                    <!--<Tree  ref="tree" :data="treeData" @on-select-change="selectTree"></Tree>-->
                                    <div style="margin-left: 12px;margin-top: 7px" v-for="(item,i) in treeData"
                                         :id="'trees'+item.officeId" :class="{'selectTree':item.officeId===officeId}"
                                         @click="clickSelectTree(item)">{{item.title}}
                                        <Icon :id="'icon'+item.officeId" type="ios-alert-outline"/>
                                    </div>
                                    <Spin size="large" fix v-if="treeLoading"></Spin>
                                </div>
                            </div>
                        </Col>

                        <Col span="20">
                            <div v-if="officeName == '问诊科'">
                                <otherInfo :personInfo="personWZInfo" :status="1" ref="otherInfo"></otherInfo>
                                <Spin size="large" fix v-if="wzShow"></Spin>
                            </div>
                            <!--分组项目-->
                            <div v-if="officeName!= '问诊科'" ref="tab"
                                 :style="{'borderTop':tabsArr.length>0?'':'1px dashed #ccc'}">
                                <el-tabs v-if="tabsArr.length > 0 && officeName != '问诊科'" type="border-card"
                                         style="width: 100%;margin-top:10px;"
                                         v-model="tabsValue" @tab-click="tabsClick">
                                    <el-tab-pane style="margin-bottom: 10px;"
                                                 v-for="(item,index) in tabsArr"
                                                 :label="item.groupItemName"
                                                 :name="item.id"
                                                 :key="index">
                                        <span slot="label"><Icon :id="'elIcon'+item.id" type="ios-alert-outline"/>{{item.groupItemName}}</span>
                                        <div v-if="item.isFile=='是'">
                                            <Row style="height: 240px;border: 1px solid #DCDEE2;border-top: 0;overflow: auto;">
                                                <Col span="24" style="justify-content: center;align-items: center;">
                                                    <div>
                                                        <Table :loading="loading"
                                                               border
                                                               :columns="getColumnsYX()"
                                                               sortable="custom"
                                                               :data="baseProjectData"
                                                               :row-class-name="rowClassName">
                                                        </Table>
                                                    </div>
                                                    <div v-viewer="{movable: false,zIndex:7000}"
                                                         style="height: 80%;width: 100%;display: flex;justify-content: center;align-items: center;">
                                                        <img v-for="(item,index) in pacsData" :key="index" :src="item"
                                                             style="width: 200px;height: 200px;border:1px dashed #ccc;margin-right:20px;">
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>

                                        <!--列表-->
                                        <div v-if="item.isFile == '否' || item.isFile==null || item.isFile == ''">
                                            <Table :loading="loading"
                                                   border
                                                   :columns="resultColumn"
                                                   sortable="custom"
                                                   :data="baseProjectData"
                                                   :row-class-name="rowClassName"
                                                   height="280">
                                            </Table>
                                        </div>

                                        <Form :label-width="30" style="margin: 20px 2px 10px;border-bottom:0;" inline>
                                            <Row style="flex-wrap: nowrap">
                                                <Col span="10" style="position: relative">
                                                    <label style="font-size: 14px;font-weight: 600;margin-bottom: 15px;">体检提醒或影像所见</label>
                                                    <Input type="textarea"
                                                           v-model="item.diagnoseTip"
                                                           placeholder="输入多个以;分隔"
                                                           class="result-textarea"
                                                           :autosize="{maxRows: 6,minRows: 6}"/>
                                                </Col>
                                                <Col span="2"></Col>
                                                <Col span="10" style="margin-left: 16px;">

                                                    <label style="font-size: 14px;font-weight: 600;margin-bottom: 15px;">体检小结</label>
                                                    <Input type="textarea"
                                                           placeholder="输入多个以;分隔"
                                                           v-model="item.diagnoseSum"
                                                           class="result-textarea"
                                                           :autosize="{maxRows: 6,minRows: 6}"/>
                                                </Col>
                                            </Row>
                                        </Form>

                                        <div class="items-result">
                                            <Row>
                                                <Col span="6">
                                                    <div style="display: flex;">
                                                        <div>检查医生：</div>
                                                        <!--                                                        <img :src="item.checkSign ? 'data:image/png;base64,' + item.checkSign" width="150" height="30">-->
                                                        <img :src="item.checkSign ? (item.checkSignPath && item.checkSignPath.indexOf('/dcm') > -1) ? item.checkSignPath : item.checkSign.indexOf('/dcm') > -1 ? item.checkSign : 'data:image/png;base64,' + item.checkSign : checkDoctor"
                                                             width="150" height="30">
                                                    </div>
                                                </Col>
                                                <Col span="4">
                                                    <div>检查日期：{{ formatTime(item.checkDate) }}</div>
                                                </Col>
                                                <Col span="2"></Col>
                                                <Col>
                                                    <ButtonGroup
                                                            style="display: flex;justify-content: center;margin-left: 18px;">
                                                        <Button type="primary"
                                                                @click="handleViewTemplate">报告预览
                                                        </Button>
                                                    </ButtonGroup>
                                                </Col>
                                            </Row>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                            <no-data v-if="tabsArr.length <= 0 && officeName != '问诊科'" width="150"
                                     height="150"></no-data>
                            <Spin size="large" fix v-if="groupShow"></Spin>
                        </Col>
                    </Row>
                </Card>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer">
            <Button @click="modalVisible = false">取消</Button>
            <!--                <Button type="primary" :loading="saveLoading" @click="handleSave">保存结果</Button>-->
        </div>
        <!--模板预览-->
        <preview-templateMX v-model="previewShowMX" :personInfo="personInfo"></preview-templateMX>
    </Modal>

</template>

<script>
	import {changeNumToHan, formartDate} from "../../../../api/tools/tool";
	import {getGroupByOfficeId, queryPersonCheckOffice} from "../../../../api/healthy/tDepartResult";
	import {getTGroupPersonWZInfo} from "../../../../api/healthy/tGroupPerson";
	import {getSelectedBaseItemByItemId} from "../../../../api/healthy/tOrderGroupItemProject";
	import noData from "../../../../components/no-data"
	import otherInfo from "../../tGroupPerson/otherInfo";
	import {userInfo} from "../../../../api";
	import Cookies from "js-cookie";
	import previewTemplateMX from "../../tCheckStation/previewTemplate";

	export default {
		name: "projectDetails",
		props: {
			personId: {
				type: String,
				default: null
			},
			title: {
				type: String,
				default: ""
			},
			value: {
				type: Boolean,
				default: false
			},
			personInfo: {
				type: Object,
				default: null
			},
			tableData: {
				type: Array,
				default: []
			},
			projectRow: {
				type: Object,
				default: null
			},
			checkDoctor: {
				type: String,
				default: ""
			},
		},
		components: {
			noData, otherInfo, previewTemplateMX
		},
		data() {
			return {
                modelTitle: '明细结果查看',
				modalVisible: false,
				personWeight: 0,
				groupShow: false,//分组展示
				officeName: "",//科室名字
				personWZInfo: {},//人员名称
				treeLoading: false, // 树加载状态
				treeData: [], // 树数据
				departmentData: [], //科室
				loading: false,//单项检查
				itemResult: '',//单项检查结果
				resultData: [],//明细结果
				physicalTime: '',//体检时间
				officeIdData: [],//异常科室
				ProjectException: [],//异常项目
				tabsArr: [],//项目tabs集合
				isMultiple: false,//体检小结选择
				baseProjectData: [],//基础项目集
				maxHeight: "500px",//弹窗最大高度
				previewShowMX: false,//模板预览
				//明细结果列
				resultColumn: [
					{
						title: '体检项目',
						minWidth: 200,
						fixed: "left",
						ellipsis: true,
						tooltip: true,
						key: 'name',
						sortable: false
					},
					{
						title: '结果',
						align: 'center',
						minWidth: 150,
						ellipsis: true,
						tooltip: true,
						key: 'result',
						sortable: false,
						render: (h, params) => {
							let resultType = params.row.resultType;
							if (resultType == '选择') {
								let defaultValue = params.row.defaultValue ? params.row.defaultValue.split(";") : [];
								let result = "";
								if (params.row.departItemResults && params.row.departItemResults.result) {
									result = params.row.departItemResults.result.split(";")[0];
									if (result && result.trim().length > 0) {
										defaultValue.push(result);
										defaultValue = defaultValue.filter((item, indx, arr) => {
											return arr.indexOf(item) == indx;
										})
									}
								}

								return h('Select', {
									props: {
										value: result,
										transfer: true,
										filterable: true,
										allowCreate: true,
										size: "small",
										clearable: true
									},
									on: {
										'on-change': e => {
											this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);//结果
										},
										'on-create': e => {
											defaultValue.push(e);
											defaultValue = defaultValue.filter((item, indx, arr) => {
												return arr.indexOf(item) == indx;
											});
											this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);//结果
										}
									}
								}, defaultValue.map(item => {
									return h('Option', {
										props: {
											value: item,
											label: item
										}
									})
								}))
							} else {
								return h('Input', {
									props: {
										value: params.row.departItemResults.result,
										size: "small"
									},
									on: {
										input: e => {
											//输入值
											if (!e) {
												this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
												this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "暂无结果");
											} else {
												let projectName = params.row.name;
												if ('身高' == projectName) {
													this.personHeight = e;
												}
												if ('体重' == projectName) {
													this.personWeight = e;
												}
												if (this.personHeight && this.personWeight) {
													let height = this.personHeight / 100;
													let BMI = parseInt(this.personWeight / (height * height) * 10) / 10;
													this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);   //结果
													this.$set(this.baseProjectData[3].departItemResults, 'result', BMI);   //结果
												} else {
													this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);   //结果
												}

												if (e == '阳性') {
													this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '↑');
													this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "高于正常值");
													this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);
												} else {
													//范围
													let scope = params.row.departItemResults.scope;
													//提示arrow
													if (!scope || scope == "-") { //范围
														this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
														this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "暂无结果");
													} else {
														let arrow = this.setArrow(params.row.departItemResults.scope, e);

														this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', arrow);
														if (arrow == "↑") {
															this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "高于正常值");
														}
														if (arrow == "↓") {
															this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "低于正常值");
														}
														if (arrow == "-") {
															this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "正常");
														}
													}
												}
											}
										}
									}
								})
							}
						}
					}, {
						title: '单位',
						align: 'center',
						tooltip: true,
						ellipsis: true,
						minWidth: 100,
						render: (h, params) => {
							let unit = params.row.departItemResults.unitName;
							if (unit) {
								return h("span", unit);
							} else {
								let u = params.row.unitName;
								if (u == null || u == "") {
									u = "无";
								}
								this.$set(this.baseProjectData[params.index].departItemResults, 'unitName', u);
								return h("span", u);
							}
						}
					}, {
						title: '参考范围',
						align: 'center',
						tooltip: true,
						minWidth: 120,
						ellipsis: true,
						render: (h, params) => {
							let scope = params.row.departItemResults.scope;
							if (scope && scope != "-") {
								return h("div", scope);
							} else {
								let val = "";
								//规则参考值
								let reference = params.row.relationProjectReference;
								if (!reference) {
									this.$set(this.baseProjectData[params.index].departItemResults, 'scope', "-");
									return h("div", "-");
								}
								val = reference.occupationValue;
								if (!val) {
									val = "-";
								}
								this.$set(this.baseProjectData[params.index].departItemResults, 'scope', val);
								return h("div", val);
							}
						}
					}, {
						title: '提示',
						align: 'center',
						tooltip: true,
						ellipsis: true,
						minWidth: 50,
						key: "arrow",
						render: (h, params) => {
							let arrow = params.row.departItemResults.arrow;
							if (arrow == undefined || arrow == null) {
								arrow = "-";
								this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', arrow);
							}
							return h("span", arrow);
						}
					}/*, {
						title: '危急程度',
						align: 'center',
						minWidth: 90,
						tooltip: true,
						ellipsis: true,
						render: (h, params) => {
							let crisis = params.row.departItemResults.crisisDegree;
							let positive = "0";
							if (crisis && (crisis.indexOf("异常") > -1 || crisis.indexOf("低于") > -1 || crisis.indexOf("高于") > -1)) {
								positive = "1";
								this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
							} else {
								this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
							}
							if (crisis) {
								return h("span", crisis);
							} else {
								this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "正常");
								return h("span", "正常");
							}
						}
					}*/, {
                        title: this.$hospitalName.updateTableAbnormalFieldName || "阳性",
						align: 'center',
						minWidth: 60,
						tooltip: true,
						ellipsis: true,
						key: "positive",
						render: (h, params) => {
							let crisis = params.row.departItemResults.crisisDegree;
							let positive = "0";
							if (crisis && (crisis.indexOf("异常") > -1 || crisis.indexOf("低于") > -1 || crisis.indexOf("高于") > -1)) {
								positive = "1";
								this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
							} else {
								this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
							}
							if (true) {//勾选框
								return h("span", [
									h("Checkbox", {
										attrs: {
											value: positive == "1" ? true : false,
										},
										on: {
											"on-change": (event) => {
												if (event) {
													this.$set(this.baseProjectData[params.index].departItemResults, 'positive', "1");
												} else {
													this.$set(this.baseProjectData[params.index].departItemResults, 'positive', "0");
												}
											},
										},
									}),
									[h("span", "是")],
								]);
							}
						}
					}
				],
				wzShow: false,//问诊显示
				tabsValue: null,//选中的项目
				selectTreeId: null,//选中的科室
			}
		},
		computed: {
			physicalType() {
				return this.$store.state.theme.theme.physicalType;
			},
		},
		methods: {
			//结果查看点击
			resultClick(tab) {
				this.officeName = "";
				this.resultData = [];
				this.tabsArr = [];
				this.checkInfo = {};
				this.itemResult = "";
				this.physicalTime = "";
				if (tab.name == "name1") {
					this.getPersonOffice(this.personId);
				} else if (tab.name == "name2") {
					this.getPersonOffice(this.personId);
				}
			},
			//查询人员检查科室
			getPersonOffice(id) {
				this.treeLoading = true;
				queryPersonCheckOffice({personId: id}).then(res => {
					if (res.success) {
						let data = [];
						this.officeId = "";
						this.officeName = "";
						if (this.personInfo.physical_type != "健康体检") {
							let office = {
								title: "问诊科",
								personId: id,
								officeId: "1454369800754171904",
								selected: true,
							};
							data.push(office);
						}
						for (let i = 0; i < res.data.length; i++) {
							let obj = {...res.data[i]};
							obj.title = obj.officeName;
							if (this.personInfo.physical_type == "健康体检" && i == 0) {
								obj.selected = true;
							}
							data.push(obj);
						}
						this.treeData = data;
						this.officeId = this.treeData[0].officeId;
						this.$nextTick(() => {
							for (let i = 0; i < this.treeData.length; i++) {
								let officeId = this.treeData[i].officeId;
								let officeName = this.treeData[i].officeName;
								//let tabs = document.getElementById("trees"+officeId);
								let icon = document.getElementById("icon" + officeId);
								if (!this.checkPhysical2(officeId) && officeName != "问诊科") {
									icon.style.color = "white"
								} else {
									icon.style.color = "red"
								}
							}
						});
						this.officeName = this.treeData[0].officeName;
						if (this.personInfo.physical_type == "健康体检") {
							this.getResultByGroupId(this.treeData[0].officeId);
						} else {
							this.officeName = '问诊科';
							this.wzShow = true;
							getTGroupPersonWZInfo({id: id}).then(res => {
								if (res.success) {
									if (res.data) {
										//人信息
										this.personWZInfo = res.data;
									}
								}
							}).finally(() => {
								this.wzShow = false;
							})
						}
					}
				}).finally(() => {
					this.treeLoading = false;
				})
			},
			//查看结果为异常的人员信息
			handleViewClickAnomaly(row, index) {
				this.resultData = [];
				this.tabsArr = [];
				this.treeLoading = true;
				let _this = this;
				//先查问诊
				_this.officeName = '问诊科';
                _this.wzShow = true;
                getTGroupPersonWZInfo({id: _this.personId}).then(res => {
                    if (res.success) {
                        if (res.data) {
                            //人信息
                            _this.personWZInfo = res.data;
                        }
                    }
                }).finally(() => {
                    _this.wzShow = false;
                })
				queryPersonCheckOffice({personId: _this.personId}).then(res => {
					if (res.success) {
						let data = [];
						_this.officeId = "";
						_this.officeName = "";
						if (_this.personInfo.physical_type != "健康体检") {
							let office = {
								title: "问诊科",
								personId: this.radioValue,
								officeId: "1454369800754171904",
								selected: true,
							};
							data.push(office);
						}
						for (let i = 0; i < res.data.length; i++) {
							let obj = {...res.data[i]};
							obj.title = obj.officeName;
							if (_this.personInfo.physical_type == "健康体检" && i == 0) {
								obj.selected = true;
							}
							data.push(obj);
						}
						_this.treeData = data;
						_this.$nextTick(() => {
							for (let i = 0; i < _this.treeData.length; i++) {
								let officeId = _this.treeData[i].officeId;
								let officeName = _this.treeData[i].officeName;
								let icon = document.getElementById("icon" + officeId);
								if (!this.checkPhysical2(officeId) && officeName != "问诊科") {
									icon.style.color = "white"
								} else {
									icon.style.color = "red"
								}
							}
						})
						_this.officeName = _this.treeData[0].officeName;
					}
				}).finally(() => {
					_this.treeLoading = false;
					_this.getResultByGroupId(row.officeId, null, null, row.groupItemId);

					_this.modalVisible = true;
				})

			},
			//获取分组
			getResultByGroupId(officeId, startDate, endDate, groupItemId) {
				this.groupShow = true;
				let _this = this;
				getGroupByOfficeId({
					officeId: officeId,
					personId: this.personId,
					groupId: this.personInfo.group_id,
					startDate: startDate,
					endDate: endDate
				}).then(res => {
					if (res.success) {
						_this.tabsArr = res.data;
						_this.officeId = "";

						if (res.data.length > 0) {
							if (groupItemId && _this.projectRow) {//定位到具体项目
								let nowItemArry = _this.tabsArr.filter(item => item.id ===  _this.projectRow.id);
								if (nowItemArry && nowItemArry.length > 0) {
									_this.tabsValue = nowItemArry[0].id;
									_this.officeId = nowItemArry[0].officeId;
								} else {
									_this.tabsValue = _this.tabsArr[0].id;
									_this.officeId = _this.tabsArr[0].officeId;
								}
							} else {
								_this.tabsValue = _this.tabsArr[0].id;
								_this.officeId = _this.tabsArr[0].officeId;
							}
						}
						_this.getBaseProjectResult();
					}
				}).finally(() => {
					_this.groupShow = false;
					_this.handleCheckStatus();
				})
			},
			//获取基础项目结果
			getBaseProjectResult() {
				if (this.officeName != '问诊科') {
					let tab = this.tabsArr.find(i => i.id == this.tabsValue);
					if (tab.groupItemName.indexOf('复') > -1) {
						this.getSelectedBaseItemByItemId_front(tab.groupItemId, tab.portfolioProjectId, tab.groupId, tab.isFile);
					} else {
						this.getSelectedBaseItemByItemId_front(tab.groupItemId, "", "", tab.isFile);
					}
				}
			},
			// tab点击事件
			tabsClick(e) {
				this.personHeight = 0;
				this.personWeight = 0;
				this.getBaseProjectResult();
				this.pacsData = [];
			},
			//获取选中的基础项目
			getSelectedBaseItemByItemId_front(itemId, portfolioId = "", groupId = "", isFile) {
				if (itemId) {
					this.data = [];
					this.pacsData = [];
					this.loading = true;
					getSelectedBaseItemByItemId({
						itemId: itemId,
						personId: this.personId,
						portfolioId: portfolioId,
						groupId: groupId
					}).then(res => {
						if (res.success) {
							if (res.data && res.data.length > 0) {
								res.data.forEach(i => {
									if (i.departItemResults == null) {
										i.departItemResults = {};
										i.departItemResults.personId = this.personInfo.id;
										i.departItemResults.orderGroupItemProjectName = i.name;
										i.departItemResults.orderGroupItemProjectId = i.id;
									} else {
										if (i.name == "身高") {
											this.personHeight = i.departItemResults.result;
										}
										if (i.name == "体重") {
											this.personWeight = i.departItemResults.result;
										}
									}

									if (isFile == '是' && i.departItemResults.imgUrl) {
										if(i.departItemResults.imgUrl.indexOf(",") > -1){
											let imgUrls = i.departItemResults.imgUrl.split(",");
											imgUrls.forEach(item => {
												this.pacsData.push(item);
											});
										}else{
											this.pacsData.push(i.departItemResults.imgUrl);
										}

									}
								})
								this.baseProjectData = res.data;
							}
						}
					}).finally(() => {
						this.loading = false;
					})
				}
			},
			//抽屉展示
			handleWordChoose(type) {
				if (type == "zjzybmc") {
					this.isMultiple = true;
					this.title = "主检结论";
				} else {
					this.isMultiple = false;
					this.title = "常用术语";
				}
				// this.isMultiple = false;//允许多选
				this.wordChooseShow = true;
				this.type = type;
				//套餐目标职业禁忌证
				if (this.personInfo.occupational_taboo) {
					this.occupationalTaboo = this.personInfo.occupational_taboo;
				} else {
					this.occupationalTaboo = this.personInfo.occupationalTaboo;
				}
			},
			//检查是否是正常的体检项目
			checkPhysical1(name) {
				name = name.trim();
				name = name.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
				let physicalSummary = this.ProjectException;
				if (physicalSummary) {
					let res = false;
					physicalSummary.forEach(ii => {
						if (name == ii || name == ii + "。") {
							res = true;
						}
					});
					return res;
				}
				return false;
			},
			//检查是否是正常的体检科室
			checkPhysical2(name) {
				name = name.trim();
				name = name.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
				let physicalSummary = this.officeIdData;
				if (physicalSummary) {
					let res = false;
					physicalSummary.forEach(ii => {
						if (name == ii || name == ii + "。") {
							res = true;
						}
					});
					return res;
				}
				return false;
			},
			//row换颜色
			rowClassName(row, index) {
				if (row.departItemResults.crisisDegree == "正常") {
					// return "green";
				} else if (row.departItemResults.crisisDegree == "低于正常值") {
					return "yellow";
				} else if (row.departItemResults.crisisDegree == "高于正常值" || row.departItemResults.crisisDegree == "异常") {
					return "red";
				} else {
					// return "gray";
				}
				if (row.departItemResults.result == "阳性") {
					return "red";
				}
			},
			//点击明细结果科室
			clickSelectTree(v) {
				let val = [];
				val.push(v);
				this.physicalTime = "";
				this.itemResult = '';
				if (val.length > 0) {
					// 转换null为""
					for (let attr in val[0]) {
						if (val[0][attr] == null) {
							val[0][attr] = "";
						}
					}
					let str = JSON.stringify(val[0]);
					let data = JSON.parse(str);
					this.officeName = data.title;
					this.officeId = data.officeId;
					this.getResultByGroupId(data.officeId);
					this.selectTreeId = data.id;
				}
			},
			//组合项目添加异常图标
			handleCheckStatus() {
				if (this.officeName != '问诊科' && this.tabsArr.length > 0) {
					this.$nextTick(() => {
						for (let i = 0; i < this.tabsArr.length; i++) {
							let t = this.tabsArr[i];
							let icon = document.getElementById('elIcon' + t.id);
							if (!this.checkPhysical1(t.groupItemId)) {
								icon.style.color = "white";//绿色
							} else {
								icon.style.color = "red";//红色
							}
						}
					})
				}
			},
			//将数字转为中文
			changeNum(num) {
				return changeNumToHan(num);
			},
			//格式化时间
			formatTime(e) {
				return formartDate(e, "yyyy-MM-dd");
			},
			//关闭窗口
			closeModal(val) {
				this.$emit('input', val);
			},
			//列(影像项目)
			getColumnsYX() {
				let _this = this;
				return [
					{
						type: "index",
						width: 60,
						align: 'center'
					}, {
						title: '体检项目',
						align: 'left',
						width: 180,
						tooltip: true,
						ellipsis: true,
						key: 'name'
					}, {
						title: '明细结果',
						align: 'center',
						minWidth: 150,
						tooltip: true,
						ellipsis: true,
						render: (h, params) => {
							let resultType = params.row.resultType;
							if (resultType == '选择') {
								//下拉选项
								let defaultValue = params.row.defaultValue ? params.row.defaultValue.split(";") : [];

								//默认取第一个结果
								let result = "";
								if (params.row.departItemResults.result) {
									result = params.row.departItemResults.result.split(";")[0];
									this.$set(this.baseProjectData[params.index].departItemResults, 'result', result);//结果
								}

								if (result && result.trim().length > 0) {
									defaultValue.push(result);
									defaultValue = defaultValue.filter((item, indx, arr) => {
										return arr.indexOf(item) == indx;
									})
								}
								return h('Select', {
									props: {
										value: result,
										transfer: true,
										filterable: true,
										allowCreate: true,
										clearable: true
									},
									on: {
										'on-change': e => {
											this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);//结果
											if (params.row.criticals.length == 0) {
												this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '-');
											} else {
												let ret = this.setResult(params.row.criticals, e);
												if (ret.flag == "-") {
													this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '-');
													this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
												} else if (ret.flag) {
													this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '异常');
													this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
												} else if (!ret.flag) {
													this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '正常');
													this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
												}
											}
										},
										'on-create': e => {
											defaultValue.push(e);
											defaultValue = defaultValue.filter((item, indx, arr) => {
												return arr.indexOf(item) == indx;
											});
											this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);//结果
										}
									}
								}, defaultValue.map(item => {
									return h('Option', {
										props: {
											value: item,
											label: item
										}
									})
								}))
							} else if (resultType == "数值") {
								let result = '';
								if (params.row.departItemResults.result || (params.row.departItemResults.result && params.row.departItemResults.result == 0)) {
									result = Number(params.row.departItemResults.result);
								}
								return h('InputNumber', {
									props: {
										value: result,
										min: -20,
										step: 0.01,
										readonly: false
									},
									on: {
										'on-change': e => {
											let v = e;//录入值
											if (!v) {
												// this.$set(this.baseProjectData[params.index].departItemResults, 'result', 0);
												this.$set(this.baseProjectData[params.index].departItemResults, 'result', v);
												this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
												this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "-");
											} else {
												this.$set(this.baseProjectData[params.index].departItemResults, 'result', v);
												let ret = this.setResult(params.row.criticals, v);
												if (ret.flag == "-") {
													this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '-');
													this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
												} else if (ret.flag) {
													this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', ret.resp ? ret.resp : ret.arrow == '-' ? '-' : ret.arrow == "↑" ? '高于正常值' : '低于正常值');
													this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
												} else if (!ret.flag) {
													this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "正常");
													this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
												}
											}
										}
									}
								})
							} else {
								let result = params.row.departItemResults.result;
								return h('Input', {
									props: {
										value: result,
										readonly: false
									},
									on: {
										'on-change': e => {
											let v = e.target.value;//录入值
											if (!v) {
												this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
												this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "-");
												this.$set(this.baseProjectData[params.index].departItemResults, 'result', v);
											} else {
												this.$set(this.baseProjectData[params.index].departItemResults, 'result', v);
												let ret = this.setResult(params.row.criticals, v);
												if (ret.flag == "-") {
													this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '-');
													this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
												} else if (ret.flag) {
													this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', ret.resp ? ret.resp : ret.arrow == '-' ? '-' : ret.arrow == "↑" ? '高于正常值' : '低于正常值');
													this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
												} else if (!ret.flag) {
													this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "正常");
													this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
												}
											}
										}
									}
								})
							}
						}
					}, {
						title: '参考值',
						align: 'center',
						tooltip: true,
						minWidth: 120,
						ellipsis: true,
						render: (h, params) => {
							let scope = params.row.departItemResults.scope;
							if (scope && scope != "-") {
								return h("div", scope);
							} else {
								let val = "";
								//规则参考值
								let reference = params.row.relationProjectReference;
								if (!reference) {
									this.$set(this.baseProjectData[params.index].departItemResults, 'scope', "-");
									return h("div", "-");
								}
								val = reference.occupationValue;
								if (!val) {
									val = "-";
								}
								this.$set(this.baseProjectData[params.index].departItemResults, 'scope', val);
								return h("div", val);
							}
						}
					}, {
						title: '提示',
						align: 'center',
						tooltip: true,
						ellipsis: true,
						minWidth: 100,
						key: "arrow",
						render: (h, params) => {
							let arrow = params.row.departItemResults.arrow;
							if (arrow == undefined || arrow == null) {
								arrow = "-";
								this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', arrow);
							}
							return h("span", arrow);
						}
					}/*, {
						title: '危急程度',
						align: 'center',
						minWidth: 90,
						tooltip: true,
						ellipsis: true,
						key: "crisisDegree",
						render: (h, params) => {
							let crisis = params.row.departItemResults.crisisDegree;
							let positive = "0";
							if (crisis && (crisis.indexOf("异常") > -1 || crisis.indexOf("低于") > -1 || crisis.indexOf("高于") > -1)) {
								positive = "1";
								this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
							} else {
								this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
							}
							if (crisis) {
								return h("span", crisis);
							} else {
								this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "-");
								return h("span", "-");
							}
						}
					}*/, {
                        title: this.$hospitalName.updateTableAbnormalFieldName || "阳性",
						align: 'center',
						minWidth: 60,
						tooltip: true,
						ellipsis: true,
						key: "positive",
						render: (h, params) => {
							let crisis = params.row.departItemResults.crisisDegree;
							let positive = "0";
							if (crisis && (crisis.indexOf("异常") > -1 || crisis.indexOf("低于") > -1 || crisis.indexOf("高于") > -1)) {
								positive = "1";
								this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
							} else {
								this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
							}
							if (true) {//勾选框
								return h("span", [
									h("Checkbox", {
										attrs: {
											value: positive == "1" ? true : false,
										},
										on: {
											"on-change": (event) => {
												if (event) {
													this.$set(this.baseProjectData[params.index].departItemResults, 'positive', "1");
												} else {
													this.$set(this.baseProjectData[params.index].departItemResults, 'positive', "0");
												}
											},
										},
									}),
									[h("span", "是")],
								]);
							}
						}
					}
				]
			},
			//模板查看(明细)
			handleViewTemplate() {
				this.previewShowMX = true;
				let tab = this.tabsArr.find(i => this.tabsValue == i.id);
				this.personInfo.pacsData = this.pacsData;
				this.personInfo.groupItems = tab;
				this.personInfo.baseProject = this.baseProjectData;
			},
			//获取异常项目
			getAbnormalInfo: function () {
				this.officeIdData = [];
				this.ProjectException = [];
				if (this.tableData && this.tableData.length > 0) {
					let abnormalData = this.tableData.filter(aa => aa.positive != '0');
					if (abnormalData != null && abnormalData.length > 0) {
						for (let i = 0; i < abnormalData.length; i++) {
							let item = abnormalData[i];
							this.officeIdData.push(abnormalData[i].officeId);
							this.ProjectException.push(abnormalData[i].groupItemId);
						}
					}

				}
				if (this.projectRow) {
					this.handleViewClickAnomaly(this.projectRow, 0);
				} else {
					this.getPersonOffice(this.personId);
				}
			},
			//设置结果
			setResult(data, result) {
				if (!data || data.length == 0) {
					return {flag: "-", arrow: '-'}
				}
				let age = this.personInfo.age;
				let sex = this.personInfo.sex;
				//性别年龄筛查
				data = data.filter(i => (i.allowSex == "" || i.allowSex == null || i.allowSex == sex || i.allowSex == '全部') && age >= i.minAge && age <= i.maxAge) || [];

				if (data == undefined || data.length == 0) {
					return {flag: "-", arrow: '-'}
				} else if (data.length == 1) {
					let d = data[0];
					if (d.type == 'EQ') {
						if (/^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue) && /^\d+$|^[0-9]+\.[0-9]+$/.test(result)) {
							if (parseFloat(result) == parseFloat(d.intervalValue)) {
								return {flag: true, arrow: "-", resp: '异常'};
							} else {
								return {flag: false, arrow: '-', resp: '正常'}
							}
						} else if (!/^\d+$|^[0-9]+\.[0-9]+$/.test(result) && !/^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue)) {
							if (result == d.intervalValue) {
								return {flag: true, arrow: "-", resp: '异常'};
							} else {
								return {flag: false, arrow: '-', resp: '正常'}
							}
						} else {
							return {flag: '-', arrow: '-', resp: '-'}
						}
					} else if (d.type == 'LIKE') {
						if (d.intervalValue.indexOf(result) > -1) {
							return {flag: true, arrow: "-"};
						} else {
							return {flag: false, arrow: '-'}
						}
					} else if (d.type == 'GT') {
						if (parseFloat(result) > parseFloat(d.intervalValue)) {
							return {flag: true, arrow: "↑"};
						} else {
							return {flag: false, arrow: '-'}
						}
					} else if (d.type == 'LT') {
						if (parseFloat(result) < parseFloat(d.intervalValue)) {
							return {flag: true, arrow: "↓"};
						} else {
							return {flag: false, arrow: '-'}
						}
					} else if (d.type == 'GTE') {
						if (parseFloat(result) >= parseFloat(d.intervalValue)) {
							return {flag: true, arrow: "↑"};
						} else {
							return {flag: false, arrow: '-'}
						}
					} else if (d.type == 'LTE') {
						if (parseFloat(result) <= parseFloat(d.intervalValue)) {
							return {flag: true, arrow: "↓"};
						} else {
							return {flag: false, arrow: '-'}
						}
					} else if (d.type == 'NLIKE') {
						if (d.intervalValue.indexOf(result) == -1) {
							return {flag: true, arrow: "-"};
						} else {
							return {flag: false, arrow: '-'}
						}
					} else if (d.type == 'NEQ') {
						if (/^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue) && /^\d+$|^[0-9]+\.[0-9]+$/.test(result)) {
							if (parseFloat(result) == parseFloat(d.intervalValue)) {
								return {flag: false, arrow: "-", resp: '正常'};
							} else {
								return {flag: true, arrow: '-', resp: '异常'}
							}
						} else if (!/^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue) && !/^\d+$|^[0-9]+\.[0-9]+$/.test(result)) {
							if (result == d.intervalValue) {
								return {flag: false, arrow: "-", resp: '正常'};
							} else {
								return {flag: true, arrow: '-', resp: '异常'}
							}
						} else if ((!/^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue) && /^\d+$|^[0-9]+\.[0-9]+$/.test(result)) || (/^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue) && !/^\d+$|^[0-9]+\.[0-9]+$/.test(result))) {
							if (result == d.intervalValue) {
								return {flag: false, arrow: "-", resp: '正常'};
							} else {
								return {flag: true, arrow: '-', resp: '异常'}
							}
						} else {
							return {flag: '-', arrow: '-', resp: '-'}
						}
					}
				} else if (data.length == 2) {
					let gte, lte, gt, lt;
					gte = data.find(i => i.type == 'GTE');
					lte = data.find(i => i.type == 'LTE');
					gt = data.find(i => i.type == 'GT');
					lt = data.find(i => i.type == 'LT');

					let dataNEQ = data.filter(i => i.type == 'NEQ');

					if (dataNEQ && dataNEQ.length>0) {
						if(dataNEQ.length==2){
							let d0 = dataNEQ[0];
							let d1 = dataNEQ[1];
							if ((/^\d+$|^[0-9]+\.[0-9]+$/.test(d0.intervalValue) && /^\d+$|^[0-9]+\.[0-9]+$/.test(d1.intervalValue)) && /^\d+$|^[0-9]+\.[0-9]+$/.test(result)) {
								if (parseFloat(result) == parseFloat(d0.intervalValue) || parseFloat(result) == parseFloat(d1.intervalValue)) {
									return {flag: false, arrow: "-", resp: '正常'};
								} else {
									return {flag: true, arrow: '-', resp: '异常'}
								}
							} else if ((!/^\d+$|^[0-9]+\.[0-9]+$/.test(d0.intervalValue) && !/^\d+$|^[0-9]+\.[0-9]+$/.test(d1.intervalValue)) && !/^\d+$|^[0-9]+\.[0-9]+$/.test(result)) {
								if (result == d0.intervalValue || result == d1.intervalValue) {
									return {flag: false, arrow: "-", resp: '正常'};
								} else {
									return {flag: true, arrow: '-', resp: '异常'}
								}
							} else {
								return {flag: '-', arrow: '-', resp: '-'}
							}
						}

					}

					if (gte == undefined) {
						if (lte == undefined) {//取lt和gt
							if(gt&&lt){//wmg 判断有无值
								gt = gt.intervalValue;
								lt = lt.intervalValue;
								if (parseFloat(result) >= parseFloat(lt) && parseFloat(result) <= parseFloat(gt)) {
									return {flag: false, arrow: '-'};
								} else if (parseFloat(result) < parseFloat(lt)) {
									return {flag: true, arrow: '↓'};
								} else if (parseFloat(result) > parseFloat(gt)) {
									return {flag: true, arrow: '↑'};
								} else {
									return {flag: false, arrow: '-'};
								}
							}
						} else {//lte和gt
							if(gt&&lt){//wmg 判断有无值
								gt = gt.intervalValue;
								lte = lte.intervalValue;
								if (parseFloat(result) > parseFloat(lte) && parseFloat(result) <= parseFloat(gt)) {
									return {flag: false, arrow: '-'};
								} else if (parseFloat(result) <= parseFloat(lte)) {
									return {flag: true, arrow: '↓'};
								} else if (parseFloat(result) > parseFloat(gt)) {
									return {flag: true, arrow: '↑'};
								}
							}
						}
					} else {
						if (lte == undefined) {//取lt和gt
							gte = gte.intervalValue;
							lt = lt.intervalValue;
							if (parseFloat(result) >= parseFloat(lt) && parseFloat(result) < parseFloat(gte)) {
								return {flag: false, arrow: '-'};
							} else if (parseFloat(result) < parseFloat(lt)) {
								return {flag: true, arrow: '↓'};
							} else if (parseFloat(result) >= parseFloat(gte)) {
								return {flag: true, arrow: '↑'};
							}
						} else {//lte和gt
							gte = gte.intervalValue;
							lte = lte.intervalValue;
							if (parseFloat(result) > parseFloat(lte) && parseFloat(result) < parseFloat(gte)) {
								return {flag: false, arrow: '-'};
							} else if (parseFloat(result) <= parseFloat(lte)) {
								return {flag: true, arrow: '↓'};
							} else if (parseFloat(result) >= parseFloat(gte)) {
								return {flag: true, arrow: '↑'};
							}
						}
					}
				} else {
					let dataNEQ = data.filter(i => i.type == 'NEQ');

					if (dataNEQ && dataNEQ.length>0) {
						if(dataNEQ.length==3){
							let d0 = dataNEQ[0];
							let d1 = dataNEQ[1];
							let d2 = dataNEQ[2];
							if ((/^\d+$|^[0-9]+\.[0-9]+$/.test(d0.intervalValue) && /^\d+$|^[0-9]+\.[0-9]+$/.test(d1.intervalValue) && /^\d+$|^[0-9]+\.[0-9]+$/.test(d2.intervalValue)) && /^\d+$|^[0-9]+\.[0-9]+$/.test(result)) {
								if (parseFloat(result) == parseFloat(d0.intervalValue) || parseFloat(result) == parseFloat(d1.intervalValue) || parseFloat(result) == parseFloat(d2.intervalValue)) {
									return {flag: false, arrow: "-", resp: '正常'};
								} else {
									return {flag: true, arrow: '-', resp: '异常'}
								}
							} else if ((!/^\d+$|^[0-9]+\.[0-9]+$/.test(d0.intervalValue) && !/^\d+$|^[0-9]+\.[0-9]+$/.test(d1.intervalValue) && !/^\d+$|^[0-9]+\.[0-9]+$/.test(d2.intervalValue)) && !/^\d+$|^[0-9]+\.[0-9]+$/.test(result)) {
								if (result == d0.intervalValue || result == d1.intervalValue || result == d2.intervalValue) {
									return {flag: false, arrow: "-", resp: '正常'};
								} else {
									return {flag: true, arrow: '-', resp: '异常'}
								}
							} else {
								return {flag: '-', arrow: '-', resp: '-'}
							}
						}

					}
				}
			},
		},
		mounted() {
		},

		watch: {
			value(val) {
				this.modalVisible = val;
			},
			modalVisible(val) {
				if (val) {
					this.getAbnormalInfo();


				} else {
					this.closeModal(val);
				}
			}
		},
	}
</script>

<style lang="less">
    .projectDetailsClass {

        .ivu-card-body {
            .selectTree {
                color: #0078d74d !important;
            }
        }

        .ivu-col {
            user-select: none !important;
        }

        .el-tabs--border-card {
            user-select: none !important;
        }
        .ivu-modal {
            width: 80% !important;
        }
    }
</style>