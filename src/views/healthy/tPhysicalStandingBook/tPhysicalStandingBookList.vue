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
            ::-webkit-scrollbar{
                width:0;
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
                    <Input v-model="searchForm.name" suffix="ios-search" @on-change="search" placeholder="请输入关键字" clearable/>
                    <Scroll class="scroll-sty" :on-reach-bottom="handleReachBottom" v-if="unitList.length>0">
                        <RadioGroup class="radio-group" v-model="radioValue">
                            <Row class="row-border" v-for="(item, index) in unitList" :key="item.id" @click.native="radioChooseClick(item)">
                                <Col :span="3" class="radio-group-radio">
                                    <Radio class="label" :label="item.name"></Radio>
                                </Col>
                            </Row>
                        </RadioGroup>
                    </Scroll>
                    <div class="empty" v-else>暂无数据</div>
                </Card>
            </Col>
            <Col span="20">
                <Card>
                    <!--查询表单-->
                    <Form ref="tComboForm" :label-width="80">
                        <Row>
                            <Col span="4">
                                <FormItem label="体检编号">
                                    <Input placeholder="请输入体检编号"
                                           clearable
                                    />
                                </FormItem>
                            </Col>
                            <Col span="4">
                                <FormItem label="性别">
                                    <Select clearable>
                                        <Option value="男">男</Option>
                                        <Option value="女">女</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="4">
                                <FormItem label="体检类型">
                                    <Select clearable>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="4" v-if="drop">
                                <FormItem label="登记状态">
                                    <Select clearable>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="4" v-if="drop">
                                <FormItem label="体检状态">
                                    <Select clearable>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="4" v-if="drop">
                                <FormItem label="总检状态">
                                    <Select clearable>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="4" v-if="drop">
                                <FormItem label="体检日期">
                                    <DatePicker format="yyyy-MM-dd"
                                                type="daterange"
                                                clearable
                                                style="width:100%;"
                                                placeholder="请选择"
                                    ></DatePicker>
                                </FormItem>
                            </Col>
                            <Col style="margin-left: 10px;">
                                <Button type="primary" icon="ios-search">查询</Button>
                                <Button>重置</Button>
                                <a class="drop-down" @click="dropDown">
                                    {{ dropDownContent }}
                                    <Icon :type="dropDownIcon"></Icon>
                                </a>
                            </Col>
                        </Row>
                    </Form>
                    <!--列表-->
                    <Table :loading="loading"
                           border
                           :columns="columns"
                           sortable="custom"
                           :data="data">
                    </Table>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import {queryTGroupUnitList} from '@/api/healthy/tGroupUnit'

    export default {
        name:'tPhysicalStandingBookList',
        data() {
            return {
                drop: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                tComboForm: {
                    name: ""
                },
                loading: false,
                columns: this.getColumns(),
                data: [],
                unitList:[],
                searchKey: "",
                radioValue: "",
                searchForm: {
                    // 搜索框对应data对象
                    name: '',
                    pageNumber: 1, // 当前页数
                    pageSize: 20, // 页面大小
                },
            }
        },
        mounted() {
            this.getUnitData();
        },
        methods: {
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
            //下拉加载更多
            handleReachBottom() {

            },
            radioChooseClick(item) {
                this.radioValue = item.id;
            },
            //搜索单位
            search() {
                this.getUnitData();
            },
            getUnitData() {
                queryTGroupUnitList(this.searchForm).then(res => {
                    if (res.success) {
                        this.unitList = res.data.records;
                    }
                });
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
                        type: 'index',
                        key: "index",
                        width: 80,
                        align: 'center'
                    }, {
                        title: '照片',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 80,
                        key: 'name'
                    }, {
                        title: '体检编号',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 180,
                        key: 'name'
                    }, {
                        title: '单位',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 180,
                        key: 'name'
                    }, {
                        title: '姓名',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '性别',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '体检类型',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 120,
                        key: 'name'
                    }, {
                        title: '电话',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 120,
                        key: 'name'
                    }, {
                        title: '年龄',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '体检日期',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '登记状态',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '体检进度',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '体检状态',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '总检状态',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '打印指引单',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name',
                        fixed:'right'
                    }, {
                        title: '指引单回收',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name',
                        fixed:'right'
                    }, {
                        title: '打印报告单',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 80,
                        key: 'name',
                        fixed:'right'
                    }
                ]
            }
        }
    }
</script>
