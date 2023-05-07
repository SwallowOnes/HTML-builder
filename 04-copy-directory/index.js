const fs = require('fs');
const path = require('path');

const folderName = 'files';
const pathToFolder = path.join(__dirname, folderName);
const copyFolderName = 'files-copy';
const copyPathToFolder = path.join(__dirname, copyFolderName);

fs.mkdir(copyPathToFolder, {recursive: true}, (err) => {
    if(err) throw err;
    fs.readdir(pathToFolder, (err, files) => {
        if(err) throw err;
        files.forEach((file) => {
            let filePath = path.join(pathToFolder, file);
            let copyFilePath = path.join(copyPathToFolder, file);
            fs.copyFile(filePath, copyFilePath, err => {
                if (err) {
                    throw err
                };
            });
        });
    });
});
