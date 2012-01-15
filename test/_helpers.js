var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var BIN = path.join(__dirname, '..', 'bin', 'watch.js');
var TMPFILE = path.join(__dirname, 'tmp');

exports.runBin = function() {
  return spawn(BIN, [].call(arguments));
};

expors.triggerFsChange = function() {
  if (path.exists(TMPFILE)) {
    fs.unlinkSync(TMPFILE);
  }
  else {
    fs.writeFileSync(TMPFILE, '');
  }
};
