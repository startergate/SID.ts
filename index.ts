/* jshint esversion: 9 */

import axios from 'axios';

class SID {
  clientName : string;
  sidServerInstance : any;
  constructor (clientName:string) {
    this.clientName = clientName;
    this.sidServerInstance = axios.create({
      baseURL: 'http://sid.donote.co:3000/api/v1/',
      timeout: 3000,
      headers: {
        Host: 'sid.donote.co:3000'
      }
    });
  }

  login (clientid:string, id:string, pw:string) {
    return this.sidServerInstance.post('/session/', {
      type: 'login',
      clientid: clientid,
      userid: id,
      password: pw,
      isPermanent: false,
      isWeb: true
    }).then((response:any) => {
      const resData = response.data;
      return new Promise((resolve, reject) => {
        if (resData.type === 'error') {
          reject(new Error('Input Data Error'));
          return;
        }
        const output : any = {};
        output.sessid = resData.response_data[0];
        output.pid = resData.response_data[1];
        output.nickname = resData.response_data[2];
        output.expire = resData.response_data[3];
        resolve(output);
      });
    });
  }

  loginAuth (clientid:string, sessid:string) {
    return this.sidServerInstance.post('/session/', {
      type: 'login',
      clientid: clientid,
      sessid: sessid
    }).then((response: any) => {
      const resData = response.data;
      return new Promise((resolve, reject) => {
        if (resData.type === 'error') {
          reject(new Error('Input Data Error'));
          return;
        }

        const output : any = {};
        output.sessid = resData.response_data[0];
        output.pid = resData.response_data[1];
        output.nickname = resData.response_data[2];
        output.expire = resData.response_data[3];
        resolve(output);
      });
    });
  }

  logout (clientid:string, sessid:string) {
    return this.sidServerInstance.delete('/session/', {
      type: 'logout',
      clientid: clientid,
      sessid: sessid
    }).then((response : any) => {
      const resData = response.data;
      return new Promise((resolve, reject) => {
        if (resData.type === 'error' || !resData.is_succeed) {
          reject(new Error('Input Data Error'));
          return;
        }

        resolve();
      });
    });
  }

  register (clientid:string, userid:string, pw:string, nickname:string|null = 'User') {
    return this.sidServerInstance.post('/user/', {
      type: 'register',
      clientid: clientid,
      userid: userid,
      nickname: nickname,
      password: pw
    }).then((response:any) => {
      const resData = response.data;
      return new Promise((resolve, reject) => {
        if (resData.type === 'error' || !resData.is_succeed) {
          reject(new Error('Input Data Error'));
          return;
        }

        resolve(resData.private_id);
      });
    });
  }

  getUserNickname (clientid:string, sessid:string) {
    return this.sidServerInstance.get(`/${clientid}/${sessid}/usname`).then((response: any) => {
      const resData = response.data;
      return new Promise((resolve, reject) => {
        if (resData.type === 'error') {
          reject(new Error('Input Data Error'));
          return;
        }
        if (!resData.is_valid) {
          resolve('');
          return;
        }

        resolve(resData.response_data);
      });
    });
  }

  loginCheck (target:null) {}

  passwordCheck (clientid:string, sessid:string, pw:string) {
    return this.sidServerInstance.post('/password/verify', {
      type: 'verify',
      data: 'password',
      clientid: clientid,
      sessid: sessid,
      value: pw
    }).then((response:any) => {
      const resData = response.data;
      return new Promise((resolve, reject) => {
        if (resData.type === 'error' || !resData.is_valid) {
          reject(new Error('Input Data Error'));
          return;
        }

        resolve(true);
      });
    });
  }

  createClientID (devicedata:string) {
    return this.sidServerInstance.post('/clientid', {
      type: 'create',
      data: 'clientid',
      devicedata: devicedata
    }).then((response:any) => {
      const resData = response.data;
      return new Promise((resolve, reject) => {
        resolve(resData.response_data);
      });
    });
  }

  setClientName (clientName:string) {
    this.clientName = clientName;
  }

  getClientName () {
    return this.clientName;
  }
}

export default SID;
