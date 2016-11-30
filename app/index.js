/* eslint no-process-env: 0 */

import ws from "ws";
import url from "url";
import config from "./config";

const updateConfig = (webSocket, environment) => {
  webSocket.send(environment);
};

export const startUpdateConfig = (environment) => {
  const connect = () => {
    const webSocket = new ws(url.resolve(config.get("CONFIG_SERVICE_URL"), environment));

    webSocket.on("open", () => {
      updateConfig(webSocket, environment);
      setInterval(
        updateConfig,
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
      console.error("Error:", error);
    });

    webSocket.on("close", () => {
      console.error("Socket closed");
      setTimeout(connect, 2000);
    });
  };

  connect();
};

startUpdateConfig("dev");
