##Class parser
Scan folders and single files for javascript native classes. Converts the list of classes into `.json` or `.js` file.

###JS file
Can be used for dependency injection purposes. Output `require` function in path variable.

File `test.js`:
```
export default Test {
    constructor(AnotherInstanceClass) {
        // Will parse parameter as class name
        this.another = AnotherInstanceClass;
    }
}
```

Parsing `@injects` param in class js DocBlock for detecting of new instance or prototype passing. Can have only two values `instance` or `prototype`.
File `another-instance-class.js`:
```
/**
 * @injects instance
 */
 export default AnotherInstanceClass {
    showInfo() {
        console.log('test output');
    }
 }
```
Output file with parsed classes example:
```
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

##Hot reload

Maintain of watcher with dependency injection might be a tricky part. Consider to use webpack native progress plugin:

```
let entityAuditor = require('entity-auditor');

module.exports = {
    ...
    plugins: [
        ...
        new webpack.ProgressPlugin((percentage) => {
            if (percentage === 1) {
                entityAuditor.saveAutoloadListToFile(
                    includePaths, 
                    fileOutput, 
                    excludePaths
                );
            }
        })
        ...
    ]
}
```