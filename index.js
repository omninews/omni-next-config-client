const ws = require("ws");
const url = require("url");

let config = {};

const requestConfig = (webSocket, environment) => {
  webSocket.send(environment);
};

const initializeConfigUpdate = (conf) => {
  let retryNumOfTimes = 0;
  let intervalRef;
  
  const connect = (resolve, reject) => {
    const webSocket = new ws(url.resolve(conf.requestUrl, conf.environment));

    webSocket.on("open", () => {
      retryNumOfTimes = 0;
      requestConfig(webSocket, conf.environment);
      intervalRef = setInterval(
        requestConfig,
        conf.interval,
        webSocket,
        conf.environment
      );
    });

    webSocket.once("message", (message) => {
      Object.assign(config, JSON.parse(message));
      resolve(config);
    });

    webSocket.on("message", (message) => {
      Object.assign(config, JSON.parse(message));
    });

    webSocket.on("error", (error) => {
      console.error(error);
    });

    webSocket.on("close", () => {
      clearInterval(intervalRef);
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
