let path = require('path'),
	classesPath = path.resolve('./classes/'),
	classLoader = require('./src/loader.js'),
	classesModules = classLoader(classesPath);
module.exports = classLoader;