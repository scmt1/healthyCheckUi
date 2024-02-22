<template>
    <div class="previewPrint">
        <iframe :id="previewId" :src="previewHtmlUrl" frameborder="0" style="width: 100%; height: 100%"></iframe>
        <!--    <pdf :ref="previewId" :id="previewId" v-for="i in numPages" :key="i" :src="previewHtmlUrl" :page="i"></pdf>-->
        <!--    <div class="footer">-->
        <!--      <Button type="primary" :loading="loading" @click="print()">打印</Button>-->
        <!--      <Button type="primary" :loading="loading" @click="downloadTemplate()">下载</Button>-->
        <!--    </div>-->
    </div>

</template>
<script>
	import {getTemplatePreviewData, exportTemplate} from '@/api/healthy/tTemplate'
	import {formartDate} from "@/api/tools/tool";
    import templateJs from "../reportReview/templateJs/templateJs";

	import pdf from 'vue-pdf'

	export default {
		name: "previewPrint",
		components: {
			pdf
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			previewId: {
				type: String,
			},
			tTemplateId: {
				type: String,
				default: ""
			},
			tTemplateType: {
				type: String,
				default: ""
			},
			baseProjectId: {
				type: String,
				default: ""
			},
			departResultId: {
				type: String,
				default: ""
			},
			groupItemId: {
				type: String,
				default: ""
			},
			personId: {
				type: String,
				default: ""
			},
			checkSign: {
				type: String,
				default: ""
			},
			data: {
				type: Object
			},
			personInfo: {
				type: Object
			},
			groupItemData: {
				type: Array,
				default: () => []
			},
			departItemResults: {
				type: Array,
				default: () => []
			},

			healthCheckup: {
				type: Array,
				default: () => []
			},
			name: {
				type: String,
				default: ""
			},
            isShow: {
				type: Boolean,
				default: true
			},
			opinion: {
				type: String,
				default: ""
			},
			inspectResult: {
				type: String,
				default: ""
			},
		},
		data() {
			return {
				modalVisible: this.value,
				previewHtml: "",//预览显示
				previewHtmlUrl: "",
				numPages: null, // pdf 总页数
				loading: false,
				printName: '转图片打印',
				templateData: {},//模板数据
				personData: {},
				orderGroupData: [],//人员的 订单分组数据
				previewData: null,//模板数据
				baseProjectIdNew: "",
			}
		},
		computed: {
			physicalType() {
				return this.$store.state.theme.theme.physicalType;
			},
		},
		methods: {
			init() {
				let _this = this;
				this.loading = true;
				this.previewHtmlUrl = "";
				_this.dataInit();

			},
			/**
			 * 替换模板
			 **/
			getTemplatePreviewData(data) {
				let _this = this;
				let previewData = {
					id: this.tTemplateId,
					baseProjectId: this.baseProjectIdNew,
					templateData: JSON.stringify(data)
				}
				this.previewData = previewData;
				// getTemplatePreviewData({
				// 	id: this.tTemplateId,
				// 	baseProjectId: this.baseProjectId,
				// 	templateData: JSON.stringify(data)
				// }).then(res => {
				// 	_this.loading = false;
				// 	if (res && res.success) {
				// 		_this.previewHtml = res.data;
				// 		let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + _this.previewHtml;
				// 		_this.previewHtmlUrl = url;
				// 		_this.previewHtml = url + '#toolbar=0';
				//
				// 	} else {
				// 		_this.loading = false;
				// 		_this.closeParentLoading();
				// 	}
				// }).catch(function (error) {
				// 	_this.closeParentLoading();
				// });
			},
			//模板数据初始化
			dataInit() {
                let previewData = templateJs.dataInit(this,this.tTemplateId,this.baseProjectId,this.tTemplateType,this.physicalType,this.personInfo,this.groupItemData,this.name,this.groupItemId,this.opinion,this.inspectResult,this.checkSign,this.departItemResults,this.healthCheckup,this.isShow)
                let templateData = JSON.parse(previewData.templateData);

                //送检医生
                if (this.$hospitalName){
                    if (this.$hospitalName.isDoctor){
                        templateData.doctor = this.$hospitalName.DoctorToBeExamined;
                    }else {
                        templateData.doctor = this.$hospitalName.legalPerson;
                    }
                }
                //医院单位信息(单位地址、邮政编码、联系电话、传真号码、电子邮箱)
                templateData.hospitalAddress = this.$hospitalName.hospitalAddress;
                templateData.zipCode = this.$hospitalName.zipCode;
                templateData.hospitalPhone = this.$hospitalName.hospitalPhone;
                templateData.faxNumber = this.$hospitalName.faxNumber;
                templateData.email = this.$hospitalName.email;
                //联系电话(DR、CT、B超)
                templateData.phone = this.$hospitalName.hospitalPhone;
                //模板名称
                templateData.templateName = this.$hospitalName.templateName;
                //医院全称
                templateData.hospitalName = this.$hospitalName.name;
                //报告医生
                if(this.$hospitalName.isUserConfigure) {//是否使用这个配置
                    templateData.reportDoctor = this.$hospitalName.reportDoctor;
                }
                //晶体环状图 base64
                let base64 = this.$hospitalName.base64;
                templateData.jthctImageL = base64[templateData.jthctNumL];
                templateData.jthctImageR = base64[templateData.jthctNumR];
                //标本替换
                let specimenDatas = this.$hospitalName.specimenDatas;
                let officeName = "";
                if(templateData.officeName){
                    officeName = templateData.officeName;
                }
                let name = this.name;
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
                templateData.projectNamePath = this.name;
                //模板替换
                let baseProjectId = previewData.baseProjectId;
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

                previewData.baseProjectId = baseProjectId;
                previewData.templateData = JSON.stringify(templateData);
                this.previewData = previewData;
                /*this.templateData = {};
				if (this.tTemplateType && this.tTemplateType.trim().length > 0) {
					switch (this.tTemplateType) {
						case "分项报告": {
							this.itemDataInit();
							break;
						}
						case "总检": {
							this.inspectionDataInit();
							break;
						}
						case "检查结果及处理意见": {
							this.inspectionDataInit();
							break;
						}
						case "个人基本资料": {
							this.personDataInit();
							break;
						}
						case "问诊科检查表": {
							this.inquiryDataInit();
							break;
						}
						case "眼科检查": {
							this.eyeDataInit();
							break;
						}
						case "妇科检查": {
							this.fkDataInit();
							break;
						}
						case "体格检查": {
							this.healthCheckupDataInit();
							break;
						}
						case "分项汇总": {
							this.tgfxDataInit();
							break;
						}
						default: {
							let templateData = {};
							let _this = this;
							let unitData = {};
							templateData.name = "-";//姓名
							templateData.testNum = "-";//体检编号

							if (this.personInfo) {
								if (this.personInfo.person_name) {
									templateData.name = this.personInfo.person_name;//姓名
								}
								if (this.personInfo.test_num) {
									templateData.testNum = this.personInfo.test_num;//体检编号
								}

								if (this.tTemplateType == "首页封面") {
									templateData.sex = "-";//性别
									templateData.age = "-";//年龄
									templateData.unitName = "-";//单位名称
									templateData.unitPhone = "-";//单位电话
									templateData.workStateText = "-";//在岗状态
									templateData.factors = "-";//职业危害因素
									templateData.physicalType = "-";//体检类型
									templateData.createTime = "-";
									if (this.personInfo.regist_date) {
										templateData.createTime = formartDate(this.personInfo.regist_date, 'yyyy-MM-dd');//检查日期(登记时间)
									}
									if (this.personInfo.sex) {
										templateData.sex = this.personInfo.sex;//性别
									}
									if (this.personInfo.age) {
										templateData.age = this.personInfo.age;//年龄
									}
									if (this.personInfo.work_state_text) {
										templateData.workStateText = this.personInfo.work_state_text;//在岗状态
									}
									if (_this.physicalType == "职业体检") {
										if (_this.orderGroupData && _this.orderGroupData.eiaFactors) {
											templateData.factors = _this.orderGroupData.eiaFactors;//职业危害因素
										}else if (_this.personInfo.hazard_factors_text) {
                                            templateData.factors = _this.personInfo.hazard_factors_text;//监护危害(危害因素名称)
                                        }
									} else {
										if (_this.personInfo.hazard_factors_text) {
											templateData.factors = _this.personInfo.hazard_factors_text;//监护危害(危害因素名称)
										}
									}
									if (this.personInfo.physical_type) {
										templateData.physicalType = this.personInfo.physical_type;//体检类型
									}
									if (_this.personInfo.testNumCode) {
										templateData.barCodeImg = _this.personInfo.testNumCode;
									}
									//单位
									templateData.unitName = _this.personInfo.unit_name;//单位名称
									templateData.unitPhone = _this.personInfo.unit_phone;//单位电话
									_this.getTemplatePreviewData(templateData);

									// 	}
									// });
								} else {
									_this.getTemplatePreviewData(templateData);
								}
							}
							break;
						}
					}
				}*/
			},
			/**
			 * 分项报告
			 **/
			itemDataInit() {
				let _this = this;
				let templateData = {}
				let oldTime = (new Date()).getTime();
				let time1 = formartDate(oldTime, "yyyy年MM月dd日");
				templateData.date = time1;
				templateData.name = '王伟';
                templateData.phone = '0831-3782999';//医院-联系电话
				/*其他信息*/
				templateData.specimen = '血清';//标本
				templateData.reportNum = '01';//报告编号、标本编号
				let sealImg = '';
				templateData.sealImg = sealImg;//检查单位盖章
				/*体检人信息*/
				if (_this.personInfo) {
					templateData.name = _this.personInfo.person_name;//姓名
					templateData.testNum = _this.personInfo.test_num;//体检编号(等同 条码编号、检查号)
                    templateData.reportNum = _this.personInfo.test_num;
                    templateData.unitName = _this.personInfo.unit_name;//单位名称
					templateData.sex = _this.personInfo.sex;//性别
					templateData.age = _this.personInfo.age;//年龄
				} else {
					_this.$message.error("参数有误：人员Id为空，请联系管理员！！");
					_this.closeParentLoading();
					return
				}

				let groupItemData = _this.groupItemData;

				if (this.name == "血常规") {

					let groupItemRusts = groupItemData.filter(ii => ii.groupItemName == this.name);
					if (groupItemRusts && groupItemRusts.length > 0) {
						//组合项目图像获取
						templateData.imgList = [];
						let url = "";
						if (groupItemRusts[0].url) {
							url = groupItemRusts[0].url;
							if (url.indexOf(",") > -1) {
								let urlSplit = url.split(",")
								for (let i = 0; i < urlSplit.length; i++) {
									templateData.imgList.push({img: urlSplit[i]});
								}
							} else {
								templateData.imgList.push({img: url});
							}
						} else {
							templateData.imgList.push({img: "base64"});
						}
					}
				}
				if (_this.name.indexOf("(复)") > 0) {
					//是复检一定会查出来
					let review = _this.personInfo.reviewProjectsList.filter(ii => ii.id == _this.groupItemId)
					if (review && review.length > 0) {
						_this.baseProjectIdNew = review[0].portfolioProjectId;
					}
				}
				templateData.opinion = _this.opinion;//临床诊断
				templateData.inspectResult = _this.inspectResult;//影像所见(诊断提醒)
				templateData.autograph = _this.checkSign;//医生签名

				//查询分检项目检查结果
				let departItemResultArr = _this.departItemResults.filter(ii => ii.groupItemId == _this.groupItemId);
				if (departItemResultArr && departItemResultArr.length == 0) {
					departItemResultArr = _this.departItemResults.filter(ii => ii.orderGroupItemId == _this.groupItemId);
				}

				if (departItemResultArr && departItemResultArr.length > 0) {
					let tableMonitoring = [];
					let index = 0;

                    let resultInfo = departItemResultArr[0];
                    templateData.sectionOffice = resultInfo.officeName;
                    templateData.officeName = resultInfo.officeName;//科室名
                    templateData.inspectDoctor = resultInfo.checkDoc;//检验医生
                    // templateData.doctor = resultInfo.checkDoc;//申请医生
                    templateData.doctor = "王彬";//申请医生
                    templateData.reportDoctor = resultInfo.checkDoc;//报告医生
                    templateData.inspectTime = resultInfo.checkDate ? formartDate(resultInfo.checkDate, "yyyy-MM-dd HH:mm:ss") : formartDate(oldTime, "yyyy-MM-dd HH:mm:ss");//检查时间
                    templateData.inspectDate = resultInfo.checkDate ? formartDate(resultInfo.checkDate, "yyyy-MM-dd") : formartDate(oldTime, "yyyy-MM-dd");//检查日期
                    templateData.createTime = _this.personInfo.regist_date ? formartDate(_this.personInfo.regist_date, "yyyy-MM-dd HH:mm:ss") : formartDate(oldTime, "yyyy-MM-dd HH:mm:ss");//送检时间(登记时间)
                    templateData.createDate = _this.personInfo.regist_date ? formartDate(_this.personInfo.regist_date, "yyyy-MM-dd") : formartDate(oldTime, "yyyy-MM-dd");//送检日期(登记时间)
                    templateData.printDate = formartDate(oldTime, "yyyy-MM-dd");//打印日期

					if (_this.name && _this.name.indexOf("肺功能") > -1) {
						_this.fgnDataInit(templateData, departItemResultArr)
					} else if (_this.name && _this.name.indexOf("纯音") > -1) {
						templateData = _this.pureTone(departItemResultArr, templateData);
					} else if (_this.name && _this.name.indexOf("心电图") > -1) {
						templateData = _this.ecgImageData(departItemResultArr, templateData);
					}else if (_this.name && _this.name.indexOf("口腔常规检查") > -1) {
                        templateData = _this.kqcgImageData(departItemResultArr, templateData);
                    } else {
						departItemResultArr.forEach(i => {
							if (i == null) {
								i = {};
								i.personId = this.personInfo.id;
								i.orderGroupItemProjectName = i.name;
								i.orderGroupItemProjectId = i.id;
							} else {
								//单个基础项
								tableMonitoring.push({
									monitorName: i.orderGroupItemProjectName,
									value: i.result,
									referenceRange: i.scope,
									unit: i.unitName,
									arrow: i.arrow,
									resultTips: i.crisisDegree
								});

							}
							index++;
						});
					}
					templateData.tableMonitoring = tableMonitoring;
					_this.getTemplatePreviewData(templateData);
				} else {
					_this.$Message.error("匹配 " + _this.name + " 的结果失败！！");
					_this.closeParentLoading();
				}

			},
			/**
			 * 肺功能
			 **/
			fgnDataInit(tableMonitoring, data) {
				let vitalCapacity1 = [];
				let vitalCapacity2 = [];
				let vitalCapacity3 = [];
                /*let vitalCapacityShort1=["FVC","FEVhalf","FEVone","FEVthree","FEV1G","FEV3G","Vext","MMF","EXTime","PEF","MEF75","MEF50","MEF25","FIVC","FIVhalf","FIVone","FIV1FIVC","FIV1FVC","PIF","MIF50"];
                let vitalCapacityShort2=["VC","TV","IRV","ERV","IC","MV"];
                let vitalCapacityShort3=["MVV","MVVRR","MVVTV"];*/
                let vitalCapacityShort1=["M/B1","MVV/BSA","V75","V50/25","V50","V25/H","V25","PEF","MVV1","MMF","FVC%","FVC","FEV3%","FEV3","FEV2%","FEV2","FEV1","FEV1%","%FEVone"];
                let vitalCapacityShort2=["VC","TV","IRV","ERV","IC","MV","RR"];
                let vitalCapacityShort3=["MVV","BSA","BSA1"];
				vitalCapacityShort1.forEach(i => {
					let items = data.filter(o => o.shortName == i);
					if (items && items.length > 0) {
                        if(items[0].orderGroupItemProjectName.indexOf("用力呼气肺活量") > -1){
                            tableMonitoring.exVCty = items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0;
                            tableMonitoring.exVCtyYJ = items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0;
                            tableMonitoring.exVCtyBFB = (items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && items[0].scope && items[0].scope.toString().trim() != 0 && items[0].scope.toString().trim() != "-") ? (((items[0].result.toString().trim()/items[0].scope.toString().trim()).toFixed(2))*100).toFixed(0) : 0;
                        }else if(items[0].orderGroupItemProjectName.indexOf("一秒用力呼气容量") > -1){
                            tableMonitoring.exHFnd = items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0;
                            tableMonitoring.exHFndYJ = items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0;
                            tableMonitoring.exHFndBFB = (items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && items[0].scope && items[0].scope.toString().trim() != 0 && items[0].scope.toString().trim() != "-") ? (((items[0].result.toString().trim()/items[0].scope.toString().trim()).toFixed(2))*100).toFixed(0) : 0;
                        }else if(items[0].orderGroupItemProjectName.indexOf("一秒率") > -1 || items[0].orderGroupItemProjectName.indexOf("1秒率") > -1){
                            tableMonitoring.oSRtey = items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0;
                            tableMonitoring.oSRteyYJ = items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0;
                            tableMonitoring.oSRteyBFB = (items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && items[0].scope && items[0].scope.toString().trim() != 0 && items[0].scope.toString().trim() != "-") ? (((items[0].result.toString().trim()/items[0].scope.toString().trim()).toFixed(2))*100).toFixed(0) : 0;
                        }
						vitalCapacity1.push({
							monitorName: items[0].orderGroupItemProjectName,
							value: items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0,
							referenceRange: items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0,
							// resultTips: items[0].arrow && items[0].arrow.toString().trim().length > 0 && items[0].arrow.toString().trim() != "-" ? items[0].arrow.toString().trim() : 0,
                            resultTips:(items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && items[0].scope && items[0].scope.toString().trim() != 0 && items[0].scope.toString().trim() != "-") ? (((items[0].result.toString().trim()/items[0].scope.toString().trim()).toFixed(2))*100).toFixed(0) : 0,
                            unit: items[0].unitName,
						});
					} else {
						if (items && items.length > 0) {
							vitalCapacity1.push({
								monitorName: i,
								value: "-",
								resultTips: '-',
								referenceRange: "-",
								unit: "-"
							});
						}
					}
				});
				vitalCapacityShort2.forEach(i => {
					let items = data.filter(o => o.shortName == i);
					if (items && items.length > 0) {
						vitalCapacity2.push({
							monitorName: items[0].orderGroupItemProjectName,
							value: items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0,
							referenceRange: items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0,
							// resultTips: items[0].arrow && items[0].arrow.toString().trim().length > 0 && items[0].arrow.toString().trim() != "-" ? items[0].arrow.toString().trim() : 0,
                            resultTips:(items[0].result && items[0].result.toString().trim() != 0 && items[0].result.toString().trim() != "-" && items[0].scope && items[0].scope.toString().trim() != 0 && items[0].scope.toString().trim() != "-") ? (((items[0].result.toString().trim()/items[0].scope.toString().trim()).toFixed(2))*100).toFixed(0) : 0,
                            unit: items[0].unitName,
						});
					} else {
						if (items && items.length > 0) {
							vitalCapacity2.push({
								monitorName: i,
								value: "-",
								resultTips: '-',
								referenceRange: "-",
								unit: "-"
							});
						}
					}
				});
				vitalCapacityShort3.forEach(i => {
					let items = data.filter(o => o.shortName == i);
					if (items && items.length > 0) {
						vitalCapacity3.push({
							monitorName: items[0].orderGroupItemProjectName,
							value: items[0].result && items[0].result.toString().trim().length > 0 && items[0].result.toString().trim() != "-" ? items[0].result.toString().trim() : 0,
							referenceRange: items[0].scope && items[0].scope.toString().trim().length > 0 && items[0].scope.toString().trim() != "-" ? items[0].scope.toString().trim() : 0,
							resultTips: items[0].arrow && items[0].arrow.toString().trim().length > 0 && items[0].arrow.toString().trim() != "-" ? items[0].arrow.toString().trim() : 0,
							unit: items[0].unitName,
						});
					} else {
						if (items && items.length > 0) {
							vitalCapacity3.push({
								monitorName: i,
								value: "-",
								resultTips: '-',
								referenceRange: "-",
								unit: "-"
							});
						}
					}
				});

				tableMonitoring.vitalCapacity1 = vitalCapacity1;
				tableMonitoring.vitalCapacity2 = vitalCapacity2;
				tableMonitoring.vitalCapacity3 = vitalCapacity3;

			},
			/**
			 * 眼科检查
			 **/
			eyeDataInit() {
				let _this = this;
				let templateData = {};
				let oldTime = (new Date()).getTime();
				let time1 = formartDate(oldTime, "yyyy-MM-dd");
				let sealImg = '';
				templateData.sealImg = sealImg;//检查单位盖章
				templateData.autograph = _this.checkSign;//医生签名
				//眼科常规
				templateData.colorVisionRight = "-";
				templateData.colorVisionLeft = "-";
				templateData.darkAdaptationRight = "-";
				templateData.darkAdaptationLeft = "-";
				templateData.suitableFieldRight = "-";
				templateData.suitableFieldLeft = "-";
				templateData.nakedEyeRight = "-";
				templateData.nakedEyeLeft = "-";
				templateData.correctRight = "-";
				templateData.correctLeft = "-";
				templateData.conjunctivaRight = "-";
				templateData.conjunctivaLeft = "-";
				templateData.cornealRight = "-";
				templateData.cornealLeft = "-";
				templateData.anteriorChamberRight = "-";
				templateData.anteriorChamberLeft = "-";
				templateData.irisRight = "-";
				templateData.irisLeft = "-";
				templateData.lensRight = "-";
				templateData.lensLeft = "-";
				templateData.fundusRight = "-";
				templateData.fundusLeft = "-";
				templateData.ophthalmologyOthers = "-";//眼科其他
				templateData.remarks = "";//备注

                let groupItemData = _this.groupItemData;

                if (this.name.indexOf("眼科") > -1) {

                    let groupItemRusts = groupItemData.filter(ii => ii.groupItemName == this.name);
                    if (groupItemRusts && groupItemRusts.length > 0) {
                        //组合项目图像获取
                        templateData.imgList = [];
                        let url = "";
                        if (groupItemRusts[0].url) {
                            url = groupItemRusts[0].url;
                            if (url.indexOf(",") > -1) {
                                let urlSplit = url.split(",")
                                for (let i = 0; i < urlSplit.length; i++) {
                                    templateData.imgList.push({img: urlSplit[i]});
                                }
                            } else {
                                templateData.imgList.push({img: url});
                            }
                        } else {
                            templateData.imgList.push({img: "base64"});
                        }
                    }
                }

				if (_this.healthCheckup && _this.healthCheckup.length > 0) {
					let j = 0;
					_this.healthCheckup.forEach(ii => {
						//查询分检项目检查结果
						let departItemResultArr = _this.departItemResults.filter(ii => ii.groupItemId == ii.groupItemId);
						if (departItemResultArr && departItemResultArr.length > 0) {
							let groupItemsName = ii.name;
							let data = departItemResultArr;

							if (groupItemsName.indexOf("眼科") > -1) {
								templateData = _this.ophthalmicRoutine(data, templateData);
								templateData.autograph = ii.checkSign;
							}
						} else {
							_this.$message.error("眼科检查数据匹配失败，请联系管理员！！");
							_this.closeParentLoading();
						}
						j++;

					});
					_this.loading = false;
					_this.getTemplatePreviewData(templateData);
				} else {
					_this.loading = false;
					_this.getTemplatePreviewData(templateData);
				}


			},
			/**
			 * 妇科检查
			 **/
			fkDataInit() {
				let _this = this;
				let templateData = {};
				let oldTime = (new Date()).getTime();
				let time1 = formartDate(oldTime, "yyyy-MM-dd");
				let sealImg = '';
				templateData.sealImg = sealImg;//检查单位盖章
				templateData.autograph = _this.checkSign;//医生签名
				//妇科检查项
				templateData.vulva = "-";
				templateData.vagina = "-";
				templateData.cervix = "-";
				templateData.uterineBody = "-";
				templateData.enclosure = "-";
				if (_this.healthCheckup && _this.healthCheckup.length > 0) {
					let j = 0;
					_this.healthCheckup.forEach(ii => {
						//查询分检项目检查结果
						let departItemResultArr = _this.departItemResults.filter(ii => ii.groupItemId == ii.groupItemId);
						if (departItemResultArr && departItemResultArr.length > 0) {
							let groupItemsName = ii.name;
							let data = departItemResultArr;
							if (groupItemsName.indexOf("妇科") > -1 || groupItemsName.indexOf("常规妇检") > -1) {
								templateData = _this.gynaecology(data, templateData);
								templateData.autograph = ii.checkSign;
							}
						} else {
							_this.$message.error("眼科数据匹配失败，请联系管理员！！");
							_this.closeParentLoading();
						}
						j++;
					});
					_this.loading = false;
					_this.getTemplatePreviewData(templateData);
				} else {
					_this.loading = false;
					_this.getTemplatePreviewData(templateData);
				}


			},
			/**
			 * 体格检查
			 **/
			healthCheckupDataInit() {
				let _this = this;
				let templateData = {};
				let oldTime = (new Date()).getTime();
				let time1 = formartDate(oldTime, "yyyy-MM-dd");
				let sealImg = '';
				templateData.sealImg = sealImg;//检查单位盖章
				templateData.autograph = _this.checkSign;//医生签名
				if (_this.healthCheckup && _this.healthCheckup.length > 0) {
					let j = 0;
					//一般检查(职业)
					templateData.nutrition = "-";
					templateData.height = "-";
					templateData.weight = "-";
					templateData.bloodPressure = "-";
					//耳鼻喉口腔常规（职业）
					templateData.externalEar = "-";
					templateData.middleEar = "-";
					templateData.leftHearing = "-";
					templateData.rightHearing = "-";
					templateData.nose = "-";
					templateData.mucosa = "-";
					templateData.tooth = "-";
					templateData.throat = "-";
					templateData.facialOthers = "-";
					//内科常规(职业)
					templateData.kidney = "-";
					templateData.lungs = "-";
					templateData.spleen = "-";
					templateData.liver = "-";
					templateData.rightHearing = "-";
					templateData.heartMoss = "-";
					templateData.heartRate = "-";
					templateData.otherInternal = "-";
					templateData.rhythm = "-";
					//外科检查(职业)
					templateData.thyroid = "-";
					templateData.lymphNode = "-";
					templateData.limbJoints = "-";
					templateData.surgicalOthers = "-";
					templateData.spine = "-";
					templateData.skinColor = "-";
					templateData.rash = "-";
					templateData.petechiae = "-";
					templateData.vegetations = "-";
					templateData.blister = "-";
					//神经系统
					templateData.senseOfPain = "-";
					templateData.positionPerception = "-";
					templateData.abdominalWallReflex = "-";
					templateData.kneeReflex = "-";
					templateData.achillestendonreflex = "-";
					templateData.muscleStrength = "-";
					templateData.muscleTension = "-";
					templateData.masonicMovement = "-";
					templateData.tripleTremor = "-";
					templateData.pathologicalReflex = "-";
					_this.healthCheckup.forEach(ii => {
						//查询分检项目检查结果
						let departItemResultArr = _this.departItemResults.filter(i => i.groupItemId == ii.groupItemId);
						if (departItemResultArr && departItemResultArr.length > 0) {
							let groupItemsName = ii.name;
							let data = departItemResultArr;

							if (j == 0) {
								templateData.sectionOffice = data[0].officeName;
								templateData.officeName = data[0].officeName;//科室名
								templateData.inspectDoctor = data[0].checkDoc;//检验医生
								templateData.inspectTime = data[0].checkDate ? data[0].checkDate.substring(0, 10) : time1;//检查时间
								templateData.createTime = data[0].createDate ? data[0].createDate.substring(0, 10) : time1;//送检时间(登记时间)
								let time1 = formartDate(oldTime, "yyyy年MM月dd日");
							}
							if (groupItemsName.indexOf("一般检查") > -1 || groupItemsName.indexOf("血压") > -1) {
								templateData = this.generalInspection(data, templateData);
								// templateData.ybAutograph = ii.checkSign;
								templateData.sjAutograph = ii.checkSign;

							} else if (groupItemsName.indexOf("耳鼻喉口腔常规") > -1 || groupItemsName.indexOf("耳科") > -1) {
								templateData = this.otolaryngologyInspection(data, templateData);
								templateData.ebhkAutograph = ii.checkSign;
							} else if (groupItemsName.indexOf("内科常规") > -1) {
								templateData = this.internalMedicine(data, templateData);
								templateData.sjAutograph = ii.checkSign;
							} else if (groupItemsName.indexOf("外科检查") > -1 || groupItemsName.indexOf("外科常规") > -1 || groupItemsName.indexOf("皮肤科常规") > -1) {
								templateData = this.surgicalRoutine(data, templateData);
								templateData.nAutograph = ii.checkSign;
							} else if (groupItemsName.indexOf("神经系统") > -1) {
								templateData = this.nervousSystem(data, templateData);
								templateData.sjAutograph = ii.checkSign;
							}
						} else {
							_this.$Message.error("匹配 " + _this.name + " 的结果失败！！");
							_this.closeParentLoading();
						}
						j++;
					});
					_this.loading = false;
					_this.getTemplatePreviewData(templateData);

				}


			},
			/**
			 * 分项汇总
			 **/
			tgfxDataInit() {
				let _this = this;
				let templateData = {};
				let oldTime = (new Date()).getTime();
				let time1 = formartDate(oldTime, "yyyy-MM-dd");
				let sealImg = '';
				templateData.sealImg = sealImg;//检查单位盖章
				templateData.autograph = _this.checkSign;//医生签名

				//一般检查(职业)
				templateData.nutrition = "-";
				templateData.height = "-";
				templateData.weight = "-";
				templateData.bloodPressure = "-";
				//耳鼻喉口腔常规（职业）
				templateData.externalEar = "-";
				templateData.middleEar = "-";
				templateData.leftHearing = "-";
				templateData.rightHearing = "-";
				templateData.nose = "-";
				templateData.mucosa = "-";
				templateData.tooth = "-";
				templateData.throat = "-";
				templateData.facialOthers = "-";
				//内科常规(职业)
				templateData.kidney = "-";
				templateData.lungs = "-";
				templateData.spleen = "-";
				templateData.liver = "-";
				templateData.rightHearing = "-";
				templateData.heartMoss = "-";
				templateData.heartRate = "-";
				templateData.otherInternal = "-";
				templateData.rhythm = "-";
				//外科检查(职业)
				templateData.thyroid = "-";
				templateData.lymphNode = "-";
				templateData.limbJoints = "-";
				templateData.surgicalOthers = "-";
				templateData.spine = "-";
				templateData.skinColor = "-";
				templateData.rash = "-";
				templateData.petechiae = "-";
				templateData.vegetations = "-";
				templateData.blister = "-";
				//神经系统
				templateData.senseOfPain = "-";
				templateData.positionPerception = "-";
				templateData.abdominalWallReflex = "-";
				templateData.kneeReflex = "-";
				templateData.achillestendonreflex = "-";
				templateData.muscleStrength = "-";
				templateData.muscleTension = "-";
				templateData.masonicMovement = "-";
				templateData.tripleTremor = "-";
				templateData.pathologicalReflex = "-";
				//眼科常规
				templateData.colorVisionRight = "-";
				templateData.colorVisionLeft = "-";
				templateData.darkAdaptationRight = "-";
				templateData.darkAdaptationLeft = "-";
				templateData.suitableFieldRight = "-";
				templateData.suitableFieldLeft = "-";
				templateData.nakedEyeRight = "-";
				templateData.nakedEyeLeft = "-";
				templateData.correctRight = "-";
				templateData.correctLeft = "-";
				templateData.conjunctivaRight = "-";
				templateData.conjunctivaLeft = "-";
				templateData.cornealRight = "-";
				templateData.cornealLeft = "-";
				templateData.anteriorChamberRight = "-";
				templateData.anteriorChamberLeft = "-";
				templateData.irisRight = "-";
				templateData.irisLeft = "-";
				templateData.lensRight = "-";
				templateData.lensLeft = "-";
				templateData.fundusRight = "-";
				templateData.fundusLeft = "-";
				templateData.ophthalmologyOthers = "-";//眼科其他
				templateData.remarks = "";//备注
                //妇科检查项
                templateData.vulva = "-";
                templateData.vagina = "-";
                templateData.cervix = "-";
                templateData.uterineBody = "-";
                templateData.enclosure = "-";
                //肺功能
                templateData.exVCty = "-";
                templateData.exVCtyYJ = "-";
                templateData.exVCtyBFB = "-";
                templateData.exHFnd = "-";
                templateData.exHFndYJ = "-";
                templateData.exHFndBFB = "-";
                templateData.oSRtey = "-";
                templateData.oSRteyYJ = "-";
                templateData.oSRteyBFB = "-";
				if (_this.healthCheckup && _this.healthCheckup.length > 0) {
					let j = 0;
                    _this.healthCheckup.forEach(ii => {
                        //查询分检项目检查结果
                        let departItemResultArr = _this.departItemResults.filter(i => i.groupItemId == ii.groupItemId);
                        if (departItemResultArr && departItemResultArr.length > 0) {
                            let groupItemsName = ii.name;
                            let data = departItemResultArr;

                            if (j == 0) {
                                templateData.sectionOffice = data[0].officeName;
                                templateData.officeName = data[0].officeName;//科室名
                                templateData.inspectDoctor = data[0].checkDoc;//检验医生
                                templateData.inspectTime = data[0].checkDate ? data[0].checkDate.substring(0, 10) : formartDate(oldTime, "yyyy-MM-dd HH:mm:ss");//检查时间
                                templateData.createTime = data[0].createDate ? data[0].createDate.substring(0, 10) : formartDate(oldTime, "yyyy-MM-dd HH:mm:ss");//送检时间(登记时间)
                                templateData.inspectDate = data[0].checkDate ? formartDate(data[0].checkDate, "yyyy-MM-dd") : formartDate(oldTime, "yyyy-MM-dd");//检查日期
                                templateData.createDate = data[0].createDate ? formartDate(data[0].createDate, "yyyy-MM-dd") : formartDate(oldTime, "yyyy-MM-dd");//送检日期(登记时间)
                            }
                            if (groupItemsName.indexOf("一般检查") > -1 || groupItemsName.indexOf("血压") > -1) {
                                // templateData = this.generalInspection(data, templateData);
                                let ssyValue = "";
                                let szyValue = "";
                                if(templateData.ybjcDatasTZ && templateData.ybjcDatasTZ.length > 0){
                                    let int = 0;
                                    data.forEach(i => {
                                        if (i == null) {
                                            i = {};
                                            i.personId = this.personInfo.id;
                                            i.orderGroupItemProjectName = i.name;
                                            i.orderGroupItemProjectId = i.id;
                                        } else {
                                            let unit = "";
                                            if(i.unitName && i.unitName.replaceAll(" ", "") != "-" && i.unitName.replaceAll(" ", "") != "无"){
                                                unit = i.unitName;
                                            }
                                            //获取 收缩压/舒张压
                                            if (i.orderGroupItemProjectName.indexOf("收缩压") > -1) {
                                                ssyValue = i.result;
                                                if(szyValue && szyValue != ""){
                                                    templateData.ybjcDatasTZ[0].dataRight.push({
                                                        monitorName: "血压",
                                                        value: ssyValue + "/" + szyValue,
                                                        referenceRange: i.scope,
                                                        unit: unit,
                                                        arrow: i.arrow,
                                                        resultTips: i.crisisDegree
                                                    });
                                                }
                                                return;
                                            }
                                            if (i.orderGroupItemProjectName.indexOf("舒张压") > -1) {
                                                szyValue = i.result;
                                                if(ssyValue && ssyValue != ""){
                                                    templateData.ybjcDatasTZ[0].dataRight.push({
                                                        monitorName: "血压",
                                                        value: ssyValue + "/" + szyValue,
                                                        referenceRange: i.scope,
                                                        unit: unit,
                                                        arrow: i.arrow,
                                                        resultTips: i.crisisDegree
                                                    });
                                                }
                                                return;
                                            }
                                            //单个基础项
                                            if(int%2 == 0){
                                                templateData.ybjcDatasTZ[0].dataLeft.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }else{
                                                templateData.ybjcDatasTZ[0].dataRight.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }
                                        }
                                        int ++;
                                    });
                                }else{
                                    let dataLeft = [];
                                    let dataRight = [];
                                    let int = 0;
                                    data.forEach(i => {
                                        if (i == null) {
                                            i = {};
                                            i.personId = this.personInfo.id;
                                            i.orderGroupItemProjectName = i.name;
                                            i.orderGroupItemProjectId = i.id;
                                        } else {
                                            let unit = "";
                                            if(i.unitName && i.unitName.replaceAll(" ", "") != "-" && i.unitName.replaceAll(" ", "") != "无"){
                                                unit = i.unitName;
                                            }
                                            //获取 收缩压/舒张压
                                            if (i.orderGroupItemProjectName.indexOf("收缩压") > -1) {
                                                ssyValue = i.result;
                                                if(szyValue && szyValue != ""){
                                                    dataRight.push({
                                                        monitorName: "血压",
                                                        value: ssyValue + "/" + szyValue,
                                                        referenceRange: i.scope,
                                                        unit: unit,
                                                        arrow: i.arrow,
                                                        resultTips: i.crisisDegree
                                                    });
                                                }
                                                return;
                                            }
                                            if (i.orderGroupItemProjectName.indexOf("舒张压") > -1) {
                                                szyValue = i.result;
                                                if(ssyValue && ssyValue != ""){
                                                    dataRight.push({
                                                        monitorName: "血压",
                                                        value: ssyValue + "/" + szyValue,
                                                        referenceRange: i.scope,
                                                        unit: unit,
                                                        arrow: i.arrow,
                                                        resultTips: i.crisisDegree
                                                    });
                                                }
                                                return;
                                            }
                                            //单个基础项
                                            if(int%2 == 0){
                                                dataLeft.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }else{
                                                dataRight.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }
                                        }
                                        int ++;
                                    });
                                    let ybjcDatasTZ = [];
                                    ybjcDatasTZ.push({
                                        dataLeft: dataLeft,
                                        dataRight: dataRight,
                                        ybjcOpinion: ii.opinion,
                                        ybjcAutograph: ii.checkSign,
                                        ybjcDate: templateData.inspectDate,
                                    });
                                    templateData.ybjcDatasTZ = ybjcDatasTZ;
                                }
                            }else if (groupItemsName.indexOf("妇科") > -1 || groupItemsName.indexOf("常规妇检") > -1) {
                                // templateData = _this.gynaecology(data, templateData);
                                let fkDatasTZ = [];
                                fkDatasTZ.push({
                                    fkOpinion: ii.opinion,
                                    fkAutograph: ii.checkSign,
                                    fkDate: templateData.inspectDate,
                                });
                                templateData.fkDatasTZ = fkDatasTZ;
                            } else if (groupItemsName.indexOf("耳鼻喉口腔常规") > -1 || groupItemsName.indexOf("耳科") > -1) {
                                // templateData = this.otolaryngologyInspection(data, templateData);
                                if(templateData.ekDatasTZ && templateData.ekDatasTZ.length > 0){
                                    let int = 0;
                                    data.forEach(i => {
                                        if (i == null) {
                                            i = {};
                                            i.personId = this.personInfo.id;
                                            i.orderGroupItemProjectName = i.name;
                                            i.orderGroupItemProjectId = i.id;
                                        } else {
                                            let unit = "";
                                            if(i.unitName && i.unitName.replaceAll(" ", "") != "-" && i.unitName.replaceAll(" ", "") != "无"){
                                                unit = i.unitName;
                                            }
                                            //单个基础项
                                            if(int%2 == 0){
                                                templateData.ekDatasTZ[0].dataLeft.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }else{
                                                templateData.ekDatasTZ[0].dataRight.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }
                                        }
                                        int ++;
                                    });
                                }else{
                                    let dataLeft = [];
                                    let dataRight = [];
                                    let int = 0;
                                    data.forEach(i => {
                                        if (i == null) {
                                            i = {};
                                            i.personId = this.personInfo.id;
                                            i.orderGroupItemProjectName = i.name;
                                            i.orderGroupItemProjectId = i.id;
                                        } else {
                                            let unit = "";
                                            if(i.unitName && i.unitName.replaceAll(" ", "") != "-" && i.unitName.replaceAll(" ", "") != "无"){
                                                unit = i.unitName;
                                            }
                                            //单个基础项
                                            if(int%2 == 0){
                                                dataLeft.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }else{
                                                dataRight.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }
                                        }
                                        int ++;
                                    });
                                    let ekDatasTZ = [];
                                    ekDatasTZ.push({
                                        dataLeft: dataLeft,
                                        dataRight: dataRight,
                                        ekOpinion: ii.opinion,
                                        ekAutograph: ii.checkSign,
                                        ekDate: templateData.inspectDate,
                                    });
                                    templateData.ekDatasTZ = ekDatasTZ;
                                }
                            } else if (groupItemsName.indexOf("内科常规") > -1) {
                                // templateData = this.internalMedicine(data, templateData);
                                let dataLeft = [];
                                let dataRight = [];
                                let int = 0;
                                data.forEach(i => {
                                    if (i == null) {
                                        i = {};
                                        i.personId = this.personInfo.id;
                                        i.orderGroupItemProjectName = i.name;
                                        i.orderGroupItemProjectId = i.id;
                                    } else {
                                        let unit = "";
                                        if(i.unitName && i.unitName.replaceAll(" ", "") != "-" && i.unitName.replaceAll(" ", "") != "无"){
                                            unit = i.unitName;
                                        }
                                        //单个基础项
                                        if(int%2 == 0){
                                            dataLeft.push({
                                                monitorName: i.orderGroupItemProjectName,
                                                value: i.result,
                                                referenceRange: i.scope,
                                                unit: unit,
                                                arrow: i.arrow,
                                                resultTips: i.crisisDegree
                                            });
                                        }else{
                                            dataRight.push({
                                                monitorName: i.orderGroupItemProjectName,
                                                value: i.result,
                                                referenceRange: i.scope,
                                                unit: unit,
                                                arrow: i.arrow,
                                                resultTips: i.crisisDegree
                                            });
                                        }
                                    }
                                    int ++;
                                });
                                let nkDatasTZ = [];
                                nkDatasTZ.push({
                                    dataLeft: dataLeft,
                                    dataRight: dataRight,
                                    nkOpinion: ii.opinion,
                                    nkAutograph: ii.checkSign,
                                    nkDate: templateData.inspectDate,
                                });
                                templateData.nkDatasTZ = nkDatasTZ;
                            } else if (groupItemsName.indexOf("外科检查") > -1 || groupItemsName.indexOf("外科常规") > -1 || groupItemsName.indexOf("皮肤科常规") > -1) {
                                // templateData = this.surgicalRoutine(data, templateData);
                                if(templateData.wkDatasTZ && templateData.wkDatasTZ.length > 0){
                                    let int = 0;
                                    data.forEach(i => {
                                        if (i == null) {
                                            i = {};
                                            i.personId = this.personInfo.id;
                                            i.orderGroupItemProjectName = i.name;
                                            i.orderGroupItemProjectId = i.id;
                                        } else {
                                            let unit = "";
                                            if(i.unitName && i.unitName.replaceAll(" ", "") != "-" && i.unitName.replaceAll(" ", "") != "无"){
                                                unit = i.unitName;
                                            }
                                            //单个基础项
                                            if(int%2 == 0){
                                                templateData.wkDatasTZ[0].dataLeft.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }else{
                                                templateData.wkDatasTZ[0].dataRight.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }
                                        }
                                        int ++;
                                    });
                                }else{
                                    let dataLeft = [];
                                    let dataRight = [];
                                    let int = 0;
                                    data.forEach(i => {
                                        if (i == null) {
                                            i = {};
                                            i.personId = this.personInfo.id;
                                            i.orderGroupItemProjectName = i.name;
                                            i.orderGroupItemProjectId = i.id;
                                        } else {
                                            let unit = "";
                                            if(i.unitName && i.unitName.replaceAll(" ", "") != "-" && i.unitName.replaceAll(" ", "") != "无"){
                                                unit = i.unitName;
                                            }
                                            //单个基础项
                                            if(int%2 == 0){
                                                dataLeft.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }else{
                                                dataRight.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }
                                        }
                                        int ++;
                                    });
                                    let wkDatasTZ = [];
                                    wkDatasTZ.push({
                                        dataLeft: dataLeft,
                                        dataRight: dataRight,
                                        wkOpinion: ii.opinion,
                                        wkAutograph: ii.checkSign,
                                        wkDate: templateData.inspectDate,
                                    });
                                    templateData.wkDatasTZ = wkDatasTZ;
                                }
                            } else if (groupItemsName.indexOf("神经系统") > -1) {
                                // templateData = this.nervousSystem(data, templateData);
                                let dataLeft = [];
                                let dataRight = [];
                                let int = 0;
                                data.forEach(i => {
                                    if (i == null) {
                                        i = {};
                                        i.personId = this.personInfo.id;
                                        i.orderGroupItemProjectName = i.name;
                                        i.orderGroupItemProjectId = i.id;
                                    } else {
                                        let unit = "";
                                        if(i.unitName && i.unitName.replaceAll(" ", "") != "-" && i.unitName.replaceAll(" ", "") != "无"){
                                            unit = i.unitName;
                                        }
                                        //单个基础项
                                        if(int%2 == 0){
                                            dataLeft.push({
                                                monitorName: i.orderGroupItemProjectName,
                                                value: i.result,
                                                referenceRange: i.scope,
                                                unit: unit,
                                                arrow: i.arrow,
                                                resultTips: i.crisisDegree
                                            });
                                        }else{
                                            dataRight.push({
                                                monitorName: i.orderGroupItemProjectName,
                                                value: i.result,
                                                referenceRange: i.scope,
                                                unit: unit,
                                                arrow: i.arrow,
                                                resultTips: i.crisisDegree
                                            });
                                        }
                                    }
                                    int ++;
                                });
                                let sjDatasTZ = [];
                                sjDatasTZ.push({
                                    dataLeft: dataLeft,
                                    dataRight: dataRight,
                                    sjOpinion: ii.opinion,
                                    sjAutograph: ii.checkSign,
                                    sjDate: templateData.inspectDate,
                                });
                                templateData.sjDatasTZ = sjDatasTZ;
                            } else if (groupItemsName.indexOf("心电图") > -1) {
                                // templateData = _this.ecgImageData(data, templateData);
                                let xdtDatasTZ = [];
                                xdtDatasTZ.push({
                                    xdtOpinion: ii.opinion,
                                    xdtAutograph: ii.checkSign,
                                    xdtDate: templateData.inspectDate,
                                });
                                templateData.xdtDatasTZ = xdtDatasTZ;
                            }else if (groupItemsName.indexOf("肺功能") > -1) {
                                _this.fgnDataInit(templateData, data)
                                let dataLeft = [];
                                if(templateData.exVCty && templateData.exVCty != "-"){
                                    dataLeft.push({monitorName: '用力呼气肺活量',VCty: templateData.exVCty,VCtyYJ: templateData.exVCtyYJ,VCtyBFB: templateData.exVCtyBFB});
                                }
                                if(templateData.exHFnd && templateData.exHFnd != "-"){
                                    dataLeft.push({monitorName: '一秒用力呼气量',VCty: templateData.exHFnd,VCtyYJ: templateData.exHFndYJ,VCtyBFB: templateData.exHFndBFB});
                                }
                                if(templateData.oSRtey && templateData.oSRtey != "-"){
                                    dataLeft.push({monitorName: '一秒率',VCty: templateData.oSRtey,VCtyYJ: templateData.oSRteyYJ,VCtyBFB: templateData.oSRteyBFB});
                                }
                                let fgnDatasTZ = [];
                                fgnDatasTZ.push({
                                    dataLeft: dataLeft,
                                    fgnOpinion: ii.opinion,
                                    fgnAutograph: ii.checkSign,
                                    fgnDate: templateData.inspectDate,
                                });
                                templateData.fgnDatasTZ = fgnDatasTZ;
                            }else if (groupItemsName.indexOf("纯音") > -1) {
                                // templateData = _this.pureTone(data, templateData);
                                let dctDatasTZ = [];
                                dctDatasTZ.push({
                                    dctOpinion: ii.opinion,
                                    dctAutograph: ii.checkSign,
                                    dctDate: templateData.inspectDate,
                                });
                                templateData.dctDatasTZ = dctDatasTZ;
                            }else if (groupItemsName.indexOf("口腔常规检查") > -1) {
                                // templateData = _this.kqcgImageData(data, templateData);
                                let kqDatasTZ = [];
                                kqDatasTZ.push({
                                    kqOpinion: ii.opinion,
                                    kqAutograph: ii.checkSign,
                                    kqDate: templateData.inspectDate,
                                });
                                templateData.kqDatasTZ = kqDatasTZ;
                            }else if(groupItemsName.indexOf("眼科") > -1){
                                let dataLeft = [];
                                let dataRight = [];
                                if(_this.physicalType != "放射体检"){
                                    let int = 0;
                                    data.forEach(i => {
                                        if (i == null) {
                                            i = {};
                                            i.personId = this.personInfo.id;
                                            i.orderGroupItemProjectName = i.name;
                                            i.orderGroupItemProjectId = i.id;
                                        } else {
                                            let unit = "";
                                            if(i.unitName && i.unitName.replaceAll(" ", "") != "-" && i.unitName.replaceAll(" ", "") != "无"){
                                                unit = i.unitName;
                                            }
                                            //单个基础项
                                            if(int%2 == 0){
                                                dataLeft.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }else{
                                                dataRight.push({
                                                    monitorName: i.orderGroupItemProjectName,
                                                    value: i.result,
                                                    referenceRange: i.scope,
                                                    unit: unit,
                                                    arrow: i.arrow,
                                                    resultTips: i.crisisDegree
                                                });
                                            }
                                        }
                                        int ++;
                                    });
                                }else{
                                    dataLeft.push({
                                        monitorName: "眼科检查",
                                        value: ii.inspectResult,
                                        referenceRange: "",
                                        unit: "",
                                        arrow: "",
                                        resultTips: ""
                                    });
                                }
                                let ykDatasTZ = [];
                                ykDatasTZ.push({
                                    dataLeft: dataLeft,
                                    dataRight: dataRight,
                                    ykOpinion: ii.opinion,
                                    ykAutograph: ii.checkSign,
                                    ykDate: templateData.inspectDate,
                                });
                                templateData.ykDatasTZ = ykDatasTZ;
                            }
                        }
                        j++;
                    });
					_this.loading = false;
					_this.getTemplatePreviewData(templateData);
				} else {
					_this.loading = false;
					_this.getTemplatePreviewData(templateData);
				}


			},
			/**
			 *
			 * 一般检查
			 *
			 * */
			generalInspection: function (data, td) {
				let shrink = '';
				let diastole = '';
				data.forEach(i => {
					if (i) {
						//单个基础项
						let unit = '';
						let unitName = i.unitName;
						if (unitName && unitName.length > 0) {
							if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
								unit = unitName;
							}
						}
						if (i.orderGroupItemProjectName) {
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "营养") {
								td.nutrition = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "身高") {
								td.height = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "体重") {
								td.weight = i.result + unit;
							}
                            if (i.orderGroupItemProjectName.replaceAll(" ", "") == "心率" || i.orderGroupItemProjectName.replaceAll(" ", "") == "心") {
                                td.heartRate = i.result + unit;
                            }
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "舒张压") {
								diastole = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "收缩压") {
								shrink = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "体重指数BMI") {
                                td.weightBMI  = i.result + unit;
							}
						}
						if (shrink && diastole) {
							td.bloodPressure = shrink + "/" + diastole;
						}
					}
				})
				return td;
			},

			/**
			 *
			 * 耳鼻喉口腔常规
			 *
			 * */
			otolaryngologyInspection: function (data, td) {
				data.forEach(i => {
					if (i) {
						//单个基础项
						let unit = '';
						let unitName = i.unitName;
						if (unitName && unitName.length > 0) {
							if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
								unit = unitName;
							}
						}
						if (i.orderGroupItemProjectName) {
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "外耳道") {
								td.externalEar = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "中耳") {
								td.middleEar = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "听力(左)") {
								td.leftHearing = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "听力(右)") {
								td.rightHearing = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "鼻部") {
								td.nose = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "口腔黏膜") {
								td.mucosa = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "牙齿") {
								td.tooth = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "咽部") {
								td.throat = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "五官科其他") {
								td.facialOthers = i.result + unit;
							}
						}
					}
				})

				return td;
			},

			/**
			 *
			 * 内科常规
			 *
			 * */
			internalMedicine: function (data, td) {

				data.forEach(i => {
					if (i) {
						//单个基础项
						let unit = '';
						let unitName = i.unitName;
						if (unitName && unitName.length > 0) {
							if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
								unit = unitName;
							}
						}
						if (i.orderGroupItemProjectName) {
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "肾") {
								td.kidney = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "肺部") {
								td.lungs = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "脾") {
								td.spleen = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "肝") {
								td.liver = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "心率") {
								td.heartRate = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "心音") {
								td.heartMoss = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "心律") {
								td.rhythm = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "内科其他") {
								td.otherInternal = i.result + unit;
							}
						}
					}
				})
				return td;
			},

			/**
			 *
			 * 外科常规
			 *
			 * */
			surgicalRoutine: function (data, td) {
				data.forEach(i => {
					if (i) {
						//单个基础项
						let unit = '';
						let unitName = i.unitName;
						if (unitName && unitName.length > 0) {
							if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
								unit = unitName;
							}
						}
						if (i.orderGroupItemProjectName) {
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "甲状腺(外科)") {
								td.thyroid = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "浅表淋巴结") {
								td.lymphNode = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "四肢关节") {
								td.limbJoints = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "外科其他") {
								td.surgicalOthers = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "脊柱") {
								td.spine = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "皮肤颜色") {
								td.skinColor = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "皮疹") {
								td.rash = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "瘀斑、瘀点") {
								td.petechiae = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "赘生物") {
								td.vegetations = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "水疱或大疱") {
								td.blister = i.result + unit;
							}
						}
					}
				})
				return td;
			},

			/**
			 *
			 * 神经系统
			 *
			 * */
			nervousSystem: function (data, td) {
				data.forEach(i => {
					if (i) {
						//单个基础项
						let unit = '';
						let unitName = i.unitName;
						if (unitName && unitName.length > 0) {
							if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
								unit = unitName;
							}
						}
						if (i.orderGroupItemProjectName) {
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "痛觉、触觉") {
								td.senseOfPain = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "位置觉") {
								td.positionPerception = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "腹壁反射") {
								td.abdominalWallReflex = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "膝反射") {
								td.kneeReflex = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "跟腱反射") {
								td.achillestendonreflex = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "肌力") {
								td.muscleStrength = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "肌张力") {
								td.muscleTension = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "共济运动") {
								td.masonicMovement = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "三颤") {
								td.tripleTremor = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "病理反射") {
								td.pathologicalReflex = i.result + unit;
							}
						}
					}
				})
				return td;
			},
			/**
			 *
			 * 妇科检查
			 *
			 * */
			gynaecology: function (data, td) {
				data.forEach(i => {
					if (i) {
						//单个基础项
						let unit = '';
						let unitName = i.unitName;
						if (unitName && unitName.length > 0) {
							if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
								unit = unitName;
							}
						}
						if (i.orderGroupItemProjectName) {
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "外阴") {
								td.vulva = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "阴道") {
								td.vagina = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "宫颈") {
								td.cervix = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "宫体" || i.orderGroupItemProjectName.replaceAll(" ", "") == "子宫体") {
								td.uterineBody = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "附件") {
								td.enclosure = i.result + unit;
							}
						}
					}
				})
				return td;
			},
			/**
			 *
			 * 纯音
			 *
			 * */
			pureTone: function (data, td) {
				//气体·
				let r500, r1000, r2000, r3000, r4000, r6000;
				let l500, l1000, l2000, l3000, l4000, l6000;
				//骨导
				let gr500, gr1000, gr2000, gr3000, gr4000, gr6000;
				let gl500, gl1000, gl2000, gl3000, gl4000, gl6000;
				if (data && data.length > 0) {
					data.forEach(i => {
						//单个基础项
						//气体
						if (i.orderGroupItemProjectName) {
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳500Hz") {
								l500 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳1000Hz") {
								l1000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳2000Hz") {
								l2000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳3000Hz") {
								l3000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳4000Hz") {
								l4000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳6000Hz") {
								l6000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳500Hz") {
								r500 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳1000Hz") {
								r1000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳2000Hz") {
								r2000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳3000Hz") {
								r3000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳4000Hz") {
								r4000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳6000Hz") {
								r6000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳语频平均听阈") {
								td.HLl = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳语频平均听阈") {
								td.HLr = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "双耳高频平均听阈") {
								td.GFA = i.result;
							}
							//骨导
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳500Hz(骨导)") {
								gl500 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳1000Hz(骨导)") {
								gl1000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳2000Hz(骨导)") {
								gl2000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳3000Hz(骨导)") {
								gl3000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳4000Hz(骨导)") {
								gl4000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "左耳6000Hz(骨导)") {
								gl6000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳500Hz(骨导)") {
								gr500 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳1000Hz(骨导)") {
								gr1000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳2000Hz(骨导)") {
								gr2000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳3000Hz(骨导)") {
								gr3000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳4000Hz(骨导)") {
								gr4000 = i.result;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "右耳6000Hz(骨导)") {
								gr6000 = i.result;
							}
						}
					})
				}
				td.leftImgChart = {
					"x": ["500", "1000", "2000", "3000", "4000", "6000"],
					"y": [l500, l1000, l2000, l3000, l4000, l6000],
					"gy": [gl500, gl1000, gl2000, gl3000, gl4000, gl6000]
				};
				td.rightImgChart = {
					"x": ["500", "1000", "2000", "3000", "4000", "6000"],
					"y": [r500, r1000, r2000, r3000, r4000, r6000],
					"gy": [gr500, gr1000, gr2000, gr3000, gr4000, gr6000]
				};
				return td;
			},
			/**
			 *
			 * 心电图
			 *
			 * */
			ecgImageData: function (data, td) {
				data.forEach(i => {
					if (i) {
						if (i.imgUrl) {
							let imgUrl = i.imgUrl;
							let array = imgUrl.split('/tempFileUrl');
							let zoncareImg = array[1];
							td.zoncareImg = zoncareImg;
							td.zoncareResult = i.diagnoseSum;
						}
					}
				})
				return td;
			},
            /**
             *
             * 口腔常规检查
             *
             * */
            kqcgImageData: function (data, td) {
                /*data.forEach(i => {
                    if (i) {
                        if (i.imgUrl) {
                            let imgUrl = i.imgUrl;
                            let array = imgUrl.split('/tempFileUrl');
                            let zoncareImg = array[1];
                            td.zoncareImg = zoncareImg;
                            td.zoncareResult = i.diagnoseSum;
                        }
                    }
                })*/
                return td;
            },
			/**
			 *
			 * 眼科常规
			 *
			 * */
			ophthalmicRoutine: function (data, td) {
				data.forEach(i => {
					if (i) {
						//单个基础项
						let unit = '';
						let unitName = i.unitName;
						if (unitName && unitName.length > 0) {
							if (unitName.replaceAll(" ", "") != '-' && unitName.replaceAll(" ", "") != '无') {
								unit = unitName;
							}
						}
						if (i.orderGroupItemProjectName) {
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "色觉(右)") {
								td.colorVisionRight = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "色觉(左)") {
								td.colorVisionLeft = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "暗适应(右)") {
								td.darkAdaptationRight = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "暗适应(左)") {
								td.darkAdaptationLeft = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "视野(右)") {
								td.suitableFieldRight = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "视野(左)") {
								td.suitableFieldLeft = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "裸眼视力(右)") {
								td.nakedEyeRight = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "裸眼视力(左)") {
								td.nakedEyeLeft = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "矫正视力(右)") {
								td.correctRight = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "矫正视力(左)") {
								td.correctLeft = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "结膜(右)") {
								td.conjunctivaRight = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "结膜(左)") {
								td.conjunctivaLeft = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "角膜(右)") {
								td.cornealRight = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "角膜(左)") {
								td.cornealLeft = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "前房(右)") {
								td.anteriorChamberRight = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "前房(左)") {
								td.anteriorChamberLeft = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "虹膜(右)") {
								td.irisRight = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "虹膜(左)") {
								td.irisLeft = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "晶状体(右)") {
								td.lensRight = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "晶状体(左)") {
								td.lensLeft = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "眼底(右)") {
								td.fundusRight = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "眼底(左)") {
								td.fundusLeft = i.result + unit;
							}
							if (i.orderGroupItemProjectName.replaceAll(" ", "") == "眼科其他") {
								td.ophthalmologyOthers = i.result + unit;
							}
						}
					}
				})
				return td;
			},
			/**
			 * 总检报告数据
			 **/
			inspectionDataInit() {
				let templateData = {};
				let _this = this;
				templateData.autograph = _this.checkSign;//医生签名

                templateData.name = "-";//姓名
                templateData.testNum = "-";//体检编号
                templateData.sex = "-";//性别
                templateData.age = "-";//年龄
                templateData.unitName = "-";//单位名称
                templateData.physicalType = "-";//体检类型
                templateData.education = "-";//文化程度
                templateData.familyAddress = "-";//家庭地址
                templateData.isMarry = "-";//婚姻状况
                templateData.nation = "-";//民族
                templateData.idCard = "-";//身份证号
                templateData.birthplaceName = "-";//籍贯(出生地名称)
                templateData.workStateText = "-";//监护种类(在岗状态)
                templateData.phone = "-";//联系电话
                templateData.workTypeText = "-";//工种名称
                templateData.hazardFactorsText = "-";//监护危害(危害因素名称)
                templateData.factors = "-";//职业危害因素
                templateData.workYe = "0";//总工龄年
                templateData.expYear = "0";//接害工龄年
                templateData.expYe = "-";//接触开始时间
                templateData.birth = "-";//出生日期
                templateData.unitName = "-";//单位名称
                templateData.registDate = "-";//体检日期
                if (_this.personInfo) {
                    if (_this.personInfo.unit_name) {
                        templateData.unitName = _this.personInfo.unit_name;//单位名称
                    }
                    if (_this.personInfo.person_name) {
                        templateData.name = _this.personInfo.person_name;//姓名
                    }
                    if (_this.personInfo.test_num) {
                        templateData.testNum = _this.personInfo.test_num;//体检编号
                    }
                    if (_this.personInfo.regist_date) {
                        templateData.registDate = formartDate(_this.personInfo.regist_date, 'yyyy-MM-dd');//体检日期
                    }
                    if (_this.personInfo.sex) {
                        templateData.sex = _this.personInfo.sex;//性别
                        if(templateData.sex == "男"){
                            templateData.nameSex = "先生";//称呼
                        }else{
                            templateData.nameSex = "女士";//称呼
                        }
                    }
                    if (_this.personInfo.age) {
                        templateData.age = _this.personInfo.age + "岁";//年龄
                    }
                    if (_this.personInfo.unit_name) {
                        templateData.unitName = _this.personInfo.unit_name;//单位名称
                    }
                    if (_this.personInfo.hazard_factors_text) {
                        templateData.factors = _this.personInfo.hazard_factors_text;//职业危害因素
                    }
                    if (_this.personInfo.physical_type) {
                        templateData.physicalType = _this.personInfo.physical_type;//体检类型
                    }
                    if (_this.personInfo.education) {
                        templateData.education = _this.personInfo.education;//文化程度
                    }
                    if (_this.personInfo.family_address) {
                        templateData.familyAddress = _this.personInfo.family_address;//家庭地址
                    }
                    templateData.headImg = _this.personInfo.avatar;//头像
                    if (_this.personInfo.is_marry) {
                        templateData.isMarry = _this.personInfo.is_marry;//婚姻状况
                    }
                    if (_this.personInfo.nation) {
                        templateData.nation = _this.personInfo.nation;//民族
                    }
                    if (_this.personInfo.id_card) {
                        templateData.idCard = _this.personInfo.id_card;//身份证号
                    }
                    if (_this.personInfo.birthplace_name) {
                        templateData.birthplaceName = _this.personInfo.birthplace_name;//籍贯(出生地名称)
                    }
                    if (_this.personInfo.work_state_text) {
                        templateData.workStateText = _this.personInfo.work_state_text;//监护种类(在岗状态)
                    }
                    if (_this.physicalType == "职业体检") {
                        if (_this.orderGroupData && _this.orderGroupData.eiaFactors) {
                            templateData.hazardFactorsText = _this.orderGroupData.eiaFactors;//职业危害因素
                        }else if (_this.personInfo.hazard_factors_text) {
                            templateData.hazardFactorsText = _this.personInfo.hazard_factors_text;//监护危害(危害因素名称)
                        }
                    } else {
                        if (_this.personInfo.hazard_factors_text) {
                            templateData.hazardFactorsText = _this.personInfo.hazard_factors_text;//监护危害(危害因素名称)
                        }
                    }
                    if (_this.personInfo.work_year) {
                        templateData.workYe = _this.personInfo.work_year + "年";//总工龄年
                    }
                    if (_this.personInfo.mobile) {
                        templateData.mobile = _this.personInfo.mobile;//联系电话
                    }
                    if (_this.personInfo.exposure_work_year) {
                        templateData.expYear = _this.personInfo.exposure_work_year + "年";//接害工龄年
                    }
                    if (_this.personInfo.birth) {
                        templateData.birth = formartDate(_this.personInfo.birth, 'yyyy-MM-dd');//出生日期
                    }
                    if(_this.personInfo.exposure_start_date){
                        templateData.expYe = formartDate(_this.personInfo.exposure_start_date, 'yyyy-MM-dd');//接触开始时间
                    }
                    if(_this.personInfo.work_type_text) {
                        templateData.workTypeText = _this.personInfo.work_type_text;//工种名称
                        if(templateData.workTypeText == "其他"){
                            templateData.workTypeText = _this.personInfo.work_name;//工种其他名称
                        }
                    }
                }
				if (_this.personInfo) {
					//查询总检信息
					if (_this.personInfo.inspectionRecord) {
						let data = _this.personInfo.inspectionRecord;
						templateData.createTime = formartDate(data.inspectionDate, 'yyyy-MM-dd');
						let dateArray = templateData.createTime.split('-');
						templateData.ye = dateArray[0];
						templateData.mo = dateArray[1];
						templateData.da = dateArray[2];
						templateData.autograph = data.inspectionAutograph;//主检医生
						templateData.conclusion = data.conclusion;
						templateData.handleOpinion = data.handleOpinion;
                        if(data.otherCheckAbnormalResults && data.otherCheckAbnormalResults != "无" && data.careerIllnessName && data.careerIllnessName != "无"){
                            templateData.qtjbyc = "其他疾病或异常：";
                            templateData.clyj = "处理意见：";
                            templateData.otherCheckAbnormalResults = data.otherCheckAbnormalResults + '\n';
                            templateData.careerIllnessName = data.careerIllnessName + '\n';
                        }else{
                            templateData.qtjbyc = "";
                            templateData.clyj = "";
                            templateData.otherCheckAbnormalResults = "";
                            templateData.careerIllnessName = "";
                        }
						if (data.careerCheckAbnormalResults == data.otherCheckAbnormalResults) {
							templateData.physicalResult = data.careerCheckAbnormalResults
						} else {
							if (data.careerCheckAbnormalResults != "无异常" && data.otherCheckAbnormalResults == "无异常") {
								templateData.physicalResult = data.careerCheckAbnormalResults;
							} else if (data.careerCheckAbnormalResults == "无异常" && data.otherCheckAbnormalResults != "无异常") {
								templateData.physicalResult = data.otherCheckAbnormalResults;
							} else {
								templateData.physicalResult = data.careerCheckAbnormalResults + data.otherCheckAbnormalResults;
							}
						}
						let goods = [];
						let arr = [];
						//复查项目
                        if (_this.personInfo.reviewProjectsList) {
                            arr = _this.personInfo.reviewProjectsList;
                            if (arr.length > 0) {
                                templateData.review = "【复查】"
                                for (let i = 0; i < arr.length; i++) {
                                    let groupItemName = arr[i].groupItemName.split("(复)");
                                    goods.push({
                                        projectName: groupItemName[0],//复查项目名
                                        reviewResult: arr[i].diagnoseTip,//检查结果(诊断提醒)
                                        reviewExplain: arr[i].diagnoseSum,//处理意见(诊断小结)
                                        reviewTime: formartDate(arr[i].checkDate,'yyyy-MM-dd'),//复查日期
                                        xmmc: "项目名称：",
                                        fcsm: "复查说明：",
                                    });
                                }
                                templateData.ry = dateArray[0];
                                templateData.rm = dateArray[1];
                                templateData.rd = dateArray[2];
                                templateData.reviewAutograph = data.inspectionAutograph;
                            }else{
                                templateData.review = ""
                                goods.push({
                                    projectName: "",//复查项目名
                                    reviewResult: "",//复查结果
                                    reviewExplain: "",//复查说明
                                    reviewTime: "",//复查日期
                                    xmmc: "",
                                    fcsm: "",
                                });
                            }
                            templateData.goods = goods;
                            _this.getTemplatePreviewData(templateData);
                        } else {
                            _this.closeParentLoading();
                        }

					} else {
						_this.$message.error("总检参数有误：请联系管理员！！");
						_this.closeParentLoading();
					}

				} else {
					_this.$message.error("总检参数有误：人员Id为空，请联系管理员！！");
					_this.closeParentLoading();
				}
			},
			/**
			 * 个人信息
			 * *
			 */
			personDataInit() {
				let templateData = {};
				let _this = this;
				templateData.name = "-";//姓名
				templateData.testNum = "-";//体检编号
				templateData.sex = "-";//性别
				templateData.age = "-";//年龄
				templateData.unitName = "-";//单位名称
				templateData.physicalType = "-";//体检类型
				templateData.education = "-";//文化程度
				templateData.familyAddress = "-";//家庭地址
				templateData.isMarry = "-";//婚姻状况
				templateData.nation = "-";//民族
				templateData.idCard = "-";//身份证号
				templateData.birthplaceName = "-";//籍贯(出生地名称)
				templateData.workStateText = "-";//监护种类(在岗状态)
				templateData.phone = "-";//联系电话
				templateData.workTypeText = "-";//工种名称
				templateData.year = "-";//年--出生日期
				templateData.month = "-";//月--出生日期
				templateData.day = "-";//日·--出生日期
				templateData.hazardFactorsText = "-";//监护危害(危害因素名称)
				templateData.factors = "-";//职业危害因素
				templateData.workYe = "-";//总工龄年
				templateData.expYe = "-";//接害工龄年
				if (_this.personInfo) {
					if (_this.personInfo.person_name) {
						templateData.name = _this.personInfo.person_name;//姓名
					}
					if (_this.personInfo.test_num) {
						templateData.testNum = _this.personInfo.test_num;//体检编号
					}
					if (_this.personInfo.sex) {
						templateData.sex = _this.personInfo.sex;//性别
					}
					if (_this.personInfo.age) {
						templateData.age = _this.personInfo.age + "岁";//年龄
					}
					if (_this.personInfo.unit_name) {
						templateData.unitName = _this.personInfo.unit_name;//单位名称
					}
					if (_this.personInfo.hazard_factors_text) {
						templateData.factors = _this.personInfo.hazard_factors_text;//职业危害因素
					}
					if (_this.personInfo.physical_type) {
						templateData.physicalType = _this.personInfo.physical_type;//体检类型
					}
					if (_this.personInfo.education) {
						templateData.education = _this.personInfo.education;//文化程度
					}
					if (_this.personInfo.familyAddress) {
						templateData.familyAddress = _this.personInfo.familyAddress;//家庭地址
					}
					templateData.headImg = _this.personInfo.avatar;//头像
					if (_this.personInfo.is_marry) {
						templateData.isMarry = _this.personInfo.is_marry;//婚姻状况
					}
					if (_this.personInfo.nation) {
						templateData.nation = _this.personInfo.nation;//民族
					}
					if (_this.personInfo.id_card) {
						templateData.idCard = _this.personInfo.id_card;//身份证号
					}
					if (_this.personInfo.birthplace_name) {
						templateData.birthplaceName = _this.personInfo.birthplace_name;//籍贯(出生地名称)
					}
					if (_this.personInfo.work_state_text) {
						templateData.workStateText = _this.personInfo.work_state_text;//监护种类(在岗状态)
					}
					if (_this.personInfo.hazard_factors_text) {
						templateData.hazardFactorsText = _this.personInfo.hazard_factors_text;//监护危害(危害因素名称)
					}
					if (_this.personInfo.work_year) {
						templateData.workYe = _this.personInfo.work_year + "年";//总工龄年
					}
					if (_this.personInfo.mobile) {
						templateData.mobile = _this.personInfo.mobile;//联系电话
					}
					if (_this.personInfo.birth) {
						templateData.birth = formartDate(_this.personInfo.birth, 'yyyy-MM-dd');//出生日期
						let dateArray = templateData.birth.split('-');
						templateData.year = dateArray[0] + "年";//年--出生日期
						templateData.month = dateArray[1] + "月";//月--出生日期
						templateData.day = dateArray[2] + "日";//日·--出生日期

					}
				}
				_this.getTemplatePreviewData(templateData);
			},
			/**
			 * 问诊报告数据
			 **/
			inquiryDataInit() {
				let templateData = {};
				let _this = this;
				templateData.name = "-";//姓名
				templateData.testNum = "-";//体检编号
				templateData.sex = "-";//性别
				templateData.age = "-";//年龄
				templateData.unitName = "-";//单位名称
				templateData.factors = "-";//职业危害因素
				templateData.physicalType = "-";//体检类型
				templateData.education = "-";//文化程度
				templateData.familyAddress = "-";//家庭地址
				templateData.isMarry = "-";//婚姻状况
				templateData.nation = "-";//民族
				templateData.idCard = "-";//身份证号
				templateData.birthplaceName = "-";//籍贯(出生地名称)
				templateData.workStateText = "-";//监护种类(在岗状态)
				templateData.workYe = "-";//总工龄年
				templateData.expYe = "-";//接害工龄年
				templateData.hazardFactorsText = "-";//监护危害(危害因素名称)
				templateData.menarche = "-";//初潮
				templateData.period = "-";//经期
				templateData.cycle = "-";//周期
				templateData.lastMe = "-";//停经年龄
				templateData.child = "-";//现有子女
				templateData.abort = "-";//流产
				templateData.prem = "-";//早产
				templateData.death = "-";//死产
				templateData.abnor = "-";//异常胎
				templateData.smokeState = "-";//吸烟状态
				templateData.package = "-";//包每天
				templateData.smokeYear = "-";//吸烟年
				templateData.drinkState = "-";//喝酒状态
				templateData.mlDay = "-";//ml每天
				templateData.drinkYear = "-";//喝酒年
				templateData.phone = "-";//联系电话
				templateData.allergies = "-";//过敏史
				templateData.allergiesInfo = "-";//过敏史异常信息
				templateData.familyHistory = "-";//家族史
				templateData.menstrualHistory = "-";//月经史
				templateData.menstrualInfo = "-";//月经史异常信息
				templateData.otherInfo = "-";//其他信息
				templateData.pastMedicalHistoryOtherInfo = "无";//既往病史其他信息
				templateData.workTypeText = "-";//工种名称
				templateData.year = "-";//年--出生日期
				templateData.month = "-";//月--出生日期
				templateData.day = "-";//日·--出生日期
				if (_this.personInfo) {
					if (_this.personInfo.wz_check_autograph) {
						templateData.autograph = _this.personInfo.wz_check_autograph;//问诊科签名
					}
					if (_this.personInfo.person_name) {
						templateData.name = _this.personInfo.person_name;//姓名
					}
					if (_this.personInfo.test_num) {
						templateData.testNum = _this.personInfo.test_num;//体检编号
					}
					if (_this.personInfo.sex) {
						templateData.sex = _this.personInfo.sex;//性别
					}
					if (_this.personInfo.age) {
						templateData.age = _this.personInfo.age + "岁";//年龄
					}
					if (_this.personInfo.unit_name) {
						templateData.unitName = _this.personInfo.unit_name;//单位名称
					}
					/*if (_this.personInfo.hazard_factors_text) {
						templateData.factors = _this.personInfo.hazard_factors_text;//职业危害因素
					}*/
                    if (_this.physicalType == "职业体检") {
                        if (_this.orderGroupData && _this.orderGroupData.eiaFactors) {
                            templateData.hazardFactorsText = _this.orderGroupData.eiaFactors;//职业危害因素
                        }else if (_this.personInfo.hazard_factors_text) {
                            templateData.hazardFactorsText = _this.personInfo.hazard_factors_text;//监护危害(危害因素名称)
                        }
                    } else {
                        if (_this.personInfo.hazard_factors_text) {
                            templateData.hazardFactorsText = _this.personInfo.hazard_factors_text;//监护危害(危害因素名称)
                        }
                    }
					if (_this.personInfo.physical_type) {
						templateData.physicalType = _this.personInfo.physical_type;//体检类型
					}
					if (_this.personInfo.education) {
						templateData.education = _this.personInfo.education;//文化程度
					}
					if (_this.personInfo.family_address) {
						templateData.familyAddress = _this.personInfo.family_address;//家庭地址
					}
					templateData.headImg = _this.personInfo.avatar;//头像
					if (_this.personInfo.is_marry) {
						templateData.isMarry = _this.personInfo.is_marry;//婚姻状况
					}
					if (_this.personInfo.nation) {
						templateData.nation = _this.personInfo.nation;//民族
					}
					if (_this.personInfo.id_card) {
						templateData.idCard = _this.personInfo.id_card;//身份证号
					}
					if (_this.personInfo.birthplace_name) {
						templateData.birthplaceName = _this.personInfo.birthplace_name;//籍贯(出生地名称)
					}
					if (_this.personInfo.work_state_text) {
						templateData.workStateText = _this.personInfo.work_state_text;//监护种类(在岗状态)
					}
					if (_this.personInfo.work_year) {
						templateData.workYe = _this.personInfo.work_year + "年";//总工龄年
					}
					/*if (_this.personInfo.exposure_work_year) {
						templateData.expYe = _this.personInfo.exposure_work_year;//接害工龄年
					}*/
					if (_this.personInfo.exposure_start_date) {
						templateData.expYe = formartDate(_this.personInfo.exposure_start_date, 'yyyy-MM-dd');//接触开始时间
					}
					if (_this.physicalType == "职业体检") {
						if (_this.orderGroupData) {
							templateData.hazardFactorsText = _this.orderGroupData.eiaFactors;//职业危害因素
						}
					} else {
						if (_this.personInfo.hazard_factors_text) {
							templateData.hazardFactorsText = _this.personInfo.hazard_factors_text;//监护危害(危害因素名称)
						}
					}
					if (_this.personInfo.existing_children) {
						templateData.child = _this.personInfo.existing_children;//现有子女
					}
					if (_this.personInfo.abortion) {
						templateData.abort = _this.personInfo.abortion;//流产
					}
					if (_this.personInfo.premature) {
						templateData.prem = _this.personInfo.premature;//早产
					}
					if (_this.personInfo.death) {
						templateData.death = _this.personInfo.death;//死产
					}
					if (_this.personInfo.abnormal_fetus) {
						templateData.abnor = _this.personInfo.abnormal_fetus;//异常胎
					}
					if (_this.personInfo.smoke_state) {
						templateData.smokeState = _this.personInfo.smoke_state;//吸烟状态
					}
					if (_this.personInfo.package_every_day) {
						templateData.package = _this.personInfo.package_every_day;//包每天
					}
					if (_this.personInfo.smoke_year) {
						templateData.smokeYear = _this.personInfo.smoke_year;//吸烟年
					}
					if (_this.personInfo.drink_state) {
						templateData.drinkState = _this.personInfo.drink_state;//喝酒状态
					}
					if (_this.personInfo.ml_every_day) {
						templateData.mlDay = _this.personInfo.ml_every_day;//ml每天
					}
					if (_this.personInfo.drink_year) {
						templateData.drinkYear = _this.personInfo.drink_year;//喝酒年
					}
					if (_this.personInfo.mobile) {
						templateData.mobile = _this.personInfo.mobile;//联系电话
					}
					if (_this.personInfo.allergies) {
						templateData.allergies = _this.personInfo.allergies;//过敏史
					}
					if (_this.personInfo.allergies_info) {
						templateData.allergiesInfo = _this.personInfo.allergies_info;//过敏史异常信息
					}
					if (_this.personInfo.family_history) {
						templateData.familyHistory = _this.personInfo.family_history;//家族史
					}
					if (_this.personInfo.sex != "男") {
						if (_this.personInfo.menarche) {
							templateData.menarche = _this.personInfo.menarche;//初潮
						}
						if (_this.personInfo.period) {
							templateData.period = _this.personInfo.period;//经期
						}
						if (_this.personInfo.cycle) {
							templateData.cycle = _this.personInfo.cycle;//周期
						}
						if (_this.personInfo.lastMe) {
							templateData.lastMe = _this.personInfo.lastMe;//停经年龄
						}
						if (_this.personInfo.menstrual_history) {
							templateData.menstrualHistory = _this.personInfo.menstrual_history;//月经史
						}
						if (_this.personInfo.menstrual_info) {
							templateData.menstrualInfo = _this.personInfo.menstrual_info;//月经史异常信息
						}
					}
					if (_this.personInfo.otherInfo) {
						templateData.otherInfo = _this.personInfo.otherInfo;//其他信息
					}
					if (_this.personInfo.past_medical_history_other_info) {
						templateData.pastMedicalHistoryOtherInfo = _this.personInfo.past_medical_history_other_info;//既往病史其他信息
					}

					if (_this.personInfo.work_type_text) {
						templateData.workTypeText = _this.personInfo.work_type_text;//工种名称
					}
					if (_this.personInfo.registDate) {
						templateData.createTime = formartDate(_this.personInfo.registDate, 'yyyy-MM-dd');//送检时间(登记时间)
					}
					if (_this.personInfo.diagnosisDate) {
						templateData.diagnosisDate = formartDate(_this.personInfo.diagnosisDate, 'yyyy-MM-dd');//诊断日期
					}
					if (_this.personInfo.birth) {
						templateData.birth = formartDate(_this.personInfo.birth, 'yyyy-MM-dd');//出生日期
						let dateArray = templateData.birth.split('-');
						templateData.year = dateArray[0] + "年";//年--出生日期
						templateData.month = dateArray[1] + "月";//月--出生日期
						templateData.day = dateArray[2] + "日";//日·--出生日期

					}

					//查询人员的既往病史数据
					if (_this.personInfo.pastMedicalHistory) {
						let pastMedicalHistoryData = [];//既往病史 数据集
						pastMedicalHistoryData = _this.personInfo.pastMedicalHistory;
						/*既往病史数据 职业体检、放射体检、从业体检*/
						let pastMedical = [];
						if (pastMedicalHistoryData.length > 0) {
							for (let i = 0; i < pastMedicalHistoryData.length; i++) {
								let diseaseDate = "-";
								if (pastMedicalHistoryData[i].diseaseDate) {
									diseaseDate = formartDate(pastMedicalHistoryData[i].diseaseDate, 'yyyy-MM-dd')
								}
								let diseaseName = "-";
								if (pastMedicalHistoryData[i].diseaseName) {
									diseaseName = pastMedicalHistoryData[i].diseaseName;
								}
								let diagnosticUnit = "-";
								if (pastMedicalHistoryData[i].diagnosticUnit) {
									diagnosticUnit = pastMedicalHistoryData[i].diagnosticUnit;
								}
								let afterTreatment = "-";
								if (pastMedicalHistoryData[i].afterTreatment) {
									afterTreatment = pastMedicalHistoryData[i].afterTreatment;
								}
								let fate = "-";
								if (pastMedicalHistoryData[i].fate) {
									fate = pastMedicalHistoryData[i].fate;
								}
								pastMedical.push({
									diseaseName: diseaseName,//疾病名称
									diseaseDate: diseaseDate,//诊断日期
									diseaseUnit: diagnosticUnit,//诊断单位
									afterTreatment: afterTreatment,//治疗经过
									fate: fate,//转归
								});
							}
						} else {
							pastMedical.push({
								diseaseName: "无",
								diseaseDate: "",
								diseaseUnit: "",
								afterTreatment: "",
								fate: ""
							});
						}
						templateData.pastMedical = pastMedical;

						if (_this.physicalType != "从业体检") {
							//查询人员的职业史数据
							if (_this.personInfo.careerHistory) {
								if (_this.physicalType == "职业体检") {
									let careerHisData = [];//职业史 数据集
									careerHisData = _this.personInfo.careerHistory;
									/*职业史数据 职业体检*/
									let careerHis = [];//起止日期 工作单位 部门 工种 有害因素 防护措施
									if (careerHisData.length > 0) {
										for (let i = 0; i < careerHisData.length; i++) {
											let startEndDate = "-";
											if (careerHisData[i].startDate) {
												startEndDate = formartDate(careerHisData[i].startDate, 'yyyy/MM/dd') + '-' + formartDate(careerHisData[i].endDate, 'yyyy/MM/dd');
											}
											let workUnit = "-";
											if (careerHisData[i].workUnit) {
												workUnit = careerHisData[i].workUnit;
											}
											let workTypeText = "-";
											if (careerHisData[i].workTypeText) {
												workTypeText = careerHisData[i].workTypeText;
												if (workTypeText == "其他") {
													workTypeText = _this.personInfo.work_name;
												}
											}
											let hazardFactorsText = "-";
											if (careerHisData[i].hazardFactorsText) {
												hazardFactorsText = careerHisData[i].hazardFactorsText;
											}
											let protectiveMeasures = "-";
											if (careerHisData[i].protectiveMeasures) {
												protectiveMeasures = careerHisData[i].protectiveMeasures;
											}
											careerHis.push({
												startEndDate: startEndDate,//起止日期
												workUnit: workUnit,//工作单位
												workTypeText: workTypeText,//工种
												hazardFactorsText: hazardFactorsText,//有害因素
												protectiveMeasures: protectiveMeasures//防护措施
											});
										}
									} else {
										careerHis.push({
											startEndDate: "无",
											workUnit: "",
											workTypeText: "",
											hazardFactorsText: "",
											protectiveMeasures: ""
										});
									}
									templateData.careerHis = careerHis;
								} else if (_this.physicalType == "放射体检") {
									let careerHisData = [];//职业史 数据集
                                    careerHisData = _this.personInfo.careerHistory;
									/*职业史数据 放射体检*/
									let careerHis = [];//起止日期 工作单位 部门 工种 有害因素 防护措施
									let irradiationTypes = "";//职业照射种类(总览)
									if (careerHisData.length > 0) {
										for (let i = 0; i < careerHisData.length; i++) {
											let startEndDate = "-";
											if (careerHisData[i].startDate) {
												startEndDate = formartDate(careerHisData[i].startDate, 'yyyy/MM/dd') + '-' + formartDate(careerHisData[i].endDate, 'yyyy/MM/dd');
											}
											let workUnit = "-";
											if (careerHisData[i].workUnit) {
												workUnit = careerHisData[i].workUnit;
											}
											let department = "-";
											if (careerHisData[i].department) {
												department = careerHisData[i].department;
											}
											let workTypeText = "-";
											if (careerHisData[i].workTypeText) {
												workTypeText = careerHisData[i].workTypeText;
												if (workTypeText == "其他") {
													workTypeText = _this.personInfo.work_name;
												}
											}
											let radiationType = "-";
											if (careerHisData[i].radiationType) {
												radiationType = careerHisData[i].radiationType;
											}
											let irradiationType = "-";
											if (careerHisData[i].irradiationType) {
												irradiationType = careerHisData[i].irradiationType;
												if (irradiationType.indexOf(",") > -1) {
													//职业照射种类名称
													let irradiationTypeData = irradiationType.split(",");
													//职业照射种类代码
													let irradiationTypeCodeData = careerHisData[i].irradiationTypeCode.split(",");
													for (let j = 0; j < irradiationTypeData.length; j++) {
														//职业照射种类(总览)
														irradiationTypes += irradiationTypeData[j] + irradiationTypeCodeData[j] + ";";
													}
												} else {
													//职业照射种类(总览)
													irradiationTypes += irradiationType + careerHisData[i].irradiationTypeCode + ";";
												}
												// irradiationTypes += irradiationType + ";";
											}
											let workload = "-";
											if (careerHisData[i].workload) {
												workload = careerHisData[i].workload;
											}
											let exposureDose = "-";
											if (careerHisData[i].exposureDose) {
												exposureDose = careerHisData[i].exposureDose;
											}
											let overexposure = "-";
											if (careerHisData[i].overexposure) {
												overexposure = careerHisData[i].overexposure;
											}
											let remark = "-";
											if (careerHisData[i].remark) {
												remark = careerHisData[i].remark;
											}
											careerHis.push({
												startEndDate: startEndDate,//起止日期
												workUnit: workUnit,//工作单位
												depart: department,//部门
												workTypeText: workTypeText,//工种
												rayingType: radiationType,//放射线种类
												irradType: irradiationType,//职业照射种类
												workinghours: workload,//每日工作时数或工作量
												dose: exposureDose,//累积受照剂量
												rayinghistory: overexposure,//过量照射史
												repark: remark//备注
											});
										}
									} else {
										careerHis.push({
											startEndDate: "无",
											workUnit: "",
											depart: "",
											workTypeText: "",
											rayingType: "",
											irradType: "",
											workinghours: "",
											dose: "",
											rayinghistory: "",
											repark: ""
										});
									}
									templateData.irradiationTypes = irradiationTypes;
									templateData.careerHis = careerHis;
								}
								//症状查询

								if (_this.personInfo.symptom) {
									if (_this.physicalType == "职业体检") {
										//头痛
										templateData.degreeTT = "-";//程度
										templateData.timeTT = "-";//病程时间
										//头昏
										templateData.degreeTH = "-";//程度
										templateData.timeTH = "-"//病程时间
										//眩晕
										templateData.degreeXY = "-";//程度
										templateData.timeXY = "-";//病程时间
										//失眠
										templateData.degreeSM = "-";//程度
										templateData.timeSM = "-";//病程时间
										//嗜睡
										templateData.degreeSS = "-";//程度
										templateData.timeSS = "-";//病程时间
										//多梦
										templateData.degreeDM = "-";//程度
										templateData.timeDM = "-";//病程时间
										//记忆力减退
										templateData.degreeJYL = "-";//程度
										templateData.timeJYL = "-";//病程时间
										//易激动
										templateData.degreeYJD = "-";//程度
										templateData.timeYJD = "-";//病程时间
										//疲乏无力
										templateData.degreePF = "-";//程度
										templateData.timePF = "-";//病程时间
										//四肢麻木
										templateData.degreeMM = "-";//程度
										templateData.timeMM = "-";//病程时间
										//动作不灵活
										templateData.degreeBLH = "-";//程度
										templateData.timeBLH = "-";//病程时间
										//肌肉抽搐
										templateData.degreeCC = "-";//程度
										templateData.timeCC = "-";//病程时间
										//消瘦
										templateData.degreeXS = "-";//程度
										templateData.timeXS = "-";//病程时间
										//口渴
										templateData.degreeKK = "-";//程度
										templateData.timeKK = "-";//病程时间
										//皮肤瘙痒
										templateData.degreeSY = "-";//程度
										templateData.timeSY = "-";//病程时间
										//皮疹
										templateData.degreePZ = "-";//程度
										templateData.timePZ = "-";//病程时间
										//低热
										templateData.degreeDR = "-";//程度
										templateData.timeDR = "-";//病程时间
										//脱发
										templateData.degreeTF = "-";//程度
										templateData.timeTF = "-";//病程时间
										//盗汗
										templateData.degreeDH = "-";//程度
										templateData.timeDH = "-";//病程时间
										//气促
										templateData.degreeQC = "-";//程度
										templateData.timeQC = "-";//病程时间
										//气短
										templateData.degreeQD = "-";//程度
										templateData.timeQD = "-";//病程时间
										//胸闷
										templateData.degreeMX = "-";//程度
										templateData.timeMX = "-";//病程时间
										//胸痛
										templateData.degreeXT = "-";//程度
										templateData.timeXT = "-";//病程时间
										//咳嗽
										templateData.degreeKS = "-";//程度
										templateData.timeKS = "-";//病程时间
										//咳痰
										templateData.degreeKT = "-";//程度
										templateData.timeKT = "-";//病程时间
										//咯血
										templateData.degreeLX = "-";//程度
										templateData.timeLX = "-";//病程时间
										//哮喘
										templateData.degreeXC = "-";//程度
										templateData.timeXC = "-";//病程时间
										//尿频、尿急
										templateData.degreeNP = "-";//程度
										templateData.timeNP = "-";//病程时间
										//尿痛
										templateData.degreeNT = "-";//程度
										templateData.timeNT = "-";//病程时间
										//血尿
										templateData.degreeXN = "-";//程度
										templateData.timeXN = "-";//病程时间
										//浮肿
										templateData.degreeFZ = "-";//程度
										templateData.timeFZ = "-";//病程时间
										//性欲减退
										templateData.degreeXYJT = "-";//程度
										templateData.timeXYJT = "-";//病程时间
										//全身酸痛
										templateData.degreeQSST = "-";//程度
										templateData.timeQSST = "-";//病程时间
										//肌肉疼痛
										templateData.degreeJRST = "-";//程度
										templateData.timeJRST = "-";//病程时间
										//肌无力及关节疼痛//肌无力
										templateData.degreeJWL = "-";//程度
										templateData.timeJWL = "-";//病程时间
										//肌无力及关节疼痛//关节疼痛
										templateData.degreeGJTT = "-";//程度
										templateData.timeGJTT = "-";//病程时间
										//视物模糊
										templateData.degreeSJMH = "-";//程度
										templateData.timeSJMH = "-";//病程时间
										//视力下降
										templateData.degreeSLXJ = "-";//程度
										templateData.timeSLXJ = "-";//病程时间
										//眼痛
										templateData.degreeYT = "-";//程度
										templateData.timeYT = "-";//病程时间
										//羞明
										templateData.degreeXM = "-";//程度
										templateData.timeXM = "-";//病程时间
										//流泪
										templateData.degreeLL = "-";//程度
										templateData.timeLL = "-";//病程时间
										//嗅觉减退
										templateData.degreeXJJT = "-";//程度
										templateData.timeXJJT = "-";//病程时间
										//鼻干
										templateData.degreeBG = "-";//程度
										templateData.timeBG = "-";//病程时间
										//鼻塞
										templateData.degreeBS = "-";//程度
										templateData.timeBS = "-";//病程时间
										//流鼻血
										templateData.degreeLBX = "-";//程度
										templateData.timeLBX = "-";//病程时间
										//流涕
										templateData.degreeLT = "-";//程度
										templateData.timeLT = "-";//病程时间
										//耳鸣
										templateData.degreeEM = "-";//程度
										templateData.timeEM = "-";//病程时间
										//耳聋
										templateData.degreeEN = "-";//程度
										templateData.timeEN = "-";//病程时间
										//流涎
										templateData.degreeLY = "-";//程度
										templateData.timeLY = "-";//病程时间
										//牙痛
										templateData.degreeYaT = "-";//程度
										templateData.timeYaT = "-";//病程时间
										//牙齿松动
										templateData.degreeYCSD = "-";//程度
										templateData.timeYCSD = "-";//病程时间
										//刷牙出血
										templateData.degreeSYCX = "-";//程度
										templateData.timeSYCX = "-";//病程时间
										//口腔异味
										templateData.degreeKQYW = "-";//程度
										templateData.timeKQYW = "-";//病程时间
										//口腔溃疡
										templateData.degreeKQKY = "-";//程度
										templateData.timeKQKY = "-";//病程时间
										//咽部疼痛
										templateData.degreeYBTT = "-";//程度
										templateData.timeYBTT = "-";//病程时间
										//声嘶
										templateData.degreeSSi = "-";//程度
										templateData.timeSSi = "-";//病程时间
										//心悸
										templateData.degreeXJi = "-";//程度
										templateData.timeXJi = "-";//病程时间
										//心前区不适
										templateData.degreeXQBS = "-";//程度
										templateData.timeXQBS = "-";//病程时间
										//心前区疼痛
										templateData.degreeXQTT = "-";//程度
										templateData.timeXQTT = "-";//病程时间
										//食欲不振
										templateData.degreeSYBZ = "-";//程度
										templateData.timeSYBZ = "-";//病程时间
										//肝区疼痛
										templateData.degreeGQTT = "-";//程度
										templateData.timeGQTT = "-";//病程时间
										//腹胀、腹痛
										templateData.degreeFZFT = "-";//程度
										templateData.timeFZFT = "-";//病程时间
										//恶心//恶心、呕吐
										templateData.degreeEXOT = "-";//程度
										templateData.timeEXOT = "-";//病程时间
										//腹泻
										templateData.degreeFX = "-";//程度
										templateData.timeFX = "-";//病程时间
										//便秘
										templateData.degreeBM = "-";//程度
										templateData.timeBM = "-";//病程时间
										//便血
										templateData.degreeBX = "-";//程度
										templateData.timeBX = "-";//病程时间
										//其他
										templateData.prNaQT = "无";//项目名称
										templateData.degreeQT = "-";//程度
										templateData.timeQT = "-";//病程时间
										/*症状数据symptom*/
										//projectName项目名称 degree程度 courseTime病程时间
										let symptomData = [];//症状 数据集
										symptomData = _this.personInfo.symptom;

										//医生签名(症状)
										// templateData.autograph = '';//检查医生
										if (symptomData.length > 0) {
											for (let i = 0; i < symptomData.length; i++) {
												/*if (!templateData.autograph || templateData.autograph == '') {
                                                if (symptomData[i].createName) {
                                                    templateData.autograph = symptomData[i].createName;
                                                }
                                            }*/
												if (symptomData[i].projectName) {
													if (symptomData[i].projectName.replaceAll(" ", "") == "头痛") {
														if (symptomData[i].degree) {
															templateData.degreeTT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeTT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "头昏") {
														if (symptomData[i].degree) {
															templateData.degreeTH = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeTH = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "眩晕") {
														if (symptomData[i].degree) {
															templateData.degreeXY = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeXY = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "失眠") {
														if (symptomData[i].degree) {
															templateData.degreeSM = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeSM = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "嗜睡") {
														if (symptomData[i].degree) {
															templateData.degreeSS = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeSS = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "多梦") {
														if (symptomData[i].degree) {
															templateData.degreeDM = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeDM = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "记忆力减退") {
														if (symptomData[i].degree) {
															templateData.degreeJYL = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeJYL = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "易激动") {
														if (symptomData[i].degree) {
															templateData.degreeYJD = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeYJD = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "疲乏无力") {
														if (symptomData[i].degree) {
															templateData.degreePF = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timePF = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "四肢麻木") {
														if (symptomData[i].degree) {
															templateData.degreeMM = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeMM = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "动作不灵活") {
														if (symptomData[i].degree) {
															templateData.degreeBLH = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeBLH = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "肌肉抽搐") {
														if (symptomData[i].degree) {
															templateData.degreeCC = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeCC = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "消瘦") {
														if (symptomData[i].degree) {
															templateData.degreeXS = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeXS = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "口渴") {
														if (symptomData[i].degree) {
															templateData.degreeKK = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeKK = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "皮肤瘙痒") {
														if (symptomData[i].degree) {
															templateData.degreeSY = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeSY = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "皮疹") {
														if (symptomData[i].degree) {
															templateData.degreePZ = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timePZ = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "低热") {
														if (symptomData[i].degree) {
															templateData.degreeDR = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeDR = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "脱发") {
														if (symptomData[i].degree) {
															templateData.degreeTF = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeTF = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "盗汗") {
														if (symptomData[i].degree) {
															templateData.degreeDH = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeDH = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "气促") {
														if (symptomData[i].degree) {
															templateData.degreeQC = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeQC = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "气短") {
														if (symptomData[i].degree) {
															templateData.degreeQD = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeQD = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "胸闷") {
														if (symptomData[i].degree) {
															templateData.degreeMX = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeMX = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "胸痛") {
														if (symptomData[i].degree) {
															templateData.degreeXT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeXT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "咳嗽") {
														if (symptomData[i].degree) {
															templateData.degreeKS = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeKS = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "咳痰") {
														if (symptomData[i].degree) {
															templateData.degreeKT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeKT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "咯血") {
														if (symptomData[i].degree) {
															templateData.degreeLX = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeLX = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "哮喘") {
														if (symptomData[i].degree) {
															templateData.degreeXC = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeXC = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "尿频、尿急") {
														if (symptomData[i].degree) {
															templateData.degreeNP = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeNP = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "尿痛") {
														if (symptomData[i].degree) {
															templateData.degreeNT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeNT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "血尿") {
														if (symptomData[i].degree) {
															templateData.degreeXN = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeXN = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "浮肿") {
														if (symptomData[i].degree) {
															templateData.degreeFZ = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeFZ = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "性欲减退") {
														if (symptomData[i].degree) {
															templateData.degreeXYJT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeXYJT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "全身酸痛") {
														if (symptomData[i].degree) {
															templateData.degreeQSST = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeQSST = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "肌肉疼痛") {
														if (symptomData[i].degree) {
															templateData.degreeJRST = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeJRST = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "肌无力及关节疼痛") {//肌无力
														if (symptomData[i].degree) {
															templateData.degreeJWL = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeJWL = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "肌无力及关节疼痛") {//关节疼痛
														if (symptomData[i].degree) {
															templateData.degreeGJTT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeGJTT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "视物模糊") {
														if (symptomData[i].degree) {
															templateData.degreeSJMH = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeSJMH = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "视力下降") {
														if (symptomData[i].degree) {
															templateData.degreeSLXJ = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeSLXJ = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "眼痛") {
														if (symptomData[i].degree) {
															templateData.degreeYT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeYT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "羞明") {
														if (symptomData[i].degree) {
															templateData.degreeXM = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeXM = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "流泪") {
														if (symptomData[i].degree) {
															templateData.degreeLL = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeLL = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "嗅觉减退") {
														if (symptomData[i].degree) {
															templateData.degreeXJJT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeXJJT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "鼻干") {
														if (symptomData[i].degree) {
															templateData.degreeBG = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeBG = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "鼻塞") {
														if (symptomData[i].degree) {
															templateData.degreeBS = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeBS = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "流鼻血") {
														if (symptomData[i].degree) {
															templateData.degreeLBX = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeLBX = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "流涕") {
														if (symptomData[i].degree) {
															templateData.degreeLT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeLT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "耳鸣") {
														if (symptomData[i].degree) {
															templateData.degreeEM = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeEM = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "耳聋") {
														if (symptomData[i].degree) {
															templateData.degreeEN = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeEN = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "流涎") {
														if (symptomData[i].degree) {
															templateData.degreeLY = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeLY = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "牙痛") {
														if (symptomData[i].degree) {
															templateData.degreeYaT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeYaT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "牙齿松动") {
														if (symptomData[i].degree) {
															templateData.degreeYCSD = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeYCSD = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "刷牙出血") {
														if (symptomData[i].degree) {
															templateData.degreeSYCX = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeSYCX = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "口腔异味") {
														if (symptomData[i].degree) {
															templateData.degreeKQYW = symptomData[i].degree;//程度
														}
														templateData.timeKQYW = symptomData[i].courseTime;//病程时间
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "口腔溃疡") {
														if (symptomData[i].degree) {
															templateData.degreeKQKY = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeKQKY = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "咽部疼痛") {
														if (symptomData[i].degree) {
															templateData.degreeYBTT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeYBTT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "声嘶") {
														if (symptomData[i].degree) {
															templateData.degreeSSi = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeSSi = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "心悸") {
														if (symptomData[i].degree) {
															templateData.degreeXJi = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeXJi = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "心前区不适") {
														if (symptomData[i].degree) {
															templateData.degreeXQBS = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeXQBS = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "心前区疼痛") {
														if (symptomData[i].degree) {
															templateData.degreeXQTT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeXQTT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "食欲不振") {
														if (symptomData[i].degree) {
															templateData.degreeSYBZ = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeSYBZ = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "肝区疼痛") {
														if (symptomData[i].degree) {
															templateData.degreeGQTT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeGQTT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "腹胀、腹痛") {
														if (symptomData[i].degree) {
															templateData.degreeFZFT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeFZFT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "恶心") {//恶心、呕吐
														if (symptomData[i].degree) {
															templateData.degreeEXOT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeEXOT = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "腹泻") {
														if (symptomData[i].degree) {
															templateData.degreeFX = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeFX = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "便秘") {
														if (symptomData[i].degree) {
															templateData.degreeBM = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeBM = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].projectName.replaceAll(" ", "") == "便血") {
														if (symptomData[i].degree) {
															templateData.degreeBX = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeBX = symptomData[i].courseTime;//病程时间
														}
													}
													if (symptomData[i].type && symptomData[i].type.replaceAll(" ", "") == "其他") {
														templateData.prNaQT = symptomData[i].projectName;//项目名称
														if (symptomData[i].degree) {
															templateData.degreeQT = symptomData[i].degree;//程度
														}
														if (symptomData[i].courseTime) {
															templateData.timeQT = symptomData[i].courseTime;//病程时间
														}
													}
												}

											}
										}
									} else if (_this.physicalType == "放射体检") {
										/*症状数据 放射体检*/
										//projectName项目名称 degree程度 courseTime病程时间
										let symptomData = [];//症状 数据集
										let consciousSymptoms = [];//自觉症状
										symptomData = _this.personInfo.symptom;
										if (symptomData.length > 0) {
											for (let i = 0; i < symptomData.length; i++) {
												consciousSymptoms.push({
													projectName: symptomData[i].projectName,
													degree: symptomData[i].degree,
													degreeTime: symptomData[i].courseTime,
												})
											}
										} else {
											consciousSymptoms.push({
												projectName: "无",
												degree: "",
												degreeTime: "",
											})
										}
										templateData.consciousSymptoms = consciousSymptoms;
									}
									_this.getTemplatePreviewData(templateData);
								} else {
									_this.getTemplatePreviewData(templateData);
									_this.closeParentLoading();
								}

							} else {
								_this.getTemplatePreviewData(templateData);
							}

						} else {
							_this.getTemplatePreviewData(templateData);
						}
					} else {
						_this.getTemplatePreviewData(templateData);
					}
				}

			},
			/**
			 * 关闭父组件的loading
			 */
			closeParentLoading() {
				this.$emit('closeLoading');
			},
		},
		mounted() {
			let _this = this;
			this.baseProjectIdNew = this.baseProjectId;
			if (this.personInfo && this.personInfo.orderGroupData) {

				this.orderGroupData = this.personInfo.orderGroupData;
			}
			_this.previewData = null;
			_this.init();
		},
		watch: {
			personInfo: {
				handler(n, o) {
					this.personInfo = n;
				},
				deep: true// 深度监听父组件传过来对象变化
			},
		}
	}
</script>

<style lang="less">
    .previewPrint {
        width: 100%;
        height: calc(100vh - 120px);
        /*overflow-y: auto;*/

        .footer {
            position: absolute;
            width: 100%;
            top: calc(100vh - 166px);
            float: right;
            display: flex;
        }
    }
</style>
