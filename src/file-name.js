const file = require('./file.js');

/**
 *
 * @param path
 * @param name
 * @returns {string}
 */
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

/**
 *
 * @param name
 * @returns {string|string}
 */
const getRelativePath = name => {
	let times = name.match(/\/[a-z]+/g, '/').length;
	return times > 0
	       ? '../'.repeat(times).replace(/\/$/g, '')
	       : '.';
}

module.exports = { getFileNamePath, getRelativePath };