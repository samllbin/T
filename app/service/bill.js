'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  async add(param) {
    const { app, ctx } = this;
    const result = await app.mysql.insert('bill', param);
    if (result) {
      return result;
    }
    return null;
  }

  // 获取账单
  async list(id) {
    const { ctx, app } = this;
    const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
    let sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
    const result = await app.mysql.query(sql);
    if (result) return result;
    return null;
  }

  //账单详情
  async detail(id, user_id) {
    const { ctx, app } = this;
    const result = await app.mysql.get('bill', { id, user_id });
    if (result) return result;
    return null;
  }

  //更新账单
  async update(param) {
    const { ctx, app } = this;
    const result = app.mysql.update(
      'bill',
      { ...param },
      {
        id: param.id,
        user_id: param.user_id,
      },
    );
    if (result) return result;
    return null;
  }
  //删除账单
  async deleteAccount(id, user_id) {
    const { ctx, app } = this;
    try {
      let result = await app.mysql.delete('bill', {
        id: id,
        user_id: user_id,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = BillService;
