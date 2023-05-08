<template>
    <div class="reviewItemDiv">
        <Card  ref="colHeight" style="height:100%;">
            <Row :gutter="10">
                <Col span="24">
                    <Form ref="queryForm" :label-width="80" inline>
                        <FormItem label="体检编号">
                            <Input v-model="queryFrom.testNum" placeholder="请输入体检编号" clearable></Input>
                        </FormItem>
                        <FormItem label="检查种类">
                            <Select v-model="queryFrom.workStateCode" transfer clearable style="width: 185px;" label-in-value>
                                <Option v-for="(item,index) in workStateCodeArr" :key="index" :value="item.value">
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
                        <FormItem label="状态" v-if="drop">
                            <Select v-model="queryFrom.isPass" transfer clearable style="width: 185px;">
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
                        <!--<FormItem label="体检结论" v-if="drop">
                            <Select style="width: 185px;" v-model="queryFrom.conclusionCode">
                                <Option v-for="(item,i) in conclusionList" :value="item.value" :key="item.id" >{{item.title}}</Option>
                            </Select>
                        </FormItem>-->
                        <FormItem label="单位名称" v-if="drop">
                            <Select style="width: 185px;" v-model="queryFrom.dept" clearable filterable>
                                <Option v-for="(item,index) in unitArr" :key="index" :value="item.name"
                                        :label="item.name">
                                    {{ item.name }}
                                </Option>
                            </Select>

                        </FormItem>
                        <FormItem label="项目名称" v-if="drop">
                            <Input v-model="queryFrom.portfolioProjectName" placeholder="请输入项目名称" clearable></Input>
                        </FormItem>
                        <FormItem style="margin-left:-35px" class="br">
                            <Button type="primary" @click="getReviewProjectPerson">查询</Button>
                            <Button type="primary" @click="handleReset">重置</Button>
                            <a class="drop-down" @click="dropDown">
                                {{dropDownContent}}
                                <Icon :type="dropDownIcon"></Icon>
                            </a>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
            <Row justify="end">
                <Table :loading="tableLoading" border :columns=" columns" sortable="custom" :data="tableData" ref="table"
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
    </div>
</template>

<script>
	import {formartDate} from "../../../api/tools/tool";
	import util from "../../../libs/util";
	import {getDictDataByType} from "../../../api";
	import {getReviewProjectPerson} from "../../../api/healthy/tReviewProject"
	import {queryAllTGroupUnitList,queryAllTGroupUnitListGroupName} from "../../../api/healthy/tGroupUnit";

	export default {
		name: "reviewItem",
		components: {},
		data() {
			return {
				selectDate:null,//选择的时间
				drop: false,
				dropDownContent: "展开",
				dropDownIcon: "ios-arrow-down",
				workStateCodeArr:[],//检查种类集合
				conclusionList:[],//体检结论集合
				tableLoading: false,//表格查询数据时等待条是否展示
				tableData: [],//表格展示数据
				total:0,//总计
				height: 600,
				unitArr:[],//单位集合
				//查询参数
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
					dept:'',//单位名称
					portfolioProjectName:'',//复查项目名称
					hazardFactors:'',//危害因素
				},
                //表格列属性
				columns: [
					{
						title: '序号',
						type: 'index',
						width: 80,
						align: 'center',
						fixed: 'left'
					},
					{
						title: '体检编号',
						align: 'center',
						minWidth: 100,
						ellipsis: true,
						tooltip: true,
						key: 'testNum',
						sortable: false,
						fixed: 'left'
					},
					{
						title: '姓名',
						align: 'center',
						minWidth: 80,
						ellipsis: true,
						tooltip: true,
						key: 'personName',
						sortable: false,
						fixed: 'left'
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
						title: '单位',
						align: 'center',
						minWidth: 120,
						ellipsis: true,
						tooltip: true,
						key: 'dept',
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
						title: '手机号',
						align: 'center',
						minWidth: 120,
						ellipsis: true,
						tooltip: true,
						key: 'mobile',
						sortable: false
					},
					{
						title: '复查项目名称',
						align: 'center',
						minWidth: 100,
						ellipsis: true,
						tooltip: true,
						key: 'portfolioProjectName',
						sortable: false
					},
					{
						title: '销售价',
						align: 'center',
						minWidth: 40,
						ellipsis: true,
						tooltip: true,
						key: 'salePrice',
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
						title: '检查种类',
						align: 'center',
						minWidth: 100,
						ellipsis: true,
						tooltip: true,
						key: 'workStateText',
						sortable: false
					},


					{
						title: '复检登记时间',
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
					}
				],
                //分页参数
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
            }
		},
		computed: {
			physicalType() {
				return this.$store.state.theme.theme.physicalType;
			},
		},
		methods: {
			//查询所有企业
			queryAllTGroupUnitList(){
				queryAllTGroupUnitListGroupName().then(res => {
					if (res && res.success) {
						this.unitArr = res.data;
					}
				});
			},
			//获取体检结论
			getDictDataByType(){
				getDictDataByType("physical_conclusion").then(res => {
					if (res.success) {
						this.conclusionList = res.data;
						//this.conclusionCode = res.data[0].value;
					}
				});
			},
			//获取监测种类
			async getWorkStateArr(){
				this.workStateCodeArr = await util.getDictionaryData("workState");
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
				this.getReviewProjectPerson();
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
				this.queryFrom.dept = '';
				this.queryFrom.portfolioProjectName = '';
				// 重新加载数据
				this.getReviewProjectPerson();
			},
			//人员检查项目页数改变
			changePage(v) {
				this.queryFrom.pageNumber = 1;
				this.queryFrom.pageSize = 10;
				this.queryFrom.pageNumber = v;
				this.getReviewProjectPerson();
			},
			//人员检查项目展示条数改变
			changePageSize(v) {
				this.queryFrom.pageSize = v;
				this.getReviewProjectPerson();
			},
            //查询复查人员
			getReviewProjectPerson(){
				this.tableLoading = true;
				getReviewProjectPerson(this.queryFrom).then(res => {
					if (res.success) {
						this.tableData = res.data.records;
						this.total = res.data.total;
					}
				}).finally(() => {
					this.tableLoading = false;
				})
            },
        },
		created() {
			this.getDictDataByType();
			this.getWorkStateArr();
			this.queryAllTGroupUnitList();
        },
		mounted() {
			//初始化后请求
			this.getReviewProjectPerson();
			this.height = window.document.documentElement.offsetHeight-270;
        },
		watch: {}
	}
</script>

<style lang="less">
.reviewItemDiv{
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow-y: auto;

    .ivu-table-body::-webkit-scrollbar {
        width: 4px !important;
    }
    .ivu-table-body::-webkit-scrollbar-track {
        background-color: #e4e4e4 !important;
        border-radius: 100px !important;
    }
    .ivu-table-body::-webkit-scrollbar-thumb {
        background-color: #2684e780 !important;
        border-radius: 100px !important;
    }
}
.reviewItemDiv::-webkit-scrollbar {
    width: 4px;
}
.reviewItemDiv::-webkit-scrollbar-track {
    background-color: #e4e4e4;
    border-radius: 100px;
}
.reviewItemDiv::-webkit-scrollbar-thumb {
    background-color: #2684e780;
    border-radius: 100px;
}
</style>