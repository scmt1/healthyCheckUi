<template>
  <Modal v-model="show" :title="editTitle" :mask-closable="false" class="projectSetting">
    <Tabs type="card" v-if="show">
      <TabPane label="项目参考值">
        <relationProjectReferenceList :TBaseProjectId="TBaseProjectId"></relationProjectReferenceList>
      </TabPane>
      <TabPane label="危急值">
        <relationProjectCriticalList :TBaseProjectId="TBaseProjectId"></relationProjectCriticalList>
      </TabPane>
      <TabPane label="规则">
        <relationProjectRulesList :TBaseProjectId="TBaseProjectId"></relationProjectRulesList>
      </TabPane>
    </Tabs>
    <div slot="footer">
      <Button type="text" @click="show=false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import relationProjectCriticalList from "../relationProjectCritical/relationProjectCriticalList";
import relationProjectRulesList from "../relationProjectRules/relationProjectRulesList";
import relationProjectReferenceList from "../relationProjectReference/relationProjectReferenceList";

export default {
  components: {
    relationProjectCriticalList, relationProjectRulesList, relationProjectReferenceList
  },
  name: "projectSetting",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    TBaseProjectId: {
      type: String
    },
    modalTitle: {
      type: String
    }
  },
  data() {
    return {
      show: this.value,
      editTitle: this.modalTitle,
    }
  },
  methods: {
    closeModal(val) {
      this.$emit('input', val);
    },
  },
  watch: {
    value(val) {
      this.show = val;
    },
    show(val) {
      this.loading = false;
      this.editTitle = this.modalTitle;
      if (val) {
      } else {
        this.closeModal(val);
      }
    }
  }
}
</script>

<style lang="less">
.projectSetting {
  .ivu-modal {
    width: 80vw !important;
  }
}
</style>
