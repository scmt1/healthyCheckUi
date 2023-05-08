<template lang="pug">
.uploader
  .uploader-show(v-if="images.length")
    .files
      .files-item(v-for="img of images")
        img.files-item__img(:src="img", v-viewer)
        .files-item__actions(v-if="!viewOnly")
          icon(@click="handleRemove(img)", type="ios-trash-outline")

  .uploader-choose(v-if="showUpload")
    Upload(
      action="#",
      :accept="uploadAccept",
      :before-upload="handleBeforeUpload",
      :show-upload-list="false",
      :multiple="multiple",
      v-loading="uploading"
    )
      Icon(type="ios-add", style="line-height: 0")
</template>

<script>
const acceptTypes = ["jpg", "jpeg"];
const Base64Prefix = "data:image/jpeg;base64,";
import { debounce as _debounce } from "lodash";
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    viewOnly: {
      type: Boolean,
      default: false,
    },
    separator: {
      type: String,
      default: ";",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      uploading: false,
      fileList: [],
      results: [],
      images: [],
    };
  },
  computed: {
    acceptTypes() {
      return;
    },
    uploadAccept() {
      return acceptTypes.reduce((s, i) => `${s}.${i},`, "");
    },
    showUpload() {
      return !this.viewOnly && (!this.images.length || this.multiple);
    },
  },
  watch: {
    value: {
      handler(val) {
        const imgs = val
          .split(this.separator)
          .filter((a) => a)
          .map((i) => (i.includes("tempfile") ? i : Base64Prefix + i));

        if (
          imgs.length === this.images.length &&
          imgs.every((i) => this.images.some((ii) => i === ii))
        )
          return;

        this.images = imgs;
        this.results = imgs.map((img) => {
          const result = this.results.find((r) => img === r.result);

          return result
            ? result
            : {
                id: img,
                result: img,
              };
        });
      },
      immediate: true,
    },

    results(val) {
      this.images = val.map((i) => i.result);
    },

    images(imgs) {
      const formatedImgs = imgs.map((i) => i.replace(Base64Prefix, ""));
      this.$emit(
        "input",
        this.multiple ? formatedImgs.join(";") : formatedImgs[0]
      );
    },
  },
  methods: {
    readFile(file) {
      return new Promise((resolve, reject) => {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            resolve({
              id: file.uid,
              file,
              result: reader.result,
            });
          };

          reader.onerror = (err) => {
            reject(err);
          };
        } catch (err) {
          reject(err);
        }
      });
    },

    validateFile(file) {
      const fileExt = file.name.split(".").pop().toLocaleLowerCase();

      return acceptTypes.some((t) => fileExt === t);
    },

    async readFileList(files) {
      this.uploading = true;
      if (files.every(this.validateFile)) {
        const res = await Promise.all(files.map((file) => this.readFile(file)));
        this.results.push(...res);
      } else {
        this.$Notice.warning({
          title: "文件类型错误",
          desc: "附件格式不正确，请选择图片格式！",
        });
      }
      this.uploading = false;
    },

    dobunceReadFileList: _debounce(function (files) {
      return this.readFileList(files);
    }, 500),

    async handleBeforeUpload(file) {
      this.fileList.push(file);

      this.dobunceReadFileList(this.fileList);

      return false;
    },

    handleRemove(img) {
      const result = this.results.find((i) => img === i.result);

      if (result) {
        this.results = this.results.filter((i) => result !== i);
        this.fileList = this.fileList.filter((i) => result.id !== i.uid);
      } else {
        this.images = this.images.filter((i) => img !== i);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.uploader {
  position: relative;
  display: flex;
  flex-wrap: no-wrap;

  &-show,
  &-choose {
    height: 60px;
  }

  &-progress {
    position: absolute;
    width: 100%;
    height: 32px;
  }

  &-show {
    position: relative;
  }

  &-choose {
    flex-shrink: none;
    width: 58px;
    border: 1px dashed #2988f3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /deep/.ivu-upload {
      cursor: pointer;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  & > * + * {
    margin-left: 8px;
  }
}

.files {
  height: 100%;
  display: flex;

  &-item {
    position: relative;
    width: 58px;

    &__img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
    }

    &__actions {
      height: 16px;
      z-index: 999;
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      /deep/ .ivu-icon {
        cursor: pointer;
      }
    }
  }
  & > * + * {
    margin-left: 8px;
  }
}
</style>
