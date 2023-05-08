<template>
    <Modal v-model="show" :title="modalTitle" class="physicalRegisterUpload" :mask-closable="false">
        <div class="wrapper" id="excel">
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
<!--                    <vxe-column field="errorTxt" title="错误原因" align="center" />-->
                </vxe-table>
            </Row>
            <Row class="margin-top-10" v-else>
                <Table :columns="tableTitle" :data="tableData" :loading="tableLoading" max-height="400"/>
                <!--暂无数据-->
<!--                <no-data width="150" style="height: calc(100vh - 83px);overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>-->
            </Row>
        </div>
        <div slot="footer">
            <Button type="text" @click="closeAllModal">取消</Button>
            <Button type="primary" v-if="tablePersonData && tablePersonData.length>0" :loading="uploadLoading" @click="exportData">导出</Button>
<!--            <Button type="primary" v-else :loading="uploadLoading" @click="handSubmit" >确定</Button>-->
        </div>
    </Modal>
</template>

<script>
	import excelUtil from './common/excel'
	import {getDictDataByType} from "../../../api";
	import {queryProTypeByTypeCode} from "../../../api/healthy/tProType";
	import {queryAllTGroupUnitList} from "../../../api/healthy/tGroupUnit";
	import {importExcelBatch,getTGroupNoPersonByOrderId} from "../../../api/healthy/tGroupPerson";
	import {getTOrderGroupByGroupOrderId} from "../../../api/healthy/tOrderGroup";
    import noData from "../../../components/no-data"

	export default {
		name: "noPersonExportUpload",
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
			    title:"未登记人员导出",
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
				    let cotent = "未登记";
                    if(this.modalTitle=="未登记人员导出"){
                        cotent = "未登记";
                    }else if(this.modalTitle=="已登记人员导出"){
                        cotent = "已登记";
                    }else if(this.modalTitle=="已登记未体检完人员导出"){
                        cotent = "已登记未体检完";
                    }
					this.$Modal.confirm({
						title: "确认关闭",
						content: "您确认已导出"+cotent+"人员信息?",
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
                importExcelBatch(_this.personParam).then(res => {
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

							let personName = item[this.tableTitle[0].key];
							let idCard = item[this.tableTitle[1].key];
							let mobile = item[this.tableTitle[2].key];
							let hazardFactorsText = item[this.tableTitle[3].key];
							let otherHazardFactors = item[this.tableTitle[4].key];
							let workTypeText =item[this.tableTitle[5].key];
							let workName = item[this.tableTitle[6].key];
							let workStateText = item[this.tableTitle[7].key];
							let department = item[this.tableTitle[8].key];
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
			//查询所有企业
			queryAllTGroupUnitList(){
				queryAllTGroupUnitList({physicalType:this.physicalType}).then(res => {
					if (res && res.success) {
						this.unitArr = res.data;
					}
				});
			},
			//单位选择
			unitSelect(e) {
				if (e) {
					this.personParam.unitId = e.value;
					this.personParam.dept = e.label;
				}

			},
			//查询当前订单的所有的分组
			queryGroupByOrderId(orderId){
				this.groupList = [];
				getTOrderGroupByGroupOrderId({groupOrderId:orderId}).then(res => {
					if (res && res.success) {
						this.groupList = res.data;
					}
					else {
						this.$Message.error("查询分组信息失败");
					}
				}).finally(() => {

				});
			},
			//分组改变
			groupChange(v){
				this.personParam.oldGroupId = v;
			},
			//模板下载
			handleCreateA() {
				let oA = document.createElement("a");
				if (this.physicalType == '职业体检') {
					oA.href = "/excel/职业体检导入模板.xlsx";
				} else if (this.physicalType == '健康体检') {
					oA.href = "/excel/健康体检导入模板.xlsx";
				} else if (this.physicalType == '放射体检') {
                    oA.href = "/excel/放射体检导入模板.xlsx";
                }
				oA.click();
				window.URL.revokeObjectURL(oA.href);
			},
			//导出错误数据
			exportData() {
			    let info = "未登记人员数据";
                if(this.modalTitle=="未登记人员导出"){
                    info = "未登记人员数据";
                }else if(this.modalTitle=="已登记人员导出"){
                    info = "已登记人员数据";
                }else if(this.modalTitle=="已登记未体检完人员导出"){
                    info = "已登记未体检完人员数据";
                }
				if(this.$refs["tabsValue"]){
					this.$refs["tabsValue"].exportData({
						filename: info,
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
			    let isPass = 1;
			    if(this.modalTitle=="未登记人员导出"){
                    isPass = 1;
                }else if(this.modalTitle=="已登记人员导出"){
                    isPass = 99;
                }else if(this.modalTitle=="已登记未体检完人员导出"){
                    isPass = 2;
                }
				if(val){
					this.uploadLoading = false;
					if( this.orderId && this.orderId.trim().length>0){
                        this.tablePersonData = [];
                        getTGroupNoPersonByOrderId({orderId:this.orderId,isPass: isPass}).then(res => {
                            if (res && res.success) {
                                this.tablePersonData = res.data;
                            }
                            else {
                                this.$Message.error("查询未登记人员信息失败");
                            }
                        }).finally(() => {

                        });
					}
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