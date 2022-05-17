import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

window.addEventListener('DOMContentLoaded', () => {
  const app = new App3();
  app.init();
  app.render();
  app.keyDown();
  app.keyUp();
  app.ontouch();
  app.touchend();

},false);

class App3{
  static get SIZES(){
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }
  static get SIGNATURE_COLOR(){
    return {
      gray:     0x9c9cac,
      purple:   0xaf8fac,
      lavender: 0x946ca8,
      orange:   0xedd59f,
	    white:    0xd8d0d1,
    }
  }
  static get RENDERER_PARAM(){
    return {
      alpha: true,
      antialias: true,
    }
  }
  static get CAMERA_PARAM(){
    return {
      fov: 60,
      aspect: App3.SIZES.width / App3.SIZES.height,
      near: 1,
      far: 4000,
    }
  }

  constructor(){
    this.renderer;
    this.scene;
    this.camera;
    this.hemisphereLight;
    this.directionalLight;
    this.boxGeometry;
    this.meshPhongMaterial;
    this.mesh;
    this.controls;
    this.axesHelper;
    this.clouds;
    this.sky;
    this.isDown = false;
    this.isTouch = false;
    this.render = this.render.bind(this);
    
  }

  createRenderer(){
    this.renderer = new THREE.WebGLRenderer(App3.RENDERER_PARAM);
    this.renderer.setSize(App3.SIZES.width, App3.SIZES.height);
    const container = document.getElementById("webgl");
    container.appendChild(this.renderer.domElement);
  }

  createScene(){
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(App3.SIGNATURE_COLOR.orange, 100, 1000);
  }

  createCamera(){
    this.camera = new THREE.PerspectiveCamera(
      App3.CAMERA_PARAM.fov,
      App3.CAMERA_PARAM.aspect,
      App3.CAMERA_PARAM.near,
      App3.CAMERA_PARAM.far,
    );
    this.camera.position.set(-100, 500, 600);
  }

  createLights(){
    this.hemisphereLight  = new THREE.HemisphereLight(App3.SIGNATURE_COLOR.gray, App3.SIGNATURE_COLOR.purple, 1);
    this.directionalLight = new THREE.DirectionalLight(App3.SIGNATURE_COLOR.lavender, .9);
    this.directionalLight.position.set(1, 0.55, 5);

    this.scene.add(this.hemisphereLight);
    this.scene.add(this.directionalLight);
  }

  init(){
    this.createRenderer();
    this.createScene();
    this.createCamera();
    this.createSky();
    this.createLights();
    this.resize();
  }

  render(){
    if(this.isDown)this.sky.rotation.z  += 0.001;
    if(this.isTouch)this.sky.rotation.z += 0.001;
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  }

  resize(){
    window.addEventListener('resize', () => {
      this.renderer.setSize(App3.SIZES.width, App3.SIZES.height);
      this.camera.aspect = App3.SIZES.width / App3.SIZES.height;
      this.camera.updateProjectionMatrix();
    }, false);
  }

  helper(){
    const axesBarLength = 500.0;
    this.axesHelper = new THREE.AxesHelper(axesBarLength);
    this.scene.add(this.axesHelper);
  }
  controls(){ 
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  createCloud(){
    this.clouds = new THREE.Group();
    this.boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    this.meshPhongMaterial = new THREE.MeshPhongMaterial({color: App3.SIGNATURE_COLOR.white});
    
    let blocks = 3 + Math.floor(Math.random() * 3);
    for(let i = 0; i < blocks; i++){
      const mesh = new THREE.Mesh(this.boxGeometry, this.meshPhongMaterial);
      mesh.position.x = i * 12;
      mesh.position.y = Math.random() * 10;
      mesh.position.z = Math.random() * 10;
      mesh.rotation.y = Math.random() * Math.PI * 2;
      mesh.rotation.z = Math.random() * Math.PI * 2;
      let size = 0.1 + Math.random() * 1.0;
      mesh.scale.set(size, size, size);
      this.clouds.add(mesh);
    }
  }

  createSky(){
    this.sky = new THREE.Group();
    const CLOUDS = 100;
    const cloudsArray = [];
    const stepAngle = Math.PI * 2 / CLOUDS;
    for(let i = 0; i < CLOUDS; i++){
      this.createCloud();
      cloudsArray.push(this.clouds);
      let angle = stepAngle * i;
      let radius = 500 + Math.random() * 200;
      cloudsArray[i].position.x = Math.cos(angle) * radius;
      cloudsArray[i].position.y = Math.sin(angle) * radius;
      cloudsArray[i].position.z = (-400 -Math.random() * 400) / 2.0 + 400;
      this.sky.add(cloudsArray[i]);
    }
    this.scene.add(this.sky);
  }

  keyDown(){
    window.addEventListener('keydown', (event) => {
      switch(event.key){
        case " ":
          this.isDown = true;
          break;
        default:
          break;
      }
    }, false);
  }

  keyUp(){
    window.addEventListener('keyup', (event) => {
      this.isDown = false;
    }, false);
  }

  ontouch(){
    window.addEventListener('touchstart', () => {
      this.isTouch = true;
  
    }, false);
  }

  touchend(){
    window.addEventListener('touchend', () => {
      this.isTouch = false;
    }, false);
  }
  
}