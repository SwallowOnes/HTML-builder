const { rejects } = require('assert');
const fs = require('fs');
const path = require('path');
let cssStyles = [];

const pathToProj = path.join(__dirname, 'project-dist');
const pathToStyles = path.join(__dirname, 'styles');
const pathToProjAssets = path.join(pathToProj, 'assets');
const pathToAssets = path.join(__dirname, 'assets');
const pathToTemp = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');


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

//HTM and replace
async function replaceHTML() {
  let HTMLIndexTemp = await fs.promises.readFile(pathToTemp, 'utf-8');
  const regex = /{{(.*?)}}/g;

  HTMLIndexTemp = HTMLIndexTemp.replace(regex, function replacer(match, replacePath) {
    // console.log("1", match[1]);
    replacePath = path.join(components, `${replacePath}.html`);
    return fs.promises.readFile(replacePath, 'utf-8');
});

  fs.promises.writeFile(path.join(pathToProj, 'index.html'), HTMLIndexTemp, 'utf-8');
}

replaceHTML();
copyAssets(pathToAssets, pathToProjAssets);
