var Terrain;

Terrain = {
  width: 10,
  height: 10,
  widthSegments: 10,
  heightSegments: 10,
  grid: [],
  plane: null,
  geometry: null,
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2(),
  weight: 0.1,
  color: '0x444444',
  brushColor: '0x00ff00',
  brushSize: 5,
  instrument: 'height',
  modifier: 'ctrlKey',

  /* Create new grid.
  			-> width 					[int] - width size
  			-> height 				[int] - height size
  			-> widthSegments 	[int] - number of width cells
  			-> heightSegments [int] - number of height cells
  			<= nothing
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
      if ((i % (this.widthSegments * 2)) === 0) {
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
    this.geometry = this.plane.geometry;
    this.plane.rotation.x = -Math.PI / 2;
    scene.add(this.plane);
    document.addEventListener('mousedown', (function(_this) {
      return function(e) {
        if (e.button === 0) {
          document.addEventListener('mousemove', _this.mouseMove, false);
        }
        return _this.mouseDown(e);
      };
    })(this));
    document.addEventListener('mouseup', (function(_this) {
      return function() {
        document.removeEventListener('mousemove', _this.mouseMove, false);
      };
    })(this));
  },

  /* Setting plane color
  			-> color 					[hex] - Three.js-color (0xrrggbb)
  			<= nothing
   */
  setColor: function(color) {
    var c, f, i, j, len, ref;
    if (!this.plane) {
      return;
    }
    ref = this.geometry.faces;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      f = ref[i];
      c = GlobalUtils.hexToRgb(color.replace(/0x/gim, ''));
      if (i % 2 === 0) {
        f.color.setRGB(c.r / 255, c.g / 255, c.b / 255);
      } else {
        f.color.setRGB(c.r / 255 + .1, c.g / 255 + .1, c.b / 255 + .1);
      }
    }
    this.geometry.colorsNeedUpdate = true;
    this.geometry.verticesNeedUpdate = true;
  },

  /* Setting plane color
  			-> value 					[bool] - Three.js-color (0xrrggbb)
  			<= nothing
   */
  setWireframe: function(value) {
    if (!this.plane) {
      return;
    }
    this.plane.material.wireframe = value;
  },

  /* Removing plane from scene
  			-> nothing
  			<= nothing
   */
  remove: function() {
    if (this.plane) {
      scene.remove(this.plane);
    }
  },

  /*------------------------------------------------------------- */

  /* Getting sub-grid from current face
  			-> position 			[obj{x,y}] - position on grid
  			<= grid 					[obj{sub-grid,position}] - sub grid from brush
   */
  _getColorGrid: function(pos) {
    var y;
    y = Math.ceil(pos.y - this.brushSize / 2);
    y = y <= 0 ? 0 : y;
    return {
      array: this.grid.slice(y, pos.y + Math.ceil(this.brushSize / 2)),
      pos: pos
    };
  },

  /* Getting position on the grid from current face index
  			-> face index 		[int] - face index from plane faces array
  			<= position 			[obj{x,y}] - position on the grid
   */
  _getPosition: function(faceIndex) {
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

  /* Getting current face index
  			-> event 					[obj] - mouse event object
  			<= face 					[obj{x,y}] - face,  face index and
   */
  _getFace: function(event) {
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

  /* Getting current face index
  			-> event 					[obj] - mouse event object
  			<= nothing
   */
  _heightEvent: function(event) {
    var a, activeFace, b, c;
    activeFace = Terrain._getFace(event);
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

  /* Getting sub grid from brush
  			-> event 					[obj] - face object from _getPosition method
  			<= sub grid 			[obj] result of _getPosition method
   */
  _getBrushPolygons: function(face) {
    return this._getColorGrid(this._getPosition(face.faceIndex));
  },

  /* Binding color event
  			-> event 					[obj] - mouse event
  			<= nothing
   */
  _colorEvent: function(event) {
    var activeFace;
    activeFace = Terrain._getFace(event);
    if (!activeFace || !activeFace.face) {
      return;
    }
    Terrain._paint(Terrain._getBrushPolygons(activeFace));
  },

  /* Binding plaining event
  			-> event 					[obj] - mouse event
  			<= nothing
   */
  _plainingEvent: function(event) {
    var activeFace;
    activeFace = Terrain._getFace(event);
    if (!activeFace || !activeFace.face) {
      return;
    }
    Terrain._plain(Terrain._getBrushPolygons(activeFace), event);
  },

  /* Painting event
  			-> sub grid 			[obj] - sub grid under brush
  			<= nothing
   */
  _paint: function(grid) {
    var color, face, j, k, len, len1, primaryX, primaryY, ref, sqrt, sqrtCoef, x, y;
    color = GlobalUtils.hexToRgb(Terrain.brushColor.replace(/0x/gim, ''));
    ref = grid.array;
    for (j = 0, len = ref.length; j < len; j++) {
      y = ref[j];
      for (k = 0, len1 = y.length; k < len1; k++) {
        x = y[k];
        primaryX = this._getPosition(x).x - grid.pos.x;
        primaryY = this._getPosition(x).y - grid.pos.y;
        sqrt = Math.sqrt(primaryX * primaryX + primaryY * primaryY);
        sqrtCoef = sqrt / (this.brushSize / 2);
        if (this._getPosition(x).x > grid.pos.x - Math.ceil(this.brushSize / 2) && this._getPosition(x).x < grid.pos.x + Math.ceil(this.brushSize / 2) && this.brushSize / 2 > sqrt) {
          face = Terrain.plane.geometry.faces[x];
          face.color.setRGB(face.color.r * sqrtCoef + (1 - sqrtCoef) * (color.r / 255), face.color.g * sqrtCoef + (1 - sqrtCoef) * (color.g / 255), face.color.b * sqrtCoef + (1 - sqrtCoef) * (color.b / 255));
          this.geometry.colorsNeedUpdate = true;
          this.geometry.verticesNeedUpdate = true;
        }
      }
    }
  },

  /* Plaining event
  			-> sub grid 			[obj] - sub grid under brush
  			-> event 					[obj] - mouse event
  			<= nothing
   */
  _plain: function(grid, event) {
    var a, b, c, f, height, j, k, l, len, len1, len2, pa, pb, pc, planeFaces, primaryFace, primaryX, primaryY, ref, sqrt, sqrtCoef, x, y;
    primaryFace = null;
    planeFaces = [];
    ref = grid.array;
    for (j = 0, len = ref.length; j < len; j++) {
      y = ref[j];
      for (k = 0, len1 = y.length; k < len1; k++) {
        x = y[k];
        primaryX = this._getPosition(x).x - grid.pos.x;
        primaryY = this._getPosition(x).y - grid.pos.y;
        sqrt = Math.sqrt(primaryX * primaryX + primaryY * primaryY);
        sqrtCoef = sqrt / (this.brushSize / 2);
        if (this._getPosition(x).x > grid.pos.x - Math.ceil(this.brushSize / 2) && this._getPosition(x).x < grid.pos.x + Math.ceil(this.brushSize / 2) && this.brushSize / 2 > sqrt) {
          if (this._getPosition(x).x === grid.pos.x && this._getPosition(x).y === grid.pos.y) {
            primaryFace = Terrain.plane.geometry.faces[x];
          } else {
            planeFaces.push(Terrain.plane.geometry.faces[x]);
          }
        }
      }
    }
    for (l = 0, len2 = planeFaces.length; l < len2; l++) {
      f = planeFaces[l];
      a = this.geometry.vertices[f.a];
      b = this.geometry.vertices[f.b];
      c = this.geometry.vertices[f.c];
      pa = this.geometry.vertices[primaryFace.a];
      pb = this.geometry.vertices[primaryFace.b];
      pc = this.geometry.vertices[primaryFace.c];
      height = event.shiftKey ? Math.min(pa.z, pb.z, pc.z) : Math.max(pa.z, pb.z, pc.z);
      a.z = height;
      b.z = height;
      c.z = height;
    }
    this.geometry.colorsNeedUpdate = true;
    this.geometry.verticesNeedUpdate = true;
  },

  /*------------------------------------------------------------- */
  mouseMove: function(event) {
    if (Terrain.instrument === 'height') {
      Terrain._heightEvent(event);
    }
    if (Terrain.instrument === 'color') {
      Terrain._colorEvent(event);
    }
    if (Terrain.instrument === 'plaining') {
      Terrain._plainingEvent(event);
    }
  },
  mouseDown: function(event) {
    if (Terrain.instrument === 'height') {
      Terrain._heightEvent(event);
    }
    if (Terrain.instrument === 'color') {
      Terrain._colorEvent(event);
    }
    if (Terrain.instrument === 'plaining') {
      Terrain._plainingEvent(event);
    }
  }

  /*------------------------------------------------------------- */
};
