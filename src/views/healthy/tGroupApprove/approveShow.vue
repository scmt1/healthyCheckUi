<template>
    <Modal v-model="show" class="approveShow" :fullscreen="isFullscreen" :mask-closable="false">
        <div slot="header" style="position: relative; margin-right: 30px;display: flex;justify-content: space-between;    cursor: pointer;">
            <p>{{title}}</p>
            <Icon type="md-expand" @click="changeFull" size="24" color="#ccc"></Icon>
        </div>
        <Row :gutter="4" style="flex-wrap: nowrap;">
            <Col span="24">
                <Card v-if="orderId && orderId.trim().length > 0" class="cardApproveClass" :style="cardApprove">
                    <Form ref="reviewContentForm" :model="reviewContentForm"  :rules="reviewContentFormRule"
                          class="form" style="display: flex;">
                        <div style="width:87.5%">
                            <div style="width: 100%" v-if="(reviewContentForm.auditLevel == 1 && !showStatu) || (reviewContentForm.auditLevel >= 2 && showStatu)">
                                <div v-if="nowNumber<=13">一、用人单位提供的资料（盖鲜章）主检医师审核（并签字）的内容：(一级审核）</div>
                                <div style="margin-top: 12px;" v-if="nowNumber<=5||showStatu">1.用人单位提供的资料（盖鲜章）：</div>
                                <Row style="margin-top: 6px;" v-if="nowNumber == 1||showStatu">
                                    <Col span="24">
                                        <FormItem label="（1）用人单位基本情况信息表：" prop="isInfoTable">
                                            <RadioGroup v-model="reviewContentForm.isInfoTable">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                    </Col>-->
                                </Row>
                                <Row style="margin-top: 6px;" v-if="nowNumber == 2||showStatu">
                                    <Col span="24">
                                        <FormItem label="（2）近期职业病危害因素检测报告或评价报告：" prop="isAssessmentReport">
                                            <RadioGroup v-model="reviewContentForm.isAssessmentReport">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                        <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                    </Col>-->
                                </Row>
                                <Row style="margin-top: 6px;" v-if="nowNumber == 3||showStatu">
                                    <Col span="24">
                                        <FormItem label="（3）营业执照（三证合一）：" prop="isBusinessLicense">
                                            <RadioGroup v-model="reviewContentForm.isBusinessLicense">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                        <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                    </Col>-->
                                </Row>
                                <Row style="margin-top: 6px;" v-if="nowNumber == 4||showStatu">
                                    <Col span="24">
                                        <FormItem label="（4）合同（委托书）：" prop="isEntrustReport">
                                            <RadioGroup v-model="reviewContentForm.isEntrustReport">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                        <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                    </Col>-->
                                </Row>
                                <Row style="margin-top: 6px;" v-if="nowNumber == 5||showStatu">
                                    <Col span="24">
                                        <FormItem label="（5）预体检人员名单信息（姓名、性别、身份证号、手机号、工龄、岗位、职业病危害因素、接害工龄等）：" prop="isPersonInfo">
                                            <RadioGroup v-model="reviewContentForm.isPersonInfo">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                        <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                    </Col>-->
                                </Row>
                                <!--            <div>2.检查类别和项目是否与备案一致：</div>-->
                                <Row style="margin-top: 6px;" v-if="nowNumber == 6||showStatu">
                                    <Col span="24">
                                        <FormItem label="2.检查类别和项目是否与备案一致：" prop="isKeepRecord">
                                            <RadioGroup v-model="reviewContentForm.isKeepRecord">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                        <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                    </Col>-->
                                </Row>
                                <!--            <div>3.仪器设备是否满足合同（协议）所订职业健康检查需求：</div>-->
                                <Row style="margin-top: 6px;" v-if="nowNumber == 7||showStatu">
                                    <Col span="24">
                                        <FormItem label="3.仪器设备是否满足合同（协议）所订职业健康检查需求：" prop="isEquipmentTrue">
                                            <RadioGroup v-model="reviewContentForm.isEquipmentTrue">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                        <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                    </Col>-->
                                </Row>
                                <!--            <div>4.委托单位要求是否符合国家有关法律、政策和标准规范的要求：</div>-->
                                <Row style="margin-top: 6px;" v-if="nowNumber == 8||showStatu">
                                    <Col span="24">
                                        <FormItem label="4.委托单位要求是否符合国家有关法律、政策和标准规范的要求：" prop="isStandard">
                                            <RadioGroup v-model="reviewContentForm.isStandard">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!-- <Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                         <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                         <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                     </Col>-->
                                </Row>
                                <!--            <div>5.是否与委托单位进行了真实而有效的沟通，了解委托单位的真实需求：</div>-->
                                <Row style="margin-top: 6px;" v-if="nowNumber == 9||showStatu">
                                    <Col span="24">
                                        <FormItem label="5.是否与委托单位进行了真实而有效的沟通，了解委托单位的真实需求：" prop="isUnderstandNeeds">
                                            <RadioGroup v-model="reviewContentForm.isUnderstandNeeds">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                        <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                    </Col>-->
                                </Row>
                                <!--            <div>6.是否涉及项目的分包：</div>-->
                                <Row style="margin-top: 6px;" v-if="nowNumber == 10||showStatu">
                                    <Col span="24">
                                        <FormItem label="6.是否涉及项目的分包：" prop="isSubcontract">
                                            <RadioGroup v-model="reviewContentForm.isSubcontract">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                        <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                    </Col>-->
                                </Row>
                                <!--            <div>7.委托方对体检时间、期限有无特别要求：</div>-->
                                <Row style="margin-top: 6px;" v-if="nowNumber == 11||showStatu">
                                    <Col span="24">
                                        <FormItem label="7.委托方对体检时间、期限有无特别要求："  prop="isSpecialRequirements">
                                            <RadioGroup v-model="reviewContentForm.isSpecialRequirements">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                        <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                    </Col>-->
                                </Row>
                                <!--            <div>8.是否告知委托方体检方案及体检注意事项：</div>-->
                                <Row style="margin-top: 6px;" v-if="nowNumber == 12||showStatu">
                                    <Col span="24">
                                        <FormItem label="8.是否告知委托方体检方案及体检注意事项：" prop="isInform">
                                            <RadioGroup v-model="reviewContentForm.isInform">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber+1">下一步</Button>
                                        <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                    </Col>-->
                                </Row>
                                <Row style="margin-top: 12px;" v-if="nowNumber == 13||showStatu">9.报告领取方式：</Row>
                                <Row style="margin-top: 6px;" v-if="nowNumber == 13||showStatu">
                                    <Col span="24">
                                        <FormItem label="是否委托方自取：" prop="isTakeFromOneself">
                                            <RadioGroup v-model="reviewContentForm.isTakeFromOneself">
                                                <Radio  :label='1'>否</Radio>
                                                <Radio  :label='2'>是</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="nowNumber=nowNumber-1">上一步</Button>
                                    </Col>-->
                                </Row>
                            </div>
                            <div style="width: 100%" v-if="(reviewContentForm.auditLevel == 2 && !showStatu) || (reviewContentForm.auditLevel >= 3 && showStatu)">
                                <div style="margin-top: 6px;">二、审核结论：(二级审核）</div>
                                <div style="margin-top: 6px;">1.本机构的职业健康检查能力满足委托单位的相关要求：</div>
                                <Row style="margin-top: 6px;">
                                    <Col span="24">
                                        <FormItem label="可以为委托单位提供职业健康检查服务：" prop="isCanService">
                                            <RadioGroup v-model="reviewContentForm.isCanService">
                                                <Radio  :label='1'>不可以</Radio>
                                                <Radio  :label='2'>可以</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="handelSubmitNow">提交</Button>
                                    </Col>-->
                                </Row>
                                <!--            <div v-if="reviewContentForm.isInfoTable == '1'"> 2.不能为委托单位提供职业健康检查服务，原因：</div>-->
                                <Row v-if="reviewContentForm.isCanService == '1'" style="margin-top: 6px;">
                                    <Col span="24">
                                        <FormItem label="不能为委托单位提供职业健康检查服务，原因：" prop="reason">
                                            <Input type="textarea" :maxlength=50
                                                   v-model="reviewContentForm.reason" placeholder="请输入原因"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <!--<Row style="margin-top: 6px;">
                                    <Col span="11">
                                        <FormItem label="审核结论日期：" prop="conclusionDate">
                                            <DatePicker type="date"
                                                        placeholder="请选择日期"
                                                        style="width: 100%;"
                                                        format="yyyy-MM-dd"
                                                        v-model="reviewContentForm.conclusionDate"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="13">
                                        <FormItem label="质控科负责人或体检中心负责人：" prop="conclusionPersonInCharge">
                                            <Input type="text" :maxlength=50
                                                   v-model="reviewContentForm.conclusionPersonInCharge" placeholder="请输入负责人"/>
                                        </FormItem>
                                    </Col>
                                </Row>-->
                            </div>
                            <div style="width: 100%" v-if="(reviewContentForm.auditLevel == 3 && !showStatu) || (reviewContentForm.auditLevel >= 4 && showStatu)">
                                <div style="margin-top: 6px;">三、批准：(三级审核）</div>
                                <Row style="margin-top: 6px;">
                                    <Col span="24">
                                        <FormItem label="是否同意批准：" prop="isAgree">
                                            <RadioGroup v-model="reviewContentForm.isAgree">
                                                <Radio  :label='1'>不同意</Radio>
                                                <Radio  :label='2'>同意</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <!--<Col span="3" style="display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                                        <Button type="primary" @click="handelSubmitNow">提交</Button>
                                    </Col>-->
                                </Row>
                                <!--<Row style="margin-top: 6px;">
                                    <Col span="11">
                                        <FormItem label="审核批准日期：" prop="approvalDate">
                                            <DatePicker type="date"
                                                        placeholder="请选择日期"
                                                        style="width: 100%;"
                                                        format="yyyy-MM-dd"
                                                        v-model="reviewContentForm.approvalDate"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="13">
                                        <FormItem label="领导或技术负责人：" prop="approvalPersonInCharge">
                                            <Input type="text" :maxlength=50
                                                   v-model="reviewContentForm.approvalPersonInCharge" placeholder="请输入负责人"/>
                                        </FormItem>
                                    </Col>
                                </Row>-->
                            </div>
                        </div>
                        <div style="width: 12.5%;display: flex;flex-direction: row;justify-content: right;" v-if="!showStatu">
                            <div style="height: 100%;display: flex;flex-direction: column;justify-content: end;">
                                <div style="display: flex;">
                                    <Button type="primary" @click="keepCookies" v-if="!showButton">确定</Button>
                                    <Button type="primary" @click="nowNumberChange(true)" v-if="showButton && reviewContentForm.auditLevel==1 && nowNumber!=13">下一步</Button>
                                    <Button type="primary" @click="nowNumberChange(false)" v-if="nowNumber!=1 && reviewContentForm.auditLevel==1">上一步</Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Card>
                <Card v-if="orderId && orderId.trim().length > 0" :style="cardReport">
                    <Tabs size="small" :value="tabsClickIndex" @on-click="tabsClick" style="height: 100%">
                        <TabPane label="委托协议" name="0" v-if="!loading" style="height: 100%">
                            <div class="previewIframe" style="height: 100%" v-if="orderInfo && orderInfo.orderPath && orderInfo.orderPath.trim().length > 0">
                                <iframe  ref="previewHtmlTemplatePS" :src="pathLeft+orderInfo.orderPath" frameborder="0" style="width: 100%; height: 100%"></iframe>
                            </div>
                            <div style="height: 100%" v-else>
                                <!--暂无数据-->
                                <no-data width="150" style="height: 100%;overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>
                            </div>
                        </TabPane>
                        <TabPane label="评价报告" name="1" v-if="!loading" style="height: 100%">
                            <div class="previewIframe" style="height: 100%" v-if="orderInfo && orderInfo.orderEvaluatePath && orderInfo.orderEvaluatePath.trim().length > 0">
                                <iframe  ref="previewHtmlTemplate" :src="pathLeft+orderInfo.orderEvaluatePath" frameborder="0" style="width: 100%; height: 100%"></iframe>
                            </div>
                            <div style="height: 100%" v-else>
                                <!--暂无数据-->
                                <no-data width="150" style="height: 100%;overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>
                            </div>
                        </TabPane>
                        <TabPane label="营业执照" name="2" v-if="!loading" style="height: 100%">
                            <div class="previewIframe" style="height: 100%" v-if="orderInfo && orderInfo.orderLicensePath && orderInfo.orderLicensePath.trim().length > 0">
                                <iframe  ref="previewHtmlTemplate" :src="pathLeft+orderInfo.orderLicensePath" frameborder="0" style="width: 100%; height: 100%"></iframe>
                            </div>
                            <div style="height: 100%" v-else>
                                <!--暂无数据-->
                                <no-data width="150" style="height: 100%;overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
                <!-- <Card style="height: 100%" v-else>
                     &lt;!&ndash;暂无数据&ndash;&gt;
                     <no-data width="150" style="height: 100%;overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>
                 </Card>-->
            </Col>
        </Row>
        <div slot="footer">
            <Button type="text" @click="closeLoading">取消</Button>
            <!--            <Button type="primary" :loading="loading" @click="handelSubmit" v-if="reviewContentForm.auditLevel==4">评审报告预览</Button>-->

            <Button type="info" @click="showOrderContract = true" v-if="showStatu && orderInfo && orderInfo.id" icon="md-eye">附件查看</Button>
            <Button type="primary" @click="handelSubmitNow" v-if="!showStatu && showButton && ((reviewContentForm.auditLevel == 1 && nowNumber>=13) || (reviewContentForm.auditLevel == 2 && (reviewContentForm.isCanService==2 || (reviewContentForm.isCanService==1 && reviewContentForm.reason))) || (reviewContentForm.auditLevel == 3))">提交</Button>
        </div>
        <Spin fix v-show="loading">
            <div class="demo-spin-icon-load">
                <!-- 这里用的是阿里图标库 -->
                <i class="iconfont icon-loader--line"></i>
            </div>
            <div style='font-size:16px'>Loading...</div>
        </Spin>
        <contract-preview v-model="showOrderContract" :groupOrderInfo="orderInfo" :url="orderInfo.orderPath"></contract-preview>
        <review-content v-model="reviewContentShow" :orderId="orderInfo.id" :orderInfo="orderInfo" :flowData="flowData"
                        v-on:closeLoading="closeApproveShow" v-on:submitApproveShowPage="submitApproveShowPage"></review-content>
    </Modal>
</template>

<script>
    import noData from "../../../components/no-data"
    import reviewContent from "./reviewContent"
    import {approve, getTOrderAndFlowData} from "../../../api/healthy/tOrderFlow";
    import {getTemplatePreviewData} from '@/api/healthy/tTemplate';
    import {getTReviewContent} from "../../../api/healthy/tOrderFlow";
    import util from "../../../libs/util";
    import {formartDate} from "../../../api/tools/tool";
    import {updateTGroupOrderState} from "../../../api/healthy/tGroupOrder";
    import {userInfo} from "../../../api";
    import contractPreview from "../tGroupApprove/contractPreview";

    export default {
        name: "approveShow",
        components: {
            noData,
            reviewContent,
            contractPreview
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
            url: {
                type: String,
                default: ""
            },
            titleData: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                showOrderContract:false,//上传的合同预览
                cardApprove:"height: 120px;overflow-y: auto;display: flex;",
                cardReport:"height: calc(100% - 120px)",
                showButton: false,
                isFullscreen: false,
                doctorInfo: [],
                showStatu:false,
                pathLeft:"",
                nowNumber: 1,//当前审核序号
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

                auditUserName: "",
                auditTime: "",
                tGroupUnit: {},
                uploadList: [],
                flowData: [],
                orderInfo: {},
                hospitalNameData: {},
                reviewContentShow: false,
                show: this.value,
                title: "合同评审",
                tabsClickIndex: 0,
                loading: false,
                previewHtmlUrl: "",//委托协议
                previewHtmlUrlPS: "",//评审报告
                tabPanes: [],
                tabItems: [],
                reviewContentData: {},
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
                if(this.tabsClickIndex == 0){
                    if(!this.orderInfo || !this.orderInfo.orderPath || this.orderInfo.orderPath.trim().length == 0){
                        this.$Message.info('委托协议暂未上传！');
                    }
                }else if(this.tabsClickIndex == 1){
                    if(!this.orderInfo || !this.orderInfo.orderEvaluatePath || this.orderInfo.orderEvaluatePath.trim().length == 0){
                        this.$Message.info('评价报告暂未上传！');
                    }
                }else if(this.tabsClickIndex == 2){
                    if(!this.orderInfo || !this.orderInfo.orderLicensePath || this.orderInfo.orderLicensePath.trim().length == 0){
                        this.$Message.info('营业执照暂未上传！');
                    }
                }
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
                this.reviewContentShow = true;
            },
            /**
             * 评审
             */
            handelSubmitNow(){
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
                                    // this.$emit('submitApproveShowPage');
                                    // this.show = false;
                                    // this.loading = false;
                                    let reviewContentFormNow = null;
                                    this.$cookies.set('approveData', reviewContentFormNow,"1h")
                                    this.submitApproveShowPage();
                                })
                            }else {
                                this.$Message.error('表单验证不通过！');
                            }
                        });
                    }
                } catch (e) {
                    console.error(e)
                }
            },
            closeApproveShow(){
                this.reviewContentShow = false;
            },
            submitApproveShowPage(){
                this.$emit('submitApproveListShowPage');
                this.reviewContentShow = false;
                this.show = false;
                this.loading = false;
            },
            /**
             * 订单选择改变事件
             */
            orderChange() {
                let _this = this;

            },
            approve(){
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
                this.nowNumber = 1;
                this.showButton = false;
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
                                    // this.reviewContentForm.isCanService = 2;
                                }
                                if(this.reviewContentForm.auditLevel == 3 && this.doctorInfo && this.doctorInfo.username){
                                    this.reviewContentForm.approvalPersonInCharge = this.doctorInfo.username;
                                    this.reviewContentForm.approvalDate = new Date();
                                    // this.reviewContentForm.isAgree = 2;
                                }
                                if(this.reviewContentForm.conclusionDate){
                                    this.reviewContentForm.conclusionDate = formartDate(this.reviewContentForm.conclusionDate, 'yyyy-MM-dd');//yyyy-MM-dd HH:mm:ss
                                }
                                if(this.reviewContentForm.approvalDate){
                                    this.reviewContentForm.approvalDate = formartDate(this.reviewContentForm.approvalDate, 'yyyy-MM-dd');//yyyy-MM-dd HH:mm:ss
                                }
                                // console.log("评审内容:");
                                // console.log(this.reviewContentForm);
                            }/*else{
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
                            }*/
                            // this.$Message.success('查询成功');
                        }
                        let reviewContentForm = this.$cookies.get('approveData');
                        if(reviewContentForm){
                            if(this.orderId == reviewContentForm.orderId){
                                this.reviewContentForm = {
                                    id: reviewContentForm.id,
                                    orderId: reviewContentForm.orderId,
                                    isInfoTable: reviewContentForm.isInfoTable,//用人单位基本情况信息表
                                    isAssessmentReport: reviewContentForm.isAssessmentReport,//近期职业病危害因素检测报告或评价报告
                                    isBusinessLicense: reviewContentForm.isBusinessLicense,//营业执照（三证合一）
                                    isEntrustReport: reviewContentForm.isEntrustReport,//合同（委托书）
                                    isPersonInfo: reviewContentForm.isPersonInfo,//预体检人员名单信息
                                    isKeepRecord: reviewContentForm.isKeepRecord,//检查类别和项目是否与备案一致
                                    isEquipmentTrue: reviewContentForm.isEquipmentTrue,//仪器设备是否满足合同（协议）所订职业健康检查需求
                                    isStandard: reviewContentForm.isStandard,//委托单位要求是否符合国家有关法律、政策和标准规范的要求
                                    isUnderstandNeeds: reviewContentForm.isUnderstandNeeds,//是否与委托单位进行了真实而有效的沟通，了解委托单位的真实需求
                                    isSubcontract: reviewContentForm.isSubcontract,//是否涉及项目分包
                                    isSpecialRequirements: reviewContentForm.isSpecialRequirements,//委托方对体检时间、期限有无特别要求
                                    isInform: reviewContentForm.isInform,//是否告知委托方体检方案及体检注意事项
                                    isTakeFromOneself: reviewContentForm.isTakeFromOneself,//是否委托方自取
                                    isCanService: reviewContentForm.isCanService,//可以为委托单位提供职业健康检查服务
                                    reason: reviewContentForm.reason,//不能为委托单位提供职业健康检查服务，原因
                                    conclusionPersonInCharge: reviewContentForm.conclusionPersonInCharge,//质控科负责人或体检中心负责人
                                    conclusionDate: reviewContentForm.conclusionDate,//审核结论日期
                                    approvalPersonInCharge: reviewContentForm.approvalPersonInCharge,//领导或技术负责人
                                    isAgree: reviewContentForm.isAgree,//是否同意批准
                                    approvalDate: reviewContentForm.approvalDate,//审核批准日期
                                    auditLevel: reviewContentForm.auditLevel,//审核级别
                                };
                                this.nowNumber = reviewContentForm.nowNumber;
                                this.showButton = reviewContentForm.showButton;
                            }
                        }
                    }).finally(() => {
                        this.loading = false;
                    })
                }
            },
            init(){
                this.pathLeft = window.location.protocol + "//" + window.location.host + "/tempFileUrl/";
                this.title = this.titleData;
                if(this.title && this.title == "评审查看"){
                    this.showStatu = true;
                    this.cardApprove = "height: 100%;overflow-y: auto;display: flex;";
                    this.cardReport = "height: 0px";
                }else{
                    this.showStatu = false;
                    this.cardApprove = "height: 120px;overflow-y: auto;display: flex;";
                    this.cardReport = "height: calc(100% - 120px)";
                }
                if(this.orderId && this.orderId.trim().length > 0){
                    /*//委托协议展示
                    if(this.url && this.url.trim().length > 0){
                        let urlNew = window.location.protocol + "//" + window.location.host + "/tempFileUrl/" + this.url;
                        this.previewHtmlUrl = urlNew;
                    }else{
                        this.previewHtmlUrl = "";
                    }*/
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
                            // this.reportPS();

                            if(!this.showStatu){
                                if(!this.orderInfo || !this.orderInfo.orderPath || this.orderInfo.orderPath.trim().length == 0){
                                    this.$Message.info('委托协议暂未上传！');
                                }
                            }
                        } else {
                            this.$Message.error(res.msg)
                        }
                    });
                }
            },
            reportPS() {
                this.loading = true;
                this.previewHtmlUrlPS = "";

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
                        }

                        getTemplatePreviewData({id: "84caf8c879aedd42ca0406ca24befabb", templateData: JSON.stringify(this.reviewContentData)}).then(res => {
                            // this.loading = false;
                            if (res && res.success) {
                                let previewHtml = res.data.replace("template", "div");
                                let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + previewHtml;
                                this.previewHtmlUrlPS = url;
                            } else {
                                this.$Message.error('预览请求失败');
                                this.closeModal();
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
                        return "否"
                    }else if(number == 2){
                        return "是"
                    }else{
                        return "是      否"
                    }
                }else{
                    return "是      否"
                }
            },
            isNot2(number){//同意 不同意
                if(number){
                    if(number == 1){
                        return "不同意"
                    }else if(number == 2){
                        return "同意"
                    }else{
                        return "同意      不同意"
                    }
                }else{
                    return "同意      不同意"
                }
            },
            isNot3(number){//可以 不可以
                if(number){
                    if(number == 1){
                        return "不可以"
                    }else if(number == 2){
                        return "可以"
                    }else{
                        return "可以      不可以"
                    }
                }else{
                    return "可以      不可以"
                }
            },
            //全屏
            changeFull() {
                this.isFullscreen = !this.isFullscreen;
                let height = document.documentElement.clientHeight;
                let element = document.querySelector(".approveShow").querySelector(".ivu-modal-body");
                if (this.isFullscreen) {
                    element.style.height = (height - 107) + "px";
                } else {
                    element.style.height = (height - 300) + "px";
                }
            },
            //保存审核的缓存数据
            keepCookies(){
                if(this.reviewContentForm.auditLevel){
                    this.$refs['reviewContentForm'].validate((valid) => {
                        if (valid) {
                            this.showButton = true;
                            let reviewContentForm = this.reviewContentForm;
                            reviewContentForm.nowNumber = this.nowNumber;
                            reviewContentForm.orderId = this.orderId;
                            reviewContentForm.showButton = this.showButton;
                            this.$cookies.set('approveData', reviewContentForm,"1h")
                            //  selectValue==cookies名称
                            //  this.value==值
                            //  1h cookies过期时间
                        }else {
                            this.$Message.error('表单验证不通过！');
                        }
                    });
                }
            },
            nowNumberChange(e){
                if(e){
                    this.nowNumber=this.nowNumber+1
                }else{
                    this.nowNumber=this.nowNumber-1
                }
                this.showButton=false;
            },
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
                    this.init();
                    this.approve();
                } else {
                    this.closeLoading();
                }
            },
        }
    }
</script>

<style lang="less">
    .approveShow {
        width: 100%;
        height: 100%;

        .form {
            position: relative;
        }

        .ivu-modal-wrap {
            position: fixed;
            overflow: auto;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1000;
            -webkit-overflow-scrolling: touch;
            outline: 0;
            overflow: hidden;
        }
        .cardApproveClass{
            /* 隐藏滚轮 */
            &::-webkit-scrollbar {
                width: 0;
                /*隐藏滚轮*/
                display: none;
            }
        }
        .ivu-modal {
            /*width: 60vw !important;*/
            width: 60vw;
            /*min-width: 600px;*/
            min-width: 60vw;

            .ivu-tabs-bar {
                margin-bottom: 15px !important;
            }
            .ivu-modal-body {
                padding: 16px;
                font-size: 14px;
                line-height: 1.5;
                /*height: 750px;*/
                height: 70vh;
                /*min-height: 550px;*/
                min-height: 55vh;
            }
            .ivu-row {
                display: flex;
                flex-flow: row wrap;
                height: 100%;
            }
            .ivu-form-item {
                margin-bottom: 0px;
                vertical-align: top;
                zoom: 1;
                margin-bottom: 0px!important;
            }
            .ivu-card-body {
                padding: 16px;
                height: 100%;
                width: 100%;
            }
            .ivu-tabs .ivu-tabs-content-animated {
                display: flex;
                height: 100%;
                flex-direction: row;
                will-change: transform;
                transition: transform .3s ease-in-out;
            }
        }
    }
</style>