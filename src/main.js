const {app, BrowserWindow, ipcMain} = require('electron')

let mainWindow

function createWindow () {
  // 创建窗口
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  //加载主页
  mainWindow.loadFile('./src/view/index.html')

  // 启用开发者工具
  //mainWindow.webContents.openDevTools()

//窗口关闭
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// 窗口初始化
app.on('ready', createWindow)

// 所有窗口关闭
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//窗口激活
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

//接收到此消息关闭程序
ipcMain.on("window-close",()=>{
  mainWindow.close();
});

//接收到此消息最小化
ipcMain.on("window-min",()=>{
  mainWindow.minimize();
});