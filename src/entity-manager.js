let file = require('./file.js'),
	classParser = require('./parser/class.js'),
	{ unpackArray } = require('./array.js');

class EntityManager {

	/**
	 * Modules bag
	 *
	 * @type {Object}
	 */
	modulesBag = {};

	/**
	 * Crawl all folders in depth to collect classes names and parameters
	 *
	 * @param path {String, Array} allow to pass any amount of arguments
	 * @returns {Object}
	 */
	crawlEntities(path) {
		path = unpackArray([...arguments]);
		this.setFolderModules(file.getFolderFiles(path));
		return this.modulesBag;
	};

	setFolderModules(files) {
		this.setModules(files, this.modulesBag);
	}

	/**
	 * Saves modules. Serves for recursive purposes
	 *
	 * @param files {Array} contains absolute path to file or folder
	 * @param modules {Object} contains .js class information, works as linked variable
	 * @returns {*}
	 */
	setModules(files, modules) {
		files.map(path =>
			cpObj(modules, this.getModules(path))
		);
	}

	getModules(path) {
		return file.isDirectory(path)
				? this.crawlEntities(path)
				: getModule(path);
	}

	/**
	 * Clear modulesBag variable
	 */
	eraseMemoryModules() {
		this.modulesBag = undefined;
		if (typeof global.gc != 'undefined') global.gc();
	}
}

const cpObj = (src, merge) =>
	Object.assign(src, merge);

const getModule = path =>
	getObjectParsedClassFile(getParsedClassFiles(path), path);

const getObjectParsedClassFile = (parsedClass, path) =>
	({ [parsedClass.name]: { ...parsedClass, path } });

const getParsedClassFiles = path =>
	classParser.parseClass(file.getFileContent(path));

module.exports = new EntityManager();