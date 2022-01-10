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
 * @param forceTouch
 */
const writeFile = (path, content, forceTouch) => {
	if (isSame(path, content) && !forceTouch) return;
	fs.writeFileSync(path, content);
}

const isSame = (path, content) =>
	getFileContent(path) === content;

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

const getRelative = (path, root) =>
	path.replace(getRootDir(), root)
		.replace('./', root + '/');

/**
 *
 * @param path
 * @returns {Array}
 */
const getFolderFiles = path =>
	isSinglePath(path)
		? getFile(path)
		: getFiles(path);

const getFiles = path =>
	unpackArray(path.map(getFile)).filter(Boolean);

const isSinglePath = folder =>
	!Array.isArray(folder) && typeof folder === 'string';

const getExtName = path =>
	pathM.extname(path);

const getFile = path =>
	isAvailable(path)
		? getPathsArr(path)
		: false;

const isAvailable = path =>
	!isSkipD(path) && isExists(path);

const isExists = path =>
	fs.existsSync(path);

const getPathsArr = path =>
	getExtName(path)
		? [path]
		: getPaths(path);

const isSkipD = path =>
	path.indexOf('node_modules') > -1;

const getPaths = path =>
	fs.readdirSync(path).map(file => getF(path, file));

const getF = (path, file) =>
	isSkipF(file) ? false : cleanPath(`${path}/${file}`);

const isSkipF = path =>
	path.search(/(.test.js|package-lock.json|webpack.config.js|.version|eslint|package.json|index.js|.babel)/g) > -1;

const cleanPath = path =>
	path.replace(/\/\//g, '/');

module.exports = {
	getExtName,
	getRootDir,
	getRelative,
	getFolderFiles,
	getFileContent,
	writeFile,
	isDirectory
};