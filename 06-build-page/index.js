const { rejects } = require('assert');
const fs = require('fs');
const path = require('path');
let cssStyles = [];

const pathToProj = path.join(__dirname, 'project-dist');
const pathToStyles = path.join(__dirname, 'styles');
const pathToProjAssets = path.join(pathToProj, 'assets');
const pathToAssets = path.join(__dirname, 'assets');


//css
fs.readdir(pathToStyles, async (err, files) => {
  if (err) throw err;
  const promises = [];
  files.forEach((file) => {
    const promise = new Promise((resolve, reject) => {
      // console.log(file);
      if (file.split('.').at(-1) === 'css') {
        const pathToFile = path.join(pathToStyles, file);
        const readTxtStream = fs.createReadStream(pathToFile, 'utf-8');
        readTxtStream.on('data', (chunk) => {
          resolve(chunk);
        })
      } else {
        resolve(null);
      }
    })
    promises.push(promise);
  })
  const result = await Promise.all(promises);
  cssStyles = result
    .filter(Boolean)
    .join('')
  // const pathToProj = 'project-dist';
  const pathToCssStyle = path.join(__dirname, 'project-dist', 'style.css');
  fs.writeFile(pathToCssStyle, cssStyles, err => {
    if (err) {
      throw err
    };
  });
});

//assets-copy
async function copyAssets(pathToAssets, pathToProj) {
  try {
    await fs.mkdir(pathToProj, { recursive: true }, (err) => {
      if (err) throw err;
      fs.readdir(pathToAssets, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          let filePath = path.join(pathToAssets, file);
          let copyFilePath = path.join(pathToProj, file);
          fs.stat(filePath, (err, stats) => {
            if (err) console.log(err);
            if (stats.isFile()) {
              fs.copyFile(filePath, copyFilePath, err => {
                if (err) {
                  throw err
                };
              });
            } else {
              copyAssets(filePath, copyFilePath);
            }
          });
        });
      });
    });
  }
  catch (err) {
    console.log(err);
  }
}

copyAssets(pathToAssets, pathToProjAssets);



