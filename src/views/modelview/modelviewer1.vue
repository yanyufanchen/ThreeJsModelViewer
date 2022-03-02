<template>
  <div class="modelviewer">
    <div class="progress" v-if="modelLoader_show">
      <div class="loader" :style="{ width: `${modelLoader_progress}%` }"></div>
      <div class="text">{{ modelLoader_text }}</div>
    </div>
    <div class="iframebox" id="ModelViewerBox"></div>
    <div class="rightMenu">
      <a-collapse v-model="activeKey">
        <a-collapse-panel :header="rightMenu.environmentUI.name">
          <!-- 环境设置 -->
          <a-row>
            <a-col
              :span="8"
              v-for="item in rightMenu.environmentUI.datalist"
              :key="item.id"
            >
              <div
                class="colorBox"
                :style="{ backgroundColor: item.color }"
                style="width: 40px; height: 40px"
              ></div>
            </a-col>
          </a-row>
        </a-collapse-panel>
        <!-- 灯光设置 -->
        <a-collapse-panel :header="rightMenu.ligntUI.name">
          <div class="lightSet">
            <div
              :class="item.id"
              :key="item.id"
              v-for="item in rightMenu.ligntUI.childrenUI"
            >
              <span>{{ item.name }}</span>
              <a-switch
                checked-children="开"
                un-checked-children="关"
                :defaultChecked="item.status"
                @change="lightUIApi(item)"
              />
            </div>
          </div>
        </a-collapse-panel>
        <!-- 场景控件 -->
        <a-collapse-panel :header="rightMenu.sceneUI.name">
          <div class="sceneSet">
            <div
              :class="item.id"
              :key="item.id"
              v-for="item in rightMenu.sceneUI.childrenUI"
            >
              <span>{{ item.name }}</span>
              <a-switch
                checked-children="开"
                un-checked-children="关"
                :defaultChecked="item.status"
                @change="sceneUIApi(item)"
              />
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>
<script>
import { RenderModel } from "./renderModel.js";
export default {
  name: "modelviewer",
  // props: ["model"],
  data() {
    return {
      modelLoader_progress: 0,
      modelLoader_show: false,
      modelLoader_text: "",
      rightMenu: {
        environmentUI: {
          name: "环境设置",
          datalist: [
            {
              id: 1,
              color: "#ccc",
            },
            {
              id: 2,
              color: "#FF4400",
            },
            {
              id: 3,
              color: "#000000",
            },
            {
              id: 4,
              color: "#FFF9AD",
            },
            {
              id: 5,
              color: "#97C7C9",
            },
            {
              id: 6,
              color: "#FF9000",
            },
          ],
        },
        ligntUI: {
          id: "ligntUI",
          name: "灯光设置",
          childrenUI: [
            {
              id: "LightHelper",
              name: "灯光辅助器",
              status: true,
            },
            {
              id: "AuxiliaryLight",
              name: "辅助灯光",
              status: true,
            },
            {
              id: "Keylight",
              name: "主灯光",
              status: true,
            },
            {
              id: "Shadow",
              name: "阴影",
              status: false,
            },
          ],
        },
        sceneUI: {
          id: "sceneUI",
          name: "场景控件",
          childrenUI: [
            {
              id: "gridHelper",
              name: "网格辅助",
              status: true,
            },
            {
              id: "viewHelper",
              name: "坐标辅助",
              status: true,
            },
            {
              id: "planeHelper",
              name: "平面辅助",
              status: true,
            },
          ],
        },
      },
      activeKey: [],

      RenderModelApi: null,
    };
  },
  watch: {
    activeKey(key) {
      console.log(key, "key");
    },
  },
  async mounted() {
    this.RenderModelApi = new RenderModel(this.rightMenu);
    this.RenderModelApi.init("#ModelViewerBox");
    console.log(this.RenderModelApi, "RenderModelApi");
  },
  methods: {
    renderUpdate(model) {
      // 获取模型加载的回调
      let loaderModel = (e) => {
        console.log(e, "模型加载");
        if (!e) return;
        this.modelLoader_progress = e.per;
        this.modelLoader_text = `加载中…… 文件大小：${e.modelSize}`;
        if (e.per === 100) {
          this.modelLoader_show = false;
        }
      };

      // 添加模型
      this.RenderModelApi.addModel(model, loaderModel);
    },
    // 灯光设置
    lightUIApi(item) {
      console.log(item, "灯光设置");
      item.status = !item.status;
      if (!this.RenderModelApi.model) {
        this.$message.warning("请选择模型");
        return;
      }
      // 灯光辅助器
      if (item.id === "LightHelper") {
        item.status
          ? this.RenderModelApi.createLightHelper()
          : this.RenderModelApi.removeLightHelper();
        return;
      }
      // 辅助灯光
      if (item.id === "AuxiliaryLight") {
        item.status
          ? this.RenderModelApi.createAuxiliaryLight()
          : this.RenderModelApi.removeAuxiliaryLight();
        return;
      }
      // 主灯光
      if (item.id === "Keylight") {
        item.status
          ? this.RenderModelApi.createKeylight()
          : this.RenderModelApi.removeKeylight();
        return;
      }
      // 阴影
      if (item.id === "Shadow") {
        item.status
          ? this.RenderModelApi.LightShadow(true)
          : this.RenderModelApi.LightShadow(false);
        return;
      }
    },
    // 场景设置
    sceneUIApi(item) {
      console.log(item, "场景设置");
      item.status = !item.status;
      if (!this.RenderModelApi.model) {
        this.$message.warning("请选择模型");
        return;
      }
      // 网格辅助
      if (item.id === "gridHelper") {
        item.status
          ? this.RenderModelApi.createGridHelper()
          : this.RenderModelApi.removeGridHelper();
      }
      // 坐标辅助
      if (item.id === "viewHelper") {
        item.status
          ? this.RenderModelApi.createViewHelper()
          : this.RenderModelApi.removeViewHelper();
      }
      // 平面辅助
      if (item.id === "planeHelper") {
        item.status
          ? this.RenderModelApi.createPlaneHelper()
          : this.RenderModelApi.removePlaneHelper();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.modelviewer {
  width: 100%;
  height: 100%;
  display: flex;
  .iframebox {
    flex: 1;
    height: 100%;
    position: relative;
  }
  .rightMenu {
    border: 1px solid #ccc;
    width: 150px;
  }
}
</style>
