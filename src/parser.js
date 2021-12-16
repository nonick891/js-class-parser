let file = require('./file.js');

const getConstPos = file =>
	file.indexOf('constructor');

const isClassCase = constPos =>
	constPos > -1;

const getStringParams = content =>
	cutBetween(content, 'constructor', ')').replace('(', '');

const getClassName = content =>
	cutBetween(content, 'class', '{').replace(/ /g, '');

const cutBetween = (str, startStr, endStr) => {
	let pos = str.indexOf(startStr);
	return str.slice(
		pos + startStr.length,
		str.indexOf(endStr, pos)
	);
};

const getArrayParams = paramsString =>
	paramsString ? paramsString.replace(/\s/g, '').split(',') : [];

const getFolderModules = (classes) => {
	let modules = {};
	classes.forEach(filePath => {
		let content = file.getFileContent(filePath),
			constPos = getConstPos(content),
			name = getClassName(content);
		modules[name] = { name };
		if (isClassCase(constPos)) {
			let paramsStr = getStringParams(content);
			modules[name].params = getArrayParams(paramsStr);
		}
	});
	return modules;
};

module.exports = path => {
	let classes = file.getFolderFiles(path);
	let modules = getFolderModules(classes);
	return modules;
};