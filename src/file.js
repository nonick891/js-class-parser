let fs = require('fs'),
	pathM = require('path'),
	{ unpackArray } = require('./array.js');

/**
 *
 * @param filePath
 * @returns {String}
 */
const getFileContent = filePath =>
	fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });

/**
 *
 * @param path
 * @param content
 */
const writeFile = (path, content) =>
	fs.writeFileSync(path, content);

/**
 *
 * @param path
 * @returns {Boolean}
 */
const isDirectory = path =>
	fs.existsSync(path) && fs.lstatSync(path).isDirectory();

/**
 *
 * @param path
 * @returns {Array}
 */
const getFolderFiles = path =>
	isSinglePath(path)
		? getFile(path)
		: unpackArray(path.map(getFile));

const isSinglePath = folder =>
	!Array.isArray(folder) && typeof folder === 'string'

const getFile = path =>
	pathM.extname(path) ? [path] : getFilesArr(path);

const getFilesArr = path =>
	fs.readdirSync(path).map(file => path + '/' + file);

module.exports = {
	getFolderFiles,
	getFileContent,
	writeFile,
	isDirectory
};