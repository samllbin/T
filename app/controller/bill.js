'uses strict';

const moment = require('moment');
const Controller = require('egg').Controller;

class BillController extends Controller {
  async add() {
    const { ctx, app } = this;

    const {
      amount,
      date,
      type_id,
      type_name,
      pay_type,
      remark = '',
    } = ctx.request.body;

    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数不完整',
        date: null,
      };
      return null;
    }
    try {
      let user_id;
      const token = ctx.header.authorization;
      const info = app.jwt.verify(token, app.config.jwt.secret);

      if (!info) return;
      user_id = info.id;

      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });

      ctx.body = {
        code: 200,
        msg: '添加成功',
        data: null,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }

  //获取账单列表
  async list() {
    const { ctx, app } = this;
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query;

    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;
      const list = await ctx.service.bill.list(user_id);
      // 过滤出月份和类型所对应的账单列表
      const d = list.date;
      const _list = list.filter(item => {
        if (type_id != 'all') {
          return (
            moment(Number(item.date)).format('YYYY-MM') == date &&
            type_id == item.type_id
          );
        }
        return moment(Number(item.date)).format('YYYY-MM') == date;
      });
      // 格式化数据，将其变成我们之前设置好的对象格式
      let listMap = _list
        .reduce((curr, item) => {
          const date = moment(Number(item.date)).format('YYYY-MM-DD');
          if (
            curr &&
            curr.length &&
            curr.findIndex(item => item.date == date) > -1
          ) {
            const index = curr.findIndex(item => item.date == date);
            curr[index].bills.push(item);
          }
          // 如果在累加的数组中找不到当前项日期的，那么再新建一项。
          if (
            curr &&
            curr.length &&
            curr.findIndex(item => item.date == date) == -1
          ) {
            curr.push({
              date,
              bills: [item],
            });
          }
          // 如果 curr 为空数组，则默认添加第一个账单项 item ，格式化为下列模式
          if (!curr.length) {
            curr.push({
              date,
              bills: [item],
            });
          }
          return curr;
        }, [])
        .sort((a, b) => moment(b.date) - moment(a.date));

      // 分页处理，listMap 为我们格式化后的全部数据，还未分页。
      const filterListMap = listMap.slice(
        (page - 1) * page_size,
        page * page_size,
      );

      // 计算当月总收入和支出
      // 首先获取当月所有账单列表
      let __list = list.filter(
        item => moment(Number(item.date)).format('YYYY-MM') == date,
      );
      // 累加计算支出
      let totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type == 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      // 累加计算收入
      let totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type == 2) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);

      // 返回数据
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense, // 当月支出
          totalIncome, // 当月收入
          totalPage: Math.ceil(listMap.length / page_size), // 总分页
          list: filterListMap || [],
        },
      };
    } catch {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }

  //获取订单详情
  async detail() {
    const { ctx, app } = this;

    const { id = '' } = ctx.query;

    const token = ctx.header.authorization;
    const info = app.jwt.verify(token, app.config.jwt.secret);
    if (!info) return;

    const user_id = info.id;

    if (!id) {
      ctx.body = {
        code: 500,
        msg: '订单id不能为空',
        data: null,
      };
    }

    try {
      const result = await ctx.service.bill.detail(id, user_id);
      ctx.body = {
        code: 200,
        msg: '获取成功',
        data: {
          ...result,
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统失败',
        data: null,
      };
    }
  }

  async update() {
    const { ctx, app } = this;

    const {
      id,
      amount,
      date,
      type_id,
      type_name,
      pay_type,
      remark = '',
    } = ctx.request.body;

    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数不完整',
        date: null,
      };
      return null;
    }
    try {
      let user_id;
      const token = ctx.header.authorization;
      const info = app.jwt.verify(token, app.config.jwt.secret);

      if (!info) return;
      user_id = info.id;

      const result = await ctx.service.bill.update({
        id,
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });

      ctx.body = {
        code: 200,
        msg: '更新成功',
        data: null,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }

  //删除账单
  async deleteAccount() {
    const { ctx, app } = this;

    const { id } = ctx.request.body;
    const token = ctx.header.authorization;
    let user_id;

    const info = app.jwt.verify(token, app.config.jwt.secret);
    if (!info) return;
    user_id = info.id;

    if (!id) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return null;
    }
    try {
      const result = await ctx.service.bill.deleteAccount(id, user_id);
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
  //获取某个月份的账单
  async data() {
    const { ctx, app } = this;
    const { date = '' } = ctx.query;
    const token = ctx.header.authorization;
    let user_id;

    const info = app.jwt.verify(token, app.config.jwt.secret);
    if (!info) return;
    user_id = info.id;

    try {
      const result = await ctx.service.bill.list(user_id);

      const start = moment(date).startOf('month').unix() * 1000;
      const end = moment(date).endOf('month').unix() * 1000;
      const _data = result.filter(
        item => Number(item.date) >= start && Number(item.date) <= end,
      );
      //总支出
      const total_expense = _data.reduce((total, cur) => {
        if (cur.pay_type == 1) {
          total += Number(cur.amount);
        }
        return total;
      }, 0);

      //总收入
      const total_income = _data.reduce((total, cur) => {
        if (cur.pay_type == 2) {
          total += Number(cur.amount);
        }
        return total;
      }, 0);

      let total_account = _data.reduce((arr, cur) => {
        const index = arr.findIndex(item => cur.type_id == item.type_id);
        if (index == -1) {
          arr.push({
            type_id: cur.type_id,
            type_name: cur.type_name,
            pay_type: cur.pay_type,
            totalNumber: Number(cur.amount),
          });
        } else {
          arr[index].totalNumber += Number(cur.amount);
        }
        return arr;
      }, []);
      total_account = total_account.map(item => {
        item.totalNumber = Number(Number(item.totalNumber).toFixed(2));
        return item;
      });
      ctx.body = {
        code: 200,
        msg: '获取成功',
        data: {
          total_expense: Number(total_expense).toFixed(2),
          total_income: Number(total_income).toFixed(2),
          total_account: total_account || [],
        },
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
}

module.exports = BillController;
