import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { gsap } from "gsap";
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
const modelArray = [];


//Load Models
// 1)
gltfLoader.load("/models/1/1.glb", (glb) => {
  //Increasing the number of vertices
  const samplerMesh = new MeshSurfaceSampler(glb.scene.children[0]).build();
  const particlesNumber = 5000;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesArray = new Float32Array(particlesNumber * 3);
  for (let i = 0; i < particlesNumber; i++) {
    const position = new THREE.Vector3();
    samplerMesh.sample(position);
    particlesArray.set(
      [position.x, position.y, position.z],
      i * 3
    );
  }
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlesArray, 3));

  //Changing model into particles
  glb.scene.children[0] = new THREE.Points(
    particlesGeometry,
    new THREE.RawShaderMaterial({
      vertexShader: vShader,
      fragmentShader: fShader,
      uniforms: {
        u_color_1: { value: new THREE.Color(firstModelColor1) },
        u_color_2: { value: new THREE.Color(firstModelColor2) },
        u_scale: { value: 0 },
      },
      depthTest: false,
      blending: THREE.AdditiveBlending,
    })
  );


  glb.scene.children[0].scale.set(0.7, 0.7, 0.7);
  glb.scene.children[0].position.x = 0.5;
  glb.scene.children[0].rotation.y = Math.PI * 0.5;
  scene.add(glb.scene);
  modelArray[0] = glb.scene;
});

// 2)
gltfLoader.load("/models/1/2.glb", (glb) => {
  //Increasing the number of vertices
  const samplerMesh = new MeshSurfaceSampler(glb.scene.children[0]).build();
  const particlesNumber = 5000;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesArray = new Float32Array(particlesNumber * 3);
  for (let i = 0; i < particlesNumber; i++) {
    const position = new THREE.Vector3();
    samplerMesh.sample(position);
    particlesArray.set(
      [position.x, position.y, position.z],
      i * 3
    );
  }
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlesArray, 3));


  //Changing model into particles
  glb.scene.children[0] = new THREE.Points(
    particlesGeometry,
    new THREE.RawShaderMaterial({
      vertexShader: vShader,
      fragmentShader: fShader,
      uniforms: {
        u_color_1: { value: new THREE.Color(secondModelColor1) },
        u_color_2: { value: new THREE.Color(secondModelColor2) },
        u_scale: { value: 0 },
      },
      depthTest: false,
      blending: THREE.AdditiveBlending,
    })
  );


  glb.scene.children[0].scale.set(0.3, 0.3, 0.3);
  glb.scene.children[0].rotation.x = -Math.PI * 0.5;
  glb.scene.children[0].position.y = -0.2;
  glb.scene.children[0].rotation.z = -Math.PI * 0.5;
  modelArray[1] = glb.scene;
});

//OrbitControl
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

// Button click listeners
buttons[0].addEventListener("click", () => {
  gsap.to(modelArray[0].children[0].material.uniforms.u_scale, {
    value: 1,
    duration: 1,
  });
  gsap.to(modelArray[1].children[0].material.uniforms.u_scale, {
    value: 0,
    duration: 1,
    onComplete: () => {
      scene.remove(modelArray[1]);
    },
  });
  scene.add(modelArray[0]);
})

buttons[1].addEventListener("click", () => {
  gsap.to(modelArray[1].children[0].material.uniforms.u_scale, {
    value: 1,
    duration: 1,
  });
  gsap.to(modelArray[0].children[0].material.uniforms.u_scale, {
    value: 0,
    duration: 1,
    onComplete: () => {
      scene.remove(modelArray[0]);
    },
  });
  scene.add(modelArray[1]);
})

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
