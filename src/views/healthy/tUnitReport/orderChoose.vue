<style lang="less">
    .orderChoose {
        .ivu-modal {
            width: 960px !important;
        }
    }
</style>
<template>
    <Modal v-model="show" title="订单合并" class="orderChoose" :mask-closable="false">
        <div>
            <Row v-show="openSearch">
                <Form ref="searchForm" :model="searchForm" inline :label-width="70"
                      @keydown.enter.native="handSearch">
                    <FormItem label="公司名称">
                        <Input  type="text" v-model="searchForm.groupUnitName" placeholder="请输入公司名称"/>
                    </FormItem>
                    <FormItem label="订单日期">
                        <DatePicker v-model="selectDate" @on-change="orderDateChange"
                                    transfer :clearable="false" placeholder="请选择"
                                    style="width: 200px;"
                                    type="daterange"></DatePicker>
                    </FormItem>

                    <Form-item style="margin-left:-35px" class="br">
                        <Button @click="handSearch" type="primary" icon="ios-search">搜索</Button>
                        <Button @click="handReset">重置</Button>
                    </Form-item>
                </Form>
            </Row>
            <div class="operation">
                <Button type="dashed" @click="openSearch=!openSearch">{{openSearch ? '关闭搜索' : '开启搜索'}}</Button>
                <Button type="dashed" @click="openTip=!openTip">{{openTip ? '关闭提示' : '开启提示'}}</Button>
                <div style="float: right;">
                    <Poptip transfer trigger="click" placement="bottom-end" title="动态列">
                        <Button icon="md-list"></Button>
                        <div slot="content" style="position:relative;min-height:5vh">
                            <Checkbox-group v-model="colOptions" @on-change="checkboxChange">
                                <Row>
                                    <checkbox v-for="item in colSelect" :label="item" :key="item"></checkbox>
                                </Row>
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
        </div>
        <div slot="footer">
            <Button type="text" @click="show=false">取消</Button>
            <Button type="primary" :loading="buttonLoading" @click="handSubmit" >合并</Button>
        </div>
    </Modal>
</template>
<script>
	import {queryTGroupOrderList,consolidatedOrder} from "@/api/healthy/tGroupOrder"
	export default {
		name: "updateTTemplate",
		props: {
			value: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				show: this.value,
				buttonLoading: false,
				disabled: false,
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
				columns: this.getColumns(),
				openSearch: true,//打开搜索
				openTip: true,//打开提示
				loading: true, // 表单加载状态
				selectCount: 0, // 多选计数
				selectList: [], // 多选数据
				selectDate:null,
				searchForm: {
					// 搜索框对应data对象
					createTime: '',
					pageNumber: 1, // 当前页数
					pageSize: 10, // 页面大小
					startDate: null,//开始时间
					endDate: null,//结束时间
					sort: 'create_time', // 默认排序字段
					order: 'desc', // 默认排序方式
					status:null,//查询方式
					groupUnitName:"",//单位名称
                    physicalType:"",//体检类型
				},
				total: 0,
				title: '',
				TTemplateId: '',
				updateShow: false,
				tableHeight: 200,
				colOptions: ["编号", "公司名称","创建时间"],
				colSelect: ["编号", "公司名称","创建时间"],
				csvData: [],

			}
		},
		methods: {
		    //订单日期改变
            orderDateChange(v){
                if (v) {
                    this.searchForm.startDate = v[0];
                    this.searchForm.endDate = v[1];
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
				this.searchForm.physicalType = this.physicalType;
				queryTGroupOrderList(this.searchForm).then(res => {
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
				this.searchForm.groupUnitName = '';
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
			getColumns() {
				let _this= this;
				return [
					{
						type: 'selection',
						width: 60,
						align: 'center',
					},
					{
						title: '编号',
						align: 'center',
						ellipsis: true,
						tooltip: true,
						key: 'orderCode'
					},
					{
						title: '公司名称',
						align: 'center',
						ellipsis: true,
						tooltip: true,
						key: 'groupUnitName',
					},
					{
						title: '创建时间',
						key: 'createTime',
						align: 'center',
						sortable: false,
					},
				]
			},
			//动态列实现
			checkboxChange: function (data) {
				let columnss = this.getColumns();
				this.columns = columnss.filter(function (v) {
					return data.indexOf(v.title) > -1 || v.type == 'selection'
				})
			},
            //合并
			handSubmit() {
				let ids = [];
				if (this.selectCount <= 0) {
					this.$Message.warning('您还未选择要合并的数据');
					return;
				}
				if (this.selectCount == 1) {
					this.$Message.error('合并的数据至少要两条');
					return;
				}
				let isUint = false;
				let _this= this;
				_this.selectList.forEach(function (e) {
                    if(_this.selectList[0].groupUnitName.trim()!=e.groupUnitName.trim() && _this.selectList[0].groupUnitId.trim()!=e.groupUnitId.trim()){
						isUint = true;
                    }
					ids.push(e.id);
				});
				if(isUint){
					_this.$Message.error('合并的数据必须是同一公司的');
					return;
                }
				_this.buttonLoading = true;
				consolidatedOrder({ids:ids}).then(res => {
					if(res){
						if (res.code == 200) {
							_this.closeModal(false);
							_this.$emit('handleSearch');
							_this.$Message.success('合并成功');
						} else {
							_this.$Message.error(res.msg);
						}
                    }
					else{
						_this.$Message.error("合并失败");
                    }

				}).finally(() => {
					_this.buttonLoading = false;
				})
			},
			closeModal(val) {
				this.$emit('input', val);
			},

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

			show(val) {
				this.loading = false;
				if (val) {
					this.getDataList();
				} else {
					this.closeModal(val);
				}
			}
		}
	}
</script>
