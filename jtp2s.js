const https = require("https");
const http = require("http");

class JTP2 {
	constructor(useHttps=false) {
		this.server = (useHttps) ? https.createServer():http.createServer();
		this.evts = {};
	}

	on(evt, call) {
		this.evts[evt] = call;
	}

	run(port=443, call=() => {}) {
		this.server.on("request", (req, res) => {
			if (req.url === "/jtp2c.js") {
				try {
					res.writeHead(200, {"Content-Type": "text/javascript"});
					res.end(fs.readFileSync("./jtp2c.js"));
				} catch {
					res.writeHead(404, {"Content-Type": "text/plain"});
					res.end("404 Error: Script Not Found!");
				}
			}
			//console.log(req.headers);
			if (req.method === "OPTIONS") {
				res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
				res.end();
			}
			try {
				res.setHeader("Access-Control-Allow-Headers", req.headers.origin);
				res.setHeader("Conetent-Type", "text/plain");
			} catch {
				res.end();
				return;
			}
			console.log(res.headers);
			if (req.headers["jtp-evt"] !== undefined) {
				this.evts[req.headers["jtp-evt"]](req, res);
				try {
					res.end();
					return;
				} catch {
					return;
				}
			}
			res.end("Error 404: Could Not Find Requested Source!");
		});
		this.server.listen({port: port}, call)
	}
}

module.exports = JTP2;
