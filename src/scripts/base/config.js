const colors = require('colors')
const fs = require('fs')
const inquirer = require('inquirer')
const path = require('path')
const program = require('commander')
const exec = require('child_process').exec
const Listr = require('listr')

const configFileName = (process.env.HOME || process.env.HOMEPATH) + '/.coredna'
const writeConfig = config => fs.writeFileSync(configFileName, JSON.stringify(config, null, 2))
const readConfig = () => JSON.parse(fs.readFileSync(configFileName, 'utf-8')) || {}

program
  .command('config')
  .description('Set your config')
  .option(`--account <account>`, `Your agencies bitbucket account name ${colors.cyan('(string)')}`)
  .option(`--ssh [ssh]`, `Do you use an ssh private key for bitbucket ${colors.cyan('(bool)')}`)
  .option(`--username <account>`, `Bitbucket username ${colors.cyan('(string)')}`)
  .action(function(options) {

    const configFileName = (process.env.HOME || process.env.HOMEPATH) + '/.coredna'
    // create config file if it doesn't exist
    if (!fs.existsSync(configFileName)) {
      writeConfig({})
    }
    // get the config file from the home directory
    const config = readConfig()
    
    // handle options being set in the command
    if (typeof(options.account) !== 'undefined' 
    || typeof(options.ssh) !== 'undefined' 
    || typeof(options.username) !== 'undefined'
    ) {
      try {
        if (options.ssh) {
          var ssh = JSON.parse(options.ssh)
        }
      } catch (e) {
        throw new Error(`ssh needs to be a boolean (true|false|0|1)`) 
      }
      return writeConfig({ 
        account: typeof options.account !== 'undefined' ? options.account : config.account, 
        ssh: typeof ssh === 'boolean' ? ssh : config.ssh, 
        username: typeof options.username !== 'undefined' ? options.username : config.username, 
      })
    }
    
    console.log('')
    // if no options provided use the config wizard
    return inquirer.prompt([
      {
        name: 'account',
        type: 'input',
        message: `${colors.magenta('account')}: `,
        default: config.account || 'synthet1c',
        prefix: `  ${colors.cyan('~')}`,
        suffix: 'Your agencies bitbucket account name'
      },
      /*
      {
        name: 'ssh',
        type: 'confirm',
        message: `${colors.magenta('ssh')}: `,
        default: typeof(config.ssh) === 'boolean' ? config.ssh : true,
        prefix: `  ${colors.cyan('~')}`,
        suffix: `Have you set up a public key for bitbucket`,
      },
      */
      {
        name: 'username',
        type: 'input',
        message: `${colors.magenta('username')}: `,
        default: config.username || 'synthet1c',
        prefix: `  ${colors.cyan('~')}`,
        suffix: `Your bitbucket username`
      },
    ])
      .then(answers => {
        const command = `ssh -T git@bitbucket.org`          
        console.log('')
        const tasks = new Listr([
          {
            title: 'Checking ssh connection to bitbucket',
            task: (ctx, task) => new Promise((res) => {
              exec(command, function(error, stdout, stderr) {
                if (error) {
                  console.log("exec error: " + error)
                } 
                answers.ssh = /logged in as/.test((stdout || stderr))
                writeConfig(answers) 
                res(answers.ssh)
              })
            })
          }
        ])
        tasks.run()
          .then(() => {
            console.log('')
            if (!answers.ssh) {
              console.log(`  ${colors.yellow.underline('No SSH keys detected')}`)            
              console.log('')
              console.log('  Setting up ssh for your bitbucket account will prevent you from')
              console.log('  having to enter your password on every commit')
              console.log('  See bitbucket\'s documentation about how to install a key:')
              console.log('')
              console.log(`  ${colors.cyan('https://confluence.atlassian.com/bitbucket/set-up-an-ssh-key-728138079.html')}`)
              console.log('')            
            }
            console.log(`  Thanks for that! Your information has been saved to ${colors.cyan(configFileName)}`)
            console.log('')
          })
      })
  })
  .on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ deploy exec sequential')
    console.log('    $ deploy exec async')
    console.log()
  })
