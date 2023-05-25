import {
  AmbientLight,
  AxesHelper,
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
  Vector3,
} from "three";
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
let camera: PerspectiveCamera;
let cameraControls: OrbitControls;
let axesHelper: AxesHelper;
let pointLightHelper: PointLightHelper;
let clock: Clock;
let stats: Stats;
let plane: THREE.Mesh;
let fireLight: THREE.PointLight;
let fireParticles: THREE.Points;
let stars: THREE.Points;
let anchor: THREE.Points;
let cameraAnchor: THREE.Points;

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

    for (let i = 0; i < 100000; i++) {
      const x = MathUtils.randFloatSpread(2000); // spread in a range of -2000 to 2000 on the x-axis
      const y = MathUtils.randFloatSpread(2000); // spread in a range of -2000 to 2000 on the y-axis
      const z = MathUtils.randFloatSpread(2000); // spread in a range of -2000 to 2000 on the z-axis

      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(starVertices, 3)
    );

    // create stars
    stars = new Points(starGeometry, starMaterial);
    stars.position.set(
      Math.random() * 500 - 250,
      Math.random() * 500 - 250,
      Math.random() * 500 - 250
    );

    // anchor for stars
    anchor = new Points(starGeometry, starMaterial);
    scene.add(anchor);

    // anchor for camera
    cameraAnchor = new Points(starGeometry, starMaterial);
    scene.add(cameraAnchor); // Add the anchor to the scene.

    // attach stars to anchor
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

    // build em up
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
    let temp1 = new CylinderGeometry(23, 22, height, radialSegments);
    let temp2 = new Mesh(temp1, cubeMaterial);
    temp2.position.y = -0.5;
    layers.push(temp2);

    const planeGeometry = new PlaneGeometry(3, 3);
    const planeMaterial = new MeshLambertMaterial({
      color: "black",
      emissive: "black",
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
      size: 0.2,
      blending: AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });

    fireParticles = new Points(particleGeometry, particleMaterial);
    fireParticles.position.y = 21;
    scene.add(fireParticles);

    // Create fire light
    fireLight = new PointLight(0xff4500, 1, 65);
    fireLight.position.set(0, 21, 0);
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
    camera.position.set(15, 50, 50);
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
  animations.rotate(camera, clock, Math.PI / 3);
  anchor.rotation.x += 0.000001;
  anchor.rotation.y += 0.00001;
  cameraAnchor.rotation.y += 0.01;
  camera.lookAt(new Vector3(0, 0, 0));

  if (fireParticles && fireLight) {
    // Animate fire particles
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

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  }

  cameraControls.update();

  renderer.render(scene, camera);
}
