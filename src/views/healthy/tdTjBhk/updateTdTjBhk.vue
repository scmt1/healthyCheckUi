<style lang="less">
.tdTjBhk {
    .ivu-modal {
        width: 660px !important;
    }

    .ivu-modal-body {
        height: 70vh !important;
        overflow-y: auto;
    }
}
</style>
<template>
    <Modal v-model="show" :title="editTitle" class="tdTjBhk" :mask-closable="false">
        <Form ref="tdTjBhkForm" :model="tdTjBhkForm" :rules="tdTjBhkFormRule" :label-width="100">
            <!--      <Row>-->
            <!--        <Col span="12">-->
            <!--					<FormItem label="自增主键id" prop="id">-->
            <!--						<Input v-bind:disabled="disabled"  type="text" :maxlength=50 v-model="tdTjBhkForm.id" placeholder="请输入自增主键id"/>-->
            <!--					</FormItem>-->
            <!--        </Col>-->
            <!--        <Col span="12">-->
            <!--					<FormItem label="业务系统主键" prop="RID">-->
            <!--						<Input v-bind:disabled="disabled"  type="text" :maxlength=50 v-model="tdTjBhkForm.rid" placeholder="请输入业务系统主键"/>-->
            <!--					</FormItem>-->
            <!--        </Col>-->
            <!--      </Row>-->
            <Row>
                <Col span="12">
                    <FormItem label="体检机构编号" prop="BHKORGAN_CODE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.bhkorganCode" placeholder="请输入体检机构编号，由职业卫生平台提供的机构编码"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="体检编号" prop="BHK_CODE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.bhkCode" placeholder="请输入体检编号，机构内需唯一"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="社会信用代码" prop="INSTITUTION_CODE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.institutionCode" placeholder="请输入社会信用代码"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="企业名称" prop="CRPT_NAME">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.crptName" placeholder="请输入企业名称"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="企业注册地址" prop="CRPT_ADDR">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.crptAddr" placeholder="请输入企业注册地址"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="人员姓名" prop="PERSON_NAME">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.personName" placeholder="请输入人员姓名"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="性别" prop="SEX">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.sex" placeholder="请输入性别"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="证件号码" prop="IDC">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.idc" placeholder="请输入证件号码"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="出生日期" prop="BRTH">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.brth" placeholder="请输入出生日期"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="年龄" prop="AGE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.age" placeholder="请输入年龄"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="婚否" prop="ISXMRD">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.isxmrd" placeholder="请输入婚否"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="人员联系电话" prop="LNKTEL">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.lnktel" placeholder="请输入人员联系电话"/>
                    </FormItem>
                </Col>
            </Row>
            <!--      <Row>-->
            <!--        <Col span="12">-->
            <!--					<FormItem label="体检人员工作部门" prop="DPT">-->
            <!--						<Input v-bind:disabled="disabled"  type="text" :maxlength=50 v-model="tdTjBhkForm.dpt" placeholder="请输入体检人员工作部门"/>-->
            <!--					</FormItem>-->
            <!--        </Col>-->
            <!--        <Col span="12">-->
            <!--					<FormItem label="人员工号" prop="WRKNUM">-->
            <!--						<Input v-bind:disabled="disabled"  type="text" :maxlength=50 v-model="tdTjBhkForm.wrknum" placeholder="请输入人员工号"/>-->
            <!--					</FormItem>-->
            <!--        </Col>-->
            <!--      </Row>-->
            <Row>
                <Col span="12">
                    <FormItem label="总工龄年数" prop="WRKLNT">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.wrklnt" placeholder="请输入总工龄年数"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="总工龄月数" prop="WRKLNTMONTH">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.wrklntmonth" placeholder="请输入总工龄月数,不能超过12,当总工龄年数不为空时，该字段必填"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="接害工龄年数" prop="TCHBADRSNTIM">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.tchbadrsntim" placeholder="请输入接害工龄年数,不能超过12"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="接害工龄月数" prop="TCHBADRSNMONTH">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.tchbadrsnmonth" placeholder="请输入接害工龄月数"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="工种其他名称" prop="WORK_NAME">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.workName" placeholder="请输入工种其他名称"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="在岗状态编码" prop="ONGUARD_STATE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.onguardState" placeholder="请输入在岗状态编码"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="体检日期" prop="BHK_DATE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.bhkDate" placeholder="请输入体检日期"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="体检结果" prop="BHKRST">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.bhkrst" placeholder="请输入体检结果"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="主检建议" prop="MHKADV">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.mhkadv" placeholder="请输入主检建议"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="体检结论" prop="VERDICT">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.verdict" placeholder="请输入体检结论"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="主检医师" prop="MHKDCT">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.mhkdct" placeholder="请输入主检医师"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="体检类型编码" prop="BHK_TYPE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.bhkType" placeholder="请输入体检类型编码"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="主检判定日期" prop="JDGDAT">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.jdgdat" placeholder="请输入主检判定日期"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="接害因素" prop="BADRSN">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.badrsn" placeholder="请输入接害因素"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="是否为复检" prop="IF_RHK">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.ifRhk" placeholder="请输入是否为复检"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="复检对应的上次体检编号" prop="LAST_BHK_CODE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.lastBhkCode" placeholder="请输入复检对应的上次体检编号"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="身份证件类型代码" prop="ID_CARD_TYPE_CODE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.idCardTypeCode" placeholder="请输入身份证件类型代码"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="工种代码" prop="WORK_TYPE_CODE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.workTypeCode" placeholder="请输入工种代码"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="开始接害日期" prop="HARM_START_DATE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.harmStartDate" placeholder="请输入开始接害日期"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="监测类型" prop="JC_TYPE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.jcType" placeholder="请输入监测类型"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="报告打印日期" prop="RPT_PRINT_DATE">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.rptPrintDate" placeholder="请输入报告打印日期"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="用工单位社会信用代码" prop="CREDIT_CODE_EMP">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.creditCodeEmp" placeholder="请输入用工单位社会信用代码"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="用工单位名称" prop="CRPT_NAME_EMP">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.crptNameEmp" placeholder="请输入用工单位名称"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="用工单位行业类别编码" prop="INDUS_TYPE_CODE_EMP">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.indusTypeCodeEmp" placeholder="请输入用工单位行业类别编码"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="用工单位经济类型编码" prop="ECONOMY_CODE_EMP">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.economyCodeEmp" placeholder="请输入用工单位经济类型编码"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="用工单位企业规模编码" prop="CRPT_SIZE_CODE_EMP">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.crptSizeCodeEmp" placeholder="请输入用工单位企业规模编码"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="用工单位所属地区编码" prop="ZONE_CODE_EMP">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.zoneCodeEmp" placeholder="请输入用工单位所属地区编码"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="是否上传标志" prop="flag">
                        <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tdTjBhkForm.flag" placeholder="请输入是否上传标志"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="错误信息" prop="errorInfo">
                        <Input type="textarea" v-model="tdTjBhkForm.errorInfo" readonly :rows="6"></Input>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handSubmit" v-if="!disabled">提交</Button>
        </div>
    </Modal>
</template>
<script>
import {addTdTjBhk, updateTdTjBhk, getTdTjBhk} from '@/api/healthy/tdTjBhk'
import {getDictDataByType} from '@/api/index';

export default {
    name: "updateTdTjBhk",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        TdTjBhkId: {
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
            tdTjBhkForm: {
                id: '',
                rid: '',
                bhkorganCode: '',
                bhkCode: '',
                institutionCode: '',
                crptName: '',
                crptAddr: '',
                personName: '',
                sex: '',
                idc: '',
                brth: '',
                age: '',
                isxmrd: '',
                lnktel: '',
                dpt: '',
                wrknum: '',
                wrklnt: '',
                wrklntmonth: '',
                tchbadrsntim: '',
                tchbadrsnmonth: '',
                workName: '',
                onguardState: '',
                bhkDate: '',
                bhkrst: '',
                mhkadv: '',
                verdict: '',
                mhkdct: '',
                bhkType: '',
                jdgdat: '',
                badrsn: '',
                ifRhk: '',
                lastBhkCode: '',
                idCardTypeCode: '',
                workTypeCode: '',
                harmStartDate: '',
                jcType: '',
                rptPrintDate: '',
                creditCodeEmp: '',
                crptNameEmp: '',
                indusTypeCodeEmp: '',
                economyCodeEmp: '',
                crptSizeCodeEmp: '',
                zoneCodeEmp: '',
                flag: '',
                errorInfo: '',
            },
            tdTjBhkFormRule: this.getTdTjBhkFormRule()
        }
    },
    methods: {
        handSubmit() {
            this.$refs['tdTjBhkForm'].validate((valid) => {
                this.loading = true;
                if (valid) {
                    if (this.TdTjBhkId != null && this.TdTjBhkId.trim().length > 0) {
                        this.tdTjBhkForm.id = this.TdTjBhkId;
                        updateTdTjBhk(this.tdTjBhkForm).then(res => {
                            if (res.success) {
                                this.closeModal(false);
                                this.$emit('handSearch');
                                this.$Message.success('保存成功');
                            } else {
                                this.$Message.error(res.msg);
                            }
                        }).finally(() => {
                            this.loading = false;
                        });
                    } else {
                        addTdTjBhk(this.tdTjBhkForm).then(res => {
                            if (res.success) {
                                this.closeModal(false);
                                this.$emit('handSearch');
                                sss
                                this.$Message.success('保存成功');
                            } else {
                                this.$Message.error(res.msg);
                            }
                        }).finally(() => {
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
            this.tdTjBhkForm = {
                id: '',
                rid: '',
                bhkorganCode: '',
                bhkCode: '',
                institutionCode: '',
                crptName: '',
                crptAddr: '',
                personName: '',
                sex: '',
                idc: '',
                brth: '',
                age: '',
                isxmrd: '',
                lnktel: '',
                dpt: '',
                wrknum: '',
                wrklnt: '',
                wrklntmonth: '',
                tchbadrsntim: '',
                tchbadrsnmonth: '',
                workName: '',
                onguardState: '',
                bhkDate: '',
                bhkrst: '',
                mhkadv: '',
                verdict: '',
                mhkdct: '',
                bhkType: '',
                jdgdat: '',
                badrsn: '',
                ifRhk: '',
                lastBhkCode: '',
                idCardTypeCode: '',
                workTypeCode: '',
                harmStartDate: '',
                jcType: '',
                rptPrintDate: '',
                creditCodeEmp: '',
                crptNameEmp: '',
                indusTypeCodeEmp: '',
                economyCodeEmp: '',
                crptSizeCodeEmp: '',
                zoneCodeEmp: '',
                flag: '',
                errorInfo: '',
            };
        },
        getTdTjBhkFormRule() {
            return {
                // id: [
                // 	{required: true, message: '自增主键id不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // rid: [
                // 	{required: true, message: '业务系统主键不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // bhkorganCode: [
                // 	{required: true, message: '体检机构编号，由职业卫生平台提供的机构编码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // bhkCode: [
                // 	{required: true, message: '体检编号，机构内需唯一不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // institutionCode: [
                // 	{required: true, message: '社会信用代码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // crptName: [
                // 	{required: true, message: '企业名称不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // crptAddr: [
                // 	{required: true, message: '企业注册地址不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // personName: [
                // 	{required: true, message: '人员姓名不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // sex: [
                // 	{required: true, message: '性别不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // idc: [
                // 	{required: true, message: '证件号码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // brth: [
                // 	{required: true, message: '出生日期不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // age: [
                // 	{required: true, message: '年龄不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // isxmrd: [
                // 	{required: true, message: '婚否不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // lnktel: [
                // 	{required: true, message: '人员联系电话不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // dpt: [
                // 	{required: true, message: '体检人员工作部门不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // wrknum: [
                // 	{required: true, message: '人员工号不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // wrklnt: [
                // 	{required: true, message: '总工龄年数不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // wrklntmonth: [
                // 	{required: true, message: '总工龄月数,不能超过12,当总工龄年数不为空时，该字段必填不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // tchbadrsntim: [
                // 	{required: true, message: '接害工龄年数,不能超过12不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // tchbadrsnmonth: [
                // 	{required: true, message: '接害工龄月数不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // workName: [
                // 	{required: true, message: '工种其他名称不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // onguardState: [
                // 	{required: true, message: '在岗状态编码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // bhkDate: [
                // 	{required: true, message: '体检日期不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // bhkrst: [
                // 	{required: true, message: '体检结果不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // mhkadv: [
                // 	{required: true, message: '主检建议不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // verdict: [
                // 	{required: true, message: '体检结论不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // mhkdct: [
                // 	{required: true, message: '主检医师不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // bhkType: [
                // 	{required: true, message: '体检类型编码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // jdgdat: [
                // 	{required: true, message: '主检判定日期不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // badrsn: [
                // 	{required: true, message: '接害因素不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // ifRhk: [
                // 	{required: true, message: '是否为复检不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // lastBhkCode: [
                // 	{required: true, message: '复检对应的上次体检编号不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // idCardTypeCode: [
                // 	{required: true, message: '身份证件类型代码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // workTypeCode: [
                // 	{required: true, message: '工种代码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // harmStartDate: [
                // 	{required: true, message: '开始接害日期不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // jcType: [
                // 	{required: true, message: '监测类型不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // rptPrintDate: [
                // 	{required: true, message: '报告打印日期不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // creditCodeEmp: [
                // 	{required: true, message: '用工单位社会信用代码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // crptNameEmp: [
                // 	{required: true, message: '用工单位名称不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // indusTypeCodeEmp: [
                // 	{required: true, message: '用工单位行业类别编码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // economyCodeEmp: [
                // 	{required: true, message: '用工单位经济类型编码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // crptSizeCodeEmp: [
                // 	{required: true, message: '用工单位企业规模编码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // zoneCodeEmp: [
                // 	{required: true, message: '用工单位所属地区编码不能为空！', trigger: 'blur',pattern: /.+/ },
                // ],
                // flag: [
                // 	{required: true, message: '是否上传标志 是否上传标识--0：未上传 1：上传成功 2：上传失败不能为空！', trigger: 'blur',pattern: /.+/ },
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
                this.$refs['tdTjBhkForm'].resetFields();
                this.$refs['tdTjBhkForm'].id = null;
                if (this.TdTjBhkId != null && this.TdTjBhkId.trim().length > 0) {
                    getTdTjBhk({id: this.TdTjBhkId}).then(res => {
                        if (res.success) {
                            this.tdTjBhkForm = res.data;
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
