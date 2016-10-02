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
      name: 'animals',
      files: ['file 1.js', 'file2.json']
    }, {
      name: 'animals2',
      files: ['file 1.js', 'file2.json']
    }, {
      name: 'animals3',
      files: ['file 1.js', 'file2.json']
    }, {
      name: 'animals4',
      files: ['file 1.js', 'file2.json']
    }, {
      name: 'animals5',
      files: ['file 1.js', 'file2.json']
    }
  ];
} else {
  DataLoader.load();
}
