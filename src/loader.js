let file = require('./file.js');

const getConstPos = file =>
	file.indexOf('constructor');
const isClassCase = constPos =>
	constPos > -1;
const getStringParams = content => {
	let constPos = getConstPos(content);
	return content.slice(constPos + 11, content.indexOf(')', constPos))
		.replace('(', '');
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
			req = require(filePath);
		modules[req.name] = { module: req };
		if (isClassCase(constPos)) {
			let paramsStr = getStringParams(content);
			modules[req.name].params = getArrayParams(paramsStr);
		}
	});
	return modules;
};