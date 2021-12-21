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
	getDataBetween(content, 'class', '{')
		.replace(/ /g, '');

const getDataBetween = (str, initStr, endStr) =>
	getBetweenPos(str, str.indexOf(initStr), initStr, endStr);

const getBetweenPos = (str, pos, initStr, endStr) =>
	pos > -1 ? getBetween(str, pos, initStr, endStr) : ''

const getBetween = (str, pos, initStr, endStr) =>
	str.slice(pos + initStr.length, str.indexOf(endStr, pos));

const parseClass = path =>
	getClassData(file.getFileContent(path), path);

const getClassData = (content, path) =>
	getNamedObj(
		parseClassName(content),
		getParams(content),
		file.getRelative(path)
	);

const getNamedObj = (name, params, path) =>
	name ? getClassObject(name, params, path) : false

const getClassObject = (name, params, path) =>
	({ [name]: { name, params, path } })

module.exports = { parseClass };