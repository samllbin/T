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
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/verify', jwtVerify, controller.user.verify);
};
