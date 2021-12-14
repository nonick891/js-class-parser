let fs = require('fs');

const getFileContent = filePath =>
	fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });

const getFolderFiles = folderPath =>
  fs.readdirSync(folderPath);

module.exports = { getFolderFiles, getFileContent };