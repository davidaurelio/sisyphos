#!/usr/bin/env node
var options = require('nomnom')

  .printer(function(message) {
    process.stderr.write(message + '\n');
    process.exit(1); // make sure `while` does not continue
  })

  .option('path', {
    position: 0,
    list: true,
    required: true,
    help: 'The path(s) to watch. At least one path is required.'
  })

  .option('command', {
    type: 'string',
    abbr: 'c',
    metavar: 'COMMAND',
    help: 'Executes COMMAND on file changes. Disables exit on change.'
  })

  .parse();

var exitOnChange = !options.command

require('watch')(options._, options, exitOnChange ? process.exit : null);
