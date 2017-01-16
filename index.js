const ws = require("ws");
const R = require("ramda");
const url = require("url");

let config = {};

const initializeConfigUpdate = (conf) => {
  let ping;
  let retryNumOfTimes = 0;
  
  const connect = (resolve, reject) => {
    const webSocket = new ws(url.resolve(conf.requestUrl, conf.environment));

    webSocket.on("open", () => {
      retryNumOfTimes = 0;
      webSocket.send(conf.environment);
      ping = setInterval(() => {
        webSocket.ping();
      }, 15000);
    });

    webSocket.on("message", (message) => {
      const data = JSON.parse(message);
      if (data.initialConfig) {
        Object.assign(config, JSON.parse(data.initialConfig));
        resolve(config);
      } else if (data.environment === conf.environment) {
        Object.assign(config, JSON.parse(data.config));
      }
    });

    webSocket.on("error", (error) => {
      console.error(error);
    });

    webSocket.on("close", () => {
      clearInterval(ping);
      setTimeout(connect, Math.ceil(Math.pow(Math.E, retryNumOfTimes)) * 100, resolve, reject);
      retryNumOfTimes += 1;
    });
  };

  return new Promise(connect);
};

const getConfig = (path, def) => {
  const confValue = R.path(path, config);
  if (confValue !== undefined) {
    return confValue;
  }

  return def;
};

module.exports = {
  initializeConfigUpdate,
  getConfig
};
