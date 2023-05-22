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
  CylinderGeometry,
  SphereGeometry,
  PointsMaterial,
  AdditiveBlending,
  Points,
  Float32BufferAttribute,
  MathUtils,
  BufferGeometry,
  TextureLoader,
  MeshBasicMaterial,
  Object3D,
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

let plane: THREE.Mesh;
let fireLight: THREE.PointLight;
let fireParticles: THREE.Points;
let log: THREE.Mesh;
let log2: THREE.Mesh;
let stars: THREE.Mesh;
let anchor: THREE.Mesh;

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
    const starGeometry = new BufferGeometry();
    const starMaterial = new PointsMaterial({
      color: 0xffffff,
    });

    const starVertices = [];

    for (let i = 0; i < 1000000; i++) {
      const x = MathUtils.randFloatSpread(2000); // spread in a range of -2000 to 2000 on the x-axis
      const y = MathUtils.randFloatSpread(2000); // spread in a range of -2000 to 2000 on the y-axis
      const z = MathUtils.randFloatSpread(2000); // spread in a range of -2000 to 2000 on the z-axis

      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(starVertices, 3)
    );

    stars = new Points(starGeometry, starMaterial);
    stars.position.set(
      Math.random() * 500 - 250,
      Math.random() * 500 - 250,
      Math.random() * 500 - 250
    );

    anchor = new Object3D();
    scene.add(anchor); // Add the anchor to the scene.

    anchor.add(stars);

    const baseRadius = 22;
    const height = 1;
    const radialSegments = 4; // 4 segments for pyramid shape
    const cubeMaterial = new MeshStandardMaterial({
      color: "silver",
      metalness: 1.2,
      roughness: 1.5,
    });

    const layers = [];

    for (let i = 0; i < 22; i++) {
      let layerGeometry = new CylinderGeometry(
        baseRadius - i,
        baseRadius - i - 1,
        height,
        radialSegments
      );
      let layer = new Mesh(layerGeometry, cubeMaterial);
      layer.position.y = i + height / 2;
      layers.push(layer);
    }

    const planeGeometry = new PlaneGeometry(3, 3);
    const planeMaterial = new MeshLambertMaterial({
      color: "gray",
      emissive: "teal",
      emissiveIntensity: 0.2,
      side: 2,
      transparent: true,
      opacity: 0.4,
    });
    plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotateX(Math.PI / 2);
    plane.receiveShadow = true;

    layers.forEach((layer) => {
      scene.add(layer);
    });
    // Create fire particles
    const particleGeometry = new SphereGeometry(1, 32, 32);
    const particleMaterial = new PointsMaterial({
      color: 0xff4500,
      size: 0.05,
      blending: AdditiveBlending,
      transparent: true,
    });
    fireParticles = new Points(particleGeometry, particleMaterial);
    fireParticles.position.y = 21;
    scene.add(fireParticles);

    // Create fire light
    fireLight = new PointLight(0xff4500, 1, 100);
    fireLight.position.y = 21;
    scene.add(fireLight);
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
    cameraControls.target = plane.position.clone();
    cameraControls.enableDamping = true;
    cameraControls.autoRotate = false;
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

  anchor.rotation.x += 0.001;
  anchor.rotation.y += 0.001;

  if (fireParticles && fireLight) {
    // Animate fire particles
    // Assuming your geometry is an instance of THREE.BufferGeometry:
    // Assuming your geometry is an instance of THREE.BufferGeometry:
    let positions = fireParticles.geometry.attributes.position
      .array as Float32Array;
    let i, j, y;
    for (i = 0, j = 1; i < positions.length; i += 3, j += 3) {
      y = positions[j] + Math.random() * 0.01;
      if (y > 2) {
        y = 0;
      }
      positions[j] = y;
    }
    fireParticles.geometry.attributes.position.needsUpdate = true;

    // Animate fire light to flicker
    fireLight.intensity = 1 + Math.random() * 0.5;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  }

  cameraControls.update();

  renderer.render(scene, camera);
}
