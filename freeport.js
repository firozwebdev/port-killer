#!/usr/bin/env node

const path = require('path');
const sudo = require('sudo-prompt');

const port = process.argv[2];
if (!port || isNaN(port)) {
    console.error("Usage: node freeport.js <port>");
    process.exit(1);
}

const scriptPath = path.join(__dirname, 'freeport-helper.js');

const command = `node "${scriptPath}" ${port}`;
sudo.exec(command, { name: 'FreePort CLI' }, (error, stdout, stderr) => {
    if (error) {
        console.error("❌ Error:", error.message);
        return;
    }
    if (stderr) {
        console.error("⚠️", stderr.trim());
    }
    console.log(stdout.trim());
});
