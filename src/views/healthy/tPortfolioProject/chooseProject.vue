<template>
  <Drawer :title="drawerTitle" :mask-closable="false" v-model="show" width="622" inner class="chooseProject">
    <Form :label-width="54" @keydown.native.enter.prevent="getDataList" ref="searchForm">
      <Row style="margin-bottom: 10px;">
        <Col span="19" style="display: flex;align-items: center;">
          <h4 style="white-space: nowrap;margin-right: 4px;">关键字：</h4>
          <Input suffix="ios-search" placeholder="请输入关键字" v-model="searchForm.keyword" clearable/>
          <h4 style="white-space: nowrap;margin-left: 5px;margin-right: 5px;">所属科室：</h4>
          <Select v-model="searchForm.officeId" placeholder="请选择" clearable>
            <Option v-for="(item,index) in officeData" :value="item.id" :key="index">
              {{ item.sectionName }}
            </Option>
          </Select>
        </Col>
        <Col span="5" style="text-align: right;">
          <Button type="primary" @click.native="itemSearchClick">
            <Icon type="ios-search"/>
            查询
          </Button>
        </Col>
      </Row>
    </Form>
    <div>
      <div>
        <Alert show-icon>
          已选择
          <span class="select-count">{{ selectList.length }}</span> 项
          <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
      </div>
      <div>
        <Table :loading="loading" border :columns="columns" sortable="custom" :data="data" ref="table"
               @on-select-all-cancel="handleCancelSelectAll" :max-height="tableMaxHeight"
               @on-select-all="handleSelectAll" @on-select="handleSelect" @on-select-cancel="handleCancel">
        </Table>
      </div>
      <Row type="flex" justify="end" class="page">
        <Page :current="searchForm.pageNumber" :total="total"
              :page-size="searchForm.pageSize"
              @on-change="changePage" @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50]"
              size="small" show-total show-elevator show-sizer></Page>
      </Row>
    </div>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="show = false">关闭</Button>
      <Button type="primary" @click="handSubmit">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import {queryTBaseProjectList} from '@/api/healthy/tBaseProject'
import {getAllSectionOffice} from "@/api/healthy/tSectionOffice"
const uniqBy = require("lodash.uniqby");
const remove = require("lodash.remove");
const differenceBy = require("lodash.differenceby");
export default {
  name: "chooseProject",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    TOfficeId: {
      type: String
    },
    drawerTitle: {
      type: String
    },
    checkedList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      show: this.value,
      searchForm: {
        keyword: "",
        officeId: "",
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      data: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '名称',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'name',
          sortable: false,
          minWidth: 150
        },
        {
          title: '简称',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'shortName',
          sortable: false,
          minWidth: 150
        },
        {
          title: '项目代码',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'code',
          sortable: false,
          minWidth: 100
        },
      ],
      loading: false,
      radioValue: "当前科室",
      selectList: [],
      tableMaxHeight: 200,
      officeData: [],

    }
  },
  methods: {
    itemSearchClick() {
      this.getDataList();
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },

    handleCancel(selection, row) {
      //监听取消选中某一项，从已选项中删除取消项，row代表取消选择的项数据
      remove(this.selectList, n => {
        return n.id === row.id;
      });
    },
    handleSelect(selection, row) {
      //监听选中某一项，添加到已选项
      this.selectList.push(row);
    },
    handleSelectAll(selection) {
      //监听全选，有可能用户先单独选择了某几项，被我们push进去，然后再点了全选，因此数组合并需要去重一下
      this.selectList = uniqBy(this.selectList.concat(selection), "id");
    },
    handleCancelSelectAll(selection) {
      //监听取消全选，从已选项中移除当页数据
      this.selectList = differenceBy(this.selectList, this.data, "id");
    },
    //改变页码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    //改变每页显示数据的条数
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    initForm() {
      this.searchForm = {
        keyword: "",
        officeId: "",
        pageNumber: 1,
        pageSize: 10
      }
    },
    handSubmit() {
      this.$emit('handleSearch', this.selectList);
      this.closeModal(false);
    },
    closeModal(val) {
      this.$emit('input', val);
    },
    onInputChange(e) {
      this.getDataList();
    },
    getDataList() {
      this.loading = true;
      queryTBaseProjectList(this.searchForm).then(res => {
        if (res && res.success) {
          this.loading = false;
          this.data = res.data.records;
          this.total = res.data.total;
          this.updateChecked();
        }
      }).finally(() => {
        this.loading = false
      });
    },
    //把源数据加上_checked字段，遍历已选项数据，更新选中状态
    updateChecked() {
      for (var i = 0; i < this.data.length; i++) {
        this.data[i]._checked = false;
        for (var j = 0; j < this.selectList.length; j++) {
          if (this.selectList[j].id === this.data[i].id) {
            this.data[i]._checked = true;
          }
        }
      }
    },
  },
  watch: {
    value(val) {
      this.show = val;
    },
    show(val) {
      this.initForm();
      if (val) {
        // 计算高度
        let height = document.documentElement.clientHeight;
        this.maxHeight = Number(height - 100) + "px";
        this.tableMaxHeight = Number(height - 350);
        window.onresize = () => {
          // 计算高度
          let height = document.documentElement.clientHeight;
          this.tableMaxHeight = height - 350;
        };
        this.loading = true;
        this.searchForm.officeId = this.TOfficeId;
        this.radioValue = "当前科室";
        this.selectList = JSON.parse(JSON.stringify(this.checkedList));
        getAllSectionOffice().then(res => {
          if (res.success) {
            this.officeData = res.data;
          }
        });
        this.getDataList();
      } else {
        this.closeModal(val);
      }
    }
  }
}
</script>

<style lang="less">
.chooseProject {
  .ivu-drawer-mask, .ivu-drawer-wrap {
    z-index: 99999 !important;
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
