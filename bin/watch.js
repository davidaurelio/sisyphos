#!/usr/bin/env node
var options = require('nomnom')
  .option('command', {
    abbr: 'c',
    metavar: 'COMMAND',
    help: 'Executes COMMAND on file changes. Disables exit on change.'
  })

  .parse();

var exitOnChange = !options.command

require('watch')(options._, options, exitOnChange ? process.exit : null);
