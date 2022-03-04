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
            <img alt="example" :src="model.fileData.modelImage" />
          </div>

          <a-card-meta :title="model.fileData.resourceName">
            <template slot="description">
              <div
                class="modelDownload"
                @click="download(model.fileData.modelUrl)"
              >
                {{ model.fileData.modelUrl }}
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
    //     fileData:Object
    // modelUrl:"http://localhost:8080/models/卡车"
    // resourceName:"卡车"
    // resourceType:"glb"
    // type:Array[1]
    // 0:"glb"
    // id:"65.39160641116237"
    // imgUrl:"./models/卡车/index.png"
    // modeldownLoadUrl:"http://localhost:8080/models/卡车/卡车.glb"
    let files = [
      {
        id: String(Math.random() * 1000),
        fileData: {
          resourceName: '办公大楼',
          modelImage:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/54e669e8-a9d2-4a69-b78e-d74f3f506612.png',
          modelUrl:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/7ea3b300-7e6d-49bf-9116-f842bd717151.glb',
          resourceType: 'glb',
          type: ['glb'],
        },
      },
    ];
    this.modellist = files;
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
