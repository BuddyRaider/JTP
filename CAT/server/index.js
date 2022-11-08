const j2s = require("../../../jtp2s.js");
const server = new j2s();

server.on("home", () => {
  res.writeHead(200, {"jtp-body": {"text": "Hello World!"}});
  res.end();
});

server.run(443, () => {console.log("Server Running On Port 443!")});
