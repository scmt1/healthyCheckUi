<style lang="less">
.relationProjectReference {
    .ivu-modal {
        width: 660px !important;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>
<template>
    <Modal v-model="show" :title="editTitle" :mask-closable="false" class="relationProjectReference">
        <Form ref="relationProjectReferenceForm" :model="relationProjectReferenceForm" :rules="relationProjectReferenceFormRule"
              :label-width="100">
            <FormItem label="适合性别" prop="allowSex">
                <Select v-bind:disabled="disabled" v-model="relationProjectReferenceForm.allowSex" placeholder="请选择" clearable>
                    <Option v-for="(item, i) in allowSexPriority" :key="item.value" :value="item.value">{{ item.title }}</Option>
                </Select>
            </FormItem>
            <FormItem label="年龄最低值" prop="minAge">
                <InputNumber v-bind:disabled="disabled" v-model="relationProjectReferenceForm.minAge" placeholder="请输入年龄最低值"/>
            </FormItem>
            <FormItem label="年龄最高值" prop="maxAge">
                <InputNumber v-bind:disabled="disabled" v-model="relationProjectReferenceForm.maxAge" placeholder="请输入年龄最高值"/>
            </FormItem>
            <FormItem label="健康参考值" prop="healthyValue">
                <Row>
                    <Col span="9">
                        <Input v-bind:disabled="disabled" type="number" v-model="relationProjectReferenceForm.healthyMin" placeholder="请输入最小值"
                               @input="healthyMinChange">
                            <span slot="prepend">最小值</span>
                        </Input>
                    </Col>
                    <Col span="1">
                        <div style="text-align: center;width: 100%;">
                            ~
                        </div>
                    </Col>
                    <Col span="9">
                        <Input v-bind:disabled="disabled" type="number" v-model="relationProjectReferenceForm.healthyMax" placeholder="请输入最大值"
                               @input="healthyMaxChange">
                            <span slot="prepend">最大值</span>
                        </Input>
                    </Col>
                    <Col span="1">
                        <div style="text-align: center;width: 100%;">
                            或
                        </div>
                    </Col>
                    <Col span="4">
                        <Input v-bind:disabled="disabled" type="text" v-model="relationProjectReferenceForm.healthyValue" placeholder="请输入健康参考值">
                        </Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="职业参考值" prop="occupationValue">
                <Row>
                    <Col span="9">
                        <Input v-bind:disabled="disabled" type="number" v-model="relationProjectReferenceForm.occupationMin" placeholder="请输入最小值"
                               @input="occupationMinChange">
                            <span slot="prepend">最小值</span>
                        </Input>
                    </Col>
                    <Col span="1">
                        <div style="text-align: center;width: 100%;">
                            ~
                        </div>
                    </Col>
                    <Col span="9">
                        <Input v-bind:disabled="disabled" type="number" v-model="relationProjectReferenceForm.occupationMax" placeholder="请输入最大值"
                               @input="occupationMaxChange">
                            <span slot="prepend">最大值</span>
                        </Input>
                    </Col>
                    <Col span="1">
                        <div style="text-align: center;width: 100%;">
                            或
                        </div>
                    </Col>
                    <Col span="4">
                        <Input v-bind:disabled="disabled" type="text" v-model="relationProjectReferenceForm.occupationValue" placeholder="请输入职业参考值">
                        </Input>
                    </Col>
                </Row>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handelSubmit">提交</Button>
        </div>
    </Modal>
</template>
<script>
import {addRelationProjectReference, updateRelationProjectReference, getRelationProjectReference} from '@/api/healthy/relationProjectReference'
import {getDictDataByType} from "../../../api";

export default {
    name: "updateRelationProjectReference",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        RelationProjectReferenceId: {
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
            relationProjectReferenceForm: {
                allowSex: '',
                minAge: 0,
                maxAge: 100,
                healthyValue: '',
                occupationValue: '',
                healthyMin: null,
                healthyMax: null,
                occupationMin: null,
                occupationMax: null
            },
            relationProjectReferenceFormRule: {
                allowSex: [
                    {required: true, message: '适合性别不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                minAge: [
                    {required: true, message: '年龄最低值不能为空！', trigger: 'blur', type: 'number'},
                ],
                maxAge: [
                    {required: true, message: '年龄最高值不能为空！', trigger: 'blur', type: 'number'},
                ],
                healthyValue: [
                    {required: true, message: '健康参考值不能为空！', trigger: 'blur'},
                ],
                occupationValue: [
                    {required: true, message: '职业参考值不能为空！', trigger: 'blur'},
                ],
                healthyMin: [
                    {required: true, message: '健康参考最低值不能为空！', trigger: 'blur', type: 'number'},
                ],
                healthyMax: [
                    {required: true, message: '健康参考最大值不能为空！', trigger: 'blur', type: 'number'},
                ],
                occupationMin: [
                    {required: true, message: '职业参考最低值不能为空！', trigger: 'blur', type: 'number'},
                ],
                occupationMax: [
                    {required: true, message: '职业参考最大值不能为空！', trigger: 'blur', type: 'number'},
                ],
            },
            allowSexPriority: [],
        }
    },
    methods: {
        healthyMinChange(e) {
            if (e && this.relationProjectReferenceForm.healthyMax) {
                this.relationProjectReferenceForm.healthyValue = e + "-" + this.relationProjectReferenceForm.healthyMax;
            }else {
                this.relationProjectReferenceForm.healthyValue = null;
            }
        },
        healthyMaxChange(e) {
            if (e && this.relationProjectReferenceForm.healthyMin) {
                this.relationProjectReferenceForm.healthyValue = this.relationProjectReferenceForm.healthyMin + "-" + e;
            }else {
                this.relationProjectReferenceForm.healthyValue = null;
            }
        },
        occupationMinChange(e) {
            if (e && this.relationProjectReferenceForm.occupationMax) {
                this.relationProjectReferenceForm.occupationValue = e + "-" + this.relationProjectReferenceForm.occupationMax;
            }else {
                this.relationProjectReferenceForm.occupationValue = null;
            }
        },
        occupationMaxChange(e) {
            if (e && this.relationProjectReferenceForm.occupationMin) {
                this.relationProjectReferenceForm.occupationValue = this.relationProjectReferenceForm.occupationMin + "-" + e;
            }else {
                this.relationProjectReferenceForm.occupationValue = null;
            }
        },
        handelSubmit() {
            this.$refs['relationProjectReferenceForm'].validate((valid) => {
                if (valid) {
                    if(Number(this.relationProjectReferenceForm.healthyMax) < Number(this.relationProjectReferenceForm.healthyMin)) {
                        this.$Message.error("健康参考值最大值不能比最小值小");
                        return false;
                    }
                    if(Number(this.relationProjectReferenceForm.occupationMax) < Number(this.relationProjectReferenceForm.occupationMin)) {
                        this.$Message.error("职业参考值最大值不能比最小值小");
                        return false;
                    }
                    this.relationProjectReferenceForm.baseProjectId = this.baseProjectId;
                    this.loading = true;
                    if (this.RelationProjectReferenceId != null && this.RelationProjectReferenceId.trim().length > 0) {
                        this.relationProjectReferenceForm.id = this.RelationProjectReferenceId;
                        updateRelationProjectReference(this.relationProjectReferenceForm).then(res => {
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
                        addRelationProjectReference(this.relationProjectReferenceForm).then(res => {
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
            this.relationProjectReferenceForm = {
                allowSex: '全部',
                minAge: 0,
                maxAge: 100,
                healthyValue: '',
                occupationValue: '',
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
                getDictDataByType("sex").then(res => {
                    if (res.success) {
                        this.allowSexPriority = res.data;
                    }
                })
                this.$refs['relationProjectReferenceForm'].resetFields();
                if (this.RelationProjectReferenceId != null && this.RelationProjectReferenceId.trim().length > 0) {
                    getRelationProjectReference({id: this.RelationProjectReferenceId}).then(res => {
                        if (res) {
                            if (res.code == 200) {
                                this.relationProjectReferenceForm = res.data;
                                this.relationProjectReferenceForm.healthyMin = this.relationProjectReferenceForm.healthyValue.split("-")[0];
                                this.relationProjectReferenceForm.healthyMax = this.relationProjectReferenceForm.healthyValue.split("-")[1];
                                this.relationProjectReferenceForm.occupationMin = this.relationProjectReferenceForm.occupationValue.split("-")[0];
                                this.relationProjectReferenceForm.occupationMax = this.relationProjectReferenceForm.occupationValue.split("-")[1];
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
