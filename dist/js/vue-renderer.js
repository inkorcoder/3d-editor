var vueRenderer;

vueRenderer = new Vue({
  el: '#renderWrapper',
  data: {
    isOffsetLeft: false,
    isOffsetRight: false
  },
  methods: {
    setOffset: function(left, right) {
      if (left !== null) {
        this.$data.isOffsetLeft = left;
      }
      if (right !== null) {
        this.$data.isOffsetRight = right;
      }
    },
    setViewport: function() {
      var rect, width;
      width = window.innerWidth;
      rect = document.getElementById('renderWrapper').getBoundingClientRect();
      renderer.setSize(width, rect.height);
      camera.aspect = width / rect.height;
      camera.updateProjectionMatrix();
    }
  },
  watch: {
    'isOffsetLeft': function() {
      return vueRenderer.setViewport();
    },
    'isOffsetRight': function() {
      return vueRenderer.setViewport();
    }
  }
});
