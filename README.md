# Next Config Client

## Setup
Create the following enviroment variables
* Set CONFIG_REQUEST_URL to the url of your config server, ws://example.com/api/vx/config/
* Set CONFIG_REQUEST_INTERVAL in milliseconds

Initiate config fetching. `environment` is one of "dev", "stage" or "prod"
```
var refreshConfig = require("next-config-client");
refreshConfig(enviroment);
```
