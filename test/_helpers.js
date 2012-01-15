var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var BIN = path.join(__dirname, '..', 'bin', 'sisyphos');
var TMPFILE = path.join(__dirname, 'tmp');

exports.runBin = function() {
  var args = [].slice.call(arguments);
  console.warn('Running %s %s', BIN, args.join(' '));
  return spawn(BIN, args);
};

exports.triggerFSChange = function() {
  if (path.exists(TMPFILE)) {
    fs.unlinkSync(TMPFILE);
  }
  else {
    fs.writeFileSync(TMPFILE, '');
  }
};
