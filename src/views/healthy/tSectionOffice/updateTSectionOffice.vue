<style lang="less">
.tSectionOffice {
  .ivu-modal {
    width: 660px !important;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
<template>
  <Modal v-model="show" :title="editTitle" :mask-closable="false" class="tSectionOffice">
    <Form ref="tSectionOfficeForm" :model="tSectionOfficeForm" :rules="tSectionOfficeFormRule" :label-width="90">
      <FormItem label="科室编码" prop="sectionCode">
        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tSectionOfficeForm.sectionCode" placeholder="请输入科室编码"/>
      </FormItem>
      <FormItem label="科室名称" prop="sectionName">
        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tSectionOfficeForm.sectionName" placeholder="请输入科室名称"/>
      </FormItem>
      <FormItem label="科室简拼" prop="sectionAlphbet">
        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tSectionOfficeForm.sectionAlphbet" placeholder="请输入科室简拼"/>
      </FormItem>
      <FormItem label="排序" prop="orderNum">
        <InputNumber type="number" v-bind:disabled="disabled" :min="1" :step="0.1" v-model="tSectionOfficeForm.orderNum" placeholder="请输入排序"/>
      </FormItem>
      <FormItem label="联系人">
        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tSectionOfficeForm.contact" placeholder="请输入联系人"/>
      </FormItem>
      <FormItem label="联系人电话">
        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tSectionOfficeForm.contactMobile" placeholder="请输入联系人电话"/>
      </FormItem>
      <FormItem label="检查类型">
        <Select v-bind:disabled="disabled" v-model="tSectionOfficeForm.checkTypeList" placeholder="请选择" clearable multiple>
          <Option v-for="(item, i) in checkTypePriority" :key="item.value" :value="item.value">{{ item.title }}</Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="show=false">取消</Button>
      <Button type="primary" :loading="loading" @click="handelSubmit">提交</Button>
    </div>
  </Modal>
</template>
<script>
import {addTSectionOffice, updateTSectionOffice, getTSectionOffice} from '@/api/healthy/tSectionOffice'
import {getDictDataByType} from "../../../api";


export default {
  name: "updateTSectionOffice",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    TSectionOfficeId: {
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
      tSectionOfficeForm: {
        sectionCode: '',
        sectionName: '',
        sectionAlphbet: '',
        orderNum: 0,
        contact: '',
        contactMobile: '',
        checkType: '',
        checkTypeList: [],
      },
      checkTypePriority: [],
      tSectionOfficeFormRule: this.getTSectionOfficeFormRule()
    }
  },
  methods: {
    handelSubmit() {
      this.$refs['tSectionOfficeForm'].validate((valid) => {
        this.loading = true;
        if (valid) {
          if (this.tSectionOfficeForm.checkTypeList) {
            this.tSectionOfficeForm.checkType = this.tSectionOfficeForm.checkTypeList.join(",");
          }
          if (this.TSectionOfficeId != null && this.TSectionOfficeId.trim().length > 0) {
            this.tSectionOfficeForm.id = this.TSectionOfficeId;
            updateTSectionOffice(this.tSectionOfficeForm).then(res => {
              this.loading = false;
              if (res) {
                if (res.code == 200) {
                  this.closeModal(false);
                  this.$emit('handleSearch');
                  this.$Message.success('保存成功');
                }
              } else {
                this.$Message.error('保存失败');
              }
            }).catch(err => {
              this.loading = false;
            });
          } else {
            addTSectionOffice(this.tSectionOfficeForm).then(res => {
              this.loading = false;
              if (res) {
                if (res.code == 200) {
                  this.closeModal(false);
                  this.$emit('handleSearch');
                  this.$Message.success('保存成功');
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
      this.tSectionOfficeForm = {
        sectionCode: '',
        sectionName: '',
        sectionAlphbet: '',
        orderNum: 0,
        contact: '',
        contactMobile: '',
        checkType: '',
        checkTypeList: [],
      };
    },
    getTSectionOfficeFormRule() {
      return {
        sectionCode: [
          {required: true, message: '科室编码不能为空！', trigger: 'blur'},
          {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
        ],
        sectionName: [
          {required: true, message: '科室名称不能为空！', trigger: 'blur'},
          {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
        ],
        sectionAlphbet: [
          {required: true, message: '科室简拼不能为空！', trigger: 'blur'},
          {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
        ],
        orderNum: [
          {required: true, message: '排序不能为空！', trigger: 'blur', type: 'number'},
        ],
        contact: [
          {required: true, message: '联系人不能为空！', trigger: 'blur'},
          {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
        ],
        contactMobile: [
          {required: true, message: '联系人电话不能为空！', trigger: 'blur'},
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
        getDictDataByType('checkType').then(res => {
          if (res.success) {
            this.checkTypePriority = res.data;
          }
        })
        this.$refs['tSectionOfficeForm'].resetFields();
        if (this.TSectionOfficeId != null && this.TSectionOfficeId.trim().length > 0) {
          getTSectionOffice({id: this.TSectionOfficeId}).then(res => {
            if (res) {
              if (res.code == 200) {
                this.tSectionOfficeForm.sectionCode = res.data.sectionCode;
                this.tSectionOfficeForm.sectionName = res.data.sectionName;
                this.tSectionOfficeForm.sectionAlphbet = res.data.sectionAlphbet;
                this.tSectionOfficeForm.orderNum = res.data.orderNum;
                this.tSectionOfficeForm.contact = res.data.contact;
                this.tSectionOfficeForm.contactMobile = res.data.contactMobile;
                this.tSectionOfficeForm.checkType = res.data.checkType;
                this.tSectionOfficeForm.checkTypeList = res.data.checkType.split(",");
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
