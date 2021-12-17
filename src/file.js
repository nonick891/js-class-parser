let fs = require('fs'),
	pathM = require('path');

const getFileContent = filePath =>
	fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });

const getFolderFiles = path =>
	isSinglePath(path)
		? setFile(path)
		: unpackArray(path.map(setFile));

const isSinglePath = folder =>
	!Array.isArray(folder) && typeof folder === 'string'

const unpackArray = arrayOfArrays =>
	[].concat.apply([], arrayOfArrays);

const setFile = path => {
	if (pathM.extname(path)) return [path];
	let files = [];
	fs.readdirSync(path).forEach(file =>
		files.push(path + '/' + file)
	);
	return files;
};

const isDirectory = path =>
	fs.existsSync(path) && fs.lstatSync(path).isDirectory();

module.exports = { getFolderFiles, getFileContent, isDirectory };