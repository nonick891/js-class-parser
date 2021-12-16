/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("let classParser = __webpack_require__(/*! ./src/parser.js */ \"./src/parser.js\");\nmodule.exports = classParser;\n\n//# sourceURL=webpack://ioc-container-js/./index.js?");

/***/ }),

/***/ "./src/file.js":
/*!*********************!*\
  !*** ./src/file.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("let fs = __webpack_require__(Object(function webpackMissingModule() { var e = new Error(\"Cannot find module 'fs'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n\nconst getFileContent = filePath =>\n\tfs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });\n\nconst getFolderFiles = folderPath =>\n  fs.readdirSync(folderPath);\n\nmodule.exports = { getFolderFiles, getFileContent };\n\n//# sourceURL=webpack://ioc-container-js/./src/file.js?");

/***/ }),

/***/ "./src/parser.js":
/*!***********************!*\
  !*** ./src/parser.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("let file = __webpack_require__(/*! ./file.js */ \"./src/file.js\");\n\nconst getConstPos = file =>\n\tfile.indexOf('constructor');\nconst isClassCase = constPos =>\n\tconstPos > -1;\nconst getStringParams = content =>\n\tcutBetween(content, 'constructor', ')').replace('(', '');\nconst getClassName = content =>\n\tcutBetween(content, 'class', '{').replace(/[ ]+/, '');\nconst cutBetween = (str, startStr, endStr) => {\n\tlet pos = str.indexOf(startStr);\n\treturn str.slice(\n\t\tpos + startStr.length,\n\t\tstr.indexOf(endStr, pos)\n\t);\n};\nconst getArrayParams = paramsString =>\n\tparamsString ? paramsString.replace(/\\s/g, '').split(',') : [];\n\nmodule.exports = path => {\n\tlet modules = {},\n\t\tclasses = file.getFolderFiles(path);\n\tclasses.forEach(fileName => {\n\t\tlet filePath = `${path}/${fileName}`,\n\t\t\tcontent = file.getFileContent(filePath),\n\t\t\tconstPos = getConstPos(content),\n\t\t\tname = getClassName(content);\n\t\tmodules[name] = { name };\n\t\tif (isClassCase(constPos)) {\n\t\t\tlet paramsStr = getStringParams(content);\n\t\t\tmodules[name].params = getArrayParams(paramsStr);\n\t\t}\n\t});\n\treturn modules;\n};\n\n//# sourceURL=webpack://ioc-container-js/./src/parser.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;