<style lang="less">
	.tPacsData {
		.ivu-modal {
			width: 880px !important;
		}

		.jv-container.jv-light {
			white-space: nowrap;
			font-size: 14px;
			font-family: Consolas, Menlo, Courier, monospace;
			background-color: #f3f3f3;
			opacity: 1;
			cursor: not-allowed;
			color: #ccc;
			max-height: 400px;
			overflow: auto;
		}
		.imagesClass{
			img{
				width: 50px;
				height: 50px;
			}
			max-height: 300px;
			overflow-y: auto;
		}
	}
</style>
<template>
	<Modal v-model="show" :title="editTitle" class="tPacsData" :mask-closable="false">
		<Form ref="tPacsDataForm" :model="tPacsDataForm" :rules="tPacsDataFormRule" :label-width="90" style="padding-right: 15px;">
			<Row>
				<Col span="12">
					<FormItem label="识别码" prop="code">
						<Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tPacsDataForm.code"
							   placeholder="请输入编号"/>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="设备类型" prop="type">
						<Select v-bind:disabled="disabled" v-model="tPacsDataForm.type" placeholder="请选择" clearable>
							<Option v-for="(item, i) in specimenPriority" :key="item.id" :value="item.value">{{ item.title }}
							</Option>
						</Select>
					</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
					<FormItem label="设备型号" prop="equipmentManufacturerModel">
						<Input v-bind:disabled="disabled" type="text" :maxlength=50
							   v-model="tPacsDataForm.equipmentManufacturerModel" placeholder="请输入设备厂商型号"/>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="检查者" prop="personName">
						<Input v-bind:disabled="disabled" type="text" :maxlength=50
							   v-model="tPacsDataForm.personName" placeholder="请输入检查者"/>
					</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
					<FormItem label="检查项目" prop="item">
						<Input v-bind:disabled="disabled" type="text" :maxlength=50
							   v-model="tPacsDataForm.item" placeholder="请输入检查项目"/>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="监测时间" prop="timeTime">
						<DatePicker v-bind:disabled="disabled" style="width:100%;" type="datetime" placeholder="请输入监测时间"
									v-model="tPacsDataForm.time " @on-change="setTime"
									format="yyyy-MM-dd HH:mm:ss"></DatePicker>
					</FormItem>
				</Col>
			</Row>

			<FormItem label="图片" prop="data">
				<viewer :images="images" class="imagesClass">
					<img v-for="(item,i) in images" :src="'/tempFileUrl/'+item.imgPath" :key="i">
				</viewer>
			</FormItem>

		</Form>
		<div slot="footer">
			<Button type="text" @click="show=false">取消</Button>
			<Button type="primary" :loading="loading" @click="handSubmit" v-if="!disabled">提交</Button>
		</div>
	</Modal>
</template>
<script>
	import {addTPacsData, updateTPacsData, getTPacsData} from '@/api/healthy/tPacsData'
	import {getDictDataByType} from '@/api/index';
	import vueJsonViewer from 'vue-json-viewer';

	export default {
		name: "updateTPacsData",
		components: {
			vueJsonViewer,
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			TPacsDataId: {
				type: String
			},
			modalTitle: {
				type: String
			}
		},
		data() {
			return {
				specimenPriority: [],
				show: this.value,
				editTitle: this.modalTitle,
				loading: true,
				disabled: false,
				tPacsDataForm: {
					code: '',
					data: '',
					timeTime: '',
					time: '',
					equipmentManufacturerModel: '',
					remark: '',
					type:"",
					personName: '',//检查者
					item: '',//检查项目
					typeName:"",
				},
				tPacsDataFormRule: this.getTPacsDataFormRule(),
				images:[],//图片集合
			}
		},
		methods: {
			setTime(e) {
				this.tPacsDataForm.time = e;
			},
			handSubmit() {
				this.$refs['tPacsDataForm'].validate((valid) => {
					this.loading = true;
					if (valid) {
						this.tPacsDataForm.data = JSON.stringify(this.tPacsDataForm.data);
						if (this.TPacsDataId != null && this.TPacsDataId.trim().length > 0) {
							this.tPacsDataForm.id = this.TPacsDataId;
							updateTPacsData(this.tPacsDataForm).then(res => {
								if (res.success) {
									this.closeModal(false);
									this.$emit('handSearch');
									this.$Message.success('保存成功');
								} else {
									this.$Message.error(res.msg);
								}
							}).finally(() => {
								this.loading = false;
							});
						} else {
							addTPacsData(this.tPacsDataForm).then(res => {
								if (res.success) {
									this.closeModal(false);
									this.$emit('handSearch');
									this.$Message.success('保存成功');
								} else {
									this.$Message.error(res.msg);
								}
							}).finally(() => {
								this.loading = false;
							});
						}
					} else {
						this.loading = false;
						this.$Message.error('表单验证不通过！');
					}
				});
			},
			closeModal(val) {
				this.$emit('input', val);
			},
			initForm() {
				this.images = [];
				this.tPacsDataForm = {
					code: '',
					data: '',
					timeTime: '',
					time: '',
					equipmentManufacturerModel: '',
					remark: '',
					type:"",
					personName: '',//检查者
					item: '',//检查项目
					typeName:""
				};
			},
			getTPacsDataFormRule() {
				return {
					code: [
						{required: true, message: '编号不能为空！', trigger: 'blur'},
						{type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
					],
					data: [
						{required: true, message: '数据不能为空！', trigger: 'blur', pattern: /.+/},
					],
					// timeTime: [
					// 	{required: true, message: '监测时间不能为空！', trigger: 'blur', pattern: /.+/},
					// ],
					// equipmentManufacturerModel: [
					// 	{required: true, message: '设备厂商型号不能为空！', trigger: 'blur'},
					// 	{type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
					// ],
					// type: [
					// 	{required: true, message: '设备类型不能为空！', trigger: 'blur'},
					// 	{type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
					// ],
					// item: [
					// 	{required: true, message: '检查项目不能为空！', trigger: 'blur'},
					// 	{type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
					// ],
					// personName: [
					// 	{required: true, message: '检查者不能为空！', trigger: 'blur'},
					// 	{type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
					// ],
					// remark: [
					// 	{required: true, message: '备注不能为空！', trigger: 'blur', pattern: /.+/},
					// ],
				}
			}
		},
		watch: {
			value(val) {
				this.show = val;
			},
			show(val) {
				this.initForm();
				this.loading = false;
				this.editTitle = this.modalTitle;
				if (this.editTitle == "查看") {
					this.disabled = true;
				} else {
					this.disabled = false;
				}
				if (val) {
					getDictDataByType('t_pacs_data_type').then(res => {
						if (res.success) {
							this.specimenPriority = res.data;
						}
					});
					this.$refs['tPacsDataForm'].resetFields();
					this.$refs['tPacsDataForm'].id = null;
					if (this.TPacsDataId != null && this.TPacsDataId.trim().length > 0) {
						let _this = this;
						getTPacsData({id: _this.TPacsDataId}).then(res => {
							if (res.success) {
								_this.tPacsDataForm = res.data;
								_this.tPacsDataForm.timeTime = res.data.time;
								_this.tPacsDataForm.data = JSON.parse(res.data.data.replace("\\", ""));
								_this.tPacsDataForm.typeName="-";
								_this.tPacsDataForm.personName=res.data.personName && res.data.personName!="null"?res.data.personName:"";
								if(res.data.data && res.data.data.length>0){
									_this.images = res.data.data.filter(i => i.type == "image");
								}

								getDictDataByType('t_pacs_data_type').then(res => {
									if (res.success) {
										let tPacsDataTypes = res.data;
										if(tPacsDataTypes && tPacsDataTypes.length>0){
											let tab = tPacsDataTypes.filter(i => i.value == _this.tPacsDataForm.type);
											if(tab&&tab.length>0){
												_this.tPacsDataForm.typeName = tab[0].title;
												_this.$forceUpdate();
											}
										}
									}
								})
							} else {
								this.$Message.error(res.msg);
							}
						});
					}
				} else {
					this.closeModal(val);
				}
			}
		}
	}
</script>
