<template>
  <div class="foot">
    <Row type="flex" justify="space-around" class="foot-item">
      <a class="item" href="" target="_blank">{{ $t("docs") }}</a>
<!--      <a class="item" href="" target="_blank">-->
<!--        <Icon custom="iconfont icon-github" size="16" />-->
<!--      </a>-->
      <a class="item" href="" target="_blank">{{
        $t("fullVersion")
      }}</a>
    </Row>
    <Row type="flex" justify="center" class="copyright">
      Copyright © 2019 - Present
      <a href="" target="_blank" style="margin: 0 5px">数智医疗信息技术有限公司</a>
      {{ $t("rights") }}
    </Row>
  </div>
</template>

<script>
export default {
  name: "scmt-footer",
};
</script>

<style lang="less">
.foot {
  width: 100%;
  margin: 48px 0 24px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  .foot-item {
    margin: 0 auto;
    margin-bottom: 1vh;
    width: 60%;
    .item {
      color: rgba(0, 0, 0, 0.45);
    }
    :hover {
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
