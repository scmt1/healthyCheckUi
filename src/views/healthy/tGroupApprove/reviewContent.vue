<template>
    <Modal v-model="show" class="reviewContent" :fullscreen="isFullscreen" :mask-closable="false">
        <div slot="header" style="position: relative; margin-right: 30px;display: flex;justify-content: space-between;    cursor: pointer;">
            <p>{{title}}</p>
            <Icon type="md-expand" @click="changeFull" size="24" color="#ccc"></Icon>
        </div>
<!--        <Form ref="reviewContentForm" :model="reviewContentForm"  :rules="reviewContentFormRule"-->
<!--              class="form">-->
<!--            <div>-->
<!--                <div>一、用人单位提供的资料（盖鲜章）主检医师审核（并签字）的内容：(一级审核）</div>-->
<!--                <div style="margin-top: 6px;">1.用人单位提供的资料（盖鲜章）：</div>-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="12">-->
<!--                        <FormItem label="用人单位基本情况信息表：" prop="isInfoTable">-->
<!--                            <RadioGroup v-model="reviewContentForm.isInfoTable">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                    <Col span="12">-->
<!--                        <FormItem label="近期职业病危害因素检测报告或评价报告：" prop="isAssessmentReport">-->
<!--                            <RadioGroup v-model="reviewContentForm.isAssessmentReport">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="12">-->
<!--                        <FormItem label="营业执照（三证合一）：" prop="isBusinessLicense">-->
<!--                            <RadioGroup v-model="reviewContentForm.isBusinessLicense">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                    <Col span="12">-->
<!--                        <FormItem label="合同（委托书）：" prop="isEntrustReport">-->
<!--                            <RadioGroup v-model="reviewContentForm.isEntrustReport">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="预体检人员名单信息（姓名、性别、身份证号、手机号、工龄、岗位、职业病危害因素、接害工龄等）：" prop="isPersonInfo">-->
<!--                            <RadioGroup v-model="reviewContentForm.isPersonInfo">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                &lt;!&ndash;            <div>2.检查类别和项目是否与备案一致：</div>&ndash;&gt;-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="2.检查类别和项目是否与备案一致：" prop="isKeepRecord">-->
<!--                            <RadioGroup v-model="reviewContentForm.isKeepRecord">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                &lt;!&ndash;            <div>3.仪器设备是否满足合同（协议）所订职业健康检查需求：</div>&ndash;&gt;-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="3.仪器设备是否满足合同（协议）所订职业健康检查需求：" prop="isEquipmentTrue">-->
<!--                            <RadioGroup v-model="reviewContentForm.isEquipmentTrue">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                &lt;!&ndash;            <div>4.委托单位要求是否符合国家有关法律、政策和标准规范的要求：</div>&ndash;&gt;-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="4.委托单位要求是否符合国家有关法律、政策和标准规范的要求：" prop="isStandard">-->
<!--                            <RadioGroup v-model="reviewContentForm.isStandard">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                &lt;!&ndash;            <div>5.是否与委托单位进行了真实而有效的沟通，了解委托单位的真实需求：</div>&ndash;&gt;-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="5.是否与委托单位进行了真实而有效的沟通，了解委托单位的真实需求：" prop="isUnderstandNeeds">-->
<!--                            <RadioGroup v-model="reviewContentForm.isUnderstandNeeds">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                &lt;!&ndash;            <div>6.是否涉及项目的分包：</div>&ndash;&gt;-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="6.是否涉及项目的分包：" prop="isSubcontract">-->
<!--                            <RadioGroup v-model="reviewContentForm.isSubcontract">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                &lt;!&ndash;            <div>7.委托方对体检时间、期限有无特别要求：</div>&ndash;&gt;-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="7.委托方对体检时间、期限有无特别要求："  prop="isSpecialRequirements">-->
<!--                            <RadioGroup v-model="reviewContentForm.isSpecialRequirements">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                &lt;!&ndash;            <div>8.是否告知委托方体检方案及体检注意事项：</div>&ndash;&gt;-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="8.是否告知委托方体检方案及体检注意事项：" prop="isInform">-->
<!--                            <RadioGroup v-model="reviewContentForm.isInform">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                <Row style="margin-top: 12px;">9.报告领取方式：</Row>-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="是否委托方自取：" prop="isTakeFromOneself">-->
<!--                            <RadioGroup v-model="reviewContentForm.isTakeFromOneself">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>否</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>是</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--            </div>-->
<!--            <div v-if="reviewContentForm.auditLevel >= 2">-->
<!--                <div style="margin-top: 6px;">二、审核结论：(二级审核）</div>-->
<!--                <div style="margin-top: 6px;">1.本机构的职业健康检查能力满足委托单位的相关要求：</div>-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="可以为委托单位提供职业健康检查服务：" prop="isCanService">-->
<!--                            <RadioGroup v-model="reviewContentForm.isCanService">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>不可以</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>可以</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                &lt;!&ndash;            <div v-if="reviewContentForm.isInfoTable == '1'"> 2.不能为委托单位提供职业健康检查服务，原因：</div>&ndash;&gt;-->
<!--                <Row v-if="reviewContentForm.isCanService == '1'" style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="2.不能为委托单位提供职业健康检查服务，原因：" prop="reason">-->
<!--                            <Input type="textarea" :maxlength=50-->
<!--                                   v-model="reviewContentForm.reason" placeholder="请输入原因"/>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="11">-->
<!--                        <FormItem label="审核结论日期：" prop="conclusionDate">-->
<!--                            <DatePicker type="date"-->
<!--                                        placeholder="请选择日期"-->
<!--                                        style="width: 100%;"-->
<!--                                        format="yyyy-MM-dd"-->
<!--                                        v-model="reviewContentForm.conclusionDate"/>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                    <Col span="13">-->
<!--                        <FormItem label="质控科负责人或体检中心负责人：" prop="conclusionPersonInCharge">-->
<!--                            <Input type="text" :maxlength=50-->
<!--                                   v-model="reviewContentForm.conclusionPersonInCharge" placeholder="请输入负责人"/>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--            </div>-->
<!--            <div v-if="reviewContentForm.auditLevel >= 3">-->
<!--                <div style="margin-top: 6px;">三、批准：(三级审核）</div>-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="24">-->
<!--                        <FormItem label="是否同意批准：" prop="isAgree">-->
<!--                            <RadioGroup v-model="reviewContentForm.isAgree">-->
<!--                                <Radio style="margin-bottom: -9px;" :label='1'>不同意</Radio>-->
<!--                                <Radio style="margin-bottom: -9px;" :label='2'>同意</Radio>-->
<!--                            </RadioGroup>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--                <Row style="margin-top: 6px;">-->
<!--                    <Col span="11">-->
<!--                        <FormItem label="审核批准日期：" prop="approvalDate">-->
<!--                            <DatePicker type="date"-->
<!--                                        placeholder="请选择日期"-->
<!--                                        style="width: 100%;"-->
<!--                                        format="yyyy-MM-dd"-->
<!--                                        v-model="reviewContentForm.approvalDate"/>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                    <Col span="13">-->
<!--                        <FormItem label="领导或技术负责人：" prop="approvalPersonInCharge">-->
<!--                            <Input type="text" :maxlength=50-->
<!--                                   v-model="reviewContentForm.approvalPersonInCharge" placeholder="请输入负责人"/>-->
<!--                        </FormItem>-->
<!--                    </Col>-->
<!--                </Row>-->
<!--            </div>-->
<!--        </Form>-->
        <iframe :src="pdfUrl" style="width: 100%; height: 100%;min-height: 65vh;" v-if="pdfUrl && pdfUrl.trim().length>0"></iframe>
        <div style="width: 100%; height: 100%;min-height: 65vh;" v-else>
            <!--暂无数据-->
            <no-data width="150" style="height: 100%;min-height: 65vh;overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>
        </div>
        <div slot="footer">
            <Button type="text" @click="closeLoading">取消</Button>
<!--            <Button type="primary" :loading="loading" v-if="reviewContentForm.auditLevel != 4" @click="handelSubmit">提交</Button>-->
        </div>
        <Spin fix v-show="loading">
            <div class="demo-spin-icon-load">
                <!-- 这里用的是阿里图标库 -->
                <i class="iconfont icon-loader--line"></i>
            </div>
            <div style='font-size:16px'>Loading...</div>
        </Spin>
    </Modal>
</template>

<script>
    import noData from "../../../components/no-data"
    import {approve, getTOrderAndFlowData, getTReviewContent} from "../../../api/healthy/tOrderFlow";
    import {formartDate} from "@/api/tools/tool";
    import {
        updateTGroupOrderState
    } from "../../../api/healthy/tGroupOrder";
    import {userInfo} from "../../../api";
    import {getTemplatePreviewData} from '@/api/healthy/tTemplate';

    export default {
        name: "reviewContent",
        components: {
            noData
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            orderId: {
                type: String,
                default: ""
            },
            orderInfo: {
                type: Object,
            },
            flowData: {
                type: Array,
            }
        },
        data() {
            return {
                isFullscreen: false,
                hospitalNameData:{},
                tGroupUnit: {},
                uploadList: [],
                flowData: [],
                orderInfo: {},
                reviewContentData: {},
                pdfUrl:"",
                show: this.value,
                title: "评审报告预览",
                loading: false,
                doctorInfo: [],
                reviewContentForm: {
                    id: '',
                    orderId: '',
                    isInfoTable: '',//用人单位基本情况信息表
                    isAssessmentReport: '',//近期职业病危害因素检测报告或评价报告
                    isBusinessLicense: '',//营业执照（三证合一）
                    isEntrustReport: '',//合同（委托书）
                    isPersonInfo: '',//预体检人员名单信息
                    isKeepRecord: '',//检查类别和项目是否与备案一致
                    isEquipmentTrue: '',//仪器设备是否满足合同（协议）所订职业健康检查需求
                    isStandard: '',//委托单位要求是否符合国家有关法律、政策和标准规范的要求
                    isUnderstandNeeds: '',//是否与委托单位进行了真实而有效的沟通，了解委托单位的真实需求
                    isSubcontract: '',//是否涉及项目分包
                    isSpecialRequirements: '',//委托方对体检时间、期限有无特别要求
                    isInform: '',//是否告知委托方体检方案及体检注意事项
                    isTakeFromOneself: '',//是否委托方自取
                    isCanService: '',//可以为委托单位提供职业健康检查服务
                    reason: '',//不能为委托单位提供职业健康检查服务，原因
                    conclusionPersonInCharge: '',//质控科负责人或体检中心负责人
                    conclusionDate: null,//审核结论日期
                    approvalPersonInCharge: '',//领导或技术负责人
                    isAgree: '',//是否同意批准
                    reasonNoAgree: '',//不同意批准，原因
                    approvalDate: null,//审核批准日期
                    auditLevel: 1,//审核级别
                },
                reviewContentFormRule: {
                    isInfoTable: [
                        {required: true,type: 'number', message: '用人单位基本情况信息表是否存在不能为空！', trigger: 'change'},
                    ],
                    isAssessmentReport: [
                        {required: true,type: 'number', message: '近期职业病危害因素检测报告或评价报告是否存在不能为空！', trigger: 'change'},
                    ],
                    isBusinessLicense: [
                        {required: true,type: 'number', message: '营业执照（三证合一）是否存在不能为空！', trigger: 'change'},
                    ],
                    isEntrustReport: [
                        {required: true,type: 'number', message: '合同（委托书）是否存在不能为空！', trigger: 'change'},
                    ],
                    isPersonInfo: [
                        {required: true,type: 'number', message: '预体检人员名单信息是否存在不能为空！', trigger: 'change'},
                    ],
                    isKeepRecord: [
                        {required: true,type: 'number', message: '预检查类别和项目是否与备案一致不能为空！', trigger: 'change'},
                    ],
                    isEquipmentTrue: [
                        {required: true,type: 'number', message: '仪器设备是否满足合同（协议）所订职业健康检查需求不能为空！', trigger: 'change'},
                    ],
                    isStandard: [
                        {required: true,type: 'number', message: '委托单位要求是否符合国家有关法律、政策和标准规范的要求不能为空！', trigger: 'change'},
                    ],
                    isUnderstandNeeds: [
                        {required: true,type: 'number', message: '是否与委托单位进行了真实而有效的沟通，了解委托单位的真实需求不能为空！', trigger: 'change'},
                    ],
                    isSubcontract: [
                        {required: true,type: 'number', message: '是否涉及项目分包不能为空！', trigger: 'change'},
                    ],
                    isSpecialRequirements: [
                        {required: true,type: 'number', message: '委托方对体检时间、期限有无特别要求不能为空！', trigger: 'change'},
                    ],
                    isInform: [
                        {required: true,type: 'number', message: '是否告知委托方体检方案及体检注意事项不能为空！', trigger: 'change'},
                    ],
                    isTakeFromOneself: [
                        {required: true,type: 'number', message: '是否委托方自取不能为空！', trigger: 'change'},
                    ],
                    isCanService: [
                        {required: true,type: 'number', message: '是否可以为委托单位提供职业健康检查服务不能为空！', trigger: 'change'},
                    ],
                    reason: [
                        {required: true,type: 'number', message: '不能为委托单位提供职业健康检查服务，原因不能为空！', trigger: 'change'},
                    ],
                    conclusionPersonInCharge: [
                        {required: true,type: 'string', message: '质控科负责人或体检中心负责人不能为空！', trigger: 'change'},
                    ],
                    conclusionDate: [
                        {required: true, message: '审核结论日期不能为空！', trigger: 'change', pattern: /.+/}
                    ],
                    approvalPersonInCharge: [
                        {required: true,type: 'string', message: '领导或技术负责人不能为空！', trigger: 'change'},
                    ],
                    isAgree: [
                        {required: true,type: 'number', message: '是否同意批准不能为空！', trigger: 'change'},
                    ],
                    approvalDate: [
                        {required: true, message: '审核批准日期不能为空！', trigger: 'change', pattern: /.+/}
                    ],
                },
            }
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
        },
        methods: {
            /**
             * tab点击事件
             * @param name
             */
            tabsClick(name) {
                this.tabsClickIndex = name;
            },
            /**
             * 关闭loading
             */
            closeLoading() {
                this.$emit('closeLoading');
                this.show = false;
                this.loading = false;
            },
            /**
             * 评审
             */
            handelSubmit(){
                try {
                    if(this.reviewContentForm.auditLevel){
                        this.$refs['reviewContentForm'].validate((valid) => {
                            if (valid) {
                                this.loading = true;
                                let reviewContentForm = this.reviewContentForm;
                                if(reviewContentForm.conclusionDate){
                                    reviewContentForm.conclusionDate = formartDate(reviewContentForm.conclusionDate, 'yyyy-MM-dd');//yyyy-MM-dd HH:mm:ss
                                }
                                if(reviewContentForm.approvalDate){
                                    reviewContentForm.approvalDate = formartDate(reviewContentForm.approvalDate, 'yyyy-MM-dd');//yyyy-MM-dd HH:mm:ss
                                }
                                if(this.reviewContentForm.auditLevel < 3){
                                    reviewContentForm.auditLevel ++;//更新下一级审核
                                }else{
                                    reviewContentForm.auditLevel = 4;//完成审核
                                }
                                approve(reviewContentForm).then(res => {
                                    if (res.code == 200) {
                                        this.$Message.success('保存成功');
                                        //更新订单状态
                                        let auditState = 1;
                                        let auditContent = "通过";
                                        if(reviewContentForm.auditLevel == 2){
                                            auditContent = "一级审核，通过";
                                            auditState = 2;
                                        }else if(reviewContentForm.auditLevel == 3){
                                            auditContent = "二级审核，通过";
                                            auditState = 3;
                                        }else if(reviewContentForm.auditLevel == 4){
                                            auditState = 4;
                                            auditContent = "三级审核，通过";
                                        }
                                        updateTGroupOrderState({
                                            id: this.orderInfo.id,
                                            auditState: auditState,
                                            orderTotal: this.orderInfo.orderTotal,
                                            orderDiscount: this.orderInfo.orderDiscount,
                                            orderFlowId: this.flowData[0].id,
                                            auditContent: auditContent
                                        }).then(res => {
                                            if (res.success) {
                                                this.$Message.success('保存成功');
                                            }else{
                                                this.$Message.error(res.msg);
                                            }
                                        })
                                    } else {
                                        this.$Message.error(res.msg);
                                    }
                                }).finally(() => {
                                    this.$emit('submitApproveShowPage');
                                    this.show = false;
                                    this.loading = false;
                                })
                            }
                        });
                    }
                } catch (e) {
                    console.error(e)
                }
            },
            /**
             * 订单选择改变事件
             */
            orderChange() {
                let _this = this;

            },
            init(){
                //初始化评审内容
                this.reviewContentForm = {
                    id: '',
                    orderId: '',
                    isInfoTable: '',//用人单位基本情况信息表
                    isAssessmentReport: '',//近期职业病危害因素检测报告或评价报告
                    isBusinessLicense: '',//营业执照（三证合一）
                    isEntrustReport: '',//合同（委托书）
                    isPersonInfo: '',//预体检人员名单信息
                    isKeepRecord: '',//检查类别和项目是否与备案一致
                    isEquipmentTrue: '',//仪器设备是否满足合同（协议）所订职业健康检查需求
                    isStandard: '',//委托单位要求是否符合国家有关法律、政策和标准规范的要求
                    isUnderstandNeeds: '',//是否与委托单位进行了真实而有效的沟通，了解委托单位的真实需求
                    isSubcontract: '',//是否涉及项目分包
                    isSpecialRequirements: '',//委托方对体检时间、期限有无特别要求
                    isInform: '',//是否告知委托方体检方案及体检注意事项
                    isTakeFromOneself: '',//是否委托方自取
                    isCanService: '',//可以为委托单位提供职业健康检查服务
                    reason: '',//不能为委托单位提供职业健康检查服务，原因
                    conclusionPersonInCharge: '',//质控科负责人或体检中心负责人
                    conclusionDate: null,//审核结论日期
                    approvalPersonInCharge: '',//领导或技术负责人
                    isAgree: '',//是否同意批准
                    approvalDate: null,//审核批准日期
                    auditLevel: 1,//审核级别
                };
                //评审内容查询
                if(this.orderId && this.orderId.trim().length > 0){
                    this.reviewContentForm.orderId = this.orderId;
                    // console.log(this.orderInfo);
                    this.loading = true;
                    getTReviewContent({id: this.orderId}).then(res => {
                        if (res.code == 200) {
                            if(res.data){
                                this.reviewContentForm = res.data;
                                if(this.reviewContentForm.auditLevel == 2 && this.doctorInfo && this.doctorInfo.username){
                                    this.reviewContentForm.conclusionPersonInCharge = this.doctorInfo.username;
                                    this.reviewContentForm.conclusionDate = new Date();
                                    this.reviewContentForm.isCanService = 2;
                                }
                                if(this.reviewContentForm.auditLevel == 3 && this.doctorInfo && this.doctorInfo.username){
                                    this.reviewContentForm.approvalPersonInCharge = this.doctorInfo.username;
                                    this.reviewContentForm.approvalDate = new Date();
                                    this.reviewContentForm.isAgree = 2;
                                }
                                if(this.reviewContentForm.conclusionDate){
                                    this.reviewContentForm.conclusionDate = formartDate(this.reviewContentForm.conclusionDate, 'yyyy-MM-dd');//yyyy-MM-dd HH:mm:ss
                                }
                                if(this.reviewContentForm.approvalDate){
                                    this.reviewContentForm.approvalDate = formartDate(this.reviewContentForm.approvalDate, 'yyyy-MM-dd');//yyyy-MM-dd HH:mm:ss
                                }
                                // console.log("评审内容:");
                                // console.log(this.reviewContentForm);
                            }else{
                                if(this.reviewContentForm.auditLevel == 1){
                                    this.reviewContentForm.isInfoTable = 2;
                                    this.reviewContentForm.isAssessmentReport = 2;
                                    this.reviewContentForm.isBusinessLicense = 2;
                                    this.reviewContentForm.isEntrustReport = 2;
                                    this.reviewContentForm.isPersonInfo = 2;
                                    this.reviewContentForm.isKeepRecord = 2;
                                    this.reviewContentForm.isEquipmentTrue = 2;
                                    this.reviewContentForm.isStandard = 2;
                                    this.reviewContentForm.isUnderstandNeeds = 2;
                                    this.reviewContentForm.isSubcontract = 2;
                                    this.reviewContentForm.isSpecialRequirements = 2;
                                    this.reviewContentForm.isInform = 2;
                                    this.reviewContentForm.isTakeFromOneself = 2;
                                }
                            }
                            // this.$Message.success('查询成功');
                        }
                    }).finally(() => {
                        this.loading = false;
                    })
                }
            },
            reportPS() {
                this.loading = true;
                this.pdfUrl = "";

                //获取评审相关数据
                getTReviewContent({id: this.orderId}).then(res => {
                    if (res.code == 200) {
                        if(res.data){
                            this.reviewContentData = res.data;
                        };
                        this.reviewContentData.repartName = "职业体检评审";//合同名称
                        this.reviewContentData.code = this.orderInfo.orderCode;//合同编号
                        this.reviewContentData.groupUnitName = this.orderInfo.groupUnitName;//委托单位名称
                        this.reviewContentData.linkMan2 = this.tGroupUnit.linkMan2;//委托单位联系人
                        this.reviewContentData.linkPhone2 = this.tGroupUnit.linkPhone2;//委托单位联系电话
                        this.reviewContentData.content = "职业体检";//委托内容
                        this.reviewContentData.departName = this.hospitalNameData.name;//合同编制部门
                        this.reviewContentData.legalPerson = this.hospitalNameData.legalPerson;//合同编制人
                        if(this.flowData && this.flowData.length > 0){
                            this.reviewContentData.auditUserName = this.auditUserName;//审核人
                            this.reviewContentData.auditTime = this.auditTime;//审核日期
                        }

                        //是否转换
                        if(this.reviewContentData){
                            this.reviewContentData.isInfoTable = this.isNot1(this.reviewContentData.isInfoTable);
                            this.reviewContentData.isAssessmentReport = this.isNot1(this.reviewContentData.isAssessmentReport);
                            this.reviewContentData.isBusinessLicense = this.isNot1(this.reviewContentData.isBusinessLicense);
                            this.reviewContentData.isEntrustReport = this.isNot1(this.reviewContentData.isEntrustReport);
                            this.reviewContentData.isPersonInfo = this.isNot1(this.reviewContentData.isPersonInfo);
                            this.reviewContentData.isKeepRecord = this.isNot1(this.reviewContentData.isKeepRecord);
                            this.reviewContentData.isEquipmentTrue = this.isNot1(this.reviewContentData.isEquipmentTrue);
                            this.reviewContentData.isStandard = this.isNot1(this.reviewContentData.isStandard);
                            this.reviewContentData.isUnderstandNeeds = this.isNot1(this.reviewContentData.isUnderstandNeeds);
                            this.reviewContentData.isSubcontract = this.isNot1(this.reviewContentData.isSubcontract);
                            this.reviewContentData.isSpecialRequirements = this.isNot1(this.reviewContentData.isSpecialRequirements);
                            this.reviewContentData.isInform = this.isNot1(this.reviewContentData.isInform);
                            this.reviewContentData.isTakeFromOneself = this.isNot1(this.reviewContentData.isTakeFromOneself);
                            this.reviewContentData.isCanService = this.isNot3(this.reviewContentData.isCanService);
                            this.reviewContentData.isAgree = this.isNot2(this.reviewContentData.isAgree);
                            if(!this.reviewContentData.reason){
                                this.reviewContentData.reason = "-"
                            }
                            if(!this.reviewContentData.reasonNoAgree){
                                this.reviewContentData.reasonNoAgree = "-"
                            }
                        }

                        getTemplatePreviewData({id: "84caf8c879aedd42ca0406ca24befabb", templateData: JSON.stringify(this.reviewContentData)}).then(res => {
                            // this.loading = false;
                            if (res && res.success) {
                                let previewHtml = res.data.replace("template", "div");
                                let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + previewHtml;
                                this.pdfUrl = url;
                            } else {
                                this.$Message.error('预览请求失败');
                                this.closeLoading();
                            }
                            this.loading = false;
                        });
                    }else{
                        this.loading = false;
                    }
                });
            },
            isNot1(number){//是 否
                if(number){
                    if(number == 1){
                        return "□是☑否"
                    }else if(number == 2){
                        return "☑是□否"
                    }else{
                        return "□是□否"
                    }
                }else{
                    return "□是□否"
                }
            },
            isNot2(number){//同意 不同意
                if(number){
                    if(number == 1){
                        return "□同意☑不同意"
                    }else if(number == 2){
                        return "☑同意□不同意"
                    }else{
                        return "□同意□不同意"
                    }
                }else{
                    return "□同意□不同意"
                }
            },
            isNot3(number){//可以 不可以
                if(number){
                    if(number == 1){
                        return "□可以☑不可以"
                    }else if(number == 2){
                        return "☑可以□不可以"
                    }else{
                        return "□可以□不可以"
                    }
                }else{
                    return "□可以□不可以"
                }
            },
            //全屏
            changeFull() {
                this.isFullscreen = !this.isFullscreen;
                let height = document.documentElement.clientHeight;
                let element = document.querySelector(".reviewContent").querySelector(".ivu-modal-body");
                if (this.isFullscreen) {
                    element.style.height = (height - 107) + "px";
                } else {
                    element.style.height = (height - 300) + "px";
                }
            }
        },
        mounted() {
            // this.init();
            if(this.$hospitalName){
                this.hospitalNameData = this.$hospitalName;
            }
            userInfo().then(res => {
                if (res.success) {
                    this.doctorInfo = res.data;
                }
            });
        },
        watch: {
            value(val) {
                this.show = val;
            },
            async show(val) {
                if (val) {
                    // this.init();
                    getTOrderAndFlowData({id: this.orderId}).then(res => {
                        if (res.success && res.data) {
                            this.flowData = res.data.flowData;
                            if(this.flowData && this.flowData.length > 0){
                                let legth = this.flowData.length;
                                this.auditUserName = this.flowData[legth-1].auditUserName;
                                this.auditTime = this.flowData[legth-1].auditTime;
                                if(this.auditTime){
                                    this.auditTime = formartDate(this.auditTime, 'yyyy-MM-dd');
                                }
                            }
                            this.uploadList = res.data.uploadList;
                            this.orderInfo = res.data.tGroupOrder;
                            this.tGroupUnit = res.data.tGroupUnit;
                            //评审报告展示
                            this.reportPS();
                        } else {
                            this.$Message.error(res.msg)
                        }
                    });
                } else {
                    this.closeLoading();
                }
            },
        }
    }
</script>

<style lang="less">
    .reviewContent {
        width: 100%;
        height: 100%;
        .form {
            position: relative;
        }

        .ivu-modal {
            /*width: 1100px !important;*/
            min-width: 55vw ;

            .ivu-tabs-bar {
                margin-bottom: 15px !important;
            }
            .ivu-modal-body {
                padding: 16px;
                font-size: 14px;
                line-height: 1.5;
                /*height: 650px;*/
                min-height: 65vh;
                overflow-y: auto;

                /* 隐藏滚轮 */
                &::-webkit-scrollbar {
                    width: 0;
                    /*隐藏滚轮*/
                    display: none;
                }
            }
            .ivu-row {
                display: flex;
                flex-flow: row wrap;
                height: calc(100% - 16px);
            }
            .ivu-form-item {
                margin-bottom: 0px;
                vertical-align: top;
                zoom: 1;
                margin-bottom: 0px!important;
            }
            .ivu-form .ivu-form-item-label {
                text-align: right;
                vertical-align: middle;
                float: left;
                font-size: 14px;
                color: #515a6e;
                line-height: 1;
                padding: 10px 12px 10px 0;
                box-sizing: border-box;
                font-weight: 500;
            }
            .ivu-form-item-content {
                position: relative;
                line-height: 20px;
                font-size: 14px;
            }
        }
    }
</style>