const unpackArray = arrayOfArrays =>
	[].concat.apply([], arrayOfArrays);

const getArray = arr =>
	Array.isArray(arr) ? arr : [arr];

module.exports = { unpackArray, getArray };