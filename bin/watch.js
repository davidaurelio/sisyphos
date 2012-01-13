#!/usr/bin/env node
require('watch')(process.argv.slice(2), function() {
  process.exit(0);
});
