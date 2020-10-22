const fs = require('fs-extra');
const path = require('path');


//Version 1
var devices=process.argv[2];

//Version 2
var files = 0;

var actualResults=0;


console.log("ARGUMento: "+process.argv[2])

checkFiles();



function checkFiles(){
  fs.readdir(path.join(__dirname, './log/'), function(err, filenames) {
    if (err) {
      return console.log(err);
    }
    
    files=filenames.length
    console.log("Size: "+filenames.length)
    filenames.forEach(function(filename) {

      file=fs.readFileSync(path.join(__dirname,'./log/') + filename, 'utf-8');
      //console.log(file)

      if(file.indexOf('INSTRUMENTATION_CODE: -1') >= 0){
            actualResults++;
            //console.log("EXISTS THIS STRING")
      }

      //    TODO: CATCH TIME 
      //   // let arr = content.split(/\r?\n/);
      //   // arr.forEach((line, idx)=> {
      //   //     if(line.includes("INSTRUMENTATION_CODE: -1")){
      //   //       now++;
      //   //     }
      //   // });
      // });
      console.log("---------------------")
    });
    if(actualResults!=files){
      actualResults=0
      checkFiles()

    //   //await(200)
    }
  });
  
  
}