var AXIS, INSTRUMENT, KEYS, LOADER, OBJ, OBJECT, OPTIONS, RENDER, ambient, asideWidth, camera, colorPopup, controls, cube, geometry, i, imgLoader, lastTime, light, loader, mainHeader, material, onWindowResize, projector, random, render, renderer, scene, stats, vueRenderer;

colorPopup = {};

mainHeader = {};

vueRenderer = {};

OPTIONS = {
  leftAside: true,
  rightAside: true,
  theme: 'skin'
};

RENDER = {
  isPlaying: false
};

INSTRUMENT = '';

asideWidth = {
  left: 200,
  right: 200
};

OBJECT = new THREE.Object3D();

LOADER = {
  json: new THREE.JSONLoader()
};

projector = new THREE.Projector();

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);

AXIS = new THREE.AxisHelper(200);

scene.add(AXIS);

OBJ = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshNormalMaterial());

scene.add(OBJ);

renderer = new THREE.WebGLRenderer();

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('renderWrapper').appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);

random = function(min, max) {
  var rand;
  return rand = min + Math.random() * (max - min);
};

document.addEventListener('contextmenu', function(e) {
  return e.preventDefault();
});

geometry = new THREE.BoxGeometry(10, 10, 10);

material = new THREE.MeshNormalMaterial();

loader = new THREE.JSONLoader();

imgLoader = new THREE.TextureLoader();

cube = new THREE.Object3D();

light = new THREE.PointLight(0xbbbbbb, 1, 1000);

ambient = new THREE.AmbientLight(0xbbbbbb);

light.position.set(100, 100, 100);

scene.add(light);

scene.add(ambient);

camera.position.x = 0;

camera.position.y = 2;

camera.position.z = 5;

KEYS = {};

stats = new Stats();

stats.showPanel(0);

document.body.appendChild(stats.dom);

lastTime = new Date().getTime();

i = 0;

render = function() {
  var difference, newTime;
  requestAnimationFrame(render);
  stats.begin();
  newTime = new Date().getTime();
  difference = newTime - lastTime;
  lastTime = newTime;
  if (window.infoBar && i % 10 === 1) {
    infoBar.fps = difference;
  }
  if (KEYS.w) {
    controls.pan(new THREE.Vector2(0, 10));
  }
  if (KEYS.s) {
    controls.pan(new THREE.Vector2(0, -10));
  }
  if (KEYS.a) {
    controls.pan(new THREE.Vector2(10, 0));
  }
  if (KEYS.d) {
    controls.pan(new THREE.Vector2(-10, 0));
  }
  renderer.render(scene, camera);
  controls.update();
  stats.end();
  return i++;
};

setTimeout(function() {
  LOG.add('Start rendering...');
  return render();
}, 2000);

onWindowResize = function(e) {
  vueRenderer.setViewport();
};

window.addEventListener('resize', onWindowResize, false);
