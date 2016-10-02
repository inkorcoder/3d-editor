var mainAside;

mainAside = new Vue({
  el: '#main-aside',
  data: {
    isActive: OPTIONS.leftAside,
    searchModel: '',
    filtered: 0,
    instrument: 'terrain',
    terrain: Terrain,
    data: DATA,
    lists: GlobalUtils.createTriggerObject(DATA, true, 'name'),
    brushTabs: {
      height: true,
      color: false,
      plaining: false
    }
  },
  methods: {
    createArrayFromData: function(type) {
      var i, len, o, ref, res;
      res = [];
      ref = this.$data.objects;
      for (i = 0, len = ref.length; i < len; i++) {
        o = ref[i];
        if (o.type === type) {
          res.push(o);
        }
      }
      return res;
    },
    clearInput: function() {
      this.$data.searchModel = "";
    },
    toggleAside: function() {
      this.$data.isActive = !this.$data.isActive;
      mainHeader.isLeft = this.$data.isActive;
    },
    toggleList: function(str) {
      this.lists[str] = !this.lists[str];
    },
    showAllLists: function() {
      GlobalUtils.toggleTriggerObject(DATA, this.lists, true, 'name');
    },
    hideAllLists: function() {
      GlobalUtils.toggleTriggerObject(DATA, this.lists, false, 'name');
    },
    showTerrainPopup: function() {
      terrainAddPopup.isActive = true;
    },
    setColorPopupCaller: function(event) {
      if (!this.$data.terrain.plane) {
        return;
      }
      colorPopup.caller = event.target;
      return colorPopup.isActive = true;
    },
    setTerrainColor: function(event) {
      Terrain.setColor(event.target.value);
    },
    setWireframe: function(event) {
      return this.$data.terrain.setWireframe(event.target.checked);
    },
    setActiveBrushTab: function(tab) {
      var property;
      for (property in this.$data.brushTabs) {
        this.$data.brushTabs[property] = false;
      }
      this.$data.brushTabs[tab] = true;
      this.$data.terrain.instrument = tab;
    }
  }
});
