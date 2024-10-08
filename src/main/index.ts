import { app, BrowserWindow, dialog } from 'electron'
import { readFile } from 'fs/promises'
import { join } from 'path'

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(
      join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    )
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
    showOpenDialog()
  })

  mainWindow.webContents.openDevTools({
    mode: 'detach'
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

async function showOpenDialog() {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Markdown File', extensions: ['md'] }]
  })

  if (result.canceled) return

  const [filePath] = result.filePaths

  const content = await openFile(filePath)

  console.log(result)
  console.log(content)
}

async function openFile(filePath: string): Promise<string> {
  return await readFile(filePath, { encoding: 'utf-8' })
}
