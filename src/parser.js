let file = require('./file.js');

/**
 * Modules bag
 * @type {Object}
 */
const modulesBag = {};

// @TODO: extract class parser functions
const hasParams = file =>
	file.indexOf('constructor') > -1;

const getParams = content =>
	getParamsArr(getParamsStr(content));

const getParamsStr = content =>
	getDataBetween(content, 'constructor', ')').replace('(', '');

const getParamsArr = params =>
	params ? params.replace(/\s/g, '').split(',') : [];

const getClassName = content =>
	getDataBetween(content, 'class', '{').replace(/ /g, '');

const getDataBetween = (str, initStr, endStr) => {
	let pos = str.indexOf(initStr);
	return str.slice(
		pos + initStr.length,
		str.indexOf(endStr, pos)
	);
};

const getModule = path => {
	let content = file.getFileContent(path),
		name = getClassName(content),
		params = hasParams(content) ? getParams(content) : null;
	return { [name]: { name, params, path } };
}

const getAllModules = path => {
	setFolderModules(file.getFolderFiles(path));
	return modulesBag;
};

const cpObj = (src, merge) =>
	Object.assign(src, merge);

/**
 * Saves modules. Serves recursive purposes
 * @param files {Array} contains absolute path to file or folder
 * @param modules {Object} contains .js class information, works as link
 * @returns {*}
 */
const setModules = (files, modules) =>
	files.map(path => cpObj(modules, getModules(path)))

const setFolderModules = files =>
	setModules(files, modulesBag);

const getModules = path =>
	file.isDirectory(path) ? getAllModules(path) : getModule(path);

module.exports = getAllModules;