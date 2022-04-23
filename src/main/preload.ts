/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
const { contextBridge, ipcRenderer } = require('electron');

window.ipcRenderer = require('electron').ipcRenderer;

contextBridge.exposeInMainWorld('electron', {
  store: {
    get(val) {
      return ipcRenderer.sendSync('electron-store-get', val);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
  },
});

// on(channel: string, func: (...args: unknown[]) => void) {
//   const validChannels = ['ipc-example'];
//   if (validChannels.includes(channel)) {
//     const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
//       func(...args);
//     // Deliberately strip event as it includes `sender`
//     ipcRenderer.on(channel, subscription);

//     return () => ipcRenderer.removeListener(channel, subscription);
//   }

//   return undefined;
// },
// once(channel: string, func: (...args: unknown[]) => void) {
//   const validChannels = ['ipc-example'];
//   if (validChannels.includes(channel)) {
//     // Deliberately strip event as it includes `sender`
//     ipcRenderer.once(channel, (_event, ...args) => func(...args));
//   }
// },
