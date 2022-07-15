<template>

  <Modal v-model="show" title="预览" class="previewTemplate" :mask-closable="false">
    <iframe id="printPdf" :src="previewHtmlUrl" frameborder="0" style="width: 100%; height: 100%" class="pdfTemplate"></iframe>

<!--    <div class="pdfTemplate">-->
<!--      <pdf ref="pdf" id="printPdf" v-for="i in numPages" :key="i" :src="previewHtmlUrl" :page="i"></pdf>-->
<!--    </div>-->
    <div slot="footer">
      <Button type="text" @click="show=false">取消</Button>
<!--      <Button type="primary" :loading="loading" @click="print()">打印</Button>-->
<!--      <Button type="primary" :loading="loading" @click="downloadTemplate()">下载</Button>-->
    </div>
    <Spin fix v-show="loading">
      <div class="demo-spin-icon-load">
        <!-- 这里用的是阿里图标库 -->
        <i class="iconfont icon-loader--line"></i>
      </div>
      <!-- <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon> -->
      <div style='font-size:16px' >Loading...</div>
    </Spin>
  </Modal>
</template>

<script>
import {getTemplatePreviewData, exportTemplate} from '@/api/healthy/tTemplate'
import {formartDate} from "@/api/tools/tool";

import pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'
import {queryTPastMedicalHistoryList, queryTSymptomList,queryTCareerHistoryList} from "../../../api/healthy/tGroupPerson";
import {getTInspectionRecordByPersonId} from "../../../api/healthy/tInspectionRecord";
import {queryTReviewRecordList} from "../../../api/healthy/tReviewRecord";

export default {
  name: "previewTemplate",
  components: {
    pdf
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    TTemplateId: {
      type: String
    },
    personInfo: {
      type: String
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      show: this.value,
      previewHtml: "",//预览显示
      previewHtmlUrl: "",
      numPages: null, // pdf 总页数
      loading: false,
      printName: '转图片打印',
    }
  },
  methods: {
    init() {
      if (this.TTemplateId == undefined || this.TTemplateId == null || this.TTemplateId.length == 0) {
        this.$Message.error('参数为空，请联系管理员');
        return;
      }
      this.loading = true;
      this.previewHtmlUrl = "";
      let _this = this;
      let templateData = {};
      let oldTime = (new Date()).getTime();
      let time1 = formartDate(oldTime, "yyyy年MM月dd日");
      templateData.date = time1;
      templateData.name = '王伟';
      let tableMonitoring=[];
      tableMonitoring.push({monitorName:"1、白细胞数目(WBC)",value:"11",resultTips:"高于",referenceRange:"4.00-10.00",unit:"10^9/L"});
      tableMonitoring.push({monitorName:"2、中性粒细胞百分比(Neu%)",value:"10",resultTips:"低于",referenceRange:"40.0-75.0",unit:"%"});
      tableMonitoring.push({monitorName:"3、淋巴细胞百分比(Lym%)",value:"30 ",resultTips:"合格",referenceRange:"20.0-50.0",unit:"%"});
      let base64img="iVBORw0KGgoAAAANSUhEUgAAABsAAAAgCAYAAADjaQM7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzQyMjcyQTk1M0ZFMTFFQjk3M0U5RkVENjUxNjZGMzgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzQyMjcyQTg1M0ZFMTFFQjk3M0U5RkVENjUxNjZGMzgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTJDNTBFMEE1M0Y4MTFFQkIzMjI5NUFEQ0MwOUI2NjYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTJDNTBFMEI1M0Y4MTFFQkIzMjI5NUFEQ0MwOUI2NjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz78un86AAAC2ElEQVR42rRWPWtUURDd9/atJnFhXTBqjCjiF/GjEEQIErHQTkQECwULQbDSQgURCy1V3CKgIiIWFiKW+hf8ATYWFsEogusWaxQ1m82+dz0j55LZ6/sM64Vh3p07c8+cmdn31jPGlIqs3Y3vB6AuQV6+u1J7VSTWKwIGoFGoljLtA+DbvPF+qdh67OyfFwn2C7CagDrhmCdgP/4/mD1LsD8YKBiyn4Taz+17yFXIG+434vzsIJnZXoWQwxiKBmQKz23apwcChqxPQu1RprZ6nqeuw+/GIJg9VM9lyCST2Aw1rs5uwTaybDAEX4Za55j32mPHHmSV008BqkDdjjnaYgcj5uw84saWw+wmpBJj3069PiFuutDrirX/lRAzAzkFuQM5muCzDdM6k5fZ/RTGWyGvU4BkPc1VRrCSnpxLuegaZCfkNH93cesQ7pkqxUxQ1stWrx7Kc5fPL3BhA3pDgu8TJhXPDMEHoY6kgJXhc4G+x6BGU3x3wOdMWhmvZ33/II9wyWf2rZLhfzENrJnzXTme06+d1jP53P+Q7xTPiv1nWFoR5CN/q0tl2XVvrsgl8m4cUol0MTAd1fMS9sk9yAkmvarz7THMvWUgpf8AkK4GtUvAbRJZYCPsj0zdCrIKnZ4Lw98QQfgkbcDFxgXVPfOUTRxrBKhTfkIkqy7PPae0ktRa+rYAMsd/YcYF8xSglGUNZBMBmvxADvPSCpnpGNs/mbxvtI8xZjaL2SruhcUi5Av9VhIsILAk1qMs0N8OkMRVVZn7mGlpsj+rIR1etMjLOqp0kVPKKhMaUqOv+/oPmD2YZXCN/aiqwIhxkcracC+JfeWwhMqvj5nvAHoMbDHrMrMO1JT2yNRnX3sEMPT31TD9TSxQl/vOs2Zss58nYIcXL6iLbVJGsTaKmQkcID8GtKRYhaqMlqGn2EWKjXH6GgUJQGWHYdnpkbWHyq/CUmqwvvVHgAEACz3fQ6YN8joAAAAASUVORK5CYII=";
      templateData.barCodeImg = base64img;
      templateData.tableMonitoring = tableMonitoring;
      let imgList=[];
      imgList.push({img:base64img});
      imgList.push({img:base64img});
      templateData.imgList = imgList;
      let goods=[];
      goods.push({department:"B超",address:"体检楼2楼301",items:"肾B超、肝脾B超"});
      goods.push({department:"血常规",address:"体检楼2楼301",items:"血常规"});
      goods.push({department:"尿常规",address:"体检楼2楼301 ",items:"尿常规"});
      templateData.goods = goods;

      getTemplatePreviewData({
        id: _this.TTemplateId,
        templateData: JSON.stringify(templateData)
      }).then(res => {
        _this.loading = false;
        if (res && res.success) {
          _this.previewHtml = res.data;
          let url = window.location.protocol + "//" + window.location.host + "/tempFileUrl" + _this.previewHtml;
          _this.previewHtmlUrl = url;
        } else {
          _this.loading = false;
          _this.$Message.error('预览请求失败');
        }
      });
    },

    closeModal(val) {
      this.$emit('input', val);
    },
    downloadTemplate() {
      let fileName = "模板文件.docx";
      exportTemplate({id: this.TTemplateId}).then(res => {
        let content = res;
        let blob = new Blob([content], {type: 'application/ms-excel'});
        if ('download' in document.createElement('a')) { // 非IE下载
          let elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      }).catch(function (error) {
        _this.$Message.error('数据导出失败');
      });

    },
    //vue-pdf 自带打印
    print() {
      this.$refs.pdf[0].print()
    },
    // 转图片打印
    toImg() {
      html2canvas(this.$refs.printContent[0], {
        backgroundColor: null,
        useCORS: true,
        windowHeight: document.body.scrollHeight
      }).then((canvas) => {
        let url = canvas.toDataURL()
        printJS({
          printable: url,
          type: 'image',
          documentTitle: this.printName
        })
        // console.log(url)
      })
    },
  },
  watch: {
    value(val) {
      this.show = val;
    },
    show(val) {
      if (val) {
        this.init();
      } else {
        this.closeModal(false)
      }


    }
  }
}
</script>

<style lang="less">
.previewTemplate {
  .ivu-modal {
    width: 60vw !important;
  }

  .ivu-modal-body {
    height: 70vh;
    /*overflow-y: auto;*/
    background-color: #e8eaec;
  }

  .pdfTemplate {
    span {
      margin-bottom: 10px;
    }
    ::-webkit-scrollbar {
      width: 6px;
      background-color: #d8d8d8;
    }

    /* 滚动槽 */

    ::-webkit-scrollbar-track {
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #bfc1c4;
    }
  }
  /* 旋转效果 */
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50% { transform: rotate(180deg);}
    to { transform: rotate(360deg);}
  }
  /* 遮罩 */
  /* 假如内容过长，一屏放不下，滚动条下拉覆盖不全 */
  .ivu-spin-fix {
    position: absolute;
    top:0;
    left: 0;
    z-index: 8;
    width: 100%;
    height:100%;
    background-color: hsla(0,0%,100%,.8);
  }
}
</style>
