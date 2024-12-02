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
// download pdf
ipcMain.handle('download-pdf', async (_event, { PathName, url, filename }) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })

    // 获取用户数据目录
    const userDataPath = app.getPath('userData')
    const saveDir = path.join(userDataPath, 'downloads', 'pdf', PathName)

    console.log(`[download-pdf] userDataPath: ${userDataPath}`)
    console.log(`[download-pdf] PathName: ${PathName}`)
    console.log(`[download-pdf] saveDir: ${saveDir}`)

    // 确保保存目录存在
    await fs.promises.mkdir(saveDir, { recursive: true })
    console.log(`[download-pdf] Ensured directory exists: ${saveDir}`)

    const sanitizedFilename = sanitizeFilename(filename)
    const filePath = path.join(saveDir, sanitizedFilename)
    console.log(`[download-pdf] filePath: ${filePath}`)

    try {
      await fs.promises.access(filePath)
      console.warn(`[download-pdf] File already exists: ${filePath}`)
      return { success: true, path: filePath }
    } catch {
      // 文件不存在，继续下载
      await fs.promises.writeFile(filePath, response.data)
      console.log(`[download-pdf] Successfully downloaded PDF to: ${filePath}`)
      return { success: true, path: filePath }
    }
  } catch (error: any) {
    console.error(`download pdf "${filename}" failed:`, error)
    return { success: false, error: error.message }
  }
})

// download video
ipcMain.handle('download-video', async (_event, { PathName, url, filename }) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const contentType = response.headers['content-type']

    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/mkv']

    if (!allowedVideoTypes.includes(contentType)) {
      return { success: false, error: `unsupported video type: ${contentType}` }
    }
    const extension = contentType.split('/').pop()
    const validatedFilename = `${path.parse(filename).name}.${extension}`

    const userDataPath = app.getPath('userData')
    const saveDir = path.join(userDataPath, 'downloads', PathName)

    console.log(`[download-video] userDataPath: ${userDataPath}`)
    console.log(`[download-video] PathName: ${PathName}`)
    console.log(`[download-video] saveDir: ${saveDir}`)
    console.log(`[download-video] validatedFilename: ${validatedFilename}`)

    // 确保保存目录存在
    await fs.promises.mkdir(saveDir, { recursive: true })
    console.log(`[download-video] Ensured directory exists: ${saveDir}`)

    const filePath = path.join(saveDir, validatedFilename)
    console.log(`[download-video] filePath: ${filePath}`)

    try {
      await fs.promises.access(filePath)
      console.warn(`[download-video] File already exists: ${filePath}`)
      return { success: true, path: filePath }
    } catch {
      // 文件不存在，继续下载
      await fs.promises.writeFile(filePath, response.data)
      console.log(`Video ${validatedFilename} download success, path: ${filePath}`)
      return { success: true, path: filePath }
    }
  } catch (error: any) {
    console.error(`download video "${filename}" failed:`, error)
    return { success: false, error: error.message }
  }
})

// sanitize filename
const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9_\-.]/g, '_')
}

// download image
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
      console.error(`unsupported image type: ${contentType}`)
      return { success: false, error: `unsupported image type: ${contentType}` }
    }

    const extension = contentType.split('/').pop()
    const sanitizedFilename = sanitizeFilename(filename)
    const validatedFilename = `${path.parse(sanitizedFilename).name}.${extension}`

    const userDataPath = app.getPath('userData')
    const saveDir = path.join(userDataPath, 'downloads', PathName)

    console.log(`[download-image] userDataPath: ${userDataPath}`)
    console.log(`[download-image] PathName: ${PathName}`)
    console.log(`[download-image] saveDir: ${saveDir}`)
    console.log(`[download-image] validatedFilename: ${validatedFilename}`)

    // 确保保存目录存在
    await fs.promises.mkdir(saveDir, { recursive: true })
    console.log(`[download-image] Ensured directory exists: ${saveDir}`)

    const filePath = path.join(saveDir, validatedFilename)
    console.log(`[download-image] filePath: ${filePath}`)

    try {
      await fs.promises.access(filePath)
      console.warn(`[download-image] File already exists: ${filePath}`)
      return { success: true, path: filePath }
    } catch {
      // 文件不存在，继续下载
      await pipeline(response.data, fs.createWriteStream(filePath))
      console.log(`Image ${validatedFilename} download success, path: ${filePath}`)
      return { success: true, path: filePath }
    }
  } catch (error: any) {
    console.error(`download image "${filename}" failed:`, error)
    return { success: false, error: error.message || 'unknown error' }
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
