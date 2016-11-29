var infoBar;

infoBar = new Vue({
  el: '#info-bar',
  data: {
    camera: {
      position: camera.position,
      rotation: camera.rotation
    },
    fps: 0
  }
});
