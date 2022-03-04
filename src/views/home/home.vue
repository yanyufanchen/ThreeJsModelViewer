<template>
  <div class="home">
    <!-- <div class="header"></div> -->
    <div class="modelList">
      <a-card title="模型查看器展示">
        <a-card-grid
          style="width: 25%; text-align: center; padding: 5px"
          v-for="model in modellist"
          :key="model.id"
          class="model"
        >
          <div class="image" @click="renderModel(model)">
            <img alt="example" :src="model.imgUrl" />
          </div>

          <a-card-meta :title="model.fileData.resourceName">
            <template slot="description">
              <div
                class="modelDownload"
                @click="download(model.modeldownLoadUrl)"
              >
                {{ model.modeldownLoadUrl }}
              </div>
            </template>
          </a-card-meta>
        </a-card-grid>
      </a-card>
    </div>
    <!-- 模型查看器 -->
    <modelviewer
      ref="modelviewerCom"
      v-if="modalViewerFlag"
      :model="model"
      @close="closemodelViewer"
    ></modelviewer>
  </div>
</template>
<script>
import modelviewer from '../modelview/Modelviewer.vue';
export default {
  name: 'home',
  data() {
    return {
      modalViewerFlag: false,
      model: null,
      modellist: [],
    };
  },
  components: {
    modelviewer,
  },
  mounted() {
    // 处理glb文件
    let files = require.context('../../../public/', true, /.glb$/).keys();
    files.forEach((file) => {
      let modelPath = file.substring(file.lastIndexOf('/'), 0);
      let resourceName = file
        .substring(file.lastIndexOf('/') + 1)
        .split('.')[0];
      let resourceType = file
        .substring(file.lastIndexOf('/') + 1)
        .split('.')[1];
      this.modellist.push({
        id: String(Math.random() * 1000),
        imgUrl: `${modelPath}/index.png`,
        modeldownLoadUrl: `${window.location.origin}${
          window.location.pathname
        }${file
          .substring(file.lastIndexOf('/'), 1)
          .substring(1)}/${resourceName}.${resourceType}`,
        fileData: {
          modelUrl: `${window.location.origin}${window.location.pathname}${file
            .substring(file.lastIndexOf('/'), 1)
            .substring(1)}`,
          resourceType,
          resourceName,
          type: [resourceType],
        },
      });
    });
    console.log(files);
  },
  methods: {
    renderModel(model) {
      this.modalViewerFlag = true;
      this.model = model;
    },
    download(url) {
      window.open(url);
    },
    closemodelViewer() {
      this.modalViewerFlag = false;
    },
  },
};
</script>
<style lang="less" scoped>
.home {
  .header {
    width: 100%;
    text-align: center;
    color: red;
    border-bottom: 1px solid #ccc;
  }
  .modelList {
    padding: 10px;
    .image {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      margin-bottom: 5px;
      img {
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    .modelDownload {
      cursor: default;
      color: rgb(33, 118, 222);
    }
    .modelDownload:hover {
      color: rgb(233, 79, 79);
    }
  }
  .modelviewBox {
    margin-top: 100px;
    width: 900px;
    height: 500px;
    background-color: #ccc;
  }
}
</style>
