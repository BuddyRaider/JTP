const https = require("https");
//const net = require("net");


class JTP2C {
	constructor() {}

	connect(url="", jtpHeaders={}, callback=() => {}) {
		return https.get({hostname: url, headers: {...jtpHeaders}}, (res) => {
			callback(res);
		});
	}
}

module.exports = JTP2C;