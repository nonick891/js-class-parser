const file = require('../file.js');

const getParams = content =>
	getParamsArr(parseParams(content));

const parseParams = content =>
	getDataBetween(content, 'constructor', ')')
		.replace('(', '')
		.replace(/\s/g, '');

const getParamsArr = params =>
	params ? params.split(',') : [];

const parseClassName = content =>
	getClassExtendArr(extractClass(content));

const extractClass = content =>
	getDataBetween(content, 'class', '{').trim();

const getClassExtendArr = str =>
	str.replace(/ /g, '').split(/extends/gi);

const getDataBetween = (str, initStr, endStr) =>
	getBetweenPos(str, str.indexOf(initStr), initStr, endStr);

const getBetweenPos = (str, pos, initStr, endStr) =>
	pos > -1 ? getBetween(str, pos, initStr, endStr) : ''

const getBetween = (str, pos, initStr, endStr) =>
	str.slice(pos + initStr.length, str.indexOf(endStr, pos));

const parseClass = (path, config) =>
	getClassData(file.getFileContent(path), path, config);

const getClassData = (content, path, config) =>
	getNamedObj(
		parseClassName(content),
		getParams(content),
		getFile(path, config)
	);

const getNamedObj = (name, params, path) =>
	name[0] ? getClassObject(name, params, path) : false;

const getClassObject = (name, params, path) =>
	({ [name[0]]: {
			name: name[0],
			params, path,
			extends: name[1]
		}
	});

const getFile = (path, config) =>
	getWrappedPath(
		file.getRelative(path, config.modulesRootPath),
		config
	);

const getWrappedPath = (path, { isRequireWrapped }) =>
	isRequireWrapped
		? `require("${path}").default`
		: path;

module.exports = { parseClass };