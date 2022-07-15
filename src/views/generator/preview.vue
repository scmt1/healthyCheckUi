<style>
  .tabs {
    margin-top: 40px;
  }
</style>
<template>
  <Tabs type="card" class="tabs">
    <TabPane v-for="(item,index) in data" :key="index" :lazy="true" :label="item.name" :name="item.name">
      <Java :value="item.content" :height="height"/>
    </TabPane>
  </Tabs>
</template>

<script>
    import Java from '@/components/JavaEdit/index'
    import {generator} from '@/api/generator/generator'

    export default {
        name: 'Preview',
        components: {Java},
        data() {
            return {
                data: null,
                height: '',
                activeName: 'Entity'
            }
        },
        created() {
            this.height = document.documentElement.clientHeight - 180 + 'px'
            const tableName = this.$route.params.tableName
            generator(tableName, 1).then(data => {
                if (Object.prototype.toString.call(data) == '[object Array]') {
                    this.data = data
                } else {
                    this.$Message.error(data.msg);
                    return;
                }
            }).catch(() => {
                this.$router.go(-1)
            })
        }
    }
</script>
