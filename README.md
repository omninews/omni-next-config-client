# Next Config Client

## Setup
Initiate config fetching. `environment` is one of "dev", "stage" or "prod"
```
var configClient = require("next-config-client");
configClient.initializeConfigUpdate({
  requestUrl: "ws://example.com/api/vx/config/",
  environment: "dev"
})
.then((config) => {
  // Do stuff with config and start app
});
```
After that use `configClient.getConfig(["part", "key"], defaultValue)` to get the config value you need.
