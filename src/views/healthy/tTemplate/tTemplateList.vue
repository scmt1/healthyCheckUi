<style lang="less">
	@import "../../../styles/tree&table-common.less";
    .tTemplateList {
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

        .select-title {
            font-weight: 600;
            color: #40a9ff;
        }

        .leftSpan {
            .leftSpanDiv {
                position: relative;
                max-height: calc(100vh - 220px);
                overflow-y: auto;
                overflow-x: hidden;
            }
			.leftSpanDiv::-webkit-scrollbar {
				/*滚动条整体样式*/
				width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
				height: 1px;
			}
			.leftSpanDiv::-webkit-scrollbar-thumb {
				/*滚动条里面小方块*/
				border-radius: 10px;
				box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
				background   : #535353;
			}
			.leftSpanDiv::-webkit-scrollbar-track {
				/*滚动条里面轨道*/
				box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
				border-radius: 10px;
				background   : #ededed;
			}
        }
    }
</style>
<template>
    <div class="tTemplateList">
        <Card>
            <Row type="flex" justify="space-between">
                <Col v-show="expand" class="leftSpan" :span="leftSpan" style="position: relative">
                    <Alert show-icon>
                        当前选择：
                        <span class="select-title">{{ editTitle }}</span>
                        <br/>
                        <a class="select-clear" v-if="editTitle" @click="cancelEdit">取消选择</a>
                    </Alert>
                    <Input v-model="searchKey" suffix="ios-search" @on-change="changeSearch" placeholder="输入搜索组合项目"
                           clearable/>
                    <div style="position: relative" class="leftSpanDiv">
                        <div class="tree-bar">
                            <Tree ref="tree" :data="treeData" @on-select-change="selectTree"></Tree>
                        </div>
                        <Spin size="large" fix v-if="treeLoading"></Spin>
                    </div>
                </Col>

                <div class="expand">
                    <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand"/>
                </div>

                <Col :span="span">
                    <Row v-show="openSearch">
                        <Form ref="searchForm" :model="searchForm" inline :label-width="70"
                              @keydown.enter.native="handSearch">
                            <FormItem label="模板状态">
								<Select v-model="searchForm.status" style="width:200px">
									<Option v-for="(item,i) in statusRadio" :value="item.value" :key="i">{{ item.title }}</Option>
								</Select>
                            </FormItem>
                            <FormItem label="创建时间">
								<DatePicker v-model="selectDate" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" clearable @on-change="selectDateRange"
											placeholder="选择创建时间" style="width: 200px"></DatePicker>
                            </FormItem>
                            <Form-item style="margin-left:-35px" class="br">
                                <Button @click="handSearch" type="primary" icon="ios-search">搜索</Button>
                                <Button @click="handReset">重置</Button>
<!--                                <a class="drop-down" @click="dropDown">-->
<!--                                    {{dropDownContent}}-->
<!--                                    <Icon :type="dropDownIcon"></Icon>-->
<!--                                </a>-->
                            </Form-item>
                        </Form>
                    </Row>
                    <div class="operation">
                        <Button @click="addTTemplate" type="primary" icon="md-add">新增</Button>
                        <Dropdown @on-click="handDropdown">
                            <Button>
                                更多操作
                                <Icon type="md-arrow-dropdown"/>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem name="refresh">
                                    <Icon type="md-sync"/>
                                    刷新
                                </DropdownItem>
                                <DropdownItem name="removeAll">
                                    <Icon type="md-trash"/>
                                    批量删除
                                </DropdownItem>
                                <DropdownItem name="export">
                                    <Icon type="md-arrow-down"/>
                                    导出本页数据
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Button type="dashed" @click="openSearch=!openSearch">{{openSearch ? '关闭搜索' : '开启搜索'}}</Button>
                        <Button type="dashed" @click="openTip=!openTip">{{openTip ? '关闭提示' : '开启提示'}}</Button>
                        <div style="float: right;">
                            <Poptip transfer trigger="click" placement="bottom-end" title="动态列">
                                <Button icon="md-list"></Button>
                                <div slot="content" style="position:relative;min-height:5vh">
                                    <Checkbox-group v-model="colOptions" @on-change="checkboxChange">
<!--                                        <checkbox v-for="item in colSelect" :label="item" :key="item"></checkbox>-->
                                        <row v-for="(item,i) in colSelect" :key="i">
                                            <checkbox style="margin-bottom: 5px;font-weight: 700;" :label="item"></checkbox>
                                        </row>
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
                        <Table :loading="loading" border :columns="columns" sortable="custom" :data="data"
                               @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table">
                            <template slot-scope="{ row, index }" slot="action">
                                <Button type="primary" @click="handLook(row, index)" size="small">
                                    <Icon type="ios-eye-outline"/>
                                    查看
                                </Button>
                                <Dropdown :transfer=true>
                                    <Button size="small">
                                        更多操作
                                        <Icon type="md-arrow-dropdown"/>
                                    </Button>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="edit" @click.native="handEdit(row, index)">
                                            <Icon type="ios-create-outline"/>
                                            修改
                                        </DropdownItem>
                                        <DropdownItem name="delete" @click.native="deleteData(row, index)">
                                            <Icon type="md-trash"></Icon>
                                            删除
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </template>
                        </Table>
                    </div>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize"
                              @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]"
                              size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Col>
            </Row>

        </Card>
        <updateTTemplate v-model="updateShow" :TTemplateId="TTemplateId" :modalTitle="title"
                         v-on:handSearch="handSearch"  :baseProjectId="searchForm.baseProjectId" ></updateTTemplate>
    </div>
</template>
<script>
	import {deleteTTemplate,updateTTemplate as update, queryTTemplateList} from '@/api/healthy/tTemplate'
	import {queryAllPortfolioProjectList} from '@/api/healthy/tPortfolioProject'
	import updateTTemplate from './updateTTemplate'
	import {queryAllSectionOfficeData} from "../../../api/healthy/tSectionOffice";

	export default {
		components: {
			updateTTemplate
		},
		data() {
			return {
				leftSpan: 4,
				span: 20,
				expandIcon: "ios-arrow-back",
				expand: true,
				drop: false,
				dropDownContent: "展开",
				dropDownIcon: "ios-arrow-down",
				treeLoading: false, // 树加载状态
				treeData: [], // 树数据
				editTitle: "", // 编辑节点名称
				searchKey: "", // 搜索树
				baseProjectId:"",//项目Id
				selectNode: "",
				maxHeight:0,
				search: '',
				data: [],
				columns: this.getTTemplateColumns(),
				openSearch: true,//打开搜索
				openTip: true,//打开提示
				loading: true, // 表单加载状态
				selectCount: 0, // 多选计数
				selectList: [], // 多选数据
				selectDate:null,
				searchForm: {
					// 搜索框对应data对象
					baseProjectId: '',
					createTime: '',
					pageNumber: 1, // 当前页数
					pageSize: 10, // 页面大小
					startDate: null,//开始时间
					endDate: null,//结束时间
					sort: 'createTime', // 默认排序字段
					order: 'desc', // 默认排序方式
					status:null,//查询方式
				},
				total: 0,
				title: '',
				TTemplateId: '',
				updateShow: false,
				tableHeight: 200,
				colOptions: ["组合项目名称", "状态", "模板内容", "排序", "创建时间", "操作"],
				colSelect: ["组合项目名称", "状态", "模板内容", "排序", "创建时间", "操作"],
				statusRadio: [{
					"title":"启用",
					"value":"1"
				},{
					"title":"停用",
					"value":"0"
				}],
				csvData: [],
			}
		},
		methods: {
			/**
			 * 左侧树显示隐藏
			 */
			changeExpand() {
				this.expand = !this.expand;
				if (this.expand) {
					this.expandIcon = "ios-arrow-back";
					this.span = 20;
					this.leftSpan = 4
				} else {
					this.expandIcon = "ios-arrow-forward";
					this.span = 23;
					this.leftSpan = 1;
				}
			},
			//列表上方更多操作
			handDropdown(name) {
				if (name == "refresh") {
					this.getDataList();
				} else if (name == "removeAll") {
					this.delAll();
				} else if (name == "export") {
					let excolumns = this.columns.filter(function (v) {
						return v.title != "操作" && v.type != 'selection'
					});
					this.$refs.table.exportCsv({
						filename: '本页数据',
						columns: excolumns,
						data: this.csvData
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
			addTTemplate() {
				this.title = '新增';
				this.updateShow = true
				this.TTemplateId = '';
			},
			//编辑
			handEdit(row, index) {
				this.title = '编辑';
				this.TTemplateId = row.id.toString();
				this.updateShow = true;
			},
			//查看
			handLook(row, index) {
				this.title = '查看';
				this.TTemplateId = row.id.toString();
				this.updateShow = true;
			},
			//分页查询
			getDataList() {
				this.loading = true;
				queryTTemplateList(this.searchForm).then(res => {
					if (res.success) {
						this.loading = false;
						this.data = res.data.records;
						this.total = res.data.total;
						this.csvData = JSON.parse(JSON.stringify(res.data.records));
					}
				});
			},
			//单一删除
			deleteData(row, index) {
				this.$Modal.confirm({
					title: "确认删除",
					content: "您确认要删除所点击选的数据?",
					loading: true,
					onOk: () => {
						this.userLoading = true;
						var ids = [];
						ids.push(row.id);
						this.patchDeleteData(ids);
					},
					onCancel: () => {
						this.$Message.info('取消了当前的操作行为！');
					},
				});
			},
			//批量删除
			delAll() {
				if (this.selectCount <= 0) {
					this.$Message.warning('您还未选择要删除的数据');
					return;
				}
				this.$Modal.confirm({
					title: '确认删除',
					content: '您确认要删除所选的 ' + this.selectCount + '条数据?',
					loading: true,
					onOk: () => {
						let ids = [];
						this.selectList.forEach(function (e) {
							ids.push(e.id);
						});
						this.patchDeleteData(ids);
					},
					onCancel: () => {
						this.$Message.info('取消了当前的操作行为！');
					}
				});
			},
			//删除（后台）
			patchDeleteData(ids) {
				if (ids == undefined || ids == null || ids.length == 0) {
					this.$Message.error('没有选择的数据');
					return;
				}
				deleteTTemplate({ids: ids}).then(res => {
					this.userLoading = false;
					this.$Modal.remove();
					if (res.success) {
						this.modalTaskVisible = false;
						this.$Message.success('删除成功');
						this.getDataList();
					} else {
						this.$Message.error('删除失败');
					}
				});
			},
            /**
             * 更新状态
             */
			updateData(row){
				if(row==null){
					return
                }

				update({id: row.id,status:row.status}).then(res => {
					this.userLoading = false;
					this.$Modal.remove();
					if (res.success) {
						this.modalTaskVisible = false;
						this.$Message.success('更新成功');
						this.getDataList();
					} else {
						this.$Message.error('新失败');
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
				if (e.order == 'normal') {
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
				this.searchForm.baseProjectId = '';
				this.searchForm.createTime = '';
				this.searchForm.status = '';
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
			getTTemplateColumns() {
				let _this= this;
				return [
					{
						type: 'selection',
						width: 60,
						align: 'center',
					},
					{
						title: '组合项目名称',
						align: 'center',
						minWidth: 120,
						ellipsis: true,
						tooltip: true,
						key: 'baseProjectId',
						sortable: false,
						render: (h, params) => {
							let newTime =params.row.tportfolioProject.name;
							let dataD= this.csvData.filter(item => item.id == params.row.id);
							if (dataD.length > 0) {
								dataD[0].eventEndTime = newTime;
							}
							return h('Tooltip', {
								props: {
									content: newTime,
									placement: 'bottom',
									transfer: true
								}
							}, newTime);
						}
					},
					{
						title: '状态',
						align: 'center',
						minWidth: 120,
						ellipsis: true,
						tooltip: true,
						key: 'status',
						sortable: false,
						render: function (h, params) {
							return h('div', [
								h('i-switch', {
									props: {
										type: 'primary',
										size: 'large',
										value: params.row.status,
										'true-value': '1',
										'false-value': '0'
									},
									scopedSlots: {
										open: function () {
											return h("span", "启用")
										},
										close: function () {
											return h("span", "停用")
										}
									},
									on: {
										//  处理新闻显示逻辑
										'on-change': function (value) {
											_this.updateData(params.row)
										}
									}
								}, '')])
						}
					},
					{
						title: '模板内容',
						align: 'center',
						minWidth: 120,
						ellipsis: true,
						tooltip: true,
						key: 'contentName',
						sortable: false
					},
					{
						title: '排序',
						align: 'center',
						minWidth: 120,
						ellipsis: true,
						tooltip: true,
						key: 'orderNum',
						sortable: false
					},
					{
						title: '创建时间',
						key: 'createTime',
						sortable: true,
						align: 'center',
						width: 180,
					},
					{
						title: '操作',
						align: 'center',
						slot: 'action',
						width: 200,
					}
				]
			},
			//动态列实现
			checkboxChange: function (data) {
				let columnss = this.getTTemplateColumns();
				this.columns = columnss.filter(function (v) {
					return data.indexOf(v.title) > -1 || v.type == 'selection'
				})
			},
			/**
			 * 查询所有组合项目
			 */
			queryAllPortfolioProjectData() {
				queryAllPortfolioProjectList({}).then(res => {
					if (res.success) {
						let data = [];
						for (let i = 0; i < res.data.length; i++) {
							let obj = {...res.data[i]};
							obj.title = obj.name;
							obj.expand = true;
							data.push(obj);
						}
						this.treeData = data;
					}
				}).finally(() => {
					this.treeLoading = false;
				})
			},
			/**
			 * 搜索树
			 *
			 */
			changeSearch() {
				// 搜索树
				if (this.searchKey) {
					this.treeLoading = true;
					queryAllPortfolioProjectList({name: this.searchKey}).then(res => {
						if (res.success) {
							for (let i = 0; i < res.data.length; i++) {
								res.data[i].title = res.data[i].name;
								res.data[i].children = [];
							}
							this.treeData = res.data;
						}
					}).finally(() => {
						this.treeLoading = false;
					})
				} else {
					// 为空重新加载
					this.queryAllPortfolioProjectData();
				}
			},
			/*
             树取消选择
             */
			cancelEdit() {
				let data = this.$refs.tree.getSelectedNodes()[0];
				if (data) {
					data.selected = false;
				}
				// 取消选择后获取全部数据
				this.selectNode = {};
				this.editTitle = "";
				this.searchForm.officeId = null;
				this.getDataList();
			},
			/**
			 * 选择树
			 * @param v
			 */
			selectTree(v) {
				if (v.length > 0) {
					// 转换null为""
					for (let attr in v[0]) {
						if (v[0][attr] == null) {
							v[0][attr] = "";
						}
					}
					let str = JSON.stringify(v[0]);
					let data = JSON.parse(str);
					this.selectNode = data;
					this.editTitle = data.title;
					// 重新加载表
					this.searchForm.pageNumber = 1;
					this.searchForm.pageSize = 10;
					this.searchForm.baseProjectId = data.id;
					this.getDataList();
				} else {
					this.cancelEdit();
				}
			},
		},
		mounted() {
			this.getDataList();
			this.queryAllPortfolioProjectData();
		}
	}
</script>
<style scoped="less">
    .operation {
        margin-bottom: 10px;
    }
</style>
