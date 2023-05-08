<template>
  <div>
    <Collapse v-model="abnormalInfoValue" class="abnormalInformationDiv">
      <Panel name="2">
        异常结果汇总
        <template #content>
          <Input
            class="co"
            v-model="abnormalInfo"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            placeholder=""
            readonly
          ></Input>
        </template>
      </Panel>
    </Collapse>
    <Card class="positiveRule" v-if="physicalType == '健康体检'">
      <Row style="margin-bottom: 10px">
        <Button @click="add" type="primary">添加结果</Button>
        <Button @click="removes" type="error" style="margin-left: 30px"
          >删除结果</Button
        >
        <Button @click="splice" type="primary" style="margin-left: 30px"
          >拆分结果</Button
        >
        <Button @click="PositivResult" type="primary" style="margin-left: 30px"
          >阳性结果</Button
        >
        <Button @click="resultSummary" type="primary" style="margin-left: 30px"
          >异常结果</Button
        >
        <Button @click="mergeResult" type="primary" style="margin-left: 30px"
        >合并结果</Button
        >
      </Row>
      <Table
        :loading="tableLoading"
        border
        :columns="positiveColumns"
        sortable="custom"
        :data="positiveResultData"
        ref="table"
        @on-selection-change="onSelects"
        @on-select="onSelect"
        @on-row-click="rowClick"
        :max-height="775"
        style="width: 100%"
      >
        <template slot-scope="{ row, index }" slot="action">
          <Icon type="md-arrow-up" size="15" @click="arrowUp(index)" />
          <Divider type="vertical"></Divider>
          <Icon type="md-arrow-down" size="15" @click="arrowDown(index)" />
        </template>
      </Table>
      <Row style="margin-top: 10px">
        <Form style="display: flex" :labelWidth="120">
          <FormItem label="总检医生:">
            <Select
              v-model="doctorId"
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
          <FormItem label="总检日期：">
            <DatePicker
              type="datetime"
              v-model="inspectForm.inspectionDate"
              transfer
              placeholder="请选择总检日期"
              style="width: 175px"
            ></DatePicker>
          </FormItem>
        </Form>
      </Row>
    </Card>
    <Form
      style="display: flex"
      :labelWidth="120"
      v-if="physicalType == '从业体检'"
    >
      <FormItem label="总检医生:">
        <Select
          v-model="doctorId"
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
      <FormItem label="总检日期：">
        <DatePicker
          type="datetime"
          v-model="inspectForm.inspectionDate"
          transfer
          placeholder="请选择总检日期"
          style="width: 175px"
        ></DatePicker>
      </FormItem>
      <Button @click="resultSummary" type="primary" style="margin-left: 30px"
        >异常结果</Button
      >
    </Form>
    <Card class="positiveRule" v-if="physicalType == '从业体检'">
      <Row style="margin-bottom: 10px">
        <Col span="24">
          <div class="txt">
            <span
              style="color: red; font-size: 16px; position: relative; top: 4px"
              >*</span
            >疾病诊断
          </div>
        </Col>
        <Col span="6">
          <div class="txt">1.细菌性痢疾</div>
          <RadioGroup v-model="diseaseDiagnosisForm.isDiseaseOne">
            <Radio :label="0">无</Radio>
            <Radio :label="1">有</Radio>
          </RadioGroup>
        </Col>
        <Col span="6">
          <div class="txt">2.伤寒和副伤寒</div>
          <RadioGroup v-model="diseaseDiagnosisForm.isDiseaseTwo">
            <Radio :label="0">无</Radio>
            <Radio :label="1">有</Radio>
          </RadioGroup>
        </Col>
        <Col span="6">
          <div class="txt">3.病毒性肝炎（甲型、戊型）</div>
          <RadioGroup v-model="diseaseDiagnosisForm.isDiseaseThree">
            <Radio :label="0">无</Radio>
            <Radio :label="1">有</Radio>
          </RadioGroup>
        </Col>
        <Col span="6">
          <div class="txt">4.活动性肺结核</div>
          <RadioGroup v-model="diseaseDiagnosisForm.isDiseaseFour">
            <Radio :label="0">无</Radio>
            <Radio :label="1">有</Radio>
          </RadioGroup>
        </Col>
        <Col span="6">
          <div class="txt">5.化脓性或渗出性皮肤病</div>
          <RadioGroup v-model="diseaseDiagnosisForm.isDiseaseFive">
            <Radio :label="0">无</Radio>
            <Radio :label="1">有</Radio>
          </RadioGroup>
        </Col>
        <Col span="6">
          <div class="txt">6.手癣、指甲癣</div>
          <RadioGroup v-model="diseaseDiagnosisForm.isDiseaseSix">
            <Radio :label="0">无</Radio>
            <Radio :label="1">有</Radio>
          </RadioGroup>
        </Col>
        <Col span="6">
          <div class="txt">7.手部湿疹</div>
          <RadioGroup v-model="diseaseDiagnosisForm.isDiseaseSeven">
            <Radio :label="0">无</Radio>
            <Radio :label="1">有</Radio>
          </RadioGroup>
        </Col>
        <Col span="6">
          <div class="txt">8.手部的银屑病或者鳞屑</div>
          <RadioGroup v-model="diseaseDiagnosisForm.isDiseaseEight">
            <Radio :label="0">无</Radio>
            <Radio :label="1">有</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row style="padding: 0 16px 0 0">
        <Col span="3">
          <div class="txt">
            <span
              style="color: red; font-size: 16px; position: relative; top: 4px"
              >*</span
            >健康证条件
          </div>
          <!--<Select v-model="inspectForm.healthCertificateConditions" transfer label-width="100px" >
                        <Option v-for="(item,index) in healthConditionList" :value="item.value" :key="index">{{
                            item.title }}
                        </Option>
                    </Select>-->
          <RadioGroup
            type="button"
            size="small"
            button-style="solid"
            v-model="inspectForm.healthCertificateConditions"
            @on-change="pick"
          >
            <Radio label="合格"></Radio>
            <Radio label="不合格"></Radio>
          </RadioGroup>
        </Col>
        <Col
          span="10"
          v-if="
            inspectForm &&
            inspectForm.healthCertificateConditions &&
            inspectForm.healthCertificateConditions == '不合格'
          "
        >
          <div class="txt">
            <span
              style="color: red; font-size: 16px; position: relative; top: 4px"
              >*</span
            >异常描述
          </div>
          <Input
            type="textarea"
            v-model="inspectForm.handleOpinion"
            :autosize="{ minRows: 5, maxRows: 10 }"
          ></Input>
        </Col>
        <Col span="1"></Col>
        <Col span="10">
          <div class="txt">
            <span
              style="color: red; font-size: 16px; position: relative; top: 4px"
              >*</span
            >主检建议
          </div>
          <Input
            type="textarea"
            v-model="inspectForm.conclusion"
            :autosize="{ minRows: 5, maxRows: 10 }"
          ></Input>
        </Col>
      </Row>
    </Card>
    <Modal
      v-model="tPositiveResulShow"
      title="阳性结果"
      class="tPositiveResultModal"
      :footer-hide="true"
      width="90%"
      style="max-height: 80%"
    >
      <tPositiveResult
        :tPositiveResulShow="tPositiveResulShow"
        :PositiveResultId="PositiveResultId"
      ></tPositiveResult>
    </Modal>
    <positiveResult v-model="modalResult" :personId="personId"></positiveResult>
    <drawer
      v-model="wordChooseShow"
      width="400"
      :modalTitle="title"
      @getSelectedWords="getSelectedWords"
      :type="type"
      :inspectForm="inspectForm"
      :inspectType="personInfo.physical_type || personInfo.physicalType"
      :personInfo="personInfo"
      :hazardFactors="personInfo.hazard_factors || personInfo.hazardFactors"
      :hazardFactorsText="
        personInfo.hazard_factors_text || personInfo.hazardFactorsText
      "
      :isMultiple="isMultiple"
    >
    </drawer>
  </div>
</template>
<script>
import {
  getPositiveResultExaminationList,
  queryPositiveResultList,
  getPositiveResult,
} from "@/api/healthy/tPositiveResultList";
import { getTPositivePersonId } from "@/api/healthy/tPositivePerson";
import { getDictDataByType } from "../../../../api";
import tPositiveResult from "@/views/healthy/tPositiveResult/tPositiveResultList.vue";
import { changeNumToHan, formartDate, guid } from "../../../../api/tools/tool";
import positiveResult from "@/views/healthy/generalInspection/components/positiveResult.vue";

export default {
  components: {
    tPositiveResult,
    positiveResult,
  },
  name: "positiveRule",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    personInfo: {
      type: Object,
      default: {},
    },
    inspectForm: {
      type: Object,
      default: null,
    },
    doctorInfo: {
      type: Object,
      default: null,
    },
    inspectType: {
      type: String,
      default: "",
    },
    userArray: {
      //用户集合
      type: Array,
      default: [],
    },
    tableData: {
      //检查项目结果
      type: Array,
      default: [],
    },
    tDiseaseDiagnosis: {
      //疾病诊断
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      //疾病诊断
      diseaseDiagnosisForm: {
        isDiseaseOne: 0, //细菌性痢疾
        isDiseaseTwo: 0, //伤寒和副伤寒
        isDiseaseThree: 0, //病毒性肝炎（甲型、戊型）
        isDiseaseFour: 0, //活动性肺结核
        isDiseaseFive: 0, //化脓性或渗出性皮肤病
        isDiseaseSix: 0, //手癣、指甲癣
        isDiseaseSeven: 0, //手部湿疹
        isDiseaseEight: 0, //手部的银屑病或者鳞屑
      },

      disqualification: false,
      isMultiple: false,
      type: "",
      title: "",
      wordChooseShow: false,
      abnormalInfoValue: "1", //异常信息折叠板
      tableDataArray: [],
      abnormalInfo: "",
      PositiveResultId: "00DE59CCC6B147A1A16E1BEE01F717F0",
      personId: "",
      modalResult: false,
      physicalType: "",
      tPositiveResulShow: false,
      tabRow: "",
      row: [
        {
          personId: "",
          positiveName: "",
          positiveSuggestion: "",
          heavy: "",
          conclusionType: "",
        },
      ],
      rows: "",
      searchForm: {
        pageNumber: 1,
        pageSize: 100,
        name: "",
      },
      getTPositiveResultData: [],
      typeStatus: false,
      orderGroupItemProjectName: [],
      updatetPositiveResultShow: false,
      show: this.value,
      tPositivePersonForm: {
        id: "",
        positiveName: "",
        positiveSuggestion: "",
        heavy: "",
        conclusionType: "",
        personId: "",
        positivePersonData: [],
      },
      searchPositiveForm: {
        pageNumber: 1,
        pageSize: 20,
      },
      positiveData: [],
      conclusionType: [],
      positiveResultData: [],
      occupationalTaboo: "", //套餐目标职业禁忌证
      engageInData: [],
      isRadioChecked: "",
      tableLoading: false,
      summaryData: [],
      healthConditionList: [
        {
          title: "合格",
          value: "合格",
        },
        {
          title: "不合格",
          value: "不合格",
        },
      ], //健康证条件
      positiveColumns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                type: "ios-person",
              }),
              h("strong", params.row.name),
            ]);
          },
        },
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "名称",
          align: "center",
          width: 280,
          ellipsis: true,
          key: "positiveName",
          sortable: false,
          render: (h, params) => {
            return this.$createElement("div", [
              this.$createElement("Input", {
                props: {
                  value: params.row.positiveName,
                  type: "textarea",
                  rows: 1,
                },
                style: {
                  width: "240px",
                },
                on: {
                  input: (val) => {
                    params.row.positiveName = val;
                    this.getDataList(val);
                  },
                },
              }),
              this.$createElement(
                "Select",
                {
                  props: {
                    placeholder: "",
                    filterable: true,
                    value: params.row.positiveName,
                    transfer: true,
                  },
                  ref: "select" + params.index,
                  style: {
                    width: "30px",
                  },
                  on: {
                    "on-change": (e) => {
                      this.onchange(e); // 改变下拉框赋值
                    },
                  },
                },
                this.getTPositiveResultData.map((item) => {
                  // this.productTypeList下拉框里的data
                  return this.$createElement("Option", {
                    // 下拉框的值
                    props: {
                      value: item.id,
                      label: item.name,
                    },
                    style: {},
                  });
                })
              ),
            ]);
          },
        },
        {
          title: "结果建议",
          align: "center",
          minWidth: 300,
          ellipsis: true,
          tooltip: true,
          key: "positiveSuggestion",
          sortable: false,
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.positiveSuggestion,
                type: "textarea",
                rows: 6,
              },
              on: {
                input: (val) => {
                  params.row.positiveSuggestion = val;
                  this.positiveResultData[this.tabRow].positiveSuggestion = val;
                },
              },
            });
          },
        },
        {
          title: "重度",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
          key: "heavy",
          sortable: false,
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: params.row.heavy, // 获取选择的下拉框的值
                  transfer: true,
                },
                on: {
                  "on-change": (e) => {
                    params.row.categoryId = e; // 改变下拉框赋值
                    this.positiveResultData[this.tabRow].heavy = e;
                  },
                },
              },
              this.positiveData.map((item) => {
                // this.productTypeList下拉框里的data
                return h("Option", {
                  // 下拉框的值
                  props: {
                    value: item.value,
                    label: item.title,
                  },
                });
              })
            );
          },
        },
        {
          title: "结论类型",
          align: "center",
          minWidth: 180,
          ellipsis: true,
          tooltip: true,
          key: "conclusionType",
          sortable: false,
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: params.row.conclusionType, // 获取选择的下拉框的值
                  transfer: true,
                },
                on: {
                  "on-change": (e) => {
                    params.row.categoryId = e; // 改变下拉框赋值
                    this.positiveResultData[this.tabRow].conclusionType = e;
                  },
                },
              },
              this.conclusionType.map((item) => {
                // this.productTypeList下拉框里的data
                return h("Option", {
                  // 下拉框的值
                  props: {
                    value: item.value,
                    label: item.title,
                  },
                });
              })
            );
          },
        },
        {
          title: "排序",
          align: "center",
          slot: "action",
          width: 100,
        },
      ],
      doctorId: null, //选择的医生Id
    };
  },
  methods: {
    pick(val) {
      if (val == "合格") {
        this.disqualification = false;
      } else if (val == "不合格") {
        this.disqualification = true;
      }
    },
    //抽屉展示（术语选择）
    handleWordChoose(type) {
      if (type == "zjzybmc") {
        this.isMultiple = true;
        this.title = "主检结论";
      } else {
        this.isMultiple = false;
        this.title = "常用术语";
      }
      this.wordChooseShow = true;
      this.type = type;
    },

    //获取专业术语回调
    getSelectedWords(word, cType) {
      if (cType == "zjclyj") {
        if (word.indexOf("可继续从事") > -1) {
          let text = "可继续";
          if (
            this.personInfo.work_state_text &&
            this.personInfo.work_state_text.trim() == "上岗前"
          ) {
            text = "可";
          }
          this.inspectForm.handleOpinion +=
            text +
            "从事接触" +
            this.personInfo.hazard_factors_text +
            "岗位工作，加强个人防护，定期参加职业健康体检。";
        } else {
          this.inspectForm.handleOpinion += word;
        }
      } else if (cType == "zjzybmc") {
        this.inspectForm.conclusion += word[0].content;
        this.conclusionNow += word[0].content;
      } else if (cType == "zjqtjcycjg") {
        if (!this.otherExceptions) {
          this.otherExceptions = word;
        } else {
          this.otherExceptions = this.otherExceptions + "\n" + word;
        }
      } else if (cType == "qtjbycclyj") {
        this.inspectForm.careerIllnessName = word;
      } else if (cType == "zjzyjcycjg") {
        if (!this.inspectForm.conclusion) {
          this.inspectForm.conclusion = word;
        } else {
          this.inspectForm.conclusion += "\n" + word;
        }
      }
    },

    //拼接异常信息
    getAbnormalInfo: function () {
      this.abnormalInfo = "";
      if (this.tableDataArray && this.tableDataArray.length > 0) {
        let abnormalData = this.tableDataArray.filter(
          (aa) => aa.positive != "0"
        );
        if (abnormalData != null && abnormalData.length > 0) {
          for (let i = 0; i < abnormalData.length; i++) {
            let item = abnormalData[i];
            if (item) {
              //序号
              this.abnormalInfo =
                this.abnormalInfo + this.changeNum(i + 1) + "、";
              //内容
              this.abnormalInfo =
                this.abnormalInfo + item.diagnoseSum.replace(/\r|\n/gi, "");
              //换行
              this.abnormalInfo = this.abnormalInfo + "\r";
            }
          }
        } else {
          this.abnormalInfo = "一、未见异常";
        }
      } else {
        this.abnormalInfo = "一、未见异常";
      }
    },

    //将数字转为中文
    changeNum(num) {
      return changeNumToHan(num);
    },

    //异常结果汇总
    resultSummary() {
      this.personId = this.personInfo.id;
      this.modalResult = true;
    },
    //合并异常结果汇总
    mergeResult() {
      if (this.row.length <= 0 ||this.rows.toString().trim().length <= 0) {
        this.$Message.warning("请选择列表结果");
        return;
      }else if (this.row.length < 2) {
        this.$Message.warning("只少选择两个进行合并");
        return;
      }
      let _this = this;
      let positiveName = "";
      let positiveSuggestion = "";
      for (let i = 0; i < _this.positiveResultData.length; i++) {
        for (let j = 0; j < _this.row.length; j++) {
          if (_this.positiveResultData[i].id == this.row[j]) {
            positiveName+= _this.positiveResultData[i].positiveName +",";
          }
        }
      }
      positiveName = positiveName.substr(0,positiveName.length-1)

      for (let i = 0; i < _this.positiveResultData.length; i++) {
        for (let j = 0; j < _this.row.length; j++) {
          if (_this.positiveResultData[i].id == this.row[j]) {
            positiveSuggestion+= _this.positiveResultData[i].positiveSuggestion + "\n";
          }
        }
      }
      positiveSuggestion = positiveSuggestion.substr(0,positiveSuggestion.length-1)

      for (let i = 0; i < _this.positiveResultData.length; i++) {
        for (let j = 0; j < _this.row.length; j++) {
          if (_this.positiveResultData[i].id == this.row[j]) {
            _this.positiveResultData.splice(i, 1);
          }
        }
      }

      let item = {
        id: guid(),
        personId: this.personInfo.id,
        positiveName: positiveName,
        positiveSuggestion: positiveSuggestion,
        heavy: this.rows.heavy,
        conclusionType: this.rows.conclusionType,
      };
      this.positiveResultData.splice(this.rows, 0, item);
      this.rows = "";
    },

    rowClick(row, column) {
      this.tabRow = column;
    },

    //获取阳性结果
    onchange(v) {
      let _this = this;
      for (let i = 0; i < _this.getTPositiveResultData.length; i++) {
        if (_this.getTPositiveResultData[i].id == v) {
          _this.positiveResultData[this.tabRow].positiveSuggestion =
            _this.getTPositiveResultData[i].healthAdvice;
          _this.positiveResultData[this.tabRow].positiveName =
            _this.getTPositiveResultData[i].name;
          _this.positiveResultData[this.tabRow].heavy =
            _this.getTPositiveResultData[i].degree;
        }
      }
      this.$forceUpdate();
    },
    getDataList(val) {
      let _this = this;
      _this.searchForm.name = val;
      _this.positiveResultData[this.tabRow].positiveName = val;
      queryPositiveResultList(_this.searchForm).then((res) => {
        if (res.success) {
          _this.getTPositiveResultData = res.data.records;
        }
      });
      _this.$nextTick((_) => {
        _this.$refs["select" + _this.tabRow].toggleMenu();
      });
      /*debugger
                this.$nextTick(_ => { document.getElementById("select"+this.tabRow).toggleMenu(); });*/
    },

    arrowUp(index) {
      if (index != 0) {
        let newArr = this.swapItems(this.positiveResultData, index, index - 1);
        this.positiveResultData = newArr;
      }
    },
    arrowDown(index) {
      if (index != this.positiveResultData.length - 1) {
        let newArr = this.swapItems(this.positiveResultData, index, index + 1);
        this.positiveResultData = newArr;
      }
    },
    swapItems(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    onSelects(index) {
      this.row = [];
      for (let i = 0; i < index.length; i++) {
        this.row.push(index[i].id);
      }
    },
    onSelect(index, val) {
      this.rows = "";
      this.rows = val;
    },
    removes() {
      let _this = this;
      for (let i = 0; i < _this.positiveResultData.length; i++) {
        for (let j = 0; j < _this.row.length; j++) {
          if (_this.positiveResultData[i].id == this.row[j]) {
            _this.positiveResultData.splice(i, 1);
          }
        }
      }
      this.row = [];
    },
    //添加结果结果
    add() {
      let item = {
        id: guid(),
        personId: this.personInfo.id,
        positiveName: "",
        positiveSuggestion: "",
        heavy: "D",
        conclusionType: "主要健康问题",
      };
      this.positiveResultData.splice(this.positiveResultData.length, 0, item);
    },
    //拆分结果
    splice() {
      if (this.row.length <= 0 ||this.rows.toString().trim().length <= 0) {
        this.$Message.warning("请选择列表结果");
        return;
      } else if (this.row.length > 1) {
        this.$Message.warning("只能选择一个进行拆分");
        return;
      }
      let item = {
        id: guid(),
        personId: this.personInfo.id,
        positiveName: this.rows.positiveName,
        positiveSuggestion: this.rows.positiveSuggestion,
        heavy: this.rows.heavy,
        conclusionType: this.rows.conclusionType,
      };
      this.positiveResultData.splice(this.rows, 0, item);
      this.rows = "";
    },
    PositivResult() {
      this.tPositiveResulShow = true;
    },
    closeModal(val) {
      this.$emit("input", val);
    },
    getTPositivePersonId() {
      getTPositivePersonId({
        personId: this.personInfo.id,
        physicalType: this.physicalType,
      })
        .then((res) => {
          if (res.success) {
            this.positiveResultData = res.data;
            let anomaly = true;
            let _this = this;
            for (let i = 0; i < _this.tableData.length; i++) {
              if (!_this.checkPhysical(_this.tableData[i].diagnoseSum)) {
                anomaly = false;
                break;
              }
            }
            if (this.positiveResultData.length <= 0 && anomaly) {
              let item = {
                id: guid(),
                personId: this.personInfo.id,
                positiveName: "本次体检所查项目未发现异常",
                positiveSuggestion:
                  "本次体检所查项目未见明显异常，请定期检查。",
                heavy: "D",
                conclusionType: "主要健康问题",
              };
              this.positiveResultData.splice(this.rows, 0, item);
            }
          }
        })
        .finally(() => {
          this.comboLoading = false;
        });
    },
    //检查是否是正常的结论
    checkPhysical(name) {
      name = name.trim();
      name = name.replace(
        /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,
        ""
      );
      let physicalSummary = this.$hospitalName.physicalSummary;
      if (physicalSummary) {
        let res = false;
        physicalSummary.forEach((ii) => {
          if (
            name == ii ||
            name == ii + "。" ||
            name.indexOf("未见异常") > -1 ||
            name.indexOf("正常") > -1
          ) {
            res = true;
          }
        });
        return res;
      }
      return false;
    },
    //检查医生选择
    doctorSelectChange(e) {
      if (e) {
        let docker = this.userArray.filter((aa) => aa.id == e.value);
        if (docker && docker.length > 0) {
          let selectDocker = docker[0];
          if (selectDocker) {
            this.inspectForm.inspectionDoctor = selectDocker.nickname; //总检医生名字
            this.inspectForm.createId = selectDocker.id; //总检医生Id
            //总检医生签名
            if (
              selectDocker.autographFile &&
              selectDocker.autographFile.indexOf("/dcm") > -1
            ) {
              this.inspectForm.inspectionAutograph = selectDocker.autographFile;
            } else {
              this.inspectForm.inspectionAutograph =
                "data:image/png;base64," + selectDocker.autograph;
            }
          }
        }
      }
    },

    //回调 阳性结果
    getPositiveResultData() {
      return this.positiveResultData;
    },

    //回调 疾病诊断
    getDiseaseDiagnosisData() {
      return this.diseaseDiagnosisForm;
    },
  },
  watch: {
    "personInfo.id"(val) {
      if (val) {
        if (this.inspectType) {
          this.physicalType = this.inspectType;
        } else {
          this.physicalType = this.personInfo.physical_type;
        }
        if (this.tDiseaseDiagnosis) {
          this.diseaseDiagnosisForm = this.tDiseaseDiagnosis;
        } else {
          this.diseaseDiagnosisForm = {
            isDiseaseOne: 0, //细菌性痢疾
            isDiseaseTwo: 0, //伤寒和副伤寒
            isDiseaseThree: 0, //病毒性肝炎（甲型、戊型）
            isDiseaseFour: 0, //活动性肺结核
            isDiseaseFive: 0, //化脓性或渗出性皮肤病
            isDiseaseSix: 0, //手癣、指甲癣
            isDiseaseSeven: 0, //手部湿疹
            isDiseaseEight: 0, //手部的银屑病或者鳞屑
          };
        }
        this.getTPositivePersonId();
        let _this = this;
        getDictDataByType("positive").then((res) => {
          if (res.success) {
            _this.positiveData = res.data;
          }
        });
        //结论类型
        getDictDataByType("conclusion_type").then((res) => {
          if (res.success) {
            _this.conclusionType = res.data;
          }
        });
        this.doctorId = this.doctorInfo.id;
      } else {
        this.closeModal();
      }
    },

    inspectType(val) {
      if (val) {
        this.physicalType = val;
      }
    },

    tableData(val) {
      this.tableDataArray = val;
      if (val && val.length > 0) {
        let _this = this;
        setTimeout(function () {
          _this.getAbnormalInfo();
        }, 100);
      }
    },

    positiveResultData: {
      handler(val, o) {
        if (val) {
          this.$emit("getPositiveResultData", val);
        }
      },
      deep: true, // 深度监听父组件传过来对象变化
    },
    "inspectForm.personId"(val) {
      let _this = this;
      this.pick("合格");
      if (
        _this.inspectForm &&
        _this.inspectForm.createId &&
        _this.inspectForm.createId.toString().trim().length > 0
      ) {
        setTimeout(function () {
          _this.doctorId = _this.inspectForm.createId;
        }, 1000);
      } else {
        this.doctorId = this.doctorInfo.id;
      }
    },
    tDiseaseDiagnosis(val) {
      let _this = this;
      if (val && val.toString().trim().length > 0) {
        _this.diseaseDiagnosisForm = val;
      } else {
        _this.diseaseDiagnosisForm = {
          isDiseaseOne: 0, //细菌性痢疾
          isDiseaseTwo: 0, //伤寒和副伤寒
          isDiseaseThree: 0, //病毒性肝炎（甲型、戊型）
          isDiseaseFour: 0, //活动性肺结核
          isDiseaseFive: 0, //化脓性或渗出性皮肤病
          isDiseaseSix: 0, //手癣、指甲癣
          isDiseaseSeven: 0, //手部湿疹
          isDiseaseEight: 0, //手部的银屑病或者鳞屑
        };
      }
    },
    "inspectForm.conclusion"(val) {},
  },
};
</script>

<style lang="less">
.positiveRule {
  .ivu-table-cell-ellipsis {
    padding: 2px;
  }

  .ivu-table-body::-webkit-scrollbar {
    width: 4px;
  }

  .ivu-table-body::-webkit-scrollbar-track {
    background-color: #e4e4e4;
    border-radius: 100px;
  }

  .ivu-table-body::-webkit-scrollbar-thumb {
    background-color: #2684e780;
    border-radius: 100px;
  }

  textarea::-webkit-scrollbar {
    width: 4px;
  }

  textarea::-webkit-scrollbar-track {
    background-color: #e4e4e4;
    border-radius: 100px;
  }

  textarea::-webkit-scrollbar-thumb {
    background-color: #2684e780;
    border-radius: 100px;
  }
}

.tPositiveResultModal {
  .ivu-modal {
    height: 80% !important;
  }

  .ivu-modal-content {
    height: 100%;
  }

  .ivu-modal-body {
    height: 100%;
  }
}
</style>