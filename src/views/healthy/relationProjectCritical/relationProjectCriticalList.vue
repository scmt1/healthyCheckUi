<style lang="less">
.relationProjectCriticalList {
}
</style>
<template>
  <div class="relationProjectCriticalList">
    <Card>
      <Row class="operation">
        <Button @click="addRelationProjectCritical" type="primary" icon="md-add">新增</Button>
      </Row>
      <div>
        <Table :loading="loading" border :columns="columns" sortable="custom" :data="data" @on-sort-change="changeSort" ref="table">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" @click="handleLook(row, index)" size="small">
              <Icon type="ios-eye-outline"/>
              查看
            </Button>
            <Dropdown :transfer=true>
              <Button size="small">
                更多操作
                <Icon type="md-arrow-dropdown"/>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="edit" @click.native="handleEdit(row, index)">
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
    </Card>
    <updateRelationProjectCritical v-model="updateShow" :RelationProjectCriticalId="RelationProjectCriticalId" :modalTitle="title"
                                   :baseProjectId="TBaseProjectId" v-on:handleSearch="getDataList"></updateRelationProjectCritical>
  </div>
</template>
<script>
import {deleteRelationProjectCritical, queryRelationProjectCriticalList} from '@/api/healthy/relationProjectCritical'
import updateRelationProjectCritical from './updateRelationProjectCritical'

export default {
  props: {
    TBaseProjectId: {
      type: String
    },
  },
  components: {
    updateRelationProjectCritical
  },
  data() {
    return {
      drop: false,
      selectDate: null,
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      search: '',
      data: [],
      columns: this.getRelationProjectCriticalColumns(),
      openSearch: true,//打开搜索
      openTip: true,//打开提示
      loading: true, // 表单加载状态
      selectCount: 0, // 多选计数
      selectList: [], // 多选数据
      searchForm: {
        baseProjectId:"",
        // 搜索框对应data对象
        startDate: null,//开始时间
        endDate: null,//结束时间
        sort: 'create_time', // 默认排序字段
        order: 'desc' // 默认排序方式
      },
      total: 0,
      title: '',
      RelationProjectCriticalId: '',
      updateShow: false,
      tableHeight: 200,
      colOptions: ["等级", "类型", "区间值", "适合性别", "年龄最低值", "年龄最高值", "操作"],
      colSelect: ["等级", "类型", "区间值", "适合性别", "年龄最低值", "年龄最高值", "操作"],
      csvData: [],
    }
  },
  methods: {
    //新增
    addRelationProjectCritical() {
      this.title = '新增';
      this.updateShow = true
      this.RelationProjectCriticalId = '';
    },
    //编辑
    handleEdit(row, index) {
      this.title = '编辑';
      this.RelationProjectCriticalId = row.id.toString();
      this.updateShow = true;
    },
    //查看
    handleLook(row, index) {
      this.title = '查看';
      this.RelationProjectCriticalId = row.id.toString();
      this.updateShow = true;
    },
    //分页查询
    getDataList() {
      this.loading = true;
      this.searchForm.id = null;
      this.searchForm.baseProjectId = this.TBaseProjectId;

      queryRelationProjectCriticalList(this.searchForm).then(res => {
        if (res && res.success) {
          this.loading = false;
          this.data = res.data;
          this.csvData = JSON.parse(JSON.stringify(res.data));
        }
      }).catch(err => {
        this.loading = false
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
          this.patchdeleteData(ids);
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
          this.patchdeleteData(ids);
        },
        onCancel: () => {
          this.$Message.info('取消了当前的操作行为！');
        }
      });
    },
    //删除（后台）
    patchdeleteData(ids) {
      if (ids == undefined || ids == null || ids.length == 0) {
        this.$Message.error('没有选择的数据');
        return;
      }
      deleteRelationProjectCritical({ids: ids}).then(res => {
        this.userLoading = false;
        this.$Modal.remove();
        if (res && res.success) {
          this.modalTaskVisible = false;
          this.$Message.success('删除成功');
          this.getDataList();
        } else {
          this.$Message.error('删除失败');
        }
      });
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
    handleSearch() {
      this.getDataList();
    },
    //重置
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.startDate = null;
      this.searchForm.endDate = null;
      this.selectDate = null;
      // 重新加载数据
      this.getDataList();
    },
    //获取列表字段
    getRelationProjectCriticalColumns() {
      return [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '等级',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'level',
          sortable: false
        },
        {
          title: '类型',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'type',
          sortable: false
        },
        {
          title: '区间值',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'intervalValue',
          sortable: false
        },
        {
          title: '适合性别',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'allowSex',
          sortable: false
        },
        {
          title: '年龄最低值',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'minAge',
          sortable: false
        },
        {
          title: '年龄最高值',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'maxAge',
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
  },
  mounted() {
    this.getDataList();
  }
}
</script>
<style scoped="less">
.operation {
  margin-bottom: 10px;
}
</style>
