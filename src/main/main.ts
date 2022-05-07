/* eslint-disable no-plusplus */
/* eslint-disable one-var */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-new */
/* eslint-disable no-unused-labels */
/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-labels */
/* eslint-disable vars-on-top */
/* eslint-disable import/newline-after-import */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable consistent-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable radix */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/naming-convention */
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
import electron, {
  app,
  BrowserWindow,
  shell,
  Tray,
  ipcMain,
  screen,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import Store from 'electron-store';

import { resolveHtmlPath } from './util';
var count = 0;
const os = require('os');

const appFolder = path.dirname(process.execPath);
const exeName = path.basename(process.execPath);
const time = new Date().getHours();
var CronJob = require('cron').CronJob;
const store = new Store();

// let username = '';s
// const dateFormat = new Date().toISOString().slice(0, 10);

// ipcMain.on('electron-store-set', async (event, key, val) => {
//   console.log(key, val, '********');
//   if (key === 'username') {
//     username = val;
//   }
//   store.set(key, val);
// });

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

let isAppQuitting = false;

// console.log(hour);

// function randomHour(min: any, max: any) {
//   return Math.random() * (max - min) + min;
// }
// function randomMinute(min: any, max: any) {
//   return Math.random() * (max - min) + min;
// }
// hour.setHours(randomHour(9, 11), randomMinute(1, 58), 0);

// function startNotifyTimerAM() {
//   var timeInterval: any = setInterval(() => {
//     var timeOffsetInHours = -new Date().getTimezoneOffset() / 60;
//     //console.log(timeOffsetInHours);
//     const pcTime = new Date();
//     store.set('date', new Date());

//     //Bilgisayar açıldı saati 10 olarak aldı. Bilgisayarda bir sıkıntı oldu restart atılması gerekti.
//     //Tekrar çalıştığı için uygulama aralıktan bu sefer 9 u seçti. Bundan dolayı seçtiği saat bilgisayar saatinden geride kaldı.
//     //
//     if (hour === pcTime) {
//       console.log(hour, pcTime);
//       mainWindow.show();
//       clearInterval(timeInterval);
//       hour.setHours(randomHour(13, 17), randomMinute(1, 58), 0);
//       startNotifyTimerPM();
//     } else if (hour !== pcTime) {
//       hour.setHours(randomHour(9, 11), randomMinute(1, 58), 0);
//     }
//     console.log('RandomHour: ', hour, 'PcTime: ', pcTime);
//   }, 1000);
// }

let afterRemoveOsName = '';

const osName = os.userInfo().username;
afterRemoveOsName = osName.slice(2);

ipcMain.on('electron-store-set', async (_event, _key, _val) => {
  // console.log(key, val, '********');
  // console.log(afterRemoveOsName, 'main');
  store.set('appVersion', app.getVersion());
  store.set('osUser', afterRemoveOsName);
});

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});

// function startNotifyTimerPM() {
//   var timeInterval: any = setInterval(() => {
//     const pcTime = new Date();
//     store.set('date', new Date());
//     if (hour === pcTime) {
//
//       console.log(hour, pcTime);
//       clearInterval(timeInterval);
//       hour.setHours(randomHour(9, 11), randomMinute(1, 58), 0);
//       startNotifyTimerAM();
//     }
//   }, 1000);
// }

export default class AppUpdater {
  constructor() {
    // const server = 'https://github.com/yarasaa/anket-app';
    // const url = `${server}/releases/tag/${app.getVersion()}`;
    log.transports.file.level = 'info';
    // autoUpdater.setFeedURL(url);
    autoUpdater.logger = log;
    autoUpdater.channel = 'latest';
    autoUpdater.allowDowngrade = false;

    autoUpdater.autoDownload = true;
    console.log("App updater'a girdi...");
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//   const dialogOpts = {
//     type: 'info',
//     buttons: ['Restart', 'Later'],
//     title: 'Application Update',
//     message: process.platform === 'win32' ? releaseNotes : releaseName,
//     detail:
//       'A new version has been downloaded. Restart the application to apply the updates.',
//   };

//   dialog.showMessageBox(dialogOpts).then((returnValue) => {
//     if (returnValue.response === 0) autoUpdater.quitAndInstall();
//   });
// });

// autoUpdater.on('error', (message) => {
//   console.error('There was a problem updating the application');
//   console.error(message);
// });

let mainWindow: any | null = null;

// ipcMain.on('ipc-example', async (event: any, arg: any) => {
//   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//   console.log(msgTemplate(arg));
//   event.reply('ipc-example', msgTemplate('pong'));
// });

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
    icon: getAssetPath('happyApp.ico'),
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
  // mainWindow.setOverlayIcon('./assets/icons/happyApp.ico', 'Anket Uygulaması');
  // mainWindow.setIcon('./assets/icons/happyApp.ico');

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

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
  mainWindow.on('hide', async () => {
    console.log(afterRemoveOsName, 'Gizleme fonksiyonu çalıştı.');
    mainWindow.webContents.send('hideWindow');
  });

  mainWindow.on('show', function (event: any) {
    count++;
    console.log(count);
  });

  // new Cron({
  //   cronTime: '0 0 10,15 ? * MON,TUE,WED,THU,FRI *',
  //   onTick: async function () {
  //     mainWindow.show();
  //     start: true;
  //   },
  // });
  var job = new CronJob(
    '00 11,15 * * *',
    async function () {
      console.log('You will see this message every second', "15'te çalıştı");
      mainWindow.show();
    },
    null,
    true,
    'Europe/Minsk'
  );
  job.start();

  // `https://localhost:7038/api/UserInfoAdd?sicilNo=${afterRemoveOsName}`
  // eslint-disable-next-line func-names
  mainWindow.on('close', async function (event: any) {
    if (!isAppQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

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

app.setLoginItemSettings({
  openAtLogin: true,
  args: [
    '--processStart',
    `"${exeName}"`,
    '--process-start-args',
    `"--hidden"`,
  ],
});
app.on('before-quit', function (_event: any) {
  isAppQuitting = true;
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  //autoUpdater.checkForUpdatesAndNotify();
  app.hasSingleInstanceLock();
  //initTray();

  electron.powerMonitor.on('resume', () => {
    console.log('The system is going to resume');
  });

  electron.powerMonitor.on('on-battery', () => {
    console.log('The system is going to on battery');
  });

  electron.powerMonitor.on('suspend', () => {
    console.log('The system is going to on suspend');
  });

  var timeInterval: any = setInterval(() => {
    let showDate = new Date().getHours();
    console.log('saat', showDate, 'show sayisi', count);
    if (count === 1 && showDate > 11 && showDate < 14) {
      mainWindow.show();
    } else if (count === 2 && showDate > 15 && showDate < 18) {
      mainWindow.show();
    } else if (count === 3 || showDate > 18) {
      count = 0;
    }
  }, 6000);
});

let tray;
const createTray = () => {
  //Prod tray
  tray = new Tray('resources/assets/happy.ico');
  //developer Tray
  //tray = new Tray('happyApp.ico');
  //tray.setImage('./resources/assets/happyApp.ico');
  tray.setToolTip('Anket Uygulaması');
  tray.on('click', () => {
    mainWindow?.isVisible() ? mainWindow.hide() : mainWindow?.show();
  });
};

app
  .whenReady()
  .then(createWindow)
  .then(() => {
    //startNotifyTimerAM();
  })
  .then(() => {
    // const icon = nativeImage.createFromPath('happy.ico');
    // tray = new Tray(icon);
    // tray.setToolTip('Anket Uygulaması');
    // tray.on('click', () => {
    //   mainWindow?.isVisible() ? mainWindow.hide() : mainWindow.show();
    // });
    //initTray();
    //traySystem();
    createTray();
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
