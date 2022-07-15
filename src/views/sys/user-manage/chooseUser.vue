<template>
  <Drawer title="用户选择" :mask-closable="false" v-model="show" width="700" inner class="chooseUser">
    <Row>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" @keydown.enter.native="handleSearch">
        <FormItem label="用户名" prop="nickname">
          <Input type="text" v-model="searchForm.nickname" clearable placeholder="请输入用户名" style="width: 150px"/>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input type="text" v-model="searchForm.mobile" clearable placeholder="请输入手机号" style="width: 150px"/>
        </FormItem>
        <FormItem label="性别" prop="sex">
          <dict dict="sex" v-model="searchForm.sex" style="width: 150px"/>
        </FormItem>
        <FormItem label="登录账号" prop="username">
          <Input type="text" v-model="searchForm.username" clearable placeholder="请输入登录账号" style="width: 150px"/>
        </FormItem>
        <FormItem style="margin-left: -35px" class="br">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleReset">重置</Button>
        </FormItem>
      </Form>
    </Row>
    <div>
      <div>
        <Alert show-icon>
          已选择
          <span class="select-count">{{ selectList.length }}</span> 项
          <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
      </div>
      <div>
      <Table :loading="loading" border :columns="isMultiple ? columns1 : columns2" sortable="custom" :data="data" ref="table"
               @on-select-all-cancel="handleCancelSelectAll" :max-height="tableMaxHeight"
               @on-select-all="handleSelectAll" @on-select="handleSelect" @on-select-cancel="handleCancel">
        </Table>
      </div>
      <Row type="flex" justify="end" class="page">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage"
              @on-page-size-change="changePageSize" size="small" show-total show-elevator transfer></Page>
      </Row>
    </div>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="show = false">关闭</Button>
      <Button type="primary" @click="handSubmit">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import dict from "@/views/my-components/scmt/dict";
import remove from "lodash.remove";
import uniqBy from "lodash.uniqby";
import differenceBy from "lodash.differenceby";
import {getUserListData} from "../../../api";

export default {
  name: "chooseUser",
  components: {dict},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    checkedList: {
      type: Array,
      default: []
    },
    isMultiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.value,
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      selectList: [],
      tableMaxHeight: 200,
      loading: false,
      columns1: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "登录账号",
          key: "username",
          minWidth: 125,
          sortable: true,
        },
        {
          title: "用户名",
          key: "nickname",
          minWidth: 125,
          sortable: true,
        },
        {
          title: "手机",
          key: "mobile",
          minWidth: 125,
          sortable: true,
        },
        {
          title: "性别",
          key: "sex",
          width: 70,
          align: "center",
        },
      ],
      columns2: [
        {
          title: '#',
          align: 'center',
          key: 'checkBox',
          render: (h, params) => {
            return h('div', [
              h('Checkbox', {
                props: {
                  value: params.row.checkBox
                },
                on: {
                  'on-change': (e) => {
                    this.data.forEach((items) => {      //先取消所有对象的勾选，checkBox设置为false
                      this.$set(items, 'checkBox', false)
                    });
                    this.selectList = [];
                    if (e) {
                      this.data[params.index].checkBox = e;  //再将勾选的对象的checkBox设置为true
                      this.selectList.push(params.row);
                    }
                  }
                }
              })
            ])
          }
        },
        {
          title: "登录账号",
          key: "username",
          minWidth: 125,
          sortable: true,
        },
        {
          title: "用户名",
          key: "nickname",
          minWidth: 125,
          sortable: true,
        },
        {
          title: "手机",
          key: "mobile",
          minWidth: 125,
          sortable: true,
        },
        {
          title: "性别",
          key: "sex",
          width: 70,
          align: "center",
        },
      ],
      data: [],
      total: 0
    }
  },
  methods: {
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    handleReset() {
      this.searchForm = {};
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    handleCancel(selection, row) {
      //监听取消选中某一项，从已选项中删除取消项，row代表取消选择的项数据
      this.selectList = remove(this.selectList, n => {
        return n.id == row.id;
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
    closeModal(val) {
      this.$emit('input', val);
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
    getDataList() {
      // 多条件搜索用户列表
      this.loading = true;
      this.searchForm.type = "";
      this.searchForm.id = "";
      getUserListData(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.data.content;
          this.total = res.data.totalElements;
          this.updateChecked();
        }
      });
    },
    //把源数据加上_checked字段，遍历已选项数据，更新选中状态
    updateChecked() {
      for (var i = 0; i < this.data.length; i++) {
        this.data[i]._checked = false;
        for (var j = 0; j < this.selectList.length; j++) {
          if (this.selectList[j].id === this.data[i].id) {
            this.data[i]._checked = true;
            this.data[i].checkBox = true;
          }
        }
      }
    },
    handSubmit() {
      this.$emit('handleSearch', this.selectList);
      this.closeModal(false);
    }
  },
  watch: {
    value(val) {
      this.show = val;
    },
    show(val) {
      if (val) {
        this.searchForm = {
          pageNumber: 1,
          pageSize: 10,
          type: "",
          id: ""
        };
        // 计算高度
        let height = document.documentElement.clientHeight;
        this.maxHeight = Number(height - 100) + "px";
        this.tableMaxHeight = Number(height - 350);
        this.selectList = JSON.parse(JSON.stringify(this.checkedList));
        this.getDataList();
      } else {
        this.closeModal(val);
      }
    }
  }
}
</script>

<style lang="less">
.chooseUser {
  .ivu-drawer-mask, .ivu-drawer-wrap {
    z-index: 9999 !important;
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
