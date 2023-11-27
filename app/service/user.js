'use strict';

const Service = require('egg').Service;

class userService extends Service {
  //获取信息
  async getUserByName(userName) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { userName });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  //注册
  async register(param) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('user', param);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //修改签名
  async editUserInfo(param) {
    const { app } = this;
    try {
      const result = await app.mysql.update(
        'user',
        { ...param },
        { id: param.id },
      );
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = userService;
