#!/usr/bin/env node

"use strict";

const fs = require('fs-extra');
const path = require('path');
const mustache = require('mustache');
const yaml = require("js-yaml");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {spawn}  = require('child_process');


const terraformTemplate = fs.readFileSync(path.join(__dirname, './templates/variables.tf'), "utf8");

// /**
//  * @function  [launchTest]
//  * @returns {int} Result Status: 0 (OK)
//  */
// const launchTest = (configFileName, credentialsFileName, testId) => {
//     console.log("Launching test " + testId + "...");
//     console.log("  - Config File: '" + configFileName + "'");
//     console.log("  - Credentials File: '" + credentialsFileName + "'");

//     // Read config parameters
//     var parameters =  yaml.load(fs.readFileSync(configFileName, "utf8"));
//     // Read credentials parameters
//     var credentials =  yaml.load(fs.readFileSync(credentialsFileName, "utf8"));
    
//     parameters.testId = testId;

//     console.log("--- PARAMETERS ---");
//     console.log(yaml.dump(parameters));

//     for (let [key, value] of Object.entries(credentials)) {
//       parameters[key] = value;
//     }


 

//     var output = mustache.render(terraformTemplate, parameters);


//     var timeStamp = Date.now();


//     // fs.mkdir('projects/'+testId, { recursive: true }, (err) => {
//     //   if (err) throw err;
//     // });


//     // fs.writeFileSync('./projects/'+testId+'/variables.tf', output, 'utf8');


//     // fs.copy('./core/terraform', './projects/'+testId+'/', function (err) {
//     //   if (err) return console.error(err)
//     // });
   



//     async function ExecTerraform() {
//       try {


//         // const ls = spawn('cd terraform  & terraform init & terraform plan & terraform apply -auto-approve', { shell : true });
                   
//         //    ls.stdout.on('data', (data) => {
//         //      console.log(`stdout: ${data}`);
//         //    });
             
//         //    ls.stderr.on('data', (data) => {
//         //      console.log(`stderr: ${data}`);
//         //    });

        


//           // EXECUTION
//           //const { stdout, stderr } = await exec('touch EXECUTED_'+timeStamp+' && cat output_'+timeStamp+'.tf');
         
//           //console.log('stdout:', stdout);
//          // console.log('stderr:', stderr);
//         } catch (err){
//          console.error(err);
//       };
//     };

//     console.log("Executing ...");

//     ExecTerraform();

//     console.log("Finish.");
// };


exports.setupPerses = function(credentialsFileName, configFileName, projectName){
  console.log("  - Config File: '" + configFileName + "'");
  console.log("  - Credentials File: '" + credentialsFileName + "'");
  console.log("  - ProjectName: '" + projectName + "'");

  if (fs.existsSync(path.join(__dirname,'projects',projectName))) 
    console.log("he project already exists, choose another name");
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

        var output = mustache.render(terraformTemplate, parameters);


        console.log("creating projects folder...");
        fs.mkdir('projects/'+projectName, { recursive: true }, (err) => {
          
          if (err){
            console.log("Error: "+err);
            throw err;
          }else {
            console.log("Ok");
            fs.writeFileSync('./projects/'+projectName+'/variables.tf', output, 'utf8');

            fs.copy('./core/terraform', './projects/'+projectName+'/', function (err) {
              if (err) return console.error(err)
            });
    
            try {
                const ls = spawn('cd projects && cd '+projectName+' && terraform init && terraform plan ', { shell : true });
                            
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

      }
}

exports.launchPerses = function(projectName){
  
  console.log("  - ProjectName: '" + projectName + "'");
    if (fs.existsSync('./projects/'+projectName)) {
      console.log("Launch...");
      try {
        const terraform = spawn('terraform apply -auto-approve'
                                , { shell : true }
                                , {cwd: path.join(__dirname,'projects',projectName)});
                    
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

  
  



  exports.getResultsPerses = function(projectName, credentialsFileName){
  

    if (fs.existsSync('./projects/'+projectName)) {
      console.log("Get Results...");
      try {
          const ls = spawn('scp -i ${(var.key_path)} -r ${(var.ec2_username)}@${(self.public_ip)}:logs/ projects/${(var.project_name)}', { shell : true });
                      
              ls.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
              });
                
              ls.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
              });
        
            
          } catch (err){
            console.error(err);
          };
    }else
      console.log("The project does not exist")
    
   
  };


exports.destroyPerses = function(projectName){
  

  if (fs.existsSync('./projects/'+projectName)) {
    console.log("Destroy...");
    try {
        const ls = spawn('cd projects && cd '+projectName+' && terraform destroy -auto-approve', { shell : true });
                    
            ls.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
            });
              
            ls.stderr.on('data', (data) => {
              console.log(`stderr: ${data}`);
            });
      
          
        } catch (err){
          console.error(err);
        };
  }else
    console.log("The project does not exist")
  
 
};