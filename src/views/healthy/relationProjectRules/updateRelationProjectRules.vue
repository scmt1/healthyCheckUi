<style lang="less">
.relationProjectRules {
  .ivu-modal {
    width: 660px !important;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
<template>
  <Modal v-model="show" :title="editTitle" :mask-closable="false" class="relationProjectRules">
    <Form ref="relationProjectRulesForm" :model="relationProjectRulesForm" :rules="relationProjectRulesFormRule" :label-width="100">
      <Row>
        <Col span="12">
          <FormItem label="名称" prop="name">
            <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="relationProjectRulesForm.name" placeholder="请输入名称"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="简称" prop="shortName">
            <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="relationProjectRulesForm.shortName" placeholder="请输入简称"/>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="类型" prop="type">
            <Select v-bind:disabled="disabled" v-model="relationProjectRulesForm.type" placeholder="请选择" clearable>
              <Option v-for="(item, i) in typePriority" :key="item.value" :value="item.value">{{ item.title }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="区间值" prop="intervalValue">
            <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="relationProjectRulesForm.intervalValue"
                   placeholder="请输入区间值"/>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="适合性别" prop="allowSex">
            <Select v-bind:disabled="disabled" v-model="relationProjectRulesForm.allowSex" placeholder="请选择" clearable>
              <Option v-for="(item, i) in allowSexPriority" :key="item.value" :value="item.value">{{ item.title }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="进入小结" prop="inConclusion">
            <Select v-bind:disabled="disabled" v-model="relationProjectRulesForm.inConclusion" placeholder="请选择" clearable>
              <Option v-for="(item, i) in inConclusionPriority" :key="item.value" :value="item.value">{{ item.title }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="是否阳性" prop="positive">
            <Select v-bind:disabled="disabled" v-model="relationProjectRulesForm.positive" placeholder="请选择" clearable>
              <Option v-for="(item, i) in positivePriority" :key="item.value" :value="item.value">{{ item.title }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="年龄最低值" prop="minAge">
            <InputNumber v-bind:disabled="disabled" v-model="relationProjectRulesForm.minAge" placeholder="请输入年龄最低值"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="年龄最高值" prop="maxAge">
            <InputNumber v-bind:disabled="disabled" v-model="relationProjectRulesForm.maxAge" placeholder="请输入年龄最高值"/>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="12">
          <FormItem label="职业建议" prop="careerAdvice">
            <Input v-bind:disabled="disabled" :rows="3" type="textarea" v-model="relationProjectRulesForm.careerAdvice"
                   placeholder="请输入职业建议"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="健康建议" prop="healthAdvice">
            <Input v-bind:disabled="disabled" :rows="3" type="textarea" v-model="relationProjectRulesForm.healthAdvice"
                   placeholder="请输入健康建议"/>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="饮食指导" prop="dietaryGuidance">
            <Input v-bind:disabled="disabled" :rows="3" type="textarea" v-model="relationProjectRulesForm.dietaryGuidance"
                   placeholder="请输入饮食指导"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="运动指导" prop="sportsGuidance">
            <Input v-bind:disabled="disabled" :rows="3" type="textarea" v-model="relationProjectRulesForm.sportsGuidance"
                   placeholder="请输入运动指导"/>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="健康知识" prop="healthKnowledge">
            <Input v-bind:disabled="disabled" :rows="3" type="textarea" v-model="relationProjectRulesForm.healthKnowledge"
                   placeholder="请输入健康知识"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="温馨提示" prop="reminder">
            <Input v-bind:disabled="disabled" :rows="3" type="textarea" v-model="relationProjectRulesForm.reminder" placeholder="请输入温馨提示"/>
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
import {addRelationProjectRules, updateRelationProjectRules, getRelationProjectRules} from '@/api/healthy/relationProjectRules'
import {getDictDataByType} from "../../../api";

export default {
  name: "updateRelationProjectRules",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    baseProjectId: {
      type: String
    },
    RelationProjectRulesId: {
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
      relationProjectRulesForm: {
        name: '',
        shortName: '',
        type: '',
        intervalValue: '',
        allowSex: '',
        minAge: 0,
        maxAge: 100,
        inConclusion: '',
        positive: '',
        careerAdvice: '',
        healthAdvice: '',
        dietaryGuidance: '',
        sportsGuidance: '',
        healthKnowledge: '',
        reminder: '',
      },
      relationProjectRulesFormRule: this.getRelationProjectRulesFormRule(),
      typePriority: [],
      allowSexPriority: [],
      inConclusionPriority: [],
      positivePriority: [],

    }
  },
  methods: {
    handelSubmit() {
      this.$refs['relationProjectRulesForm'].validate((valid) => {
        this.loading = true;
        if (valid) {
          this.relationProjectRulesForm.baseProjectId = this.baseProjectId;
          if (this.RelationProjectRulesId != null && this.RelationProjectRulesId.trim().length > 0) {
            this.relationProjectRulesForm.id = this.RelationProjectRulesId;
            updateRelationProjectRules(this.relationProjectRulesForm).then(res => {
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
            addRelationProjectRules(this.relationProjectRulesForm).then(res => {
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
      this.relationProjectRulesForm = {
        name: '',
        shortName: '',
        type: '',
        intervalValue: '',
        allowSex: '',
        minAge: 0,
        maxAge: 100,
        inConclusion: '',
        positive: '',
        careerAdvice: '',
        healthAdvice: '',
        dietaryGuidance: '',
        sportsGuidance: '',
        healthKnowledge: '',
        reminder: '',
      };
    },
    getRelationProjectRulesFormRule() {
      return {
        name: [
          {required: true, message: '名称不能为空！', trigger: 'blur'},
          {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
        ],
        shortName: [
          {required: true, message: '简称不能为空！', trigger: 'blur'},
          {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '类型不能为空！', trigger: 'blur', pattern: /.+/},
        ],
        intervalValue: [
          {required: true, message: '区间值不能为空！', trigger: 'blur'},
          {type: 'string', max: 100, message: '数据的最大长度为100！', trigger: 'blur'}
        ],
        allowSex: [
          {required: true, message: '适合性别不能为空！', trigger: 'blur', pattern: /.+/},
        ],
        minAge: [
          {required: true, message: '年龄最低值不能为空！', trigger: 'blur', type: "number"},
        ],
        maxAge: [
          {required: true, message: '年龄最高值不能为空！', trigger: 'blur', type: "number"},
        ],
        inConclusion: [
          {required: true, message: '是否进入小结不能为空！', trigger: 'blur', pattern: /.+/},
        ],
        positive: [
          {required: true, message: '是否阳性不能为空！', trigger: 'blur', pattern: /.+/},
        ],
        careerAdvice: [
          {required: true, message: '职业建议不能为空！', trigger: 'blur', pattern: /.+/},
        ],
        healthAdvice: [
          {required: true, message: '健康建议不能为空！', trigger: 'blur', pattern: /.+/},
        ],
        // dietaryGuidance: [
        // 	{required: true, message: '饮食指导不能为空！', trigger: 'blur',pattern: /.+/ },
        // ],
        // sportsGuidance: [
        // 	{required: true, message: '运动指导不能为空！', trigger: 'blur',pattern: /.+/ },
        // ],
        // healthKnowledge: [
        // 	{required: true, message: '健康知识不能为空！', trigger: 'blur',pattern: /.+/ },
        // ],
        // reminder: [
        // 	{required: true, message: '温馨提示不能为空！', trigger: 'blur',pattern: /.+/ },
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
        getDictDataByType('yes_no').then(res => {
          if (res.success) {
            this.inConclusionPriority = res.data;
            this.positivePriority = res.data;
          }
        });
        getDictDataByType("sex").then(res => {
          if(res.success) {
            this.allowSexPriority = res.data;
          }
        })
        getDictDataByType('ruleType').then(res => {
          if (res.success) {
            this.typePriority = res.data;
          }
        })
        this.$refs['relationProjectRulesForm'].resetFields();
        if (this.RelationProjectRulesId != null && this.RelationProjectRulesId.trim().length > 0) {
          getRelationProjectRules({id: this.RelationProjectRulesId}).then(res => {
            if (res.code == 200) {
              this.relationProjectRulesForm = res.data;
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
