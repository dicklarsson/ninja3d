import * as THREE from "three";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";

var 
  container,
  camera,
  scene, 
  renderer,
  mouseX = 0,
  mouseY = 0,
  windowHalfX = window.innerWidth / 2,
  windowHalfY = window.innerHeight / 2;


// -------------
// Start the app
// -------------

init();
animate();


// --------------
// Give me a name
// --------------

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 250;

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);

  //Load background Sky box

  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    "/backgrounds/1/arid2_ft.jpg",
    "/backgrounds/1/arid2_bk.jpg",
    "/backgrounds/1/arid2_up.jpg",
    "/backgrounds/1/arid2_dn.jpg",
    "/backgrounds/1/arid2_rt.jpg",
    "/backgrounds/1/arid2_lf.jpg"
  ]);
  scene.background = texture;

  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  // model

  var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };

  var onError = function() {};

  var manager = new THREE.LoadingManager();
  manager.addHandler(/\.dds$/i, new DDSLoader());

  // comment in the following line and import TGALoader if your asset uses TGA textures
  // manager.addHandler( /\.tga$/i, new TGALoader() );

  function loady(path, fileName, x, y, z) {
    new MTLLoader(manager)
      .setPath(path)
      .load(fileName + ".mtl", function(materials) {
        materials.preload();

        new OBJLoader(manager)
          .setMaterials(materials)
          .setPath(path)
          .load(
            fileName + ".obj",
            function(object) {
              object.position.set(x, y, z);
              scene.add(object);
            },
            onProgress,
            onError
          );
      });
  }

  loady("/ninja/", "KID_NINJA_KATANA", -180, -50, 0);
  loady("/lego/", "lego obj", -100, -50, -100);
  loady("/lego/", "lego obj", 50, -50, -200);

  //

  renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Add event listeners
  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener("touchmove", onTouchMove, false);
  window.addEventListener("resize", onWindowResize, false);
}


// ----------------
//  Event listeners
// ----------------

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;
}

function onTouchMove(event) {
  const clientX = event.targetTouches[0].clientX;
  const clientY = event.targetTouches[0].clientY;

  mouseX = (clientX - windowHalfX) / 2;
  mouseY = (clientY - windowHalfY) / 2; 

  event.preventDefault(); //Prevent scrolling
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}


// ------------------
// Animate and render
// ------------------

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  camera.position.x += (-mouseX - camera.position.x) * 0.05;
  camera.position.y += (mouseY - camera.position.y) * 0.05;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
