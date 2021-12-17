let file = require('./file.js'),
	classParser = require('./parser/class'),
	{ unpackArray } = require('./array.js');

/**
 * Modules bag
 *
 * @type {Object}
 */
const modulesBag = {};

/**
 * Crawl all folders in depth to collect classes names and parameters
 *
 * @param path {String, Array} allow to pass any amount of arguments
 * @returns {Object}
 */
const crawlEntities = function(path) {
	path = unpackArray([...arguments]);
	setFolderModules(file.getFolderFiles(path));
	return modulesBag;
};

const setFolderModules = files =>
	setModules(files, modulesBag);

/**
 * Saves modules. Serves for recursive purposes
 *
 * @param files {Array} contains absolute path to file or folder
 * @param modules {Object} contains .js class information, works as link
 * @returns {*}
 */
const setModules = (files, modules) =>
	files.map(path => cpObj(modules, getModules(path)))

const cpObj = (src, merge) =>
	Object.assign(src, merge);

const getModules = path =>
	file.isDirectory(path) ? crawlEntities(path) : getModule(path);

const getModule = path => {
	let parsedClass = classParser.parseClass(file.getFileContent(path));
	return { [parsedClass.name]: { ...parsedClass, path } };
}

module.exports = { modulesBag, crawlEntities };