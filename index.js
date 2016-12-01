const ws = require("ws");
const url = require("url");

if(!process.env.CONFIG_REQUEST_URL || !process.env.CONFIG_REQUEST_INTERVAL) {
  console.error("Environment variables CONFIG_REQUEST_URL and CONFIG_REQUEST_INTERVAL must be set");
}

let config;

const requestConfig = (webSocket, environment) => {
  webSocket.send(environment);
};

const initializeConfigUpdate = (environment) => {
  let retryNumOfTimes = 0;
  let interval;
  
  const connect = (resolve, reject) => {
    const webSocket = new ws(url.resolve(process.env.CONFIG_REQUEST_URL, environment));

    webSocket.on("open", () => {
      retryNumOfTimes = 0;
      requestConfig(webSocket, environment);
      interval = setInterval(
        requestConfig,
        process.env.CONFIG_REQUEST_INTERVAL,
        webSocket,
        environment
      );
    });

    webSocket.on("message", (message) => {
      config = JSON.parse(message);
      resolve(config);
    });

    webSocket.on("error", (error) => {
      console.error(error);
    });

    webSocket.on("close", () => {
      clearInterval(interval);
      setTimeout(connect, Math.ceil(Math.pow(Math.E, retryNumOfTimes)) * 100, resolve, reject);
      retryNumOfTimes += 1;
    });
  };

  return new Promise((resolve, reject) => connect(resolve, reject));
};

const getConfig = () => {
  if (!config) {
    console.error("Config update not initialized! Use initializeConfigUpdate()");
  }

  return config;
}

module.exports = {
  initializeConfigUpdate,
  getConfig
};
