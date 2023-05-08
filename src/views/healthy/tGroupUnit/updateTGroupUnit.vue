<style lang="less">
.tGroupUnit {
    .ivu-modal {
        width: 50vw !important;
        min-width: 840px;
    }


    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 200px;
        line-height: 200px;
        background: rgba(0, 0, 0, .6);
        text-align: center;

        &:hover {
            display: block;
            background: rgba(0, 0, 0, .6);
        }
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }


    .pic {
        margin-left: 30px;
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
            width: 200px;
            height: 160px;
            line-height: 160px;
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

    .rg-caller-container {
        width: 100% !important;
    }

    .rg-default-btn {
        display: flex !important;
        justify-content: space-between !important;
        width: 100%;
        align-items: center;
    }

    .rg-default-btn {
        &:hover {
            outline: 0;
            box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
            border: 1px solid #57a3f3 !important;
        }
    }

    .rg-default-btn {
        span {
            color: #c5c8ce;
        }
    }
}
</style>
<template>
    <Modal v-model="show" :title="editTitle" class="tGroupUnit" :mask-closable="false">
        <Form ref="tGroupUnitForm" :model="tGroupUnitForm" :rules="tGroupUnitFormRule" :label-width="140">
            <Tabs type="card" @on-click="onTabsClick" v-model="tabsValue">
                <TabPane label="基础信息" name="基础信息">
                    <Spin size="large" fix v-if="spinShow"></Spin>
                    <div v-show="show1" style="margin-top: 10px;">
                        <Row>
                            <Col :span="19">
                                <Row>
                                    <Col span="12">
                                        <FormItem label="单位名称" prop="name">
                                            <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tGroupUnitForm.name"
                                                   placeholder="请输入单位名称"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="体检类型" prop="physicalType">
                                            <Select disabled v-model="tGroupUnitForm.physicalType" placeholder="请选择"
                                                    clearable>
                                                <Option v-for="(item, i) in inspectTypePriority" :key="item.id" :value="item.value">{{item.title}}</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem label="统一社会信用代码" prop="uscc">
                                            <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tGroupUnitForm.uscc"
                                                   placeholder="请输入统一社和信用代码"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="行业类型" prop="industryCode">
                                            <TreeSelect ref="tree" :data="industryCodePriority" :disabled="disabled"
                                                        v-model="tGroupUnitForm.industryCode"
                                                        transfer @on-change="onIndustrySelect"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem label="所属地区" prop="regionCode">
                                            <Select :filterable="true" v-model="tGroupUnitForm.regionCode" v-bind:disabled="disabled"
                                                    :label-in-value="true" @on-change="addrChange" placeholder="请选择">
                                                <Option v-for="(item, i) in regionPriority" :key="item.value" :value="item.value"
                                                        :disabled="item.value.toString().substring(item.value.toString().length - 4) == '0000' ? true : false">
                                                    {{item.title }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="经济类型" prop="economicTypeCode">
                                            <TreeSelect :data="economicTypeCodePriority" :disabled="disabled"
                                                        v-model="tGroupUnitForm.economicTypeCode"
                                                        transfer @on-change="onEconomicTypeSelect"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem label="单位注册地址" prop="address">
                                            <Input v-bind:disabled="disabled" type="text" :maxlength=100 v-model="tGroupUnitForm.address"
                                                   placeholder="请输入单位注册地址"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="企业规模" prop="businessScaleCode">
                                            <Select v-bind:disabled="disabled" v-model="tGroupUnitForm.businessScaleCode" placeholder="请选择" clearable
                                                    transfer
                                                    @on-select="onBusinessScaleSelect">
                                                <Option v-for="(item, i) in businessScaleCodePriority" :key="item.value" :value="item.value">
                                                    {{ item.title }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row v-if="this.physicalType != '从业体检'">
                                    <Col span="12">
                                        <FormItem label="职工人数" prop="employeesNum">
                                            <InputNumber v-bind:disabled="disabled" v-model="tGroupUnitForm.employeesNum" placeholder="请输入职工人数"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="接触职业病危害因素人数" prop="dangerNum">
                                            <InputNumber v-bind:disabled="disabled" :max="tGroupUnitForm.employeesNum" v-model="tGroupUnitForm.dangerNum" placeholder="请输入接触职业病危害因数人数"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                            <Col :span="5">
                                <div class="pic">
                                    <div class="pic-box" :style="{'border':tGroupUnitForm.attachment?'0 !important;':'auto'}" @click="upload">
                                        <input ref="upload" type="file" accept="image/*" @change="inputChange" style="display: none;"/>
                                        <Icon type="ios-add" size="24" color="#2988f3" v-if="!tGroupUnitForm.attachment"/>
                                        <template v-else>
                                            <img :src="tGroupUnitForm.attachment" style="height: 100%;width: 100%;">
                                            <div class="demo-upload-list-cover">
                                                <Icon type="ios-eye-outline" @click.native.stop="handleView(tGroupUnitForm.attachment)"></Icon>
                                                <Icon type="ios-trash-outline" @click.native.stop="handleRemove()"></Icon>
                                            </div>
                                        </template>
                                        <span style="height: auto;line-height: 0;margin-top: 30px;color: #2988f3;"
                                              v-if="!tGroupUnitForm.attachment">上传营业执照</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="体检联系人姓名" prop="linkMan2">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tGroupUnitForm.linkMan2"
                                           placeholder="请输入联系人姓名"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="体检联系人电话" prop="linkPhone2">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tGroupUnitForm.linkPhone2"
                                           placeholder="请输入联系人电话"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row v-if="isHumanResources">
                            <Col span="12">
                                <FormItem label="用工单位名称" prop="crptNameEmp">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tGroupUnitForm.crptNameEmp"
                                           placeholder="请输入用工单位名称"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="用工单位统一社会信用代码" prop="creditCodeEmp">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tGroupUnitForm.creditCodeEmp"
                                           placeholder="请输入用工单位统一社和信用代码"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row v-if="isHumanResources">
                            <Col span="12">
                                <FormItem label="用工单位行业类型" prop="indusTypeCodeEmp">
                                    <TreeSelect ref="tree" :data="industryCodePriority" :disabled="disabled"
                                                v-model="tGroupUnitForm.indusTypeCodeEmp"
                                                transfer @on-change="indusTypeCodeEmpSelect"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="用工单位所属地区" prop="zoneCodeEmp">
                                    <Select :filterable="true" v-model="tGroupUnitForm.zoneCodeEmp" v-bind:disabled="disabled"
                                            :label-in-value="true" @on-change="zoneCodeEmpChange" placeholder="请选择">
                                        <Option v-for="(item, i) in regionPriority" :key="item.value" :value="item.value"
                                                :disabled="item.value.toString().substring(item.value.toString().length - 4) == '0000' ? true : false">
                                            {{item.title }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row v-if="isHumanResources">
                            <Col span="12">
                                <FormItem label="用工单位经济类型" prop="economyCodeEmp">
                                    <TreeSelect :data="economicTypeCodePriority" :disabled="disabled"
                                                v-model="tGroupUnitForm.economyCodeEmp"
                                                transfer @on-change="economyCodeEmpSelect"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="用工单位企业规模" prop="crptSizeCodeEmp">
                                    <Select v-bind:disabled="disabled" v-model="tGroupUnitForm.crptSizeCodeEmp" placeholder="请选择" clearable
                                            transfer
                                            @on-select="crptSizeCodeEmpSelect">
                                        <Option v-for="(item, i) in businessScaleCodePriority" :key="item.value" :value="item.value">
                                            {{ item.title }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row v-if="isHumanResources">
                            <Col span="12">
                                <FormItem label="是否分支机构" prop="ifSubOrg">
                                    <RadioGroup v-model="tGroupUnitForm.ifSubOrg" style="">
                                        <Radio label="0">否</Radio>
                                        <Radio label="1">是</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                            <Col span="12" v-if="tGroupUnitForm.ifSubOrg==1">
                                <FormItem label="上级单位社会信用代码" prop="upperInstituttonCode">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tGroupUnitForm.upperInstituttonCode"
                                           placeholder="请输入上级单位社会信用代码"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </TabPane>
                <TabPane label="其他信息" name="其他信息">
                    <div v-show="show2" style="margin-top: 10px;">
                        <Row>
                            <Col span="12">
                                <FormItem label="法人姓名" prop="legalPerson">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tGroupUnitForm.legalPerson"
                                           placeholder="请输入法人姓名"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="法人电话" prop="legalPhone">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tGroupUnitForm.legalPhone"
                                           placeholder="请输入法人电话"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="生产工人数" prop="workmanNum">
                                    <InputNumber v-bind:disabled="disabled" v-model="tGroupUnitForm.workmanNum" placeholder="请输入生产工人数"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="接触职业病危害因素女工人数" prop="workmistressNum">
                                    <InputNumber v-bind:disabled="disabled" :max="tGroupUnitForm.dangerNum" v-model="tGroupUnitForm.workmistressNum" placeholder="请输入接触职业病危害因素女工人数"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="单位注册邮编" prop="postalCode">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=6 v-model="tGroupUnitForm.postalCode"
                                           placeholder="请输入单位注册邮编"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="经营面积" prop="workArea">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=25 v-model="tGroupUnitForm.workArea"
                                           placeholder="请输入经营面积"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="注册资金" prop="regCapital">
                                    <Input v-bind:disabled="disabled" type="text" v-model="tGroupUnitForm.regCapital" placeholder="请输入注册资金"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="职业卫生安全负责人" prop="safetyPrincipal">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=25 v-model="tGroupUnitForm.safetyPrincipal"
                                           placeholder="请输入职业卫生安全负责人"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="建档日期" prop="filingDateTime">
                                    <DatePicker v-bind:disabled="disabled" style="width:100%;" type="date" placeholder="请选择建档日期"
                                                :options="dateOptions"
                                                v-model="tGroupUnitForm.filingDate" format="yyyy-MM-dd"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="建厂日期" prop="establishmentDateTime">
                                    <DatePicker v-bind:disabled="disabled" style="width:100%;" type="date" placeholder="请选择建厂日期"
                                                :options="dateOptions"
                                                v-model="tGroupUnitForm.establishmentDate"></DatePicker>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="检测联系人" prop="linkMan1">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=25 v-model="tGroupUnitForm.linkMan1"
                                           placeholder="请输入检测联系人"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="检测联系电话" prop="linkPhone1">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=15 v-model="tGroupUnitForm.linkPhone1"
                                           placeholder="请输入检测联系电话"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="检测联系人职务" prop="position1">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=25 v-model="tGroupUnitForm.position1"
                                           placeholder="请输入检测联系人职务"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="体检联系人职务" prop="position2">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=25 v-model="tGroupUnitForm.position2"
                                           placeholder="请输入体检联系人职务"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="安全联系人职务" prop="safePosition">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=25 v-model="tGroupUnitForm.safePosition"
                                           placeholder="请输入安全联系人职务"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="安全联系人电话" prop="safePhone">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=15 v-model="tGroupUnitForm.safePhone"
                                           placeholder="请输入安全联系人电话"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="隶属关系" prop="subjeConn">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=50 v-model="tGroupUnitForm.subjeConn"
                                           placeholder="请输入隶属关系"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="作业场所地址" prop="enrolAddress">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=100 v-model="tGroupUnitForm.enrolAddress"
                                           placeholder="请输入作业场所地址"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="作业场所邮编" prop="enrolPostalCode">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=6 v-model="tGroupUnitForm.enrolPostalCode"
                                           placeholder="请输入作业场所邮编"/>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="职业卫生管理机构" prop="occManaOffice">
                                    <Input v-bind:disabled="disabled" type="text" :maxlength=100 v-model="tGroupUnitForm.occManaOffice"
                                           placeholder="请输入职业卫生管理机构"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </TabPane>
                <TabPane label="检测信息" name="检测信息">
                    <div v-show="show3">
                        <div style="margin-bottom: 10px;margin-top: 10px;" v-if="!disabled">
                            <Button type="info" icon="md-add-circle" @click.native="handleAddClick">新增</Button>
                            <span style="font-weight: bold;color:red;height: 30px;line-height: 30px;">职业性有害因素检测情况</span>
                        </div>
                        <div v-else>
                            <span style="font-weight: bold;color:red;height: 30px;line-height: 30px;">职业性有害因素检测情况</span>
                        </div>
                        <Table border :columns="testRecordColumns" sortable="custom" :data="testRecordData" ref="table" :max-height="250">
                            <template slot-scope="{ row, index }" slot="action">
                                <Button type="error" @click="handleDelete(row, index)" size="small" v-if="!disabled">
                                    <Icon type="md-trash"></Icon>
                                    删除
                                </Button>
                            </template>
                        </Table>
                    </div>
                </TabPane>
            </Tabs>
        </Form>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handSubmit" v-if="!disabled">提交</Button>
        </div>
        <harmDrawer v-model="hazardFactorsShow" @harmReback="hazardFactorsReback" :selectedHarmList="hazardFactorsSelect"
                    selectType="checkbox"></harmDrawer>
        <chooseWorkType v-model="workShow" @workCodeReback="workCodeReback"></chooseWorkType>
    </Modal>

</template>
<script>
import {addTGroupUnit, updateTGroupUnit, getTGroupUnit} from '@/api/healthy/tGroupUnit'
import {queryTTestRecordListAll} from '@/api/healthy/tTestRecord'
import {getDictDataByType} from "../../../api";
import Viewer from "viewerjs";
import {queryProTypeByTypeCode} from "../../../api/healthy/tProType";
import util from "../../../libs/util";
import {formatDate} from "@/api/tool.js"
import ChooseSymptom from "../tGroupPerson/chooseWorkType";
import previewTemplate from "../tCheckStation/previewTemplate";
import fsDrawer from "../tGroupPerson/fsDrawer";
import harmDrawer from "../tCombo/harmDrawer";
import chooseWorkType from "../tGroupPerson/chooseWorkType";

export default {
    name: "updateTGroupUnit",
    components: {
        harmDrawer,
        chooseWorkType
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        TGroupUnitId: {
            type: String
        },
        modalTitle: {
            type: String
        }
    },
    data() {
        return {
            workStateData: [
                {
                    value: '1001',
                    label: '上岗前'
                },
                {
                    value: '1002',
                    label: '在岗期间'
                },
                {
                    value: '1003',
                    label: '离岗时'
                },
                {
                    value: '1004',
                    label: '离岗后'
                },
                {
                    value: '1005',
                    label: '应急健康检查'
                },
            ],
            hazardFactorsSelect: [],
            hazardFactorsIndex: 0,
            hazardFactorsShow: false,
            workTypeIndex: 0,
            workShow: false,
            testRecordData: [], //检测信息数据集
            testRecordColumns: [
                {
                    type: 'index',
                    key: "index",
                    width: 60,
                    align: 'center'
                },{
                    title: '职业有害因素',
                    align: 'center',
                    minWidth: 150,
                    key: 'hazardFactorsCode',
                    sortable: false,
                    render: (h, params) => {
                        return h("Input", {
                            props: {
                                readonly: true,
                                placeholder: '请选择危害因素',
                                value: params.row.hazardFactorsText,
                                disabled: this.disabled,
                            },
                            nativeOn: {
                                click: (e) => {
                                    this.hazardFactorsIndex = params.index;
                                    this.hazardFactorsSelect = [];
                                    if (params.row.hazardFactorsCode) {
                                        let codes = params.row.hazardFactors.split("|");
                                        let texts = params.row.hazardFactorsText.split("|");
                                        for (let i = 0; i < codes.length; i++) {
                                            this.hazardFactorsSelect.push({
                                                typeCode: codes[i],
                                                typeName: texts[i]
                                            })
                                        }
                                    }
                                    this.hazardFactorsShow = true;
                                }
                            },
                        });
                    }
                },{
                    title: '其他有害因素',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'otherHazardFactors',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.otherHazardFactors,
                                    disabled: this.disabled,
                                },
                                on: {
                                    input: (val) => {
                                        this.testRecordData[params.index].otherHazardFactors = val;
                                    }
                                }
                            })
                        ]);
                    }
                },{
                    title: '在岗状态',
                    align: 'center',
                    minWidth: 160,
                    ellipsis: true,
                    tooltip: true,
                    key: 'workStateCode',
                    sortable: false,
                    render: (h, params) => {
                        return h('Select', {
                            props: {
                                value: params.row.workStateCode,
                                transfer: true,
                                filterable: true,
                                allowCreate: true,
                                clearable: true,
                                disabled: this.disabled,
                            },
                            on: {
                                'on-change': e => {
                                    let workStateDataNew = this.workStateData.filter(item => item.value && item.value==e)
                                    if(workStateDataNew && workStateDataNew.length>0){
                                        this.testRecordData[params.index].workStateCode = workStateDataNew[0].value;
                                        this.testRecordData[params.index].workStateText = workStateDataNew[0].label;
                                    }
                                },
                            }
                        }, this.workStateData.map(item => {
                            return h('Option', {
                                props: {
                                    value: item.value,
                                    label: item.label
                                }
                            })
                        }))
                    }
                },{
                    title: '工种',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'workTypeCode',
                    sortable: false,
                    render: (h, params) => {
                        return h("Input", {
                            props: {
                                readonly: true,
                                placeholder: '请选择工种',
                                value: params.row.workTypeText,
                                disabled: this.disabled,
                            },
                            nativeOn: {
                                click: (e) => {
                                    this.workShow = true;
                                    this.workTypeIndex = params.index;
                                }
                            },
                        });
                    }
                },{
                    title: '其他工种',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'workName',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.workName,
                                    disabled: this.disabled,
                                },
                                on: {
                                    input: (val) => {
                                        this.testRecordData[params.index].workName = val;
                                    }
                                }
                            })
                        ]);
                    }
                },{
                    title: '浓度（强度）范围',
                    align: 'center',
                    minWidth: 150,
                    ellipsis: true,
                    tooltip: true,
                    key: 'strength',
                    sortable: false,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    placeholder: '请输入',
                                    value: params.row.strength,
                                    disabled: this.disabled,
                                },
                                on: {
                                    input: (val) => {
                                        this.testRecordData[params.index].strength = val;
                                    }
                                }
                            })
                        ]);
                    }
                },{
                    title: '检测时间',
                    align: 'center',
                    width: 190,
                    ellipsis: true,
                    tooltip: true,
                    sortable: false,
                    render: (h, params) => {
                        params.row.selectDate = formatDate(params.row.selectDate, "yyyy-MM-dd HH:mm:ss")
                        return h("DatePicker", {
                            props: {
                                type: "datetime",
                                placeholder: '请选择',
                                value: params.row.testTime,
                                transfer: true,
                                disabled: this.disabled,
                            },
                            on: {
                                'on-change': (val) => {
                                    this.testRecordData[params.index].testTime = val;
                                }
                            }
                        })
                    }
                },{
                    fixed: 'right',
                    title: '操作',
                    align: 'center',
                    slot: 'action',
                    width: 100,
                }
            ],

            tabsValue: "基础信息",
            show1: true,
            show2: false,
            show3: false,
            show: this.value,
            editTitle: this.modalTitle,
            loading: true,
            disabled: false,
            spinShow: false,
            industryCodePriority: [],
            businessScaleCodePriority: [],
            economicTypeCodePriority: [],
            regionPriority: [],
            tGroupUnitForm: {
                physicalType: '',
                name: '',
                uscc: '',
                legalPerson: '',
                regCapital: '',
                establishmentDateTime: '',
                establishmentDate: '',
                industryCode: '',
                businessScaleCode: '',
                economicTypeCode: '',
                address: '',
                attachment: '',
                industryName: '',
                businessScaleName: '',
                economicTypeName: '',
                regionCode: '',
                regionName: '',
                employeesNum: null,
                dangerNum: null,
                legalPhone: '',
                workmanNum: null,
                workmistressNum: null,
                postalCode: '',
                workArea: '',
                filingDateTime: '',
                filingDate: '',
                linkMan1: '',
                position1: '',
                linkPhone1: '',
                linkMan2: '',
                position2: '',
                linkPhone2: '',
                safetyPrincipal: '',
                safePosition: '',
                safePhone: '',
                subjeConn: '',
                enrolAddress: '',
                enrolPostalCode: '',
                occManaOffice: '',
                testRecordData: [],
                upperInstituttonCode: '',//上级社会信用代码
                ifSubOrg: '',//用工单位是否分支机构 1是0否
                creditCodeEmp: '',//统一社和信用代码(用工单位)
                crptNameEmp: '',//单位名称(用工单位)
                indusTypeCodeEmp: '',//行业类型编码(用工单位)
                economyCodeEmp: '',//经济类型编码(用工单位)
                crptSizeCodeEmp: '',//企业规模编码(用工单位)
                zoneCodeEmp: '',//所属地区编码(用工单位)
            },
            isHumanResources: false,//是否为人力资源类公司
            tGroupUnitFormRule: this.getTGroupUnitFormRule(),
            dateOptions: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now() + 1;
                }
            },
            regionCode: {},
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
                value: "放射体检",
                title: "放射体检",
            }, {
                id: '4',
                value: "从业体检",
                title: "从业体检",
            }],//体检类型
        }
    },
    computed: {
        physicalType() {
            return this.$store.state.theme.theme.physicalType;
        },
    },
    methods: {
        handleDelete(row, index) {
            this.testRecordData.splice(index, 1);
        },
        handleAddClick(type) {
            /*if (!this.TGroupUnitId) {
                this.$Message.error("请选择订单！")
                return;
            }*/
            this.testRecordData.push({
                unitId: this.TGroupUnitId,
                hazardFactors: "",
                hazardFactorsText: "",
                otherHazardFactors: "",
                workStateText: "",
                workStateCode: "",
                workTypeText: "",
                workTypeCode: "",
                workName: "",
                strength: "",
                testTime: "",
            });
        },
        workCodeReback(v) {
            if (v && v.length > 0) {
                if(this.testRecordData && this.testRecordData[this.workTypeIndex]){
                    this.$set(this.testRecordData[this.workTypeIndex], "workTypeCode", v[0].value)
                    this.$set(this.testRecordData[this.workTypeIndex], "workTypeText", v[0].title)
                }
            }
        },
        hazardFactorsReback(e) {
            if (e && e.length > 0) {
                this.testRecordData[this.hazardFactorsIndex].hazardFactors = "";
                this.testRecordData[this.hazardFactorsIndex].hazardFactorsText = "";
                for (let i = 0; i < e.length; i++) {
                    this.testRecordData[this.hazardFactorsIndex].hazardFactors += "|" + e[i].typeCode;
                    this.testRecordData[this.hazardFactorsIndex].hazardFactorsText += "|" + e[i].typeName;
                }
                this.testRecordData[this.hazardFactorsIndex].hazardFactors = this.testRecordData[this.hazardFactorsIndex].hazardFactors.substring(1);
                this.testRecordData[this.hazardFactorsIndex].hazardFactorsText = this.testRecordData[this.hazardFactorsIndex].hazardFactorsText.substring(1);
            } else {
                this.testRecordData[this.hazardFactorsIndex].hazardFactors = "";
                this.testRecordData[this.hazardFactorsIndex].hazardFactorsText = "";
            }
        },
        addrChange(e) {
            if(e) {
                this.tGroupUnitForm.regionCode = e.value;
                this.tGroupUnitForm.regionName = e.label;
            }
        },
        regionChange(e) {
            let element = document.querySelector(".rg-default-btn").children[0];
            if (e.province) {
                element.style.color = "#515a6e";
                let values = "";
                let codes = "";
                if (e.province) {
                    values = e.province.value;
                    codes = e.province.key;
                }
                if (e.city) {
                    values += "_" + e.city.value;
                    codes += "_" + e.city.key;
                }
                if (e.area) {
                    values += "_" + e.area.value;
                    codes += "_" + e.area.key;
                }
                if (e.town) {
                    values += "_" + e.town.value;
                    codes += "_" + e.town.key;
                }
                element.innerHTML = values;
                this.tGroupUnitForm.regionCode = codes;
                this.tGroupUnitForm.regionName = values;
            } else {
                element.innerHTML = '请选择';
                element.style.color = "#c5c8ce";
            }
        },
        onRegionSelect(e) {
            this.tGroupUnitForm.regionName = e.label;
        },
        onBusinessScaleSelect(e) {
            this.tGroupUnitForm.businessScaleName = e.label;
        },
        onIndustrySelect(e) {
            let filter = this.queryChildren(this.industryCodePriority, e);
            this.tGroupUnitForm.industryName = filter ? filter.typeName : "";
            if(e && (e=='201558' || e=='201559' || e=='201560' || e=='201561' || e=='201562' || e=='201563')){
                this.isHumanResources = true;
            }else{
                this.isHumanResources = false;
            }
        },
        onEconomicTypeSelect(e) {
            let filter = this.queryChildren(this.economicTypeCodePriority, e);
            this.tGroupUnitForm.economicTypeName = filter ? filter.typeName : "";
        },
        zoneCodeEmpChange(e) {
            if(e) {
                this.tGroupUnitForm.zoneCodeEmp = e.value;
                // this.tGroupUnitForm.regionName = e.label;
            }
        },
        crptSizeCodeEmpSelect(e) {
            this.tGroupUnitForm.crptSizeCodeEmp = e.label;
        },
        indusTypeCodeEmpSelect(e) {
            let filter = this.queryChildren(this.industryCodePriority, e);
            // this.tGroupUnitForm.indusTypeCodeEmp = filter ? filter.typeName : "";
        },
        economyCodeEmpSelect(e) {
            let filter = this.queryChildren(this.economicTypeCodePriority, e);
            // this.tGroupUnitForm.economyCodeEmp = filter ? filter.typeName : "";
        },
        queryChildren(list, e) {
            let data = null;
            for (let i = 0; i < list.length; i++) {
                let element = list[i];
                if (element.children && element.children.length > 0) {
                    data = this.queryChildren(element.children, e);
                    if (data) {
                        return data;
                    }
                } else {
                    if (element.id === e) {
                        data = element;
                        break;
                    }
                }
            }
            return data;
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
            this.tGroupUnitForm.attachment = "";
        },
        onTabsClick(e) {
            if (e == '基础信息') {
                this.show1 = true;
                this.show2 = false;
                this.show3 = false;
            } else if (e == '其他信息') {
                this.show1 = false;
                this.show2 = true;
                this.show3 = false;
            } else if (e == '检测信息') {
                this.show1 = false;
                this.show2 = false;
                this.show3 = true;
            }
        },
        //图片上传
        inputChange(e) {
            const inputFile = this.$refs['upload'].files[0];
            let fileSize = inputFile.size;
            var size = fileSize / 1024;
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
                this.tGroupUnitForm.attachment = reader.result;
            }
            this.$refs['upload'].value = null;
        },
        //点击上传图片
        upload() {
            if (this.disabled) {
                return;
            }
            this.$refs['upload'].dispatchEvent(new MouseEvent('click'));
        },
        handSubmit() {
            this.$refs['tGroupUnitForm'].validate((valid) => {
                this.loading = true;
                if (valid) {
                    if (this.TGroupUnitId != null && this.TGroupUnitId.trim().length > 0) {
                        this.tGroupUnitForm.id = this.TGroupUnitId;
                        this.tGroupUnitForm.testRecordData = this.testRecordData;
                        updateTGroupUnit(this.tGroupUnitForm).then(res => {
                            if (res.success) {
                                this.closeModal(false);
                                this.$emit('handleSearch');
                                this.$Message.success('保存成功');
                            } else {
                                this.$Message.error(res.msg);
                            }
                        }).finally(() => {
                            this.loading = false;
                        })
                    } else {
                        this.tGroupUnitForm.testRecordData = this.testRecordData;
                        addTGroupUnit(this.tGroupUnitForm).then(res => {
                            if (res.success) {
                                this.closeModal(false);
                                this.$emit('handleSearch');
                                this.$Message.success('保存成功');
                            } else {
                                this.$Message.error(res.msg);
                            }
                        }).finally(() => {
                            this.loading = false;
                        })
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
        //递归
        recursion(proTypes) {
            if (proTypes && proTypes.length > 0) {
                proTypes.forEach(item => {
                    item.expand = false;
                    item.selected = false;
                    item.checked = false;
                    item.title = item.typeName;
                    item.value = item.id;
                    if (item.children && item.children.length > 0) {
                        item.disabled = true;
                        this.recursion(item.children)
                    }
                })
            }
        },
        getTGroupUnitFormRule() {
            return {
                name: [
                    {required: true, message: '单位名称不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                physicalType: [
                    {required: true, message: '体检类型不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                uscc: [
                    {required: true, message: '统一社会信用代码不能为空！', trigger: 'blur'},
                    {
                        pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
                        message: '统一社会信用代码不正确',
                        trigger: 'blur'
                    }
                ],
                industryCode: [
                    {required: true, message: '行业类型不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                regionCode: [
                    {required: true, message: '所属地区不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                businessScaleCode: [
                    {required: true, message: '企业规模不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                economicTypeCode: [
                    {required: true, message: '经济类型不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                linkMan2: [
                    {required: true, message: '体检联系人姓名不能为空！', trigger: 'blur'},
                    {type: 'string', max: 25, message: '数据的最大长度为25！', trigger: 'blur'}
                ],
                linkPhone2: [
                    {required: true, message: '体检联系人电话不能为空！', trigger: 'blur'},
                    {
                        pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/,
                        message: '体检联系人电话不正确',
                        trigger: 'blur'
                    }
                ],
                address: [
                    {required: true, message: '单位注册地址不能为空！', trigger: 'blur'},
                    {type: 'string', max: 100, message: '数据的最大长度为100！', trigger: 'blur'}
                ],
                employeesNum: [
                    {required: true, message: '职工人数不能为空！', trigger: 'blur', type: 'number', pattern: /.+/},
                ],
                dangerNum: [
                    {required: true, message: '接触职业病危害因素人数不能为空！', trigger: 'blur', type: 'number', pattern: /.+/},
                ],
                upperInstituttonCode: [
                    {required: true, message: '上级单位社会信用代码不能为空！', trigger: 'blur'},
                    {
                        pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
                        message: '上级单位社会信用代码不正确',
                        trigger: 'blur'
                    }
                ],
                ifSubOrg: [
                    {required: true, message: '是否分支机构不能为空！', trigger: 'blur', pattern: /.+/},
                ],

                crptNameEmp: [
                    {required: true, message: '用工单位名称不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                creditCodeEmp: [
                    {required: true, message: '用工单位统一社会信用代码不能为空！', trigger: 'blur'},
                    {
                        pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
                        message: '用工单位统一社会信用代码不正确',
                        trigger: 'blur'
                    }
                ],
                indusTypeCodeEmp: [
                    {required: true, message: '用工单位行业类型不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                economyCodeEmp: [
                    {required: true, message: '用工单位所属地区不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                crptSizeCodeEmp: [
                    {required: true, message: '用工单位企业规模不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                zoneCodeEmp: [
                    {required: true, message: '用工单位经济类型不能为空！', trigger: 'blur', pattern: /.+/},
                ],
            }
        },
        async getPorTypeData(type) {
            return await queryProTypeByTypeCode({typeCode: type}).then(res => res.data);
        }
    },
    computed: {
        physicalType() {
            return this.$store.state.theme.theme.physicalType;
        },
    },
    watch: {
        value(val) {
            this.show = val;
        },
        async show(val) {
            this.testRecordData = [];
            this.loading = false;
            this.editTitle = this.modalTitle;
            if (this.editTitle == "查看") {
                this.disabled = true;
            } else {
                this.disabled = false;
            }
            if (val) {
                this.show1 = true;
                this.show2 = false;
                this.tabsValue = "基础信息";
                this.$refs['tGroupUnitForm'].resetFields();
                this.tGroupUnitForm.id = null;
                this.tGroupUnitForm.physicalType = this.physicalType;
                getDictDataByType("companyScale").then(res => {
                    if (res.success) {
                        this.businessScaleCodePriority = res.data;
                    }
                });
                getDictDataByType("unitRegion").then(res => {
                    if (res.success) {
                        this.regionPriority = res.data;
                    }
                });
                this.spinShow = true;
                queryProTypeByTypeCode({typeCode: "TYPE_003"}).then(res => {
                    if (res.success) {
                        this.recursion(res.data);
                        this.industryCodePriority = res.data;
                    }
                })
                queryProTypeByTypeCode({typeCode: "TYPE_002"}).then(res => {
                    if (res.success) {
                        this.recursion(res.data);
                        this.economicTypeCodePriority = res.data;
                    }
                })

                if (this.TGroupUnitId != null && this.TGroupUnitId.trim().length > 0) {
                    queryTTestRecordListAll({unitId: this.TGroupUnitId}).then(res => {
                        this.testRecordData = res.data;
                    });
                    getTGroupUnit({id: this.TGroupUnitId}).then(res => {
                        if (res.success) {
                            this.tGroupUnitForm = res.data;

                            if (res.data.regionCode) {
                                let split = res.data.regionCode.split("_");
                                this.regionCode = {
                                    province: split[0],
                                    city: split[1],
                                    area: split[2],
                                    town: split[3],
                                }
                            }
                            if (res.data.attachment) {
                                this.tGroupUnitForm.attachment = "data:image/png;base64," + res.data.attachment;
                            }
                            if(res.data.industryCode){
                                let e = res.data.industryCode;
                                if(e=='201558' || e=='201559' || e=='201560' || e=='201561' || e=='201562' || e=='201563'){
                                    this.isHumanResources = true;
                                }else{
                                    this.isHumanResources = false;
                                }
                            }else{
                                this.isHumanResources = false;
                            }
                        } else {
                            this.$Message.error(res.msg);
                        }
                    }).finally(() => {
                        this.spinShow = false;
                    });
                } else {
                    this.spinShow = false;
                }
            } else {
                this.closeModal(val);
            }
        }
    }
}
</script>
