var mainHeader;

mainHeader = new Vue({
  el: '#main-header',
  data: {
    isLeft: mainAside.isActive,
    isRight: objectAside.isActive,
    log: log,
    isPlaying: false,
    tabs: {
      terrain: false,
      objects: true
    },
    theme: OPTIONS.theme,
    axis: AXIS,
    objecter: OBJECTER
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
      LOG.add('GUI :: Active tab is ' + tab);
    },
    setTheme: function(name) {
      this.$data.theme = name;
    },
    toggleAxis: function() {
      this.$data.axis.visible = !this.$data.axis.visible;
      LOG.add("GUI :: Axis helper was " + (this.$data.axis.visible ? 'enabled' : 'disabled'));
    },
    toggleLog: function() {
      this.$data.log.isActive = !this.$data.log.isActive;
      LOG.add("GUI :: Console was " + (this.$data.log.isActive ? 'enabled' : 'disabled'));
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
