const { exec } = require('child_process');

// Command to list NW.js processes
const listProcessesCommand = 'tasklist | findstr "nw"';

// Command to kill NW.js processes
const killProcessCommand = 'taskkill /IM nw.exe /F';
// List NW.js processes
exec(listProcessesCommand, (error, stdout, stderr) => {
    if (error) {
        console.log(`No Remaining processes`);
        clear();
        return;
    }
    // Extract NW.js process IDs from the output
    const processIds = stdout.split(/\r?\n/).map(line => {
        const columns = line.trim().split(/\s+/);
        return columns[1]; // Assuming the PID is in the second column
    }).filter(_ => _);

    processIds.forEach(pid => {
        exec(`taskkill /PID ${pid} /F`, (killError, killStdout, killStderr) => {
            if (killError) {
                console.error(`Error killing process ${pid}: ${killError.message}`);
                return;
            }
            console.log(`Process ${pid} killed successfully`);
        });
    });
});

const clear = () => {
    setTimeout(() => {
        console.clear();
    }, 1000); 
};