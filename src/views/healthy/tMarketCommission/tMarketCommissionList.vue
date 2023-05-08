<style lang="less">
    .tMarketCommission {
        height: 100%;
        padding: 10px;
        box-sizing: border-box;

    }
</style>
<template>
    <div class="tMarketCommission">
        <Card>
            <!--查询表单-->
            <Form ref="tComboForm" :label-width="80">
                <Row>
                    <Col span="4">
                        <FormItem label="编号">
                            <Input placeholder="请输入"
                                   clearable
                            />
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem label="订单类型">
                            <Select clearable>
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
                        <FormItem label="签订时间">
                            <DatePicker format="yyyy-MM-dd"
                                        type="daterange"
                                        clearable
                                        style="width:100%;"
                                        placeholder="请选择"
                            ></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="4" v-if="drop">
                        <FormItem label="交付时间">
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
    </div>
</template>
<script>
    export default {
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
                data: []
            }
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
            //字段列
            getColumns() {
                return [
                    {
                        type: 'index',
                        key: "index",
                        width: 80,
                        align: 'center'
                    }, {
                        title: '状态',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 80,
                        key: 'name'
                    }, {
                        title: '体检分类',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '名称',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 80,
                        key: 'name'
                    }, {
                        title: '销售人员',
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
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '预检人数',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '实检人数',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '增项金额',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '超限金额',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '复检金额',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '弃检金额',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '退费金额',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '原价金额',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '折扣金额',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        key: 'name'
                    }, {
                        title: '实收金额',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        fixed: 'right',
                        key: 'name'
                    }, {
                        title: '提成',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 80,
                        fixed: 'right',
                        key: 'name'
                    }, {
                        title: '提成比例',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        fixed: 'right',
                        key: 'name'
                    }, {
                        title: '提成绩效',
                        align: 'center',
                        tooltip: true,
                        ellipsis: true,
                        minWidth: 100,
                        fixed: 'right',
                        key: 'name'
                    }, {
                        title: '操作',
                        align: 'center',
                        slot: "action",
                        fixed: 'right',
                        minWidth: 100
                    }
                ]
            }
        }
    }
</script>
