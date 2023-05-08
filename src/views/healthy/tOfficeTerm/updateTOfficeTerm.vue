<style lang="less">
    .tOfficeTerm {
        .ivu-modal {
            width: 660px !important;
        }
    }
</style>
<template>
    <Modal v-model="show" :title="editTitle" class="tOfficeTerm" :mask-closable="false">
        <Form ref="tOfficeTermForm" :model="tOfficeTermForm" :rules="tOfficeTermFormRule" :label-width="100">
            <FormItem label="科室名称" prop="officeId">
                <Select v-bind:disabled="disabled" v-model="tOfficeTermForm.officeId" placeholder="请选择" clearable>
                    <Option v-for="(item, i) in officeIdPriority" :key="item.id" :value="item.id">{{item.sectionName}}</Option>
                </Select>
            </FormItem>
            <FormItem label="体检类型" prop="inspectType">
                <Select v-bind:disabled="disabled" v-model="tOfficeTermForm.inspectType" placeholder="请选择"
                        multiple transfer clearable>
                    <Option v-for="(item, i) in inspectTypePriority" :key="item.id" :value="item.value">{{item.title}}</Option>
                </Select>
            </FormItem>
            <FormItem label="术语类型" prop="type">
                <Select v-bind:disabled="disabled" v-model="tOfficeTermForm.type" placeholder="请选择" clearable>
                    <Option v-for="(item, i) in officeTermTypePriority" :key="item.id" :value="item.value">{{item.title}}</Option>
                </Select>
            </FormItem>
            <FormItem label="危害因素" prop="hazardFactors">
                <TreeSelect :data="hazardFactorsPriority" clearable
                            v-model="tOfficeTermForm.hazardFactors"
                            ref="hazardFactors"
                            @on-change="hazardFactorsChange"/>
            </FormItem>
            <FormItem label="在岗状态" prop="workStateCode">
                <Select v-bind:disabled="disabled" v-model="tOfficeTermForm.workStateCode" multiple transfer label-in-value @on-change="workChange">
                    <Option v-for="(item,index) in workStateCodeArr" :key="item.id" :value="item.value">
                        {{ item.title }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="状态" prop="status">
                <RadioGroup v-bind:disabled="disabled" v-model="tOfficeTermForm.status">
                    <Radio v-for="(item,i) in statusRadio" v-bind:disabled="disabled" :label="item.value" :key="i">{{item.title}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="术语内容" prop="content">
                <Input v-bind:disabled="disabled" :rows="3" type="textarea" v-model="tOfficeTermForm.content" placeholder="请输入术语内容"/>
            </FormItem>
            <FormItem label="排序" prop="orderNum">
                <Tooltip style="width: 100%;" trigger="hover" placement="right" content="值越小越靠前，支持小数">
                    <InputNumber style="width: 100%;" :max="1000" :min="0" v-bind:disabled="disabled" v-model="tOfficeTermForm.orderNum"
                                 placeholder="请输入排序"/>
                </Tooltip>
                <!--						<Input v-bind:disabled="disabled"  type="text" :maxlength=50 v-model="tOfficeTermForm.orderNum" placeholder="请输入排序"/>-->
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="submit" v-if="!disabled">提交</Button>
        </div>
    </Modal>
</template>
<script>
    import {addTOfficeTerm, updateTOfficeTerm, getTOfficeTerm, queryAllOfficeTermData} from '@/api/healthy/tOfficeTerm'
    import {queryAllSectionOfficeData} from '@/api/healthy/tSectionOffice'
    import {getDictDataByType} from '@/api/index';
    import {getTypeCodeByTProType} from '@/api/healthy/tGroupPerson'
    import util from "../../../libs/util";

    export default {
        name: "updateTOfficeTerm",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            TOfficeTermId: {
                type: String
            },
            TOfficeId: {
                type: String
            },
            modalTitle: {
                type: String
            },
            physicalType: {
                type: String,
                default: ""
            },
			hazardFactors:{
            	type:String,
				default:""
			},
            hazardFactorsText:{
            	type:String,
				default:""
			},
			tType:{
            	type:String,
				default:""
			}
        },
        data() {
            return {
                workStateCodeArr: [],//在岗状态
                show: this.value,
                editTitle: this.modalTitle,
                loading: true,
                disabled: false,
                officeIdPriority: [],//科室
                officeTermPriority: [],//术语
                statusRadio: [
                    {
                        title: '启用',
                        value: '0',
                    },
                    {
                        title: '停用',
                        value: '1',
                    }
                ],
                tOfficeTermForm: {
                    officeId: '',
                    status: '',
                    content: '',
                    orderNum: 0,
                    type: '',
                    inspectType: '',
                    hazardFactorsText: '',
                    hazardFactors: '',
                    workStateCode: '',
                    workStateText: '',
                },
                tOfficeTermFormRule: this.getTOfficeTermFormRule(),
                blooeanSubmit: true,
                officeTermTypePriority: [],//术语类型
                inspectTypePriority: [{
                    id: '1',
                    value: "健康体检",
                    title: "健康体检",
                }, {
                    id: '2',
                    value: "职业体检",
                    title: "职业体检",
                }, {
                    id: '3',
                    value: "从业体检",
                    title: "从业体检",
                }, {
                    id: '4',
                    value: "放射体检",
                    title: "放射体检",
                }],//体检类型
                hazardFactorsPriority: [],//危害因素
                updateHazardFactors: false,//是否修改危害因素
                updateInspectType: false,//是否修改体检类型
            }
        },
        methods: {
            //在岗状态改变
            workChange(v) {
                let _this = this;
                if (v) {
                    if(v.length > 0){
                        _this.tOfficeTermForm.workStateText = "";
                        v.forEach((i, index) => {
                            if (index == v.length - 1) {
                                _this.tOfficeTermForm.workStateText += i.label.trim();
                            }else{
                                _this.tOfficeTermForm.workStateText += i.label.trim() + ",";
                            }
                        })
                    }else{
                        _this.tOfficeTermForm.workStateText = "";
                    }
                }
            },
            hazardFactorsChange() {
                this.updateHazardFactors = true;
                let _this = this;
                let labels = this.$refs.hazardFactors.$children[0].values;
                if (labels && labels.length > 0) {
                    _this.tOfficeTermForm.hazardFactorsText = "";
                    _this.tOfficeTermForm.hazardFactors = "";
                    labels.forEach((i, index) => {
                        if (index == labels.length - 1) {
                            _this.tOfficeTermForm.hazardFactorsText += i.label;
                            _this.tOfficeTermForm.hazardFactors += i.value;
                        } else {
                            _this.tOfficeTermForm.hazardFactorsText += i.label + ",";
                            _this.tOfficeTermForm.hazardFactors += i.value + ",";
                        }
                    })
                } else {
                    _this.tOfficeTermForm.hazardFactorsText = "";
                    _this.tOfficeTermForm.hazardFactors = "";
                }
            },
            //获取类型库树
            getProTypeByTypeCode(typeCode) {
                getTypeCodeByTProType({typeCode: typeCode}).then(res => {
                    if (res && res.success) {
                        this.hazardFactorsPriority = this.recursion(res.data);
                    }
                }).catch(err => {
                });
            },
            //递归
            recursion(proTypes) {
                if (proTypes) {
                    proTypes.forEach(item => {
                        item.value = item.typeCode;
                        item.title = item.typeName;
                        item.selected = false;
                        item.checked = false;
                        if (item.children && item.children.length > 0) {
                            item.disabled = true;
                            this.recursion(item.children)
                        }
                    })
                }
                return proTypes;
            },
            //获取科室数据
            getSectionData() {
                queryAllSectionOfficeData({}).then(res => {
                    if (res && res.success) {
                        this.officeIdPriority = res.data;
                    }
                }).catch(err => {
                });
            },
            submit() {
                let _this = this;
                _this.$refs['tOfficeTermForm'].validate((valid) => {
                    _this.loading = true;
                    //选中危害因素json转换
                    if (_this.tOfficeTermForm.hazardFactors && _this.tOfficeTermForm.hazardFactors != null && !_this.updateHazardFactors && _this.tOfficeTermForm.hazardFactors.constructor != String) {
                        _this.tOfficeTermForm.hazardFactors = _this.tOfficeTermForm.hazardFactors.join(",");
                    }
                    if (_this.tOfficeTermForm.hazardFactorsText && _this.tOfficeTermForm.hazardFactorsText != null && !_this.updateHazardFactors && _this.tOfficeTermForm.hazardFactorsText.constructor != String) {
                        _this.tOfficeTermForm.hazardFactorsText = _this.tOfficeTermForm.hazardFactorsText.join(",");
                    }
                    //选中体检类型json转换
                    if (_this.tOfficeTermForm.inspectType && _this.tOfficeTermForm.inspectType != null && _this.tOfficeTermForm.inspectType.constructor != String) {
                        _this.tOfficeTermForm.inspectType = _this.tOfficeTermForm.inspectType.join(",");
                    }
                    //选中在岗状态json转换
                    if (_this.tOfficeTermForm.workStateCode && _this.tOfficeTermForm.workStateCode != null && _this.tOfficeTermForm.workStateCode.constructor != String) {
                        _this.tOfficeTermForm.workStateCode = _this.tOfficeTermForm.workStateCode.join(",");
                    }
                    if (valid) {
                        if (_this.TOfficeTermId != null && _this.TOfficeTermId.trim().length > 0) {
                            _this.tOfficeTermForm.id = _this.TOfficeTermId;
                            updateTOfficeTerm(_this.tOfficeTermForm).then(res => {
                                if (res.success) {
                                    _this.closeModal(false);
                                    _this.$emit('handSearch');
                                    _this.$Message.success('保存成功');
                                } else {
                                    _this.$Message.error(res.msg);
                                }
                            }).finally(() => {
                                _this.loading = false;
                            });
                        } else {
                            addTOfficeTerm(_this.tOfficeTermForm).then(res => {
                                if (res.success) {
                                    _this.closeModal(false);
                                    _this.$emit('handSearch');
                                    _this.$Message.success('保存成功');
                                } else {
                                    _this.$Message.error(res.msg);
                                }
                            }).finally(() => {
                                _this.loading = false;
                            });
                        }
                    } else {
                        _this.loading = false;
                        _this.$Message.error('表单验证不通过！');
                    }
                });
            },
            closeModal(val) {
                this.$emit('input', val);
            },
            initForm() {
                this.tOfficeTermForm = {
                    officeId: '',
                    status: '',
                    content: '',
                    orderNum: 0,
                    type: '',
                    inspectType: '',
                    hazardFactors: '',
                    hazardFactorsText: '',
                    workStateCode: '',
                    workStateText: '',
                };
                if (this.TOfficeId && this.TOfficeId != '') {
                    this.tOfficeTermForm.officeId = this.TOfficeId;
                }
            },
            getTOfficeTermFormRule() {
                return {
                    officeId: [
                        {required: true, message: '科室名称不能为空！', trigger: 'blur', pattern: /.+/},
                    ],
                    type: [
                        {required: true, message: '术语类型不能为空！', trigger: 'blur', pattern: /.+/},
                    ],
                    inspectType: [
                        {required: true, message: '体检类型不能为空！', trigger: 'blur', pattern: /.+/},
                    ],
                    /*hazardFactors: [
                        {required: true, message: '危害因素不能为空！', trigger: 'blur',pattern: /.+/ },
                    ],*/
                    status: [
                        {required: true, message: '状态不能为空！', trigger: 'blur', pattern: /.+/},
                    ],
                    content: [
                        {required: true, message: '术语内容不能为空！', trigger: 'blur', pattern: /.+/},
                    ],
                    orderNum: [
                        {required: true, type: "number", message: "排序不能为空", trigger: "blur"}
                    ],
                }
            }
        },
        mounted() {
            //术语类型
            getDictDataByType('office_term_type').then(res => {
                if (res.success) {
                    this.officeTermTypePriority = res.data;
                }
            })
            //危害因素
            this.getProTypeByTypeCode("TYPE_001");
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                let _this = this;
                this.getSectionData();
                getDictDataByType('workState').then(res => {
                    if (res.success) {
                        this.workStateCodeArr = res.data;
                    }
                })

                this.initForm();
                this.loading = false;
                this.editTitle = this.modalTitle;
                if (this.editTitle == "查看") {
                    this.disabled = true;
                } else {
                    this.disabled = false;
                }
                //体检类型
                if (this.physicalType != "") {
                    this.tOfficeTermForm.inspectType = this.physicalType;
                }
                //术语类型
                if(this.tType != "") {
					this.tOfficeTermForm.type = this.tType;
				}
                if(this.hazardFactors != "") {
					this.tOfficeTermForm.hazardFactors = this.hazardFactors.split("|");
					//如果不止一个就不赋值
					if(this.tOfficeTermForm.hazardFactors.length>0){
						this.tOfficeTermForm.hazardFactors = [];
                    }
				}

                if(this.hazardFactorsText != "") {
					this.tOfficeTermForm.hazardFactorsText = this.hazardFactorsText.split("|");
					//如果不止一个就不赋值
					if(this.tOfficeTermForm.hazardFactorsText.length>0){
						this.tOfficeTermForm.hazardFactorsText = [];
					}
				}

                if (val) {
                    this.$refs['tOfficeTermForm'].resetFields();
                    this.$refs['tOfficeTermForm'].id = null;
                    if (this.TOfficeTermId != null && this.TOfficeTermId.trim().length > 0) {
                        this.updateHazardFactors = false;
                        this.updateInspectType = false;
                        getTOfficeTerm({id: this.TOfficeTermId}).then(res => {
                            if (res.success) {
                                _this.tOfficeTermForm = res.data;
                                //初始化数据格式
                                _this.tOfficeTermForm.hazardFactorsText = _this.tOfficeTermForm.hazardFactorsText.split(",");
                                _this.tOfficeTermForm.hazardFactors = _this.tOfficeTermForm.hazardFactors.split(",");
                                _this.tOfficeTermForm.inspectType = _this.tOfficeTermForm.inspectType.split(",");
                                _this.tOfficeTermForm.workStateCode = _this.tOfficeTermForm.workStateCode.split(",");
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
