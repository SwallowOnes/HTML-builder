const fs = require('fs');
const path = require('path');

const pathTxtFile = path.join(__dirname, 'text.txt');
const readTxtStream = fs.createReadStream(pathTxtFile, 'utf-8');
readTxtStream.on('error', (error) => {
    console.log(`error: ${error.message}`);
})
readTxtStream.on('data', (string) =>{
    console.log(string.trim());
})