// import axios from 'axios';
import * as THREE from 'three';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';
// import { PLYExporter } from 'three/examples/jsm/exporters/PLYExporter';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
// import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

// import gentilis_boldJson from 'three/examples/fonts/gentilis_bold.typeface.json';
export const FontJson = { // 指向public
    //   gentilis_boldJson: '../../../../font/text_font/gentilis_bold.typeface.json'
    gentilis_boldJson: './gentilis_bold.typeface.json'
}
// 字体loader
// export function FontloaderApi(url) {
//     return new Promise((resolve) => {
//         const loader = new THREE.FontLoader();
//         loader.load(url, function (font) {
//             resolve({
//                 status: true,
//                 data: font
//             })
//         });
//     })
// }
/**
 * JS下载
 * @param {*} content ：下载内容
 * @param {*} fileName ：下载文件名
 */
function downLoad(content, fileName) {
    const loadBox = document.createElement('a'); // 创建a标签
    const binaryData = [];
    binaryData.push(content);
    loadBox.download = fileName; // 设置下载文件的文件名
    loadBox.href = window.URL.createObjectURL(
        new Blob(binaryData, {
            type: 'application/zip',
        }),
    );
    loadBox.click(); // 设置点击事件
}

// 只获取后缀名
export function getExtension(name) {
    return name.substring(name.lastIndexOf('.') + 1);
}
// 获取文件名
export function slicFileName(str) {
    const arr = str.split('.');
    const last = arr[arr.length - 1]; // 取最后一个，就是文件名
    return str.substr(0, str.length - last.length - 1);
}
export function dataURItoBlob(base64Data) {
    let byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1]);
    } else {
        byteString = unescape(base64Data.split(',')[1]);
        // const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    }
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
        type: 'image/png',
    });
}

// 下载zip
export const downloadSingleFile = (params, Progress) => {
    // axios({
    //     method: 'get',
    //     url: `/api/file/download?path=${params.path}&fileType=${params.fileType}`,
    //     responseType: 'blob',
    //     onDownloadProgress: (event) => {
    //         Progress && Progress(event, params.fileItem);
    //     },
    // });
}


/**
 * 导出场景中的模型
 * @param {*} format ：导出目标文件格式
 */
export async function exportFromScene(format, allObj) {
    const modelArr = [];

    const container = document.createElement('div');
    container.setAttribute('id', 'modelScene');
    document.body.appendChild(container);
    container.style.display = 'none';
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 300);
    camera.position.set(30, 30, 30);
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.8));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);
    // const raycaster = new THREE.Raycaster();
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    const control = new TransformControls(camera, renderer.domElement);
    control.addEventListener('change', render);
    control.addEventListener('mouseDown', () => { });
    control.addEventListener('mouseUp', (ele) => {
        const mesh = ele.target.object;
        if (mesh.target) {
            mesh.target.position.x = ele.target.object.position.x;
            mesh.target.position.y = ele.target.object.position.y;
            mesh.target.position.z = ele.target.object.position.z;
        }
    });
    control.addEventListener('dragging-changed', (event) => {
        orbit.enabled = !event.value;
    });
    scene.add(control);

    // 获取模型内部数据 ghr 修改了函数形参为allObj => insideObj
    function generateList(insideObj) {
        if (insideObj.fileData) {
            modelArr.push(insideObj.fileData);
        }
        if (insideObj.children && insideObj.children.length > 0) {
            allObj.children.forEach((item) => {
                generateList(item);
            });
        }
    }
    generateList(allObj);
    // 加载模型
    function loadModel() {
        // getImage()
        // that.$store.commit('design/setModelFlag', { type: 'front', statu: true })
    }
    const modelMap = {};
    const manager = new THREE.LoadingManager(loadModel);
    manager.addHandler(/\.dds$/i, new DDSLoader());

    function getModel() {
        return new Promise((resolve) => {
            for (let i = 0; i < modelArr.length; i++) {
                const str = modelArr[i].resourceName;
                const mtlUrl = `${modelArr[i].modelUrl}/${str}.${modelArr[i].type[1]}`;
                const objUrl = `${modelArr[i].modelUrl}/${str}.${modelArr[i].type[0]}`;

                new MTLLoader(manager).load(mtlUrl, (materials) => {
                    materials.preload();
                    new OBJLoader(manager).setMaterials(materials).load(
                        objUrl,
                        async (object) => {
                            modelMap[str] = object;
                            const box = new THREE.Object3D();
                            box.add(object);
                            scene.add(box);
                            if (i === modelArr.length - 1) {
                                resolve({
                                    model: box,
                                    status: true,
                                });
                            }
                        },
                        onProgress,
                        onError,
                    );
                });
            }
        });
    }

    function onProgress() { }

    function onError() { }

    function render() {
        renderer.render(scene, camera);
    }

    return new Promise((resolve) => {
        // obj格式：主要针对场景中导入的obj模型对象，是标准的3D模型文件格式，主要内容以静态多边形模型为主，并附带UV信息及材质路径。
        if (format === 'obj') {
            getModel().then((state) => {
                if (state) {
                    // 1.创建div接收解析的值
                    const floatingDiv = document.createElement('div');
                    floatingDiv.className = 'floating';
                    document.body.appendChild(floatingDiv);
                    // 2.解析scene中模型
                    const exporter = new OBJExporter();
                    const result = exporter.parse(scene);
                    floatingDiv.style.display = 'none';
                    floatingDiv.innerHTML = result.split('\n').join('<br />');
                    // 3.下载
                    downLoad(floatingDiv.innerHTML, `${new Date().getTime()}.obj`);
                    if (document.getElementById('modelScene')) {
                        document.body.removeChild(document.getElementById('modelScene'));
                    }
                    resolve(true);
                }
            });
        }
        // glTF是一种可以减少3D格式中与渲染无关的冗余数据并且在更加适合OpenGL簇加载的一种3D文件格式，支持动画。
        if (format === 'GLTF') {
            const gltfExporter = new GLTFExporter();
            getModel().then((state) => {
                if (state.status) {
                    const options = {
                        trs: false,
                        onlyVisible: true,
                        truncateDrawRange: true,
                        binary: false,
                        maxTextureSize: 4096,
                    };
                    gltfExporter.parse(
                        scene,
                        (result) => {
                            if (result instanceof ArrayBuffer) {
                                downLoad(result, `${new Date().getTime()}.glb`);
                            } else {
                                const output = JSON.stringify(result, null, 2);
                                downLoad(output, `${new Date().getTime()}.gltf`);
                            }
                            if (document.getElementById('modelScene')) {
                                document.body.removeChild(document.getElementById('modelScene'));
                            }
                            resolve(true);
                        },
                        options,
                    );
                }
            });
        }
    });
}




// 模型加载的方法 modelObj={modelUrl,fileName}
// 读取文件大小
const toFriendlySize = (byteSize) => {
    if (!Number.isNaN(byteSize)) {
        if (byteSize < 1024) {
            return byteSize + "b";
        } else if (byteSize < 1024 * 1024) {
            return (byteSize / 1024).toFixed(1) + "k";
        } else if (byteSize < 1024 * 1024 * 1024) {
            return (byteSize / 1024 / 1024).toFixed(1) + "M";
        } else {
            return (byteSize / 1024 / 1024 / 1024).toFixed(1) + "G";
        }
    }
    return "EMPTY";
}

// 加载模型
export const addMoelApi = (model, loaderModel) => {
    console.log(model, 'model')
    return new Promise(async (resolve) => {
        if (model.fileData.resourceType && model.fileData.resourceType === 'glb') {
            const loaderRes = await GLBLoaderApi({
                modelUrl: `${model.fileData.modelUrl}/`,
                fileName: model.fileData.resourceName,
            }, loaderModel);
            if (!loaderRes.status) {
                // this.$message.error('加载失败')
                resolve({
                    message: '加载失败',
                    status: false
                })
                return
            }
            loaderRes.object.scene.name = model.fileData.resourceName
            resolve({
                status: true,
                object: loaderRes.object.scene
            })
            return

        } else if (model.fileData.type.length === 1 && model.fileData.type[0] === 'obj') {
            // 加载obj
            const loaderRes = await ObjLoaderApi({
                modelUrl: `${model.fileData.modelUrl}/`,
                fileName: model.fileData.resourceName,
            }, loaderModel);

            if (!loaderRes.status) {
                // this.$message.error('加载失败')
                resolve({
                    message: '加载失败',
                    status: false
                })
                return
            }
            loaderRes.object.name = model.fileData.resourceName
            resolve({
                status: true,
                object: loaderRes.object
            })
            return
        } else if (model.fileData.type.length === 2 && model.fileData.type[0] === 'obj') {
            // 加载obj mtl
            const loaderRes = await MTLandObjLoaderApi({
                modelUrl: `${model.fileData.modelUrl}/`,
                fileName: model.fileData.resourceName,
            }, loaderModel);
            if (!loaderRes.status) {
                // this.$message.error('加载失败')
                resolve({
                    message: '加载失败',
                    status: false
                })
                return
            }
            loaderRes.object.name = model.fileData.resourceName
            resolve({
                status: true,
                object: loaderRes.object
            })
            return
        } else if (model.fileData.type[0] === 'gltf') {
            // 加载gltf
            const loaderRes = await GLTFLoaderApi({
                modelUrl: `${model.fileData.modelUrl}/`,
                fileName: model.fileData.resourceName,
            }, loaderModel);
            if (!loaderRes.status) {
                this.$message.error('加载失败')
                resolve({
                    message: '加载失败',
                    status: false
                })
                return
            }
            loaderRes.object.scene.name = model.fileData.resourceName
            resolve({
                status: true,
                object: loaderRes.object.scene
            })
            return
        } else {
            console.log('暂不支持')
            resolve({
                message: '暂不支持',
                status: false
            })
            return
        }
    })

}
// 加载obj和mtl方法 
export const MTLandObjLoaderApi = (modelObj, loadModel) =>
    new Promise(async (resolveMTL) => {
        const manager = new THREE.LoadingManager(loadModel);
        const onError = () => {
            resolveMTL({
                message: '加载模型失败',
                status: false,
            });
        };
        const onProgress = (e) => {
            let per = parseInt((e.loaded / e.total * 100))
            let modelSize = toFriendlySize(e.total)
            loadModel({
                per,
                modelSize
            })
        };
        manager.addHandler(/\.dds$/i, new DDSLoader());
        new MTLLoader(manager).load(
            `${modelObj.modelUrl}${modelObj.fileName}.mtl`,
            (materials) => {
                materials.preload();
                new OBJLoader(manager).setMaterials(materials).load(
                    `${modelObj.modelUrl}${modelObj.fileName}.obj`,
                    async (object) => {
                        resolveMTL({
                            message: '加载模型成功',
                            status: true,
                            object,
                        });
                    },
                    onProgress,
                    onError,
                );
            },
        );
    });
// 加载obj方法
export const ObjLoaderApi = (modelObj, loadModel) =>
    new Promise(async (resolveOBJ) => {
        const manager = new THREE.LoadingManager(loadModel);
        const onError = () => {
            resolveOBJ({
                message: '加载模型失败',
                status: false,
            });
        };
        const onProgress = (e) => {
            let per = parseInt((e.loaded / e.total * 100))
            let modelSize = toFriendlySize(e.total)
            loadModel({
                per,
                modelSize
            })
        };
        manager.addHandler(/\.dds$/i, new DDSLoader());
        new OBJLoader(manager).load(
            `${modelObj.modelUrl}${modelObj.fileName}.obj`,
            async (object) => {
                resolveOBJ({
                    message: '加载模型成功',
                    status: true,
                    object,
                });
                // renderModel(object)
            },
            onProgress,
            onError,
        );
    });
// 加载gltf方法
export const GLTFLoaderApi = (modelObj, loadModel) =>
    new Promise(async (resolveGLTF) => {
        const manager = new THREE.LoadingManager(loadModel);
        const onError = () => {
            resolveGLTF({
                message: '加载模型失败',
                status: false,
            });
        };
        const onProgress = (e) => {
            let per = parseInt((e.loaded / e.total * 100))
            let modelSize = toFriendlySize(e.total)
            loadModel({
                per,
                modelSize
            })
        };
        manager.addHandler(/\.dds$/i, new DDSLoader());
        new GLTFLoader(manager).load(
            `${modelObj.modelUrl}${modelObj.fileName}.gltf`,
            async (object) => {
                resolveGLTF({
                    message: '加载模型成功',
                    status: true,
                    object,
                });
            },
            onProgress,
            onError,
        );
    });
// 加载glb方法
export const GLBLoaderApi = (modelObj, loadModel) =>
    new Promise(async (resolveGLTF) => {
        const manager = new THREE.LoadingManager();
        const onError = () => {
            resolveGLTF({
                message: '加载模型失败',
                status: false,
            });
        };
        const onProgress = (e) => {
            console.log(e, '加载模型')
            let per = parseInt((e.loaded / e.total * 100))
            let modelSize = toFriendlySize(e.total)
            loadModel({
                per,
                modelSize
            })
        };
        console.log(`${modelObj.modelUrl}${modelObj.fileName}.glb`, '22222222222222')
        manager.addHandler(/\.dds$/i, new DDSLoader());
        new GLTFLoader(manager).load(
            `${modelObj.modelUrl}${modelObj.fileName}.glb`,
            async (object) => {
                resolveGLTF({
                    message: '加载模型成功',
                    status: true,
                    object,
                });
            },
            onProgress,
            onError,
        );
    });


