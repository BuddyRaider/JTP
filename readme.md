# JTP Version 2 Docs/Usage
***
## Server-Side
***
To use the client-side script, you must include the file "jtp2s.js" in your client script.
``` node.js
const j2s = require("./jtp2s.js");
const server = new j2s(*useHttps*); // (*useHttps* is whether to use Node.js "http" or "https" module, false by default)
```
Here are the available methods included in the server-side script:
- `server.on(*event*, *callback*)`
	- Whenever server receives request containing "jtp-evt" header with value *event*, *callback* will be executed given the HTTP *request* and *response* objects as parameters.
- `server.run(*port*, *callback*)`
  - Starts server on port: *port*, and executes *callback* when running.
***
## Client-Side
***
To use the server-side script, you must include the file "jtp2s.js" in your server script.
``` node.js
const j2c = require("./jtp2c.js");
const client = new j2c("*insert url to JTP2 server here*", *useHttps*); // this URL sets the default for *client.url*, used for every request, can be changed later (*useHttps* is whether to use Node.js "http" or "https" module, false by default)
```
Here are the available methods included in the client-side script:
- `client.request(*headers*, *callback*)`
  - Submits request to *client.url* and executes *callback* on response, giving the *response* object as a parameter.
***
## JTP2 Headers
***
Here is a list of headers used in JTP2. These are mostly just recommendations to make all servers and clients work together, but "jtp-evt" is required! (Headers sorted by sending direction, i.e. server-to-client or client-to-server)

### Client-To-Server:
- `jtp-evt`: Tells server which route client wants (equivalent of "path" in HTTP)
- `jtp-data`: Gives server data to process before response (not required)
### Server-To-Client:
- `jtp-body`: Data sent by server to client as a main response