const j2 = require("./jtp2s.js");
const server = new j2();

server.on("home", (req, res) => {
	res.writeHead(200, {"jtp-body": "Hello World!"});
	res.end();
});

server.run(443, () => {
	console.log("Server Running On Port " + server.server.address().port);
});