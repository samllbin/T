'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  // router.get('/', controller.home.index);
  // router.get('/user', controller.home.user);
  // router.post('/add', controller.home.add);
  // router.post('/add_user', controller.home.addUser);
  // router.post('/edit_user', controller.home.editUser);
  // router.post('/delete', controller.home.deleteUser);
  const jwtVerify = middleware.jwtVerify(app.config.jwt.secret);
  router.post('/api/user/register', controller.user.register); //注册
  router.post('/api/user/login', controller.user.login); //登录
  router.get('/api/user/getUserInfo', jwtVerify, controller.user.getUserInfo); //获取信息
  router.get('/api/user/verify', jwtVerify, controller.user.verify); //验证登录
  router.post(
    '/api/user/editUserinfo',
    jwtVerify,
    controller.user.editUserInfo,
  ); // 修改信息

  router.get('/api/bill/data', jwtVerify, controller.bill.data); //获取总数据
  router.get('/api/bill/list', jwtVerify, controller.bill.list); //获取账单
  router.get('/api/bill/detail', jwtVerify, controller.bill.detail); // 获取详情
  router.post('/api/bill/delete', jwtVerify, controller.bill.deleteAccount); //删除账单
  router.post('/api/bill/update', jwtVerify, controller.bill.update); //修改账单
  router.post('/api/bill/add', jwtVerify, controller.bill.add); // 添加账单
  router.post('/api/upload', controller.upload.upload);
};
