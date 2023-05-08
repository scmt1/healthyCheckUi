<style lang="less">
.tCombo {
    .ivu-modal {
        width: 660px !important;
    }
}
</style>
<template>
    <Modal v-model="show" :title="editTitle" class="tCombo" :mask-closable="false">
        <Form ref="tComboForm" :model="tComboForm" :rules="tComboFormRule" :label-width="100">
            <FormItem label="套餐名称" prop="name">
                <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tComboForm.name" placeholder="请输入套餐名称"/>
            </FormItem>
            <FormItem label="封面图片地址" prop="url">
                <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tComboForm.url" placeholder="请输入封面图片地址"/>
            </FormItem>
            <FormItem label="套餐类别" prop="type">
                <RadioGroup v-bind:disabled="disabled" v-model="tComboForm.type">
                    <Radio v-for="item in typeRadio" :label="item.value" :key="item.value">{{ item.title }}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="简拼" prop="simpleSpell">
                <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tComboForm.simpleSpell" placeholder="请输入简拼"/>
            </FormItem>
            <FormItem label="适合性别" prop="fitSex">
                <Select v-bind:disabled="disabled" v-model="tComboForm.fitSex" placeholder="请选择" clearable>
                    <Option v-for="(item, i) in fitSexPriority" :key="item.value" :value="item.value">{{ item.title }}</Option>
                </Select>
            </FormItem>
            <FormItem label="排序" prop="orderNum">
                <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tComboForm.orderNum" placeholder="请输入排序"/>
            </FormItem>
            <FormItem label="套餐介绍" prop="remark">
                <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tComboForm.remark" placeholder="请输入套餐介绍"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handelSubmit" v-if="!disabled">提交</Button>
        </div>
    </Modal>
</template>
<script>
import {addTCombo, updateTCombo, getTCombo} from '@/api/healthy/tCombo'

import {getDictDataByType} from '@/api/index';

export default {
    name: "updateTCombo",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        TComboId: {
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
            typeRadio: [],
            fitSexPriority: [],
            tComboForm: {
                name: '',
                url: '',
                type: '',
                simpleSpell: '',
                fitSex: '',
                orderNum: '',
                remark: '',
            },
            tComboFormRule: this.getTComboFormRule()
        }
    },
    methods: {
        handelSubmit() {
            this.$refs['tComboForm'].validate((valid) => {
                if (valid) {
                    if (this.TComboId != null && this.TComboId.trim().length > 0) {
                        this.tComboForm.id = this.TComboId;
                        updateTCombo(this.tComboForm).then(res => {
                            if (res.success) {
                                this.closeModal(false);
                                this.$emit('handleSearch');
                                this.$Message.success('保存成功');
                            } else {
                                this.$Message.error(res.msg);
                            }
                        })
                    } else {
                        addTCombo(this.tComboForm).then(res => {
                            if (res.success) {
                                this.closeModal(false);
                                this.$emit('handleSearch');
                                this.$Message.success('保存成功');
                            } else {
                                this.$Message.error(res.msg);
                            }
                        })
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
            this.tComboForm = {
                name: '',
                url: '',
                type: '',
                simpleSpell: '',
                fitSex: '',
                orderNum: '',
                remark: '',
            };
        },
        getTComboFormRule() {
            return {
                name: [
                    {required: true, message: '套餐名称不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                url: [
                    {required: true, message: '封面图片地址不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                type: [
                    {required: true, message: '套餐类别不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                simpleSpell: [
                    {required: true, message: '简拼不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                fitSex: [
                    {required: true, message: '适合性别不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                orderNum: [
                    {required: true, message: '排序不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                remark: [
                    {required: true, message: '套餐介绍不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
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
            this.loading = false;
            this.editTitle = this.modalTitle;
            if (this.editTitle == "查看") {
                this.disabled = true;
            } else {
                this.disabled = false;
            }
            if (val) {
                this.$refs['tComboForm'].resetFields();
                if (this.TComboId != null && this.TComboId.trim().length > 0) {
                    getTCombo({id: this.TComboId}).then(res => {
                        if (res.success) {
                            this.tComboForm = res.data;
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
