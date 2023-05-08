<style lang="less">
    .drawer {
        .content {
            height: calc(100vh - 51px - 73px);
            overflow-y: auto;
            overflow-x: hidden;
            padding-bottom: 10px;


            .search-row {
                flex-wrap: nowrap;
                align-items: center;
                margin-bottom: 20px;
            }
        }

        .demo-drawer-footer {
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            border-top: 1px solid #e8e8e8;
            padding: 10px 16px;
            text-align: right;
            background: #fff;
        }
    }
</style>
<template>
    <Drawer :title="title" :closable="false" v-model="show" width="600" class="drawer">
        <div class="content">
            <Row class="search-row">
                <Input suffix="ios-search" placeholder="请输入关键字" v-if="isSearchPositive" v-model="searchFormPositive.name" @input="onInputChange" clearable
                       @on-clear="onClearChange"></Input>
                <Input suffix="ios-search" placeholder="请输入关键字" v-else v-model="searchForm.content" @input="onInputChange" clearable
                       @on-clear="onClearChange"></Input>
                <Button type="primary" @click="addOfficeTerm" v-if="!isSearchPositive" style="margin-left: 20px;">新增</Button>
            </Row>
            <Table
                    :max-height="tableMaxHeight"
                    :loading="loading"
                    border
                    :columns="columns"
                    sortable="custom"
                    :data="data"
                    @on-row-click="onRowClick"
                    @on-selection-change="onSelectionChange"
            >
                <template slot-scope="{ row, index }" slot="action" v-if="!isSearchPositive">
                    <Button type="primary" @click="updateOfficeTerm(row, index)" :loading="loading" size="small">
                        <Icon type="ios-create-outline"/>
                        修改
                    </Button>
                </template>
            </Table>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="closeModal(false)">关闭</Button>
                <Button type="primary" v-if="isSearchPositive" @click=" handleConfirmPositive">确认</Button>
                <Button type="primary" v-else @click=" handleConfirm">确认</Button>
            </div>
        </div>

        <updateTOfficeTerm v-model="updateShow" :TOfficeTermId="TOfficeTermId" :TOfficeId="officeId" :tType="type" :physicalType="inspectType" :hazardFactors="hazardFactors" :hazardFactorsText="hazardFactorsText"
                           @handSearch="getDataList" :modalTitle="officeTitle"></updateTOfficeTerm>

    </Drawer>
</template>
<script>
    import {queryAllByOfficeId} from "@/api/healthy/tOfficeTerm";
    import {getPositiveResultList} from '@/api/healthy/tPositiveResultList';
    import updateTOfficeTerm from "../tOfficeTerm/updateTOfficeTerm";

    export default {
        components: {
            updateTOfficeTerm
        },
        name: "drawer",
        props: {
            value: {
                type: Boolean,
                default: true
            },
            isSearchPositive: {
                type: Boolean,
                default: false
            },
            modalTitle: {
                type: String,
                default: ""
            },
            type: {
                type: String,
                default: ""
            },
            hazardFactors: {
                type: String,
                default: ""
            },
            hazardFactorsText: {
                type: String,
                default: ""
            },
            inspectType: {
                type: String,
                default: ""
            },
            officeId: {
                type: String,
                default: ""
            },
            physicalType: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                TOfficeTermId: "",//当前术语id

                officeTitle: '',
                updateShow: false,
                show: this.value,
                title: this.modalTitle,
                cType: "",
                offId: "",
                insType: "",
                hazardFact: "",
                loading: false,
                data: [],
                searchForm: {
                    content: "",
                    type: "",
                    hazardFactors: "",
                    inspectType: "",
                    officeId: ""
                },
                searchFormPositive: {
                    name: "",
                    deptId: ""
                },
                columns: this.isSearchPositive ? this.getColumnsPositive() : this.getColumns(),
                tableMaxHeight: 500,
                selectedData: []
            }
        },
        methods: {
            onRowClick(e) {
                this.data.forEach(i => {
                    if (i.id == e.id) {
                        if (i._checked) {
                            this.$set(i, "_checked", false);
                        } else {
                            this.$set(i, "_checked", true);
                        }
                    }
                })
            },
            onClearChange() {
                this.searchForm.content = "";
                this.searchFormPositive.name = "";
                if(this.isSearchPositive){
                    this.getPositiveResults()
                }else{
                    this.getDataList();
                }
            },
            //添加术语
            addOfficeTerm() {
                this.updateShow = true;
                this.officeTitle = "术语添加";
                this.TOfficeTermId = "";
            },
            //修改术语
            updateOfficeTerm(row, index) {
                this.updateShow = true;
                this.officeTitle = "术语修改";
                this.TOfficeTermId = row.id;
            },
            onInputChange(e) {
                if(this.isSearchPositive){
                    this.getPositiveResults()
                }else{
                    this.getDataList();
                }
            },
            //获取CheckBox选中项
            onSelectionChange(rows) {
                if (rows.length > 0) {
                    //全部置为false
                    this.data.forEach(j => {
                        this.$set(j, '_checked', false);
                    })
                    rows.forEach(i => {
                        this.data.forEach(j => {
                            if (i.id == j.id) {
                                this.$set(j, '_checked', true);
                            }
                        })
                    });
                } else {
                    this.data.forEach(j => {
                        this.$set(j, '_checked', false);
                    })
                }
            },
            handleConfirm() {
                let temp = [];
                this.data.forEach(i => {
                    if (i._checked) {
                        temp.push(i.content.replace("\n", ""));
                    }
                })
                this.$emit("getSelectedWords", temp.join(";"), this.cType);
                this.closeModal(false);
            },
            handleConfirmPositive() {
                let temp = [];
                this.data.forEach(i => {
                    if (i._checked) {
                        temp.push(i.name.replace("\n", ""));
                    }
                })
                this.$emit("getSelectedWords", temp.join(";"), this.cType);
                this.closeModal(false);
            },
            handleReset() {
                this.searchForm.content = "";
                this.getDataList();
            },
            getDataList() {
                this.loading = true;
                queryAllByOfficeId(this.searchForm).then(res => {
                    if (res.success) {
                        this.data = res.data;
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            getPositiveResults() {
                this.loading = true;
                getPositiveResultList(this.searchFormPositive).then(res => {
                    if (res.success) {
                        this.data = res.data;
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            closeModal(val) {
                this.$emit('input', val);
            },
            getColumns() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    }, {
                        title: '术语内容',
                        align: 'left',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'content',
                        sortable: false
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 200,
                    }
                ]
            },
            getColumnsPositive() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    }, {
                        title: '术语内容',
                        align: 'left',
                        minWidth: 120,
                        ellipsis: true,
                        tooltip: true,
                        key: 'name',
                        sortable: false
                    }/*,
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 200,
                    }*/
                ]
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.data = [];
                this.title = this.modalTitle;
                this.cType = this.type;
                this.searchForm.type = this.type;
                this.searchForm.hazardFactors = this.hazardFactorsText;
                this.searchForm.inspectType = this.inspectType;
                this.searchForm.officeId = this.officeId;
                this.searchFormPositive.deptId = this.officeId;
                this.searchForm.content = "";

                if (!val) {
                    this.closeModal(val);
                } else {
                    // 计算高度
                    let height = document.documentElement.clientHeight;
                    this.tableMaxHeight = height - 200;
                    window.onresize = () => {
                        // 计算高度
                        let height = document.documentElement.clientHeight;
                        this.tableMaxHeight = height - 200;
                    };
                    if(this.isSearchPositive){
                        this.getPositiveResults();//阳性结果查询
                    }else{
                        this.getDataList();//术语查询
                    }

                }
            }
        }
    }
</script>
