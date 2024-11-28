import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1094,
    height: 1957,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 监听窗口大小变化并发送事件
  mainWindow.on('resize', () => {
    const [width, height] = mainWindow.getSize()
    mainWindow.webContents.send('window-resize', { width, height })
  })

  // 处理获取窗口尺寸的请求
  ipcMain.handle('get-window-size', () => {
    const [width, height] = mainWindow.getSize()
    return { width, height }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// IPC 监听下载pdf请求
ipcMain.handle('download-pdf', async (_event, { PathName, url, filename }) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const projectRoot = path.resolve(__dirname, '../../')
    const saveDir = path.join(projectRoot, 'src', 'renderer', 'src', 'assets', 'pdf', PathName)
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true })
    }
    const fileExists = fs.existsSync(path.join(saveDir, filename))
    if (fileExists) {
      return { success: false, error: 'file exists' }
    }
    const filePath = path.join(saveDir, filename)
    fs.writeFileSync(filePath, response.data)
    return { success: true, path: filePath }
  } catch (error: any) {
    console.error(`download pdf "${filename}" failed:`, error)
    return { success: false, error: error.message }
  }
})

// 监听 下载视频请求
ipcMain.handle('download-video', async (_event, { PathName, url, filename }) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const contentType = response.headers['content-type']

    // 允许的视频类型
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/mkv']

    if (!allowedVideoTypes.includes(contentType)) {
      return { success: false, error: `unsupported video type: ${contentType}` }
    }

    // 根据 Content-Type 确定扩展名
    const extension = contentType.split('/').pop()
    const validatedFilename = `${path.parse(filename).name}.${extension}`

    const projectRoot = path.resolve(__dirname, '../../')
    const saveDir = path.join(projectRoot, 'src', 'renderer', 'src', 'assets', 'ads', PathName)

    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true })
    }

    const filePath = path.join(saveDir, validatedFilename)

    // if file exists, return the path
    if (fs.existsSync(filePath)) {
      return { success: true, path: filePath }
    }

    fs.writeFileSync(filePath, response.data)
    return { success: true, path: filePath }
  } catch (error: any) {
    console.error(`download video "${filename}" failed:`, error)
    return { success: false, error: error.message }
  }
})

// 清理文件名函数
const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9_\-.]/g, '_')
}

// 监听下载图片请求
ipcMain.handle('download-image', async (_event, { PathName, url, filename }) => {
  try {
    const response = await axios.get(url, { responseType: 'stream', timeout: 10000 })
    let contentType = response.headers['content-type']

    if (contentType.includes(';')) {
      contentType = contentType.split(';')[0].trim()
    }

    const allowedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/jpg',
      'image/svg+xml'
    ]

    if (!allowedImageTypes.includes(contentType)) {
      console.error(`unsupported image type: ${contentType}`) // 错误日志
      return { success: false, error: `unsupported image type: ${contentType}` }
    }

    // 根据 Content-Type 确定扩展名
    const extension = contentType.split('/').pop()
    const sanitizedFilename = sanitizeFilename(filename)
    const validatedFilename = `${path.parse(sanitizedFilename).name}.${extension}`

    const projectRoot = path.resolve(__dirname, '../../')
    const saveDir = path.join(projectRoot, 'src', 'renderer', 'src', 'assets', 'ads', PathName)

    console.log(`image will be saved to: ${saveDir}`) // 日志输出保存目录

    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true })
      console.log(`create directory: ${saveDir}`) // 日志输出
    }

    const filePath = path.join(saveDir, validatedFilename)

    console.log(`save path: ${filePath}`) // 日志输出保存路径

    // if file exists, return the path
    if (fs.existsSync(filePath)) {
      console.error(`file exists: ${filePath}`)
      return { success: true, path: filePath }
    }

    await pipeline(response.data, fs.createWriteStream(filePath))
    console.log(`image ${validatedFilename} download success, path: ${filePath}`) // 成功日志
    return { success: true, path: filePath }
  } catch (error: any) {
    console.error(`download image "${filename}" failed:`, error)
    return { success: false, error: error.message || 'unknown error' }
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
