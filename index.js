#!/usr/bin/env node

"use strict";
require('log-timestamp');

const program = require('commander');
const packageJson = require('./package.json');

const perses = require('./commands.js');

program
    .version(packageJson.version)
    .description(packageJson.name + ": " + packageJson.description);


program
  .requiredOption('-a, --persesAction <action>', 'actions = setup | launch | tests | destroy ')
  .option('-c, --credentialsFileName <filepath>', 'credentials file path')
  .option('-g, --configFileName <filepath>', 'configuration project file path')
  .requiredOption('-n, --projectName <name>', 'project name')
  .action((options) => {
    switch(options.persesAction){
      
      case 'setup':
          if(options.configFileName == null || options.credentialsFileName == null)
            console.log('credentials (-c) and configuration project (-g) file path is required')
          else
            perses.setupPerses(options.credentialsFileName, options.configFileName, options.projectName)
        break;
        
      case 'launch':
          perses.launchPerses(options.projectName)
        break;

      case 'tests':
          perses.runTests(options.projectName)
        break;
          
      case 'destroy':
          perses.destroyPerses(options.projectName)
        break;
            
      default:
          console.log('Incorrect action! => setup | launch | tests | destroy')

    }
  });

program.parse(process.argv);

