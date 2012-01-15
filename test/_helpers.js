var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var BIN = path.join(__dirname, '..', 'bin', 'sisyphos');
var TMPFILE = path.join(__dirname, 'tmp');

exports.runBin = function() {
  var args = [].slice.call(arguments);
  return spawn(BIN, args);
};

exports.triggerFSChange = function(callback) {
  function listener() {
    setTimeout(callback, 1000);
  }
  setTimeout(function() {
    if (path.existsSync(TMPFILE)) {
      fs.unlink(TMPFILE, listener);
    }
    else {
      fs.writeFile(TMPFILE, 'foo', listener);
    }
  }, 100);
};
