const hasParams = file =>
	file.indexOf('constructor') > -1;

const getParams = content =>
	getParamsArr(parseParams(content));

const parseParams = content =>
	getDataBetween(content, 'constructor', ')').replace('(', '');

const getParamsArr = params =>
	params ? params.replace(/\s/g, '').split(',') : [];

const parseClassName = content =>
	getDataBetween(content, 'class', '{').replace(/ /g, '');

const getDataBetween = (str, initStr, endStr) => {
	let pos = str.indexOf(initStr);
	return str.slice(
		pos + initStr.length,
		str.indexOf(endStr, pos)
	);
};

const parseClass = content => ({
	name: parseClassName(content),
	params: hasParams(content) ? getParams(content) : null
});

module.exports = { parseClass };