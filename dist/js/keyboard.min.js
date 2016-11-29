document.addEventListener('keydown', function(e) {
  var ev;
  ev = e.code.toLowerCase().replace(/(Key|Arrow)/gim, '');
  KEYS[ev] = true;
  switch (e.keyCode) {
    case 49:
      OBJECTER.controls.setMode("translate");
      break;
    case 50:
      OBJECTER.controls.setMode("rotate");
      break;
    case 51:
      OBJECTER.controls.setMode("scale");
      break;
    case 187:
      OBJECTER.controls.setSize(OBJECTER.controls.size + 0.1);
      break;
    case 189:
      OBJECTER.controls.setSize(Math.max(OBJECTER.controls.size - 0.1, 0.1));
      break;
  }
});

document.addEventListener('keyup', function(e) {
  var ev;
  ev = e.code.toLowerCase().replace(/(Key|Arrow)/gim, '');
  KEYS[ev] = false;
});
