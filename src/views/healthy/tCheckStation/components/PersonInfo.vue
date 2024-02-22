<template lang="pug">
Card.person-info(
  style="position: relative"
)
  Form(
    :label-width="82"
    class="tCheckStationForm"
  )
    Row(
      v-show="showInfo"
    )
      //- 人员图像
      Col(
        :span="3"
        style="flex: 0 0 150px; max-width: unset"
      )
        .pic(
          style="width: 150px"
        )
          .pic-box(
            style="margin-right: 0"
          )
            img(
              v-if="info.avatar"
              style="width: 100%; height: 100%"
              :src="imgSrc"
              v-viewer
            )
            img(
              v-else
              style="width: 100%, height: 100%; padding: 5px"
              src="../../../../assets/user-avatar.png"
            )

      Col(
        :span="21"
        class="form"
        style="max-width: calc(100% - 150px); justify-content: flex-start"
      )
        //- 体检流程
        Row(
          style="display: flex; align-items: center"
        )
          Col(
            :span="24"
          )
            step(
              :index="2"
            )

        Row(
          style="margin-top: 10px"
        )
          Col(
            v-for="item of infoCols"
            :key="item.label"
            :span="item.span"
          )
            form-item(
              :label="item.label"
            ) 
              Tooltip(
                v-if="item.tooltip"
                :content="item.content"
                v-bind="item.tooltip"
              ) {{  item.content }}

              span(
                v-else
              ) {{ item.content }}

    //- 添加操作按钮
    div(
      v-if="$slots['buttons']"
      :style="`display: flex; margin-top: ${showInfo ? 10: 0}px`"
    )
      slot(
        name="buttons"
      )

        


</template>

<script>
import step from "../../../../components/healthy/step";
export default {
  components: {
    step,
  },
  props: {
    personInfo: Object,
    showInfo: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    info() {
      const entries = Object.entries(Object.assign({}, this.personInfo));
      return entries.length
        ? entries.reduce((o, [k, v]) =>
            Object.assign(
              o,
              {
                [k.replace(/_(\w)/g, (s) => s.slice(1).toUpperCase())]: v,
              },
              {}
            )
          )
        : {};
    },
    // 头像地址
    imgSrc() {
      const { avatar } = this.info;

      if (avatar.indexOf("/dcm") === -1) {
        return "data:image/png;base64," + avatar;
      }

      return avatar;
    },

    // 展示项
    infoCols() {
      const { age, physicalType, oldGroupId ,sporadicPhysical} = this.info;
      return [
        {
          label: "体检编号",
          prop: "testNum",
        },
        {
          label: "身份证号",
          prop: "idCard",
        },
        {
          label: "姓名",
          prop: "personName",
        },
        {
          label: "性别",
          prop: "sex",
        },
        {
          label: "民族",
          prop: "nation",
          visiable: this.personInfo.physicalType === "从业体检",
        },
        {
          label: "年龄",
          content: age ? age + "岁" : "",
        },
        {
          label: "体检类型",
          prop: "physicalType",
        },
        {
          label: "危害因素",
          prop: "hazardFactorsText",
          visiable: ["职业体检", "放射体检"].some((t) => physicalType === t),
        },
        {
          label: "检查种类",
          prop: "workStateText",
          visiable: ["职业体检", "放射体检"].some((t) => physicalType === t),
        },
        {
          label: "订单类型",
          content: sporadicPhysical  == 0? "团单" : "个单",
          visiable: physicalType === "健康体检",
        },
        {
          label: "单位名称",
          prop: "unitName",
          visiable: ["职业体检", "放射体检", "健康体检"].some(
            (t) => physicalType === t
          ),
        },
        {
          label: "职业病",
          prop: "occupationalDiseases",
          tooltip: {
            transfer: true,
            maxWidth: 200,
          },
          visiable: ["职业体检", "放射体检"].some((t) => physicalType === t),
        },
        {
          label: "职业禁忌证",
          prop: "occupationalTaboo",
          tooltip: {
            transfer: true,
            maxWidth: 200,
          },
          visiable: ["职业体检", "放射体检"].some((t) => physicalType === t),
        },
        {
          label: "登记时间",
          prop: "registDate",
        },
      ]
        .filter((i) => i.visiable === void 0 || i.visiable)
        .map((i) =>
          Object.assign(i, {
            content: i.content ?? this.info[i.prop],
            span: i.span ?? 6,
          })
        );
    },
  },
};
</script>

<style lang="less" scoped>
.person-info {
  /deep/ .ivu-form-item-label {
    text-align: justify;
    text-align-last: justify;
  }

  .pic {
    width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
