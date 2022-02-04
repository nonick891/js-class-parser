module.exports = function getHotReloadPlugin() {
	const events = {
			watchRun: 'buildModuleFile',
			watchClose: 'removeWatchers',
			failed: 'removeWatchers'
		};
	function HotReloadPlugin() {}
	const PLUGIN_NAME = HotReloadPlugin.name;
	/**
	 * @this EntityManager
	 * @param {Object} compiler
	 */
	HotReloadPlugin.prototype.apply = function({ hooks }) {
		Object.keys(events).map(name => hooks[name].tap(PLUGIN_NAME,
			this[events[name]].bind(this)
		));
	}.bind(this);
	return HotReloadPlugin;
};