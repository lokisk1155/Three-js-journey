import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { PositionalAudio } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// audio

const audioListener = new THREE.AudioListener();

const audioLoader = new THREE.AudioLoader();

const sound = new PositionalAudio(audioListener);

audioLoader.load("./song.mp3 ", function (buffer) {
  sound.setBuffer(buffer);
  sound.setRefDistance(20);
  sound.play();
});

scene.add(sound);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
// door
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
// bricks
const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);
// grass
const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

// House
const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(8, 4.5, 8),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 2;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(6.5, 2.5, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 5.5;
house.add(roof);

// Define the material using the brick texture
const battlementMaterial = new THREE.MeshStandardMaterial({
  map: bricksColorTexture,
  aoMap: bricksAmbientOcclusionTexture,
  normalMap: bricksNormalTexture,
  roughnessMap: bricksRoughnessTexture,
});

const battlements = [];

// Crenellations
const merlonGeometry = new THREE.ConeGeometry(0.5, 1.5, 4);
const crenelGeometry = new THREE.ConeGeometry(0.5, 0.75, 4);

for (let i = 0; i < 8; i++) {
  // Merlon (higher section)
  const merlon = new THREE.Mesh(merlonGeometry, battlementMaterial);
  merlon.rotation.y = Math.PI * 0.25;
  merlon.position.y = 6.75;
  merlon.position.x = Math.sin((Math.PI / 4) * i) * 7;
  merlon.position.z = Math.cos((Math.PI / 4) * i) * 7;
  house.add(merlon);
  battlements.push(merlon); // add merlon to array

  // Add a point light to the merlon
  const pointLight = new THREE.PointLight(0xffaa00, 1, 10);
  pointLight.position.set(
    merlon.position.x,
    merlon.position.y + 0.75,
    merlon.position.z
  );
  scene.add(pointLight);

  // Crenel (lower section)
  const crenel = new THREE.Mesh(crenelGeometry, battlementMaterial);
  crenel.rotation.x = Math.PI;
  crenel.position.y = 6.375;
  crenel.position.x = Math.sin((Math.PI / 4) * i + Math.PI / 8) * 7;
  crenel.position.z = Math.cos((Math.PI / 4) * i + Math.PI / 8) * 7;
  house.add(crenel);
  battlements.push(crenel); // add crenel to array
}

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = 4 + 0.01;
house.add(door);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

let toggle = false;
let colorToggle = false;
for (let i = 0; i < 40; i++) {
  const angle = Math.random() * Math.PI * 2; // Random angle
  const radius = 5 + Math.random() * 20; // Random radius
  const x = Math.cos(angle) * radius; // Get the x position using cosinus
  const z = Math.sin(angle) * radius; // Get the z position using sinus

  // Create the mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.castShadow = true;

  // Position
  grave.position.set(x, 0.3, z);

  // Rotation
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;

  // Add to the graves container

  if (i % 2 === 0) {
    if (toggle) {
      const newGhostColor = colorToggle ? "#0000ff" : "#ff0000";
      colorToggle = !colorToggle;
      const newGhost = new THREE.PointLight(newGhostColor, 15, 15);
      grave.add(newGhost);
      toggle = false;
    } else {
      toggle = true;
    }
  }
  graves.add(grave);
}

// Ghosts
const ghost1 = new THREE.PointLight("#ff00ff", 15, 15);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 15, 15);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#ffff00", 15, 15);
scene.add(ghost3);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
grassColorTexture.repeat.set(12, 12);
grassAmbientOcclusionTexture.repeat.set(18, 18);
grassNormalTexture.repeat.set(18, 18);
grassRoughnessTexture.repeat.set(18, 18);
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// House light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Fog
 */
const fog = new THREE.Fog("#262837", 1, 20);
scene.fog = fog;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Orbit and spin each merlon and crenel
  for (let i = 0; i < battlements.length; i++) {
    const battlement = battlements[i];
    const orbitRadius = 7 + (i % 2) * 0.5; // alternate between two radii for merlons and crenels
    const speed = 0.05; // same speed for all battlements
    const phaseShift = (Math.PI * 2 * i) / battlements.length; // different starting point for each battlement
    const angle = elapsedTime * speed + phaseShift;

    battlement.rotation.y += 0.01; // spin on own axis
    battlement.position.x = Math.sin(angle) * orbitRadius; // orbit house
    battlement.position.z = Math.cos(angle) * orbitRadius;
  }

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
