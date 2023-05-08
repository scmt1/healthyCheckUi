<template>
    <Modal v-model="show" title="批量导入" class="physicalRegisterUpload" :mask-closable="false">
        <div class="wrapper" id="excel">
            <Card >
                <Row>
                    <Upload :before-upload="handleBeforeUpload" action="" accept=".xls, .xlsx,.csv">
                        <Button  type="primary" :loading="uploadLoading" icon="ios-cloud-upload-outline" @click="handleUploadFile">
                            批量导入数据
                        </Button>
                    </Upload>
                    <Button type="info" @click="downloadTemplateWord">模板下载</Button>
                </Row>
                <Row>
                    <div v-if="file !== null" class="ivu-upload-list-file">
                        <Icon type="ios-stats"/>
                        {{ file.name }}
                        <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove"
                              @click.native="handleRemove()"/>
                    </div>
                </Row>
                <Row>
                    <transition name="fade">
                        <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
                            <div v-if="progressPercent == 100">
                                <Icon type="ios-checkmark-circle"/>
                                <span>成功</span>
                            </div>
                        </Progress>
                    </transition>
                </Row>
            </Card>

            <Row v-if="tablePersonData && tablePersonData.length>0">
                <vxe-table  ref="tabsValue"  border resizable :data="tablePersonData" :max-height="400" >
                    <vxe-column field="personName" title="姓名" align="center" />
                    <vxe-column field="idCard" title="证件号" align="center" />
                    <vxe-column field="mobile" title="手机号" align="center" />
                    <vxe-column field="hazardFactorsText" title="危害因素" align="center" />
                    <vxe-column field="otherHazardFactors" title="其他危害因素" align="center" />
                    <vxe-column field="workTypeText" title="工种名称" align="center" />
                    <vxe-column field="workName" title="其他工种名称" align="center" />
                    <vxe-column field="workStateText" title="在岗状态" align="center" />
                    <vxe-column field="department" title="部门" align="center" />
                    <vxe-column field="errorTxt" title="错误原因" align="center" />
                </vxe-table>
            </Row>
            <Row class="margin-top-10" v-else>
                <Table :columns="tableTitle" :data="tableData" :loading="tableLoading" max-height="400"/>
            </Row>
        </div>
        <div slot="footer">

            <Button type="text" @click="closeAllModal">取消</Button>
            <Button type="primary" v-if="tablePersonData && tablePersonData.length>0" @click="exportData">错误数据下载</Button>
            <Button type="primary" v-else :loading="uploadLoading" @click="handSubmit" >确定</Button>
        </div>
    </Modal>
</template>

<script>
	import excelUtil from './common/excel'
	import {importExcelBatch,downloadTemplateInquiry as downloadTemplate,importExcelByTemplateInquiry as importExcelByTemplate} from "../../../api/healthy/tGroupPerson";
	export default {
		name: "excelUploadTemplateInquiry",
		props: {
			value: {
				type: Boolean,
				default: false
			},
			modalTitle: {
				type: String
			},
			physicalType: {
				type: String
			},
			orderId: {
				type: String
			}
		},
		computed: {
		},
		data() {
			return {
				uploadLoading: false,
				progressPercent: 0,
				showProgress: false,
				showRemoveFile: false,
				file: null,
				tableData: [],
				tableTitle: [],
				tableLoading: false,
				show: false,
				personParam:{},
				personParamRule: {
					isAddOrder: [
						{required: true,type: 'string', message: '是否新增订单不能为空！', trigger: 'change'},
					],

					unitId: [
						{required: true,type: 'string', message: '单位名称不能为空！', trigger: 'change', pattern: /.+/},
					],
					groupId: [
						{required: true,type: 'string', message: '分组不能为空！', trigger: 'change', pattern: /.+/},
					],
					isAddGroup: [
						{required: true,type: 'string', message: '是否默认分组不能为空！', trigger: 'change', pattern: /.+/},
					]
				},
				unitArr:[],
				personInfoList:[],
				saveLoading:false,
				tablePersonData:[]
			}
		},
		components: {},
		methods: {
			initUpload() {
				this.file = null;
				this.showProgress = false;
				this.tableData = [];
				this.tableTitle = [];
				this.unitArr = [];
				this.tablePersonData = [];
			},
			handleUploadFile() {
				this.initUpload()
			},
			handleRemove() {
				this.initUpload();
				this.$Message.info('上传的文件已删除！')
			},
			handleBeforeUpload(file) {
				const fileExt = file.name.split('.').pop().toLocaleLowerCase()
				if (fileExt === 'xlsx' || fileExt === 'xls' || fileExt === 'csv') {
					this.readFile(file)
					this.file = file
				} else {
					this.$Notice.warning({
						title: '文件类型错误',
						desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
					})
				}
				return false
			},
			// 读取文件
			readFile(file) {
				const reader = new FileReader();
				// const reader = new FileReaderSync();
				reader.readAsArrayBuffer(file);
				reader.onloadstart = e => {
					this.uploadLoading = true;
					this.tableLoading = true;
					this.showProgress = true;
				};
				reader.onprogress = e => {
					this.progressPercent = Math.round(e.loaded / e.total * 100)
				};
				reader.onerror = e => {
					this.$Message.error('文件读取出错');
				};
				reader.onload = e => {
					this.$Message.info('文件读取成功');
					const data = e.target.result;
					const {header, results} = excelUtil.read(data, 'array');
					const tableTitle = header.map(item => {
						return {title: item, key: item,ellipsis: true,tooltip: true,}
					});
					this.tableData = results;
					this.tableTitle = tableTitle;
					this.uploadLoading = false;
					this.tableLoading = false;
					this.showRemoveFile = true;
				}
			},
			closeAllModal() {//关闭
				if(this.tablePersonData.length>0){
					this.$Modal.confirm({
						title: "确认关闭",
						content: "您确认已下载返回的导入错误数据?",
						loading: true,
						onOk: () => {
							this.$Modal.remove();
							this.closeModal(false);
						},
						onCancel: () => {
							this.$Message.info('取消了当前的操作行为！');
						},
					});
				}
				else{
					this.closeModal(false);
				}

			},
			closeModal(val) {
				this.$emit('input', val);
				this.$emit('handleSearch');//上传完毕后再重新渲染表格
			},
			handSubmit(){
				this.uploadLoading = true;
				let _this = this;
				_this.tablePersonData = [];
                _this.personListChange(_this.tableData);
                if(_this.personInfoList && _this.personInfoList.length>0){
                    _this.personParam.personInfoList = _this.personInfoList;
                }
                else {
                    _this.$Message.error("请先导入人员数据！");
                    _this.uploadLoading = false;
                    return;
                }
				if(_this.orderId &&  _this.orderId.trim().length>0){
					_this.personParam.orderId  = _this.orderId;

				}
				importExcelByTemplate(_this.personParam).then(res => {
                    if(res &&res.success ){
                        if ( res.data && res.data.length>0) {
                            _this.tablePersonData = res.data;

                        }
                        else{
                            _this.$Message.success("保存！");
                            this.closeModal(false);
                        }
                    }
                    else{
                        _this.$Message.error("保存失败！");
                    }

                }).finally(() => {
                    _this.uploadLoading = false;
                });

			},
			/**
			 * 人员数据整理
			 * @param data
			 * @param cloumn
			 */
			personListChange(data){

				let patchPersonData=data;
				this.personInfoList = [];
				//循环获取人员数据
				if(patchPersonData && patchPersonData .length>0){
					for (let i = 0; i <patchPersonData.length ; i++) {
						let item = patchPersonData[i];
						if(item){

                            let personName = this.tableTitle && this.tableTitle[0] ? item[this.tableTitle[0].key] : '';
                            let idCard = this.tableTitle && this.tableTitle[1] ? item[this.tableTitle[1].key] : '';
                            let mobile = this.tableTitle && this.tableTitle[2] ? item[this.tableTitle[2].key] : '';
                            let hazardFactorsText = this.tableTitle && this.tableTitle[3] ? item[this.tableTitle[3].key] : '';
                            let otherHazardFactors = this.tableTitle && this.tableTitle[4] ? item[this.tableTitle[4].key] : '';
                            let workTypeText = this.tableTitle && this.tableTitle[5] ? item[this.tableTitle[5].key] : '';
                            let workName = this.tableTitle && this.tableTitle[6] ? item[this.tableTitle[6].key] : '';
                            let workStateText = this.tableTitle && this.tableTitle[7] ? item[this.tableTitle[7].key] : '';
                            let department = this.tableTitle && this.tableTitle[8] ? item[this.tableTitle[8].key] : '';
							let education = this.tableTitle && this.tableTitle[9] ? item[this.tableTitle[9].key] : '';
							let isMarry = this.tableTitle && this.tableTitle[10] ? item[this.tableTitle[10].key] : '';
							let workYear = this.tableTitle && this.tableTitle[11] ? item[this.tableTitle[11].key] : '';
							let workMonth = this.tableTitle && this.tableTitle[12] ? item[this.tableTitle[12].key] : '';
							let exposureWorkYear = this.tableTitle && this.tableTitle[13] ? item[this.tableTitle[13].key] : '';
							let exposureWorkMonth = this.tableTitle && this.tableTitle[14] ? item[this.tableTitle[14].key] : '';
							let dept = this.tableTitle && this.tableTitle[15] ? item[this.tableTitle[15].key] : '';
							let sex = null;
							let age = null;
							let birth = null;
							let personData = {
								personName : personName,
								workStateText : workStateText,
								workTypeText : workTypeText,
								sex : sex,
								hazardFactorsText : hazardFactorsText,
								mobile : mobile,
								idCard : idCard,
								age : age,
								birth : birth,
								workName : workName,
								otherHazardFactors:otherHazardFactors,
								physicalType:this.physicalType,
                                department:department,
								education:education,
								isMarry:isMarry,
								workYear:workYear,
								workMonth:workMonth,
								exposureWorkYear:exposureWorkYear,
								exposureWorkMonth:exposureWorkMonth,
								dept:dept,
							};
							this.personInfoList.push(personData);
						}

					}
				}
				else{
					this.addShow = true;
				}
			},
			initPersonInfo(){
				this.personParam = {
					testNum: '',
					idCard: '',
					personName: '',
					unitId: '',
					dept: '',
					sex: '',
					age: '',
					mobile: '',
					physicalType: this.physicalType,
					birth: '',
					isMarry: '',
					workNum: '',
					workYear: '',
					workMonth: '',
					exposureWorkYear: '',
					exposureWorkMonth: '',
					workTypeText: '',
					workStateCode: '',
					workStateText: "",
					exposureStartDate: '',
					workTypeCode: '',
					jcType: '1',
					orderId: "",
					groupId: "",
					hazardFactors: "",
					hazardFactorsText: "",
					otherHazardFactors:"",
					workName: "",
					isAddOrder:"1",
					isAddGroup:"2",
				};
			},

			//模板下载
			downloadTemplateWord() {
				let _this = this;
				let fileName = "体检系统导入模板.xlsx"
				downloadTemplate({orderId: this.orderId}).then(res => {
					let content = res;
					let blob = new Blob([content], {type: 'application/ms-excel'});
					_this.btnLoading = false;
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
			//导出错误数据
			exportData() {
				if(this.$refs["tabsValue"]){
					this.$refs["tabsValue"].exportData({
						filename: '错误数据',
						sheetName: 'Sheet1',
						type: 'xlsx',
						types: ['xlsx', 'csv', 'html', 'xml', 'txt'],
						useStyle: true, //是否导出样式
						isFooter: false, //是否导出表尾（比如合计）
					})
				}
			},

		},
		async mounted() {

		},
		watch: {
			value(val) {
				this.show = val;
			},
			async show(val) {
				if(val){
					this.uploadLoading = false;
					this.initUpload();
					this.initPersonInfo();
					this.tablePersonData = [];
				}else {
					this.closeModal(val);
				}
			}
		}
	}
</script>

<style lang="less">
    .physicalRegisterUpload{
        .ivu-modal {
            min-width: 90vw !important;
        }
        .ivu-table table {
            width: 100% !important;
        }
        .vxe-table{
            width: 100% !important;
        }
    }

</style>