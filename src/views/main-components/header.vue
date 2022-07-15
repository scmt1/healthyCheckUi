<template>
  <div>
    <div class="header">
      <img
        src="@/assets/logo.png"
        width="300px"
        v-if="mainTheme == 'darkMode'"
      />
      <img src="@/assets/logo.png" width="300px" v-else />
      <div class="description">{{ $t("xboot") }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "scmt-header",
  computed: {
    // 主题
    mainTheme() {
      return this.$store.state.theme.theme.mainTheme;
    },
  },
};
</script>

<style lang="less">
.header {
  margin-top: 8vh;
  margin-bottom: 5vh;
  text-align: center;

  .description {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    margin-top: 1vh;
  }
}
</style>
