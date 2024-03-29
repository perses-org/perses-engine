#!/usr/bin/env node

"use strict";

const fs = require('fs-extra');
const path = require('path');
const mustache = require('mustache');
const yaml = require("js-yaml");
const util = require('util');
const {spawn}  = require('child_process');

var uiTests=false;
var performanceTests = false;

const terraformTemplate = fs.readFileSync(path.join(__dirname, './templates/variables.mustache'), "utf8");
const logTemplate = fs.readFileSync(path.join(__dirname, './templates/filterLogs.mustache'), "utf8");


/*  <<<<<<<<<<<  MAIN FUNCTIONS >>>>>>>>>>    */

exports.prueba = function(projectName){
  
}

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
        var apk_test_path=parameters["apk_test_path"]
        var key_path=parameters["key_path"]
        var tests=parameters["tests"]
        var perses_devices=parameters["devices"]

        // Check APK file
        if (!fs.existsSync(apk_path)) {
          console.log("Error: APK FILE DOESN'T EXIST!")
          process.exit(1);
        }


        // Check Key file
        if (!fs.existsSync(key_path)){
          console.log("Error: KEY FILE DOESN'T EXIST!")
          process.exit(1);
        }


        // Check UI TESTS
        checkUITests(tests);
        if (uiTests && !apk_test_path){
          console.error("Error: UI test exists but the variable apk_test_path is not defined");
          process.exit(1);
        }else{
          if(uiTests && apk_test_path){
            if (!fs.existsSync(apk_test_path)) {
              console.log("Error: APK TEST FILE DOESN'T EXIST!")
              process.exit(1);
            }
          }
        }

        
        //Put Parameters
        //Size
        var number_devices=0;

        console.log(perses_devices)

        perses_devices.forEach(function(setDevices){

          if(setDevices.type == "mobile"){
            for (let step = 0; step < setDevices.devices; step++) {
              number_devices++;
              console.log("Device "+number_devices)
            }
          }

        });
        //At least one device is launched
        if(number_devices<1){
          number_devices=1;
        }
        parameters["number_devices"]=number_devices

        var devices=parameters["number_devices"]
        parameters["volume_size"]=Math.round(40 + (devices * 6))

        //AMI ID
        if(parameters["ami_id"]==null)
          parameters["ami_id"]="ami-0136ddddd07f0584f"

        //EC2 USERNAME
        parameters["ec2_username"]="ubuntu"
        
        //End Port
        parameters["port"]=(6000+Number(parameters["number_devices"]))


  
        //Render Templates      
        var output = mustache.render(terraformTemplate, parameters);
        var outputLog = mustache.render(logTemplate, parameters);

        console.log("Creating projects folder...");
        fs.mkdir(path.join(__dirname,'projects',projectName), { recursive: true }, (err) => {
          
          if (err){
            console.log("Error: "+err);
            console.log("Project folder could not be created...")
            throw err;
          }else {

            try{
            //Generates variable files for Terraform
            fs.writeFileSync(path.join(__dirname,'projects',projectName,'variables.tf'), output, 'utf8');
            
            //Generates the script to later filter the logs with the tags defined in the configuration file
            fs.writeFileSync(path.join(__dirname,'projects',projectName,'filterLogs.js'), outputLog, 'utf8');

            //Generates the file for the tests configuration
            fs.writeFileSync(path.join(__dirname,'projects',projectName,'perses-tests.yaml'), yaml.safeDump(tests), 'utf8');
            }
            catch(err){
              console.log("An error has apeared at trying to generate files...");
              console.error(err);
              removeProjectFolder(projectName);
            }

            
         
           
            //Copy the scripts and other files to the project folder
            fs.copy(path.join(__dirname,'core','terraform'), path.join(__dirname,'projects',projectName), function (err) {
              if (err){
                console.log("Error copying the scripts and other files to the project folder...")
                removeProjectFolder(projectName);
                return console.log(err)
              }
              else{
                try {
                      //Init Terraform
                      const ls = spawn('terraform init && terraform plan ', { shell : true , cwd: path.join(__dirname,'projects',projectName)});
                                  
                      ls.stdout.on('data', (data) => {
                        console.log(`stdout: ${data}`);
                      });
                        
                      ls.stderr.on('data', (data) => {
                        console.log(`stderr: ${data}`);
                      });

                      fs.writeFileSync(path.join(__dirname,'projects',projectName, 'scripts','perses-devices.yaml'), yaml.safeDump(perses_devices), 'utf8');
                
                } catch (err){
                      console.error(err);
                      removeProjectFolder(projectName);
                };
              }
            });
            
            //Generate the folder for the project logs
            fs.mkdir(path.join(__dirname,'projects',projectName,'logs'), { recursive: true }, (err) => {
          
              if (err){
                console.log("Error creating the logs: "+err);
                removeProjectFolder(projectName);
                throw err;
              }
            }
          );
          }
        });
        } 
}


/*
 * <<<< Launch Perses >>>>
 * This function starts the defined Terraform infrastructure created in the folder 'projectName'.
 */

exports.launchPerses = function(projectName){
  
  console.log("  - ProjectName: '" + projectName + "'");
    if (fs.existsSync(path.join(__dirname,'projects',projectName))) {
      console.log("Launching...");
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
          console.log("The following error has occured:")
          console.error(err);
          console.log("Destroying Perses infrastructure");
          destroyPerses(projectName);
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

        //CHECK TESTS
        var tests = yaml.load(fs.readFileSync(path.join(__dirname,'projects',projectName, 'perses-tests.yaml'), "utf8"));
        checkUITests(tests)
        checkPerformanceTests(tests)

      
      if (uiTests){
        executeUITests (tests, projectName)
      }else{
        if(performanceTests){
           executePerformanceTests(tests, projectName)
        }
      }
  
    }else
      console.log("The project does not exist")
  
  };



/*
 * <<<< Get Logs  >>>>
 * This function downloads the logs generated on the virtualized Android devices to filter them later.
 */

exports.getLogs = function(projectName){
  

  if (fs.existsSync(path.join(__dirname,'projects',projectName))) {
    console.log("Get Logs...");
    try {
          //Destroy Terraform
          var connection = fs.readFileSync(path.join(__dirname,'projects',projectName, 'connection.txt'), "utf8");
        connection = connection.split(",");
        var key = connection[0]
        var username = connection[1]
        var ip = connection[2]
        var devices = connection[3]
        var applicationId = connection[4]

        var command='ssh -o StrictHostKeyChecking=no -i '+key+' '+username+'@'+ip+'  bash ./scripts/getLogs.sh '+devices+' '+applicationId//+' && scp -i '+key+' -r '+username+'@'+ip+':devices-logs/ logs/ && node filterLogs.js '+devices
        const getLogs = spawn(command, { shell : true , cwd: path.join(__dirname,'projects',projectName)});

        
        getLogs.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
          
        getLogs.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
        });

        getLogs.on('close', (code) => {
          command='scp -i '+key+' -r '+username+'@'+ip+':devices-logs/ logs/ && node filterLogs.js '+devices
          const downloadLogs = spawn(command, { shell : true , cwd: path.join(__dirname,'projects',projectName)});

          
          downloadLogs.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
          });
            
          downloadLogs.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
          });
         
        });

        /*--------------------------------------------*/ 

        



      
    } catch (err){
        console.error(err);
    };
  }else
    console.log("The project does not exist")
  
 };


  
/*
 * <<<< Destroy Perses >>>>
 * This function destroy the defined Terraform infrastructure created in the folder 'projectName'.
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



/*  <<<<<<<<<<<  EXTRA FUNCTIONS >>>>>>>>>>    */      

/*
 * <<<< removeProjectFolder >>>>
 * This function deletes the actual project folder if an error appears.
 */
function removeProjectFolder(projectName){
  
  if (fs.existsSync(path.join(__dirname,'projects',projectName)))
    fs.rmdirSync(path.join(__dirname,'projects',projectName), { recursive: true }, (err) => {
      
    if (err){
      console.log("The following error appeared trying to delete the project: \n"+err);
      throw err;
    }else {
      console.log("The project folder has been deleted successfully")
    }
  });
}

/*
 * <<<< checkUITests >>>>
 * This function checks for UI tests.
 */
function checkUITests (tests){
  tests.forEach(function(value){
    if(value.type==="espresso")
      uiTests=true; 
  });
}

/*
 * <<<< checkPerformanceTests >>>>
 * This function checks for performance tests.
 */
function checkPerformanceTests (tests){
  tests.forEach(function(value){
    if(value.type==="apipecker")
      performanceTests=true; 
  });
}



  /*<<<< Execute UI Tests >>>> 
   * Function to execute the user interface tests with Espresso. 
   * The function reads the connection file to connect to the machine where the 
   * virtualized mobile devices are hosted and runs a script to launch the tests
   */
    function executeUITests (tests, projectName){
      console.log("Launch UI Tests...");
      try {

        var connection = fs.readFileSync(path.join(__dirname,'projects',projectName, 'connection.txt'), "utf8");
        connection = connection.split(",");
        var key = connection[0]
        var username = connection[1]
        var ip = connection[2]
        var devices = connection[3]
        var applicationId = connection[4]
        
        const runUITests = spawn('ssh -o StrictHostKeyChecking=no -i '+key+' '+username+'@'+ip+' bash ./scripts/executeUITests.sh '+devices+' '+applicationId, 
        { shell : true , cwd: path.join(__dirname,'projects',projectName)});
      
        runUITests.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
          
        runUITests.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
        });


        runUITests.on('close', (code) => {
          uiTests=false;
          if(performanceTests){
            executePerformanceTests(tests,projectName);
          }
        });
  
      } catch (err){
        console.error(err);
      };
    }

  /*<<<< Execute Performance Tests >>>>
   * The function executes APIPecker with the different 
   * tests that are defined in the file tests.yaml*/

    function executePerformanceTests(tests,projectName){
      console.log("Launch Performance Tests...");
      tests.forEach(function(value){
        if(value.type=='apipecker'){
            
          console.log("STARTING TEST: "+ value.id)
          try {
            const runPerformanceTests = 
            spawn('npx apipecker '+value.config.concurrentUsers +' '+value.config.iterations+' '+ value.config.delay+' "'+ value.config.url+'" -v  2>&1 | tee ./logs/results'+(value.id).replace(/\s/g, '')+'.txt', 
            { shell : true , cwd: path.join(__dirname,'projects',projectName)});
          
            runPerformanceTests.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
            });
              
            runPerformanceTests.stderr.on('data', (data) => {
              console.log(`stderr: ${data}`);
            });

            runPerformanceTests.on('close', (code) => {
              performanceTests=false;
            });
    
          } catch (err){
            console.error(err);
          };

        }
      });
      
    }

    

    
  
