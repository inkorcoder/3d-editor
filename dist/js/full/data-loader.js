var DataLoader, app, dialog, electron, fs, remote;

if (typeof require !== 'undefined') {
  electron = require('electron') || void 0;
}

if (electron) {
  app = electron.app;
  remote = electron.remote;
  dialog = electron.dialog;
  fs = require('fs');
}

DataLoader = {
  parseFolder: function(folder) {
    var tmp;
    tmp = {
      name: folder.replace(/( |\ )/gim, ''),
      files: []
    };
    fs.readdir('./files/' + folder, function(err, bytesRead, buffer) {
      var file, i, len, results;
      if (bytesRead && bytesRead.length > 0) {
        results = [];
        for (i = 0, len = bytesRead.length; i < len; i++) {
          file = bytesRead[i];
          results.push(tmp.files.push(file));
        }
        return results;
      }
    });
    DATA.push(tmp);
  },
  load: function() {
    fs.readdir('./files', function(err, folders, buffer) {
      var folder, i, len;
      for (i = 0, len = folders.length; i < len; i++) {
        folder = folders[i];
        DataLoader.parseFolder(folder);
      }
    });
  }
};

window.DATA = [];

if (!electron) {
  window.DATA = [
    {
      name: 'primitives',
      files: ['primitives/box', 'primitives/circle', 'primitives/cone', 'primitives/plane', 'primitives/ring', 'primitives/sphere']
    }, {
      name: 'Plants',
      files: ['plants/tree1', 'plants/tree2', 'plants/tree3', 'plants/tree4', 'plants/tree5', 'plants/stone1', 'plants/stone2', 'plants/stone3', 'plants/stone4', 'plants/stone5', 'plants/shrub1', 'plants/shrub2', 'plants/shrub3', 'plants/shrub4', 'plants/shrub5', 'plants/birch', 'plants/birch-tree', 'plants/oak', 'plants/pine', 'plants/pine-tree', 'plants/flo-camomile', 'plants/flo-narcissus', 'plants/flo-tuilp-red', 'plants/flo-tuilp-yellow', 'plants/grass1', 'plants/grass2', 'plants/grass3']
    }
  ];
} else {
  DataLoader.load();
}
