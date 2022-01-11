export const tofU = v =>
	typeof v !== 'undefined';

export const gcRun = () =>
	tofU(global.gc) ? global.gc() : false;

export const cpObj = (src, merge) =>
	Object.assign(src ? src : {}, merge ? merge : {});