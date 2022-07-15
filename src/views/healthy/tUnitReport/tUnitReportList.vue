<template>
    <Row style="height: 100%;padding: 10px;" class="unitReport">
        <Col v-if="expand" :style="leftSpan">
            <Card style="overflow:hidden;height: calc(100vh - 79px);">
                <Alert class="ivu-alert">单位报告</Alert>
                <div style="display: flex;">
                    <RadioGroup type="button" size="small" class="btngroup" style="margin-top: 10px" button-style="solid"
                                v-model="date"
                                @on-change="pick">
                        <Radio label="当日"></Radio>
                        <Radio label="当月"></Radio>
                        <DatePicker
                                :open="datePickerShow"
                                transfer
                                type="daterange"
                                @on-change="datePickerChange">
                            <div>
                                <template>
                                    <Radio label="自定义" @click.native="datePickerShow = !datePickerShow"></Radio>
                                </template>
                            </div>
                        </DatePicker>
                        <Radio label="重置" @click="resetSearchForm"></Radio>
                    </RadioGroup>
                    <Button type="primary" size="small" style="height: 24px;margin-left: 6px;margin-top: 10px;" @click="orderChooseClick">合并订单</Button>
                </div>
                <Input v-model="groupUnitForm.groupUnitName" suffix="ios-search" @on-change="search"
                       placeholder="请输入单位名称" clearable
                       style="margin-top: 10px;"/>

                <Row style="justify-content: center;height: calc(100% - 153px);">
                    <RadioGroup class="radio-group" v-model="radioValue" v-if="groupOrderList.length > 0">
                        <Row class="row-border" v-for="(item, index) in groupOrderList" :key="item.id"
                             @click.native="radioChooseClick(item)">
                            <Col :span="3" class="radio-group-radio">
                                <Radio class="label" :label="item.id"></Radio>
                            </Col>
                            <Col :span="21" class="radio-group-content">
                                <Row style="margin-bottom: 6px;">
                                    <Col :span="12" class="date">{{ item.orderCode }}</Col>
                                    <Col :span="12" class="date" style="text-align: right">{{
                                        formatTime(item.signingTime) }}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col :span="20" class="company" :title="item.groupUnitName">{{ item.groupUnitName }}</Col>
                                    <Col :span="4">
                                        <div class="border-purple" v-if="item.sporadicPhysical && item.sporadicPhysical == 1">
                                            零
                                        </div>
                                        <div class="border-purple" v-else>
                                            团
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </RadioGroup>
                    <!--暂无数据-->
                    <no-data v-else></no-data>

                    <Spin fix v-if="checkPersonLoading">
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>加载中...</div>
                    </Spin>
                    <Page v-if="groupOrderList.length > 0" :current="groupUnitForm.pageNumber" :total="groupDataTotal"
                          simple
                          @on-change="personChangePageNum"/>
                </Row>
            </Card>
        </Col>
        <div class="expand">
            <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand"/>
        </div>
        <Col :style="span">
            <Card style="height: calc(100vh - 80px);" v-if="groupOrderList.length >0">
                <Alert class="ivu-alert-left">
                    报告信息
                </Alert>
                <Form style="margin-top: 16px;" ref="unitReportForm" :model="unitReportForm" :rules="unitReportFormRule"
                      :label-width="90">
                    <Row>
                        <Col span="12">
                            <FormItem label="报告编号">
                                <Input type="text" v-model="unitReportForm.code" placeholder="提交后系统自动生成"
                                       v-bind:disabled="disabled">
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="体检类型">
                                <!--<Input type="text" v-model="unitReportForm.physicalType"  v-bind:readonly="disabled">
                                </Input>-->
                                <Select v-bind:disabled="disabled" v-model="unitReportForm.physicalType"
                                        placeholder="请选择"
                                        clearable>
                                    <Option v-for="(item, i) in inspectTypePriority" :key="item.id" :value="item.value">
                                        {{item.title}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="体检单位">
                                <!--<Input type="text" v-model="unitReportForm.physicalUnit"  v-bind:disabled="disabled">
                                </Input>-->
                                <Select v-bind:disabled="disabled" v-model="unitReportForm.physicalUnit"
                                        placeholder="请选择"
                                        clearable>
                                    <Option v-for="(item, i) in unitDataArry" :key="item.id" :value="item.name">{{
                                        item.name }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="委托单位">
                                <Input type="text" v-model="unitReportForm.entrustUnit" v-bind:disabled="disabled">
                                </Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="体检日期">
                                <!--<Input type="text" v-model="unitReportForm.physicalDate"  v-bind:disabled="disabled">
                                </Input>-->
                                <DatePicker v-model="unitReportForm.physicalDate"
                                            style="width: 100%"
                                            type="date" format="yyyy-MM-dd" v-bind:disabled="disabled"
                                            placeholder="选择时间"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="体检人数">
                                <Input type="text" v-model="unitReportForm.physicalNumber" v-bind:disabled="disabled">
                                </Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row v-if="this.physicalType == '健康体检'">
                        <Col span="12">
                            <FormItem label="体检项目">
                                <Input :rows="3" type="textarea" v-model="unitReportForm.physicalProject"
                                       v-bind:disabled="disabled"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="评论依据" prop="evaluationBasis">
                                <Input :rows="3" type="textarea" v-model="unitReportForm.evaluationBasis"
                                       placeholder="请输入评论依据" clearable
                                       v-bind:disabled="disabled"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row v-if="this.physicalType != '健康体检'">
                        <Col span="12">
                            <FormItem label="危害因素">
                                <Input :rows="3" type="textarea" v-model="unitReportForm.hazardFactors"
                                       @on-focus="handleHarmSelect" placeholder="暂无" v-bind:disabled="disabled"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="体检项目">
                                <Input :rows="3" type="textarea" v-model="unitReportForm.physicalProject"
                                       v-bind:disabled="disabled"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row v-if="this.physicalType == '健康体检'">
                        <Col span="24">
                            <Button class="choice" type="primary" v-bind:disabled="disabled"
                                    @click="handleWordChoose('zjclyj')">选
                            </Button>
                            <FormItem label="体检结论与处理意见" prop="concludingObservations">
                                <Input :rows="4" type="textarea" v-model="unitReportForm.concludingObservations"
                                       placeholder="请输入体检结论与处理意见"
                                       clearable v-bind:disabled="disabled"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row v-if="this.physicalType != '健康体检'">
                        <Col span="12">
                            <FormItem label="评论依据" prop="evaluationBasis">
                                <Input :rows="4" type="textarea" v-model="unitReportForm.evaluationBasis"
                                       placeholder="请输入评论依据" clearable
                                       v-bind:disabled="disabled"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <Button class="choice" type="primary" v-bind:disabled="disabled"
                                    @click="handleWordChoose('zjclyj')">选
                            </Button>
                            <FormItem label="体检结论与处理意见" prop="concludingObservations">
                                <Input :rows="4" type="textarea" v-model="unitReportForm.concludingObservations"
                                       placeholder="请输入体检结论与处理意见"
                                       clearable v-bind:disabled="disabled"/>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <el-tabs type="border-card" style="width: 100%;margin-top:10px;" v-model="tabsValue"
                         @tab-click="tabsClick" v-if="!isUpdateUnitPage">
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="检查人数统计表" name="1" v-if="this.physicalType != '健康体检'">
                        <vxe-table v-if="tabsValue == '1'" ref="tabsValue1" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow show-footer
                                   :footer-method="footerMethod">
                            <vxe-column field="hazardFactorsText" title="职业危害因素" align="center" minWidth="180"/>
                            <vxe-column field="workStateText" title="体检类型" align="center" minWidth="80"/>
                            <vxe-column field="total" title="参检人数（个）" align="center" minWidth="120"/>
                            <vxe-column field="noAbnormalNum" title="未见异常人数（个）" align="center" minWidth="150"/>
                            <vxe-column field="otherAbnormalNum" title="其他异常人数（个）" align="center" minWidth="150"/>
                            <vxe-column field="recheckNum" title="复查人数（个）" align="center" minWidth="120"/>
                            <vxe-column field="tabooNum" title="职业禁忌证人数（个）" align="center" minWidth="160"/>
                            <vxe-column field="diseaseNum" title="疑似职业病人数（个）" align="center" minWidth="160"/>
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="检查结果分析表" name="2"v-if=" this.physicalType != '健康体检'">
                        <vxe-table v-if="tabsValue == '2'" ref="tabsValue2" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow show-footer
                                   :footer-method="footerMethod">
                            <vxe-column field="hazardFactorsText" title="职业危害因素" align="center" minWidth="180"/>
                            <vxe-column field="workStateText" title="体检类型" align="center" minWidth="80"/>
                            <vxe-column field="recheckNums" title="与接触职业病危害因素相关的异常指标人次或复查（人次）" align="center"
                                        width="400"/>
                            <vxe-column field="otherAbnormalNum" title="其他疾病或异常（人次）" align="center" minWidth="180"/>
                            <vxe-column field="noAbnormalNum" title="目前未见异常（人数）" align="center" minWidth="180"/>
<!--                            <vxe-column field="total" title="合计（人数）" align="center" minWidth="150"-->
<!--                                        :formatter="formatNumber"/>-->
                            <!--                            <vxe-column field="total" title="合计（人数）" align="center" minWidth="150"/>-->
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="体检人员汇总表" name="7">
                        <vxe-table v-if="tabsValue == '7'" ref="tabsValue7" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow>
                            <vxe-column field="testNum" title="编号" align="center" minWidth="130"/>
                            <vxe-column field="personName" title="姓名" align="center" minWidth="70"/>
                            <vxe-column field="mobile" title="手机号" align="center" minWidth="110"/>
                            <vxe-column field="sex" title="性别" align="center" minWidth="60"/>
                            <vxe-column field="age" title="年龄" align="center" minWidth="60"/>
                            <vxe-column field="idCard" title="身份证号码" align="center" minWidth="180"/>
                            <vxe-column field="hazardFactorsText" title="危害因素" align="center" minWidth="150" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="workTypeText" title="工种" align="center" minWidth="120" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="exposureWorkYear" title="接触有害工龄（年）" align="center" minWidth="150" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="registDate" title="体检时间" align="center" minWidth="100"/>
                            <vxe-column field="workStateText" title="体检类型" align="center" minWidth="90" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="physicalType" title="体检类别" align="center" minWidth="90" v-if="this.physicalType == '健康体检'"/>
                            <vxe-column field="isRecheck" title="是否正常" align="center" minWidth="90"/>
                            <vxe-column field="conclusion" title="体检结果" align="center" minWidth="200"/>
                            <vxe-column field="handleOpinion" title="处理意见" align="center" minWidth="200"/>
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="复查人员汇总表" name="3">
                        <vxe-table v-if="tabsValue == '3'" ref="tabsValue3" border resizable :data="tableData"
                                   :max-height="tableMaxHeight">
                            <vxe-column field="testNum" title="编号" align="center" minWidth="130"/>
                            <vxe-column field="personName" title="姓名" align="center" minWidth="70"/>
                            <vxe-column field="mobile" title="手机号" align="center" minWidth="110"/>
                            <vxe-column field="sex" title="性别" align="center" minWidth="60"/>
                            <vxe-column field="age" title="年龄" align="center" minWidth="60"/>
                            <vxe-column field="idCard" title="身份证号码" align="center" minWidth="180"/>
                            <vxe-column field="hazardFactorsText" title="危害因素" align="center" minWidth="150" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="workTypeText" title="工种" align="center" minWidth="120" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="exposureWorkYear" title="接触有害工龄（年）" align="center" minWidth="150" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="registDate" title="体检时间" align="center" minWidth="100"/>
                            <vxe-column field="workStateText" title="体检类型" align="center" minWidth="90" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="physicalType" title="体检类别" align="center" minWidth="90" v-if="this.physicalType == '健康体检'"/>
                            <!--                            <vxe-column field="isNormal" title="是否正常" align="center" minWidth="150"/>-->
                            <vxe-column field="reason" title="复查原因" align="center" minWidth="200"/>
                            <vxe-column field="portfolioProjectName" title="复查项目" align="center" minWidth="220"/>
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="职业禁忌症汇总表" name="4" v-if="this.physicalType != '健康体检'">
                        <vxe-table v-if="tabsValue == '4'" ref="tabsValue4" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow>
                            <vxe-column field="testNum" title="编号" align="center" minWidth="130"/>
                            <vxe-column field="personName" title="姓名" align="center" minWidth="70"/>
                            <vxe-column field="mobile" title="手机号" align="center" minWidth="110"/>
                            <vxe-column field="sex" title="性别" align="center" minWidth="60"/>
                            <vxe-column field="age" title="年龄" align="center" minWidth="60"/>
                            <vxe-column field="idCard" title="身份证号码" align="center" minWidth="180"/>
                            <vxe-column field="hazardFactorsText" title="危害因素" align="center" minWidth="150"/>
                            <vxe-column field="workTypeText" title="工种" align="center" minWidth="120"/>
                            <vxe-column field="exposureWorkYear" title="接触有害工龄（年）" align="center" minWidth="150"/>
                            <vxe-column field="registDate" title="体检时间" align="center" minWidth="100"/>
                            <vxe-column field="workStateText" title="体检类型" align="center" minWidth="90"/>
                            <!--                            <vxe-column field="isNormal" title="是否正常" align="center" minWidth="100"/>-->
                            <vxe-column field="conclusion" title="体检结果" align="center" minWidth="200"/>
                            <vxe-column field="handleOpinion" title="处理意见" align="center" minWidth="200"/>
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="疑似职业病汇总表" name="5" v-if="this.physicalType != '健康体检'">
                        <vxe-table v-if="tabsValue == '5'" ref="tabsValue5" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow>
                            <vxe-column field="testNum" title="编号" align="center" minWidth="130"/>
                            <vxe-column field="personName" title="姓名" align="center" minWidth="70"/>
                            <vxe-column field="mobile" title="手机号" align="center" minWidth="110"/>
                            <vxe-column field="sex" title="性别" align="center" minWidth="60"/>
                            <vxe-column field="age" title="年龄" align="center" minWidth="60"/>
                            <vxe-column field="idCard" title="身份证号码" align="center" minWidth="180"/>
                            <vxe-column field="hazardFactorsText" title="危害因素" align="center" minWidth="150"/>
                            <vxe-column field="workTypeText" title="工种" align="center" minWidth="120"/>
                            <vxe-column field="exposureWorkYear" title="接触有害工龄（年）" align="center" minWidth="150"/>
                            <vxe-column field="registDate" title="体检时间" align="center" minWidth="100"/>
                            <vxe-column field="workStateText" title="体检类型" align="center" minWidth="90"/>
                            <!--                            <vxe-column field="isNormal" title="是否正常" align="center" minWidth="100"/>-->
                            <vxe-column field="conclusion" title="体检结果" align="center" minWidth="200"/>
                            <vxe-column field="handleOpinion" title="处理意见" align="center" minWidth="200"/>
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="其他异常结果汇总表" name="6" v-if="this.physicalType != '健康体检'">
                        <vxe-table v-if="tabsValue == '6'" ref="tabsValue6" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow>
                            <vxe-column field="testNum" title="编号" align="center" minWidth="130"/>
                            <vxe-column field="personName" title="姓名" align="center" minWidth="70"/>
                            <vxe-column field="mobile" title="手机号" align="center" minWidth="110"/>
                            <vxe-column field="sex" title="性别" align="center" minWidth="60"/>
                            <vxe-column field="age" title="年龄" align="center" minWidth="60"/>
                            <vxe-column field="idCard" title="身份证号码" align="center" minWidth="180"/>
                            <vxe-column field="hazardFactorsText" title="危害因素" align="center" minWidth="150"/>
                            <vxe-column field="workTypeText" title="工种" align="center" minWidth="120"/>
                            <vxe-column field="exposureWorkYear" title="接触有害工龄（年）" align="center" minWidth="150"/>
                            <vxe-column field="registDate" title="体检时间" align="center" minWidth="100"/>
                            <vxe-column field="workStateText" title="体检类型" align="center" minWidth="90"/>
                            <!--                            <vxe-column field="isNormal" title="是否正常" align="center" minWidth="100"/>-->
                            <vxe-column field="conclusion" title="体检结果" align="center" minWidth="200"/>
                            <vxe-column field="handleOpinion" title="处理意见" align="center" minWidth="200"/>
                        </vxe-table>
                    </el-tab-pane>
                </el-tabs>
                <el-tabs type="border-card" style="width: 100%;margin-top:10px;" v-model="tabsValue"
                         @tab-click="tabsClick" v-if="isUpdateUnitPage">
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="检查人数统计表" name="1" v-if="this.physicalType != '健康体检'">
                        <vxe-table v-if="tabsValue == '1'" ref="tabsValue1" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow show-footer
                                   :footer-method="footerMethod">
                            <vxe-column field="hazardFactorsText" title="职业危害因素" align="center" minWidth="180"/>
                            <vxe-column field="workStateText" title="体检类型" align="center" minWidth="80"/>
                            <vxe-column field="total" title="参检人数（个）" align="center" minWidth="120"/>
                            <vxe-column field="noAbnormalNum" title="未见异常人数（个）" align="center" minWidth="150"/>
                            <vxe-column field="otherAbnormalNum" title="其他异常人数（个）" align="center" minWidth="150"/>
                            <vxe-column field="recheckNum" title="复查人数（个）" align="center" minWidth="120"/>
                            <vxe-column field="tabooNum" title="职业禁忌证人数（个）" align="center" minWidth="160"/>
                            <vxe-column field="diseaseNum" title="疑似职业病人数（个）" align="center" minWidth="160"/>
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="检查结果分析表" name="2"v-if=" this.physicalType != '健康体检'">
                        <vxe-table v-if="tabsValue == '2'" ref="tabsValue2" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow show-footer
                                   :footer-method="footerMethod">
                            <vxe-column field="hazardFactorsText" title="职业危害因素" align="center" minWidth="180"/>
                            <vxe-column field="workStateText" title="体检类型" align="center" minWidth="80"/>
                            <vxe-column field="recheckNums" title="与接触职业病危害因素相关的异常指标人次或复查（人次）" align="center"
                                        width="400"/>
                            <vxe-column field="otherAbnormalNum" title="其他疾病或异常（人次）" align="center" minWidth="180"/>
                            <vxe-column field="noAbnormalNum" title="目前未见异常（人数）" align="center" minWidth="180"/>
                            <!--                            <vxe-column field="total" title="合计（人数）" align="center" minWidth="150"-->
                            <!--                                        :formatter="formatNumber"/>-->
                            <!--                            <vxe-column field="total" title="合计（人数）" align="center" minWidth="150"/>-->
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="体检人员汇总表" name="7">
                        <vxe-table v-if="tabsValue == '7'" ref="tabsValue7" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow>
                            <vxe-column field="testNum" title="编号" align="center" minWidth="130"/>
                            <vxe-column field="personName" title="姓名" align="center" minWidth="70"/>
                            <vxe-column field="sex" title="性别" align="center" minWidth="60"/>
                            <vxe-column field="age" title="年龄" align="center" minWidth="60"/>
                            <vxe-column field="hazardFactorsText" title="接触危害因素" align="center" minWidth="150" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="workTypeText" title="岗位" align="center" minWidth="120" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="exposureWorkYear" title="接害工龄" align="center" minWidth="150" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="workStateText" title="体检类别" align="center" minWidth="90" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="physicalType" title="体检类别" align="center" minWidth="90" v-if="this.physicalType == '健康体检'"/>
                            <vxe-column field="conclusion" title="体检结果" align="center" minWidth="200"/>
                            <vxe-column field="handleOpinion" title="处理意见" align="center" minWidth="200"/>
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="复查人员汇总表" name="3">
                        <vxe-table v-if="tabsValue == '3'" ref="tabsValue3" border resizable :data="tableData"
                                   :max-height="tableMaxHeight">
                            <vxe-column field="testNum" title="编号" align="center" minWidth="130"/>
                            <vxe-column field="personName" title="姓名" align="center" minWidth="70"/>
                            <vxe-column field="sex" title="性别" align="center" minWidth="60"/>
                            <vxe-column field="age" title="年龄" align="center" minWidth="60"/>
                            <vxe-column field="hazardFactorsText" title="接触危害因素" align="center" minWidth="150" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="workTypeText" title="岗位" align="center" minWidth="120" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="exposureWorkYear" title="接害工龄" align="center" minWidth="150" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="workStateText" title="体检类别" align="center" minWidth="90" v-if="this.physicalType != '健康体检'"/>
                            <vxe-column field="physicalType" title="体检类别" align="center" minWidth="90" v-if="this.physicalType == '健康体检'"/>
                            <!--                            <vxe-column field="isNormal" title="是否正常" align="center" minWidth="150"/>-->
                            <vxe-column field="reason" title="复查原因" align="center" minWidth="200"/>
                            <vxe-column field="portfolioProjectName" title="复查项目" align="center" minWidth="220"/>
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="职业禁忌症汇总表" name="4" v-if="this.physicalType != '健康体检'">
                        <vxe-table v-if="tabsValue == '4'" ref="tabsValue4" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow>
                            <vxe-column field="testNum" title="编号" align="center" minWidth="130"/>
                            <vxe-column field="personName" title="姓名" align="center" minWidth="70"/>
                            <vxe-column field="sex" title="性别" align="center" minWidth="60"/>
                            <vxe-column field="age" title="年龄" align="center" minWidth="60"/>
                            <vxe-column field="hazardFactorsText" title="接触危害因素" align="center" minWidth="150"/>
                            <vxe-column field="workTypeText" title="岗位" align="center" minWidth="120"/>
                            <vxe-column field="exposureWorkYear" title="接害工龄" align="center" minWidth="150"/>
                            <vxe-column field="workStateText" title="体检类别" align="center" minWidth="90"/>
                            <!--                            <vxe-column field="isNormal" title="是否正常" align="center" minWidth="100"/>-->
                            <vxe-column field="conclusion" title="职业性结果" align="center" minWidth="200"/>
                            <vxe-column field="handleOpinion" title="处理意见" align="center" minWidth="200"/>
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="疑似职业病汇总表" name="5" v-if="this.physicalType != '健康体检'">
                        <vxe-table v-if="tabsValue == '5'" ref="tabsValue5" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow>
                            <vxe-column field="testNum" title="编号" align="center" minWidth="130"/>
                            <vxe-column field="personName" title="姓名" align="center" minWidth="70"/>
                            <vxe-column field="sex" title="性别" align="center" minWidth="60"/>
                            <vxe-column field="age" title="年龄" align="center" minWidth="60"/>
                            <vxe-column field="hazardFactorsText" title="接触危害因素" align="center" minWidth="150"/>
                            <vxe-column field="workTypeText" title="岗位" align="center" minWidth="120"/>
                            <vxe-column field="exposureWorkYear" title="接害工龄" align="center" minWidth="150"/>
                            <vxe-column field="workStateText" title="体检类别" align="center" minWidth="90"/>
                            <!--                            <vxe-column field="isNormal" title="是否正常" align="center" minWidth="100"/>-->
                            <vxe-column field="conclusion" title="职业性结果" align="center" minWidth="200"/>
                            <vxe-column field="handleOpinion" title="处理意见" align="center" minWidth="200"/>
                        </vxe-table>
                    </el-tab-pane>
                    <el-tab-pane style="margin-bottom: 10px;" :lazy="true" label="其他异常结果汇总表" name="6" v-if="this.physicalType != '健康体检'">
                        <vxe-table v-if="tabsValue == '6'" ref="tabsValue6" border resizable :data="tableData"
                                   :max-height="tableMaxHeight" show-overflow>
                            <vxe-column field="testNum" title="编号" align="center" minWidth="130"/>
                            <vxe-column field="personName" title="姓名" align="center" minWidth="70"/>
                            <vxe-column field="sex" title="性别" align="center" minWidth="60"/>
                            <vxe-column field="age" title="年龄" align="center" minWidth="60"/>
                            <vxe-column field="hazardFactorsText" title="接触危害因素" align="center" minWidth="150"/>
                            <vxe-column field="workTypeText" title="岗位" align="center" minWidth="120"/>
                            <vxe-column field="exposureWorkYear" title="接害工龄" align="center" minWidth="150"/>
                            <vxe-column field="workStateText" title="体检类别" align="center" minWidth="90"/>
                            <!--                            <vxe-column field="isNormal" title="是否正常" align="center" minWidth="100"/>-->
                            <vxe-column field="conclusion" title="非职业性结果" align="center" minWidth="200"/>
                            <vxe-column field="handleOpinion" title="处理意见" align="center" minWidth="200"/>
                        </vxe-table>
                    </el-tab-pane>
                </el-tabs>
                <div style="bottom: -15px;position: relative; width: 100%;background-color: #fff;text-align: center;">
                    <Button v-if="updateShow" @click="updateData" type="primary" icon="ios-create-outline">修改</Button>
                    <Button v-if="saveShow" @click="saveData" type="primary" icon="ios-download-outline"
                            :loading="saveLoading">保存
                    </Button>
                    <Button @click="exportData" type="primary" icon="ios-cloud-download-outline" :loading="saveLoading">
                        导出
                    </Button>
                    <Button @click="previewData" type="primary" icon="ios-cloud-upload" v-if="this.physicalType != '健康体检'">预览</Button>
                    <Button @click="previewTemplateJKTJ" type="primary" icon="ios-cloud-upload" v-if="this.physicalType == '健康体检'">预览</Button>
                    <Button @click="previewReviewData" type="primary" icon="ios-cloud-upload" v-if="recheck && this.physicalType != '健康体检'">复查报告
                    </Button>
                </div>
            </Card>
            <Card v-else>
                <no-data width="150" style="height: calc(100vh - 128px);overflow:hidden;display:flex;flex-direction:row;justify-content:center;"></no-data>
            </Card>
        </Col>
        <preview-template v-model="previewShow" ref="unitReportPdf" :previewName="previewName"
                          :TTemplateId="TTemplateId"></preview-template>
        <drawer v-model="wordChooseShow" width="400" :modalTitle="title" @getSelectedWords="getSelectedWords"
                :type="type" :inspectType="unitReportForm.physicalType"
                :hazardFactorsText="unitReportForm.hazardFactors" :isMultiple="isMultiple">
        </drawer>
        <order-choose v-model="orderChooseShow"></order-choose>
        <!--危害因素-->
        <harmDrawer v-model="harmShow" :modalTitle="title" :selectedHarmList="selectedHarmList" @harmReback="harmReback"
                    :selectType="seltType"></harmDrawer>
    </Row>
</template>
<script>
	import {getTGroupUnit, queryAllTGroupUnitList} from "../../../api/healthy/tGroupUnit";//体检单位
	import {
		queryTGroupOrderList,
		getTGroupOrder,
	} from "../../../api/healthy/tGroupOrder";//订单
	import {formartDate} from "../../../api/tools/tool";//时间格式转换
	import {
		addTUnitReport,
		updateTUnitReport,
		getTUnitReportByOrderId,
		checkThePeopleStatisticsTable
	} from "../../../api/healthy/tUnitReport";//单位报告
	import {
		queryCheckProjectAndHazardFactors,
		getTOrderGroupByGroupOrderId,
		queryCheckProjectAndHazardFactorsList,
        queryCheckProjectAndHazardFactorsComboList,
		queryCheckResultAndHazardFactorsList,
        queryCheckResultByOrderId,
		queryCheckResultReview,
        queryReviewResultByOrderId,
		queryRegistDateReview,
		queryRegistDate
	} from "../../../api/healthy/tOrderGroup";//订单分组
	import previewTemplate from "./previewTemplate";//预览
	import drawer from "../tAllInspect/drawer";//术语抽屉
	import noData from "@/components/no-data";
	import harmDrawer from "../tCombo/harmDrawer";
	import {exportWord} from '@/api/healthy/tTemplate'
	import orderChoose from './orderChoose';

	export default {
		name: "tUnitReport",
		components: {
			previewTemplate,//预览
			drawer,//术语抽屉
			noData,
			harmDrawer,
			orderChoose
		},
		data() {
			return {
                isUpdateUnitPage: false,//是否修改单位页面

				previewName: "",//预览报告名称
				orderChooseShow:false,
				title: "",
				seltType: "",
				selectedHarmList: [],
				harmShow: false,
				isMultiple: false,
				expandIcon: "ios-arrow-back",
				expand: true,
                leftSpan: 'width: 300px;',
                span: 'position: relative;width: calc(100% - 332px);',
				tableMaxHeight: 500,
				recheckData: [],//复查
				tabooData: [],//禁忌症
				diseaseData: [],//疑是职业病
				otherAbnormalData: [],//其他异常
				personData: [],//人员汇总
				groupDataTotal: 0,
				date: '',
				datePickerShow: false,
				checkPersonLoading: false,
				disabled: true,
				updateShow: true,
				saveShow: false,
				unitReportData: '',//订单查询的数据
				groupData: '',
				previewShow: false,//预览显示
				TTemplateId: {
					id: "",//模板id
					code: '',//报告编号
					physicalUnit: '',//体检单位
					entrustUnit: '',//委托单位
					hazardFactors: '',//危害因素
					physicalType: '',//体检类型
					physicalDate: '',//体检日期
					signingTime: '',//签发日期
					physicalNumber: '',//体检人数
					filishNumber: 0,//已完成人数
					physicalProject: '',//体检项目
					evaluationBasis: '',//评价依据
					concludingObservations: '',//结论意见
					address: '',//地址
					signer: '',//签发人
					signerDate: '',//签发日期
					year: '',//年(体检日期)
					month: '',//月(体检日期)
					day: '',//日(体检日期)
					examiner: '',//审核者
					reinspector: '',//复核者
					preparedBy: '',//编制者
					notAbnormalNumber: '',//未见异常人数
					otherAbnormalNumber: '',//其他异常人数
					reinspectNumber: '',//复核人数
					contraindicationNumber: '',//职业禁忌证人数
					doubtIsNumber: '',//疑是职业病人数
					personInfo: [],//人员信息
					groupData: [],//分组数据(统计)
					groupDataAll: [],//分组数据(详细)
					recheckData: [],//复查
					tabooData: [],//禁忌症
					diseaseData: [],//疑是职业病
					otherAbnormalData: [],//其他异常
					personData: [],//人员汇总
				},//要预览模板id
				wordChooseShow: false,
				title: "",
				type: "",
				groupUnitForm: {
					pageNumber: 1,
					pageSize: 10,
					groupUnitName: '',//订单名称
					payStatus: '1',
					physicalType: '',
					startDate: null,//开始时间
					endDate: null,//结束时间
				},
				searchKey: "",
				radioValue: "",
				unitReportForm: {
					id: '',//ID
					orderId: '',//订单ID
					code: '',//报告编号
					physicalUnit: '',//体检单位
					entrustUnit: '',//委托单位
					hazardFactors: '',//危害因素
					physicalType: '',//体检类型
					physicalDate: null,//体检日期
					physicalNumber: '',//体检人数
					filishNumber: 0,//已完成人数
					physicalProject: '',//体检项目
					evaluationBasis: '',//评价依据
					concludingObservations: '',//结论意见
				},
				hazardFactorsCode: '',//危害编码
				signingTime: null,//签发日期
				physicalTypeList: [],
				groupOrderList: [],
				saveLoading: false,
				unitReportFormRule: {
					evaluationBasis: [
						{required: true, message: '评价依据不能为空！', trigger: 'change'},
					],
					concludingObservations: [
						{required: true, message: '结论意见不能为空！', trigger: 'change'},
					],
				},
				data: [],
				tabsValue: "1",
				tableData: [],
				CheckThePeopleStatisticsData: [],
                CheckThePeopleStatisticsDataFinish: [],
				reviewData: [],
				recheck: false,
				personListData: [],
                personListAllData: [],
				inspectTypePriority: [{
					id: '1',
					value: "健康体检",
					title: "健康体检",
				}, {
					id: '2',
					value: "职业体检",
					title: "职业体检",
				}, {
					id: '3',
					value: "从业体检",
					title: "从业体检",
				}, {
					id: '4',
					value: "放射体检",
					title: "放射体检",
				}],//体检类型
				unitDataArry: [],//体检单位
				tabName: "",//点击的tab名称
			}
		},
		methods: {
            footerMethod({columns, data}){
                let personTotle = []
                columns.forEach((column, columnIndex) => {
                    if (columnIndex === 0) {
                        personTotle.push('合计')
                    } else {
                        let meanCell = null
                        switch (column.property) {
                            case 'total':
                                meanCell = this.personNum(data, column.property)
                                break
                            case 'noAbnormalNum':
                                meanCell = this.personNum(data, column.property)
                                break
                            case 'otherAbnormalNum':
                                meanCell = this.personNum(data, column.property)
                                break
                            case 'recheckNum':
                                meanCell = this.personNum(data, column.property)
                                break
                            case 'recheckNums':
                                meanCell = this.personNum(data, column.property)
                                break
                            case 'tabooNum':
                                meanCell = this.personNum(data, column.property)
                                break
                            case 'diseaseNum':
                                meanCell = this.personNum(data, column.property)
                                break
                        }
                        personTotle.push(meanCell)
                    }
                })
                // 返回一个二维数组的表尾合计
                return [personTotle]
            },
            personNum (list, field) {
                let count = 0
                list.forEach(item => {
                    count += Number(item[field])
                })
                return count
            },
			//合并订单点击事件
			orderChooseClick(){
				this.orderChooseShow = true;
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
			//页码
			groupDataChangePageNum(v) {
				this.groupUnitForm.pageNumber = v;
				this.getGroupOrderData();
			},
			//单页数据
			groupDataPageSize(v) {
				this.groupUnitForm.pageSize = v;
				this.getGroupOrderData();
			},
			//人员日期查询
			datePickerChange(e) {
				if (e) {
					this.groupUnitForm.startDate = e[0]
					var dateTime = new Date(e[1]);
					dateTime = dateTime.setDate(dateTime.getDate() + 1);
					this.groupUnitForm.endDate = new Date(dateTime);
					this.getGroupOrderData();
				}
			},
			handleHarmSelect() {
				this.selectedHarmList = [];
				this.harmShow = true;
				this.title = "危害因素选择";
				this.seltType = "checkbox";
				if (this.unitReportForm.hazardFactors) {
					let ids = "";
					if (this.hazardFactorsCode) {
						ids = this.hazardFactorsCode;
					}
					let txts = this.unitReportForm.hazardFactors.split("|");
					if (ids.length == 0 || ids == "") {
						for (let i = 0; i < txts.length; i++) {
							let id = "";
							let txt = txts[i];
							this.selectedHarmList.push({
								typeCode: id,
								typeName: txt
							});
						}
					} else {
						for (let i = 0; i < ids.length; i++) {
							let id = ids[i];
							let txt = txts[i];
							this.selectedHarmList.push({
								typeCode: id,
								typeName: txt
							});
						}
					}
				} else {
					this.selectedHarmList = [];
				}
			},
			harmReback(e) {
				if (e && e.length > 0) {
					let ids = [], txts = [];
					e.forEach(i => {
						ids.push(i.typeCode);
						txts.push(i.typeName);
					})
					this.hazardFactorsCode = ids;
					this.unitReportForm.hazardFactors = txts.join("|");
				}
			},
			pick(e) {
				if (e == '自定义') {
					this.resetSearchForm();
					this.datePickerShow = true;
				} else if (e == '当日') {
					this.resetSearchForm();
					this.groupUnitForm.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
					this.groupUnitForm.endDate = null;
					this.getGroupOrderData();
				} else if (e == '当月') {
					this.resetSearchForm();
					this.groupUnitForm.endDate = formartDate(new Date(), 'yyyy-MM-dd  HH:mm:ss');
					this.groupUnitForm.startDate = null;
					this.getGroupOrderData();
				} else if (e == "重置") {
					this.resetSearchForm();
				}
			},
			resetSearchForm() {
				this.groupUnitForm.startDate = null;
				this.groupUnitForm.endDate = null;
				this.groupUnitForm.pageNumber = 1;
				this.unitReportForm.filishNumber = 0;
				if (this.date == "重置") {
					this.date = "当日";
					this.groupUnitForm.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
					this.groupUnitForm.endDate = null;
					this.getGroupOrderData();
				}
			},
			//抽屉展示
			handleWordChoose(type) {
				this.wordChooseShow = true;
				this.title = "常用术语";
				this.type = type;
			},
			//获取专业术语回调
			getSelectedWords(word, cType) {
				if (cType == "zjclyj") {
					this.unitReportForm.concludingObservations += word;
				}
			},
			//修改
			updateData() {
				this.disabled = false;
				this.updateShow = false;
				this.saveShow = true;
			},
			//导出
			exportData() {
				if (this.$refs["tabsValue" + this.tabsValue]) {
					this.$refs["tabsValue" + this.tabsValue].exportData({
						filename: this.tabName,
						sheetName: 'Sheet1',
						type: 'xlsx',
						types: ['xlsx', 'csv', 'html', 'xml', 'txt'],
						useStyle: true, //是否导出样式
						isFooter: false, //是否导出表尾（比如合计）
					})

				}
			},
			//保存
			saveData() {
				this.$refs['unitReportForm'].validate((valid) => {
					if (valid) {
						this.saveLoading = true;
						//保存方法判断(新增/更新) 数据库没有就新增，已存在则更新
						if (this.unitReportForm.id && this.unitReportForm.id.length > 0) {
							let unitReportForm = {
								id: this.unitReportForm.id,//ID
								code: this.unitReportForm.code,//报告编号
								physicalUnit: this.unitReportForm.physicalUnit,//体检单位
								entrustUnit: this.unitReportForm.entrustUnit,//委托单位
								hazardFactors: this.unitReportForm.hazardFactors,//危害因素
								physicalType: this.unitReportForm.physicalType,//体检类型
								physicalDate: this.unitReportForm.physicalDate,//体检日期
								physicalProject: this.unitReportForm.physicalProject,//体检项目
								physicalNumber: this.unitReportForm.physicalNumber,//体检人数
								evaluationBasis: this.unitReportForm.evaluationBasis,//评价依据
								concludingObservations: this.unitReportForm.concludingObservations,//结论意见
							};
							//更新 单位报告
							this.update(unitReportForm);
						} else {
							//新增 单位报告
							this.add({
								orderId: this.unitReportForm.orderId,//订单ID
                                code: this.unitReportForm.code,//报告编号
								physicalUnit: this.unitReportForm.physicalUnit,//体检单位
								entrustUnit: this.unitReportForm.entrustUnit,//委托单位
								hazardFactors: this.unitReportForm.hazardFactors,//危害因素
								physicalType: this.unitReportForm.physicalType,//体检类型
								physicalDate: this.unitReportForm.physicalDate,//体检日期
								physicalProject: this.unitReportForm.physicalProject,//体检项目
								physicalNumber: this.unitReportForm.physicalNumber,//体检人数
								evaluationBasis: this.unitReportForm.evaluationBasis,//评价依据
								concludingObservations: this.unitReportForm.concludingObservations,//结论意见
							});
						}
					} else {
						this.saveLoading = false;
						this.$Message.error('表单验证不通过！');
					}
				});
			},
			//预览
			previewData() {
				let _this = this;
				this.TTemplateId.id = "2e6dd5e510021dab098ae7b4369ca4c7";
				this.previewName = "单位报告";
				//医院单位信息(单位地址、邮政编码、联系电话、传真号码、电子邮箱)
				this.TTemplateId.hospitalAddress = this.$hospitalName.hospitalAddress;
				this.TTemplateId.zipCode = this.$hospitalName.zipCode;
				this.TTemplateId.hospitalPhone = this.$hospitalName.hospitalPhone;
				this.TTemplateId.faxNumber = this.$hospitalName.faxNumber;
				this.TTemplateId.email = this.$hospitalName.email;

				this.TTemplateId.physicalUnit = this.unitReportForm.physicalUnit;//体检单位
				this.TTemplateId.entrustUnit = this.unitReportForm.entrustUnit;//委托单位
				this.TTemplateId.code = this.unitReportForm.code;//报告编号
				this.TTemplateId.physicalDate = formartDate(this.unitReportForm.physicalDate, "yyyy-MM-dd");//体检日期
				let date = this.TTemplateId.physicalDate;
				let dateArray = date.split('-');
				this.TTemplateId.year = dateArray[0];//年(体检日期)
				this.TTemplateId.month = dateArray[1];//月(体检日期)
				this.TTemplateId.day = dateArray[2];//日(体检日期)
                //危害因素
                let hazardFactorsArray = [];
                if (this.unitReportForm.hazardFactors.indexOf("|") > -1) {
                    hazardFactorsArray = this.unitReportForm.hazardFactors.split("|");
                    this.TTemplateId.hazardFactors = hazardFactorsArray.join("、");
                }else{
                    this.TTemplateId.hazardFactors = this.unitReportForm.hazardFactors;
                }
				// this.TTemplateId.physicalNumber = this.unitReportForm.physicalNumber;//体检人数
				this.TTemplateId.physicalNumber = this.personListAllData.filter(item => item.isPass > 1).length;//体检人数(应检人数，即已登记人数)
				this.TTemplateId.filishNumber = this.personListAllData.filter(item => item.isPass > 3).length;//完成人数
				this.TTemplateId.goodsState = this.CheckThePeopleStatisticsData;//检查人数统计表
				//检查人数统计表去重(体检类型)
				let newStateData = [];
				let workStateNames = [];
				let goodsState = this.TTemplateId.goodsState;
				goodsState.forEach(function (e) {
					let workStateNameNow = e.workStateText.replaceAll(" ","");
					if (workStateNames && workStateNames.length && workStateNames.indexOf(workStateNameNow) > -1) {
						newStateData.forEach(function (es) {
							if (es.workStateText == workStateNameNow) {
								es.total += e.total;
								es.noAbnormalNum += e.noAbnormalNum;
								es.otherAbnormalNum += e.otherAbnormalNum;
								es.recheckNum += e.recheckNum;
								es.tabooNum += e.tabooNum;
								es.diseaseNum += e.diseaseNum;
							}
						});
					} else {
						newStateData.push({
                            workStateText: workStateNameNow,
                            total: e.total,
                            noAbnormalNum: e.noAbnormalNum,
                            otherAbnormalNum: e.otherAbnormalNum,
                            recheckNum: e.recheckNum,
                            tabooNum: e.tabooNum,
                            diseaseNum: e.diseaseNum,
                        });
						workStateNames.push(workStateNameNow);
					}
				});
				this.TTemplateId.goodsState = newStateData;
				this.TTemplateId.goods = this.CheckThePeopleStatisticsDataFinish;//结果分析表
                let personListNow = this.personListData;
                let reviewPersonListNow = this.reviewData;
                personListNow.forEach(i => {
                    i.workTypeText = i.workTypeText.trim();
                })
                reviewPersonListNow.forEach(i => {
                    i.workTypeText = i.workTypeText.trim();
                })
				this.TTemplateId.recheckData = reviewPersonListNow;//复查人员名单
				this.TTemplateId.tabooData = personListNow.filter(item => item.checkResult.indexOf("2") > -1);//禁忌证汇总表
				this.TTemplateId.diseaseData = personListNow.filter(item => item.checkResult.indexOf("3") > -1);//疑似职业病汇总表
				this.TTemplateId.otherAbnormalData = personListNow.filter(item => item.checkResult.indexOf("1") > -1);//其他异常结果汇总表
				this.TTemplateId.personData = personListNow;//体 检 汇 总 表
				//订单登记时间查询
				queryRegistDate({groupOrderId: this.radioValue}).then(res => {
					if (res.success) {
						let dates = res.data;
						let registDates = [];
						//登记日期筛选并去重
						dates.forEach(function (e) {
							let newDate = "";
							let dateArray = e.regist_date.split("T")[0].split('-');
							let yearMonth = dateArray[0] + "年" + dateArray[1] + "月";
							newDate = yearMonth + dateArray[2] + "日";
							registDates.push(newDate);
						});
						let registDatesNow = this.removeRepeat(registDates);
						let dateYearMonth = [];
						let newDates = [];
						registDatesNow.forEach(function (e) {
							let nowYearMonth = e.split("月")[0] + "月";
							let nowDay = e.split("月")[1];
							if (dateYearMonth && dateYearMonth.length > 0 && dateYearMonth.indexOf(nowYearMonth) > -1) {
								for (let i = 0; i < newDates.length; i++) {
									let newYearMonth = newDates[i].split("月")[0] + "月";
									if (newYearMonth == nowYearMonth) {
										newDates[i] += "、" + nowDay;
									}
								}
							} else {
								newDates.push(e);
								dateYearMonth.push(nowYearMonth)
							}
						});
						this.TTemplateId.registDates = newDates.join("、");
						// queryCheckProjectAndHazardFactorsList({groupOrderId: this.radioValue}).then(res => {
                        queryCheckProjectAndHazardFactorsComboList({groupOrderId: this.radioValue}).then(res => {
							if (res.success) {
								//检查项目和危害因素
								this.TTemplateId.groupDatas = res.data;
								//进行了哪些类型的体检
								// let workStates = res.data.workStateName;
								let workStates = [];
								res.data.forEach(function (e) {
									let workStateName = e.workStateName.replaceAll(" ","");
									workStates.push(workStateName);
								});
								this.TTemplateId.workStates = _this.removeRepeat(workStates).join("、");
                                queryCheckResultByOrderId({groupOrderId: this.radioValue}).then(res => {
                                    let data = res.data;
                                    this.TTemplateId.resultDatas = data;
                                    this.previewShow = true;
                                })
							}
						});
					}
				});
			},
            //
            previewTemplateJKTJ(){
                let _this = this;
                this.TTemplateId.id = "67c632a9fd3fe52464f399c0377b9784";
                this.previewName = "单位报告(健康)";

                this.TTemplateId.physicalUnit = this.unitReportForm.physicalUnit;//体检单位
                this.TTemplateId.entrustUnit = this.unitReportForm.entrustUnit;//委托单位
                this.TTemplateId.code = this.unitReportForm.code;//报告编号
                this.TTemplateId.physicalDate = formartDate(this.unitReportForm.physicalDate, "yyyy-MM-dd");//体检日期
                let date = this.TTemplateId.physicalDate;
                let dateArray = date.split('-');
                this.TTemplateId.year = dateArray[0];//年(体检日期)
                this.TTemplateId.month = dateArray[1];//月(体检日期)
                this.TTemplateId.day = dateArray[2];//日(体检日期)
                this.TTemplateId.physicalNumber = this.personListAllData.filter(item => item.isPass > 1).length;//体检人数(应检人数，即已登记人数)
                this.TTemplateId.filishNumber = this.personListAllData.filter(item => item.isPass > 3).length;//完成人数
                // this.TTemplateId.goodsState = this.CheckThePeopleStatisticsData;//检查人数统计表
                this.TTemplateId.goodsState = this.CheckThePeopleStatisticsDataFinish;//检查人数统计表
                let personListNow = this.personListData;
                personListNow.forEach(i => {
                    i.workTypeText = i.workTypeText.trim();
                })
                this.TTemplateId.recheckData = personListNow.filter(item => item.isRecheck == 1);//异常结果汇总表
                this.TTemplateId.personData = personListNow;//体 检 汇 总 表
                //订单登记时间查询
                queryRegistDate({groupOrderId: this.radioValue}).then(res => {
                    if (res.success) {
                        let dates = res.data;
                        let registDates = [];
                        //登记日期筛选并去重
                        dates.forEach(function (e) {
                            let newDate = "";
                            let dateArray = e.regist_date.split("T")[0].split('-');
                            let yearMonth = dateArray[0] + "年" + dateArray[1] + "月";
                            newDate = yearMonth + dateArray[2] + "日";
                            registDates.push(newDate);
                        });
                        let registDatesNow = this.removeRepeat(registDates);
                        let dateYearMonth = [];
                        let newDates = [];
                        registDatesNow.forEach(function (e) {
                            let nowYearMonth = e.split("月")[0] + "月";
                            let nowDay = e.split("月")[1];
                            if (dateYearMonth && dateYearMonth.length > 0 && dateYearMonth.indexOf(nowYearMonth) > -1) {
                                for (let i = 0; i < newDates.length; i++) {
                                    let newYearMonth = newDates[i].split("月")[0] + "月";
                                    if (newYearMonth == nowYearMonth) {
                                        newDates[i] += "、" + nowDay;
                                    }
                                }
                            } else {
                                newDates.push(e);
                                dateYearMonth.push(nowYearMonth)
                            }
                        });
                        this.TTemplateId.registDates = newDates.join("、");
                        // queryCheckProjectAndHazardFactorsList({groupOrderId: this.radioValue}).then(res => {
                        queryCheckProjectAndHazardFactorsComboList({groupOrderId: this.radioValue}).then(res => {
                            if (res.success) {
                                //检查项目和危害因素
                                this.TTemplateId.groupDatas = res.data;
                                this.previewShow = true;
                            }
                        });
                    }
                });
            },
			//预览(复查报告)
			previewReviewData() {
				let _this = this;
				this.TTemplateId.id = "17aa34c2594e20120a1e95f823a1388c";
				this.previewName = "复查报告";
				this.TTemplateId.physicalUnit = this.unitReportForm.physicalUnit;//体检单位
				this.TTemplateId.entrustUnit = this.unitReportForm.entrustUnit;//委托单位
				let date = formartDate(new Date(), "yyyy-MM-dd");
				let dateArray = date.split('-');
				this.TTemplateId.year = dateArray[0];//年(体检日期)
				this.TTemplateId.month = dateArray[1];//月(体检日期)
				this.TTemplateId.day = dateArray[2];//日(体检日期)
				// this.TTemplateId.hazardFactors = this.unitReportForm.hazardFactors;//危害因素
                this.TTemplateId.physicalNumber = this.reviewData.filter(item => item.isRecheck == 1).length;//体检人数(复查)
                this.TTemplateId.filishNumber = this.reviewData.filter(item => item.isRecheck == 1 && item.reviewStatu == 1).length;//完成人数(复查)
                let reviewPersonListNow = this.reviewData;
                reviewPersonListNow.forEach(i => {
                    i.workTypeText = i.workTypeText.trim();
                })
                this.TTemplateId.recheckData = reviewPersonListNow;//复查人员名单
				//复查项目
				let groupDatasName = [];
				this.reviewData.forEach(function (e) {
					let portfolioProjectName = e.portfolioProjectName;
					if (groupDatasName && groupDatasName.indexOf(portfolioProjectName) <= -1) {
						groupDatasName.push(portfolioProjectName);
					}
				});
				let splitReviewName = groupDatasName.join("、").replaceAll(",","、").split("、");
				this.TTemplateId.groupDatasName = this.removeRepeat(splitReviewName).join("、") + "。";
				//复查登记时间查询
				queryRegistDateReview({groupOrderId: this.radioValue}).then(res => {
					if (res.success) {
						let dates = res.data;
						let reviewDates = [];
						dates.forEach(function (e) {
						    if(e && e.regist_date){
                                let newDate = "";
                                let dateArray = e.regist_date.split("T")[0].split('-');
                                newDate = dateArray[0] + "年" + dateArray[1] + "月" + dateArray[2] + "日";
                                reviewDates.push(newDate);
                            }
						});
						reviewDates = this.removeRepeat(reviewDates);
						let dateYearMonth = [];
						let newDates = [];
						reviewDates.forEach(function (e) {
                            if(e){
                                let nowYearMonth = e.split("月")[0] + "月";
                                let nowDay = e.split("月")[1];
                                if (dateYearMonth && dateYearMonth.length > 0 && dateYearMonth.indexOf(nowYearMonth) > -1) {
                                    for (let i = 0; i < newDates.length; i++) {
                                        let newYearMonth = newDates[i].split("月")[0] + "月";
                                        if (newYearMonth == nowYearMonth) {
                                            newDates[i] += "、" + nowDay;
                                        }
                                    }
                                } else {
                                    newDates.push(e);
                                    dateYearMonth.push(nowYearMonth)
                                }
                            }
						});
						this.TTemplateId.reviewDates = newDates.join("、");
                        queryReviewResultByOrderId({groupOrderId: this.radioValue}).then(res => {
                            let data = res.data;
                            let hazardFactorsNowArray = "";
                            for (var key in data){
                                let workStateNameNow = key;//体检类型
                                let hazardFactorsDataNow = data[workStateNameNow];
                                for (var keyH in hazardFactorsDataNow) {
                                    let hazardFactorsNow = keyH;//危害因素
                                    if(hazardFactorsNowArray != ""){
                                        hazardFactorsNowArray += "、" + hazardFactorsNow.replaceAll("|","、");
                                    }else{
                                        hazardFactorsNowArray += hazardFactorsNow.replaceAll("|","、");
                                    }
                                }
                            }
                            hazardFactorsNowArray = hazardFactorsNowArray.split("、");
                            hazardFactorsNowArray = _this.removeRepeat(hazardFactorsNowArray);
                            //危害因素
                            this.TTemplateId.hazardFactors = hazardFactorsNowArray.join("、");
                            //复查结果
                            this.TTemplateId.resultDatas = data;
                            this.previewShow = true;
                        })
					}
				});
			},
			//新增 单位报告
			add(params) {
				addTUnitReport(params).then(res => {
					if (res.success) {
						this.$Message.success("保存成功");
						this.getUnitReportData(this.unitReportForm.orderId);
					}
				}).finally(() => {
					this.disabled = true;
					this.updateShow = true;
					this.saveShow = false;
					this.saveLoading = false;
				});
			},
			//更新 单位报告
			update(params) {
				updateTUnitReport(params).then(res => {
					if (res.success) {
						this.$Message.success("保存成功");
						this.getUnitReportData(this.unitReportForm.orderId);
					}
				}).finally(() => {
					this.disabled = true;
					this.updateShow = true;
					this.saveShow = false;
					this.saveLoading = false;
				});
			},
			//格式化时间
			formatTime(e) {
				return formartDate(e, "yyyy-MM-dd");
			},
			//点击文字选中
			radioChooseClick(item) {
				this.unitReportForm.filishNumber = 0;
				this.radioValue = item.id;//左侧选中的值
				this.unitReportForm.orderId = this.radioValue;
				//右侧报告信息
				this.getUnitReportData(this.radioValue);
				this.getTOrderGroupInfo(this.radioValue);
				this.getCheckThePeopleStatisticsTable();
			},
			//左侧订单搜索
			search() {
				this.groupUnitForm.pageNumber = 1;
				this.getGroupOrderData();//订单信息查询
			},
			//获取 体检单位信息
			getGroupUnitData(id) {
				getTGroupUnit({id: id}).then(res => {
					if (res.success) {
						this.TTemplateId.unitAddress = res.data.address;//单位地址
					}
				});
			},
			//获取 订单信息
			getGroupOrderData() {
				this.groupUnitForm.physicalType = this.physicalType;
				this.checkPersonLoading = true;
				//输入了就不带时间
				if(this.groupUnitForm.groupUnitName && this.groupUnitForm.groupUnitName.trim().length>0 ){
					this.groupUnitForm.startDate = null;
					this.groupUnitForm.endDate = null;
                    this.date = '';//取消时间筛选
				}
				queryTGroupOrderList(this.groupUnitForm).then(res => {
					if (res.success) {
						this.groupOrderList = res.data.records;
						this.groupDataTotal = res.data.total;
						if (this.groupOrderList && this.groupOrderList.length > 0) {
							this.getGroupUnitData(this.groupOrderList[0].groupUnitId);//体检单位信息
							this.radioValue = this.groupOrderList[0].id;//左侧选中的值
							this.getUnitReportData(this.radioValue);//报告信息查询
							this.getTOrderGroupInfo(this.radioValue);
							this.getCheckThePeopleStatisticsTable();
						}
					}
				}).finally((() => {
					this.checkPersonLoading = false;
				}));
			},
			getTOrderGroupInfo(id) {
				getTOrderGroupByGroupOrderId({groupOrderId: id}).then(res => {
					if (res.success) {
						this.data = res.data;
					}
				})
			},
			//获取 报告相关信息(单位报告数据查询、订单基本信息查询、订单分组项目查询、订单体检人危害因素查询)
			getUnitReportData(id) {
				this.initForm();//初始化
				this.unitReportForm.orderId = id;//订单id
				//单位报告数据查询
				getTUnitReportByOrderId({orderId: id}).then(res => {
					if (res.success && res.data) {
						//数据库存有该订单相关信息 取出展示
						if (res.data.evaluationBasis) {
							//评价依据
							this.unitReportForm.evaluationBasis = res.data.evaluationBasis;
						} else {
							//评价依据
                            if(this.physicalType == "健康体检"){
                                this.unitReportForm.evaluationBasis = '《健康检查管理办法》(国家卫生健康委员会令第2号)、《健康监护技术规范GBZ188-2014》。';
                            }else{
                                this.unitReportForm.evaluationBasis = '《职业健康检查管理办法》(国家卫生健康委员会令第2号)、《职业健康监护技术规范GBZ188-2014》。';
                            }
						}
						if (res.data.concludingObservations) {
							//结论意见
							this.unitReportForm.concludingObservations = res.data.concludingObservations;
						} else {
                            //结论意见
                            if(this.physicalType == "健康体检"){
                                this.unitReportForm.concludingObservations = '本次健康检查发现详见：附表';
                            }else{
                                this.unitReportForm.concludingObservations = '本次职业健康检查发现详见：附表';
                            }
						}
						this.unitReportForm.id = res.data.id;
                        if (!this.unitReportForm.code) {
                            this.unitReportForm.code = res.data.code;//报告编号
                        }
						if (!this.unitReportForm.physicalNumber) {
							this.unitReportForm.physicalNumber = res.data.physicalNumber;//体检人数
						}
						if (!this.unitReportForm.physicalType) {
							this.unitReportForm.physicalType = res.data.physicalType;//体检类型
						}
						if (!this.unitReportForm.physicalUnit) {
							this.unitReportForm.physicalUnit = res.data.physicalUnit;//体检单位
						}
						if (!this.unitReportForm.entrustUnit) {
							this.unitReportForm.entrustUnit = res.data.entrustUnit;//委托单位
						}
						if (!this.unitReportForm.physicalDate) {
							this.unitReportForm.physicalDate = res.data.physicalDate;//体检日期
						}
						if (!this.unitReportForm.hazardFactors) {
							this.unitReportForm.hazardFactors = res.data.hazardFactors;//危害因素
						}
						if (!this.unitReportForm.physicalProject) {
							this.unitReportForm.physicalProject = res.data.physicalProject;//体检项目
						}
					} else {
                        //评价依据 结论意见
                        if(this.physicalType == "健康体检"){
                            this.unitReportForm.evaluationBasis = '《健康检查管理办法》(国家卫生健康委员会令第2号)、《健康监护技术规范GBZ188-2014》。';
                            this.unitReportForm.concludingObservations = '本次健康检查发现详见：附表';
                        }else{
                            this.unitReportForm.evaluationBasis = '《职业健康检查管理办法》(国家卫生健康委员会令第2号)、《职业健康监护技术规范GBZ188-2014》。';
                            this.unitReportForm.concludingObservations = '本次职业健康检查发现详见：附表';
                        }
					}
				});
				//订单基本信息查询
				this.getTGroupOrder(id);
				//查询检查项目和危害因素
				this.queryCheckProjectAndHazardFactors(id);
			},
			//订单基本信息查询
			getTGroupOrder(id) {
				getTGroupOrder({id: id}).then(res => {
					if (res.success) {
						this.unitReportData = res.data;
						//报告编号
                        if (!this.unitReportForm.code) {
                            let codeArray = res.data.orderCode.split("");
                            let numberLast = "";
                            let numberYear = "";
                            if(codeArray[0] == "6"){
                                numberLast = codeArray[9] + codeArray[10] + codeArray[11] + codeArray[12];
                                numberYear = codeArray[1] + codeArray[2] + codeArray[3] + codeArray[4];
                            }else{
                                numberLast = codeArray[8] + codeArray[9] + codeArray[10] + codeArray[11];
                                numberYear = codeArray[0] + codeArray[1] + codeArray[2] + codeArray[3];
                            }
                            if(this.physicalType == "健康体检"){
                                this.unitReportForm.code = ""+this.$hospitalName.unitCodeName+"检查【"+numberYear+"】第"+numberLast+"号";
                            }else{
                                this.unitReportForm.code = ""+this.$hospitalName.unitCodeName+"职检【"+numberYear+"】第"+numberLast+"号";
                            }
                        }
                        // this.unitReportForm.code = res.data.orderCode;
						this.signingTime = res.data.signingTime;//签发日期
						if (!this.unitReportForm.physicalNumber) {
							this.unitReportForm.physicalNumber = res.data.personCount;//体检人数
						}
						if (!this.unitReportForm.physicalType) {
							this.unitReportForm.physicalType = res.data.physicalType;//体检类型
						}
						if (!this.unitReportForm.physicalUnit) {
							this.unitReportForm.physicalUnit = res.data.groupUnitName;//体检单位
						}
						if (!this.unitReportForm.physicalDate) {
							this.unitReportForm.physicalDate = res.data.deliveryTime;//体检日期
						}
						this.salesDirectorName = res.data.salesDirectorName;//销售负责人名称
					}
				});
			},
			//订单分组项目查询
			queryCheckProjectAndHazardFactors(id) {
				queryCheckProjectAndHazardFactors({groupOrderId: id}).then(res => {
					if (res.success && res.data) {
						if (!this.unitReportForm.hazardFactors) {
							this.unitReportForm.hazardFactors = res.data.hazardFactorsText;//危害因素
						}
						if (!this.unitReportForm.physicalProject) {
							this.unitReportForm.physicalProject = res.data.physicalProject;//体检项目
						}
					}
				});
			},
			//数组去重
			removeRepeat(arr) {
				return Array.from(new Set(arr));
			},
			initForm() {
				this.unitReportForm = {
					id: '',//ID
					orderId: '',//订单ID
					code: '',//报告编号
					physicalUnit: '',//体检单位
					entrustUnit: this.$hospitalName.name,//委托单位
					hazardFactors: '',//危害因素
					physicalType: '',//体检类型
					physicalDate: null,//体检日期
					physicalNumber: '',//体检人数
					filishNumber: 0,//已完成人数
					physicalProject: '',//体检项目
					evaluationBasis: ' ',//评价依据
					concludingObservations: ' ',//结论意见
				};
				this.disabled = true;
				this.updateShow = true;
				this.saveShow = false;
				this.saveLoading = false;
				this.TTemplateId.personInfo = [];
				this.reviewRecordtotal = 0;//复查人数
				this.notAbnormalNumber = 0;//未见异常人数
				this.otherAbnormalNumber = 0;//其他异常人数
				this.contraindicationNumber = 0;//职业禁忌证人数
				this.doubtIsNumber = 0;//疑是职业病人数
				this.operateDoctor = '';//复查操作医生
				this.inspectionDoctor = '';//总检医生
				this.salesDirectorName = '';//销售负责人名称
			},
			personChangePageNum(v) {
				this.groupUnitForm.pageNumber = v;
				this.getGroupOrderData();
			},
			tabsClick(tab, event) {
				if (tab) {
					this.tabName = tab.label;
				}
				//第一项
				else {
					this.tabName = "检查人数统计表";
				}
                if(this.physicalType == "职业体检" || this.physicalType == "放射体检"){
                    switch (this.tabsValue) {
                        case "1":
                            this.tableData = this.CheckThePeopleStatisticsData;
                            break;
                        case "2":
                            this.tableData = this.CheckThePeopleStatisticsDataFinish;
                            break;
                        case "3":
                            this.tableData = this.reviewData;
                            break;
                        case "4":
                            this.tableData = this.personListData.filter(item => item.checkResult.indexOf("2") > -1);
                            break;
                        case "5":
                            this.tableData = this.personListData.filter(item => item.checkResult.indexOf("3") > -1);
                            break;
                        case "6":
                            this.tableData = this.personListData.filter(item => item.checkResult.indexOf("1") > -1);
                            break;
                        case "7":
                            this.tableData = this.personListData;
                            break;
                    }
                }else{
                    switch (this.tabsValue) {
                        case "7":
                            this.tableData = this.personListData;
                            break;
                        case "3":
                            this.tableData = this.reviewData;
                            break;
                    }
                }
			},
			getCheckThePeopleStatisticsTable() {
				checkThePeopleStatisticsTable({orderId: this.radioValue}).then(res => {
					if (res.success) {
                        this.CheckThePeopleStatisticsData = res.data.result1;
                        this.CheckThePeopleStatisticsDataFinish = res.data.resultFinish;
                        let result2 = res.data.result2;
                        let result3 = res.data.result3;

                        if (result2 && result2.length > 0) {//判断是否有复查
                            this.recheck = true;
                        } else {
                            this.recheck = false;
                        }

                        if(this.isUpdateUnitPage){
                            for (let i = 0; i < result2.length; i++) {
                                if(result2[i].workTypeText && result2[i].workTypeText.indexOf("其他") > -1){
                                    result2[i].workTypeText = result2[i].workName;
                                }
                                if((!result2[i].exposureWorkYear || result2[i].exposureWorkYear == 0) && (result2[i].exposureWorkMonth && result2[i].exposureWorkMonth != 0)){
                                    result2[i].exposureWorkYear = result2[i].exposureWorkMonth + "月"
                                }else if((result2[i].exposureWorkYear && result2[i].exposureWorkYear != 0) && (!result2[i].exposureWorkMonth || result2[i].exposureWorkMonth == 0)){
                                    result2[i].exposureWorkYear = result2[i].exposureWorkYear + "年"
                                }else if((!result2[i].exposureWorkYear || result2[i].exposureWorkYear == 0) && (!result2[i].exposureWorkMonth || result2[i].exposureWorkMonth == 0)){
                                    result2[i].exposureWorkYear = 0
                                }else{
                                    result2[i].exposureWorkYear = result2[i].exposureWorkYear + "年" + result2[i].exposureWorkMonth + "月"
                                }
                            }
                            for (let i = 0; i < result3.length; i++) {
                                if(result3[i].workTypeText && result3[i].workTypeText.indexOf("其他") > -1){
                                    result3[i].workTypeText = result3[i].workName;
                                }
                                if((!result3[i].exposureWorkYear || result3[i].exposureWorkYear == 0) && (result3[i].exposureWorkMonth && result3[i].exposureWorkMonth != 0)){
                                    result3[i].exposureWorkYear = result3[i].exposureWorkMonth + "月"
                                }else if((result3[i].exposureWorkYear && result3[i].exposureWorkYear != 0) && (!result3[i].exposureWorkMonth || result3[i].exposureWorkMonth == 0)){
                                    result3[i].exposureWorkYear = result3[i].exposureWorkYear + "年"
                                }else if((!result3[i].exposureWorkYear || result3[i].exposureWorkYear == 0) && (!result3[i].exposureWorkMonth || result3[i].exposureWorkMonth == 0)){
                                    result3[i].exposureWorkYear = 0
                                }else{
                                    result3[i].exposureWorkYear = result3[i].exposureWorkYear + "年" + result3[i].exposureWorkMonth + "月"
                                }
                            }
                        }

                        for (let i = 0; i < result2.length; i++) {
                            result2[i].registDate = formartDate(result2[i].registDate, "yyyy-MM-dd");
                        }
                        for (let i = 0; i < result3.length; i++) {
                            result3[i].registDate = formartDate(result3[i].registDate, "yyyy-MM-dd");
                        }

						this.reviewData = result2;
						this.personListData = result3.filter(item => item.isPass > 3);
                        if(this.physicalType != "职业体检" && this.physicalType != "放射体检"){
                            this.tabsValue = '7';
                        }
                        for (let i = 0; i < this.personListData.length; i++) {
                            // this.personListData[i].registDate = formartDate(this.personListData[i].registDate,"yyyy-MM-dd");
                            if(this.physicalType == "职业体检" || this.physicalType == "放射体检"){
                                if(this.isUpdateUnitPage){
                                    if(this.personListData[i].isRecheck == 1 || this.personListData[i].checkResult.indexOf("2") > -1 || this.personListData[i].checkResult.indexOf("3") > -1 || this.personListData[i].checkResult.indexOf("4") > -1){
                                        this.personListData[i].isRecheck = "异常";
                                    }else{
                                        this.personListData[i].isRecheck = "目前未见异常";
                                    }
                                }else{
                                    if(this.personListData[i].isRecheck == 1 || this.personListData[i].checkResult.indexOf("2") > -1 || this.personListData[i].checkResult.indexOf("3") > -1 || this.personListData[i].checkResult.indexOf("4") > -1){
                                        this.personListData[i].isRecheck = "异常";
                                    }else{
                                        this.personListData[i].isRecheck = "正常";
                                    }
                                }
                            }else{
                                if(this.isUpdateUnitPage){
                                    if(this.personListData[i].isRecheck == 1){
                                        this.personListData[i].isRecheck = "异常";
                                    }else{
                                        this.personListData[i].isRecheck = "目前未见异常";
                                    }
                                }else{
                                    if(this.personListData[i].isRecheck == 1){
                                        this.personListData[i].isRecheck = "异常";
                                    }else{
                                        this.personListData[i].isRecheck = "正常";
                                    }
                                }
                            }
                        }
                        this.personListAllData = result3;
						this.tabsClick();
					}
				});
			},
			formatNumber({cellValue, row, column}) {
				return Number(row.recheckNum) + Number(row.noAbnormalNum) + Number(row.otherAbnormalNum)
			}
		},
		watch: {},
		computed: {
			physicalType() {
				return this.$store.state.theme.theme.physicalType;
			},
		},
		mounted() {
			this.date = "当日";
			this.pick("当日");
			//是否修改单位页面
            if(this.$hospitalName.isUpdateUnitPage){
                this.isUpdateUnitPage = this.$hospitalName.isUpdateUnitPage;
            }
			// 计算高度
			let height = document.documentElement.clientHeight;
			this.tableMaxHeight = height - 600;
			window.onresize = () => {
				// 计算高度
				let height = document.documentElement.clientHeight;
				this.tableMaxHeight = height - 600;
			};
			//体检单位
			queryAllTGroupUnitList({physicalType: this.physicalType}).then(res => {
				if (res.success) {
					this.unitDataArry = res.data;
				}
			});
		}
	}
</script>

<style lang="less">
    .unitReport {

        .btngroup {
            display: flex;

            .ivu-radio-group-item {
                padding: 0 6px;
                font-size: 13px;
            }
        }

        .radio-group {
            width: 100%;

            &::-webkit-scrollbar {
                width: 0;
                /*隐藏滚轮*/
                display: none;
            }

            .border-blue {
                border: 1px solid #0000FF;
                border-radius: 8px;
                text-align: center;
                color: #0000FF;
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

            .row-border {
                margin-left: 0 !important;
                padding-top: 10px;
                padding-bottom: 10px;
                cursor: pointer;
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


        .left-item {
            margin: 10px 0;
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

        .ivu-radio-wrapper {
            font-size: 0;
        }

        .ivu-form-inline {
            margin-bottom: 0px !important;
        }

        .ivu-avatar-large {
            width: 50px;
            height: 50px;
            line-height: 50px;
        }

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

        .radio-group {
            overflow: auto;
            width: 100%;
            height: 95%;
            padding-bottom: 30px;

            &::-webkit-scrollbar {
                width: 0;
            }

            .row-border {
                padding-top: 10px;
                padding-bottom: 10px;
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
                .border-purple {
                    border: 1px solid orangered;
                    border-radius: 8px;
                    text-align: center;
                    color: orangered;
                }
            }
        }

        .rightTimeLine {
            margin-top: 16px;
            max-height: 700px;
            overflow: hidden;
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 0;
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

        //样式修改
        .ivu-input {
            background: none;
            color: #515a6e;
        }

        .ivu-select-disabled .ivu-select-selection {
            background-color: #f3f3f3;
            background: none;
            opacity: 1;
            cursor: not-allowed;
            color: #ccc;
            color: #515a6e;
        }


        .choice {
            position: absolute;
            right: -5px;
            bottom: 6px;
            z-index: 10;
            height: 20px;
            width: 20px;
            padding: 0px;
        }

        .ivu-card-body {
            height: 100%;
            overflow: auto;
        }

        .empty {
            text-align: center;
            color: #515a6e;
            margin-top: 20px;
        }

        .ivu-form-item {
            margin-bottom: 5px !important;
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
            flex: 0 0 98% !important;
            max-width: 98% !important;
        }

        .expand {
            display: flex;
            align-items: center;
        }
    }
</style>
