let fs = require('fs'),
	pathN = require('path');

const getFileContent = filePath =>
	fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });

const isSinglePath = folder =>
	!Array.isArray(folder) && typeof folder === 'string'

const setFile = path => {
	let files = [];
	if (pathN.extname(path)) {
		fs.existsSync(path) ? files.push(path) : false;
		return files;
	}
	let strArray = fs.readdirSync(path);
	if (!strArray) return files;
	strArray.forEach(file => files.push(path + '/' + file));
	return files;
};

const getFolderFiles = folderPath => {
	return isSinglePath(folderPath)
		? setFile(folderPath)
		: [].concat.apply([], folderPath.map(setFile));
}

module.exports = { getFolderFiles, getFileContent };