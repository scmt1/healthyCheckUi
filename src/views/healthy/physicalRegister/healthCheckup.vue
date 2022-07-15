<template>
    <div class="healthCheckup">
        <Card>
            <Alert class="ivu-alert-left">
                体检项目
                <span style="display: inline-block;">
                     <Button @click="checkCombo" v-if="personInfo.isPass == 1" type="primary" icon="md-add"
                             size="small">套餐选择</Button>
                    <Button @click="addTPortfolioProject" type="primary" icon="md-add" size="small">选检项目
                    </Button>
                </span>
            </Alert>
            <Table :loading="tableLoading" border :columns="columns" sortable="custom" show-summary
                   :summary-method="handleSummary"
                   :data="projectData" ref="table" max-height="380">
                <template slot-scope="{ row, index }" slot="action"
                          v-if="row.projectType==2">
                    <Button type="error" @click="deleteData(row, index)" :loading="delLoading" size="small">
                        <Icon type="md-trash"></Icon>
                        删除
                    </Button>
                </template>
            </Table>
            <div class="ivu-alert ivu-alert-info ivu-alert-with-icon" style="margin-top: 16px;">
                <div style="font-size: 16px;margin: 5px 0;">
										<span class="ivu-alert-message">
												操作说明
										</span>
                </div>
                <div class="explain">
                    <div>
                        <span class="ivu-alert-message">
                        第一步：
                        </span>
                    </div>
                    <div>
                        <span class="ivu-alert-message">
                            点击新增
                        </span>
                    </div>
                </div>
                <div class="explain">
                    <div>
                        <span class="ivu-alert-message">
                        第二步：
                        </span>
                    </div>
                    <div>
                        <span class="ivu-alert-message">
                            填写信息（填写体检人员信息和选择体检项目）
                        </span>
                    </div>
                </div>
                <div class="explain">
                    <div>
                        <span class="ivu-alert-message">
                            第三步：
                        </span>
                    </div>
                    <div>
                        <span class="ivu-alert-message">
                            点击保存（保存体检人员和体检项目信息）
                        </span>
                    </div>
                </div>
                <div class="explain">
                    <div>
                        <span class="ivu-alert-message">
                            第四步：
                        </span>
                    </div>
                    <div>
                        <span class="ivu-alert-message">
                            采集人像（采集体检人员头像）
                        </span>
                    </div>
                </div>
                <div class="explain">
                    <div>
                        <span class="ivu-alert-message">
                            第五步：
                        </span>
                    </div>
                    <div>
                        <span class="ivu-alert-message">
                            确认登记
                        </span>
                    </div>
                </div>
                <div class="explain">
                    <div>
                        <span class="ivu-alert-message">
                            第六步：
                        </span>
                    </div>
                    <div>
                        <span class="ivu-alert-message">
                            打印导检单（体检人员可以根据导检单进行体检）
                        </span>
                    </div>
                </div>
                <div class="explain">
                    <div>
                        <span class="ivu-alert-message">
                            第七步：
                        </span>
                    </div>
                    <div>
                        <span class="ivu-alert-message">
                            确认缴费
                        </span>
                    </div>
                </div>
                <div>
										<span class="ivu-alert-message">
											或执行第五、六、七步
										</span>
                </div>
            </div>
        </Card>
        <choose-portfolio-project v-model="choosePortfolioProjectShow" v-on:handleSearch="setTableData"
                                  :checkedList="choosePortfolioProjectData"></choose-portfolio-project>
        <choose-combo v-model="chooseComboShow" v-on:handleSearch="setComboData" :checkedList="comboIdList"
                      :physicalType="physicalType"></choose-combo>
    </div>
</template>

<script>
    import {queryProjectDataByGroupIdAndPersonId} from "../../../api/healthy/tGroupPerson";
    import choosePortfolioProject from "../tGroupOrder/choosePortfolioProject";
    import {getComboItemByComboId} from "@/api/healthy/tComboItem"
    import chooseCombo from "../tGroupOrder/chooseCombo";
    import {deleteGroupItem} from "../../../api/healthy/tOrderGroupItem";

    export default {
        name: "healthCheckup",
        props: {
            personInfo: {
                type: Object
            },
            projectDataInfo: {
                type: Array
            },
        },
        components: {choosePortfolioProject, chooseCombo},
        computed: {
            physicalType() {
                return this.$store.state.theme.theme.physicalType;
            },
        },
        data() {
            return {
                tableLoading: false,
                choosePortfolioProjectShow: false,
                chooseComboShow: false,
                columns: this.getColumns(),
                projectData: [],
                choosePortfolioProjectData: [],
                comboIdList: [],
                arr: [],
                delLoading:false,
                projectArr:[],
            }
        },
        methods: {
            addTPortfolioProject() {
                this.choosePortfolioProjectShow = true;
                this.choosePortfolioProjectData = JSON.parse(JSON.stringify(this.projectData));
                this.choosePortfolioProjectData.forEach(item => {
                    item.id = item.portfolioProjectId
                })
            },
            deleteData(row, index) {
                this.delLoading = true;
                let list = this.projectArr;
                let flag = false;
                for (let i = 0; i < list.length; i++) {
                    if(row.id == list[i].id){
                        flag = true;
                    }
                }
                if(flag){
                    this.$Modal.confirm({
                        title: '确认删除',
                        content: '该订单下所有人员的"' + row.name + '"项目都将被删除，请谨慎删除?',
                        loading: true,
                        onOk: () => {
                            //删除当前列表
                            deleteGroupItem({id:row.id}).then(res =>{
                                if(res.data){
                                    this.$Message.info(res.msg);
                                    this.queryProjectData();
                                }
                            }).finally(() => {
                                this.delLoading = false;
                            })
                            this.$Modal.remove();
                        },
                        onCancel: () => {
                            this.delLoading = false;
                            this.$Message.info('取消了当前的操作行为！');
                        }
                    });
                }else{
                    this.delLoading = false;
                    this.projectData.splice(index, 1);
                }
            },
            handleSummary({columns, data}) {
                const sums = {};
                columns.forEach((column, index) => {
                    const key = column.key;
                    if (index === 0) {
                        sums[key] = {
                            key,
                            value: '合计'
                        };
                        return;
                    }
                    const values = data.map(item => Number(item[key]));
                    if (!values.every(value => isNaN(value))) {
                        const v = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return this.numAdd(prev, curr, 1);
                            } else {
                                return prev;
                            }
                        }, 0);

                        if (key == 'salePrice' || key == 'discountPrice') {
                            sums[key] = {
                                key,
                                value: v + ' 元'
                            };
                        } else {
                            sums[key] = {
                                key,
                                value: '-'
                            };
                        }
                    } else {
                        sums[key] = {
                            key,
                            value: '-'
                        };
                    }
                });
                return sums;
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
            getColumns() {
                let cols = [
                    {
                        type: 'index',
                        width: 70,
                        align: 'center',
                    },
                    {
                        title: '项目名称',
                        align: 'left',
                        minWidth: 150,
                        ellipsis: true,
                        tooltip: true,
                        key: 'name',
                        sortable: false
                    },
                    {
                        title: '原价',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'salePrice',
                        sortable: false,
                        // render: (h, params) => {
                        // 		if(this.personInfo.isPass == 1) {
                        // 				return h('div', [
                        // 						h('InputNumber', {
                        // 								props: {
                        // 										placeholder: '请输入',
                        // 										value: params.row.salePrice,
                        // 								},
                        // 								on: {
                        // 										input: (val) => {
                        // 												let v = Number(val);
                        // 												if (v == NaN) {
                        // 														v = 0;
                        // 												}
                        // 												this.projectData[params.index].salePrice = v;
                        // 												let discount = this.projectData[params.index].discount;
                        // 												discount = Number(discount);
                        // 												if (discount == NaN) {
                        // 														discount = 100;
                        // 												}
                        // 												//折扣价
                        // 												this.projectData[params.index].discountPrice = (v * discount / 100).toFixed(2);
                        // 										}
                        // 								},
                        // 						})
                        // 				]);
                        // 		}else {
                        // 				return h('div', params.row.salePrice)
                        // 		}
                        // }
                    },
                    {
                        title: '折扣',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'discount',
                        sortable: false,
                        // render: (h, params) => {
                        // 		if(this.personInfo.isPass == 1) {
                        // 				return h('div', [
                        // 						h('InputNumber', {
                        // 								props: {
                        // 										placeholder: '请输入',
                        // 										value: params.row.discount ? params.row.discount : 100,
                        // 										step: 1,
                        // 										min: 0,
                        // 										max: 100,
                        // 								},
                        // 								on: {
                        // 										input: (val) => {
                        // 												//折扣
                        // 												let v = Number(val);
                        // 												if (v == NaN) {
                        // 														v = 0;
                        // 												}
                        // 												this.projectData[params.index].discount = v;
                        // 												//销售价
                        // 												let salePrice = params.row.salePrice;
                        // 												salePrice = Number(salePrice);
                        // 												if (salePrice == NaN) {
                        // 														salePrice = 0;
                        // 												}
                        // 												//折扣价
                        // 												this.projectData[params.index].discountPrice = (salePrice * v / 100).toFixed(2);
                        // 										}
                        // 								},
                        // 						})
                        // 				]);
                        // 		}else {
                        // 				return h('div', params.row.discount)
                        // 		}
                        // }
                    },
                    {
                        title: '折扣价',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'discountPrice',
                        sortable: false,
                    }, {
                        title: '项目类型',
                        align: 'center',
                        minWidth: 80,
                        ellipsis: true,
                        tooltip: true,
                        key: 'type',
                        sortable: false,
                        render: (h, params) => {
                            if (params.row.projectType == 1) {
                                return h('span', "套餐项目");
                            } else {
                                return h('span', "选检项目");
                            }
                        }
                    }, {
                        key: "action",
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 200,
                    }
                ];
                return cols;
            },
            setTableData(e) {
				let groupItem = this.arr;
				let arr = [];
				if(groupItem.length > 0){
					arr = this.arr;
					e.forEach(item => {
						let flag = true;
						for (let i = 0; i < groupItem.length; i++) {
							if(item.name == groupItem[i].name){
								flag = false;
							}
						}
						if(flag){
							item.discount = 100;
							item.portfolioProjectId = item.id;
							//销售价
							let salePrice = item.salePrice;
							salePrice = Number(salePrice);
							if (salePrice == NaN) {
								salePrice = 0;
							}
							//折扣价
							item.discountPrice = (salePrice * 100 / 100).toFixed(2);
							arr.push(item);
						}
					})
				}else{
					e.forEach(item => {
						item.discount = 100;
						item.portfolioProjectId = item.id;
						//销售价
						let salePrice = item.salePrice;
						salePrice = Number(salePrice);
						if (salePrice == NaN) {
							salePrice = 0;
						}
						//折扣价
						item.discountPrice = (salePrice * 100 / 100).toFixed(2);
					})
					arr = e;
				}
                // e.forEach(item => {
                //     item.discount = 100;
                //     item.portfolioProjectId = item.id;
                //     //销售价
                //     let salePrice = item.salePrice;
                //     salePrice = Number(salePrice);
                //     if (salePrice == NaN) {
                //         salePrice = 0;
                //     }
                //     //折扣价
                //     item.discountPrice = (salePrice * 100 / 100).toFixed(2);
                // })
                this.projectData = JSON.parse(JSON.stringify(arr));
            },
            //根据当前人的分组id查询分组项目
            queryProjectData() {
                this.tableLoading = true;
                this.projectData = [];
                // if (this.personInfo && this.projectData) {
                //     this.tableLoading = false;
                //     return;
                // }
                queryProjectDataByGroupIdAndPersonId({
                    groupId: this.personInfo.groupId,
                    personId: this.personInfo.id
                }).then(res => {
                    if (res.success) {
                        this.projectData = res.data;
                        this.projectArr = res.data;
                    }
                }).finally(() => {
                    this.tableLoading = false;
                })
            },
            //套餐选择
            checkCombo() {
                this.chooseComboShow = true;
            },
            setComboData(e) {
                this.comboIdList = JSON.parse(JSON.stringify(e));
                let comIds = "";
                this.comboIdList.forEach(item => {
                    comIds += "," + item.id;
                })
                comIds = comIds.substring(1);
                if (comIds && comIds.length > 0) {
                    //根据套餐信息查询对应的项目信息
                    this.getTComboItemData(comIds);
                }
            },
            getTComboItemData(id) {
                this.tableLoading = true;
                this.projectData = [];
                //加载套餐项
                getComboItemByComboId({comboId: id}).then(res => {
                    if (res.success) {
                        this.projectData = res.data;
                    } else {
                        this.$Message.error("加载失败");
                    }
                }).finally(() => {
                    this.tableLoading = false;
                })
            },
            clearProjectData() {
                this.projectData = [];
            },
            getProjectData() {
                return this.projectData;
            }
        },
        watch: {
            personInfo(val) {
                if (val) {
                    if (this.personInfo.groupId && this.personInfo.id) {
                        this.queryProjectData();
                    }
                }
            },
            projectDataInfo(val) {
                if (val) {
                    this.projectData = val;
                    this.arr = val;
                }
            }
        }
    }
</script>

<style lang="less">
    .healthCheckup {
        .ivu-alert-left {
            text-align: left;
            padding: 8px;
            font-weight: bold;
            height: 25px;
            line-height: 25px;
            box-sizing: content-box;
            font-size: 15px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            margin-bottom: 20px !important;
        }
    }
</style>
