#!/usr/bin/env node
var options = require('nomnom')

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
