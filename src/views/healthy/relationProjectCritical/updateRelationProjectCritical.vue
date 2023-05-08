<style lang="less">
.relationProjectCritical {
  .ivu-modal {
    width: 660px !important;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
<template>
  <Modal v-model="show" :title="editTitle" :mask-closable="false">
    <Form ref="relationProjectCriticalForm" :model="relationProjectCriticalForm" :rules="relationProjectCriticalFormRule"
          class="relationProjectCritical" :label-width="100">
      <FormItem label="等级" prop="level">
        <Select v-bind:disabled="disabled" v-model="relationProjectCriticalForm.level" placeholder="请选择" clearable>
          <Option v-for="(item, i) in levelPriority" :key="item.value" :value="item.value">{{ item.title }}</Option>
        </Select>
      </FormItem>
      <FormItem label="类型" prop="type">
        <Select v-bind:disabled="disabled" v-model="relationProjectCriticalForm.type" placeholder="请选择" clearable>
          <Option v-for="(item, i) in typePriority" :key="item.value" :value="item.value">{{ item.title }}</Option>
        </Select>
      </FormItem>
      <FormItem label="区间值" prop="intervalValue">
        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="relationProjectCriticalForm.intervalValue"
               placeholder="请输入区间值"/>
      </FormItem>
      <FormItem label="适合性别" prop="allowSex">
        <Select v-bind:disabled="disabled" v-model="relationProjectCriticalForm.allowSex" placeholder="请选择" clearable>
          <Option v-for="(item, i) in allowSexPriority" :key="item.value" :value="item.value">{{ item.title }}</Option>
        </Select>
      </FormItem>
      <FormItem label="年龄最低值" prop="minAge">
        <InputNumber v-bind:disabled="disabled" v-model="relationProjectCriticalForm.minAge" placeholder="请输入年龄最低值"/>
      </FormItem>
      <FormItem label="年龄最高值" prop="maxAge">
        <InputNumber v-bind:disabled="disabled" v-model="relationProjectCriticalForm.maxAge" placeholder="请输入年龄最高值"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="show=false">取消</Button>
      <Button type="primary" :loading="loading" @click="handelSubmit">提交</Button>
    </div>
  </Modal>
</template>
<script>
import {addRelationProjectCritical, updateRelationProjectCritical, getRelationProjectCritical} from '@/api/healthy/relationProjectCritical'
import {getDictDataByType} from "../../../api";

export default {
  name: "updateRelationProjectCritical",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    RelationProjectCriticalId: {
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
      relationProjectCriticalForm: {
        level: '',
        type: '',
        intervalValue: '',
        allowSex: '',
        minAge: 0,
        maxAge: 100,
      },
      relationProjectCriticalFormRule: this.getRelationProjectCriticalFormRule(),
      levelPriority: [],
      typePriority: [],
      allowSexPriority: [],
    }
  },
  methods: {
    handelSubmit() {
      this.$refs['relationProjectCriticalForm'].validate((valid) => {
        this.loading = true;
        if (valid) {
          this.relationProjectCriticalForm.baseProjectId = this.baseProjectId;
          if (this.RelationProjectCriticalId != null && this.RelationProjectCriticalId.trim().length > 0) {
            this.relationProjectCriticalForm.id = this.RelationProjectCriticalId;
            updateRelationProjectCritical(this.relationProjectCriticalForm).then(res => {
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
            addRelationProjectCritical(this.relationProjectCriticalForm).then(res => {
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
      this.relationProjectCriticalForm = {
        level: '',
        type: '',
        intervalValue: '',
        allowSex: '',
        minAge: 0,
        maxAge: 100,
      };
    },
    getRelationProjectCriticalFormRule() {
      return {
        level: [
          {required: true, message: '等级不能为空！', trigger: 'blur', pattern: /.+/},
        ],
        type: [
          {required: true, message: '类型不能为空！', trigger: 'blur', pattern: /.+/},
        ],
        intervalValue: [
          {required: true, message: '区间值不能为空！', trigger: 'blur'},
          {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
        ],
        // allowSex: [
        //   {required: true, message: '适合性别不能为空！', trigger: 'blur', pattern: /.+/},
        // ],
        // minAge: [
        //   {required: true, message: '年龄最低值不能为空！', trigger: 'blur', type: 'number'},
        // ],
        // maxAge: [
        //   {required: true, message: '年龄最高值不能为空！', trigger: 'blur', type: 'number'},
        // ],
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
        getDictDataByType('ruleLevel').then(res => {
          if (res.success) {
            this.levelPriority = res.data;
          }
        })
        getDictDataByType('ruleType').then(res => {
          if (res.success) {
            this.typePriority = res.data;
          }
        })
        getDictDataByType("sex").then(res => {
          if(res.success) {
            this.allowSexPriority = res.data;
          }
        })

        this.$refs['relationProjectCriticalForm'].resetFields();
        if (this.RelationProjectCriticalId != null && this.RelationProjectCriticalId.trim().length > 0) {
          getRelationProjectCritical({id: this.RelationProjectCriticalId}).then(res => {
            if (res) {
              if (res.code == 200) {
                this.relationProjectCriticalForm.level = res.data.level;
                this.relationProjectCriticalForm.type = res.data.type;
                this.relationProjectCriticalForm.intervalValue = res.data.intervalValue;
                this.relationProjectCriticalForm.allowSex = res.data.allowSex;
                this.relationProjectCriticalForm.minAge = res.data.minAge;
                this.relationProjectCriticalForm.maxAge = res.data.maxAge;
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
