var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

// lazy required dependencies
var http;
var spawn;

module.exports = function(paths, options, callback) {
  var watcher = new Watcher(paths, options);
  if (typeof callback === 'function') {
    watcher.on('change', callback);
  }
  return watcher;
};
module.exports.Watcher = Watcher;

function Watcher(paths, options) {
  options || (options = 0);

  // check for command
  var args, command = options.command;
  if (command) {
    args = this.args = this.tokenize(command);
    this.command = args.shift();
    this.on('change', this.runCommand.bind(this));
  }

  // register listener for each path
  paths.forEach(function(path) {
    fs.watch(path, this);
  }, this.emit.bind(this, 'change'));
}

var proto = Watcher.prototype = Object.create(EventEmitter.prototype);

proto.runCommand = function() {
  var command = this.command, args = this.args;
  if (command) {
    if (!this.isCommandRunning) {
      this.isCommandRunning = true;

      var child = (
        spawn || (spawn = require('child_process').spawn) // lazy require spawn
      )(command, args);

      child.stdout.on('data', function(data) {
        process.stdout.write(data);
      });
      child.stderr.on('data', function(data) {
        process.stderr.write(data);
      });
      child.on('exit', function() {
        delete this.isCommandRunning;
        if (this.isCommandRequested) {
          delete this.isCommandRequested;
          this.runCommand();
        }
      }.bind(this));
    }
    else {
      this.isCommandRequested = true;
    }
  }
};

proto.serve = function(port) {
  this.server = (
    http || (http = require('http')) // lazy require http
  ).createServer(this.serveRequest.bind(this));
  this.server.listen(+port || 7357);
};

proto.serveRequest = function(request, response) {

};

proto.tokenize = function(command) {
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
};
