const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const { imageCompress } = require('../lib/image-compress')
const path = require('path')
let win

let lock = app.requestSingleInstanceLock()
let willQuitApp = false
if (!lock) {
  app.quit()
} else {
  app.on('ready', () => {
    // 
    // if (!lock) {
    //   app.quit()
    // } else {
    //   if (win) win.show()
    // }
    app.allowRendererProcessReuse = true
    create()
    win.on('close', e => {
      console.log('close')
      if (willQuitApp) {
        win = null
      } else {
        e.preventDefault()
        win.hide()
      }
    })
    ipcMain.on('compress', async (e, files) => {
      console.log('ipcMain compress');
      
      let outputDirname = path.dirname(files[0])
      let compressFiles = await imageCompress(files, outputDirname)
      e.sender.send('compress-success', compressFiles)
      const notification = new Notification({
        title: '图片压缩工具',
        body: 'success',
        closeButtonText: '关闭',
        actions: [
          {
            type: 'button',
            text: '知道了'
          }
        ]
      })
      notification.show()
    })
  })

  app.on('second-instance', e => {
    show()
  })
  app.on('before-quit', e => {
    console.log('before-quit');
    close()
  })
  app.on('activate', e => {
    console.log('activate')
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