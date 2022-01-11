const file = require('./file.js');

const getFileNamePath = (path, name) =>
	filePath(cleanPath(path), handleName(name));

const handleName = name =>
	fallBackExt(fallBackName(name));

const fallBackName = name =>
	name ? name : 'class_autoload_data';

const fallBackExt = name =>
	file.getExtName(name) ? name : name + '.json';

const cleanPath = path =>
	(path.length > 1) ? path.replace(/[\/]+$/g, '') : path;

const filePath = (path, name) =>
	`${path}/${name}`;

module.exports = { getFileNamePath };