const tofU = v =>
	typeof v !== 'undefined';

const gcRun = () =>
	tofU(global.gc) ? global.gc() : false;

const cpObj = (src, merge) =>
	Object.assign(src ? src : {}, merge ? merge : {});

module.exports = {
	gcRun, cpObj
}