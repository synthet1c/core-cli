#!/usr/bin/env node
const program = require('commander')

program
  .action(function() {
    console.log('subcommands two') 
  })
  .parse(process.argv)
