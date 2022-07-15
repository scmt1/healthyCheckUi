<style lang="less">
    .tLisData {
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
    }
</style>
<template>
    <Modal v-model="show" :title="editTitle" class="tLisData" :mask-closable="false">
        <Form ref="tLisDataForm" :model="tLisDataForm" :rules="tLisDataFormRule" :label-width="90" style="padding-right: 15px;">
			<Row>
				<Col span="12">
					<FormItem label="识别码" prop="code">
						<Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tLisDataForm.code"
							   placeholder="请输入编号"/>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="设备类型" prop="type">
						<Select v-bind:disabled="disabled" v-model="tLisDataForm.type" placeholder="请选择" clearable>
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
							   v-model="tLisDataForm.equipmentManufacturerModel" placeholder="请输入设备厂商型号"/>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="检查者" prop="personName">
						<Input v-bind:disabled="disabled" type="text" :maxlength=50
							   v-model="tLisDataForm.personName" placeholder="请输入检查者"/>
					</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
					<FormItem label="检查项目" prop="item">
						<Input v-bind:disabled="disabled" type="text" :maxlength=50
							   v-model="tLisDataForm.item" placeholder="请输入检查项目"/>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="监测时间" prop="timeTime">
						<DatePicker v-bind:disabled="disabled" style="width:100%;" type="datetime" placeholder="请输入监测时间"
									v-model="tLisDataForm.time " @on-change="setTime"
									format="yyyy-MM-dd HH:mm:ss"></DatePicker>
					</FormItem>
				</Col>
			</Row>

            <FormItem label="数据" prop="data">
                <!--						<Input v-bind:disabled="disabled"  :rows="3" type="textarea"  v-model="tLisDataForm.data" placeholder="请输入数据"/>-->
                <vue-json-viewer :expand-depth="5" boxed sort :value="tLisDataForm.data"></vue-json-viewer>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handSubmit" v-if="!disabled">提交</Button>
        </div>
    </Modal>
</template>
<script>
	import {addTLisData, updateTLisData, getTLisData} from '@/api/healthy/tLisData'
	import {getDictDataByType} from '@/api/index';
	import vueJsonViewer from 'vue-json-viewer';

	export default {
		name: "updateTLisData",
		components: {
			vueJsonViewer,
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			TLisDataId: {
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
				tLisDataForm: {
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
				tLisDataFormRule: this.getTLisDataFormRule()
			}
		},
		methods: {
			setTime(e) {
				this.tLisDataForm.time = e;
			},
			handSubmit() {
				this.$refs['tLisDataForm'].validate((valid) => {
					this.loading = true;
					if (valid) {
						this.tLisDataForm.data = JSON.stringify(this.tLisDataForm.data);
						if (this.TLisDataId != null && this.TLisDataId.trim().length > 0) {
							this.tLisDataForm.id = this.TLisDataId;
							updateTLisData(this.tLisDataForm).then(res => {
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
							addTLisData(this.tLisDataForm).then(res => {
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
				this.tLisDataForm = {
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
			getTLisDataFormRule() {
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
					getDictDataByType('t_lis_data_type').then(res => {
						if (res.success) {
							this.specimenPriority = res.data;
						}
					});
					this.$refs['tLisDataForm'].resetFields();
					this.$refs['tLisDataForm'].id = null;
					if (this.TLisDataId != null && this.TLisDataId.trim().length > 0) {
						let _this = this;
						getTLisData({id: _this.TLisDataId}).then(res => {
							if (res.success) {
								_this.tLisDataForm = res.data;
								_this.tLisDataForm.timeTime = res.data.time;
								_this.tLisDataForm.data = JSON.parse(res.data.data.replace("\\", ""));
								_this.tLisDataForm.typeName="-";

								getDictDataByType('t_lis_data_type').then(res => {
									if (res.success) {
										let tLisDataTypes = res.data;
										if(tLisDataTypes && tLisDataTypes.length>0){
											let tab = tLisDataTypes.filter(i => i.value == _this.tLisDataForm.type);
											if(tab&&tab.length>0){
												_this.tLisDataForm.typeName = tab[0].title;
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
