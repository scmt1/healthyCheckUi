<style lang="less">
    .tTemplate {
        .ivu-modal {
            width: 660px !important;
        }
    }
</style>
<template>
    <Modal v-model="show" :title="editTitle" class="tTemplate" :mask-closable="false">
        <Form ref="tTemplateForm" :model="tTemplateForm" :rules="tTemplateFormRule" :label-width="110">
            <FormItem label="报告类型" prop="reportType">
                <Select v-bind:disabled="disabled" v-model="tTemplateForm.reportType" placeholder="请选择" clearable transfer>
                    <Option v-for="(item, i) in reportTypePriority" :key="i" :value="item.value">
                        {{ item.title }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="模板类型" prop="type">
                <Select v-bind:disabled="disabled" v-model="tTemplateForm.type" placeholder="请选择" clearable transfer>
                    <Option v-for="(item, i) in templateTypePriority" :key="i" :value="item.value">
                        {{ item.title }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="科室名" prop="tOfficeId" v-if="tTemplateForm.type=='分项报告'">
                <Select placeholder="请选择组合项目"  filterable v-bind:disabled="disabled" v-model="tTemplateForm.tOfficeId"  @on-change="queryAllPortfolioProjectData">
                    <Option  v-for="(item,i) in officeData" :value="item.id" :key="i">{{ item.sectionName }}</Option>
                </Select>
            </FormItem>
            <FormItem label="组合项目名称" prop="baseProjectId" v-if="tTemplateForm.type=='分项报告'">
                <Select placeholder="请选择组合项目"  filterable v-bind:disabled="disabled||baseProjectIdDisabled" v-model="tTemplateForm.baseProjectId" >
                    <Option  v-for="(item,i) in treeData" :value="item.id" :key="i">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="状态" prop="status">
                <RadioGroup  v-model="tTemplateForm.status">
                    <Radio v-bind:disabled="disabled" v-for="item in statusRadio" :label="item.value" :key="item.value">{{item.title}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="模板内容" prop="contentName">
<!--                <Input v-bind:disabled="disabled" :rows="3" type="textarea" v-model="tTemplateForm.contentName"-->
<!--                       placeholder="请输入模板内容"/>-->
                <Upload
                        :action="deployByFileUrl"
                        :headers="accessToken"
                        :disabled="disabled"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :format="[ 'ftl','docx']"
                        :max-size="5120"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        type="drag"
                        ref="up"
                >
                    <div style="padding: 20px 0" v-if="fileName == null||fileName.trim().length==0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击这里或将文件拖拽到这里上传</p>
                        仅支持docx、ftl格式文件
                    </div>
                    <div style="padding: 20px 0" v-else>
                        {{fileName}}
                    </div>
                </Upload>
            </FormItem>
            <FormItem label="排序" prop="orderNum">
                <InputNumber v-bind:disabled="disabled" :max="10" :min="1" :step="1" v-model="tTemplateForm.orderNum"></InputNumber>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handSubmit" v-if="!disabled">提交</Button>
        </div>
    </Modal>
</template>
<script>
	import {getDictDataByType} from "../../../api";
	import {addTTemplate, updateTTemplate, getTTemplate} from '@/api/healthy/tTemplate'
	import {queryAllPortfolioProjectList} from '@/api/healthy/tPortfolioProject'
	import {queryAllSectionOfficeData} from "../../../api/healthy/tSectionOffice";
	export default {
		name: "updateTTemplate",
		props: {
			value: {
				type: Boolean,
				default: false
			},
			TTemplateId: {
				type: String
			},
			baseProjectId: {
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
				disabled: false,
				baseProjectIdDisabled:false,
				treeData:[],
				statusRadio: [{
					"title":"启用",
					"value":"1"
				},{
					"title":"停用",
					"value":"0"
				}],
				tTemplateForm: {
					baseProjectId: '',
					status: '',
					contentName: '',
					orderNum: 0,
					type:"",
					tOfficeId:"",
					reportType:"",
				},
				tTemplateFormRule: this.getTTemplateFormRule(),
				deployByFileUrl:"",
				accessToken:{},
                file:null,
                fileName:"",
				templateTypePriority:[],//模板类型集合
				reportTypePriority:[],//报告类型集合
                officeData:[],
			}
		},
		methods: {
			handSubmit() {
				let formData = new FormData();
				if(this.file!=null&&this.fileName.trim().length>0){
					formData.append("file", this.file);
					this.tTemplateForm.contentName = this.fileName;
				}
				this.$refs['tTemplateForm'].validate((valid) => {
					this.loading = true;
					if (valid) {

						if (this.TTemplateId != null && this.TTemplateId.trim().length > 0) {
							this.tTemplateForm.id = this.TTemplateId;
							formData.append("submissionData", JSON.stringify( this.tTemplateForm));
							updateTTemplate(formData).then(res => {
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
							formData.append("submissionData", JSON.stringify( this.tTemplateForm));
							addTTemplate(formData).then(res => {
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
				this.tTemplateForm = {
					baseProjectId: '',
					status: '',
					contentName: '',
					orderNum: 0,
					type:"",
					tOfficeId:"",
                    reportType:"",
				};
				this.queryAllOffice();
                this.file = null;
                this.fileName = null;
				this.accessToken = {
					accessToken: this.getStore("accessToken"),
				};
				getDictDataByType("templateType").then(res => {
					if (res.success) {
						this.templateTypePriority = res.data;
					}
				});
				getDictDataByType("reportType").then(res => {
					if (res.success) {
						this.reportTypePriority = res.data;
					}
				});
			},
			getTTemplateFormRule() {
				return {
					baseProjectId: [
						{required: true, message: '组合项目id不能为空！', trigger: 'blur'},
						{type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
					],
					status: [
						{required: true, message: '状态不能为空！', trigger: 'blur', pattern: /.+/},
					],
					contentName: [
						{required: true, message: '模板内容不能为空！', trigger: 'blur', pattern: /.+/},
					],
					orderNum: [
						{required: true, message: '排序不能为空！', trigger: 'blur', pattern: /.+/},
					],
					type: [
						{required: true, message: '模板类型不能为空！', trigger: 'blur'},
					],
					reportType: [
						{required: true, message: '报告类型不能为空！', trigger: 'blur'},
					],
					tOfficeId: [
						{required: true, message: '科室不能为空！', trigger: 'blur'},
					],
				}
			},
			/**
			 * 模糊查询所有组合项目
			 */
			queryAllPortfolioProjectData(value) {
				queryAllPortfolioProjectList({officeId:value}).then(res => {
					if (res.success) {
						this.treeData = res.data;
					}
				}).finally(() => {
				})
			},
			/**
			 * 查询所有组合项目
			 */
			queryAllOffice() {
				queryAllSectionOfficeData({}).then(res => {
					if (res.success) {
						this.officeData=res.data;
					}
				}).finally(() => {
				})
			},
			//文件上传成功时的钩子
			handleSuccess (res, file) {
			},
            //文件上传失败时的钩子
			handleError( error, file, fileList){},
			//文件格式验证失败时的钩子
			handleFormatError (file) {
				this.$Notice.warning({
					title: '文件格式限制提示',
					desc: '文件 ' + file.name + ' 的格式错误,仅支持docx、ftl格式文件.'
				});
			},
			//文件超出指定大小限制时的钩子
			handleMaxSize (file) {
				this.$Notice.warning({
					title: '文件大小限制提示',
					desc: '文件  ' + file.name + ' 太大了, 不能超过 2M.'
				});
			},
            //上传文件之前的钩子
			handleBeforeUpload (file) {
				 this.file = file;
				 this.fileName = file.name;
				 this.$Message.success('选择成功');
                //不自动上传
				 return false ;
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
					if(this.baseProjectId  && this.baseProjectId .trim().length>0){
						this.tTemplateForm.baseProjectId = this.baseProjectId ;
						this.baseProjectIdDisabled = true;
					}
					this.$refs['tTemplateForm'].resetFields();
					this.$refs['tTemplateForm'].id = null;
					if (this.TTemplateId != null && this.TTemplateId.trim().length > 0) {
						getTTemplate({id: this.TTemplateId}).then(res => {
							if (res && res.success&&res.data) {
								this.tTemplateForm = res.data;
								this.fileName = res.data.contentName;
								this.tTemplateForm.tOfficeId = res.data.tportfolioProject.officeId;
								this.queryAllPortfolioProjectData(this.tTemplateForm.tOfficeId);
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
