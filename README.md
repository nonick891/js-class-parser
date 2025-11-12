## Class parser
Scan folders and single files for javascript native classes. Converts the list of classes into `.json` or `.js` file.

### JS file
Can be used for dependency injection purposes. Output `require` function in path variable.

File `test.js`:
```js
export default class Test {
    constructor(AnotherInstanceClass) {
        // Will parse parameter as class name
        this.another = AnotherInstanceClass;
    }
}
```

Parsing `@injects` param in class js DocBlock for detecting of new instance or prototype passing. Can have only two values `instance` or `prototype`.
File `another-instance-class.js`:
```js
/**
 * @injects instance
 */
 export default class AnotherInstanceClass {
    showInfo() {
        console.log('test output');
    }
 }
```
Output file with parsed classes example:
```js
export default {
    'Test': {
        'name': 'Test',
        'path': require('./test.js').default,
        'params': [
            'AnotherInstanceClass'
        ]
    },
    'AnotherInstanceClass': {
        'name': 'AnotherInstanceClass',
        'path': require('./another-instance-class.js').default,
        'inject': 'instance'
    }
}
```

## Compilation build

```js
let entityAuditor = require('entity-auditor');

entityAuditor.initModuleBuilder({
	classFilesFolder,
	outputFilePath,
	excludeFiles,
	detectNewFiles
});

module.exports = {};
```

## Hot reload

```js
let entityAuditor = require('entity-auditor');

module.exports = {
    plugins: [
        new entityManager.EntityManagerWatchPlugin({
            classFilesFolder,
            outputFilePath,
            excludeFiles,
            detectNewFiles
        }),
    ]
}
```

Example container for dependency managing:

```
class Container {
	constructor() {
		this._services = new Map();
		this._singletons = new Map()
	}
	
	register(name, definition, dependencies) {
		this._services.set(name, { definition: definition, dependencies: dependencies })
	}
	
	singleton(name, definition, dependencies) {
		this._services.set(name, { definition: definition, dependencies: dependencies, singleton:true })
	}
	
	get(name) {
		const c = this._services.get(name);
		if (Container._isClass(c.definition)) {
			if (c.singleton) {
				const singletonInstance = this._singletons.get(name);
				if (singletonInstance) {
					return singletonInstance
				} else {
					const newSingletonInstance = this._createInstance(c);
					this._singletons.set(name, newSingletonInstance);
					return newSingletonInstance
				}
			}
			return this._createInstance(c)
		} else {
			return c.definition
		}
	}
	
	_getResolvedDependencies(service) {
		let classDependencies = [];
		if (service.dependencies) {
			classDependencies = service.dependencies.map(dep => this.get(dep))
		}
		return classDependencies
	}
	
	_createInstance(service) {
		return new service.definition(...this._getResolvedDependencies(service))
	}
	
	static _isClass(definition) {
		return typeof definition === 'function'
	}
}
export default Container

```