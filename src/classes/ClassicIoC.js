let ClassicIoC = function(Temp, Test) {
	this.temp = Temp;
	this.test = Test;
};

ClassicIoC.prototype.someMethod = function(param) {
	console.log('just bark: ' + param);
};

ClassicIoC.prototype.newMethod = function() {
	console.log('here another test: ' + this.temp.getSomething());
};

//module.exports = ClassicIoC;