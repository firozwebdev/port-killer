const { execSync } = require('child_process');
const os = require('os');

const port = process.argv[2];

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

freePort(port);
