let file = require('./file.js'),
	parser = require('./parser/class.js'),
	{ getFileNamePath } = require('./file-name'),
	{ unpackArray, getArray } = require('./array.js'),
	{ gcRun, cpObj } = require('./helper');

class EntityManager {

	/**
	 * Files info bag
	 * @type {Object}
	 */
	modulesBag = {};

	config = {
		fileType: 'json',
		modulesRootPath: './',
		isRequireWrapped: false
	};

	/**
	 *
	 * @param {String, Array} entity to include in result file
	 * @param {String} fileName
	 * @param {String, Array} exclude entity to exclude from result file
	 */
	saveAutoloadListToFile(entity, fileName, exclude) {
		this.excluded = getArray(exclude);
		this.setUpConfig(fileName);
		this.crawlEntities(entity);
		this.saveModules(fileName);
		this.eraseMemoryModules();
	}

	setUpConfig(name) {
		let isJs = file.getExtName(name) === '.js';
		this.config = {
			fileType: isJs ? 'js' : 'json',
			isRequireWrapped: isJs,
			modulesRootPath: this.getRelativePath(name)
		};
		this.modulesBag = !this.modulesBag ? {} : this.modulesBag;
	}

	getRelativePath(name) {
		let times = name.match(/\/[a-z]+/g, '/').length;
		return times > 0
		       ? '../'.repeat(times).replace(/\/$/g, '')
		       : '.';
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
	}

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
		if (!path || this.isExcluded(path)) return false;
		return file.isDirectory(path)
				? this.crawlEntities(path)
				: parser.parseClass(path, this.config);
	}

	isExcluded(path) {
		return this.excluded.find(p => path.indexOf(p) > -1);
	}

	/**
	 * @param {String} name
	 */
	saveModules(name) {
		let modulesObject = this.getModulesString(name);
		if (!modulesObject) return false;
		file.writeFile(
			getFileNamePath('./', name),
			modulesObject
		);
	}

	getModulesString() {
		return this.getFileContent(
			this.getFormatted("\t", true)
		);
	}

	getFileContent(content) {
		if (!content) return false;
		return this.isJsConf()
		       ? this.modifyJs(content)
		       : content;
	}

	modifyJs(content) {
		return `export default ${content}`
			.replace(/'require\(\\/g, 'require(')
			.replace(/\\'\)\.default'/g, '\').default');
	}

	isJsConf() {
		return this.config.fileType === 'js';
	}

	getFormatted(space, quoteChange) {
		if (!this.modulesBag) return false;
		let string = JSON.stringify(this.modulesBag, null, space);
		return quoteChange
			? string.replace(/\"/gm, "'")
			: string;
	}

	/**
	 * Clear modulesBag variable
	 */
	eraseMemoryModules() {
		this.modulesBag = undefined;
		gcRun();
	}
}

module.exports = new EntityManager();