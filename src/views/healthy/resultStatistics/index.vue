<template>
    <div class="resultStatisticsDiv">
        <Card ref="colHeight" style="height:100%;">
            <Row :gutter="10">
                <Col span="24">
                    <Form ref="queryForm" :label-width="120" inline>
                        <FormItem label="体检登记日期">
                            <DatePicker type="date" transfer @on-change="datePickerStartTime"
                                        v-model="queryFrom.startDate" placeholder="开始时间"/>
                            &nbsp;~&nbsp;
                            <DatePicker type="date" transfer @on-change="datePickerEndTime" v-model="queryFrom.endDate"
                                        placeholder="结束时间"/>

                        </FormItem>
                        <FormItem label="科室">
                            <Select v-model="officeIds" transfer clearable style="width: 185px;" label-in-value @on-change="getTDepartResultStatistics">
                                <Option v-for="(item,index) in departmentArr" :key="index" :value="item.id">
                                    {{ item.title }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="单位">
                            <Select v-model="queryFrom.dept" transfer clearable style="width: 185px;" label-in-value @on-change="getTDepartResultStatistics">
                                <Option v-for="(item,index) in unitArr" :key="index" :value="item.id">
                                    {{ item.name }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem style="margin-left:-35px" class="br">
                            <Button type="primary" icon="md-search"@click="getTDepartResultStatistics">查询</Button>
                            <Button type="primary" icon="ios-american-football-outline" @click="handleReset">重置</Button>
                            <Button type="primary" icon="ios-download-outline" @click="exportDataNew">导出</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
            <Row justify="end">
                <Table :loading="tableLoading" border :columns=" columns" sortable="custom" :data="tableData"
                       ref="table"
                       :span-method="handleSpan" style="width: 100%;" :max-height="height">
                </Table>
            </Row>
            <Row>
                <div style="margin-top: 20px">
                    <span>合计：</span><span style="margin-left: 20px; color: blue;">统计科室：{{totalOfficeCount}}</span>
                    <span style="margin-left: 20px; color: blue;">总登记人数：{{totalCountRegist}}</span>
                    <span style="margin-left: 20px; color: blue;">总检查人数：{{totalCountHealthy}}</span>
                    <span style="margin-left: 20px; color: blue;">总检查人次：{{totalCount}}</span>
                    <span style="margin-left: 20px; color: blue;">挂账+自费：￥{{totalPrice}}</span>
                </div>
            </Row>
        </Card>
    </div>
</template>

<script>
	import {formartDate, groupBy} from "@/api/tools/tool.js"
	import {getAllDepartment} from "../../../api";
	import {queryTDepartResultStatistics} from "../../../api/healthy/tDepartResult"
	import FileSaver from 'file-saver'
	import * as XLSX from 'xlsx'
	import {queryAllTGroupUnitList} from "../../../api/healthy/tGroupUnit";
	export default {
		name: "reviewItem",
		components: {},
		data() {
			return {
				selectDate: null,//选择的时间
				drop: false,
				dropDownContent: "展开",
				dropDownIcon: "ios-arrow-down",
				workStateCodeArr: [],//检查种类集合
				conclusionList: [],//体检结论集合
				tableLoading: false,//表格查询数据时等待条是否展示
				tableData: [],//表格展示数据
				total: 0,//总计
				height: 600,
				departmentArr: [],//单位集合
				officeIds: [],
                totalCount:0,//总检查人次
				totalOfficeCount:0,//总检查科室数
				totalPrice:0,//总计费
                totalCountRegist:0,//总登记
				totalCountHealthy:0,//总检查
				unitArr:[],//企业集合
				//查询参数
				queryFrom: {
					officeIds: [],
                    dept:"",
					startDate: formartDate(new Date(), 'yyyy-MM-dd')+" 00:00:00",//开始时间
					// startDate: "2023-02-02 00:00:00",//开始时间
					endDate: formartDate(new Date(), 'yyyy-MM-dd') + " 23:59:59",//结束时间
				},
				//表格列属性
				columns: [
					{
						title: '序号',
						type: 'index',
						width: 80,
						align: 'center',
					},
					{
						title: '科室名字',
						align: 'center',
						minWidth: 100,
						ellipsis: true,
						tooltip: true,
						key: 'officeName',
						sortable: false,
					},
					{
						title: '检查项目',
						align: 'center',
						minWidth: 80,
						ellipsis: true,
						tooltip: true,
						key: 'groupItemName',
						sortable: false,
					},
					{
						title: '检查人次',
						align: 'center',
						minWidth: 80,
						ellipsis: true,
						tooltip: true,
						key: 'count',
						sortable: false
					},
					{
						title: '实收费用',
						align: 'center',
						minWidth: 80,
						ellipsis: true,
						tooltip: true,
						key: 'discountPrice',
						sortable: false
					},
					{
						title: '原始金额',
						align: 'center',
						minWidth: 120,
						ellipsis: true,
						tooltip: true,
						key: 'salePrice',
						sortable: false
					},
					{
						title: '平均折扣率',
						align: 'center',
						minWidth: 100,
						ellipsis: true,
						tooltip: true,
						key: 'positive',
						sortable: false,
						render: (h, params) => {
							if (params.row.salePrice && params.row.discountPrice
									&& params.row.salePrice.toString().length > 0 && params.row.discountPrice.toString().length > 0) {
								let num = params.row.discountPrice / params.row.salePrice * 100;
								num = num.toFixed(2);
								return h('span', num + "%");
							} else {
								return h('span', "0%");
							}
						}
					},
				]
			}
		},
		computed: {
			physicalType() {
				return this.$store.state.theme.theme.physicalType;
			},
		},
		methods: {
			//查询所有科室
			queryAllOfficeList() {
				getAllDepartment().then(res => {
					if (res && res.success) {
						this.departmentArr = res.data;
						/*	if(this.departmentArr && this.departmentArr.length>0){
                                for (let i = 0; i < this.departmentArr.length; i++) {
                                    this.queryFrom.officeIds.push(this.departmentArr[i].id);
                                }
                            }*/

					}
				});
			},
            //查询所有企业
			queryAllTGroupUnitList(){
				queryAllTGroupUnitList({physicalType:this.physicalType}).then(res => {
					if (res && res.success) {
						this.unitArr = res.data;
					}
				});
			},
			//结束间改变
			datePickerEndTime(e) {
				if (e) {
					let endTime = new Date(e);
					endTime.setHours(23, 59, 59, 999);
					endTime = endTime.setDate(endTime.getDate());
					this.queryFrom.endDate = formartDate(new Date(endTime), 'yyyy-MM-dd HH:mm:ss');
				}
				this.getTDepartResultStatistics();
			},

			//开始时间改变
			datePickerStartTime(e) {
				if (e) {
					let startTime = new Date(e);
					startTime.setHours(0, 0, 0, 0);
					startTime = startTime.setDate(startTime.getDate());
					this.queryFrom.startDate = formartDate(new Date(startTime), 'yyyy-MM-dd HH:mm:ss');

				}
				this.getTDepartResultStatistics();
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
				this.selectDate = null;
				this.queryFrom.startDate = formartDate(new Date(), 'yyyy-MM-dd') + " 00:00:00";
				this.queryFrom.endDate = formartDate(new Date(), 'yyyy-MM-dd') + " 23:59:59";
				this.officeIds = [];
				this.queryFrom.officeIds = [];
				this.queryFrom.dept = "";
				/*	if(this.departmentArr && this.departmentArr.length>0){
                        for (let i = 0; i < this.departmentArr.length; i++) {
                            this.queryFrom.officeIds.push(this.departmentArr[i].id);
                        }
                    }*/
				// 重新加载数据
				this.getTDepartResultStatistics();
			},
			//人员检查项目页数改变
			changePage(v) {
				this.queryFrom.pageNumber = 1;
				this.queryFrom.pageSize = 10;
				this.queryFrom.pageNumber = v;
				this.getTDepartResultStatistics();
			},
			//人员检查项目展示条数改变
			changePageSize(v) {
				this.queryFrom.pageSize = v;
				this.getTDepartResultStatistics();
			},
			//查询统计信息
			getTDepartResultStatistics() {
				this.tableLoading = true;
				if (this.officeIds && this.officeIds.length > 0) {
					this.queryFrom.officeIds = this.officeIds;
				}
				this.tableData = [];
				this.totalCountRegist = 0;
				this.totalCountHealthy = 0;
				this.totalOfficeCount = 0;
				this.totalPrice = 0;
				this.totalCount = 0;
				queryTDepartResultStatistics(this.queryFrom).then(res => {
					if (res.success && res.data && res.data.result && res.data.result.length > 0) {
						//this.tableData = res.data;
						let officeNameGroup = groupBy(res.data.result, (link) => {
							return link.officeName.trim();
						});
						this.totalCountRegist = res.data.countRegist;
						this.totalCountHealthy = res.data.countHealthy;
						if (officeNameGroup != null) {

							for (let key in officeNameGroup) {
								let sunCount = 0;
								let sunSalePrice = 0;
								let sunDiscountPrice = 0;
								this.totalOfficeCount +=1;
								if (officeNameGroup[key]) {
									for (let i = 0; i < officeNameGroup[key].length; i++) {
										if (officeNameGroup[key][i].count && officeNameGroup[key][i].count.toString().length == 0) {
											officeNameGroup[key][i].count = 0;
										}
										sunCount += officeNameGroup[key][i].count;
										if (officeNameGroup[key][i].salePrice
												&& officeNameGroup[key][i].salePrice.toString().length > 0) {
											officeNameGroup[key][i].salePrice = officeNameGroup[key][i].count * officeNameGroup[key][i].salePrice;
										} else {
											officeNameGroup[key][i].salePrice = 0;
										}
										sunSalePrice += officeNameGroup[key][i].salePrice;

										if (officeNameGroup[key][i].discountPrice
												&& officeNameGroup[key][i].discountPrice.toString().length > 0) {
											officeNameGroup[key][i].discountPrice = officeNameGroup[key][i].count * officeNameGroup[key][i].discountPrice;
										} else {
											officeNameGroup[key][i].discountPrice = 0;
										}
										sunDiscountPrice += officeNameGroup[key][i].discountPrice;
										if (i === 0) {
											officeNameGroup[key][i].mergeColumn = officeNameGroup[key].length;
										} else {
											officeNameGroup[key][i].mergeColumn = 0;
										}

										this.tableData.push(officeNameGroup[key][i]);
									}
								}
								this.totalCount +=sunCount;
								this.totalPrice +=sunDiscountPrice;
								this.tableData.push({
									officeName: "合计(" + key.replaceAll("\"", "") + ")",
									groupItemName: "",
									count: sunCount,
									discountPrice: sunDiscountPrice,
									salePrice: sunSalePrice,
									positive: "",
									mergeColumn: 1,
								});
							}

						}
					}
				}).finally(() => {
					this.tableLoading = false;
				})
			},
			//合并科室
			handleSpan({row, column, rowIndex, columnIndex}) {
				if (row && row.mergeColumn > 0 && columnIndex === 1) {
					return {
						rowspan: row.mergeColumn,
						colspan: 1
					};
				} else if (columnIndex === 1) {
					return {
						rowspan: 0,
						colspan: 0
					};
				}
			},
			//导出本页
			exportData() {
				let excolumns = this.columns.filter(function (v) {
					return v.title != "操作" && v.type != 'selection' && v.title != "序号"
				});
				this.tableData.forEach(function (item) {
					if (item.salePrice && item.discountPrice
							&& item.salePrice.toString().length > 0 && item.discountPrice.toString().length > 0) {
						let num = item.discountPrice / item.salePrice * 100;
						num = num.toFixed(2);
						item.positive = num+"%"
					} else {
						item.positive = "0%";
					}
				})
				this.$refs.table.exportCsv({
					filename: '统计导出数据',
					columns: excolumns,
					data: this.tableData
				});
			},
			exportDataNew() {
				try {
					let excelName ='统计导出数据';
					const $e = this.$refs['table'].$el
					let $table = $e.querySelector('.el-table__fixed')
					if(!$table) {
						$table = $e
					}

					const wb = XLSX.utils.table_to_book($table, {raw:true})
					const wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST:true, type: 'array'})
					FileSaver.saveAs(
							new Blob([wbout],{type: 'application/octet-stream'}),
							`${excelName}.xlsx`,
					)
				} catch (e) {
					if (typeof console !== 'undefined') console.error(e)
				}
			}
		},
		created() {
			this.queryAllOfficeList();

		},
		mounted() {
			//查询所有段位
			this.queryAllTGroupUnitList();
			//初始化后请求
			this.getTDepartResultStatistics();
			this.height = window.document.documentElement.offsetHeight - 270;
		},
		watch: {}
	}
</script>

<style lang="less">
    .resultStatisticsDiv {
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

    .resultStatisticsDiv::-webkit-scrollbar {
        width: 4px;
    }

    .resultStatisticsDiv::-webkit-scrollbar-track {
        background-color: #e4e4e4;
        border-radius: 100px;
    }

    .resultStatisticsDiv::-webkit-scrollbar-thumb {
        background-color: #2684e780;
        border-radius: 100px;
    }
</style>