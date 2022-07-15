<style lang="less">
.tBaseProject {
    .ivu-modal {
        width: 50vw !important;
    }
}
</style>
<template>
    <Modal v-model="show" :title="editTitle" :mask-closable="false" class="tBaseProject">
        <Form ref="tBaseProjectForm" :model="tBaseProjectForm" :rules="tBaseProjectFormRule" :label-width="90">
            <Row>
                <Col span="12">
                    <FormItem label="所属科室" prop="officeId">
                        <Select v-bind:disabled="disabled" v-model="tBaseProjectForm.officeId" placeholder="请选择"
                                clearable label-in-value @on-change="onSectionChange">
                            <Option v-for="(item, i) in sectionList" :key="item.id" :value="item.id.toString()">
                                {{ item.sectionName }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="项目代码" prop="code">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tBaseProjectForm.code" placeholder="请输入项目代码"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12">
                    <FormItem label="项目名称" prop="name">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tBaseProjectForm.name" placeholder="请输入名称"/>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="项目简称" prop="shortName">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tBaseProjectForm.shortName" placeholder="请输入简称"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12">
                    <FormItem label="排序" prop="orderNum">
                        <InputNumber v-bind:disabled="disabled" type="text" :min="1" :step="1.1" v-model="tBaseProjectForm.orderNum" placeholder="请输入排序"/>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="结果类型" prop="resultType">
                        <Select v-bind:disabled="disabled" v-model="tBaseProjectForm.resultType" placeholder="请选择">
                            <Option v-for="(item, i) in resultTypePriority" :key="item.value" :value="item.value">
                                {{ item.title }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12">
                    <FormItem label="项目单位" prop="unitCode">
                        <Select v-bind:disabled="disabled" v-model="tBaseProjectForm.unitCode" placeholder="请选择" clearable
                                filterable label-in-value @on-change="onUnitChange">
                            <Option v-for="(item, i) in unitPriority" :key="item.value" :value="item.value">
                                {{ item.title }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="默认值" prop="defaultValue">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=200
                               v-model="tBaseProjectForm.defaultValue" placeholder="请输入默认值"/>
                    </FormItem>
                </Col>

            </Row>
            <Row>
                <Col :span="12">
                    <FormItem label="进入小结" prop="inConclusion">
                        <Select v-bind:disabled="disabled" v-model="tBaseProjectForm.inConclusion" placeholder="请选择" clearable>
                            <Option v-for="(item, i) in inConclusionPriority" :key="item.value" :value="item.value">
                                {{ item.title }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="进入报告" prop="inReport">
                        <Select v-bind:disabled="disabled" v-model="tBaseProjectForm.inReport" placeholder="请选择" clearable>
                            <Option v-for="(item, i) in inReportPriority" :key="item.value" :value="item.value">
                                {{ item.title }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12">
                    <FormItem label="LIS关联码" prop="relationCode">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tBaseProjectForm.relationCode" placeholder="请输入LIS关联码"/>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handelSubmit" v-if="!disabled">提交</Button>
        </div>
    </Modal>
</template>
<script>
import {addTBaseProject, updateTBaseProject, getTBaseProject} from '@/api/healthy/tBaseProject'
import {getDictDataByType} from "../../../api";
import {queryAllSectionOfficeData} from "../../../api/healthy/tSectionOffice";

export default {
    name: "updateTBaseProject",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        TBaseProjectId: {
            type: String
        },
        modalTitle: {
            type: String
        }
    },
    data() {
        const validateUnit = (rule, value, callback) => {
            if (this.tBaseProjectForm.resultType == '数值' && !this.tBaseProjectForm.unitCode) {
                callback(new Error("项目单位不能为空！"));
            } else {
                callback();
            }
        };
        return {
            show: this.value,
            editTitle: this.modalTitle,
            loading: true,
            disabled: false,
            tBaseProjectForm: {
                code: '',
                name: '',
                shortName: '',
                orderNum: 1,
                officeId: '',
                unitCode: '',
                unitName: '',
                defaultValue: '',
                resultType: '',
                inConclusion: '',
                inReport: '',
                relationCode: '',
                officeName: ""
            },
            sectionList: [],
            tBaseProjectFormRule: {
                code: [
                    {required: true, message: '项目代码不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '名称不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                shortName: [
                    {required: true, message: '简称不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                orderNum: [
                    {required: true, message: '排序不能为空！', trigger: 'blur', type: 'number'},
                ],
                officeId: [
                    {required: true, message: '科室id不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                unitCode: [
                    {validator: validateUnit, trigger: "blur", pattern: /.+/},
                ],
                // defaultValue: [
                //   {required: true, message: '默认值不能为空！', trigger: 'blur'},
                //   {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                // ],
                resultType: [
                    {required: true, message: '结果类型不能为空！', trigger: 'change'},
                ],
                // inConclusion: [
                //   {required: true, message: '是否进入小结不能为空！', trigger: 'blur', pattern: /.+/},
                // ],
                // inReport: [
                //   {required: true, message: '是否进入报告不能为空！', trigger: 'blur', pattern: /.+/},
                // ],
                // relationCode: [
                //   {required: true, message: 'LIS关联码不能为空！', trigger: 'blur'},
                //   {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                // ],
            },
            officeIdPriority: [],
            unitPriority: [],
            resultTypePriority: [],
            inConclusionPriority: [],
            inReportPriority: [],
        }
    },
    methods: {
        onUnitChange(e) {
            if (e) {
                this.tBaseProjectForm.unitName = e.label;
            }
        },
        onSectionChange(e) {
            if (e) {
                this.tBaseProjectForm.officeId = e.value;
                this.tBaseProjectForm.officeName = e.label;
            }
        },
        handelSubmit() {
            this.$refs['tBaseProjectForm'].validate((valid) => {
                this.loading = true;
                if (valid) {
                    if (this.TBaseProjectId != null && this.TBaseProjectId.trim().length > 0) {
                        this.tBaseProjectForm.id = this.TBaseProjectId;
                        updateTBaseProject(this.tBaseProjectForm).then(res => {
                            this.loading = false;
                            if (res) {
                                if (res.code == 200) {
                                    this.closeModal(false);
                                    this.$emit('handleSearch');
                                    this.$Message.success('保存成功');
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            } else {
                                this.$Message.error('保存失败');
                            }
                        }).catch(err => {
                            this.loading = false;
                        });
                    } else {
                        addTBaseProject(this.tBaseProjectForm).then(res => {
                            this.loading = false;
                            if (res) {
                                if (res.code == 200) {
                                    this.closeModal(false);
                                    this.$emit('handleSearch');
                                    this.$Message.success('保存成功');
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            } else {
                                this.$Message.error('保存失败');
                            }
                        }).catch(err => {
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
            this.tBaseProjectForm = {
                code: '',
                name: '',
                shortName: '',
                orderNum: 1,
                officeId: '',
                unitCode: '',
                unitName: '',
                defaultValue: '',
                resultType: '',
                inConclusion: '',
                inReport: '',
                relationCode: '',
                officeName: ""
            };
        },
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
                getDictDataByType('yes_no').then(res => {
                    if (res.success) {
                        this.inConclusionPriority = res.data;
                        this.inReportPriority = res.data;
                    }
                });
                getDictDataByType('resultType').then(res => {
                    if (res.success) {
                        this.resultTypePriority = res.data;
                    }
                })
                getDictDataByType('metering_unit').then(res => {
                    if (res.success) {
                        this.unitPriority = res.data;
                    }
                })
                queryAllSectionOfficeData({sectionName: this.searchKey}).then(res => {
                    if (res.success) {
                        this.sectionList = res.data;
                    }
                })

                this.$refs['tBaseProjectForm'].resetFields();
                if (this.TBaseProjectId != null && this.TBaseProjectId.trim().length > 0) {
                    getTBaseProject({id: this.TBaseProjectId}).then(res => {
                        if (res) {
                            if (res.code == 200) {
                                this.tBaseProjectForm.code = res.data.code;
                                this.tBaseProjectForm.name = res.data.name;
                                this.tBaseProjectForm.shortName = res.data.shortName;
                                this.tBaseProjectForm.orderNum = res.data.orderNum;
                                this.tBaseProjectForm.officeId = res.data.officeId;
                                this.tBaseProjectForm.unitCode = res.data.unitCode;
                                this.tBaseProjectForm.unitName = res.data.unitName;
                                this.tBaseProjectForm.defaultValue = res.data.defaultValue;
                                this.tBaseProjectForm.resultType = res.data.resultType;
                                this.tBaseProjectForm.inConclusion = res.data.inConclusion;
                                this.tBaseProjectForm.inReport = res.data.inReport;
                                this.tBaseProjectForm.relationCode = res.data.relationCode;
                            } else {
                                this.$Message.error(res.msg);
                            }
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
