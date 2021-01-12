
const fs = require('fs-extra');
const path = require('path');
const yaml = require("js-yaml");
const {spawn}  = require('child_process');

var perses_devices = yaml.load(fs.readFileSync(path.join(__dirname,'perses-devices.yaml'), "utf8"));
        
var number_devices=1;
var port=6001

perses_devices.forEach(function(setDevices){


  if(setDevices.type == "mobile"){
    for (let step = 0; step < setDevices.devices; step++) {

      console.log("CREATE SET DEVICES: "+setDevices.id+", create android-"+(number_devices))
      //Create Docker containers
      try {
          //Destroy Terraform
          var command= 'sudo docker create --privileged  --cpus="'+setDevices.hardware.cpu+'" --memory="'+setDevices.hardware.ram+'"  -p  '+port+':6080 -e DEVICE="Samsung Galaxy S6" --name android-'+number_devices+' budtmo/docker-android-x86-'+setDevices.android_version+'.0'
          const terraform = spawn(command, { shell : true , cwd: path.join(__dirname)});
          port++;   
          number_devices++;       

          terraform.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
          });
            
          terraform.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
          });
      
        } catch (err){
          console.error(err);
        };

    }

  }

});