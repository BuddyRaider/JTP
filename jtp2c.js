const https = require("https");
const http = require("http");

class JTP2C {
	constructor(url="", useHttps=false) {
		this.client = (useHttps) ? https:http;
		this.url = url;
	}

	request(opts={}, call=() => {}) {
		let options = {headers: opts, hostname: this.url};
		//console.log(options);
		this.client.get(options, call);
	}
}

module.exports = JTP2C;