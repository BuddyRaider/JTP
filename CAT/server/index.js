const j2s = require("./jtp2s.js");
const server = new j2s();
const fs = require("fs");
const logFile = "./log.txt";
const crypto = require("crypto");
const cryptoAlg = "aes-256-cbc"; // alternatively "sha256"
const keyLength = 32
const cryptoPswd = crypto.scryptSync(process.env.cryptoPswd, process.env.cryptoSalt, keyLength);

server.onURL("/jtp2c.js", "./jtp2c.js");
server.onURL("/client.js", "./client.js");
server.onURL("/cat.sh", "./cat.sh");

server.on("home", (req, res) => {
	console.log("GET: HOME");
	if (req.headers["jtp-data"]) {
		let data = JSON.parse(req.headers["jtp-data"]);
		if (data.user && data.pswd && getLogins()[data.user] === data.pswd) {
			console.log("AUTH REQUEST: SUCCESSFUL");
			res.writeHead(200, {"jtp-body": JSON.stringify({"msgs": decrypt(getFile()).split("\n")})});
			res.end();
		} else {
			res.writeHead(200, {"jtp-body": "{\"msgs\": [\"*NO MESSAGES, PLEASE LOG IN!!!*\"]}"});
			res.end();
		}
	} else {
		res.writeHead(200, {"jtp-body": "{\"msgs\": [\"*NO MESSAGES, PLEASE LOG IN!!!*\"]}"});
		res.end();
	}
});

server.on("log", (req, res) => {
	console.log("GET: LOG");
	if (req.headers["jtp-data"] && getLogins()[req.headers["jtp-data"].split("\t")[2]] !== undefined) {
		let str = decrypt(fs.readFileSync(logFile, "utf8")) + req.headers["jtp-data"] + "\n";
		fs.writeFileSync(logFile, encrypt(str));
	}
	res.writeHead(200, {"jtp-body": JSON.stringify({"msgs": decrypt(getFile()).split("\n")})});
	res.end();
});

server.on("change", (req, res) => {
	console.log("GET: CHANGE");
	if (req.headers["jtp-data"]) {
		let data = JSON.parse(req.headers["jtp-data"]);
		let str = decrypt(fs.readFileSync(logFile, "utf8")).split("\n");
		str[data.indx] = str[data.indx].replace(data.old, data.new);
		fs.writeFileSync(logFile, encrypt(str.join("\n")));
	}
	res.writeHead(200, {"jtp-body": JSON.stringify({"msgs": decrypt(getFile()).split("\n")})});
	res.end();
});

server.on("signup", (req, res) => {
	console.log("GET: SIGNUP");
	if (req.headers["jtp-data"]) {
		let data = JSON.parse(req.headers["jtp-data"]);
		let json = JSON.parse(decrypt(fs.readFileSync("logins.txt", "utf8")));
		if (data.user && data.pswd) {
			if (!(data.user in json)) {
				console.log("NEW USER SIGNUP: SUCCESSFUL");
				json[data.user] = data.pswd;
			} else if (json[data.user] === data.oldPswd) {
				console.log("USER CHANGED PASSWORD: SUCCESSFUL");
				json[data.user] = data.pswd;
			}
		}
		fs.writeFileSync("logins.txt", encrypt(JSON.stringify(json)));
	}
});

server.run(443, () => {console.log("Server Running On Port 443!")});

function encrypt(str) {
	let iv = crypto.randomUUID().replace(/-/g, "").slice(-16);
	const cipher = crypto.createCipheriv(cryptoAlg, cryptoPswd, Buffer.from(iv));
	var encrypted = cipher.update(str, "utf8", "hex") + cipher.final("hex");
	return encrypted + iv;
}

function decrypt(str) {
	let text = str.slice(0, -16);
	let iv = Buffer.from(str.slice(-16));
	const decipher = crypto.createDecipheriv(cryptoAlg, cryptoPswd, iv);
	var decrypted = decipher.update(text, "hex", "utf8") + decipher.final("utf8");
	return decrypted;
}

function getFile() {
	let f = fs.readFileSync(logFile, "utf8");
	if (!f) {
		f = encrypt("")
		fs.writeFileSync(logFile, f);
	}
	return f;
}

function getLogins() {
	let f = fs.readFileSync("logins.txt", "utf8");
	if (!f) {
		f = encrypt('{}');
		fs.writeFileSync("logins.txt", f);
	}
	return JSON.parse(decrypt(f));
}
