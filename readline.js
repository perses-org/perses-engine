const fs = require('fs');
const readline = require('readline');


function processLineByLine(file) {
   const fileStream = fs.createReadStream(file);

   const readInterface = readline.createInterface({
    input: fileStream,
    console: false
});
//Heatmap-Log
readInterface.on('line', function(line) {
   
    if(line.includes("heatmap")){
        fs.appendFileSync("test2.txt", line.toString() + "\n");
    }
        
});

}



processLineByLine("test.txt");