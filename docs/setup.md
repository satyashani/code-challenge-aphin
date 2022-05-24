## Setup Instructions


To set up the application - 

* Install mongodb latest
* Install nodejs latest
* Install `jq`
* Run the script under `scripts/db-setup.sh` under the project root.
* Upload data to the db using the script `scripts/data-upload.js`
* Run the application under project root using `node app.js`


### Data Uploader 

Data can be uploaded by running the data uploader script under node console as follows - 

```js
var uploader = require("./scripts/data-upload");
uploader.upload(<path to data json>,"ModelName",callback);
```

e.g. 

```js
uploader.upload("/var/www/alphin/src/data/users.json,"User",callback);
```
