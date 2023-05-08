<template lang="html">
  <div class="cron" :val="value_">
    <Tabs v-model="activeName">
      <TabPane label="秒" name="s">
        <second-and-minute v-model="sVal" lable="秒" />
      </TabPane>
      <TabPane label="分" name="m">
        <second-and-minute v-model="mVal" lable="分" />
      </TabPane>
      <TabPane label="时" name="h">
        <hour v-model="hVal" lable="时" />
      </TabPane>
      <TabPane label="日" name="d">
        <day v-model="dVal" lable="日" />
      </TabPane>
      <TabPane label="月" name="month">
        <month v-model="monthVal" lable="月" />
      </TabPane>
      <TabPane label="周" name="week">
        <week v-model="weekVal" lable="周" />
      </TabPane>
      <TabPane label="年" name="year">
        <year v-model="yearVal" lable="年" />
      </TabPane>
    </Tabs>
    <!-- table -->
    <Table :data="tableData" :columns="columns" size="small" border style="width: 100%;">
    </Table>
  </div>
</template>

<script>
import SecondAndMinute from './component/secondAndMinute'
import hour from './component/hour'
import day from './component/day'
import month from './component/month'
import week from './component/week'
import year from './component/year'
export default {
  components: {
    SecondAndMinute,
    hour,
    day,
    month,
    week,
    year
  },
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      //
      activeName: 's',
      sVal: '',
      mVal: '',
      hVal: '',
      dVal: '',
      monthVal: '',
      weekVal: '',
      yearVal: '',
      columns:[
        {
          title: '秒',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'sVal',
          width: 80,
          sortable: false
        },
        {
          title: '分',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'mVal',
          width: 80,
          sortable: false
        },
        {
          title: '时',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'hVal',
          width: 80,
          sortable: false
        },
        {
          title: '日',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'dVal',
          width: 80,
          sortable: false
        },
        {
          title: '月',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'monthVal',
          width: 80,
          sortable: false
        },
        {
          title: '周',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'weekVal',
          width: 80,
          sortable: false
        },
        {
          title: '年',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          key: 'yearVal',
          width: 80,
          sortable: false
        },
      ]
    }
  },
  computed: {
    tableData() {
      return [
        {
          sVal: this.sVal,
          mVal: this.mVal,
          hVal: this.hVal,
          dVal: this.dVal,
          monthVal: this.monthVal,
          weekVal: this.weekVal,
          yearVal: this.yearVal
        }
      ]
    },
    value_() {
      if (!this.dVal && !this.weekVal) {
        return ''
      }
      if (this.dVal === '?' && this.weekVal === '?') {
        this.$Message.error('日期与星期不可以同时为“不指定”')
      }
      if (this.dVal !== '?' && this.weekVal !== '?') {
        this.$Message.error('日期与星期必须有一个为“不指定”')
      }
      const v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`
      if (v !== this.value) {
        this.$emit('input', v)
      }
      return v
    }
  },
  watch: {
    value(a, b) {
      this.updateVal()
    }
  },
  created() {
    this.updateVal()
  },
  methods: {
    updateVal() {
      if (!this.value) {
        return
      }
      const arrays = this.value.split(' ')
      this.sVal = arrays[0]
      this.mVal = arrays[1]
      this.hVal = arrays[2]
      this.dVal = arrays[3]
      this.monthVal = arrays[4]
      this.weekVal = arrays[5]
      this.yearVal = arrays[6]
    }
  }
}
</script>

<style lang="css">
.cron {
  text-align: left;
  padding: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
</style>
