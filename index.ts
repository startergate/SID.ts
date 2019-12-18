/* jshint esversion: 9 */
  logout (clientid:string, sessid:string) {
    return this.sidServerInstance.delete('/session/', {
      type: 'logout',
      clientid: clientid,
      sessid: sessid
    }).then((response : ) => {
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

  register (clientid, userid, pw, nickname = 'User') {
    return this.sidServerInstance.post('/user/', {
      type: 'register',
      clientid: clientid,
      userid: userid,
      nickname: nickname,
      password: pw
    }).then(response => {
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

  getUserNickname (clientid, sessid) {
    return this.sidServerInstance.get(`/${clientid}/${sessid}/usname`).then(response => {
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

  loginCheck (target) {}

  passwordCheck (clientid, sessid, pw) {
    return this.sidServerInstance.post('/password/verify', {
      type: 'verify',
      data: 'password',
      clientid: clientid,
      sessid: sessid,
      value: pw
    }).then(response => {
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

  createClientID (devicedata) {
    return this.sidServerInstance.post('/clientid', {
      type: 'create',
      data: 'clientid',
      devicedata: devicedata
    }).then(response => {
      const resData = response.data;
      return new Promise((resolve, reject) => {
        resolve(resData.response_data);
      });
    });
  }

  setClientName (clientName) {
    this.clientName = clientName;
  }

  getClientName () {
    return this.clientName;
  }
}

module.exports = new SID();
