const {app, BrowserWindow} = require ('electron');
const path = require ('path');
const { spawn } = require('child_process');

let pythonBackend;
function startBackend(){
    const script = path.join(__dirname, 'api',  'API.py');

    pythonBackend = spawn('python', ['-m', 'uvicorn', 'API:app', '--host', '127.0.0.1', '--port', '8000'], {
        cwd: path.join(__dirname, 'api'),
        shell: true,
        stdio: 'inherit',
    });
}

function stopBackend(){
    if (pythonBackend){
        console.log("Chiudendo backend...");
        pythonBackend.kill();
    }
}


function createWindow(){
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences:{
            contextIsolation: false,
            nodeIntegration: true,
        }
    });
    win.setMenuBarVisibility(false); //toglie la menu bar in alto della finestra
    win.loadFile(path.join(__dirname, 'code', 'home.html')); //fa partire home.html

}

app.whenReady().then(() => {
    startBackend();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
    console.log("Electron si sta chiudendo...")
    stopBackend();
});
