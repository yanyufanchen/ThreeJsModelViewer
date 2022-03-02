<template>
  <div class="home">
    <div class="header">模型查看器展示</div>
    <div class="modelList">
      <div class="title">模型列表</div>
      <div class="models">
        <span
          v-for="model in modellist"
          :key="model.id"
          class="model"
          @click="renderModel(model)"
          >{{ model.fileData.resourceName }}</span
        >
      </div>
    </div>
    <!-- 模型查看器 -->
    <modelviewer
      ref="modelviewerCom"
      v-if="modalViewerFlag"
      :model="model"
      @close="
        () => {
          modalViewerFlag = false;
        }
      "
    ></modelviewer>
  </div>
</template>
<script>
import modelviewer from "../modelview/Modelviewer.vue";
export default {
  name: "home",
  data() {
    return {
      modalViewerFlag: false,
      model: null,
      modellist: [
        {
          id: 1,
          fileData: {
            modelUrl:
              "http://113.57.121.225:3002/model/5/模型分类/SMT/ACU控制箱",
            resourceType: "",
            resourceName: "ACU控制箱",
            type: ["obj", "mtl"],
          },
        },
        {
          id: 2,
          fileData: {
            modelUrl: "./static/models/fangzi",
            resourceType: "glb",
            resourceName: "fangzi",
            type: ["glb"],
          },
        },
        {
          id: 3,
          fileData: {
            modelUrl: "./static/models/zuozi",
            resourceType: "glb",
            resourceName: "zuozi",
            type: ["glb"],
          },
        },
      ],
    };
  },
  components: {
    modelviewer,
  },
  methods: {
    renderModel(model) {
      this.modalViewerFlag = true;
      this.model = model;
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  .header {
    width: 100%;
    text-align: center;
    color: red;
    border-bottom: 1px solid #ccc;
  }
  .modelList {
    .models {
      margin-top: 30px;
      .model {
        text-decoration: underline;
        cursor: pointer;
        padding: 10px;
        color: rgb(39, 113, 209);
      }
      .model:hover {
        color: red;
      }
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
