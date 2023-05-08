<template>
  <div>
    <Poptip width="280" transfer>
      <div slot="content" v-html="content"></div>
      <Button type="primary" size="small">
        查看
      </Button>
    </Poptip>
  </div>

</template>
<script>
    import * as job from '@/api/share/datax-job-info'

    export default {
        props: {
            jobCron: {
                type: String,
                default: ''
            },
            msg: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                content: ""
            }
        },
        created() {
            if (this.jobCron) {
                this.nextTriggerTime(this.jobCron)
            }
            if (this.msg) {
                this.content = this.msg;
            }
        },
        methods: {
            nextTriggerTime(corn) {
                job.nextTriggerTime(corn).then(response => {
                    if (response.code == 200) {
                        this.content = response.content.join("<br>")
                    }
                })
            },
        }
    }
</script>
