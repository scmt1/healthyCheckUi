<style lang="less">
    .tSample {
        .ivu-modal {
            width: 900px !important;

            .ivu-input-number {
                width: 300px !important;
            }
        }
    }
</style>
<template>
    <Modal v-model="show" :title="editTitle" :mask-closable="false" class="tSample">
        <Form ref="tSampleForm" :model="tSampleForm" :rules="tSampleFormRule" :label-width="90">
            <Row>
                <Col span="12">
                    <FormItem label="名称" prop="name">
                        <Input :disabled="disabled"
                               type="text"
                               :maxlength=100
                               v-width="300"
                               v-model="tSampleForm.name"
                               placeholder="请输入名称"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="条码份数" prop="barcodeNum">
                        <InputNumber :disabled="disabled"
                                     :editable="false"
                                     v-model="tSampleForm.barcodeNum"
                                     :min="0"
                                     placeholder="请输入条码份数"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="规格" prop="spec">
                        <Input :disabled="disabled"
                               type="text"
                               v-width="300"
                               v-model="tSampleForm.spec"
                               placeholder="请输入规格"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="是否采血">
                        <RadioGroup v-model="tSampleForm.needTakeBlood" >
                            <Radio label="1" :disabled="disabled">
                                <span>是</span>
                            </Radio>
                            <Radio label="0" :disabled="disabled">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="标本代码" prop="code">
                        <Input :disabled="disabled" type="text"
                               v-model="tSampleForm.code"
                               v-width="300"
                               placeholder="请输入标本代码"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="排序" prop="orderNum">
                        <InputNumber :disabled="disabled" :editable="false"
                                     v-width="300"
                                     v-model="tSampleForm.orderNum"
                                     placeholder="请输入排序"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="是否打印">
                        <RadioGroup v-model="tSampleForm.isPrint">
                            <Radio label="1" :disabled="disabled">
                                <span>是</span>
                            </Radio>
                            <Radio label="0" :disabled="disabled">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="关联码">
                        <Input :disabled="disabled"
                               type="text"
                               v-model="tSampleForm.liscode"
                               v-width="300"
                               placeholder="请输入关联码"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="容量">
                        <Input :disabled="disabled"
                               type="text"
                               v-model="tSampleForm.capacity"
                               v-width="300"
                               placeholder="请输入容量"/>
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
    import * as tSampleApi from '@/api/healthy/tSample'

    export default {
        name: "updateTSample",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            TSampleId: {
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
                tSampleForm: {
                    name: '',
                    barcodeNum: 0,
                    spec: '',
                    needTakeBlood: '0',
                    code: '',
                    orderNum: 0,
                    isPrint: '0',
                    liscode: '',
                    capacity: '',
                },
                tSampleFormRule: this.getTSampleFormRule()
            }
        },
        methods: {
            handelSubmit() {
                this.$refs['tSampleForm'].validate((valid) => {
                    if (valid) {
                        if (this.TSampleId != null && this.TSampleId.trim().length > 0) {
                            this.tSampleForm.id = this.TSampleId;
                            tSampleApi.updateTSample(this.tSampleForm).then(res => {
                                if (res.code == 200) {
                                    this.closeModal(false);
                                    this.$emit('handleSearch');
                                    this.$Message.success('保存成功');
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            })
                        } else {
                            tSampleApi.addTSample(this.tSampleForm).then(res => {
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
            //关闭模态框
            closeModal(val) {
                this.$emit('input', val);
            },
            //初始化
            initForm() {
                this.tSampleForm = {
                    name: '',
                    barcodeNum: 0,
                    spec: '',
                    needTakeBlood: '0',
                    code: '',
                    orderNum: 0,
                    isPrint: '0',
                    liscode: '',
                    capacity: '',
                };
            },
            //验证
            getTSampleFormRule() {
                return {
                    name: [
                        {required: true, message: '名称不能为空！', trigger: 'blur'},
                    ],
                    barcodeNum: [
                        {required: true, message: '条码份数不能为空！', trigger: 'change', type: "number"},
                    ],
                    spec: [
                        {required: true, message: '规格不能为空！', trigger: 'blur'},
                        {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '标本代码不能为空！', trigger: 'blur'},
                        {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '排序不能为空！', trigger: 'change', type: "number"},
                    ]
                }
            },
            getOrderNum() {
                tSampleApi.getOrderNum().then(res => {
                    this.tSampleForm.orderNum = res.data;
                })
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
                    this.$refs['tSampleForm'].resetFields();
                    if (this.TSampleId != null && this.TSampleId.trim().length > 0) {
                        tSampleApi.getTSample({id: this.TSampleId}).then(res => {
                            if (res.code == 200) {
                                this.tSampleForm.name = res.data.name;
                                this.tSampleForm.barcodeNum = res.data.barcodeNum;
                                this.tSampleForm.spec = res.data.spec;
                                this.tSampleForm.needTakeBlood = res.data.needTakeBlood.toString();
                                this.tSampleForm.code = res.data.code;
                                this.tSampleForm.orderNum = res.data.orderNum;
                                this.tSampleForm.isPrint = res.data.isPrint.toString();
                                this.tSampleForm.liscode = res.data.liscode;
                                this.tSampleForm.capacity = res.data.capacity;
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
                    } else {
                        this.getOrderNum();
                    }
                } else {
                    this.closeModal(val);
                }
            }
        }
    }
</script>
