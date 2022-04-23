/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable prefer-template */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import api from './api';

console.log(window.electron.store.get('osUser'), 'api index içi');
let userSicil = window.electron.store.get('osUser');
console.log(userSicil + 'testindex');
// eslint-disable-next-line import/prefer-default-export
export const API = Object.freeze({
  USERS_LIST: async (): Promise<any> =>
    await api.get('api/IKDb?sicilNo=' + userSicil),
  USERS_POST: async (data: any): Promise<any> =>
    await api.post('api/usertest', data),
  USERS_POSTINFO: async (data: any): Promise<any> =>
    await api.post('api/UserInfoAdd', data),
  USERS_INFOLIST: async (): Promise<any> =>
    await api.get('api/UserInfoAdd?sicilNo=' + userSicil),
  // USERS_PUT: async (data: any): Promise<any> => await api.put('/users', data),
});
