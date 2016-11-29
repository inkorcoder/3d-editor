var objectAside, separatorMove;

Vue.filter('isEmpty', function(objs) {
  var i, len, o, res;
  res = [];
  for (i = 0, len = objs.length; i < len; i++) {
    o = objs[i];
    if (o.name !== '') {
      res.push(o);
    }
  }
  return res;
});

objectAside = new Vue({
  el: '#object-aside',
  data: {
    isActive: OPTIONS.rightAside,
    separatorPosition: 40,
    object: OBJECT,
    log: log,
    objectPositionX: OBJECT.position.x,
    objectPositionY: OBJECT.position.y,
    objectPositionZ: OBJECT.position.z,
    objectRotationX: OBJECT.rotation.x,
    objectRotationY: OBJECT.rotation.y,
    objectRotationZ: OBJECT.rotation.z,
    objectScaleX: OBJECT.scale.x,
    objectScaleY: OBJECT.scale.y,
    objectScaleZ: OBJECT.scale.z,
    objectMaterialType: '',
    objectMaterialReflectivity: 0.1,
    objectMaterialOpacity: 1,
    objectMaterialTransparent: false,
    objectMaterialColor: '',
    objectMaterialEmissive: '',
    hierarchy: scene.children
  },
  methods: {
    setRotationX: function(event, reset) {
      this.$data.object.rotation.x = event.target.value * (Math.PI / 180);
    },
    setRotationY: function() {
      this.$data.object.rotation.y = event.target.value * (Math.PI / 180);
    },
    setRotationZ: function() {
      this.$data.object.rotation.z = event.target.value * (Math.PI / 180);
    },
    setScaleX: function() {
      this.$data.object.scale.x = event.target.value;
    },
    setScaleY: function() {
      this.$data.object.scale.y = event.target.value;
    },
    setScaleZ: function() {
      this.$data.object.scale.z = event.target.value;
    },
    setPositionX: function() {
      this.$data.object.position.x = event.target.value;
    },
    setPositionY: function() {
      this.$data.object.position.y = event.target.value;
    },
    setPositionZ: function() {
      this.$data.object.position.z = event.target.value;
    },
    setMaterialType: function(str) {
      this.$data.objectMaterialType = str;
    },
    setMaterialReflectivity: function() {
      this.$data.objectMaterialReflectivity = event.target.value;
    },
    setMaterialOpacity: function() {
      this.$data.objectMaterialOpacity = event.target.value;
    },
    setColorPopupCaller: function(event) {
      colorPopup.caller = event.target;
      return colorPopup.isActive = true;
    },
    toggleAside: function() {
      this.$data.isActive = !this.$data.isActive;
      mainHeader.isRight = this.$data.isActive;
    },
    separatorUp: function() {
      this.$data.separatorPosition = 10 / window.innerHeight * 100;
    },
    separatorDown: function() {
      this.$data.separatorPosition = 100 - (10 / window.innerHeight * 100);
    },
    setVisible: function(obj) {
      return OBJECTER.setVisible(obj);
    },
    removeItem: function(obj) {
      return OBJECTER.remove(obj);
    }
  }
});

separatorMove = function(e) {
  var pos;
  pos = e.pageY / window.innerHeight * 100;
  if (e.pageY <= 10) {
    pos = 10 / window.innerHeight * 100;
  }
  if (e.pageY + 10 >= window.innerHeight) {
    pos = 100 - (10 / window.innerHeight * 100);
  }
  objectAside.separatorPosition = pos;
};

document.addEventListener('mousedown', function(e) {
  if (e.target.id === 'separator') {
    document.body.classList.add('dragged');
    return document.addEventListener('mousemove', separatorMove);
  }
});

document.addEventListener('mouseup', function() {
  document.body.classList.remove('dragged');
  return document.removeEventListener('mousemove', separatorMove);
});
