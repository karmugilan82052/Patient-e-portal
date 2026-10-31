const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let backendDir = path.join(__dirname, 'backend');
let frontendDir = path.join(__dirname, 'frontend');

if (!fs.existsSync(backendDir)) {
    backendDir = path.join(__dirname, 'Patient Consultation', 'backend');
    frontendDir = path.join(__dirname, 'Patient Consultation', 'frontend');
}

console.log('============================================================');
console.log('🚀 Starting Patient Consultation Portal (Backend + Frontend)...');
console.log('============================================================\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// Start backend
const backend = spawn(process.execPath, ['server.js'], {
    cwd: backendDir,
    env: { ...process.env, PORT: '3000', IS_OFFLINE: 'true' },
    stdio: ['inherit', 'pipe', 'pipe']
});

backend.stdout.on('data', data => {
    process.stdout.write(`\x1b[36m[Backend]\x1b[0m ${data}`);
});
backend.stderr.on('data', data => {
    process.stderr.write(`\x1b[31m[Backend Error]\x1b[0m ${data}`);
});

// Start frontend
const frontend = spawn(npmCmd, ['run', 'dev'], {
    cwd: frontendDir,
    shell: isWin,
    stdio: ['inherit', 'pipe', 'pipe']
});

let printedBanner = false;

frontend.stdout.on('data', data => {
    const text = data.toString();
    process.stdout.write(`\x1b[32m[Frontend]\x1b[0m ${text}`);

    if (!printedBanner && (text.includes('localhost:') || text.includes('http://'))) {
        printedBanner = true;
        console.log('\n\x1b[32m============================================================');
        console.log('🎉 PORTAL IS RUNNING SUCCESSFULLY!');
        console.log('👉 Open in browser:  http://localhost:5173/');
        console.log('👉 Backend API:      http://localhost:3000/dev');
        console.log('------------------------------------------------------------');
        console.log('🔑 Test Accounts (Password for all: password123):');
        console.log('   • Admin:      admin@example.com');
        console.log('   • Doctors:    doctor@example.com (5-Roads), priya.raman@example.com (Junction),');
        console.log('                 rajesh.varma@example.com (Omalur), suresh.kumar@example.com (4-Roads)');
        console.log('   • Patients:   patient@example.com (Maria), hariharan@example.com,');
        console.log('                 arun.prasad@example.com, sneha.reddy@example.com');
        console.log('============================================================\x1b[0m\n');
    }
});

frontend.stderr.on('data', data => {
    process.stderr.write(`\x1b[33m[Frontend Info]\x1b[0m ${data}`);
});

function cleanup() {
    console.log('\nStopping servers...');
    if (backend && !backend.killed) {
        if (isWin) spawn('taskkill', ['/pid', backend.pid, '/f', '/t'], { shell: true });
        else backend.kill();
    }
    if (frontend && !frontend.killed) {
        if (isWin) spawn('taskkill', ['/pid', frontend.pid, '/f', '/t']);
        else frontend.kill();
    }
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
