var terrainAddPopup;

terrainAddPopup = new Vue({
  el: '#terrain-add-popup',
  data: {
    isActive: false,
    terrain: Terrain
  },
  methods: {
    addTerrain: function() {
      Terrain.create(this.$data.terrain.width, this.$data.terrain.height, this.$data.terrain.widthSegments, this.$data.terrain.heightSegments);
      return this.closePopup();
    },
    closePopup: function() {
      return this.$data.isActive = false;
    }
  }
});
