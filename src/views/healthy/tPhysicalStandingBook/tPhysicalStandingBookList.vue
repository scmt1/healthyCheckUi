<style lang="less">
    @import "../../../styles/tree&table-common.less";

    .tPhysicalStandingBook {
        height: 100%;
        padding: 10px;
        box-sizing: border-box;

        .empty {
            text-align: center;
            color: #515a6e;
            margin-top: 20px;
        }

        .ivu-scroll-container {
            height: calc(100vh - 210px) !important;
        }

        .scroll-sty {
            ::-webkit-scrollbar {
                width: 0;
            }
        }

        .ivu-radio-wrapper {
            margin: 5px 8px 5px 0;
        }
    }
</style>
<template>
    <div class="tPhysicalStandingBook">
        <Row style="height: 100%;padding: 10px;" :gutter="20">
            <Col span="4">
                <Card style="height: 100%">
                    <Input suffix="ios-search" @input="inputSearchChange"
                           placeholder="请输入关键字"
                           clearable/>
                    <Scroll class="scroll-sty" v-if="unitList.length>0">
                        <Tree :data="unitList"
                              ref="orgTree"
                              @on-select-change="unitChange"
                        ></Tree>
                    </Scroll>
                    <div class="empty" v-else>暂无数据</div>
                </Card>
            </Col>
            <Col span="20">
                <Card ref="colHeight" style="height:100%;" >
                    <Row :gutter="10">
                        <Col span="24">
                            <Form ref="queryForm" :label-width="80" inline>
                                <FormItem label="体检编号">
                                    <Input v-model="queryFrom.testNum" placeholder="请输入体检编号" style="width: 160px;"
                                           clearable></Input>
                                </FormItem>
                                <FormItem label="检查种类">
                                    <Select v-model="queryFrom.workStateCode" transfer style="width: 160px;"
                                            label-in-value>
                                        <Option v-for="(item,index) in workStateCodeArr" :key="item.id"
                                                :value="item.value">
                                            {{ item.title }}
                                        </Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="姓名">
                                    <Input v-model="queryFrom.personName" style="width: 160px;" placeholder="请输入姓名"
                                           clearable></Input>
                                </FormItem>
                                <FormItem label="身份证号">
                                    <Input v-model="queryFrom.idCard" style="width: 160px;" placeholder="请输入身份证号"
                                           clearable></Input>
                                </FormItem>
                                <FormItem label="危害因素" v-if="drop">
                                    <TreeSelect :data="hazardFactorsPriority" clearable
                                                v-model="queryFrom.hazardFactors"
                                                v-width="170"
                                                ref="hazardFactors"
                                                @on-change="hazardFactorsChange"/>
                                </FormItem>
                                <FormItem label="状态" v-if="drop">
                                    <Select v-model="queryFrom.isPass" transfer style="width: 160px;">
                                        <Option value="89">全部</Option>
                                        <Option value="88">已总检</Option>
                                        <Option value="87">待总检</Option>
                                        <Option value="2">在体检</Option>
                                        <Option value="1">未登记</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="性别" v-if="drop">
                                    <Select v-model="queryFrom.sex" transfer clearable style="width: 160px;">
                                        <Option value="男">男</Option>
                                        <Option value="女">女</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="体检日期" v-if="drop">
                                    <DatePicker v-model="selectDate" @on-change="registDateChange"
                                                transfer :clearable="false" placeholder="请选择"
                                                style="width: 160px;"
                                                type="daterange"></DatePicker>
                                </FormItem>
                                <FormItem label="体检类型" v-if="drop">
                                    <Select v-model="queryFrom.physicalType" placeholder="请选择"
                                            style="width: 160px;" >
                                        <Option v-for="(item, i) in inspectTypePriority" :key="item.id"
                                                :value="item.value">{{item.title}}
                                        </Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="是否复查" v-if="drop">
                                    <Select style="width: 160px;" v-model="queryFrom.isRecheck">
                                        <Option :value="1" :key="1">是</Option>
                                        <Option :value="0" :key="0">否</Option>
                                    </Select>
                                </FormItem>
                                <FormItem :label-width="14" class="br">
                                    <Button type="primary" @click="getNoCheckProjectPersonSearch">查询</Button>
                                    <Dropdown @on-click="handleDropdown">
                                        <Button>
                                            更多操作
                                            <Icon type="md-arrow-dropdown"/>
                                        </Button>
                                        <DropdownMenu slot="list">
                                            <DropdownItem name="updateAll">
                                                <Icon type="ios-checkmark-circle"/>
                                                批量网报确认
                                            </DropdownItem>
                                            <DropdownItem name="export">
                                                <Icon type="md-arrow-down"/>
                                                导出勾选数据
                                            </DropdownItem>
                                            <DropdownItem name="handleReset">
                                                <Icon type="md-sync"/>
                                                重置
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <a class="drop-down" @click="dropDown">
                                        {{dropDownContent}}
                                        <Icon :type="dropDownIcon"></Icon>
                                    </a>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                    <Row justify="end">
                        <Table :loading="maleLoading" border :columns="columns" sortable="custom" :data="tableData"
                               ref="table" @on-selection-change="showSelect"
                               style="width: 100%;" :max-height="height">
                            <template #action="{ row, index }">
                                <Button v-if="(row.is_pass == 3 || row.isPass == 3) || (row.is_pass == 4 || row.isPass == 4) || (row.is_pass == 5 || row.isPass == 5)" type="primary" size="small" icon="ios-print-outline" style="margin-right: 5px"
                                        @click="prints(row,index)">预览
                                </Button>
                                <Button type="primary" size="small" style="margin-right: 5px"
                                        @click="confirmation(row,index)">网报确认
                                </Button>
                            </template>
                        </Table>
                        <Row type="flex" justify="end" class="page">
                            <Page
                                    :current="queryFrom.pageNumber"
                                    :total="total"
                                    :page-size="queryFrom.pageSize"
                                    @on-change="changePage"
                                    @on-page-size-change="changePageSize"
                                    :page-size-opts="[10,20,50,100, 200, 500]"
                                    size="small"
                                    show-total
                                    show-elevator
                                    show-sizer
                                    transfer
                            ></Page>
                        </Row>
                    </Row>
                </Card>
        <!--        <Card v-else>
                    <no-data width="150" height="150"></no-data>
                </Card>-->
            </Col>
        </Row>
        <reviewPersonalReport v-model="previewShow" :type-status="typeStatus" :person-id="personInfoId"
                         :physicalType="physicalType" ></reviewPersonalReport>
    </div>
</template>
<script>
    import {getTGroupOrderList} from "@/api/healthy/tGroupOrder"
    import {
        queryNoCheckProjectReviewPersonList,
        exportPersonDataByUnit,
        updatetGroupPersonNewspaper, getTypeCodeByTProType,
    } from "../../../api/healthy/tGroupPerson"
    import {formartDate, getDataString} from "../../../api/tools/tool";
    import util from "../../../libs/util";
    import reviewPersonalReport from "./reviewPersonalReport";
    import noData from "@/components/no-data"

    export default {
        name: 'tPhysicalStandingBookList',
        components: {reviewPersonalReport,noData},
        data() {
            return {
                isTemplateShow: false,
                personInfoId: '',
                physicalType: '',//体检类型
                typeStatus: '',//是否复查
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
                personId: '',
                selectCount: 0,
                selectList: [], // 多选数据
                height: 400,
                isBatchPrint: false,
                selectDate: '',
                previewShow: false,
                orderExport: false,
                maleLoading: false,
                tableData: [],
                isRadioChecked: '',
                conclusionList: [],//体检结论
                workStateCodeArr: [],//在岗状态
                groupOrderData: [],//单位列表
                outSpan: 'position: relative;width: calc(100% - 332px);',
                drop: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                tComboForm: {
                    name: ""
                },
                evaluateFinishRate: 0,
                physicalFinishRate: 0,
                tableLoading: false,
                hazardFactorsPriority: [],
                orderGroupArray: [],//危害因素集合
                queryFrom: {
                    testNum: "",
                    orderIdList: [],
                    personName: "",
                    sex: "",
                    idCard: "",
                    isPass: "89",
                    conclusionCode: '',//体检结论
                    startDate: '',//开始时间
                    endDate: '',//结束时间
                    pageNumber: 1,
                    pageSize: 10,
                    physicalType: "",
                    workStateCode: '',
                    groupId: '',//危害因素（分组id）
                    hazardFactors: '',//危害因素,
                    groupUnitName: '',
                    isRecheck: 0,//是否复查
                },
                unitParam: {
                    groupUnitName: "",
                    payStatus: 1,
                    physicalType: '',
                    companyName: '',
                },
                loading: false,
                columns: this.getColumns(),
                data: [],
                unitList: [],
                searchKey: "",
                radioValue: "",
                total: 0,
            }
        },
        mounted() {
            this.getGroupOrderData();
            this.getWorkStateArr();
            this.getProTypeByTypeCode("TYPE_001");
        },
        methods: {
            handleDropdown(name) {
                if (name == "updateAll") {
                    this.updateAll();
                } else if (name == "export") {
                    this.handleExport();
                } else if (name = "handleReset") {
                    this.handleReset();
                }
            },

            //单位查询
            inputSearchChange(e) {
                this.unitList = [];
                this.unitParam.companyName = e;
                this.getGroupOrderData();
            },
            //多选数据
            showSelect(e) {
                this.personId = '';
                let perId = [];
                e.forEach(function (e) {
                    perId.push(e.id);
                });
                for (let i = 0; i < perId.length; i++) {
                    this.personId += perId[i] + ','
                }
                this.personId = this.personId.substr(0, this.personId.length - 1)
                this.selectList = e;
                this.selectCount = e.length;
            },
            //网报确认
            confirmation(row, index) {
                if (row.deleteId == 1){
                    this.$Message.error('当前网报已确认');
                    return;
                }
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要网报所点击选的数据?",
                    loading: true,
                    onOk: () => {
                        this.userLoading = true;
                        let ids = [];
                        ids.push(row.id);
                        this.patchdeleteData(ids);
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    },
                });
            },
            //批量网报确认
            updateAll() {
                if (this.selectCount <= 0) {
                    this.$Message.warning('您还未选择要网报的数据');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '您确认要网报所选的 ' + this.selectCount + '条数据?',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.selectList.forEach(function (e) {
                            ids.push(e.id);
                        });
                        this.patchdeleteData(ids);
                    },
                    onCancel: () => {
                        this.$Message.info('取消了当前的操作行为！');
                    }
                });
            },

            //网报确认（后台）
            patchdeleteData(ids) {
                if (ids == undefined || ids == null || ids.length == 0) {
                    this.$Message.error('没有选择的数据');
                    return;
                }
                updatetGroupPersonNewspaper({ids: ids, isRecheck: this.queryFrom.isRecheck}).then(res => {
                    this.userLoading = false;
                    this.$Modal.remove();
                    if (res && res.success) {
                        this.modalTaskVisible = false;
                        this.$Message.success('网报成功');
                        this.getNoCheckProjectPerson();
                    }
                });
            },

            prints(row, index) {
                this.personInfoId = row.id;
                this.physicalType = row.physicalType;
                if (this.queryFrom.isRecheck) {
                    this.personInfoId = row.id;
                    this.typeStatus = true;
                } else {
                    this.personInfoId = row.id;
                    this.typeStatus = false;
                }
                this.previewShow = true;
            },
            //数据导出
            handleExport() {
                if (this.personId.toString().trim().length <= 0) {
                    this.$Message.warning('您还未选择要导出的数据');
                    return;
                }
                this.maleLoading = true;
                let fileName = "体检人员数据.xlsx";
                exportPersonDataByUnit({
                    personId: this.personId,
                    isRecheck: this.queryFrom.isRecheck,
                }).then(res => {
                    let content = res;
                    let blob = new Blob([content], {type: 'application/octet-stream'});
                    if ('download' in document.createElement('a')) { // 非IE下载
                        let elink = document.createElement('a');
                        elink.download = fileName;
                        elink.style.display = 'none';
                        elink.href = URL.createObjectURL(blob);
                        document.body.appendChild(elink);
                        elink.click();
                        URL.revokeObjectURL(elink.href); // 释放URL 对象
                        document.body.removeChild(elink);
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName);
                    }
                    this.maleLoading = false;
                }).catch(function (error) {
                    this.$Message.error('数据导出失败');
                    this.maleLoading = false;
                });
            },

            //搜索条件重置
            handleReset() {
                this.queryFrom.personName = '';
                this.queryFrom.workStateCode = '';
                this.queryFrom.groupId = '';
                this.queryFrom.hazardFactors = '';
                this.queryFrom.sex = '';
                this.queryFrom.idCard = '';
                this.queryFrom.conclusionCode = '';
                this.queryFrom.testNum = '';
                this.queryFrom.isPass = '89';
                this.queryFrom.pageNumber = 1;
                this.queryFrom.pageSize = 10;
                this.selectDate = null;
                this.queryFrom.startDate = '';
                this.queryFrom.endDate = '';
                this.queryFrom.groupId = '';
                this.queryFrom.physicalType = '';

                // 重新加载数据
                this.getNoCheckProjectPerson();
            },
            async getWorkStateArr() {
                this.workStateCodeArr = await util.getDictionaryData("workState");
            },
            //查询人员信息及未检查项目
            getNoCheckProjectPerson() {
                this.maleLoading = true;
                queryNoCheckProjectReviewPersonList(this.queryFrom).then(res => {
                    if (res.success) {
                        this.tableData = res.data.records;
                        this.total = res.data.total;
                    }
                }).finally(() => {
                    this.maleLoading = false;
                })

            },
            changeSelect(v) {
                this.unitList = v;
            },
            //单位选择
            unitChange(data) {
                this.queryFrom.groupUnitName = '';
                this.queryFrom.orderIdList = [];
                this.isRadioChecked = '';
                if (data[0].level == 1) {
                    this.orderExport = true;
                    this.queryFrom.groupUnitName = '';
                    this.queryFrom.groupUnitName = data[0].value;
                    this.isRadioChecked = data[0].value;
                } else if (data[0].level == 2) {
                    this.orderExport = false;
                    this.queryFrom.orderIdList = data[0].id;
                    this.isRadioChecked = data[0].id;
                }
                this.getNoCheckProjectPerson();
            },

            selectTree(v) {
                if (v.length > 0) {
                    // 转换null为""
                    for (let attr in v[0]) {
                        if (v[0][attr] == null) {
                            v[0][attr] = "";
                        }
                    }
                    let str = JSON.stringify(v[0]);
                    let menu = JSON.parse(str);
                    this.form = menu;
                    this.editTitle = menu.title;
                } else {
                    this.cancelEdit();
                }
            },
            //筛选条件查询
            getNoCheckProjectPersonSearch() {
                this.queryFrom.pageNumber = 1;
                this.getNoCheckProjectPerson();
            },
            //体检日期改变
            registDateChange(v) {
                if (v) {
                    this.queryFrom.startDate = v[0];
                    this.queryFrom.endDate = v[1];
                    if (this.queryFrom.startDate) {
                        this.queryFrom.startDate = "" + this.queryFrom.startDate + " 00:00:00";
                    }
                    if (this.queryFrom.endDate) {
                        this.queryFrom.endDate = "" + this.queryFrom.endDate + " 23:59:59";
                    }
                }
            },

            //获取类型库树
            getProTypeByTypeCode(typeCode) {
                getTypeCodeByTProType({typeCode: typeCode}).then(res => {
                    if (res && res.success) {
                        this.hazardFactorsPriority = this.recursion(res.data);
                    }
                }).catch(err => {
                });
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
                return proTypes;
            },

            hazardFactorsChange() {
                let labels = this.$refs.hazardFactors.$children[0].values;
                if (labels && labels.length > 0) {
                    this.queryFrom.hazardFactors = "";
                    labels.forEach((i, index) => {
                        if (index == labels.length - 1) {
                            this.queryFrom.hazardFactors += i.value;
                        } else {
                            this.queryFrom.hazardFactors += i.value + ",";
                        }
                    })
                }
            },
            //人员检查项目页数改变
            changePage(v) {
                this.queryFrom.pageNumber = 1;
                this.queryFrom.pageSize = 10;
                this.queryFrom.pageNumber = v;
                this.getNoCheckProjectPerson();
            },
            //人员检查项目展示条数改变
            changePageSize(v) {
                this.queryFrom.pageSize = v;
                this.getNoCheckProjectPerson();
            },
            //搜索展开收起
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = "展开";
                    this.dropDownIcon = "ios-arrow-down";
                } else {
                    this.dropDownContent = "收起";
                    this.dropDownIcon = "ios-arrow-up";
                }
                this.drop = !this.drop;
            },
            radioChooseClick(item) {
                this.radioValue = item.id;
            },

            //获取团检订单数据
            getGroupOrderData() {
                this.unitLoading = true;
                getTGroupOrderList(this.unitParam).then(res => {
                    if (res.success) {
                        let keys = Object.keys(res.data)
                        keys.forEach((item) => {
                            if (item && item.toString().trim().length > 0) {
                                let obj = {children: []};
                                obj.title = item;
                                obj.value = item;
                                obj.level = 1;
                                let keyValue = res.data[item];
                                keyValue.forEach((child) => {
                                    let kids = {};
                                    kids.id = child.id;
                                    kids.title = child.orderCode;
                                    kids.value = child.id;
                                    kids.level = 2;
                                    obj.children.push(kids);
                                    obj.id = child.groupUnitId;
                                });
                                this.unitList.push(obj);
                            }

                        });
                    }
                }).finally(() => {
                    this.unitLoading = false;
                })
            },

            getTreeData(data) {
                if (data) {
                    for (let i in data) {
                        let item = data[i];
                        data[i].title = data[i].title;
                        data[i].value = data[i].id.toString();
                        data[i].expand = true;
                        if (data[i].children) {
                            data[i].children = this.getTreeData(data[i].children);
                        }
                    }
                }
                return data;
            },

            //字段列
            getColumns() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
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
                        title: '姓名',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'personName',
                        sortable: false
                    },
                    {
                        title: '性别',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'sex',
                        sortable: false
                    },
                    {
                        title: '年龄',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'age',
                        sortable: false
                    },
                    {
                        title: '身份证号',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'idCard',
                        sortable: false
                    },

                    {
                        title: '体检类型',
                        align: 'center',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'physicalType',
                        sortable: false
                    },
                    {
                        title: '体检状态',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'isPass',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.isPass == 1) {
                                return h('span', "未登记");
                            } else if (params.row.isPass == 2) {
                                return h('span', "在体检");
                            } else if (params.row.isPass == 3) {
                                return h('span', "待总检");
                            } else if (params.row.isPass == 4 || params.row.isPass == 5) {
                                return h('span', "已总检");
                            }
                        }
                    },
                    {
                        title: '在岗状态',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'workStateText',
                        sortable: false
                    },
                    {
                        title: '危害因素',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'hazardFactorsText',
                        sortable: false
                    },
                    {
                        title: '体检日期',
                        align: 'center',
                        minWidth: 100,
                        ellipsis: true,
                        tooltip: true,
                        key: 'registDate',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.registDate) {
                                return h('span', formartDate(params.row.registDate, "yyyy-MM-dd"))
                            } else {
                                return h('span', "-")
                            }
                        }
                    },
                    {
                        title: '未完成项目',
                        align: 'center',
                        minWidth: 180,
                        ellipsis: true,
                        tooltip: true,
                        key: 'noCheckProjectName',
                        sortable: false,
                    },
                    {
                        title: '网报确认',
                        align: 'center',
                        key: 'deleteId',
                        width: 100,
                        render: (h, params) => {
                            if (params.row.deleteId == 1) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'success',
                                            size: 'small'
                                        },
                                        on: {}
                                    }, '已确认')
                                ])
                            } else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },

                                    }, '未确认')
                                ])
                            }
                        }
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'center'
                    }
                ]
            }
        }
    }
</script>
