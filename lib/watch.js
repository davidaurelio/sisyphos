var fs = require('fs');

module.exports = watch;

function watch(paths, callback) {
  paths.forEach(function(path) {
    fs.watch(path, callback);
  });
}
