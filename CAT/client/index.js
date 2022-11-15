const j2c = require("./jtp2c.js");
const client = new j2c("CAT.BuddyDev.repl.co", true);
const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);
const rl = readline.createInterface(process.stdin, process.stdout);
//rl.pause();

const cmdTip = "COMMANDS:\t\tR: Refresh Messages\t\tM: Message Mode\t\tESC: Exit Message Mode\t\tCtrl+C: Exit CAT";
const line = "-".repeat(128);
var currentMsg = "";
var msgInp = false;
var editInp = false;

const username = process.argv[2];
const password = process.argv[3];

console.clear();

if (!username || !password) {
	console.log("ERROR: Username AND Password Required.");
	console.log("TO SIGN UP FOR AN ACCOUNT, RUN THIS COMMAND: '. cat.sh <username> <password> signup'");
} else {
	getMsgs();
}

process.stdin.on("keypress", async (str, key) => {
	if (!msgInp) readline.clearLine(process.stdin, 0);
	switch (key.name) {
		case "c":
			if (key.ctrl) {
				process.exit();
			} else if (msgInp) {
				changeMsg(currentMsg + str);
			}
			break;
		case "r":
			if (msgInp) {
				changeMsg(currentMsg + str);
			} else {
				getMsgs();
			}
			break;
		case "m":
			if (msgInp) {
				changeMsg(currentMsg + str);
			} else {
				changeMsg("");
				msgInp = true;
			}
			break;
		case "return":
			if (msgInp) {
				msgInp = false;
				let date = new Date().toLocaleString("en", {timeZone: "America/New_York"});
				client.request({"jtp-evt": "log", "jtp-data": date + "\t\t" + username + "\t\t" + currentMsg}, (res) => {
					//displayMsgs(JSON.parse(res.headers["jtp-body"]));
					console.clear();
					//console.log("MESSAGE SENT! PRESS R TO RELOAD.");
					getMsgs();
				});
			}
			break;
		case "escape":
			msgInp = false;
			getMsgs();
			break;
		case "backspace":
			if (msgInp) {
				changeMsg(currentMsg.slice(0, -1));
			}
			break;
		default:
			if (msgInp) {
				changeMsg(currentMsg + ((str !== undefined) ? str:""));
			} else {
				//console.log(str, key);
			}
	}
});

function displaySettings() {
	console.clear();
	console.log("Work In Progress");
}

function changeMsg(msg="") {
	console.clear();
	console.log(cmdTip + "\n");
	console.log("MESSAGE MODE:\n");
	currentMsg = msg;
	process.stdout.write(currentMsg);
}

function displayMsgs(data) {
	console.clear();
	console.log(cmdTip + "\n");
	console.log("CHAT MODE:\n");
	console.log(line + "\n");
	for (let i in data.msgs) {
		console.log(data.msgs[i]);
	}
}

function getMsgs(callback=displayMsgs) {
	client.request({"jtp-evt": "home", "jtp-data": JSON.stringify({user: username, pswd: password})}, (res) => {
		res.on("data", (data) => {/* *void* */});
		callback(JSON.parse(res.headers["jtp-body"]));
	});
}
