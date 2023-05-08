<template>
    <div class="healthCheckup">
        <Card style="margin-top: 10px;height: calc(100% - 300px);overflow: auto;">
            <Alert class="ivu-alert-left">
                体检项目
                <span style="display: inline-block;">
                     <Button @click="checkCombo" v-if="(personInfo.isPass == 1 && !isUpdateUnitNameGroup && showSelectButton) || (isUpdateUnitNameGroup && showSelectButton)" type="primary" icon="md-add"
                             size="small">套餐选择</Button>
                    <Button @click="addTPortfolioProject" type="primary" icon="md-add" size="small" v-if="(personInfo.isPass == 1 && !isUpdateUnitNameGroup && showSelectButton) || (isUpdateUnitNameGroup && showSelectButton)">选检项目
                    </Button>
                </span>
            </Alert>
            <Table :loading="tableLoading" border :columns="columns" sortable="custom" show-summary
                   :summary-method="handleSummary"
                   :data="projectData" ref="table" max-height="380">
                <template slot-scope="{ row, index }" slot="action"
                          v-if="personInfo.isPass == 1 && !isUpdateUnitNameGroup && (row.projectType==2 || (physicalType!='职业体检' && physicalType!='放射体检'))">
                    <Button type="error" @click="deleteData(row, index)" :loading="delLoading" size="small">
                        <Icon type="md-trash"></Icon>
                        删除
                    </Button>
                </template>
            </Table>
            <Form :label-width="100" v-if="!typeStatus">
                <Row style="margin-top: 16px;">
                    <Col :xs="{span:24}" :md="{span:11,offset:1}" :lg="{span:7,offset:1}" :xl="{span:5,offset:1}">
                        <FormItem label="必检项折扣：">
                            <InputNumber :min="1" :max="100" v-model="groupData.discount"
                                         @on-change="onDiscountChange"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col :xs="{span:24}" :md="{span:11,offset:1}" :lg="{span:7,offset:1}" :xl="{span:5,offset:1}">
                        <FormItem label="选检项折扣：">
                            <InputNumber :min="1" :max="100" v-model="groupData.addDiscount"
                                         @on-change="onAddDiscountChange"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col :xs="{span:24}" :md="{span:11,offset:1}" :lg="{span:7,offset:1}" :xl="{span:5,offset:1}"
                         style="display: flex;">
                        <FormItem label="优惠价格：">
                            <InputNumber :min="0" v-model="groupData.discountPrice"></InputNumber>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
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
                <div class="explain" v-if="physicalType=='健康体检'">
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
                    <span class="ivu-alert-message" v-if="physicalType=='健康体检'">
                        或执行第四、五、六、七步
                    </span>
                    <span class="ivu-alert-message" v-else>
                        或执行第四、五、六步
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
    import {getTGroupPersonReviewerList, queryProjectDataByGroupIdAndPersonId,queryProjectDataByWorkStateText,queryProjectDataByHazardFactors} from "../../../api/healthy/tGroupPerson";
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
            showSelectButton: {
                type:Boolean,
                default:false
            },
            typeStatus:{
                type:Boolean,
                default:false
            },
            isUpdateUnitName:{
                type:Boolean,
                default:false
            },
            isUpdateUnitNameGroup:{
                type:Boolean,
                default:false
            }
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
                projectDataArray: [],
                choosePortfolioProjectData: [],
                comboIdList: [],
                arr: [],
                delLoading:false,
                projectArr:[],
                //分组数据
                groupData:{
                    id: "",//ID
                    discount: 100,//必检折扣
                    addDiscount: 100,//选检折扣
                    discountPrice: 0,//优惠价格
                    personCount: 1,//分组人数
                    comboId: "",//套餐id
                },
            }
        },
        methods: {
            //团单折扣变化后更新项目折扣
            onDiscountChange(e) {
                //折扣
                let v = Number(e);
                if (v == NaN) {
                    v = 0;
                }
                this.projectData.forEach(item => {
                    if (item.projectType == 1) {
                        item.discount = e;
                        let salePrice = Number(item.salePrice);
                        if (salePrice == NaN) {
                            salePrice = 0;
                        }
                        item.discountPrice = (salePrice * v / 100).toFixed(2);
                    }
                })
                this.sumTotal();
            },
            //增项折扣
            onAddDiscountChange(e) {
                //折扣
                let v = Number(e);
                if (v == NaN) {
                    v = 0;
                }
                this.projectData.forEach(item => {
                    if (item.projectType == 2) {
                        item.discount = e;
                        let salePrice = Number(item.salePrice);
                        if (salePrice == NaN) {
                            salePrice = 0;
                        }
                        item.discountPrice = (salePrice * v / 100).toFixed(2);
                    }
                })
                this.sumTotal();
            },
            //统计价格
            sumTotal() {
                if(!this.groupData){
                    return;
                }
                let num1 = 0, num2 = 0, num3 = 0, num4 = 0, personCount = 0, orderTotal = 0;

                let groupPrice = 0;
                for (let j = 0; j < this.projectData.length; j++) {
                    let data = this.projectData[j];
                    if (data.projectType == 1) {
                        //套餐原价
                        num1 = this.numAdd(Number(data.salePrice), num1, 1);
                        //套餐合计
                        num2 = this.numAdd(Number(data.discountPrice), num2, 1);
                    }
                    //订单原价
                    num3 = this.numAdd(Number(data.salePrice), num3, 1);
                    //订单合计
                    num4 = this.numAdd(Number(data.discountPrice), num4, 1);

                    groupPrice = this.numAdd(Number(data.discountPrice), groupPrice, 1);

                }
                //优惠价 默认值
                this.groupData.discountPrice = this.groupData.discountPrice? this.groupData.discountPrice: groupPrice ;
            },
            //
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
            //复查人员项目信息查询
            queryProjectDataReview(){
                this.tableLoading = true;
                this.projectData = [];
                this.arr = [];
                this.projectData = this.projectDataInfo;
                this.projectArr = [];
                this.tableLoading = false;
            },
            //根据当前人的分组id查询分组项目
            queryProjectData() {
                this.tableLoading = true;
                this.projectData = [];
                this.arr = [];
                // if (this.personInfo && this.projectData) {
                //     this.tableLoading = false;
                //     return;
                // }
                queryProjectDataByGroupIdAndPersonId({
                    groupId: this.personInfo.groupId,
                    personId: this.personInfo.id
                }).then(res => {
                    if (res.success) {
                        this.groupData = res.data;
                        this.projectData = res.data.projectData;
                        this.projectArr = res.data.projectData;
                        this.sumTotal();
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
                let hazardFactorsArry = [];
                let hazardFactorsTextArry = [];
                let careerStageArry = [];
                this.comboIdList.forEach(item => {
                    hazardFactorsArry.push(item.hazardFactors);
                    hazardFactorsTextArry.push(item.hazardFactorsText);
                    careerStageArry.push(item.careerStage);
                    comIds += "," + item.id;
                })
                if(this.physicalType=="职业体检" || this.physicalType=="放射体检"){
                    let arr1 = []; //声明新数组(检查种类去重)
                    for(let i in careerStageArry){
                        if(arr1.indexOf(careerStageArry[i]) == -1){
                            arr1.push(careerStageArry[i]);
                        }
                    }
                    if(arr1 && arr1.length>1){
                        this.$Message.error("所选套餐在岗状态不一致，请重新选择！");
                        return;
                    }else if(arr1 && arr1.length==1){
                        this.$emit('handleSearchCheckup', hazardFactorsArry,hazardFactorsTextArry,arr1);
                    }
                }else{
                    if(this.comboIdList && this.comboIdList.length>0 && this.comboIdList[0].name){
                        this.groupData.name = this.comboIdList[0].name;
                    }
                }
                comIds = comIds.substring(1);
                this.groupData.comboId = comIds;//套餐id
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
                        this.sumTotal();//计算价格
                    } else {
                        this.$Message.error("加载失败");
                    }
                }).finally(() => {
                    this.tableLoading = false;
                })
            },
            clearProjectData() {
                this.projectData = [];
                this.arr = [];
                this.groupData = {
                    id: "",//ID
                    discount: 100,//必检折扣
                    addDiscount: 100,//选检折扣
                    discountPrice: 0,//优惠价格
                    personCount: 1,//分组人数
                    comboId: "",//套餐id
                };
            },
            getProjectData() {
                return this.projectData;
            },

            getGroupData() {
                return this.groupData;
            },
            //根据危害因素以及在岗状态查询
            /*queryProjectDataByHazardFactors() {
                this.tableLoading = true;
                this.projectData = [];
                this.projectDataArray = [];
                this.personInfo.groupId = null;
                if(this.personInfo.physicalType == '放射体检'){
                    queryProjectDataByWorkStateText({
                        workStateText: this.personInfo.workStateText
                    }).then(res => {
                        if (res && res.success && res.data && res.data.combo && res.data.items) {
                            this.projectData = res.data.items;
                            this.projectDataArray = JSON.parse( JSON.stringify(res.data.items));
                            this.comboIdList = res.data.combo;
                            let comIds = "";
                            this.comboIdList.forEach(item => {
                                comIds += "," + item.id;
                            });
                            this.personInfo.comboId = comIds;
                        }
                    }).finally(() => {
                        this.tableLoading = false;
                    }).catch(()=>{
                        this.tableLoading = false;
                    })
                }
                else if(this.personInfo && this.personInfo.hazardFactors && this.personInfo.hazardFactors.trim().length>0 && this.personInfo.workStateText && this.personInfo.workStateText.trim().length>0){

                    queryProjectDataByHazardFactors({
                        hazardFactors: this.personInfo.hazardFactors,
                        workStateText: this.personInfo.workStateText
                    }).then(res => {
                        if (res && res.success && res.data && res.data.combo && res.data.items) {
                            this.projectData = res.data.items;
                            this.projectDataArray = JSON.parse( JSON.stringify(res.data.items));
                            this.comboIdList = res.data.combo;
                            let comIds = "";
                            this.comboIdList.forEach(item => {
                                comIds += "," + item.id;
                            });
                            this.personInfo.comboId = comIds;
                        }
                    }).finally(() => {
                        this.tableLoading = false;
                    }).catch(()=>{
                        this.tableLoading = false;
                    })
                }

            },*/
        },
        watch: {
            personInfo(val) {
                if (val) {
                    if (this.personInfo.groupId && this.personInfo.id) {
                        if(!this.typeStatus){
                            this.queryProjectData();
                        }else{
                            this.queryProjectDataReview();
                        }
                    }
                }
            },
            projectDataInfo(val) {
                if (val) {
                    this.projectData = val;
                    this.arr = val;

                    this.groupData = {
                        id: "",//ID
                        discount: 100,//必检折扣
                        addDiscount: 100,//选检折扣
                        discountPrice: 0,//优惠价格
                        personCount: 1,//分组人数
                        comboId: "",//套餐id
                    }
                    this.projectData = this.projectDataInfo;
                    this.projectArr = this.projectDataInfo;
                    this.sumTotal();
                }
            }
        }
    }
</script>

<style lang="less">
    .healthCheckup {
        padding: 0px;
        box-sizing: border-box;
        height: 100%;
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
