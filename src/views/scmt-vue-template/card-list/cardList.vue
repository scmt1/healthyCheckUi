<style lang="less">
@import "./cardList.less";
</style>
<template>
  <div class="search">
    <Card>
      <Tabs value="1">
        <TabPane label="文件/应用类" name="1">
          <div class="card-wrapper" id="image">
            <Card v-for="(item, i) in data" :key="i" class="card">
              <div class="content">
                <img
                  @click="showPic(item, i)"
                  v-if="item.type.indexOf('image')>=0"
                  class="img"
                  :src="item.url"
                />
                <div
                  v-else-if="item.type.indexOf('video')>=0"
                  class="video"
                  @click="showVideo(item)"
                >
                  <!-- 文件小于5MB显示video -->
                  <video class="cover" v-if="item.size<1024 * 1024 * 5">
                    <source :src="item.url" />
                  </video>
                </div>
                <div v-else class="other">
                  <div class="name">{{item.name}}</div>
                  <div class="key">{{item.fkey}}</div>
                  <div
                    class="info"
                  >文件类型：{{item.type}} 文件大小：{{((item.size * 1.0) / (1024 * 1024)).toFixed(2)}} MB 创建时间：{{item.createTime}}</div>
                </div>
                <div class="actions">
                  <div class="btn">
                    <Tooltip content="下载" placement="top">
                      <Icon @click="download(item)" type="md-download" size="16" />
                    </Tooltip>
                  </div>
                  <div class="btn">
                    <Tooltip content="重命名" placement="top">
                      <Icon @click="rename(item)" type="md-create" size="16" />
                    </Tooltip>
                  </div>
                  <div class="btn">
                    <Tooltip content="复制" placement="top">
                      <Icon @click="copy(item)" type="md-copy" size="16" />
                    </Tooltip>
                  </div>
                  <div class="btn-no">
                    <Tooltip content="删除" placement="top">
                      <Icon @click="remove(item)" type="md-trash" size="16" />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabPane>
        <TabPane label="项目类" name="2">
          <div class="card-wrapper">
            <Card @click="showProject(item)" v-for="(item, i) in data2" :key="i" class="card">
              <div class="project">
                <img class="img" :src="item.url" />
                <div class="content">
                  <div class="title">{{item.title}}</div>
                  <div class="desc">{{item.description}}</div>
                  <div class="info">
                    <div class="time">
                      <Time :time="new Date()" :interval="1" />
                    </div>
                    <div class="avatar">
                      <div v-for="(iitem, i) in item.author" :key="i" class="item">
                        <Tooltip :content="iitem.name" placement="top">
                          <Avatar :src="iitem.avatar" size="small" class="c" />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabPane>
      </Tabs>
    </Card>

    <Modal
      v-model="videoVisible"
      :title="videoTitle"
      :width="800"
      @on-cancel="closeVideo"
      draggable
    >
      <div id="dplayer-card" style="height: 500px"></div>
      <div slot="footer">
        <span>文件类型：{{file.type}} 文件大小：{{file.msize}} 创建时间：{{file.createTime}}</span>
      </div>
    </Modal>
  </div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
import DPlayer from "dplayer";
var dp;
export default {
  name: "card-list",
  data() {
    return {
      videoVisible: false,
      picTitle: "",
      videoTitle: "",
      file: {},
      data: [

      ],
      data2: [

      ]
    };

    
  },
  methods: {
    init() {},
    showPic(v, i) {
      let viewer = new Viewer(document.getElementById("image"), {
        hidden: function() {
          viewer.destroy();
        }
      });
      viewer.view(i);
    },
    showVideo(v) {
      dp = new DPlayer({
        container: document.getElementById("dplayer-card"),
        screenshot: true,
        video: {
          url: v.url
        }
      });
      this.file = v;
      this.file.msize = ((v.size * 1.0) / (1024 * 1024)).toFixed(2) + " MB";
      this.videoTitle = v.name + "(" + v.fkey + ")";
      this.videoVisible = true;
    },
    closeVideo() {
      dp.destroy();
    },
    download(v) {
      window.open(
        v.url + "?attname=&response-content-type=application/octet-stream"
      );
    },
    copy(v) {
      this.$Message.info("点击了 " + v.name + " 的复制图标");
    },
    remove(v) {
      this.$Message.info("点击了 " + v.name + " 的删除图标");
    },
    rename(v) {
      this.$Message.info("点击了 " + v.name + " 的重命名图标");
    }
  },
  mounted() {
    this.init();
  }
};
</script>
