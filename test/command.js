var assert = require('assert');
var helpers = require('./_helpers');

var stdout = '';
var child = helpers.runBin(__dirname, '--command', 'echo foo');
child.on('stdout', function(data) {
  stdout += data;
});

helpers.triggerFSChange(function() {
  child.kill();
  assert.equal('foo', stdout, 'command is executed');
});
