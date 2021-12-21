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
 * @returns {String}
 */
const getRootDir = () =>
	require.main.filename.split('/node_modules')[0];

const getRelative = path =>
	path.replace(getRootDir(), '.');

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

const getExtName = path => pathM.extname(path);

const getFile = path => {
	if (isSkipD(path)) return false;
	return getExtName(path) ? [path] : getFilesArr(path);
}

const isSkipD = path =>
	path.indexOf('node_modules') > -1;

const getFilesArr = path =>
	fs.readdirSync(path).map(file => getF(path, file));

const getF = (path, file) =>
	isSkipF(file) ? false : `${path}/${file}`;

const isSkipF = path =>
	path.search(/(.test.js|package-lock.json|webpack.config.js|.version)/g) > -1;

module.exports = {
	getExtName,
	getRootDir,
	getRelative,
	getFolderFiles,
	getFileContent,
	writeFile,
	isDirectory
};