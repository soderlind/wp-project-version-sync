#!/usr/bin/env node

// Import required modules
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');

// Regular expression pattern to match WordPress version numbers in file headers
const wpVersionPattern = /((?:<\?php\s+)?Stable tag:|Version:|"version":)(\s+)(["']?)(\d+\.\d+\.\d+)(["']?)/i;

// Run the program.
run();

// Main function to run the program
function run() {
	// Define command line options
	program
		.option('-s, --src [srcFile]', "Source of version. Default is your project's package.json")
		.option('-p, --path <path...>', "Relative path to your plugin or theme's file header.")
		.parse(process.argv);

	// Get values of command line options
	const srcFileVal = program.srcFile || 'package.json';
	const pathVal = program.opts().path || null;
	const pathsVal = program.args || null;

	// Check if source file is package.json
	if (srcFileVal !== 'package.json') {
		console.error(chalk.red('package.json is the only accepted source at the moment.'));
		return;
	}

	// Check if any paths were specified
	if (!pathVal) {
		console.error(chalk.red('No paths were specified.'));
		return;
	}

	// Print source file and default message
	console.log(
		`Source: ${srcFileVal} ${srcFileVal === 'package.json' ? chalk.green('(Default)') : ''}\n`
	);

	// Combine path values into a single array
	const paths = [...pathVal, ...pathsVal];

	// Loop through each path and update file header
	let errors = false;
	paths.forEach((p) => {
		if (fs.existsSync(p)) {
			updateFileHeader(p);
		} else {
			console.error(chalk.red(`${p} could not be found.`));
			errors = true;
		}
	});

	// Print success or error message
	if (errors) {
		console.log(chalk.yellow('Done with errors.'));
	} else {
		console.log(chalk.green('Done without errors.'));
	}
}

// Function to update the version number in a file header
function updateFileHeader(pathToFile, version = getPackageJsonVersion()) {
	// Replace old version number with new version number
	const newContent = replaceFileHeaderVersion(pathToFile, version);
	// Write new content to file
	fs.writeFileSync(pathToFile, newContent, 'utf8');
}

// Function to get the version number from package.json
function getPackageJsonVersion() {
	const packageJson = require(path.resolve(process.cwd(), 'package.json'));
	return packageJson.version;
}

// Function to replace the version number in a file header
function replaceFileHeaderVersion(pathToFile, version) {
	// Replace old version number with new version number
	const replaceOutput = function (match, before, whitespace, maybeQuote, oldVersion) {
		return before + whitespace + maybeQuote + version + maybeQuote;
	};
	// Read file contents
	const file = fs.readFileSync(pathToFile, 'utf8');
	// Replace version number in file contents
	return file.replace(wpVersionPattern, replaceOutput);
}

// Export functions for testing
module.exports = {
	updateFileHeader,
	getPackageJsonVersion,
	replaceFileHeaderVersion,
};
