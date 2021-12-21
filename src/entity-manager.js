let file = require('./file.js'),
	getFileNamePath = require('./file-name'),
	parser = require('./parser/class.js'),
	{ unpackArray } = require('./array.js');

class EntityManager {

	/**
	 * Modules bag
	 *
	 * @type {Object}
	 */
	modulesBag = {};

	/**
	 *
	 * @param {String, Array} entity
	 * @param {String} fileName
	 */
	saveAutoloadListToFile(entity, fileName) {
		this.crawlEntities(entity);
		this.saveModules(fileName);
		this.eraseMemoryModules();
	}

	/**
	 * Crawl all folders in depth to collect classes, file names and parameters
	 *
	 * @param path {String, Array} allow to pass any amount of arguments
	 * @returns {Object}
	 */
	crawlEntities(path) {
		path = unpackArray([...arguments]);
		this.setFolderModules(path);
		return this.modulesBag;
	};

	setFolderModules(path) {
		this.setModules(file.getFolderFiles(path), this.modulesBag);
	}

	/**
	 * Saves modules. Serves for recursive purposes
	 *
	 * @param files {Array} contains absolute path to file or folder
	 * @param modules {Object} contains .js class information, works as linked variable
	 * @returns {Array}
	 */
	setModules(files, modules) {
		files.map(path =>
			cpObj(modules, this.getModules(path))
		);
	}

	getModules(path) {
		if (!path) return false;
		return file.isDirectory(path)
				? this.crawlEntities(path)
				: parser.parseClass(path);
	}

	/**
	 * @param {String} name
	 */
	saveModules(name) {
		file.writeFile(
			getFileNamePath('./', name),
			JSON.stringify(this.modulesBag, null, 4)
		);
	}

	/**
	 * Clear modulesBag variable
	 */
	eraseMemoryModules() {
		this.modulesBag = undefined;
		gcRun();
	}
}

const gcRun = () =>
	tofU(global.gc) ? global.gc() : false;

const tofU = v =>
	typeof v !== 'undefined';

const cpObj = (src, merge) =>
	Object.assign(src, merge);

module.exports = new EntityManager();