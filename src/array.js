const unpackArray = arrayOfArrays =>
	[].concat.apply([], arrayOfArrays);

module.exports = { unpackArray };