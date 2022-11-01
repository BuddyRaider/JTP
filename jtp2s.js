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
			//console.log(req.headers);
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