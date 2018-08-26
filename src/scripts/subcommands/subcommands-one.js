#!/usr/bin/env node
const program = require('commander')

program
  .command('test1')
  .action(function() {
    console.log('subcommands test1') 
  })

program
  .command('test2')
  .action(function() {
    console.log('subcommands test2') 
  })

program
  .action(function() {
    console.log('subcommands no test') 
  })
