const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {

    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        autoHideMenuBar: true,
    });

    const isDev = !app.isPackaged;

    if (isDev) {

        win.loadURL("http://localhost:5173");

    } else {

        win.loadFile(
            path.join(
                __dirname,
                "../dist/index.html"
            )
        );

    }

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {

        app.quit();

    }

});