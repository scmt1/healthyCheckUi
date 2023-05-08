<style lang="less">
    .tProType {
        .ivu-modal {
            textarea.ivu-input {
                width: 330px;
            }

            .ivu-input-number {
                width: 330px !important;
            }
        }
    }
</style>
<template>
    <Modal v-model="show" :title="editTitle" class="tProType" :mask-closable="false">
        <Form ref="tProTypeForm" :model="tProTypeForm" :rules="tProTypeFormRule" :label-width="100">
            <Row>
                <Col span="24">
                    <FormItem label="类型名称" prop="typeName">
                        <Input :disabled="disabled"
                               type="text"
                               v-width="330"
                               v-model="tProTypeForm.typeName"
                               placeholder="请输入类型名称"/>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem label="类型编码" prop="typeCode">
                        <Input :disabled="disabled"
                               type="text"
                               :maxlength=50
                               v-model="tProTypeForm.typeCode"
                               v-width="330"
                               placeholder="请输入类型编码"/>
                    </FormItem>
                </Col>

                <Col span="24">
                    <FormItem label="上级类型">
                        <TreeSelect :data="treeData"
                                    v-width="330"
                                    :disabled="disabled"
                                    v-model="tProTypeForm.parentId"
                        />
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem label="排序" prop="orderNum">
                        <InputNumber :disabled="disabled"
                                     v-model="tProTypeForm.orderNum"
                                     :min="0"
                                     placeholder="请输入排序"/>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem label="备注">
                        <Input :disabled="disabled"
                               type="textarea"
                               :rows="6"
                               :maxlength=50
                               v-model="tProTypeForm.remark"
                               placeholder="请输入备注"/>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div slot="footer">
            <Button :type="disabled?'primary':'text'" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handelSubmit" v-if="!disabled">提交</Button>
        </div>
    </Modal>
</template>
<script>
    import {addTProType, updateTProType, getTProType, getAllProTypeByTree} from '@/api/healthy/tProType'

    export default {
        name: "updateTProType",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            TProTypeId: {
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
                treeData: [],
                tProTypeForm: {
                    typeName: '',
                    typeCode: '',
                    orderNum: 0,
                    parentId: "",
                    remark: '',
                },
                tProTypeFormRule: this.getTProTypeFormRule()
            }
        },
        methods: {
            //提交
            handelSubmit() {
                this.$refs['tProTypeForm'].validate((valid) => {
                    if (valid) {
                        if (this.TProTypeId != null && this.TProTypeId.trim().length > 0) {
                            this.tProTypeForm.id = this.TProTypeId;
                            updateTProType(this.tProTypeForm).then(res => {
                                if (res.code == 200) {
                                    this.closeModal(false);
                                    this.$emit('handleSearch');
                                    this.$Message.success('保存成功');
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            })
                        } else {
                            addTProType(this.tProTypeForm).then(res => {
                                if (res.code == 200) {
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
            //关闭
            closeModal(val) {
                this.$emit('input', val);
            },
            //初始化
            initForm() {
                this.tProTypeForm = {
                    typeName: '',
                    typeCode: '',
                    orderNum: 0,
                    remark: '',
                    parentId: ""
                };
            },
            //字段验证
            getTProTypeFormRule() {
                return {
                    typeName: [
                        {required: true, message: '类型名称不能为空！', trigger: 'blur'},
                        {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                    ],
                    typeCode: [
                        {required: true, message: '类型编码不能为空！', trigger: 'blur'},
                        {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '排序不能为空！', trigger: 'blur', type: "number"}
                    ],
                    remark: [
                        {required: true, message: '备注不能为空！', trigger: 'blur'},
                        {type: 'string', max: 100, message: '数据的最大长度为50！', trigger: 'blur'}
                    ],
                }
            },
            //获取职业类型数
            getProTypeTree() {
                getAllProTypeByTree().then(res => {
                    let data = JSON.stringify(res.data);
                    data = data.replace(/typeName/ig, "title")
                    data = data.replace(/id/ig, "value")
                    data = JSON.parse(data);
                    if (data.length > 0) {
                        data.forEach(item => {
                            item.expand = false;
                            item.selected = false;
                            item.checked = false;
                            if (item.children && item.children.length > 0) {
                                this.recursion(item.children);
                            }
                        })
                    }
                    this.treeData = data;
                })
            },
            //递归
            recursion(proTypes) {
                if (proTypes && proTypes.length > 0) {
                    proTypes.forEach(item => {
                        item.expand = false;
                        item.selected = false;
                        item.checked = false;
                        if (item.children && item.children.length > 0) {
                            this.recursion(item.children)
                        }
                    })
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
                this.getProTypeTree();
                if (val) {
                    this.$refs['tProTypeForm'].resetFields();
                    if (this.TProTypeId != null && this.TProTypeId.trim().length > 0) {
                        getTProType({id: this.TProTypeId}).then(res => {
                            if (res.code == 200) {
                                this.tProTypeForm.typeName = res.data.typeName;
                                this.tProTypeForm.typeCode = res.data.typeCode;
                                this.tProTypeForm.orderNum = res.data.orderNum;
                                this.tProTypeForm.remark = res.data.remark;
                                this.tProTypeForm.parentId = res.data.parentId;
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
