<style lang="less">
    html, body {
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        overflow: hidden;
    }
    .groupApproveList {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        overflow: hidden;

        .d-card {
            height: calc(100vh - 80px);
            overflow: auto;

            .radio-group {
                overflow: auto;
                width: 100%;
                height: 92%;
                padding-bottom: 30px;

                &::-webkit-scrollbar {
                    width: 0;
                }

                .row-border {
                    padding-top: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #ccc;
                    cursor: pointer;
                }

                .radio-group-radio {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    [class^=label] {
                        font-size: 0;
                    }
                }

                .radio-group-content {

                    .date {
                        color: #000;
                        font-size: 12px;
                    }

                    .border-blue {
                        border: 1px solid #0000FF;
                        border-radius: 8px;
                        text-align: center;
                        color: #0000FF;
                    }

                    .bg-audit {
                        background-color: #ff9900;
                        color: #fff;
                        border-radius: 8px;
                        text-align: center;
                        cursor: pointer;
                    }

                    .bg-green {
                        background-color: #42C3AF;
                        color: #fff;
                        border-radius: 8px;
                        text-align: center;
                    }

                    .bg-red {
                        background-color: red;
                        color: #fff;
                        border-radius: 8px;
                        text-align: center;
                    }

                    .company {
                        color: #000;
                        font-size: 12px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }

            .empty {
                text-align: center;
                color: #515a6e;
                margin-top: 20px;
            }

            .demo-upload-list {
                display: inline-block;
                width: 58px;
                height: 58px;
                text-align: center;
                line-height: 58px;
                border: 1px solid transparent;
                border-radius: 4px;
                overflow: hidden;
                background: #fff;
                position: relative;
                box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
                margin-right: 3px;
            }

            .demo-upload-list img {
                width: 100%;
                height: 100%;
            }

            .demo-upload-list-cover {
                display: none;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, .6);
            }

            .demo-upload-list:hover .demo-upload-list-cover {
                display: block;
            }

            .demo-upload-list-cover i {
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                margin: 0 2px;
            }

            .ivu-form-item-content {
                display: flex !important;
            }

            .demo-spin-icon-load {
                animation: ani-demo-spin 1s linear infinite;
            }

            .ivu-card-body {
                height: 100%;
            }

            .ivu-form-item {
                margin-bottom: 10px !important;
            }
        }

        .expand {
            align-self: center;
            cursor: pointer;
        }
    }
</style>
<template>
    <div class="groupApproveList" style="margin-left: 0px;">
        <Row :gutter="10" style="margin-left: 0px;">
            <Col :style="leftSpan" style="padding-right: 0px;padding-left: 0px;">
                <Card class="d-card">
                    <Tabs value="name1" @on-click="TabsClick">
                        <TabPane :label="waitApprove" name="name1"/>
                        <TabPane :label="approved" name="name2"/>
                    </Tabs>
                    <Input v-model="searchForm.groupUnitName" suffix="ios-search" @on-change="search"
                           placeholder="请输入关键字" clearable
                           style="margin-top: 10px;margin-bottom: 10px;"/>
                    <Row style="justify-content: center;height: calc(100% - 80px);">
                        <RadioGroup class="radio-group" v-model="radioValue" v-if="groupOrderList.length > 0">
                            <Row class="row-border" v-for="(item,index) in groupOrderList"
                                 @click.native="radioChooseClick(item)" :key="item.id">
                                <Col :span="3" class="radio-group-radio">
                                    <Radio class="label" :label="item.id"></Radio>
                                </Col>
                                <Col :span="21" class="radio-group-content">
                                    <Row style="margin-bottom: 6px;">
                                        <Col :span="19" class="date">{{ formatTime(item.signingTime) }}</Col>
                                        <Col :span="5" class="border-blue">{{ item.physicalType.indexOf("职业") != -1 ?
                                            '职' : '健' }}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col :span="19" class="company" :title="item.groupUnitName">{{ item.groupUnitName }}</Col>
                                        <Col :span="5" class="bg-audit" v-if="searchForm.auditState != 99">待审</Col>
                                        <Col :span="5" class="bg-green" v-if="searchForm.auditState == 99">已审</Col>
                                        <Col :span="5" class="bg-red" v-if="item.auditState == 5">不通过</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </RadioGroup>
                        <no-data v-else></no-data>
                        <Spin fix v-if="loading">
                            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                            <div>加载中...</div>
                        </Spin>
                        <Page v-if="groupOrderList.length > 0" :current="searchForm.pageNumber" :total="groupOrderTotal"
                              simple
                              @on-change="groupOrderChangePageNum"/>
                    </Row>
                </Card>
            </Col>
            <div class="expand">
                <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand"/>
            </div>
            <Col :style="span" style="padding-left: 0px;padding-right: 0px;">
                <Row :gutter="10" style="padding-left: -15px;">
                    <Col :span="18">
                        <Card class="d-card" v-if="groupOrderList.length >  0">
                            <Row>
                                <Button type="success" icon="ios-paper" :loading="adoptLoading"
                                        @click="contractApproval" v-if="searchForm.auditState != 99">
                                    {{roleLevel}}
                                </Button>
                                <!--<Button type="info" icon="md-eye" :loading="adoptLoading"
                                        @click="contractApproval" v-if="searchForm.auditState == 99">
                                    评审查看
                                </Button>-->
                                <Button type="primary" :loading="loading" @click="handelSubmit" v-if="orderInfo.auditState==4 || orderInfo.auditState==3 || orderInfo.auditState==2">评审报告预览</Button>
                                <!--<Button type="success" icon="md-checkmark-circle-outline"
                                        v-if=" (orderInfo.auditState == 1||orderInfo.auditState == 2) && searchForm.auditState==1" :loading="adoptLoading"
                                        @click="approveClick(orderInfo.auditState+1)">
                                    审批通过
                                </Button>
                                <Button type="error" icon="md-close" v-if="(orderInfo.auditState == 1||orderInfo.auditState == 2) && searchForm.auditState==1"
                                        :loading="failLoading" @click="approveClick(4)">
                                    审批不通过
                                </Button>-->
                                <Button type="info" icon="ios-cloud-upload-outline" :loading="adoptLoading"
                                        @click="showOrderPreview = true">
                                    委托协议预览
                                </Button>
                                <!--<Button type="info" icon="ios-cloud-upload-outline" :loading="adoptLoading"
                                        @click="showOrderContract = true">
                                    合同预览
                                </Button>-->
                            </Row>
                            <!--<Alert class="ivu-alert-left" style="margin-top: 10px">
                                订单信息
                            </Alert>
                            <Form ref="groupOrderForm" :model="groupOrderForm" :label-width="95">
                                <Row>
                                    <Col :span="8">
                                        <FormItem label="团检单号:">

                                            {{groupOrderForm.orderCode}}
                                        </FormItem>
                                    </Col>
                                    <Col :span="8">
                                        <FormItem label="团检单位:">

                                            {{groupOrderForm.groupUnitName}}
                                        </FormItem>
                                    </Col>
                                    <Col :span="8">
                                        <FormItem label="体检类型:">
                                            {{groupOrderForm.physicalType}}
                                        </FormItem>
                                    </Col>
                                    <Col :span="8">
                                        <FormItem label="销售负责人:">
                                            {{groupOrderForm.salesDirector}}
                                        </FormItem>
                                    </Col>
                                    <Col :span="8">
                                        <FormItem label="签订时间:">
                                            {{groupOrderForm.signingTime}}
                                        </FormItem>
                                    </Col>
                                    <Col :span="8">
                                        <FormItem label="交付时间:">
                                            {{groupOrderForm.deliveryTime}}
                                        </FormItem>
                                    </Col>

                                </Row>

                            </Form>-->
                            <Row style="margin-top: 20px">
                                <Col :span="24">
                                    <Alert class="ivu-alert-left">
                                        体检项目
                                    </Alert>
                                    <el-tabs @tab-click="handleTabClick" v-if="groupData.length > 0"
                                             style="margin-top: 16px;" type="border-card">
                                        <el-tab-pane
                                                :label="(item.name) + '(' + (item.personCount?item.personCount:0) + ')' "
                                                v-for="(item, index) in groupData"
                                                :key="index">
                                            <Table :loading="tableLoading" border max-height="450" :columns="columns"
                                                   sortable="custom" :data="projectData"
                                                   ref="table"
                                                   show-summary :summary-method="handleSummary">
                                            </Table>

                                            <Form :label-width="100">
                                                <Row style="margin-top: 16px;">
                                                    <Col span="5">
                                                        <FormItem label="必检项折扣：">
                                                            {{ item.discount }}
                                                        </FormItem>
                                                    </Col>
                                                    <Col span="5">
                                                        <FormItem label="选检项折扣：">
                                                            {{ item.addDiscount }}
                                                        </FormItem>
                                                    </Col>
                                                    <Col span="5">
                                                        <FormItem label="优惠价格：">
                                                            {{ item.discountPrice ? item.discountPrice : "-" }}
                                                        </FormItem>
                                                    </Col>
                                                    <Col span="5" style="display: flex;">
                                                        <FormItem label="分组人数：">
                                                            {{ item.personCount }}
                                                        </FormItem>
                                                    </Col>
                                                    <Col span="4">
                                                        <FormItem label="分组小计：">
                                                            ￥{{ subtotal }}元
                                                        </FormItem>
                                                    </Col>
                                                    <!--<Col span="4">
                                                        <FormItem label="环评因素：">
                                                            ￥{{ item.eiaFactors }}元
                                                        </FormItem>
                                                    </Col>-->
                                                </Row>
                                            </Form>
                                        </el-tab-pane>

                                    </el-tabs>
                                    <Alert class="ivu-alert-left" v-if="groupData.length > 0" style="margin-top: 10px">
                                        体检人员
                                    </Alert>
                                    <Table :loading="maleLoading" border max-height="450" :columns="maleColumns"
                                           sortable="custom" :data="groupPersonData" v-if="groupData.length > 0"
                                           ref="tablePerson">
                                    </Table>
                                    <Row type="flex" justify="end" class="page" v-if="groupData.length > 0">
                                        <Page :current="groupPersonSearchForm.pageNumber" :total="groupPersonTotal"
                                              :page-size="groupPersonSearchForm.pageSize"
                                              @on-change="groupPersonChangePageNum"
                                              @on-page-size-change="groupPersonPageSize"
                                              transfer
                                              :page-size-opts="[10,20,50]"
                                              size="small" show-total show-elevator show-sizer></Page>
                                    </Row>
                                    <no-data width="150" height="150" v-else></no-data>
                                    <Form :label-width="90" style="margin-top: 20px;">
                                        <Row>
                                            <Col span="5">
                                                <FormItem label="订单合计：">
                                                    <span style="color: red;font-size: 18px;white-space: nowrap;">￥{{ this.groupOrderForm.orderTotal }}元</span>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>


                            </Row>


                        </Card>
                        <Card style="margin-left: 0px;height: 100%;" v-else>
                            <no-data height="150" width="150"></no-data>
                        </Card>
                    </Col>
                    <Col :span="6" style="padding-left: -15px;">
                        <Card class="d-card">
                            <!--                            <Alert class="ivu-alert-left">-->
                            <!--                                附件-->
                            <!--                            </Alert>-->
                            <!--                            <div class="images" v-viewer="{movable: false}" style="display: none;">-->
                            <!--                                <img v-for="src in uploadList" :src="src" :key="src">-->
                            <!--                            </div>-->
                            <!--                            <div style="display: flex;flex-wrap: wrap;margin: 5px;" v-if="uploadList.length > 0">-->
                            <!--                                <div style="display: flex;flex-wrap: wrap;margin-top: 5px;">-->
                            <!--                                    <div class="demo-upload-list" v-for="(item, index) in uploadList">-->
                            <!--                                        <img :src="item">-->
                            <!--                                        <div class="demo-upload-list-cover">-->
                            <!--                                            <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>-->
                            <!--                                        </div>-->
                            <!--                                    </div>-->
                            <!--                                </div>-->
                            <!--                            </div>-->
                            <!--                            <div class="empty" v-else style="margin: 10px 0;">暂无附件</div>-->
                            <Alert class="ivu-alert-left" style="min-width: 300px;">
<!--                                审批流程-->
                                基本信息
                            </Alert>
                            <Card v-if="orderInfo && orderInfo.id && orderInfo.id.trim().length > 0" style="height: calc(100% - 50px);min-width: 300px;">
                                <Form ref="tGroupOrderForm" :model="orderInfo" :label-width="87"
                                      class="form">
                                    <Row>
                                        <Col span="24">
                                            <FormItem label="合同名称:">
                                                职业体检评审
                                            </FormItem>
                                        </Col>
                                        <Col span="24">
                                            <FormItem label="合同编号:">
                                                {{orderInfo.orderCode}}
                                            </FormItem>
                                        </Col>
                                        <Col span="24">
                                            <FormItem label="委托单位:">
                                                {{orderInfo.groupUnitName}}
                                            </FormItem>
                                        </Col>
                                        <Col span="24">
                                            <FormItem label="委托内容:">
                                                职业体检
                                            </FormItem>
                                        </Col>
                                        <Col span="24">
                                            <FormItem label="编制部门:">
                                                {{hospitalNameData && hospitalNameData.name ? hospitalNameData.name : ''}}
                                            </FormItem>
                                        </Col>
                                        <Col span="24">
                                            <FormItem label="编制人:">
                                                {{hospitalNameData && hospitalNameData.legalPerson ? hospitalNameData.legalPerson : ''}}
                                            </FormItem>
                                        </Col>
                                        <Col span="24">
                                            <FormItem label="审核人:">
                                                {{auditUserName}}
                                            </FormItem>
                                        </Col>
                                        <Col span="24">
                                            <FormItem label="审核状态:" v-if="searchForm && searchForm.auditState && searchForm.auditState == 99" style="color: #42C3AF;font-weight: bolder;">
                                                {{searchForm && searchForm.auditState && searchForm.auditState == 99 ? '已审核' : '待审核'}}
                                            </FormItem>
                                            <FormItem label="审核状态:" v-else style="color: red;font-weight: bolder;">
                                                {{searchForm && searchForm.auditState && searchForm.auditState == 99 ? '已审核' : '待审核'}}
                                            </FormItem>
                                        </Col>
                                        <Col span="24">
                                            <FormItem label="联系人:">
                                                {{tGroupUnit && tGroupUnit.linkMan2 ? tGroupUnit.linkMan2 : ''}}
                                            </FormItem>
                                        </Col>
                                        <Col span="24">
                                            <FormItem label="联系电话:">
                                                {{tGroupUnit && tGroupUnit.linkPhone2 ? tGroupUnit.linkPhone2 : ''}}
                                            </FormItem>
                                        </Col>
                                        <Col span="24">
                                            <FormItem label="审核日期:">
                                                {{auditTime}}
                                            </FormItem>
                                        </Col>
                                        <Col :span="24">
                                            <FormItem label="销售负责人:">
                                                {{groupOrderForm.salesDirector}}
                                            </FormItem>
                                        </Col>
                                        <Col :span="24">
                                            <FormItem label="签订时间:">
                                                {{groupOrderForm.signingTime}}
                                            </FormItem>
                                        </Col>
                                        <Col :span="24">
                                            <FormItem label="交付时间:">
                                                {{groupOrderForm.deliveryTime}}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                            <Card v-else>
                                <!--暂无数据-->
                                <no-data width="150" style="height: calc(100vh - 83px);overflow:hidden;display:flex;flex-direction:row;justify-content:center;" ></no-data>
                            </Card>
                            <!--<Timeline class="rightTimeLine">
                                <TimelineItem
                                        :color="item.auditState ==  1 ? 'green' : item.auditState ==  4 ? 'red': '#808695' "
                                        v-for="(item,index) in flowData"
                                        :key="item.id">
                                    <Row>-->
                                        <!--                                        <Col span="24" style="padding: 0 3px 3px 0" v-if="index == 0">提交人:{{-->
                                        <!--                                            item.createUserName }}-->
                                        <!--                                        </Col>-->
                                        <!--                                        <Col span="24" style="padding: 3px 3px 3px 0" v-if="index == 0">提交时间：{{-->
                                        <!--                                            item.createTime }}-->
                                        <!--                                        </Col>-->
<!--                                        <Col span="24" style="padding: 3px 3px 3px 0">审批人：{{ item.auditUserName }}</Col>-->
                                        <!--                                        <Col span="24" style="padding: 3px 3px 3px 0" v-if="index == 0">抄送人：{{-->
                                        <!--                                            item.showUserName }}-->
                                        <!--                                        </Col>-->
<!--                                        <Col span="24" style="padding: 3px 3px 3px 0">审核时间：{{ item.auditTime }}</Col>-->
<!--                                        <Col span="24" style="padding: 3px 3px 3px 0;background: #ccc;color: #0000FF">-->
<!--                                            意见：{{ item.auditContent }}-->
<!--                                        </Col>-->
<!--                                    </Row>-->
<!--                                </TimelineItem>-->
<!--                            </Timeline>-->
                        </Card>
                    </Col>
                </Row>

            </Col>
            <Modal v-model="showContent" :title="modalTitle" :mask-closable="false" :closable="false">
                <Input type="textarea" :rows="4" v-model="auditContent" placeholder="请输入审核意见"></Input>
                <div slot="footer">
                    <Button type="text" @click="modalCancel">取消</Button>
                    <Button type="primary" :loading="confirmLoading" @click="confirmSubmit">确定</Button>
                </div>
            </Modal>
            <contract-preview v-model="showOrderContract" :url="groupOrderForm.orderPath"></contract-preview>
        </Row>
        <previewTemplate v-model="showOrderPreview"
                         :groupOrderInfo="JSON.parse(JSON.stringify(groupOrderForm))"></previewTemplate>
        <approveShow v-model="approvalShow" :orderId="orderInfo.id" v-on:submitApproveListShowPage="submitApproveListShowPage"
                     v-on:closeLoading="closeLoading" :titleData="titleData" :url="groupOrderForm.orderPath"></approveShow>
        <review-content v-model="reviewContentShow" :orderId="orderInfo.id" :orderInfo="orderInfo" :flowData="flowData"
                        v-on:closeLoading="closeLoading" v-on:submitApproveShowPage="submitApproveListShowPage"></review-content>
    </div>
</template>
<script>
    import {formartDate} from '@/api/tools/tool'
    import {getAllUserData, getDictDataByType,userInfo} from "../../../api";
    import {queryAllTGroupUnitList} from "../../../api/healthy/tGroupUnit";
    import {
        queryApproveTGroupOrderList, getTGroupOrderNumByCreateId,
        updateTGroupOrderState, queryTGroupOrderListByStatus
    } from "../../../api/healthy/tGroupOrder";
    import {queryAllTOrderFlowList, updateTOrderFlow,getTOrderAndFlowData} from "../../../api/healthy/tOrderFlow";
    import {queryTOrderGroupList} from "../../../api/healthy/tOrderGroup"
    import {queryTOrderGroupItemList} from "../../../api/healthy/tOrderGroupItem"
    import util from "../../../libs/util";
    import noData from "@/components/no-data"
    import approveShow from "./approveShow"
    import contractPreview from "./contractPreview";
    import previewTemplate from "../tGroupOrder/previewTemplate";
    import {queryTGroupPersonList} from '@/api/healthy/tGroupPerson';
    import reviewContent from "./reviewContent"
    export default {
        name: "tGroupApproveList",
        components: {noData, contractPreview, previewTemplate,approveShow,reviewContent},
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
        },
        data() {
            return {
                reviewContentShow:false,
                hospitalNameData: {},
                auditUserName: "",
                auditTime: "",
                tGroupUnit: {},
                uploadList: [],
                roles: [],//用户角色集合
                roleLevel: "",//当前角色审批级别

                doctorInfo: {},
                titleData: "",
                expand: true,
                leftSpan: 'width: 300px;',
                span: 'position: relative;width: calc(100% - 332px);',
                expandIcon: "ios-arrow-back",
                discount: 100,
                auditState: '',
                radioValue: "",
                waitApprove: "待审批",
                approved: "已审批",
                groupData: [],//分组
                projectData: [],//体检项目
                total: 0,
                groupOrderForm: {
                    orderCode: "",
                    orderPath: "",
                    groupUnitId: "",
                    physicalType: "",
                    salesDirector: "",
                    signingTime: null,
                    deliveryTime: null,
                    remark: "",
                    salesParticipant: ""
                },
                searchForm: {
                    // 搜索框对应data对象
                    groupUnitName: '',//单位名称
                    auditState: 1,
                    pageNumber: 1, // 当前页数
                    pageSize: 10, // 页面大小
                    startDate: null,//开始时间
                    endDate: null,//结束时间
                    sort: 'createTime', // 默认排序字段
                    order: 'desc' // 默认排序方式
                },
                tableLoading: false,
                columns: [
                    {
                        type: 'index',
                        width: 70,
                        align: 'center',
                    },
                    {
                        title: '项目名称',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'name',
                        sortable: false
                    },
                    {
                        title: '原价',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'salePrice',
                        sortable: false
                    },
                    {
                        title: '折扣',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'discount',
                        sortable: false
                    },
                    {
                        title: '折扣价',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'discountPrice',
                        sortable: false
                    },
                    {
                        title: '排序',
                        align: 'center',
                        minWidth: 60,
                        ellipsis: true,
                        tooltip: true,
                        key: 'orderNum',
                        sortable: false
                    }
                ],
                groupOrderList: [],
                groupUnitList: [],
                physicalTypeList: [],
                userList: [],
                uploadList: [],
                showPersonData: [],
                auditPersonData: [],
                flowData: [],
                groupItemParam: {
                    groupId: '',
                },
                orderInfo: {},
                orderFlowId: '',
                adoptLoading: false,
                failLoading: false,
                subtotal: 0,
                tabIndex: 0,
                loading: false,
                groupOrderTotal: 0,
                auditContent: "",
                showContent: false,
                modalTitle: "",
                confirmLoading: false,
                showOrderContract: false,
                showOrderPreview:false,
                maleLoading: false,
                maleColumns: this.getMaleColumns(),
                groupPersonData:[],
                groupPersonSearchForm: {
                    pageNumber: 1, // 当前页数
                    pageSize: 10, // 页面大小
                    groupId: "",//分组id
                    orderId: ""
                },
                groupPersonTotal: 0,
                approvalShow: false,//是否打开评审页
            }
        },
        methods: {
            orderDiscountChange(e) {
                //折扣
                let v = Number(e);
                if (v == NaN) {
                    v = 0;
                }
                this.discount = v;
                let salePrice = Number(this.groupOrderForm.orderPrice * this.groupOrderForm.personCount);
                if (salePrice == NaN) {
                    salePrice = 0;
                }
                this.groupOrderForm.orderTotal = (salePrice * v / 100).toFixed(2);
                this.groupOrderForm.orderDiscount = (salePrice - this.groupOrderForm.orderTotal).toFixed(2);
            },
            //合同审批
            contractApproval(){
                if(this.searchForm.auditState == 99){
                    this.titleData = "评审查看";
                }else{
                    this.titleData = this.roleLevel;
                }
                this.approvalShow = true;
            },
            /**
             * 关闭loading
             */
            closeLoading() {
                this.loading = false;
                this.approvalShow = false;
                this.reviewContentShow = false;
            },
            //审批点击
            approveClick(num) {
                if (num == 2||num == 3) {
                    this.auditState = num;
                    this.adoptLoading = true;
                    this.auditContent = "无意见，通过";
                } else if (num == 4) {
                    this.auditState = 4;
                    this.failLoading = true;
                    this.auditContent = "不通过，原因：";
                }
                this.showContent = true;
                this.modalTitle = '您确认将该订单审核' + ((num == 2 || num == 3) ? "通过" : "不通过") + "吗？";
            },
            changeExpand() {
                this.expand = !this.expand;
                if (this.expand) {
                    this.expandIcon = "ios-arrow-back";
                    this.span = 'position: relative;width: calc(100% - 332px);';
                    this.leftSpan = 'width: 300px;'
                } else {
                    this.expandIcon = "ios-arrow-forward";
                    this.span = 'position: relative;width: calc(100% - 32px);';
                    this.leftSpan = 'width: 0px;';
                }
            },
            submitApproveListShowPage(){
                this.loading = true;
                this.waitApprove = "待审批";
                this.approved = "已审批";
                this.groupOrderList = [];
                this.searchForm.pageNumber = 1;
                this.searchForm.startDate = null;
                this.searchForm.endDate = null;
                this.searchForm.groupUnitName = '';
                // 重新加载数据
                let _this = this;
                setTimeout(function () {
                    _this.getGroupOrderData();
                }, 500)
            },
            confirmSubmit() {
                this.confirmLoading = true;
                if (this.auditState == 3 && (this.auditContent == '不通过，原因：' || (!this.auditContent || this.auditContent.trim().length < 1))) {
                    this.$Message.error("请填写不通过原因！");
                    this.confirmLoading = false;
                    return;
                }
                //更新订单状态
                updateTGroupOrderState({
                    id: this.orderInfo.id,
                    auditState: this.auditState,
                    orderTotal: this.groupOrderForm.orderTotal,
                    orderDiscount: this.groupOrderForm.orderDiscount,
                    orderFlowId: this.orderFlowId,
                    auditContent: this.auditContent
                }).then(res => {
                    if (res.success) {
                        this.searchForm.auditState = 1;
                        this.getOrderNum();
                        this.handleReset();
                    }
                }).finally(() => {
                    this.adoptLoading = false;
                    this.failLoading = false;
                    this.confirmLoading = false;
                    this.showContent = false;
                })
            },
            modalCancel() {
                this.showContent = false;
                this.adoptLoading = false;
                this.failLoading = false;
            },
            //分组点击
            handleTabClick(item) {
                //根据分组信息查询对应的项目信息
                this.groupItemParam.groupId = this.groupData[item.index].id;
                this.tabIndex = item.index;
                this.getGroupItem();
                this.getPersonDataList();

            },
            //获取分组
            getGroup(id) {
                this.projectData = [];
                this.groupData = [];
                this.groupPersonData = [];
                this.tableLoading = true;
                let _this = this;
                if (_this.groupOrderForm.salesDirector) {
                    let filter = _this.userList.filter(i => i.id == _this.groupOrderForm.salesDirector);
                    if (filter && filter.length > 0) {
                        _this.groupOrderForm.salesDirector = filter[0].nickname;
                    }
                }
                queryTOrderGroupList({groupOrderId: id}).then(res => {
                    this.tableLoading = false;
                    if (res.success) {
                        this.groupData = res.data;
                        this.groupItemParam.groupId = this.groupData[0].id;
                        this.groupPersonSearchForm.groupId = this.groupData[0].id;
                        this.groupPersonSearchForm.orderId = id;
                        this.projectData = res.data[0].projectData;
                        this.getPersonDataList();
                    } else {
                        this.$Message.error(res.msg)
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },
            //获取分组体检项目
            getGroupItem() {
                queryTOrderGroupItemList(this.groupItemParam).then(res => {
                    if (res.success) {
                        this.projectData = res.data;
                        //分组小计
                        let subtotal = 0;
                        for (let j = 0; j < this.projectData.length; j++) {
                            let data = this.projectData[j];
                            subtotal = this.numAdd(Number(data.discountPrice), subtotal, 1);
                        }
                        this.subtotal = this.accMul(subtotal, Number(this.groupData[this.tabIndex].personCount));
                    }
                })
            },
            //团检人员页码
            groupPersonChangePageNum(v) {
                this.groupPersonSearchForm.pageNumber = v;
                this.getPersonDataList();
            },
            //团检人员单页数据
            groupPersonPageSize(v) {
                this.groupPersonSearchForm.pageSize = v;
                this.getPersonDataList();
            },
            //加载人员信息
            getPersonDataList() {
                this.groupPersonData = [];
                this.maleLoading = true;
                queryTGroupPersonList(this. groupPersonSearchForm).then(res => {
                    this.maleLoading = false;
                    if (res.success) {
                        this.groupPersonData = res.data.records;
                        this.groupPersonTotal = res.data.total;
                    }
                }).catch(()=>{
                    this.maleLoading = false;
                });
            },
            accMul(arg1, arg2) {
                var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
                try {
                    m += s1.split(".")[1].length
                } catch (e) {
                }
                try {
                    m += s2.split(".")[1].length
                } catch (e) {
                }
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
            },
            //查询订单列表数据
            getGroupOrderData() {
                this.loading = true;
                let _this = this;
                _this.searchForm.physicalType = _this.physicalType;
                queryApproveTGroupOrderList(_this.searchForm).then(res => {
                    if (res.success) {
                        _this.groupOrderList = res.data.records;
                        _this.groupOrderTotal = res.data.total;
                        if (_this.groupOrderList.length > 0) {
                            let data = JSON.parse(JSON.stringify(_this.groupOrderList[0]));
                            _this.radioValue = data.id;
                            _this.orderInfo = data;
                            _this.groupOrderForm = data;

                            //获取用户登录信息
                            userInfo({}).then(res => {
                                if (res.success && res.data) {
                                    if(res.data && res.data.roles){
                                        _this.roles = res.data.roles;
                                        for(let i = 0;i < _this.roles.length;i ++){
                                            let role = _this.roles[i];
                                            if(role && role.id){
                                                let id = role.id;//当前角色id
                                                if(id.trim() == '1501460125288894464' && _this.orderInfo && _this.orderInfo.auditState==1){//主治医生
                                                    _this.roleLevel = "合同一级审核";
                                                }
                                                if(id.trim() == '1501460349784821760' && _this.orderInfo && _this.orderInfo.auditState==2){//体检中心主任
                                                    _this.roleLevel = "合同二级审核";
                                                }
                                                if(id.trim() == '1530129299582095360' && _this.orderInfo && _this.orderInfo.auditState==3){//技术负责人
                                                    _this.roleLevel = "合同三级审核";
                                                }
                                            }
                                        }
                                    }
                                }
                            });

                            _this.groupOrderForm.salesDirector = _this.getGroup(_this.radioValue);
                            _this.getFlowData();
                        } else {
                            _this.groupOrderForm = {};
                            _this.groupData = [];
                            _this.projectData = [];
                            _this.uploadList = [];
                            _this.flowData = [];
                            _this.showPersonData = [];
                            _this.auditPersonData = [];
                        }
                    }
                }).finally(() => {
                    _this.getOrderNum();
                    this.loading = false;
                });
            },
            // 向上滚动，到达底部，加载更多
            handleReachBottom() {
                this.searchForm.pageNumber = parseInt(this.searchForm.pageNumber) + 1;
                this.getGroupOrderData();
            },
            //重置
            handleReset() {
                this.groupOrderList = [];
                this.searchForm.pageNumber = 1;
                this.searchForm.startDate = null;
                this.searchForm.endDate = null;
                this.searchForm.groupUnitName = '';
                // 重新加载数据
                this.getGroupOrderData();
            },
            TabsClick(e) {
                this.radioValue = '';
                this.groupOrderForm = {
                    orderCode: "",
                    orderPath: "",
                    groupUnitId: "",
                    physicalType: "",
                    salesDirector: "",
                    signingTime: '',
                    deliveryTime: '',
                    salesParticipant: ""
                };
                this.groupData = [];
                this.projectData = [];
                this.uploadList = [];
                this.showPersonData = [];
                this.auditPersonData = [];
                this.flowData = [];
                this.orderInfo = {};
                this.auditState = '';
                this.orderFlowId = '';
                this.searchForm.groupUnitName = '';
                if (e == 'name1') {
                    this.searchForm.auditState = 1;
                    this.handleReset();
                } else {
                    this.searchForm.auditState = 99;
                    this.handleReset();
                }
            },
            //查看
            handleView(v) {
                //获取viewer实例
                const viewer = this.$el.querySelector('.images').$viewer
                //调用show方法进行显示预览图
                viewer.index = v;
                viewer.show()
            },
            //格式化时间
            formatTime(e) {
                return formartDate(e, "yyyy-MM-dd");
            },
            //点击文字选中
            radioChooseClick(item) {
                let _this = this;
                //获取用户登录信息
                userInfo({}).then(res => {
                    if (res.success && res.data) {
                        if(res.data && res.data.roles){
                            _this.roles = res.data.roles;
                            for(let i = 0;i < _this.roles.length;i ++){
                                let role = _this.roles[i];
                                if(role && role.id){
                                    let id = role.id;//当前角色id
                                    if(id.trim() == '1501460125288894464' && item && item.auditState==1){//主治医生
                                        _this.roleLevel = "合同一级审核";
                                    }
                                    if(id.trim() == '1501460349784821760' && item && item.auditState==2){//体检中心主任
                                        _this.roleLevel = "合同二级审核";
                                    }
                                    if(id.trim() == '1530129299582095360' && item && item.auditState==3){//技术负责人
                                        _this.roleLevel = "合同三级审核";
                                    }
                                }
                            }
                        }
                    }
                });
                this.radioValue = item.id;
                this.orderInfo = item;
                this.groupOrderForm = item;
                this.getFlowData();
                this.getGroup(item.id);
            },
            //获取流程信息
            getFlowData() {
                /*queryAllTOrderFlowList({groupOrderId: this.groupOrderForm.id}).then(res => {
                    if (res.success && res.data && res.data.data) {
                        this.flowData = res.data.data;
                        this.auditPersonData = [];
                        this.showPersonData = [];
                        this.uploadList = [];
                        if (this.flowData && this.flowData.length > 0) {
                            this.orderFlowId = this.flowData[0].id;
                            this.auditPersonData.push({
                                id: this.flowData[0].auditUserId,
                                nickname: this.flowData[0].auditUserName
                            });
                            if (this.flowData[0].showUserId) {
                                let userIds = this.flowData[0].showUserId.split(",");
                                let userNames = this.flowData[0].showUserName.split(",");
                                for (let i = 0; i < userIds.length; i++) {
                                    this.showPersonData.push({id: userIds[i], nickname: userNames[i]})
                                }
                            }
                            for (let i = 0; i < res.data.uploadList.length; i++) {
                                this.uploadList.push(util.nginxUrl + res.data.uploadList[i].url);
                            }

                        }
                    } else {
                        this.$Message.error(res.msg)
                    }
                });*/
                getTOrderAndFlowData({id: this.groupOrderForm.id}).then(res => {
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

                        this.auditPersonData = [];
                        this.showPersonData = [];
                        this.uploadList = [];
                        if (this.flowData && this.flowData.length > 0) {
                            this.orderFlowId = this.flowData[0].id;
                            this.auditPersonData.push({
                                id: this.flowData[0].auditUserId,
                                nickname: this.flowData[0].auditUserName
                            });
                            if (this.flowData[0].showUserId) {
                                let userIds = this.flowData[0].showUserId.split(",");
                                let userNames = this.flowData[0].showUserName.split(",");
                                for (let i = 0; i < userIds.length; i++) {
                                    this.showPersonData.push({id: userIds[i], nickname: userNames[i]})
                                }
                            }
                            for (let i = 0; i < res.data.uploadList.length; i++) {
                                this.uploadList.push(util.nginxUrl + res.data.uploadList[i].url);
                            }

                        }
                    } else {
                        this.$Message.error(res.msg)
                    }
                });
            },
            //搜索
            search() {
                this.searchForm.pageNumber = 1;
                this.getGroupOrderData();
            },
            //获取订单待审批与已审批数量
            getOrderNum() {
                getTGroupOrderNumByCreateId({physicalType: this.physicalType}).then(res => {
                    if (res.success) {
                        if (res.data) {
                            this.waitApprove = "待审批" + "(" + res.data.waitApprove + ")";
                            this.approved = "已审批" + "(" + res.data.approved + ")";
                        }
                    } else {
                        this.$Message.error(res.msg)
                    }
                })
            },
            handleSummary({columns, data}) {
                const sums = {};
                columns.forEach((column, index) => {
                    const key = column.key;
                    if (index === 0) {
                        sums[key] = {
                            key,
                            value: '合计'
                        };
                        return;
                    }
                    const values = data.map(item => Number(item[key]));
                    if (!values.every(value => isNaN(value))) {
                        const v = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return this.numAdd(prev, curr, 1);
                            } else {
                                return prev;
                            }
                        }, 0);

                        if (key == 'salePrice' || key == 'discountPrice') {
                            sums[key] = {
                                key,
                                value: v + ' 元'
                            };
                        } else {
                            sums[key] = {
                                key,
                                value: '-'
                            };
                        }
                    } else {
                        sums[key] = {
                            key,
                            value: '-'
                        };
                    }
                });
                return sums;
            },
            numAdd: function (arg1, arg2, type) {
                var r1, r2, m, c;
                try {
                    r1 = arg1.toString().split(".")[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split(".")[1].length;
                } catch (e) {
                    r2 = 0;
                }
                c = Math.abs(r1 - r2);
                m = Math.pow(10, Math.max(r1, r2));
                if (c > 0) {
                    var cm = Math.pow(10, c);
                    if (r1 > r2) {
                        arg1 = Number(arg1.toString().replace(".", ""));
                        arg2 = Number(arg2.toString().replace(".", "")) * cm;
                    } else {
                        arg1 = Number(arg1.toString().replace(".", "")) * cm;
                        arg2 = Number(arg2.toString().replace(".", ""));
                    }
                } else {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
                if (type == 1) {
                    return (arg1 + arg2) / m;
                } else {
                    return (arg1 - arg2) / m;
                }
            },
            groupOrderChangePageNum(v) {
                this.searchForm.pageNumber = v;
                this.getGroupOrderData();
            },
            //团检个人列
            getMaleColumns() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    }, {
                        title: '姓名',
                        align: 'center',
                        minWidth: 100,
                        key: 'personName',
                        tree: true
                    }, {
                        title: '性别',
                        align: 'center',
                        minWidth: 80,
                        key: 'sex',
                        sortable: false
                    }, {
                        title: '证件号码',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 160,
                        key: 'idCard',
                        sortable: false
                    }, {
                        title: '年龄',
                        align: 'center',
                        minWidth: 100,
                        key: 'age',
                        sortable: false
                    }
                ]
            },
            handelSubmit(){
                this.reviewContentShow = true;
            },
        },
        mounted() {
            let _this = this;
            //获取体检类型
            getDictDataByType("checkType").then(res => {
                if (res.success) {
                    _this.physicalTypeList = res.data;
                }
            });
            //获取销售人
            getAllUserData({}).then(res => {
                if (res.success) {
                    _this.userList = res.data;
                    if (_this.groupOrderForm.salesDirector) {
                        let filter = _this.userList.filter(i => i.id == _this.groupOrderForm.salesDirector);
                        if (filter && filter.length > 0) {
                            _this.groupOrderForm.salesDirector = filter[0].nickname;
                        }
                    }
                }
            });
            // _this.getOrderNum();
            _this.getGroupOrderData();

            //获取团检单位
            queryAllTGroupUnitList({}).then(res => {
                if (res.success) {
                    _this.groupUnitList = res.data;
                }
            });
            if(this.$hospitalName){
                this.hospitalNameData = this.$hospitalName;
            }
        }
    }
</script>
<style scoped="less">
    .operation {
        margin-bottom: 10px;
    }
</style>
