var Terrain;

Terrain = {

  /*
  		properties
   */
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2(),
  weight: 0.1,
  width: 10,
  height: 10,
  widthSegments: 10,
  heightSegments: 10,
  grid: [],
  color: '0x444444',
  brushColor: '0x00ff00',
  brushSize: 5,
  instrument: 'height',
  modifier: 'ctrlKey',

  /*
  		methods
   */
  create: function(width, height, widthSegments, heightSegments) {
    var color, f, geometry, i, j, len, ref, row;
    if (this.plane) {
      scene.remove(this.plane);
    }
    geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    row = -1;
    ref = geometry.faces;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      f = ref[i];
      if ((i % this.widthSegments) === 0) {
        this.grid.push([]);
        row++;
      }
      color = i % 2 === 0 ? .3 : .4;
      this.grid[row].push(i);
      f.color.setRGB(color, color, color);
    }
    this.plane = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      vertexColors: THREE.FaceColors
    }));
    this.plane.rotation.x = -Math.PI / 2;
    scene.add(this.plane);
    document.addEventListener('mousedown', (function(_this) {
      return function(e) {
        if (e.button === 0) {
          document.addEventListener('mousemove', _this.onMouseMove, false);
        }
        return _this._mouseDown(e);
      };
    })(this));
    document.addEventListener('mouseup', (function(_this) {
      return function() {
        document.removeEventListener('mousemove', _this.onMouseMove, false);
      };
    })(this));
  },
  setColor: function(color) {
    var c, f, i, j, len, ref;
    if (!this.plane) {
      return;
    }
    ref = this.plane.geometry.faces;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      f = ref[i];
      c = GlobalUtils.hexToRgb(color.replace(/0x/gim, ''));
      if (i % 2 === 0) {
        f.color.setRGB(c.r / 255, c.g / 255, c.b / 255);
      } else {
        f.color.setRGB(c.r / 255 + .1, c.g / 255 + .1, c.b / 255 + .1);
      }
    }
    this.plane.geometry.colorsNeedUpdate = true;
    return this.plane.geometry.verticesNeedUpdate = true;
  },
  setWireframe: function(value) {
    if (!this.plane) {
      return;
    }
    this.plane.material.wireframe = value;
  },
  remove: function() {
    if (this.plane) {
      return scene.remove(this.plane);
    }
  },
  _getFace: function(x, y) {},
  _getColorGrid: function(pos) {
    var ceil, size;
    size = this.brushSize;
    ceil = Math.ceil(pos.y - size / 2);
    if (ceil <= 0) {
      size = pos.y;
    }
    return console.log('pidor');
  },
  _getPosiiton: function(faceIndex) {
    var j, pos, ref, row;
    pos = {
      x: 0,
      y: null
    };
    for (row = j = 0, ref = this.heightSegments + 1; 0 <= ref ? j < ref : j > ref; row = 0 <= ref ? ++j : --j) {
      if (row * this.widthSegments * 2 > faceIndex && !pos.y) {
        pos.y = row;
      }
    }
    pos.y -= 1;
    pos.x = this.widthSegments * 2 - ((pos.y + 1) * this.widthSegments * 2 - faceIndex);
    return pos;
  },
  _getActiveFace: function(event) {
    var face, faceIndex, intersects;
    if (!event[Terrain.modifier]) {
      return;
    }
    Terrain.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Terrain.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    Terrain.raycaster.setFromCamera(Terrain.mouse, camera);
    intersects = Terrain.raycaster.intersectObjects([Terrain.plane]);
    if (!intersects || !intersects[0]) {
      return;
    }
    faceIndex = intersects[0].faceIndex;
    face = Terrain.plane.geometry.faces[faceIndex];
    return {
      face: face,
      faceIndex: faceIndex,
      parent: intersects[0]
    };
  },
  _mouseDown: function(event) {
    if (Terrain.instrument === 'color') {
      Terrain._colorEvent(event);
    }
  },
  _heightEvent: function(event) {
    var a, activeFace, b, c;
    activeFace = Terrain._getActiveFace(event);
    if (!activeFace || !activeFace.face) {
      return;
    }
    a = Terrain.plane.geometry.vertices[activeFace.face.a];
    b = Terrain.plane.geometry.vertices[activeFace.face.b];
    c = Terrain.plane.geometry.vertices[activeFace.face.c];
    if (event.shiftKey) {
      a.z -= .1 * parseFloat(Terrain.weight);
      b.z -= .1 * parseFloat(Terrain.weight);
      c.z -= .1 * parseFloat(Terrain.weight);
    } else {
      a.z += .1 * parseFloat(Terrain.weight);
      b.z += .1 * parseFloat(Terrain.weight);
      c.z += .1 * parseFloat(Terrain.weight);
    }
    Terrain.plane.geometry.colorsNeedUpdate = true;
    Terrain.plane.geometry.verticesNeedUpdate = true;
  },
  _getBrushPolygons: function(face) {
    return this._getColorGrid(this._getPosiiton(face.faceIndex));
  },
  _colorEvent: function(event) {
    var activeFace, c;
    activeFace = Terrain._getActiveFace(event);
    if (!activeFace || !activeFace.face) {
      return;
    }
    c = GlobalUtils.hexToRgb(Terrain.brushColor.replace(/0x/gim, ''));
    console.log(activeFace, Terrain._getBrushPolygons(activeFace));
    activeFace.face.color.setRGB(c.r / 255, c.g / 255, c.b / 255);
    Terrain.plane.geometry.colorsNeedUpdate = true;
    Terrain.plane.geometry.verticesNeedUpdate = true;
  },
  onMouseMove: function(event) {
    if (Terrain.instrument === 'height') {
      Terrain._heightEvent(event);
    }
  }
};

alert('f');
