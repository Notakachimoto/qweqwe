import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Client } from 'pg'

const connectDB = async () =>{
  const client = new Client({
    user: 'postgres',
    password: 'root',
    localhost: 'localhost',
    port: '5432',
    database: 'demo_25_2'
  })
  await client.connect()
  return client
}

async function getUsers() {
  try{
  const response = await global.dbclient.query(`
    WITH income AS (
        SELECT b.ceo, 
              b.job,
              b.org, 
              REPLACE(b.salary, ',', '')::INTEGER AS salary
        FROM budget b
    ),
    expenses AS (
        SELECT t.ceo,
              SUM(p.price * t.count) AS total_expense
        FROM transaction t
        JOIN products p ON t.name = p.name
        GROUP BY t.ceo
    )
    SELECT i.ceo, 
          i.job,
          i.org,
          i.salary AS income,
          COALESCE(e.total_expense, 0) AS expenses,
          i.salary - COALESCE(e.total_expense, 0) AS balance,
          CASE 
              WHEN i.salary - COALESCE(e.total_expense, 0) > 0 THEN 'Профицит'
              WHEN i.salary - COALESCE(e.total_expense, 0) < 0 THEN 'Дефицит'
              ELSE 'Без изменений'
          END AS status
    FROM income i
    LEFT JOIN expenses e ON i.ceo = e.ceo;
    `)
    console.log(response.rows)
    return response.rows
  } catch (e){
    console.log(e)
  }
  
}

async function foo(event, data) {
  try {
    console.log(data)
    dialog.showMessageBox({ message: 'message back' })
  } catch (e) {
    dialog.showErrorBox('Ошибка', e)
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then( async () => {
  electronApp.setAppUserModelId('com.electron')
  global.dbclient = await connectDB()

  ipcMain.handle('sendSignal', foo)
  ipcMain.handle('getUsers', getUsers)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
