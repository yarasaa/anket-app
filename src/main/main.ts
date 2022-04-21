/* eslint-disable no-self-compare */
/* eslint-disable func-names */
/* eslint-disable promise/no-nesting */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable spaced-comment */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  Tray,
  ipcMain,
  screen,
  nativeImage,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fetch from 'electron-fetch';
import Store from 'electron-store';
import { preloadScriptPath } from 'electron-debug';
import { resolveHtmlPath } from './util';

const store = new Store();

let username = '';
const dateFormat = new Date().toISOString().slice(0, 10);

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  console.log(key, val, '********');
  if (key === 'username') {
    username = val;
  }
  store.set(key, val);
});

let isAppQuitting = false;
let tray = null;
const hour = new Date();
const pcTime = new Date();
hour.setHours(randomHour(9, 11), randomMinute(1, 58), 0);

console.log(hour);

function randomHour(min: any, max: any) {
  return Math.random() * (max - min) + min;
}
function randomMinute(min: any, max: any) {
  return Math.random() * (max - min) + min;
}

function traySystem() {
  const img = nativeImage.createFromPath(
    path.join(__dirname, 'assets', 'icon.png')
  );

  tray = new Tray(img);
  tray.setToolTip('Anket Uygulaması');
  tray.on('click', () => {
    mainWindow?.isVisible() ? mainWindow.hide() : mainWindow?.show();
  });
}

function startNotifyTimerAM() {
  var timeInterval: any = setInterval(() => {
    store.set('date', new Date());
    if (hour === pcTime) {
      console.log(hour, pcTime);
      mainWindow.show();
      clearInterval(timeInterval);
      hour.setHours(randomHour(13, 17), randomMinute(1, 58), 0);
      startNotifyTimerPM();
    }
  }, 1000);
}
let afterRemoveOsName = '';
function osUserName() {
  const os = require('os');
  const osName = os.userInfo().username;
  afterRemoveOsName = osName.slice(2);
  console.log(afterRemoveOsName);
  //window.electron.store.set('osUser', afterRemoveOsName);

  ipcMain.on('electron-store-set', async (event, key, val) => {
    console.log(key, val, '********');

    store.set('osUser', afterRemoveOsName);
  });
}

osUserName();
function startNotifyTimerPM() {
  var timeInterval: any = setInterval(() => {
    store.set('date', new Date());
    if (hour === pcTime) {
      console.log(hour, pcTime);
      clearInterval(timeInterval);
      hour.setHours(randomHour(9, 11), randomMinute(1, 58), 0);
      startNotifyTimerAM();
    }
  }, 1000);
}

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: any | null = null;

ipcMain.on('ipc-example', async (event: any, arg: any) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 450,
    height: 300,
    icon: getAssetPath('happy.ico'),
    resizable: true,
    autoHideMenuBar: true,
    transparent: false,
    frame: true,
    minimizable: false,
    alwaysOnTop: true,
    opacity: 0.9,
    titleBarStyle: 'default',
    x: screen.getPrimaryDisplay().workAreaSize.width - 450,
    y: screen.getPrimaryDisplay().workAreaSize.height - 300,

    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      devTools: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    mainWindow.hide();
  });

  mainWindow.on('minimize', function (event: any) {
    event.preventDefault();
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // eslint-disable-next-line func-names
  mainWindow.on('close', function (event: any) {
    console.log(afterRemoveOsName);
    fetch(`https://localhost:7038/api/UserInfoAdd?sicilNo=${afterRemoveOsName}`)
      .then((res: { json: () => any }) => res.json())
      .then((json: { id?: any; data: any }) => {
        console.log(json.id);
        let body = {
          userId: json.data.id,
          department: json.data.department,
          section: json.data.section,
          unit: json.data.unit,
          voteDate: dateFormat,
          vote: 0,
        };
        fetch('https://localhost:7038/api/userTest', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res1: { json: () => any }) => res1.json())
          .then((json1: any) => console.log(json1))
          .catch((error: any) => {
            console.log('Main post hatası', error);
          });
      })
      .catch((e: { message: any }) => {
        console.log('error', e.message);
      });
    //
    // await getUserInfo();
    console.log('jhkjhkjhj');
    if (!isAppQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
  // let postData = {
  //   department:window.electron.store.get('databaseDepartment') || null,
  //   section:window.electron.store.get('databaseSection') || null,
  //   unit:window.electron.store.get('databaseUnitName') || null,
  //   vote: 0,
  //   userId: window.electron.store.get('userIdToMain'),
  //   votedate:dateFormat

  // };
  // function postUserData(params:any) {

  // }

  // async function getUserInfo() {
  //   // console.log(afterRemoveOsName)
  //   // const result = await API.USERS_POSTINFO(afterRemoveOsName);
  //   // console.log(result.data)

  //   await fetch('https://localhost:7038/api/IKDb?sicilNo='+afterRemoveOsName)
  //   .then(res=>res.json())
  //   .then(json=>console.log(json))
  // }

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata: any) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('before-quit', function (event: any) {
  isAppQuitting = true;
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(createWindow)
  .then(traySystem)
  .then(() => {
    startNotifyTimerAM();
  })
  .catch((error) => {
    console.log('App when ready hatası', error);
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
