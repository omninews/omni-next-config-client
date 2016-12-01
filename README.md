# Next Config Client

## Setup
Create the following enviroment variables
* Set CONFIG_REQUEST_URL to the url of your config server, ws://example.com/api/vx/config/
* Set CONFIG_REQUEST_INTERVAL in milliseconds

Initiate config fetching. `environment` is one of "dev", "stage" or "prod"
```
var configClient = require("next-config-client");
configClient.initializeConfigUpdate(enviroment)
.then((config) => {
  // Do stuff with config and start app
});
```
Later use `configClient.getConfig()` to get the latest config
