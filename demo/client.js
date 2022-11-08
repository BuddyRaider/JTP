const j2c = require("./jtp2c.js");
const client = new j2c("JTP2.BuddyDev.repl.co", true);

client.request({"jtp-evt": "home"}, (res) => {
	res.on("data", (res) => {
		console.log(res.toString());
	});
	console.log(res.headers["jtp-body"]);
});