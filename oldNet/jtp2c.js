const http = require("http");
const net = require("net");


class JTP2C {
	constructor() {
		this.socket = new net.Socket();
	}

	emit(data) {
		this.socket.write(data, "utf8", () => {
			console.log("Wrote: " + data);
		});
	}

	onData(callback) {
		this.socket.on("data", callback);
	}

	onConnect(callback) {
		this.socket.on("connect", callback);
	}

	connectURL(url="", port=null) {
		http.get(url, (res) => {
			//console.log(res)
			let addr = res.socket.remoteAddress;
			let p = port || res.socket.remotePort;
			console.log(addr + ":" + p);
			this.socket.connect({host: addr, port: p});
		});
	}
}

module.exports = JTP2C;