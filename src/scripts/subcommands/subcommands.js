#!/usr/bin/env node
const program = require('commander')

program
  .description('Subcommand manager')
  .command('one', 'Do subcommand one')
  .command('two', 'Do subcommand two')
