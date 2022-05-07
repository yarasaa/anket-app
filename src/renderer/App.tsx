/* eslint-disable promise/catch-or-return */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-restricted-globals */
/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable prefer-const */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */

import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { API } from './api';
var dateFormat = new Date().toISOString().slice(0, 10);
console.log(dateFormat);
console.log(window.electron.store.get('osUser'), 'Rendererda ki store islemi');

const delay = (ms: number | undefined) =>
  new Promise((resolve) => setTimeout(resolve, ms));
const checkVote: any = {
  sad: 1,
  ok: 2,
  happy: 3,
};
declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        once: (channel: string, func: (...args: any[]) => void) => void;
        myPing: () => any;
      };
      ipcRenderer: any;
    };
  }
}
const Hello = () => {
  const [check, setCheck] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>();
  // const [userVote, setUserVote]=useState<any>({

  //   department:'',
  //   section:'',
  //   Unit:'',
  //   vote:'',
  //   userId:'',
  //   date:null

  // })
  /**
   *
   */

  const [userIdFromData, setUserIdFromdata] = useState<any>();

  async function postUserInfo() {
    //console.log(result)
    try {
      let resultUser = await getUserFromBankData();
      let userInfo = {
        UserId: window.electron.store.get('osUser') || '',
        department: resultUser?.divisionName,
        section: resultUser?.gorevAd,
        unit: resultUser?.unitName,
      };
      console.log(resultUser, userInfo);
      const result = await API.USERS_POSTINFO(userInfo);
      console.log('PostUserInfo fonksiyonu', result);

      setUserIdFromdata(result?.data?.data);
      console.log(userInfo);
      if (result) {
        setMessage(result.data?.message);
      }
    } catch (error) {
      console.log('User bilgisi post hatası', error);
    }
  }

  useEffect(() => {
    if (userIdFromData?.id) {
      window.electron.ipcRenderer.on('hideWindow', async (value: any) => {
        console.log('asdasf');
        const result = await API.USERS_LIST();
        console.log('bankdata', result);
        if (result.data) {
          console.log(userIdFromData, 'aasdad');
          let postData = {
            department: result.data.divisionName,
            section: result.data.meslekAd,
            Unit: result.data.unitName,
            vote: 0,
            userId: userIdFromData?.id,
            votedate: dateFormat,
          };
          postVote(postData);
        }
      });
    }
  }, [userIdFromData]);

  useEffect(() => {
    // window.electron.store.myPing();

    try {
      // let ssInterval = setInterval(async () => {
      //   let isAppClose = window.electron.store.get('appClose');
      //   console.log(isAppClose, userIdFromData);
      //   if (isAppClose == true && userIdFromData) {
      //     window.electron.store.set('appClose', false);
      //     console.log('isAppClose');
      //     console.log(user);

      //     const result = await API.USERS_LIST();
      //     console.log('bankdata', result);
      //     let postData = {
      //       department: result.data.divisionName,
      //       section: result.data.meslekAd,
      //       Unit: result.data.unitName,
      //       vote: 0,
      //       userId: userIdFromData?.id,
      //       votedate: dateFormat,
      //     };
      //     await postVote(postData);
      //     clearInterval(ssInterval);
      //   }
      // }, 5000);

      postUserInfo();
    } catch (error) {
      console.log('Use effect tabloya kullanıcı bilgisi yollama', error);
    }
  }, []);

  // window.addEventListener('hide', () => {
  //   let postData = {
  //     department: user.divisionName,
  //     section: user.meslekAd,
  //     Unit: user.unitName,
  //     vote: 0,
  //     userId: userIdFromData.id,
  //     votedate: dateFormat,
  //   };
  //   postVote(postData);
  // });

  async function getUserFromBankData(): Promise<any> {
    try {
      const result = await API.USERS_LIST();
      console.log('bankdata', result);
      setUser({
        divisionName: result?.data?.divisionName,
        firstName: result?.data?.firstName,
        sicilNo: result?.data?.sicilNo,
        meslekAd: result?.data?.meslekAd,
        unitName: result?.data?.unitName,
        id: null,
      });

      if (result) {
        setMessage(result?.data?.message);
        return result?.data;
      }
      return null;
    } catch (error) {
      console.log('Banka tablosundan kullanıcı bilgisi çekme', error);
    }
  }

  async function postVote(params: any) {
    try {
      const result = await API.USERS_POST(params);
      if (result) {
        console.log(result);
        setMessage(result?.data?.message);
      }
    } catch (error) {
      console.log('Post vote işlemi', error);
    }
  }

  useEffect(() => {
    try {
      if (!!check) {
        let postData = {
          department: user.divisionName,
          section: user.meslekAd,
          Unit: user.unitName,
          vote: checkVote[check],
          userId: userIdFromData.id,
          votedate: dateFormat,
        };
        postVote(postData);
      }
    } catch (error) {
      console.log('Use effect vote post işlemi', error);
    }
  }, [check]);

  return (
    <div>
      <div>{window.electron.store.get('appVersion')}</div>
      <div
        style={{
          marginBottom: '2rem',
          lineHeight: '2rem',
          fontSize: '1.3rem',
          fontFamily: 'sans-serif',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          Merhaba , {user?.firstName}
        </span>
        <br></br>
        Bugün kendini nasıl hissediyorsun?
      </div>
      <ul className="feedback" id="feedbackClose">
        <li
          onClick={() => setCheck('sad')}
          className={`sad ${check == 'sad' ? 'active' : ''}`}
        >
          <div>
            <svg className="eye left">
              <use xlinkHref="#eye" />
            </svg>
            <svg className="eye right">
              <use xlinkHref="#eye" />
            </svg>
            <svg className="mouth">
              <use xlinkHref="#mouth" />
            </svg>
          </div>
        </li>
        <li
          onClick={() => setCheck('ok')}
          className={`ok ${check == 'ok' ? 'active' : ''}`}
        >
          <div></div>
        </li>
        <li
          onClick={() => setCheck('happy')}
          className={`happy ${check == 'happy' ? 'active' : ''}`}
        >
          <div>
            <svg className="eye left">
              <use xlinkHref="#eye" />
            </svg>
            <svg className="eye right">
              <use xlinkHref="#eye" />
            </svg>
          </div>
        </li>
      </ul>

      <div
        style={{
          marginTop: '1.5rem',
          lineHeight: '2rem',
          fontSize: '1rem',
          textAlign: 'center',
        }}
      >
        {message}
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 4" id="eye">
          <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1" />
        </symbol>
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 7"
          id="mouth"
        >
          <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5" />
        </symbol>
      </svg>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
