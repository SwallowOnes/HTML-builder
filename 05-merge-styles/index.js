const { rejects } = require('assert');
const fs = require('fs');
const path = require('path');
let cssStyles = [];
const folderName = 'styles';
const pathToFolder = path.join(__dirname, folderName);
// console.log("ptf", pathToFolder);

// fs.readdir(pathToFolder, (err, files) =>{
//     console.log("files:", files);
// });

fs.readdir(pathToFolder, async (err, files) => {
	if (err) throw err;
	const promises = [];
	files.forEach((file) => {
		const promise = new Promise((resolve, reject) => {
			console.log(file);
			if (file.split('.').at(-1) === 'css') {
				const pathToFile = path.join(pathToFolder, file);
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
	const pathToProj = 'project-dist';
	const pathToCssStyle = path.join(__dirname, pathToProj, 'bundle.css');
	fs.writeFile(pathToCssStyle, cssStyles, err => {
		if (err) {
			throw err
		};
	});
});
