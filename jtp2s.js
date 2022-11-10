const https = require("https");
const http = require("http");
const fs = require("fs");

class JTP2 {
	constructor(useHttps=false) {
		this.server = (useHttps) ? https.createServer():http.createServer();
		this.evts = {};
		this.urls = {};
	}

	on(evt, call) {
		this.evts[evt] = call;
	}

	onURL(url, file) {
		this.urls[url] = file;
	}

	run(port=443, call=() => {}) {
		this.server.on("request", (req, res) => {
			for (let url in this.urls) {
				if (req.url === url) {
					try {
						let file = fs.readFileSync(this.urls[url]);
						//console.log(file);
						res.writeHead(200, {"Content-Type": "text/javascript"});
						res.end(file);
					} catch (err) {
						//console.error(err);
						res.writeHead(404, {"Content-Type": "text/plain"});
						res.end("404 Error: Script Not Found!");
					}
					return;
				}
			}
			if (req.method === "OPTIONS") {
				res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
				res.end();
				return;
			}
			/*try {
				res.setHeader("Access-Control-Allow-Headers", req.headers.origin);
				res.setHeader("Content-Type", "text/plain");
			} catch {
				res.end("error");
				return;
			}*/
			if (req.headers["jtp-evt"] !== undefined) {
				this.evts[req.headers["jtp-evt"]](req, res);
				try {
					res.end();
					return;
				} catch {
					return;
				}
			} else {
				try {
					res.end("Error 404: Could Not Find Requested Source!");
				} catch {
					return;
				}
			}
		});
		this.server.listen({port: port}, call)
	}
}

module.exports = JTP2;
