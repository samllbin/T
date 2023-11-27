"use strict";

const Service = require("egg").Service;

class HomeService extends Service {
  async user() {
    return {
      name: "嘎子",
      slogen: "网络的世界太虚拟,你把握不住",
    };
  }
}
module.exports = HomeService;
