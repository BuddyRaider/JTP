const j2c = require("../../../jtp2c.js");
const client = new j2c("CAT.BuddyDev.repl.co", true);

client.request({"jtp-evt": "home"}, (res) => {
  console.log(res.headers["jtp-body"]);
});
