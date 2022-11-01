const net = require("net");


class JTP2 {
	constructor() {
		this.server = net.createServer();
		this.routes = {};
	}

	on(event, callback) {
		this.routes[event] = callback;
	}

	serve(port=80, callback=() => {}) {
		this.server.on("connection", (socket) => {
			console.log("New Connection!");
			socket.on("data", (data) => {
				if (typeof data !== "string") {
					data = data.toString();
				}
				console.log("New Data:", data.length);
				for (let route in this.routes) {
					if (data.startsWith("route: " + route)) {
						this.routes[route](socket);
						return;
					}
				}
				socket.end("No route found!");
				console.log("No Route Found!");
			});
		});
		this.server.listen({port: port}, callback);
	}
}

module.exports = JTP2;