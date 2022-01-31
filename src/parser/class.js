const file = require('../file.js');

const getParams = content =>
	getParamsArr(parseParams(content));

const parseParams = content =>
	getDataBetween(content, 'constructor', ')')
		.replace('(', '')
		.replace(/\s/g, '');

const getParamsArr = params =>
	params ? params.split(',') : false;

const parseClassName = content =>
	getClassExtendArr(extractClass(content));

const extractClass = content =>
	getDataBetween(content, 'export default class', '{').trim();

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
		getFile(path, config),
		getInjectType(content, config)
	);

const getNamedObj = (name, params, path, inject) =>
	name[0] ? getClassObject(name, params, path, inject) : false;

const getClassObject = (name, params, path, inject) =>
	({ [name[0]]: Object.assign(
			{ name: name[0], path },
			{ extends: name[1] },
			getValid('params', params),
			getValid('inject', inject),
		)
	});

const getValid = (name, value) =>
	value ? { [name]: value } : {};

const getFile = (path, config) =>
	getWrappedPath(
		file.getRelative(path, config.modulesRootPath),
		config
	);

const getWrappedPath = (path, { isRequireWrapped }) =>
	isRequireWrapped
		? `require("${path}").default`
		: path;

const getInjectType = (content, {fileType}) =>
	fileType === 'js' ? getObjectType(content) : null;

let injectsReg = /@injects (prototype|instance)/i;

const getObjectType = content =>
	injectsReg.test(content)
		? content.match(injectsReg)[1]
		: null;

module.exports = { parseClass };