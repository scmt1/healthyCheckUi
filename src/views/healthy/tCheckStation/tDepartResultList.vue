<style lang="less">
.tDepartResultList{
}
</style>
<template>
	<div class="tDepartResultList">
		<Card>
			<Row v-show="openSearch">
				<Form ref="searchForm"  :model="searchForm" inline :label-width="70" @keydown.enter.native="handSearch">
					<Form-item style="margin-left:-35px" class="br">
						<Button @click="handSearch" type="primary" icon="ios-search">搜索</Button>
						<Button @click="handReset">重置</Button>
						<a class="drop-down" @click="dropDown">
							{{dropDownContent}}
							<Icon :type="dropDownIcon"></Icon>
						</a>
					</Form-item>
				</Form>
			</Row>
			<div class="operation">
				<Button @click="addTDepartResult" type="primary" icon="md-add">新增</Button>
				<Dropdown @on-click="handDropdown">
					<Button>
						更多操作
						<Icon type="md-arrow-dropdown"/>
					</Button>
					<DropdownMenu slot="list">
						<DropdownItem name="refresh"><Icon type="md-sync" />刷新</DropdownItem>
						<DropdownItem name="removeAll"> <Icon type="md-trash"/>批量删除</DropdownItem>
						<DropdownItem name="export"> <Icon type="md-arrow-down" />导出本页数据</DropdownItem>
					</DropdownMenu>
				</Dropdown>
				<Button type="dashed" @click="openSearch=!openSearch">{{openSearch ? '关闭搜索' : '开启搜索'}}</Button>
				<Button type="dashed" @click="openTip=!openTip">{{openTip ? '关闭提示' : '开启提示'}}</Button>
				<div style="float: right;">
					<Poptip transfer trigger="click" placement="bottom-end" title="动态列">
						<Button icon="md-list"></Button>
						<div slot="content" style="position:relative;min-height:5vh">
							<Checkbox-group v-model="colOptions" @on-change="checkboxChange">
								<checkbox v-for="item in colSelect" :label="item" :key="item" ></checkbox>
							</Checkbox-group>
						</div>
					</Poptip>
				</div>
			</div>
			<div v-show="openTip">
				<Alert show-icon>
					已选择
					<span class="select-count">{{selectCount}}</span> 项
					<a class="select-clear" @click="clearSelectAll">清空</a>
					<span style="float: right;">点击右上角按钮配置动态列↑</span>
				</Alert>
			</div>
			<div>
				<Table :loading="loading" border :columns="columns" sortable="custom" :data="data" @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table">
					<template slot-scope="{ row, index }" slot="action">
						<Button type="primary" @click="handLook(row, index)" size="small"><Icon type="ios-eye-outline"/>查看</Button>
						<Dropdown :transfer=true>
							<Button size="small">
								更多操作
								<Icon  type="md-arrow-dropdown"/>
							</Button>
							<DropdownMenu slot="list">
								<DropdownItem name="edit" @click.native="handEdit(row, index)"><Icon type="ios-create-outline" />修改</DropdownItem>
								<DropdownItem name="delete" @click.native="deleteData(row, index)"><Icon type="md-trash"></Icon>删除</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</template>
				</Table>
			</div>
			<Row type="flex" justify="end" class="page">
				<Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
			</Row>
		</Card>
		<updateTDepartResult v-model="updateShow" :TDepartResultId="TDepartResultId" :modalTitle="title" v-on:handSearch="handSearch"></updateTDepartResult>
	</div>
</template>
<script>
	import {deleteTDepartResult, queryTDepartResultList} from '@/api/healthy/tDepartResult'
	import { formartDate } from '@/api/tools/tool'
	export default {
		data() {
			return {
				drop: false,
				dropDownContent: "展开",
				dropDownIcon: "ios-arrow-down",
				search: '',
				data: [],
				columns: this.getTDepartResultColumns(),
				openSearch: true,//打开搜索
				openTip: true,//打开提示
				loading: true, // 表单加载状态
				selectCount: 0, // 多选计数
				selectList: [], // 多选数据
				searchForm: {
					// 搜索框对应data对象
					pageNumber: 1, // 当前页数
					pageSize: 10, // 页面大小
					startDate: null,//开始时间
					endDate: null,//结束时间
					sort: 'createTime', // 默认排序字段
					order: 'desc' // 默认排序方式
				},
				total: 0,
				title: '',
				TDepartResultId: '',
				updateShow: false,
				tableHeight: 200,
				colOptions: [
"基础体检项目名称","操作"],
				colSelect: [
"基础体检项目名称","操作"],
			}
		},
		 methods: {
			 //列表上方更多操作
			handDropdown(name) {
				if (name == "refresh") {
					this.getDataList();
				} else if (name == "removeAll") {
					this.delAll();
				}else if (name == "export") {
					let excolumns = this.columns.filter(function(v){ return v.title!="操作" && v. type!= 'selection'});
					this.$refs.table.exportCsv({
						filename: '本页数据',
						columns: excolumns,
						data:this.data
					});
				}
			 },
			 //展开 收起
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
			//时间选择事件
			selectDateRange(v) {
				if (v) {
					this.searchForm.startDate = v[0];
					this.searchForm.endDate = v[1];
				}
			},
			//新增
			addTDepartResult() {
			this.title = '新增';
				this.updateShow = true
				this.TDepartResultId='';
			},
			//编辑
			handEdit(row, index) {
			this.title = '编辑';
				this.TDepartResultId=row.id.toString();
				this.updateShow = true;
			},
			//查看
			handLook(row, index) {
			this.title = '查看';
				this.TDepartResultId=row.id.toString();
				this.updateShow = true;
			},
			//分页查询
			getDataList() {
				this.loading = true;
				queryTDepartResultList(this.searchForm).then(res => {
					if(res.success) {
						this.loading = false;
						this.data = res.data.records;
						this.total = res.data.total;
					}
				});
			},
			//单一删除
			deleteData(row, index){
				this.$Modal.confirm({
					title:"确认删除",
					content: "您确认要删除所点击选的数据?",
					loading: true,
					onOk: () => {
						this.userLoading = true;
						var ids = [];
						ids.push(row.id);
						this.patchdeleteData(ids);
					},
					onCancel: () => {
						this.$Message.info('取消了当前的操作行为！');
					},
				});
			},
			//批量删除
			delAll() {
				if(this.selectCount <= 0) {
					this.$Message.warning('您还未选择要删除的数据');
					return;
				}
				this.$Modal.confirm({
					title: '确认删除',
					content: '您确认要删除所选的 ' + this.selectCount + '条数据?',
					loading: true,
					onOk: () => {
						let ids =[];
						this.selectList.forEach(function(e) {
							ids.push(e.id );
						});
						this.patchdeleteData(ids);
					},
					onCancel: () => {
						this.$Message.info('取消了当前的操作行为！');
					}
				});
			 },
			//删除（后台）
			patchdeleteData(ids) {
				if(ids == undefined || ids == null || ids.length == 0) {
					this.$Message.error('没有选择的数据');
						return;
					}
					deleteTDepartResult({ids:ids}).then(res => {
						this.userLoading = false;
						this.$Modal.remove();
						if(res.success) {
							this.modalTaskVisible = false;
							this.$Message.success('删除成功');
							this.getDataList();
						} else {
							this.$Message.error('删除失败');
						}
				});
			},
			//改变页码
			changePage(v) {
				this.searchForm.pageNumber = v;
				this.getDataList();
				this.clearSelectAll();
			},
			//改变每页显示数据的条数
			changePageSize(v) {
				this.searchForm.pageSize = v;
				this.getDataList();
			},
			//改变排序方式
			changeSort(e) {
				this.searchForm.sort = e.key;
				this.searchForm.order = e.order;
				if(e.order == 'normal') {
					this.searchForm.order = '';
				}
				this.getDataList();
			},
			//查询
			handSearch() {
				this.searchForm.pageNumber = 1;
				this.searchForm.pageSize = 10;
				this.getDataList();
			},
			//重置
			handReset() {
				this.$refs.searchForm.resetFields();
				this.searchForm.pageNumber = 1;
				this.searchForm.pageSize = 10;
				this.searchForm.startDate = null;
				this.searchForm.endDate = null;
				this.selectDate = null;
				// 重新加载数据
				this.getDataList();
			},
			//显示选择
			showSelect(e) {
				this.selectList = e;
				this.selectCount = e.length;
			},
			//清空选择
			clearSelectAll() {
				this.$refs.table.selectAll(false);
			},
			//获取列表字段
			getTDepartResultColumns() {
				return [
					{
						type: 'selection',
						width: 60,
						align: 'center',
					},
					{
						title: '项目名称',
						align: 'center',
						minWidth: 120,
						ellipsis: true,
						tooltip: true,
						key: 'baseProjectName',
						sortable: false
					},
					{
						title:'操作',
						align: 'center',
						slot: 'action',
						width: 200,
					}
				]
			},
			//动态列实现
			checkboxChange:function (data) {
			var columnss =  this.getTSubstancesColumns();
			this.columns= columnss.filter(function(v){ return data.indexOf(v.title) > -1 || v. type== 'selection'})
			}
		},
		mounted() {
			this.getDataList();
		}
	}
</script>
<style scoped="less">
	 .operation{
		margin-bottom: 10px;
	}
</style>
