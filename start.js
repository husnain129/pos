// Setup events only for installer builds (not portable)
try {
  const setupEventsPath = "./installers/setupEvents";
  if (require.resolve(setupEventsPath)) {
    const setupEvents = require(setupEventsPath);
    if (setupEvents.handleSquirrelEvent()) {
      return;
    }
  }
} catch (e) {
  // setupEvents not available in portable build, continue normally
}

const server = require("./server");
const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const remoteMain = require("@electron/remote/main");
remoteMain.initialize();

const contextMenu = require("electron-context-menu");

let mainWindow;

function createWindow() {
  var primaryDisplay = screen.getPrimaryDisplay();
  var screenDimensions = primaryDisplay.workAreaSize;
  mainWindow = new BrowserWindow({
    width: screenDimensions.width,
    height: screenDimensions.height,
    frame: false,
    minWidth: 1200,
    minHeight: 750,
    title: "Creative Hands - Point of Sale System",

    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  remoteMain.enable(mainWindow.webContents);

  mainWindow.maximize();
  mainWindow.show();

  mainWindow.loadURL(`file://${path.join(__dirname, "index.html")}`);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("app-quit", (evt, arg) => {
  app.quit();
});

ipcMain.on("app-reload", (event, arg) => {
  mainWindow.reload();
});

contextMenu({
  prepend: (params, browserWindow) => [
    {
      label: "DevTools",
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      },
    },
    {
      label: "Reload",
      click() {
        mainWindow.reload();
      },
      // },
      // {  label: 'Quit',  click:  function(){
      //    mainWindow.destroy();
      //     mainWindow.quit();
      // }
    },
  ],
});
