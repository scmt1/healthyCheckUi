<style lang="less">
.tGroupPerson {

    .form {
        position: relative;
    }

    .ivu-modal {
        width: 900px !important;

        .ivu-tabs-bar {
            margin-bottom: 15px !important;
        }
    }
}
</style>
<template>
    <Modal v-model="show" :title="editTitle" class="tGroupPerson" :mask-closable="false">
        <Form ref="tGroupPersonForm" :model="tGroupPersonForm" :rules="tGroupPersonFormRule" :label-width="120"
              class="form">
            <Tabs class="tabs">
                <TabPane label="基本信息" v-if="physicalType == '健康体检' || physicalType == '从业体检'">
                    <Row>
                        <Col span="12">
                            <FormItem label="人员姓名" prop="personName">
                                <Input :disabled="disabled" type="text" :maxlength=50
                                       v-model="tGroupPersonForm.personName" placeholder="请输入人员姓名"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="证件号码">
                                <Input :disabled="disabled" type="text" v-model="tGroupPersonForm.idCard"
                                       placeholder="请输入证件号码" @input="idCardChange"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="性别" prop="sex">
                                <RadioGroup v-model="tGroupPersonForm.sex">
                                    <Radio :disabled="disabled" label="男">男</Radio>
                                    <Radio :disabled="disabled" label="女">女</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="出生日期" prop="birth">
                                <DatePicker type="date"
                                            transfer
                                            :disabled="disabled"
                                            placeholder="请选择"
                                            style="width: 100%;"
                                            format="yyyy-MM-dd"
                                            v-model="tGroupPersonForm.birth"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="年龄" prop="age">
                                <Input :disabled="disabled"
                                       type="text"
                                       v-model="tGroupPersonForm.age"
                                       placeholder="请输入年龄"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="手机号码" prop="mobile">
                                <Input :disabled="disabled" type="text" v-model="tGroupPersonForm.mobile"
                                       placeholder="请输入手机号码"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" v-if="tGroupPersonForm.id">
                            <FormItem v-if="physicalType == '健康体检'" label="单位名称">
                                <!--<Input :disabled="disabled" type="text" v-model="tGroupPersonForm.dept"
                                       placeholder="请输入单位名称"/>-->
                                <Select  v-model="tGroupPersonForm.orderId" :filterable="true" :disabled="disabled"
                                        label-in-value
                                        class="input" @on-select="onOrderSelectChange" transfer>
                                    <Option v-for="(item,index) in orderArr" :key="index" :value="item.id" :tag="item.groupUnitId"
                                            :label="item.groupUnitName">
                                        {{ item.groupUnitName + '-' + item.orderCode }}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem v-if="physicalType =='从业体检'" label="单位名称" prop="unitId">
                                <Select   disabled v-model="tGroupPersonForm.unitId" :filterable="true" :disabled="disabled"
                                        label-in-value
                                        class="input" @on-select="onOrderSelectChange" transfer>
                                    <Option v-for="(item,index) in unitArr" :key="index" :value="item.id" :tag="item.groupUnitId"
                                            :label="item.name">
                                        {{ item.name }}
                                    </Option>
                                </Select>

                            </FormItem>
                        </Col>
                        <Col span="12"v-if="tGroupPersonForm.id">
                            <FormItem label="分组" prop="groupId">
                                <Select @on-change="groupChange" transfer :disabled="disabled" v-model="tGroupPersonForm.groupId" placeholder="请选择分组">
                                    <Option :value="item.id" v-for="(item,index) in groupList" :key="index" :tag="item">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="结婚状况">
                                <Select :disabled="disabled" transfer v-model="tGroupPersonForm.isMarry" placeholder="请选择">
                                    <Option value="未婚">未婚</Option>
                                    <Option value="已婚">已婚</Option>
                                    <Option value="离异">离异</Option>
                                    <Option value="丧偶">丧偶</Option>
                                    <Option value="其他">其他</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12" v-if="physicalType == '从业体检'">
                            <FormItem label="民族" prop="nation">
                                <Select  transfer v-model="tGroupPersonForm.nation" placeholder="请选择">
                                    <Option v-for="(item,i) in nationArr" :value="item.value">{{item.title}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" v-if="physicalType == '从业体检'">
                            <FormItem label="从业类别" prop="certificateType">
                                <Select  transfer v-model="tGroupPersonForm.certificateType" placeholder="请选择">
                                    <Option v-for="(item,i) in certificateTypeArr" :value="item.value">{{item.title}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="基本信息" v-if="physicalType == '职业体检' || physicalType == '放射体检'">
                    <Row>
                        <Col span="12">
                            <FormItem label="人员姓名" prop="personName">
                                <Input :disabled="disabled" type="text" :maxlength=50
                                       v-model="tGroupPersonForm.personName" placeholder="请输入人员姓名"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="证件号码">
                                <Input :disabled="disabled" type="text" v-model="tGroupPersonForm.idCard"
                                       placeholder="请输入证件号码" @input="idCardChange"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="性别" prop="sex">
                                <RadioGroup v-model="tGroupPersonForm.sex">
                                    <Radio :disabled="disabled" label="男">男</Radio>
                                    <Radio :disabled="disabled" label="女">女</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="出生日期">
                                <DatePicker type="date"
                                            :disabled="disabled"
                                            placeholder="请选择"
                                            style="width: 100%;"
                                            format="yyyy-MM-dd"
                                            v-model="tGroupPersonForm.birth"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="年龄" prop="age">
                                <Input :disabled="disabled"
                                       type="text"
                                       v-model="tGroupPersonForm.age"
                                       placeholder="请输入年龄"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="结婚状况">
                                <Select :disabled="disabled" v-model="tGroupPersonForm.isMarry" placeholder="请选择">
                                    <Option value="未婚">未婚</Option>
                                    <Option value="已婚">已婚</Option>
                                    <Option value="离异">离异</Option>
                                    <Option value="丧偶">丧偶</Option>
                                    <Option value="其他">其他</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="手机号码" prop="mobile">
                                <Input :disabled="disabled" type="text" v-model="tGroupPersonForm.mobile"
                                       placeholder="请输入手机号码"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="危害因素" prop="hazardFactors">
                                <Input :disabled="disabled" type="textarea" readonly v-model="tGroupPersonForm.hazardFactorsText" @on-focus="handleHarmSelect"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row v-if="tGroupPersonForm && tGroupPersonForm.hazardFactors && (tGroupPersonForm.hazardFactors.indexOf('110999') > -1 || tGroupPersonForm.hazardFactors.indexOf('120999') > -1
                        || tGroupPersonForm.hazardFactors.indexOf('130999') > -1 || tGroupPersonForm.hazardFactors.indexOf('140999') > -1
                        || tGroupPersonForm.hazardFactors.indexOf('150999') > -1 || tGroupPersonForm.hazardFactors.indexOf('160999') > -1)">
                        <Col span="12">
                            <FormItem label="其他危害因素" prop="otherHazardFactors">
                                <Input :disabled="disabled" type="text" v-model="tGroupPersonForm.otherHazardFactors" placeholder="请输入其他危害因素名称，多个逗号“，”分隔"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="工种名称" prop="workTypeCode">
                                <Input :disabled="disabled" placeholder="请选择工种" @click.native="handleWorkCode"
                                       v-model="tGroupPersonForm.workTypeText"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12" v-if="tGroupPersonForm.workTypeCode && (tGroupPersonForm.workTypeCode.indexOf('0014') > -1 || tGroupPersonForm.workTypeCode.indexOf('0033') > -1
                        || tGroupPersonForm.workTypeCode.indexOf('999999') > -1)">
                            <FormItem label="工种其他名称" prop="workName">
                                <Input :disabled="disabled"
                                       type="text"
                                       v-model="tGroupPersonForm.workName"
                                       placeholder="请输入工种其他名称"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="在岗状态" prop="workStateCode">
                                <Select v-model="tGroupPersonForm.workStateCode" transfer :disabled="disabled" label-in-value @on-change="workChange">
                                    <Option v-for="(item,index) in workStateCodeArr" :key="item.id" :value="item.value">
                                        {{ item.title }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12" v-if="false">
                            <FormItem label="接害开始日期" prop="exposureStartDate">
                                <DatePicker type="date"
                                            placeholder="请选择"
                                            :disabled="disabled"
                                            style="width: 100%;"
                                            transfer
                                            v-model="tGroupPersonForm.exposureStartDate"
                                            @on-change="expDateChange"
                                            format="yyyy-MM-dd"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="监测类型" prop="jcType">
                                <Select :disabled="disabled" v-model="tGroupPersonForm.jcType" transfer>
                                    <Option value="1">常规监测</Option>
                                    <Option value="2">主动监测</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12" v-if="tGroupPersonForm.id && tGroupPersonForm.isPass!=1">
                            <FormItem label="登记时间" >
                                <DatePicker  type="datetime"
                                            placeholder="请选择"
                                            :disabled="disabled"
                                            style="width: 100%;"
                                            transfer
                                            v-model="tGroupPersonForm.registDate"
                                             format="yyyy-MM-dd HH:mm:ss"/>
                            </FormItem>
                        </Col>
                        <Col span="12" v-if="tGroupPersonForm.id">
                            <FormItem label="单位名称" >
                                <!--<Input :disabled="disabled" type="text" v-model="tGroupPersonForm.dept"
                                       placeholder="请输入单位名称"/>-->
                                <Select v-model="tGroupPersonForm.orderId" :filterable="true" :disabled="disabled"
                                        label-in-value
                                        class="input" @on-select="onOrderSelectChange" transfer>
                                    <Option v-for="(item,index) in orderArr" :key="index" :value="item.id" :tag="item.groupUnitId"
                                            :label="item.groupUnitName">
                                        {{ item.groupUnitName + '-' + item.orderCode }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24" v-if="tGroupPersonForm.id">
                            <FormItem label="分组" prop="groupId">
                                <Select :disabled="disabled" label-in-value @on-change="groupChange" transfer v-model="tGroupPersonForm.groupId" placeholder="请选择分组">
                                    <Option :value="item.id" v-for="(item,index) in groupList" :key="index" :tag="item">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </TabPane>
                <Button @click="readIdCard" :loading="readShow" type="primary" icon="md-add" slot="extra">读取二代身份证</Button>
            </Tabs>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Form>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="loading" @click="handelSubmit" v-if="!disabled">提交</Button>
        </div>
        <chooseWorkType v-model="workShow" @workCodeReback="workCodeReback"></chooseWorkType>
        <!--危害因素-->
        <harmDrawer v-model="harmShow" :modalTitle="title" :selectedHarmList="selectedHarmList" @harmReback="harmReback"
                    :selectType="seltType"></harmDrawer>
    </Modal>
</template>
<script>
import * as groupPersonApi from '@/api/healthy/tGroupPerson'
import {gethazardFactorsByGroupId} from "../../../api/healthy/tCombo"
import {getTOrderGroupByGroupOrderId,getTOrderGroupByGroupUnitId,queryTOrderGroupList} from "../../../api/healthy/tOrderGroup"
import util from "../../../libs/util";
import chooseWorkType from "./chooseWorkType";
import {getDictDataList} from "@/api/index.js"
import {formatDate} from "../../../api/tool";
import harmDrawer from "../tCombo/harmDrawer";
import {queryAllTGroupOrderList} from "../../../api/healthy/tGroupOrder";
import {getDictDataByType} from "../../../api";
import {queryAllTGroupUnitList} from "../../../api/healthy/tGroupUnit";

export default {
    name: "updateTGroupPerson",
    components: {
        chooseWorkType, harmDrawer
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        tGroupPersonId: {
            type: String
        },
        modalTitle: {
            type: String
        },
        orderId: {
            type: String,
            default: ""
        },
        groupId: {
            type: String,
            default: ""
        },
        groupName: {
            type: String,
            default: ""
        }
    },
    data() {
        // 自定义验证 年龄
        const validAge = (rule, value, callback) => {
            if (/[^0-9]/ig.test(value) || !value) {
                callback(new Error('请输入正确的年龄！'));
            }
            /* else if (parseInt(value) < 16) {
                callback(new Error('输入的年龄不能小于16周岁！'))
            } */
            else {
                callback();
            }
        };
        //自定义验证工龄
        const validYear = (rule, value, callback) => {
            if (/[^0-9]/ig.test(value) || !value) {
                callback(new Error('请输入正确的工龄！'));
            } else {
                callback();
            }
        };

        return {
            title: "",
            seltType: "",
            selectedHarmList: [],
            harmShow: false,
            workShow: false,
            spinShow: false,
            show: this.value,
            editTitle: this.modalTitle,
            loading: true,
            disabled: false,
            industryTypeCodeArr: [],//行业类别
            econoTypeCodeArr: [],//经济类别
            workTypeCodeArr: [],//工种
            workStateCodeArr: [],//在岗状态
            tGroupPersonForm: {
                personName: '',
                sex: '',
                idCard: '',
                birth: '',
                age: '',
                isMarry: '',
                mobile: '',
                dept: '',
                workNum: '',
                workYear: '',
                workMonth: '',
                exposureWorkYear: '',
                exposureWorkMonth: '',
                workName: '',
                workStateCode: '',
                workStateText: "",
                exposureStartDate: '',
                workTypeCode: '',
                workTypeText: '',
                jcType: '1',
                orderId: "",
                groupId: "",
                hazardFactors: "",
                hazardFactorsText: "",
                physicalType: "",
                otherHazardFactors: ""
            },
            tGroupPersonFormRule: {
                personName: [
                    {required: true, message: '人员姓名不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                sex: [
                    {required: true, message: '性别不能为空！', trigger: 'blur'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'blur'}
                ],
                //身份证 护照验证
                idCard: [
                    {
                        required: true,
                        message: '证件号码有误！',
                        trigger: 'blur',
                        pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
                    },
                ],
                birth: [
                    {required: true, message: '出生日期不能为空！', trigger: 'change', pattern: /.+/}
                ],
                age: [
                    {required: true, trigger: 'blur', validator: validAge}
                ],
                isMarry: [
                    {required: true, message: '请选择婚姻状态！', trigger: 'change', pattern: /.+/},
                ],
                workStateCode: [
                    {required: true, message: '请选择婚姻状态！', trigger: 'change', pattern: /.+/},
                ],
                mobile: [
                    {required: true, message: '手机号码有误！', trigger: 'blur', pattern: /^1[3456789]\d{9}$/}
                ],
                workYear: [
                    {required: true, message: '总工龄年数不能为空！', trigger: 'blur', validator: validYear}
                ],
                workMonth: [
                    {required: true, message: '总工龄月数不能为空！', trigger: 'blur', validator: validYear}
                ],
                exposureWorkYear: [
                    {required: true, message: '接害工龄年数不能为空！', trigger: 'blur', validator: validYear}
                ],
                exposureWorkMonth: [
                    {required: true, message: '接害工龄月数不能为空！', trigger: 'blur', validator: validYear},
                ],
                workName: [
                    {required: true, message: '工种其他名称不能为空！', trigger: 'blur'}
                ],
                exposureStartDate: [
                    {required: true, message: '接害开始日期不能为空！', trigger: 'change', pattern: /.+/},
                ],
                hazardFactors: [
                    {required: true, message: '危害因素不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                otherHazardFactors: [
                    {required: true, message: '其他危害因素不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                jcType: [
                    {required: true, message: '监测类型素不能为空！', trigger: 'blur', pattern: /.+/},
                ],
                workTypeCode: [
                    {required: true, message: '工种代码不能为空！', trigger: 'change'},
                    {type: 'string', max: 50, message: '数据的最大长度为50！', trigger: 'change'}
                ],
                groupId: [
                    {required: true, message: '分组不能为空！', trigger: 'blur', pattern: /.+/},
                ],
				nation: [
					{required: true, message: '民族不能为空', trigger: 'blur'}
				],
                unitId: [
                    {required: true, message: '单位名称不能为空', trigger: 'change'}
                ],
                certificateType:[
                    {required: true, message: '从业类别不能为空', trigger: 'change'}
                ]


            },
            hazardFactorsArr: [],
            readShow: false,
            groupList:[],
            orderArr:[],
            unitArr:[],
			nationArr:[],//民族
            certificateTypeArr:[],//从业类别
        }
    },
    methods: {
        //接害时间改变
        expDateChange(e) {
            this.tGroupPersonForm.exposureStartDate = e;
        },
        //读取身份证信息
        readIdCard() {
            this.readShow = true;
            this.connect();
        },
        //连接身份证读卡器
        connect() {
            let _this = this;

            function onSuccess(data) {
                if (data.match("\"errorMsg\" : \"(.*?)\"")[1] == "打开成功") {
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
            options.url = "http://127.0.0.1:19196/OpenDevice" + "&" + "t=" + Math.random();		//URL后面加一个随机参数的目的是为了防止IE内核浏览器的数据缓存
            options.timeout = 5000;
            options.onSuccess = onSuccess;
            options.onError = onError;
            _this.ajax(options);
        },
        //获取身份证信息
        readCert() {
            let _this = this;

            function onSuccess(data) {
                if (data.match("\"errorMsg\" : \"(.*?)\"")[1].indexOf("读卡成功") != -1) {
                    let date = new Date();
                    let yearfull = date.getFullYear();
                    let age = 0;
                    let idCard = data.match("\"certNumber\" : \"(.*?)\"")[1];
                    if (idCard.length == 18) {
                        let birthyear = idCard.substring(6, 10);
                        age = yearfull - birthyear;
                    }
                    if (idCard.length == 15) {
                        let birthDay = "";
                        birthDay = idCard.substring(6, 12);
                        birthDay = "19" + birthDay;
                        birthDay = birthDay.substring(0, 4);
                        age = yearfull - birthDay;
                    }
					let monthBirth = idCard.substring(10,12);
					let dayBirth = idCard.substring(12,14);
					let monthNow = date.getMonth() + 1;
					let dayNow = date.getDate();
					if(monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)){
						age--;
					}
                    _this.tGroupPersonForm.idCard = data.match("\"certNumber\" : \"(.*?)\"")[1];
                    _this.tGroupPersonForm.personName = data.match("\"partyName\" : \"(.*?)\"")[1];
                    _this.tGroupPersonForm.sex = data.match("\"gender\" : \"(.*?)\"")[1];
                    _this.tGroupPersonForm.age = age;
                    _this.tGroupPersonForm.isPass = 1;

					_this.tGroupPersonForm.re = _this.physicalType;
                    let birth = _this.getBirthDate(idCard);
                    //出生日期
                    _this.tGroupPersonForm.birth = birth;
                    _this.readShow = false;
                } else {
                    _this.readShow = false;
                    _this.$Message.error("身份证信息读取失败！")
                }
            }

            let options = new Object();
            options.type = "GET";
            options.url = "http://127.0.0.1:19196/readcard" + "&picpath=\"D:\\1\\123.bmp\"" + "&" + "t=" + Math.random();	//URL后面加一个随机参数的目的是为了防止IE内核浏览器的数据缓存
            options.timeout = 5000;
            options.onSuccess = onSuccess;
            _this.ajax(options);
        },
        disconnect() {
            function onSuccess(data) {

            }

            this.initFrom();
            let options = new Object();
            options.type = "GET";
            options.url = "http://127.0.0.1:19196/CloseDevice" + "&" + "t=" + Math.random();	//URL后面加一个随机参数的目的是为了防止IE内核浏览器的数据缓存
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
                options.onComplate = function () {
                }
            }

            if (options.onError == null) {
                options.onError = function () {
                }
            }

            if (options.onSuccess == null) {
                options.onSuccess = function () {
                }
            }

            if (options.data) {
                options.data = "";
            }

            let xml;
            if (typeof ActiveXObject != 'undefined') {
                let aVersions = ["Microsoft.XMLHTTP", "Msxml2.XMLHttp.6.0", "Msxml2.XMLHttp.5.0", "Msxml2.XMLHttp.4.0", "Msxml2.XMLHttp.3.0"];
                for (let i = 0; i < aVersions.length; i++) {
                    try {
                        xml = new ActiveXObject(aVersions[i]);
                    } catch (e) {
                    }
                }
            } else if (typeof XMLHttpRequest != 'undefined') {
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
                    return !r.status && location.protocol == "file:"
                        ||
                        (r.status >= 200 && r.status <= 300)
                        ||
                        r.status == 304
                        ||

                        navigator.userAgent.indexOf("Safari") >= 0
                        && typeof r.status == "undefined";
                } catch (e) {
                }
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
        handleHarmSelect() {
            this.selectedHarmList = [];
            this.harmShow = true;
            this.title = "危害因素选择";
            this.seltType = "checkbox";
            if (this.tGroupPersonForm.hazardFactors) {
                let ids = this.tGroupPersonForm.hazardFactors;
                let txts = this.tGroupPersonForm.hazardFactorsText.split("|");
                for (let i = 0; i < ids.length; i++) {
                    let id = ids[i];
                    let txt = txts[i];
                    this.selectedHarmList.push({
                        typeCode: id,
                        typeName: txt
                    });
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
                this.tGroupPersonForm.hazardFactors = ids.join("|");
                this.tGroupPersonForm.hazardFactorsText = txts.join("|");
            }
        },
        handleWorkCode() {
            this.workShow = true;
        },
        workCodeReback(v) {
            if (v && v.length > 0) {
                this.tGroupPersonForm.workTypeCode = v[0].value;
                this.tGroupPersonForm.workTypeText = v[0].title;
                this.$forceUpdate();
            }
        },
        //在岗状态改变
        workChange(v) {
            if (v) {
                this.tGroupPersonForm.workStateText = v.label.trim();
            }
        },
        //根据身份证号计算出生日期
        getBirthDate(IDCard) {
            //获取身份证号的年、月、日
            var year = IDCard.substring(6, 10);
            var month = IDCard.substring(10, 12);
            var day = IDCard.substring(12, 14);
            //拼接成出生日期
            var birthDate = year + '-' + month + '-' + day;
            return birthDate;
        },
        idCardChange(e) {
            if (e) {
                let idCard = e.trim();
                if (idCard && idCard.length == 18) {
                    //出生日期
                    let birth = this.getBirthDate(idCard);
                    this.tGroupPersonForm.birth = birth;
                    //性别 倒数第二位
                    let sex = idCard.substr(16, 1);
                    if (sex % 2 == 0) {
                        this.tGroupPersonForm.sex = "女";
                    } else {
                        this.tGroupPersonForm.sex = "男";
                    }
                    //年龄
                    let b = new Date(birth);
                    let c = new Date();
                    let age = c.getFullYear() - b.getFullYear();
                    if (c.getMonth() < b.getMonth() || (c.getMonth() == b.getMonth() && c.getDate() < b.getDate())) {
                        age--;
                    }
                    this.tGroupPersonForm.age = age;
                }
            } else {
                this.tGroupPersonForm.age = null;
                this.tGroupPersonForm.sex = null;
                this.tGroupPersonForm.birth = null;
            }
        },
        //关闭弹框
        closeModal(val) {
            this.$emit('input', val);
        },
        //获取类型库树
        async getProTypeByTypeCode(typeCode) {
            let data = await groupPersonApi.getTypeCodeByTProType({typeCode: typeCode}).then(res => res.data);
            this.recursion(data);
            return data;
        },
        //递归
        recursion(proTypes) {
            if (proTypes) {
                proTypes.forEach(item => {
                    item.value = item.typeCode;
                    item.title = item.typeName;
                    item.selected = false;
                    item.checked = false;
                    if (item.children && item.children.length > 0) {
                        item.disabled = true;
                        this.recursion(item.children)
                    }
                })
            }
        },
        //初始化表单
        initForm() {
            this.queryOrderData();//查询订单
            this.tGroupPersonForm = {
                personName: '',
                sex: '',
                idCard: '',
                birth: '',
                age: '',
                isMarry: '',
                mobile: '',
                dept: '',
                workNum: '',
                workYear: '',
                workMonth: '',
				registDate:null,
                exposureWorkYear: '',
                exposureWorkMonth: '',
                workName: '',
                workStateCode: '',
                workStateText: '',
                exposureStartDate: '',
                workTypeCode: '',
                workTypeText: '',
                jcType: '1',
                orderId: "",
                groupId: "",
                hazardFactors: "",
                hazardFactorsText: "",
                physicalType: "",
                otherHazardFactors: "",
                nation:"",
                tolerable:this.$hospitalName.importFailure
            };
        },
        //分组改变
        groupChange(e){
            if(e){
                if(e.value){
                    if(this.tGroupPersonForm.isPass && this.tGroupPersonForm.isPass != 1){
                        this.$Modal.confirm({
                            title: '确认修改',
                            content: '体检人员已登记，请谨慎修改分组！',
                            loading: true,
                            onOk: () => {
                                this.$Modal.remove();
                                this.tGroupPersonForm.oldGroupId = e;
                                this.loading = false;
                                this.hazardFactorUpdate(e);
                            },
                            onCancel: () => {
                                this.tGroupPersonForm.groupId = this.tGroupPersonForm.oldGroupId;
                                this.$Message.info('取消了当前的操作行为！');
                                this.loading = false;
                            }
                        });
                    }else{
                        this.hazardFactorUpdate(e);
                    }
                }
            }
        },
        //危害因素自动同步
        hazardFactorUpdate(e){
            let _this = this;
            if(e.tag){
                if((this.physicalType=="职业体检" || this.physicalType=="放射体检") && e.tag.name && e.tag.name.toString().trim().length > 0){
                    let nameSplit = [];
                    nameSplit = e.tag.name.split("[");
                    if(nameSplit.length>0){
                        let nameSplitTwo = nameSplit[1].split("]");
                        let workStateText = nameSplitTwo[0];
                        if(workStateText){
                            let workStateNow = this.workStateCodeArr.filter(item => item.title && item.title.indexOf(workStateText) > -1);
                            if(workStateNow && workStateNow.length>0){
                                this.tGroupPersonForm.workStateCode = workStateNow[0].value;
                                this.tGroupPersonForm.workStateText = workStateNow[0].title;
                            }
                        }
                    }
                }
                if((this.physicalType=="职业体检" || this.physicalType=="放射体检") && e.tag.hazardFactorCodes && e.tag.hazardFactorCodes.length>0 && e.tag.hazardFactorTexts && e.tag.hazardFactorTexts.length>0){
                    let ids = e.tag.hazardFactorCodes;
                    let txts = e.tag.hazardFactorTexts;
                    _this.tGroupPersonForm.hazardFactors = ids.join("|");
                    _this.tGroupPersonForm.hazardFactorsText = txts.join("|");
                    if (_this.tGroupPersonForm.hazardFactors) {
                        for (let i = 0; i < ids.length; i++) {
                            let id = ids[i];
                            let txt = txts[i];
                            _this.selectedHarmList.push({
                                typeCode: id,
                                typeName: txt
                            });
                        }
                    } else {
                        _this.selectedHarmList = [];
                    }
                }
            }
        },
        //提交
        handelSubmit() {
            let _this = this;
            if (this.tGroupPersonForm.workStateCode == '1001' && !this.tGroupPersonForm.exposureStartDate) {
                this.tGroupPersonForm.exposureStartDate = formatDate(new Date(), "yyyy-MM-dd");
            }
            this.$refs['tGroupPersonForm'].validate((valid) => {
                if (valid) {
                    _this.loading = true;
                    if (_this.physicalType == '职业体检' || _this.physicalType == '放射体检') {
                        if(_this.tGroupPersonForm.hazardFactors && _this.tGroupPersonForm.hazardFactors.indexOf("|")<=-1 && typeof _this.tGroupPersonForm.hazardFactors == "object"){
                            _this.tGroupPersonForm.hazardFactors = _this.tGroupPersonForm.hazardFactors.join("|");
                        }
                        _this.tGroupPersonForm.hazardFactorsText = _this.tGroupPersonForm.hazardFactorsText.trim();
                        _this.tGroupPersonForm.workStateText = _this.tGroupPersonForm.workStateText.trim();
                    } else {
                        _this.tGroupPersonForm.hazardFactors = null;
                    }
                    if(_this.tGroupPersonForm.registDate){
						_this.tGroupPersonForm.registDate = formatDate(_this.tGroupPersonForm.registDate) ;
                    }
                    if (_this.tGroupPersonId != null && _this.tGroupPersonId.trim().length > 0) {
						_this.tGroupPersonForm.id = _this.tGroupPersonId;
						_this.tGroupPersonForm.oldGroupId = _this.tGroupPersonForm.groupId;
                        // groupPersonApi.updateTGroupPerson(this.tGroupPersonForm).then(res => {
                        groupPersonApi.updateTGroupPersonAndGroup(this.tGroupPersonForm).then(res => {
                            if (res.code == 200) {
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
                        this.tGroupPersonForm.physicalType = this.physicalType;
                        groupPersonApi.addTGroupPerson(this.tGroupPersonForm).then(res => {
                            if (res.code == 200) {
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
        hazardFactorsChange() {
            let labels = this.$refs.hazardFactors.$children[0].values;
            if (labels && labels.length > 0) {
                this.tGroupPersonForm.hazardFactorsText = "";
                labels.forEach((i, index) => {
                    if (index == labels.length - 1) {
                        this.tGroupPersonForm.hazardFactorsText += i.label;
                    } else {
                        this.tGroupPersonForm.hazardFactorsText += i.label + "|";
                    }
                })
            }
        },
        getGroup(orderId){
            // getTOrderGroupByGroupOrderId({groupOrderId:orderId}).then(res =>{
            queryTOrderGroupList({groupOrderId:orderId}).then(res =>{
                if (res.success) {
                    this.groupList = res.data;
                }
            })
        },
        getGroupByUnitId(unitId){
            getTOrderGroupByGroupUnitId({groupUnitId:unitId}).then(res =>{
                if (res.success) {
                    this.groupList = res.data;
                }
            })
        },
        //查询已确认的健康体检订单
        queryOrderData() {
            queryAllTGroupOrderList({physicalType: this.physicalType, payStatus: 1}).then(res => {
                if (res.success) {
                    this.orderArr = res.data;
                }
            });
        },
        //查询单位名称
        queryAllTGroupUnitList(){
            queryAllTGroupUnitList({
                physicalType: this.physicalType
            }).then(res => {
                if (res.success) {
                    this.unitArr = res.data;
                }
            });
        },
        onOrderSelectChange(e) {
            if (e) {
               /* this.tGroupPersonForm.orderId = e.value;*/
                this.tGroupPersonForm.dept = e.label;
                this.tGroupPersonForm.unitId = e.tag;
                /*this.tGroupPersonForm.groupId = "";*/
                // this.getGroupByUnitId(e.tag);
               /* this.getGroup(e.value);*/
            }
        },
    },
    computed: {
        physicalType() {
            return this.$store.state.theme.theme.physicalType;
        },
    },
    mounted() {
        this.tGroupPersonForm.physicalType = this.physicalType;
		//民族
		getDictDataByType("nation").then(res => {
			if (res.success) {
				this.nationArr = res.data;
			}
		});
        //从业类别
        getDictDataByType("certificate_type").then(res => {
            if (res.success) {
                this.certificateTypeArr = res.data;
            }
        });
        // this.queryOrderData();
        this.queryAllTGroupUnitList();
    },
    watch: {
        value(val) {
            this.show = val;
        },
        async show(val) {
            this.initForm();
            this.loading = false;
            this.editTitle = this.modalTitle;
            this.tGroupPersonForm.groupId = this.groupId;
            this.tGroupPersonForm.orderId = this.orderId;
			this.tGroupPersonForm.registDate = this.registDate;
            this.disabled = this.editTitle == "查看" ? true : false;

            if (val) {
            	let _this = this;
				_this.getGroup(this.tGroupPersonForm.orderId);
                if (_this.tGroupPersonForm.groupId && !_this.tGroupPersonId) {
                    gethazardFactorsByGroupId({groupId: this.tGroupPersonForm.groupId}).then(res => {
                        if (res.success) {
                            let arr = [];
                            for (let i = 0; i < res.data.length; i++) {
                                arr.push(res.data[i].hazardFactors);
                                this.tGroupPersonForm.hazardFactorsText += "|" + res.data[i].hazardFactorsText;
                            }
                            this.tGroupPersonForm.hazardFactors = arr;
                            this.tGroupPersonForm.hazardFactorsText = this.tGroupPersonForm.hazardFactorsText.substring(1);
                            /*if(this.groupList.length == 0){
                                this.getGroupByUnitId(this.tGroupPersonForm.unitId);
                            }*/
                        }
                    })
                }
                if (_this.tGroupPersonId != null && _this.tGroupPersonId.trim().length > 0) {
                    groupPersonApi.getTGroupPerson({id: _this.tGroupPersonId}).then(res => {
                        if (res.code == 200) {
							_this.tGroupPersonForm = res.data;
							_this.tGroupPersonForm.registDate = res.data.registDate;
                            if(_this.tGroupPersonForm && _this.tGroupPersonForm.hazardFactors){
								_this.tGroupPersonForm.hazardFactors = _this.tGroupPersonForm.hazardFactors.split("|");
                            }
                            /*if(this.groupList.length == 0){
                                this.getGroupByUnitId(this.tGroupPersonForm.unitId);
                            }*/
                        } else {
							_this.$Message.error(res.msg);
                        }
                    });
                } else {
                    if (this.physicalType == '职业体检' || this.physicalType == '放射体检') {
                        getDictDataList({dictId: '1456812385326206976',}).then(res => {
                            if (res.success) {
                                this.data = res.data;
                                for (let i = 0; i < this.data.length; i++) {
                                    if (this.data[i].title == "其他") {
                                        this.tGroupPersonForm.workTypeCode = this.data[i].value;
                                        this.tGroupPersonForm.workTypeText = this.data[i].title;
                                        this.tGroupPersonForm.workName = "其他操作工";
                                        break;
                                    }
                                }
                            }
                        })
                    } else if (this.physicalType == '健康体检' || this.physicalType == '从业体检') {
                        this.tGroupPersonForm.jcType = "";
                    }
                }
                if (this.physicalType == '职业体检' || this.physicalType == '放射体检') {
                    this.workStateCodeArr = await util.getDictionaryData("workState");
                    this.hazardFactorsArr = await this.getProTypeByTypeCode("TYPE_001");
                    if (this.tGroupPersonId == "" && this.tGroupPersonId.trim().length == 0) {
                        for (let i = 0; i < this.workStateCodeArr.length; i++) {
                            if (this.workStateCodeArr[i].title == this.groupName) {
                                this.tGroupPersonForm.workStateCode = this.workStateCodeArr[i].value;
                                this.tGroupPersonForm.workStateText = this.workStateCodeArr[i].title;
                            }
                        }
                    }
                }
            } else {
                this.closeModal(val);
            }
        }
    }
}
</script>
