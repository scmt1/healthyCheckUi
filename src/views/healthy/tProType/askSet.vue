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
        <Form ref="tProTypeForm" :model="tAskProjectForm" :rules="tAskProjectFormRule" :label-width="100">
            <Row>
                <Col span="24">
                    <FormItem label="危害因素" prop="hazardFactorId">
                        <Input readonly
                               v-model="tAskProjectForm.hazardFactorName"
                               v-width="330"/>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem label="问诊科目" prop="askProject">
                        <Select v-width="330"
                                multiple
                                v-model="tAskProjectForm.askProject"
                                placeholder="请选择">
                            <Option v-for="(item,index) in askProjectArr" :key="index" :value="item.value">{{item.value}}</Option>
                        </Select>
                    </FormItem>
                </Col>

                <Col span="24">
                    <FormItem label="备注">
                        <Input :disabled="disabled"
                               type="textarea"
                               :rows="6"
                               :maxlength=50
                               v-model="tAskProjectForm.remark"
                               placeholder="请输入备注"/>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div slot="footer">
            <Button type="default" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handelSubmit">提交</Button>
        </div>
    </Modal>
</template>
<script>
    import {addTAskProject, updateTAskProject, getTAskProject, getTAskProjectByHazardId} from '@/api/healthy/tAskProject';
    import {getDictDataByType} from "../../../api";

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
            TTypeName: {
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
                tAskProjectForm: {
                    hazardFactorId: "",
                    hazardFactorName: "",
                    askProject: "",
                    remark: ''
                },
                askProjectArr: [],
                tAskProjectFormRule: this.getTAskProjectFormRule()
            }
        },
        methods: {
            //提交
            handelSubmit() {
                this.$refs['tProTypeForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.tAskProjectForm.askProject = this.tAskProjectForm.askProject.join(",");

                        if (this.tAskProjectForm.id != null && this.tAskProjectForm.id.trim().length > 0) {
                            updateTAskProject(this.tAskProjectForm).then(res => {
                                if (res.code == 200) {
                                    this.closeModal(false);
                                    this.$Message.success('保存成功');
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            }).finally(() => {
                                this.loading = true;
                            })
                        } else {
                            addTAskProject(this.tAskProjectForm).then(res => {
                                if (res.code == 200) {
                                    this.closeModal(false);
                                    this.$Message.success('保存成功');
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            }).finally(() => {
                                this.loading = true;
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
                this.tAskProjectForm = {
                    hazardFactorId: "",
                    hazardFactorName: "",
                    askProject: "",
                    remark: ''
                };
            },
            //字段验证
            getTAskProjectFormRule() {
                return {
                    hazardFactorId: [
                        {required: true, message: '危害因素不能为空！', trigger: 'change', pattern: /.+/}
                    ],
                    askProject: [
                        {required: true, message: '问诊科目不能为空！', trigger: 'change', pattern: /.+/}
                    ]
                }
            },
            async getHazardFactorData() {
                return await getDictDataByType("hazardFactorType").then(res => res.data)
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            async show(val) {
                this.initForm();
                this.loading = false;
                this.editTitle = this.modalTitle;

                this.tAskProjectForm.hazardFactorId = this.TProTypeId;
                this.tAskProjectForm.hazardFactorName = this.TTypeName;

                this.askProjectArr = await this.getHazardFactorData();

                if (val) {
                    if (this.TProTypeId != null && this.TProTypeId.trim().length > 0) {
                        getTAskProjectByHazardId({hazardFactorId: this.TProTypeId}).then(res => {
                            if (res.success && res.data) {
                                this.tAskProjectForm = res.data;
                                if (this.tAskProjectForm.askProject) {
                                    this.tAskProjectForm.askProject = this.tAskProjectForm.askProject.split(",");
                                }
                            }
                        })
                    }
                } else {
                    this.closeModal(val);
                }
            }
        }
    }
</script>
