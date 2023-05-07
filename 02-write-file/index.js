const fs = require('fs');
const path = require('path');
const {stdin, stdout, exit} = require('process')

function closeFILE() {
    console.log('File closed.');
    writeTxtStream.end();
    process.exit();
}

let textFileName = 'text.txt'
const pathTxtFile = path.join(__dirname, textFileName);
const writeTxtStream = fs.createWriteStream(pathTxtFile);

stdout.write('File opened. Input text:\n')

stdin.on('data', (text) => {
    text = text.toString();
    text.trim() === 'exit' ? closeFILE() : writeTxtStream.write(text);
});

process.on('SIGINT', ()=> closeFILE());
