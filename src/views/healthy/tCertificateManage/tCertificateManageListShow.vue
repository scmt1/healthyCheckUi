<template>
    <Modal v-model="show" :title="editTitle"  :mask-closable="false">
        <Form ref="tCertificateManageForm" :model="tCertificateManageForm"  :label-width="100">
            <FormItem label="异常信息">
                <Input  type="textarea" :rows="4" v-model="tCertificateManageForm.exceptionMessage" readonly />
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
    import {getTCertificateManage} from '@/api/healthy/tCertificateManage'
    export default {
        name: "tCertificateManageListShow",
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
                show:false,
                tCertificateManageForm: {
                    exceptionMessage:'',
                },
                editTitle:'',
            }
        },
        methods:{
            initForm(){
                this.tCertificateManageForm= {
                    exceptionMessage:'',
                };
            },
            closeModal(val) {
                this.$emit('input', val);
            },
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                let _this = this;
                _this.initForm();
                _this.editTitle = this.modalTitle;
                if (val){
                    _this.$refs['tCertificateManageForm'].resetFields();
                    _this.$refs['tCertificateManageForm'].id = null;
                    if(_this.TCertificateManageId!=null&&_this.TCertificateManageId.trim().length>0){
                        getTCertificateManage({id: _this.TCertificateManageId}).then(res => {
                            if (res.success) {
                                debugger
                                _this.tCertificateManageForm.exceptionMessage = res.data.exceptionMessage;
                            } else {
                                _this.$Message.error(res.msg);
                            }
                        });
                    }
                }else{
                    this.closeModal(val);
                }
            }
        }
    }
</script>

<style scoped>

</style>