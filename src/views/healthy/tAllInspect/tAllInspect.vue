<template>
    <div class="tAllInspect">
        <Row :gutter="4" style="flex-wrap: nowrap;">
            <Col :style="outLeftSpan" v-if="outExpand">
                <Card class="card">
                    <Row style="display: flex;">
                        <RadioGroup v-model="status" @on-change="statusChange" style="margin-bottom: 10px;width: 80%;">
                            <Radio label="在检"></Radio>
                            <Radio label="待总检"></Radio>
                            <Radio label="已总检"></Radio>
                        </RadioGroup>
                        <div style="width: 20%;text-align: right;">
                            <i-switch size="large" @on-change="typeChange" v-model="typeStatus" style="text-align: center;">
                                <span slot="open">复查</span>
                                <span slot="close">非复查</span>
                            </i-switch>
                        </div>
                    </Row>
                    <RadioGroup v-if="queryTime" type="button" size="small" class="btngroup" button-style="solid" v-model="date"
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
                        <Radio label="重置"  style="cursor: pointer;"></Radio>
                    </RadioGroup>
                    <div v-if="!queryTime" style="display: flex;flex-wrap: nowrap;align-items: center;margin-bottom: 10px">
                        <DatePicker type="date" transfer @on-change="datePickerSeacTime"  v-model="personParam.startDate"  placeholder="开始时间" />
                        &nbsp;~&nbsp;
                        <DatePicker type="date" transfer @on-change="datePickerEndTime" v-model="personParam.endDate" placeholder="结束时间" />
                    </div>
                    <Row style="display: flex;flex-wrap: wrap;">
                        <!--<Input suffix="ios-search" v-model="personParam.keyword"
                               clearable placeholder="请输入关键字"
                               class="search-input"
                               @on-clear="inputSearchChange('')"
                               @keypress.native.enter="inputSearchChange"/>-->
                        <Input v-model="personParam.personName" placeholder="请输入姓名" @on-clear="inputSearchChange('')"
                               @keypress.native.enter="inputSearchChange" style="margin-bottom: 10px;" clearable/>
                        <Input v-model="personParam.testNum" placeholder="请输入体检编号" @on-clear="inputSearchChange('')"
                               @keypress.native.enter="inputSearchChange" style="margin-bottom: 10px;" clearable v-if="drop"></Input>
                        <Input v-model="personParam.dept" placeholder="请输入单位名称" @on-clear="inputSearchChange('')"
                               @keypress.native.enter="inputSearchChange" style="margin-bottom: 10px;" clearable v-if="drop"></Input>
                        <Button type="primary" @click="inputSearchChange" size="small">查询</Button>
                        <Button v-if="!queryTime"  @click="resetSearchForm('重置')" size="small">重置</Button>
                        <a class="drop-down" @click="dropDown">
                            {{dropDownContent}}
                            <Icon :type="dropDownIcon"></Icon>
                        </a>
                    </Row>
                    <!--左侧套餐列-->
                    <Row :style="{'height': 'calc(100% - '+height1+')'}" style="justify-content: center;">
                        <RadioGroup class="radio-group" v-model="radioValue" v-if="personList.length > 0">
                            <Row style="margin-left: 15px;" class="row-border" v-for="(item,index) in personList"
                                 :key="index" @click.native="radioChooseClick(item)">
                                <Col :span="4" class="radio-group-radio">
                                    <Radio class="label" :label="item.id" :disabled="radioShow"></Radio>
                                </Col>
                                <Col :span="15" class="radio-group-content">
                                    <div style="display: inline-block;width: 80px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                                         :title="item.personName">
                                        {{ item.personName }}
                                    </div>
                                    <div style="margin-right: 10px;">{{ item.sex }}</div>
                                    <div>{{ item.age }}</div>
                                </Col>
                                <Col :span="5" style="padding-left: 0;">
                                    <Row :gutter="6">
                                        <Col :span="12">
                                            <div class="border-blue" v-if="item.physicalType && item.physicalType.indexOf('职业') != -1">
                                                职
                                            </div>
                                            <div class="border-green" v-if="item.physicalType && item.physicalType.indexOf('健康') != -1">
                                                健
                                            </div>
                                            <div class="border-yellow" v-if="item.physicalType && item.physicalType.indexOf('从业') != -1">
                                                从
                                            </div>
                                            <div class="border-purple" v-if="item.physicalType.indexOf('放射') != -1">
                                                放
                                            </div>
                                        </Col>
                                        <Col :span="12">
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
                        <no-data v-if="personList.length < 1"></no-data>
                        <Spin fix v-if="checkPersonLoading">
                            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                            <div>加载中...</div>
                        </Spin>
                        <Page v-if="personList.length > 0" :current="personParam.pageNumber" :total="personTotal" simple
                              @on-change="personChangePageNum"/>
                    </Row>
                </Card>
            </Col>

            <div class="expand">
                <Icon :type="outExpandIcon" size="16" class="icon" @click="outChangeExpand"/>
            </div>

            <Col :style="outSpan" height="calc(100vh - 128px)" v-if="personInfo.id">
                <Card v-if="ShutDown">
                    <Form>
                        <Row :gutter="10" style="flex-wrap: nowrap;">
                            <Col span="3" style="min-width: 160px;">
                                <div class="pic">
                                    <div class="pic-box" v-viewer="{movable: false}" :style="{'border':personInfo.avatar?'0 !important;':'auto'}">
                                        <img :src="srcImage(personInfo.avatar)" style="height: 100%;width: 100%;"
                                             v-if="personInfo.avatar">
                                        <img src="../../../assets/user-avatar.png" style="height: 100%;width: 100%;padding:5px;"
                                             v-if="!personInfo.avatar">
                                    </div>
                                </div>
                            </Col>
                            <Col span="21" style="display: flex;flex-direction: column; justify-content: space-between;">
                                <Row style="display: flex;align-items: center;">
                                    <Col span="24">
                                        <div class="wrap">
                                            <step :index="currentIndex"></step>
                                        </div>
                                    </Col>
                                </Row>
                                <Row class="txtFrom">
                                    <Col :span="6">
                                        <FormItem label="体检编号">
                                            {{ personInfo.test_num || personInfo.testNum }}
                                        </FormItem>
                                    </Col>
                                    <Col :span="6">
                                        <FormItem label="身份证号">
                                            {{ personInfo.id_card || personInfo.idCard }}
                                        </FormItem>
                                    </Col>
                                    <Col :span="6">
                                        <FormItem :label="setLabel('姓名')">
                                            {{ personInfo.person_name || personInfo.personName }}
                                        </FormItem>
                                    </Col>
                                    <Col :span="6">
                                        <FormItem :label="setLabel('性别')">
                                            {{ personInfo.sex }}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row class="txtFrom">
                                    <Col :span="6">
                                        <FormItem :label="setLabel('年龄')">
                                            {{ personInfo.age }}岁
                                        </FormItem>
                                    </Col>
                                    <!--<Col :span="6">
                                        <FormItem label="体检类型">
                                            {{ personInfo.physical_type || personInfo.physicalType }}
                                        </FormItem>
                                    </Col>-->
                                    <Col :span="6">
                                        <FormItem label="电话号码">
                                            <Tooltip transfer max-width="200"
                                                     :content="personInfo.mobile">
                                                {{ personInfo.mobile }}
                                            </Tooltip>
                                        </FormItem>
                                    </Col>

                                    <Col :span="6">
                                        <FormItem label="单位名称">
                                            <Tooltip transfer max-width="200"
                                                     :content="personInfo.unit_name">
                                                {{ personInfo.unit_name&& personInfo.unit_name.length>12?personInfo.unit_name.substring(0,10)+"...":personInfo.unit_name}}
                                            </Tooltip>
                                        </FormItem>
                                    </Col>
                                    <Col :span="6">
                                        <FormItem label="登记时间">
                                            {{personInfo.regist_date || personInfo.registDate }}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row v-if="(personInfo.physical_type == '职业体检' || personInfo.physicalType == '职业体检') || (personInfo.physical_type == '放射体检' ||
                                personInfo.physicalType == '放射体检')" class="txtFrom">
                                    <Col :span="6">
                                        <FormItem label="危害因素">
                                            <Tooltip transfer max-width="200"
                                                     :content="personInfo.hazard_factors_text">
                                                {{ personInfo.hazard_factors_text || personInfo.hazardFactorsText }}
                                            </Tooltip>
                                        </FormItem>
                                    </Col>
                                    <Col :span="6">
                                        <FormItem label="检查种类">
                                            {{ personInfo.work_state_text || personInfo.workStateText }}
                                        </FormItem>
                                    </Col>
                                    <Col :span="6">
                                        <FormItem label="目标职业病">
                                            <Tooltip transfer max-width="200"
                                                     :content="personInfo.occupational_diseases">
                                                {{ personInfo.occupational_diseases || personInfo.occupationalDiseases }}
                                            </Tooltip>
                                        </FormItem>
                                    </Col>
                                    <Col :span="6">
                                        <FormItem label="目标职业禁忌证">
                                            <Tooltip transfer max-width="200" :content="personInfo.occupational_taboo">
                                                {{ personInfo.occupational_taboo || personInfo.occupationalTaboo }}
                                            </Tooltip>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <div style="display: flex;margin-top: 10px;">
                            <Button @click="resultSummary" type="primary" icon="md-list" v-width="150">阳性结果汇总</Button>
                            <Button @click="resultLook" type="info" icon="ios-eye-outline" v-width="150">明细结果查看</Button>
                            <!--<Button @click="batchInspection" type="success" :loading="batchLoading"
                                    icon="ios-repeat" v-width="150"
                                    v-if="status == '待总检' && personList.length > 0"
                            >批量总检
                            </Button>-->
                        </div>
                    </Form>
                </Card>
                <div style="width: 100%;text-align: center;">
                    <a class="drop-down" @click="dropDown1">
                        <Icon :type="ShutDownIcon" :size="20"></Icon>
                    </a>
                </div>
                <Card class="inspect">
                    <Row :gutter="20" style="margin-bottom: -10px;">
                        <Col span="7">
                            <div>
                                <Tabs value="name1">
                                    <TabPane label="危机值提示" name="name1">
                                        <Table :loading="crisisLoading"
                                               height="385"
                                               border :columns="crisisColumn"
                                               sortable="custom"
                                               :data="crisisData"
                                               ref="table"
                                               style="margin-top: 10px;">
                                        </Table>
                                    </TabPane>
                                    <TabPane label="体检提醒" name="name2">
                                        <myWangEditor class="textarea" id="editor" :editorContent="remind"
                                                      ref="myWangEditor"></myWangEditor>
                                    </TabPane>
                                    <TabPane :label="noInsProject" name="name3">
                                        <Table :loading="noInsProjectLoading"
                                               height="385" border
                                               :columns="noInsProjectColumn"
                                               sortable="custom"
                                               :data="noInsProjectData"
                                               ref="table"
                                               style="margin-top: 10px;">
                                        </Table>
                                    </TabPane>
                                    <TabPane :label="abandonProject" name="name4">
                                        <Table :loading="abandonProjectLoading"
                                               height="385" border
                                               :columns="abandonProjectColumn"
                                               sortable="custom"
                                               :data="abandonProjectData"
                                               ref="abandonTable"
                                               style="margin-top: 10px;">
                                        </Table>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Col>
                        <Col span="17">
                            <Row class="btn-sty" style="margin-top: 15px">
                                <Col span="10">
                                </Col>
                                <Col span="14" class="btn">
                                </Col>
                            </Row>
                            <Row justify="end">
                                <Table :loading="tableLoading" border height="400" :columns="columns" sortable="custom" :data="tableData" ref="table"
                                       style="width: 100%;" :row-class-name="rowClassName1">
                                    <template slot-scope="{ row, index }" slot="action">
                                        <Button  size="small" @click.native="handleViewClickAnomaly(row,index)"
                                                icon="ios-eye-outline">查看
                                        </Button>
                                    </template>
                                </Table>
                            </Row>
                        </Col>
                    </Row>
                    <Row :gutter="50" style="margin-top: 10px">
                        <Col span="12"
                             v-if="((personInfo.physical_type == '从业体检' || personInfo.physicalType == '从业体检') || (personInfo.physical_type == '健康体检' || personInfo.physicalType == '健康体检')) && isInspectionChange">
                            <Button class="choice" type="primary" style="bottom: 2px;left: 25px;width: 65px;margin-right: 0px;"
                                    @click="clickReviewResult" v-if="isReviewResult || personInfo.is_recheck || personInfo.isRecheck">复查结论
                            </Button>
                            <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>体检结果</div>
                            <div class="textareaResult">
                                <Input type="textarea" v-model="inspectForm.conclusion" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>
                        <Col span="12"
                             v-if="((personInfo.physical_type == '从业体检' || personInfo.physicalType == '从业体检') || (personInfo.physical_type == '健康体检' || personInfo.physicalType == '健康体检')) && isInspectionChange">
                            <Button class="choice" type="primary" style="width: 65px;"
                                    @click="handleWordChoose('zjzybmc')">主检结论
                            </Button>
                            <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>主检结论</div>
                            <div class="textareaResult">
                                <Input type="textarea" v-model="conclusionNow" :disabled="true" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>
                        <Col span="12"
                             v-if="((personInfo.physical_type == '从业体检' || personInfo.physicalType == '从业体检') || (personInfo.physical_type == '健康体检' || personInfo.physicalType == '健康体检')) && isInspectionChange">
                            <Button class="choice" type="primary"
                                    @click="handleWordChoose('zjclyj')">选
                            </Button>
                            <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>主检建议</div>
                            <div class="textareaResult">
                                <Input type="textarea" v-model="inspectForm.handleOpinion" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>

                        <Col span="12"
                             v-if="((personInfo.physical_type == '从业体检' || personInfo.physicalType == '从业体检') || (personInfo.physical_type == '健康体检' || personInfo.physicalType == '健康体检')) && !isInspectionChange">
                            <!--<Button class="choice" type="primary" style="bottom: 2px;left: 25px;width: 65px;margin-right: 0px;"
                                    @click="clickReviewResult" v-if="isReviewResult || personInfo.is_recheck || personInfo.isRecheck">复查结果
                            </Button>-->
                            <Button class="choice" type="primary" style="width: 65px;"
                                    @click="handleWordChoose('zjzybmc')">体检结论
                            </Button>
                            <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>体检结论</div>
                            <div class="textareaResult">
                                <Input type="textarea" v-model="inspectForm.conclusion" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>
                        <Col span="12"
                             v-if="((personInfo.physical_type == '从业体检' || personInfo.physicalType == '从业体检') || (personInfo.physical_type == '健康体检' || personInfo.physicalType == '健康体检')) && !isInspectionChange">
                            <Button class="choice" type="primary"
                                    @click="handleWordChoose('zjclyj')">选
                            </Button>
                            <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>处理意见</div>
                            <div class="textareaResult">
                                <Input type="textarea" v-model="inspectForm.handleOpinion" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>
                    </Row>
                    <Row :gutter="50" v-if="(personInfo.physical_type == '职业体检' || personInfo.physicalType == '职业体检') || (personInfo.physical_type == '放射体检' ||
                        personInfo.physicalType == '放射体检')">
                        <Col span="12" v-if="isInspectionChange">
                            <!--<Button class="choice" type="primary" style="bottom: 2px;left: 25px;width: 65px;margin-right: 0px;"
                                    @click="clickReviewResult" v-if="isReviewResult || personInfo.is_recheck || personInfo.isRecheck">复查结果
                            </Button>-->
                            <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>体检结果</div>
                            <div class="textareaResult">
                                <Input type="textarea" v-model="inspectForm.conclusion" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>
                        <Col span="12" v-if="isInspectionChange">
                            <div class="choice" type="primary" style="bottom: 2px;right: 90px;width: 150px;display: flex;flex-direction: row;justify-content: right;">
                                <div v-if="isContraindication">
                                    <Button type="primary" style="bottom: 2px;width: 80px;height: 20px;display: flex;flex-direction: row;justify-content: center;"
                                            @click="handleWordChooseOccupation('zyjjz')" v-if="isContraindication">职业禁忌证
                                    </Button>
                                </div>
                                <div v-if="isDiseases">
                                    <Button type="primary" style="bottom: 2px;width: 80px;height: 20px;display: flex;flex-direction: row;justify-content: center;"
                                            @click="handleWordChooseDiseases('zyb')" v-if="isDiseases">疑似职业病
                                    </Button>
                                </div>
                            </div>
                            <Button class="choice" type="primary" style="bottom: 2px;width: 65px;"
                                    @click="handleWordChoose('zjzybmc')">主检结论
                            </Button>
                            <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>主检结论</div>
                            <div class="textareaResult">
                                <Input type="textarea" style="background-color: #fff;color: #515a6e;" :disabled="true" v-model="conclusionNow" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>
                        <Col span="12" v-if="isInspectionChange">
                            <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>主检建议</div>
                            <div class="textareaResult" style="position: relative;">
                                <Button class="choice" type="primary" style="right: -4px;"
                                        @click="handleWordChoose('zjclyj')">选
                                </Button>
                                <Input type="textarea" v-model="inspectForm.handleOpinion" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>

                        <Col span="12" v-if="!isInspectionChange">
                            <div class="choice" type="primary" style="bottom: 2px;right: 90px;width: 150px;display: flex;flex-direction: row;justify-content: right;">
                                <div v-if="isContraindication">
                                    <Button type="primary" style="bottom: 2px;width: 80px;height: 20px;display: flex;flex-direction: row;justify-content: center;"
                                            @click="handleWordChooseOccupation('zyjjz')" v-if="isContraindication">职业禁忌证
                                    </Button>
                                </div>
                                <div v-if="isDiseases">
                                    <Button type="primary" style="bottom: 2px;width: 80px;height: 20px;display: flex;flex-direction: row;justify-content: center;"
                                            @click="handleWordChooseDiseases('zyb')" v-if="isDiseases">疑似职业病
                                    </Button>
                                </div>
                            </div>
                            <!--<Button class="choice" type="primary" style="bottom: 2px;left: 25px;width: 65px;margin-right: 0px;"
                                    @click="clickReviewResult" v-if="isReviewResult || personInfo.is_recheck || personInfo.isRecheck">复查结果
                            </Button>-->
                            <Button class="choice" type="primary" style="bottom: 2px;width: 65px;"
                                    @click="handleWordChoose('zjzybmc')">体检结论
                            </Button>
                            <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>体检结论</div>
                            <div class="textareaResult">
                                <Input type="textarea" v-model="inspectForm.conclusion" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>
                        <Col span="12" v-if="!isInspectionChange">
                            <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>处理意见</div>
                            <div class="textareaResult" style="position: relative;">
                                <Button class="choice" type="primary" style="right: -4px;"
                                        @click="handleWordChoose('zjclyj')">选
                                </Button>
                                <Input type="textarea" v-model="inspectForm.handleOpinion" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>

                        <Col span="12">
                            <Button class="choice" type="primary" style="bottom: 2px;"
                                    @click="handleWordChoose('zjqtjcycjg')">选
                            </Button>
                            <div class="txt">其他疾病或异常描述</div>
                            <div class="textareaException">
                                <Input type="textarea" v-model="inspectForm.otherCheckAbnormalResults" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>

                        <Col span="12">
                            <Button class="choice" type="primary" style="bottom: 2px;"
                                    @click="handleWordChoose('qtjbycclyj')">选
                            </Button>
                            <div class="txt">其他疾病异常处理意见</div>
                            <div class="textareaException">
                                <Input type="textarea" v-model="inspectForm.careerIllnessName" :autosize="{maxRows: 2,minRows: 2}"></Input>
                            </div>
                        </Col>
                    </Row>

                    <Row :gutter="50" v-if="(personInfo.physical_type == '职业体检' || personInfo.physicalType == '职业体检') || (personInfo.physical_type == '放射体检' ||
                        personInfo.physicalType == '放射体检')">
                        <Col span="24">
                            <Row>
                                <Col span="24">
                                    <Form ref="inspectForm" class="inspectForm" :model="inspectForm"
                                          style="margin-top:30px;padding: 10px 10px 10px 0;" :label-width="90">
                                        <Row :gutter="20">
                                            <Col style="display: flex;margin: auto 0;line-height: 32px;">
                                                <div style="display: flex;">
                                                    <div style="white-space: nowrap;">总检医生：</div>
                                                    <img style="width: 100px;height: 30px;"
                                                         :src="inspectForm.inspectionAutograph ? inspectForm.inspectionAutograph.indexOf('/dcm') > -1 ? inspectForm.inspectionAutograph : 'data:image/png;base64,' + inspectForm.inspectionAutograph:doctorInfo.autograph">
                                                </div>
<!--                                                <div style="margin-left: 20px;white-space: nowrap;">总检日期：{{ inspectForm.inspectionDate }}</div>-->
                                            </Col>
                                            <Col>
                                                <FormItem label="总检日期：">
                                                    <DatePicker type="datetime" v-model="inspectForm.inspectionDate" transfer placeholder="请选择总检日期" style="width: 175px"></DatePicker>
                                                </FormItem>
                                            </Col>
                                            <Col class="bottom-btn">
                                                <Button type="primary" @click="addRecordClick"
                                                        v-if="(personInfo.is_pass == 3 || personInfo.isPass == 3)||(personInfo.is_pass == 5 || personInfo.isPass == 5)"
                                                        :loading="inspectionLoading">保存
                                                </Button>
                                                <Button type="warning"
                                                        @click="addRecordClick"
                                                v-else-if="(personInfo.is_pass >= 4 || personInfo.isPass >= 4)"
                                                        :loading="inspectionLoading">已总检</Button>
                                                <Button type="primary" @click="reportPreview" v-show="personList.length > 0">报告总览</Button>
                                                <Button type="primary" @click="reviewRecordClick"
                                                        v-show="(personInfo.is_pass == 3 || personInfo.isPass == 3) || (personInfo.is_pass == 4 || personInfo.isPass == 4) || (personInfo.is_pass == 5 || personInfo.isPass == 5)">
                                                    复查
                                                </Button>
                                                <Button type="primary" @click="auditingReportClick"
                                                        v-show=" (personInfo.is_pass == 4 || personInfo.isPass == 4) || (personInfo.is_pass == 5 || personInfo.isPass == 5)">
                                                    审核个人报告
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Form ref="inspectForm"
                          v-if="(personInfo.physical_type == '从业体检' || personInfo.physicalType == '从业体检') || (personInfo.physical_type == '健康体检' || personInfo.physicalType == '健康体检')"
                          :model="inspectForm"
                          style="margin-top:30px;padding: 10px 10px 10px 0;" :label-width="90">
                        <Row :gutter="24">
                            <Col span="5">
                                <FormItem label="总检医生">
                                    <img style="width: 150px;height: 30px;"
                                         :src="inspectForm.inspectionAutograph ? inspectForm.inspectionAutograph.indexOf('/dcm') > -1 ? inspectForm.inspectionAutograph : 'data:image/png;base64,' + inspectForm.inspectionAutograph:doctorInfo.autograph">
                                </FormItem>
                            </Col>
                            <Col span="5">
                                <Col>
                                    <FormItem label="总检日期：">
                                        <DatePicker type="datetime" v-model="inspectForm.inspectionDate" transfer placeholder="请选择总检日期" style="width: 175px"></DatePicker>
                                    </FormItem>
                                </Col>
                            </Col>
                            <Col :span="6" v-if="personInfo.physical_type && personInfo.physical_type.indexOf('从业体检') !== -1">
                                <FormItem label="健康证条件">
                                    <Select v-model="inspectForm.healthCertificateConditions" transfer>
                                        <Option v-for="(item,index) in healthConditionList" :value="item.value" :key="index">{{ item.title }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8" class="bottom-btn">
                                <Button type="primary" @click="addRecordClick"
                                        v-if="(personInfo.is_pass == 3 || personInfo.isPass == 3) || (personInfo.is_pass == 4 || personInfo.isPass == 4) || (personInfo.is_pass == 5 || personInfo.isPass == 5)"
                                        :loading="inspectionLoading">保存
                                </Button>
                                <Button type="warning"
                                        @click="addRecordClick"
                                        v-else-if="(personInfo.is_pass == 4 || personInfo.isPass == 4)"
                                        :loading="inspectionLoading">已总检</Button>
                                <Button type="primary" @click="reportPreview" v-show="personList.length > 0">报告总览</Button>
                                <Button type="primary" @click="reviewRecordClick"
                                        v-show="(personInfo.is_pass == 4 || personInfo.isPass == 4) || (personInfo.is_pass == 5 || personInfo.isPass == 5)">
                                    复查
                                </Button>
                                <Button type="primary" @click="auditingReportClick"
                                        v-show="(personInfo.physical_type == '健康体检' || personInfo.physicalType == '健康体检') && ((personInfo.is_pass == 4 || personInfo.isPass == 4) || (personInfo.is_pass == 5 || personInfo.isPass == 5))">
                                    审核个人报告
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Spin fix v-if="personInfoLoading"></Spin>
            </Col>
            <Col v-else :style="outSpan">
                <Card>
                    <no-data width="150" style="height: calc(100vh - 129px);overflow:hidden;display:flex;flex-direction:row;justify-content:center;"></no-data>
                </Card>
            </Col>
        </Row>
        <Modal :title="modelTitle" v-model="modalVisible" :mask-closable="false" class="result" :width="1300">
            <el-tabs value="name1" @tab-click="resultClick" class="details-result">
                <el-tab-pane label="明细结果" name="name1">
                    <Card>
                        <Row type="flex" justify="space-between">
                            <Col span="3" style="position: relative">
                                <div style="position: relative">
                                    <div class="tree-bar" :style="{ maxHeight: maxHeight }">
                                        <!--<Tree  ref="tree" :data="treeData" @on-select-change="selectTree"></Tree>-->
                                        <div style="margin-left: 12px;margin-top: 7px" v-for="(item,i) in treeData" :id="'trees'+item.officeId" @click="clickSelectTree(item)">{{item.title}}
                                            <Icon :id="'icon'+item.officeId" type="ios-alert-outline"/></div>
                                    <Spin size="large" fix v-if="treeLoading"></Spin>
                                </div>
                                </div>
                            </Col>

                            <Col span="20">
                                <div v-if="officeName == '问诊科'">
                                    <otherInfo :personInfo="personWZInfo" :status="1" ref="otherInfo"></otherInfo>
                                    <Spin size="large" fix v-if="wzShow"></Spin>
                                </div>
                                <!--分组项目-->
                                <div v-if="officeName!= '问诊科'" ref="tab" :style="{'borderTop':tabsArr.length>0?'':'1px dashed #ccc'}">
                                <el-tabs  v-if="tabsArr.length > 0 && officeName != '问诊科'" type="border-card" style="width: 100%;margin-top:10px;"
                                         v-model="tabsValue" @tab-click="tabsClick">
                                    <el-tab-pane style="margin-bottom: 10px;"
                                                 v-for="(item,index) in tabsArr"
                                                 :label="item.groupItemName"
                                                 :name="item.id"
                                                 :key="index">
                                        <span slot="label"><Icon :id="'elIcon'+item.id" type="ios-alert-outline"/>{{item.groupItemName}}</span>
                                        <div v-if="item.isFile=='是'">
                                            <Row style="height: 240px;border: 1px solid #DCDEE2;border-top: 0;overflow: auto;">
                                                <Col span="24" style="justify-content: center;align-items: center;">
                                                    <div>
                                                        <Table :loading="loading"
                                                               border
                                                               :columns="getColumnsYX()"
                                                               sortable="custom"
                                                               :data="baseProjectData"
                                                               :row-class-name="rowClassName">
                                                        </Table>
                                                    </div>
                                                    <div v-viewer="{movable: false,zIndex:7000}" style="height: 80%;width: 100%;display: flex;justify-content: center;align-items: center;">
                                                        <img v-for="(item,index) in pacsData" :key="index" :src="item"
                                                             style="width: 200px;height: 200px;border:1px dashed #ccc;margin-right:20px;">
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>

                                        <!--列表-->
                                        <div v-if="item.isFile == '否' || item.isFile==null || item.isFile == ''">
                                            <Table :loading="loading"
                                                   border
                                                   :columns="resultColumn"
                                                   sortable="custom"
                                                   :data="baseProjectData"
                                                   :row-class-name="rowClassName"
                                                   height="280">
                                            </Table>
                                        </div>

                                        <Form :label-width="30" style="margin: 20px 2px 10px;border-bottom:0;" inline>
                                            <Row style="flex-wrap: nowrap">
                                                <Col span="10" style="position: relative">
                                                    <!--<Button style="position: absolute; right: -4px;bottom: 1px; z-index: 10;"
                                                            type="primary"
                                                            @click="handleWordChoose('zdtx')">选
                                                    </Button>-->
                                                    <label style="font-size: 14px;font-weight: 600;margin-bottom: 15px;">体检提醒或影像所见</label>
                                                    <Input type="textarea"
                                                           v-model="item.diagnoseTip"
                                                           placeholder="输入多个以;分隔"
                                                           class="result-textarea"
                                                           :autosize="{maxRows: 6,minRows: 6}"/>
                                                </Col>
                                                <Col span="2"></Col>
                                                <Col span="10" style="margin-left: 16px;">
                                                    <!--<Button style="position: absolute; right: -4px;  bottom:1px; z-index: 10;"
                                                            @click="handleWordChoose('zdxj')" type="primary">选
                                                    </Button>-->
                                                    <label style="font-size: 14px;font-weight: 600;margin-bottom: 15px;">体检小结</label>
                                                    <Input type="textarea"
                                                           placeholder="输入多个以;分隔"
                                                           v-model="item.diagnoseSum"
                                                           class="result-textarea"
                                                           :autosize="{maxRows: 6,minRows: 6}"/>
                                                </Col>
                                            </Row>
                                        </Form>

                                        <div class="items-result">
                                            <Row>
                                                <Col span="6">
                                                    <div style="display: flex;">
                                                        <div>检查医生：</div>
                                                        <!--                                                        <img :src="item.checkSign ? 'data:image/png;base64,' + item.checkSign" width="150" height="30">-->
                                                        <img :src="item.checkSign ? (item.checkSignPath && item.checkSignPath.indexOf('/dcm') > -1) ? item.checkSignPath : item.checkSign.indexOf('/dcm') > -1 ? item.checkSign : 'data:image/png;base64,' + item.checkSign : checkDoctor" width="150" height="30">
                                                    </div>
                                                </Col>
                                                <Col span="4">
                                                    <div>检查日期：{{ formatTime(item.checkDate) }}</div>
                                                </Col>
                                                <Col span="2"></Col>
                                                <Col>
                                                    <ButtonGroup style="display: flex;justify-content: center;margin-left: 18px;">
                                                        <Button type="primary"
                                                                @click="handleViewTemplate">报告预览
                                                        </Button>
                                                    </ButtonGroup>
                                                </Col>
                                            </Row>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                                </div>
                                <no-data v-if="tabsArr.length <= 0 && officeName != '问诊科'" width="150" height="150"></no-data>
                                <Spin size="large" fix v-if="groupShow"></Spin>
                            </Col>
                        </Row>
                    </Card>
                </el-tab-pane>
                <el-tab-pane label="历次结果" name="name2" v-if="false">
                    <Card>
                        <Row type="flex" justify="space-between">
                            <Col span="3" style="position: relative">
                                <div style="position: relative">
                                    <div class="tree-bar" :style="{ maxHeight: maxHeight }">
                                        <Tree ref="tree" :data="treeData" @on-select-change="selectTree"></Tree>
                                    </div>
                                    <Spin size="large" fix v-if="treeLoading"></Spin>
                                </div>
                            </Col>

                            <Col span="21">
                                <div>
                                    <Row>
                                        <Col span="10">
                                            <Form class="time-sty">
                                                <FormItem label="体检时间">
                                                    <DatePicker type="daterange"
                                                                v-model="physicalTime"
                                                                placeholder="请选择"
                                                                style="width: 100%;"
                                                                @on-change="physicalTimeChange"/>
                                                </FormItem>
                                            </Form>
                                        </Col>
                                    </Row>
                                </div>
                                <div v-if="officeName == '问诊科'">
                                    <Spin size="large" fix v-if="wzShow"></Spin>
                                    <otherInfo :personInfo="personWZInfo" :status="1" ref="otherInfo"></otherInfo>
                                </div>
                                <!--分组项目-->
                                <el-tabs v-if="tabsArr.length > 0 && officeName != '问诊科'" type="card"
                                         style="width: 100%;margin-top:10px;" v-model="tabsValue" @tab-click="tabsClick">
                                    <el-tab-pane style="margin-bottom: 10px;"
                                                 v-for="(item,index) in tabsArr"
                                                 :label="item.groupItemName"
                                                 :name="item.id"
                                                 :key="index">

                                        <div v-if="item.isFile=='是'">
                                            <Row style="height: 240px;border: 1px solid #DCDEE2;border-top: 0;overflow: auto;">
                                                <Col span="24" style="display: flex;justify-content: center;align-items: center;">
                                                    <div v-viewer="{movable: false,zIndex:7000}">
                                                        <img v-for="(item,index) in pacsData" :key="index" :src="item"
                                                             style="width: 200px;height: 200px;border:1px dashed #ccc;margin-right:20px;">
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>

                                        <!--列表-->
                                        <div v-if="item.isFile == '否' || item.isFile==null || item.isFile == ''">
                                            <Table :loading="loading"
                                                   border
                                                   :columns="resultColumn"
                                                   sortable="custom"
                                                   :data="baseProjectData"
                                                   :row-class-name="rowClassName"
                                                   height="280">
                                            </Table>
                                        </div>

                                        <Form :label-width="30" style="margin: 20px 2px 10px;border-bottom:0;" inline>
                                            <Row style="flex-wrap: nowrap">
                                                <Col span="10" style="position: relative">
                                                    <Button style="position: absolute; right: -4px;bottom: 1px; z-index: 10;"
                                                            type="primary"
                                                            @click="handleWordChoose('zdtx')">选
                                                    </Button>
                                                    <label style="font-size: 14px;font-weight: 600;margin-bottom: 15px;">体检提醒或影像所见</label>
                                                    <Input type="textarea"
                                                           v-model="item.diagnoseTip"
                                                           placeholder="输入多个以;分隔"
                                                           class="result-textarea"
                                                           :autosize="{maxRows: 6,minRows: 6}"/>
                                                </Col>
                                                <Col span="2"></Col>
                                                <Col span="10" style="margin-left: 16px;">
                                                    <Button style="position: absolute; right: -4px;  bottom:1px; z-index: 10;"
                                                            @click="handleWordChoose('zdxj')" type="primary">选
                                                    </Button>
                                                    <label style="font-size: 14px;font-weight: 600;margin-bottom: 15px;">体检小结</label>
                                                    <Input type="textarea"
                                                           placeholder="输入多个以;分隔"
                                                           v-model="item.diagnoseSum"
                                                           class="result-textarea"
                                                           :autosize="{maxRows: 6,minRows: 6}"/>
                                                </Col>
                                            </Row>
                                        </Form>
                                        <div class="items-result">
                                            <Row>
                                                <Col span="8">
                                                    <div style="display: flex;">
                                                        <div>检查医生：</div>
                                                        <img :src="item.checkSign ? (item.checkSignPath && item.checkSignPath.indexOf('/dcm') > -1) ? item.checkSignPath :  item.checkSign.indexOf('/dcm') > -1 ? item.checkSign : 'data:image/png;base64,' + item.checkSign : checkDoctor" width="150" height="30">
                                                    </div>
                                                </Col>
                                                <Col span="8">
                                                    <div>检查日期：{{ formatTime(item.checkDate) }}</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                                <no-data v-if="tabsArr.length <= 0 && officeName != '问诊科'" width="150" height="150"></no-data>
                                <Spin size="large" fix v-if="groupShow"></Spin>
                            </Col>
                        </Row>
                    </Card>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer">
                <Button @click="modalVisible = false">取消</Button>
                <!--                <Button type="primary" :loading="saveLoading" @click="handleSave">保存结果</Button>-->
            </div>
        </Modal>
        <Modal title="阳性结果汇总" v-model="modalResult" :mask-closable="false" footer-hide :width="1300">
            <Row :gutter="20">
                <Col span="19">
                    <Form ref="positive" :model="positive" :label-width="95">
                        <Row>
                            <Col span="5">
                                <FormItem label="姓名">
                                    <Input v-model="positive.personName" placeholder="请输入姓名" clearable></Input>
                                </FormItem>
                            </Col>
                            <Col :span="6">
                                <FormItem label="体检科室">
                                    <Select v-model="positive.officeId" clearable>
                                        <Option v-for="item in departmentData" :value="item.id" :key="item.id">{{ item.sectionName }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="7">
                                <FormItem label="体检日期">
                                    <DatePicker v-model="selectDate" type="daterange" @on-change="selectDateRange" placeholder="请选择体检日期"
                                                style="width: 100%;"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col :span="6">
                                <FormItem label="结果状态">
                                    <Select v-model="resultStatus" @on-change="resultStatusChange">
                                        <Option value="0">不正常</Option>
                                        <Option value="1">正常</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col span="5">
                    <Row>
                        <Col>
                            <Button type="primary" @click="getSummaryPerson">查询</Button>
                        </Col>
                        <Col>
                            <Button type="primary" @click="handleReset">重置</Button>
                        </Col>
                        <Col>
                            <Button type="success" @click="exportClick">导出Excel</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Table :loading="summaryLoading" border max-height="600" :columns="summaryColumn" sortable="custom" :data="summaryData"
                   ref="summaryTable">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" size="small" @click.native="handleViewClick(row,index)"
                            icon="ios-eye-outline">查看
                    </Button>
                    <Button type="info" size="small" @click.native="ignoreClick(row,index)">忽略
                    </Button>
                </template>
            </Table>
            <Row type="flex" justify="end" class="page">
                <Page
                        :current="positive.pageNumber"
                        :total="summarytotal"
                        :page-size="positive.pageSize"
                        @on-change="summaryChangePage"
                        @on-page-size-change="summaryChangePageSize"
                        :page-size-opts="[10, 15]"
                        size="small"
                        show-total
                        show-elevator
                        show-sizer
                        transfer
                ></Page>
            </Row>
        </Modal>
        <drawerReview v-model="wordChooseShowReview" width="400" :modalTitle="title" @getSelectedWordsReview="getSelectedWordsReview"
                      :type="type" :inspectForm = "inspectForm" :inspectType="personInfo.physical_type || personInfo.physicalType" :personInfo="personInfo" :hazardFactors="personInfo.hazard_factors || personInfo.hazardFactors"
                      :hazardFactorsText="personInfo.hazard_factors_text || personInfo.hazardFactorsText" :isMultiple="isMultiple">
        </drawerReview>
        <Modal title="复查结果" v-model="reviewPageShow" :mask-closable="false" footer-hide :width="750">
            <Row :gutter="20" style="margin-top: -12px;">
                <Col span="12">
                   <!-- <div type="primary" style="position: absolute;right: 6px;bottom: 1px;right: 75px;height: 20px;width: 150px;display: flex;flex-direction: row;justify-content: right;z-index: 10">
                        <div v-if="reviewDataCode==12004">
                            <Button type="primary" style="bottom: 2px;width: 80px;height: 20px;display: flex;flex-direction: row;justify-content: center;"
                                    @click="handleWordChooseOccupation('zyjjz')">职业禁忌证
                            </Button>
                        </div>
                        <div v-if="reviewDataCode==12003">
                            <Button type="primary" style="bottom: 2px;width: 80px;height: 20px;display: flex;flex-direction: row;justify-content: center;"
                                    @click="handleWordChooseDiseases('zyb')">疑似职业病
                            </Button>
                        </div>
                    </div>-->
                    <Button type="primary"
                            style="position: absolute;right: 6px;bottom: 1px;z-index: 10;
                            height: 20px;width: 20px;padding: 0px;width: 65px;"
                            @click="handleWordChooseReview('zjzybmc')">体检结论
                    </Button>
                    <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>复查体检结论</div>
                    <div class="textareaResult">
                        <Input type="textarea" v-model="reviewData" :autosize="{maxRows: 4,minRows: 4}"></Input>
                    </div>
                </Col>
                <Col span="12">
                    <div class="txt"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>复查处理意见</div>
                    <div class="textareaResult" style="position: relative;">
                        <Button type="primary"
                                style="position: absolute;right: 20px;bottom: 0px;z-index: 10;
                                height: 20px;width: 20px;padding: 0px;right: -4px;"
                                @click="handleWordChooseReview('zjclyj')">选
                        </Button>
                        <Input type="textarea" v-model="reviewDataOpinion" :autosize="{maxRows: 4,minRows: 4}"></Input>
                    </div>
                </Col>
            </Row>
            <Row style="margin-top: 12px">
                <div class="txt" style="margin-top: 0.4vh;margin-right: 0.4vw;"><span style="color: red;font-size: 16px;position: relative;top: 4px;">*</span>复查总检日期:</div>
                <DatePicker type="datetime" v-model="reviewInspectDate" transfer placeholder="请选择复查总检日期" style="width: 175px"></DatePicker>
            </Row>
            <Row>
                <Col span="4">
                    <Button @click="closeReviewResult" style="height: 30px;margin-top: 10px;">取消</Button>
                </Col>
                <Col span="16">
                </Col>
                <Col span="4" style="text-align: right;margin-right: 0px;">
                    <Button type="primary" @click="getReviewResult" style="height: 30px;margin-top: 10px;text-align: center;">确定</Button>
                </Col>
            </Row>
        </Modal>
       <!--模板预览-->
        <preview-templateMX v-model="previewShowMX" :personInfo="personInfo"></preview-templateMX>
        <review-record-list v-model="reviewRecordShow" :tableDataReview="tableDataReview" :personInfo="personInfo" :conclusion="inspectForm.conclusion"></review-record-list>
        <preview-template v-model="previewShow" :status="status" :TTemplateId="TTemplateId"></preview-template>
        <drawer v-model="wordChooseShow" width="400" :modalTitle="title" @getSelectedWords="getSelectedWords"
                :type="type" :inspectForm = "inspectForm" :inspectType="personInfo.physical_type || personInfo.physicalType" :personInfo="personInfo" :hazardFactors="personInfo.hazard_factors || personInfo.hazardFactors"
                :hazardFactorsText="personInfo.hazard_factors_text || personInfo.hazardFactorsText" :isMultiple="isMultiple">
        </drawer>
        <drawerOccupation v-model="wordChooseOccupationShow" width="400" :modalTitle="title" @getSelectedWordsOccupation="getSelectedWordsOccupation"
                :type="type" :isMultiple="isMultiple" :occupationalTaboo="occupationalTaboo" :occupationalTabooCode="occupationalTabooCode" :occupationalTabooNow="occupationalTabooNow">
        </drawerOccupation>
        <drawerDiseases v-model="wordChooseDiseasesShow" width="400" :modalTitle="title" @getSelectedWordsDiseases="getSelectedWordsDiseases"
                :type="type" :isMultiple="isMultiple" :occupationalDiseases="occupationalDiseases" :occupationalDiseasesCode="occupationalDiseasesCode" :occupationalDiseasesNow="occupationalDiseasesNow">
        </drawerDiseases>
        <auditing-report v-model="auditingReportShow" :type-status="typeStatus" :person-id="personInfo.id"></auditing-report>

    </div>
</template>

<script>
    import {getDictDataByType} from "../../../api";
    import {queryAllSectionOfficeData} from "../../../api/healthy/tSectionOffice";
    import {
        getInspectionTGroupPersonList,
        getInspectionTGroupPersonReviewList,
        getTGroupPersonWithLink,
        getTGroupPersonWZInfo,
    } from "../../../api/healthy/tGroupPerson"
    import {
        queryPersonCheckOffice,
        queryTDepartResultList,
        getGroupByOfficeId,
        updateResultAndItemResult
    } from "../../../api/healthy/tDepartResult"
    import {
        addTInspectionRecord,
        updateTInspectionRecord,
        getTInspectionRecordByPersonId,
        batchAddTInspectionRecord
    } from "../../../api/healthy/tInspectionRecord"
    import {
        queryAllTDepartItemResultList,
        querySummaryResultList,
        querySummaryResultListReview,
        queryAllAbnormalItemResultList,
        updateTDepartItemResult,
    } from "../../../api/healthy/tDepartItemResult"
    import {
        queryNoCheckTOrderGroupItemProjectList,
		queryAbandonTOrderGroupItemProjectList,
        getSelectedBaseItemByItemId
    } from "../../../api/healthy/tOrderGroupItemProject"
    import {userInfo} from "../../../api/index"
    import Cookies from "js-cookie";
    import Viewer from "viewerjs";
    import {formartDate,getMonthString,getDataString} from "../../../api/tools/tool";
    import {formatDate} from "@/api/tool.js"
    import step from "../../../components/healthy/step";
    import reviewRecordList from "./reviewRecordList";
    import drawer from "./drawer";
    import drawerReview from "./drawerReview";
    import drawerOccupation from "./drawerOccupation";
    import drawerDiseases from "./drawerDiseases";
    import previewTemplate from "./previewTemplate";
    import myWangEditor from "../../my-components/scmt/myWangEditor";
    import otherInfo from "../tGroupPerson/otherInfo";
    import noData from "../../../components/no-data"
    import auditingReport from "./auditingReport";
    import previewTemplateMX from "../tCheckStation/previewTemplate";
    import {queryAllByOfficeId} from "@/api/healthy/tOfficeTerm"
    import {getPositiveResultExaminationList,addPositivePerson}from '@/api/healthy/tPositiveResultList'
    import positiveRule from "../generalInspection/components/positiveRule.vue";
    export default {
        components: {
            myWangEditor,
            step,
            reviewRecordList,
            drawer,
            drawerReview,
            drawerOccupation,
            drawerDiseases,
            previewTemplate,
            otherInfo,
            noData,
			auditingReport,
            previewTemplateMX,
            positiveRule
        },
        name: "allInspect",
        data() {
            return {
                positiveResult:false,
                buttons:true,
                isInspectionChange: false,//是否变更总检样式
                updateTableAbnormalFieldName: "阳性",//修改诊台页面，明细表格异常字段名称（即是否阳性字段列，修改为是否异常或者其他的名称）

                conclusionNow: "",//当前主检结论内容
                conclusionCodeNowData: [],//当前主检结论数据集合

                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                ShutDownIcon:"ios-arrow-up",
                drop: false,
                ShutDown:true,
                height1: '147px',

                checkDoctor: '',
                nametjjl: "体检结果",
                isUpdateUnitPage: false,
                isReviewer:false,
                typeStatus:false,

                reviewInspectDate: null,//复查总检日期
                reviewData: "",//复查结论数据
                reviewDataCode: "",//复查结论编码
                reviewDataOpinion: "",//复查建议
                isReviewResult: false,//是否是复查结论
                reviewPageShow: false,//复查页面展示
                checkResultNow: null,
                isContraindication: false,
                isDiseases: false,
                occupationalTaboo: "",//套餐目标职业禁忌证
                occupationalTabooCode: "",//套餐目标职业禁忌证code
                occupationalTabooNow: "",//当前所选职业禁忌证
                occupationalTabooNowCode: "",//当前所选职业禁忌证code
                occupationalDiseases: "",//套餐目标职业病
                occupationalDiseasesCode: "",//套餐目标职业病code
                occupationalDiseasesNow: "",//当前所选职业病
                occupationalDiseasesNowCode: "",//当前所选职业病code

                isAllChecked: false,
                pacsData: [],
                personInfoLoading: false,
                wzShow: false,
                isMultiple: false,
                batchLoading: false,
                saveLoading: false,
                checkNum: 0,
                officeName: "",
                personWZInfo: {},
                doctorInfo: {},
                tabsValue: '',
                baseProjectData: [],
                tabsArr: [],
                date: '',
                datePickerShow: false,
                TTemplateId: {
                    id: "dd6ca5975f9b12aa70d49dbba769013a",
                    handleOpinion: "",
                    inspectionDate: formartDate(new Date(), 'yyyy-MM-dd'),
                },
                wordChooseShow: false,
                wordChooseShowReview: false,
                wordChooseOccupationShow: false,//是否显示 职业禁忌证列表
                wordChooseDiseasesShow: false,//是否显示 职业病列表
                title: "",
                type: "",
                previewShow: false,
                previewShowMX: false,
                resultStatus: "0",
                status: '待总检',
                currentIndex: 3,
                reviewRecordShow: false,
                tableDataReview: [],
                userInfo: {},
                noInsProject: '', //未检查项目数量
                personList: [],//人员列表
                personParam: {
                    keyword: "",
                    personId: "",
                    pageNumber: 1,
                    pageSize: 10,
                    isPass: 3,
                    startDate: null,
                    endDate: null,
                    personName: "",//姓名
                    testNum: "",//体检编号
                    dept: "",//单位名称
					sort: "t_group_person.update_time",//排序字段
					order: "desc",//排序方式：倒序
                },
                personInfo: {},
                positive: {
                    personName: '',
                    officeId: '',
                    checkDoc: '',
                    arrow: '-',
                    ignoreStatus: 1,
                    pageNumber: 1,
                    pageSize: 10,
                    startDate: null,
                    endDate: null,
                    personId: null,
                },//初审条件
                physicalTime: '',//体检时间
                outLeftSpan: 'width: 300px;',
                outSpan: 'position: relative;width: calc(100% - 332px);',
                radioValue: "",//是否选中
                checkPersonLoading: false,
                maxHeight: "500px",
                expandIcon: "ios-arrow-back",
                outExpandIcon: "ios-arrow-back",
                outExpand: true,
                treeLoading: false, // 树加载状态
                treeData: [], // 树数据
                departmentData: [], //科室
                loading: false,//单项检查
                itemResult: '',//单项检查结果
                resultData: [],//明细结果
                remind: '', //诊断提醒
                noInsProjectLoading: false,
                noInsProjectData: [],//未检查项目
                officeIdData:[],//异常科室
                ProjectException:[],//异常项目
                noInsProjectColumn: [
                    {
                        title: '科室',
                        align: 'center',
                        minWidth: 70,
                        ellipsis: true,
                        tooltip: true,
                        key: 'officeName',
                        sortable: false,
                    },
                    {
                        title: '项目',
                        align: 'center',
                        minWidth: 70,
                        ellipsis: true,
                        tooltip: true,
                        key: 'name',
                        sortable: false
                    }
                ],
				abandonProject:"",
				abandonProjectLoading: false,
				abandonProjectData: [],//放弃检查项目
				abandonProjectColumn: [

					{
						title: '项目',
						align: 'center',
						minWidth: 70,
						ellipsis: true,
						tooltip: true,
						key: 'name',
						sortable: false
					},
					{
						title: '弃检原因',
						align: 'center',
						minWidth: 70,
						ellipsis: true,
						tooltip: true,
						key: 'abandonRenson',
						sortable: false,
					},
				],
                crisisProParam: {
                    personId: '',
                    arrow: "-",
                },
                crisisTotal: 0,
                crisisLoading: false,
                crisisColumn: [
                    {
                        title: '科室',
                        align: 'center',
                        minWidth: 70,
                        ellipsis: true,
                        tooltip: true,
                        key: 'officeName',
                        sortable: false
                    },
                    {
                        title: '项目',
                        align: 'center',
                        minWidth: 70,
                        ellipsis: true,
                        tooltip: true,
                        key: 'orderGroupItemProjectName',
                        sortable: false
                    },
                    {
                        title: '结果',
                        align: 'center',
                        minWidth: 70,
                        ellipsis: true,
                        tooltip: true,
                        key: 'result',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.scope) {
                                let value = params.row.scope;
                                let valueArr = value.split("-");
                                if (Number(params.row.result) > Number(valueArr[1])) {
                                    return h('span', {
                                        'style': {
                                            'color': '#ff0000'
                                        }
                                    }, params.row.result)
                                } else if (Number(params.row.result) < Number(valueArr[0])) {
                                    return h('span', {
                                        'style': {
                                            'color': '#e3a706'
                                        }
                                    }, params.row.result)
                                } else if (params.row.result == "阳性") {
                                    return h('span', {
                                        'style': {
                                            'color': '#ff0000'
                                        }
                                    }, params.row.result)
                                } else {
                                    return h('span', {}, params.row.result)
                                }
                            } else {
                                return h('span', {}, params.row.result)
                            }
                        }
                    },
                    {
                        title: '参考范围',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'scope',
                        sortable: false
                    },
                ],
                crisisData: [],//危害值数据
                summaryLoading: false,
                selectDate: null,//阳性结果体检日期
                summaryColumn: [
                    {
                        title: '姓名',
                        align: 'center',
                        minWidth: 60,
                        ellipsis: true,
                        tooltip: true,
                        key: 'personName',
                        sortable: false
                    },
                    {
                        title: '体检编号',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'testNum',
                        sortable: false
                    },
                    {
                        title: '体检科室',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'officeName',
                        sortable: false
                    },
                    {
                        title: '体检项目',
                        align: 'center',
                        minWidth: 150,
                        ellipsis: true,
                        tooltip: true,
                        key: 'orderGroupItemProjectName',
                        sortable: false
                    },
                    {
                        title: '结果',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'result',
                        sortable: false,
                        render: (h, params) => {
                            // if (params.row.result) {
                            //     if (params.row.result == "阴性") {
                            //         return h("span", params.row.result);
                            //     } else if (params.row.result == "阳性") {
                            //         return h("span", {
                            //             style: {
                            //                 color: "red",
                            //             }
                            //         }, params.row.result);
                            //     }
                            //     if (params.row.arrow != "-") {
                            //         return h("span", {
                            //             style: {
                            //                 color: "red",
                            //             }
                            //         }, params.row.result);
                            //     } else {
                            //         return h("span", params.row.result);
                            //     }
                            // } else {
                            //     return h("span", "-");
                            // }
                            if (params.row.result) {
                                if ((params.row.crisisDegree && (params.row.crisisDegree == "-" || params.row.crisisDegree == "正常")) || (params.row.positive && params.row.positive == "0") ) {
                                    return h("span", params.row.result);
                                } else {
                                    return h("span", {
                                        style: {
                                            color: "red",
                                        }
                                    }, params.row.result);
                                }
                            } else {
                                return h("span", "-");
                            }
                        }
                    },
                    {
                        title: '单位',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'unitName',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.unitName) {
                                return h("span", params.row.unitName);
                            } else {
                                return h("span", "-");
                            }
                        }
                    },
                    {
                        title: '参考范围',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'scope',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.scope) {
                                return h("span", params.row.scope);
                            } else {
                                return h("span", "-");
                            }
                        }
                    },
                    {
                        title: '提示',
                        align: 'center',
                        minWidth: 60,
                        ellipsis: true,
                        tooltip: true,
                        key: 'arrow',
                        sortable: false
                    },
                    {
                        title: '危急程度',
                        align: 'center',
                        minWidth: 90,
                        ellipsis: true,
                        tooltip: true,
                        key: 'crisisDegree',
                        sortable: false
                    },
                    {
                        title: '体检日期',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'checkDate',
                        sortable: false,
                        render: (h, params) => {
                            return h('span', formartDate(params.row.checkDate, "yyyy-MM-dd"))
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 160,
                    }
                ],
                summarytotal: 0,
                summaryData: [],//阳性结果数据
                //列(影像项目)
                getColumnsYX() {
                    let _this = this;
                    return [
                        {
                            type: "index",
                            width: 60,
                            align: 'center'
                        }, {
                            title: '体检项目',
                            align: 'left',
                            width: 180,
                            tooltip: true,
                            ellipsis: true,
                            key: 'name'
                        }, {
                            title: '明细结果',
                            align: 'center',
                            minWidth: 150,
                            tooltip: true,
                            ellipsis: true,
                            render: (h, params) => {
                                let resultType = params.row.resultType;
                                if (resultType == '选择') {
                                    //下拉选项
                                    let defaultValue = params.row.defaultValue ? params.row.defaultValue.split(";") : [];

                                    //默认取第一个结果
                                    let result = "";
                                    if (params.row.departItemResults.result) {
                                        result = params.row.departItemResults.result.split(";")[0];
                                        this.$set(this.baseProjectData[params.index].departItemResults, 'result', result);//结果
                                    }

                                    if (result && result.trim().length > 0) {
                                        defaultValue.push(result);
                                        defaultValue = defaultValue.filter((item, indx, arr) => {
                                            return arr.indexOf(item) == indx;
                                        })
                                    }
                                    return h('Select', {
                                        props: {
                                            value: result,
                                            transfer: true,
                                            filterable: true,
                                            allowCreate: true,
                                            clearable: true
                                        },
                                        on: {
                                            'on-change': e => {
                                                this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);//结果
                                                if (params.row.criticals.length == 0) {
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '-');
                                                } else {
                                                    let ret = this.setResult(params.row.criticals, e);
                                                    if (ret.flag == "-") {
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '-');
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
                                                    } else if (ret.flag) {
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '异常');
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
                                                    } else if (!ret.flag) {
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '正常');
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
                                                    }
                                                }
                                            },
                                            'on-create': e => {
                                                defaultValue.push(e);
                                                defaultValue = defaultValue.filter((item, indx, arr) => {
                                                    return arr.indexOf(item) == indx;
                                                });
                                                this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);//结果
                                            }
                                        }
                                    }, defaultValue.map(item => {
                                        return h('Option', {
                                            props: {
                                                value: item,
                                                label: item
                                            }
                                        })
                                    }))
                                } else if (resultType == "数值") {
                                    let result = '';
                                    if(params.row.departItemResults.result || (params.row.departItemResults.result && params.row.departItemResults.result==0)){
                                        result = Number(params.row.departItemResults.result);
                                    }
                                    return h('InputNumber', {
                                        props: {
                                            value: result,
                                            min: -20,
                                            step: 0.01,
                                            readonly: false
                                        },
                                        on: {
                                            'on-change': e => {
                                                let v = e;//录入值
                                                if (!v) {
                                                    // this.$set(this.baseProjectData[params.index].departItemResults, 'result', 0);
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'result', v);
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "-");
                                                } else {
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'result', v);
                                                    let ret = this.setResult(params.row.criticals, v);
                                                    if (ret.flag == "-") {
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '-');
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
                                                    } else if (ret.flag) {
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', ret.resp ? ret.resp : ret.arrow == '-' ? '-' : ret.arrow == "↑" ? '高于正常值' : '低于正常值');
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
                                                    } else if (!ret.flag) {
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "正常");
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else {
                                    let result = params.row.departItemResults.result;
                                    return h('Input', {
                                        props: {
                                            value: result,
                                            readonly: false
                                        },
                                        on: {
                                            'on-change': e => {
                                                let v = e.target.value;//录入值
                                                if (!v) {
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "-");
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'result', v);
                                                } else {
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'result', v);
                                                    let ret = this.setResult(params.row.criticals, v);
                                                    if (ret.flag == "-") {
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', '-');
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
                                                    } else if (ret.flag) {
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', ret.resp ? ret.resp : ret.arrow == '-' ? '-' : ret.arrow == "↑" ? '高于正常值' : '低于正常值');
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
                                                    } else if (!ret.flag) {
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "正常");
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', ret.arrow);
                                                    }
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                        }, {
                            title: '参考值',
                            align: 'center',
                            tooltip: true,
                            minWidth: 120,
                            ellipsis: true,
                            render: (h, params) => {
                                let scope = params.row.departItemResults.scope;
                                if (scope && scope != "-") {
                                    return h("div", scope);
                                } else {
                                    let val = "";
                                    //规则参考值
                                    let reference = params.row.relationProjectReference;
                                    if (!reference) {
                                        this.$set(this.baseProjectData[params.index].departItemResults, 'scope', "-");
                                        return h("div", "-");
                                    }
                                    val = reference.occupationValue;
                                    if (!val) {
                                        val = "-";
                                    }
                                    this.$set(this.baseProjectData[params.index].departItemResults, 'scope', val);
                                    return h("div", val);
                                }
                            }
                        }, {
                            title: '提示',
                            align: 'center',
                            tooltip: true,
                            ellipsis: true,
                            minWidth: 100,
                            key: "arrow",
                            render: (h, params) => {
                                let arrow = params.row.departItemResults.arrow;
                                if (arrow == undefined || arrow == null) {
                                    arrow = "-";
                                    this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', arrow);
                                }
                                return h("span", arrow);
                            }
                        }/*, {
                            title: '危急程度',
                            align: 'center',
                            minWidth: 90,
                            tooltip: true,
                            ellipsis: true,
                            key: "crisisDegree",
                            render: (h, params) => {
                                let crisis = params.row.departItemResults.crisisDegree;
                                let positive = "0";
                                if (crisis && (crisis.indexOf("异常")>-1 || crisis.indexOf("低于")>-1 || crisis.indexOf("高于")>-1)) {
                                    positive = "1";
                                    this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
                                } else {
                                    this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
                                }
                                if (crisis) {
                                    return h("span", crisis);
                                } else {
                                    this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "-");
                                    return h("span", "-");
                                }
                            }
                        }*/, {
                            title: '异常',
                            align: 'center',
                            minWidth: 60,
                            tooltip: true,
                            ellipsis: true,
                            key: "positive",
                            render: (h, params) => {
                                let crisis = params.row.departItemResults.crisisDegree;
                                let positive = "0";
                                if (crisis && (crisis.indexOf("异常")>-1 || crisis.indexOf("低于")>-1 || crisis.indexOf("高于")>-1)) {
                                    positive = "1";
                                    this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
                                } else {
                                    this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
                                }
                                if(true){//勾选框
                                    return h("span", [
                                        h("Checkbox", {
                                            attrs: {
                                                value: positive=="1" ? true : false,
                                            },
                                            on: {
                                                "on-change": (event) => {
                                                    if(event){
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'positive', "1");
                                                    }else{
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'positive', "0");
                                                    }
                                                },
                                            },
                                        }),
                                        [h("span", "是")],
                                    ]);
                                }
                            }
                        }
                    ]
                },
                //明细结果列
                resultColumn: [
                    {
                        title: '体检项目',
                        minWidth: 200,
                        fixed: "left",
                        ellipsis: true,
                        tooltip: true,
                        key: 'name',
                        sortable: false
                    },
                    {
                        title: '结果',
                        align: 'center',
                        minWidth: 150,
                        ellipsis: true,
                        tooltip: true,
                        key: 'result',
                        sortable: false,
                        render: (h, params) => {
                            let resultType = params.row.resultType;
                            if (resultType == '选择') {
                                let defaultValue = params.row.defaultValue ? params.row.defaultValue.split(";") : [];
                                let result = params.row.departItemResults.result.split(";")[0];
                                if (result && result.trim().length > 0) {
                                    defaultValue.push(result);
                                    defaultValue = defaultValue.filter((item, indx, arr) => {
                                        return arr.indexOf(item) == indx;
                                    })
                                }
                                return h('Select', {
                                    props: {
                                        value: result,
                                        transfer: true,
                                        filterable: true,
                                        allowCreate: true,
                                        size: "small",
                                        clearable: true
                                    },
                                    on: {
                                        'on-change': e => {
                                            this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);//结果
                                        },
                                        'on-create': e => {
                                            defaultValue.push(e);
                                            defaultValue = defaultValue.filter((item, indx, arr) => {
                                                return arr.indexOf(item) == indx;
                                            });
                                            this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);//结果
                                        }
                                    }
                                }, defaultValue.map(item => {
                                    return h('Option', {
                                        props: {
                                            value: item,
                                            label: item
                                        }
                                    })
                                }))
                            } else {
                                return h('Input', {
                                    props: {
                                        value: params.row.departItemResults.result,
                                        size: "small"
                                    },
                                    on: {
                                        input: e => {
                                            //输入值
                                            if (!e) {
                                                this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
                                                this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "暂无结果");
                                            } else {
                                                let projectName = params.row.name;
                                                if ('身高' == projectName) {
                                                    this.personHeight = e;
                                                }
                                                if ('体重' == projectName) {
                                                    this.personWeight = e;
                                                }
                                                if (this.personHeight && this.personWeight) {
                                                    let height = this.personHeight / 100;
                                                    let BMI = parseInt(this.personWeight / (height * height) * 10) / 10;
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);   //结果
                                                    this.$set(this.baseProjectData[3].departItemResults, 'result', BMI);   //结果
                                                } else {
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);   //结果
                                                }

                                                if (e == '阳性') {
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '↑');
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "高于正常值");
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'result', e);
                                                } else {
                                                    //范围
                                                    let scope = params.row.departItemResults.scope;
                                                    //提示arrow
                                                    if (!scope || scope == "-") { //范围
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', '-');
                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "暂无结果");
                                                    } else {
                                                        let arrow = this.setArrow(params.row.departItemResults.scope, e);

                                                        this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', arrow);
                                                        if (arrow == "↑") {
                                                            this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "高于正常值");
                                                        }
                                                        if (arrow == "↓") {
                                                            this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "低于正常值");
                                                        }
                                                        if (arrow == "-") {
                                                            this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "正常");
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }, {
                        title: '单位',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        render: (h, params) => {
                            let unit = params.row.departItemResults.unitName;
                            if (unit) {
                                return h("span", unit);
                            } else {
                                let u = params.row.unitName;
                                if (u == null || u == "") {
                                    u = "无";
                                }
                                this.$set(this.baseProjectData[params.index].departItemResults, 'unitName', u);
                                return h("span", u);
                            }
                        }
                    }, {
                        title: '参考范围',
                        align: 'center',
                        tooltip: true,
                        minWidth: 120,
                        ellipsis: true,
                        render: (h, params) => {
                            let scope = params.row.departItemResults.scope;
                            if (scope && scope != "-") {
                                return h("div", scope);
                            } else {
                                let val = "";
                                //规则参考值
                                let reference = params.row.relationProjectReference;
                                if (!reference) {
                                    this.$set(this.baseProjectData[params.index].departItemResults, 'scope', "-");
                                    return h("div", "-");
                                }
                                val = reference.occupationValue;
                                if (!val) {
                                    val = "-";
                                }
                                this.$set(this.baseProjectData[params.index].departItemResults, 'scope', val);
                                return h("div", val);
                            }
                        }
                    }, {
                        title: '提示',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 50,
                        key: "arrow",
                        render: (h, params) => {
                            let arrow = params.row.departItemResults.arrow;
                            if (arrow == undefined || arrow == null) {
                                arrow = "-";
                                this.$set(this.baseProjectData[params.index].departItemResults, 'arrow', arrow);
                            }
                            return h("span", arrow);
                        }
                    }/*, {
                        title: '危急程度',
                        align: 'center',
                        minWidth: 90,
                        tooltip: true,
                        ellipsis: true,
                        render: (h, params) => {
                            let crisis = params.row.departItemResults.crisisDegree;
                            let positive = "0";
                            if (crisis && (crisis.indexOf("异常")>-1 || crisis.indexOf("低于")>-1 || crisis.indexOf("高于")>-1)) {
                                positive = "1";
                                this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
                            } else {
                                this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
                            }
                            if (crisis) {
                                return h("span", crisis);
                            } else {
                                this.$set(this.baseProjectData[params.index].departItemResults, 'crisisDegree', "正常");
                                return h("span", "正常");
                            }
                        }
                    }*/, {
                        title: '异常',
                        align: 'center',
                        minWidth: 60,
                        tooltip: true,
                        ellipsis: true,
                        key: "positive",
                        render: (h, params) => {
                            let crisis = params.row.departItemResults.crisisDegree;
                            let positive = "0";
                            if (crisis && (crisis.indexOf("异常")>-1 || crisis.indexOf("低于")>-1 || crisis.indexOf("高于")>-1)) {
                                positive = "1";
                                this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
                            } else {
                                this.$set(this.baseProjectData[params.index].departItemResults, 'positive', positive);
                            }
                            if(true){//勾选框
                                return h("span", [
                                    h("Checkbox", {
                                        attrs: {
                                            value: positive=="1" ? true : false,
                                        },
                                        on: {
                                            "on-change": (event) => {
                                                if(event){
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'positive', "1");
                                                }else{
                                                    this.$set(this.baseProjectData[params.index].departItemResults, 'positive', "0");
                                                }
                                            },
                                        },
                                    }),
                                    [h("span", "是")],
                                ]);
                            }
                        }
                    }
                ],
                inspectForm: {
                    id: "",
                    personId: '',
                    orderId: "",
                    inspectionType: 1,
                    inspectionDoctor: '',// 总检医生
                    inspectionAutograph: '',//总检医生签名
                    inspectionDate: formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),//总检日期
                    operator: '',//操作员
                    healthCertificateConditions: '合格',//健康证条件
                    conclusion: '',//结论
                    conclusionCode: "12001",//结论代码
                    handleOpinion: '无',//处理意见
                    careerIllnessName: "",
                    otherCheckAbnormalResults: ""
                },//结论数据
                modelTitle: '明细结果查看',
                modalVisible: false,
                images: [],
                modalResult: false,
                tableLoading: false,
                tableData: [],//检查数据
                total: 0,
                checkProParam: {
                    personId: '',
                    groupId: '',
                },
                noCheckProParam: {
                    personId: '',
                    groupOrderId: '',
                    groupId: '',
                },
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '科室',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'officeName',
                        sortable: false
                    },
                    {
                        title: '检查项目',
                        align: 'center',
                        minWidth: 180,
                        ellipsis: true,
                        tooltip: true,
                        key: 'groupItemName',
                        sortable: false
                    },
/*                    {
                        title: '体检提醒',
                        align: 'center',
                        minWidth: 250,
                        ellipsis: true,
                        tooltip: true,
                        key: 'diagnoseTip',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.diagnoseTip) {
                                return h('Tooltip', {
                                    props: {
                                        transfer: true,
                                        content: params.row.diagnoseTip,
                                        'max-width': 250
                                    }
                                }, params.row.diagnoseTip)
                            } else {
                                return h('span', {}, "-")
                            }
                        }
                    },*/
                    {
                        title: '体检小结',
                        align: 'center',
                        minWidth: 270,
                        ellipsis: true,
                        tooltip: true,
                        key: 'diagnoseSum',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.diagnoseSum) {
                                return h('Tooltip', {
                                    props: {
                                        transfer: true,
                                        content: params.row.diagnoseSum,
                                        ellipsis: true,
                                        'max-width': 250
                                    }
                                }, params.row.diagnoseSum)
                            } else {
                                return h('span', {}, "-")
                            }
                        }
                    },
                    {
                        key: 'action',
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                    }
                ],

                healthConditionList: [
                    {
                        title: '合格',
                        value: '合格',
                    },
                    {
                        title: '不合格',
                        value: '不合格',
                    }
                ],//健康证条件
                conclusionList: [],//体检结论
                checkInfo: {
                    doctor: '',
                    time: '',
                },
                officeId: '',
                inspectionLoading: false,
                inspectionInfoList: [],
                conclusionCode: '',
                personTotal: 0,
                personHeight: 0,
                personWeight: 0,
                groupShow: false,
                radioShow: false,
                overview: "",
                auditingReportShow:false,//审核页面查看
                queryTime:this.$hospitalName.queryTimeChange,
            }
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
        },
        methods: {



            //展开 收起
            dropDown1() {
                if (this.ShutDown) {
                    this.ShutDownIcon = "ios-arrow-down";
                } else {
                    this.ShutDownIcon = "ios-arrow-up";

                }
                this.ShutDown = !this.ShutDown;
            },
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = "展开";
                    this.dropDownIcon = "ios-arrow-down";
                    this.height1 = '147px';
                } else {
                    this.dropDownContent = "收起";
                    this.dropDownIcon = "ios-arrow-up";
                    this.height1 = '234px';
                }
                this.drop = !this.drop;
            },
            //保存结果
            handleSave() {
                this.saveLoading = true;
                if (this.officeName != '问诊科') {
                    let form = {};
                    //tab 当前选中组合项目
                    let tempTab = this.tabsArr.filter(i => {
                        return i.id == this.tabsValue;
                    })

                    form.groupResult = JSON.stringify(tempTab);
                    form.groupItemResult = JSON.stringify(this.baseProjectData);

                    if (this.saveLoading) {
                        updateResultAndItemResult({form: form}).then(res => {
                            if (res.success) {
                                this.$Message.success("保存成功");
                            } else {
                                this.$Message.error("保存失败");
                            }
                        }).finally(() => {
                            this.saveLoading = false;
                        })
                    }
                } else {
                    let _this = this;
                    this.$refs.otherInfo.handelSubmit(function(flag){
                        _this.saveLoading = flag;
                    });
                }
            },
            //取消查看
            cancelClick() {
                this.inspectionInfoList = [];
                this.personList = [];
                this.personParam.pageNumber = 1;
                this.resetSearchForm();
                this.modalVisible = false;
                this.getPersonList();
            },
            //结果状态改变
            resultStatusChange(v) {
                if (v == 0) {
                    this.positive.arrow = "-";
                } else {
                    this.positive.arrow = "正常";
                }
            },
            //体检结论改变
            conclusionChange(v) {
                this.inspectForm.conclusionCode = v.value;
                this.inspectForm.conclusion = v.label;
                this.TTemplateId.conclusion = v;
            },
            //查看结果为阳性的人员信息
            handleViewClick(row, index) {
                this.personList = [];
                this.inspectionInfoList = [];
                this.modalResult = false;
                this.personParam.keyword = row.testNum;
                this.personParam.isPass = row.isPass;
                this.personParam.pageNumber = 1;
                if (row.isPass == 2) {
                    this.status = "在检";
                    this.currentIndex = 2;
                } else if (row.isPass == 3) {
                    this.status = "待总检";
                    this.currentIndex = 3;
                } else if (row.isPass == 4) {
                    this.status = "已总检";
                    this.currentIndex = 4;
                }
                this.getPersonList();
            },
            //查看结果为异常的人员信息
            handleViewClickAnomaly(row, index){
                this.resultData = [];
                this.tabsArr = [];
                this.treeLoading = true;
                queryPersonCheckOffice({personId: this.radioValue}).then(res => {
                    if (res.success) {
                        let data = [];
                        this.officeId = "";
                        this.officeName = "";
                        if (this.personInfo.physical_type != "健康体检") {
                            let office = {
                                title: "问诊科",
                                personId: this.radioValue,
                                officeId: "1454369800754171904",
                                selected: true,
                            };
                            data.push(office);
                        }
                        for (let i = 0; i < res.data.length; i++) {
                            let obj = {...res.data[i]};
                            obj.title = obj.officeName;
                            if (this.personInfo.physical_type == "健康体检" && i == 0) {
                                obj.selected = true;
                            }
                            data.push(obj);
                        }
                        this.treeData = data;
                        this.officeId = this.treeData[0].officeId;
                        this.$nextTick(() => {
                            for (let i = 0; i < this.treeData.length; i++){
                                let officeId = this.treeData[i].officeId;
                                let officeName = this.treeData[i].officeName;
                                let icon = document.getElementById("icon"+officeId);
                                if (!this.checkPhysical2(officeId)&&officeName!="问诊科"){
                                    icon.style.color = "white"
                                }else {
                                    icon.style.color = "red"
                                }
                            }
                        })
                        this.officeName = this.treeData[0].officeName;
                    }
                }).finally(() => {
                    this.treeLoading = false;
                })
                this.getResultByGroupId(row.officeId,null,null,row.groupItemId);
                this.officeName = '问诊科';
                this.wzShow = true;
                getTGroupPersonWZInfo({id: this.radioValue}).then(res => {
                    if (res.success) {
                        if (res.data) {
                            //人信息
                            this.personWZInfo = res.data;
                        }
                    }
                }).finally(() => {
                    this.wzShow = false;
                })
                this.modalVisible = true;
            },
            //忽略结果异常数据
            ignoreClick(row, index) {
                updateTDepartItemResult({id: row.id, ignoreStatus: 2}).then(res => {
                    if (res.success) {
                        this.$Message.success("忽略成功");
                        this.handleReset();
                    }
                })
            },
            //结果汇总
            resultSummary() {
                this.positive.personName = this.personInfo.person_name;
                this.modalResult = true;
                this.getSummaryPerson();
            },
            //阳性结果体检时间改变
            selectDateRange(v) {
                if (v) {
                    this.positive.startDate = v[0];
                    this.positive.endDate = v[1];
                }
            },
            //向上向下
            setArrow(scope, result) {
                if (scope.indexOf("-") == -1) {
                    return "-";
                } else {
                    let arr = scope.split("-");
                    if (Number(arr[0]) > Number(result)) {
                        return "↓";
                    }
                    if (Number(arr[1]) < Number(result)) {
                        return "↑";
                    }
                    if (Number(arr[0]) < Number(result) && Number(result) < Number(arr[1])) {
                        return "-";
                    }
                }
            },
            //阳性结果搜索条件重置
            handleReset() {
                this.resultStatus = "0";
                this.positive.personName = '';
                this.positive.officeId = '';
                this.positive.checkDoc = '';
                this.positive.arrow = '-';
                this.positive.pageNumber = 1;
                this.positive.pageSize = 10;
                this.selectDate = null;
                this.positive.startDate = null;
                this.positive.endDate = null;
                // 重新加载数据
                this.getSummaryPerson();
            },
            //明细结果查看
            resultLook() {
                this.resultData = [];
                this.tabsArr = [];
                this.getPersonOffice(this.radioValue);
                this.modalVisible = true;
            },
            //批量总检
            batchInspection() {
                if (this.inspectionInfoList.length > 0) {
                    this.batchLoading = true;
                    this.$Modal.confirm({
                        title: "确认批量总检",
                        content: "您确认批量总检 " + this.inspectionInfoList.length + " 条记录",
                        loading: true,
                        onOk: () => {
                            batchAddTInspectionRecord(this.inspectionInfoList).then(res => {
                                this.$Modal.remove();
                                if (res.success) {
                                    this.personList = [];
                                    this.personParam.keyword = "";
                                    this.personParam.pageNumber = 1;
                                    this.$Message.success('批量总检成功');
                                    this.getPersonList();
                                }
                            }).finally(() => {
                                this.batchLoading = false;
                            })
                        },
                        onCancel: () => {
                            this.batchLoading = false;
                        }
                    });
                } else {
                    this.$Message.info("暂无可批量总检人员")
                }
            },
            //人员日期查询
            datePickerChange(e) {
                this.personList = [];
                this.inspectionInfoList = [];
                if (e) {
                    this.personParam.startDate = e[0];
                    var dateTime = new Date(e[1]);
                    dateTime = dateTime.setDate(dateTime.getDate() + 1);
                    this.personParam.endDate = new Date(dateTime);}
                    this.getPersonList();
            },

            datePickerEndTime(e){
                if (e) {
                    let endTime = new Date(e);
                    endTime.setHours(23, 59, 59, 999);
                    endTime = endTime.setDate(endTime.getDate());
                    this.personParam.endDate = formatDate(new Date(endTime), 'yyyy-MM-dd HH:mm:ss');
                }
                this.getPersonList();
            },

            //人员日期查询
            datePickerSeacTime(e) {
                if (e){
                    let searctTime = new Date(e);
                    searctTime.setHours(0, 0, 0, 0);
                    searctTime = searctTime.setDate(searctTime.getDate());
                    this.personParam.startDate = formatDate(new Date(searctTime), 'yyyy-MM-dd HH:mm:ss');

                }
                this.getPersonList();
            },


            pick(e) {
                this.personList = [];
                this.inspectionInfoList = [];
                this.personParam.pageNumber = 1;
                if (e == '自定义') {
                    this.resetSearchForm();
                    this.datePickerShow = true;
                } else if (e == '当日') {
                    this.resetSearchForm();
                    this.personParam.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    this.personParam.endDate = null;
                    this.getPersonList();
                } else if (e == '当月') {
                    this.resetSearchForm();
                    this.personParam.endDate = formartDate(new Date(), 'yyyy-MM-dd  HH:mm:ss');
                    this.personParam.startDate = null;
                    this.getPersonList();
                } else if (e == "重置") {
                    this.resetSearchForm();
                }
            },
            //复查结论
            clickReviewResult(){
                if(this.inspectForm.reviewInspectDate){
                    this.reviewInspectDate = formartDate(this.inspectForm.reviewInspectDate, 'yyyy-MM-dd HH:mm:ss');
                }else{
                    this.reviewInspectDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                }
                this.reviewData = this.inspectForm.reviewResult;
                this.reviewDataCode = this.inspectForm.reviewResultCode;
                this.reviewDataOpinion = this.inspectForm.reviewOpinion;
                this.reviewPageShow = true;
            },
            resetSearchForm(e) {
                this.personParam.pageNumber = 1;
                this.personParam.personId = "";
                this.personParam.keyword = "";
                this.personParam.personName = "";
                this.personParam.testNum = "";
                this.personParam.dept = "";
                if(e){
                    this.date =e;
                }
				if (this.date == "重置") {
                    let _this = this;
                    setTimeout(function () {
                        _this.date = "当日";
                        if (!_this.$hospitalName.queryTimeChange){
                            let date  = getMonthString(new Date());
                            if(date!=null && date.length == 2){
                                _this.personParam.startDate = date[0]+ " 00:00:00";
                                _this.personParam.endDate = date[1]+ " 23:59:59";
                            }
                        }
                        else{
                            _this.personParam.startDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                            _this.personParam.endDate = null;
                        }
                        _this.inputSearchChange("");
                    },100);

                }
            },

            //导出数据
            exportClick() {
                let excolumns = this.summaryColumn.filter(function (v) {
                    return v.title != "操作" && v.type != 'selection'
                });
                this.$refs.summaryTable.exportCsv({
                    filename: '结果汇总',
                    columns: excolumns,
                    data: this.summaryData
                });
            },
            //row换颜色
            rowClassName(row, index) {
                if (row.departItemResults.crisisDegree == "正常") {
                    // return "green";
                } else if (row.departItemResults.crisisDegree == "低于正常值") {
                    return "yellow";
                } else if (row.departItemResults.crisisDegree == "高于正常值" || row.departItemResults.crisisDegree == "异常") {
                    return "red";
                } else {
                    // return "gray";
                }
                if (row.departItemResults.result == "阳性") {
                    return "red";
                }
            },
            rowClassName1(row,index){
                // let physicalSummary = this.$hospitalName.physicalSummary;
                // if(physicalSummary && row.diagnoseSum){
                //     let res = false;
                //     physicalSummary.forEach(ii=>{
                //         if(row.diagnoseSum == ii || row.diagnoseSum == ii+"。" || (row.diagnoseSum.indexOf("未见异常")>-1) || (row.diagnoseSum.indexOf("正常")>-1)){
                //             res = true;
                //         }
                //     });
                //     if (!res){
                //         return  "table-error-row";
                //     }
                // }else{
                //     return  "table-error-row";
                // }
				if(row.positive && row.positive =='0'){
				    return "";
				}else{
				    return  "table-error-row";
				}
            },
            //抽屉展示
            handleWordChoose(type) {
                if (type == "zjzybmc") {
                    this.isMultiple = true;
                    this.title = "主检结论";
                } else {
                    this.isMultiple = false;
                    this.title = "常用术语";
                }
                // this.isMultiple = false;//允许多选
                this.wordChooseShow = true;
                this.type = type;
                //套餐目标职业禁忌证
                if(this.personInfo.occupational_taboo){
                    this.occupationalTaboo = this.personInfo.occupational_taboo;
                }else{
                    this.occupationalTaboo = this.personInfo.occupationalTaboo;
                }
            },
            //抽屉展示(复查)
            handleWordChooseReview(type) {
                if (type == "zjzybmc") {
                    this.isMultiple = true;
                    this.title = "主检结论";
                } else {
                    this.isMultiple = false;
                    this.title = "常用术语";
                }
                // this.isMultiple = false;//允许多选
                this.wordChooseShowReview = true;
                this.type = type;
            },
            //抽屉展示(职业禁忌证)
            handleWordChooseOccupation(type) {
                if (type == "zyjjz") {
                    this.isMultiple = false;
                }
                this.title = "职业禁忌证";
                this.type = type;
                //套餐目标职业禁忌证
                if(this.personInfo.occupational_taboo){
                    this.occupationalTaboo = this.personInfo.occupational_taboo;
                    this.occupationalTabooCode = this.personInfo.occupational_taboo_code;
                }else{
                    this.occupationalTaboo = this.personInfo.occupationalTaboo;
                    this.occupationalTabooCode = this.personInfo.occupationalTabooCode;
                }
                this.wordChooseOccupationShow = true;
            },
            //抽屉展示(职业病)
            handleWordChooseDiseases(type) {
                if (type == "zyb") {
                    this.isMultiple = false;
                }
                this.title = "疑似职业病";
                this.type = type;
                //套餐目标职业病
                if(this.personInfo.occupational_diseases){
                    this.occupationalDiseases = this.personInfo.occupational_diseases;
                    this.occupationalDiseasesCode = this.personInfo.occupational_diseases_code;
                }else{
                    this.occupationalDiseases = this.personInfo.occupationalDiseases;
                    this.occupationalDiseasesCode = this.personInfo.occupationalDiseasesCode;
                }
                this.wordChooseDiseasesShow = true;
            },
            //获取专业术语回调
            getSelectedWords(word, cType) {
                let codeNow = word[0].code;
                if(codeNow && codeNow.indexOf(";") > -1){
                    let codeNowSplit = codeNow.split(';\n');
                    if (codeNowSplit.indexOf('12004') > -1) {//是否是职业禁忌证
                        this.isContraindication = true;
                    }else{
                        this.isContraindication = false;
                    }
                    if (codeNowSplit.indexOf('12003') > -1) {//是否是职业病
                        this.isDiseases = true;
                    }else{
                        this.isDiseases = false;
                    }
                    if (codeNowSplit.indexOf('12002') > -1) {//是否是复查
                        this.isReviewResult = true;
                    }else{
                        this.isReviewResult = false;
                    }
                }else{
                    if (codeNow == '12004') {//是否是职业禁忌证
                        this.isContraindication = true;
                    }else{
                        this.isContraindication = false;
                    }
                    if (codeNow == '12003') {//是否是职业病
                        this.isDiseases = true;
                    }else{
                        this.isDiseases = false;
                    }
                    if (codeNow == '12002') {//是否是复查
                        this.isReviewResult = true;
                    }else{
                        this.isReviewResult = false;
                    }
                }
                if (cType == "zjclyj") {
                    if(word.indexOf("可继续从事") > -1){
                        let text = "可继续";
                        if(this.personInfo.work_state_text && this.personInfo.work_state_text.trim()=="上岗前"){
                            text = "可"
                        }
                        this.inspectForm.handleOpinion =text + '从事接触' + this.personInfo.hazard_factors_text + '岗位工作，加强个人防护，定期参加职业健康体检。';
                    }else{
                        this.inspectForm.handleOpinion = word;
                    }
                    this.TTemplateId.handleOpinion = this.inspectForm.handleOpinion;
                } else if (cType == "zjzybmc") {
                    if(word[0].code){
                        this.inspectForm.conclusionCode = word[0].code;
                    }else{
                        this.inspectForm.conclusionCode = word[0].id;
                    }
                    this.inspectForm.conclusion = word[0].content;
                    this.TTemplateId.conclusion = word[0].content;
                    this.conclusionNow = word[0].content;
                    /*let name = word[0].content.split("：");
                    if (this.physicalType == "从业体检" || this.physicalType == "健康体检") {
                        this.inspectForm.conclusion = word[0].content;
                        this.TTemplateId.conclusion = word[0].content;
                    } else {
                        if (word[0].code == '12001') {
                            this.inspectForm.conclusion = word[0].content;
                            this.TTemplateId.conclusion = word[0].content;
                        } else if (word[0].code == '12002') {
                            this.inspectForm.conclusion = word[0].content;
                            this.TTemplateId.conclusion = word[0].content;
                        } else if (word[0].code == '12003') {
                            /!*if (this.personInfo.occupational_diseases) {
                                this.inspectForm.conclusion = name[0] + "：" + this.personInfo.occupational_diseases;
                            } else {
                                this.inspectForm.conclusion = name[0] + "：";
                            }
                            this.TTemplateId.conclusion = this.inspectForm.conclusion;*!/
                            this.inspectForm.conclusion = word[0].content;
                            this.TTemplateId.conclusion = this.inspectForm.conclusion;
                        } else if (word[0].code == '12004') {
                            /!*if (this.personInfo.occupational_taboo) {
                                this.inspectForm.conclusion = name[0] + "：" + this.personInfo.occupational_taboo;
                            } else {
                                this.inspectForm.conclusion = name[0] + "：";
                            }*!/
                            this.inspectForm.conclusion = word[0].content;
                            this.TTemplateId.conclusion = this.inspectForm.conclusion;
                        } else if (word[0].code == '12005') {
                            this.inspectForm.conclusion = word[0].content + this.overview;
                            this.TTemplateId.conclusion = word[0].content + this.overview;
                        }
                    }*/
                } else if (cType == 'zjqtjcycjg') {
                    if (!this.inspectForm.otherCheckAbnormalResults) {
                        this.inspectForm.otherCheckAbnormalResults = word;
                        this.TTemplateId.otherCheckAbnormalResults = word;
                    } else {
                        this.inspectForm.otherCheckAbnormalResults = this.inspectForm.otherCheckAbnormalResults + "\n" + word;
                        this.TTemplateId.otherCheckAbnormalResults = this.TTemplateId.otherCheckAbnormalResults + "\n" + word;
                    }
                } else if (cType == 'qtjbycclyj') {
                    this.inspectForm.careerIllnessName = word;
                    this.TTemplateId.careerIllnessName = word;
                }

                this.tabsArr.forEach(i => {
                    if (i.id == this.tabsValue) {
                        if (cType == "zdtx") {
                            i.diagnoseTip = word;
                        } else if (cType == "zdxj") {
                            i.diagnoseSum = word;
                        }
                    }
                })
            },
            //获取专业术语回调(复查)
            getSelectedWordsReview(word, cType) {
                if (cType == "zjclyj") {
                    if(word.indexOf("可继续从事") > -1){
                        let text = "可继续";
                        if(this.personInfo.work_state_text && this.personInfo.work_state_text.trim()=="上岗前"){
                            text = "可"
                        }
                        this.inspectForm.reviewOpinion =text + '从事接触' + this.personInfo.hazard_factors_text + '岗位工作，加强个人防护，定期参加职业健康体检。';
                        this.reviewDataOpinion = this.inspectForm.reviewOpinion;
                    }else{
                        this.inspectForm.reviewOpinion = word;
                        this.reviewDataOpinion = this.inspectForm.reviewOpinion;
                    }
                    this.TTemplateId.reviewOpinion = this.inspectForm.reviewOpinion;
                } else if (cType == "zjzybmc") {
                    if(word[0].code){
                        this.inspectForm.reviewResultCode = word[0].code;
                        this.reviewDataCode = this.inspectForm.reviewResultCode;
                    }else{
                        this.inspectForm.reviewResultCode = word[0].id;
                        this.reviewDataCode = this.inspectForm.reviewResultCode;
                    }
                    this.inspectForm.reviewResult = word[0].content;
                    this.TTemplateId.reviewResult = word[0].content;
                    this.reviewData = this.inspectForm.reviewResult;
                    this.conclusionNow = word[0].content;
                }

                this.tabsArr.forEach(i => {
                    if (i.id == this.tabsValue) {
                        if (cType == "zdtx") {
                            i.diagnoseTip = word;
                        } else if (cType == "zdxj") {
                            i.diagnoseSum = word;
                        }
                    }
                })
            },
            //获取职业禁忌证回调
            getSelectedWordsOccupation(word, wordCode, cType) {
                if (cType == 'zyjjz') {//是否是职业禁忌证
                    this.isContraindication = true;
                }else{
                    this.isContraindication = false;
                }
                if(cType == 'zyjjz' && word != ""){
                    this.occupationalTabooNow = word;
                    this.occupationalTabooNowCode = wordCode;
                }
                if(this.inspectForm.conclusion.indexOf(";\n") > -1){
                    let conclusionSplit = this.inspectForm.conclusion.split(';\n');
                    if(conclusionSplit && conclusionSplit.length > 0){
                        for(let i = 0;i < conclusionSplit.length;i ++){
                            if(conclusionSplit[i].indexOf("禁忌证") > -1){
                                conclusionSplit[i] = "职业禁忌证：" + this.occupationalTabooNow;
                            }
                        }
                    }
                    this.inspectForm.conclusion = conclusionSplit.join(';\n');
                    this.TTemplateId.conclusion = this.inspectForm.conclusion;
                }else{
                    this.inspectForm.conclusion = "职业禁忌证：" + this.occupationalTabooNow;
                    this.TTemplateId.conclusion = this.inspectForm.conclusion;
                }
            },
            //获取职业病回调
            getSelectedWordsDiseases(word, wordCode, cType) {
                if (cType == 'zyb') {//是否是职业病
                    this.isDiseases = true;
                }else{
                    this.isDiseases = false;
                }
                if(cType == 'zyb' && word != ""){
                    this.occupationalDiseasesNow = word;
                    this.occupationalDiseasesNowCode = wordCode;
                }
                if(this.inspectForm.conclusion.indexOf(";\n") > -1){
                    let conclusionSplit = this.inspectForm.conclusion.split(';\n');
                    if(conclusionSplit && conclusionSplit.length > 0){
                        for(let i = 0;i < conclusionSplit.length;i ++){
                            if(conclusionSplit[i].indexOf("职业病") > -1){
                                conclusionSplit[i] = "疑似职业病：" + this.occupationalDiseasesNow;
                            }
                        }
                    }
                    this.inspectForm.conclusion = conclusionSplit.join(';\n');
                    this.TTemplateId.conclusion = this.inspectForm.conclusion;
                }else{
                    this.inspectForm.conclusion = "疑似职业病：" + this.occupationalDiseasesNow;
                    this.TTemplateId.conclusion = this.inspectForm.conclusion;
                }
            },
            outChangeExpand() {
                this.outExpand = !this.outExpand;
                if (this.outExpand) {
                    this.outExpandIcon = "ios-arrow-back";
                    this.outSpan = 'position: relative;width: calc(100% - 332px);';
                    this.outLeftSpan = 'width: 300px;'
                } else {
                    this.outExpandIcon = "ios-arrow-forward";
                    this.outSpan = 'position: relative;width: calc(100% - 32px);';
                    this.outLeftSpan = 'width: 0px;';
                }
            },
            srcImage(url) {
                if(url.indexOf("/dcm") <= -1){
                    return "data:image/png;base64," + url;
                }else{
                    return url;
                }
            },
            setLabel(name) {
                name = name.split('')
                if (name.length == 2) {
                    return name[0] + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + name[1];
                }
                if (name.length == 3) {
                    return name[0] + '\xa0\xa0' + name[1] + '\xa0\xa0' + name[2];
                }
            },
            //复查选择
            typeChange(e) {
                this.personParam.pageNumber = 1;
                if (!e) {
                    this.isReviewer = false;

                } else {
                    this.isReviewer = true;
                }
                this.getPersonList();
            },
            //状态改变
            statusChange(v) {
                this.status = v;
                this.personList = [];
                this.inspectionInfoList = [];
                this.inspectForm.handleOpinion = '无';
                this.inspectForm.inspectionAutograph = "";
                this.personParam.keyword = '';
                this.personParam.pageNumber = 1;
                if (v == '待总检') {
                    this.currentIndex = 3;
                    this.personParam.isPass = 3;
                    this.inspectForm.inspectionDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');//总检日期
                    this.getPersonList();
                } else if (v == '已总检') {
                    this.currentIndex = 4;
                    this.personParam.isPass = 88;
                    this.getPersonList();
                } else {
                    this.currentIndex = 2;
                    this.personParam.isPass = 2;
                    this.getPersonList();
                }
            },
            //获取科室数据
            getAllSectionOfficeData() {
                queryAllSectionOfficeData({}).then(res => {
                    if (res.success) {
                        this.departmentData = res.data;
                    }
                })
            },
            //人员查询
            inputSearchChange(e) {
                this.personList = [];
                this.inspectionInfoList = [];
                this.personParam.pageNumber = 1;
                this.getPersonList();
            },
            //通过可以id与人员id查询检查项目
            getCheckProjectByOfficeId(id) {
                this.loading = true;
                queryAllTDepartItemResultList({personId: this.radioValue, officeId: id, checkDate: this.physicalTime}).then(res => {
                    if (res.success) {
                        this.resultData = res.data;
                        if (this.resultData.length > 0) {
                            for (let i = 0; i < this.resultData.length; i++) {
                                this.itemResult += this.resultData[i].result;
                            }
                            this.checkInfo.doctor = this.resultData[0].checkDoc;
                            this.checkInfo.time = this.resultData[0].createDate;
                        }
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            //格式化时间
            formatTime(e) {
                return formartDate(e, "yyyy-MM-dd");
            },
            radioChooseClick(item) {
                this.inspectForm.reviewInspectDate = null;//复查总检日期
                this.remind = "";
                this.radioValue = item.id;
                this.checkProParam.personId = this.radioValue;
                this.noCheckProParam.personId = this.radioValue;
                this.noCheckProParam.groupOrderId = item.orderId;
                this.noCheckProParam.groupId = item.groupId;
                this.crisisProParam.personId = this.radioValue;
                this.inspectForm.personId = this.radioValue;
                this.inspectForm.orderId = item.orderId;
                this.conclusionNow = "";
                this.getNoCheckProject();
                this.getAbandonCheckProject();
                this.getCrisisProject();
                //this.inspectForm.handleOpinion = "无"
                // let checkResultNow = item.checkResult;//体检结果（0-未见异常，1-其他异常，2-职业禁忌证，3-疑似职业病）
                let checkResultNow = item.isRecheck;//是否复查（0-不复查，1-复查）
                this.checkResultNow = checkResultNow;
                let checkResult = "";
                if(item.checkResult){
                    checkResult = item.checkResult;
                }else{
                    checkResult = "0";
                }
                if (checkResult.indexOf("4") > -1 || checkResultNow == 1 || this.status == "已总检") {
                    this.getInsRecord(this.radioValue);
                }
            },
            //查询人员总检记录
            getInsRecord(id) {
                getTInspectionRecordByPersonId({personId: id}).then(res => {
                    if (res.success) {
                        this.inspectForm.id = res.data.id;
                        this.inspectForm.inspectionDoctor = res.data.inspectionDoctor;
                        this.inspectForm.inspectionAutograph = res.data.inspectionAutograph;
                        this.inspectForm.reviewResult = res.data.reviewResult;
                        this.inspectForm.reviewResultCode = res.data.reviewResultCode;
                        this.inspectForm.reviewOpinion = res.data.reviewOpinion;
                        this.TTemplateId.doctor = res.data.inspectionAutograph;
                        if(this.status != "已总检" && !this.isReviewer){//待总检且非复查，获取当前时间作为总检日期
                            this.TTemplateId.inspectionDate = formartDate(new Date(), 'yyyy-MM-dd');
                            this.inspectForm.inspectionDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss');//总检日期
                        }else{
                            if(res.data.reviewInspectDate){
                                this.inspectForm.reviewInspectDate = res.data.reviewInspectDate;//复查总检日期
                                this.TTemplateId.reviewInspectDate = formartDate(this.inspectForm.reviewInspectDate, 'yyyy-MM-dd');
                            }else{
                                this.inspectForm.reviewInspectDate = null;//复查总检日期
                            }
                            this.inspectForm.inspectionDate = res.data.inspectionDate;
                            this.TTemplateId.inspectionDate = formartDate(this.inspectForm.inspectionDate, 'yyyy-MM-dd');
                        }
                        this.inspectForm.operator = res.data.operator;
                        this.inspectForm.healthCertificateConditions = res.data.healthCertificateConditions;
                        this.inspectForm.conclusion = res.data.conclusion;
                        this.inspectForm.conclusionCode = res.data.conclusionCode;
                        this.inspectForm.otherCheckAbnormalResults = res.data.otherCheckAbnormalResults;
                        this.inspectForm.careerIllnessName = res.data.careerIllnessName;
                        this.inspectForm.handleOpinion = res.data.handleOpinion;
                        if(res.data.conclusionCode && res.data.conclusionCode.trim().length>0){
                            for(let i = 0;i < this.conclusionCodeNowData.length;i ++){
                                if(this.physicalType == "职业体检" || this.physicalType == "放射体检"){
                                    if(this.conclusionCodeNowData[i].value == res.data.conclusionCode){
                                        this.conclusionNow = this.conclusionCodeNowData[i].title;
                                    }
                                }else{
                                    if(this.conclusionCodeNowData[i].id == res.data.conclusionCode){
                                        this.conclusionNow = this.conclusionCodeNowData[i].content;
                                    }
                                }
                            }
                        }
                    }
                })
            },
            //模板查看(明细)
            handleViewTemplate() {
                this.previewShowMX = true;
                this.personInfo = JSON.parse(JSON.stringify(this.personInfo));
                let tab = this.tabsArr.find(i => this.tabsValue == i.id);
                this.personInfo.pacsData = this.pacsData;
                this.personInfo.groupItems = tab;
                this.personInfo.baseProject = this.baseProjectData;
            },
            //点击树
            selectTree(v) {
                this.physicalTime = "";
                this.itemResult = '';
                if (v.length > 0) {
                    // 转换null为""
                    for (let attr in v[0]) {
                        if (v[0][attr] == null) {
                            v[0][attr] = "";
                        }
                    }
                    let str = JSON.stringify(val[0]);
                    let data = JSON.parse(str);
                    this.officeName = data.title;
                    // if (data.title == "问诊科") {
                    //     this.wzShow = true;
                    //     //     getTGroupPersonWZInfo({id: data.personId}).then(res => {
                    //     //         if (res.success) {
                    //     //             if (res.data) {
                    //     //                 //人信息
                    //     //                 this.personWZInfo = res.data;
                    //     //             }
                    //     //         }
                    //     //     }).finally(() => {
                    //     //         this.wzShow = false;
                    //     //     })
                    // } else {
                    this.officeId = data.officeId;
                    this.getResultByGroupId(data.officeId);
                    // }
                }
            },
            //点击明细结果科室
            clickSelectTree(v){
                let val = [];
                val.push(v);
                this.physicalTime = "";
                this.itemResult = '';
                if (val.length > 0) {
                    // 转换null为""
                    for (let attr in val[0]) {
                        if (val[0][attr] == null) {
                            val[0][attr] = "";
                        }
                    }
                    let str = JSON.stringify(val[0]);
                    let data = JSON.parse(str);
                    this.officeName = data.title;
                    this.officeId = data.officeId;
                    this.getResultByGroupId(data.officeId);
                }
            },

            //获取分组
            getResultByGroupId(officeId, startDate, endDate,groupItemId) {
                this.groupShow = true;
                getGroupByOfficeId({officeId: officeId, personId: this.radioValue,groupId: this.personInfo.group_id, startDate: startDate, endDate: endDate}).then(res => {
                    if (res.success) {
                        this.tabsArr = res.data;
                        if (res.data.length > 0) {
                            if(groupItemId){//定位到具体项目
                                let nowItemArry = this.tabsArr.filter(item => item.groupItemId && item.groupItemId==groupItemId);
                                if(nowItemArry && nowItemArry.length>0){
                                    this.tabsValue = nowItemArry[0].id;
                                }else{
                                    this.tabsValue = this.tabsArr[0].id;
                                }
                            }else{
                                this.tabsValue = this.tabsArr[0].id;
                            }
                        }
                        this.getBaseProjectResult();
                        //this.handleCheckStatus();
                    }
                }).finally(() => {
                    this.groupShow = false;
                    this.handleCheckStatus();
                })
            },
            //获取基础项目结果
            getBaseProjectResult() {
                if (this.officeName != '问诊科') {
                    let tab = this.tabsArr.find(i => i.id == this.tabsValue);
                    if (tab.groupItemName.indexOf('复') > -1) {
                        this.getSelectedBaseItemByItemId_front(tab.groupItemId,tab.portfolioProjectId,tab.groupId, tab.isFile);
                    }else{
                        this.getSelectedBaseItemByItemId_front(tab.groupItemId,"","", tab.isFile);
                    }
                }
            },
            // tab点击事件
            tabsClick(e) {
                this.personHeight = 0;
                this.personWeight = 0;
                this.getBaseProjectResult();
                this.pacsData = [];
            },
            //获取选中的基础项目
            getSelectedBaseItemByItemId_front(itemId, portfolioId = "", groupId = "", isFile) {
                if (itemId) {
                    this.data = [];
                    this.pacsData = [];
                    this.loading = true;
                    getSelectedBaseItemByItemId({
                        itemId: itemId,
                        personId: this.personInfo.id,
                        portfolioId: portfolioId,
                        groupId: groupId
                    }).then(res => {
                        if (res.success) {
                            if (res.data && res.data.length > 0) {
                                res.data.forEach(i => {
                                    if (i.departItemResults == null) {
                                        i.departItemResults = {};
                                        i.departItemResults.personId = this.personInfo.id;
                                        i.departItemResults.orderGroupItemProjectName = i.name;
                                        i.departItemResults.orderGroupItemProjectId = i.id;
                                    } else {
                                        if (i.name == "身高") {
                                            this.personHeight = i.departItemResults.result;
                                        }
                                        if (i.name == "体重") {
                                            this.personWeight = i.departItemResults.result;
                                        }
                                    }

                                    if (isFile == '是' && i.departItemResults.imgUrl) {
										if(i.departItemResults.imgUrl.indexOf(",") > -1){
											let imgUrls = i.departItemResults.imgUrl.split(",");
											imgUrls.forEach(item => {
												this.pacsData.push(item);
											});
										}else{
											this.pacsData.push(i.departItemResults.imgUrl);
										}
                                    }
                                })
                                this.baseProjectData = res.data;
                            }
                        }
                    }).finally(() => {
                        this.loading = false;
                    })
                }
            },
            //结果查看点击
            resultClick(tab) {
                this.officeName = "";
                this.resultData = [];
                this.tabsArr = [];
                this.checkInfo = {};
                this.itemResult = "";
                this.physicalTime = "";
                if (tab.name == "name1") {
                    this.getPersonOffice(this.radioValue);
                } else if (tab.name == "name2") {
                    this.getPersonOffice(this.radioValue);
                }
            },

            //查询人员检查科室
            getPersonOffice(id) {
                this.treeLoading = true;
                queryPersonCheckOffice({personId: id}).then(res => {
                    if (res.success) {
                        let data = [];
                        this.officeId = "";
                        this.officeName = "";
                        if (this.personInfo.physical_type != "健康体检") {
                            let office = {
                                title: "问诊科",
                                personId: id,
                                officeId: "1454369800754171904",
                                selected: true,
                            };
                            data.push(office);
                        }
                        for (let i = 0; i < res.data.length; i++) {
                            let obj = {...res.data[i]};
                            obj.title = obj.officeName;
                            if (this.personInfo.physical_type == "健康体检" && i == 0) {
                                obj.selected = true;
                            }
                            data.push(obj);
                        }
                        this.treeData = data;
                        this.officeId = this.treeData[0].officeId;
                        this.$nextTick(() => {
                            for (let i = 0; i < this.treeData.length; i++){
                                let officeId = this.treeData[i].officeId;
                                let officeName = this.treeData[i].officeName;
                                //let tabs = document.getElementById("trees"+officeId);
                                let icon = document.getElementById("icon"+officeId);
                                if (!this.checkPhysical2(officeId)&&officeName!="问诊科"){
                                    //tabs.style.color = "black"
                                    icon.style.color = "white"
                                    }else {
                                    //tabs.style.color = "red"
                                    icon.style.color = "red"
                                    }
                            }
                        })
                        this.officeName = this.treeData[0].officeName;
                        if (this.personInfo.physical_type == "健康体检") {
                            this.getResultByGroupId(this.treeData[0].officeId);
                        } else {
                            /*if(!this.typeStatus){
                                this.officeName = '问诊科';
                                this.wzShow = true;
                                getTGroupPersonWZInfo({id: id}).then(res => {
                                    if (res.success) {
                                        if (res.data) {
                                            //人信息
                                            this.personWZInfo = res.data;
                                        }
                                    }
                                }).finally(() => {
                                    this.wzShow = false;
                                })
                            }else{
                                this.getResultByGroupId(this.treeData[0].officeId);
                            }*/
                            this.officeName = '问诊科';
                            this.wzShow = true;
                            getTGroupPersonWZInfo({id: id}).then(res => {
                                if (res.success) {
                                    if (res.data) {
                                        //人信息
                                        this.personWZInfo = res.data;
                                    }
                                }
                            }).finally(() => {
                                this.wzShow = false;
                            })
                        }
                    }
                }).finally(() => {
                    this.treeLoading = false;
                })
            },
            handleView(v) {
                v = v.target.src;
                let image = new Image();
                image.src = v;
                let viewer = new Viewer(image, {
                    hidden: function () {
                        viewer.destroy();
                    },
                });
                viewer.show();
            },
            //体检时间改变
            physicalTimeChange(e) {
                if (e) {
                    let startDate = e[0]
                    let endDate = e[1]
                    if (this.officeId) {
                        if (this.officeName == "问诊科") {
                            this.wzShow = true;
                            getTGroupPersonWZInfo({id: this.personInfo.id, startDate, endDate}).then(res => {
                                if (res.success) {
                                    if (res.data) {
                                        //人信息
                                        this.personWZInfo = res.data;
                                    }
                                }
                            }).finally(() => {
                                this.wzShow = false;
                            })
                        } else {
                            this.getResultByGroupId(this.officeId, startDate, endDate);
                        }
                    } else {
                        this.$Message.error("请先选择科室");
                    }
                }
            },
            //总检报告预览
            reportPreview() {
                //判定总检类型
                let templateId = "";
                if (this.personInfo.physical_type && this.personInfo.physical_type == "职业体检") {
                    templateId = "912a58d9604775cc399b44020efa3e3a";
                } else if (this.personInfo.physical_type && this.personInfo.physical_type == "从业体检") {
                    templateId = "efc9ac2f1e298225e75306cee33f5d52";
                } else if (this.personInfo.physical_type && this.personInfo.physical_type == "放射体检") {
                    templateId = "912a58d9604775cc399b44020efa3e3a";
                } else {
                    templateId = "dd6ca5975f9b12aa70d49dbba769013a";
                }
                this.TTemplateId.id = templateId;
                this.TTemplateId.handleOpinion = this.inspectForm.handleOpinion
                this.TTemplateId.conclusion = this.inspectForm.conclusion;
                this.TTemplateId.otherCheckAbnormalResults = this.inspectForm.otherCheckAbnormalResults
                this.TTemplateId.careerIllnessName = this.inspectForm.careerIllnessName;
                this.TTemplateId.reviewResult = this.inspectForm.reviewResult;
                this.previewShow = true;
            },
            //复查记录
            reviewRecordClick() {
                this.tableDataReview = [];
                for(let i = 0;i < this.tableData.length;i ++){//
                    if(this.tableData[i].groupItemName.indexOf("复") > -1){
                        this.tableDataReview.push(this.tableData[i].groupItemId)
                    }
                }
                this.reviewRecordShow = true;
            },
            //审核
			auditingReportClick(){
                this.auditingReportShow = true;
            },
            //获取人员列表
            async getPersonList() {
                this.checkPersonLoading = true;
                this.inspectionLoading = true;
                this.personParam.physicalType = this.physicalType;
                this.radioValue = "";
                this.conclusionNow = "";
                let searchForm = JSON.parse(JSON.stringify(this.personParam));
                //输入了就不带时间
                if (this.$hospitalName.queryTimeChange) {
                    if ((this.personParam.keyword && this.personParam.keyword.trim().length > 0) || (this.personParam.personName && this.personParam.personName.trim().length > 0) || (this.personParam.testNum && this.personParam.testNum.trim().length > 0) || (this.personParam.dept && this.personParam.dept.trim().length > 0)) {
                        this.personParam.startDate = null;
                        this.personParam.endDate = null;
                        this.date = '';//取消时间筛选
                    }
                    searchForm = JSON.parse(JSON.stringify(this.personParam));
                }else{
                    if(searchForm.startDate == null||searchForm.startDate .trim().length==0){
                        searchForm.startDate = "0000-00-00 00:00:00"
                    }
                    if(searchForm.endDate == null||searchForm.endDate .trim().length==0){
                        let endTime = getDataString(new Date);
                        searchForm.endDate = endTime + " 23:59:59"
                    }
                }

                if(this.isReviewer){
                    getInspectionTGroupPersonReviewList(searchForm).then(res => {
                        if (res.success) {
                            this.personList = res.data.records;
                            this.personTotal = res.data.total;
                            this.inspectForm.id = "";
                            if (this.personList.length > 0) {
                                this.personInfo = this.personList[0];
                                this.personInfo.unitName = this.personList[0].dept;
                                this.radioValue = this.personList[0].id;
                                //查询第一个人员检查项目

                                this.checkProParam.personId = this.radioValue;
                                this.noCheckProParam.personId = this.radioValue;
                                this.noCheckProParam.groupOrderId = this.personList[0].orderId;
                                this.noCheckProParam.groupId = this.personList[0].groupId;
                                this.crisisProParam.personId = this.radioValue;
                                this.inspectForm.personId = this.radioValue;
                                this.inspectForm.orderId = this.personList[0].orderId;
                                this.getNoCheckProject();
                                this.getCrisisProject();
                                this.getAbandonCheckProject();
                                // let checkResultNow = this.personList[0].checkResult;//体检结果（0-未见异常，1-其他异常，2-职业禁忌证，3-疑似职业病）
                                let checkResultNow = this.personList[0].isRecheck;//是否复查（0-不复查，1-复查）
                                this.checkResultNow = checkResultNow;
                                let checkResult = "";
                                if(this.personList[0].checkResult){
                                    checkResult = this.personList[0].checkResult;
                                }else{
                                    checkResult = "0";
                                }
                                if (checkResult.indexOf("4") > -1 || checkResultNow == 1 || this.status == "已总检") {
                                    this.getInsRecord(this.radioValue);
                                }

                                //批量总检
                                for (let i = 0; i < this.personList.length; i++) {
                                    if (this.personList[i] && this.personList[i].isAllChecked && this.personList[i].isAllChecked == 0) {
                                        let careerIllnessName = '无';
                                        let otherCheckAbnormalResults = '无';
                                        let handleOpinion = '无';
                                        let conclusion = '目前未见异常；';
                                        let conclusionCode = "";
                                        if (this.personList[i].physicalType == "职业体检"||this.personList[i].physicalType == "放射体检") {
                                            let text = "可继续";
                                            if(this.personList[i].work_state_text && this.personList[i].work_state_text.trim()=="上岗前"){
                                                text = "可"
                                            }
                                            handleOpinion = text +'从事接触' + this.personList[i].hazard_factors_text + '岗位工作，建议加强个人防护，定期参加职业健康体检。';
                                            conclusion = "目前未见异常；";
                                            conclusionCode = "12001";
                                        }
                                        let param = {
                                            personId: this.personList[i].id,
                                            orderId: this.personList[i].orderId,
                                            inspectionType: 2,
                                            inspectionDoctor: this.inspectForm.inspectionDoctor,// 总检医生
                                            inspectionDate: formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),//总检日期
                                            operator: this.inspectForm.inspectionDoctor,//操作员
                                            healthCertificateConditions: '合格',//健康证条件
                                            conclusion: conclusion,//结论
                                            conclusionCode: conclusionCode,//结论代码
                                            handleOpinion: handleOpinion,//处理意见
                                            careerIllnessName: careerIllnessName,//其他疾病或异常处理意见
                                            otherCheckAbnormalResults: otherCheckAbnormalResults,//其他疾病或异常描述
                                        };

                                        this.inspectionInfoList.push(param);
                                    }
                                }
                            } else {
                                this.personInfo.id = "";
                            }
                        } else {
                            this.personInfo = {};
                            this.remind = "";
                            this.tableData = [];
                            this.crisisData = [];
                            this.noInsProjectData = [];
                            this.noInsProject = "未检项目";
                            this.treeData = [];
                            this.resultData = [];
                            this.tabsArr = [];
                            this.radioValue = "";
                        }
                    }).finally(() => {
                        this.checkPersonLoading = false;
                        this.inspectionLoading = false;
                    })
                }else{
                    getInspectionTGroupPersonList(searchForm).then(res => {
                        if (res.success) {
                            this.personList = res.data.records;
                            this.personTotal = res.data.total;
                            this.inspectForm.id = "";
                            if (this.personList.length > 0) {
                                this.personInfo = this.personList[0];
                                this.personInfo.unitName = this.personList[0].dept;
                                this.radioValue = this.personList[0].id;
                                //查询第一个人员检查项目

                                this.checkProParam.personId = this.radioValue;
                                this.noCheckProParam.personId = this.radioValue;
                                this.noCheckProParam.groupOrderId = this.personList[0].orderId;
                                this.noCheckProParam.groupId = this.personList[0].groupId;
                                this.crisisProParam.personId = this.radioValue;
                                this.inspectForm.personId = this.radioValue;
                                this.inspectForm.orderId = this.personList[0].orderId;
                                this.getNoCheckProject();
                                this.getCrisisProject();
                                this.getAbandonCheckProject();
                                // let checkResultNow = this.personList[0].checkResult;//体检结果（0-未见异常，1-其他异常，2-职业禁忌证，3-疑似职业病）
                                let checkResultNow = this.personList[0].isRecheck;//是否复查（0-不复查，1-复查）
                                this.checkResultNow = checkResultNow;
                                let checkResult = "";
                                if(this.personList[0].checkResult){
                                    checkResult = this.personList[0].checkResult;
                                }else{
                                    checkResult = "0";
                                }
                                if (checkResult.indexOf("4") > -1 || checkResultNow == 1 || this.status == "已总检") {
                                    this.getInsRecord(this.radioValue);
                                }

                                //批量总检
                                for (let i = 0; i < this.personList.length; i++) {
                                    if (this.personList[i].isAllChecked == 0) {
                                        let careerIllnessName = '无';
                                        let otherCheckAbnormalResults = '无';
                                        let handleOpinion = '无';
                                        let conclusion = '目前未见异常；';
                                        let conclusionCode = "";
                                        if (this.personList[i].physicalType == "职业体检"||this.personList[i].physicalType == "放射体检") {
                                            let text = "可继续";
                                            if(this.personList[i].work_state_text && this.personList[i].work_state_text.trim()=="上岗前"){
                                                text = "可"
                                            }
                                            handleOpinion = text +'从事接触' + this.personList[i].hazard_factors_text + '岗位工作，建议加强个人防护，定期参加职业健康体检。';
                                            conclusion = "目前未见异常；";
                                            conclusionCode = "12001";
                                        }
                                        let param = {
                                            personId: this.personList[i].id,
                                            orderId: this.personList[i].orderId,
                                            inspectionType: 2,
                                            inspectionDoctor: this.inspectForm.inspectionDoctor,// 总检医生
                                            inspectionDate: formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),//总检日期
                                            operator: this.inspectForm.inspectionDoctor,//操作员
                                            healthCertificateConditions: '合格',//健康证条件
                                            conclusion: conclusion,//结论
                                            conclusionCode: conclusionCode,//结论代码
                                            handleOpinion: handleOpinion,//处理意见
                                            careerIllnessName: careerIllnessName,//其他疾病或异常处理意见
                                            otherCheckAbnormalResults: otherCheckAbnormalResults,//其他疾病或异常描述
                                        };

                                        this.inspectionInfoList.push(param);
                                    }
                                }
                            } else {
                                this.personInfo.id = "";
                            }
                        } else {
                            this.personInfo = {};
                            this.remind = "";
                            this.tableData = [];
                            this.crisisData = [];
                            this.noInsProjectData = [];
                            this.noInsProject = "未检项目";
                            this.treeData = [];
                            this.resultData = [];
                            this.tabsArr = [];
                            this.radioValue = "";
                        }
                    }).finally(() => {
                        this.checkPersonLoading = false;
                        this.inspectionLoading = false;
                    })
                }
            },
            //获取人员信息
            getOnePersonData(id) {
                this.personInfo = {};
                this.remind = "";
                this.overview = "";
                let _this = this;
                getTGroupPersonWithLink({id}).then(res => {
                    if (res.success && res.data) {
						_this.personInfo = res.data;
                        /*if(_this.personInfo.is_wz_check == 0){
                            _this.noInsProjectData.push({
                                officeName: "问诊科",
                                name: "问诊信息录入",
                            });
                            setTimeout(function() {
                                _this.checkNum = _this.noInsProjectData.length;
                                _this.noInsProject = "未检项目" + "(" + _this.noInsProjectData.length + "项)";
                            }, 1500)
                        }*/
						if(_this.personInfo.occupational_taboo_now){
                            _this.occupationalTabooNow = _this.personInfo.occupational_taboo_now;
                            _this.occupationalTabooNowCode = _this.personInfo.occupational_taboo_now_code;
                        }else{
                            _this.occupationalTabooNow = "";
                            _this.occupationalTabooNowCode = "";
                        }
						if(_this.personInfo.occupational_diseases_now){
                            _this.occupationalDiseasesNow = _this.personInfo.occupational_diseases_now;
                            _this.occupationalDiseasesNowCode = _this.personInfo.occupational_diseases_now_code;
                        }else{
                            _this.occupationalDiseasesNow = "";
                            _this.occupationalDiseasesNowCode = "";
                        }
                        if(_this.personInfo.review_result){
                            _this.reviewData = _this.personInfo.review_result;
                            _this.inspectForm.reviewResult = _this.personInfo.review_result;
                        }else{
                            _this.reviewData = "";
                            _this.inspectForm.reviewResult = "";
                        }
                        let checkResultNow = _this.personInfo.check_result;
                        if(checkResultNow && checkResultNow.indexOf(",") > -1){
                            let checkResultNowSplit = checkResultNow.split(",");
                            if(checkResultNowSplit.indexOf('2') > -1){
                                _this.isContraindication = true;
                            }else{
                                _this.isContraindication = false;
                            }
                            if(checkResultNowSplit.indexOf('3') > -1){
                                _this.isDiseases = true;
                            }else{
                                _this.isDiseases = false;
                            }
                            if(checkResultNowSplit.indexOf('4') > -1){
                                _this.isReviewResult = true;
                            }else{
                                _this.isReviewResult = false;
                            }
                        }else if(checkResultNow){
                            if(checkResultNow == '2'){
                                _this.isContraindication = true;
                            }else{
                                _this.isContraindication = false;
                            }
                            if(checkResultNow == '3'){
                                _this.isDiseases = true;
                            }else{
                                _this.isDiseases = false;
                            }
                            if(checkResultNow == '4'){
                                _this.isReviewResult = true;
                            }else{
                                _this.isReviewResult = false;
                            }
                        }
						_this.TTemplateId.personInfo = _this.personInfo;
						_this.getCheckProject();
                        // if (_this.personInfo.physical_type == "从业体检") {

                            // this.personInfo = res.data;
                            // this.TTemplateId.personInfo = this.personInfo;
                            // this.TTemplateId.personId = id;
                            // this.getCheckProject();
                            if (this.personInfo.physical_type == "从业体检") {
                                //获取体检结论
                                getDictDataByType("practice_physical_conclusion").then(res => {
                                    if (res.success) {
                                        _this.conclusionList = res.data;
                                        _this.conclusionCode = res.data[0].value;
                                    }
                                });
                            } else if (_this.personInfo.physical_type == "健康体检") {
                                //获取体检结论
                                getDictDataByType("healthy_physical_conclusion").then(res => {
                                    if (res.success) {
                                        _this.conclusionList = res.data;
                                        _this.conclusionCode = res.data[0].value;
                                    }
                                });
                            }
                            let isDefaultValue = _this.$hospitalName.isDefaultValue;
                            if(_this.status != '已总检' && !_this.isReviewResult && _this.personInfo.is_recheck != 1){
                                if (_this.personInfo.physical_type == "职业体检" || _this.personInfo.physical_type == "放射体检") {
                                    let text = "可继续";
                                    if(_this.personInfo.work_state_text && _this.personInfo.work_state_text.trim()=="上岗前"){
                                        text = "可"
                                    }
                                    _this.inspectForm.handleOpinion =text + '从事接触' + _this.personInfo.hazard_factors_text + '岗位工作，建议加强个人防护，定期参加职业健康体检。';
                                    if(isDefaultValue){
                                        _this.inspectForm.conclusion = "目前未见异常；";
                                        _this.inspectForm.conclusionCode = "12001";
                                    }
                                }
                            }
                        // }
                        if(_this.personInfo && _this.personInfo.regist_date ){
                            _this.personInfo.regist_date = formartDate(_this.personInfo.regist_date,"yyyy-MM-dd HH:mm:ss")
                        }
                    }
                }).finally(() => {
                    this.personInfoLoading = false;
                    this.radioShow = false;
                })
            },
            //获取结果异常人员列表
            getSummaryPerson() {
                this.summaryLoading = true;
                this.positive.personId = this.personInfo.id;
                if(!this.typeStatus){
                    querySummaryResultList(this.positive).then(res => {
                        if (res.success) {
                            this.summaryData = res.data.records;
                            this.summarytotal = res.data.total;
                        }
                    }).finally(() => {
                        this.summaryLoading = false;
                    })
                }else{
                    querySummaryResultListReview(this.positive).then(res => {
                        if (res.success) {
                            this.summaryData = res.data.records;
                            this.summarytotal = res.data.total;
                        }
                    }).finally(() => {
                        this.summaryLoading = false;
                    })
                }
            },
            //结果汇总页数改变
            summaryChangePage(v) {
                this.positive.pageNumber = v;
                this.getSummaryPerson();
            },
            //结果汇总展示条数改变
            summaryChangePageSize(v) {
                this.positive.pageSize = v;
                this.getSummaryPerson();
            },
            //人员检查项目页数改变
            changePage(v) {
                this.checkProParam.pageNumber = v;
                this.getCheckProject();
            },
            //获取人员危机检查项目
            getCrisisProject() {
                this.crisisLoading = true;
                this.crisisData = [];
                queryAllAbnormalItemResultList(this.crisisProParam).then(res => {
                    if (res.success) {
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].scope) {
                                this.crisisData.push(res.data[i]);
                            }
                            if (res.data[i].result && this.status != "已总检") {
                                this.overview += res.data[i].orderGroupItemProjectName + "：" + res.data[i].result + res.data[i].unitName + ";" + res.data[i].crisisDegree + "\n";
                            }
                        }
                        // if (this.status != "已总检") {
                        //     if (this.personInfo.physical_type == "健康体检" || this.personInfo.physical_type == "从业体检") {
                        //         if (res.data.length > 0) {
                        //             this.inspectForm.conclusion = "其他疾病或异常：" + "\n" + this.overview;
                        //             this.inspectForm.conclusionCode = "12001";
                        //         } else {
                        //             this.inspectForm.conclusion = "本次检查所检项目目前未见明显异常。";
                        //             this.inspectForm.conclusionCode = "12001";
                        //         }
                        //     } else {
                        //         if (res.data.length > 0) {
                        //             this.inspectForm.conclusion = "其他疾病或异常：除目标疾病之外的其他疾病或某些检查指标的异常。" + "\n" + this.overview;
                        //             this.inspectForm.conclusionCode = "12005";
                        //         } else {
                        //             this.inspectForm.conclusion = "本次职业检查所检项目目前未见异常";
                        //             this.inspectForm.conclusionCode = "12001";
                        //         }
                        //     }
                        // }
                        //this.inspectForm.conclusion += "\n" + this.overview;
                    }
                }).finally(() => {
                    this.crisisLoading = false;
                })
            },
            //获取人员检查项目
            getCheckProject() {
                this.tableLoading = true;
                this.tableData = [];
                this.remind = "";
                if(this.personInfo && this.personInfo.group_id){
                    this.checkProParam.groupId = this.personInfo.group_id;
                }
                queryTDepartResultList(this.checkProParam).then(res => {
                    if (res.success) {
                        this.tableData = res.data;
                        let str = "";
                        //诊断提醒
                        this.officeIdData = [];
                        this.ProjectException = [];
                        for (let i = 0; i < this.tableData.length; i++) {
							let t = this.tableData[i];
							if (t.positive && t.positive.trim()!='0'){
                                this.officeIdData.push(t.officeId);
                                this.ProjectException.push(t.id);
                            }
                            if (t.diagnoseTip && t.diagnoseSum) {
								if(t.diagnoseSum.indexOf("未见明显异常") == -1){
									if(!this.checkPhysical(t.diagnoseSum)){
										let time = formartDate(this.tableData[i].checkDate, "yyyy-MM-dd HH:mm:ss");
										this.remind += this.userInfo.nickname + "医生[" + time + "]:" + "<br>" + "<span style='color: red;font-size: 15px'>" + this.tableData[i].groupItemName + "：" + this.tableData[i].diagnoseTip + "</span>" + "<br>";
									}
                                }
                            }

                            // if (t.diagnoseSum && t.diagnoseSum != "" && t.diagnoseSum != "未见明显异常" && t.diagnoseSum != "正常" && t.diagnoseSum != "正常心电图" && t.diagnoseSum.indexOf("无异常") <= -1 && t.diagnoseSum.indexOf("未见明显异常") <= -1 && t.diagnoseSum.indexOf("健康") <= -1) {
                            if (t.diagnoseSum && t.diagnoseSum != "") {
                                // if(t.diagnoseSum.indexOf("高于正常值") > -1 || t.diagnoseSum.indexOf("低于正常值") > -1 || t.diagnoseSum.indexOf(",异常") > -1){

                                if(t.diagnoseSum.indexOf("未见明显异常") == -1){

									if(!this.checkPhysical(t.diagnoseSum)){
									    let diagnoseSumNow = t.diagnoseSum;
									    let groupItemName = t.groupItemName;
                                        if (t.groupItemName && t.groupItemName.indexOf("(")>-1 && t.groupItemName.indexOf(")")>-1){
                                            groupItemName = t.groupItemName.split("(")[0];
                                        }else if(t.groupItemName && t.groupItemName.indexOf("（")>-1 && t.groupItemName.indexOf("）")>-1){
                                            groupItemName = t.groupItemName.split("（")[0];
                                        }else {
                                            groupItemName = t.groupItemName;
                                        }

                                        if(this.personInfo.physical_type == "健康体检" && (t.officeId=="173" || t.officeId=="204")){
                                            diagnoseSumNow = diagnoseSumNow ? diagnoseSumNow.replaceAll("。","") : "";
                                        }
										if (diagnoseSumNow.lastIndexOf(";") > -1 || diagnoseSumNow.lastIndexOf("；") > -1) {
                                            if(this.personInfo.physical_type == "健康体检" && (t.officeId=="173" || t.officeId=="204")){
                                                let diagnoseSumNew = diagnoseSumNow ? diagnoseSumNow.replaceAll(";","，").replaceAll("；","，") : "";
                                                str += groupItemName + ":" + diagnoseSumNew + "\n";
                                            }else{
                                                str += groupItemName + ":" + diagnoseSumNow + "\n";
                                            }
										} else {
                                            if(this.personInfo.physical_type == "健康体检" && (t.officeId=="173" || t.officeId=="204")){
                                                str += groupItemName + ":" + diagnoseSumNow + "，\n";
                                            }else{
                                                str += groupItemName + ":" + diagnoseSumNow + ";\n";
                                            }
										}
                                    }

                                }
                            }

                        }
                        if(str){
                            str = str.replace(/^\s+|\s+$/g,'');
                        }
                        let isDefaultValue = this.$hospitalName.isDefaultValue;
                        if (this.status != "已总检" && !this.isReviewResult) {
                            if (this.personInfo.physical_type == "健康体检" || this.personInfo.physical_type == "从业体检") {
                                if (str == "") {
                                    if(isDefaultValue){
                                        this.inspectForm.conclusion = "本次体检所检项目目前未见异常。";
                                        this.inspectForm.conclusionCode = "12001";
                                    }
                                } else {
                                    // this.inspectForm.conclusion = "其他疾病或异常：" + "\n" + str;
                                    /*if(isDefaultValue) {
                                        this.inspectForm.conclusion = str;
                                        this.inspectForm.conclusionCode = "12001";
                                    }*/
                                    this.inspectForm.conclusion = str;
                                    this.inspectForm.conclusionCode = "12001";
                                }
                            } else {
                                if (str == "") {
                                    this.inspectForm.otherCheckAbnormalResults = "";
                                    if(isDefaultValue) {
                                        if (this.personInfo.work_state_text && this.personInfo.work_state_text.trim().indexOf("离岗")>-1){
                                            this.inspectForm.handleOpinion = '本次离岗体检未见' + this.personInfo.hazard_factors_text + '作业疑似职业病，可以离岗。'
                                        }
                                        this.inspectForm.conclusion = "目前未见异常";
                                        this.inspectForm.conclusionCode = "12001";
                                    }
                                } else {
                                    this.inspectForm.otherCheckAbnormalResults = str;
                                    this.TTemplateId.otherCheckAbnormalResults = str;
                                    if(isDefaultValue) {
                                        this.inspectForm.conclusion = "其他疾病或异常：";
                                        this.inspectForm.conclusionCode = "12005";
                                    }
                                }
                            }
                        }
                    }
                }).finally(() => {
                    this.tableLoading = false;
                })
            },

            //组合项目添加异常图标
            handleCheckStatus() {
                if (this.officeName!= '问诊科' && this.tabsArr.length > 0) {
                    this.$nextTick(() => {
                        for (let i = 0; i <this.tabsArr.length; i++) {
                            let t = this.tabsArr[i];
                            let icon = document.getElementById('elIcon'+t.id);
                            if(!this.checkPhysical1(t.id)){
                                icon.style.color = "white";//绿色
                            }else {
                                icon.style.color = "red";//红色
                            }
                    }})
                }
            },

            //检查是否是正常的结论
			checkPhysical(name){
				name = name.trim();
				name=name.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
				let physicalSummary = this.$hospitalName.physicalSummary;
				if(physicalSummary){
					let res = false;
					physicalSummary.forEach(ii=>{
						if(name == ii || name == ii+"。" || (name.indexOf("未见异常")>-1) || (name.indexOf("正常")>-1)){
							res = true;
                        }
                    });
					return  res;
                }
                return false;
            },
            //检查是否是正常的体检项目
            checkPhysical1(name){
                name = name.trim();
                name=name.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
                let physicalSummary = this.ProjectException;
                if(physicalSummary){
                    let res = false;
                    physicalSummary.forEach(ii=>{
                        if(name == ii || name == ii+"。" || (name.indexOf("未见异常")>-1) || (name.indexOf("正常")>-1)){
                            res = true;
                        }
                    });
                    return  res;
                }
                return false;
            },
            //检查是否是正常的体检科室
            checkPhysical2(name){
                name = name.trim();
                name=name.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
                let physicalSummary = this.officeIdData;
                if(physicalSummary){
                    let res = false;
                    physicalSummary.forEach(ii=>{
                        if(name == ii || name == ii+"。" || (name.indexOf("未见异常")>-1) || (name.indexOf("正常")>-1)){
                            res = true;
                        }
                    });
                    return  res;
                }
                return false;
            },

            //获取人员未检查项目
            getNoCheckProject() {
                this.noInsProjectLoading = true;
                this.noInsProjectData = [];
                queryNoCheckTOrderGroupItemProjectList(this.noCheckProParam).then(res => {
                    if (res.success) {
                        this.noInsProjectData = res.data;
                        this.checkNum = res.data.length;
                        this.noInsProject = "未检项目" + "(" + this.noInsProjectData.length + "项)";
                    }
                }).finally(() => {
                    this.noInsProjectLoading = false;
                })
            },
			//获取人员弃检项目
			getAbandonCheckProject() {
				this.abandonProjectLoading = true;
				this.abandonProjectData = [];
				queryAbandonTOrderGroupItemProjectList(this.noCheckProParam).then(res => {
					if (res.success) {
						this.abandonProjectData = res.data;
						this.abandonProject = "弃检项目" + "(" + this.abandonProjectData.length + "项)";
					}
				}).finally(() => {
					this.abandonProjectLoading = false;
				})
			},
            //总检点击
            addRecordClick() {
                if (this.checkNum > 0) {
                    this.$Message.error("还有未检项目，暂不能总检");
                }else if(!this.inspectForm.conclusionCode && (this.personInfo.physical_type == "职业体检" || this.personInfo.physical_type == "放射体检")){
                    this.$Message.error("体检结论未选，暂不能总检");
                }else if(!this.inspectForm.conclusion) {
                    this.$Message.error("体检结论内容为空，暂不能总检");
                }else if(!this.inspectForm.handleOpinion && (this.personInfo.physical_type == "职业体检" || this.personInfo.physical_type == "放射体检")){
                    this.$Message.error("处理意见为空，暂不能总检");
                }
                else if(this.isContraindication && this.occupationalTabooNow == ""){
                    this.$Message.error("职业禁忌证未选择，暂不能总检");
                }else if(this.isDiseases && this.occupationalDiseasesNow == ""){
                    this.$Message.error("职业病未选择，暂不能总检");
                }else {
                    if (this.inspectForm.personId) {
                        /*if (!this.inspectForm.handleOpinion) {
                            this.$Message.error('处理意见不能为空！');
                        }*/
                        this.$refs['inspectForm'].validate((valid) => {
                            if (valid) {
                                this.addRecord();
                            } else {

                                this.$Message.error('表单验证不通过！');
                            }
                        })
                    } else {
                        this.$Message.error("请先选择体检人员");
                    }
                }
            },


            //新增总检记录
            addRecord() {
                this.inspectionLoading = true;
                let name = "";
                if (this.personInfo.person_name) {
                    name = this.personInfo.person_name;
                } else if (this.personInfo.personName) {
                    name = this.personInfo.personName;
                }
                if (this.personInfo.physical_type != "从业体检" && this.personInfo.physicalType != "从业体检") {
                    this.inspectForm.healthCertificateConditions = "";
                }
                if((this.personInfo.physical_type && this.personInfo.physical_type != '职业体检' && this.personInfo.physical_type != '放射体检') || (this.personInfo.physicalType && this.personInfo.physicalType != '职业体检' && this.personInfo.physicalType != '放射体检')){
                    this.inspectForm.otherCheckAbnormalResults = "";
                    this.inspectForm.careerIllnessName = "";
                }
                let content = '';
                if (this.personInfo.is_pass >= 4 || this.personInfo.isPass >= 4){
                    content = "当前人员已总检,是否确定保存";
                }else {
                    content = "您确认要保存 " + name + " 的总检记录";
                }
                this.$Modal.confirm({
                    title: "确认保存",
                    content: content,
                    loading: true,
                    onOk: () => {
                        if(this.occupationalTabooNow){//当前所选职业禁忌证
                            this.inspectForm.occupationalTabooNow = this.occupationalTabooNow;
                        }
                        if(this.occupationalTabooNowCode){//当前所选职业禁忌证code
                            this.inspectForm.occupationalTabooNowCode = this.occupationalTabooNowCode;
                        }
                        if(this.occupationalDiseasesNow){//当前所选职业病
                            this.inspectForm.occupationalDiseasesNow = this.occupationalDiseasesNow;
                        }
                        if(this.occupationalDiseasesNowCode){//当前所选职业病code
                            this.inspectForm.occupationalDiseasesNowCode = this.occupationalDiseasesNowCode;
                        }
                        //职业病12003 禁忌症12004
                        if(this.inspectForm && this.inspectForm.conclusionCode && this.inspectForm.conclusionCode != undefined){
                            if(this.inspectForm.conclusionCode == "12003"){
                                this.inspectForm.occupationalTabooNow = "";
                                this.inspectForm.occupationalTabooNowCode = "";
                            }else if(this.inspectForm.conclusionCode == "12004"){
                                this.inspectForm.occupationalDiseasesNow = "";
                                this.inspectForm.occupationalDiseasesNowCode = "";
                            }else{
                                this.inspectForm.occupationalTabooNow = "";
                                this.inspectForm.occupationalTabooNowCode = "";
                                this.inspectForm.occupationalDiseasesNow = "";
                                this.inspectForm.occupationalDiseasesNowCode = "";
                            }
                        }
                        if(this.inspectForm && this.inspectForm.inspectionDate){
                            this.inspectForm.inspectionDate = formartDate(this.inspectForm.inspectionDate, 'yyyy-MM-dd HH:mm:ss')
                        }
                        if (this.inspectForm.id && this.inspectForm.id.length > 0) {
                            if(this.status == "待总检"){
                                this.inspectForm.isRecheck = 1;
                            }
                            updateTInspectionRecord(this.inspectForm).then(res => {
								this.inspectionLoading = false;
                                if (res.success) {
                                    this.$Message.success("保存成功");
                                    this.getPersonList();
                                    this.inspectionInfoList = this.inspectionInfoList.filter(item => item.personId != this.personInfo.id);
                                }
                            }).finally(() => {
                                this.$Modal.remove();
                            })
                        } else {
                            addTInspectionRecord(this.inspectForm).then(res => {
								this.inspectionLoading = false;
                                if (res.success) {
                                    this.personList = [];
                                    // this.personParam.keyword = "";
                                    this.personParam.pageNumber = 1;
                                    this.$Message.success('成功添加总检记录');
                                    this.getPersonList();
                                    this.inspectionInfoList = this.inspectionInfoList.filter(item => item.personId != this.personInfo.id);
                                }
                            }).finally(() => {
                                this.$Modal.remove();
                            })
                        }
                    },
                    onCancel: () => {
                        this.inspectionLoading = false;
                    }
                });
            },
            personChangePageNum(v) {
                this.personParam.pageNumber = v;
                this.getPersonList();
            },
            closeReviewResult(){
                this.reviewPageShow = false;
            },
            getReviewResult(){
                this.inspectForm.reviewResult = this.reviewData;
                this.inspectForm.reviewResultCode = this.reviewDataCode;
                this.inspectForm.reviewOpinion = this.reviewDataOpinion;
                // this.inspectForm.reviewInspectDate = this.reviewData;//复查总检日期
                // this.inspectForm.reviewInspectDate = formartDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
                this.inspectForm.reviewInspectDate = formartDate(this.reviewInspectDate, 'yyyy-MM-dd HH:mm:ss')
                this.reviewPageShow = false;
            }
        },
        mounted() {
            this.isInspectionChange = false;
            //是否变更总检样式
            if(this.$hospitalName && this.$hospitalName.isInspectionChange){
                this.isInspectionChange = this.$hospitalName.isInspectionChange;
            }
            if(this.$hospitalName && this.$hospitalName.updateTableAbnormalFieldName){
                //修改诊台页面，明细表格异常字段名称（即是否阳性字段列，修改为是否异常或者其他的名称）
                this.updateTableAbnormalFieldName = this.$hospitalName.updateTableAbnormalFieldName;
            }

            let physicalTypeNow = this.physicalType;
            let type = 'zjzybmc';
            if(physicalTypeNow == "职业体检" || physicalTypeNow == "放射体检"){
                getDictDataByType("physical_conclusion").then(res => {
                    if (res.success) {
                        this.conclusionCodeNowData = res.data;
                    }
                });
            }else{
                queryAllByOfficeId({
                    content: "",
                    type: type,
                    hazardFactors: "",
                    inspectType: physicalTypeNow,
                    officeId:"1461588105466351616",
                    workState:"",
                }).then(res => {
                    if (res.success) {
                        this.conclusionCodeNowData = res.data;
                    }
                })
            }
            if(this.$hospitalName.isUpdateUnitPage){
                this.isUpdateUnitPage = this.$hospitalName.isUpdateUnitPage;
                if(this.isUpdateUnitPage){
                    this.nametjjl = "体检结果";
                }else{
                    this.nametjjl = "体检结果";
                }
            }
            if(this.status == "待总检"){
                this.TTemplateId.inspectionDate = formartDate(new Date(), 'yyyy-MM-dd');
            }
            this.date = "当日";
            let date  = getMonthString(new Date());
            if (!this.$hospitalName.queryTimeChange){
                if(date!=null && date.length == 2){
                    this.personParam.startDate = date[0]+ " 00:00:00";
                    this.personParam.endDate = date[1]+ " 23:59:59";
                    this.getPersonList();
                }
            }else {
                this.pick("当日");
            }
            this.userInfo = JSON.parse(Cookies.get("userInfo"));
            this.inspectForm.operator = this.userInfo.nickname;
            this.getAllSectionOfficeData();
            userInfo().then(res => {
                if (res.success) {
                    if(res.data.autograph){
                        if(res.data.autographFile && res.data.autographFile.indexOf("/dcm") > -1){
                            this.checkDoctor = res.data.autographFile;
                        }else{
                            this.checkDoctor = "data:image/png;base64," + res.data.autograph;
                        }
                    }
                    this.inspectForm.inspectionDoctor = res.data.nickname;
                    this.TTemplateId.doctor = res.data.autograph;
                    this.doctorInfo = res.data;
                    if (this.doctorInfo.autograph) {
                        if(this.doctorInfo.autographFile && this.doctorInfo.autographFile.indexOf("/dcm") > -1){
                            this.doctorInfo.autograph = this.doctorInfo.autographFile;
                        }else{
                            this.doctorInfo.autograph = "data:image/png;base64," + this.doctorInfo.autograph;
                        }
                    }
                }
            })
        },
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            }
        },
        watch: {
            'personParam.personId'(val) {
                if (val && val.length == 10 && Number(val) != 0) {
                    this.personParam.keyword = val;
                    this.getPersonList();
                }
            },
            radioValue(val) {
                if (val) {
                    //清空体检结果及意见
                    this.inspectForm.conclusion = "";
                    this.inspectForm.conclusionCode = "";
                    this.inspectForm.handleOpinion = "";
                    this.inspectForm.careerIllnessName = "";
                    this.inspectForm.otherCheckAbnormalResults = "";
                    this.isContraindication = false;
                    this.isDiseases = false;
                    this.isReviewResult = false;

                    this.radioShow = true;
                    //加载人员信息
                    this.getOnePersonData(val);
                }
            }
        },
    }
</script>

<style lang="less">
    @import "../../../styles/tree&table-common.less";

    .tAllInspect {
        padding: 10px;
        box-sizing: border-box;
        height: 100%;

        .demo-spin-icon-load {
            animation: ani-demo-spin 1s linear infinite;
        }

        .ivu-tooltip {
            width: 100%;
        }
        .ivu-table {
            .table-error-row td{
                background-color: #ff6600;
                color: #fff;
            }
        }
        .ivu-tooltip-rel {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }

        .ivu-form-item-content {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
        }

        .card {
            height: calc(100vh - 80px);
            overflow: hidden;
            border-top-left-radius: 0;
            border-top-right-radius: 0;

            .btngroup {
                margin-bottom: 10px;

                .ivu-radio-group-item {
                    padding: 0 6px !important;
                    font-size: 13px !important;
                    user-select: none;
                }
            }

            .ivu-scroll-container {
                height: calc(100vh - 260px) !important;

                &::-webkit-scrollbar {
                    width: 0px;
                }

                .ivu-scroll-loader {
                    position: relative;
                    bottom: -30px;
                }
            }

            .radio-group {
                overflow: auto;
                width: 100%;
                height: 92%;
                padding-bottom: 30px;

                &::-webkit-scrollbar {
                    width: 0;
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

                .border-purple {
                    border: 1px solid orangered;
                    border-radius: 8px;
                    text-align: center;
                    color: orangered;
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
                .radio-group-content {
                    padding-left: 0 !important;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: flex;
                }
            }
        }

        .ivu-form-item {
            margin-bottom: 0 !important;
        }

        .icon-menu-unfold {
            font-size: 20px;
        }

        ul {
            margin: 0px;
            padding: 0px;
            list-style: none;
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

        .select-title {
            font-weight: 600;
            color: #40a9ff;
        }

        .empty {
            text-align: center;
            color: #515a6e;
            margin-top: 20px;
        }

        .inspect {
            margin-top: 10px;
            height: calc(100vh - 322px);
            overflow-y: auto;
            overflow-x: hidden;

            .textareaResult {
                textarea {
                    height: 80px !important;
                    min-height: 80px !important;
                    max-height: 80px !important;
                    overflow-y: auto !important;
                    background-color: #fff;
                    color: #515a6e;
                }
            }
            .textareaException {
                textarea {
                    height: 120px !important;
                    min-height: 120px !important;
                    max-height: 120px !important;
                    overflow-y: auto !important;
                    background-color: #fff;
                    color: #515a6e;
                }
            }

            .textareaCareer {
                textarea {
                    height: 90px !important;
                    min-height: 90px !important;
                    max-height: 90px !important;
                    overflow-y: auto !important;
                }
            }

            .txt {
                font-size: 15px;
                font-weight: 600;
                color: #515a6e;
                margin-top: 5px;
            }

            .textarea {
                width: 100%;
                height: 385px;
                border: 0;
                outline-color: #fff;
                margin: 10px 0 0;
                padding: 10px;
                background-color: #f8f8f9;
                color: #515a6e;
                resize: none;
            }

            .btn-sty {
                margin-bottom: 15px;

                .btn {
                    text-align: end;
                }
            }

            .bottom-btn {
                Button {
                    margin-right: 5px;
                }
            }

            .choice {
                position: absolute;
                right: 20px;
                bottom: 0px;
                z-index: 10;
                height: 20px;
                width: 20px;
                padding: 0px;
            }
        }

        .items-result {

            .result-textarea {
                width: 100%;
                height: 100px;
                margin-top: 20px;
                border: 0;
                outline-color: #fff;
                background-color: #f8f8f9;
                padding: 10px;
                resize: none;
            }
        }

        .time-sty {

            .ivu-form-item-content {
                display: flex !important;
            }

            .ivu-form-item {
                margin-bottom: 15px !important;
            }
        }

        .pic {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .pic-box {
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1px;
                box-sizing: border-box;
                width: 150px;
                height: 150px;
                line-height: 150px;
                margin-right: 10px;
                border: 1px dashed #ccc;
                cursor: pointer;

                &:hover {
                    .demo-upload-list-cover {
                        display: block;
                    }
                }
            }
        }

        .txtFrom {
            .ivu-form  {
                .ivu-form-item-label {
                    font-weight: bold;
                    line-height: 1.9;
                }

                .ivu-form-item-content {
                    line-height: 46px;
                }
            }
            height: 34px;
        }


        .details-result {
            .ivu-table td, .ivu-table th {
                height: 32px;
            }

            .ivu-tabs .ivu-tabs-tabpane {
                height: 515px !important;
            }

        }

        .ivu-card-body {
            height: 100%;
            min-width: 235px;

        }
    }

    .result {
        .el-tabs--card > .el-tabs__header {
            margin-bottom: 0;
        }

        .ivu-card-body {
            height: 60vh;
            overflow: auto;
        }

        .yellow td {
            background: rgba(249, 184, 7, .6);
            color: #fff;
        }

        .red td {
            background: rgba(230, 6, 6, .6);
            color: #fff;
        }

        .gray td {
            background: #e3e3e3;
            color: #fff;
        }

        .result-img {

            .pic {
                display: block;
                align-items: center;

                .img {
                    width: 340px;
                    height: 250px;
                    margin: 10px 10px 10px 0;
                }
            }

            textarea .ivu-input {
                height: 100px !important;
            }
        }

        .result-textarea {

            textarea.ivu-input {
                max-height: 100px !important;
                height: 100px !important;
                min-height: 100px !important;
            }
        }
    }
</style>
