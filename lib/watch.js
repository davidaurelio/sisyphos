var fs = require('fs');
var spawn = require('child_process').spawn;

module.exports = watch;

// tokenizes a string according to shell rules.
function tokenize(command) {
  var chr, quote;
  var capture = '', tokens = [];
  for (var i = 0, len = command.length; i < len; i++) {
    chr = command.charAt(i);
    if (chr === quote) {
      quote = void 0;
    }
    else if ((chr === '"' || chr === "'") && !quote) {
      quote = chr;
    }
    else if (!quote && /\s/.test(chr)) {
      if (capture) {
        tokens.push(capture);
      }
      capture = '';
    }
    else if (chr === '\\') {
      i += 1;
      capture += command.charAt(i);
    } else {
      capture += chr;
    }
  }
  if (quote) {
    throw Error('Unclosed quote: ' + quote);
  }
  if (capture) {
    tokens.push(capture);
  }
  return tokens;
}

function watch(paths, options, callback) {
  // check for command
  var command = options.command;
  var commandArgs, isCommandRunning, isCommandRequested;
  if (command) {
    commandArgs = tokenize(command);
    command = commandArgs.shift();
  }

  // listener for dir/file changes
  function onChange() {
    // spawn sub command
    if (command) {
      if (!isCommandRunning) {
        isCommandRunning = true;

        (function spawnChild() {
          var child = spawn(command, commandArgs);
          child.stdout.on('data', function(data) {
            process.stdout.write(data);
          });
          child.stderr.on('data', function(data) {
            process.stderr.write(data);
          });
          child.on('exit', function() {
            isCommandRunning = false;
            if (isCommandRequested) {
              spawnChild();
            }
          });
        }());
      }
    }

    // execute callback function
    if (callback instanceof Function) {
      callback();
    }
  }

  // register listener for each path
  paths.forEach(function(path) {
    fs.watch(path, onChange);
  });
}
