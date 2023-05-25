import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshBasicMaterial({ color: "blue" });
const material2 = new THREE.MeshBasicMaterial({ color: "red" });
const material3 = new THREE.MeshBasicMaterial({ color: "green" });
const cube1 = new THREE.Mesh(geometry, material1);
const cube2 = new THREE.Mesh(geometry, material2);
const cube3 = new THREE.Mesh(geometry, material3);

cube1.position.x = 2;
cube1.position.z = 0.1;
cube2.position.x = -2;
cube2.position.z = 1.4;

scene.add(cube1);
scene.add(cube2);
scene.add(cube3);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
cube1.lookAt(camera.position);
cube2.lookAt(camera.position);
cube3.lookAt(camera.position);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
