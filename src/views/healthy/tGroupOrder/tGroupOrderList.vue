<template>
    <Row class="groupOrder">
        <Col v-show="expand" :style="leftSpan">
            <Card style="height: calc(100vh - 80px);overflow: hidden;">
                <Alert class="ivu-alert">团检订单</Alert>
                <Row style="display: flex;">
                    <RadioGroup v-model="searchForm.payStatus" @on-change="search" style="width: 55%;margin-top: 10px;margin-left: 5px;">
                        <Radio :label="0">未确认</Radio>
                        <Radio :label="1">已确认</Radio>
                    </RadioGroup>
                    <div style="width: 43%;text-align: right;">
                        <Button @click="addTGroupOrder" style="margin-top: 8px;margin-left: 5px;text-align: center;" type="primary" icon="md-add" size="small" v-if="searchForm.payStatus == 0">新增订单</Button>
                    </div>
<!--                    <Button @click="addTGroupOrder" style="margin-top: 8px;margin-left: 5px;" type="primary" icon="md-add" size="small" v-if="searchForm.payStatus == 0">新增订单</Button>-->
                </Row>
                <Row style="margin-top: 10px;margin-bottom: 10px">
                    <div v-if="queryTime" style="display: flex;flex-wrap: nowrap;align-items: center;">
                        <RadioGroup type="button" size="small" class="btngroup" button-style="solid" v-model="radioDateValue"
                                    @on-change="radioChange">
                            <Radio label="当日"></Radio>
                            <Radio label="当月"></Radio>
                            <DatePicker :open="datePickerShow" transfer type="daterange" @on-change="datePickerChange">
                                <template>
                                    <Radio label="自定义" @click.native="datePickerShow = !datePickerShow"></Radio>
                                </template>
                            </DatePicker>
                        </RadioGroup>
                        <span class="resetBtn" @click="resetClick">重置</span>
                    </div>
                    <div v-else style="display: flex;flex-wrap: nowrap;align-items: center;">
                        <DatePicker v-model="searchForm.startDate" transfer placement="bottom-end" transfer placeholder="开始时间" type="date" @on-change="datePickerStartTime">
                        </DatePicker>
                    &nbsp;~&nbsp;
                        <DatePicker  v-model="searchForm.endDate" transfer type="date" placeholder="结束时间" @on-change="datePickerEndTime">
                        </DatePicker>
                    </div>
                </Row>

                <Row style="margin-bottom:10px; ">
                    <Input v-model="searchForm.searchKey" suffix="ios-search" @on-change="search" placeholder="请输入关键字"/>
                </Row>
                <Row style="margin-top: 10px;">
                    <div style="display: flex;flex-wrap: nowrap;align-items: center;">
                        <RadioGroup type="button" size="small" class="btngroup" button-style="solid" v-model="radioDateValue"
                                    @on-change="radioChange">
                        </RadioGroup>
                        <span v-if="!queryTime" class="resetBtn" @click="resetClick">重置</span>
                    </div>
                </Row>

                <Row class="left-item">
                    <!--左侧套餐列-->
                    <RadioGroup class="radio-group" v-model="radioValue" v-if="groupOrderList.length>0">
                        <Row class="row-border" v-for="(item, index) in groupOrderList" :key="item.id" @click.native="radioChooseClick(item)">
                            <Col :span="3" class="radio-group-radio">
                                <Radio class="label" :label="item.id"></Radio>
                            </Col>
                            <Col :span="21" class="radio-group-content">
                                <Row style="margin-bottom: 6px;">
                                    <Col :span="20" class="date">{{ formatTime(item.signingTime) }}</Col>
                                    <Col :span="4">
                                        <div class="border-blue" v-if="item.physicalType.indexOf('职业') != -1">
                                            职
                                        </div>
                                        <div class="border-green" v-if="item.physicalType.indexOf('健康') != -1">
                                            健
                                        </div>
                                        <div class="border-yellow" v-if="item.physicalType.indexOf('从业') != -1">
                                            从
                                        </div>
                                        <div class="border-purple" v-if="item.physicalType.indexOf('放射') != -1">
                                            放
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col :span="20" class="company">{{ item.groupUnitName }}</Col>
                                    <Col :span="4" class="bg-green" v-if="item.auditState == 4">通</Col>
                                    <Col :span="4" class="bg-audit" v-if="item.auditState == 1||item.auditState == 2||item.auditState == 3">审</Col>
                                    <Col :span="4" class="bg-refute" v-if="item.auditState == 5">驳</Col>
                                    <!--                                    <Col :span="0" class="bg-deflate" v-if="item.auditState == 0">无</Col>-->
                                </Row>
                            </Col>
                        </Row>
                    </RadioGroup>
                    <no-data v-else></no-data>
                    <Spin fix v-if="loading">
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>加载中...</div>
                    </Spin>
                    <Page v-if="groupOrderList.length > 0" :current="searchForm.pageNumber" :total="total" simple
                          @on-change="personChangePageNum"/>
                </Row>
            </Card>
        </Col>
        <div class="expand">
            <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand"/>
        </div>
        <Col :style="span">
            <Card style="height: calc(100vh - 80px);overflow: auto;">
                <div style="margin-bottom: 10px;">
<!--                    <Button @click="addTGroupOrder" type="primary" icon="md-add" v-if="searchForm.payStatus == 0">新增订单</Button>-->
                    <Button @click="saveTGroupOrder" type="info" icon="md-play" :loading="saveLoading"
                            v-if="groupOrderForm.payStatus == 0">
                        保存订单及项目信息
                    </Button>
                    <Button @click="saveOrderInfo" type="info" icon="md-play" :loading="saveLoading"
                            v-if="groupOrderForm.payStatus == 1">
                        保存订单及项目信息
                    </Button>
                    <Button @click="deleteTGroupOrder" type="error" icon="md-trash" v-if="searchForm.payStatus == 0 && groupOrderForm.id ">删除订单</Button>
                    <Button @click="handleUpload" type="info" icon="ios-cloud-upload" :loading="saveLoading"
                            v-if="groupOrderForm.id ">
                        批量导入人员
                    </Button>
                    <Button @click="saveAndAuditTGroupOrder" type="primary" icon="md-add-circle" :loading="saveLoading"
                            v-if=" (groupOrderForm.auditState == 0 ||groupOrderForm.auditState == 5) && groupOrderForm.id && groupOrderForm.payStatus != 0">
                        提交审核
                    </Button>
                    <Button @click="orderFlowShow = true" type="primary" icon="ios-paper" :loading="saveLoading"
                            v-if=" groupOrderForm.id && groupOrderForm.auditState > 0">
                        查看审批信息
                    </Button>
                    <!--<Button type="info" @click="uploadShow = true" v-if="showButton && groupOrderForm.payStatus == 0 && groupOrderForm.isAuditState == 1 && groupOrderForm.id" icon="ios-cloud-upload-outline">附件上传
                    </Button>-->
                    <Button type="info" @click="uploadShow = true" v-if="(showButton || searchForm.payStatus==1) && groupOrderForm.isAuditState == 1 && groupOrderForm.id" icon="ios-cloud-upload-outline">附件上传
                    </Button>
                    <!--<Button type="info" @click="showOrderContract = true" v-if="groupOrderForm.isAuditState == 1 && (groupOrderForm.orderPath || groupOrderForm.orderEvaluatePath || groupOrderForm.orderLicensePath) && groupOrderForm.id" icon="md-eye">附件查看
                    </Button>-->
                    <!--<Button type="info" icon="ios-cloud-upload-outline" :loading="saveLoading"
                            @click="showOrderPreview = true"
                            v-if="showButton && groupOrderForm.id && groupOrderForm.isAuditState == 1">
                        委托协议预览
                    </Button>-->
                    <Button type="info" icon="ios-cloud-upload-outline" :loading="saveLoading"
                            @click="showOrderPreview = true"
                            v-if="groupOrderForm.id">
                        委托协议预览
                    </Button>
                    <Button @click="paymentConfirm"  :loading="saveLoading" type="success" icon="md-build" v-if="groupOrderForm.payStatus == 0 && groupOrderForm.id">
                        订单确认
                    </Button>
                    <Button @click="handleNoPersonExport"  :loading="saveLoading" type="info" icon="md-arrow-round-down" v-if="searchForm.payStatus==1 && groupOrderForm.id">
                        导出未登记人员信息
                    </Button>
                    <Button @click="handleFinishPersonExport"  :loading="saveLoading" type="info" icon="md-arrow-round-down" v-if="searchForm.payStatus==1 && groupOrderForm.id">
                        导出已登记人员信息
                    </Button>
                    <Button @click="handleFinishNoSDPersonExport"  :loading="saveLoading" type="info" icon="md-arrow-round-down" v-if="searchForm.payStatus==1 && groupOrderForm.id">
                        导出已登记未体检完人员信息
                    </Button>
                </div>
                <Form ref="groupOrderForm" :model="groupOrderForm" :rules="groupOrderFormRule" :label-width="110">
                    <Row>
                        <Col :span="6">
                            <FormItem label="团检单号" prop="orderCode">
                                <Input type="text" v-model="groupOrderForm.orderCode" placeholder="提交后系统自动生成" clearable
                                       disabled>
                                    <span slot="append" v-if="groupOrderForm.payStatus == 1"
                                          style="color: #19be6b">已确认</span>
                                    <span slot="append" v-else style="color: red;">未确认</span>
                                </Input>
                            </FormItem>
                        </Col>
                        <Col :span="6">
                            <FormItem label="团检单位" prop="groupUnitId">
                                <Select v-model="groupOrderForm.groupUnitId" label-in-value filterable
                                        @on-change="groupUnitChange" clearable :disabled="searchForm.payStatus == 1 ? true : false">
                                    <Option v-for="item in groupUnitList" :value="item.id" :key="item.id" :label="item.name">
                                        {{ item.name }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <!--<Col :span="6">
                            <FormItem label="体检类型" prop="physicalType">
                                <Input type="text" v-model="groupOrderForm.physicalType" placeholder="体检类型" readonly></Input>
                            </FormItem>
                        </Col>-->
                        <Col :span="6">
                            <FormItem label="销售负责人">
                                <Select v-model="groupOrderForm.salesDirector" label-in-value
                                        @on-change="saleManChange">
                                    <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.nickname }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="6">
                            <FormItem label="签订日期" prop="signingTime">
                                <DatePicker v-model="groupOrderForm.signingTime" type="date" placeholder="请选择签订日期"
                                            format="yyyy-MM-dd" style="width: 100%;"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col :span="6">
                            <FormItem label="体检日期" prop="deliveryTime">
                                <DatePicker v-model="groupOrderForm.deliveryTime" type="date" placeholder="请选择体检日期"
                                            format="yyyy-MM-dd" style="width: 100%;"></DatePicker>
                            </FormItem>
                        </Col>
                        <!--                        <Col :span="6" v-if="groupOrderForm && groupOrderForm.id">-->
                        <!--                            <FormItem label="是否审批" prop="remark">-->
                        <!--                                <Row>-->
                        <!--                                    <div  v-if="groupOrderForm.auditState == 3">是</div>-->
                        <!--                                    <div  v-else>否</div>-->
                        <!--                                </Row>-->
                        <!--                            </FormItem>-->
                        <!--                        </Col>-->
                        <!--<Col :span="6">
                            <FormItem label="销售参与人" prop="salesParticipant">
                                <Select v-model="groupOrderForm.salesParticipant" multiple @on-change="joinManChange">
                                    <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.nickname }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>-->
                        <Col :span="6">
                            <FormItem label="零星体检" prop="sporadicPhysical">
                                <Select :disabled="searchForm.payStatus==1" v-model="groupOrderForm.sporadicPhysical" label-in-value
                                        @on-change="sporadicChange">
                                    <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.type }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :span="6" >
                            <FormItem label="是否需要合同评审" prop="isAuditState" :label-width="162">
                                <!--<Select v-model="groupOrderForm.isAuditState" label-in-value>
                                    <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.type }}
                                    </Option>
                                </Select>-->
                                <RadioGroup v-model="groupOrderForm.isAuditState" @on-change="auditStateChange">
                                    <Radio :disabled="disabledAuditState" :label='0'>否</Radio>
                                    <Radio :disabled="disabledAuditState" :label='1'>是</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>

                <Row :gutter="5" >
                    <Col span="24">
                        <Alert class="ivu-alert-left">
                            体检项目
                            <!--              <Button @click="editGroup" type="primary" icon="ios-create-outline" size="small" v-if="this.groupOrderForm.physicalType.indexOf('职业') == -1">编辑分组</Button>-->
                            <!--              <Button @click="" type="primary" icon="md-add" size="small" v-if="this.groupOrderForm.physicalType.indexOf('职业') != -1">添加危害因素分组</Button>-->
                            <span style="display: inline-block;" v-if="groupOrderForm.physicalType">
                                <Button @click="editGroup"  type="primary" icon="ios-create-outline" size="small" style="margin-left: 20px;">编辑分组
                                </Button>
                                <Button @click="checkCombo" type="primary" icon="md-add" size="small"
                                        v-if="(groupOrderForm.payStatus != 1 || (tabId!=null &&  tabId.trim().length==0))">{{physicalType=='职业体检'||physicalType=='放射体检'? "必检":""}}套餐选择</Button>
                                <Button @click="addTPortfolioProject" type="primary" icon="md-add" size="small" v-if="groupOrderForm.physicalType">{{physicalType=='职业体检'||physicalType=='放射体检'? "选检":""}}项目选择
                                </Button>
                            </span>
                        </Alert>
                        <div v-if=" groupData.length > 0">

                            <el-tabs v-model="tabValue" type="border-card"
                                     :closable="groupOrderForm.payStatus == 1 || groupData.length == 1? false : true"
                                     @tab-remove="handleTabRemove" @tab-click="handleTabClick"
                                     style="margin-top: 15px;margin-bottom: 15px;" >
                                <el-tab-pane v-for="(item, index) in groupData" :key="index" :label="item.name"
                                             :name="index + ''">
                                    <Table :loading="tableLoading" border :columns="columns" sortable="custom" show-summary
                                           :summary-method="handleSummary"
                                           :data="item.projectData" ref="table" max-height="380">
                                        <template slot-scope="{ row, index }" slot="action">
                                            <Button type="error" @click="deleteData(row, index)" :loading="delLoading" size="small" v-if="row.projectType == 2">
                                                <Icon type="md-trash"></Icon>
                                                删除
                                            </Button>
                                        </template>
                                    </Table>
                                    <Form :label-width="100">
                                        <Row style="margin-top: 16px;">
                                            <Col :xs="{span:24}" :md="{span:11,offset:1}" :lg="{span:7,offset:1}" :xl="{span:5,offset:1}">
                                                <FormItem label="必检项折扣：" v-if="isShow">
                                                    <InputNumber :min="1" :max="100" v-model="item.discount"
                                                                 :readonly="searchForm.payStatus == 1 ? true : false"
                                                                 @on-change="onDiscountChange"></InputNumber>
                                                </FormItem>
                                            </Col>
                                            <!--<Col :xs="{span:24}" :md="{span:11,offset:1}" :lg="{span:7,offset:1}" :xl="{span:5,offset:1}">-->
                                            <!--    <FormItem label="选检项缴费：" v-if="isShow">-->
                                            <!--        <Select v-model="item.additionalPayment" transfer :disabled="searchForm.payStatus == 1 ? true :false">-->
                                            <!--            <Option value="自费">自费</Option>-->
                                            <!--            <Option value="单位缴费">单位缴费</Option>-->
                                            <!--        </Select>-->
                                            <!--    </FormItem>-->
                                            <!--</Col>-->
                                            <Col>
                                                <FormItem label="选检项折扣：" v-if="isShow">
                                                    <InputNumber :min="1" :max="100" v-model="item.addDiscount"
                                                                 :readonly="searchForm.payStatus == 1 ? true : false"
                                                                 @on-change="onAddDiscountChange"></InputNumber>
                                                </FormItem>
                                            </Col>
                                            <Col
                                                 style="display: flex;">
<!--                                                <div style="font-size: 15px;color: red;position: absolute;top: 10px;left: 2px;">*</div>-->
                                                <FormItem label="优惠价格：" v-if="isShow">
                                                    <InputNumber :min="0"  v-model="item.discountPrice"
                                                                 @on-change="onDiscountChanges"
                                                    ></InputNumber>
                                                </FormItem>
                                            </Col>
                                            <Col
                                                 style="display: flex;">
                                                <div v-if="!importFailures" style="font-size: 15px;color: red;position: absolute;top: 10px;left: 2px;">*</div>
                                                <FormItem label="分组人数：">
                                                    <InputNumber :min="0" v-model="item.personCount" @on-change="onPersonCountChange"></InputNumber>
                                                </FormItem>
                                            </Col>
                                            <Col>
                                                <FormItem label="分组小计：">
                                                    ￥{{ subtotal }}元
                                                </FormItem>
                                            </Col>
                                            <!--<Col :xs="{span:24}" :md="{span:11,offset:1}" :lg="{span:7,offset:1}" :xl="{span:5,offset:1}"-->
                                            <!--     v-if="physicalType == '职业体检'">-->
                                            <!--    <div style="font-size: 15px;color: red;position: absolute;top: 10px;left: 10px;">*</div>-->
                                            <!--    <FormItem label="环评因素：">-->
                                            <!--        <Input type="text" v-model="item.eiaFactors" placeholder="请输入环评因素" clearable/>-->
                                            <!--    </FormItem>-->
                                            <!--</Col>-->
                                        </Row>
                                    </Form>
                                </el-tab-pane>
                            </el-tabs>
                            <Alert class="ivu-alert-left" v-if="groupData.length > 0" style="margin-top: 10px">
                                体检人员
                            </Alert>
                            <Table v-if="groupData.length > 0" :loading="maleLoading" border max-height="450" :columns="maleColumns"
                                   sortable="custom" :data="groupPersonData"
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

                            <Form :label-width="90" style="margin-top: 20px;">
                                <Row v-if="false">
                                    <Col span="4">
                                        <FormItem label="套餐小计" :label-width="70">
                                            <div style="text-align: center;">
                                                <Icon type="md-arrow-forward" style="color: #2d8cf0;"/>
                                            </div>
                                        </FormItem>
                                    </Col>
                                    <Col span="5">
                                        <FormItem label="套餐原价：">
                                            ￥{{ this.groupOrderForm.packagePrice }}元
                                        </FormItem>
                                    </Col>
                                    <Col span="5">
                                        <FormItem label="套餐折扣：">
                                            ￥{{ this.groupOrderForm.packageDiscount }}元
                                        </FormItem>
                                    </Col>
                                    <Col span="5">
                                        <FormItem label="套餐合计：">
                                            ￥{{ this.groupOrderForm.packageTotal }}元
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row v-if="Number(this.groupOrderForm.orderTotal)>0">
                                    <Col span="5">
                                        <FormItem label="订单合计：">
                                            <span style="color: red;font-size: 18px;white-space: nowrap;">￥{{ this.groupOrderForm.orderTotal }}元</span>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <no-data width="150" height="150" v-else></no-data>
                    </Col>
                    <!--                    <Col :span="6">-->
                    <!--                        <Alert class="ivu-alert-right" style="display: flex;">-->
                    <!--                            <span>审批流程</span>-->
                    <!--                            <Button v-if="groupOrderForm.id && groupOrderForm.id.length > 0 && groupOrderForm.payStatus == 0"-->
                    <!--                                    @click="saveAndAuditTGroupOrder"-->
                    <!--                                    type="success" size="small" icon="md-checkbox" :loading="saveAndAuditLoading">提交审核-->
                    <!--                            </Button>-->
                    <!--                        </Alert>-->
                    <!--                        <Timeline class="rightTimeLine">-->
                    <!--                            <TimelineItem color="blue">-->
                    <!--                                <Row>-->
                    <!--                                    <Col span="24">-->
                    <!--                                        附件信息-->
                    <!--                                    </Col>-->
                    <!--                                    <Col span="24">-->
                    <!--                                        <div class="images" v-viewer="{movable: false}" style="display: none;">-->
                    <!--                                            <img v-for="src in uploadList" :src="src" :key="src">-->
                    <!--                                        </div>-->
                    <!--                                        <div style="display: flex;flex-wrap: wrap;margin-top: 5px;">-->
                    <!--                                            <div class="demo-upload-list" v-for="(item, index) in uploadList">-->
                    <!--                                                <img :src="item">-->
                    <!--                                                <div class="demo-upload-list-cover">-->
                    <!--                                                    <Icon type="ios-eye-outline"-->
                    <!--                                                          @click.native="handleView(index)"></Icon>-->
                    <!--                                                    <Icon type="ios-trash-outline"-->
                    <!--                                                          @click.native="handleRemove(item)"></Icon>-->
                    <!--                                                </div>-->
                    <!--                                            </div>-->
                    <!--                                            <div class="chooseImg" @click="uploadClick" v-if="uploadList.length < 5 && groupOrderForm.payStatus != 1">-->
                    <!--                                                <Icon type="ios-camera" size="20"></Icon>-->
                    <!--                                                <input ref="upload" type="file" accept="image/*" @change="inputChange"-->
                    <!--                                                       style="display: none;"/>-->
                    <!--                                            </div>-->
                    <!--                                        </div>-->
                    <!--                                    </Col>-->
                    <!--                                </Row>-->
                    <!--                            </TimelineItem>-->
                    <!--                            <TimelineItem color="blue">-->
                    <!--                                <Row>-->
                    <!--                                    <Col :span="6">审批人</Col>-->
                    <!--                                    <Col span="18" v-if="groupOrderForm.payStatus != 1">如需审批，请添加审批人</Col>-->
                    <!--                                    <Col span="24" style="margin-top: 5px;flex-wrap: wrap;">-->
                    <!--                                        <Row>-->
                    <!--                                            <div span="4" v-for="item in auditPersonData" :key="item.id"-->
                    <!--                                                 style="width: 50px;margin-right:10px;margin-bottom: 10px;">-->
                    <!--                                                <Avatar shape="square" size="large" style="background-color: #87d068;">-->
                    <!--                                                    {{ item.nickname }}-->
                    <!--                                                </Avatar>-->
                    <!--                                            </div>-->
                    <!--                                            <div span="4" v-if="groupOrderForm.payStatus != 1">-->
                    <!--                                                <div class="plusDiv" @click="chooseUser(1)">-->
                    <!--                                                    <Icon type="ios-add" size="24" color="#2988f3"/>-->
                    <!--                                                    <div style="height: auto;color: #2988f3;font-size: 12px;">添加</div>-->
                    <!--                                                </div>-->
                    <!--                                            </div>-->
                    <!--                                        </Row>-->
                    <!--                                    </Col>-->
                    <!--                                </Row>-->
                    <!--                            </TimelineItem>-->
                    <!--                            <TimelineItem color="blue">-->
                    <!--                                <Row>-->
                    <!--                                    <Col :span="6">抄送</Col>-->
                    <!--                                    <Col span="18" v-if="groupOrderForm.payStatus != 1">如需抄送，请添加抄送人</Col>-->
                    <!--                                    <Col span="24" style="margin-top: 5px">-->
                    <!--                                        <Row>-->
                    <!--                                            <div v-for="item in showPersonData" :key="item.id"-->
                    <!--                                                 style="width: 50px;margin-right:10px;margin-bottom: 10px;">-->
                    <!--                                                <Avatar shape="square" size="large" style="background-color: #87d068;">-->
                    <!--                                                    {{ item.nickName }}-->
                    <!--                                                </Avatar>-->
                    <!--                                            </div>-->
                    <!--                                            <div v-if="groupOrderForm.payStatus != 1">-->
                    <!--                                                <div class="plusDiv" @click="chooseUser(2)">-->
                    <!--                                                    <Icon type="ios-add" size="24" color="#2988f3"/>-->
                    <!--                                                    <div style="height: auto;color: #2988f3;font-size: 12px;">添加</div>-->
                    <!--                                                </div>-->
                    <!--                                            </div>-->
                    <!--                                        </Row>-->
                    <!--                                    </Col>-->
                    <!--                                </Row>-->
                    <!--                            </TimelineItem>-->
                    <!--                            <TimelineItem-->
                    <!--                                    :color="item.auditState ==  1 ? 'green' : item.auditState ==  3 ? 'red': item.auditState ==  2 ? '#19be6b' : '#808695' "-->
                    <!--                                    v-for="(item,index) in flowData" :key="item.id">-->
                    <!--                                <Row>-->
                    <!--                                    <Col span="24" style="padding: 0 3px 3px 0" v-if="index == 0">提交人:{{ item.createUserName }}</Col>-->
                    <!--                                    <Col span="24" style="padding: 3px 3px 3px 0" v-if="index == 0">提交时间：{{ item.createTime }}</Col>-->
                    <!--                                    <Col span="24" style="padding: 3px 3px 3px 0">审批人：{{ item.auditUserName }}</Col>-->
                    <!--                                    <Col span="24" style="padding: 3px 3px 3px 0" v-if="index == 0">抄送人：{{ item.showUserName }}</Col>-->
                    <!--                                    <Col span="24" style="padding: 3px 3px 3px 0">审核时间：{{ item.auditTime }}</Col>-->
                    <!--                                    <Col span="24" style="padding: 3px 3px 3px 0;background: #ccc;color: #0000FF">-->
                    <!--                                        意见：{{ item.auditContent }}-->
                    <!--                                    </Col>-->
                    <!--                                </Row>-->
                    <!--                            </TimelineItem>-->
                    <!--                        </Timeline>-->
                    <!--                    </Col>-->
                </Row>

            </Card>
        </Col>
        <choose-user v-model="chooseUserShow" v-on:handleSearch="setAuditPerson" :checkedList="chooseUserData"
                     :isMultiple="isMultiple"></choose-user>
        <group-edit v-model="editGroupShow" v-on:handleSearch="setGroup" :checkedList="chooseGroupData"></group-edit>
        <choose-combo v-model="chooseComboShow" v-on:handleSearch="setComboData" :checkedList="comboIdList"
                      :physicalType="physicalType"></choose-combo>
        <choose-portfolio-project v-model="choosePortfolioProjectShow" v-on:handleSearch="setTableData"
                                  :checkedList="choosePortfolioProjectData"></choose-portfolio-project>
        <previewTemplate v-model="previewShow" :groupOrderInfo="JSON.parse(JSON.stringify(groupOrderForm))"></previewTemplate>
        <file-upload v-model="uploadShow" :order-id="radioValue":groupOrderInfo="JSON.parse(JSON.stringify(groupOrderForm))" v-on:handleSearch="getGroupOrderData"></file-upload>
        <order-flow v-model="orderFlowShow" :order-id="radioValue" modalTitle="查看审批信息" :current="groupOrderForm.auditState+1"></order-flow>

        <!--批量导入(可以直接选分组以及问诊信息)-->
        <excel-upload-template-inquiry  v-model="isExcelUploadInquiryShow" :modalTitle="title" :physical-type="physicalType" :orderId="groupOrderForm.id"
                                v-on:handleSearch="getGroupOrderData"></excel-upload-template-inquiry>

        <!--批量导入(可以直接选分组)-->
        <excel-upload-template  v-model="isExcelUploadNew" :modalTitle="title" :physical-type="physicalType" :orderId="groupOrderForm.id"
                                v-on:handleSearch="getGroupOrderData"></excel-upload-template>
        <!--批量导入-->
        <excel-upload v-model="isExcelUpload" :modalTitle="title" :physical-type="physicalType" :orderId="groupOrderForm.id"
                      v-on:handleSearch="getGroupOrderData"></excel-upload>

        <contract-preview v-model="showOrderContract" :groupOrderInfo="JSON.parse(JSON.stringify(groupOrderForm))" :url="groupOrderForm.orderPath"></contract-preview>
        <!--委托协议预览-->
        <previewTemplate v-model="showOrderPreview"
                         :groupOrderInfo="JSON.parse(JSON.stringify(groupOrderForm))"></previewTemplate>

        <!--未登记人员导出-->
        <no-person-export-upload v-model="isNoPersonExportUpload" :modalTitle="titleNoPersonExport" :physical-type="physicalType" :orderId="groupOrderForm.id"
                      v-on:handleSearch="handleSearchNoPersonExport"></no-person-export-upload>
    </Row>
</template>
<script>
    import {getAllUserData, getDictDataByType} from "../../../api";
    import {queryAllTGroupUnitList} from "../../../api/healthy/tGroupUnit";
    import {
        addTGroupOrder,
        updateTGroupOrder,
        deleteTGroupOrder,
        queryTGroupOrderList,
        updatePayStatus, getTGroupOrder,
        updateTGroupOrderInfo
    } from "../../../api/healthy/tGroupOrder";
    import {formartDate,getMonthString,getDataString} from "../../../api/tools/tool";
    import ChooseUser from "../../sys/user-manage/chooseUser";
    import {addTOrderFlow, queryAllTOrderFlowList} from "../../../api/healthy/tOrderFlow";
    import util from "../../../libs/util";
    import GroupEdit from "./groupEdit";
    import ChooseCombo from "./chooseCombo";
    import {getComboItemByComboId} from "@/api/healthy/tComboItem"
    import ChoosePortfolioProject from "./choosePortfolioProject";
    import {queryTOrderGroupList} from "../../../api/healthy/tOrderGroup";
    import previewTemplate from "./previewTemplate";
    import {formatDate} from "@/api/tool.js"
    import noData from "@/components/no-data"
    import fileUpload from "./fileUpload";
    import orderFlow from "./orderFlow";
    import {deleteGroupItem, queryTOrderGroupItemList} from "../../../api/healthy/tOrderGroupItem"
    import excelUpload from "./excelUpload";
    import excelUploadTemplate from "./excelUploadTemplate";
    import noPersonExportUpload from "./noPersonExportUpload";
    import {queryTGroupPersonList} from '@/api/healthy/tGroupPerson'
    import contractPreview from "../tGroupApprove/contractPreview";
    import excelUploadTemplateInquiry from "./excelUploadTemplateInquiry";
    export default {
        name: "tGroupOrderList",
        components: {ChoosePortfolioProject, ChooseCombo, GroupEdit, ChooseUser, previewTemplate, noData,fileUpload,orderFlow,excelUpload,noPersonExportUpload,contractPreview,excelUploadTemplate,excelUploadTemplateInquiry},
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
        },
        data() {
            return {
                //未登记人员导出
                isNoPersonExportUpload: false,
                titleNoPersonExport: "",

                showButton: false,//展示按钮
                disabledAuditState: false,//展示是否审批
                showOrderPreview:false,
                expand: true,
                leftSpan: 'width: 300px;',
                span: 'position: relative;width: calc(100% - 332px);',
                expandIcon: "ios-arrow-back",
                total: 0,
                count: 0,
                loading: false,
                noMoreShow: false,
                radioValue: "",
                packageTotal:0,
                groupOrderForm: {
                    orderCode: "",
                    groupUnitId: "",
                    groupUnitName: "",
                    physicalType: "",
                    salesDirector: "",
                    salesDirectorName: "",
                    signingTime: null,
                    deliveryTime: null,
                    remark: "",
                    salesParticipant: [],
                    salesParticipantName: [],
                    sporadicPhysical:"",
                    auditState:0,
                    isAuditState:0,
                    packageTotal:0,
                    tolerable:false,
                },
                groupUnitList: [],
                physicalTypeList: [],
                userList: [],
                groupOrderList: [],
                tab1: true,
                tab2: true,
                columns: this.getColumns(),
                saveLoading: false,
                saveAndAuditLoading: false,
                tableLoading: false,
                importFailures:this.$hospitalName.importFailure,
                groupOrderFormRule: {
                    groupUnitId: [
                        {required: true, message: '团检单位不能为空！', trigger: 'blur'},
                    ],
                    physicalType: [
                        {required: true, message: '体检类型不能为空！', trigger: 'blur'},
                    ],
                    salesDirector: [
                        {required: true, message: '销售负责人不能为空！', trigger: 'blur'},
                    ],
                    signingTime: [
                        {required: true, message: '签订时间不能为空！', trigger: 'blur', pattern: /.+/},
                    ],
                    deliveryTime: [
                        {required: true, message: '交付时间不能为空！', trigger: 'blur', pattern: /.+/},
                    ],
                    sporadicPhysical: [
                        {required: true, message: '请选择是否零星体检！', trigger: 'change', pattern: /.+/},
                    ],
                    isAuditState: [
                        {required: true, message: '请选择是否需要合同评审！', trigger: 'change', pattern: /.+/},
                    ],
                },
                tableData: [],
                paymentType: "",
                additionalPayment: "",
                uploadList: [],
                chooseUserData: [],
                chooseUserShow: false,
                isMultiple: false,
                auditPersonData: [],
                showPersonData: [],
                flowData: [],
                editGroupShow: false,
                groupData: [],
                chooseGroupData: [],
                chooseComboData: [],
                chooseComboShow: false,
                choosePortfolioProjectShow: false,
                choosePortfolioProjectData: [],
                tabValue: 0 + '',
                searchForm: {
                    payStatus: 0,
                    searchKey: "",
                    pageSize: 10,
                    pageNumber: 1,
                    startDate: '',
                    endDate: '',
                    physicalType: "职业体检"
                },
                datePickerShow: false,
                radioDateValue: "",
                comboIdList: [],
                isShow: true,
                subtotal: 0,//分组小计
                previewShow: false, //模板查看
                delLoading:false,
                groupDataList:[],
                tabId:'',
                queryTime:this.$hospitalName.queryTimeChange,
                typeList:[
                    {
                        id:0,
                        type:'否'
                    },
                    {
                        id:1,
                        type:'是'
                    }
                ],
                uploadShow:false,//委托协议上传
                orderFlowShow:false,//审批流程查看
                isExcelUpload: false,
				isExcelUploadNew: false,
                title:"",
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
                showOrderContract:false,//上传的合同预览
				isAddSelectionGrouping:false,//导入模板是否添加选择分组
				isExcelUploadInquiryShow:false,//导入模板是否添加选择分组以及问诊子端
            }
        },
        methods: {
            //批量上传
            handleUpload() {
                this.title = "人员批量导入";
				this.isExcelUpload = false;
				this.isExcelUploadNew = false;
				if (this.$hospitalName.isAddSelectionGroupingInquiry){
					if(this.groupData &&this.groupData.length>0 ){
						this.isExcelUploadInquiryShow= true;
					}
					else{
						this.$Message.error("请先添加分组!!!!");
					}
				}
				else if (!this.$hospitalName.isAddSelectionGrouping){
					this.isExcelUpload = true;
				}else {
					if(this.groupData &&this.groupData.length>0 ){
						this.isExcelUploadNew = true;
                    }
					else{
						this.$Message.error("请先添加分组!!!!");
                    }

				}
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
            saleManChange(v) {
                if (v) {
                    this.groupOrderForm.salesDirector = v.value;
                    this.groupOrderForm.salesDirectorName = v.label;
                }
            },
            sporadicChange(v){
                if (v) {
                    this.groupOrderForm.sporadicPhysical = v.value;
                    if(this.groupOrderForm.sporadicPhysical == 1){
                        this.showButton = false;
                        this.disabledAuditState = true;
                    }else{
                        this.showButton = true;
                        this.disabledAuditState = false;
                    }
                    if(this.groupOrderForm.sporadicPhysical == 1){
                        this.groupOrderForm.isAuditState = 0;
                    }else{
                        this.groupOrderForm.isAuditState = 1;
                    }
                }
            },
            auditStateChange(v){
                if(this.groupOrderForm.isAuditState == 0){
                    this.showButton = false;
                }else{
                    this.showButton = true;
                }
            },
            joinManChange(v) {
                this.groupOrderForm.salesParticipant = v;
                if (this.groupOrderForm.salesParticipant.length > 0) {
                    let salesParticipantName = [];
                    this.groupOrderForm.salesParticipant.forEach(i => {
                        this.userList.forEach(user => {
                            if (i == user.id) {
                                salesParticipantName.push(user.username);
                            }
                        })
                    })
                    this.groupOrderForm.salesParticipantName = salesParticipantName;
                }
            },

            radioChange(e) {
                if (e == '自定义') {
                    this.datePickerShow = true;
                } else if (e == '当日') {
                    this.searchForm.startDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    this.searchForm.endDate = null;
                    this.search();
                } else if (e == '当月') {
                    this.searchForm.endDate = formatDate(new Date(), 'yyyy-MM-dd  HH:mm:ss');
                    this.searchForm.startDate = null;
                    this.search();
                }
            },
            getFirstAndLastData() {
                let date = new Date();
                date.setDate(1);
                let currentMonth = parseInt(date.getMonth() + 1);
                let month = currentMonth;
                let day = date.getDate();
                if (month < 10) {
                    month = '0' + month
                }
                if (day < 10) {
                    day = '0' + day
                }
                let start = date.getFullYear() + '-' + month + '-' + day;
                let nextMonth = currentMonth == 12 ? 1 : currentMonth + 1;
                if (nextMonth < 10) {
                    nextMonth = '0' + nextMonth
                }
                let end = date.getFullYear() + '-' + nextMonth + '-' + day;
                return {
                    start: start, end: end
                }
            },
            getDay(day) {
                var today = new Date();
                var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
                today.setTime(targetday_milliseconds); //注意，这行是关键代码
                var tYear = today.getFullYear();
                var tMonth = today.getMonth();
                var tDate = today.getDate();
                tMonth = this.doHandleMonth(tMonth + 1);
                tDate = this.doHandleMonth(tDate);
                return tYear + "-" + tMonth + "-" + tDate;
            },
            doHandleMonth(month) {
                var m = month;
                if (month.toString().length == 1) {
                    m = "0" + month;
                }
                return m;
            },
            resetClick() {
                this.searchForm.searchKey = null;
                this.searchForm.pageNumber = 1;
                this.searchForm.pageNumber = 1;
                this.searchForm.isCheck = "0";
                this.searchForm.personName = "";
                this.searchForm.testNum = "";
                this.searchForm.dept = "";
                this.isCheck = 0;
                let _this = this;
                setTimeout(function () {
                    _this.radioDateValue = "当日";
                    if (!_this.$hospitalName.queryTimeChange){
                        let date  = getMonthString(new Date());
                        if(date!=null && date.length == 2){
                            _this.searchForm.startDate = date[0]+ " 00:00:00";
                            _this.searchForm.endDate = date[1]+ " 23:59:59";
                            _this.getGroupOrderData();
                        }
                    }
                    else{
                        _this.searchForm.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                        _this.searchForm.endDate = null;
                        _this.getGroupOrderData();
                    }

                },100);
            },

            datePickerChange(e) {
                this.searchForm.startDate = e[0];
                var dateTime = new Date(e[1]);
                dateTime = dateTime.setDate(dateTime.getDate() + 1);
                this.searchForm.endDate = new Date(dateTime);
                this.search();
            },

            //人员日期查询
            datePickerEndTime(e){
                if (e) {
                    let endTime = new Date(e);
                    endTime.setHours(23, 59, 59, 999);
                    endTime = endTime.setDate(endTime.getDate());
                    this.searchForm.endDate = formatDate(new Date(endTime), 'yyyy-MM-dd HH:mm:ss');
                }
                this.search();
            },

            //人员日期查询
            datePickerStartTime(e) {
                if (e){
                    let searctTime = new Date(e);
                    searctTime.setHours(0, 0, 0, 0);
                    searctTime = searctTime.setDate(searctTime.getDate());
                    this.searchForm.startDate = formatDate(new Date(searctTime), 'yyyy-MM-dd HH:mm:ss');

                }
                this.search();
            },
            //下拉加载更多
            personChangePageNum(v) {
                this.searchForm.pageNumber = v;
                this.getGroupOrderData();
            },
            groupUnitChange(e) {
                if (e) {
                    this.groupOrderForm.groupUnitName = e.label;
                }
            },
            uploadClick() {
                this.$refs['upload'].dispatchEvent(new MouseEvent('click'));
            },
            //图片上传
            inputChange(e) {
                const inputFile = this.$refs['upload'].files[0];
                let fileSize = inputFile.size;
                var size = fileSize / 2048;
                if (size > 2048) {
                    this.$Message.error('图片大小不能超过2M！');
                    return;
                }
                if (size <= 0) {
                    this.$Message.error('图片大小不能为0M！');
                    return;
                }
                let fileType = inputFile.type.toString().substring(inputFile.type.toString().lastIndexOf('/') + 1, inputFile.type.toString().length);
                if (fileType) {
                    if (fileType.toLowerCase() != 'jpg' && fileType.toLowerCase() != 'jpeg' && fileType.toLowerCase() != 'png') {
                        this.$Message.error('附件格式不正确，请选择图片格式！');
                        this.$refs['upload'].value = null;
                        return;
                    }
                }
                let reader = new FileReader();
                reader.readAsDataURL(inputFile);
                reader.onload = () => {
                    this.uploadList.push(reader.result);
                }
                this.$refs['upload'].value = null;
            },
            handleView(v) {
                //获取viewer实例
                const viewer = this.$el.querySelector('.images').$viewer
                //调用show方法进行显示预览图
                viewer.index = v;
                viewer.show()
            },
            handleRemove(file) {
                this.uploadList.splice(this.uploadList.indexOf(file), 1);
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件格式不正确，请选择jpg或png'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超过文件大小限制',
                    desc: '文件大小不能超过2M'
                });
            },
            handleBeforeUpload() {
                if (this.uploadList.length > 5) {
                    this.$Notice.warning({
                        title: '最多可上传5张图片'
                    });
                }
                return false;
            },
            //格式化时间
            formatTime(e) {
                return formartDate(e, "yyyy-MM-dd");
            },
            //点击文字选中
            radioChooseClick(item) {
                this.initForm();
                this.radioValue = item.id;
                this.groupOrderForm = JSON.parse(JSON.stringify(item));
                if (this.groupOrderForm.salesParticipant) {
                    this.groupOrderForm.salesParticipant = this.groupOrderForm.salesParticipant.toString().split(',');
                }
                if (this.groupOrderForm.salesParticipantName) {
                    this.groupOrderForm.salesParticipantName = this.groupOrderForm.salesParticipantName.split(",");
                }
                this.groupOrderForm.auditState = item.auditState;

                // if (this.groupOrderForm.payStatus == 1) {
                //     this.columns = this.columns.filter(item => item.key != 'action');
                // }
                if(this.groupOrderForm.auditState == -1){
                    this.groupOrderForm.isAuditState = 0;
                }
                else {
                    this.groupOrderForm.isAuditState = 1;
                }
                this.tabValue = 0 + '';
                this.getFlowData();

                this.groupData = [];
                this.groupDataList =[];
                this.getOrderGroupData();
            },
            handleTabRemove(targetName) {
                if (this.groupData.length == 1) {
                    this.$Message.error("请至少保留一个分组信息！");
                    return;
                }
                let currentIndex = Number(this.tabValue);
                targetName = Number(targetName);
                if (currentIndex < targetName) {
                    this.tabValue = currentIndex + '';
                } else if (currentIndex == targetName) {
                    if (this.groupData.length > currentIndex + 1) {
                        this.tabValue = currentIndex + '';
                    } else if (this.groupData.length <= currentIndex + 1) {
                        this.tabValue = (currentIndex - 1) + '';
                    }
                } else if (currentIndex > targetName) {
                    this.tabValue = (currentIndex - 1) + '';
                }
                this.groupData.splice(targetName, 1);
            },
            handleTabClick(item) {
                this.comboIdList = [];
                this.groupPersonData = [];
                this.groupPersonTotal = 0;
                let id = this.groupData[item.name].id;
                if (id && id.length > 0) {
                    this.groupPersonSearchForm.orderId = this.groupData[item.name].groupOrderId;
                    this.groupPersonSearchForm.groupId = id;
                    //根据套餐信息查询对应的项目信息
                    //this.getTComboItemData(comboIds);
                    queryTOrderGroupItemList({groupId:id}).then(res => {
                        if (res.success) {
                            this.groupData[this.tabValue].projectData = res.data;
                            this.sumTotal();
                            this. groupPersonSearchForm.pageNumber = 1;
                            this.getPersonDataList();
                        }
                    })
                }
                this.tabId = this.groupData[item.name].id;
            },
            search() {
                this.searchForm.pageNumber = 1;
                this.getGroupOrderData();
            },
            getGroupOrderData() {
                this.groupOrderList = [];
                this.loading = true;
                this.searchForm.physicalType = this.physicalType;
                let serchFormNew = JSON.parse(JSON.stringify(this.searchForm));
                if (this.$hospitalName.queryTimeChange){
                    //输入了就不带时间
                    if(this.searchForm.searchKey && this.searchForm.searchKey.trim().length>0 ){
                        this.searchForm.startDate = null;
                        this.searchForm.endDate = null;
                        this.radioDateValue = '';//取消时间筛选
                    }
                }
                else{
					if(this.searchForm.startDate ){
						serchFormNew.startDate = formatDate(this.searchForm.startDate, 'yyyy-MM-dd HH:mm:ss');
					}
					if(this.searchForm.endDate ){
						serchFormNew.endDate = formatDate(this.searchForm.endDate , 'yyyy-MM-dd HH:mm:ss');
						serchFormNew.endDate = serchFormNew.endDate.replace(" 00:00:00"," 23:59:59");
					}
                    if(this.searchForm.startDate!=null){
                        let startDateN = formatDate(new Date(this.searchForm.startDate), 'yyyy-MM-dd');
                        serchFormNew.startDate = startDateN + " 00:00:00"
                    }
                    if(this.searchForm.endDate!=null){
                        let endDateN = formatDate(new Date(this.searchForm.endDate), 'yyyy-MM-dd');
                        serchFormNew.endDate = endDateN + " 23:59:59";
                    }
                    if(serchFormNew.startDate == null||serchFormNew.startDate .trim().length==0){
                        serchFormNew.startDate = "1997-01-01 00:00:00"
                    }
                    if(serchFormNew.endDate == null||serchFormNew.endDate .trim().length==0){
                        let endTime = getDataString(new Date);
                        serchFormNew.endDate = endTime + " 23:59:59"
                    }
                }
                queryTGroupOrderList(serchFormNew).then(res => {
                    if (res.success) {
                        this.groupOrderList = res.data.records;
                        this.total = res.data.total;
                        if (this.groupOrderList && this.groupOrderList.length > 0) {
                            this.radioValue = this.groupOrderList[0].id;
                            this.groupOrderForm = JSON.parse(JSON.stringify(this.groupOrderList[0]));
                            if (this.groupOrderForm.salesParticipant) {
                                this.groupOrderForm.salesParticipant = this.groupOrderForm.salesParticipant.toString().split(',');
                            }
                            if (this.groupOrderForm.salesParticipantName) {
                                this.groupOrderForm.salesParticipantName = this.groupOrderForm.salesParticipantName.split(",");
                            }
                            this.groupOrderForm.signingTime = this.formatTime(this.groupOrderForm.signingTime);
                            this.groupOrderForm.deliveryTime = this.formatTime(this.groupOrderForm.deliveryTime);

                            if(this.groupOrderForm.sporadicPhysical == 1){
                                this.showButton = false;
                                this.disabledAuditState = true;
                            }else{
                                this.showButton = true;
                                this.disabledAuditState = false;
                            }
                            if(this.groupOrderForm.sporadicPhysical == 1){
                                this.groupOrderForm.isAuditState = 0;
                            }else{
                                this.groupOrderForm.isAuditState = 1;
                            }
                            if(this.searchForm.payStatus==1){
                                this.disabledAuditState = true;
                            }else{
                                this.disabledAuditState = false;
                            }
                            if(this.groupOrderForm.auditState == -1){
                                this.groupOrderForm.isAuditState = 0;
                                this.showButton = false;
                            }
                            else {
                                this.groupOrderForm.isAuditState = 1;
                                this.showButton = true;
                            }
                            this.getFlowData();
                            this.getOrderGroupData();
                        } else {
                            this.radioValue = "";
                            this.groupOrderForm = {};
                            this.flowData = [];
                            this.groupData = [];
                            this.comboIdList = [];
                        }
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            initForm() {
                this.groupOrderForm = {
                    orderCode: "",
                    groupUnitId: "",
                    groupUnitName: "",
                    physicalType: "",
                    salesDirector: "",
                    salesDirectorName: "",
                    signingTime: null,
                    deliveryTime: null,
                    remark: "",
                    salesParticipant: [],
                    salesParticipantName: [],
                    id: null,
                    packagePrice: 0,
                    packageTotal: 0,
                    packageDiscount: 0,
                    orderPrice: 0,
                    orderTotal: 0,
                    orderDiscount: 0,
                    personCount: 0,
                    tolerable:false,
                };
                this.tabId = "";
            },
            addTGroupOrder() {
                this.groupOrderForm = {
                    payStatus: 0,
                    physicalType: this.physicalType,
                    signingTime: formartDate(new Date(), "yyyy-MM-dd"),
                    deliveryTime: formartDate(new Date(), "yyyy-MM-dd"),
                    sporadicPhysical:0,
                    isAuditState:0,
                };
                this.radioValue = "";
                //清空右侧审核信息
                this.flowData = [];
                this.showPersonData = [];
                this.auditPersonData = [];
                this.uploadList = [];
                this.comboIdList = [];
                if (this.physicalType == '职业体检') {
                    this.groupData = [

                    ]
                } else {
                    this.groupData = [
                        {
                            id: null,
                            name: '男',
                            show: true,
                            comboId: "",
                            projectData: [],
                            discount: 100,
                            addDiscount: 100,
                            personCount: 0,
                            eiaFactors: '',
                        },
                        {
                            id: null,
                            name: '女',
                            show: true,
                            comboId: "",
                            projectData: [],
                            discount: 100,
                            addDiscount: 100,
                            personCount: 0,
                            eiaFactors: '',
                        }]
                }
            },
            deleteTGroupOrder() {
                if (!this.groupOrderForm.id) {
                    this.$Message.error("请选择订单信息！");
                    return;
                }
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要删除当前选中数据?",
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        ids.push(this.groupOrderForm.id);
                        deleteTGroupOrder({ids: ids}).then(res => {
                            if (res.success) {
                                this.$Message.success('删除成功');
                                this.initForm();
                                this.getGroupOrderData();
                            }
                        }).finally(() => {
                            this.$Modal.remove();
                        });
                    },
                    onCancel: () => {

                    },
                });
            },
            saveTGroupOrder() {
                try {
                    this.$refs['groupOrderForm'].validate((valid) => {
                        if (valid) {
                            if(this.groupOrderForm.id){
                                //校验分组信息和分组人数信息
                                if (  this.groupData.length < 1) {
                                    this.$Message.error("分组信息不能为空！");
                                    return;
                                }
                                //校验分组名称
                                for (let i = 0; i < this.groupData.length; i++) {
                                    if(this.physicalType == '职业体检' || this.physicalType == '放射体检') {
                                        if (!/^.+\[.{3,5}\]$/.test(this.groupData[i].name)) {
                                            this.$Message.error("“" + this.groupData[i].name + "”分组名称格式有误！");
                                            return;
                                        }
                                    }

                                    if (this.groupData[i].projectData.length < 1) {
                                        this.$Message.error("“" + this.groupData[i].name + "”分组体检项目不能为空！");
                                        return;
                                    }
                                    if (!this.$hospitalName.importFailure){
                                        if (this.groupData[i].personCount < 1) {
                                            this.$Message.error("“" + this.groupData[i].name + "”分组体检人数不能为空！");
                                            return;
                                        }
                                    }
                                    /*if (this.groupData[i].discountPrice < 1) {
                                        this.$Message.error("“" + this.groupData[i].name + "”分组项目优惠价不能为空！");
                                        return;
                                    }*/
                                    // if (this.groupData[i].eiaFactors.length < 1 && this.physicalType == "职业体检") {
                                    //     this.$Message.error("“" + this.groupData[i].name + "”环评因素不能为空！");
                                    //     return;
                                    // }
                                }
                                if (this.$hospitalName.importFailure){
                                    for (let i = 0; i < this.groupData.length; i++){
                                        if(!this.groupData[i].personCount || (this.groupData[i].personCount && this.groupData[i].personCount==0)){
                                            this.groupData[i].personCount = this.groupPersonTotal
                                        }
                                    }
                                    this.groupOrderForm.tolerable = this.$hospitalName.importFailure;
                                }else {
                                    this.groupOrderForm.tolerable = false;
                                }
                                this.groupOrderForm.groupData = this.groupData;
                            }

                            this.saveLoading = true;

                            if (Object.prototype.toString.call(this.groupOrderForm.salesParticipant) == "[object Array]") {
                                this.groupOrderForm.salesParticipant = this.groupOrderForm.salesParticipant.join(",");
                            } else {
                                this.groupOrderForm.salesParticipant = "";
                            }
                            if (Object.prototype.toString.call(this.groupOrderForm.salesParticipantName) == "[object Array]") {
                                this.groupOrderForm.salesParticipantName = this.groupOrderForm.salesParticipantName.join(",");
                            } else {
                                this.groupOrderForm.salesParticipantName = "";
                            }
                            this.groupOrderForm.groupData = this.groupData;
                            this.groupOrderForm.signingTime = this.formatTime(this.groupOrderForm.signingTime);
                            this.groupOrderForm.deliveryTime = this.formatTime(this.groupOrderForm.deliveryTime);
                            if(this.groupOrderForm && this.groupOrderForm.sporadicPhysical == 1  && this.groupOrderForm.isAuditState != 0){//零星体检 不添加审核 0
                                this.groupOrderForm.auditState = 0;
                            }
                            else if(this.groupOrderForm && this.groupOrderForm.isAuditState == 0){//已添加订单且非零星 已添加审核 1
                                this.groupOrderForm.auditState = -1;
                            }
                            else if(this.groupOrderForm && this.groupOrderForm.id && this.groupOrderForm.id.length > 0){//已添加订单且非零星 已添加审核 1
                                this.groupOrderForm.auditState = 0;
                            }else{//为添加当前订单 默认审核状态为 0
                                this.groupOrderForm.auditState = 0;
                            }

                            if (this.groupOrderForm.id && this.groupOrderForm.id.length > 0) {
                                updateTGroupOrder(this.groupOrderForm).then(res => {
                                    if (res.success) {
                                        this.$Message.success("保存成功");
                                        this.getGroupOrderData();
                                    }
                                }).finally(() => {
                                    this.saveLoading = false;
                                });
                            } else {
                                addTGroupOrder(this.groupOrderForm).then(res => {
                                    if (res.success) {
                                        this.$Message.success("保存成功");
                                        this.getGroupOrderData();
                                    }
                                }).finally(() => {
                                    this.saveLoading = false;
                                });
                            }
                        } else {
                            this.saveLoading = false;
                            this.$Message.error('表单验证不通过！');
                        }
                    });
                } catch (e) {
                    console.error(e)
                }
            },
            //修改确认订单信息
            saveOrderInfo() {
                this.groupOrderForm.signingTime = this.formatTime(this.groupOrderForm.signingTime);
                this.groupOrderForm.deliveryTime = this.formatTime(this.groupOrderForm.deliveryTime);
                if (this.$hospitalName.importFailure){
                    for (let i = 0; i < this.groupData.length; i++){
                        if(!this.groupData[i].personCount || (this.groupData[i].personCount && this.groupData[i].personCount==0)){
                            this.groupData[i].personCount = this.groupPersonTotal
                        }
                    }
                    this.groupOrderForm.tolerable = this.$hospitalName.importFailure;
                }else {
                    this.groupOrderForm.tolerable = false;
                }
                this.groupOrderForm.groupData = this.groupData;
                if (Object.prototype.toString.call(this.groupOrderForm.salesParticipant) == "[object Array]") {
                    this.groupOrderForm.salesParticipant = this.groupOrderForm.salesParticipant.join(",");
                } else {
                    this.groupOrderForm.salesParticipant = "";
                }
                if (Object.prototype.toString.call(this.groupOrderForm.salesParticipantName) == "[object Array]") {
                    this.groupOrderForm.salesParticipantName = this.groupOrderForm.salesParticipantName.join(",");
                } else {
                    this.groupOrderForm.salesParticipantName = "";
                }
                updateTGroupOrderInfo(this.groupOrderForm).then(res => {
                    if (res.success) {
                        this.$Message.success("保存成功");
                        this.getGroupOrderData();
                    }
                }).finally(() => {
                    this.saveLoading = false;
                });
            },
            saveAndAuditTGroupOrder() {
                if (!this.groupOrderForm.id) {
                    this.$Message.error("请选择订单信息！");
                    return;
                }
                // if (this.auditPersonData.length < 1) {
                //     this.$Message.error("请选择审核人员！");
                //     return;
                // }

                let orderFlowForm = {};
                orderFlowForm.groupOrderId = this.groupOrderForm.id;
                //orderFlowForm.auditUserId = this.auditPersonData[0].id;
                //orderFlowForm.auditUserName = this.auditPersonData[0].nickname;
                // if (this.showPersonData && this.showPersonData.length > 0) {
                //     let ids = "";
                //     let names = "";
                //     for (let i = 0; i < this.showPersonData.length; i++) {
                //         ids += "," + this.showPersonData[i].id;
                //         names += "," + this.showPersonData[i].nickname;
                //     }
                //     ids = ids.substring(1);
                //     names = names.substring(1);
                //     orderFlowForm.showUserId = ids;
                //     orderFlowForm.showUserName = names;
                // }
                //orderFlowForm.documentList = this.uploadList;
                addTOrderFlow(orderFlowForm).then(res => {
                    if (res.success) {
                        this.$Message.success("提交审核成功！");
                        this.getGroupOrderData();
                    }
                });
            },
            setAuditPerson(e) {
                if (this.isMultiple) {
                    this.showPersonData = e;
                } else {
                    this.auditPersonData = e;
                }
            },
            chooseUser(e) {
                this.chooseUserShow = true;
                if (e == 1) {
                    this.chooseUserData = JSON.parse(JSON.stringify(this.auditPersonData));
                    this.isMultiple = false;
                } else {
                    this.chooseUserData = JSON.parse(JSON.stringify(this.showPersonData));
                    this.isMultiple = true;
                }
            },
            getFlowData() {
                queryAllTOrderFlowList({groupOrderId: this.groupOrderForm.id}).then(res => {
                    if (res.success) {
                        this.flowData = res.data.data;
                        this.auditPersonData = [];
                        this.showPersonData = [];
                        this.uploadList = [];
                        if (this.flowData && this.flowData.length > 0) {
                            this.auditPersonData.push({
                                id: this.flowData[0].auditUserId,
                                nickname: this.flowData[0].auditUserName
                            });
                            if (this.flowData[0].showUserId) {
                                let userIds = this.flowData[0].showUserId.split(",");
                                let userNames = this.flowData[0].showUserName.split(",");

                                for (let i = 0; i < userIds.length; i++) {
                                    this.showPersonData.push({id: userIds[i], nickName: userNames[i]})
                                }
                            }
                            for (let i = 0; i < res.data.uploadList.length; i++) {
                                this.uploadList.push(util.nginxUrl + res.data.uploadList[i].url);
                            }
                        }
                    }
                });
            },
            editGroup() {
                this.editGroupShow = true;
                this.chooseGroupData = JSON.parse(JSON.stringify(this.groupData));
            },
            setGroup(e) {
                this.groupData = JSON.parse(JSON.stringify(e));
            },
            //套餐选择
            checkCombo() {
                if(!this.tabValue|| this.tabValue.length==0 || this.groupData.length == 0 ) {
                    this.$Message.error("请先添加分组！");
                    return;
                }
                this.comboIdList = [];
                let comboIds = this.groupData[this.tabValue].comboId;
                let groupName = this.groupData[this.tabValue].name;
                if (comboIds && comboIds.length > 0 && groupName && groupName.trim().length > 0) {
                    let ids = comboIds.split(",");
                    let groupNameSplit = groupName.split("[");
                    let hazardFactorsTexts = groupNameSplit && groupNameSplit[0] ? groupNameSplit[0].split("、") : [];
                    let careerStage = groupNameSplit && groupNameSplit[1] ? groupNameSplit[1].replace("]","") : "";
                    for (let i = 0; i < ids.length; i++) {
                        this.comboIdList.push({
                            id: ids[i],
                            hazardFactorsText: hazardFactorsTexts && hazardFactorsTexts[i] ? hazardFactorsTexts[i] : "",
                            name: hazardFactorsTexts && hazardFactorsTexts[i] && careerStage ? hazardFactorsTexts[i]+"-"+careerStage : "",
                            careerStage: careerStage,
                        })
                    }
                }
                this.chooseComboShow = true;
            },
            setComboData(e) {
                this.comboIdList = JSON.parse(JSON.stringify(e));
                if (this.comboIdList.length > 0) {
                    let comIds = "";
                    let name = "";
                    let careerStage = "";
                    let comboName = "";
                    this.comboIdList.forEach(item => {
                        comIds += "," + item.id;
                        name += "、" + item.hazardFactorsText;
                        careerStage = "[" + item.careerStage + "]";
                        comboName += "、" + item.name;
                    })
                    comIds = comIds.substring(1);
                    name = name.substring(1);
                    comboName = comboName.substring(1);
                    this.groupData[this.tabValue].comboId = comIds;
                    if (this.physicalType == "职业体检" || this.physicalType == "放射体检") {
                        this.groupData[this.tabValue].name = name + careerStage;
                    } else {
                        //this.groupData[this.tabValue].name = comboName;
                    }
                    if (comIds && comIds.length > 0) {
                        //根据套餐信息查询对应的项目信息
                        this.getTComboItemData(comIds);
                    }
                } else {
                    this.groupData[this.tabValue].projectData = [];
                    this.groupData[this.tabValue].name = "危害因素一";
                }
            },
            deleteData(row, index) {
                this.delLoading = true;
                let list = this.groupDataList[this.tabValue].projectData;
                if(this.groupOrderForm.payStatus == 1){
                    let flag = false;
                    for (let i = 0; i < list.length; i++) {
                        if(row.id == list[i].id){
                            flag = true;
                        }
                    }
                    if(flag){
                        deleteGroupItem({id:row.id}).then(res =>{
                            if(res.data){
                                this.$Message.success('删除成功');
                                if(res.data.itemStatus == 1){
                                    this.getGroupOrderData();
                                }
                            }
                        }).finally(() => {
                            this.delLoading = false;
                            this.groupData[this.tabValue].projectData.splice(index, 1);
                        })
                    }else{
                        this.delLoading = false;
                        this.groupData[this.tabValue].projectData.splice(index, 1);
                    }
                }else{
                    this.$Modal.confirm({
                        title: '确认删除',
                        content: '您确认要删除该分组下的"' + row.name + '"项目?',
                        loading: true,
                        onOk: () => {
                            //删除当前列表
                            this.groupData[this.tabValue].projectData.splice(index, 1);
                            this.sumTotal();
                            this.$Modal.remove();
                            this.delLoading = false;
                        },
                        onCancel: () => {
                            this.$Message.info('取消了当前的操作行为！');
                            this.delLoading = false;
                        }
                    });
                }
            },
            getTComboItemData(id) {
                this.tableLoading = true;
                //加载套餐项
                getComboItemByComboId({comboId: id}).then(res => {
                    if (res.success) {
                        this.groupData[this.tabValue].projectData = res.data;
                        this.sumTotal();
                    }
                }).finally(() => {
                    this.tableLoading = false;
                })
            },
            addTPortfolioProject() {
                this.choosePortfolioProjectShow = true;
                this.choosePortfolioProjectData = JSON.parse(JSON.stringify(this.groupData[this.tabValue].projectData));
                this.choosePortfolioProjectData.forEach(item => {
                    item.id = item.portfolioProjectId
                })
            },
            setTableData(e) {
                let groupItem = this.groupData[this.tabValue].projectData;
                let arr = [];
                if(this.groupOrderForm.payStatus == 1 && groupItem.length > 0){
                    arr = this.groupData[this.tabValue].projectData;
                    e.forEach(item => {
                        let flag = true;
                        for (let i = 0; i < groupItem.length; i++) {
                            if(item.name == groupItem[i].name){
                                flag = false;
                            }
                        }
                        if(flag){
                            item.discount = 100;
                            item.portfolioProjectId = item.id;
                            //销售价
                            let salePrice = item.salePrice;
                            salePrice = Number(salePrice);
                            if (salePrice == NaN) {
                                salePrice = 0;
                            }
                            //折扣价
                            item.discountPrice = (salePrice * 100 / 100).toFixed(2);
                            arr.push(item);
                        }
                    })
                }else{
                    e.forEach(item => {
                        item.discount = 100;
                        item.portfolioProjectId = item.id;
                        //销售价
                        let salePrice = item.salePrice;
                        salePrice = Number(salePrice);
                        if (salePrice == NaN) {
                            salePrice = 0;
                        }
                        //折扣价
                        item.discountPrice = (salePrice * 100 / 100).toFixed(2);
                    })
                    arr = e;
                }
                this.groupData[this.tabValue].projectData = JSON.parse(JSON.stringify(arr));
                this.sumTotal();
            },
            //点击左侧获取分组信息和分组项目信息
            getOrderGroupData() {
                this.groupData = [];
                this.groupDataList =[];
                this.groupPersonData = [];
                this.groupPersonTotal = 0;
                queryTOrderGroupList({groupOrderId: this.groupOrderForm.id}).then(res => {
                    if (res.success) {
                        if (res.data && res.data.length > 0) {
                            this.groupData = JSON.parse(JSON.stringify(res.data));
                            this.groupDataList = res.data;
                            let strings = this.groupData[0].comboId.split(",");
                            for (let i = 0; i < strings.length; i++) {
                                this.comboIdList.push({id: strings[i]});
                            }
                            this.tabId = res.data[0].id;
                            this.groupPersonSearchForm.orderId = this.groupData[0].groupOrderId;
                            this.groupPersonSearchForm.groupId = this.groupData[0].id;
                            this. groupPersonSearchForm.pageNumber = 1;
                            this.getPersonDataList();
                        } else {
                            // this.groupData = [
                            //     {
                            //         id: null,
                            //         name: '危害因素一',
                            //         show: true,
                            //         comboId: "",
                            //         projectData: [],
                            //         discount: 100,
                            //         addDiscount: 100,
                            //         personCount: 0,
                            //         eiaFactors: '',
                            //     }
                            // ];
                            this.comboIdList = [];
                        }
                        this.sumTotal();
                        this.$forceUpdate()
                    }
                });
            },
            //团单折扣变化后更新项目折扣
            onDiscountChange(e) {
                //折扣
                let v = Number(e);
                if (v == NaN) {
                    v = 0;
                }
                this.groupData[this.tabValue].projectData.forEach(item => {
                    if (item.projectType == 1) {
                        item.discount = e;
                        let salePrice = Number(item.salePrice);
                        if (salePrice == NaN) {
                            salePrice = 0;
                        }
                        item.discountPrice = (salePrice * v / 100).toFixed(2);
                    }
                })
                let num = 0;
                for (let i = 0; i < this.groupData.length; i++) {
                    for (let j = 0; j < this.groupData[i].projectData.length; j++) {
                        let data = this.groupData[i].projectData[j];
                        if (data.projectType == 1) {
                            num = this.numAdd(Number(data.discountPrice), num, 1);
                        }
                }
                    this.groupData[this.tabValue].discountPrice = num,
                this.sumTotal();
            }
                },

            //团单优惠价变化后更新项目折扣
            onDiscountChanges(e){
                //折扣
                let v = Number(e);
                if (v == NaN) {
                    v = 0;
                }
                let subtotal = 0;
                //let data = this.groupData[this.tabValue].projectData[j];
                for (let j = 0; j < this.groupData[this.tabValue].projectData.length; j++) {
                    let data = this.groupData[this.tabValue].projectData[j];
                    subtotal = this.numAdd(Number(data.discountPrice), subtotal, 1);
                }

                this.subtotal = this.accMul(Number(this.groupData[this.tabValue].discountPrice), Number(this.groupData[this.tabValue].personCount));
                this.sumTotal();
            },
            //增项折扣
            onAddDiscountChange(e) {
                //折扣
                let v = Number(e);
                if (v == NaN) {
                    v = 0;
                }
                this.groupData[this.tabValue].projectData.forEach(item => {
                    if (item.projectType == 2) {
                        item.discount = e;
                        let salePrice = Number(item.salePrice);
                        if (salePrice == NaN) {
                            salePrice = 0;
                        }
                        item.discountPrice = (salePrice * v / 100).toFixed(2);
                    }
                })
                this.sumTotal();
            },
            //分组人数 修改时触发
            onPersonCountChange(e) {
                this.sumTotal();
            },
            //修改订单状态
            paymentConfirm() {
                if (!this.groupOrderForm.id) {
                    this.$Message.error("请选择订单信息！");
                    return;
                }

                let _this = this;
                this.$refs['groupOrderForm'].validate((valid) => {
                    if (valid) {
                        if(_this.groupOrderForm.id){
                            //校验分组信息和分组人数信息
                            if (  _this.groupData.length < 1) {
                                _this.$Message.error("分组信息不能为空！");
                                return;
                            }
                            //校验分组名称
                            for (let i = 0; i < _this.groupData.length; i++) {
                                if(_this.physicalType == '职业体检' || _this.physicalType == '放射体检') {
                                    if (!/^.+\[.{3,5}\]$/.test(_this.groupData[i].name)) {
                                        this.$Message.error("“" + _this.groupData[i].name + "”分组名称格式有误！");
                                        return;
                                    }
                                }

                                if (_this.groupData[i].projectData.length < 1) {
                                    _this.$Message.error("“" + _this.groupData[i].name + "”分组体检项目不能为空！");
                                    return;
                                }
                                if (!this.$hospitalName.importFailure){
                                if (_this.groupData[i].personCount < 1) {
                                    _this.$Message.error("“" + _this.groupData[i].name + "”分组体检人数不能为空！");
                                    return;
                                }
                                }
                                /*if (_this.groupData[i].personCount < 1) {
                                    _this.$Message.error("“" + _this.groupData[i].name + "”分组项目优惠价不能为空！");
                                    return;
                                }*/
                            }
                            _this.groupOrderForm.groupData = this.groupData;
                        }

                        _this.saveLoading = true;

                        if (Object.prototype.toString.call(_this.groupOrderForm.salesParticipant) == "[object Array]") {
                            _this.groupOrderForm.salesParticipant = _this.groupOrderForm.salesParticipant.join(",");
                        } else {
                            _this.groupOrderForm.salesParticipant = "";
                        }
                        if (Object.prototype.toString.call(_this.groupOrderForm.salesParticipantName) == "[object Array]") {
                            _this.groupOrderForm.salesParticipantName = _this.groupOrderForm.salesParticipantName.join(",");
                        } else {
                            _this.groupOrderForm.salesParticipantName = "";
                        }
                        _this.groupOrderForm.groupData = _this.groupData;
                        _this.groupOrderForm.signingTime = _this.formatTime(this.groupOrderForm.signingTime);
                        _this.groupOrderForm.deliveryTime = _this.formatTime(this.groupOrderForm.deliveryTime);

                        if(_this.groupOrderForm && _this.groupOrderForm.sporadicPhysical == 1  && _this.groupOrderForm.isAuditState != 0){//零星体检 不添加审核 0
                            _this.groupOrderForm.auditState = 0;
                        }
                        else if(_this.groupOrderForm && _this.groupOrderForm.isAuditState == 0){//已添加订单且非零星 已添加审核 1
                            _this.groupOrderForm.auditState = -1;
                        }
                        else if(_this.groupOrderForm && _this.groupOrderForm.id && _this.groupOrderForm.id.length > 0){//已添加订单且非零星 已添加审核 1
                            _this.groupOrderForm.auditState = 1;
                        }else{//为添加当前订单 默认审核状态为 0
                            _this.groupOrderForm.auditState = 0;
                        }
                        _this.groupOrderForm.payStatus = 1;

                        if (_this.groupOrderForm.id && _this.groupOrderForm.id.length > 0) {
                            updatePayStatus({id:_this.groupOrderForm.id} ).then(res => {
                                if (res && res.success) {
                                    //不是零星体检才走审批流程,并且选择了需要合同评审
                                    if(_this.groupOrderForm && _this.groupOrderForm.sporadicPhysical == 0 && _this.groupOrderForm.auditState!=-1){
                                        _this.saveAndAuditTGroupOrder();
                                    }
                                    _this.$Message.success("保存成功");
                                    _this.getGroupOrderData();
                                }
                            }).finally(() => {
                                this.saveLoading = false;
                            });
                        }
                    } else {
                        _this.saveLoading = false;
                        _this.$Message.error('表单验证不通过！');
                    }
                });

            },
            //统计下方订单和套餐信息
            sumTotal() {
                if(!this.groupData ||this.groupData.length==0){
                    return;
                }
                let num1 = 0, num2 = 0, num3 = 0, num4 = 0, personCount = 0, orderTotal = 0;
                for (let i = 0; i < this.groupData.length; i++) {
                    let groupPrice = 0;
                    /*for (let j = 0; j < this.groupData[i].projectData.length; j++) {
                        let data = this.groupData[i].projectData[j];
                        if (data.projectType == 1) {
                            //套餐原价
                            num1 = this.numAdd(Number(data.salePrice), num1, 1);
                            //套餐合计
                            num2 = this.numAdd(Number(data.discountPrice), num2, 1);
                        }
                        //订单原价
                        num3 = this.numAdd(Number(data.salePrice), num3, 1);
                        //订单合计
                        num4 = this.numAdd(Number(data.discountPrice), num4, 1);

                        groupPrice = this.numAdd(Number(data.discountPrice), groupPrice, 1);

                    }*/
                    groupPrice = Number(this.groupData[i].discountPrice);
                    //订单人数
                    personCount += Number(this.groupData[i].personCount);
                    personCount += Number();
                    orderTotal += Number(groupPrice * this.groupData[i].personCount);

                    //优惠价 默认值

                    if(!this.groupData[i].discountPrice){
                        this.groupData[i].discountPrice = groupPrice ? groupPrice : 0;
                        // this.groupData[i].discountPrice = 0;
                    }
                }
                this.groupOrderForm.packagePrice = num1;
                //this.groupOrderForm.packageTotal = num2;
                this.groupOrderForm.orderPrice = num3;
                this.groupOrderForm.orderTotal = Number(orderTotal.toFixed(2));
                this.groupOrderForm.personCount = personCount;
                //套餐折扣
                this.groupOrderForm.packageDiscount = this.numAdd(num1, num2, 2);
                //订单折扣
                this.groupOrderForm.orderDiscount = this.numAdd(num3, num4, 2);

                //分组小计
                /*let subtotal = 0;
                for (let j = 0; j < this.groupData[this.tabValue].projectData.length; j++) {
                    let data = this.groupData[this.tabValue].projectData[j];
                    subtotal = this.numAdd(Number(data.discountPrice), subtotal, 1);
                }*/
                this.subtotal = this.accMul(Number(this.groupData[this.tabValue].discountPrice), Number(this.groupData[this.tabValue].personCount));
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

                        if (key == 'salePrice'||key == 'discountPrice') {
                            sums[key] = {
                                key,
                                value: v + ' 元'
                            };
                        }else {
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
            getColumns() {
                let cols = [
                    {
                        type: 'index',
                        width: 70,
                        align: 'center',
                    },
                    {
                        title: '项目名称',
                        align: 'left',
                        minWidth: 150,
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
                        sortable: false,
                        /*										render: (h, params) => {
                                                return h('div', [
                                                    h('InputNumber', {
                                                        props: {
                                                            placeholder: '请输入',
                                                            value: params.row.salePrice,
                                                            readonly: this.groupOrderForm.payStatus == 1 ? true : false
                                                        },
                                                        on: {
                                                            input: (val) => {
                                                                let v = Number(val);
                                                                if (v == NaN) {
                                                                    v = 0;
                                                                }
                                                                this.groupData[this.tabValue].projectData[params.index].salePrice = v;
                                                                let discount = this.groupData[this.tabValue].projectData[params.index].discount;
                                                                discount = Number(discount);
                                                                if (discount == NaN) {
                                                                    discount = 100;
                                                                }
                                                                //折扣价
                                                                this.groupData[this.tabValue].projectData[params.index].discountPrice = (v * discount / 100).toFixed(2);
                                                                this.sumTotal();
                                                            }
                                                        },
                                                    })
                                                ]);
                                            }*/
                    },
                    {
                        title: '折扣',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'discount',
                        sortable: false,
                        /*	render: (h, params) => {
                              return h('div', [
                                  h('InputNumber', {
                                      props: {
                                          placeholder: '请输入',
                                          value: params.row.discount ? params.row.discount : 100,
                                          readonly: this.groupOrderForm.payStatus == 1 ? true : false,
                                          step: 1,
                                          min: 0,
                                          max: 100,
                                      },
                                      on: {
                                          input: (val) => {
                                              //折扣
                                              let v = Number(val);
                                              if (v == NaN) {
                                                  v = 0;
                                              }
                                              this.groupData[this.tabValue].projectData[params.index].discount = v;
                                              //销售价
                                              let salePrice = params.row.salePrice;
                                              salePrice = Number(salePrice);
                                              if (salePrice == NaN) {
                                                  salePrice = 0;
                                              }
                                              //折扣价
                                              this.groupData[this.tabValue].projectData[params.index].discountPrice = (salePrice * v / 100).toFixed(2);
                                              this.sumTotal();
                                          }
                                      },
                                  })
                              ]);
                          }*/
                    },
                    {
                        title: '折扣价',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'discountPrice',
                        sortable: false,
                        // render: (h, params) => {
                        //     return h('div', [
                        //         h('Input', {
                        //             props: {
                        //                 placeholder: '',
                        //                 value: params.row.discountPrice ? Number(params.row.discountPrice).toFixed(2) : '0.00',
                        //                 disabled: true
                        //             },
                        //             on: {
                        //                 input: (val) => {
                        //                     this.groupData[this.tabValue].projectData[params.index].discountPrice = val;
                        //                 }
                        //             }
                        //         })
                        //     ]);
                        // }
                    }, {
                        title: '项目类型',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'type',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.projectType == 1) {
                                return h('span', "必检项目");
                            } else {
                                return h('span', "选检项目");
                            }
                        }
                    }, {
                        key: "action",
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 100,
                    }
                ];
                return cols;
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
            getPersonDataList(groupId) {
                this.groupPersonData = [];
                this.groupPersonTotal = 0;

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
            //导出未登记人员信息
            handleNoPersonExport(){
                this.isNoPersonExportUpload = true;
                this.titleNoPersonExport = "未登记人员导出";
            },
            //导出已登记人员信息
            handleFinishPersonExport(){
                this.isNoPersonExportUpload = true;
                this.titleNoPersonExport = "已登记人员导出";
            },
            //导出已登记未体检完人员信息
            handleFinishNoSDPersonExport(){
                this.isNoPersonExportUpload = true;
                this.titleNoPersonExport = "已登记未体检完人员导出";
            },
            //回调
            handleSearchNoPersonExport(){
                this.isNoPersonExportUpload = false;
                // this.search();//更新页面数据
            }
        },
        watch: {
            // 'groupOrderForm.payStatus'(val) {
            //     if (val && val == 1) {
            //         this.columns = this.columns.filter(i => i.key != 'action');
            //     } else {
            //         this.columns = this.getColumns();
            //     }
            // }
        },
        mounted() {
            this.radioDateValue = "当日";

            //this.radioChange("当日");
            if (!this.$hospitalName.queryTimeChange){
                let date  = getMonthString(new Date());
                if(date!=null && date.length == 2){
                    this.searchForm.startDate = date[0]+ " 00:00:00";
                    this.searchForm.endDate = date[1]+ " 23:59:59";
                    this.search();
                }
            }else {
                this.radioChange("当日");
            }


            getDictDataByType("checkType").then(res => {
                if (res.success) {
                    this.physicalTypeList = res.data;
                }
            });
            getAllUserData({}).then(res => {
                if (res.success) {
                    this.userList = res.data;
                }
            });
            queryAllTGroupUnitList({physicalType : this.physicalType}).then(res => {
                if (res.success) {
                    this.groupUnitList = res.data;
                }
            });
        }
    }
</script>

<style lang="less">
    html, body {
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        overflow: hidden;
    }
    .groupOrder {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;

        .plusDiv {
            width: 50px;
            height: 50px;
            text-align: center;
            cursor: pointer;
            background: rgb(246, 246, 246);
            border-width: 1px;
            border-style: dashed;
            border-color: rgb(221, 221, 221);
            border-image: initial;
        }

        .left-item {
            justify-content: center;
            position: relative;
            height: calc(100vh - 290px);
            overflow: hidden;

            .radio-group {
                overflow: auto;
                width: 100%;
                height: 95%;
                padding-bottom: 30px;

                &::-webkit-scrollbar {
                    width: 0;
                }

                .radio-group-content {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .ivu-radio-wrapper {
                    font-size: 0;
                }

                .row-border {
                    padding-top: 15px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #ccc;
                }

                .radio-group-radio {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    [class^=label] {
                        font-size: 0;
                    }
                }
            }

            .left-content {
                display: flex;
                flex-direction: column;

                .ivu-tooltip-rel {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
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

                .bg-green {
                    background-color: #42C3AF;
                    color: #fff;
                    border-radius: 8px;
                    text-align: center;
                }

                .bg-audit {
                    background-color: #ff9900;
                    color: #fff;
                    border-radius: 8px;
                    text-align: center;
                }

                .bg-refute {
                    background-color: #ed4014;
                    color: #fff;
                    border-radius: 8px;
                    text-align: center;
                }

                .bg-deflate {
                    background-color: #2db7f5;
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

        .ivu-form-inline {
            margin-bottom: 0px !important;
        }

        .ivu-avatar-large {
            width: 50px;
            height: 50px;
            line-height: 50px;
        }

        .rightTimeLine {
            margin-top: 16px;
            max-height: calc(100vh - 335px);
            overflow: hidden;
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 0;
            }
        }

        .resetBtn {
            position: relative;
            left: -1px;
            top: -5px;
            font-size: 13px;
            white-space: nowrap;
            border: 1px solid #DCDEE2;
            padding: 0 8px;
            height: 24px;
            line-height: 22px;
            display: inline-block;
            border-radius: 2px;

            &:hover {
                color: #83BBF7;
            }
        }


        .demo-spin-icon-load {
            animation: ani-demo-spin 1s linear infinite;
        }

        @keyframes ani-demo-spin {
            from {
                transform: rotate(0deg);
            }
            50% {
                transform: rotate(180deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .demo-spin-col {
            height: 100px;
            position: relative;
            border: 1px solid #eee;
        }

        .btngroup {
            display: flex;
            margin-bottom: 10px;

            .ivu-radio-group-item {
                padding: 0 8px !important;
                font-size: 13px !important;
                user-select: none;
            }
        }

        .ivu-alert {
            text-align: center;
            padding: 8px;
            font-weight: bold;
            height: 25px;
            line-height: 25px;
            box-sizing: content-box;
            font-size: 15px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            margin-bottom: 0 !important;
        }

        .ivu-alert-left {
            text-align: left;
            padding: 8px;
            font-weight: bold;
            height: 25px;
            line-height: 25px;
            box-sizing: content-box;
            font-size: 15px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            margin-bottom: 0 !important;
        }

        .ivu-alert-right {
            padding: 8px;
            font-weight: bold;
            height: 25px;
            line-height: 25px;
            box-sizing: content-box;
            font-size: 15px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            margin-bottom: 0 !important;

            .ivu-alert-message {
                width: 100%;
                display: flex;
                justify-content: space-between;
            }
        }


        .chooseImg {
            height: 58px;
            width: 58px;
            line-height: 58px;
            background: #fff;
            border: 1px dashed #dcdee2;
            border-radius: 4px;
            text-align: center;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: border-color .2s ease;

            &:hover {
                border: 1px dashed #2d8cf0
            }
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

        .resetBtn {
            position: relative;
            left: -1px;
            top: -5px;
            font-size: 13px;
            white-space: nowrap;
            border: 1px solid #DCDEE2;
            padding: 0 8px;
            height: 24px;
            line-height: 22px;
            display: inline-block;
            border-radius: 2px;

            &:hover {
                color: #83BBF7;
            }
        }

        .border-green {
            border: 1px solid green;
            border-radius: 8px;
            text-align: center;
            color: green;
        }

        .border-yellow {
            border: 1px solid magenta;
            border-radius: 8px;
            text-align: center;
            color: magenta;
        }

        .border-purple {
            border: 1px solid orangered;
            border-radius: 8px;
            text-align: center;
            color: orangered;
        }

        .empty {
            text-align: center;
            color: #515a6e;
            margin-top: 20px;
            width: 100%;
        }

        .ivu-col-span-1 {
            flex: 0 0 2.16666667% !important;
            max-width: 2.16666667% !important;
        }

        .ivu-col-span-4 {
            flex: 0 0 15% !important;
            max-width: 15% !important;
        }

        .ivu-col-span-23 {
            flex: 0 0 99% !important;
            max-width: 99% !important;
        }

        .expand {
            align-self: center;
            cursor: pointer;
        }
    }
</style>
