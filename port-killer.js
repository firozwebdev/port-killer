#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');
const sudo = require('sudo-prompt');

// Entry args
const args = process.argv.slice(2);
const isChild = args.includes('--child');
const port = args.find(a => !isNaN(parseInt(a)));

if (!port || isNaN(port)) {
    console.error("Usage: port-killer <port>");
    process.exit(1);
}

// Actual logic to kill the port
function freePort(port) {
    try {
        let pid;
        if (os.platform() === 'win32') {
            const output = execSync(`netstat -aon | findstr :${port}`).toString();
            const lines = output.trim().split('\n');
            for (const line of lines) {
                const parts = line.trim().split(/\s+/);
                if (parts[1].endsWith(`:${port}`)) {
                    pid = parts[4];
                    break;
                }
            }
            if (pid) {
                execSync(`taskkill /F /PID ${pid}`);
                console.log(`✅ Killed PID ${pid}. Port ${port} is now free.`);
                return;
            }
        } else {
            const output = execSync(`lsof -i :${port} -t`).toString();
            pid = output.trim().split('\n')[0];
            if (pid) {
                execSync(`kill -9 ${pid}`);
                console.log(`✅ Killed PID ${pid}. Port ${port} is now free.`);
                return;
            }
        }
        console.log(`✅ Port ${port} is already free.`);
    } catch (e) {
        console.log(`✅ Port ${port} is already free or an error occurred.`);
    }
}

// If child, run directly
if (isChild) {
    freePort(port);
    process.exit(0);
}

// Else, run with elevation
const execPath = process.execPath.includes('node.exe') ? `"${process.execPath}" "${__filename}"` : `"${process.execPath}"`;
const cmd = `${execPath} --child ${port}`;

sudo.exec(cmd, { name: 'Port Killer' }, (error, stdout, stderr) => {
    if (error) {
        console.error("❌ Error:", error.message);
        return;
    }
    if (stderr) console.error("⚠️", stderr.trim());
    console.log(stdout.trim());
});
