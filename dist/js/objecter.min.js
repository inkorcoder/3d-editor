var OBJECTER;

OBJECTER = {
  materials: {
    green: new THREE.MeshPhongMaterial({
      color: 0x428B23
    }),
    brown: new THREE.MeshPhongMaterial({
      color: 0x231401
    })
  },
  raycaster: new THREE.Raycaster(),
  objects: [],
  object: null,
  randomRotation: true,
  randomScale: true,
  activeObject: '',
  setActiveObject: function(str) {
    if (this.activeObject === str) {
      return;
    }
    this.activeObject = str;
    LOG.add("Objecter :: spawn object now is [" + str + "].");
  },
  createPrimitiveGeometry: function(str) {
    var geometry;
    switch (str) {
      case 'box':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'circle':
        geometry = new THREE.CircleGeometry(1, 16);
        break;
      case 'plane':
        geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        break;
      case 'ring':
        geometry = new THREE.RingGeometry(0.5, 1, 16);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(1, 16, 16);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(1, 2, 16);
    }
    LOG.add('Objecter :: creating ' + str + ' geometry...');
    return {
      geometry: geometry,
      name: str
    };
  },
  createPrimitive: function(geometryObject, material) {
    var mesh;
    mesh = new THREE.Mesh(geometryObject.geometry, material);
    mesh.name = geometryObject.name;
    mesh.material.color.setRGB(.5, .5, .5);
    return mesh;
  },
  add: function(path, event) {
    var mesh, type;
    if (path.match(/primitives/gim)) {
      type = path.split('/')[1];
      mesh = this.createPrimitive(this.createPrimitiveGeometry(type), this.materials.phong);
      scene.add(mesh);
      Terrain.setObjectOrigin(mesh, event, this.randomRotation, this.randomScale);
      LOG.add('Objecter :: new primitive object created from ' + type + ' geometry.');
      this.objects.push(mesh);
    } else {
      LOADER.json.load('files/' + path + '/' + path.split('/')[1] + '.json', (function(_this) {
        return function(geometry, materials) {
          mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
          LOG.add('Objecter :: new object created from [' + path + '].');
          mesh.name = path.split('/')[1];
          scene.add(mesh);
          Terrain.setObjectOrigin(mesh, event, _this.randomRotation, _this.randomScale);
          _this.objects.push(mesh);
        };
      })(this));
    }
  },
  remove: function(obj) {
    var i, j, len, object, ref;
    ref = this.objects;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      object = ref[i];
      if (object && object.uuid && (object.uuid === obj.uuid)) {
        this.objects.splice(i);
      }
    }
    LOG.add('Objecter :: object [' + obj.name + '] (' + obj.uuid + ') was removed.');
    scene.remove(obj);
    OBJECTER.controls.detach();
  },
  setVisible: function(obj) {
    obj.visible = !obj.visible;
    LOG.add("Objecter :: object [" + obj.name + "] (" + obj.uuid + ") was " + (obj.visible ? 'showed' : 'hiddened') + ".");
  },
  getOject: function(x, y) {
    var intersects, mouse;
    mouse = new THREE.Vector2();
    mouse.x = (x / renderer.domElement.width) * 2 - 1;
    mouse.y = -(y / renderer.domElement.height) * 2 + 1;
    this.raycaster.setFromCamera(mouse, camera);
    intersects = this.raycaster.intersectObjects(this.objects);
    if (intersects[0]) {
      return intersects[0].object;
    } else {
      return null;
    }
  },
  bind: function(obj) {}
};

OBJECTER.controls = new THREE.TransformControls(camera, renderer.domElement);

scene.add(OBJECTER.controls);

OBJECTER.controls.enabled = true;

renderer.domElement.addEventListener('mousedown', function(e) {
  var object;
  if (!e.ctrlKey) {
    return;
  }
  if (mainHeader.tabs.terrain) {
    return;
  }
  if (!Terrain.plane) {
    return;
  }
  object = OBJECTER.getOject(e.clientX, e.clientY);
  if (object) {
    controls.enabled = false;
    OBJECTER.controls.attach(object);
    objectAside.object = object;
    LOG.add("Objecter :: binding controls to [" + object.name + "] (" + object.uuid + ")");
  } else {
    if (!OBJECTER.controls.object) {
      if (OBJECTER.activeObject) {
        OBJECTER.add(OBJECTER.activeObject, e);
      }
    }
    OBJECTER.controls.detach();
    controls.enabled = true;
    LOG.add("Objecter :: controls was unbinded.");
  }
});

renderer.domElement.addEventListener('mousemove', function(e) {
  var ref;
  if (!e.ctrlKey) {
    return;
  }
  if (mainHeader.tabs.terrain) {
    return;
  }
  if (!Terrain.plane) {
    return;
  }
  if (OBJECTER.activeObject && (.3 < (ref = Math.random()) && ref < .6)) {
    OBJECTER.add(OBJECTER.activeObject, e);
  }
});
