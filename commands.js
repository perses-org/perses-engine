#!/usr/bin/env node

"use strict";

const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const yaml = require("js-yaml");
const util = require('util');

const terraformTemplate = fs.readFileSync(path.join(__dirname, './templates/main.tf'), "utf8");

/**
 * @function  [launchTest]
 * @returns {int} Result Status: 0 (OK)
 */
const launchTest = (configFileName, credentialsFileName, testId) => {
    console.log("Launching test " + testId + "...");
    console.log("  - Config File: '" + configFileName + "'");
    console.log("  - Credentials File: '" + credentialsFileName + "'");

    // Read config parameters
    var parameters =  yaml.load(fs.readFileSync(configFileName, "utf8"));
    
    parameters.testId = testId;

    console.log("--- PARAMETERS ---");
    console.log(yaml.dump(parameters));
    console.log("------------------");

    var output = mustache.render(terraformTemplate, parameters);

    var timeStamp = Date.now();

    fs.writeFileSync("output_"+timeStamp+".tf", output, 'utf8');

    const exec = util.promisify(require('child_process').exec);


    async function ExecTerraform() {
      try {

          // EXECUTION
          const { stdout, stderr } = await exec('touch EXECUTED_'+timeStamp+' && cat output_'+timeStamp+'.tf');
          console.log('stdout:', stdout);
          console.log('stderr:', stderr);
        } catch (err){
         console.error(err);
      };
    };

    console.log("Executing test...");

    ExecTerraform();

    console.log("Finish.");
};

module.exports = {launchTest};
