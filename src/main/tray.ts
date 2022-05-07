/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prettier/prettier */

import { nativeImage, Tray } from 'electron';

let tray = null;
let image = null;
export default function initTray() {
  image = nativeImage.createFromPath('./assets/icons/happy.ico');
  tray = new Tray(image);
  tray.setToolTip('Anket Uygulaması');
  tray.setImage(image);
}
