const program = require('commander')
const inquirer = require('inquirer')
const { modules, packages } = require('../../modules')
const installFork = require('../../install-fork')
const installBase = require('../../install-base')
const installModule = require('../../install-module-subtree')
const installPackage = require('../../install-package')
const { sequence } = require('../../utils')
const Listr = require('listr')

program
  .command('init')
  .description('init a new site')
  .action(function() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'site_name',
        message: 'What\'s the site url',
        // validate: x => /www\.\w+/.test(x) || 'please provide the full url eg www.site.com',
        filter: x => x.replace(/(^www\.|[^a-z0-9]+)/g, ''),
      },
      {
        type: 'confirm',
        name: 'should_fork',
        message: 'Do you want to create your own fork',
        default: false,
      },
      {
        type: 'confirm',
        name: 'make_private',
        message: 'Do you want the fork to be private',
        default: true,
        when: answers => answers.should_fork
      },
      // list all modules
      {
        type: 'checkbox',
        message: 'Which modules would you like to install',
        name: 'modules',
        choices: Object.keys(modules),
      },
      // list all packages from each module
      ...Object.keys(modules).map(module => ({
        // only display the question if the module has been included
        when: answers => answers.modules.includes(module),
        type: 'checkbox',
        message: `${module} features`,
        name: `packages.${module}`,
        choices: modules[module].packages,
      })),
      {
        type: 'list',
        message: 'What build system do you use',
        name: 'build_system',
        choices: [
          { name: 'webpack' },
          { name: 'gulp' },
          { name: 'grunt', disabled: 'Oh hellz no' },
        ],
        validate: answers => answers.length || 'You must choose a build system.',
      },
    ])
      .then(({ site_name, modules, packages, should_fork, make_private }) => {
        
        console.log({ site_name, modules, packages, should_fork, make_private })
        
        const modulePromises = modules.map(
          module => ({
            title: `Installing module ${module}`,
            task: () => installModule(module, site_name)
          }) 
        )
        const packagePromises = modules.reduce((acc, module) => {
          console.log(`Installing module ${module}`)
          return acc.concat(packages[module].map(
            package => {
              console.log(`Installing package ${module} ${package}`)
              return ({
                title: `Installing package ${module} ${package}`,
                task: () => installPackage(package, site_name)
              })
            } 
          ))
        }
        , [])
        
        // install the site with the configuration from above
        const tasks = new Listr([
          {
            title: 'Fork base repo',
            skip: () => !should_fork,
            task: (ctx, task) => {
              task.title = `Forking base repo` 
              return installFork(site_name, make_private)
                .then(() => {
                  task.title = `Forked base repo`
                })
            } 
          },
          {
            title: `Install site into ./${site_name}`,
            task: (ctx, task) => {
              task.title = `Installing site into ./${site_name}`
              return installBase(site_name, should_fork)
                .then(() => {
                  task.title = `Installed site into ./${site_name}`
                })
            }
          },
          {
            title: 'Install Modules',
            skip: () => !modulePromises.length,
            task: (ctx, task) => {
              task.title = `Installing modules`
              return new Listr(modulePromises) 
            }
          },
          {
            title: 'Install Packages',
            skip: () => !packagePromises.length,
            task: (ctx, task) => {
              task.title = `Installing packages`
              return new Listr(packagePromises) 
            }
          },
        ]);
        tasks.run()
    })
  })


