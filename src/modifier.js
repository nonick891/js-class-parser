
const regModifier = /\'require\((.*)\).default\'/gm;

const stringModifier = path => `require("${path}").default`;

module.exports = {
	regModifier,
	stringModifier
};