# Next Config Client

## Setup
Initiate config fetching. `environment` is one of "dev", "stage" or "prod"
```
var refreshConfig = require("next-config-client");
refreshConfig({
  requestUrl: "ws://example.com/api/vx/config/",
  environment: "dev"
});
```
