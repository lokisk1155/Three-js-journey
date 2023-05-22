import GUI from "lil-gui";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Clock,
  GridHelper,
  LoadingManager,
  Mesh,
  MeshLambertMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  PointLightHelper,
  Scene,
  WebGLRenderer,
} from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import * as animations from "./helpers/animations";
import { toggleFullScreen } from "./helpers/fullscreen";
import { resizeRendererToDisplaySize } from "./helpers/responsiveness";
import "./style.css";

const CANVAS_ID = "scene";

let canvas: HTMLElement;
let renderer: WebGLRenderer;
let scene: Scene;
let loadingManager: LoadingManager;
let ambientLight: AmbientLight;
let pointLight: PointLight;
let cube: Mesh;
let camera: PerspectiveCamera;
let cameraControls: OrbitControls;
let dragControls: DragControls;
let axesHelper: AxesHelper;
let pointLightHelper: PointLightHelper;
let clock: Clock;
let stats: Stats;
let gui: GUI;

const animation = { enabled: false, play: true };

init();
animate();

function init() {
  // ===== 🖼️ CANVAS, RENDERER, & SCENE =====
  {
    canvas = document.querySelector(`canvas#${CANVAS_ID}`)!;
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    scene = new Scene();
  }

  // ===== 👨🏻‍💼 LOADING MANAGER =====
  {
    loadingManager = new LoadingManager();

    loadingManager.onStart = () => {
      console.log("loading started");
    };
    loadingManager.onProgress = (url, loaded, total) => {
      console.log("loading in progress:");
      console.log(`${url} -> ${loaded} / ${total}`);
    };
    loadingManager.onLoad = () => {
      console.log("loaded!");
    };
    loadingManager.onError = () => {
      console.log("❌ error while loading");
    };
  }

  // ===== 💡 LIGHTS =====
  {
    ambientLight = new AmbientLight("white", 0.4);
    pointLight = new PointLight("#ffdca8", 1.2, 100);
    pointLight.position.set(-2, 3, 3);
    pointLight.castShadow = true;
    pointLight.shadow.radius = 4;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 4000;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    scene.add(ambientLight);
    scene.add(pointLight);
  }

  // ===== 📦 OBJECTS =====
  {
    const layer0Geometry = new BoxGeometry(22, 1, 22);
    const cubeGeometry = new BoxGeometry(21, 1, 21);
    const layer2Geometry = new BoxGeometry(20, 1, 20);
    const layer3Geometry = new BoxGeometry(19, 1, 19);
    const layer4Geometry = new BoxGeometry(18, 1, 18);
    const layer5Geometry = new BoxGeometry(17, 1, 17);
    const layer6Geometry = new BoxGeometry(16, 1, 16);
    const layer7Geometry = new BoxGeometry(15, 1, 15);
    const layer8Geometry = new BoxGeometry(14, 1, 14);
    const layer9Geometry = new BoxGeometry(13, 1, 13);
    const layer10Geometry = new BoxGeometry(12, 1, 12);
    const layer11Geometry = new BoxGeometry(11, 1, 11);
    const layer12Geometry = new BoxGeometry(10, 1, 10);
    const layer13Geometry = new BoxGeometry(9, 1, 9);
    const layer14Geometry = new BoxGeometry(8, 1, 8);
    const layer15Geometry = new BoxGeometry(7, 1, 7);
    const layer16Geometry = new BoxGeometry(6, 1, 6);
    const layer17Geometry = new BoxGeometry(5, 1, 5);
    const layer18Geometry = new BoxGeometry(4, 1, 4);
    const layer19Geometry = new BoxGeometry(3, 1, 3);
    const layer20Geometry = new BoxGeometry(2, 1, 2);
    const layer21Geometry = new BoxGeometry(1, 1, 1);

    const cubeMaterial = new MeshStandardMaterial({
      color: "silver",
      metalness: 1.2,
      roughness: 1.5,
    });
    const layer0 = new Mesh(layer0Geometry, cubeMaterial);
    const layer2 = new Mesh(layer2Geometry, cubeMaterial);
    const layer3 = new Mesh(layer3Geometry, cubeMaterial);
    const layer4 = new Mesh(layer4Geometry, cubeMaterial);
    const layer5 = new Mesh(layer5Geometry, cubeMaterial);
    const layer6 = new Mesh(layer6Geometry, cubeMaterial);
    const layer7 = new Mesh(layer7Geometry, cubeMaterial);
    const layer8 = new Mesh(layer8Geometry, cubeMaterial);
    const layer9 = new Mesh(layer9Geometry, cubeMaterial);
    const layer10 = new Mesh(layer10Geometry, cubeMaterial);
    const layer11 = new Mesh(layer11Geometry, cubeMaterial);
    const layer12 = new Mesh(layer12Geometry, cubeMaterial);
    const layer13 = new Mesh(layer13Geometry, cubeMaterial);
    const layer14 = new Mesh(layer14Geometry, cubeMaterial);
    const layer15 = new Mesh(layer15Geometry, cubeMaterial);
    const layer16 = new Mesh(layer16Geometry, cubeMaterial);
    const layer17 = new Mesh(layer17Geometry, cubeMaterial);
    const layer18 = new Mesh(layer18Geometry, cubeMaterial);
    const layer19 = new Mesh(layer19Geometry, cubeMaterial);
    const layer20 = new Mesh(layer20Geometry, cubeMaterial);
    const layer21 = new Mesh(layer21Geometry, cubeMaterial);
    cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.position.y = 0.5;

    const planeGeometry = new PlaneGeometry(3, 3);
    const planeMaterial = new MeshLambertMaterial({
      color: "gray",
      emissive: "teal",
      emissiveIntensity: 0.2,
      side: 2,
      transparent: true,
      opacity: 0.4,
    });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotateX(Math.PI / 2);
    plane.receiveShadow = true;
    cube.position.y = 1;
    layer2.position.y = 2;
    layer3.position.y = 3;
    layer4.position.y = 4;
    layer5.position.y = 5;
    layer6.position.y = 6;
    layer7.position.y = 7;
    layer8.position.y = 8;
    layer9.position.y = 9;
    layer10.position.y = 10;
    layer11.position.y = 11;
    layer12.position.y = 12;
    layer13.position.y = 13;
    layer14.position.y = 14;
    layer15.position.y = 15;
    layer16.position.y = 16;
    layer17.position.y = 17;
    layer18.position.y = 18;
    layer19.position.y = 19;
    layer20.position.y = 20;
    layer21.position.y = 21;
    scene.add(layer0);
    scene.add(layer2);
    scene.add(layer3);
    scene.add(layer4);
    scene.add(layer5);
    scene.add(layer6);
    scene.add(layer7);
    scene.add(layer8);
    scene.add(layer9);
    scene.add(layer10);
    scene.add(layer11);
    scene.add(layer12);
    scene.add(layer13);
    scene.add(layer14);
    scene.add(layer15);
    scene.add(layer16);
    scene.add(layer17);
    scene.add(layer18);
    scene.add(layer19);
    scene.add(layer20);
    scene.add(layer21);
    scene.add(cube);
    scene.add(plane);
  }

  // ===== 🎥 CAMERA =====
  {
    camera = new PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(2, 2, 5);
  }

  // ===== 🕹️ CONTROLS =====
  {
    cameraControls = new OrbitControls(camera, canvas);
    cameraControls.target = cube.position.clone();
    cameraControls.enableDamping = true;
    cameraControls.autoRotate = true;
    cameraControls.update();

    // Full screen
    window.addEventListener("dblclick", (event) => {
      if (event.target === canvas) {
        toggleFullScreen(canvas);
      }
    });
  }

  // ===== 🪄 HELPERS =====
  {
    axesHelper = new AxesHelper(4);
    axesHelper.visible = false;
    scene.add(axesHelper);

    pointLightHelper = new PointLightHelper(pointLight, undefined, "orange");
    pointLightHelper.visible = false;
    scene.add(pointLightHelper);

    const gridHelper = new GridHelper(20, 20, "teal", "darkgray");
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);
  }

  // ===== 📈 STATS & CLOCK =====
  {
    clock = new Clock();
    stats = new Stats();
    document.body.appendChild(stats.dom);
  }
}

function animate() {
  requestAnimationFrame(animate);

  stats.update();

  if (animation.enabled && animation.play) {
    animations.rotate(cube, clock, Math.PI / 3);
    animations.bounce(cube, clock, 1, 0.5, 0.5);
  }

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cameraControls.update();

  renderer.render(scene, camera);
}
