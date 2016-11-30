const ws = require("ws");
const url = require("url");

const requestConfig = (webSocket, environment) => {
  webSocket.send(environment);
};

const startUpdateConfig = (environment) => {
  let retryNumOfTimes = 0;
  let interval;

  const connect = () => {
    const webSocket = new ws(url.resolve(process.env.CONFIG_SERVICE_URL, environment));

    webSocket.on("open", () => {
      retryNumOfTimes = 0;
      requestConfig(webSocket, environment);
      interval = setInterval(
        requestConfig,
        process.env.INTERVAL,
        webSocket,
        environment
      );
    });

    webSocket.on("message", (message) => {
      process.env = Object.assign(process.env, JSON.parse(message));
    });

    webSocket.on("error", (error) => {
      console.error(error);
    });

    webSocket.on("close", () => {
      clearInterval(interval);
      setTimeout(connect, Math.ceil(Math.pow(Math.E, retryNumOfTimes)) * 100);
      retryNumOfTimes += 1;
    });
  };

  connect();
};

module.exports = startUpdateConfig;