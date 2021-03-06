var mainHeader;

mainHeader = new Vue({
  el: '#main-header',
  data: {
    isLeft: mainAside.isActive,
    isRight: objectAside.isActive,
    isPlaying: false,
    tabs: {
      terrain: true,
      objects: false
    }
  },
  methods: {
    toggleLeftAside: function() {
      mainAside.isActive = !mainAside.isActive;
      return mainHeader.isLeft = mainAside.isActive;
    },
    toggleRightAside: function() {
      objectAside.isActive = !objectAside.isActive;
      return mainHeader.isRight = objectAside.isActive;
    },
    toggleAside: function() {
      this.$data.isAsideActive = !this.$data.isAsideActive;
    },
    togglePlaying: function() {
      return this.$data.isPlaying = !this.$data.isPlaying;
    },
    setActiveTab: function(tab) {
      var property;
      for (property in this.$data.tabs) {
        this.$data.tabs[property] = false;
      }
      this.$data.tabs[tab] = true;
      mainAside.instrument = tab;
    }
  },
  watch: {
    'isLeft': function(newVal, oldVal) {
      vueRenderer.setOffset(newVal, null);
    },
    'isRight': function(newVal, oldVal) {
      vueRenderer.setOffset(null, newVal);
    }
  }
});
