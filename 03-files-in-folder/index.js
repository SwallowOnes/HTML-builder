const fs = require('fs');
const path = require('path');

const folderName = 'secret-folder';
const pathToFolder = path.join(__dirname, folderName);

fs.readdir(pathToFolder, (err, files) => {
    if (err) console.log(err);
    files.forEach((file) => {
        let pathToFile = path.join(pathToFolder, file);
        fs.stat(pathToFile, (err, stats) => {
            if (err) console.log(err);
            if (stats.isFile()){
                let fileInfo = [...file.split("."), `${stats.size/1024} kb`];
                console.log(fileInfo.join(' - '));
            }
        });
    })
})
