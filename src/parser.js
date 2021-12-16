let file = require('./file.js');

const getConstPos = file =>
	file.indexOf('constructor');
const isClassCase = constPos =>
	constPos > -1;
const getStringParams = content =>
	cutBetween(content, 'constructor', ')').replace('(', '');
const getClassName = content =>
	cutBetween(content, 'class', '{').replace(/[ ]+/, '');
const cutBetween = (str, startStr, endStr) => {
	let pos = str.indexOf(startStr);
	return str.slice(
		pos + startStr.length,
		str.indexOf(endStr, pos)
	);
};
const getArrayParams = paramsString =>
	paramsString ? paramsString.replace(/\s/g, '').split(',') : [];

module.exports = path => {
	let modules = {},
		classes = file.getFolderFiles(path);
	classes.forEach(fileName => {
		let filePath = `${path}/${fileName}`,
			content = file.getFileContent(filePath),
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