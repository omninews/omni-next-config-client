const ws = require("ws");
const url = require("url");

let config = {};

const requestConfig = (webSocket, environment) => {
  webSocket.send(environment);
};

const initializeConfigUpdate = (conf) => {
  let retryNumOfTimes = 0;
  
  const connect = (resolve, reject) => {
    const webSocket = new ws(url.resolve(conf.requestUrl, conf.environment));

    webSocket.on("open", () => {
      retryNumOfTimes = 0;
      requestConfig(webSocket, conf.environment);
    });

    webSocket.on("message", (message) => {
      if (message.initialConfig) {
        Object.assign(config, JSON.parse(message.initialConfig));
        resolve(config);
      } else if (message.environment === environment) {
        Object.assign(config, JSON.parse(message.config));
      }
    });

    webSocket.on("error", (error) => {
      console.error(error);
    });

    webSocket.on("close", () => {
      setTimeout(connect, Math.ceil(Math.pow(Math.E, retryNumOfTimes)) * 100, resolve, reject);
      retryNumOfTimes += 1;
    });
  };

  return new Promise(connect);
};

module.exports = {
  initializeConfigUpdate,
  config,
};
