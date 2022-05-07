/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

/* eslint-disable @typescript-eslint/no-explicit-any */

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    hideWindow() {
      ipcRenderer.send('hideWindow', 'test123');
    },

    on(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['ipc-example', 'hideWindow'];
      if (validChannels.includes(channel)) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, subscription);

        return () => ipcRenderer.removeListener(channel, subscription);
      }

      return undefined;
    },
  },
  store: {
    get(val: any) {
      return ipcRenderer.sendSync('electron-store-get', val);
    },
    set(property: any, val: any) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    // myPing() {
    //   ipcRenderer.send('ipc-example', 'ping');
    // },
    // on(channel: string, func: (...args: unknown[]) => void) {
    //   console.log(channel);
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
    //   console.log(channel, '*****');
    //   const validChannels = ['ipc-example'];
    //   if (validChannels.includes(channel)) {
    //     // Deliberately strip event as it includes `sender`
    //     ipcRenderer.once(channel, (_event, ...args) => func(...args));
    //   }
    // },
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
