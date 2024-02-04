import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import vShader from "./shaders/vertex.glsl";
import fShader from "./shaders/fragment.glsl";

//elements
const buttons = document.getElementsByTagName("a");

//GLTFLoader
const gltfLoader = new GLTFLoader();
//DRACOLoader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

//Scene
const scene = new THREE.Scene();

//Resizing
window.addEventListener("resize", () => {
  //Update Size
  aspect.width = window.innerWidth;
  aspect.height = window.innerHeight;

  //New Aspect Ratio
  camera.aspect = aspect.width / aspect.height;
  camera.updateProjectionMatrix();

  //New RendererSize
  renderer.setSize(aspect.width, aspect.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Camera
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  30,
  aspect.width / aspect.height,
  0.01,
  100
);
camera.position.z = 10;
scene.add(camera);

//Renderer
const canvas = document.querySelector(".draw");
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setClearColor("#444444", 1.0);
renderer.setSize(aspect.width, aspect.height);

const firstModelColor1 = "red";
const firstModelColor2 = "yellow";
const secondModelColor1 = "blue";
const secondModelColor2 = "white";


//Load Models
// 1)
gltfLoader.load("/models/1/1.glb", (glb) => {
  //Changing model into particles
  glb.scene.children[0] = new THREE.Points(
      glb.scene.children[0].geometry,
      new THREE.RawShaderMaterial({
          vertexShader: vShader,
          fragmentShader: fShader,
          uniforms: {
              u_color_1: { value: new THREE.Color(firstModelColor1) },
              u_color_2: { value: new THREE.Color(firstModelColor2) },
          },
          depthTest: false,
          blending: THREE.AdditiveBlending,
      })
  );


  glb.scene.children[0].scale.set(0.7, 0.7, 0.7);
  glb.scene.children[0].position.x = 0.5;
  glb.scene.children[0].rotation.y = Math.PI * 0.5;
  scene.add(glb.scene);
});

// 2)
gltfLoader.load("/models/1/2.glb", (glb) => {
  //Changing model into particles
  glb.scene.children[0] = new THREE.Points(
      glb.scene.children[0].geometry,
      new THREE.RawShaderMaterial({
        vertexShader: vShader,
        fragmentShader: fShader,
        uniforms: {
          u_color_1: { value: new THREE.Color(secondModelColor1) },
          u_color_2: { value: new THREE.Color(secondModelColor2) },
        },
        depthTest: false,
        blending: THREE.AdditiveBlending,
      })
  );


  glb.scene.children[0].scale.set(0.3, 0.3, 0.3);
  glb.scene.children[0].rotation.x = -Math.PI * 0.5;
  glb.scene.children[0].position.y = -0.2;
  glb.scene.children[0].rotation.z = -Math.PI * 0.5;
  scene.add(glb.scene);
});

//OrbitControl
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

//Clock Class
const clock = new THREE.Clock();

const animate = () => {
  //getElapsedTime
  const elapsedTime = clock.getElapsedTime();

  //Update Controls
  orbitControls.update();

  //Renderer
  renderer.render(scene, camera);

  //RequestAnimationFrame
  window.requestAnimationFrame(animate);
};
animate();
