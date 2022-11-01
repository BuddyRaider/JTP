const http = require("http");


class JTP2 {
	constructor() {
		this.server = http.createServer();
		this.routes = {};
	}

	on(route, callback) {
		this.routes[route] = callback;
	}

	serve(port=80, callback=() => {}) {
		this.server.on("request", (req, res) => {
			let evt = req.headers["jtp-evt"];
			console.log("Request Made:", evt);
			for (let r in this.routes) {
				if (evt === r) {
					res.writeHead(200);
					this.routes[r](req, res);
					res.end();
					return;
				}
			}
			res.writeHead(404);
			res.end("Data Not Found!");
		});
		/*this.server.on("connection", (socket) => {
			console.log("New Connection!");
			socket.on("data", (data) => {
				if (typeof data !== "string") {
					data = data.toString();
				}
				console.log("New Data:", data.length);
				for (let route in this.routes) {
					if (data.startsWith("route: " + route)) {
						this.routes[route](socket);
						socket.end();
						return;
					}
				}
				socket.end("No route found!");
				console.log("No Route Found!");
			});
		});*/
		this.server.listen({port: port}, callback);
	}
}

module.exports = JTP2;