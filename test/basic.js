var assert = require('assert');
var helpers = require('./_helpers');

var child = helpers.runBin(__dirname);
var hasQuit = false;
child.on('exit', function() {
  hasQuit = true;
});

helpers.triggerFSChange(function() {
  assert.ok(hasQuit, 'child process has exited')
});
