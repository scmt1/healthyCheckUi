<template>
  <div class="tCheckStation">
    <Row
      :gutter="4"
      style="flex-wrap: nowrap; height: 100%; width: 100%; overflow: hidden"
    >
      <Col :style="leftSpan" v-if="expand">
        <Alert class="alert">人员列表</Alert>
        <Card class="card" style="height: calc(100% - 43px)">
          <div style="overflow: hidden; height: 100%">
            <Row style="margin-bottom: 10px; display: flex">
              <RadioGroup
                v-model="isCheck"
                @on-change="radioCheckChange"
                style="width: 50%"
              >
                <Radio :label="0">
                  <span>未检</span>
                </Radio>
                <Radio :label="1">
                  <span>已检</span>
                </Radio>
              </RadioGroup>
              <div style="width: 50%; text-align: right">
                <i-switch
                  size="large"
                  @on-change="typeChange"
                  v-model="typeStatus"
                  style="text-align: center"
                >
                  <span slot="open">复查</span>
                  <span slot="close">非复查</span>
                </i-switch>
              </div>
            </Row>
            <div
              v-if="queryTime"
              style="display: flex; flex-wrap: nowrap; align-items: center"
            >
              <RadioGroup
                type="button"
                size="small"
                class="btngroup"
                button-style="solid"
                v-model="date"
                @on-change="pick"
              >
                <Radio label="当日"></Radio>
                <Radio label="当月"></Radio>
                <DatePicker
                  :open="datePickerShow"
                  transfer
                  type="daterange"
                  @on-change="datePickerChange"
                >
                  <div>
                    <template>
                      <Radio
                        label="自定义"
                        @click.native="datePickerShow = !datePickerShow"
                      ></Radio>
                    </template>
                  </div>
                </DatePicker>
              </RadioGroup>
              <span class="resetBtn" style="cursor: pointer" @click="resetClick"
                >重置</span
              >
            </div>
            <div
              v-else
              style="
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                margin-bottom: 10px;
              "
            >
              <DatePicker
                type="date"
                transfer
                @on-change="datePickerStartTime"
                v-model="groupPersonSearchForm.startDate"
                placeholder="开始时间"
              />
              &nbsp;~&nbsp;
              <DatePicker
                type="date"
                transfer
                @on-change="datePickerEndTime"
                v-model="groupPersonSearchForm.endDate"
                placeholder="结束时间"
              />
            </div>
            <Row style="display: flex; flex-wrap: wrap">
              <!--<Input suffix="ios-search" placeholder="请输入关键字或扫码查询" clearable
                                   style="margin-bottom: 10px;"
                                   v-model="groupPersonSearchForm.keyword"
                                   @on-clear="onClearChange"
                                   @keypress.native.enter="inputSearchChange"
                            />-->
              <Input
                v-model="groupPersonSearchForm.personName"
                placeholder="请输入姓名"
                @on-clear="inputSearchChange('')"
                @keypress.native.enter="inputSearchChange"
                style="margin-bottom: 10px"
                clearable
              />
              <Input
                v-model="groupPersonSearchForm.testNum"
                placeholder="请输入体检编号"
                @on-clear="inputSearchChange('')"
                @keypress.native.enter="inputSearchChange"
                @on-change="inputSearchChange"
                style="margin-bottom: 10px"
                clearable
                v-if="drop"
              ></Input>
              <Input
                v-model="groupPersonSearchForm.dept"
                placeholder="请输入单位名称"
                @on-clear="inputSearchChange('')"
                @keypress.native.enter="inputSearchChange"
                style="margin-bottom: 10px"
                clearable
                v-if="drop"
              ></Input>
              <Button type="primary" @click="inputSearchChange" size="small"
                >查询</Button
              >
              <Button v-if="!queryTime" @click="resetClick" size="small"
                >重置</Button
              >
              <!--<span class="resetBtn" style="cursor: pointer;" @click="resetClick">重置</span>-->
              <a class="drop-down" @click="dropDown">
                {{ dropDownContent }}
                <Icon :type="dropDownIcon"></Icon>
              </a>
            </Row>
            <!--左侧套餐列-->
            <!--                        <Row style="justify-content: center;height: calc(100% - 140px);">-->
            <Row
              :style="{ height: 'calc(100% - ' + height1 + ')' }"
              style="flex-direction: column; justify-content: space-between; align-items: center"
            >
              <div style="width: 100%;max-height: calc(100% - 24px)">
                <RadioGroup
                  class="radio-group"
                  v-model="isRadioChecked"
                  v-if="personData.length > 0"
                >
                  <Row
                    class="row-border"
                    v-for="item in personData"
                    :key="item.id"
                    @click.native="radioChooseClick(item.id, item.physicalType)"
                  >
                    <Col :span="4" class="radio-group-radio">
                      <Radio :label="item.id" :disabled="disRadio"></Radio>
                    </Col>
                    <Col :span="15" class="radio-group-content">
                      <div
                        style="
                          display: inline-block;
                          width: 80px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        "
                        :title="item.personName"
                      >
                        {{ item.personName }}
                      </div>
                      <div style="margin-right: 6px">{{ item.sex }}</div>
                      <div style="padding: 0 8px 0 4px">{{ item.age }}</div>
                    </Col>
                    <Col :span="5">
                      <Row :gutter="6">
                        <Col :span="12">
                          <div
                            class="border-blue"
                            v-if="
                              item.physicalType &&
                              item.physicalType.indexOf('职业') != -1
                            "
                          >
                            职
                          </div>
                          <div
                            class="border-green"
                            v-if="
                              item.physicalType &&
                              item.physicalType.indexOf('健康') != -1
                            "
                          >
                            健
                          </div>
                          <div
                            class="border-yellow"
                            v-if="
                              item.physicalType &&
                              item.physicalType.indexOf('从业') != -1
                            "
                          >
                            从
                          </div>
                          <div
                            class="border-purple"
                            v-if="
                              item.physicalType &&
                              item.physicalType.indexOf('放射') != -1
                            "
                          >
                            放
                          </div>
                        </Col>
                        <Col :span="12">
                          <div
                            class="border-purple"
                            v-if="
                              item.sporadicPhysical && item.sporadicPhysical == 1
                            "
                          >
                            零
                          </div>
                          <div class="border-purple" v-else>团</div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </RadioGroup>

                <!--暂无数据-->
                <no-data v-else></no-data>

                <Spin fix v-if="checkPersonLoading">
                  <Icon
                    type="ios-loading"
                    size="18"
                    class="demo-spin-icon-load"
                  ></Icon>
                  <div>加载中...</div>
                </Spin>
              </div>
              <Page
                v-if="personData.length > 0"
                :current="groupPersonSearchForm.pageNumber"
                :total="personTotal"
                simple
                @on-change="personChangePageNum"
              />
            </Row>
          </div>
        </Card>
      </Col>

      <div class="expand">
        <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand" />
      </div>

      <!-- 内容主体 -->
      <Col :style="span" style="height: 100%; overflow: hidden">
        <!-- 加载动画 -->
        <Spin v-if="personInfoLoading" fix>
          <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
          <div>加载中...</div>
        </Spin>

        <template v-else>
          <!-- 空数据 -->
          <Card v-if="personData.length == 0">
            <no-data
              width="150"
              style="
                height: calc(100vh - 128px);
                overflow: hidden;
                display: flex;
                flex-direction: row;
                justify-content: center;
              "
            ></no-data>
          </Card>
          <template v-else>
            <Collapse v-model="showCollapsePanels">
              <!-- 人员信息 -->

              <Panel name="info">
                <span style="font-weight: 700">体检人员信息</span>
                <span
                  style="margin-left: 32px"
                  v-if="!showCollapsePanels.length"
                >
                  <span style="margin-left: 16px">
                    姓名:
                    {{ personInfo.person_name || personInfo.personName }}</span
                  >
                  <span style="margin-left: 16px">
                    性别: {{ personInfo.sex }}</span
                  >
                  <span style="margin-left: 16px"
                    >年龄: {{ personInfo.age }}岁</span
                  >
                </span>
                <template #content>
                  <person-info :person-info="personInfo">
                    <template slot="buttons">
                      <Button
                        style="width: 150px"
                        v-for="item of buttons"
                        v-bind="item"
                        :key="item.content"
                        @click="handleEntityActions(item.event)"
                        >{{ item.content }}</Button
                      >
                    </template>
                  </person-info>
                </template>
              </Panel>
            </Collapse>
          </template>
        </template>

        <!-- Tabs -->
        <Card :style="cardTabStyle">
          <div style="height: 100%" v-loading="loadingGroup">
            <otherInfo
              v-model="tabsValue"
              :hidden-footer="hiddenTabsFooter"
              :person-info="personInfo"
              v-on:handleSearch="handleInfoSearch"
              @tab-click="handleTabClick"
              :class="otherInfoClass"
              :is-consultation="isConsultation"
            >
              <template slot="tabs">
                <el-tab-pane
                  :lazy="true"
                  :disabled="loading"
                  v-for="(item, index) in tabsArr"
                  :label="initTabName(item.name)"
                  :name="item.id"
                  :key="index"
                >
                  <template v-loading="loading">
                    <div class="tab-pane-content" :ref="item.id">
                      <div
                        v-if="item.isFile == '是'"
                        :style="`height: ${
                          tableHeight - 3
                        }px;overflow-y: auto;`"
                      >
                        <Row
                          style="
                            border: 1px solid #dcdee2;
                            border-top: 0;
                            overflow: hidden;
                            height: 100%;
                          "
                        >
                          <Col
                            span="24"
                            style="
                              height: 100%;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              overflow-y: auto
                            "
                          >
                            <div style="width: 100%; flex-shrink: 0">
                              <Table
                                :loading="loading"
                                border
                                :key="Math.random()"
                                :columns="getColumnsYX()"
                                sortable="custom"
                                :data="data"
                                :row-class-name="rowClassName"
                              >
                              </Table>
                            </div>
                            <div
                              v-viewer="{
                                movable: false,
                                zIndex: 7000,
                              }"
                              class="pacsImgs"
                            >
                              <img
                                v-for="(item, index) in pacsData"
                                :key="index"
                                :src="item"
                                style="
                                  border: 1px dashed #ccc;
                                  margin-right: 20px;
                                  width: 80px;
                                  height: 80px;
                                "
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <!--列表-->
                      <div
                        v-if="
                          item.isFile == '否' ||
                          item.isFile == null ||
                          item.isFile == ''
                        "
                      >
                        <Table
                          :loading="loading"
                          border
                          :key="Math.random()"
                          :columns="
                            item.name.indexOf('肺功能') > -1
                              ? getColumnsFGN()
                              : getColumns()
                          "
                          sortable="custom"
                          :data="data"
                          :row-class-name="rowClassName"
                          :height="tableHeight"
                        >
                        </Table>
                      </div>

                      <Form
                        :label-width="30"
                        style="margin: 16px 2px 0; border-bottom: 0"
                        inline
                      >
                        <Row style="flex-wrap: nowrap">
                          <Col span="10" style="position: relative">
                            <Button
                              style="
                                position: absolute;
                                right: -4px;
                                bottom: 1px;
                                z-index: 8;
                                height: 22px;
                                padding: 0 10px;
                              "
                              type="primary"
                              @click="handleWordChoose('zdtx', item)"
                              >选
                            </Button>
                            <label
                              style="
                                font-size: 14px;
                                font-weight: 600;
                                margin-bottom: 6px;
                              "
                            >
                              <span
                                v-if="item.isFile == '是'"
                                style="
                                  color: red;
                                  font-size: 16px;
                                  margin-right: 6px;
                                  position: relative;
                                  top: 4px;
                                "
                                >*</span
                              >体检提醒或影像所见</label
                            >
                            <Input
                              type="textarea"
                              v-model="item.departResult.diagnoseTip"
                              @on-focus="handlediagnoseTipData(item)"
                              placeholder="输入多个以;分隔"
                              :autosize="{ maxRows: 6, minRows: 6 }"
                            />
                          </Col>
                          <Col span="4"></Col>
                          <Col span="10" style="margin-left: 16px">
                            <Button
                              style="
                                position: absolute;
                                right: -4px;
                                bottom: 1px;
                                z-index: 8;
                                height: 22px;
                                padding: 0 10px;
                              "
                              :disabled="disRadio"
                              @click="handleWordChoose('zdxj', item)"
                              type="primary"
                              >选
                            </Button>
                            <label
                              style="
                                font-size: 14px;
                                font-weight: 600;
                                margin-bottom: 6px;
                              "
                            >
                              <span
                                v-if="item.isFile == '是'"
                                style="
                                  color: red;
                                  font-size: 16px;
                                  margin-right: 6px;
                                  position: relative;
                                  top: 4px;
                                "
                                >*</span
                              >体检小结</label
                            >
                            <Input
                              type="textarea"
                              placeholder="输入多个以;分隔"
                              v-model="item.departResult.diagnoseSum"
                              @on-focus="handleCrisisData(item)"
                              :autosize="{ maxRows: 6, minRows: 6 }"
                              @on-change="diagnoseSumChange(item)"
                            />
                          </Col>
                        </Row>
                      </Form>
                    </div>

                    <Form :label-width="90" class="action-form">
                      <Row style="flex-wrap: nowrap">
                        <Col span="5">
                          <FormItem label="检查医生">
                            <Select
                              v-model="item.departResult.createId"
                              :filterable="true"
                              label-in-value
                              class="input"
                              @on-select="doctorSelectChange"
                              transfer
                            >
                              <Option
                                v-for="(itemD, index) in userArray"
                                :key="index"
                                :value="itemD.id"
                                :label="itemD.nickname"
                              >
                                {{ itemD.nickname }}
                              </Option>
                            </Select>
                          </FormItem>
                          <!--  <FormItem label="检查医生" v-else>
                          <img :src=" item.departResult.checkSign ? item.departResult.checkSign.indexOf('/dcm') > -1 ? item.departResult.checkSign : 'data:image/png;base64,' + item.departResult.checkSign : checkDoctor.indexOf('/dcm') > -1 ? checkDoctor : checkDoctor" style="width: 150px;height: 30px;">
                        </FormItem>-->
                        </Col>
                        <Col span="5">
                          <FormItem label="检查日期">
                            <DatePicker
                              style="width: 100%"
                              type="datetime"
                              v-model="item.departResult.checkDate"
                              transfer
                              placeholder="请选择检查日期"
                            ></DatePicker>
                          </FormItem>
                        </Col>
                        <!-- <Col span="4"></Col> -->
                        <Col>
                          <ButtonGroup
                            style="
                              display: flex;
                              justify-content: center;
                              margin-left: 18px;
                            "
                          >
                            <Button
                              :disabled="
                                item.status == 1 || item.status == 2
                                  ? false
                                  : true
                              "
                              type="success"
                              @click="handleSave(index)"
                              :loading="saveLoading"
                              >保存结果
                            </Button>
                            <!--                                                    <Button :disabled="(item.status== 1 || item.status == 2)?false:true" type="primary"-->
                            <!--                                                            v-if="item.name.indexOf('肺功能') != -1" @click="initWebSocket">肺-->
                            <!--                                                    </Button>-->
                            <Button
                              v-if="item.isFile == '是'"
                              type="primary"
                              @click="uploadImageClick(item.officeId)"
                            >
                              上传图片
                            </Button>
                            <Button
                              v-if="
                                item.name.indexOf('测听') > -1 &&
                                isShowCalculationButton
                              "
                              type="primary"
                              :loading="syncLoading"
                              @click="calculation"
                              >计算偏移值
                            </Button>
                            <Button
                              :disabled="
                                item.status == 1 || item.status == 2
                                  ? false
                                  : true
                              "
                              type="primary"
                              @click="syncResult"
                              v-if="item.specimen != null"
                              :loading="syncLoading"
                              >同步结果
                            </Button>
                            <Button
                              :disabled="
                                item.status == 1 || item.status == 2
                                  ? false
                                  : true
                              "
                              type="primary"
                              @click="handleViewTemplate"
                              v-if="
                                item.departResult.id ||
                                indxArr.indexOf(index) > -1
                              "
                              >报告预览
                            </Button>
                            <!--<Button :disabled="(item.status== 1 || item.status == 2)?false:true" type="primary"
                                                            @click="handleReCheck"
                                                            v-if="item.status == 1 || item.status == 2">复检
                                                    </Button>-->
                          </ButtonGroup>
                        </Col>
                      </Row>
                    </Form>
                  </template>
                </el-tab-pane>
              </template>
            </otherInfo>
          </div>
        </Card>

        <!-- 其他组件 -->
        <drawer
          v-model="wordChooseShow"
          :isSearchPositive="isSearchPositive"
          :modalTitle="title"
          @getSelectedWords="getSelectedWords"
          :type="type"
          :inspectType="personInfo.physical_type || personInfo.physicalType"
          :officeId="officeId"
          :hazardFactors="personInfo.hazard_factors || personInfo.hazardFactors"
          :hazardFactorsText="
            personInfo.hazard_factors_text || personInfo.hazardFactorsText
          "
        ></drawer>
        <!--模板预览-->
        <preview-template
          v-model="previewShow"
          :personInfo="personInfo"
        ></preview-template>

        <!--复查-->
        <review
          v-model="reviewShow"
          :modalTitle="title"
          :groupItemId="groupItemId"
          :personInfo="personInfo"
          @getItemDataByGroupId="getItemDataByGroupId"
        ></review>
        <!--单机版数据导入-->
        <data-base-upload v-model="dataBaseUploadShow"></data-base-upload>
        <!--心电图图片上传-->
        <upload-image
          v-model="isShowUploadImage"
          @handleUploadImage="handleUploadImage"
        ></upload-image>
        <!--样本条码-->
        <sample-code
          v-model="sampleCodeShow"
          :data="tabsArr"
          :personInfo="personInfo"
        ></sample-code>
      </Col>
    </Row>
    <Modal
      title="弃检原因"
      v-model="abandonRensonShow"
      :mask-closable="false"
      :closable="false"
    >
      <label>
        <Input
          v-model="abandonRenson"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入弃检原因..."
        ></Input>
      </label>
      <div slot="footer">
        <Button type="text" @click="abandonRensonShow = false">取消</Button>
        <Button
          type="primary"
          :loading="checkLoading"
          @click="abandonRensonClick"
          >提交</Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getPersonByOfficeId,
  getPersonReviewerByOfficeId,
  getTGroupPersonInfo,
  getTGroupPersonWithLink,
  getTGroupPersonById,
  getTGroupPersonInfoById,
} from "@/api/healthy/tGroupPerson";
import {
  addTDepartResult,
  getItemByGroupId,
  addOrderGroupItemPorjectByExtra,
  queryTDepartResultByPersonId,
} from "@/api/healthy/tDepartResult";
import { getSelectedBaseItemByItemId } from "@/api/healthy/tOrderGroupItemProject";
import { getWebSocket } from "../../../api/healthy/webSocket";
import step from "../../../components/healthy/step";
import previewTemplate from "./previewTemplate";
import DataBaseUpload from "./DataBaseUpload";
import uploadImage from "./uploadImage";
import drawer from "./drawer";
import Viewer from "viewerjs";
import { formatDate } from "@/api/tool.js";
import Cookies from "js-cookie";
import otherInfo from "../tGroupPerson/otherInfoNew";
import { userInfo, getAllUserData } from "../../../api";
import {
  getBarcodeByPersonIdAndGroupItemId,
  getBarcodeByPersonIdAndTestNum,
} from "../../../api/healthy/tBarCode";
import util from "../../../libs/util";
import review from "./review";
import {
  addRelationPersonProjectCheck,
  updateRelationPersonProjectCheck,
  updateCancelPersonProjectCheck,
} from "@/api/healthy/relationPersonProjectCheck";
import noData from "@/components/no-data";
import { tc } from "@/assets/json/tc.js";
import { getTGroupPersonReviewerList } from "../../../api/healthy/tGroupPerson";
import { getTGroupOrder } from "../../../api/healthy/tGroupOrder";
import sampleCode from "./sampleCode";
import {
  formartDate,
  getMonthString,
  getDataString,
} from "../../../api/tools/tool";

import PersonInfo from "./components/PersonInfo.vue";

import { debounce as _debounce } from "lodash"

const StatuColors = {
  todo: "transparent #aaa6a6 transparent transparent", //灰色
  doing: "transparent #f0d537 transparent transparent", //黄色
  done: "transparent #23c223 transparent transparent", //绿色
  danger: "transparent red transparent transparent", //红色
};

const SpecialTypes = ["职业体检", "放射体检", "从业体检"];

export default {
  components: {
    step,
    drawer,
    previewTemplate,
    otherInfo,
    review,
    noData,
    DataBaseUpload,
    uploadImage,
    sampleCode,
    PersonInfo,
  },
  data() {
    return {
      isInit: false,
      updateTableAbnormalFieldName: "阳性", //修改诊台页面，明细表格异常字段名称（即是否阳性字段列，修改为是否异常或者其他的名称）
      isSearchPositive: true, //是否查询阳性结果

      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      drop: false,
      height1: "140px",
      WVr: 0,
      WVl: 0,
      GFA: 0,
      gWVr: 0,
      gWVl: 0,

      codeShow: false,
      sampleCodeShow: false,
      isShowUploadImage: false, //是否显示图片上传窗口
      officeId: "", //科室id
      isShowButton: false,
      isShowCalculationButton: false,
      isSubmitArr: [],
      indxArr: [],
      showOtherInfo: false,
      disRadio: false,
      checkLoading: false,
      cancelLoading: false,
      isTemplateShow: false,
      isReShow: true,
      personInfoLoading: false,
      groupItemId: "",
      reviewShow: false,
      doctor: "",
      checkDoctor: "",
      checkDate: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
      date: "",
      datePickerShow: false,
      personInfo: {},
      isCheck: 0,
      previewShow: false, //模板
      title: "",
      type: "",
      wordChooseShow: false,
      tabsValue: "",
      currentIndex: 2,
      isRadioChecked: "",
      checkPersonLoading: false,
      personData: [],
      loading: false,
      loadingGroup: false,
      expand: true,
      leftSpan: "width: 300px;",
      span: "position: relative;width: calc(100% - 332px);",
      resultArr: [],
      tabsArr: [],
      expandIcon: "ios-arrow-back",
      columns: this.getColumns(),
      data: [],
      saveLoading: false,
      syncLoading: false,
      isCalculation: false,
      groupPersonSearchForm: {
        personId: "",
        pageSize: 10,
        pageNumber: 1,
        keyword: "",
        startDate: null,
        endDate: null,
        isCheck: "",
        isWzCheck: "",
        personName: "", //姓名
        testNum: "", //体检编号
        dept: "", //单位名称
        sort: "t_group_person.update_time", //排序字段
        order: "desc", //排序方式：倒序
      },
      pacsData: [],
      lisData: [],
      personHeight: 0,
      personWeight: 0,
      groupItemIdList: [],
      officeId: "",
      personTotal: 0,
      personPhysicalType: "",
      dataBaseUploadShow: false, //单机版数据导入
      isReviewer: false,
      typeStatus: false,
      abandonRenson: "", //弃检原因
      abandonRensonShow: false, //是否展示弃检原因框
      showSaveBtn: true,
      queryTime: this.$hospitalName.queryTimeChange, //是否展示时间搜索框

      userArray: [], //用户集合
      dockerId: null,
      showCollapsePanels: ["info"],
      tableHeight: 0,
      resizeObserver: null,
      currentUser: null,
      isWzChecked: false
    };
  },
  computed: {
    physicalType() {
      return this.$store.state.theme.theme.physicalType;
    },

    // 是否是问诊科
    isConsultation() {
      //是复查就不要问诊
      if(this.isReviewer){
        this.isWzChecked = false;
        return false;
      }
      const roles = JSON.parse(localStorage.getItem("roles"));

      return Array.isArray(roles) ? roles.some((i) => "问诊科" === i) : false;
    },

    buttons() {
      const activeTab = this.tabsArr.find((t) => this.tabsValue === t.id);

      // 展示确定到检 tab 状态为待检(假值) 其他 0 null
      const showConfirm = this.tabsArr.some((i) => !i.status);

      return [
        // tab中有未到检的显示到检按钮
        {
          type: "success",
          icon: "md-checkmark",
          content: "到检确认",
          event: "confirm",
          visiable: showConfirm,
        },
        // 检验科显示
        {
          type: "success",
          icon: "ios-eye-outline",
          content: "样本条码查看",
          event: "view",
          visiable: localStorage.roles.indexOf("检验科") !== -1,
        },
        // 这个是医院的json配置
        {
          type: "success",
          icon: "ios-cloud-upload",
          content: "单机版数据导入",
          event: "import",
          visiable: this.$hospitalName.isShowAloneButton,
        },
        // tab状态为1
        {
          type: "error",
          icon: "ios-close-circle",
          content: "弃检项目",
          event: "discard",
          visiable: !showConfirm && activeTab?.status === 1,
        },
        // tab状态为2
        {
          type: "primary",
          icon: "ios-checkmark-circle-outline",
          content: "取消弃检",
          event: "cancel-discard",
          visiable: !showConfirm && activeTab?.status === 2,
        },
      ].filter((i) => i.visiable === void 0 || i.visiable);
    },
    hiddenTabsFooter() {
      return this.tabsArr.some((i) => this.tabsValue === i.id);
    },
    otherInfoClass() {
      return this.tabsArr.some((t) => this.tabsValue === t.id)
        ? "other-info"
        : "";
    },
    cardTabStyle() {
      return {
        marginTop: "10px",
        overflow: "hidden",
        height: `calc(100% - 10px - ${
          this.showCollapsePanels.length ? 299 : 38
        }px)`,
      };
    },
  },
  watch: {
    "groupPersonSearchForm.personId"(val) {
      if (val && val.length == 10 && Number(val) != 0) {
        this.groupPersonSearchForm.keyword = val;
        this.getPersonByOfficeId();
      }
    },
    isRadioChecked: {
      handler(val) {
        this.resetPage();
        this.personHeight = 0;
        this.personWeight = 0;
        if (val) {
          this.disRadio = true;
          //加载单个人员信息
          this.getOnePersonData(val);
        }
      },
      immediate: true,
    },

    tabsValue(val, oldVal) {
      const oldEle = this.$refs[oldVal];

      if (Array.isArray(oldEle) && oldEle.length) {
        this.resizeObserver?.unobserve(oldEle[0]);
      }

      if (this.tabsArr.some((i) => val === i.id)) {
        this.getBaseProjectResult();

        this.$nextTick(() => {
          this.observeCheckContent(this.$refs[val][0]);
        });
      }
    },

    tabsArr: {
      handler() {
        this.handleCheckStatus();
      },
      deep: true,
    },
  },
  created() {
    let userInfo = Cookies.get("userInfo");
    userInfo = JSON.parse(userInfo);
    if (userInfo) {
      this.doctor = userInfo.nickname;
      this.officeId = userInfo.departmentId;
      this.dockerId = userInfo.id;
    }
  },
  mounted: function () {
    this.getUserInfo();
    if (this.$hospitalName && this.$hospitalName.updateTableAbnormalFieldName) {
      //修改诊台页面，明细表格异常字段名称（即是否阳性字段列，修改为是否异常或者其他的名称）
      this.updateTableAbnormalFieldName =
        this.$hospitalName.updateTableAbnormalFieldName;
    }
    this.codeShow = localStorage.roles.indexOf("检验科") > -1;
    getAllUserData().then((res) => {
      if (res.success && res.data) {
        if (res.data) {
          this.userArray = res.data;
          // for (let i = 0; i < res.data.length; i++) {
          //   let item =
          // if (res.data.autographFile && res.data.autographFile.indexOf("/dcm") > -1) {
          //   this.checkDoctor = res.data.autographFile;
          // } else {
          //   this.checkDoctor = "data:image/png;base64," + res.data.autograph;
          // }
          // }
        }
      }
    });
    this.isShowButton = this.$hospitalName.isShowAloneButton; //是否展示单机版按钮
    this.isShowCalculationButton = this.$hospitalName.isShowCalculationButton; //是否展示计算偏移值按钮
    this.date = "当日";
    //this.pick("当日");
    let date = getMonthString(new Date());
    if (!this.$hospitalName.queryTimeChange) {
      if (date != null && date.length == 2) {
        this.groupPersonSearchForm.startDate = date[0] + " 00:00:00";
        this.groupPersonSearchForm.endDate = date[1] + " 23:59:59";
        this.getPersonByOfficeId();
      }
    } else {
      this.pick("当日");
    }

    //初始化
    this.getFocus();
  },
  methods: {
    async getUserInfo() {
      try {
        const { success, data } = await this.$api.userInfo();

        if (success) {
          this.currentUser = data
        }
      } catch (error) {
        this.$Message.error(error.message)
      }
    },
    observeCheckContent(target) {
      this.resizeObserver = new ResizeObserver((entries, observer) => {
        entries.forEach((i) => {
          const {
            contentRect: { height },
          } = i;

          this.tableHeight = height - 173;
        });
      });

      if (target) {
        this.resizeObserver.observe(target);
      }
    },
    //展开 收起
    dropDown() {
      if (this.drop) {
        this.dropDownContent = "展开";
        this.dropDownIcon = "ios-arrow-down";
        this.height1 = "140px";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "ios-arrow-up";
        this.height1 = "224px";
      }
      this.drop = !this.drop;
    },
    /**
     * 数据导入点击
     * @constructor
     */
    DataBaseClick() {
      this.dataBaseUploadShow = true;
    },
    //影像所见
    handlediagnoseTipData(item) {
      if (item.isFile == "是") {
        //若明细结果不为空 且影像所见为空 自动将明细结果填充到影像所见
        if (
          !item.departResult.diagnoseTip &&
          this.data &&
          this.data.length > 0 &&
          this.data[0] &&
          this.data[0].departItemResults &&
          this.data[0].departItemResults.result
        ) {
          let result = this.data[0].departItemResults.result;
          let tab = this.tabsArr.find((i) => i.id == this.tabsValue);
          this.$set(tab.departResult, "diagnoseTip", result);
        }
      }
    },
    //危机值
    handleCrisisData(item) {
        if (!item.departResult.diagnoseSum || item.officeId == "186"){
      let diagnoseTipNow = "";
      //展示加权值到小结
      if (item && item.name && item.name.indexOf("纯音") > -1) {
        // this.calculateAverage();
        //是否加权(电测听双耳高频大于40时，展示加权值到小结)
        let isWeighting = this.$hospitalName.isWeighting;
        if (item.name.indexOf("复") > -1) {
          let diagnoseTip = "";
          let unit = "dB";
          if (this.WVl && this.WVr) {
            if (this.WVl < this.WVr) {
              if (this.WVl != 0) {
                // let name = "左耳语频加权值";
                let name = "较好耳语频加权值";
                diagnoseTip += name + " " + this.WVl + unit + ";\n";
              }
            } else if (this.WVl > this.WVr) {
              if (this.WVr != 0) {
                // let name = "右耳语频加权值";
                let name = "较好耳语频加权值";
                diagnoseTip += name + " " + this.WVr + unit + ";\n";
              }
            } else {
              if (this.WVl != 0 && this.WVr != 0) {
                // let name = "左右耳语频加权值";
                let name = "较好耳语频加权值";
                diagnoseTip += name + " " + this.WVl + unit + ";\n";
              }
            }
          }
          //是否展示异常小结(详细) 听力
          if (
            this.$hospitalName &&
            this.$hospitalName.isShowAbnormalConclusionTC
          ) {
            item.departResult.diagnoseTip = diagnoseTip;
          }
          diagnoseTipNow = diagnoseTip;
        } else if (isWeighting) {
          if (this.GFA && this.GFA != 0 && this.GFA > 40) {
            let diagnoseTip = "";
            let unit = "dB";
            if (this.WVl && this.WVr) {
              if (this.WVl < this.WVr) {
                if (this.WVl != 0) {
                  // let name = "左耳语频加权值";
                  let name = "较好耳语频加权值";
                  diagnoseTip += name + " " + this.WVl + unit + ";\n";
                }
              } else if (this.WVl > this.WVr) {
                if (this.WVr != 0) {
                  // let name = "右耳语频加权值";
                  let name = "较好耳语频加权值";
                  diagnoseTip += name + " " + this.WVr + unit + ";\n";
                }
              } else {
                if (this.WVl != 0 && this.WVr != 0) {
                  // let name = "左右耳语频加权值";
                  let name = "较好耳语频加权值";
                  diagnoseTip += name + " " + this.WVl + unit + ";\n";
                }
              }
            }
            //是否展示异常小结(详细) 听力
            if (
              this.$hospitalName &&
              this.$hospitalName.isShowAbnormalConclusionTC
            ) {
              item.departResult.diagnoseTip = diagnoseTip;
            }
            diagnoseTipNow = diagnoseTip;
          }
        }
      }

      if (item.isFile == "是") {
        return;
      }
      let temp = this.data.filter((i) => {
        // return (i.departItemResults) && (i.departItemResults.positive && i.departItemResults.positive=='1') && (i.departItemResults.crisisDegree == '高于正常值' || i.departItemResults.crisisDegree == '低于正常值' || i.departItemResults.crisisDegree == '异常');
        return (
          i.departItemResults &&
          i.departItemResults.positive &&
          i.departItemResults.positive == "1"
        );
      });
      let tab = this.tabsArr.find((i) => i.id == this.tabsValue);

      if (temp.length > 0) {
        let str = "";
        temp.forEach((i) => {
          let unit = "";
          if (
            i.departItemResults.unitName &&
            i.departItemResults.unitName.replaceAll(" ", "") != "-" &&
            i.departItemResults.unitName.replaceAll(" ", "") != "无"
          ) {
            unit = i.departItemResults.unitName;
          }
          let result = i.departItemResults.result;
          let name = i.name;
          if (name && name.indexOf("[") > -1 && name.indexOf("]") > -1) {
            name = name.split("[")[0];
          }
          if (
            i.departItemResults.crisisDegree &&
            (i.departItemResults.crisisDegree.indexOf("高于") > -1 ||
              i.departItemResults.crisisDegree.indexOf("低于") > -1)
          ) {
            if (
              i.departItemResults.orderGroupItemProjectName == "舒张压" ||
              i.departItemResults.orderGroupItemProjectName == "收缩压"
            ) {
              if (str.indexOf("血压") == -1) {
                let temp1 = this.data.filter((i) => {
                  return (
                    i.departItemResults &&
                    i.departItemResults.orderGroupItemProjectName == "舒张压"
                  );
                });
                let temp2 = this.data.filter((i) => {
                  return (
                    i.departItemResults &&
                    i.departItemResults.orderGroupItemProjectName == "收缩压"
                  );
                });
                let crisisDegree = "";
                let isGaoyu = false;
                let isDiyu = false;
                if (temp1 && temp2 && temp1.length > 0 && temp2.length > 0) {
                  let result1 = temp2[0].departItemResults.result
                    ? temp2[0].departItemResults.result
                    : 0;
                  let crisisDegree1 = temp2[0].departItemResults.result
                    ? temp2[0].departItemResults.crisisDegree
                    : "低于正常值";
                  crisisDegree1 = "收缩压" + crisisDegree1;
                  let result2 = temp1[0].departItemResults.result
                    ? temp1[0].departItemResults.result
                    : 0;
                  let crisisDegree2 = temp1[0].departItemResults.result
                    ? temp1[0].departItemResults.crisisDegree
                    : "低于正常值";
                  crisisDegree2 = "舒张压" + crisisDegree2;
                  result = result1 + "/" + result2;
                  /*if(crisisDegree1 && (crisisDegree1.indexOf("高于")>-1||crisisDegree1.indexOf("低于")>-1)){
											crisisDegree +=crisisDegree1;
                                        }
										if(crisisDegree2 && (crisisDegree2.indexOf("高于")>-1||crisisDegree2.indexOf("低于")>-1)){
											if(crisisDegree.length>0){
												crisisDegree +=",";
                                            }
											crisisDegree +=crisisDegree2;
										}*/
                  if (
                    crisisDegree1 &&
                    (crisisDegree1.indexOf("高于") > -1 ||
                      crisisDegree2.indexOf("高于") > -1)
                  ) {
                    isGaoyu = true;
                  }
                  if (
                    crisisDegree2 &&
                    (crisisDegree1.indexOf("低于") > -1 ||
                      crisisDegree2.indexOf("低于") > -1)
                  ) {
                    isDiyu = true;
                  }
                }
                if (isGaoyu) {
                  if (
                    this.$hospitalName &&
                    this.$hospitalName.isUpdateAbnormalStyle
                  ) {
                    str +=
                      "血压升高（" +
                      result +
                      unit +
                      "）参考值(" +
                      i.departItemResults.scope +
                      ");\n";
                  } else {
                    str += "血压升高:" + result + unit + "\n";
                  }
                } else if (isDiyu) {
                  if (
                    this.$hospitalName &&
                    this.$hospitalName.isUpdateAbnormalStyle
                  ) {
                    str +=
                      "血压降低（" +
                      result +
                      unit +
                      "）参考值(" +
                      i.departItemResults.scope +
                      ");\n";
                  } else {
                    str += "血压降低:" + result + unit + "\n";
                  }
                } else {
                  str += "血压:" + result + unit + ";\n";
                }
              }
            }
            //电测听只监听平均
            else if (
              tab.name &&
              (tab.name.indexOf("电测") > -1 || tab.name.indexOf("纯音") > -1)
            ) {
              if (
                (this.$hospitalName &&
                  this.$hospitalName.isShowAllAbnormalTC) ||
                (i.name.indexOf("平均") > -1 && i.name.indexOf("骨导") <= -1)
              ) {
                // str += name + ":" + result+ unit  +";\n";
                if (str == "") {
                  str += name + result + unit + ";\n";
                } else {
                  str =
                    str.replaceAll(";\n", ",") + name + result + unit + ";\n";
                }
              }
            }
            //尿常规
            else if (tab.name && tab.name.indexOf("尿常规") > -1) {
              str += name + " " + result + ";\n";
            } else {
              // str += name + ":结果" + result + unit + "," + i.departItemResults.crisisDegree + ";\n";
              let change = "";
              if (i.departItemResults.crisisDegree.indexOf("低于正常值") > -1) {
                change = "减少";
              } else if (
                i.departItemResults.crisisDegree.indexOf("高于正常值") > -1
              ) {
                change = "升高";
              } else {
                change = i.departItemResults.crisisDegree;
              }
              if (
                this.$hospitalName &&
                this.$hospitalName.isUpdateAbnormalStyle
              ) {
                str +=
                  name +
                  change +
                  "（" +
                  result +
                  unit +
                  "）参考值(" +
                  i.departItemResults.scope +
                  ");\n";
              } else {
                str += name + change + " " + result + unit + "\n";
              }
            }
          } else {
            //尿常规不带单位
            if (tab.name && tab.name.indexOf("尿常规") > -1) {
              str += name + " " + result + ";\n";
            } else if (
              tab.name &&
              (tab.name.indexOf("电测") > -1 || tab.name.indexOf("纯音") > -1)
            ) {
              str += name + result + unit + ";\n";
            } else {
              str += name + ":" + result + unit + ";\n";
            }
          }
        });

        if (tab != undefined) {
          if (
            tab.name &&
            (tab.name.indexOf("电测") > -1 || tab.name.indexOf("纯音") > -1)
          ) {
            if (str == "") {
              str = "听力正常";
            } else {
              //是否展示异常小结(详细) 听力
              if (
                !(
                  this.$hospitalName &&
                  this.$hospitalName.isShowAbnormalConclusionTC
                )
              ) {
                item.departResult.diagnoseTip = str + diagnoseTipNow; //异常移动到左侧 体检提醒
                str = "听力异常";
              }
            }
          }
          this.$set(tab.departResult, "diagnoseSum", str);
          /*let split = tab.departResult.diagnoseSum.split("|");
                        if (split.length == 2) {
                            this.$set(tab.departResult, "diagnoseSum", str + "|" + split[1]);
                        } else {
                            if (tab.departResult.diagnoseSum.indexOf("结果") > -1) {
                                this.$set(tab.departResult, "diagnoseSum", "");
                                this.$set(tab.departResult, "diagnoseSum", str);
                            } else {
                                if (tab.departResult.diagnoseSum) {
                                    this.$set(tab.departResult, "diagnoseSum", str + "|" + tab.departResult.diagnoseSum);
                                } else {
                                    同步this.$set(tab.departResult, "diagnoseSum", str);
                                }
                            }
                        }*/
        }
      } else if ( !item.departResult.diagnoseSum || temp.length == 0) {
        if (
          tab.name &&
          (tab.name.indexOf("电测") > -1 || tab.name.indexOf("纯音") > -1)
        ) {
          this.$set(tab.departResult, "diagnoseSum", "双耳听力未见异常");
        } else if (tab.name && tab.name.indexOf("肺功能") > -1) {
          this.$set(tab.departResult, "diagnoseSum", "肺通气功能正常");
        } else {
          if (this.$hospitalName.abnormalityFound) {
            this.$set(
              tab.departResult,
              "diagnoseSum",
              this.$hospitalName.abnormalityFound
            );
          } else {
            this.$set(tab.departResult, "diagnoseSum", "未见明显异常");
          }
        }
      }
        }
    },
    //体检小结变化
    diagnoseSumChange(item) {
      //心电图同步体检小结到影像所见
      if (item && item.name && item.name.indexOf("心电图") > -1) {
        item.departResult.diagnoseTip = item.departResult.diagnoseSum;
      }
      //若明细项为空则自动将小结填充过去
      if (item.isFile == "是") {
        this.data.forEach((i) => {
          if (i.departItemResults &&(i.officeId==204||i.officeId==194)){
          if (i.departItemResults && !i.departItemResults.result) {
            i.departItemResults.result = item.departResult.diagnoseSum;
          }} else {
            i.departItemResults.result = item.departResult.diagnoseSum;
          }
        });
      }
    },
    //到检确认
    handleConfirm() {
      // this.$Modal.confirm({
      //     title: "确认到场",
      //     content: "您确认受检人员已到现场吗?",
      //     onOk: () => {
      //         this.$Modal.remove();
      this.checkLoading = true;
      addRelationPersonProjectCheck({
        personId: this.personInfo.id,
        state: 1,
      })
        .then((res) => {
          if (res.success) {
            this.tabsArr.forEach((i) => {
              if (i.status != 2) {
                i.status = 1;
              }
            });
            this.$Message.success("确认登记成功");
            this.$forceUpdate();
          } else {
            this.$Message.error("确认登记失败");
          }
        })
        .finally(() => {
          this.checkLoading = false;
        });
      //     },
      // });
    },
    //样本查看
    codeConfirm() {
      this.sampleCodeShow = true;
    },

    //取消弃检
    CancelDiscardInspection() {
      let item = this.tabsArr.find((i) => i.id == this.tabsValue);
      if (item == undefined) {
        return;
      }
      this.cancelLoading = true;
      updateCancelPersonProjectCheck({
        personId: this.personInfo.id,
        officeId: item.officeId,
        state: 1,
        orderGroupItemId: item.id,
        abandonRenson: "",
      })
        .then((res) => {
          if (res.success) {
            item.status = 1;
            this.$Message.success("取消弃检成功");

            this.$forceUpdate();
          } else {
            this.$Message.error("取消弃检失败");
          }
        })
        .finally(() => {
          this.cancelLoading = false;
          this.getPersonByOfficeId();
        });
    },

    //弃检
    handleCheckConfirm() {
      this.abandonRensonShow = true;
      // //当前选中tab 取id
      // let title = "确认放弃", content = "您确认放弃当前检查项目吗";
      // this.$Modal.confirm({
      //     title: title,
      //     content: content,
      //     onOk: () => {
      //         this.$Modal.remove();
      //
      //     }
      // });
    },

    /**
     * 弃检原因保存
     */
    abandonRensonClick() {
      if (
        !this.abandonRenson ||
        (this.abandonRenson && this.abandonRenson.trim().length == 0)
      ) {
        this.$Message.error("请填写弃检原因");
        return;
      }
      let item = this.tabsArr.find((i) => i.id == this.tabsValue);
      if (item == undefined) {
        return;
      }

      //弃检确认
      if (
        item &&
        item.departResult &&
        item.departResult.id &&
        item.departResult.id.trim().length > 0
      ) {
        //当前选中tab 取id
        this.$Modal.confirm({
          title: "弃检确认",
          content: "当前项目已保存结果，确认弃检吗？",
          onOk: () => {
            this.$Modal.remove();
            this.giveupMethod(item); //弃检
          },
          onCancel: () => {
            this.$Message.info("取消了当前的操作行为！");
            return;
          },
        });
      } else {
        this.giveupMethod(item); //弃检
      }
    },
    //弃检确认
    giveupMethod(item) {
      this.checkLoading = true;
      updateRelationPersonProjectCheck({
        personId: this.personInfo.id,
        officeId: item.officeId,
        state: 2,
        orderGroupItemId: item.id,
        abandonRenson: this.abandonRenson,
      })
        .then((res) => {
          if (res.success) {
            item.status = 2;
            this.$Message.success("弃检成功");
            this.abandonRensonShow = false;
            this.$forceUpdate();
            //弃检结果保存
            this.saveGiveUp();
          } else {
            this.$Message.error("弃检失败");
          }
        })
        .finally(() => {
          this.checkLoading = false;
        });
    },
    //弃检结果保存
    saveGiveUp() {
      //tab 当前选中组合项目
      let tab = this.tabsArr.find((i) => i.id == this.tabsValue);

      let form = {};

      /*if (!tab.departResult.diagnoseTip) {
          tab.departResult.diagnoseTip = "拒绝检查";
        }
        if (!tab.departResult.diagnoseSum) {
          tab.departResult.diagnoseSum = "拒绝检查";
        }*/
      //设置弃检结论
      if (this.$hospitalName && this.$hospitalName.setGiveUpConclusion) {
        tab.departResult.diagnoseTip = this.$hospitalName.setGiveUpConclusion;
        tab.departResult.diagnoseSum = this.$hospitalName.setGiveUpConclusion;
      } else {
        tab.departResult.diagnoseTip = "拒绝检查";
        tab.departResult.diagnoseSum = "拒绝检查";
      }

      this.data.forEach((i) => {
        //添加分组项目id
        if (i.departItemResults) {
          i.departItemResults.orderGroupItemId = this.tabsValue;
          i.departItemResults.result = "";
          i.departItemResults.deleteId = "";
          i.departItemResults.arrow = "";
          i.departItemResults.crisisDegree = "";
          i.departItemResults.positive = 0;
          i.departItemResults.diagnoseSum = "拒绝检查";
        }
      });

      // this.indxArr.push(index);
      this.saveLoading = true;

      form.groupResult = JSON.stringify(tab);
      form.groupItemResult = JSON.stringify(this.data);

      // 保存
      this.addQJ(tab, form);
    },
    //单选
    radioCheckChange(e) {
      this.groupPersonSearchForm.pageNumber = 1;
      this.isCheck = e;
      this.getPersonByOfficeId();
    },
    //重置
    resetSearchForm() {
      // this.groupPersonSearchForm.personId = "";
      // this.groupPersonSearchForm.keyword = "";
      // this.groupPersonSearchForm.endDate = null;

      this.groupPersonSearchForm.pageNumber = 1;
      this.groupPersonSearchForm.keyword = "";
      this.groupPersonSearchForm.startDate = null;
      this.groupPersonSearchForm.endDate = null;
      this.groupPersonSearchForm.personName = "";
      this.groupPersonSearchForm.testNum = "";
      this.groupPersonSearchForm.dept = "";
      if (this.date == "重置") {
        this.date = "当日";
        this.groupPersonSearchForm.startDate = formartDate(
          new Date(),
          "yyyy-MM-dd HH:mm:ss"
        );
        this.groupPersonSearchForm.endDate = null;
        this.inputSearchChange("");
      }
    },
    getFocus() {
      var that = this;
      window.onload = function (e) {
        var lastTime, nextTime;
        var lastCode, nextCode;
        document.onkeypress = function (e) {
          nextCode = e.which;
          nextTime = new Date().getTime();
          if (
            lastCode != null &&
            lastTime != null &&
            nextTime - lastTime <= 30
          ) {
            that.groupPersonSearchForm.personId +=
              String.fromCharCode(lastCode);
          } else if (
            lastCode != null &&
            lastTime != null &&
            nextTime - lastTime > 100
          ) {
            that.groupPersonSearchForm.personId = "";
          }
          lastCode = nextCode;
          lastTime = nextTime;
        };
      };
    },
    //复检
    handleReCheck() {
      let tab = this.tabsArr.find((i) => i.id == this.tabsValue);
      if (tab != undefined) {
        this.reviewShow = true;
        this.groupItemId = tab.id;
        this.personInfo.portfolioId = tab.portfolioProjectId;
        this.personInfo.portfolioName = tab.name;
        this.personInfo.address = tab.address;
        this.title = "复检项";
      }
    },
    //清空
    onClearChange() {
      this.resetSearchForm();
      this.getPersonByOfficeId();
    },
    //日期选择
    pick(e) {
      this.groupPersonSearchForm.pageNumber = 1;
      if (e == "自定义") {
        this.resetSearchForm();
        this.datePickerShow = true;
      } else if (e == "当日") {
        this.resetSearchForm();
        this.groupPersonSearchForm.startDate = formatDate(
          new Date(),
          "yyyy-MM-dd HH:mm:ss"
        );
        this.groupPersonSearchForm.endDate = null;

        this.getPersonByOfficeId();
      } else if (e == "当月") {
        this.resetSearchForm();
        this.groupPersonSearchForm.endDate = formatDate(
          new Date(),
          "yyyy-MM-dd  HH:mm:ss"
        );
        this.groupPersonSearchForm.startDate = null;
        this.getPersonByOfficeId();
      } else if (e == "重置") {
        this.resetSearchForm();
        let date = getMonthString(new Date());
      }
    },
    resetClick() {
      this.groupPersonSearchForm.pageNumber = 1;
      this.groupPersonSearchForm.isCheck = "0";

      this.groupPersonSearchForm.personName = "";
      this.groupPersonSearchForm.testNum = "";
      this.groupPersonSearchForm.dept = "";
      this.isCheck = 0;

      let _this = this;
      setTimeout(function () {
        _this.date = "当日";
        if (!_this.$hospitalName.queryTimeChange) {
          let date = getMonthString(new Date());
          if (date != null && date.length == 2) {
            _this.groupPersonSearchForm.startDate = date[0] + " 00:00:00";
            _this.groupPersonSearchForm.endDate = date[1] + " 23:59:59";
          }
        } else {
          _this.groupPersonSearchForm.startDate = formartDate(
            new Date(),
            "yyyy-MM-dd HH:mm:ss"
          );
          _this.groupPersonSearchForm.endDate = null;
        }
        _this.inputSearchChange("");
      });
    },
    //复查选择
    typeChange(e) {
      this.groupPersonSearchForm.pageNumber = 1;
      if (!e) {
        this.isReviewer = false;
      } else {
        this.isReviewer = true;
      }
      this.getPersonByOfficeId();
    },

    //人员查询
    inputSearchChange(e) {
      this.groupPersonSearchForm.pageNumber = 1;
      this.getPersonByOfficeId();
    },
    //人员日期查询
    datePickerChange(e) {
      if (e) {
        this.groupPersonSearchForm.startDate = e[0];
        let dateTime = new Date(e[1]);
        dateTime = dateTime.setDate(dateTime.getDate() + 1);
        this.groupPersonSearchForm.endDate = new Date(dateTime);
        this.getPersonByOfficeId();
      }
    },

    //人员日期查询
    datePickerEndTime(e) {
      if (e) {
        let endTime = new Date(e);
        endTime.setHours(23, 59, 59, 999);
        endTime = endTime.setDate(endTime.getDate());
        this.groupPersonSearchForm.endDate = formatDate(
          new Date(endTime),
          "yyyy-MM-dd HH:mm:ss"
        );
      }
      this.getPersonByOfficeId();
    },

    //人员日期查询
    datePickerStartTime(e) {
      if (e) {
        let startTime = new Date(e);
        startTime.setHours(0, 0, 0, 0);
        startTime = startTime.setDate(startTime.getDate());
        this.groupPersonSearchForm.startDate = formatDate(
          new Date(startTime),
          "yyyy-MM-dd HH:mm:ss"
        );
      }
      this.getPersonByOfficeId();
    },
    //图片查看
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
    //图片
    srcImage(url) {
      if (url) {
        if (url.indexOf("/dcm") <= -1) {
          return "data:image/png;base64," + url;
        } else {
          return url;
        }
      }
    },
    //label
    setLabel(name) {
      name = name.split("");
      if (name.length == 2) {
        return name[0] + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + name[1];
      }
      if (name.length == 3) {
        return name[0] + "\xa0\xa0" + name[1] + "\xa0\xa0" + name[2];
      }
    },
    //模板查看
    handleViewTemplate() {
      this.previewShow = true;
      this.personInfo = JSON.parse(JSON.stringify(this.personInfo));
      let tab = this.tabsArr.find((i) => this.tabsValue == i.id);
      if (tab != undefined) {
        if (!tab.departResult) {
          tab.departResult.checkDoc = this.doctor;
        }
        const viewData = {
          pacsData: this.pacsData,
          groupItems: tab,
          baseProject: this.data,
        }

        Object.entries(viewData).forEach(([k, value]) => {
          this.$set(this.personInfo, k, value)
        })
      }
    },
    //row换颜色
    rowClassName(row, index) {
      if (row.departItemResults) {
        if (row.departItemResults.crisisDegree == "正常") {
        } else if (row.departItemResults.crisisDegree == "低于正常值") {
          return "yellow";
        } else if (
          row.departItemResults.crisisDegree == "高于正常值" ||
          row.departItemResults.crisisDegree == "异常"
        ) {
          return "red";
        }
      }
    },
    //常用术语选择
    handleWordChoose(type, item) {
      //科室id 体检类型 危害因素 术语类型
      this.wordChooseShow = true;
      this.title = "常用术语";
      this.type = type;
      this.officeId = item.officeId;

      if (["DR室", "心电图", "彩超室"].some(i => item?.officeName === i)) {
        this.isSearchPositive = false;
      } else if (this.$hospitalName && this.$hospitalName.isUserOfficeTerm) {
        //是否使用术语
        this.isSearchPositive = !this.$hospitalName.isUserOfficeTerm;
      } else {
        this.isSearchPositive = true;
      }
    },
    //获取专业术语回调
    getSelectedWords(word, cType) {
      let _this = this;
      this.$nextTick(() => {
        this.tabsArr.forEach((i) => {
          if (i.id == this.tabsValue) {
            if (cType == "zdtx") {
              i.departResult.diagnoseTip = word;
            } else {
              let str = i.departResult.diagnoseSum
                ? i.departResult.diagnoseSum.split("|")
                : "";
              if (str.length == 2) {
                i.departResult.diagnoseSum = str[0] + "|" + word;
              } else {
                if (!i.departResult.diagnoseSum) {
                  i.departResult.diagnoseSum = word;
                } else {
                  i.departResult.diagnoseSum =
                    i.departResult.diagnoseSum + "|" + word;
                }
                //心电图同步体检小结到影像所见
                if (i && i.name && i.name.indexOf("心电图") > -1) {
                  i.departResult.diagnoseTip = i.departResult.diagnoseSum;
                }
                //若明细项为空则自动将小结填充过去
                if (i.isFile == "是") {
                  _this.data.forEach((item) => {
                    if (
                      item.departItemResults &&
                      !item.departItemResults.result
                    ) {
                      item.departItemResults.result =
                        i.departResult.diagnoseSum;
                    }
                  });
                }
              }
            }
          }
        });
      });
    },
    // officeId 查询人员
    getPersonByOfficeId() {
      if (
        this.isConsultation &&
        SpecialTypes.some((t) => this.physicalType === t)
      ) {
        //是问诊科
        if (this.isCheck == 1) {
          this.groupPersonSearchForm.isPass = null;
        } else {
          this.groupPersonSearchForm.isPass = 2;
        }
        this.groupPersonSearchForm.isCheck = this.isCheck;
      } else {
        //非问诊科
        if (this.isCheck == 1) {
          this.groupPersonSearchForm.isCheck = 1;
          this.groupPersonSearchForm.isPass = null;
        } else {
          this.groupPersonSearchForm.isCheck = 0;
          this.groupPersonSearchForm.isPass = 2;
        }
      }

      this.checkPersonLoading = true;
      this.groupPersonSearchForm.physicalType = this.physicalType;
      //输入了就不带时间
      if (
        (this.groupPersonSearchForm.keyword &&
          this.groupPersonSearchForm.keyword.trim().length > 0) ||
        (this.groupPersonSearchForm.personName &&
          this.groupPersonSearchForm.personName.trim().length > 0) ||
        (this.groupPersonSearchForm.testNum &&
          this.groupPersonSearchForm.testNum.trim().length > 0) ||
        (this.groupPersonSearchForm.dept &&
          this.groupPersonSearchForm.dept.trim().length > 0)
      ) {
        this.groupPersonSearchForm.startDate = null;
        this.groupPersonSearchForm.endDate = null;
        this.date = ""; //取消时间筛选
      }

      const searchForm = JSON.parse(JSON.stringify(this.groupPersonSearchForm));

      Object.assign(searchForm, {
        // 是否为问诊科
        isWzCheck:
          this.isConsultation &&
          SpecialTypes.some((t) => this.physicalType === t)
            ? this.isCheck
            : null,
      });

      if (searchForm.startDate) {
        searchForm.startDate = formatDate(
          searchForm.startDate,
          "yyyy-MM-dd HH:mm:ss"
        );
      }
      if (searchForm.endDate) {
        searchForm.endDate = formatDate(
          searchForm.endDate,
          "yyyy-MM-dd HH:mm:ss"
        );
        searchForm.endDate = searchForm.endDate.replace(
          " 00:00:00",
          " 23:59:59"
        );
      }
      if (!this.$hospitalName.queryTimeChange) {
        if (
          searchForm.startDate == null ||
          searchForm.startDate.trim().length == 0
        ) {
          searchForm.startDate = "1971-01-01 00:00:00";
        }
        if (
          searchForm.endDate == null ||
          searchForm.endDate.trim().length == 0
        ) {
          let endTime = getDataString(new Date());
          searchForm.endDate = endTime + " 23:59:59";
        }
      }
      if (this.isReviewer) {
        getPersonReviewerByOfficeId(searchForm)
          .then((res) => {
            if (res.success) {
              this.personData = res.data.records;
              this.personTotal = res.data.total;
              if (this.personData && this.personData.length > 0) {
                if (
                  this.isRadioChecked &&
                  this.personData.some((i) => this.isRadioChecked === i.id)
                ) {
                  const checkValue = this.isRadioChecked;
                  this.isRadioChecked = "";
                  this.$nextTick(() => {
                    this.isRadioChecked = checkValue;
                  });
                } else {
                  this.isRadioChecked = this.personData[0].id;
                }
                this.personPhysicalType = this.personData[0].physicalType;
              } else {
                this.isRadioChecked = "";
                this.personPhysicalType = "";
              }
            }
          })
          .finally(() => {
            this.checkPersonLoading = false;
          });
      } else {
        getPersonByOfficeId(searchForm)
          .then((res) => {
            if (res.success) {
              this.personData = res.data.records;
              this.personTotal = res.data.total;
              if (this.personData && this.personData.length > 0) {
                if (
                  this.isRadioChecked &&
                  this.personData.some((i) => this.isRadioChecked === i.id)
                ) {
                  const checkValue = this.isRadioChecked;
                  this.isRadioChecked = "";
                  this.$nextTick(() => {
                    this.isRadioChecked = checkValue;
                  });
                } else {
                  this.isRadioChecked = this.personData[0].id;
                }
                this.personPhysicalType = this.personData[0].physicalType;
              } else {
                this.isRadioChecked = "";
                this.personPhysicalType = "";
              }
            }
          })
          .finally(() => {
            this.checkPersonLoading = false;
          });
      }
    },
    //人员列表
    radioChooseClick(id, physicalType) {
      if (this.disRadio) {
        return;
      }
      this.pacsData = [];
      this.isRadioChecked = id;
      this.personPhysicalType = physicalType;
    },
    generateWzCheckDoctor() {
      if (!this.personInfo) return;
      const { wzCheckDoctorId } = this.personInfo;
      const { nickname, id, autographFile, autograph } = this.currentUser ?? {};

      if (!wzCheckDoctorId) {
        this.isWzChecked = false;
        Object.assign(this.personInfo, {
          wzCheckAutograph: autographFile?.indexOf("/dcm") > -1
            ? autographFile
            : "data:image/png;base64," + autograph,
          wzCheckDoctor: nickname,
          wzCheckDoctorId: id,
        })
      } else {
        this.isWzChecked = true
      }
    },
    //获取一条记录
    getOnePersonData(id) {
      //如果是问诊科
      this.personInfoLoading = true;
      let isConsultation = this.isConsultation;
      //复查默认不走问诊
      if(this.isReviewer){
        isConsultation = false;
      }
      if (isConsultation) {
        if (this.personPhysicalType == "从业体检") {
          this.showOtherInfo = false;
          getTGroupPersonInfoById({ id: id })
            .then((res) => {
              if (res.success) {
                if (res.data) {
                  //人信息
                  this.personInfo = this.$utils.format.underlineToCamel(
                    res.data
                  );
                  this.getItemDataByGroupId();
                  this.generateWzCheckDoctor();
                  this.showOtherInfo = true;
                } else {
                  //清除当前表格中信息
                  this.personInfo = {};
                  this.tabsArr = [];
                  this.data = [];
                }
              }
            })
            .finally(() => {
              this.personInfoLoading = false;
              this.disRadio = false;
            });
        } else {
          this.showOtherInfo = false;
          getTGroupPersonInfo({ id: id })
            .then((res) => {
              if (res.success) {
                if (res.data) {
                  //人信息
                  this.personInfo = this.$utils.format.underlineToCamel(
                    res.data
                  );
                  this.generateWzCheckDoctor();
                  this.getItemDataByGroupId();
                  this.showOtherInfo = true;
                } else {
                  //清除当前表格中信息
                  this.personInfo = {};
                  this.tabsArr = [];
                  this.data = [];
                }
              }
            })
            .finally(() => {
              this.personInfoLoading = false;
              this.disRadio = false;
            });
        }
      } else {
        if (this.personPhysicalType == "从业体检") {
          getTGroupPersonById({ id })
            .then((res) => {
              if (res.success) {
                if (res.data) {
                  //人信息
                  this.personInfo = this.$utils.format.underlineToCamel(
                    res.data
                  );
                  this.generateWzCheckDoctor();
                  //根据分组id，加载分组项目
                  this.getItemDataByGroupId();
                } else {
                  //清除当前表格中信息
                  this.personInfo = {};
                  this.tabsArr = [];
                  this.data = [];
                }
              }
            })
            .finally(() => {
              this.personInfoLoading = false;
              this.disRadio = false;
            });
        } else {
          getTGroupPersonWithLink({ id })
            .then((res) => {
              if (res.success) {
                if (res.data) {
                  //人信息
                  this.personInfo = this.$utils.format.underlineToCamel(
                    res.data
                  );
                  this.generateWzCheckDoctor();
                  //根据分组id，加载分组项目
                  this.getItemDataByGroupId();
                } else {
                  //清除当前表格中信息
                  this.personInfo = {};
                  this.tabsArr = [];
                  this.data = [];
                }
              }
            })
            .finally(() => {
              this.personInfoLoading = false;
              this.disRadio = false;
            });
        }
      }
    },
    // 根据分组id获取组合项目
    getItemDataByGroupId() {
      let groupId = this.personInfo.group_id || this.personInfo.groupId;
      let personId = this.personInfo.id;
      this.tabsArr = [];
      if (this.personInfo && this.personInfo.regist_date) {
        this.personInfo.regist_date = formatDate(
          this.personInfo.regist_date,
          "yyyy-MM-dd HH:mm:ss"
        );
      }
      let _this = this;

      if (!groupId) return;

      this.loadingGroup = true;

      getItemByGroupId({
        groupId: groupId,
        personId: personId,
        isReview: _this.typeStatus,
      })
        .then((res) => {
          if (res.success) {
            //重新赋值，满足检查结果表字段
            if (res.data.length > 0) {
              _this.tabsArr = [];
              _this.groupItemIdList = [];
              //组合项目
              res.data.forEach((i, indx) => {
                _this.groupItemIdList.push(i.id);
                if (!i.departResult) {
                  const { nickname, id, autographFile, autograph } = this.currentUser ?? {};
                  i.departResult = {
                    checkDate: _this.checkDate,
                    checkDoc: nickname,
                    createId: id,
                    checkSignPath: autographFile?.indexOf("/dcm") > -1
                      ? autographFile
                      : "data:image/png;base64," + autograph,
                      personId: this.personInfo.id,
                    groupItemId: i.id,
                    groupItemName: i.name,
                    diagnoseTip: "",
                    diagnoseSum: "",
                  };
                }

                if (
                  Object.prototype.toString.call(i.departResult) ==
                  "[object Object]"
                ) {
                  if (!i.departResult.personId)
                    i.departResult.personId = this.personInfo.id;
                  if (!i.departResult.groupItemId)
                    i.departResult.groupItemId = i.groupItemId;
                  if (!i.departResult.groupItemName)
                    i.departResult.groupItemName = i.groupItemName;
                  if (!i.departResult.diagnoseTip)
                    i.departResult.diagnoseTip = "";
                  if (!i.departResult.diagnoseSum)
                    i.departResult.diagnoseSum = "";
                  if (!i.departResult.checkDate)
                    i.departResult.checkDate = _this.checkDate;
                  if (!i.departResult.checkDoc) i.departResult.checkDoc = "";
                  if (!i.departResult.createId)
                    i.departResult.createId = this.dockerId;
                } else {
                  i.departResult = {
                    personId: this.personInfo.id,
                    groupItemId: i.id,
                    groupItemName: i.name,
                    diagnoseTip: "",
                    diagnoseSum: "",
                    checkDoc: "",
                    createId: this.dockerId,
                  };
                }

                if (this.$hospitalName.generateDRConclusion && `${i.officeName}`.includes("DR室")) {
                  Object.assign(i.departResult, {
                    diagnoseTip: i.departResult.diagnoseTip || "双侧胸廓对称。双肺透光度基本一致，双肺肺纹理分布清晰自然，肺野内未见渗出及占位等异常影像。两肺门结构清晰;心影形态、大小未见明显异常。双隔面光滑，双侧肋隔角锐利。双侧肋骨、胸骨、胸椎未见异常影像。",
                    diagnoseSum: i.departResult.diagnoseSum || "胸部未见异常影像"
                  })
                }
                if (_this.$hospitalName.radioGraph && _this.$hospitalName.radioGraph.length > 0) {
                  let radioGraph = _this.$hospitalName.radioGraph;
                  let projectName = radioGraph.filter(aa => aa.projectName.includes(i.name));
                  if (projectName != null && projectName.length > 0) {
                    Object.assign(i.departResult, {
                      diagnoseTip:  i.departResult.diagnoseTip|| projectName[0].diagnoseTip,
                      diagnoseSum:  i.departResult.diagnoseSum|| projectName[0].diagnoseSum
                    })
                  } else {
                    projectName = radioGraph.filter(aa => aa.officeId == i.officeId);
                    if (projectName != null && projectName.length > 0){
                      Object.assign(i.departResult, {
                        diagnoseTip:  i.departResult.diagnoseTip|| projectName[0].diagnoseTip,
                        diagnoseSum:  i.departResult.diagnoseSum|| projectName[0].diagnoseSum
                      })
                    }
                  }
                }
              });

              //分组项目
              _this.tabsArr = res.data;

              _this.tabsValue = SpecialTypes.some(
                (t) => _this.personInfo?.physicalType === t
              ) && _this.isConsultation
                ? ""
                : _this.tabsArr[0]?.id;
              this.getBaseProjectResult();
            }
          }
        })
        .finally(() => {
          this.personInfoLoading = false;
          this.loadingGroup = false;
        });
    },
    //获取选中的基础项目
    getSelectedBaseItemByItemId_front(
      itemId,
      portfolioId = "",
      groupId = "",
      isFile
    ) {
      let _this = this;
      if (itemId && this.personInfo && this.personInfo.id) {
        this.data = [];
        this.loading = true;
        this.pacsData = [];
        getSelectedBaseItemByItemId({
          itemId: itemId,
          personId: this.personInfo.id,
          portfolioId: portfolioId,
          groupId: groupId,
        })
          .then((res) => {
            if (res.success) {
              this.data = res.data;
              if (res.data && res.data.length > 0) {
                res.data.forEach((i) => {
                  if (i.departItemResults == null) {
                    i.departItemResults = {};
                    if (
                      i.name &&
                      (i.name.indexOf("听力(左)") > -1 ||
                        i.name.indexOf("听力(右)") > -1) &&
                      this.$hospitalName.modifyResultsTc
                    ) {
                      if (
                        _this.personInfo &&
                        _this.personInfo.hazard_factors_text &&
                        _this.personInfo.hazard_factors_text.indexOf(
                          "职业机动车驾驶作业"
                        ) > -1
                      ) {
                        i.departItemResults.result = "6/6米";
                      } else {
                        i.departItemResults.result = "正常";
                      }
                    } else {
                      i.departItemResults.result = i.defaultValue;
                    }
                    // i.departItemResults.result = i.defaultValue;
                    i.departItemResults.personId = this.personInfo.id;
                    i.departItemResults.orderGroupItemProjectName = i.name;
                    i.departItemResults.orderGroupItemProjectId = i.id;
                    i.departItemResults.crisisDegree = "-";

                    if (
                      /^\d+$|^[0-9]+\.[0-9]+$/.test(i.departItemResults.result)
                    ) {
                      let ret = this.setResult(
                        i.criticals,
                        i.departItemResults.result
                      );
                      if (ret) {
                        if (ret.flag == "-") {
                          i.departItemResults.crisisDegree = "-";
                          i.departItemResults.arrow = "-";
                          this.$set(i.departItemResults, "positive", "0");
                        } else if (ret.flag) {
                          i.departItemResults.arrow = ret.arrow;
                          i.departItemResults.crisisDegree =
                            ret.arrow == "-"
                              ? "-"
                              : ret.arrow == "↑"
                              ? "高于正常值"
                              : "低于正常值";
                          this.$set(i.departItemResults, "positive", "1");
                        } else if (!ret.flag) {
                          i.departItemResults.arrow = ret.arrow;
                          i.departItemResults.arrow = "正常";
                          this.$set(i.departItemResults, "positive", "0");
                        }
                      }
                    } else {
                      if (i.resultType == "选择") {
                        let ret = this.setResult(
                          i.criticals,
                          i.departItemResults.result.split(";")[0]
                        );
                        if (!ret) {
                          this.$set(i.departItemResults, "crisisDegree", "-");
                          this.$set(i.departItemResults, "arrow", "-");
                          this.$set(i.departItemResults, "positive", "0");
                        } else {
                          if (ret.flag == "-") {
                            this.$set(i.departItemResults, "crisisDegree", "-");
                            this.$set(i.departItemResults, "arrow", "-");
                            this.$set(i.departItemResults, "positive", "0");
                          } else if (ret.flag) {
                            this.$set(
                              i.departItemResults,
                              "crisisDegree",
                              ret.resp
                            );
                            this.$set(i.departItemResults, "arrow", ret.arrow);
                            this.$set(i.departItemResults, "positive", "1");
                          } else if (!ret.flag) {
                            this.$set(
                              i.departItemResults,
                              "crisisDegree",
                              ret.resp
                            );
                            this.$set(i.departItemResults, "arrow", ret.arrow);
                            this.$set(i.departItemResults, "positive", "0");
                          }
                        }
                      } else {
                        i.departItemResults.crisisDegree = "-";

                        let ret = this.setResult(
                          i.criticals,
                          i.departItemResults.result
                        );

                        if (ret.flag == "-") {
                          this.$set(i.departItemResults, "crisisDegree", "-");
                          this.$set(i.departItemResults, "arrow", "-");
                          this.$set(i.departItemResults, "positive", "0");
                        } else if (ret.flag) {
                          this.$set(
                            i.departItemResults,
                            "crisisDegree",
                            ret.resp
                          );
                          this.$set(i.departItemResults, "arrow", ret.arrow);
                          this.$set(i.departItemResults, "positive", "1");
                        } else if (!ret.flag) {
                          this.$set(
                            i.departItemResults,
                            "crisisDegree",
                            ret.resp
                          );
                          this.$set(i.departItemResults, "arrow", ret.arrow);
                          this.$set(i.departItemResults, "positive", "0");
                        }
                      }
                    }
                  } else {
                    if (i.name == "身高") {
                      this.personHeight = i.departItemResults.result;
                    }
                    if (i.name == "体重") {
                      this.personWeight = i.departItemResults.result;
                    }
                  }
                  if (isFile == "是" && i.departItemResults.imgUrl) {
                    this.pacsData = [];
                    if (i.departItemResults.imgUrl.indexOf(",") > -1) {
                      let imgUrls = i.departItemResults.imgUrl.split(",");
                      imgUrls.forEach((item) => {
                        this.pacsData.push(item);
                      });
                    } else {
                      this.pacsData.push(i.departItemResults.imgUrl);
                    }
                  }
                });
              }
            }
          })
          .catch(function (error) {
            this.loading = false;
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    },
    //组合项目添加边角
    handleCheckStatus() {
      this.$nextTick(() => {
        setTimeout(() => {
          const tabs =
            document.querySelector("#tab")?.querySelector(".el-tabs__nav")
              ?.children ?? [];

          for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            tab.style.borderRight = "1px solid #E4E7ED";

            const tabId = tab.id?.split("-")[1];
            const oSpan = this.createStatuSpan();
            const t = this.tabsArr.find((x) => tabId === x.id);

            switch (true) {
              case t !== void 0:
                if (t.status == null || !t.status) {
                  oSpan.style.borderColor = StatuColors.todo;
                }
                if (t.status == 1) {
                  if (t.departResult?.id || this.indxArr.indexOf(i) > -1) {
                    oSpan.style.borderColor = StatuColors.done;
                    break;
                  }
                  oSpan.style.borderColor = StatuColors.doing;
                }
                if (t.status == 2) {
                  oSpan.style.borderColor = StatuColors.danger;
                }
                break;
              // 基本信息
              default:
                oSpan.style.borderColor = this.isWzChecked
                  ? StatuColors.done
                  : StatuColors.doing;
                break;
                // // 症状询问
                // case tabId === "zzxw":
                // // 自觉症状
                // case tabId === "zjzz":
                //   oSpan.style.borderColor = this.personInfo.symptomData?.length
                //     ? StatuColors.done
                //     : StatuColors.doing;

                //   break;
                // // 既往病史
                // case tabId === "jwbs":
                //   oSpan.style.borderColor = this.personInfo.pastMedicalHistoryData
                //     ?.length
                //     ? StatuColors.done
                //     : StatuColors.doing;

                break;
            }

            const span = tab.querySelector("span");

            if (span != null && span != undefined) {
              tab.removeChild(span);
            }

            tab.appendChild(oSpan);
          }
        });
      });
    },
    createStatuSpan() {
      const oSpan = document.createElement("span");

      Object.assign(oSpan.style, {
        position: "absolute",
        top: "-10px",
        transform: "rotate(134deg)",
        right: "-2px",
        width: "0",
        height: "0",
        borderStyle: "solid",
        borderWidth: "15px 15px 16px 0",
        fontSize: "0",
        lineHeight: "0",
        borderColor: StatuColors.doing,
      });

      return oSpan;
    },
    //保存结果
    handleSave(index) {
      //效验当前人员体检状态是否已锁定（已总检即锁定状态，不允许再次保存结果）
      if (
        this.personInfo &&
        this.personInfo.is_pass > 3 &&
        this.$hospitalName &&
        !this.$hospitalName.isCanSaveConclusionCheckFinish
      ) {
        this.$Message.info("当前人员已总检，如要修改，请先退回到待总检状态！");
        return;
      }
      //效验项目检查时间不能大于登记时间
      let checkData = this.tabsArr.find((i) => i.id == this.tabsValue);
      if (checkData && checkData.departResult.checkDate && this.personInfo.registDate){
        let data = formatDate(
            checkData.departResult.checkDate,
            "yyyy-MM-dd HH:mm:ss"
        );
        if (Date.parse(data) < Date.parse(this.personInfo.registDate)){
          this.$Message.error('项目检查时间不能小于登记时间！！！');
          return;
        }
      }
      //tab 当前选中组合项目
      let tab = this.tabsArr.find((i) => i.id == this.tabsValue);
      //验证电测听是否同步到数据
      if (tab.name && tab.name.indexOf("纯音测听") > -1) {
        let HLr = "";
        let HLl = "";
        let GFA = "";
        let gHLr = "";
        let gHLl = "";
        let gGFA = "";
        this.data.forEach((i) => {
          //气体
          if (i && i.shortName == "HLr") {
            HLr = i.departItemResults.result;
            if (HLr == 0) {
              i.departItemResults.result = "";
            }
          }
          if (i && i.shortName == "HLl") {
            HLl = i.departItemResults.result;
            if (HLl == 0) {
              i.departItemResults.result = "";
            }
          }
          if (i && i.shortName == "GFA") {
            GFA = i.departItemResults.result;
            if (GFA == 0) {
              i.departItemResults.result = "";
            }
          }
          //骨导
          if (i && i.shortName == "gHLr") {
            gHLr = i.departItemResults.result;
            if (gHLr == 0) {
              i.departItemResults.result = "";
            }
          }
          if (i && i.shortName == "gHLl") {
            gHLl = i.departItemResults.result;
            if (gHLl == 0) {
              i.departItemResults.result = "";
            }
          }
          if (i && i.shortName == "gGFA") {
            gGFA = i.departItemResults.result;
            if (gGFA == 0) {
              i.departItemResults.result = "";
            }
          }
        });
        if (!((HLr && HLr != 0) || (HLl && HLl != 0) || (GFA && GFA != 0))) {
          if (
            (tab.departResult.diagnoseSum &&
              tab.departResult.diagnoseSum.indexOf("拒绝检查") <= -1) ||
            (!tab.departResult.diagnoseSum &&
              tab.departResult.diagnoseSum.trim().length == 0)
          ) {
            this.$Message.error("电测听数据未同步到，无法保存！");
            return;
          }
        }
        /*if(tab.name.indexOf("复") > -1){
                        if(!gGFA || (gGFA && gGFA == 0)){
                            this.$Message.error("电测听数据未同步到，无法保存！");
                            return;
                        }
                    }else{
                        if(!GFA || (GFA && GFA == 0)){
                            this.$Message.error("电测听数据未同步到，无法保存！");
                            return;
                        }
                    }*/
      }

      let form = {};
      //影像地址拼接
      let imgUrl = "";
      for (let i = 0; i < this.pacsData.length; i++) {
        if (i < this.pacsData.length - 1) {
          imgUrl += this.pacsData[i] + ",";
        } else {
          imgUrl += this.pacsData[i];
        }
      }

      //Lis图片base64拼接(血常规、眼科放射图像)
      let lisDataImg = "";
      for (let i = 0; i < this.lisData.length; i++) {
        if (i < this.lisData.length - 1) {
          lisDataImg += this.lisData[i] + ",";
        } else {
          lisDataImg += this.lisData[i];
        }
      }

      this.data.forEach((i) => {
        if (tab.isFile == "是") {
          if (i.departItemResults) {
            i.departItemResults.imgUrl = imgUrl;
            // i.departItemResults.result = tab.departResult.diagnoseTip;
            if (!i.departItemResults.result) {
              i.departItemResults.result = tab.departResult.diagnoseSum;
            }
            /*let physicalSummary = this.$hospitalName.physicalSummary;
              if(i.departItemResults.result && i.departItemResults.result.trim().length>0 && physicalSummary){
                if(physicalSummary.indexOf(i.departItemResults.result.trim())>-1 || (i.departItemResults.result.indexOf("未见异常")>-1) || (i.departItemResults.result.indexOf("正常")>-1)){
                  i.departItemResults.crisisDegree = "正常";
                }else{
                  i.departItemResults.crisisDegree = "异常";
                }
              }*/
            if (
              i.departItemResults &&
              i.departItemResults.positive &&
              i.departItemResults.positive.toString().trim() == "1"
            ) {
              if (
                !i.departItemResults.crisisDegree ||
                i.departItemResults.crisisDegree == "正常" ||
                i.departItemResults.crisisDegree == "-"
              ) {
                i.departItemResults.crisisDegree = "异常";
              }
            } else {
              i.departItemResults.crisisDegree = "正常";
              i.departItemResults.arrow = "-";
            }
          }
        } else {
          if (i.departItemResults) {
            if (
              i.departItemResults &&
              i.departItemResults.positive &&
              i.departItemResults.positive.toString().trim() == "1"
            ) {
              if (
                !i.departItemResults.crisisDegree ||
                i.departItemResults.crisisDegree == "正常" ||
                i.departItemResults.crisisDegree == "-"
              ) {
                i.departItemResults.crisisDegree = "异常";
              }
            } else {
              i.departItemResults.crisisDegree = "正常";
              i.departItemResults.arrow = "-";
            }
          }
        }
        if (tab.name && tab.name.indexOf("肺功能") > -1) {
          if (i.departItemResults) {
            i.departItemResults.imgUrl = imgUrl;
          }
        }
        /*if(tab.name.indexOf("肺功能") > -1){
                        i.departItemResults.updateId = i.departItemResults.scope;
                    }*/
        //添加分组项目id
        if (i.departItemResults) {
          i.departItemResults.orderGroupItemId = this.tabsValue;
          i.departItemResults.diagnoseSum = tab.departResult.diagnoseSum.trim();
        }
        if (i.departItemResults && i.departItemResults.scope && i.departItemResults.scope.indexOf("-")>-1){
          if (i.departItemResults.scope.indexOf("--") > -1){
            i.departItemResults.scope.replaceAll("--","-");
          }
          if (i.departItemResults.scope.split("-").length > 2){
            this.$set(i.departItemResults, 'minimumValue', "-" + i.departItemResults.scope.split ("-")[1]);
            this.$set(i.departItemResults, 'maximumValue', i.departItemResults.scope.split ("-")[2]);
          }else {
            this.$set(i.departItemResults, 'minimumValue', i.departItemResults.scope.split ("-")[0]);
            this.$set(i.departItemResults, 'maximumValue', i.departItemResults.scope.split ("-")[1]);
          }
        }
      });

      if (tab.isFile == "是") {
        //诊断提醒 体检小结
        if (!tab.departResult.diagnoseTip) {
          this.$Message.error("请完善体检提醒");
          return;
        }
        if (!tab.departResult.diagnoseSum) {
          this.$Message.error("请完善体检小结");
          return;
        }
        if (this.pacsData.length == 0 && tab.name.indexOf("心电图") > -1) {
          this.$Modal.confirm({
            title: "确认保存",
            content: "心电图未上传图片，确定保存？",
            loading: true,
            onOk: () => {
              this.$Modal.remove();
              this.loading = false;

              this.indxArr.push(index);
              this.saveLoading = true;

              //Lis图片存储(血常规)
              if (lisDataImg && lisDataImg != "") {
                tab.departResult.url = lisDataImg;
              }

              //判断是否是 弃检项目
              if (tab.status == 2) {
                this.$Message.error("保存失败，当前项目已弃检！");
                this.saveLoading = false;
                return;
              }

              form.groupResult = JSON.stringify(tab);
              form.groupItemResult = JSON.stringify(this.data);

              // 保存
              this.add(tab, form);
            },
            onCancel: () => {
              this.$Message.info("取消了当前的操作行为！");
              this.loading = false;
              return;
            },
          });
        } else {
          this.indxArr.push(index);
          this.saveLoading = true;

          //Lis图片存储(血常规)
          if (lisDataImg && lisDataImg != "") {
            tab.departResult.url = lisDataImg;
          }

          //判断是否是 弃检项目
          if (tab.status == 2) {
            this.$Message.error("保存失败，当前项目已弃检！");
            this.saveLoading = false;
            return;
          }

          form.groupResult = JSON.stringify(tab);
          form.groupItemResult = JSON.stringify(this.data);

          // 保存
          this.add(tab, form);
        }
      } else {
        this.indxArr.push(index);
        this.saveLoading = true;

        //Lis图片存储(血常规)
        if (lisDataImg && lisDataImg != "") {
          tab.departResult.url = lisDataImg;
        }

        //判断是否是 弃检项目
        if (tab.status == 2) {
          this.$Message.error("保存失败，当前项目已弃检！");
          this.saveLoading = false;
          return;
        }

        form.groupResult = JSON.stringify(tab);
        form.groupItemResult = JSON.stringify(this.data);

        // 保存
        this.add(tab, form);
      }
    },
    // 保存
    add(tab, form) {
      addTDepartResult({ form: form })
        .then((res) => {
          if (res.success) {
            this.$Message.success("保存成功");

            tab.status = 1;
            tab.departResult.id = "1";

            this.refreshCheckStatus();
          } else {
            this.$Message.error("保存失败");
          }
        })
        .finally(() => {
          this.saveLoading = false;
          this.$Modal.remove();
        });
    },
    // 保存(弃检)
    addQJ(tab, form) {
      addTDepartResult({ form: form })
        .then((res) => {
          if (res.success) {
            this.$Message.success("保存成功");
            queryTDepartResultByPersonId({
              data: {
                groupItemIdList: JSON.stringify(this.groupItemIdList),
                personId: this.personInfo.id,
              },
            }).then((res1) => {
              if (res1.success) {
                this.isTemplateShow = true;
                this.getPersonByOfficeId();
              }
            });
          } else {
            this.$Message.error("保存失败");
          }
        })
        .finally(() => {
          this.saveLoading = false;
          this.$Modal.remove();
        });
    },
    //计算平均值
    calculateAverage() {
      if (this.data) {
        //气体·
        let r500, r1000, r2000, r3000, r4000, r6000;
        let l500, l1000, l2000, l3000, l4000, l6000;
        //骨导
        let gr500, gr1000, gr2000, gr3000, gr4000, gr6000;
        let gl500, gl1000, gl2000, gl3000, gl4000, gl6000;
        this.data.forEach((i) => {
          //气体
          if (i && i.shortName == "r500") {
            r500 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "r1000") {
            r1000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "r4000") {
            r4000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "r2000") {
            r2000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "r3000") {
            r3000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "r6000") {
            r6000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "l500") {
            l500 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "l1000") {
            l1000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "l2000") {
            l2000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "l3000") {
            l3000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "l4000") {
            l4000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "l6000") {
            l6000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          //骨导
          if (i && i.shortName == "gr500") {
            gr500 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "gr1000") {
            gr1000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "gr4000") {
            gr4000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "gr2000") {
            gr2000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "gr3000") {
            gr3000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "gr6000") {
            gr6000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "gl500") {
            gl500 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "gl1000") {
            gl1000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "gl2000") {
            gl2000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "gl3000") {
            gl3000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "gl4000") {
            gl4000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "gl6000") {
            gl6000 =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
          if (i && i.shortName == "GFA") {
            this.GFA =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim().length > 0
                ? Number(i.departItemResults.result)
                : 0;
          }
        });
        //气体
        let HLr = ((r500 + r1000 + r2000) / 3).toFixed(0);
        let HLl = ((l500 + l1000 + l2000) / 3).toFixed(0);
        let GFA = ((r3000 + r4000 + r6000 + l3000 + l4000 + l6000) / 6).toFixed(
          0
        );
        //骨导
        let gHLr = (
          ((gr500 + gr1000 + gr2000) / 3) * 0.9 +
          gr4000 * 0.1
        ).toFixed(0);
        let gHLl = (
          ((gl500 + gl1000 + gl2000) / 3) * 0.9 +
          gl4000 * 0.1
        ).toFixed(0);
        let gGFA = (
          (gr3000 + gr4000 + gr6000 + gl3000 + gl4000 + gl6000) /
          6
        ).toFixed(0);
        //双耳语频平均值
        let seyp = 0;
        let SEYPG = 0;
        if (!HLr || HLr == undefined) {
          HLr = 0;
        }
        if (!HLl || HLl == undefined) {
          HLl = 0;
        }
        seyp = (Number(HLr) + Number(HLl)) / 2;
        if (!gHLr || gHLr == undefined) {
          gHLr = 0;
        }
        if (!gHLl || gHLl == undefined) {
          gHLl = 0;
        }
        SEYPG = (Number(gHLr) + Number(gHLl)) / 2;

        //骨导加权值
        let gWVr = (
          ((Number(gr500) + Number(gr1000) + Number(gr2000)) / 3) * 0.9 +
          Number(gr4000) * 0.1
        ).toFixed(0); //右耳 骨导加权值
        let gWVl = (
          ((Number(gl500) + Number(gl1000) + Number(gl2000)) / 3) * 0.9 +
          Number(gl4000) * 0.1
        ).toFixed(0); //左耳 骨导加权值
        this.gWVr = gWVr;
        this.gWVl = gWVl;
        //气导加权值
        let WVr = (
          ((Number(r500) + Number(r1000) + Number(r2000)) / 3) * 0.9 +
          Number(r4000) * 0.1
        ).toFixed(0); //右耳 气导加权值
        let WVl = (
          ((Number(l500) + Number(l1000) + Number(l2000)) / 3) * 0.9 +
          Number(l4000) * 0.1
        ).toFixed(0); //左耳 气导加权值
        this.WVr = WVr;
        this.WVl = WVl;

        this.data.forEach((i) => {
          //气体
          if (i && i.shortName == "HLr") {
            i.departItemResults.result = HLr;
          }
          if (i && i.shortName == "HLl") {
            i.departItemResults.result = HLl;
          }
          if (i && i.shortName == "GFA") {
            i.departItemResults.result = GFA;
          }
          //骨导
          if (i && i.shortName == "gHLr") {
            i.departItemResults.result = gHLr;
          }
          if (i && i.shortName == "gHLl") {
            i.departItemResults.result = gHLl;
          }
          if (i && i.shortName == "gGFA") {
            i.departItemResults.result = gGFA;
          }
          //双耳语频平均值
          if (i && i.shortName == "seyp") {
            i.departItemResults.result = seyp;
          }
          if (i && i.shortName == "SEYPG") {
            i.departItemResults.result = SEYPG;
          }
          if (i.criticals.length == 0) {
            this.$set(i.departItemResults, "crisisDegree", "-");
            this.$set(i.departItemResults, "positive", "0");
          } else {
            let ret = this.setResult(i.criticals, i.departItemResults.result);
            if (ret.flag == "-") {
              this.$set(i.departItemResults, "crisisDegree", "-");
              this.$set(i.departItemResults, "arrow", "-");
              this.$set(i.departItemResults, "positive", "0");
            } else if (ret.flag) {
              this.$set(
                i.departItemResults,
                "crisisDegree",
                ret.arrow == "-"
                  ? "-"
                  : ret.arrow == "↑"
                  ? "高于正常值"
                  : "低于正常值"
              );
              this.$set(i.departItemResults, "arrow", ret.arrow);
              this.$set(i.departItemResults, "positive", "1");
            } else if (!ret.flag) {
              this.$set(i.departItemResults, "crisisDegree", "正常");
              this.$set(i.departItemResults, "arrow", ret.arrow);
              this.$set(i.departItemResults, "positive", "0");
            }
          }
        });
      }
    },
    //计算肺功能
    dataFgnContent() {
      if (this.data) {
        let shortName1 = this.$hospitalName.fgnTemplate.shortName.shortName1; //用力呼气肺活量 简称
        let shortName2 = this.$hospitalName.fgnTemplate.shortName.shortName2; //用力呼气肺活量占预计值百分比(网报) 简称
        let shortName3 = this.$hospitalName.fgnTemplate.shortName.shortName3; //一秒用力呼气容量 简称
        let shortName4 = this.$hospitalName.fgnTemplate.shortName.shortName4; //第一秒钟用力呼气容积占预计值百分比(网报) 简称
        let shortName5 = this.$hospitalName.fgnTemplate.shortName.shortName5; //第一秒用力呼气率，即一秒率(网报) 简称
        let dataFEVone = "";
        let dataFVC = "";
        /*用力呼气肺活量占预计值百分比 计算*/
        let dataFvcBfb = "";
        let dataFEV1Bfb = "";
        this.data.forEach((i) => {
          //获取用力呼气肺活量 实际测量值、预计值 并计算百分比
          if (i && i.shortName == shortName1) {
            dataFVC = i.departItemResults.result
              ? i.departItemResults.result.toString().trim()
              : "";
            dataFvcBfb =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim() != 0 &&
              i.departItemResults.result.toString().trim() != "-" &&
              i.departItemResults.updateId &&
              i.departItemResults.updateId.toString().trim() != 0 &&
              i.departItemResults.updateId.toString().trim() != "-"
                ? (
                    (Number(i.departItemResults.result.toString().trim()) /
                      Number(i.departItemResults.updateId.toString().trim())) *
                    100
                  ).toFixed(2)
                : 0;
          }
          //获取一秒用力呼气容量 实际测量值、预计值 并计算百分比
          if (i && i.shortName == shortName3) {
            dataFEVone = i.departItemResults.result
              ? i.departItemResults.result.toString().trim()
              : "";
            dataFEV1Bfb =
              i.departItemResults.result &&
              i.departItemResults.result.toString().trim() != 0 &&
              i.departItemResults.result.toString().trim() != "-" &&
              i.departItemResults.updateId &&
              i.departItemResults.updateId.toString().trim() != 0 &&
              i.departItemResults.updateId.toString().trim() != "-"
                ? (
                    (
                      i.departItemResults.result.toString().trim() /
                      i.departItemResults.updateId.toString().trim()
                    ).toFixed(4) * 100
                  ).toFixed(2)
                : 0;
          }
        });
        this.data.forEach((i) => {
          //用力呼气肺活量占预计值百分比 存入
          if (i && i.shortName == shortName2) {
            if (
              i.departItemResults &&
              i.departItemResults.result &&
              i.departItemResults.result != 0 &&
              this.$hospitalName.isNotUpdateFGC
            ) {
              //不计算
            } else {
              i.departItemResults.result = dataFvcBfb;
            }
          }
          //一秒率(第一秒钟用力呼气容积占预计值百分比) 存入
          if (i && i.shortName == shortName4) {
            if (
              i.departItemResults &&
              i.departItemResults.result &&
              i.departItemResults.result != 0 &&
              this.$hospitalName.isNotUpdateFGC
            ) {
              //不计算
            } else {
              i.departItemResults.result = dataFEV1Bfb;
            }
          }
          //第一秒用力呼气率 存入
          if (i && i.shortName == shortName5) {
            if (
              i.departItemResults &&
              i.departItemResults.result &&
              i.departItemResults.result != 0 &&
              this.$hospitalName.isNotUpdateFGC
            ) {
              //不计算
            } else {
              let result = i.departItemResults.result;
              if (dataFEVone != 0 && dataFVC != 0) {
                result = ((dataFEVone / dataFVC).toFixed(2) * 100).toFixed(0);
                i.departItemResults.result = result;
              } else {
                result = 0;
                i.departItemResults.result = result;
              }
            }
          }
        });
        this.data.forEach((i) => {
          //危急值判断
          let result = i.departItemResults.result;
          let ret = this.setResult(i.criticals, result);
          if (ret.flag == "-") {
            this.$set(i.departItemResults, "crisisDegree", "-");
            this.$set(i.departItemResults, "arrow", "-");
            this.$set(i.departItemResults, "positive", "0");
          } else if (ret.flag) {
            this.$set(
              i.departItemResults,
              "crisisDegree",
              ret.arrow == "-"
                ? "-"
                : ret.arrow == "↑"
                ? "高于正常值"
                : "低于正常值"
            );
            this.$set(i.departItemResults, "arrow", ret.arrow);
            this.$set(i.departItemResults, "positive", "1");
          } else if (!ret.flag) {
            this.$set(i.departItemResults, "crisisDegree", "正常");
            this.$set(i.departItemResults, "arrow", ret.arrow);
            this.$set(i.departItemResults, "positive", "0");
          }
        });
      }
    },
    //搜索展开
    changeExpand() {
      this.expand = !this.expand;
      if (this.expand) {
        this.expandIcon = "ios-arrow-back";
        this.span = "position: relative;width: calc(100% - 332px);";
        this.leftSpan = "width: 300px;";
      } else {
        this.expandIcon = "ios-arrow-forward";
        this.span = "position: relative;width: calc(100% - 32px);";
        this.leftSpan = "width: 0px;";
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
        if (
          Number(arr[0]) < Number(result) &&
          Number(result) < Number(arr[1])
        ) {
          return "-";
        }
      }
    },
    // tab点击事件
    handleTabClick() {
      // tabClick事件在 tabsValue 改变之前
      this.$nextTick(() => {
        this.isInit = true;
        this.isCalculation = false;

        this.personHeight = 0;
        this.personWeight = 0;
        this.pacsData = [];
        this.lisData = [];
      });
    },
    //获取基础项目结果
    getBaseProjectResult: _debounce(function() {
      let tab = this.tabsArr.find((i) => this.tabsValue === i.id);

      if (!tab) return;
      if (tab.name.indexOf("(复)") > -1) {
        this.getSelectedBaseItemByItemId_front(
          tab.id,
          tab.portfolioProjectId,
          tab.groupId,
          tab.isFile
        );
      } else {
        this.getSelectedBaseItemByItemId_front(tab.id, "", "", tab.isFile);
      }
    }, 500, {}),
    //丙氨酸基转移酶(转氨酶)异常 额外添加检查项目 组合项目id，分组id 戊肝Igm(转氨酶异常的增查) 甲肝Igm(转氨酶异常的增查)
    addBaseProject(orderGroupItemId, groupOrderId) {
      let flag1 = this.data.some((i) => {
        return i.name == "戊肝Igm(转氨酶异常的增查)";
      });

      let flag2 = this.data.some((i) => {
        return i.name == "甲肝Igm(转氨酶异常的增查)";
      });
      if (!flag1 || !flag2) {
        addOrderGroupItemPorjectByExtra({
          orderGroupItemId,
          groupOrderId,
        }).then((res) => {
          if (res.success) {
            this.getItemDataByGroupId();
          } else {
            this.$Message.error(res.msg);
          }
        });
      }
    },
    //设置结果
    setResult(data, result) {
      if (!data || data.length == 0) {
        return { flag: "-", arrow: "-" };
      }
      let age = this.personInfo.age;
      let sex = this.personInfo.sex;
      //性别年龄筛查
      data =
        data.filter(
          (i) =>
            (i.allowSex == "" ||
              i.allowSex == null ||
              i.allowSex == sex ||
              i.allowSex == "全部") &&
            age >= i.minAge &&
            age <= i.maxAge
        ) || [];

      if (data == undefined || data.length == 0) {
        return { flag: "-", arrow: "-" };
      } else if (data.length == 1) {
        let d = data[0];
        if (d.type == "EQ") {
          if (
            /^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue) &&
            /^\d+$|^[0-9]+\.[0-9]+$/.test(result)
          ) {
            if (parseFloat(result) == parseFloat(d.intervalValue)) {
              return { flag: true, arrow: "-", resp: "异常" };
            } else {
              return { flag: false, arrow: "-", resp: "正常" };
            }
          } else if (
            !/^\d+$|^[0-9]+\.[0-9]+$/.test(result) &&
            !/^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue)
          ) {
            if (result == d.intervalValue) {
              return { flag: true, arrow: "-", resp: "异常" };
            } else {
              return { flag: false, arrow: "-", resp: "正常" };
            }
          } else {
            return { flag: "-", arrow: "-", resp: "-" };
          }
        } else if (d.type == "LIKE") {
          if (d.intervalValue.indexOf(result) > -1) {
            return { flag: true, arrow: "-" };
          } else {
            return { flag: false, arrow: "-" };
          }
        } else if (d.type == "GT") {
          if (parseFloat(result) > parseFloat(d.intervalValue)) {
            return { flag: true, arrow: "↑" };
          } else {
            return { flag: false, arrow: "-" };
          }
        } else if (d.type == "LT") {
          if (parseFloat(result) < parseFloat(d.intervalValue)) {
            return { flag: true, arrow: "↓" };
          } else {
            return { flag: false, arrow: "-" };
          }
        } else if (d.type == "GTE") {
          if (parseFloat(result) >= parseFloat(d.intervalValue)) {
            return { flag: true, arrow: "↑" };
          } else {
            return { flag: false, arrow: "-" };
          }
        } else if (d.type == "LTE") {
          if (parseFloat(result) <= parseFloat(d.intervalValue)) {
            return { flag: true, arrow: "↓" };
          } else {
            return { flag: false, arrow: "-" };
          }
        } else if (d.type == "NLIKE") {
          if (d.intervalValue.indexOf(result) == -1) {
            return { flag: true, arrow: "-" };
          } else {
            return { flag: false, arrow: "-" };
          }
        } else if (d.type == "NEQ") {
          if (
            /^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue) &&
            /^\d+$|^[0-9]+\.[0-9]+$/.test(result)
          ) {
            if (parseFloat(result) == parseFloat(d.intervalValue)) {
              return { flag: false, arrow: "-", resp: "正常" };
            } else {
              return { flag: true, arrow: "-", resp: "异常" };
            }
          } else if (
            !/^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue) &&
            !/^\d+$|^[0-9]+\.[0-9]+$/.test(result)
          ) {
            if (result == d.intervalValue) {
              return { flag: false, arrow: "-", resp: "正常" };
            } else {
              return { flag: true, arrow: "-", resp: "异常" };
            }
          } else if (
            (!/^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue) &&
              /^\d+$|^[0-9]+\.[0-9]+$/.test(result)) ||
            (/^\d+$|^[0-9]+\.[0-9]+$/.test(d.intervalValue) &&
              !/^\d+$|^[0-9]+\.[0-9]+$/.test(result))
          ) {
            if (result == d.intervalValue) {
              return { flag: false, arrow: "-", resp: "正常" };
            } else {
              return { flag: true, arrow: "-", resp: "异常" };
            }
          } else {
            return { flag: "-", arrow: "-", resp: "-" };
          }
        }
      } else if (data.length == 2) {
        let gte, lte, gt, lt;
        gte = data.find((i) => i.type == "GTE");
        lte = data.find((i) => i.type == "LTE");
        gt = data.find((i) => i.type == "GT");
        lt = data.find((i) => i.type == "LT");

        let dataNEQ = data.filter((i) => i.type == "NEQ");

        if (dataNEQ && dataNEQ.length > 0) {
          if (dataNEQ.length == 2) {
            let d0 = dataNEQ[0];
            let d1 = dataNEQ[1];
            if (
              /^\d+$|^[0-9]+\.[0-9]+$/.test(d0.intervalValue) &&
              /^\d+$|^[0-9]+\.[0-9]+$/.test(d1.intervalValue) &&
              /^\d+$|^[0-9]+\.[0-9]+$/.test(result)
            ) {
              if (
                parseFloat(result) == parseFloat(d0.intervalValue) ||
                parseFloat(result) == parseFloat(d1.intervalValue)
              ) {
                return { flag: false, arrow: "-", resp: "正常" };
              } else {
                return { flag: true, arrow: "-", resp: "异常" };
              }
            } else if (
              !/^\d+$|^[0-9]+\.[0-9]+$/.test(d0.intervalValue) &&
              !/^\d+$|^[0-9]+\.[0-9]+$/.test(d1.intervalValue) &&
              !/^\d+$|^[0-9]+\.[0-9]+$/.test(result)
            ) {
              if (result == d0.intervalValue || result == d1.intervalValue) {
                return { flag: false, arrow: "-", resp: "正常" };
              } else {
                return { flag: true, arrow: "-", resp: "异常" };
              }
            } else {
              return { flag: "-", arrow: "-", resp: "-" };
            }
          }
        }

        if (gte == undefined) {
          if (lte == undefined) {
            //取lt和gt
            if (gt && lt) {
              //wmg 判断有无值
              gt = gt.intervalValue;
              lt = lt.intervalValue;
              if (
                parseFloat(result) >= parseFloat(lt) &&
                parseFloat(result) <= parseFloat(gt)
              ) {
                return { flag: false, arrow: "-" };
              } else if (parseFloat(result) < parseFloat(lt)) {
                return { flag: true, arrow: "↓" };
              } else if (parseFloat(result) > parseFloat(gt)) {
                return { flag: true, arrow: "↑" };
              } else {
                return { flag: false, arrow: "-" };
              }
            }
          } else {
            //lte和gt
            if (gt && lt) {
              //wmg 判断有无值
              gt = gt.intervalValue;
              lte = lte.intervalValue;
              if (
                parseFloat(result) > parseFloat(lte) &&
                parseFloat(result) <= parseFloat(gt)
              ) {
                return { flag: false, arrow: "-" };
              } else if (parseFloat(result) <= parseFloat(lte)) {
                return { flag: true, arrow: "↓" };
              } else if (parseFloat(result) > parseFloat(gt)) {
                return { flag: true, arrow: "↑" };
              }
            }
          }
        } else {
          if (lte == undefined) {
            //取lt和gt
            gte = gte.intervalValue;
            lt = lt.intervalValue;
            if (
              parseFloat(result) >= parseFloat(lt) &&
              parseFloat(result) < parseFloat(gte)
            ) {
              return { flag: false, arrow: "-" };
            } else if (parseFloat(result) < parseFloat(lt)) {
              return { flag: true, arrow: "↓" };
            } else if (parseFloat(result) >= parseFloat(gte)) {
              return { flag: true, arrow: "↑" };
            }
          } else {
            //lte和gt
            gte = gte.intervalValue;
            lte = lte.intervalValue;
            if (
              parseFloat(result) > parseFloat(lte) &&
              parseFloat(result) < parseFloat(gte)
            ) {
              return { flag: false, arrow: "-" };
            } else if (parseFloat(result) <= parseFloat(lte)) {
              return { flag: true, arrow: "↓" };
            } else if (parseFloat(result) >= parseFloat(gte)) {
              return { flag: true, arrow: "↑" };
            }
          }
        }
      } else {
        let dataNEQ = data.filter((i) => i.type == "NEQ");

        if (dataNEQ && dataNEQ.length > 0) {
          if (dataNEQ.length == 3) {
            let d0 = dataNEQ[0];
            let d1 = dataNEQ[1];
            let d2 = dataNEQ[2];
            if (
              /^\d+$|^[0-9]+\.[0-9]+$/.test(d0.intervalValue) &&
              /^\d+$|^[0-9]+\.[0-9]+$/.test(d1.intervalValue) &&
              /^\d+$|^[0-9]+\.[0-9]+$/.test(d2.intervalValue) &&
              /^\d+$|^[0-9]+\.[0-9]+$/.test(result)
            ) {
              if (
                parseFloat(result) == parseFloat(d0.intervalValue) ||
                parseFloat(result) == parseFloat(d1.intervalValue) ||
                parseFloat(result) == parseFloat(d2.intervalValue)
              ) {
                return { flag: false, arrow: "-", resp: "正常" };
              } else {
                return { flag: true, arrow: "-", resp: "异常" };
              }
            } else if (
              !/^\d+$|^[0-9]+\.[0-9]+$/.test(d0.intervalValue) &&
              !/^\d+$|^[0-9]+\.[0-9]+$/.test(d1.intervalValue) &&
              !/^\d+$|^[0-9]+\.[0-9]+$/.test(d2.intervalValue) &&
              !/^\d+$|^[0-9]+\.[0-9]+$/.test(result)
            ) {
              if (
                result == d0.intervalValue ||
                result == d1.intervalValue ||
                result == d2.intervalValue
              ) {
                return { flag: false, arrow: "-", resp: "正常" };
              } else {
                return { flag: true, arrow: "-", resp: "异常" };
              }
            } else {
              return { flag: "-", arrow: "-", resp: "-" };
            }
          }
        }
      }
    },
    //列
    getColumns() {
      let _this = this;
      return [
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "体检项目",
          align: "left",
          width: 180,
          tooltip: true,
          ellipsis: true,
          key: "name",
        },
        {
          title: "明细结果",
          align: "center",
          minWidth: 150,
          tooltip: true,
          ellipsis: true,
          render: (h, params) => {
            let resultType = params.row.resultType;
            if (resultType == "选择") {
              //下拉选项
              let defaultValue = params.row.defaultValue
                ? params.row.defaultValue.split(";")
                : [];

              //默认取第一个结果
              let result = "";
              if (
                params.row.departItemResults &&
                params.row.departItemResults.result
              ) {
                result = params.row.departItemResults.result.split(";")[0];
                this.$set(
                  this.data[params.index].departItemResults,
                  "result",
                  result
                ); //结果
              }

              if (result && result.trim().length > 0) {
                defaultValue.push(result);
                defaultValue = defaultValue.filter((item, indx, arr) => {
                  return arr.indexOf(item) == indx;
                });
              }
              return h(
                "Select",
                {
                  props: {
                    value: result,
                    transfer: true,
                    filterable: true,
                    allowCreate: true,
                    clearable: true,
                  },
                  on: {
                    "on-change": (e) => {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        e
                      ); //结果
                      if (params.row.criticals.length == 0) {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "crisisDegree",
                          "-"
                        );
                        this.$set(
                          this.data[params.index].departItemResults,
                          "positive",
                          "0"
                        );
                      } else {
                        let ret = this.setResult(params.row.criticals, e);
                        if (ret.flag == "-") {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        } else if (ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "异常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "1"
                          );
                        } else if (!ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "正常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        }
                      }
                    },
                    "on-create": (e) => {
                      defaultValue.push(e);
                      defaultValue = defaultValue.filter((item, indx, arr) => {
                        return arr.indexOf(item) == indx;
                      });
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        e
                      ); //结果
                    },
                  },
                },
                defaultValue.map((item) => {
                  return h("Option", {
                    props: {
                      value: item,
                      label: item,
                    },
                  });
                })
              );
            } else if (resultType == "数值") {
              let result = "";
              if (
                params.row.departItemResults &&
                (params.row.departItemResults.result ||
                  (params.row.departItemResults.result != undefined &&
                    params.row.departItemResults.result != null &&
                    params.row.departItemResults.result == 0))
              ) {
                result = Number(params.row.departItemResults.result);
              } /*else{
                                    this.$set(this.data[params.index].departItemResults, 'result', 0);
                                }*/
              return h("InputNumber", {
                props: {
                  value: result,
                  min: -20,
                  step: 0.01,
                  readonly: params.row.name == "体重指数BMI" ? true : false,
                },
                on: {
                  "on-change": (e) => {
                    let v = e; //录入值
                    if (!v) {
                      // this.$set(this.data[params.index].departItemResults, 'result', 0);
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "arrow",
                        "-"
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "crisisDegree",
                        "-"
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "positive",
                        "0"
                      );
                    } else {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );
                      let projectName = params.row.name;
                      let countBMI = false;
                      if ("身高" == projectName) {
                        this.personHeight = v;
                        countBMI = true;
                      } else if ("体重" == projectName) {
                        this.personWeight = v;
                        countBMI = true;
                      }
                      if (this.personHeight && this.personWeight && countBMI) {
                        let height = this.personHeight / 100;
                        let BMI =
                          parseInt(
                            (this.personWeight / (height * height)) * 10
                          ) / 10;
                        this.$set(
                          this.data[params.index].departItemResults,
                          "result",
                          v
                        ); //结果

                        let temp = this.data.findIndex(
                          (i) =>
                            i.baseProjectId ==
                            "8be4d3713eb711ec96d5b42e99af990f"
                        );
                        if (temp > -1) {
                          this.$set(
                            this.data[temp].departItemResults,
                            "result",
                            BMI
                          ); //结果
                          let ret = this.setResult(
                            this.data[temp].criticals,
                            BMI
                          );
                          if (ret.flag == "-") {
                            this.$set(
                              this.data[temp].departItemResults,
                              "crisisDegree",
                              "-"
                            );
                            this.$set(
                              this.data[temp].departItemResults,
                              "arrow",
                              "-"
                            );
                            this.$set(
                              this.data[temp].departItemResults,
                              "positive",
                              "0"
                            );
                          } else if (ret.flag) {
                            this.$set(
                              this.data[temp].departItemResults,
                              "crisisDegree",
                              ret.resp
                                ? ret.resp
                                : ret.arrow == "-"
                                ? "-"
                                : ret.arrow == "↑"
                                ? "高于正常值"
                                : "低于正常值"
                            );
                            this.$set(
                              this.data[temp].departItemResults,
                              "arrow",
                              ret.arrow
                            );
                            this.$set(
                              this.data[temp].departItemResults,
                              "positive",
                              "1"
                            );
                          } else if (!ret.flag) {
                            this.$set(
                              this.data[temp].departItemResults,
                              "crisisDegree",
                              "正常"
                            );
                            this.$set(
                              this.data[temp].departItemResults,
                              "arrow",
                              ret.arrow
                            );
                            this.$set(
                              this.data[temp].departItemResults,
                              "positive",
                              "0"
                            );
                          }
                        }
                        //修改身高体重值判断
                        let ret = this.setResult(params.row.criticals, v);
                        if (ret.flag == "-") {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        } else if (ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            ret.resp
                              ? ret.resp
                              : ret.arrow == "-"
                              ? "-"
                              : ret.arrow == "↑"
                              ? "高于正常值"
                              : "低于正常值"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "1"
                          );
                        } else if (!ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "正常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        }
                      } else {
                        let ret = this.setResult(params.row.criticals, v);
                        if (ret.flag == "-") {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        } else if (ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            ret.resp
                              ? ret.resp
                              : ret.arrow == "-"
                              ? "-"
                              : ret.arrow == "↑"
                              ? "高于正常值"
                              : "低于正常值"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "1"
                          );

                          if (ret.arrow == "↑") {
                            //结果严重
                            let name = params.row.name;
                            if ("丙氨酸基转移酶(转氨酶)" == name) {
                              //添加两项筛查 戊肝Igm(转氨酶异常的增查) 甲肝Igm(转氨酶异常的增查)
                              this.addBaseProject(
                                params.row.torderGroupItemId,
                                params.row.groupOrderId
                              );
                            }
                          }
                          if (ret.arrow == "↓") {
                            //结果严重
                            let name = params.row.name;
                            if ("丙氨酸基转移酶(转氨酶)" == name) {
                              //添加两项筛查 戊肝Igm(转氨酶异常的增查) 甲肝Igm(转氨酶异常的增查)
                              this.addBaseProject(
                                params.row.torderGroupItemId,
                                params.row.groupOrderId
                              );
                            }
                          }
                        } else if (!ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "正常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        }
                      }
                    }
                  },
                },
              });
            } else {
              let result =
                params.row.departItemResults &&
                params.row.departItemResults.result
                  ? params.row.departItemResults.result
                  : "";
              /*if(params.row.name && params.row.name.indexOf("外耳道") > -1 || params.row.name.indexOf("中耳") > -1){
                                    if(_this.personInfo && _this.personInfo.hazard_factors_text && _this.personInfo.hazard_factors_text.indexOf("职业机动车驾驶作业") > -1){
                                        result = "6/6";
                                    }else{
                                        result = "正常";
                                    }
                                }*/
              return h("Input", {
                props: {
                  value: result,
                  readonly: params.row.name == "体重指数BMI" ? true : false,
                },
                on: {
                  "on-change": (e) => {
                    let v = e.target.value; //录入值
                    if (!v) {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "arrow",
                        "-"
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "crisisDegree",
                        "-"
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "positive",
                        "0"
                      );
                    } else {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );
                      let projectName = params.row.name;
                      if ("身高" == projectName) {
                        this.personHeight = v;
                      } else if ("体重" == projectName) {
                        this.personWeight = v;
                      }
                      if (this.personHeight && this.personWeight) {
                        let height = this.personHeight / 100;
                        let BMI =
                          parseInt(
                            (this.personWeight / (height * height)) * 10
                          ) / 10;
                        this.$set(
                          this.data[params.index].departItemResults,
                          "result",
                          v
                        ); //结果

                        let temp = this.data.findIndex(
                          (i) =>
                            i.baseProjectId ==
                            "8be4d3713eb711ec96d5b42e99af990f"
                        );
                        if (temp > -1) {
                          this.$set(
                            this.data[temp].departItemResults,
                            "result",
                            BMI
                          ); //结果
                        }
                      } else {
                        let ret = this.setResult(params.row.criticals, v);
                        if (ret.flag == "-") {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        } else if (ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            ret.resp
                              ? ret.resp
                              : ret.arrow == "-"
                              ? "-"
                              : ret.arrow == "↑"
                              ? "高于正常值"
                              : "低于正常值"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "1"
                          );

                          if (ret.arrow == "↑") {
                            //结果严重
                            let name = params.row.name;
                            if ("丙氨酸基转移酶(转氨酶)" == name) {
                              //添加两项筛查 戊肝Igm(转氨酶异常的增查) 甲肝Igm(转氨酶异常的增查)
                              this.addBaseProject(
                                params.row.torderGroupItemId,
                                params.row.groupOrderId
                              );
                            }
                          }
                          if (ret.arrow == "↓") {
                            //结果严重
                            let name = params.row.name;
                            if ("丙氨酸基转移酶(转氨酶)" == name) {
                              //添加两项筛查 戊肝Igm(转氨酶异常的增查) 甲肝Igm(转氨酶异常的增查)
                              this.addBaseProject(
                                params.row.torderGroupItemId,
                                params.row.groupOrderId
                              );
                            }
                          }
                        } else if (!ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "正常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        }
                      }
                    }
                  },
                },
              });
            }
          },
        },
        {
          title: "单位",
          align: "center",
          tooltip: true,
          ellipsis: true,
          minWidth: 100,
          render: (h, params) => {
            let unit =
              params.row.departItemResults &&
              params.row.departItemResults.unitName
                ? params.row.departItemResults.unitName
                : "";
            if (unit) {
              return h("span", unit);
            } else {
              let u = params.row.unitName || "-";
              let code = params.row.unitCode || "-";
              if (_this.data[params.index].departItemResults) {
                _this.$set(
                  _this.data[params.index].departItemResults,
                  "unitName",
                  u
                );
                _this.$set(
                  _this.data[params.index].departItemResults,
                  "unitCode",
                  code
                );
              }
              return h("span", u);
            }
          },
        },
        {
          title: "参考值",
          align: "center",
          tooltip: true,
          minWidth: 120,
          ellipsis: true,
          render: (h, params) => {
            let scope =
              params.row.departItemResults && params.row.departItemResults.scope
                ? params.row.departItemResults.scope
                : "";
            if (scope && scope != "-") {
              return h("div", scope);
            } else {
              let val = "";
              //规则参考值
              let reference = params.row.relationProjectReference;
              if (!reference) {
                if (_this.data[params.index].departItemResults) {
                  this.$set(
                    this.data[params.index].departItemResults,
                    "scope",
                    "-"
                  );
                }
                return h("div", "-");
              }
              val = reference.occupationValue;
              if (!val) {
                val = "-";
              }
              if (_this.data[params.index].departItemResults) {
                this.$set(
                  this.data[params.index].departItemResults,
                  "scope",
                  val
                );
              }
              return h("div", val);
            }
          },
        },
        {
          title: "提示",
          align: "center",
          tooltip: true,
          ellipsis: true,
          minWidth: 100,
          key: "arrow",
          render: (h, params) => {
            let arrow =
              params.row.departItemResults && params.row.departItemResults.arrow
                ? params.row.departItemResults.arrow
                : "";
            if (arrow == undefined || arrow == null) {
              arrow = "-";
              if (_this.data[params.index].departItemResults) {
                this.$set(
                  this.data[params.index].departItemResults,
                  "arrow",
                  arrow
                );
              }
            }
            return h("span", arrow);
          },
        } /*, {
            title: '危急程度',
            align: 'center',
            minWidth: 100,
            tooltip: true,
            ellipsis: true,
            key: "crisisDegree",
            render: (h, params) => {
              let crisis = params.row.departItemResults && params.row.departItemResults.crisisDegree ? params.row.departItemResults.crisisDegree : '';
              let positive = "0";
              if (crisis && (crisis.indexOf("异常")>-1 || crisis.indexOf("低于")>-1 || crisis.indexOf("高于")>-1)) {
                positive = "1";
                if(_this.data[params.index].departItemResults) {
                  this.$set(this.data[params.index].departItemResults, 'positive', positive);
                }
              } else {
                if(_this.data[params.index].departItemResults) {
                  this.$set(this.data[params.index].departItemResults, 'positive', positive);
                }
              }
              if (crisis) {
                return h("span", crisis);
              } else {
                if(_this.data[params.index].departItemResults) {
                  this.$set(this.data[params.index].departItemResults, 'crisisDegree', "-");
                }
                return h("span", "-");
              }
            }
          }*/,
        {
          title: "" + this.updateTableAbnormalFieldName,
          align: "center",
          minWidth: 50,
          tooltip: true,
          ellipsis: true,
          key: "positive",
          render: (h, params) => {
            let crisis =
              params.row.departItemResults &&
              params.row.departItemResults.crisisDegree
                ? params.row.departItemResults.crisisDegree
                : "";
            /*let positive = "0";
              if (crisis && (crisis.indexOf("异常")>-1 || crisis.indexOf("低于")>-1 || crisis.indexOf("高于")>-1)) {
                positive = "1";
                if(_this.data[params.index].departItemResults) {
                  this.$set(this.data[params.index].departItemResults, 'positive', positive);
                }
              } else {
                if(_this.data[params.index].departItemResults) {
                  this.$set(this.data[params.index].departItemResults, 'positive', positive);
                }
              }*/
            let positive =
              params.row.departItemResults &&
              params.row.departItemResults.positive
                ? params.row.departItemResults.positive
                : "0";
            return h("span", [
              h("Checkbox", {
                attrs: {
                  value: positive == "1" ? true : false,
                },
                on: {
                  "on-change": (event) => {
                    if (event) {
                      if (_this.data[params.index].departItemResults) {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "positive",
                          "1"
                        );
                        /*if(params.row.departItemResults && params.row.departItemResults.positive && params.row.departItemResults.positive.toString().trim()=='1'){
                            if(!params.row.departItemResults.crisisDegree || params.row.departItemResults.crisisDegree == "正常" || params.row.departItemResults.crisisDegree=="-"){
                              this.$set(this.data[params.index].departItemResults, 'crisisDegree', "异常");
                            }
                          }*/
                      }
                    } else {
                      if (_this.data[params.index].departItemResults) {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "positive",
                          "0"
                        );
                        /*this.$set(this.data[params.index].departItemResults, 'crisisDegree', "正常");
                          this.$set(this.data[params.index].departItemResults, 'arrow', "-");*/
                      }
                    }
                  },
                },
              }),
              [h("span", "是")],
            ]);
          },
        },
      ];
    },
    //列(影像项目)
    getColumnsYX() {
      let _this = this;
      return [
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "体检项目",
          align: "left",
          width: 180,
          tooltip: true,
          ellipsis: true,
          key: "name",
        },
        {
          title: "诊断意见",
          align: "center",
          minWidth: 150,
          tooltip: true,
          ellipsis: true,
          render: (h, params) => {
            let resultType = params.row.resultType;
            if (resultType == "选择") {
              //下拉选项
              let defaultValue = params.row.defaultValue
                ? params.row.defaultValue.split(";")
                : [];

              //默认取第一个结果
              let result = "";
              if (params.row.departItemResults.result) {
                result = params.row.departItemResults.result.split(";")[0];
                this.$set(
                  this.data[params.index].departItemResults,
                  "result",
                  result
                ); //结果
              }

              if (result && result.trim().length > 0) {
                defaultValue.push(result);
                defaultValue = defaultValue.filter((item, indx, arr) => {
                  return arr.indexOf(item) == indx;
                });
              }
              return h(
                "Select",
                {
                  props: {
                    value: result,
                    transfer: true,
                    filterable: true,
                    allowCreate: true,
                    clearable: true,
                  },
                  on: {
                    "on-change": (e) => {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        e
                      ); //结果
                      if (params.row.criticals.length == 0) {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "crisisDegree",
                          "-"
                        );
                      } else {
                        let ret = this.setResult(params.row.criticals, e);
                        if (ret.flag == "-") {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            "-"
                          );
                        } else if (ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "异常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                        } else if (!ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "正常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                        }
                      }
                    },
                    "on-create": (e) => {
                      defaultValue.push(e);
                      defaultValue = defaultValue.filter((item, indx, arr) => {
                        return arr.indexOf(item) == indx;
                      });
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        e
                      ); //结果
                    },
                  },
                },
                defaultValue.map((item) => {
                  return h("Option", {
                    props: {
                      value: item,
                      label: item,
                    },
                  });
                })
              );
            } else if (resultType == "数值") {
              let result = "";
              if (
                params.row.departItemResults.result ||
                (params.row.departItemResults.result != undefined &&
                  params.row.departItemResults.result != null &&
                  params.row.departItemResults.result == 0)
              ) {
                result = Number(params.row.departItemResults.result);
              }
              return h("InputNumber", {
                props: {
                  value: result,
                  min: -20,
                  step: 0.01,
                  readonly: false,
                },
                on: {
                  "on-change": (e) => {
                    let v = e; //录入值
                    if (!v) {
                      // this.$set(this.data[params.index].departItemResults, 'result', 0);
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "arrow",
                        "-"
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "crisisDegree",
                        "-"
                      );
                    } else {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );
                      let ret = this.setResult(params.row.criticals, v);
                      if (ret.flag == "-") {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "crisisDegree",
                          "-"
                        );
                        this.$set(
                          this.data[params.index].departItemResults,
                          "arrow",
                          "-"
                        );
                      } else if (ret.flag) {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "crisisDegree",
                          ret.resp
                            ? ret.resp
                            : ret.arrow == "-"
                            ? "-"
                            : ret.arrow == "↑"
                            ? "高于正常值"
                            : "低于正常值"
                        );
                        this.$set(
                          this.data[params.index].departItemResults,
                          "arrow",
                          ret.arrow
                        );
                      } else if (!ret.flag) {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "crisisDegree",
                          "正常"
                        );
                        this.$set(
                          this.data[params.index].departItemResults,
                          "arrow",
                          ret.arrow
                        );
                      }
                    }
                  },
                },
              });
            } else {
              let result = params.row.departItemResults.result;
              return h("Input", {
                props: {
                  value: result,
                  readonly: false,
                },
                on: {
                  "on-change": (e) => {
                    let v = e.target.value; //录入值
                    if (!v) {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "arrow",
                        "-"
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "crisisDegree",
                        "-"
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );
                    } else {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );

                      let tab = this.tabsArr.find(
                        (i) => i.id == this.tabsValue
                      );
                    /*  if (tab!=null && tab.name.indexOf("心电图")>-1){
                        this.$set(tab.departResult, "diagnoseTip", v);
                      };*/

                      let ret = this.setResult(params.row.criticals, v);
                      if (ret.flag == "-") {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "crisisDegree",
                          "-"
                        );
                        this.$set(
                          this.data[params.index].departItemResults,
                          "arrow",
                          "-"
                        );
                      } else if (ret.flag) {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "crisisDegree",
                          ret.resp
                            ? ret.resp
                            : ret.arrow == "-"
                            ? "-"
                            : ret.arrow == "↑"
                            ? "高于正常值"
                            : "低于正常值"
                        );
                        this.$set(
                          this.data[params.index].departItemResults,
                          "arrow",
                          ret.arrow
                        );
                      } else if (!ret.flag) {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "crisisDegree",
                          "正常"
                        );
                        this.$set(
                          this.data[params.index].departItemResults,
                          "arrow",
                          ret.arrow
                        );
                      }
                    }
                  },
                },
              });
            }
          },
        },
        {
          title: "参考值",
          align: "center",
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
                this.$set(
                  this.data[params.index].departItemResults,
                  "scope",
                  "-"
                );
                return h("div", "-");
              }
              val = reference.occupationValue;
              if (!val) {
                val = "-";
              }
              this.$set(
                this.data[params.index].departItemResults,
                "scope",
                val
              );
              return h("div", val);
            }
          },
        },
        {
          title: "提示",
          align: "center",
          tooltip: true,
          ellipsis: true,
          minWidth: 100,
          key: "arrow",
          render: (h, params) => {
            let arrow = params.row.departItemResults.arrow;
            if (arrow == undefined || arrow == null) {
              arrow = "-";
              this.$set(
                this.data[params.index].departItemResults,
                "arrow",
                arrow
              );
            }
            return h("span", arrow);
          },
        } /*, {
            title: '危急程度',
            align: 'center',
            minWidth: 100,
            tooltip: true,
            ellipsis: true,
            key: "crisisDegree",
            render: (h, params) => {
              let crisis = params.row.departItemResults && params.row.departItemResults.crisisDegree ? params.row.departItemResults.crisisDegree : '';
              let positive = "0";
              if (crisis && (crisis.indexOf("异常")>-1 || crisis.indexOf("低于")>-1 || crisis.indexOf("高于")>-1)) {
                positive = "1";
                this.$set(this.data[params.index].departItemResults, 'positive', positive);
              } else {
                this.$set(this.data[params.index].departItemResults, 'positive', positive);
              }
              if (crisis) {
                return h("span", crisis);
              } else {
                this.$set(this.data[params.index].departItemResults, 'crisisDegree', "-");
                return h("span", "-");
              }
            }
          }*/,
        {
          title: "" + this.updateTableAbnormalFieldName,
          align: "center",
          minWidth: 50,
          tooltip: true,
          ellipsis: true,
          key: "positive",
          render: (h, params) => {
            let crisis =
              params.row.departItemResults &&
              params.row.departItemResults.crisisDegree
                ? params.row.departItemResults.crisisDegree
                : "";
            /*let positive = "0";
              if (crisis && (crisis.indexOf("异常")>-1 || crisis.indexOf("低于")>-1 || crisis.indexOf("高于")>-1)) {
                positive = "1";
                this.$set(this.data[params.index].departItemResults, 'positive', positive);
              } else {
                this.$set(this.data[params.index].departItemResults, 'positive', positive);
              }*/
            let positive =
              params.row.departItemResults &&
              params.row.departItemResults.positive
                ? params.row.departItemResults.positive
                : "0";
            return h("span", [
              h("Checkbox", {
                attrs: {
                  value: positive == "1" ? true : false,
                },
                on: {
                  "on-change": (event) => {
                    if (event) {
                      _this.$set(
                        _this.data[params.index].departItemResults,
                        "positive",
                        "1"
                      );
                    } else {
                      _this.$set(
                        _this.data[params.index].departItemResults,
                        "positive",
                        "0"
                      );
                    }
                  },
                },
              }),
              [h("span", "是")],
            ]);
          },
        },
      ];
    },
    //列(肺功能)
    getColumnsFGN() {
      let _this = this;
      return [
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "体检项目",
          align: "left",
          width: 180,
          tooltip: true,
          ellipsis: true,
          key: "name",
        },
        {
          title: "明细结果",
          align: "center",
          minWidth: 150,
          tooltip: true,
          ellipsis: true,
          render: (h, params) => {
            let resultType = params.row.resultType;
            if (resultType == "选择") {
              //下拉选项
              let defaultValue = params.row.defaultValue
                ? params.row.defaultValue.split(";")
                : [];

              //默认取第一个结果
              let result = "";
              if (params.row.departItemResults.result) {
                result = params.row.departItemResults.result.split(";")[0];
                this.$set(
                  this.data[params.index].departItemResults,
                  "result",
                  result
                ); //结果
              }

              if (result && result.trim().length > 0) {
                defaultValue.push(result);
                defaultValue = defaultValue.filter((item, indx, arr) => {
                  return arr.indexOf(item) == indx;
                });
              }
              return h(
                "Select",
                {
                  props: {
                    value: result,
                    transfer: true,
                    filterable: true,
                    allowCreate: true,
                    clearable: true,
                  },
                  on: {
                    "on-change": (e) => {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        e
                      ); //结果
                      if (params.row.criticals.length == 0) {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "crisisDegree",
                          "-"
                        );
                        this.$set(
                          this.data[params.index].departItemResults,
                          "positive",
                          "0"
                        );
                      } else {
                        let ret = this.setResult(params.row.criticals, e);
                        if (ret.flag == "-") {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        } else if (ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "异常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "1"
                          );
                        } else if (!ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "正常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        }
                      }
                    },
                    "on-create": (e) => {
                      defaultValue.push(e);
                      defaultValue = defaultValue.filter((item, indx, arr) => {
                        return arr.indexOf(item) == indx;
                      });
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        e
                      ); //结果
                    },
                  },
                },
                defaultValue.map((item) => {
                  return h("Option", {
                    props: {
                      value: item,
                      label: item,
                    },
                  });
                })
              );
            } else if (resultType == "数值") {
              let result = "";
              if (
                params.row.departItemResults.result ||
                (params.row.departItemResults.result != undefined &&
                  params.row.departItemResults.result != null &&
                  params.row.departItemResults.result == 0)
              ) {
                result = Number(params.row.departItemResults.result);
              } /*else{
                                    this.$set(this.data[params.index].departItemResults, 'result', 0);
                                }*/
              return h("InputNumber", {
                props: {
                  value: result,
                  min: 0,
                  step: 0.01,
                  readonly: params.row.name == "体重指数BMI" ? true : false,
                },
                on: {
                  "on-change": (e) => {
                    let v = e; //录入值
                    if (!v) {
                      // this.$set(this.data[params.index].departItemResults, 'result', 0);
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "arrow",
                        "-"
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "crisisDegree",
                        "-"
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "positive",
                        "0"
                      );
                    } else {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );
                      let projectName = params.row.name;
                      let countBMI = false;
                      if ("身高" == projectName) {
                        this.personHeight = v;
                        countBMI = true;
                      } else if ("体重" == projectName) {
                        this.personWeight = v;
                        countBMI = true;
                      }
                      if (this.personHeight && this.personWeight && countBMI) {
                        let height = this.personHeight / 100;
                        let BMI =
                          parseInt(
                            (this.personWeight / (height * height)) * 10
                          ) / 10;
                        this.$set(
                          this.data[params.index].departItemResults,
                          "result",
                          v
                        ); //结果

                        let temp = this.data.findIndex(
                          (i) =>
                            i.baseProjectId ==
                            "8be4d3713eb711ec96d5b42e99af990f"
                        );
                        if (temp > -1) {
                          this.$set(
                            this.data[temp].departItemResults,
                            "result",
                            BMI
                          ); //结果
                          let ret = this.setResult(
                            this.data[temp].criticals,
                            BMI
                          );
                          if (ret.flag == "-") {
                            this.$set(
                              this.data[temp].departItemResults,
                              "crisisDegree",
                              "-"
                            );
                            this.$set(
                              this.data[temp].departItemResults,
                              "arrow",
                              "-"
                            );
                            this.$set(
                              this.data[params.index].departItemResults,
                              "positive",
                              "0"
                            );
                          } else if (ret.flag) {
                            this.$set(
                              this.data[temp].departItemResults,
                              "crisisDegree",
                              ret.resp
                                ? ret.resp
                                : ret.arrow == "-"
                                ? "-"
                                : ret.arrow == "↑"
                                ? "高于正常值"
                                : "低于正常值"
                            );
                            this.$set(
                              this.data[temp].departItemResults,
                              "arrow",
                              ret.arrow
                            );
                            this.$set(
                              this.data[params.index].departItemResults,
                              "positive",
                              "1"
                            );
                          } else if (!ret.flag) {
                            this.$set(
                              this.data[temp].departItemResults,
                              "crisisDegree",
                              "正常"
                            );
                            this.$set(
                              this.data[temp].departItemResults,
                              "arrow",
                              ret.arrow
                            );
                            this.$set(
                              this.data[params.index].departItemResults,
                              "positive",
                              "0"
                            );
                          }
                        }
                        //修改身高体重值判断
                        let ret = this.setResult(params.row.criticals, v);
                        if (ret.flag == "-") {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        } else if (ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            ret.resp
                              ? ret.resp
                              : ret.arrow == "-"
                              ? "-"
                              : ret.arrow == "↑"
                              ? "高于正常值"
                              : "低于正常值"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "1"
                          );
                        } else if (!ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "正常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        }
                      } else {
                        let ret = this.setResult(params.row.criticals, v);
                        if (ret.flag == "-") {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        } else if (ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            ret.resp
                              ? ret.resp
                              : ret.arrow == "-"
                              ? "-"
                              : ret.arrow == "↑"
                              ? "高于正常值"
                              : "低于正常值"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "1"
                          );

                          if (ret.arrow == "↑") {
                            //结果严重
                            let name = params.row.name;
                            if ("丙氨酸基转移酶(转氨酶)" == name) {
                              //添加两项筛查 戊肝Igm(转氨酶异常的增查) 甲肝Igm(转氨酶异常的增查)
                              this.addBaseProject(
                                params.row.torderGroupItemId,
                                params.row.groupOrderId
                              );
                            }
                          }
                          if (ret.arrow == "↓") {
                            //结果严重
                            let name = params.row.name;
                            if ("丙氨酸基转移酶(转氨酶)" == name) {
                              //添加两项筛查 戊肝Igm(转氨酶异常的增查) 甲肝Igm(转氨酶异常的增查)
                              this.addBaseProject(
                                params.row.torderGroupItemId,
                                params.row.groupOrderId
                              );
                            }
                          }
                        } else if (!ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "正常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        }
                      }
                    }
                  },
                },
              });
            } else {
              let result = params.row.departItemResults.result;
              /*if(params.row.name && params.row.name.indexOf("外耳道") > -1 || params.row.name.indexOf("中耳") > -1){
                                    if(_this.personInfo && _this.personInfo.hazard_factors_text && _this.personInfo.hazard_factors_text.indexOf("职业机动车驾驶作业") > -1){
                                        result = "6/6";
                                    }else{
                                        result = "正常";
                                    }
                                }*/
              return h("Input", {
                props: {
                  value: result,
                  readonly: params.row.name == "体重指数BMI" ? true : false,
                },
                on: {
                  "on-change": (e) => {
                    let v = e.target.value; //录入值
                    if (!v) {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "arrow",
                        "-"
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "crisisDegree",
                        "-"
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );
                      this.$set(
                        this.data[params.index].departItemResults,
                        "positive",
                        "0"
                      );
                    } else {
                      this.$set(
                        this.data[params.index].departItemResults,
                        "result",
                        v
                      );
                      let projectName = params.row.name;
                      if ("身高" == projectName) {
                        this.personHeight = v;
                      } else if ("体重" == projectName) {
                        this.personWeight = v;
                      }
                      if (this.personHeight && this.personWeight) {
                        let height = this.personHeight / 100;
                        let BMI =
                          parseInt(
                            (this.personWeight / (height * height)) * 10
                          ) / 10;
                        this.$set(
                          this.data[params.index].departItemResults,
                          "result",
                          v
                        ); //结果

                        let temp = this.data.findIndex(
                          (i) =>
                            i.baseProjectId ==
                            "8be4d3713eb711ec96d5b42e99af990f"
                        );
                        if (temp > -1) {
                          this.$set(
                            this.data[temp].departItemResults,
                            "result",
                            BMI
                          ); //结果
                        }
                      } else {
                        let ret = this.setResult(params.row.criticals, v);
                        if (ret.flag == "-") {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            "-"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        } else if (ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            ret.resp
                              ? ret.resp
                              : ret.arrow == "-"
                              ? "-"
                              : ret.arrow == "↑"
                              ? "高于正常值"
                              : "低于正常值"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "1"
                          );

                          if (ret.arrow == "↑") {
                            //结果严重
                            let name = params.row.name;
                            if ("丙氨酸基转移酶(转氨酶)" == name) {
                              //添加两项筛查 戊肝Igm(转氨酶异常的增查) 甲肝Igm(转氨酶异常的增查)
                              this.addBaseProject(
                                params.row.torderGroupItemId,
                                params.row.groupOrderId
                              );
                            }
                          }
                          if (ret.arrow == "↓") {
                            //结果严重
                            let name = params.row.name;
                            if ("丙氨酸基转移酶(转氨酶)" == name) {
                              //添加两项筛查 戊肝Igm(转氨酶异常的增查) 甲肝Igm(转氨酶异常的增查)
                              this.addBaseProject(
                                params.row.torderGroupItemId,
                                params.row.groupOrderId
                              );
                            }
                          }
                        } else if (!ret.flag) {
                          this.$set(
                            this.data[params.index].departItemResults,
                            "crisisDegree",
                            "正常"
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "arrow",
                            ret.arrow
                          );
                          this.$set(
                            this.data[params.index].departItemResults,
                            "positive",
                            "0"
                          );
                        }
                      }
                    }
                  },
                },
              });
            }
          },
        },
        {
          title: "预计值",
          align: "center",
          tooltip: true,
          minWidth: 120,
          ellipsis: true,
          render: (h, params) => {
            /*参考值*/
            //规则参考值
            let reference = params.row.relationProjectReference;
            if (!reference) {
              this.$set(
                this.data[params.index].departItemResults,
                "scope",
                "-"
              );
            } else {
              let valc = reference.occupationValue;
              if (valc == undefined || valc == null || !valc) {
                valc = "-";
              }
              this.$set(
                this.data[params.index].departItemResults,
                "scope",
                valc
              );
            }

            /*预计值*/
            let val = params.row.departItemResults.updateId;
            if (val == undefined || val == null) {
              val = "0";
              this.$set(
                this.data[params.index].departItemResults,
                "updateId",
                val
              );
            }
            return h("InputNumber", {
              props: {
                value: val,
                min: 0,
                step: 0.01,
                readonly: false,
              },
              on: {
                "on-change": (e) => {
                  let v = e; //录入值
                  if (!v) {
                    this.$set(
                      this.data[params.index].departItemResults,
                      "updateId",
                      "0"
                    );
                  } else {
                    this.$set(
                      this.data[params.index].departItemResults,
                      "updateId",
                      v
                    );
                  }
                },
              },
            });
          },
        },
        {
          title: "单位",
          align: "center",
          tooltip: true,
          ellipsis: true,
          minWidth: 100,
          render: (h, params) => {
            let unit = params.row.departItemResults.unitName;
            if (unit) {
              return h("span", unit);
            } else {
              let u = params.row.unitName || "-";
              let code = params.row.unitCode || "-";
              this.$set(
                this.data[params.index].departItemResults,
                "unitName",
                u
              );
              this.$set(
                this.data[params.index].departItemResults,
                "unitCode",
                code
              );
              return h("span", u);
            }
          },
        },
        {
          title: "参考值",
          align: "center",
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
                this.$set(
                  this.data[params.index].departItemResults,
                  "scope",
                  "-"
                );
                return h("div", "-");
              }
              val = reference.occupationValue;
              if (!val) {
                val = "-";
              }
              this.$set(
                this.data[params.index].departItemResults,
                "scope",
                val
              );
              return h("div", val);
            }
          },
        },
        {
          title: "提示",
          align: "center",
          tooltip: true,
          ellipsis: true,
          minWidth: 100,
          key: "arrow",
          render: (h, params) => {
            let arrow = params.row.departItemResults.arrow;
            if (arrow == undefined || arrow == null) {
              arrow = "-";
              this.$set(
                this.data[params.index].departItemResults,
                "arrow",
                arrow
              );
            }
            return h("span", arrow);
          },
        },
        {
          title: "百分比",
          align: "center",
          tooltip: true,
          ellipsis: true,
          minWidth: 100,
          key: "percentage",
          render: (h, params) => {
            let percentage = params.row.departItemResults.percentage;
            if (!percentage || percentage == 0) {
              /*结果数值*/
              let result =
                params.row.departItemResults &&
                params.row.departItemResults.result
                  ? Number(params.row.departItemResults.result)
                  : 0;
              /*预计值*/
              let valYjz =
                params.row.departItemResults &&
                params.row.departItemResults.updateId
                  ? Number(params.row.departItemResults.updateId)
                  : 0;
              if (result == 0 || valYjz == 0) {
                percentage = "-";
              } else {
                percentage = ((result / valYjz) * 100).toFixed(2);
              }
            }
            if (percentage == undefined || percentage == null) {
              percentage = "-";
              this.$set(
                this.data[params.index].departItemResults,
                "percentage",
                percentage
              );
            }
            return h("span", percentage);
          },
        } /*, {
            title: '危急程度',
            align: 'center',
            minWidth: 100,
            tooltip: true,
            ellipsis: true,
            key: "crisisDegree",
            render: (h, params) => {
              let crisis = params.row.departItemResults && params.row.departItemResults.crisisDegree ? params.row.departItemResults.crisisDegree : '';
              let positive = "0";
              if (crisis && (crisis.indexOf("异常")>-1 || crisis.indexOf("低于")>-1 || crisis.indexOf("高于")>-1)) {
                positive = "1";
                this.$set(this.data[params.index].departItemResults, 'positive', positive);
              } else {
                this.$set(this.data[params.index].departItemResults, 'positive', positive);
              }
              if (crisis) {
                return h("span", crisis);
              } else {
                this.$set(this.data[params.index].departItemResults, 'crisisDegree', "-");
                return h("span", "-");
              }
            }
          }*/,
        {
          title: "" + this.updateTableAbnormalFieldName,
          align: "center",
          minWidth: 50,
          tooltip: true,
          ellipsis: true,
          key: "positive",
          render: (h, params) => {
            let crisis =
              params.row.departItemResults &&
              params.row.departItemResults.crisisDegree
                ? params.row.departItemResults.crisisDegree
                : "";
            /*let positive = "0";
              if (crisis && (crisis.indexOf("异常")>-1 || crisis.indexOf("低于")>-1 || crisis.indexOf("高于")>-1)) {
                positive = "1";
                this.$set(this.data[params.index].departItemResults, 'positive', positive);
              } else {
                this.$set(this.data[params.index].departItemResults, 'positive', positive);
              }*/
            let positive =
              params.row.departItemResults &&
              params.row.departItemResults.positive
                ? params.row.departItemResults.positive
                : "0";
            if (true) {
              //勾选框
              return h("span", [
                h("Checkbox", {
                  attrs: {
                    value: positive == "1" ? true : false,
                  },
                  on: {
                    "on-change": (event) => {
                      if (event) {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "positive",
                          "1"
                        );
                      } else {
                        this.$set(
                          this.data[params.index].departItemResults,
                          "positive",
                          "0"
                        );
                      }
                    },
                  },
                }),
                [h("span", "是")],
              ]);
            }
          },
        },
      ];
    },
    //肺功能socket连接
    initWebSocket() {
      getWebSocket({ personId: this.personInfo.id }).then((res) => {
        if (res.success) {
        }
      });
    },
    //返回耳朵值
    calAge(scope) {
      let age = this.personInfo.age;
      if (tc && this.personInfo && this.personInfo.sex) {
        if (
          this.personInfo.sex.trim() != "男" &&
          this.personInfo.sex.trim() != "女"
        ) {
          return 0;
        }
        //当前危害因素
        let hazardFactorsText = "";
        if (this.personInfo.hazard_factors_text) {
          hazardFactorsText = this.personInfo.hazard_factors_text;
        }
        //不修正的危害因素
        let hazardFactorsTextNotUpdate = [];
        if (
          this.$hospitalName.hazardFactorsTextNotUpdate &&
          this.$hospitalName.hazardFactorsTextNotUpdate.length > 0
        ) {
          hazardFactorsTextNotUpdate =
            this.$hospitalName.hazardFactorsTextNotUpdate;
        }
        //需要修正的危害因素航空作业
        let hazardFactorsTextNeed = [];
        if (
          this.$hospitalName.hazardFactorsTextNeed &&
          this.$hospitalName.hazardFactorsTextNeed.length > 0
        ) {
          hazardFactorsTextNeed = this.$hospitalName.hazardFactorsTextNeed;
        }
        if (
          hazardFactorsText &&
          (hazardFactorsText.indexOf("|") > -1 ||
            hazardFactorsText.indexOf("、") > -1)
        ) {
          //当前拆分后的危害因素 集合
          let hazardFactorsTextNow = [];
          if (hazardFactorsText.indexOf("|") > -1) {
            hazardFactorsTextNow = hazardFactorsText.split("|");
          } else {
            hazardFactorsTextNow = hazardFactorsText.split("、");
          }
          //不修正危害因素 数目
          let hazardFactorsTextNot = hazardFactorsTextNow.filter(
            (item) =>
              hazardFactorsTextNotUpdate.indexOf(item.replaceAll(" ", "")) >
                -1 || item.indexOf("粉尘") > -1
          );
          //修正的危害因素 数目
          let hazardFactorsTextNeedNow = hazardFactorsTextNow.filter(
            (item) =>
              hazardFactorsTextNeed.indexOf(item.replaceAll(" ", "")) > -1
          );
          //不修正危害因素数目与总数相同，即当前都为不修正危害因素时，不修正
          if (hazardFactorsTextNot.length == hazardFactorsTextNow.length) {
            return 0;
          } else if (
            hazardFactorsTextNot.length > 0 &&
            hazardFactorsTextNeedNow.length == 0
          ) {
            //不包含需要修正得危害因素时，不修正
            return 0;
          }
        } else {
          //当前危害因素包含在不修正危害因素之中时，不修正
          if (
            hazardFactorsTextNotUpdate.indexOf(
              hazardFactorsText.replaceAll(" ", "")
            ) > -1 ||
            hazardFactorsText.indexOf("粉尘") > -1
          ) {
            return 0;
          }
        }
        let arr = this.personInfo.sex.trim() == "男" ? tc.Male : tc.Female;

        let ageArr = arr[0][scope + ""];
        let v = "";
        for (let i = 0; i < ageArr.length; i++) {
          let a = ageArr[i];
          if (a.start <= age && a.end >= age) {
            v = a.value;
            break;
          }
        }
        return v;
      }
      return 0;
    },
    tcData(item) {
      let realationCode = item.relationCode;
      if (realationCode.indexOf("l") == 0) {
        return this.calAge(realationCode.substr(1, realationCode.length - 1));
      } else if (realationCode.indexOf("r") == 0) {
        return this.calAge(realationCode.substr(1, realationCode.length - 1));
      } else if (realationCode.indexOf("gl") == 0) {
        // return this.calAge(realationCode.substr(2, realationCode.length - 1));
        return 0;
      } else if (realationCode.indexOf("gr") == 0) {
        // return this.calAge(realationCode.substr(2, realationCode.length - 1));
        return 0;
      }
    },
    //上传图片
    uploadImageClick(officeId) {
      this.officeId = officeId;
      this.isShowUploadImage = true;
    },
    //上传回调
    handleUploadImage(url) {
      if (this.officeId == "194") {
        let pacsData = [];
        pacsData.push(url);
        this.pacsData = pacsData;
      } else if (
        this.officeId == "173" ||
        this.officeId == "207" ||
        this.officeId == "204"
      ) {
        this.pacsData.push(url);
      }
      this.isShowUploadImage = false;
    },
    //从xml中获取节点内容
    getXmlNode(str) {
      //创建文档对象
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(str, "text/xml");

      //提取数据
      var countrys = xmlDoc.getElementsByTagName("Tone");
      var arr = [{ site: "null" }];
      let left = { site: "left", type: "value", value: [] };
      let right = { site: "right", type: "value", value: [] };
      let gleft = { site: "left", type: "gvalue", value: [] };
      let gright = { site: "right", type: "gvalue", value: [] };
      for (var i = 0; i < countrys.length; i++) {
        let type = countrys[i].getElementsByTagName("ConductionTypes");
        let direction = countrys[i].getElementsByTagName("Earside");
        if (type && type[0].innerHTML == "AC") {
          if (direction && direction[0].innerHTML == "Right") {
            try {
              let size = countrys[i].getElementsByTagName("IntensityUT");
              let length = countrys[i].getElementsByTagName("IntensityMT");
              let status = countrys[i].getElementsByTagName("StatusMT");
              let number = countrys[i].getElementsByTagName("Frequency");
              for (let j = 0; j < size.length; j++) {
                let index = size[j].innerHTML;
                if (size[j].innerHTML <= -100 && status[j].innerHTML == "Heard"){
                  index = length[j].innerHTML
                }
                let value = {
                  revisionValue: 0,
                  measuredValue: Number(index),
                  frequency: number[j].innerHTML,
                };
                right.value.push(value);
              }
            } catch (err) {}
          } else {
            try {
              let size = countrys[i].getElementsByTagName("IntensityUT");
              let length = countrys[i].getElementsByTagName("IntensityMT");
              let status = countrys[i].getElementsByTagName("StatusMT");
              let number = countrys[i].getElementsByTagName("Frequency");
              for (let j = 0; j < size.length; j++) {
                let index = size[j].innerHTML;
                if (size[j].innerHTML <= -100 && status[j].innerHTML == "Heard"){
                  index = length[j].innerHTML
                }
                let value = {
                  revisionValue: 0,
                  measuredValue: Number(index),
                  frequency: number[j].innerHTML,
                };
                left.value.push(value);
              }
            } catch (err) {}
          }
        } else if (type && type[0].innerHTML == "BC") {
          if (direction && direction[0].innerHTML == "Right") {
            try {
              let size = countrys[i].getElementsByTagName("IntensityUT");
              let length = countrys[i].getElementsByTagName("IntensityMT");
              let status = countrys[i].getElementsByTagName("StatusMT");
              let number = countrys[i].getElementsByTagName("Frequency");
              for (let j = 0; j < size.length; j++) {
                let index = size[j].innerHTML;
                if (size[j].innerHTML <= -100 && status[j].innerHTML == "Heard"){
                  index = length[j].innerHTML
                }
                let value = {
                  revisionValue: 0,
                  measuredValue: Number(index),
                  frequency: number[j].innerHTML,
                };
                gright.value.push(value);
              }
            } catch (err) {}
          } else {
            try {
              let size = countrys[i].getElementsByTagName("IntensityUT");
              let length = countrys[i].getElementsByTagName("IntensityMT");
              let status = countrys[i].getElementsByTagName("StatusMT");
              let number = countrys[i].getElementsByTagName("Frequency");
              for (let j = 0; j < size.length; j++) {
                let index = size[j].innerHTML;
                if (size[j].innerHTML <= -100 && status[j].innerHTML == "Heard"){
                  index = length[j].innerHTML
                }
                let value = {
                  revisionValue: 0,
                  measuredValue: Number(index),
                  frequency: number[j].innerHTML,
                };
                gleft.value.push(value);
              }
            } catch (err) {}
          }
        }
      }
      arr.push(left);
      arr.push(right);
      arr.push(gleft);
      arr.push(gright);
      return arr;
    },
    //将数据转成json格式
    infoToJson(str) {
      var s = this.getXmlNode(str);
      return s;
    },
    //计算偏移值
    calculation() {
      let _this = this;
      this.syncLoading = true;
      if (this.isCalculation) {
        this.$Message.error("偏移值已计算!");
        this.syncLoading = false;
        return;
      }

      //计算确定
      try {
        _this.$Modal.confirm({
          title: "确认计算",
          content: "是否确定计算偏移值？",
          loading: true,
          onOk: () => {
            //计算偏移值
            _this.data.forEach((item) => {
              let r = _this.tcData(item);
              item.departItemResults.deleteId = item.departItemResults.result;
              item.departItemResults.result =
                Number(item.departItemResults.result) - Number(r);
            });
            _this.isCalculation = true;

            //计算平均值
            _this.calculateAverage();
            _this.syncLoading = false;
            _this.$Message.success("计算完成！");
            _this.$Modal.remove();
          },
          onCancel: () => {
            _this.$Message.info("取消了当前的操作行为！");
            _this.syncLoading = false;
            return;
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
    //处理听测数据
    handleTcDatas(type, data) {
      let results = [];
      for (let i = 0; i < data.length; i++) {
        let shortName = "";
        let value = 0;
        let items = data[i].split(",");
        if (items[0].toString() == "0") {
          shortName = type;
        } else if (items[0].toString() == "1") {
          shortName = "g" + type;
        }
        if (items[1].toString() == "2") {
          shortName = shortName + "500";
        } else if (items[1].toString() == "4") {
          shortName = shortName + "1000";
        } else if (items[1].toString() == "6") {
          shortName = shortName + "2000";
        } else if (items[1].toString() == "7") {
          shortName = shortName + "3000";
        } else if (items[1].toString() == "8") {
          shortName = shortName + "4000";
        } else if (items[1].toString() == "9") {
          shortName = shortName + "6000";
        }
        if (items[2]) {
          value = items[2];
        }
        results.push({
          shortName: shortName,
          value: value,
        });
      }
      return results;
    },
    //同步结果
    syncResult() {
      let _this = this;
      this.syncLoading = true;
      let tab = this.tabsArr.find((i) => i.id == this.tabsValue);
      let testNumber = "";
      testNumber = this.personInfo.test_num || this.personInfo.testNum;
      //是否正常同步(电测听)
      let isNormalSynchro = this.$hospitalName.isNormalSynchro;
      let left = "left";
      let right = "right";
      if (!isNormalSynchro) {
        left = "right";
        right = "left";
      }
      if (tab.officeId == "202" || tab.officeId == "1456834407368364032") {
        let type = "";
        if (tab.officeId == "202") {
          type = "TC";
        } else if (tab.officeId == "1456834407368364032") {
          type = "FGC";
        }
        //根据检查的组合项目和人员id查询对应的条形码-与pacs系统匹配结果
        getBarcodeByPersonIdAndTestNum({
          personId: this.personInfo.id,
          groupItemId: tab.id,
          testNum: testNumber,
          type: tab.specimen,
        })
          .then((res) => {
            if (res.success) {
              if (res.data) {
                if (res.data.lisData == null) {
                  this.$Message.error("未查询到体检结果，无法同步数据！");
                }
                //是否同步成功
                let isRync = false;
                //lis 影像数据
                let conclusion = res.data.conclusion;
                if (conclusion != null) {
                  let find = this.tabsArr.find(
                    (item) => item.id == this.tabsValue
                  );
                  if (find) {
                    find.departResult.diagnoseSum = conclusion.comments;
                    find.departResult.diagnoseTip = conclusion.seeing;
                  }
                } else {
                  if (tab.isFile == "是") {
                    this.$Message.error("未查询到体检结论！");
                  }
                }
                let parse = {};
                let flagTC = false;
                if (
                  res.data.lisData != null &&
                  res.data.lisData.equipmentManufacturerModel == "dmdct"
                ) {
                  var dct = this.getXmlNode(res.data.lisData.data);
                  parse = dct;
                } else {
                  if (
                    res.data.lisData &&
                    res.data.lisData.data &&
                    res.data.lisData.data.indexOf("both") > -1 &&
                    tab.officeId == "202"
                  ) {
                    parse = res.data.lisData.data;
                    flagTC = true;
                  } else {
                    parse = JSON.parse(
                      res.data.lisData && res.data.lisData.data
                        ? res.data.lisData.data
                        : "[]"
                    );
                  }
                }
                if ("是" == tab.isFile) {
                  isRync = true;
                  parse = parse.filter((item) => item.type == "image");
                  // this.pacsData = [];
                  // parse.forEach((item) => {
                  //   if (this.pacsData.length < 2) {
                  //     this.pacsData.push(util.nginxUrl + "/" + item.imgPath);
                  //   }
                  // });
                  this.pacsData = parse.map(i => `${ i.imgPath.indexOf("tempfile") > -1 ? util.nginxUrl : "" }/${ i.imgPath }`)
                } else {
                  if (flagTC) {
                    //麦力听数据解析
                    isRync = true;
                    let bothData = "" + parse.split(":")[2].split("}]")[0];
                    if (bothData && bothData.indexOf("}{") > -1) {
                      //拆分左右耳
                      let leftString = bothData.split("}{")[0].toString();
                      let rightString = bothData.split("}{")[1].toString();
                      //拆分测量点
                      let leftdates = [];
                      let rightdates = [];
                      if (leftString && leftString.indexOf("|") > -1) {
                        leftdates = leftString.split("|");
                      }
                      if (rightString && rightString.indexOf("|") > -1) {
                        rightdates = rightString.split("|");
                      }
                      //处理测量点
                      this.data.forEach((item) => {
                        if (leftdates.length > 0) {
                          //左耳
                          let result = this.handleTcDatas("l", leftdates);
                          for (let j = 0; j < result.length; j++) {
                            if (result[j].shortName == item.relationCode) {
                              let r = this.tcData(item);
                              item.departItemResults.result =
                                Number(result[j].value) - Number(r);
                              item.departItemResults.deleteId = Number(
                                result[j].value
                              );
                              if (item.criticals.length == 0) {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "-"
                                );
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "0"
                                );
                              } else {
                                let ret = this.setResult(
                                  item.criticals,
                                  result[j].value
                                );
                                if (ret.flag == "-") {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                } else if (ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    ret.arrow == "-"
                                      ? "-"
                                      : ret.arrow == "↑"
                                      ? "高于正常值"
                                      : "低于正常值"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "1"
                                  );
                                } else if (!ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "正常"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                }
                              }
                            } else if (result[j].shortName == item.shortName) {
                              let r = this.tcData(item);
                              item.departItemResults.result =
                                Number(result[j].value) - Number(r);
                              item.departItemResults.deleteId = Number(
                                result[j].value
                              );
                              if (item.criticals.length == 0) {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "-"
                                );
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "0"
                                );
                              } else {
                                let ret = this.setResult(
                                  item.criticals,
                                  result[j].value
                                );
                                if (ret.flag == "-") {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                } else if (ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    ret.arrow == "-"
                                      ? "-"
                                      : ret.arrow == "↑"
                                      ? "高于正常值"
                                      : "低于正常值"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "1"
                                  );
                                } else if (!ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "正常"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                }
                              }
                            }
                          }
                        }
                        if (rightdates.length > 0) {
                          //右耳
                          let result = this.handleTcDatas("r", rightdates);
                          for (let j = 0; j < result.length; j++) {
                            if (result[j].shortName == item.relationCode) {
                              let r = this.tcData(item);
                              item.departItemResults.result =
                                Number(result[j].value) - Number(r);
                              item.departItemResults.deleteId = Number(
                                result[j].value
                              );
                              if (item.criticals.length == 0) {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "-"
                                );
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "0"
                                );
                              } else {
                                let ret = this.setResult(
                                  item.criticals,
                                  result[j].value
                                );
                                if (ret.flag == "-") {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                } else if (ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    ret.arrow == "-"
                                      ? "-"
                                      : ret.arrow == "↑"
                                      ? "高于正常值"
                                      : "低于正常值"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "1"
                                  );
                                } else if (!ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "正常"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                }
                              }
                            } else if (result[j].shortName == item.shortName) {
                              let r = this.tcData(item);
                              item.departItemResults.result =
                                Number(result[j].value) - Number(r);
                              item.departItemResults.deleteId = Number(
                                result[j].value
                              );
                              if (item.criticals.length == 0) {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "-"
                                );
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "0"
                                );
                              } else {
                                let ret = this.setResult(
                                  item.criticals,
                                  result[j].value
                                );
                                if (ret.flag == "-") {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                } else if (ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    ret.arrow == "-"
                                      ? "-"
                                      : ret.arrow == "↑"
                                      ? "高于正常值"
                                      : "低于正常值"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "1"
                                  );
                                } else if (!ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "正常"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                }
                              }
                            }
                          }
                        }
                      });
                    }
                  } else {
                    this.data.forEach((item) => {
                      for (let i = 0; i < parse.length; i++) {
                        if (tab.portfolioProjectId == "1361") {
                          if (parse[i].site) {
                            if (parse[i].site == left) {
                              parse[i].value.forEach((j) => {
                                if (i > 2) {
                                  if ("gl" + j.frequency == item.relationCode) {
                                    isRync = true;
                                    let r = this.tcData(item);
                                    item.departItemResults.result =
                                      Number(j.measuredValue) - Number(r);
                                    item.departItemResults.deleteId = Number(
                                      j.measuredValue
                                    );
                                    if (item.criticals.length == 0) {
                                      this.$set(
                                        item.departItemResults,
                                        "crisisDegree",
                                        "-"
                                      );
                                      this.$set(
                                        item.departItemResults,
                                        "positive",
                                        "0"
                                      );
                                    } else {
                                      let ret = this.setResult(
                                        item.criticals,
                                        j.revisionValue
                                      );
                                      if (ret.flag == "-") {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          "-"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          "-"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "0"
                                        );
                                      } else if (ret.flag) {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          ret.arrow == "-"
                                            ? "-"
                                            : ret.arrow == "↑"
                                            ? "高于正常值"
                                            : "低于正常值"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          ret.arrow
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "1"
                                        );
                                      } else if (!ret.flag) {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          "正常"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          ret.arrow
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "0"
                                        );
                                      }
                                    }
                                  }
                                } else {
                                  if ("l" + j.frequency == item.relationCode) {
                                    isRync = true;
                                    let r = this.tcData(item);
                                    item.departItemResults.result =
                                      Number(j.measuredValue) - Number(r);
                                    item.departItemResults.deleteId = Number(
                                      j.measuredValue
                                    );
                                    if (item.criticals.length == 0) {
                                      this.$set(
                                        item.departItemResults,
                                        "crisisDegree",
                                        "-"
                                      );
                                      this.$set(
                                        item.departItemResults,
                                        "positive",
                                        "0"
                                      );
                                    } else {
                                      let ret = this.setResult(
                                        item.criticals,
                                        j.revisionValue
                                      );
                                      if (ret.flag == "-") {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          "-"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          "-"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "0"
                                        );
                                      } else if (ret.flag) {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          ret.arrow == "-"
                                            ? "-"
                                            : ret.arrow == "↑"
                                            ? "高于正常值"
                                            : "低于正常值"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          ret.arrow
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "1"
                                        );
                                      } else if (!ret.flag) {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          "正常"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          ret.arrow
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "0"
                                        );
                                      }
                                    }
                                  }
                                }
                              });
                            } else if (parse[i].site == right) {
                              parse[i].value.forEach((j) => {
                                if (i > 2) {
                                  if ("gr" + j.frequency == item.relationCode) {
                                    isRync = true;
                                    let r = this.tcData(item);
                                    item.departItemResults.result =
                                      Number(j.measuredValue) - Number(r);
                                    item.departItemResults.deleteId = Number(
                                      j.measuredValue
                                    );

                                    if (item.criticals.length == 0) {
                                      this.$set(
                                        item.departItemResults,
                                        "crisisDegree",
                                        "-"
                                      );
                                      this.$set(
                                        item.departItemResults,
                                        "positive",
                                        "0"
                                      );
                                    } else {
                                      let ret = this.setResult(
                                        item.criticals,
                                        j.revisionValue
                                      );
                                      if (ret.flag == "-") {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          "-"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          "-"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "0"
                                        );
                                      } else if (ret.flag) {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          ret.arrow == "-"
                                            ? "-"
                                            : ret.arrow == "↑"
                                            ? "高于正常值"
                                            : "低于正常值"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          ret.arrow
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "1"
                                        );
                                      } else if (!ret.flag) {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          "正常"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          ret.arrow
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "0"
                                        );
                                      }
                                    }
                                  }
                                } else {
                                  if ("r" + j.frequency == item.relationCode) {
                                    isRync = true;
                                    let r = this.tcData(item);
                                    item.departItemResults.result =
                                      Number(j.measuredValue) - Number(r);
                                    item.departItemResults.deleteId = Number(
                                      j.measuredValue
                                    );

                                    if (item.criticals.length == 0) {
                                      this.$set(
                                        item.departItemResults,
                                        "crisisDegree",
                                        "-"
                                      );
                                      this.$set(
                                        item.departItemResults,
                                        "positive",
                                        "0"
                                      );
                                    } else {
                                      let ret = this.setResult(
                                        item.criticals,
                                        j.revisionValue
                                      );
                                      if (ret.flag == "-") {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          "-"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          "-"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "0"
                                        );
                                      } else if (ret.flag) {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          ret.arrow == "-"
                                            ? "-"
                                            : ret.arrow == "↑"
                                            ? "高于正常值"
                                            : "低于正常值"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          ret.arrow
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "1"
                                        );
                                      } else if (!ret.flag) {
                                        this.$set(
                                          item.departItemResults,
                                          "crisisDegree",
                                          "正常"
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "arrow",
                                          ret.arrow
                                        );
                                        this.$set(
                                          item.departItemResults,
                                          "positive",
                                          "0"
                                        );
                                      }
                                    }
                                  }
                                }
                              });
                            }
                          } else {
                            if (parse[i].shortName == item.relationCode) {
                              let r = this.tcData(item);
                              item.departItemResults.result =
                                Number(j.measuredValue) - Number(r);
                              item.departItemResults.deleteId = Number(
                                j.measuredValue
                              );
                              if (item.criticals.length == 0) {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "-"
                                );
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "0"
                                );
                              } else {
                                let ret = this.setResult(
                                  item.criticals,
                                  j.revisionValue
                                );
                                if (ret.flag == "-") {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                } else if (ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    ret.arrow == "-"
                                      ? "-"
                                      : ret.arrow == "↑"
                                      ? "高于正常值"
                                      : "低于正常值"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "1"
                                  );
                                } else if (!ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "正常"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                }
                              }
                            } else if (parse[i].shortName == item.shortName) {
                              let r = this.tcData(item);
                              item.departItemResults.result =
                                Number(j.measuredValue) - Number(r);
                              item.departItemResults.deleteId = Number(
                                j.measuredValue
                              );
                              if (item.criticals.length == 0) {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "-"
                                );
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "0"
                                );
                              } else {
                                let ret = this.setResult(
                                  item.criticals,
                                  j.revisionValue
                                );
                                if (ret.flag == "-") {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                } else if (ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    ret.arrow == "-"
                                      ? "-"
                                      : ret.arrow == "↑"
                                      ? "高于正常值"
                                      : "低于正常值"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "1"
                                  );
                                } else if (!ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "正常"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                }
                              }
                            }
                          }
                        } else {
                          if (
                            parse[i].shortName == item.relationCode ||
                            parse[i].shortName == item.shortName
                          ) {
                            isRync = true;
                            if ("neg" != parse[i].result) {
                              //明细结果赋值
                              item.departItemResults.result = parse[i].result
                                ? parse[i].result
                                : 0;
                            }
                            if (tab.name && tab.name.indexOf("肺功能") > -1) {
                              // item.departItemResults.result = parse[i].result?parse[i].result:0;
                              item.departItemResults.result = parse[i].result
                                ? parse[i].result
                                : "";
                              item.departItemResults.arrow = parse[i].percentage
                                ? parse[i].percentage
                                : 0;
                              // item.departItemResults.scope = parse[i].standard?parse[i].standard:0;
                              item.departItemResults.updateId = parse[i]
                                .standard
                                ? parse[i].standard
                                : 0;

                              if (item.criticals.length == 0) {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "-"
                                );
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "0"
                                );
                              } else {
                                let result = item.departItemResults.result;
                                let ret = this.setResult(
                                  item.criticals,
                                  result
                                );
                                if (ret.flag == "-") {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                } else if (ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    ret.arrow == "-"
                                      ? "-"
                                      : ret.arrow == "↑"
                                      ? "高于正常值"
                                      : "低于正常值"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "1"
                                  );
                                } else if (!ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "正常"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                }
                              }
                            }
                          }
                        }
                      }
                    });
                  }
                  if (parse && parse.length > 0 && isRync) {
                    this.$Message.success("同步成功！");
                  } else {
                    this.$Message.error("同步失败！");
                  }
                  if (
                    tab.portfolioProjectId == "1479" &&
                    parse &&
                    parse.length > 0
                  ) {
                    //肺功能测试曲线
                    const filteredParse = parse.filter(
                      (item) =>
                        item.type &&
                        (item.type == "image" )
                    );
                    _this.pacsData = filteredParse.slice(0,2).map(i => `${util.nginxUrl}/${i.imgPath}`);
                  }


                  if (tab.officeId == "202") {
                    this.calculateAverage();
                  }
                  if (tab.officeId == "1456834407368364032") {
                    this.dataFgnContent();
                  }
                }
              }
            }
          })
          .finally(() => {
            this.syncLoading = false;
          });
      } else {
        let groupItemIdNow = tab.id;
        let deptName = "";
        if (tab.deptName) {
          deptName = tab.deptName;
        }
        /*if(tab.name && tab.name.indexOf("复")>-1 && (tab.name.indexOf("血脂")>-1 || tab.name.indexOf("血糖")>-1 || tab.name.indexOf("肝功")>-1 || tab.name.indexOf("肾功")>-1) || tab.name.indexOf("ALT")>-1){
                        groupItemIdNow = '99999999999999999999999999999998';
                    }*/
        //根据检查的组合项目和人员id查询对应的条形码-与lis系统匹配结果
        getBarcodeByPersonIdAndGroupItemId({
          personId: this.personInfo.id,
          groupItemId: groupItemIdNow,
          isFile: tab.isFile,
          type: tab.specimen,
          testNum: testNumber,
          deptName: deptName,
        })
          .then((res) => {
            if (res.success) {
              if (res.data) {
                if (res.data.pacsData == null) {
                  this.$Message.error("未查询到体检结果，无法同步数据！");
                }

                if (tab.isFile == "是") {
                  //pacs 影像数据
                  let conclusion = res.data.conclusion;
                  if (conclusion != null) {
                    let find = this.tabsArr.find(
                      (item) => item.id == this.tabsValue
                    );
                    if (find) {
                      find.departResult.diagnoseSum = conclusion.comments;
                      find.departResult.diagnoseTip = conclusion.seeing;
                    }
                  } else {
                    this.$Message.error("未查询到体检结论！");
                  }
                } else {
                  let conclusion = res.data.conclusion;
                  if (conclusion != null) {
                    let find = this.tabsArr.find(
                      (item) => item.id == this.tabsValue
                    );
                    if (find) {
                      find.departResult.diagnoseSum = conclusion.comments;
                      find.departResult.diagnoseTip = conclusion.seeing;
                    }
                  } else {
                    this.$Message.error("未查询到体检结论！");
                  }
                }
                let parse = JSON.parse(
                  res.data.pacsData && res.data.pacsData.data
                    ? res.data.pacsData.data
                    : "[]"
                );

                this.lisData = [];
                let parseLis = parse.filter((item) => item.type == "image");
                if (parseLis.length > 0) {
                  parseLis.forEach((item) => {
                    if (this.lisData.length <= 4) {
                      this.lisData.push(item.base64);
                    }
                    // this.lisData.push(item.base64);
                  });
                  if (this.lisData && this.lisData.length > 0) {
                    //this.$Message.success("同步成功！");
                  }
                }
                if ("是" == tab.isFile) {
                  parse = parse.filter((item) => item.type == "image");
                  // this.pacsData = [];
                  // parse.forEach((item) => {
                  //   if (this.pacsData.length < 2) {
                  //     if (
                  //       item.imgPath &&
                  //       item.imgPath.indexOf("tempfile") > -1
                  //     ) {
                  //       this.pacsData.push(util.nginxUrl + "/" + item.imgPath);
                  //     } else {
                  //       this.pacsData.push("/" + item.imgPath);
                  //     }
                  //   }i.imgPath.indexOf("tempfile") > -1
                  // });
                  this.pacsData = parse.map(i => `${ i.imgPath.indexOf("tempfile") > -1 ? util.nginxUrl : "" }/${ i.imgPath }`)

                  if (this.pacsData && this.pacsData.length > 0) {
                    this.$Message.success("同步成功！");
                  }
                } else {
                  //是否同步成功
                  let isRync = false;
                  this.data.forEach((item) => {
                    for (let i = 0; i < parse.length; i++) {
                      if (parse[i].shortName == item.relationCode) {
                        isRync = true;
                        if ("neg" != parse[i].result) {
                          //去除符号
                          let resultNow = parse[i].result
                            ? parse[i].result.toString()
                            : "";
                          if (
                            resultNow &&
                            resultNow.toString().trim().length > 0
                          ) {
                            resultNow = resultNow
                              .replaceAll(">=", "")
                              .replaceAll("<=", "")
                              .replaceAll("<", "")
                              .replaceAll(">", "")
                              .replaceAll("＜", "")
                              .replaceAll("＞", "");
                          }
                          //明细结果赋值
                          item.departItemResults.result = resultNow;
                          if (parse[i].row && parse[i].scope) {
                            if (parse[i].scope) {
                              this.$set(
                                item.departItemResults,
                                "scope",
                                parse[i].scope
                              );
                            }
                            switch (parse[i].row) {
                              case "L": {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "低于正常值"
                                );
                                this.$set(item.departItemResults, "arrow", "↓");
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "1"
                                );
                                break;
                              }
                              case "H": {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "高于正常值"
                                );
                                this.$set(item.departItemResults, "arrow", "↑");
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "1"
                                );
                                break;
                              }
                              case "M": {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "正常"
                                );
                                this.$set(item.departItemResults, "arrow", "");
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "0"
                                );
                                break;
                              }
                              default: {
                                let ret = this.setResult(
                                  item.criticals,
                                  parse[i].result
                                );
                                if (ret.flag == "-") {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                } else if (ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    ret.arrow == "-"
                                      ? "-"
                                      : ret.arrow == "↑"
                                      ? "高于正常值"
                                      : "低于正常值"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "1"
                                  );
                                } else if (!ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "正常"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                }
                              }
                            }
                          } else if (item.criticals.length == 0) {
                            this.$set(
                              item.departItemResults,
                              "crisisDegree",
                              "-"
                            );
                            this.$set(item.departItemResults, "arrow", "-");
                            this.$set(item.departItemResults, "positive", "0");
                          } else {
                            /*let ret = this.setResult(item.criticals, parse[i].result);
                                                        if (ret.flag == "-") {
                                                            this.$set(item.departItemResults, 'crisisDegree', '-');
                                                            this.$set(item.departItemResults, 'arrow', '-');
                                                        } else if (ret.flag) {
                                                            this.$set(item.departItemResults, 'crisisDegree', ret.arrow == '-' ? '-' : ret.arrow == '↑' ? '高于正常值' : '低于正常值');
                                                            this.$set(item.departItemResults, 'arrow', ret.arrow);
                                                        } else if (!ret.flag) {
                                                            this.$set(item.departItemResults, 'crisisDegree', "正常");
                                                            this.$set(item.departItemResults, 'arrow', ret.arrow);
                                                        }*/

                            let rett = this.setResult(
                              item.criticals,
                              parse[i].result
                            );
                            if (rett.flag == "-") {
                              this.$set(
                                item.departItemResults,
                                "crisisDegree",
                                "-"
                              );
                              this.$set(item.departItemResults, "arrow", "-");
                              this.$set(
                                item.departItemResults,
                                "positive",
                                "0"
                              );
                            } else if (rett.flag) {
                              this.$set(
                                item.departItemResults,
                                "crisisDegree",
                                rett.arrow == "-"
                                  ? rett.resp
                                    ? rett.resp
                                    : "-"
                                  : rett.arrow == "↑"
                                  ? "高于正常值"
                                  : "低于正常值"
                              );
                              this.$set(
                                item.departItemResults,
                                "arrow",
                                rett.arrow
                              );
                              this.$set(
                                item.departItemResults,
                                "positive",
                                "1"
                              );
                            } else if (!rett.flag) {
                              this.$set(
                                item.departItemResults,
                                "crisisDegree",
                                "正常"
                              );
                              this.$set(
                                item.departItemResults,
                                "arrow",
                                rett.arrow
                              );
                              this.$set(
                                item.departItemResults,
                                "positive",
                                "0"
                              );
                            }
                          }
                        }
                        if (tab.name && tab.name.indexOf("肺功能") > -1) {
                          // item.departItemResults.scope = parse[i].standard;
                          item.departItemResults.updateId = parse[i].standard;
                          item.departItemResults.arrow = parse[i].percentage;
                          if (parse[i].result == "阳性") {
                            item.departItemResults.arrow = "↑";
                            item.departItemResults.crisisDegree = "高于正常值";
                            this.$set(item.departItemResults, "positive", "1");
                          } else {
                            //范围
                            let scope = parse[i].standard;
                            //提示arrow
                            if (!scope || scope == "-") {
                              //范围
                              item.departItemResults.arrow = "-";
                              item.departItemResults.crisisDegree = "暂无结果";
                              this.$set(
                                item.departItemResults,
                                "positive",
                                "0"
                              );
                            } else {
                              let arrow = this.setArrow(
                                parse[i].standard,
                                parse[i].result
                              );

                              item.departItemResults.arrow = arrow;
                              if (arrow == "↑") {
                                item.departItemResults.crisisDegree =
                                  "高于正常值";
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "1"
                                );
                              }
                              if (arrow == "↓") {
                                item.departItemResults.crisisDegree =
                                  "低于正常值";
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "1"
                                );
                              }
                              if (arrow == "-") {
                                item.departItemResults.crisisDegree = "正常";
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "0"
                                );
                              }
                            }
                          }
                        }
                      } else if (parse[i].shortName == item.shortName) {
                        if ("neg" != parse[i].result) {
                          //去除符号
                          let resultNow = parse[i].result;
                          if (resultNow && resultNow.trim().length > 0) {
                            resultNow = resultNow
                              .replaceAll(">=", "")
                              .replaceAll("<=", "")
                              .replaceAll("<", "")
                              .replaceAll(">", "")
                              .replaceAll("＜", "")
                              .replaceAll("＞", "");
                          }
                          //明细结果赋值
                          item.departItemResults.result = resultNow;
                          if (parse[i].row && parse[i].scope) {
                            if (parse[i].scope) {
                              this.$set(
                                item.departItemResults,
                                "scope",
                                parse[i].scope
                              );
                            }
                            switch (parse[i].row) {
                              case "L": {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "低于正常值"
                                );
                                this.$set(item.departItemResults, "arrow", "↓");
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "1"
                                );
                                break;
                              }
                              case "H": {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "高于正常值"
                                );
                                this.$set(item.departItemResults, "arrow", "↑");
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "1"
                                );
                                break;
                              }
                              case "M": {
                                this.$set(
                                  item.departItemResults,
                                  "crisisDegree",
                                  "正常"
                                );
                                this.$set(item.departItemResults, "arrow", "");
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "0"
                                );
                                break;
                              }
                              default: {
                                let ret = this.setResult(
                                  item.criticals,
                                  parse[i].result
                                );
                                if (ret.flag == "-") {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    "-"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                } else if (ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    ret.arrow == "-"
                                      ? "-"
                                      : ret.arrow == "↑"
                                      ? "高于正常值"
                                      : "低于正常值"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "1"
                                  );
                                } else if (!ret.flag) {
                                  this.$set(
                                    item.departItemResults,
                                    "crisisDegree",
                                    "正常"
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "arrow",
                                    ret.arrow
                                  );
                                  this.$set(
                                    item.departItemResults,
                                    "positive",
                                    "0"
                                  );
                                }
                              }
                            }
                          } else if (item.criticals.length == 0) {
                            this.$set(
                              item.departItemResults,
                              "crisisDegree",
                              "-"
                            );
                            this.$set(item.departItemResults, "arrow", "-");
                            this.$set(item.departItemResults, "positive", "0");
                          } else {
                            /*let ret = this.setResult(item.criticals, parse[i].result);
                                                        if (ret.flag == "-") {
                                                            this.$set(item.departItemResults, 'crisisDegree', '-');
                                                            this.$set(item.departItemResults, 'arrow', '-');
                                                        } else if (ret.flag) {
                                                            this.$set(item.departItemResults, 'crisisDegree', ret.arrow == '-' ? '-' : ret.arrow == '↑' ? '高于正常值' : '低于正常值');
                                                            this.$set(item.departItemResults, 'arrow', ret.arrow);
                                                        } else if (!ret.flag) {
                                                            this.$set(item.departItemResults, 'crisisDegree', "正常");
                                                            this.$set(item.departItemResults, 'arrow', ret.arrow);
                                                        }*/
                            let rett = this.setResult(
                              item.criticals,
                              parse[i].result
                            );
                            if (rett.flag == "-") {
                              this.$set(
                                item.departItemResults,
                                "crisisDegree",
                                "-"
                              );
                              this.$set(item.departItemResults, "arrow", "-");
                              this.$set(
                                item.departItemResults,
                                "positive",
                                "0"
                              );
                            } else if (rett.flag) {
                              this.$set(
                                item.departItemResults,
                                "crisisDegree",
                                rett.arrow == "-"
                                  ? rett.resp
                                    ? rett.resp
                                    : "-"
                                  : rett.arrow == "↑"
                                  ? "高于正常值"
                                  : "低于正常值"
                              );
                              this.$set(
                                item.departItemResults,
                                "arrow",
                                rett.arrow
                              );
                              this.$set(
                                item.departItemResults,
                                "positive",
                                "1"
                              );
                            } else if (!rett.flag) {
                              this.$set(
                                item.departItemResults,
                                "crisisDegree",
                                "正常"
                              );
                              this.$set(
                                item.departItemResults,
                                "arrow",
                                rett.arrow
                              );
                              this.$set(
                                item.departItemResults,
                                "positive",
                                "0"
                              );
                            }
                          }
                        }
                        if (tab.name && tab.name.indexOf("肺功能") > -1) {
                          // item.departItemResults.scope = parse[i].standard;
                          item.departItemResults.updateId = parse[i].standard;
                          item.departItemResults.arrow = parse[i].percentage;
                          if (parse[i].result == "阳性") {
                            item.departItemResults.arrow = "↑";
                            item.departItemResults.crisisDegree = "高于正常值";
                            this.$set(item.departItemResults, "positive", "1");
                          } else {
                            //范围
                            let scope = parse[i].standard;
                            //提示arrow
                            if (!scope || scope == "-") {
                              //范围
                              item.departItemResults.arrow = "-";
                              item.departItemResults.crisisDegree = "暂无结果";
                              this.$set(
                                item.departItemResults,
                                "positive",
                                "0"
                              );
                            } else {
                              let arrow = this.setArrow(
                                parse[i].standard,
                                parse[i].result
                              );

                              item.departItemResults.arrow = arrow;
                              if (arrow == "↑") {
                                item.departItemResults.crisisDegree =
                                  "高于正常值";
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "1"
                                );
                              }
                              if (arrow == "↓") {
                                item.departItemResults.crisisDegree =
                                  "低于正常值";
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "1"
                                );
                              }
                              if (arrow == "-") {
                                item.departItemResults.crisisDegree = "正常";
                                this.$set(
                                  item.departItemResults,
                                  "positive",
                                  "0"
                                );
                              }
                            }
                          }
                        }
                      }
                    }
                  });
                  if (parse && parse.length > 0 && isRync) {
                    this.$Message.success("同步成功！");
                  } else {
                    this.$Message.error("同步失败！");
                  }
                  if (tab.officeId == "202") {
                    this.calculateAverage();
                  }
                  if (tab.officeId == "1456834407368364032") {
                    this.dataFgnContent();
                  }
                  //同步后，自动生成结论(只生成检验科结论)
                  if (tab && tab.officeId && tab.officeId.indexOf("186") > -1) {
                    this.handleCrisisData(tab);
                  }
                }
              }
            }
          })
          .finally(() => {
            this.syncLoading = false;
          });
      }
    },
    personChangePageNum(v) {
      this.groupPersonSearchForm.pageNumber = v;
      this.getPersonByOfficeId();
    },
    /**
     * 根据危害因素给检查项目名称添加提示
     * @param name
     * @returns {*}
     */
    initTabName(name) {
      let res = name + "";
      if (this.physicalType == "职业体检") {
        let proType = this.$proType;
        if (proType && proType["职业体检"]) {
          let proTypeItem = proType["职业体检"];
          if (
            this.personInfo &&
            this.personInfo.hazardFactorsText &&
            this.personInfo.workStateText
          ) {
            let text = this.personInfo.hazardFactorsText.split("|");
            let work = this.personInfo.workStateText;
            if (text.length > 0) {
              for (let i = 0; i < text.length; i++) {
                let factors = text[i];
                if (res !== name) {
                  break;
                }
                let items = null;
                if (proTypeItem[factors] && proTypeItem[factors][work.trim()]) {
                  items = proTypeItem[factors][work.trim()];
                } else if (
                  factors.indexOf("粉尘") > -1 ||
                  factors.indexOf("烟尘") > -1
                ) {
                  if (
                    proTypeItem["其他无机粉尘"] &&
                    proTypeItem["其他无机粉尘"].items &&
                    proTypeItem["有机粉尘"]
                  ) {
                    if (
                      proTypeItem["其他无机粉尘"].items.indexOf(factors) > -1
                    ) {
                      items = proTypeItem["其他无机粉尘"][work.trim()];
                    } else {
                      items = proTypeItem["有机粉尘"][work.trim()];
                    }
                  }
                }
                if (items) {
                  for (let key in items) {
                    if (name.indexOf(key + "") > -1) {
                      res = key + "(" + items[key + ""] + ")";
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }
      return res;
    },
    //检查医生选择
    doctorSelectChange(e) {
      if (e) {
        let docker = this.userArray.filter((aa) => aa.id == e.value);
        if (docker && docker.length > 0) {
          let selectDocker = docker[0];
          if (this.tabsArr && this.tabsArr.length > 0 && selectDocker) {
            let tab = this.tabsArr.find((i) => i.id == this.tabsValue);
            if (tab && tab.departResult) {
              tab.departResult.checkDoc = selectDocker.nickname;
              if (
                selectDocker.autographFile &&
                selectDocker.autographFile.indexOf("/dcm") > -1
              ) {
                tab.departResult.checkSignPath = selectDocker.autographFile;
              } else {
                tab.departResult.checkSignPath =
                  "data:image/png;base64," + selectDocker.autograph;
              }
            }
          }
        }
      }
    },

    handleEntityActions(event) {
      const eventMap = {
        confirm: this.handleConfirm,
        view: this.codeConfirm,
        import: this.DataBaseClick,
        discard: this.handleCheckConfirm,
        "cancel-discard": this.CancelDiscardInspection,
      };

      const callBack = eventMap[event];

      if (typeof callBack === "function") {
        callBack();
      }
    },

    async refreshCheckStatus() {
      this.handleCheckStatus();
      // 未检
      if (!this.isCheck) {
        try {
          const res = await queryTDepartResultByPersonId({
            data: {
              groupItemIdList: JSON.stringify(this.groupItemIdList),
              personId: this.personInfo.id,
            },
          });

          if (res?.success) {
            if (
              (!this.isConsultation || this.personInfo.wzCheckDoctorId) &&
              res.data === this.groupItemIdList.length
            ) {
              this.getPersonByOfficeId();
            }
          } else {
            console.log(res.message);
          }
        } catch (err) {
          console.log(err.message);
        }
      }
    },

    async handleInfoSearch() {
      await this.getOnePersonData(this.isRadioChecked);
      this.refreshCheckStatus();
    },


    resetPage() {
      this.personInfo = {};
      this.tabsArr = [];
      this.indxArr = [];
      this.data = [];
    }
  },
};
</script>

<style lang="less">
@import "../../../styles/tree&table-common.less";

@import "./t-check-station.less";

.tCheckStation {
  padding: 10px;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  .ivu-card-body {
    height: 100%;
  }

  .ivu-tabs .ivu-tabs-content-animated {
    height: 700px;
  }

  .tCheckStationForm {
    .ivu-form-item {
      margin-bottom: 0 !important;
    }
  }

  .card {
    height: calc(100vh - 120px);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    overflow: hidden;
    position: relative;

    .btngroup {
      display: flex;
      margin-bottom: 10px;

      .ivu-radio-group-item {
        padding: 0 6px !important;
        font-size: 13px !important;
        user-select: none;
      }
    }

    .radio-group {
      overflow: auto;
      width: 100%;
      height: 100%;
      padding-bottom: 30px;

      &::-webkit-scrollbar {
        width: 0;
      }

      .row-border {
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-top: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
      }

      .border-blue {
        border: 1px solid #0000ff;
        border-radius: 8px;
        text-align: center;
        color: #0000ff;
      }

      .border-green {
        border: 1px solid green;
        border-radius: 8px;
        text-align: center;
        color: green;
      }

      .border-purple {
        border: 1px solid orangered;
        border-radius: 8px;
        text-align: center;
        color: orangered;
      }

      .border-yellow {
        border: 1px solid magenta;
        border-radius: 8px;
        text-align: center;
        color: magenta;
      }

      .radio-group-radio {
        display: flex;
        justify-content: center;
        align-items: center;

        .ivu-radio-wrapper {
          margin-right: 5px;
        }

        .ivu-radio-group-item {
          font-size: 0;
        }
      }

      .radio-group-content {
        padding-left: 0 !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;

        .date {
          color: #000;
          font-size: 13px;
        }

        .border-blue {
          border: 1px solid #0000ff;
          border-radius: 8px;
          text-align: center;
          color: #0000ff;
        }

        .bg-green {
          background-color: #42c3af;
          color: #fff;
          border-radius: 8px;
          text-align: center;
        }

        .company {
          color: #000;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .radio-group-wrapper {
        font-size: 0;
      }
    }
  }

  .ivu-form-item-content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  //图片
  .img-wrapper {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
    }
  }

  .empty {
    text-align: center;
    color: #515a6e;
    margin-top: 20px;
  }

  .icon-menu-unfold {
    font-size: 20px;
  }

  .bullet {
    .bullet-item {
      background-color: #169bd5;
      color: #fff;
      padding: 2px 12px;
    }
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

  .ivu-table-wrapper {
    top: -1px;
  }

  .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    background: #2d8cf0;
    color: #fff;
  }

  .wrap {
    width: 810px;
    height: auto;
    line-height: 30px;
    font-size: 14px;
  }

  .step-case {
    height: 30px;
  }

  .step-case li {
    float: left;
    margin: 0px;
    width: 12.5%;
    position: relative;
    cursor: pointer;
  }

  .step-case li span {
    display: block;
    background-color: #ccc;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    font-weight: bold;
  }

  .step-case b {
    position: absolute;
    font-size: 0px;
    line-height: 0px;
    top: 0px;
  }

  .step-case .b-l {
    border-width: 2px 2px 2px 0;
    border-style: dashed solid dashed dashed;
    border-color: transparent #ccc transparent transparent;
    height: 30px;
    left: -2px;
  }

  .step-case .b-r {
    border-width: 2px 0 2px 2px;
    border-style: dashed dashed dashed solid;
    border-color: transparent transparent transparent #ccc;
    height: 30px;
    right: -2px;
  }

  .step-case .b-1 {
    border-width: 15px 0 15px 20px;
    border-style: solid dashed solid solid;
    border-color: #ccc transparent #ccc #ddd;
    left: -20px;
  }

  .step-case .b-2 {
    border-width: 15px 0 15px 20px;
    border-style: dashed dashed dashed solid;
    border-color: transparent transparent transparent #ccc;
    left: -21px;
  }

  /*当前状态*/

  .step-case .s-cur span {
    background-color: #169bd6;
  }

  .step-case .s-cur .b-l {
    border-right-color: #169bd6;
  }

  .step-case .s-cur .b-r {
    border-left-color: #169bd6;
  }

  .step-case .s-cur .b-1 {
    border-color: #169bd6 #169bd6 #169bd6 #ffffff;
  }

  .step-case .s-cur .b-2 {
    border-left-color: #169bd6;
  }

  /*当前状态后*/

  .step-case .s-cur-next .b-2 {
    border-color: transparent transparent transparent #169bd6;
  }

  /*完成的状态*/

  .step-case .s-finish span {
    background-color: #169bd6;
    color: #fff;
  }

  .step-case .s-finish .b-l {
    border-right-color: #169bd6;
  }

  .step-case .s-finish .b-r {
    border-left-color: #169bd6;
  }

  .step-case .s-finish .b-1 {
    border-color: #169bd6 #169bd6 #169bd6 #ffffff;
  }

  .step-case .s-finish .b-2 {
    border-left-color: #169bd6;
  }

  .pic {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 85%;

    .pic-box {
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1px;
      box-sizing: border-box;
      width: 85%;
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

    .re-upload {
      width: 100%;
      flex: 1;
      color: #2e58d6;
      font-size: 13px;

      span {
        cursor: pointer;
      }
    }

    .pic-text {
      font-size: 13px;
      color: #cbcfd6;
    }
  }

  .ivu-form .ivu-form-item-label {
    font-size: 14px;
  }

  .ivu-table td,
  .ivu-table th {
    height: 32px;
  }

  .ivu-table .yellow td {
    background: #ff9900;
    color: #fff;
  }

  .ivu-table .red td {
    background: rgba(230, 6, 6, 0.6);
    color: #fff;
  }

  .ivu-table .green td {
    background: rgba(30, 128, 61, 0.6);
  }

  .ivu-spin-fix .ivu-spin-main {
    top: 50% !important;
  }

  .tCheckStationForm {
    position: relative;

    .ivu-tabs-bar {
      border: 0 !important;
    }

    .form {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #fff;
    }
  }

  .resetBtn {
    position: relative;
    left: -1px;
    top: -5px;
    font-size: 13px;
    white-space: nowrap;
    border: 1px solid #dcdee2;
    padding: 0 8px;
    height: 24px;
    line-height: 22px;
    display: inline-block;
    border-radius: 2px;

    &:hover {
      color: #83bbf7;
    }
  }

  .ivu-tooltip {
    width: 100%;
  }

  .ivu-tooltip-rel {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ivu-spin-fix .ivu-spin-main {
    top: 30%;
  }

  .pacsImgs {
    flex: 1;
    width: 100%;
    padding: 0 10%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
