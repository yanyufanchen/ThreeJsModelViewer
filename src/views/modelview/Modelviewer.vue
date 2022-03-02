<template>
  <div class="modelviewer">
    <div class="centent">
      <div class="main" ref="modelviewerMain">
        <div class="progress" v-if="modelLoader_show">
          <div
            class="loader"
            :style="{ width: `${modelLoader_progress}%` }"
          ></div>
          <div class="text">{{ modelLoader_text }}</div>
        </div>
        <div class="toolMenu">
          <div class="header">
            <div class="header_left">
              <div class="header_left_title" v-if="model">
                {{ model.fileData.resourceName }} -
              </div>
              <div class="header_left_text">3D 查看器</div>
            </div>
            <div class="header_right">
              <a-icon
                type="zoom-in"
                class="header_right_icon"
                @click="
                  () => {
                    console.log('全屏');
                  }
                "
              />
              <!-- <a-icon
                type="zoom-out"
                class="header_right_icon"
                @click="
                  () => {
                    console.log('取消全屏');
                  }
                "
              /> -->
              <a-icon
                type="close"
                class="header_right_icon"
                @click="
                  () => {
                    $emit('close');
                  }
                "
              />
            </div>
          </div>
          <div class="tools">
            <div class="tool" v-for="item in toolMenu" :key="item.id">
              <a-dropdown
                :trigger="['click']"
                overlayClassName="overlayClassName"
              >
                <span class="toolTitle">{{ item.name }}</span>
                <a-menu slot="overlay">
                  <a-menu-item v-for="child in item.children" :key="child.id">
                    <span class="toolTitle">
                      <a-icon :type="child.icon" />
                      {{ child.name }}
                    </span>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
          </div>
        </div>
        <div class="view" style="display: flex">
          <!-- 模型层级列表 -->
          <div
            class="childList"
            v-if="getUIHelperFlag('toolUI', 'modelChildListHelper')"
          >
            子集
          </div>
          <div class="iframebox" id="ModelViewerBox"></div>
          <div class="rightMenu" :style="{ height: `${rightMenuHeight}px` }">
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
                    class="helperItem"
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
                    class="helperItem"
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
              <!-- 工具控件 -->
              <a-collapse-panel :header="rightMenu.toolUI.name">
                <div class="toolSet">
                  <div
                    :class="item.id"
                    class="helperItem"
                    :key="item.id"
                    v-for="item in rightMenu.toolUI.childrenUI"
                  >
                    <span>{{ item.name }}</span>
                    <a-switch
                      checked-children="开"
                      un-checked-children="关"
                      :defaultChecked="item.status"
                      @change="toolUIApi(item)"
                    />
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
        <div class="footer">
          <div class="animation">
            <div class="play animationBtn"><a-icon type="play-square" /></div>
            <div class="play animationBtn"><a-icon type="sync" /></div>
            <div class="animationLine">
              <a-slider id="test" :default-value="30" :disabled="false" />
            </div>
          </div>
          <div class="tool">
            <a-dropdown
              :trigger="['click']"
              overlayClassName="overlayClassName"
            >
              <span class="toolTitle">
                <a-icon type="up-square" />
                快速动画<a-icon type="up" />
              </span>
              <a-menu slot="overlay">
                <a-menu-item>
                  <span class="toolTitle">
                    <a-icon type="desktop" />
                    无
                  </span>
                </a-menu-item>
                <a-menu-item>
                  <span class="toolTitle">
                    <a-icon type="desktop" />
                    转盘
                  </span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-dropdown
              :trigger="['click']"
              overlayClassName="overlayClassName"
            >
              <span class="toolTitle">
                <a-icon type="close" style="font-size: 10px" />
                1.0<a-icon type="up" />
              </span>
              <a-menu slot="overlay">
                <a-menu-item>
                  <span class="toolTitle">
                    <a-icon type="close" style="font-size: 10px" />
                    1.0
                  </span>
                </a-menu-item>
                <a-menu-item>
                  <span class="toolTitle">
                    <a-icon type="close" style="font-size: 10px" />
                    2.0
                  </span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RenderModel } from "./renderModel.js";

export default {
  name: "Modelviewer",
  props: ["model"],
  data() {
    return {
      visible: true,
      modelLoader_progress: 0,
      modelLoader_show: false,
      modelLoader_text: "",
      // 顶部工具栏
      toolMenu: [
        {
          id: "file",
          name: "文件",
          children: [
            {
              id: "export",
              name: "导出",
              icon: "download",
            },
            {
              id: "screenshot",
              name: "截图",
              icon: "picture",
            },
          ],
        },
        {
          id: "edit",
          name: "编辑",
          children: [
            {
              id: "disassemble",
              name: "拆解",
              icon: "unlock",
            },
            // {
            //   id: "screenshot",
            //   name: "截图",
            // },
          ],
        },
        {
          id: "tool",
          name: "工具",
          children: [
            {
              id: "statistics",
              name: "统计信息",
              icon: "file-search",
            },
            {
              id: "sectioning",
              name: "剖切",
              icon: "to-top",
            },
          ],
        },
        {
          id: "viewer",
          name: "查看",
          children: [
            {
              id: "blast",
              name: "爆炸",
              icon: "global",
            },
            {
              id: "measure",
              name: "测量",
              icon: "gateway",
            },
            {
              id: "ResetCamera",
              name: "重置相机",
              icon: "cloud-sync",
            },
          ],
        },
      ],
      // 右侧工具
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
              status: true,
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
              status: false,
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
        toolUI: {
          id: "toolUI",
          name: "工具控件",
          childrenUI: [
            {
              id: "modelChildListHelper",
              name: "模型层级",
              status: false,
            },
          ],
        },
      },
      activeKey: [],
      // 模型查看器实例
      RenderModelApi: null,
      rightMenuHeight: 0,
    };
  },
  watch: {
    activeKey(key) {
      // console.log(key, "key");
    },
  },
  async mounted() {
    this.rightMenuHeight = this.$refs.modelviewerMain.clientHeight - 80 - 50;
    this.RenderModelApi = new RenderModel(this.rightMenu);
    this.RenderModelApi.init("#ModelViewerBox", this.model, this.loaderModel);
  },
  methods: {
    loaderModel(e) {
      console.log(e, "模型加载");
      if (!e) return;
      this.modelLoader_progress = e.per;
      this.modelLoader_text = `加载中…… 文件大小：${e.modelSize}`;
      if (e.per === 100) {
        this.modelLoader_show = false;
      }
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
    // 工具设置
    toolUIApi(item) {
      console.log(item, "场景设置");
      item.status = !item.status;
      // if (!this.RenderModelApi.model) {
      //   this.$message.warning("请选择模型");
      //   return;
      // }
      // 模型层级列表
      if (item.id === "modelChildListHelper") {
        // this.modelChildListHelperFlag=item.status
      }
    },
    // 查询辅助helper的status状态
    getUIHelperFlag(oneKey, helperId) {
      return this.rightMenu[oneKey].childrenUI.find(
        (item) => item.id === helperId
      ).status;
    },
  },
};
</script>
<style lang="less">
.overlayClassName {
  // padding: 0 30px;

  .ant-dropdown-menu {
    top: -5px;
    border-radius: 0px;
    box-shadow: 4px 7px 10px 0px rgb(0 0 0 / 15%);
  }
}
.ant-collapse-content > .ant-collapse-content-box {
  padding: 10px !important;
}
</style>
<style lang="less" scoped>
.modelviewer {
  position: fixed;
  _position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  -moz-opacity: 0.5;
  filter: alpha(opacity=50);
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  .centent {
    position: relative;
    width: 90%;
    height: 90%;
    .main {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background-color: #fff;
      // border-radius: 5px;
      display: flex;
      flex-direction: column;
      .toolMenu {
        width: 100%;
        height: 70px;
        border-bottom: 1px solid #ccc;
        // background-color: #252323;
        .header {
          box-sizing: border-box;
          width: 100%;
          height: 30px;
          // padding: 0 10px;
          background-color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .header_left {
            display: flex;
            font-size: 12px;
            padding-left: 10px;
          }
          .header_right {
            height: 30px;
            .header_right_icon {
              line-height: 30px;
              color: rgb(129, 126, 126);
              width: 45px;
              height: 100%;
            }
            .header_right_icon:hover {
              color: #fff;
              background: rgb(197, 193, 193);
            }
          }
        }
        .tools {
          width: 100%;
          height: 40px;
          display: flex;
          background-color: #ddd;
          .tool {
            width: 60px;
            height: 40px;
            line-height: 40px;
            .toolTitle {
              display: inline-block;
              height: 40px;
              padding: 0 10px;
              line-height: 40px;
              cursor: pointer;
            }
            .toolTitle:hover {
              color: #fff;
              background: rgb(197, 193, 193);
            }
          }
        }
      }
      .view {
        flex: 1;
        position: relative;
        .childList {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 999;
          width: 150px;
          height: 100%;
          background: #fff;
        }
        .iframebox {
          flex: 1;
          height: 100%;
          position: relative;
        }
        .rightMenu {
          border: 1px solid #ccc;
          width: 150px;
          overflow-y: auto;
          .helperItem {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            padding: 2px 0;
          }
        }
      }

      .footer {
        width: 100%;
        height: 50px;
        border-top: 1px solid #ccc;
        // background-color: #252323;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .animation {
          flex: 1;
          display: flex;
          justify-content: start;
          align-items: center;
          .animationBtn {
            width: 50px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            font-size: 20px;
            border: 2px solid rgba(204, 204, 204, 0);
          }
          .animationLine {
            flex: 1;
          }
          .animationBtn:hover {
            background: #ccc;
            border: 2px solid rgba(63, 61, 61, 0.89);
          }
        }
        .tool {
          // width: 80px;
          height: 50px;
          line-height: 50px;
          .toolTitle {
            display: inline-block;
            height: 50px;
            padding: 0 10px;
            line-height: 50px;
            cursor: pointer;
          }
          .toolTitle:hover {
            color: #fff;
            background: rgb(197, 193, 193);
          }
        }
      }
    }
  }
}
</style>
