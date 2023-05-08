<template>
    <div class="queryStatistics">
        <Row style="flex-wrap: nowrap;height:100%;">
            <Col :style="outLeftSpan" height="calc(100% - 32px)" v-if="outExpand">
                <Card class="card">
                    <Alert class="ivu-alert">团检订单</Alert>
                    <div v-if="!queryTime" style="display: flex;flex-wrap: nowrap;align-items: center;margin-bottom: 10px">
                        <DatePicker type="date" transfer v-model="unitParam.startDate" @on-change="datePickerStartTime" placeholder="开始时间" />
                        &nbsp;~&nbsp;
                        <DatePicker type="date" transfer  v-model="unitParam.endDate" @on-change="datePickerEndTime" placeholder="结束时间" />
                    </div>
                    <Input suffix="ios-search" clearable v-model="unitParam.groupUnitName" placeholder="请输入关键字" class="search-input"
                           @input="inputSearchChange"/>
                    <Checkbox style="margin: 10px 0;"
                              :indeterminate="indeterminate"
                              :value="checkAll"
                              @click.prevent.native="handleCheckAll">全选
                    </Checkbox>
                    <Button v-if="!queryTime" style="margin-left: 5px" type="small" @click="resetClick">重置</Button>

                    <!--左侧套餐列-->
                    <Row v-if="groupOrderData.length>0" style="overflow-y:hidden;overflow-x: hidden;">
                        <CheckboxGroup class="radio-group" v-model="radioValue" @on-change="unitChange">
                            <Row class="row-border" v-for="(item,index) in groupOrderData" :key="index">
                                <Col :span="3" class="radio-group-radio">
                                    <Checkbox class="label" :label="item.id"></Checkbox>
                                </Col>
                                <Col :span="21" class="radio-group-content">
                                    <Row style="margin-bottom: 6px;">
                                        <Col :span="20" class="date">{{ item.orderCode }}</Col>
                                    </Row>
                                    <Row>
                                        <Col span="24" :title="item.groupUnitName"
                                             style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                            {{item.groupUnitName}}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </CheckboxGroup>
                        <Row>
                            <Col :span="16">
                            <Page styles="justify-content: flex-start" :current="unitParam.pageNumber" :page-size="unitParam.pageSize" :total="totals" simple  @on-change="changePageNum"/>
                            </Col>
                            <Col :span="8">
                                <Select size="small" v-model="queryFrom.pageSize" @on-change="SelectChangePageSize" style="width: 90px;height: 2.6vh;">
                                    <Option v-for="item in pageSizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                        </Row>
                    </Row>

                    <!--暂无数据-->
                    <no-data v-else></no-data>

                    <Spin fix v-if="unitLoading"></Spin>
                </Card>
            </Col>

            <div class="expand">
                <Icon :type="outExpandIcon" size="16" class="icon" @click="outChangeExpand"/>
            </div>

            <Col :style="outSpan" height="calc(100% - 32px)">
                <Card v-if="groupOrderData.length>0" ref="colHeight" style="height:100%;">
                    <Row :gutter="10">
                        <Col span="24">
                            <Form ref="queryForm" :label-width="80" inline>
                                <FormItem label="体检编号">
                                    <Input v-model="queryFrom.testNum" placeholder="请输入体检编号" clearable></Input>
                                </FormItem>
                                <FormItem label="检查种类">
                                    <Select v-model="queryFrom.workStateCode" transfer style="width: 185px;" label-in-value>
                                        <Option v-for="(item,index) in workStateCodeArr" :key="item.id" :value="item.value">
                                            {{ item.title }}
                                        </Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="姓名">
                                    <Input v-model="queryFrom.personName" placeholder="请输入姓名" clearable></Input>
                                </FormItem>
                                <FormItem label="身份证号">
                                    <Input v-model="queryFrom.idCard" placeholder="请输入身份证号" clearable></Input>
                                </FormItem>
                                <FormItem label="危害因素" v-if="drop">
                                    <!--<Select v-model="queryFrom.groupId" transfer style="width: 185px;" label-in-value>
                                        <Option v-for="(item,index) in orderGroupArray" :key="index" :value="item.id">
                                            {{ item.name }}
                                        </Option>
                                    </Select>-->
                                    <TreeSelect :data="hazardFactorsPriority" clearable
                                                v-model="queryFrom.hazardFactors"
                                                v-width="150"
                                                ref="hazardFactors"
                                                @on-change="hazardFactorsChange"/>
                                </FormItem>
                                <FormItem label="状态" v-if="drop">
                                    <Select v-model="queryFrom.isPass" transfer style="width: 185px;">
                                        <Option value="89">全部</Option>
                                        <Option value="88">已总检</Option>
                                        <Option value="87">待总检</Option>
                                        <Option value="2">在体检</Option>
                                        <Option value="1">未登记</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="性别" v-if="drop">
                                    <Select v-model="queryFrom.sex" transfer clearable style="width: 185px;">
                                        <Option value="男">男</Option>
                                        <Option value="女">女</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="体检日期" v-if="drop">
                                    <DatePicker v-model="selectDate" @on-change="registDateChange"
                                                transfer :clearable="false" placeholder="请选择"
                                                style="width: 185px;"
                                                type="daterange"></DatePicker>
                                </FormItem>
                                <FormItem label="体检结论" v-if="drop">
                                    <Select style="width: 185px;" v-model="queryFrom.conclusionCode">
                                        <Option v-for="(item,i) in conclusionList" :value="item.value" :key="item.id" >{{item.title}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem style="margin-left:-35px" class="br">
                                    <Button type="primary" @click="getNoCheckProjectPersonSearch">查询</Button>
                                    <Button type="primary" @click="handleReset">重置</Button>
                                    <a class="drop-down" @click="dropDown">
                                        {{dropDownContent}}
                                        <Icon :type="dropDownIcon"></Icon>
                                    </a>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2">
                            <span class="txt">体检完成率：</span>
                        </Col>
                        <Col span="15">
                            <Progress :percent="physicalFinishRate" :stroke-width="20" text-inside/>
                        </Col>
                    </Row>
                    <Row style="margin: 10px 0 20px 0;">
                        <Col span="2">
                            <span class="txt">评价完成率：</span>
                        </Col>
                        <Col span="15">
                            <Progress :percent="evaluateFinishRate" :stroke-width="20" text-inside/>
                        </Col>
                    </Row>
                    <Row justify="end">
                        <Table :loading="tableLoading" border :columns="this.physicalType == '放射体检' ? columns2 : columns" sortable="custom" :data="tableData" ref="table"
                               style="width: 100%;" :max-height="height">
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
                <Card v-else>
                    <no-data width="150" height="150"></no-data>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
	import {queryTGroupOrderList} from "@/api/healthy/tGroupOrder"
	import {queryTOrderGroupListByOrderId} from "@/api/healthy/tOrderGroup"
	import {
		queryNoCheckProjectPersonList,
		getPersonListNum,
		queryStatisticPersonList,
        getTypeCodeByTProType
	} from "../../../api/healthy/tGroupPerson"
    import {formartDate, getMonthString,getDataString} from "../../../api/tools/tool";
	import noData from "@/components/no-data"
	import util from "../../../libs/util";
    import {getDictDataByType} from "../../../api";
    import {formatDate} from "@/api/tool.js"

	export default {
		name: "queryStatistics",
		components: {noData},
		data() {
			return {
                conclusionList:[],
                pageSizeList: [
                    {
                        value: 10,
                        label: '10 条/页'
                    },
                    {
                        value: 20,
                        label: '20 条/页'
                    },
                    {
                        value: 50,
                        label: '50 条/页'
                    },
                    {
                        value: 100,
                        label: '100 条/页'
                    }
                ],
                hazardFactorsPriority: [],//危害因素
				workStateCodeArr: [],//在岗状态
				h: 0,
				height: 400,
				totals: 0,
				indeterminate: true,
				checkAll: false,
                outLeftSpan: 'width: 300px;',
                outSpan: 'position: relative;width: calc(100% - 332px);',
				outExpandIcon: "ios-arrow-back",
				outExpand: true,
				selectDate: null,
				radioValue: [],//是否选中
				unitAll: [],
				groupOrderData: [],//单位列表
				unitParam: {
					groupUnitName: "",
					pageNumber: 1,
					pageSize: 10,
					payStatus: 1,
					physicalType: '',
                    startDate:null,
                    endDate:null,
				},
				queryFrom: {
					testNum: "",
					orderIdList: [],
					personName: "",
					sex: "",
					idCard: "",
					isPass: "89",
                    conclusionCode:'',//体检结论
					startDate: '',//开始时间
					endDate: '',//结束时间
					pageNumber: 1,
					pageSize: 10,
					physicalType: "",
					workStateCode:'',
					groupId:'',//危害因素（分组id）
                    hazardFactors:'',//危害因素,

				},
				total: 0,
				unitLoading: false,
				tableLoading: false,
				tableData: [],
				columns: [
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
						minWidth: 80,
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
                        title: '体检结论',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'title',
                        sortable: false,
                    },
					{
						title: '未完成项目',
						align: 'center',
						minWidth: 180,
						ellipsis: true,
						tooltip: true,
						key: 'noCheckProjectName',
						sortable: false,
					}
				],
                columns2: [
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
                        title: '职业照射种类',
                        align: 'center',
                        minWidth: 60,
                        ellipsis: true,
                        tooltip: true,
                        key: 'irradiationTypeCode',
                        sortable: false
                    },
                    {
                        title: '体检日期',
                        align: 'center',
                        minWidth: 80,
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
                        title: '体检结论',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'title',
                        sortable: false,
                    },

                    {
                        title: '未完成项目',
                        align: 'center',
                        minWidth: 180,
                        ellipsis: true,
                        tooltip: true,
                        key: 'noCheckProjectName',
                        sortable: false,
                    }
                ],
				physicalFinishRate: 0,
				evaluateFinishRate: 0,
				drop: false,
				dropDownContent: "展开",
				dropDownIcon: "ios-arrow-down",
				tableHeight: 200,
				orderGroupArray:[],//危害因素集合
                queryTime:this.$hospitalName.queryTimeChange,
			}
		},
		methods: {
		    //获取体检结论
            getDictDataByType(){
                getDictDataByType("physical_conclusion").then(res => {
                    if (res.success) {
                        this.conclusionList = res.data;
                        //this.conclusionCode = res.data[0].value;
                    }
                });
            },
		    //订单分页查询页数改变
			changePageNum(v) {
				this.radioValue = [];
				this.unitParam.pageNumber = v;
				this.getGroupOrderData();
			},
            //订单分页查询页数改变
            SelectChangePageSize(v){
                this.radioValue = [];
                this.unitParam.pageNumber = 1;
                this.unitParam.pageSize = v;
                this.getGroupOrderData();
            },
			//展开 收起
			dropDown() {
				if (this.drop) {
					this.dropDownContent = "展开";
					this.dropDownIcon = "ios-arrow-down";
					this.height = this.height + 60;
				} else {
					this.dropDownContent = "收起";
					this.dropDownIcon = "ios-arrow-up";
					this.height = this.height - 60;
				}
				this.drop = !this.drop;
			},
			//单位查询
			inputSearchChange(e) {
				this.radioValue = [];
				this.unitParam.groupUnitName = e;
				this.getGroupOrderData();
			},
			//tab切换
			tabsClick(e) {
				if (e == "name1") {
					this.getNoCheckProjectPerson();
				} else if (e == "name2") {

				}
			},
            datePickerChange(e) {
                this.getGroupOrderData();
            },

            //人员日期查询
            datePickerEndTime(e){
                if (e) {
                    let endTime = new Date(e);
                    endTime.setHours(23, 59, 59, 999);
                    endTime = endTime.setDate(endTime.getDate());
                    this.unitParam.endDate = formatDate(new Date(endTime), 'yyyy-MM-dd HH:mm:ss');
                }
                this.getGroupOrderData();
            },

            //人员日期查询
            datePickerStartTime(e) {
                if (e){
                    let searctTime = new Date(e);
                    searctTime.setHours(0, 0, 0, 0);
                    searctTime = searctTime.setDate(searctTime.getDate());
                    this.unitParam.startDate = formatDate(new Date(searctTime), 'yyyy-MM-dd HH:mm:ss');

                }
                this.getGroupOrderData();
            },

            //重置
            resetClick() {
                this.unitParam.pageNumber = 1;
                this.unitParam.pageSize = 10;
                this.unitParam.groupUnitName = "";
                this.radioValue = [];
                let _this = this;
                let date  = getMonthString(new Date());
                if(date!=null && date.length == 2){
                    _this.unitParam.startDate = date[0]+ " 00:00:00";
                    _this.unitParam.endDate = date[1]+ " 23:59:59";
                }
                this.getGroupOrderData();
            },


			//获取团检订单数据
			getGroupOrderData() {
				this.unitLoading = true;
				this.unitParam.physicalType = this.physicalType;
                let searchForm = JSON.parse(JSON.stringify(this.unitParam));
				if(searchForm.startDate ){
					searchForm.startDate = formatDate(searchForm.startDate, 'yyyy-MM-dd HH:mm:ss');
				}
				if(searchForm.endDate ){
					searchForm.endDate = formatDate(searchForm.endDate , 'yyyy-MM-dd HH:mm:ss');
					searchForm.endDate = searchForm.endDate.replace(" 00:00:00"," 23:59:59");
				}
                if(searchForm.startDate == null||searchForm.startDate .trim().length==0){
					searchForm.startDate = "0000-00-00 00:00:00"
                }
                if(searchForm.endDate == null||searchForm.endDate .trim().length==0){
                    let endTime = getDataString(new Date);
					searchForm.endDate = endTime + " 23:59:59"
                }
				queryTGroupOrderList(searchForm).then(res => {
					if (res.success) {

						this.groupOrderData = res.data.records;
						this.totals = res.data.total;

						//初始化选中第一个团检订单
						if (this.groupOrderData && this.groupOrderData.length > 0) {
							this.$nextTick(() => {
								this.radioValue.push(this.groupOrderData[0].id);
								this.getPersonNum(this.radioValue);
								this.getOrderGroup(this.radioValue);
								this.queryFrom.orderIdList = this.radioValue;
								this.getNoCheckProjectPerson();
							})
						}
						for (let i = 0; i < this.groupOrderData.length; i++) {
							this.unitAll.push(this.groupOrderData[i].id)
						}
					} else {
						this.groupOrderData = [];
					}
				}).finally(() => {
					this.unitLoading = false;
				})
			},
			//查询人员信息及未检查项目
			getNoCheckProjectPerson() {
				if (this.queryFrom.orderIdList.length > 0) {
					this.queryFrom.physicalType = this.physicalType;
					if (this.queryFrom.conclusionCode ==undefined){
                        this.queryFrom.conclusionCode = '';
                    }
					this.tableLoading = true;
					queryNoCheckProjectPersonList(this.queryFrom).then(res => {
						if (res.success) {
							this.tableData = res.data.records;
							this.total = res.data.total;
						}
					}).finally(() => {
						this.tableLoading = false;
					})
				} else {
					this.$Message.info("请选择单位");
				}
			},
			//全选
			handleCheckAll() {
				if (this.indeterminate) {
					this.checkAll = false;
				} else {
					this.checkAll = !this.checkAll;
				}
				this.indeterminate = false;

				if (this.checkAll) {
					this.radioValue = this.unitAll;
					this.queryFrom.orderIdList = this.radioValue;
					this.getPersonNum(this.radioValue);
					this.getNoCheckProjectPerson();
				} else {
					this.radioValue = [];
					this.queryFrom.orderIdList = [];
					this.tableData = [];
					this.physicalFinishRate = 0;
					this.evaluateFinishRate = 0;
				}
			},
			//单位选择
			unitChange(data) {
				if (data.length === this.unitAll.length) {
					this.indeterminate = false;
					this.checkAll = true;
				} else if (data.length > 0) {
					this.indeterminate = true;
					this.checkAll = false;
				} else {
					this.indeterminate = false;
					this.checkAll = false;
				}
				this.queryFrom.orderIdList = data;
				if (data.length > 0) {
					this.getPersonNum(data);
					this.getOrderGroup(data);
					this.getNoCheckProjectPerson();
				} else {
					this.physicalFinishRate = 0;
					this.evaluateFinishRate = 0;
					this.tableData = [];
					this.$Message.info("请选择单位");
				}
			},
			//体检日期改变
			registDateChange(v) {
				if (v) {
					this.queryFrom.startDate = v[0];
					this.queryFrom.endDate = v[1];
					if(this.queryFrom.startDate){
                        this.queryFrom.startDate = "" + this.queryFrom.startDate + " 00:00:00";
                    }
                    if(this.queryFrom.endDate){
                        this.queryFrom.endDate = "" + this.queryFrom.endDate + " 23:59:59";
                    }
				}
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

				// 重新加载数据
				this.getNoCheckProjectPerson();
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
            //查询分组
			getOrderGroup(orderIdList){
				this.orderGroupArray = [];
				if (orderIdList.length > 0) {
					queryTOrderGroupListByOrderId({orderIds: orderIdList}).then(res => {
						if (res.success && res.data) {
							this.orderGroupArray = res.data;
							// this.queryFrom = res.data;

						}
					})
				} else {
					this.$Message.info("请选择单位");
				}
            },
            //查询人员信息
			getPersonNum(orderIdList) {
				if (orderIdList.length > 0) {
					getPersonListNum({orderIdList: orderIdList, physicalType: this.physicalType}).then(res => {
						if (res.success && res.data) {
							if (res.data.physicalFinishNum != 0) {
								this.physicalFinishRate = parseFloat(res.data.physicalFinishNum / res.data.allNum).toFixed(2) * 100;
							} else {
								this.physicalFinishRate = 0;
							}
							if (res.data.inspectionFinishNum != 0) {
								this.evaluateFinishRate = parseFloat(res.data.inspectionFinishNum / res.data.allNum).toFixed(2) * 100;
							} else {
								this.evaluateFinishRate = 0;
							}
						}
					})
				} else {
					this.$Message.info("请选择单位");
				}
			},
			//table 高度设置
			setHeight() {
				let height = window.innerHeight - 280;
				if (height <= 1220) {
					height = height - 40;
				}
				this.height = height;

				window.onresize = () => {
					height = window.innerHeight - 340;
					if (height <= 1220) {
						height = height - 40;
					}
					this.height = height;
				}
			},
			async getWorkStateArr(){
				this.workStateCodeArr = await util.getDictionaryData("workState");
			},
            //筛选条件查询
            getNoCheckProjectPersonSearch(){
			    this.queryFrom.pageNumber = 1;
                this.getNoCheckProjectPerson();
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
            //
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
		},
		computed: {
			physicalType() {
				return this.$store.state.theme.theme.physicalType;
			}
		},
		mounted() {
            //危害因素
            this.getProTypeByTypeCode("TYPE_001");
            if (!this.$hospitalName.queryTimeChange){
                let date  = getMonthString(new Date());
                if(date!=null && date.length == 2){
                    this.unitParam.startDate = date[0] +" 00:00:00";
                    this.unitParam.endDate = date[1] +" 23:59:59";
                }
            }
			this.getGroupOrderData();
			// 计算高度
			this.setHeight();
			this.getWorkStateArr();
			this.getDictDataByType();
		}
	}
</script>

<style lang="less">
    @import "../../../styles/tree&table-common.less";

    .queryStatistics {
        padding: 10px;
        box-sizing: border-box;
        height: 100%;


        .ivu-checkbox-wrapper {
            margin-right: 4px;
        }

        .card {
            height: 100%;
            overflow: auto;

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
                margin-bottom: 10px !important;
            }

            .radio-group {
                width: 100%;
                font-size: 13px;
                height: calc(100vh - 300px);
                overflow: auto;

                &::-webkit-scrollbar {
                    width: 0;
                }

                .row-border {
                    padding-top: 5px;
                    padding-bottom: 5px;
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

        .txt {
            white-space: nowrap;
            font-weight: 600;
        }
    }
</style>
