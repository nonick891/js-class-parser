let fs = require('fs'),
	pathM = require('path');

const getFileContent = filePath =>
	fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });

const isSinglePath = folder =>
	!Array.isArray(folder) && typeof folder === 'string'

const setFile = path => {
	if (pathM.extname(path)) return [path];
	let filesArr = [],
		pathArr = fs.readdirSync(path);
	if (!pathArr) return filesArr;
	pathArr.forEach(file => {
		filesArr.push(path + '/' + file)
	});
	return filesArr;
};

const unpackArray = arrayOfArrays =>
	[].concat.apply([], arrayOfArrays);

const getFolderFiles = folderPath =>
	isSinglePath(folderPath)
		? setFile(folderPath)
		: unpackArray(folderPath.map(setFile));

const isDirectory = path =>
	fs.existsSync(path) && fs.lstatSync(path).isDirectory();

module.exports = { getFolderFiles, getFileContent, isDirectory };