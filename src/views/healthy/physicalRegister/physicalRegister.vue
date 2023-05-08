<template>
  <div class="physicalRegister">
    <Row style="height: 100%; flex-wrap: nowrap">
      <Col :style="leftSpan" v-if="expand">
        <Card style="height: 100%; overflow: hidden">
          <Alert class="alert">人员查询</Alert>
          <div style="display: flex; justify-content: space-between">
            <RadioGroup
              v-model="feeStatus"
              v-if="physicalType == '从业体检'"
              @on-change="feeStatusChange"
              style="margin-bottom: 10px; margin-left: 5px"
            >
              <Radio label="未确认"></Radio>
              <Radio label="已确认"></Radio>
            </RadioGroup>
            <RadioGroup
              v-model="passStatus"
              v-else
              @on-change="statusChange"
              style="margin-bottom: 10px; margin-left: 5px"
            >
              <Radio label="未登记"></Radio>
              <Radio label="已登记"></Radio>
            </RadioGroup>
            <i-switch size="large" @on-change="typeChange" v-model="typeStatus">
              <span slot="open">复查</span>
              <span slot="close">非复查</span>
            </i-switch>
          </div>
          <div style="display: flex; flex-wrap: nowrap; align-items: center">
            <RadioGroup
              v-if="
                queryTime && (passStatus == '已登记' || feeStatus == '已确认')
              "
              type="button"
              size="small"
              class="btngroup"
              button-style="solid"
              v-model="date"
            >
              <Radio
                label="当日"
                @click.native.prevent="radioClick('当日')"
              ></Radio>
              <Radio
                label="当月"
                @click.native.prevent="radioClick('当月')"
              ></Radio>
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
                      @click.native.prevent="radioClick('自定义')"
                    ></Radio>
                  </template>
                </div>
              </DatePicker>
            </RadioGroup>
            <span
              class="resetBtn"
              v-if="
                queryTime && (passStatus == '已登记' || feeStatus == '已确认')
              "
              style="cursor: pointer"
              @click="resetClick"
              >重置</span
            >
            <div
              v-if="
                !queryTime && (passStatus == '已登记' || feeStatus == '已确认')
              "
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
                v-model="searchForm.startDate"
                placeholder="开始时间"
              />
              &nbsp;~&nbsp;
              <DatePicker
                type="date"
                transfer
                @on-change="datePickerEndTime"
                v-model="searchForm.endDate"
                placeholder="结束时间"
              />
            </div>
          </div>
          <!--<Input suffix="ios-search" v-model="searchForm.keyword" placeholder="请输入关键字" style="margin-bottom: 10px;" clearable
                           @on-clear="inputSearchChange('')"
                           @keypress.native.enter="inputSearchChange"/>-->
          <Input
            v-model="searchForm.personName"
            placeholder="请输入姓名"
            @on-clear="inputSearchChange('')"
            @keypress.native.enter="inputSearchChange"
            style="margin-bottom: 10px"
            clearable
          />
          <Input
            v-if="!queryTime"
            v-model="searchForm.idCard"
            placeholder="请输入身份证号"
            @on-clear="inputSearchChange('')"
            @keypress.native.enter="inputSearchChange"
            style="margin-bottom: 10px"
            v-show="drop"
            clearable
          />
          <Input
            v-else
            v-model="searchForm.idCard"
            placeholder="请输入身份证号"
            @on-clear="inputSearchChange('')"
            @keypress.native.enter="inputSearchChange"
            style="margin-bottom: 10px"
            clearable
          />
          <Input
            v-model="searchForm.testNum"
            placeholder="请输入体检编号"
            @on-clear="inputSearchChange('')"
            @keypress.native.enter="inputSearchChange"
            style="margin-bottom: 10px"
            clearable
            v-if="drop"
          ></Input>
          <Input
            v-model="searchForm.dept"
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
          <Button
            v-if="
              !queryTime && (passStatus == '已登记' || feeStatus == '已确认')
            "
            @click="resetClick"
            size="small"
            >重置</Button
          >
          <a class="drop-down" @click="dropDown">
            {{ dropDownContent }}
            <Icon :type="dropDownIcon"></Icon>
          </a>
          <!--左侧套餐列-->
          <Row
            :style="{
              height:
                passStatus == '已登记'
                  ? 'calc(100% - ' + height1 + ')'
                  : 'calc(100% - ' + height2 + ')',
            }"
            style="justify-content: center"
            v-if="personData.length > 0"
          >
            <RadioGroup class="radio-group" v-model="isRadioChecked">
              <Row
                class="row-border"
                v-for="(item, index) in personData"
                :key="index"
                @click.native="radioChooseClick(item.id, item.registDate)"
              >
                <Col :span="4" class="radio-group-radio">
                  <Radio :label="item.id" :disabled="showRadio"></Radio>
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
                  <div style="margin-right: 10px">{{ item.sex }}</div>
                  <div>{{ item.age }}</div>
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
            <Page
              v-if="personData.length > 0"
              :current="searchForm.pageNumber"
              :total="personTotal"
              simple
              @on-change="personChangePageNum"
            />
          </Row>
          <no-data v-if="personData.length == 0"></no-data>
          <Spin fix v-if="checkPersonLoading">
            <Icon
              type="ios-loading"
              size="18"
              class="demo-spin-icon-load"
            ></Icon>
            <div>加载中...</div>
          </Spin>
        </Card>
      </Col>
      <div class="expand">
        <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand" />
      </div>
      <Col :style="span" style="height: 100%; overflow: hidden">
        <Card v-if="physicalType == '职业体检' || physicalType == '放射体检'">
          <Form
            class="topForm"
            ref="personParam"
            :model="personParam"
            :rules="personParamRule"
          >
            <Row :gutter="10" style="flex-wrap: nowrap">
              <Col span="3" style="min-width: 160px">
                <div class="pic">
                  <div
                    class="pic-box"
                    :style="{
                      border: personInfo.avatar ? '0 !important;' : 'auto',
                    }"
                    @click.stop="photograph"
                  >
                    <Icon
                      type="ios-add"
                      size="24"
                      color="#2988f3"
                      v-if="!personInfo.avatar"
                    />
                    <template v-else>
                      <img
                        :src="personInfo.avatar"
                        style="height: 100%; width: 100%"
                      />
                      <div class="demo-upload-list-cover">
                        <Icon
                          type="ios-eye-outline"
                          @click.native.stop="handleView(personInfo.avatar)"
                        ></Icon>
                        <Icon
                          type="ios-trash-outline"
                          @click.native.stop="handleRemove()"
                        ></Icon>
                      </div>
                    </template>
                    <span
                      style="
                        height: auto;
                        line-height: 0;
                        margin-top: 30px;
                        color: #2988f3;
                      "
                      v-if="!personInfo.avatar"
                      >人脸采集</span
                    >
                  </div>
                </div>
              </Col>
              <Col
                span="21"
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  margin-left: -20px;
                "
              >
                <Row
                  style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                  "
                >
                  <Col span="24">
                    <div class="wrap">
                      <step :index="currentIndex"></step>
                    </div>
                  </Col>
                </Row>
                <Row :gutter="20">
                  <Col :span="6">
                    <FormItem label="体检编号">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.testNum"
                        placeholder="提交后系统自动生成"
                        clearable
                        disabled
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem label="身份证号" prop="idCard">
                      <Input
                        type="text"
                        class="input"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        v-model="personParam.idCard"
                        @on-blur="idCardChange"
                        placeholder="请输入身份证号"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem :label="setLabel('姓名')" prop="personName">
                      <Input
                        type="text"
                        class="input"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        v-model="personParam.personName"
                        placeholder="请输入姓名"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem :label="setLabel('性别')" prop="sex">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.sex"
                        placeholder="性别"
                        readonly
                      >
                      </Input>
                    </FormItem>
                  </Col>

                  <Col :span="6">
                    <FormItem :label="setLabel('年龄')" prop="age">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.age"
                        placeholder="年龄"
                        readonly
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem label="体检类型" prop="physicalType">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.physicalType"
                        placeholder="体检类型"
                        readonly
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem label="联系电话" prop="mobile">
                      <Input
                        type="text"
                        class="input"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        v-model="personParam.mobile"
                        placeholder="联系电话"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem
                      label="单位名称"
                      v-if="isUpdateUnitName"
                      prop="unitId"
                    >
                      <Select
                        v-model="personParam.unitId"
                        :filterable="true"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        label-in-value
                        class="input"
                        @on-select="onOrderSelectChange"
                        transfer
                      >
                        <Option
                          v-for="(item, index) in unitArr"
                          :key="index"
                          :value="item.id"
                          :tag="index"
                          :label="item.name"
                        >
                          {{ item.name }}
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem
                      label="单位名称"
                      v-if="isUpdateUnitNameGroup"
                      prop="unitId"
                    >
                      <Select
                        v-model="personParam.unitId"
                        :filterable="true"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        label-in-value
                        class="input"
                        @on-select="onOrderSelectChangeGroup"
                        transfer
                      >
                        <Option
                          v-for="(item, index) in orderArr"
                          :key="index"
                          :value="item.groupUnitId"
                          :tag="item.id"
                          :label="item.groupUnitName"
                        >
                          {{ item.groupUnitName + "-" + item.orderCode }}
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem
                      label="单位名称"
                      v-if="!isUpdateUnitName && !isUpdateUnitNameGroup"
                      prop="unitId"
                    >
                      <!--<Select disabled v-model="personParam.unitId" :filterable="true" :readonly="searchForm.isPass == 99 ? true:false"
                                                    label-in-value
                                                    class="input" @on-select="onOrderSelectChange" transfer>
                                                <Option v-for="(item,index) in unitArr" :key="index" :value="item.id" :tag="item.groupUnitId"
                                                        :label="item.name">
                                                    {{ item.name }}
                                                </Option>
                                            </Select>-->
                      <Input
                        type="text"
                        class="input"
                        :readonly="true"
                        v-model="personParam.dept"
                        placeholder="单位名称"
                      >
                      </Input>
                    </FormItem>
                  </Col>

                  <Col span="6">
                    <FormItem label="危害因素">
                      <!--                                            <Input class="input" @on-focus="handleHarmSelect" v-model="personParam.hazardFactorsText" placeholder="请先选择套餐" >-->
                      <Input
                        class="input"
                        :disabled="true"
                        v-model="personParam.hazardFactorsText"
                        v-if="!isUpdateUnitNameGroup"
                        placeholder="选择套餐后自动生成"
                      >
                      </Input>
                      <Input
                        class="input"
                        :disabled="true"
                        v-model="personParam.hazardFactorsText"
                        v-if="isUpdateUnitNameGroup"
                        placeholder="选择分组后自动填充"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col
                    span="6"
                    v-if="
                      personParam.hazardFactors &&
                      (personParam.hazardFactors.indexOf('110999') > -1 ||
                        personParam.hazardFactors.indexOf('120999') > -1 ||
                        personParam.hazardFactors.indexOf('130999') > -1 ||
                        personParam.hazardFactors.indexOf('140999') > -1 ||
                        personParam.hazardFactors.indexOf('150999') > -1 ||
                        personParam.hazardFactors.indexOf('160999') > -1)
                    "
                  >
                    <FormItem label="其他危害因素" prop="otherHazardFactors">
                      <Input
                        type="text"
                        v-model="personParam.otherHazardFactors"
                        placeholder="请输入其他危害因素名称，多个逗号“，”分隔"
                        :readonly="personParam.isPass == 2"
                      />
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="工种名称" prop="workTypeText">
                      <Input
                        type="text"
                        v-if="searchForm.isPass == 1"
                        class="input"
                        @click.native="handleWorkCode"
                        :disabled="personParam.isPass == 2"
                        v-model="personParam.workTypeText"
                        placeholder="工种名称"
                      >
                      </Input>
                      <Input
                        type="text"
                        v-else
                        class="input"
                        :readonly="true"
                        v-model="personParam.workTypeText"
                        placeholder="工种名称"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col
                    span="6"
                    v-if="
                      personParam.workTypeCode &&
                      (personParam.workTypeCode.indexOf('0014') > -1 ||
                        personParam.workTypeCode.indexOf('0033') > -1 ||
                        personParam.workTypeCode.indexOf('999999') > -1)
                    "
                  >
                    <FormItem label="工种其他名称" prop="workName">
                      <Input
                        type="text"
                        v-model="personParam.workName"
                        placeholder="请输入工种其他名称"
                        :readonly="personParam.isPass == 2"
                      />
                    </FormItem>
                  </Col>

                  <Col span="6">
                    <!--<FormItem label="检查种类" prop="workStateCode">
                                            <Select  :readonly="true" v-model="personParam.workStateCode" placeholder="请先选择套餐" @on-select="onWorkStateSelectChange"  transfer  label-in-value @on-change="workChange">
                                                <Option v-for="(item,index) in workStateCodeArr" :key="item.id" :value="item.value">
                                                    {{ item.title }}
                                                </Option>
                                            </Select>
                                        </FormItem>-->
                    <FormItem label="检查种类">
                      <Input
                        class="input"
                        :disabled="true"
                        v-if="!isUpdateUnitNameGroup"
                        v-model="personParam.workStateText"
                        placeholder="选择套餐后自动生成"
                      >
                      </Input>
                      <Input
                        class="input"
                        :disabled="true"
                        v-if="isUpdateUnitNameGroup"
                        v-model="personParam.workStateText"
                        placeholder="选择分组后自动生成"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <!--<FormItem v-if="!isUpdateUnitNameGroup" label="分组名称">
                                            <Input type="text" class="input" :disabled="true"
                                                   v-model="personParam.groupName" placeholder="选择套餐后自动生成">
                                            </Input>
                                        </FormItem>
                                        <FormItem label="分组名称" v-if="isUpdateUnitNameGroup">
                                            <Select v-model="personParam.groupId" placeholder="请先选择单位" :filterable="true" clearable @on-clear="clearGroupId" :readonly="searchForm.isPass == 99 ? true:false"
                                                    label-in-value
                                                    class="input" @on-select="changeGroup" transfer>
                                                <Option v-for="(item,index) in groupByOrderData" :key="index" :value="item.id" :tag="item"
                                                        :label="item.name">
                                                    {{ item.name }}
                                                </Option>
                                            </Select>
                                        </FormItem>-->
                    <FormItem
                      v-if="
                        personParam.sporadicPhysical &&
                        personParam.sporadicPhysical == '1'
                      "
                      label="分组名称"
                    >
                      <Input
                        type="text"
                        class="input"
                        :disabled="true"
                        v-model="personParam.groupName"
                        placeholder="选择套餐后自动生成"
                      >
                      </Input>
                    </FormItem>
                    <FormItem label="分组名称" v-else>
                      <Select
                        v-model="personParam.groupId"
                        placeholder="请先选择单位"
                        :filterable="true"
                        clearable
                        @on-clear="clearGroupId"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        label-in-value
                        class="input"
                        @on-select="changeGroup"
                        transfer
                      >
                        <Option
                          v-for="(item, index) in groupByOrderData"
                          :key="index"
                          :value="item.id"
                          :tag="item"
                          :label="item.name"
                        >
                          {{ item.name }}
                        </Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="婚姻状态">
                      <Select
                        transfer
                        v-model="personParam.isMarry"
                        placeholder="请选择"
                      >
                        <Option
                          v-for="(item, i) in marriageArr"
                          :value="item.title"
                          >{{ item.title }}</Option
                        >
                      </Select>
                    </FormItem>
                  </Col>

                  <Col :span="6" v-if="passStatus == '已登记'">
                    <FormItem label="登记时间">
                      <Input
                        :disabled="true"
                        v-model="
                          personInfo.regist_date || personInfo.registDate
                        "
                      ></Input>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <!--                        <br/>-->
            <Row :gutter="20" style="margin-top: 15px">
              <Col>
                <Button
                  @click="updateShow = true"
                  type="warning"
                  icon="ios-create-outline"
                  style="width: 150px"
                  :disabled="!personInfo.id"
                  v-if="!isUpdateUnitName && !isUpdateUnitNameGroup"
                  >修改信息
                </Button>
                <Button
                  @click="addHealthPerson"
                  v-if="
                    isShowAloneAddButton &&
                    searchForm.isPass != 99 &&
                    !typeStatus &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup
                  "
                  type="primary"
                  icon="md-add"
                  style="width: 110px"
                  >零星新增
                </Button>
                <Button
                  @click="addHealthPersonGroup"
                  v-if="
                    searchForm.isPass != 99 &&
                    !typeStatus &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup
                  "
                  type="primary"
                  icon="md-add"
                  style="width: 110px"
                  >团检新增
                </Button>
                <Button
                  @click="deleteTGroupPerson"
                  type="error"
                  icon="md-trash"
                  :disabled="!personInfo.id"
                  v-if="
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup &&
                    ((personInfo && personInfo.id) ||
                      (personData && personData.length == 0))
                  "
                  >删除</Button
                >
                <Button
                  @click="readIdCard"
                  type="primary"
                  :loading="readShow"
                  icon="md-add"
                  style="width: 150px"
                  >读取二代身份证</Button
                >
                <Button
                  @click="saveHealthPerson"
                  v-if="
                    !typeStatus &&
                    (saveShow || personParam.id) &&
                    passStatus == '未登记'
                  "
                  :loading="saveLoading"
                  type="primary"
                  icon="md-play"
                  >保存信息
                </Button>
                <Button
                  @click="updatePerson"
                  type="primary"
                  icon="ios-clipboard"
                  style="width: 150px"
                  v-if="
                    !showPrint &&
                    personInfo.avatar &&
                    personInfo.id &&
                    !showPrint &&
                    personInfo.id &&
                    searchForm.isPass == 1 &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup
                  "
                  >确认登记
                </Button>
                <Button
                  @click="printInspectionSheet"
                  type="primary"
                  icon="md-print"
                  style="width: 150px"
                  v-if="
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup &&
                    ((showPrint && personInfo.avatar) ||
                      searchForm.isPass == 99 ||
                      isReviewer ||
                      isShowRegisterButton)
                  "
                  >打印导检单
                </Button>
                <Button
                  type="primary"
                  icon="md-checkbox-outline"
                  @click="handleComplete"
                  v-if="
                    ((showPrint && personInfo.avatar) ||
                      searchForm.isPass == 99) &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup
                  "
                  >收单
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card v-if="physicalType == '从业体检'">
          <Form
            class="personForm"
            ref="personParam"
            :model="personParam"
            :rules="personParamRule"
            in-line
            :label-width="80"
          >
            <Row :gutter="10" style="flex-wrap: nowrap">
              <Col span="3" style="min-width: 160px">
                <div class="pic">
                  <div
                    class="pic-box"
                    :style="{
                      border: personParam.avatar ? '0 !important;' : 'auto',
                    }"
                    @click.stop="photograph"
                  >
                    <Icon
                      type="ios-add"
                      size="24"
                      color="#2988f3"
                      v-if="!personParam.avatar"
                    />
                    <template v-else>
                      <img
                        :src="personParam.avatar"
                        style="height: 100%; width: 100%"
                      />
                      <div class="demo-upload-list-cover">
                        <Icon
                          type="ios-eye-outline"
                          @click.native.stop="handleView(personParam.avatar)"
                        ></Icon>
                        <Icon
                          type="ios-trash-outline"
                          @click.native.stop="handleRemove()"
                        ></Icon>
                      </div>
                    </template>
                    <span
                      style="
                        height: auto;
                        line-height: 0;
                        margin-top: 30px;
                        color: #2988f3;
                      "
                      v-if="!personParam.avatar"
                      >人脸采集</span
                    >
                  </div>
                </div>
              </Col>
              <Col
                span="21"
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  margin-left: -20px;
                "
              >
                <Row
                  style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                  "
                >
                  <Col span="24">
                    <div class="wrap">
                      <step :index="currentIndex"></step>
                    </div>
                  </Col>
                </Row>
                <Row :gutter="20">
                  <Col :span="6">
                    <FormItem label="体检编号">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.testNum"
                        placeholder="提交后系统自动生成"
                        clearable
                        disabled
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem label="身份证号" prop="idCard">
                      <Input
                        type="text"
                        class="input"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        v-model="personParam.idCard"
                        @on-blur="idCardChange"
                        placeholder="请输入身份证号"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem :label="setLabel('姓名')" prop="personName">
                      <Input
                        type="text"
                        class="input"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        v-model="personParam.personName"
                        placeholder="请输入姓名"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem :label="setLabel('性别')" prop="sex">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.sex"
                        placeholder="性别"
                        readonly
                      >
                      </Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row :gutter="20">
                  <Col :span="6">
                    <FormItem :label="setLabel('年龄')" prop="age">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.age"
                        placeholder="年龄"
                        readonly
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem label="体检类型" prop="physicalType">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.physicalType"
                        placeholder="体检类型"
                        readonly
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem label="联系电话" prop="mobile">
                      <Input
                        type="text"
                        class="input"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        v-model="personParam.mobile"
                        placeholder="联系电话"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem label="单位名称" v-if="isUpdateUnitName">
                      <Select
                        v-model="orderInfo.groupUnitId"
                        :filterable="true"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        label-in-value
                        class="input"
                        @on-select="unitSelect"
                        transfer
                      >
                        <Option
                          v-for="(item, index) in unitArr"
                          :key="index"
                          :value="item.id"
                        >
                          {{ item.name }}
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem
                      label="单位名称"
                      v-if="!isUpdateUnitName"
                      prop="unitId"
                    >
                      <!--<Select disabled v-model="orderInfo.groupUnitId" :filterable="true"
                                                    :readonly="searchForm.isPass == 99 ? true:false" label-in-value
                                                    class="input"
                                                    @on-select="unitSelect" transfer>
                                                <Option v-for="(item,index) in unitArr" :key="index" :value="item.id">
                                                    {{ item.name }}
                                                </Option>
                                            </Select>-->
                      <Input
                        type="text"
                        class="input"
                        :readonly="true"
                        v-model="personParam.dept"
                        placeholder="单位名称"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="婚姻状态">
                      <Select
                        transfer
                        v-model="personParam.isMarry"
                        placeholder="请选择"
                      >
                        <Option
                          v-for="(item, i) in marriageArr"
                          :value="item.title"
                          :key="item.title"
                          >{{ item.title }}</Option
                        >
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="从业类别" prop="certificateType">
                      <Select
                        transfer
                        v-model="personParam.certificateType"
                        placeholder="请选择"
                      >
                        <Option
                          v-for="item in certificateTypeArr"
                          :value="item.value"
                          :key="item.title"
                          >{{ item.title }}</Option
                        >
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="民族" prop="nation">
                      <Select
                        transfer
                        v-model="personParam.nation"
                        placeholder="请选择"
                      >
                        <Option
                          v-for="item in nationArr"
                          :value="item.value"
                          :key="item.title"
                          >{{ item.title }}</Option
                        >
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="出生日期" prop="birth">
                      <DatePicker type="date"
                                  transfer
                                  :disabled="disabled"
                                  placeholder="请选择"
                                  style="width: 100%;"
                                  format="yyyy-MM-dd"
                                  v-model="personParam.birth"/>
                    </FormItem>
                  </Col>
                  <Col :span="6" v-if="feeStatus == '已确认'">
                    <FormItem label="登记时间">
                      <Input
                        :disabled="true"
                        v-model="
                          personInfo.regist_date || personInfo.registDate
                        "
                      ></Input>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <!--                        <br/>-->
            <Row :gutter="20" style="margin-top: 15px">
              <Col>
                <Button
                  @click="updateShow = true"
                  type="warning"
                  icon="ios-create-outline"
                  style="width: 150px"
                  :disabled="personInfo.id ? false : true"
                  v-if="!isUpdateUnitName && !isUpdateUnitNameGroup"
                  >修改信息
                </Button>

                <!--<Button @click="addHealthPerson" v-if="searchForm.isPass != 99 && !typeStatus" type="primary" icon="md-add"
                                        style="width: 80px">新增
                                </Button>-->
                <Button
                  @click="addPerson"
                  v-if="
                    searchForm.isPass != 99 && !typeStatus && !isUpdateUnitName
                  "
                  type="primary"
                  icon="md-add"
                  style="width: 80px"
                  >新增
                </Button>
                <Button
                  @click="deleteTGroupPerson"
                  type="error"
                  icon="md-trash"
                  :disabled="!personInfo.id"
                  v-if="
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup &&
                    ((personInfo && personInfo.id) ||
                      (personData && personData.length == 0))
                  "
                  >删除</Button
                >
                <Button
                  @click="readIdCard"
                  :loading="readShow"
                  type="primary"
                  icon="md-add"
                  style="width: 150px"
                  >读取二代身份证</Button
                >
                <Button
                  @click="savePersonInfo"
                  v-if="
                    passStatus == '未登记' &&
                    !typeStatus &&
                    searchForm.isPass != 99 &&
                    (saveShow || personInfo.id)
                  "
                  :loading="saveLoading"
                  type="primary"
                  icon="md-play"
                  >保存信息
                </Button>
                <!--<Button @click="saveHealthPerson" v-if="!typeStatus && (saveShow || personParam.id)"
                                        :loading="saveLoading"
                                        type="primary" icon="md-play">保存信息
                                </Button>-->
                <Button
                  @click="updateRegisterPerson"
                  type="primary"
                  icon="ios-clipboard"
                  style="width: 110px"
                  v-if="
                    !showPrint &&
                    personInfo.id &&
                    personParam.avatar &&
                    searchForm.isPass == 1 &&
                    !isReviewer &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup
                  "
                  >确认登记
                </Button>
                <Button
                  @click="updatePerson"
                  type="primary"
                  icon="ios-clipboard"
                  style="width: 110px"
                  v-if="
                    !showPrint &&
                    personInfo.id &&
                    personParam.avatar &&
                    searchForm.isPass == 1 &&
                    isReviewer &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup
                  "
                  >确认登记
                </Button>
                <Button
                  @click="printInspectionSheet"
                  type="primary"
                  icon="md-print"
                  style="width: 150px"
                  v-if="
                    ((showPrint && searchForm.isPass == 1) ||
                      searchForm.isPass == 99 ||
                      isReviewer ||
                      isShowRegisterButton) &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup
                  "
                  >打印导检单
                </Button>
                <Button
                  @click="updateOrderInfo"
                  type="success"
                  icon="ios-clipboard"
                  style="width: 110px"
                  v-if="
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup &&
                    isShowConfirmPayment &&
                    showPrint &&
                    personParam.avatar &&
                    orderInfo.payStatus == 0 &&
                    !payStatus &&
                    (searchForm.isPass == 99 || searchForm.isPass == 1)
                  "
                >
                  确认缴费
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card v-if="physicalType == '健康体检'">
          <Form
            class="personForm"
            ref="personParam"
            :model="personParam"
            :rules="personParamRule"
            in-line
            :label-width="80"
          >
            <Row :gutter="10" style="flex-wrap: nowrap">
              <Col span="3" style="min-width: 160px">
                <div class="pic">
                  <div
                    class="pic-box"
                    :style="{
                      border: personParam.avatar ? '0 !important;' : 'auto',
                    }"
                    @click.stop="photograph"
                  >
                    <Icon
                      type="ios-add"
                      size="24"
                      color="#2988f3"
                      v-if="!personParam.avatar"
                    />
                    <template v-else>
                      <img
                        :src="personParam.avatar"
                        style="height: 100%; width: 100%"
                      />
                      <div class="demo-upload-list-cover">
                        <Icon
                          type="ios-eye-outline"
                          @click.native.stop="handleView(personParam.avatar)"
                        ></Icon>
                        <Icon
                          type="ios-trash-outline"
                          @click.native.stop="handleRemove()"
                        ></Icon>
                      </div>
                    </template>
                    <span
                      style="
                        height: auto;
                        line-height: 0;
                        margin-top: 30px;
                        color: #2988f3;
                      "
                      v-if="!personParam.avatar"
                      >人脸采集</span
                    >
                  </div>
                </div>
              </Col>
              <Col
                span="21"
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  margin-left: -20px;
                "
              >
                <Row
                  style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                  "
                >
                  <Col span="24">
                    <div class="wrap">
                      <step :index="currentIndex"></step>
                    </div>
                  </Col>
                </Row>
                <Row :gutter="20">
                  <Col :span="6">
                    <FormItem label="体检编号">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.testNum"
                        placeholder="提交后系统自动生成"
                        clearable
                        disabled
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem label="身份证号" prop="idCard">
                      <Input
                        type="text"
                        class="input"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        v-model="personParam.idCard"
                        @on-blur="idCardChange"
                        placeholder="请输入身份证号"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem :label="setLabel('姓名')" prop="personName">
                      <Input
                        type="text"
                        class="input"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        v-model="personParam.personName"
                        placeholder="请输入姓名"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem :label="setLabel('性别')" prop="sex">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.sex"
                        placeholder="性别"
                        readonly
                      >
                      </Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row :gutter="20">
                  <Col :span="6">
                    <FormItem :label="setLabel('年龄')" prop="age">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.age"
                        placeholder="年龄"
                        readonly
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem label="体检类型" prop="physicalType">
                      <Input
                        type="text"
                        class="input"
                        v-model="personParam.physicalType"
                        placeholder="体检类型"
                        readonly
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem label="联系电话" prop="mobile">
                      <Input
                        type="text"
                        class="input"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        v-model="personParam.mobile"
                        placeholder="联系电话"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col :span="6">
                    <FormItem label="单位名称" v-if="isUpdateUnitName">
                      <Select
                        v-model="personParam.unitId"
                        :filterable="true"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        label-in-value
                        class="input"
                        @on-select="onOrderSelectChange"
                        transfer
                      >
                        <Option
                          v-for="(item, index) in unitArr"
                          :key="index"
                          :value="item.id"
                          :label="item.name"
                        >
                          {{ item.name }}
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem
                      label="单位名称"
                      v-if="isUpdateUnitNameGroup"
                      prop="unitId"
                    >
                      <Select
                        v-model="personParam.unitId"
                        :filterable="true"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        label-in-value
                        class="input"
                        @on-select="onOrderSelectChangeGroup"
                        transfer
                      >
                        <Option
                          v-for="(item, index) in orderArr"
                          :key="index"
                          :value="item.groupUnitId"
                          :tag="item.id"
                          :label="item.groupUnitName"
                        >
                          {{ item.groupUnitName + "-" + item.orderCode }}
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem
                      label="单位名称"
                      v-if="!isUpdateUnitName && !isUpdateUnitNameGroup"
                    >
                      <!--<Select disabled v-model="personParam.unitId" :filterable="true" :readonly="searchForm.isPass == 99 ? true:false"
                                                    label-in-value
                                                    class="input" @on-select="onOrderSelectChange" transfer>
                                                <Option v-for="(item,index) in unitArr" :key="index" :value="item.id" :tag="item.groupUnitId"
                                                        :label="item.name">
                                                    {{ item.name }}
                                                </Option>
                                            </Select>-->
                      <Input
                        type="text"
                        class="input"
                        :readonly="true"
                        v-model="personParam.dept"
                        placeholder="单位名称"
                      >
                      </Input>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="婚姻状态">
                      <Select
                        transfer
                        v-model="personParam.isMarry"
                        placeholder="请选择"
                      >
                        <Option
                          v-for="(item) in marriageArr"
                          :value="item.title"
                          :key="item.title"
                          >{{ item.title }}</Option
                        >
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <!--<FormItem v-if="!isUpdateUnitName && !isUpdateUnitNameGroup" label="分组名称">
                                            <Input type="text" class="input" :disabled="true" placeholder="请输入分组名称"
                                                   v-model="personParam.groupName">
                                            </Input>
                                        </FormItem>
                                        <FormItem v-if="isUpdateUnitName" prop="groupName" label="分组名称">
                                            <Input type="text" class="input" placeholder="请输入分组名称"
                                                   v-model="personParam.groupName">
                                            </Input>
                                        </FormItem>
                                        <FormItem label="分组名称" v-if="isUpdateUnitNameGroup">
                                            <Select v-model="personParam.groupId" placeholder="请先选择单位" :filterable="true" clearable @on-clear="clearGroupId" :readonly="searchForm.isPass == 99 ? true:false"
                                                    label-in-value
                                                    class="input" @on-select="changeGroup" transfer>
                                                <Option v-for="(item,index) in groupByOrderData" :key="index" :value="item.id" :tag="item"
                                                        :label="item.name">
                                                    {{ item.name }}
                                                </Option>
                                            </Select>
                                        </FormItem>-->
                    <FormItem
                      v-if="
                        personParam.sporadicPhysical &&
                        personParam.sporadicPhysical == '1'
                      "
                      label="分组名称"
                    >
                      <Input
                        type="text"
                        class="input"
                        placeholder="请输入分组名称"
                        v-model="personParam.groupName"
                      >
                      </Input>
                    </FormItem>
                    <FormItem label="分组名称" v-else>
                      <Select
                        v-model="personParam.groupId"
                        placeholder="请先选择单位"
                        :filterable="true"
                        clearable
                        @on-clear="clearGroupId"
                        :readonly="searchForm.isPass == 99 ? true : false"
                        label-in-value
                        class="input"
                        @on-select="changeGroup"
                        transfer
                      >
                        <Option
                          v-for="(item, index) in groupByOrderData"
                          :key="index"
                          :value="item.id"
                          :tag="item"
                          :label="item.name"
                        >
                          {{ item.name }}
                        </Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col :span="6" v-if="passStatus == '已登记'">
                    <FormItem label="登记时间">
                      <Input
                        :disabled="true"
                        v-model="
                          personInfo.regist_date || personInfo.registDate
                        "
                      ></Input>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <!--                        <br/>-->
            <Row :gutter="20" style="margin-top: 15px">
              <Col>
                <Button
                  @click="updateShow = true"
                  type="warning"
                  icon="ios-create-outline"
                  style="width: 150px"
                  :disabled="personInfo.id ? false : true"
                  v-if="!isUpdateUnitName && !isUpdateUnitNameGroup"
                  >修改信息
                </Button>
                <Button
                  @click="addHealthPerson"
                  v-if="
                    isShowAloneAddButton &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup &&
                    searchForm.isPass != 99 &&
                    !typeStatus
                  "
                  type="primary"
                  icon="md-add"
                  style="width: 110px"
                  >零星新增
                </Button>
                <Button
                  @click="addHealthPersonGroup"
                  v-if="
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup &&
                    searchForm.isPass != 99 &&
                    !typeStatus
                  "
                  type="primary"
                  icon="md-add"
                  style="width: 110px"
                  >团检新增
                </Button>
                <Button
                  @click="deleteTGroupPerson"
                  type="error"
                  icon="md-trash"
                  :disabled="!personInfo.id"
                  v-if="
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup &&
                    ((personInfo && personInfo.id) ||
                      (personData && personData.length == 0))
                  "
                  >删除</Button
                >
                <Button
                  @click="readIdCard"
                  :loading="readShow"
                  type="primary"
                  icon="md-add"
                  style="width: 150px"
                  >读取二代身份证</Button
                >
                <Button
                  @click="saveHealthPerson"
                  v-if="
                    passStatus == '未登记' &&
                    !typeStatus &&
                    (saveShow || personParam.id)
                  "
                  :loading="saveLoading"
                  type="primary"
                  icon="md-play"
                  >保存信息
                </Button>
                <Button
                  @click="updateRegisterPerson"
                  type="primary"
                  icon="ios-clipboard"
                  style="width: 110px"
                  v-if="
                    !showPrint &&
                    personParam.avatar &&
                    personParam.id &&
                    searchForm.isPass == 1 &&
                    !isReviewer &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup
                  "
                  >确认登记
                </Button>
                <Button
                  @click="updatePerson"
                  type="primary"
                  icon="ios-clipboard"
                  style="width: 110px"
                  v-if="
                    !showPrint &&
                    personParam.avatar &&
                    personParam.id &&
                    searchForm.isPass == 1 &&
                    isReviewer &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup
                  "
                  >确认登记
                </Button>
                <Button
                  @click="printInspectionSheet"
                  type="primary"
                  icon="md-print"
                  style="width: 150px"
                  v-if="
                    ((showPrint && searchForm.isPass == 1) ||
                      searchForm.isPass == 99 ||
                      isReviewer ||
                      isShowRegisterButton) &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup
                  "
                  >打印导检单
                </Button>
                <Button
                  @click="updateIsPass"
                  type="success"
                  icon="ios-clipboard"
                  style="width: 110px"
                  v-if="
                    showPrint &&
                    personParam.avatar &&
                    !payStatus &&
                    !typeStatus &&
                    isShowConfirmPayment &&
                    !isUpdateUnitName &&
                    !isUpdateUnitNameGroup
                  "
                >
                  确认缴费
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <!--<Card style="margin-top: 10px;height: calc(100% - 241px);overflow: auto;" v-if="physicalType == '职业体检' || physicalType == '放射体检'">
                    <Table :loading="loading"
                           border
                           :columns="columns"
                           sortable="custom"
                           :data="data"
                           ref="table"
                           :max-height="tableHeight">

                        <template slot-scope="{ row, index }" slot="action" v-if="!row.status || row.stauts == 0">
                            <Button type="primary" @click="handleQuit(row, index)" size="small">
                                <Icon type="md-close-circle"/>
                                弃检
                            </Button>
                        </template>

                    </Table>
                    <div class="ivu-alert ivu-alert-info ivu-alert-with-icon" style="margin-top: 16px;">
                        <div style="font-size: 16px;margin: 5px 0 10px 0;font-weight: 600;">
                            <span class="ivu-alert-message">
                                操作提示
                            </span>
                        </div>
                        <div class="explain" :style="{'color':(personInfo.avatar ?'':'red')}">
                            <div>
                                <span class="ivu-alert-message">
                                第一步：
                                </span>
                            </div>
                            <div>
                                <span class="ivu-alert-message">
                                    采集人像（采集体检人员头像）
                                </span>
                            </div>
                        </div>
                        <div class="explain " :style="{'color':personInfo.isPass>1?'':'red'}">
                            <div>
                                <span class="ivu-alert-message">
                                第二步：
                                </span>
                            </div>
                            <div>
                                <span class="ivu-alert-message">
                                    确认登记
                                </span>
                            </div>
                        </div>
                        <div class="explain" :style="{'color':personData.length==0?'red': passStatus == '未登记'?'red':''}">
                            <div>
                                <span class="ivu-alert-message">
                                    第三步：
                                </span>
                            </div>
                            <div>
                                <span class="ivu-alert-message">
                                    打印导检单（体检人员可以根据导检单进行体检）
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>-->
        <Card
          style="margin-top: 10px; height: calc(100% - 241px); overflow: auto"
          v-if="physicalType == '从业体检'"
        >
          <Alert class="ivu-alert-left" style="height: 40px; line-height: 23px">
            <span style="margin-right: 10px">体检项目</span>
            <span style="margin-right: 10px" v-if="personParam.comboName">{{
              "(" + personParam.comboName + ")"
            }}</span>
            <Button
              type="primary"
              icon="md-add"
              size="small"
              @click="handleComboSelect"
              v-if="feeStatus == '未确认' && passStatus == '未登记'"
              >套餐类型
            </Button>
            <Button
              type="primary"
              icon="md-add"
              size="small"
              @click="otherItemSelect"
              v-if="feeStatus == '未确认' && passStatus == '未登记'"
              >选检项目
            </Button>
          </Alert>
          <Table
            :loading="projectLoading"
            border
            :columns="projectColumns"
            sortable="custom"
            :data="groupData[0].projectData"
            ref="table"
            :max-height="tableHeight"
          >
            <template
              slot-scope="{ row, index }"
              slot="action"
              v-if="personParam.isPass == 1"
            >
              <Button
                type="error"
                size="small"
                icon="md-trash"
                @click="otherItemDelete(row, index)"
                >删除</Button
              >
            </template>
          </Table>
          <Alert class="ivu-alert-left" style="margin-top: 10px">
            费用信息
          </Alert>
          <Form>
            <Row :gutter="10">
              <Col :span="6">
                <FormItem label="套餐内费用：">
                  ￥{{ this.orderInfo.packageTotal }}元
                </FormItem>
              </Col>
              <Col :span="6">
                <FormItem label="体检费用合计：">
                  <span style="color: red; font-size: 18px; white-space: nowrap"
                    >￥{{ this.orderInfo.orderTotal }}元</span
                  >
                </FormItem>
              </Col>
              <Col :span="6" style="display: flex">
                <FormItem label="优惠价格：">
                  <InputNumber
                    :min="0"
                    v-model="tGroupData.discountPrice"
                  ></InputNumber>
                </FormItem>
              </Col>
            </Row>
          </Form>

          <div
            v-if="!typeStatus"
            class="ivu-alert ivu-alert-info ivu-alert-with-icon"
            style="margin-top: 16px"
          >
            <div
              style="font-size: 16px; margin: 5px 0 10px 0; font-weight: 600"
            >
              <span class="ivu-alert-message"> 操作说明 </span>
            </div>
            <div class="explain">
              <div>
                <span class="ivu-alert-message"> 第一步： </span>
              </div>
              <div>
                <span class="ivu-alert-message"> 点击新增（初始化表单） </span>
              </div>
            </div>
            <div class="explain">
              <div>
                <span class="ivu-alert-message"> 第二步： </span>
              </div>
              <div>
                <span class="ivu-alert-message">
                  填写信息（填写体检人员信息）
                </span>
              </div>
            </div>
            <div class="explain">
              <div>
                <span class="ivu-alert-message"> 第三步： </span>
              </div>
              <div>
                <span class="ivu-alert-message">
                  点击必检类型选择（选择必检项目）
                </span>
              </div>
            </div>
            <div class="explain">
              <div>
                <span class="ivu-alert-message"> 第四步： </span>
              </div>
              <div>
                <span class="ivu-alert-message">
                  点击保存（保存体检人员信息）
                </span>
              </div>
            </div>
            <div class="explain">
              <div>
                <span class="ivu-alert-message"> 第五步： </span>
              </div>
              <div>
                <span class="ivu-alert-message">
                  采集人像（采集体检人员头像）
                </span>
              </div>
            </div>
            <div class="explain">
              <div>
                <span class="ivu-alert-message"> 第六步： </span>
              </div>
              <div>
                <span class="ivu-alert-message"> 确认登记 </span>
              </div>
            </div>
            <div class="explain">
              <div>
                <span class="ivu-alert-message"> 第七步： </span>
              </div>
              <div>
                <span class="ivu-alert-message">
                  打印导检单（体检人员可以根据导检单进行体检）
                </span>
              </div>
            </div>
            <div class="explain">
              <div>
                <span class="ivu-alert-message"> 第八步： </span>
              </div>
              <div>
                <span class="ivu-alert-message"> 确认缴费 </span>
              </div>
            </div>
          </div>
          <div
            v-else
            class="ivu-alert ivu-alert-info ivu-alert-with-icon"
            style="margin-top: 16px"
          >
            <div style="font-size: 16px; margin: 5px 0">
              <span class="ivu-alert-message"> 操作说明 </span>
            </div>
            <div class="explain">
              <div>
                <span class="ivu-alert-message"> 第一步： </span>
              </div>
              <div>
                <span class="ivu-alert-message"> 确认登记 </span>
              </div>
            </div>
            <div class="explain">
              <div>
                <span class="ivu-alert-message"> 第二步： </span>
              </div>
              <div>
                <span class="ivu-alert-message">
                  打印导检单（体检人员可以根据导检单进行体检）
                </span>
              </div>
            </div>
            <div class="explain">
              <div>
                <span class="ivu-alert-message"> 第三步： </span>
              </div>
              <div>
                <span class="ivu-alert-message"> 确认缴费 </span>
              </div>
            </div>
          </div>
        </Card>
        <healthCheckup
          v-if="
            physicalType == '健康体检' ||
            physicalType == '职业体检' ||
            physicalType == '放射体检'
          "
          :isUpdateUnitName="isUpdateUnitName"
          :isUpdateUnitNameGroup="isUpdateUnitNameGroup"
          @handleSearchCheckup="handleSearchCheckup"
          style="overflow: auto; margin-top: 0px"
          :personInfo="personParam"
          :type-status="typeStatus"
          :projectDataInfo="data"
          :showSelectButton="showSelectButton"
          ref="healthCheckup"
        ></healthCheckup>
      </Col>
      <inspection-sheet
        v-model="printSheet"
        :personInfo="personInfo"
        :projectInfo="data"
        :orderTotal="orderInfo.orderTotal"
        :isReviewer="isReviewer"
        :passStatus="passStatus"
        :data="data"
        v-on:handleSearch="inputSearchChange('')"
        ref="inspection"
      ></inspection-sheet>
      <photograph
        v-model="showPhotograph"
        v-on:handleSearch="handleSetImg"
      ></photograph>
      <choose-portfolio-project
        v-model="choosePortfolioProjectShow"
        v-on:handleSearch="setTableData"
        :checkedList="choosePortfolioProjectData"
      ></choose-portfolio-project>

      <!--工种-->
      <chooseWorkType
        v-model="workShow"
        @workCodeReback="workCodeReback"
      ></chooseWorkType>
      <!--危害因素-->
      <harmDrawer
        v-model="harmShow"
        modalTitle="危害因素选择"
        :selectedHarmList="selectedHarmList"
        @harmReback="harmReback"
        :selectType="seltType"
      ></harmDrawer>
      <!--人员添加-->
      <updateTGroupPerson
        v-model="updateShow"
        :tGroupPersonId="personInfo.id"
        modalTitle="人员信息修改"
        :orderId="personInfo.orderId"
        :groupId="personInfo.groupId"
        v-on:handleSearch="queryPersonData(personInfo.id, 1)"
      />

      <!--从业体检套餐选择-->
      <combo-drawer
        v-model="comboDrawerShow"
        modalTitle="从业套餐选择"
        :comboId="comboId"
        @selCallBack="selCallBack"
      ></combo-drawer>

      <!--组合项目选择-->
      <choose-portfolio-project
        v-model="isDrawerShow"
        @handleSearch="handleSearch"
        :checkedList="itemSelectedData"
      ></choose-portfolio-project>
    </Row>
  </div>
</template>
<script>
import {
  getTGroupPersonInspection,
  updateTGroupPersonAvatar,
  updateTGroupPersonByIsPass,
  updateTGroupPersonReviewerByIsPass,
  updateTGroupPersonReviewerById,
  saveOrUpdatePersonInfo,
  getTGroupPersonAndUnit,
  getTGroupPersonReviewerList,
  getTGroupPersonReviewerById,
  deleteTGroupPerson,
} from "../../../api/healthy/tGroupPerson";
import { getComboItemByComboId } from "@/api/healthy/tComboItem";
import Viewer from "viewerjs";
import step from "../../../components/healthy/step";
import InspectionSheet from "./inspectionSheet";
import Photograph from "./photograph";
import { formartDate } from "../../../api/tools/tool";
import { queryAllTGroupUnitList } from "../../../api/healthy/tGroupUnit";
import ChooseCombo from "../tGroupOrder/chooseCombo";
import ChoosePortfolioProject from "../tGroupOrder/choosePortfolioProject";
import {
  addPracticeTGroupOrder,
  getTGroupOrder,
  updatePayStatus,
  updatePracticeTGroupOrder,
} from "../../../api/healthy/tGroupOrder";
import healthCheckup from "./healthCheckup";
import { queryAllTGroupOrderList } from "../../../api/healthy/tGroupOrder";
import { formatDate } from "@/api/tool.js";
import { updateRelationPersonProjectCheck } from "@/api/healthy/relationPersonProjectCheck";
import Cookies from "js-cookie";
import noData from "@/components/no-data";
import updateTGroupPerson from "../tGroupPerson/updateTGroupPerson";
import comboDrawer from "./comboDrawer";
import { getDictDataByType } from "../../../api";
import chooseWorkType from "../tGroupPerson/chooseWorkType";
import harmDrawer from "../tCombo/harmDrawer";
import { getMonthString, getDataString } from "../../../api/tools/tool";

import { queryTOrderGroupList } from "../../../api/healthy/tOrderGroup";

export default {
  name: "physicalRegister",
  components: {
    harmDrawer,
    chooseWorkType,
    Photograph,
    InspectionSheet,
    step,
    ChooseCombo,
    ChoosePortfolioProject,
    healthCheckup,
    noData,
    updateTGroupPerson,
    comboDrawer,
  },
  computed: {
    physicalType() {
      return this.$store.state.theme.theme.physicalType;
    },
  },
  data() {
    return {
      showSelectButton: true,

      isShowRegisterButton: true, //未点击确认登记前,是否展示打印导检单按钮
      isShowAloneAddButton: false, //是否展示零星新增按钮
      isShowConfirmPayment: true, //是否展示确认缴费按钮

      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      drop: false,
      height1: "219px",
      height2: "185px",

      workTypeCodeArr: [], //工种
      workStateCodeArr: [], //在岗状态
      marriageArr: [], //婚姻状态
      nationArr: [], //民族
      certificateTypeArr: [], //从业类别
      harmShow: false,
      workShow: false,
      seltType: "",
      selectedHarmList: [],

      isUpdateUnitName: false,
      isUpdateUnitNameGroup: false,
      isDrawerShow: false,
      itemSelectedData: [], //选检项目
      comboId: "",
      comboDrawerShow: false,
      updateShow: false,
      showRadio: false,
      officeId: "",
      date: "",
      datePickerShow: false,
      readShow: false,
      isReviewer: false,
      passStatus: "未登记",
      feeStatus: "未确认",
      typeStatus: false,
      showPhotograph: false,
      currentIndex: 1,
      checkPersonLoading: false,
      isRadioChecked: "",
      personData: [],
      expand: true,
      leftSpan: "width: 300px;",
      span: "position: relative;width: calc(100% - 332px);",
      color: "",
      tGroupUnitForm: {},
      personInfo: {},
      personParam: {},
      orderInfo: {
        payStatus: -1,
      },
      projectInfo: [],
      personParamRule: {
        idCard: [
          { required: true, message: "身份证号不能为空", trigger: "blur" },
          {
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: "身份证号不正确",
            trigger: "blur",
          },
        ],
        personName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        age: [
          {
            required: true,
            message: "年龄不能为空",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        physicalType: [
          { required: true, message: "体检类型不能为空", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
          {
            pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/,
            message: "联系电话不正确",
            trigger: "blur",
          },
        ],
        unitId: [
          { required: true, message: "单位名称不能为空", trigger: "blur" },
        ],
        hazardFactorsText: [
          {
            required: true,
            type: "string",
            message: "危害因素不能为空！",
            trigger: "change",
          },
        ],
        otherHazardFactors: [
          {
            required: true,
            message: "其他危害因素不能为空！",
            trigger: "blur",
          },
        ],
        workStateText: [
          { required: true, message: "检查种类不能为空", trigger: "blur" },
        ],
        workStateCode: [
          { required: true, message: "检查种类不能为空", trigger: "blur" },
        ],
        workTypeText: [
          {
            required: true,
            message: "工种名称不能为空！",
            trigger: "change",
            pattern: /.+/,
          },
        ],
        groupName: [
          { required: true, message: "分组不能为空", trigger: "blur" },
        ],
        groupId: [{ required: true, message: "分组不能为空", trigger: "blur" }],
        nation: [{ required: true, message: "民族不能为空", trigger: "blur" }],
        birth: [
          {
            required: true,
            message: "出生日期不能为空！",
            trigger: "change",
            pattern: /.+/,
          },
        ],
        certificateType: [
          { required: true, message: "从业类别不能为空", trigger: "blur" },
        ],
      },
      loading: false,
      columns: [
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "检查科室",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
          key: "officeName",
          sortable: false,
        },
        {
          title: "体检项目",
          align: "center",
          minWidth: 200,
          ellipsis: true,
          tooltip: true,
          key: "name",
          sortable: false,
        },
        {
          title: "检查地址",
          align: "center",
          minWidth: 200,
          ellipsis: true,
          tooltip: true,
          key: "address",
          sortable: false,
        },
      ],
      data: [],
      expandIcon: "ios-arrow-back",
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        isPass: 1,
        keyword: "",
        startDate: null,
        endDate: null,
        personName: "", //姓名
        testNum: "", //体检编号
        dept: "", //单位名称
        idCard: "", //身份证号
      },
      tableHeight: 0,
      printSheet: false,
      showPrint: false,
      checkPerson: [],
      workStateTextArr: [],
      unitArr: [],
      projectColumns: this.getColumns(),
      chooseComboShow: false,
      comboIdList: [],
      choosePortfolioProjectShow: false,
      choosePortfolioProjectData: [],
      projectLoading: false,
      groupData: [
        {
          id: null,
          name: "从业体检",
          show: true,
          comboId: "",
          projectData: [],
          discount: 100,
          addDiscount: 100,
          personCount: 1,
          discountPrice: 0,
        },
      ],
      groupByOrderData: [],
      tGroupData: {},
      saveLoading: false,
      disabled: false,
      payStatus: false,
      saveShow: false,
      orderArr: [],
      personTotal: 0,
      projectData: [], //
      queryTime: this.$hospitalName.queryTimeChange,
    };
  },
  methods: {
    //在岗状态改变
    workChange(v) {
      if (v) {
        this.personParam.workStateText = v.label.trim();
      }
      if (this.$refs.healthCheckup) {
        this.$refs.healthCheckup.clearProjectData();
        // this.$refs.healthCheckup.queryProjectDataByHazardFactors();
      }
    },
    //工种名称选择
    handleWorkCode() {
      this.workShow = true;
    },
    //工种名称选择返回函数
    workCodeReback(v) {
      this.personParam.workTypeCode = "";
      this.personParam.workTypeText = "";
      if (v && v.length > 0) {
        this.personParam.workTypeCode = v[0].value;
        this.personParam.workTypeText = v[0].title;
        this.$forceUpdate();
      }
    },
    //危害因素选择
    handleHarmSelect() {
      this.selectedHarmList = [];
      this.harmShow = true;
      this.seltType = "checkbox";
      if (this.personParam.hazardFactors) {
        let ids = this.personParam.hazardFactors.split("|");
        let txts = this.personParam.hazardFactorsText.split("|");
        for (let i = 0; i < ids.length; i++) {
          let id = ids[i];
          let txt = txts[i];
          this.selectedHarmList.push({
            typeCode: id,
            typeName: txt,
          });
        }
      } else {
        this.selectedHarmList = [];
      }
    },
    //危害因素选择返回
    harmReback(e) {
      if (e && e.length > 0) {
        let ids = [],
          txts = [];
        e.forEach((i) => {
          ids.push(i.typeCode);
          txts.push(i.typeName);
        });
        this.personParam.hazardFactors = ids.join("|");
        this.personParam.hazardFactorsText = txts.join("|");
        this.getGroupName();
      }
      if (this.$refs.healthCheckup) {
        this.$refs.healthCheckup.clearProjectData();
        // this.$refs.healthCheckup.queryProjectDataByHazardFactors();
      }
    },
    //获取分组名称
    getGroupName() {
      if (
        this.personParam &&
        this.personParam.hazardFactorsText &&
        this.personParam.hazardFactorsText.trim().length > 0 &&
        this.personParam.workStateText &&
        this.personParam.workStateText.trim().length > 0
      ) {
        this.personParam.groupName =
          this.personParam.hazardFactorsText.trim().replaceAll("|", "、") +
          "[" +
          this.personParam.workStateText.trim() +
          "]";
      }
    },
    //检查种类选择 回调事件
    onWorkStateSelectChange(e) {
      this.personParam.workStateCode = e.value;
      this.personParam.workStateText = e.label;
      this.getGroupName();
    },
    //套餐选择回调
    handleSearchCheckup(
      hazardFactorsArry,
      hazardFactorsTextArry,
      careerStageArry
    ) {
      if (
        hazardFactorsArry &&
        hazardFactorsArry.length > 0 &&
        hazardFactorsTextArry &&
        hazardFactorsTextArry.length > 0 &&
        careerStageArry &&
        careerStageArry.length > 0
      ) {
        //检查种类
        let title = careerStageArry[0];
        let workStateNow = this.workStateCodeArr.filter(
          (item) => item.title && item.title.indexOf(title) > -1
        );
        if (workStateNow && workStateNow.length > 0) {
          this.personParam.workStateCode = workStateNow[0].value;
          this.personParam.workStateText = workStateNow[0].title;
        }
        //危害因素
        this.personParam.hazardFactors = hazardFactorsArry.join("|");
        this.personParam.hazardFactorsText = hazardFactorsTextArry.join("|");
        if (this.physicalType == "放射体检") {
          this.personParam.otherHazardFactors = "放射工作";
        }
        this.selectedHarmList = [];
        for (let i = 0; i < hazardFactorsArry.length; i++) {
          let id = hazardFactorsArry[i];
          let txt = hazardFactorsTextArry[i];
          this.selectedHarmList.push({
            typeCode: id,
            typeName: txt,
          });
        }

        //拼接分组名称
        this.getGroupName();
      }
    },

    //展开 收起
    dropDown() {
      if (this.drop) {
        this.dropDownContent = "展开";
        this.dropDownIcon = "ios-arrow-down";
        this.height1 = "215px";
        this.height2 = "185px";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "ios-arrow-up";
        this.height1 = "303px";
        this.height2 = "273px";
      }
      this.drop = !this.drop;
    },
    //删除选检项目
    otherItemDelete(row, index) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除选检项目“" + row.name + "”?",
        loading: true,
        onOk: () => {
          //删除当前列表
          this.groupData[0].projectData.splice(index, 1);
          this.sumTotal();
          this.$Modal.remove();
        },
        onCancel: () => {
          this.$Message.info("取消了当前的操作行为！");
        },
      });
    },
    //选检项目
    otherItemSelect() {
      this.isDrawerShow = true;
      if (
        this.groupData &&
        this.groupData[0].projectData &&
        this.groupData[0].projectData.length > 0
      ) {
        this.groupData[0].projectData.forEach((i) => {
          if (i.projectType == "2") {
            this.itemSelectedData.push(i);
          }
        });
      }
    },
    //选检项目回调
    handleSearch(e) {
      if (e && e.length > 0) {
        e.forEach((i) => {
          let pro = this.groupData[0].projectData.find((ii) => ii.id == i.id);
          if (pro == undefined) {
            i.portfolioProjectId = i.id;
            i.discountPrice = i.salePrice.toFixed(2);
            this.groupData[0].projectData.push(i);
          }
        });
        this.sumTotal();
      }
    },
    //从业体检套餐选择
    handleComboSelect() {
      //套餐抽屉
      this.comboDrawerShow = true;
    },
    //选中call
    selCallBack(item) {
      this.comboId = item[0].id;
      this.groupData[0].comboId = item[0].id;
      this.personParam.comboName = item[0].name;
      if (!this.comboId) {
        this.$Message.info("未选择体检项目，请选择必检项目");
        return;
      }
      this.getTComboItemData();
    },
    //收单
    handleComplete() {
      let is, no, quit;
      is = this.data.filter((i) => i.status == 1).length;
      no = this.data.filter((i) => i.status == 0 || !i.status).length;
      quit = this.data.filter((i) => i.status == 2).length;

      let str =
        "<p style='font-size: 15px;font-weight: 600;letter-spacing: 1px;'>受检人" +
        this.personInfo.personName +
        ",检查项目共: <span>" +
        this.data.length +
        "</span> 项</p>" +
        "<span style='font-size: 15px;font-weight: 600;letter-spacing: 1px;'>已检项目<span style='color: #19BE6B;'>" +
        is +
        "</span>项</span>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;<span style='font-size: 15px;font-weight: 600;letter-spacing: 1px;'>未检项目<span style='color: #868686;'>" +
        no +
        "</span>项</span>" +
        "<p style='font-size: 15px;font-weight: 600;letter-spacing: 1px;'>弃检项目<span style='color: red;'>" +
        quit +
        "</span>项</p>";

      this.$Modal.confirm({
        title: "收单确认",
        content: str,
        onOk: () => {
          this.$Message.success("收单成功");
        },
      });
    },
    //弃检
    handleQuit(row, index) {
      this.$Modal.confirm({
        title: "确认弃检",
        content:
          "您确认要放弃" +
          this.personInfo.personName +
          "的" +
          row.name +
          "检查吗?",
        onOk: () => {
          this.$Modal.remove();
          updateRelationPersonProjectCheck({
            personId: this.personInfo.id,
            officeId: row.officeId,
            state: 2,
            orderGroupItemId: row.id,
          })
            .then((res) => {
              if (res.success) {
                this.$Message.success("弃检成功");
                this.data[index].status = 2;
                this.$forceUpdate();
              } else {
                this.$Message.error("弃检失败");
              }
            })
            .finally(() => {});
        },
      });
    },

    radioClick(radio) {
      radio == this.date ? (this.date = "") : (this.date = radio);
      this.pick(this.date);
    },
    //日期选择
    pick(e) {
      this.searchForm.pageNumber = 1;
      if (e == "自定义") {
        this.resetSearchForm();
        this.datePickerShow = true;
      } else if (e == "当日") {
        this.resetSearchForm();
        this.searchForm.startDate = formatDate(
          new Date(),
          "yyyy-MM-dd HH:mm:ss"
        );
        this.searchForm.endDate = null;
        if (!this.typeStatus) {
          this.getPersonData();
        } else {
          this.getReviewerData();
        }
      } else if (e == "当月") {
        this.resetSearchForm();
        this.searchForm.endDate = formatDate(
          new Date(),
          "yyyy-MM-dd  HH:mm:ss"
        );
        this.searchForm.startDate = null;
        if (!this.typeStatus) {
          this.getPersonData();
        } else {
          this.getReviewerData();
        }
      } else if (e == "重置") {
        this.resetSearchForm();
      } else if (e == "") {
        this.resetSearchForm();
        this.searchForm.startDate = null;
        this.searchForm.endDate = null;
        if (!this.typeStatus) {
          this.getPersonData();
        } else {
          this.getReviewerData();
        }
      }
    },
    resetSearchForm() {
      this.searchForm.pageNumber = 1;
      //this.searchForm.keyword = "";
      //this.searchForm.personName = "";
      //this.searchForm.testNum = "";
      //this.searchForm.dept = "";
      if (this.date == "重置") {
        this.searchForm.pageNumber = 1;
        this.searchForm.keyword = "";
        this.searchForm.personName = "";
        this.searchForm.testNum = "";
        this.searchForm.dept = "";
        let _this = this;
        setTimeout(function () {
          _this.date = "当日";
          if (!_this.$hospitalName.queryTimeChange) {
            let date = getMonthString(new Date());
            if (date != null && date.length == 2) {
              _this.searchForm.startDate = date[0] + " 00:00:00";
              _this.searchForm.endDate = date[1] + " 23:59:59";
            }
          } else {
            _this.searchForm.startDate = formartDate(
              new Date(),
              "yyyy-MM-dd HH:mm:ss"
            );
            _this.searchForm.endDate = null;
          }
          _this.inputSearchChange("");
        });
      }
    },
    //人员日期查询
    datePickerChange(e) {
      if (e) {
        this.searchForm.startDate = e[0];
        var dateTime = new Date(e[1]);
        dateTime = dateTime.setDate(dateTime.getDate() + 1);
        this.searchForm.endDate = new Date(dateTime);

        if (!this.typeStatus) {
          this.getPersonData();
        } else {
          this.getReviewerData();
        }
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
      if (!this.typeStatus) {
        this.getPersonData();
      } else {
        this.getReviewerData();
      }
    },

    //人员日期查询
    datePickerStartTime(e) {
      if (e) {
        let startTime = new Date(e);
        startTime.setHours(0, 0, 0, 0);
        startTime = startTime.setDate(startTime.getDate());
        this.searchForm.startDate = formatDate(
          new Date(startTime),
          "yyyy-MM-dd HH:mm:ss"
        );
      }
      if (!this.typeStatus) {
        this.getPersonData();
      } else {
        this.getReviewerData();
      }
    },

    //重置
    resetClick() {
      this.searchForm.pageNumber = 1;
      this.searchForm.personName = "";
      this.searchForm.testNum = "";
      this.searchForm.dept = "";
      this.searchForm.idCard = "";
      let _this = this;
      setTimeout(function () {
        _this.date = "当日";
        if (!_this.$hospitalName.queryTimeChange) {
          let date = getMonthString(new Date());
          if (date != null && date.length == 2) {
            _this.searchForm.startDate = date[0] + " 00:00:00";
            _this.searchForm.endDate = date[1] + " 23:59:59";
          }
        } else {
          _this.searchForm.startDate = formartDate(
            new Date(),
            "yyyy-MM-dd HH:mm:ss"
          );
          _this.searchForm.endDate = null;
        }
        if (!_this.typeStatus) {
          _this.getPersonData();
        } else {
          _this.getReviewerData();
        }
      }, 100);
    },
    getColumns() {
      return [
        {
          type: "index",
          width: 70,
          align: "center",
        },
        {
          title: "项目名称",
          align: "left",
          minWidth: 150,
          ellipsis: true,
          tooltip: true,
          key: "name",
          sortable: false,
        },
        {
          title: "原价",
          align: "center",
          minWidth: 80,
          ellipsis: true,
          tooltip: true,
          key: "salePrice",
          sortable: false,
        },
        {
          title: "折扣",
          align: "center",
          minWidth: 80,
          ellipsis: true,
          tooltip: true,
          key: "discount",
          sortable: false,
          render: (h, params) => {
            return h("div", [
              h("InputNumber", {
                props: {
                  placeholder: "请输入",
                  value: params.row.discount ? params.row.discount : 100,
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
                    this.groupData[0].projectData[params.index].discount = v;
                    //销售价
                    let salePrice = params.row.salePrice;
                    salePrice = Number(salePrice);
                    if (salePrice == NaN) {
                      salePrice = 0;
                    }
                    //折扣价
                    this.groupData[0].projectData[params.index].discountPrice =
                      ((salePrice * v) / 100).toFixed(2);
                    this.sumTotal();
                  },
                },
              }),
            ]);
          },
        },
        {
          title: "折扣价",
          align: "center",
          minWidth: 80,
          ellipsis: true,
          tooltip: true,
          key: "discountPrice",
          sortable: false,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  placeholder: "",
                  value: params.row.discountPrice
                    ? Number(params.row.discountPrice).toFixed(2)
                    : "0.00",
                  // disabled: true
                  readonly: true,
                },
                on: {
                  input: (val) => {
                    this.groupData[0].projectData[params.index].discountPrice =
                      val;
                  },
                },
              }),
            ]);
          },
        },
        {
          title: "项目类型",
          align: "center",
          minWidth: 80,
          ellipsis: true,
          tooltip: true,
          key: "type",
          sortable: false,
          render: (h, params) => {
            if (params.row.projectType == 1) {
              return h("span", "必检项目");
            } else {
              return h("span", "选检项目");
            }
          },
        },
        {
          title: "操作",
          align: "center",
          slot: "action",
          minWidth: 100,
        },
      ];
    },
    //新增人员 从业体检
    addPerson(type) {
      this.isUpdateUnitName = true;
      this.saveShow = true;
      this.isRadioChecked = "";
      this.comboId = "";

      this.groupData = [
        {
          id: null,
          name: "从业体检",
          show: true,
          comboId: "",
          projectData: [],
          discount: 100,
          addDiscount: 100,
          personCount: 1,
        },
      ];

      this.orderInfo = {
        orderTotal: 0,
        packageTotal: "",
        packageDiscount: "",
        groupUnitName: "",
        signingTime: new Date(),
        physicalType: this.physicalType,
        groupUnitId: "",
        auditState: 2,
        payStatus: 0,
      };

      this.personParam = {
        isPass: 1,
        testNum: "",
        idCard: "",
        personName: "",
        unitId: "",
        dept: "",
        sex: "",
        age: "",
        mobile: "",
        physicalType: this.physicalType,
      };

      //身份证读卡器处
      if (type == "idcard") {
        //如果是读卡器，直接选套餐
        this.handleComboSelect();
      } else {
        this.getTComboItemData();
      }
    },
    //保存从业体检人员信息
    savePersonInfo() {
      try {
        this.$refs["personParam"].validate((valid) => {
          if (valid) {
            this.groupData[0].projectData;

            //校验分组信息和分组人数信息
            if (this.groupData.length < 1) {
              this.$message.error("分组信息不能为空！");
              return;
            }
            for (let i = 0; i < this.groupData.length; i++) {
              if (this.groupData[i].projectData.length < 1) {
                this.$Message.error(
                  "“" + this.groupData[i].name + "”必检项目不能为空！"
                );
                return;
              }
              let pro = this.groupData[i].projectData.find(
                (i) => i.projectType == 1
              );
              if (pro == undefined) {
                this.$Message.error("必检项目为空，请重新选择！");
                return;
              }
              if (this.groupData[i].personCount < 1) {
                this.$Message.error(
                  "“" + this.groupData[i].name + "”分组体检人数不能为空！"
                );
                return;
              }
            }
            this.saveLoading = true;
            if (
              this.groupData &&
              this.groupData.length > 0 &&
              this.tGroupData &&
              this.tGroupData.discountPrice
            ) {
              this.groupData[0].discountPrice = this.tGroupData.discountPrice;
            }
            this.orderInfo.groupData = this.groupData;
            this.orderInfo.groupPerson = this.personParam;
            if (this.orderInfo.id && this.orderInfo.id.length > 0) {
              updatePracticeTGroupOrder(this.orderInfo)
                .then((res) => {
                  if (res.success) {
                    this.$Message.success("保存成功");
                    this.searchForm.pageNumber = 1;
                    if (!this.typeStatus) {
                      this.queryPersonData(this.personParam.id, 1);
                    } else {
                      this.getReviewerData();
                    }
                  }
                })
                .finally(() => {
                  this.saveLoading = false;
                });
            } else {
              let _this = this;
              addPracticeTGroupOrder(_this.orderInfo)
                .then((res) => {
                  if (res.success) {
                    this.$Message.success("保存成功");
                    this.searchForm.pageNumber = 1;
                    if (!this.typeStatus) {
                      this.getPersonData();
                    } else {
                      this.getReviewerData();
                    }
                  }
                })
                .finally(() => {
                  this.saveLoading = false;
                });
            }
          } else {
            this.saveLoading = false;
            this.$Message.error("表单验证不通过！");
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
    //根据身份证号计算出生日期
    getBirthDate(IDCard) {
      //获取身份证号的年、月、日
      var year = IDCard.substring(6, 10);
      var month = IDCard.substring(10, 12);
      var day = IDCard.substring(12, 14);
      //拼接成出生日期
      var birthDate = year + "-" + month + "-" + day;
      return birthDate;
    },
    //身份证号改变
    idCardChange() {
      if (
        /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(
          this.personParam.idCard
        ) == true
      ) {
        let date = new Date();
        let yearfull = date.getFullYear();
        let idCard = this.personParam.idCard;
        let age = 0;
        if (this.personParam.idCard.length == 18) {
          let birthyear = this.personParam.idCard.substring(6, 10);
          age = yearfull - birthyear;
          let sexValue = this.personParam.idCard.substring(16, 17);
          let sex = sexValue % 2 == 0 ? "女" : "男";

          this.personParam.sex = sex;
          let birth = this.getBirthDate(this.personParam.idCard);
          //出生日期
          this.personParam.birth = birth;
        }
        if (this.personParam.idCard.length == 15) {
          let birthDay = "";
          birthDay = this.personParam.idCard.substring(6, 12);
          birthDay = "19" + birthDay;
          let month = birthDay.substring(4, 6);
          let day = birthDay.substring(6, 8);
          birthDay = birthDay.substring(0, 4);
          age = yearfull - birthDay;
          let sex = parseInt(birthDay.substring(14, 1), 10) % 2 ? "男" : "女";

          this.personParam.sex = sex;
          let birth = birthDay + "-" + month + "-" + day;
          //出生日期
          this.personParam.birth = birth;
        }
        let monthBirth = idCard.substring(10, 12);
        let dayBirth = idCard.substring(12, 14);
        let monthNow = date.getMonth() + 1;
        let dayNow = date.getDate();
        if (
          monthNow < monthBirth ||
          (monthNow == monthBirth && dayNow < dayBirth)
        ) {
          age--;
        }
        this.personParam.age = age;
        this.$forceUpdate();
      }
    },
    //缴费状态改变
    feeStatusChange(e) {
      let date = getMonthString(new Date());
      this.saveShow = false;

      this.searchForm.keyword = "";
      this.searchForm.pageNumber = 1;
      this.addPerson();
      if (e == "未确认") {
        this.searchForm.isPass = 1;
        this.disabled = false;
        this.showPrint = false;
        this.searchForm.startDate = null;
        this.searchForm.endDate = null;
        this.inputSearchChange("");
        //添加删除栏
        this.projectColumns.push({
          title: "操作",
          align: "center",
          slot: "action",
          minWidth: 100,
        });
      } else {
        this.searchForm.isPass = 99;
        this.disabled = true;
        this.showPrint = true;
        //如果已经确认，不显示删除栏
        this.projectColumns = this.projectColumns.splice(
          0,
          this.projectColumns.length - 1
        );
        if (!this.$hospitalName.queryTimeChange) {
          if (date != null && date.length == 2) {
            this.searchForm.startDate = date[0] + " 00:00:00";
            this.searchForm.endDate = date[1] + " 23:59:59";
            this.inputSearchChange("");
          }
        } else {
          this.date = "当日";
          this.pick("当日");
        }
      }
    },
    addTPortfolioProject() {
      this.choosePortfolioProjectShow = true;
      this.choosePortfolioProjectData = JSON.parse(
        JSON.stringify(this.groupData[0].projectData)
      );
      this.choosePortfolioProjectData.forEach((item) => {
        item.id = item.portfolioProjectId;
      });
    },
    setTableData(e) {
      e.forEach((item) => {
        item.discount = 100;
        item.portfolioProjectId = item.id;
        //销售价
        let salePrice = item.salePrice;
        salePrice = Number(salePrice);
        if (salePrice == NaN) {
          salePrice = 0;
        }
        //折扣价
        item.discountPrice = ((salePrice * 100) / 100).toFixed(2);
      });
      this.groupData[0].projectData = JSON.parse(JSON.stringify(e));
      this.sumTotal();
    },
    deleteData(row, index) {
      //删除当前列表
      this.groupData[0].projectData.splice(index, 1);
      this.sumTotal();
      this.$Modal.remove();
    },
    getTComboItemData() {
      if (!this.comboId) return;
      this.projectLoading = true;
      //加载套餐项
      getComboItemByComboId({ comboId: this.comboId })
        .then((res) => {
          if (res.success) {
            this.groupData[0].projectData = res.data;
            this.projectInfo = this.groupData[0].projectData;
            this.sumTotal();
          } else {
            this.data = [];
            this.$Message.error("加载失败");
          }
        })
        .finally(() => {
          this.projectLoading = false;
        });
    },
    //单位选择
    unitSelect(e) {
      if (e) {
        this.orderInfo.groupUnitName = e.label;
        this.orderInfo.groupUnitId = e.value;
        this.personParam.unitId = e.value;
        this.personParam.dept = e.label;
      }
    },
    //统计下方订单和套餐信息
    sumTotal() {
      let num1 = 0,
        num2 = 0;
      for (let j = 0; j < this.groupData[0].projectData.length; j++) {
        let data = this.groupData[0].projectData[j];
        //订单原价
        num1 = this.numAdd(Number(data.salePrice), num1, 1);
        //订单合计
        num2 = this.numAdd(Number(data.discountPrice), num2, 1);
      }
      this.orderInfo.orderTotal = num2;
      this.orderInfo.packageTotal = num1;
      if (!this.tGroupData.discountPrice) {
        this.tGroupData.discountPrice = num1;
      }
      this.orderInfo.packageDiscount = (num1 - num2).toFixed(2);
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
    initFrom() {
      this.personParam = {
        testNum: "",
        idCard: "",
        personName: "",
        unitId: "",
        dept: "",
        sex: "",
        age: "",
        mobile: "",
        physicalType: this.physicalType,
      };
    },
    //读取身份证信息
    readIdCard() {
      this.readShow = true;

      if (
        this.$hospitalName.cardReaderType &&
        this.$hospitalName.cardReaderType == "卡尔"
      ) {
        this.connectKer();
      } else {
        this.connect();
      }
    },
    //连接卡尔身份读卡器
    connectKer() {
      let _this = this;

      let options = new Object();
      options.type = "GET";
      let ipNow = "http://127.0.0.1:6045";
      if (_this.$hospitalName.cardReaderIp) {
        ipNow = _this.$hospitalName.cardReaderIp;
      }
      let param = '{"portType": 5}';
      let readerIndex = undefined;
      $.ajax({
        contentType: "application/json;charset=UTF-8",
        dataType: "jsonp",
        timeout: 10000,
        jsonp: "callback",
        url:
          ipNow +
          "/readIDCard?param=" +
          param +
          "&index=" +
          readerIndex +
          "&callback=jQuery1124005177236773174432_1675924413840&_=1675924413841",
        success: onSuccess,
        complete: function (XMLHttpRequest, textStatus) {
          console.info("complete");
        },
        error: onError,
      });

      function onSuccess(resultInfo, status) {
        if (resultInfo.result === 0) {
          let textInfo = resultInfo.wzInfo;
          let personName = textInfo.substr(0, 15).trim(); //姓名
          let idCard = textInfo.substr(61, 18).trim(); //身份证号
          let familyAddress = textInfo.substr(26, 35).trim(); //家庭住址

          if (_this.isUpdateUnitName || _this.isUpdateUnitNameGroup) {
            _this.initFrom();
            _this.personParam.isPass = 1;
            _this.personParam.personName = textInfo.substr(0, 15).trim(); //姓名
            _this.personParam.idCard = textInfo.substr(61, 18).trim(); //身份证号
            // _this.getPersonData(function () {
            if (_this.physicalType == "从业体检") {
              if (_this.personData.length == 0) {
                // _this.addPerson('idcard');
                _this.personParam = {
                  testNum: "",
                  idCard: idCard,
                  personName: personName,
                  unitId: "",
                  dept: "",
                  age: "",
                  isPass: 1,
                  mobile: "",
                  physicalType: _this.physicalType,
                  homeAddress: familyAddress,
                };
              }
            } else {
              if (_this.personData.length == 0) {
                // _this.addHealthPerson();
                _this.personParam = {
                  testNum: "",
                  idCard: idCard,
                  personName: personName,
                  unitId: "",
                  dept: "",
                  age: "",
                  mobile: "",
                  isPass: 1,
                  physicalType: _this.physicalType,
                  homeAddress: familyAddress,
                };
              }
            }
            // });
            _this.idCardChange();
            //请求获取身份证照片(base64格式)
            $.ajax({
              contentType: "application/json;charset=UTF-8",
              dataType: "jsonp",
              jsonp: "callback",
              url: ipNow + "/wltUnpack?wlt=" + resultInfo.zpWlt + "&format=JPG",
              success: function (response) {
                _this.readShow = false;
                if (response["result"] === 0) {
                  let imageBase64 = response["image"];
                  let base64Img = "data:image/jpeg;base64," + imageBase64;
                  _this.personParam.avatar = base64Img;
                  _this.personInfo.avatar = base64Img;
                } else {
                  alert("unpack error " + response["result"]);
                }
              },
              complete: function (XMLHttpRequest, textStatus) {},
            });
          } else {
            _this.searchForm.idCard = idCard;
            _this.readShow = false;
            _this.inputSearchChange("");
          }
        } else {
          _this.readShow = false;
          _this.$Message.error("身份证读卡器连接失败！");
        }
      }

      function onError(jqXHR, textStatus, errorThrown) {
        _this.readShow = false;
        _this.$Message.error("请安装身份证读卡器服务！");
      }

      options.contentType = "application/json;charset=UTF-8";
      options.dataType = "jsonp";
      options.jsonp = "callback";

      options.url =
        ipNow +
        "/readIDCard?param=" +
        param +
        "&index=" +
        readerIndex +
        "&callback=jQuery1124005177236773174432_1675924413840&_=1675924413841"; //URL后面加一个随机参数的目的是为了防止IE内核浏览器的数据缓存
      options.timeout = 10000;
      options.onSuccess = onSuccess;
      options.onError = onError;
      // _this.ajax(options);
    },
    //连接身份证读卡器
    connect() {
      let _this = this;

      function onSuccess(data) {
        if (data.match('"errorMsg" : "(.*?)"')[1] == "打开成功") {
          _this.readCert();
        } else {
          _this.readShow = false;
          _this.$Message.error("身份证读卡器连接失败！");
        }
      }

      function onError(data) {
        _this.readShow = false;
        _this.$Message.error("请安装身份证读卡器服务！");
      }

      let options = new Object();
      options.type = "GET";
      options.url =
        "http://127.0.0.1:19196/OpenDevice" + "&" + "t=" + Math.random(); //URL后面加一个随机参数的目的是为了防止IE内核浏览器的数据缓存
      options.timeout = 5000;
      options.onSuccess = onSuccess;
      options.onError = onError;
      _this.ajax(options);
    },
    //获取身份证信息
    readCert() {
      let _this = this;

      function onSuccess(data) {
        if (data.match('"errorMsg" : "(.*?)"')[1].indexOf("读卡成功") != -1) {
          let date = new Date();
          let yearfull = date.getFullYear();
          let age = 0;
          let idCard = data.match('"certNumber" : "(.*?)"')[1];

          if (idCard.length == 18) {
            let birthyear = idCard.substring(6, 10);
            age = yearfull - birthyear;
          }
          /*let birthDate = this.getBirthDate(data.match('"certNumber" : "(.*?)"')[1]);*/
          if (idCard.length == 15) {
            let birthDay = "";
            birthDay = idCard.substring(6, 12);
            birthDay = "19" + birthDay;
            birthDay = birthDay.substring(0, 4);
            age = yearfull - birthDay;
          }
          let monthBirth = idCard.substring(10, 12);
          let dayBirth = idCard.substring(12, 14);
          let monthNow = date.getMonth() + 1;
          let dayNow = date.getDate();
          if (
            monthNow < monthBirth ||
            (monthNow == monthBirth && dayNow < dayBirth)
          ) {
            age--;
          }
          // _this.searchForm.keyword = idCard;
          _this.searchForm.idCard = idCard;
          let typeStatus = !_this.typeStatus;
          if (typeStatus) {
            _this.getPersonData(function () {
              if (_this.physicalType == "从业体检") {
                if (_this.personData.length == 0) {
                  _this.addPerson("idcard");
                  _this.personParam = {
                    testNum: "",
                    idCard: data.match('"certNumber" : "(.*?)"')[1],
                    personName: data.match('"partyName" : "(.*?)"')[1],
                    unitId: "",
                    dept: "",
                    sex: data.match('"gender" : "(.*?)"')[1],
                    age: age,
                    mobile: "",
                    physicalType: _this.physicalType,
                    /*birth:birthDate*/
                  };
                }
              } else {
                if (_this.personData.length == 0) {
                  _this.addHealthPerson();
                  _this.personParam = {
                    testNum: "",
                    idCard: data.match('"certNumber" : "(.*?)"')[1],
                    personName: data.match('"partyName" : "(.*?)"')[1],
                    unitId: "",
                    dept: "",
                    sex: data.match('"gender" : "(.*?)"')[1],
                    age: age,
                    mobile: "",
                    isPass: 1,
                    physicalType: _this.physicalType,
                    /*birth:birthDate*/
                  };
                }
              }
            });
          } else {
            _this.getReviewerData();
          }
        } else {
          _this.readShow = false;
          _this.$Message.error("身份证信息读取失败！");
        }
      }

      let options = new Object();
      options.type = "GET";
      options.url =
        "http://127.0.0.1:19196/readcard" +
        '&picpath="D:\\1\\123.bmp"' +
        "&" +
        "t=" +
        Math.random(); //URL后面加一个随机参数的目的是为了防止IE内核浏览器的数据缓存
      options.timeout = 5000;
      options.onSuccess = onSuccess;
      _this.ajax(options);
    },
    disconnect() {
      function onSuccess(data) {}

      this.initFrom();
      let options = new Object();
      options.type = "GET";
      options.url =
        "http://127.0.0.1:19196/CloseDevice" + "&" + "t=" + Math.random(); //URL后面加一个随机参数的目的是为了防止IE内核浏览器的数据缓存
      options.timeout = 5000;
      options.onSuccess = onSuccess;
      this.ajax(options);
    },
    ajax(options) {
      if (options.type == null) {
        options.type = "POST";
      }

      if (options.url == null) {
        options.url = "";
      }

      if (options.timeout == null) {
        options.timeout = 5000;
      }

      if (options.onComplate == null) {
        options.onComplate = function () {};
      }

      if (options.onError == null) {
        options.onError = function () {};
      }

      if (options.onSuccess == null) {
        options.onSuccess = function () {};
      }

      if (options.data) {
        options.data = "";
      }

      let xml;
      if (typeof ActiveXObject != "undefined") {
        let aVersions = [
          "Microsoft.XMLHTTP",
          "Msxml2.XMLHttp.6.0",
          "Msxml2.XMLHttp.5.0",
          "Msxml2.XMLHttp.4.0",
          "Msxml2.XMLHttp.3.0",
        ];
        for (let i = 0; i < aVersions.length; i++) {
          try {
            xml = new ActiveXObject(aVersions[i]);
          } catch (e) {}
        }
      } else if (typeof XMLHttpRequest != "undefined") {
        xml = new XMLHttpRequest();
      }
      xml.open(options.type, options.url, true);
      let timeoutLength = options.timeout;
      let requestDone = false;
      setTimeout(function () {
        requestDone = true;
      }, timeoutLength);
      xml.onreadystatechange = function () {
        if (xml.readyState == 4 && !requestDone) {
          if (httpSuccess(xml)) {
            options.onSuccess(httpData(xml));
          } else {
            options.onError();
          }
          options.onComplate();
          xml = null;
        }
      };
      xml.send();

      function httpSuccess(r) {
        try {
          return (
            (!r.status && location.protocol == "file:") ||
            (r.status >= 200 && r.status <= 300) ||
            r.status == 304 ||
            (navigator.userAgent.indexOf("Safari") >= 0 &&
              typeof r.status == "undefined")
          );
        } catch (e) {}
        return false;
      }

      function httpData(r) {
        let ct = r.responseType;
        if (ct) {
          if (ct == "script") {
            eval.call(window, data);
          }
          if (ct == "xml") {
            return r.responseXML;
          }
          if (ct == "json") {
            return JSON.parse(r.responseText);
          }
        }
        return r.responseText;
      }
    },
    //删除人员
    deleteTGroupPerson() {
      this.$Modal.confirm({
        title: "删除提示",
        content: "确定删除" + this.personInfo.personName + "吗？",
        onOk: () => {
          this.checkPersonLoading = true;
          deleteTGroupPerson({ ids: [this.personInfo.id] }).then((res) => {
            if (res.success) {
              this.checkPersonLoading = false;
              this.$Message.success("删除成功！");
              if (!this.typeStatus) {
                this.getPersonData();
              } else {
                this.getReviewerData();
              }
              this.$Modal.remove();
            } else {
              this.checkPersonLoading = false;
              this.$Message.success("删除失败！");
            }
          });
        },
        onCancel: () => {},
      });
    },
    updatePerson() {
      if (!this.typeStatus) {
        //修改人员状态
        updateTGroupPersonByIsPass({
          id: this.isRadioChecked,
          isPass: 2,
          registDate: formartDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
        }).then((res) => {
          if (res.success) {
            this.showPrint = true;
            this.checkPerson.push(this.isRadioChecked);
          }
        });
      } else {
        //修改复查表人员的登记状态
        updateTGroupPersonReviewerByIsPass({
          id: this.isRadioChecked,
          personId: this.personInfo.id,
        }).then((res) => {
          if (res.success) {
            this.showPrint = true;
            this.checkPerson.push(this.isRadioChecked);
          }
        });
      }
    },
    updateRegisterPerson() {
      if (!this.typeStatus) {
        //修改人员状态
        let isPass = 2;
        if (this.isShowConfirmPayment) {
          isPass = 10;
        }
        updateTGroupPersonByIsPass({
          id: this.isRadioChecked,
          isPass: isPass,
          registDate: formartDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
        }).then((res) => {
          if (res.success) {
            this.showPrint = true;
            this.checkPerson.push(this.isRadioChecked);
          }
        });
      } else {
        //修改复查表人员的登记状态
        updateTGroupPersonReviewerById({ id: this.isRadioChecked }).then(
          (res) => {
            if (res.success) {
              this.showPrint = true;
              this.checkPerson.push(this.isRadioChecked);
            }
          }
        );
      }
    },
    //健康体检确认缴费操作，把ispass改成2
    updateIsPass() {
      if (!this.typeStatus) {
        //修改人员状态
        updateTGroupPersonByIsPass({
          id: this.isRadioChecked,
          isPass: 2,
          registDate: formartDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
        }).then((res) => {
          if (res.success) {
            this.$Message.success("确认缴费成功！");
          }
        });
      } else {
        //修改复查表人员的登记状态
        updateTGroupPersonReviewerByIsPass({ id: this.isRadioChecked }).then(
          (res) => {
            if (res.success) {
              this.$Message.success("确认缴费成功！");
            }
          }
        );
      }
      this.payStatus = true;
      if (!this.typeStatus) {
        this.getPersonData();
      } else {
        this.getReviewerData();
      }
    },
    //更新订单信息
    updateOrderInfo() {
      if (!this.personParam.testNum) {
        this.$Message.error("请选择体检人员！");
        return;
      }

      this.$Modal.confirm({
        title: "提示",
        content:
          "<p>请确认体检人员编号（" +
          this.personParam.testNum +
          "）是否无误，确认后将无法修改！</p>",
        onOk: () => {
          updatePayStatus({ id: this.orderInfo.id })
            .then((res) => {
              if (res.success) {
                if (!this.typeStatus) {
                  //修改人员状态
                  updateTGroupPersonByIsPass({
                    id: this.isRadioChecked,
                    isPass: 2,
                  }).then((res) => {
                    if (res.success) {
                      this.searchForm.keyword = "";
                      this.getPersonData();
                      this.$Message.success("确认缴费成功！");
                    }
                  });
                } else {
                  //修改复查表人员的登记状态
                  updateTGroupPersonReviewerByIsPass({
                    id: this.isRadioChecked,
                  }).then((res) => {
                    if (res.success) {
                      this.searchForm.keyword = "";
                      this.getReviewerData();
                      this.$Message.success("确认缴费成功！");
                    }
                  });
                }
                this.payStatus = true;
                if (!this.typeStatus) {
                  this.getPersonData();
                } else {
                  this.getReviewerData();
                }
              }
            })
            .finally(() => {
              this.$Modal.remove();
            });
        },
        onCancel: () => {},
      });
    },
    setLabel(name) {
      name = name.split("");
      return name[0] + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + name[1];
    },
    handleAction(type) {
      if (type == 0) {
        //未登记
        this.columns = this.columns.slice(0, 4);
      } else {
        this.columns.push(
          {
            title: "检查状态",
            align: "center",
            minWidth: 100,
            ellipsis: true,
            tooltip: true,
            sortable: false,
            key: "status",
            render: (h, params) => {
              let status = params.row.status;
              if (status == 0 || !status) {
                return h(
                  "Tag",
                  {
                    props: {
                      color: "default",
                    },
                  },
                  "未检"
                );
              } else if (status == 1) {
                return h(
                  "Tag",
                  {
                    props: {
                      color: "success",
                    },
                  },
                  "到检"
                );
              } else if (status == 2) {
                return h(
                  "Tag",
                  {
                    props: {
                      color: "error",
                    },
                  },
                  "弃检"
                );
              }
            },
          },
          {
            title: "操作",
            align: "center",
            slot: "action",
            width: 120,
          }
        );
      }
    },
    statusChange(e) {
      let date = getMonthString(new Date());
      if (e == "未登记") {
        this.searchForm.isPass = 1;
        this.disabled = false;
        this.showPrint = false;
        this.searchForm.keyword = "";
        this.searchForm.pageNumber = 1;

        this.searchForm.startDate = null;
        this.searchForm.endDate = null;
        this.inputSearchChange("");

        this.handleAction(0);
      } else if (e == "已登记") {
        this.searchForm.isPass = 99;
        this.disabled = true;
        this.showPrint = true;
        this.searchForm.keyword = "";
        this.searchForm.pageNumber = 1;
        if (!this.$hospitalName.queryTimeChange) {
          if (date != null && date.length == 2) {
            this.searchForm.startDate = date[0] + " 00:00:00";
            this.searchForm.endDate = date[1] + " 23:59:59";
            this.inputSearchChange("");
          }
        } else {
          this.date = "当日";
          this.pick("当日");
        }

        this.handleAction(1);
      }
    },
    typeChange(e) {
      this.searchForm.pageNumber = 1;
      if (!e) {
        this.isReviewer = false;
        this.getPersonData();
      } else {
        this.isReviewer = true;
        this.getReviewerData();
      }
    },
    handleSetImg(e) {
      this.personParam.avatar = e;
      this.personInfo.avatar = e;
      if (!this.isUpdateUnitName && !this.isUpdateUnitNameGroup) {
        this.updateAvatar();
      }
    },
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
    //人员点击
    radioChooseClick(id, registDate) {
      this.isRadioChecked = id;
      let filter = this.checkPerson.filter((item) => item == id);
      if (registDate || filter.length > 0) {
        this.showPrint = true;
      } else {
        this.showPrint = false;
      }
    },
    //人员查询
    inputSearchChange(e) {
      if (e) {
        this.searchForm.pageNumber = 1;
      }
      this.searchForm.physicalType = this.physicalType;

      if (!this.typeStatus) {
        this.getPersonData();
      } else {
        this.getReviewerData();
      }
    },
    //查询非复查人员数据
    getPersonData(callback) {
      this.checkPersonLoading = true;
      //输入了就不带时间
      /*				if((this.searchForm.keyword && this.searchForm.keyword.trim().length>0) || (this.searchForm.personName && this.searchForm.personName.trim().length>0) || (this.searchForm.testNum && this.searchForm.testNum.trim().length>0) || (this.searchForm.dept && this.searchForm.dept.trim().length>0) || (this.searchForm.idCard && this.searchForm.idCard.trim().length>0)){
					this.searchForm.startDate = null;
					this.searchForm.endDate = null;
                    this.date = '';//取消时间筛选
				}*/
      let searchForm = JSON.parse(JSON.stringify(this.searchForm));
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
      if (
        (this.passStatus == "已登记" || this.feeStatus == "已确认") &&
        !this.$hospitalName.queryTimeChange
      ) {
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
      getTGroupPersonInspection(searchForm)
        .then((res) => {
          if (res.success) {
            this.personData = res.data.records;
            this.personTotal = res.data.total;
            this.checkPerson = [];
            if (this.personData && this.personData.length > 0) {
              this.readShow = false;
              this.isRadioChecked = this.personData[0].id;
              // this.personInfo = this.personData[0];
              if (
                this.physicalType == "从业体检" &&
                this.personData[0].orderId
              ) {
                getTGroupOrder({ id: this.personData[0].orderId }).then(
                  (res) => {
                    if (res.success) {
                      this.orderInfo = res.data;
                    }
                  }
                );
              }
            } else {
              this.isRadioChecked = "";
              this.personInfo = {};
              callback && callback();
              // this.addPerson();
              this.readShow = false;
              this.data = [];
            }
          }
        })
        .finally(() => {
          this.checkPersonLoading = false;
          this.checkPerson = [];
          this.showRadio = false;
        });
    },
    //查询复查人员信息
    getReviewerData() {
      this.checkPersonLoading = true;
      /*//输入了就不带时间
                if((this.searchForm.keyword && this.searchForm.keyword.trim().length>0) || (this.searchForm.personName && this.searchForm.personName.trim().length>0) || (this.searchForm.testNum && this.searchForm.testNum.trim().length>0) || (this.searchForm.dept && this.searchForm.dept.trim().length>0) || (this.searchForm.idCard && this.searchForm.idCard.trim().length>0)){
                    this.searchForm.startDate = null;
                    this.searchForm.endDate = null;
                    this.date = '';//取消时间筛选
                }*/
      let searchForm = JSON.parse(JSON.stringify(this.searchForm));
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
      if (
        (this.passStatus == "已登记" || this.feeStatus == "已确认") &&
        !this.$hospitalName.queryTimeChange
      ) {
        if (
          searchForm.startDate == null ||
          searchForm.startDate.trim().length == 0
        ) {
          searchForm.startDate = "0000-00-00 00:00:00";
        }
        if (
          searchForm.endDate == null ||
          searchForm.endDate.trim().length == 0
        ) {
          let endTime = getDataString(new Date());
          searchForm.endDate = endTime + " 23:59:59";
        }
      }
      getTGroupPersonReviewerList(searchForm)
        .then((res) => {
          if (res.success) {
            this.personData = res.data.records;
            this.personTotal = res.data.total;
            this.checkPerson = [];
            if (this.personData && this.personData.length > 0) {
              this.isRadioChecked = this.personData[0].id;
              if (
                this.physicalType == "从业体检" &&
                this.personData[0].orderId
              ) {
                getTGroupOrder({ id: this.personData[0].orderId }).then(
                  (res) => {
                    if (res.success) {
                      this.orderInfo = res.data;
                    }
                  }
                );
              }
            } else {
              this.personInfo = {};
              this.data = [];
              this.addPerson();
            }
          }
        })
        .finally(() => {
          this.checkPersonLoading = false;
          this.checkPerson = [];
        });
    },
    handleView(v) {
      let image = new Image();
      image.src = v;
      let viewer = new Viewer(image, {
        hidden: function () {
          viewer.destroy();
        },
      });
      viewer.show();
    },
    handleRemove() {
      this.personInfo.avatar = "";
    },
    //人像采集
    photograph() {
      this.showPhotograph = true;
    },
    updateAvatar() {
      let person = JSON.parse(JSON.stringify(this.personInfo));
      if (person.id && person.id.length > 0) {
        if (person.hazardFactorsText) {
          person.hazardFactorsText = null;
        }
        updateTGroupPersonAvatar(person).then((res) => {
          if (res.success) {
            this.personInfo.avatar = res.data;
            this.$Message.success("人脸信息更新成功！");
          }
        });
      } else {
        this.$Message.error("请先选择人员！");
      }
    },
    //打印导检单
    printInspectionSheet() {
      if (!this.personInfo.avatar && !this.isShowRegisterButton) {
        this.$Message.error("请先拍人脸信息！");
        return;
      }
      this.printSheet = true;
      this.color = true;
    },

    //单个添加体检人员信息
    addHealthPerson() {
      this.isUpdateUnitName = true;
      this.showSelectButton = true;
      this.saveShow = true;
      this.personParam = {
        physicalType: this.physicalType,
        sporadicPhysical: 1,
        isPass: 1,
        avatar: null,
      };
      this.personInfo = {};
      this.isRadioChecked = "";
      this.$refs.healthCheckup.clearProjectData();
    },
    //团单添加体检人员信息
    addHealthPersonGroup() {
      this.isUpdateUnitNameGroup = true;
      this.showSelectButton = true;
      this.saveShow = true;
      this.personParam = {
        physicalType: this.physicalType,
        sporadicPhysical: 0,
        isPass: 1,
        avatar: null,
      };
      this.isRadioChecked = "";
      this.data = [];
      this.personInfo = {};
    },
    //保存健康体检人员信息
    saveHealthPerson() {
      let _this = this;
      try {
        _this.saveLoading = true;
        _this.$refs["personParam"].validate((valid) => {
          if (valid) {
            let projectData = _this.$refs.healthCheckup.getProjectData();
            let groupData = _this.$refs.healthCheckup.getGroupData();
            if (projectData < 1) {
              _this.$Message.error("请添加体检项目信息！");
              _this.saveLoading = false;
              return;
            }
            let personParam = JSON.parse(JSON.stringify(_this.personParam));
            personParam.projectData = projectData;
            personParam.groupData = groupData;
            if (!personParam.groupData.name) {
              personParam.groupData.name = personParam.groupName;
            }
            let contentText = "";
            if (
              !_this.isUpdateUnitName &&
              !_this.isUpdateUnitNameGroup &&
              _this.showSelectButton
            ) {
              personParam.groupId = "";
              if (
                      personParam &&
                      personParam.sporadicPhysical &&
                      personParam.sporadicPhysical == "1"
              ) {
                personParam.groupData.name = personParam.groupName;
              }
              contentText =
                "请确认项目是否正确，确认后将根据当前项目创建新的分组！";
            } else {
              if (_this.isUpdateUnitNameGroup) {
                contentText =
                  "请确认信息是否正确，确认后将根据当前所选分组添加人员！";
              } else if (_this.isUpdateUnitName) {
                if (
                  _this.physicalType != "职业体检" &&
                  _this.physicalType != "放射体检"
                ) {
                  if (personParam.groupName) {
                    personParam.groupData.name = personParam.groupName;
                  }
                }
                contentText =
                  "请确认信息是否正确，确认后将根据当前信息创建分组并添加人员！";
              } else {
                contentText =
                  "请确认项目是否正确，确认后将根据当前项目创建新的分组！";
              }
            }
            console.log("=============");
            if (personParam.hazardFactorsText && personParam.id) {
              personParam.hazardFactorsText = null;
            }
            this.$Modal.confirm({
              title: "提示",
              content: "<p>" + contentText + "</p>",
              onOk: () => {
                saveOrUpdatePersonInfo(personParam)
                  .then((res) => {
                    if (res.success) {
                      _this.$Message.success("保存成功！");
                      if (!_this.typeStatus) {
                        if (
                          _this.personParam.id &&
                          (!_this.isUpdateUnitName ||
                            !_this.isUpdateUnitNameGroup)
                        ) {
                          _this.queryPersonData(_this.personParam.id, 1);
                        } else {
                          _this.getPersonData();
                        }
                      } else {
                        _this.getReviewerData();
                      }
                    }
                  })
                  .finally(() => {
                    _this.saveLoading = false;
                    this.$Modal.remove();
                  });
              },
              onCancel: () => {
                _this.saveLoading = false;
                this.$Modal.remove();
              },
            });
          } else {
            _this.saveLoading = false;
            _this.$Message.error("表单验证不通过！");
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
    //查询已确认的健康体检订单
    queryOrderData() {
      queryAllTGroupOrderList({
        physicalType: this.physicalType,
        payStatus: 1,
      }).then((res) => {
        if (res.success) {
          this.orderArr = res.data;
        }
      });
    },
    //团检单位选择触发事件
    onOrderSelectChange(e) {
      if (e) {
        // this.personParam.orderId = e.value;
        // this.personParam.unitId = e.tag;
        this.personParam.unitId = e.value;
        this.personParam.dept = e.label;
      }
    },
    //团检订单选择触发事件
    onOrderSelectChangeGroup(e) {
      if (e) {
        this.personParam.orderId = e.tag;
        this.personParam.dept = e.label;
        this.personParam.unitId = e.value;
        if (this.personParam.orderId) {
          //根据订单查询分组
          this.selectOrderGroup(this.personParam.orderId);
        }
      }
    },
    //根据订单查询分组
    selectOrderGroup(orderId) {
      this.groupByOrderData = [];
      queryTOrderGroupList({ groupOrderId: orderId }).then((res) => {
        if (res.success) {
          this.groupByOrderData = res.data;
          if (!(this.groupByOrderData && this.groupByOrderData.length > 0)) {
            //团单 订单id查询分组为空 开放选择套餐项目功能
            this.showSelectButton = true;
          } else if (
            this.personParam &&
            this.personParam.sporadicPhysical &&
            this.personParam.sporadicPhysical == "1"
          ) {
            //零星体检人员 开放选择套餐项目功能
            this.showSelectButton = true;
          } else if (this.isUpdateUnitNameGroup || this.isUpdateUnitName) {
            //新增 默认开放选择套餐项目功能
            this.showSelectButton = true;
          } else {
            //团单 订单id查询分组不为空 不开放选择套餐项目功能
            this.showSelectButton = false;
          }
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //清除分组
    clearGroupId() {
      this.personParam.groupId = "";
      this.data = [];
      this.showSelectButton = true;
    },
    //分组选择触发事件
    changeGroup(e) {
      let _this = this;
      if (e) {
        _this.personParam.groupId = e.value;
        this.showSelectButton = false;
        _this.personParam.groupName = e.label;
        if (e.tag) {
          if (e.tag.projectData && e.tag.projectData.length > 0) {
            this.data = e.tag.projectData;
          }

          if (
            (this.physicalType == "职业体检" ||
              this.physicalType == "放射体检") &&
            e.tag.name &&
            e.tag.name.toString().trim().length > 0
          ) {
            let nameSplit = [];
            nameSplit = e.tag.name.split("[");
            if (nameSplit.length > 0) {
              let nameSplitTwo = nameSplit[1].split("]");
              let workStateText = nameSplitTwo[0];
              if (workStateText) {
                let workStateNow = this.workStateCodeArr.filter(
                  (item) => item.title && item.title.indexOf(workStateText) > -1
                );
                if (workStateNow && workStateNow.length > 0) {
                  this.personParam.workStateCode = workStateNow[0].value;
                  this.personParam.workStateText = workStateNow[0].title;
                }
              }
            }
          }
          if (
            (this.physicalType == "职业体检" ||
              this.physicalType == "放射体检") &&
            e.tag.hazardFactorCodes &&
            e.tag.hazardFactorCodes.length > 0 &&
            e.tag.hazardFactorTexts &&
            e.tag.hazardFactorTexts.length > 0
          ) {
            let ids = e.tag.hazardFactorCodes;
            let txts = e.tag.hazardFactorTexts;
            _this.personParam.hazardFactors = ids.join("|");
            _this.personParam.hazardFactorsText = txts.join("|");
            if (_this.personParam.hazardFactors) {
              for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let txt = txts[i];
                _this.selectedHarmList.push({
                  typeCode: id,
                  typeName: txt,
                });
              }
            } else {
              _this.selectedHarmList = [];
            }
          }
        }
      }
    },
    personChangePageNum(v) {
      this.searchForm.pageNumber = v;
      this.inputSearchChange("");
    },
    queryPersonData(val, type) {
      this.isUpdateUnitName = false;
      this.isUpdateUnitNameGroup = false;
      if (!this.typeStatus) {
        getTGroupPersonAndUnit({ id: val })
          .then((res) => {
            if (res.success) {
              this.personInfo = res.data.personData;
              if (this.personInfo && this.personInfo.orderId) {
                this.selectOrderGroup(this.personInfo.orderId);
              }
              this.groupData[0].projectData = res.data.projectData;
              this.data = res.data.projectData;
              this.tGroupData = res.data.groupData;
              if (!this.tGroupData) {
                this.tGroupData = {};
              }
              if (this.physicalType == "从业体检") {
                this.personParam = res.data.personData;
                this.projectInfo = res.data.projectData;

                this.comboId = this.personParam.comboId;
                if (
                  this.personParam.avatar &&
                  this.personParam.avatar.indexOf("/dcm") <= -1
                ) {
                  this.personParam.avatar =
                    "data:image/png;base64," + this.personParam.avatar;
                }
                if (this.personParam.orderId) {
                  getTGroupOrder({ id: this.personParam.orderId }).then(
                    (res) => {
                      if (res.success) {
                        this.orderInfo = res.data;
                      }
                    }
                  );
                }
                if (this.searchForm.isPass == 99) {
                  this.showPrint = true;
                } else {
                  this.showPrint = false;
                }
                this.sumTotal();
              } else if (this.physicalType == "健康体检") {
                this.personParam = res.data.personData;
                this.projectInfo = res.data.projectData;
                if (
                  this.personParam.avatar &&
                  this.personParam.avatar.indexOf("/dcm") <= -1
                ) {
                  this.personParam.avatar =
                    "data:image/png;base64," + this.personParam.avatar;
                }
                if (this.personParam.isPass == 10) {
                  this.showPrint = true;
                  this.payStatus = false;
                } else if (this.personParam.isPass == 2) {
                  this.payStatus = true;
                } else {
                  this.showPrint = false;
                  this.payStatus = false;
                }
              } else {
                this.personParam = res.data.personData;
                this.personInfo = res.data.personData;
                this.data = res.data.projectData;
                this.projectInfo = res.data.projectData;
                if (
                  this.personInfo.avatar &&
                  this.personInfo.avatar.indexOf("/dcm") <= -1
                ) {
                  this.personInfo.avatar =
                    "data:image/png;base64," + this.personInfo.avatar;
                }
              }
              if (this.personParam.orderId && this.personParam.orderId != "") {
                this.isUpdateUnitName = false;
              }
              if (type == 1) {
                this.personData.forEach((item) => {
                  if (item.id == this.personInfo.id) {
                    item.personName = this.personInfo.personName;
                    item.sex = this.personInfo.sex;
                    item.age = this.personInfo.age;
                  }
                });
              }
            }
          })
          .finally(() => {
            this.showRadio = false;
          });
      } else {
        if (this.physicalType == "从业体检") {
          if (this.feeStatus == "已确认") {
            this.passStatus = "已登记";
          } else {
            this.passStatus = "未登记";
          }
        }
        getTGroupPersonReviewerById({ id: val, passStatus: this.passStatus })
          .then((res) => {
            if (res.success) {
              this.personInfo = res.data.personData;
              if (this.personInfo && this.personInfo.orderId) {
                this.selectOrderGroup(this.personInfo.orderId);
              }
              this.groupData[0].projectData = res.data.projectData;
              this.data = res.data.projectData;
              if (this.physicalType == "从业体检") {
                this.personParam = res.data.personData;
                this.projectInfo = res.data.projectData;
                if (
                  this.personParam.avatar &&
                  this.personParam.avatar.indexOf("/dcm") <= -1
                ) {
                  this.personParam.avatar =
                    "data:image/png;base64," + this.personParam.avatar;
                }
                if (this.personParam.orderId) {
                  getTGroupOrder({ id: this.personParam.orderId }).then(
                    (res) => {
                      if (res.success) {
                        this.orderInfo = res.data;
                      }
                    }
                  );
                }
                if (this.searchForm.isPass == 99) {
                  this.showPrint = true;
                } else {
                  this.showPrint = false;
                }
              } else if (this.physicalType == "健康体检") {
                this.personParam = res.data.personData;
                if (
                  this.personParam.avatar &&
                  this.personParam.avatar.indexOf("/dcm") <= -1
                ) {
                  this.personParam.avatar =
                    "data:image/png;base64," + this.personParam.avatar;
                }
                if (this.personParam.isPass == 10) {
                  this.showPrint = true;
                  this.payStatus = false;
                } else if (this.personParam.isPass == 2) {
                  this.payStatus = true;
                } else {
                  this.showPrint = false;
                  this.payStatus = false;
                }
              } else {
                this.personParam = res.data.personData;
                this.personInfo = res.data.personData;
                this.data = res.data.projectData;
                this.projectInfo = res.data.projectData;
                if (
                  this.personInfo.avatar &&
                  this.personInfo.avatar.indexOf("/dcm") <= -1
                ) {
                  this.personInfo.avatar =
                    "data:image/png;base64," + this.personInfo.avatar;
                }
              }
              if (this.personParam.orderId && this.personParam.orderId != "") {
                this.isUpdateUnitName = false;
              }
              if (type == 1) {
                this.personData.forEach((item) => {
                  if (item.id == this.personInfo.id) {
                    item.personName = this.personInfo.personName;
                    item.sex = this.personInfo.sex;
                    item.age = this.personInfo.age;
                  }
                });
              }
            }
          })
          .finally(() => {
            this.showRadio = false;
          });
      }
    },
  },
  mounted() {
    this.tableHeight =
      document.documentElement.clientHeight - 530 < 200
        ? 200
        : document.documentElement.clientHeight - 530;
    this.searchForm.physicalType = this.physicalType;

    //未点击确认登记前,是否展示打印导检单按钮
    if (this.$hospitalName.isShowRegisterButton) {
      this.isShowRegisterButton = this.$hospitalName.isShowRegisterButton;
    } else {
      this.isShowRegisterButton = false;
    }

    //是否展示零星新增按钮
    if (this.$hospitalName && this.$hospitalName.isShowAloneAddButton) {
      this.isShowAloneAddButton = this.$hospitalName.isShowAloneAddButton;
    } else {
      this.isShowAloneAddButton = false;
    }

    //是否展示确认缴费按钮
    if (this.$hospitalName.isShowConfirmPayment) {
      this.isShowConfirmPayment = this.$hospitalName.isShowConfirmPayment;
    } else {
      this.isShowConfirmPayment = false;
    }

    //在岗状态
    getDictDataByType("workState").then((res) => {
      if (res.success) {
        this.workStateCodeArr = res.data;
      }
    });
    //婚姻状态
    getDictDataByType("marry_type").then((res) => {
      if (res.success) {
        this.marriageArr = res.data;
      }
    });
    //民族
    getDictDataByType("nation").then((res) => {
      if (res.success) {
        this.nationArr = res.data;
      }
    });
    //从业类别
    getDictDataByType("certificate_type").then((res) => {
      if (res.success) {
        this.certificateTypeArr = res.data;
      }
    });

    queryAllTGroupUnitList({
      physicalType: this.searchForm.physicalType,
    }).then((res) => {
      if (res.success) {
        this.unitArr = res.data;
      }
    });
    this.checkPersonLoading = true;
    let userInfo = Cookies.get("userInfo");
    userInfo = JSON.parse(userInfo);
    this.officeId = userInfo.departmentId;
    this.queryOrderData();
    let date = getMonthString(new Date());
    if (!this.$hospitalName.queryTimeChange) {
      if (date != null && date.length == 2) {
        this.inputSearchChange("");
      }
    } else {
      if (this.passStatus == "已登记") {
        this.date = "当日";
        this.pick("当日");
      } else if (this.feeStatus == "已确认") {
        this.date = "当日";
        this.pick("当日");
      } else {
        this.inputSearchChange("");
      }
    }
  },
  watch: {
    "searchForm.isPass"(val) {
      if (val && val == 99) {
        this.projectColumns = this.projectColumns.filter(
          (i) => i.key != "action"
        );
      } else {
        this.projectColumns = this.getColumns();
      }
    },
    isRadioChecked(val) {
      if (this.physicalType == "健康体检") {
        this.$refs.healthCheckup.clearProjectData();
      }
      if (val && val.length > 0) {
        this.showRadio = true;
        this.showPrint = false;
        this.queryPersonData(val);
      }
    },
  },
};
</script>

<style lang="less">
@import "../../../styles/tree&table-common.less";

.physicalRegister {
  padding: 10px;
  box-sizing: border-box;
  height: 100%;

  .ivu-alert {
    .explain {
      display: flex;
      margin: 5px 0;
    }
  }

  .topForm .ivu-form-item {
    margin-bottom: 0 !important;

    .ivu-form-item-content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

  .empty {
    text-align: center;
    color: #515a6e;
    margin-top: 20px;
  }

  .alert {
    margin-bottom: 10px !important;
  }

  //重置
  .btngroup {
    display: flex;
    margin-bottom: 10px;

    .ivu-radio-group-item {
      padding: 0 6px !important;
      font-size: 13px !important;
      user-select: none;
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

  .ivu-card-body {
    height: 100%;
  }

  //图片
  .img-wrapper {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
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

    .row-border {
      margin-left: 0 !important;
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

    .radio-group-radio {
      display: flex;
      justify-content: center;
      align-items: center;

      .ivu-radio-wrapper {
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

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 150px;
    line-height: 150px;
    background: rgba(0, 0, 0, 0.6);
    text-align: center;

    &:hover {
      display: block;
      background: rgba(0, 0, 0, 0.6);
    }
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .pic {
    min-width: 130px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    .pic-box {
      display: flex;
      justify-content: center;
      padding: 2px;
      box-sizing: border-box;
      align-items: center;
      width: 130px;
      height: 150px;
      line-height: 150px;
      margin-right: 10px;
      border: 1px dashed #2988f3;
      cursor: pointer;
      flex-direction: column;
      position: relative;

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

  .ivu-form-item {
    margin-bottom: 0 !important;
  }

  .ivu-tooltip {
    width: 100%;
  }

  .ivu-tooltip-rel {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    width: 120px;
  }

  .ivu-form-item-content {
    position: relative;
    line-height: 32px;
    font-size: 14px;
    display: flex;
  }
}
</style>
