<template>
  <div>
    <Poptip width="400" transfer>
      <div slot="content">
        <Table :data="registerNode" border :columns="columns"></Table>
      </div>
      <Button type="primary" size="small">
        <Icon type="ios-eye-outline"/>
        查看
      </Button>
    </Poptip>
  </div>

</template>
<script>
    import * as jobGroup from '@/api/share/datax-executor'
    export default {
        props: {
            jobGroupId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                registerNode: [],
                columns: [
                    {
                        title: '执行器名称',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        key: 'title',
                        minWidth: 100
                    },
                    {
                        title: '分组标识',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        minWidth: 100,
                        key: 'appName'
                    },
                    {
                        title: '机器地址',
                        align: 'center',
                        ellipsis: true,
                        tooltip: true,
                        minWidth: 100,
                        key: 'addressList'
                    },
                ]
            }
        },
        created() {
            this.loadById(this.jobGroupId)
        },
        methods: {
            loadById(id) {
                jobGroup.loadById(id).then(response => {
                    this.registerNode = []
                    const {content} = response
                    this.registerNode.push(content)
                })
            }
        }
    }
</script>
