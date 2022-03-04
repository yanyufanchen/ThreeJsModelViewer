import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer"
// import { TWEEN } from './tween.module.min.js';
import { ViewHelper } from './ViewHelper.js';
import { addMoelApi } from './modelTools';
export class RenderModel {
    constructor(rightMenu) {
        // 定义容器
        this.container = null
        // 父级盒子
        this.parantDom = null
        // 场景
        this.scene = null
        // 照相机
        this.camera = null

        // 渲染器
        this.renderer = null
        // 视角控制器
        this.orbitcontrols = null
        // 网格辅助
        this.gridHelper = null
        // 坐标辅助器
        this.viewHelper = null
        // 平面辅助
        this.planeHelper = null
        // 预加载模型
        this.model = null
        this.modelSize = null
        this.modelLabel = null
        // 灯光辅助器
        this.LightHelper = {
            HemisphereLightHelper: null,
            SpotLightHelper: null,
            SpotLightshadowCameraHelper: null, // 聚光灯阴影辅助器
            DirectionalLightHelper_XZ: null,  // 正向 x y
            DirectionalLightHelper_XRZ: null,  // 正向 x -y
            DirectionalLightHelper_RXZ: null,  // 正向 -x y
            DirectionalLightHelper_RXRZ: null, // 反向 -x -y
        }
        // 主灯光
        this.Keylight = {
            SpotLight: null,
        }
        // 辅助灯光
        this.AuxiliaryLight = {
            AmbientLight: null,
            HemisphereLight: null,
            DirectionalLight_XZ: null,
            DirectionalLight_XRZ: null,
            DirectionalLight_RXZ: null,
            DirectionalLight_RXRZ: null
        }
        // UI属性面板参数
        this.rightMenu = rightMenu
    }
    // 初始化
    async init(el, model, renderModelApi) {

        // 初始化容器
        this.createContainer(el)
        // 初始化场景
        this.createScene()
        // 初始化相机
        this.createCamera()
        // 初始化渲染器
        this.createRenderer()
        // 初始化相机视角控制器
        this.createOrbitcontrols()
        // 加载模型
        const addmodelRes = await this.addModel(model, renderModelApi)
        // console.log(addmodelRes, 'addmodelRes')
        // 灯光设置
        // 辅助灯光
        let AuxiliaryLightFlag = this.rightMenu.ligntUI.childrenUI.find(item => item.id === 'AuxiliaryLight').status
        AuxiliaryLightFlag && this.createAuxiliaryLight()
        // 主灯光
        let KeyLightFlag = this.rightMenu.ligntUI.childrenUI.find(item => item.id === 'Keylight').status
        KeyLightFlag && this.createKeylight()
        // 灯光辅助器
        let LightHelperFlag = this.rightMenu.ligntUI.childrenUI.find(item => item.id === 'LightHelper').status
        LightHelperFlag && this.createLightHelper()
        // 灯光阴影
        let LightShadowFlag = this.rightMenu.ligntUI.childrenUI.find(item => item.id === 'Shadow').status
        LightShadowFlag && this.LightShadow(true)
        // 场景设置
        // 网格辅助器 显示隐藏
        let gridHelperFlag = this.rightMenu.sceneUI.childrenUI.find(item => item.id === 'gridHelper').status
        gridHelperFlag && this.createGridHelper()
        // 坐标辅助器 显示隐藏
        let viewHelperFlag = this.rightMenu.sceneUI.childrenUI.find(item => item.id === 'viewHelper').status
        viewHelperFlag && this.createViewHelper()
        // 坐标辅助器 显示隐藏
        let planeHelperFlag = this.rightMenu.sceneUI.childrenUI.find(item => item.id === 'planeHelper').status
        planeHelperFlag && this.createPlaneHelper()

        window.scene = this.scene
        // 实时刷新
        this.animate();
        // 窗口自适应
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize.bind(this), false);


    }
    // 卸载模型查看器
    remove() {
        console.log('移除画布')
        const f = document.getElementsByClassName('view')[0]
        f.removeChild(document.getElementById('ModelViewerBox'))

    }
    // 创建容器
    createContainer(el) {
        this.container = document.createElement("div")
        // this.container.id=""
        this.container.globalAlpha = 0;
        this.parantDom = document.querySelector(`${el}`)
        // 移除子元素
        let child = this.parantDom.lastElementChild;
        while (child) {
            this.parantDom.removeChild(child);
            child = this.parantDom.lastElementChild;
        }
        // 添加子元素
        this.parantDom.appendChild(this.container);
    }
    // 创建场景
    createScene() {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x212330);
    }
    // 创建相机
    createCamera() {
        const aspect = this.parantDom.clientWidth / this.parantDom.clientHeight
        this.camera = new THREE.PerspectiveCamera(50, aspect, 1, 30000);
        this.camera.position.set(100, 100, 100);
        this.camera.name = 'Camera';
        this.camera.lookAt(new THREE.Vector3(100, 100, 100));
    }
    // 创建渲染器
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true, // 开启抗锯齿
            alpha: true // 画布透明度
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.parantDom.offsetWidth, this.parantDom.offsetHeight);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.renderer.render(this.scene, this.camera);
        // 标签渲染器
        this.labelRenderer = new CSS2DRenderer()
        this.labelRenderer.setSize(this.parantDom.offsetWidth, this.parantDom.offsetHeight)
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.container.appendChild(this.labelRenderer.domElement);
    }
    // 创建相机视角控制器
    createOrbitcontrols() {
        // this.orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitcontrols = new OrbitControls(this.camera, this.labelRenderer.domElement);
        this.orbitcontrols.addEventListener("change", this.render.bind(this));
        this.orbitcontrols.update();
    }
    // 创建坐标辅助器
    createViewHelper() {
        this.viewHelper = new ViewHelper(this.camera, this.container)
        this.scene.add(this.viewHelper)
        // this.render()
    }
    // 移除坐标辅助器
    removeViewHelper() {
        this.scene.remove(this.viewHelper)
        this.render()
        // 移除dom
        let viewHelperDom = document.getElementById("viewHelper");
        viewHelperDom.remove();
    }
    // 创建网格辅助
    createGridHelper() {
        this.gridHelper = new THREE.GridHelper(300, 100, 0x444d66, 0x2c3242);
        this.gridHelper.position.set(0, 0, -2);
        this.scene.add(this.gridHelper)
        // 灯光阴影
        let LightShadowFlag = this.rightMenu.ligntUI.childrenUI.find(item => item.id === 'Shadow').status
        LightShadowFlag && this.LightShadow(true)
    }
    // 移除网格辅助
    removeGridHelper() {
        this.scene.remove(this.gridHelper)
    }
    // 创建平面辅助
    createPlaneHelper() {
        let geometry = new THREE.BoxGeometry(300, 1, 300)
        let material = new THREE.MeshPhongMaterial({ color: 0x444d66, side: THREE.DoubleSide });
        this.planeHelper = new THREE.Mesh(geometry, material);
        this.planeHelper.position.set(0, -1, 0)
        this.scene.add(this.planeHelper);
        // 灯光阴影
        let LightShadowFlag = this.rightMenu.ligntUI.childrenUI.find(item => item.id === 'Shadow').status
        LightShadowFlag && this.LightShadow(true)
    }
    // 移除平面辅助
    removePlaneHelper() {
        this.scene.remove(this.planeHelper)
    }
    // 添加模型
    async addModel(model, loaderModel) {
        return new Promise(async (resolve) => {
            if (this.model) {
                this.removeModel()
            }
            // 添加模型
            let objectRes = await addMoelApi(model, loaderModel)
            if (!objectRes.status) {
                // this.$message.error(objectRes.message)
                resolve({
                    message: objectRes.message,
                    status: false
                })
                return
            }

            if (!objectRes.object) {
                console.log('读取模型失败')
                resolve({
                    message: '读取模型失败',
                    status: false
                })
                return
            }
            this.model = objectRes.object
            // 处理模型在场景中的位置
            let modelBox = new THREE.Box3().setFromObject(this.model);
            let mdlen = modelBox.max.x - modelBox.min.x;
            let mdhei = modelBox.max.y - modelBox.min.y;
            let mdwid = modelBox.max.z - modelBox.min.z;
            let x1 = modelBox.min.x + mdlen / 2;
            // let y1 = modelBox.min.y + mdhei / 2;
            let y1 = 0 // 置于网格之上
            let z1 = modelBox.min.z + mdwid / 2;
            this.model.position.set(-x1, -y1, -z1); // 将模型原点归零
            let maxLength = (mdlen > mdwid ? mdlen : mdwid) > mdhei ? (mdlen > mdwid ? mdlen : mdwid) : mdhei;
            // 更新相机位置
            this.camera.updateProjectionMatrix();
            this.cameraReset({ x: maxLength, y: mdhei, z: maxLength })
            // 统计模型位置
            this.modelSize = {
                x: maxLength,
                y: mdhei,
                z: maxLength,
            }

            this.scene.add(this.model)
            // 创建模型自身标签
            const modelDiv = document.createElement('div');
            modelDiv.className = 'label';
            modelDiv.style = 'color:#fff';
            modelDiv.textContent = this.model.name;
            this.modelLabel = new CSS2DObject(modelDiv)
            this.modelLabel.position.set(0, mdhei + 1.5, 0)
            this.model.add(this.modelLabel)

            resolve({
                message: '加载成功',
                status: true
            })
        })
    }
    // 移除模型
    removeModel() {
        this.model.remove(this.modelLabel)
        this.scene.remove(this.model)
    }
    // 创建灯光辅助器
    createLightHelper() {
        if (this.AuxiliaryLight.HemisphereLight) {
            this.LightHelper.HemisphereLightHelper = new THREE.HemisphereLightHelper(this.AuxiliaryLight.HemisphereLight, 5);
            this.scene.add(this.LightHelper.HemisphereLightHelper);
            this.LightHelper.DirectionalLightHelper_XZ = new THREE.DirectionalLightHelper(this.AuxiliaryLight.DirectionalLight_XZ, 5);
            this.scene.add(this.LightHelper.DirectionalLightHelper_XZ);
            this.LightHelper.DirectionalLightHelper_XRZ = new THREE.DirectionalLightHelper(this.AuxiliaryLight.DirectionalLight_XRZ, 5);
            this.scene.add(this.LightHelper.DirectionalLightHelper_XRZ);
            this.LightHelper.DirectionalLightHelper_RXZ = new THREE.DirectionalLightHelper(this.AuxiliaryLight.DirectionalLight_RXZ, 5);
            this.scene.add(this.LightHelper.DirectionalLightHelper_RXZ);
            this.LightHelper.DirectionalLightHelper_RXRZ = new THREE.DirectionalLightHelper(this.AuxiliaryLight.DirectionalLight_RXRZ, 5);
            this.scene.add(this.LightHelper.DirectionalLightHelper_RXRZ);
        }
        if (this.Keylight.SpotLight) {
            this.LightHelper.SpotLightHelper = new THREE.SpotLightHelper(this.Keylight.SpotLight);
            this.scene.add(this.LightHelper.SpotLightHelper);
            this.LightHelper.SpotLightshadowCameraHelper = new THREE.CameraHelper(this.Keylight.SpotLight.shadow.camera);
            this.LightHelper.SpotLightshadowCameraHelper.visible = true;
            this.scene.add(this.LightHelper.SpotLightshadowCameraHelper)
        }
    }
    // 移除灯光辅助器
    removeLightHelper() {
        this.LightHelper.HemisphereLightHelper && this.scene.remove(this.LightHelper.HemisphereLightHelper)
        this.LightHelper.SpotLightHelper && this.scene.remove(this.LightHelper.SpotLightHelper)
        this.LightHelper.SpotLightshadowCameraHelper && this.scene.remove(this.LightHelper.SpotLightshadowCameraHelper)

        this.LightHelper.DirectionalLightHelper_XZ && this.scene.remove(this.LightHelper.DirectionalLightHelper_XZ)
        this.LightHelper.DirectionalLightHelper_RXZ && this.scene.remove(this.LightHelper.DirectionalLightHelper_RXZ)
        this.LightHelper.DirectionalLightHelper_XRZ && this.scene.remove(this.LightHelper.DirectionalLightHelper_XRZ)
        this.LightHelper.DirectionalLightHelper_RXRZ && this.scene.remove(this.LightHelper.DirectionalLightHelper_RXRZ)
    }
    // 创建辅助灯光
    createAuxiliaryLight() {
        // 添加灯光
        this.AuxiliaryLight.AmbientLight = new THREE.AmbientLight(0x666666, 1); // 环境光
        this.AuxiliaryLight.HemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.1); // 半球光
        this.AuxiliaryLight.DirectionalLight_XZ = new THREE.DirectionalLight(0xffffff, 0.05);
        this.AuxiliaryLight.DirectionalLight_XRZ = new THREE.DirectionalLight(0xffffff, 0.05);
        this.AuxiliaryLight.DirectionalLight_RXZ = new THREE.DirectionalLight(0xffffff, 0.05);
        this.AuxiliaryLight.DirectionalLight_RXRZ = new THREE.DirectionalLight(0xffffff, 0.05);
        // 更新灯光位置
        this.updateLight()
        // 灯光阴影
        let LightShadowFlag = this.rightMenu.ligntUI.childrenUI.find(item => item.id === 'Shadow').status
        LightShadowFlag && this.LightShadow(true)
        this.scene.add(this.AuxiliaryLight.AmbientLight);
        this.scene.add(this.AuxiliaryLight.HemisphereLight);
        this.scene.add(this.AuxiliaryLight.DirectionalLight_XZ);
        this.scene.add(this.AuxiliaryLight.DirectionalLight_XRZ);
        this.scene.add(this.AuxiliaryLight.DirectionalLight_RXZ);
        this.scene.add(this.AuxiliaryLight.DirectionalLight_RXRZ);
    }
    // 移除辅助灯光
    removeAuxiliaryLight() {
        this.scene.remove(this.AuxiliaryLight.AmbientLight)
        this.scene.remove(this.AuxiliaryLight.HemisphereLight)
    }
    // 创建主灯光
    createKeylight() {
        // 添加聚光灯
        this.Keylight.SpotLight = new THREE.SpotLight(0xffffff);
        this.Keylight.SpotLight.position.set(17, 45, 27);
        this.Keylight.SpotLight.castShadow = true;
        this.Keylight.SpotLight.intensity = 2.5; // 强度
        this.Keylight.SpotLight.angle = Math.PI / 4; // 光线散射角度，最大为Math.PI/2。单位是弧度，默认值：Math.PI/3
        this.Keylight.SpotLight.distance = 1000 // 光源照射的距离。默认值为 0，这意味着光线强度不会随着距离增加而减弱。
        this.Keylight.SpotLight.exponent = 1 // 光强衰减指数。使用 THREE.SpotLight 光源，发射的光线的强度随着光源距离的增加而减弱
        this.Keylight.SpotLight.decay = 1.5 // 沿着光照距离的衰减量
        this.Keylight.SpotLight.penumbra = 0.7 // 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。

        // 更新灯光位置
        this.updateLight()
        // 灯光阴影
        let LightShadowFlag = this.rightMenu.ligntUI.childrenUI.find(item => item.id === 'Shadow').status
        LightShadowFlag && this.LightShadow(true)
        this.scene.add(this.Keylight.SpotLight);
    }
    // 移除主灯光
    removeKeylight() {
        this.scene.remove(this.Keylight.SpotLight)
        this.scene.remove(this.Keylight.DirectionalLight)
    }
    // 更新灯光位置
    updateLight(obj) {
        let x = this.modelSize ? this.modelSize.x * 1 : 0
        let y = this.modelSize ? this.modelSize.y * 1 : 0
        let z = this.modelSize ? this.modelSize.z * 1 : 0
        if (this.AuxiliaryLight) {
            this.AuxiliaryLight.AmbientLight.position.set(0, y * 1.5, 0);
            this.AuxiliaryLight.HemisphereLight.position.set(0, y * 1.5, 0);
            this.AuxiliaryLight.DirectionalLight_XZ.position.set(x * 1.5, y * 0.35, z * 1.5);
            this.AuxiliaryLight.DirectionalLight_XRZ.position.set(x * 1.5, y * 0.35, -z * 1.5);
            this.AuxiliaryLight.DirectionalLight_RXZ.position.set(-x * 1.5, y * 0.35, z * 1.5);
            this.AuxiliaryLight.DirectionalLight_RXRZ.position.set(-x * 1.5, y * 0.35, -z * 1.5);
        }
        if (this.Keylight.SpotLight) {
            this.Keylight.SpotLight.position.set(x ? x + 40 : 17, y ? y * 5 : 45, z ? z + 40 : 27);
            this.Keylight.SpotLight.target = this.model //聚光灯指向cube对象
        }

    }
    // 开启灯光阴影 同时开启模型体接受阴影
    LightShadow(flag) {
        let status = flag ? true : false
        console.log(status, status ? '开启阴影' : '关闭阴影')
        // 开启主灯光阴影
        if (this.Keylight.SpotLight) {
            console.log(status, '主灯光阴影')
            this.Keylight.SpotLight.castShadow = status
            this.Keylight.SpotLight.receiveShadow = status

            this.Keylight.SpotLight.shadow.mapSize.width = 512;  // default
            this.Keylight.SpotLight.shadow.mapSize.height = 512; // default
            // spotLight.shadow.mapSize.width = 1024;
            // spotLight.shadow.mapSize.height = 1024;
            this.Keylight.SpotLight.shadow.radius = 1; // 将此值设置为大于1的值将模糊阴影的边缘。
            // spotLight.shadow.camera.near = 500;
            // spotLight.shadow.camera.far = 4000;
            // spotLight.shadow.camera.fov = 30;
            this.Keylight.SpotLight.shadow.camera.near = 20;    // default
            this.Keylight.SpotLight.shadow.camera.far = 50000     // default
            this.Keylight.SpotLight.shadow.fov = 10;            // default
            this.Keylight.SpotLight.shadow.focus = 1;            // default


        }
        // 开启辅助灯光阴影
        // if (this.AuxiliaryLight.HemisphereLight) {
        //     console.log(status, '辅助灯光阴影')
        //     // this.AuxiliaryLight.AmbientLight.castShadow = status
        //     // this.AuxiliaryLight.HemisphereLight.castShadow = status
        // }
        // 循环开启模型阴影
        let setModelShadow = (model) => {
            // console.log(status, 'model阴影')
            model.children && model.children.forEach(item => {
                if (item.type === "Mesh") {
                    item.castShadow = status //  物体遮挡阴影 
                    // item.receiveShadow = status
                    // console.log(item, 'model')
                }
                if (item.children && item.children.length > 0) {
                    setModelShadow(item)
                }
            })
        }
        // 开启模型阴影
        if (this.model) {
            setModelShadow(this.model)
        }
        // 开启路面接受阴影
        if (this.planeHelper) {
            console.log(status, 'planeHelper阴影')
            // this.planeHelper.castShadow = status
            this.planeHelper.receiveShadow = status // 地面显示阴影
        }
        // 开启网格接受阴影
        if (this.gridHelper) {
            console.log(status, 'gridHelper阴影')
            // this.gridHelper.castShadow = status
            this.gridHelper.receiveShadow = status // 地面显示阴影
        }
    }
    // 关闭灯光阴影
    // 执行渲染
    render() {
        this.renderer.clear()
        this.renderer.render(this.scene, this.camera);
        this.viewHelper && this.viewHelper.render(this.renderer, this.scene, this.camera)
        // 执行标签渲染器
        this.labelRenderer.render(this.scene, this.camera)
    }
    // 重置点击事件 
    cameraReset(cameraPlace) {
        // 重置相机     
        this.camera.position.set(cameraPlace.x, cameraPlace.y, cameraPlace.z); // 重置相机位置     
        this.orbitcontrols.target.set(0, 0, 0);  // 置位控制器目标位置     
        this.orbitcontrols.update(); // 更新控制器     
        this.animate(); // 重新渲染 
    }
    // 窗口变动触发的方法
    onWindowResize() {
        console.log(this.parantDom, 111)
        // 重新设置相机的宽高比
        this.camera.aspect = this.parantDom.offsetWidth / this.parantDom.offsetHeight;
        // 更新相机投影矩阵
        this.camera.updateProjectionMatrix();
        // 更新渲染器大小
        this.renderer.setSize(this.parantDom.offsetWidth, this.parantDom.offsetHeight);
    }

    // 实时刷新
    animate() {
        requestAnimationFrame(this.animate.bind(this)); // 类似于重复执行定时器
        this.render();
    }
}
