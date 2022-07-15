<template>
	<div class="queryStatistics">
		<Row :gutter="4" style="flex-wrap: nowrap;">
			<Col :span="outSpan">
				<Alert class="alert">人员信息</Alert>
				<Card>
					<Row :gutter="20">
						<Col span="24">
							<Form ref="queryForm" :label-width="70" inline>
								<FormItem label="体检编号">
									<Input v-model="queryFrom.testNum" placeholder="请输入体检编号" clearable></Input>
								</FormItem>
                                <FormItem label="体检单位">
                                    <Select v-model="queryFrom.orderId" label-in-value clearable style="width: 185px;">
                                        <Option v-for="item in groupOrderData" :value="item.id" :key="item.id">
                                            {{ item.groupUnitName }}
                                        </Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="身份证号" v-if="drop">
                                    <Input v-model="queryFrom.idCard" placeholder="请输入身份证号" clearable></Input>
                                </FormItem>
                                <FormItem label="体检日期" v-if="drop">
                                    <DatePicker v-model="selectDate" @on-change="registDateChange"
                                                transfer :clearable="false" placeholder="请选择"
                                                style="width: 185px;"
                                                type="daterange"></DatePicker>
                                </FormItem>
								<FormItem label="审核状态">
									<Select v-model="queryFrom.statu" label-in-value clearable style="width: 185px;">
										<Option v-for="(item,index) in approveStatus" :value="item.value" :key="index">
											{{ item.label }}
										</Option>
									</Select>
								</FormItem>
								<FormItem label="姓名" v-if="drop">
									<Input v-model="queryFrom.personName" placeholder="请输入姓名" clearable></Input>
								</FormItem>
								<FormItem label="性别" v-if="drop">
									<Select v-model="queryFrom.sex" transfer clearable style="width: 185px;">
										<Option value="男">男</Option>
										<Option value="女">女</Option>
									</Select>
								</FormItem>
                                <FormItem label="年龄" v-if="drop">
                                    <Input v-model="queryFrom.age" placeholder="请输入年龄" clearable></Input>
                                </FormItem>
								<FormItem style="margin-left:-35px" class="br">
									<Button type="primary" @click="getPersonInfo">查询</Button>
									<Button type="primary" @click="handleReset">重置</Button>
									<a class="drop-down" @click="dropDown">
										{{dropDownContent}}
										<Icon :type="dropDownIcon"></Icon>
									</a>
								</FormItem>
							</Form>
						</Col>
					</Row>
					<div class="operation" v-if="queryFrom.statu == 0">
						<Button @click="inspectAll" type="primary" icon="ios-cloud-upload">批量审核</Button>
					</div>
					<Row justify="end">
						<Table @on-row-click="tableClick" :loading="tableLoading" border :columns="columns" sortable="custom" :data="tableData"
							   @on-selection-change="showSelect" ref="table" style="width: 100%;">
							<!--<template slot-scope="{ row, index }" slot="action">
								<Button type="primary" size="small" @click.native="displayState(row)">
									<Icon type="ios-cloud-upload"/>
									审核
								</Button>
							</template>-->
						</Table>
						<Row type="flex" justify="end" class="page">
							<Page
									:current="queryFrom.pageNumber"
									:total="total"
									:page-size="queryFrom.pageSize"
									@on-change="changePage"
									@on-page-size-change="changePageSize"
									:page-size-opts="[10, 15]"
									size="small"
									show-total
									show-elevator
									show-sizer
									transfer
							></Page>
						</Row>
					</Row>
				</Card>
			</Col>
			<Col :span="outRightSpan" :style="{'padding-right': outRightSpan == 9 ? '20px':'2px'}">
				<Alert class="alert">检查详情</Alert>
				<Card class="card">
					<div style="width: 100%; height: 100%;font-size: 15px;color: #000000;text-align: center;display: flex;flex-direction: column;justify-content: center;"
						 v-if="templateShow == false">
						暂无数据
					</div>
					<div style="width: 100%; height: 100%" v-else>
						<iframe :src="previewHtmlUrl" frameborder="0" style="width: 100%; height: 100%"></iframe>
					</div>
				</Card>
			</Col>
		</Row>
		<!-- loading -->
		<Spin fix v-show="loading">
			<div class="demo-spin-icon-load">
				<!-- 这里用的是阿里图标库 -->
				<i class="iconfont icon-loader--line"></i>
			</div>
			<!-- <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon> -->
			<div style='font-size:16px'>Loading...</div>
		</Spin>
	</div>
</template>

<script>
	import {queryTGroupOrderList} from "@/api/healthy/tGroupOrder"
	import {
		queryNoCheckProjectPersonList,
		getPersonListNum,
		updateTGroupPersonAll,
		queryExamineFinishPersonList,
		queryTPastMedicalHistoryList,
		queryTPastMedicalHistoryAll,
		getTestNumGeneratorBarcode,
		testNumGeneratorBarcode
	} from "../../../api/healthy/tGroupPerson"
	import {formartDate} from "../../../api/tools/tool";
	import {exportTemplate, getTemplatePreviewData} from '@/api/healthy/tTemplate'
	import pdf from "vue-pdf";
	import {getTInspectionRecordByPersonId} from "../../../api/healthy/tInspectionRecord";
	import {
		queryAllTDepartItemResultList,
	} from "../../../api/healthy/tDepartItemResult"
	import {
		addTCertificateManage,
	} from '@/api/healthy/tCertificateManage'

	export default {
		name: "queryStatistics",
		data(){
			return {
				templateData: {},//健康证信息
				TTemplateId: '9e3099965becfd67321de4729619f33f',//模板id
				previewHtmlUrl: "",//pdf地址
				loading: false,//加载条
				templateShow: true,//模板展示
				resultData: [],//基础项目检查结果数据
				numPages: null, // pdf 总页数

				selectCount: 0, // 多选计数
				selectList: [], // 多选数据
				indeterminate: true,
				checkAll: false,
				// outLeftSpan: 4,
				outSpan: 16,
				outRightSpan: 8,
				outExpandIcon:"ios-arrow-back",
				outExpand:true,
				selectDate:null,
				radioValue: [],//是否选中
				unitAll:[],
				groupOrderData:[],//单位列表
				unitParam:{
					groupUnitName:"",
					pageNumber:1,
					pageSize:30,
					// payStatus: 1,//付费状态 0未付费 1已付费
					physicalType: '从业体检',//体检类型
				},
				queryFrom:{
					testNum:"",//体检编号
                    orderId: "",//订单id
					orderIdList:[],//订单列
					personName:"",//姓名
					sex:"",//性别
                    age: "",//年龄
					idCard:"",//身份证号
					isPass:"4",//是否通过检查 1-登记，2-在检,3-总检,4-已完成
					startDate: '',//开始时间
					endDate: '',//结束时间
					pageNumber:1,
					pageSize:10,
                    physicalType: "从业体检",//体检类型
					statu:0,//审核状态
				},
				approveStatus:[
					{
						label:"未审核",
						value:0,
					},
					{
						label:"已审核",
						value:1,
					}
				],
				total:0,
				unitLoading:false,
				tableLoading:false,
				tableData:[],
				columns:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
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
						title: '身份证号',
						align: 'center',
						minWidth: 120,
						ellipsis: true,
						tooltip: true,
						key: 'idCard',
						sortable: false
					},
					{
						title: '姓名',
						align: 'center',
						minWidth: 40,
						ellipsis: true,
						tooltip: true,
						key: 'personName',
						sortable: false
					},
					{
						title: '性别',
						align: 'center',
						minWidth: 40,
						ellipsis: true,
						tooltip: true,
						key: 'sex',
						sortable: false
					},
					{
						title: '年龄',
						align: 'center',
						minWidth: 40,
						ellipsis: true,
						tooltip: true,
						key: 'age',
						sortable: false
					},
					{
						title: '体检日期',
						align: 'center',
						minWidth: 80,
						ellipsis: true,
						tooltip: true,
						key: 'registDate',
						sortable: false,
						render:(h,params)=>{
							return h('span',formartDate(params.row.registDate, "yyyy-MM-dd"))
						}
					},
					{
						title: '是否合格',
						align: 'center',
						minWidth: 80,
						ellipsis: true,
						tooltip: true,
						key: 'isQualified',
						sortable: false/*,
						render:(h,params)=>{
							return h('span',params.row.tinspectionRecord.healthCertificateConditions)
						}*/
					},
					{
						title: '单位名称',
						align: 'center',
						minWidth: 100,
						ellipsis: true,
						tooltip: true,
						key: 'dept',
						sortable: false
					},
					{
						title: '审核状态',
						align: 'center',
						minWidth: 100,
						ellipsis: true,
						tooltip: true,
						key: 'statu',
						sortable: false,
						render: (h, params) => {
							if (params.row.statu == 1) {
								return h('div', [
									h('Button', {
										style: {
											backgroundColor: '#594c6d',
											borderColor: '#594c6d',
											borderRadius: '10px',
										},
										props: {
											type: 'success',
											size: 'small'
										}
									}, "已审核"),
								])
							} else {
								return h('div', [
									h('Button', {
										style: {
											borderRadius: '10px',
										},
										props: {
											type: 'error',
											size: 'small'
										}
									}, '未审核')
								])
							}
						}
					},
					/*{
						title: '操作',
						align: 'center',
						slot: 'action',
						width: 120,
						fixed: 'right',
					}*/
				],
				physicalFinishRate:0,
				evaluateFinishRate:0,
				drop: false,
				dropDownContent: "展开",
				dropDownIcon: "ios-arrow-down",
			}
		},
		methods:{
			/**
			 * 体检信息查询 并 获取pdf地址
			 */
			getReport() {
				this.loading = true;
				let _this = this;
				let templateData = {};

				let inspectionDoctor = '';//总检医生
				let conclusion = '';//结论

				//查询基础项目检查结果数据
				queryAllTDepartItemResultList({personId:_this.templateData.id}).then(res =>{
					if(res.success){
						_this.resultData = res.data;
						templateData.skinResults = '';//皮肤科--检查结果
						if(_this.resultData.length > 0){
							templateData.innerQT = '-';//其它--结果
							templateData.inNaQT = '';//其它--名称
							templateData.innerX = '-';//心--结果
							templateData.innerG = '-';//肝--结果
							templateData.innerP = '-';//脾--结果
							templateData.innerF = '-';//肺--结果
							for(let i = 0;i < _this.resultData.length;i ++){

								/*
								*
								* 检查医生 checkDoc
								* 检查结果 result
								* 危急程度 crisisDegree
								*
								**/

								/*表格信息 实验室检查*/
								//其他
								templateData.nameQT = '';//其他--项目名
								templateData.resultsQT = '';//其他--检查结果
								templateData.doctorQT = '';//其他--检验师
								//肝功能
								if(_this.resultData[i].orderGroupItemProjectName == "戊肝Igm(转氨酶异常的增查)"){
									templateData.resultsWG = _this.resultData[i].result;//肝功能--戊肝--检查结果
									templateData.doctorWG = _this.resultData[i].checkDoc;//肝功能--戊肝--检验师
								}
								if(_this.resultData[i].orderGroupItemProjectName == "甲肝Igm(转氨酶异常的增查)"){
									templateData.resultsJG = _this.resultData[i].result;//肝功能--甲肝--检查结果
									templateData.doctorJG = _this.resultData[i].checkDoc;//肝功能--甲肝--检验师
								}
								if(_this.resultData[i].orderGroupItemProjectName == "丙氨酸基转移酶(转氨酶)"){
									templateData.resultsZAM = _this.resultData[i].result;//肝功能--转氨酶--检查结果
									templateData.doctorZAM = _this.resultData[i].checkDoc;//肝功能--转氨酶--检验师
								}
								//大便培养
								if(_this.resultData[i].orderGroupItemProjectName == "沙门氏菌"){
									templateData.resultsSM = _this.resultData[i].result;//大便培养--沙门氏菌--检查结果
									templateData.doctorSM = _this.resultData[i].checkDoc;//大便培养--沙门氏菌--检验
								}
								if(_this.resultData[i].orderGroupItemProjectName == "志贺氏菌"){
									templateData.resultsZH = _this.resultData[i].result;//大便培养--志贺氏菌--检查结果
									templateData.doctorZH = _this.resultData[i].checkDoc;//大便培养--志贺氏菌--检验师
								}
								/*表格信息 胸部X线检查*/
								//胸部X线检查
								if(_this.resultData[i].orderGroupItemProjectName == "胸部X线透视"){
									templateData.chestResults = '胸部X线透视,' + _this.resultData[i].result;//检查结果
									templateData.chestDoctor = _this.resultData[i].checkDoc;//医生签名
								}
								/*表格信息 皮肤科*/
								//皮肤科
								if(_this.resultData[i].orderGroupItemProjectName == "手癣"){
									if(templateData.skinResults && templateData.skinResults != ''){
										templateData.skinResults += ';手癣,' + _this.resultData[i].result;///检查结果
									}else{
										templateData.skinResults = '手癣,' + _this.resultData[i].result;//检查结果
									}
									templateData.skinDoctor = _this.resultData[i].checkDoc;//医生签名
								}
								if(_this.resultData[i].orderGroupItemProjectName == "皮疹 "){
									if(templateData.skinResults && templateData.skinResults != ''){
										templateData.skinResults += ';皮疹,' + _this.resultData[i].result;///检查结果
									}else{
										templateData.skinResults = '皮疹,' + _this.resultData[i].result;//检查结果
									}
								}
								if(_this.resultData[i].orderGroupItemProjectName == "全身皮肤"){
									if(templateData.skinResults && templateData.skinResults != ''){
										templateData.skinResults += ';全身皮肤,' + _this.resultData[i].result;///检查结果
									}else{
										templateData.skinResults = '全身皮肤,' + _this.resultData[i].result;//检查结果
									}
								}
								if(_this.resultData[i].orderGroupItemProjectName == "指甲"){
									if(templateData.skinResults && templateData.skinResults != ''){
										templateData.skinResults += ';指甲,' + _this.resultData[i].result;///检查结果
									}else{
										templateData.skinResults = '指甲,' + _this.resultData[i].result;//检查结果
									}
								}
								/*表格信息 内科*/
								//内科
								if(_this.resultData[i].orderGroupItemProjectName == "心"){
									templateData.innerX = _this.resultData[i].result;//心--结果
									templateData.innerDoctor = _this.resultData[i].checkDoc;//医生签名
								}
								if(_this.resultData[i].orderGroupItemProjectName == "肝"){
									templateData.innerG = _this.resultData[i].result;//肝--结果
								}
								if(_this.resultData[i].orderGroupItemProjectName == "脾"){
									templateData.innerP = _this.resultData[i].result;//脾--结果
								}
								if(_this.resultData[i].orderGroupItemProjectName == "肺"){
									templateData.innerF = _this.resultData[i].result;//肺--结果
								}
								if(_this.resultData[i].orderGroupItemProjectName == "内科其他"){
									templateData.innerQT = _this.resultData[i].result;//内科其他--结果
								}
							}
						}

						/*头像数据*/
						let avatar= _this.templateData.avatar;
						templateData.headImg = avatar;
						/*基本信息*/
						templateData.dept = "-";//工作单位
						templateData.addressUnit = "-";//单位地址
						templateData.xm = "-";//姓名
						templateData.nl = "-";//性别
						templateData.xb = "-";//年龄
						templateData.nat = "-";//民族
						templateData.edu = "-";//文化程度
						templateData.typeW = "-";//工种
						templateData.yearW = "-";//工龄
						templateData.idCard = "-";//身份证号
						templateData.mobile = "-";//电话号码
						if(_this.templateData.dept){
							templateData.dept = _this.templateData.dept;//工作单位
						}
						if(_this.templateData.addressUnit) {
							templateData.addressUnit = _this.templateData.addressUnit;//单位地址
						}
						if(_this.templateData.personName) {
							templateData.xm = _this.templateData.personName;//姓名
						}
						if(_this.templateData.sex) {
							templateData.nl = _this.templateData.sex;//性别
						}
						if(_this.templateData.age) {
							templateData.xb = _this.templateData.age;//年龄
						}
						if(_this.templateData.nation) {
							templateData.nat = _this.templateData.nation;//民族
						}
						if(_this.templateData.education) {
							templateData.edu = _this.templateData.education;//文化程度
						}
						if(_this.templateData.workTypeText) {
							templateData.typeW = _this.templateData.workTypeText;//工种
						}
						if(_this.templateData.workYear) {
							templateData.yearW = _this.templateData.workYear;//工龄
						}
						if(_this.templateData.idCard) {
							templateData.idCard = _this.templateData.idCard;//身份证号
						}
						if(_this.templateData.mobile) {
							templateData.mobile = _this.templateData.mobile;//电话号码
						}
						templateData.testNum = _this.templateData.testNum;//体检编号

						/*表格信息*/
						templateData.registDate = _this.templateData.registDate;//体检日期
						let date = formartDate(_this.templateData.registDate,'yyyy-MM-dd');
						let dateArray = date.split('-');
						templateData.year = dateArray[0];//年(体检日期)
						templateData.month = dateArray[1];//月(体检日期)
						templateData.day = dateArray[2];//日(体检日期)
                        //查询人员的既往病史数据
						queryTPastMedicalHistoryAll({
                            personId: _this.templateData.id,
                        }).then(res =>{
                            if(res.success){
                                /*表格信息 既往病史*/
                                let pastMedicalHistoryData = [];//既往病史 数据集
                                if(res.data && res.data.length > 0){
                                    pastMedicalHistoryData = res.data;
                                }
                                if(pastMedicalHistoryData.length > 0){
                                    for(let i = 0;i < pastMedicalHistoryData.length;i ++){
                                        if(pastMedicalHistoryData[i].diseaseName == "肝炎"){
                                        	if(pastMedicalHistoryData[i].diseaseDate){
												templateData.dateGY = formartDate(pastMedicalHistoryData[i].diseaseDate,'yyyy-MM-dd');//肝炎--患病时间
											}else{
												templateData.dateGY = "-"
											}
                                        }
                                        if(pastMedicalHistoryData[i].diseaseName == "眼疾"){
                                        	if(pastMedicalHistoryData[i].diseaseDate){
												templateData.dateYJ = formartDate(pastMedicalHistoryData[i].diseaseDate,'yyyy-MM-dd');//眼疾--患病时间
											}else{
												templateData.dateYJ = "-"
											}
                                        }
                                        if(pastMedicalHistoryData[i].diseaseName == "伤寒"){
											if(pastMedicalHistoryData[i].diseaseDate){
												templateData.dateSH = formartDate(pastMedicalHistoryData[i].diseaseDate,'yyyy-MM-dd');//伤寒--患病时间
											}else{
												templateData.dateSH = "-"
											}
                                        }
                                        if(pastMedicalHistoryData[i].diseaseName == "肺结核"){
											if(pastMedicalHistoryData[i].diseaseDate){
												templateData.dateFJH = formartDate(pastMedicalHistoryData[i].diseaseDate,'yyyy-MM-dd');//肺结核--患病时间
											}else{
												templateData.dateFJH = "-"
											}
                                        }
                                        if(pastMedicalHistoryData[i].diseaseName == "皮肤病"){
											if(pastMedicalHistoryData[i].diseaseDate){
												templateData.datePFB = formartDate(pastMedicalHistoryData[i].diseaseDate,'yyyy-MM-dd');//皮肤病--患病时间
											}else{
												templateData.datePFB = "-"
											}
                                        }
                                    }
                                }else{
                                    templateData.dateGY = formartDate(new Date(),'yyyy-MM-dd');//肝炎--患病时间
                                    templateData.dateYJ = formartDate(new Date(),'yyyy-MM-dd');//眼疾--患病时间
                                    templateData.dateSH = formartDate(new Date(),'yyyy-MM-dd');//伤寒--患病时间
                                    templateData.dateFJH = formartDate(new Date(),'yyyy-MM-dd');//肺结核--患病时间
                                    templateData.datePFB = formartDate(new Date(),'yyyy-MM-dd');//皮肤病--患病时间
                                }
                                templateData.dateQT = '无';//其它--患病时间
                                templateData.contentQT = '';//其它--患病内容

								//查询人员总检记录数据
								getTInspectionRecordByPersonId({personId: _this.templateData.id}).then(res => {
									if (res.success) {
										if (res.data) {
											templateData.doctor = res.data.inspectionDoctor;//主检医生
											//总检医生签名
											inspectionDoctor = res.data.inspectionAutograph;
											//结论
											conclusion = res.data.conclusion;

											templateData.inspectResult = conclusion;//检查结果
											templateData.autograph = inspectionDoctor;//主检医师

											//获取pdf地址
											getTemplatePreviewData({id: _this.TTemplateId, templateData: JSON.stringify(templateData)}).then(res => {
												_this.loading = false;
												if (res && res.success) {
													let previewHtml = res.data.replace("template", "div");
													let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + previewHtml;
													_this.previewHtmlUrl = url;
												} else {
													_this.loading = false;
													_this.$Message.error('请求失败');
												}
											});
										}
									}
								});
                            }
                        })
					}
				});
			},
			//中间 列表行点击
			tableClick(e){
				console.log('行点击事件...');
				console.log(e);
				this.templateData = e;
				//右侧 健康证(从业人员健康检查表)
				this.getReport();
			},
			//审核状态
			displayState(row) {
				if(row.statu == 1){
					this.$Message.info('当前数据已审核！');
				}else{
					let dataFrom = row;
					dataFrom.statu = 1;
					this.$Modal.confirm({
						title: "确认要审核",
						content: "您是否要审核?",
						loading: true,
						onOk: () => {
							updateTGroupPersonAll(dataFrom).then(res => {
								this.$Modal.remove();
								if (res && res.code == 200) {
									this.$Message.success('修改成功');
								} else {
									this.$Message.error(res.msg);
								}
							}).catch(err => {
								this.$Message.error('修改审核状态失败');
							});
						},
						onCancel: () => {
							this.$Message.info('取消了当前的操作行为！');
						},
					});
				}
			},
			//显示选择
			showSelect(e) {
				this.selectList = e;
				this.selectCount = e.length;
			},
			//清空选择
			clearSelectAll() {
				this.$refs.table.selectAll(false);
			},
			//批量审核
			inspectAll() {
				let _this = this;
				if (this.selectCount <= 0) {
					this.$Message.warning('您还未选择要审核的数据');
					return;
				}
				this.$Modal.confirm({
					title: '确认审核',
					content: '您确认要审核所选的 ' + this.selectCount + '条数据?',
					loading: true,
					onOk: () => {
						let ids = [];
						let data = [];
						this.selectList.forEach(function (e) {
							if(e.statu == 1){
								_this.$Modal.remove();
								_this.$Message.warning('当前所选存在已审核数据！');
								return;
							}else{
								ids.push(e.id);
								data.push(e);
								if(ids.length == _this.selectCount){
									_this.patchInspectData(ids,data);
								}
							}
						});
					},
					onCancel: () => {
						this.$Message.info('取消了当前的操作行为！');
					}
				});
			},
			//审核（后台）
			patchInspectData(ids,data) {
				if (ids == undefined || ids == null || ids.length == 0) {
					this.$Message.error('没有选择的数据');
					return;
				}
				updateTGroupPersonAll({ids:ids}).then(res => {
					this.$Modal.remove();
					if (res && res.code == 200) {
						this.$Message.success('修改成功');
						for(let i = 0;i < data.length;i ++){
							//当前日期
							let dateNow = formartDate(new Date(),'yyyy-MM-dd');
							let dateArray = dateNow.split('-');
							let year = parseInt(dateArray[0]) + 1;//年
							let month = dateArray[1];//月
							let day = dateArray[2];//日
							//发证日期起
							let dateOfIssue = year + '-' + month + '-' + day;
							//要存入的数据
							let dataForm = data[i];
							let testNumImg = '';
							/*testNumGeneratorBarcode({personId:dataForm.id,testNum:dataForm.testNum}).then(res =>{
								if(res.success){
									testNumImg = res.data;
								}

							})*/
							let tCertificateManageForm = {
								personId:dataForm.id,
								// codeImg: testNumImg,//条形码
								results: "合格",//体检结果
								dateOfIssue: formartDate(dateNow,'yyyy-MM-dd HH:mm:ss'),//发证日期
								orderId: dataForm.orderId,//订单id
								code: dataForm.testNum,//体检编号
								name: dataForm.personName,//姓名
								sex: dataForm.sex,//性别
								age: dataForm.age,//年龄
								termOfValidity:formartDate(dateOfIssue,'yyyy-MM-dd HH:mm:ss'),//有效期
								unitOfIssue: "宜宾市翠屏区川北医院",//发证单位
							};
							//数据存入健康证管理
							addTCertificateManage(tCertificateManageForm).then(res => {
								if (res.success) {
									// this.$Message.success('保存成功');
								}else{
									this.$Message.error(res.msg);
								}
							}).finally(() => {
								this.loading = false;
							});
						}
						// 重新加载数据
						this.selectList = [];
						this.selectCount = 0;
						this.getPersonInfo();
					} else {
						this.$Message.error(res.msg);
					}
				}).catch(err => {
					this.$Message.error('修改审核状态失败');
				});
			},
			//展开 收起
			dropDown() {
				if (this.drop) {
					this.dropDownContent = "展开";
					this.dropDownIcon = "ios-arrow-down";
				} else {
					this.dropDownContent = "收起";
					this.dropDownIcon = "ios-arrow-up";
				}
				this.drop = !this.drop;
			},
			//单位查询
			inputSearchChange(e) {
				this.getGroupOrderData();
			},
			//tab切换
			tabsClick(e){
				if(e == "name1"){
					this.getPersonInfo();
				}else if(e == "name2"){

				}
			},
			//获取团检订单数据
			getGroupOrderData(type) {
				this.unitLoading = true;
				queryTGroupOrderList(this.unitParam).then(res => {
					if (res.success) {
						if (type == 'scroll') {
							this.groupOrderData = this.groupOrderData.concat(res.data.records);
						}else{
							this.groupOrderData = res.data.records;
						}
					} else {
						this.groupOrderData = [];
					}
				}).finally(()=>{
					this.unitLoading = false;
				})
			},
			//查询人员信息
			getPersonInfo(){
                this.tableLoading = true;
				queryExamineFinishPersonList(this.queryFrom).then(res =>{
                    if(res.success && res.data.records.length > 0){
                        this.tableData = res.data.records;
                        this.total = res.data.total;
                        this.templateShow = true;
                        this.templateData = this.tableData[0];
                        //右侧 健康证(从业人员健康检查表)
                        this.getReport();
                    }else{
                        this.tableData = [];
                        this.total = 0;
                        this.templateShow = false;
                    }
                }).finally(() =>{
                    this.tableLoading = false;
                })
			},
			//下拉加载更多
			handleReachBottom() {
				this.unitParam.pageNumber += 1;
				this.getGroupOrderData('scroll');
			},
			//全选
			handleCheckAll () {
				if (this.indeterminate) {
					this.checkAll = false;
				} else {
					this.checkAll = !this.checkAll;
				}
				this.indeterminate = false;

				if (this.checkAll) {
					this.templateShow = true;
					this.radioValue = this.unitAll;
					this.queryFrom.orderIdList = this.radioValue;
					this.getPersonInfo();
				} else {
					this.templateShow = false;
					this.radioValue = [];
					this.queryFrom.orderIdList = [];
					this.tableData = [];
					this.physicalFinishRate = 0;
					this.evaluateFinishRate = 0;
				}
			},
			//单位选择
			unitChange(data){
				if (data.length === this.unitAll.length) {
					this.indeterminate = false;
					this.checkAll = true;
					this.templateShow = true;
				} else if (data.length > 0) {
					this.indeterminate = true;
					this.checkAll = false;
					this.templateShow = true;
				} else {
					this.indeterminate = false;
					this.checkAll = false;
					this.templateShow = false;
				}
				this.queryFrom.orderIdList = data;
				if(data.length > 0){
					this.getPersonInfo();
				}else{
					this.physicalFinishRate = 0;
					this.evaluateFinishRate = 0;
					this.tableData = [];
					this.$Message.info("请选择单位");
				}
			},
			//体检日期改变
			registDateChange(v){
				if (v) {
					this.queryFrom.startDate = v[0];
					this.queryFrom.endDate = v[1];
				}
			},
			//搜索条件重置
			handleReset() {
				this.queryFrom.testNum = '',
				this.queryFrom.orderId = '',
				this.queryFrom.personName = '',
                this.queryFrom.sex = '',
                this.queryFrom.age = '',
                this.queryFrom.idCard = '',
                this.queryFrom.pageNumber = 1;
				this.queryFrom.pageSize = 10;
				this.queryFrom.statu = 0;
				this.selectDate = null;
				this.selectCount = 0;
				this.selectList = [];
				this.queryFrom.startDate = '';
				this.queryFrom.endDate = '';
				this.queryFrom.endDate = '';
				// 重新加载数据
				this.getPersonInfo();
			},
			//人员检查项目页数改变
			changePage(v) {
				this.queryFrom.pageNumber = v;
				this.getPersonInfo();
			},
			//人员检查项目展示条数改变
			changePageSize(v) {
				this.queryFrom.pageSize = v;
				this.getPersonInfo();
			},
			outChangeExpand(){
				this.outExpand = !this.outExpand;
				if (this.outExpand) {
					this.outExpandIcon = "ios-arrow-back";
					this.outSpan = 12;
					this.outLeftSpan = 4;
					this.outRightSpan = 8;
				} else {
					this.outExpandIcon = "ios-arrow-forward";
					this.outSpan = 15;
					this.outLeftSpan = 1;
					this.outRightSpan = 9;
				}
			},
		},
		mounted() {
		    //获取订单数据
			this.getGroupOrderData();
			//获取人员数据
            this.getPersonInfo();
		}
	}
</script>

<style lang="less">
	@import "../../../styles/tree&table-common.less";
	.queryStatistics {
		padding: 10px;
		box-sizing: border-box;
		height: 100%;

		.card {
			height: calc(100vh - 60px - 40px - 22px);
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			overflow: hidden;

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
			.radio-group {
				width: 100%;
				font-size: 13px;
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
			.empty {
				text-align: center;
				color: #515a6e;
				margin-top: 20px;
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
			font-weight: 600;
		}

		.ivu-card-body {
			padding: 16px;
			height: 100%;
		}
	}
</style>
