// Import required modules
const fs = require('fs');
const path = require('path');

// Mock console methods for testing
const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});

// Import functions from cli.js
const { updateFileHeader, getPackageJsonVersion, replaceFileHeaderVersion } = require('../bin/cli');

// Define tests
test('Get version from package.json', () => {
	// Test that the version number is returned in the correct format
	expect(getPackageJsonVersion()).toMatch(/(\d+\.){1,3}\d+/);
});

test('Replace version in file header', () => {
	// Test that the version number is replaced in the file header for each file type
	['css', 'php', 'block', 'readme'].forEach((ext) => {
		const beforeFilePath = path.resolve(__dirname, `samples/${ext}-file-header.before`);
		const afterFilePath = path.resolve(__dirname, `samples/${ext}-file-header.after`);

		const afterFile = fs.readFileSync(afterFilePath, 'utf8');

		expect(replaceFileHeaderVersion(beforeFilePath, '1.1.0')).toEqual(afterFile);
	});
});

test('Support CRLF line endings', () => {
	// Test that the version number is replaced in the file header for a file with CRLF line endings
	const beforeFilePath = path.resolve(__dirname, `samples/php-file-header-crlf.before`);
	const afterFilePath = path.resolve(__dirname, `samples/php-file-header-crlf.after`);

	const afterFile = fs.readFileSync(afterFilePath, 'utf8');

	expect(replaceFileHeaderVersion(beforeFilePath, '1.1.0')).toEqual(afterFile);
});

test('Update file with new version in the file header', () => {
	// Test that the file header is updated with the new version number
	const refFilePath = path.resolve(__dirname, 'samples/css-file-header.before');
	const refFile = fs.readFileSync(refFilePath, 'utf8');
	const resultFilePath = path.resolve(__dirname, 'samples/css-file-header.after');
	const resultFile = fs.readFileSync(resultFilePath, 'utf8');
	const tempFilePath = './test/file-header.temp';

	fs.writeFileSync(tempFilePath, refFile, 'utf8');
	updateFileHeader(tempFilePath, '1.1.0');
	const tempFile = fs.readFileSync(tempFilePath, 'utf8');
	fs.unlinkSync(tempFilePath);

	expect(tempFile).toEqual(resultFile);
});

// Restore console methods after testing
consoleErrorMock.mockRestore();
consoleWarnMock.mockRestore();
consoleLogMock.mockRestore();