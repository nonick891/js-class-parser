let file = require('./file.js');

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

const getClassModule = path => {
	let content = file.getFileContent(path),
		name = getClassName(content),
		params = hasParams(content) ? getParams(content) : null;
	return { name, params };
}

const getFolderModules = classes => {
	let modules = {};
	classes.forEach(path => {
		if (!file.isDirectory(path)) {
			let module = getClassModule(path);
			modules[module.name] = module;
		} else {
			modules = Object.assign({}, modules, getAllModules(path));
		}
	});
	return modules;
};

const getAllModules = path => {
	let classes = file.getFolderFiles(path);
	return getFolderModules(classes);
};

module.exports = getAllModules;