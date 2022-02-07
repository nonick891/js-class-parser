/**
 * IDE helper for webpack compiler
 * @type {{hooks: {watchRun: {tap: Function}, watchClose: {tap: Function}, failed: {tap: Function}}}}
 */
module.exports = function getWatchPlugin() {

	function EntityManagerWatchPlugin() {}
	/**
	 * @this EntityManager
	 * @param {Object} compiler
	 */
	EntityManagerWatchPlugin.prototype.apply = function(compiler) {
		compiler.hooks.watchRun.tap(
			'EntityManagerWatchPlugin',
			this.buildModuleFile.bind(this)
		);
		compiler.hooks.watchClose.tap(
			'EntityManagerWatchPlugin',
			this.removeWatchers.bind(this)
		);
		compiler.hooks.failed.tap(
			'EntityManagerWatchPlugin',
			this.removeWatchers.bind(this)
		);
		compiler.hooks.done.tap(
			'EntityManagerWatchPlugin',
			process.argv.indexOf('--watch') === -1
				? this.removeWatchers.bind(this)
				: function(){}
		);
	}.bind(this);
	return EntityManagerWatchPlugin;
};