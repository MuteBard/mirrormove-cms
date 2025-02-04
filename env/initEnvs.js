"use strict";

const fs = require("fs");
const path = require("path");
const { spawn } = require('child_process');
const environment = process.argv[2];

// need to set some environment variables so the settings file generates correctly.
const ENV = process.env; // eslint-disable-line no-process-env
fs.readFileSync(path.join(__dirname, `${environment}.env`), "utf8")
	.split("\n")
	.forEach((line) => {
		line = line.trim();
		if (!line || line.startsWith("#")) {
			return;
		}

		const parts = line.split("=");
		const name = parts[0];
		const value =
			(parts.slice(1).join("=").startsWith('"') &&
				parts.slice(1).join("=").endsWith('"')) ||
			(parts.slice(1).join("=").startsWith("'") &&
				parts.slice(1).join("=").endsWith("'"))
				? parts.slice(1).join("=").slice(1, -1)
				: parts.slice(1).join("=");
		ENV[name] = value;
	});

//To ensure that env's are passed in nw/src. Not compatible as package.json run command
const child = spawn('nw', ['src/'], {
	stdio: 'inherit',
	shell: true
});

child.on('exit', (code, signal) => {
	console.log(`nw process exited with code ${code} and signal ${signal}`);
});