<template>
  <Drawer title="套餐选择" :mask-closable="false" v-model="show" width="520" inner class="chooseCombo">
    <Alert class="alert">套餐列表</Alert>
    <Card class="card">
<!--      <Row style="margin-bottom: 10px;">-->
<!--        <RadioGroup v-model="searchForm.type" @on-change="getDataList" style="margin-top: 10px;margin-left: 5px;">-->
<!--          <Radio label="职业体检">职</Radio>-->
<!--          <Radio label="健康体检">健</Radio>-->
<!--          <Radio label="从业体检">从</Radio>-->
<!--        </RadioGroup>-->
<!--      </Row>-->
      <Input suffix="ios-search" placeholder="请输入关键字" class="search-input" @input="inputSearchChange" clearable/>
      <!--左侧套餐列-->
      <Scroll :on-reach-bottom="handleReachBottom" v-if="comboData.length>0">
        <RadioGroup class="radio-group" v-model="isRadioChecked" v-if="comboData.length>0">
          <Row :gutter="10" class="row-border" v-for="(item,index) in comboData" :key="index" @click.native="radioChooseClick(item)">
            <Col :span="4" class="radio-group-radio">
              <Radio :label="item.id"></Radio>
            </Col>
            <Col :span="20" class="radio-group-content">
              {{ item.name }}
            </Col>
          </Row>
        </RadioGroup>
      </Scroll>
      <div class="empty" v-else>暂无数据</div>
      <Spin fix v-if="comboLoading"></Spin>
    </Card>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="show = false">关闭</Button>
      <Button type="primary" @click="handSubmit">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import {queryTComboList} from '@/api/healthy/tCombo'

export default {
  name: "chooseCombo",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    comboId: {
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
      show: this.value,
      isRadioChecked: "",
      comboData: [],
      comboLoading: false,
      searchForm: {
        name: '',
        pageNumber: 1,
        pageSize: 20
      }
    }
  },
  methods: {
    //下拉加载更多
    handleReachBottom() {
      this.searchForm.pageNumber = this.searchForm.pageNumber + 1;
      this.getDataList("scroll");
    },
    //套餐查询
    inputSearchChange(e) {
      this.searchForm.name = e;
      this.getDataList();
    },
    //radio切换
    radioChooseClick(item) {
      this.isRadioChecked = item.id;
    },
    handSubmit() {
      this.$emit('handleSearch', this.isRadioChecked);
      this.closeModal(false);
    },
    //获取comboData
    getDataList(type) {
      if (type != 'scroll') {
        this.comboData = [];
        this.isRadioChecked = "";
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 20;
      }
      this.comboLoading = true;
      queryTComboList(this.searchForm).then(res => {
        if (res.success) {
          if (type == 'scroll') {
            this.comboData = this.comboData.concat(res.data.records)
          } else {
            this.comboData = res.data.records;
          }
          this.isRadioChecked = this.comboId;
        } else {
          this.$Message.error(res.msg);
        }
      }).finally(() => {
        this.comboLoading = false;
      })
    },
    closeModal(val) {
      this.$emit('input', val);
    },
  },
  watch: {
    value(val) {
      this.show = val;
    },
    show(val) {
      if (val) {
        this.searchForm.type = this.physicalType;
        this.getDataList();
      } else {
        this.closeModal(val);
      }
    }
  }
}
</script>

<style lang="less">
.chooseCombo {
  .radio-group {
    width: 100%;
    overflow: hidden;

    .row-border {
      padding-top: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #d0d0d0;

      .radio-group-radio {
        padding-left: 10px !important;

        .ivu-radio-group-item {
          font-size: 0 !important;
        }
      }

      .radio-group-content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
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

  .ivu-scroll-container {
    height: calc(100vh - 300px) !important;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 10px;
    }

    .ivu-scroll-loader {
      position: relative;
      bottom: -30px;
    }
  }
}
</style>
