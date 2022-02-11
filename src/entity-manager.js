let file = require('./file.js'),
	parser = require('./parser/class.js'),
	getWatchPlugin = require('./entity-manager-plugin'),
	{ getFileNamePath, getRelativePath } = require('./file-name'),
	{ unpackArray, getArray } = require('./array.js'),
	{ gcRun, cpObj } = require('./helper'),
	{ regModifier } = require('./modifier');

class EntityManager {

	/**
	 * Files info bag
	 * @type {Object}
	 */
	modulesBag = {};

	/**
	 * Watcher list of directories, launches rebuild on change.
	 * @type {Object}
	 */
	watchers = {};

	config = {
		fileType: 'json',
		modulesRootPath: './',
		isRequireWrapped: false
	};

	EntityManagerWatchPlugin = (getWatchPlugin.bind(this))();

	/**
	 * @param {Object} options {
	 *  entity <{String, Array} classes includes in modules file>,
	 *  fileName <{String}>,
	 *  exclude <{String, Array} entity to exclude from result file>,
	 *  watch <{String} watch folder for new js class files>
	 * }
	 */
	initModuleBuilder(options) {
		this.setUpConfig(options);
		this.buildModuleFile();
	}

	setUpConfig({entity, fileName, exclude, watch}) {
		this.excluded = getArray(exclude);
		let isJs = file.getExtName(fileName) === '.js';
		this.config = {
			name: fileName, entity, watch,
			isRequireWrapped: isJs,
			fileType: isJs ? 'js' : 'json',
			modulesRootPath: getRelativePath(fileName)
		};
	}

	buildModuleFile() {
		this.initModulesBag();
		this.addWatcher(this.config.watch);
		this.crawlEntities(this.config.entity);
		this.saveModules(this.config.name);
		this.eraseMemoryModules();
	}

	addWatcher(folder) {
		if (!folder || this.watchers[folder]) return false;
		let create = this.buildModuleFile.bind(this);
		this.watchers[folder] = file.watchFolder({
			folder, create, update: create, error: create
		});
	}

	removeWatchers() {
		Object.keys(this.watchers).map(folder =>
			this.watchers[folder].close()
		);
	}

	initModulesBag() {
		this.modulesBag = !this.modulesBag ? {} : this.modulesBag;
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
			.replace(
				regModifier,
				string => string.slice(1, -1).replace(/\\/gm, '')
			);
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