/* eslint no-process-env: 0 */

import ws from "ws";
import url from "url";
import config from "./config";

const requestConfig = (webSocket, environment) => {
  webSocket.send(environment);
};

export const startUpdateConfig = (environment) => {
  let retryNumOfTimes = 0;
  let interval;

  const connect = () => {
    const webSocket = new ws(url.resolve(config.get("CONFIG_SERVICE_URL"), environment));

    webSocket.on("open", () => {
      retryNumOfTimes = 0;
      requestConfig(webSocket, environment);
      interval = setInterval(
        requestConfig,
        config.get("INTERVAL"),
        webSocket,
        environment,
      );
    });

    webSocket.on("message", (message) => {
      process.env = {
        ...process.env,
        ...JSON.parse(message),
      };
    });

    webSocket.on("error", (error) => {
      console.error(error);
    });

    webSocket.on("close", () => {
      clearInterval(interval);
      setTimeout(connect, Math.ceil(Math.E ** retryNumOfTimes) * 100);
      retryNumOfTimes += 1;
    });
  };

  connect();
};

startUpdateConfig("dev");
