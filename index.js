#!/usr/bin/env node

"use strict";
require('log-timestamp');

const program = require('commander');
const packageJson = require('./package.json');

const {launchTest} = require('./commands.js');

program
    .version(packageJson.version)
    .description(packageJson.name + ": " + packageJson.description);

program
    .usage('<config.yaml> <credentials.yaml> <testId>')
    .arguments('<configFileName> <credentialsFileName> <testId>')
    .action((configFileName, credentialsFileName, testId) => {
        launchTest(configFileName, credentialsFileName, testId);
    });


program.parse(process.argv);
