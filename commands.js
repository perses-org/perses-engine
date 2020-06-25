#!/usr/bin/env node

"use strict";

const fs = require('fs-extra');
const path = require('path');
const mustache = require('mustache');
const yaml = require("js-yaml");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {spawn}  = require('child_process');


const terraformTemplate = fs.readFileSync(path.join(__dirname, './templates/variables.mustache'), "utf8");
const testTemplate = fs.readFileSync(path.join(__dirname, './templates/runTests.mustache'), "utf8");
const logTemplate = fs.readFileSync(path.join(__dirname, './templates/filterLogs.mustache'), "utf8");

exports.setupPerses = function(credentialsFileName, configFileName, projectName){
  console.log("  - Config File: '" + configFileName + "'");
  console.log("  - Credentials File: '" + credentialsFileName + "'");
  console.log("  - ProjectName: '" + projectName + "'");

  if (fs.existsSync(path.join(__dirname,'projects',projectName))) 
    console.log("The project already exists, choose another name");
    else{

        // Read config parameters
        var parameters =  yaml.load(fs.readFileSync(configFileName, "utf8"));
        // Read credentials parameters
        var credentials =  yaml.load(fs.readFileSync(credentialsFileName, "utf8"));
        
        parameters.project_name = projectName;

        console.log("--- PARAMETERS ---");
        console.log(yaml.dump(parameters));

        for (let [key, value] of Object.entries(credentials)) {
          parameters[key] = value;
        }

        // Read 'apk path' and 'key_path' parameters to checking
        var apk_path=parameters["apk_path"]
        var key_path=parameters["key_path"]

        if (fs.existsSync(apk_path)) {
          if (fs.existsSync(key_path)) {
            
              var output = mustache.render(terraformTemplate, parameters);
              var outputTest = mustache.render(testTemplate, parameters);
              var outputLog = mustache.render(logTemplate, parameters);

              console.log("Creating projects folder...");
              fs.mkdir(path.join(__dirname,'projects',projectName), { recursive: true }, (err) => {
                
                if (err){
                  console.log("Error: "+err);
                  throw err;
                }else {

                  //Generates variable files for Terraform
                  fs.writeFileSync(path.join(__dirname,'projects',projectName,'variables.tf'), output, 'utf8');
                  
                  //Generates the script to later filter the logs with the tags defined in the configuration file
                  fs.writeFileSync(path.join(__dirname,'projects',projectName,'filterLogs.js'), outputLog, 'utf8');


                  //Copy the scripts and other files to the project folder
                  fs.copy(path.join(__dirname,'core','terraform'), path.join(__dirname,'projects',projectName), function (err) {
                    if (err) 
                      return console.log(err)
                    else{
                      try {
                            //Generates tests file
                            fs.writeFileSync(path.join(__dirname,'projects',projectName,'scripts','runTests.sh'), outputTest, 'utf8');

                            //Init Terraform
                            const ls = spawn('terraform init && terraform plan ', { shell : true , cwd: path.join(__dirname,'projects',projectName)});
                                        
                            ls.stdout.on('data', (data) => {
                              console.log(`stdout: ${data}`);
                            });
                              
                            ls.stderr.on('data', (data) => {
                              console.log(`stderr: ${data}`);
                            });
                      
                      } catch (err){
                            console.error(err);
                      };
                    }
                  });

                  fs.mkdir(path.join(__dirname,'projects',projectName,'logs'), { recursive: true }, (err) => {
                
                    if (err){
                      console.log("Error: "+err);
                      throw err;
                    }else {
                    
                    }});
                }
              });

            }else{console.log("KEY FILE DOESN'T EXIST!")}
              
          
          }else{console.log("APK FILE DOESN'T EXIST!")}

        } 
}

/*
 * <<<< Launch Perses >>>>
 * This function starts the defined Terraform infrastructure created in the folder 'projectName'.
 */

exports.launchPerses = function(projectName){
  
  console.log("  - ProjectName: '" + projectName + "'");
    if (fs.existsSync(path.join(__dirname,'projects',projectName))) {
      console.log("Launch...");
      try {
            //Starts Terraform
            const terraform = spawn('terraform plan && terraform apply -auto-approve', { shell : true , cwd: path.join(__dirname,'projects',projectName)});
            terraform.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
            });
              
            terraform.stderr.on('data', (data) => {
              console.log(`stderr: ${data}`);
            });
      
        } catch (err){
          console.error(err);
        };
    }else
      console.log("The project does not exist")
  
  };

/*
 * <<<< Run Tests >>>>
 * This function starts the tests generated with API PECKER.
 */

  exports.runTests = function(projectName){
  
    console.log("  - ProjectName: '" + projectName + "'");
      if (fs.existsSync(path.join(__dirname,'projects',projectName))) {
        console.log("Launch...");
        try {
              const terraform = spawn('bash runTests.sh', { shell : true , cwd: path.join(__dirname,'projects',projectName,'scripts')});
             
              terraform.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
              });
                
              terraform.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
              });
        
          } catch (err){
            console.error(err);
          };
      }else
        console.log("The project does not exist")
    
    };
  

  
/*
 * <<<< Destroy Perses >>>>
 * This function destroy the defined Terraform infrastructure created in the folder 'projectName'.
 * Also downloads the logs generated on the virtualized Android devices to filter them later.
 */

exports.destroyPerses = function(projectName){
  

  if (fs.existsSync(path.join(__dirname,'projects',projectName))) {
    console.log("Destroy...");
    try {
          //Destroy Terraform
          const terraform = spawn('terraform destroy -auto-approve', { shell : true , cwd: path.join(__dirname,'projects',projectName)});
                      
          terraform.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
          });
            
          terraform.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
          });
      
          
        } catch (err){
          console.error(err);
        };
  }else
    console.log("The project does not exist")
  
 
};