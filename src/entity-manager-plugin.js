module.exports = class EntityManagerPlugin {
	constructor(entityManager) {
		this.entityManager = entityManager;
	}
	apply(compiler) {
		compiler.hooks.watchRun.tap('EntityManagerPlugin',
			this.entityManager.buildModuleFile.bind(this.entityManager)
		);
		compiler.hooks.watchClose.tap('EntityManagerPlugin',
			this.entityManager.removeWatchers.bind(this.entityManager)
		);
		compiler.hooks.failed.tap('EntityManagerPlugin',
			this.entityManager.removeWatchers.bind(this.entityManager)
		);
	}
}