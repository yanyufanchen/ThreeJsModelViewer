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
      {
        id: String(Math.random() * 1000),
        fileData: {
          resourceName: '别墅',
          modelImage:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/c41dda32-e825-4992-b66c-ee085f6a81c9.png',
          modelUrl:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/2b5ac99c-ead9-4370-bc93-50094fb81559.glb',
          resourceType: 'glb',
          type: ['glb'],
        },
      },
      {
        id: String(Math.random() * 1000),
        fileData: {
          resourceName: '操作台',
          modelImage:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/9bc07ca8-2ada-4911-b692-f17d55cdf6d2.png',
          modelUrl:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/a712c0e6-5ff2-4e1a-862d-e52d7d8df98b.glb',
          resourceType: 'glb',
          type: ['glb'],
        },
      },
      {
        id: String(Math.random() * 1000),
        fileData: {
          resourceName: '高楼',
          modelImage:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/eb2b16cc-a612-4743-8cee-41310211af44.png',
          modelUrl:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/85de8f71-32f6-4c76-be6d-eacda606e7b6.glb',
          resourceType: 'glb',
          type: ['glb'],
        },
      },
      {
        id: String(Math.random() * 1000),
        fileData: {
          resourceName: '卡车',
          modelImage:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/d39169a6-a5f8-4e75-b01d-35c6d22ee8eb.png',
          modelUrl:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/2c62bdf4-e6b0-4349-98eb-0ea00587e710.glb',
          resourceType: 'glb',
          type: ['glb'],
        },
      },
      {
        id: String(Math.random() * 1000),
        fileData: {
          resourceName: '沙滩',
          modelImage:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/83b40c08-061c-4a75-ae6e-906a68e1c06d.png',
          modelUrl:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/19f4ea78-a00f-41d9-8de0-671a9000b741.glb',
          resourceType: 'glb',
          type: ['glb'],
        },
      },
      {
        id: String(Math.random() * 1000),
        fileData: {
          resourceName: '体育场',
          modelImage:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/ec36f185-d066-4f16-9188-00e7c86e220b.png',
          modelUrl:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/7aa19249-f61d-4c4b-9b2e-fd4fbf224038.glb',
          resourceType: 'glb',
          type: ['glb'],
        },
      },
      {
        id: String(Math.random() * 1000),
        fileData: {
          resourceName: '文字特效',
          modelImage:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/83235b78-3f8b-400a-b558-6255fce17646.png',
          modelUrl:
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d3ca2bf9-a00e-476d-9447-92a65ac1a70a/22a10ee8-5c84-4dd8-98d0-9809cecbb0ca.glb',
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
