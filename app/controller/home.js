"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // index.html 默认会去 view 文件夹寻找，Egg 已经约定好了
    await ctx.render("index.html", {
      title: "我是尼克陈",
    });
  }

  // 获取用户信息
  async user() {
    const { ctx } = this;
    const { name, slogen } = await ctx.service.home.user();
    ctx.body = {
      name,
      slogen,
    };
  }
  // post 请求方法
  async add() {
    const { ctx } = this;
    const { title } = ctx.request.body;
    // 框架内置了 bodyParser 中间件来对这两类格式的请求 body 解析成 object 挂载到 ctx.request.body 上
    // HTTP 协议中并不建议在通过 GET、HEAD 方法访问时传递 body，所以我们无法在 GET、HEAD 方法中按照此方法获取到内容。
    ctx.body = {
      title,
    };
  }
}

module.exports = HomeController;
