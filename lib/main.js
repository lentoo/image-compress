const { app, BrowserWindow, ipcMain, shell } = require('electron')
const { imageCompress } = require('../lib/image-compress')
const path = require('path')
let win

let lock = app.requestSingleInstanceLock()
let willQuitApp = false
if (!lock) {
  app.quit()
} else {
  app.on('ready', () => {
    app.allowRendererProcessReuse = true
    create()
    win.on('close', e => {
      if (willQuitApp) {
        win = null
      } else {
        e.preventDefault()
        win.hide()
      }
    })
    ipcMain.on('compress', async (e, files) => {
      
      let outputDirname = path.dirname(files[0].path)
      let compressFiles = await imageCompress(files.map(f => f.path), outputDirname)
      compressFiles.forEach(file => {
        let f = files.find(f => f.path === file.sourcePath)
        if (f) {
          file.size = f.size
        }
      })
      e.sender.send('compress-success', compressFiles)
    })

    ipcMain.on('open-folder', (e, path) => {
      shell.showItemInFolder(path)
    })
  })

  app.on('second-instance', e => {
    show()
  })
  app.on('before-quit', e => {
    close()
  })
  app.on('activate', e => {
    show()
  })
}

function create () {
  win = new BrowserWindow({
    width: 400,
    height: 400,
    title: '图片压缩小工具',
    webPreferences: {
      nodeIntegration: true
    }
  })
  
  win.loadFile(path.resolve(__dirname, '../render/index.html'))
}
function show () {
  win.show()
}
/**
 * close .
 */

function close() {
  willQuitApp = true
  win.close()
}