<style lang="less">
	.tCertificateManage{
		.ivu-modal {
			width: 660px !important;
		}
	}
</style>
<template>
	<Modal v-model="show" :title="editTitle" class="tCertificateManage"  :mask-closable="false">
		<Form ref="tCertificateManageForm" :model="tCertificateManageForm" :rules="tCertificateManageFormRule" :label-width="100">
					<FormItem label="编号" prop="code">
						<Input v-bind:disabled="disabled"  type="text" :maxlength=50 v-model="tCertificateManageForm.code" placeholder="请输入编号"/>
					</FormItem>
					<FormItem label="姓名" prop="name">
						<Input v-bind:disabled="disabled"  type="text" :maxlength=50 v-model="tCertificateManageForm.name" placeholder="请输入姓名"/>
					</FormItem>
					<FormItem label="性别" prop="sex">
						<Input v-bind:disabled="disabled"  type="text" :maxlength=50 v-model="tCertificateManageForm.sex" placeholder="请输入性别"/>
					</FormItem>
					<FormItem label="年龄" prop="age">
						<Input v-bind:disabled="disabled"  type="text" :maxlength=50 v-model="tCertificateManageForm.age" placeholder="请输入年龄"/>
					</FormItem>
					<FormItem label="有效期" prop="term_of_validity">
						<Input v-bind:disabled="disabled"  type="text" :maxlength=50 v-model="tCertificateManageForm.termOfValidity" placeholder="请输入有效期"/>
					</FormItem>
					<FormItem label="发证单位" prop="unit_of_issue">
						<Input v-bind:disabled="disabled"  type="text" :maxlength=50 v-model="tCertificateManageForm.unitOfIssue" placeholder="请输入发证单位"/>
					</FormItem>
		</Form>
		<div slot="footer">
			<Button type="text" @click="show=false">取消</Button>
			<Button type="primary" :loading="loading" @click="handSubmit" v-if="!disabled">提交</Button>
		</div>
	</Modal>
</template>
<script>
	import {addTCertificateManage,updateTCertificateManage,getTCertificateManage} from '@/api/healthy/tCertificateManage'
	import { getDictDataByType } from '@/api/index';
	export default {
		name: "updateTCertificateManage",
		props: {
			value: {
				type: Boolean,
				default: false
			},
			TCertificateManageId: {
				type: String
			},
			modalTitle: {
				type: String
			}
		},
		data() {
			return {
				show: this.value,
				editTitle: this.modalTitle,
				loading: true,
				disabled:false,
				tCertificateManageForm: {
					code:'',
					name:'',
					sex:'',
					age:'',
					termOfValidity:'',
					unitOfIssue:'',
				},
				tCertificateManageFormRule: this.getTCertificateManageFormRule()
			}
		},
		methods: {
			handSubmit() {
				this.$refs['tCertificateManageForm'].validate((valid) => {
					this.loading = true;
					if (valid) {
						if(this.TCertificateManageId!=null&&this.TCertificateManageId.trim().length>0){
							this.tCertificateManageForm.id=this.TCertificateManageId;
							updateTCertificateManage(this.tCertificateManageForm).then(res => {
								if (res.success) {
									this.closeModal(false);
									this.$emit('handSearch');
									this.$Message.success('保存成功');
								}else{
									this.$Message.error(res.msg);
								}
							}).finally(() => {
								this.loading = false;
							});
						}else{
							addTCertificateManage(this.tCertificateManageForm).then(res => {
								if (res.success) {
									this.closeModal(false);
									this.$emit('handSearch');
									this.$Message.success('保存成功');
								}else{
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
			initForm(){
				this.tCertificateManageForm= {
					code:'',
					name:'',
					sex:'',
					age:'',
					termOfValidity:'',
					unitOfIssue:'',
				};
			},
			getTCertificateManageFormRule() {
				return {
					code: [
						{required: true, message: '编号不能为空！', trigger: 'blur',pattern: /.+/ },
					],
					name: [
						{required: true, message: '姓名不能为空！', trigger: 'blur',pattern: /.+/ },
					],
					sex: [
						{required: true, message: '性别不能为空！', trigger: 'blur',pattern: /.+/ },
					],
					age: [
						{required: true, message: '年龄不能为空！', trigger: 'blur',pattern: /.+/ },
					],
					termOfValidity: [
						{required: true, message: '有效期不能为空！', trigger: 'blur',pattern: /.+/ },
					],
					unitOfIssue: [
						{required: true, message: '发证单位不能为空！', trigger: 'blur',pattern: /.+/ },
					],
				}
			}
		},
		watch: {
			value(val) {
				this.show = val;
			},
			show(val) {
				this.initForm();
				this.loading=false;
				this.editTitle = this.modalTitle;
				if(this.editTitle == "查看"){
					this.disabled = true;
				}
				else{
					this.disabled = false;
				}
				if(val) {
					this.$refs['tCertificateManageForm'].resetFields();
					this.$refs['tCertificateManageForm'].id = null;
					if(this.TCertificateManageId!=null&&this.TCertificateManageId.trim().length>0){
						getTCertificateManage({id: this.TCertificateManageId}).then(res => {
								if (res.success) {
									 this.tCertificateManageForm = res.data;
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
