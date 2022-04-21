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
import API from './api';

var dateFormat = new Date().toISOString().slice(0, 10);
console.log(dateFormat);

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
      };
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

  const [userInfo, setUserInfo] = useState({
    UserId: window.electron.store.get('osUser') || '',
    department: window.electron.store.get('databaseDepartment') || null,
    section: window.electron.store.get('databaseSection') || null,
    unit: window.electron.store.get('databaseUnitName') || null,
  });

  const [userIdFromData, setUserIdFromdata] = useState({
    id: '',
    userId: '',
  });

  async function postUserInfo(userInfo: any) {
    //console.log(result)
    try {
      const result = await API.USERS_POSTINFO(userInfo);
      await delay(5000);
      setUserInfo(result.data);
      console.log('PostUserInfo', result);
      console.log('resultdatadata', result.data);
      setUserIdFromdata(result.data.data);
      window.electron.store.set('userIdToMain', userIdFromData.id);
      console.log(userInfo);
      if (result) {
        setMessage(result.data?.message);
      }
    } catch (error) {
      console.log('User bilgisi post hatası', error);
    }
  }

  useEffect(() => {
    try {
      postUserInfo(userInfo);
    } catch (error) {
      console.log('Use effect tabloya kullanıcı bilgisi yollama', error);
    }
  }, []);

  async function getUserFromBankData() {
    try {
      const result = await API.USERS_LIST();
      // await delay(10000);

      console.log('bankdata', result);
      window.electron.store.set(
        'databaseDepartment',
        result?.data?.divisionName
      );
      window.electron.store.set('databaseSection', result?.data?.meslekAd);
      window.electron.store.set('databaseUnitName', result?.data?.unitName);
      setUser({
        divisionName: result?.data?.divisionName,
        firstName: result?.data?.firstName,
        sicilNo: result?.data?.sicilNo,
        meslekAd: result?.data?.meslekAd,
        unitName: result?.data?.unitName,
        id: null,
      });

      window.electron.store.set('firstname', result?.data?.firstName);

      if (result) {
        setMessage(result?.data?.message);
      }
    } catch (error) {
      console.log('Banka tablosundan kullanıcı bilgisi çekme', error);
    }
  }

  useEffect(() => {
    try {
      getUserFromBankData();
    } catch (error) {
      console.log('Use effect bankadan kullanıcı bilgisi çekme', error);
    }
  }, []);

  // async function getUserId() {
  //   const result = await API.USERS_INFOLIST();
  //   // console.log(result,result.data.data);
  //   setUserIdFromdata(result?.data?.data);

  //   console.log("GetUserODFromData",result?.data?.data);

  //   if (result) {
  //     setMessage(result?.data?.message);
  //   }
  // }
  // useEffect(() => {

  //   getUserId();
  // }, []);
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
          Merhaba , {window.electron.store.get('firstname')}
        </span>
        <br></br>
        Bugün kendini nasıl hissediyorsun?
      </div>
      <ul className="feedback">
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
