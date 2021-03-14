const sqlite3 = require("sqlite3").verbose()
var fs = require("fs")
var path = require("path")

module.exports = getCookiesFromFirefox = function (callback, pathDbFile) {
  if (typeof pathDbFile === "undefined") {
    const ckFile = path.resolve(
      process.env.APPDATA,
      "Mozilla/Firefox/Profiles/"
    );
    pathDbFile = `${ckFile}/${fs.readdirSync(ckFile)[0]}/cookies.sqlite`
  }
  db = new sqlite3.Database(pathDbFile, sqlite3.OPEN_READONLY, (err) => {
    if (err) return console.error(err.message)
  })
  var query =
    "SELECT name, value FROM moz_cookies WHERE name='xf_user' and host='www.ignboards.com' order by lastAccessed desc limit 1";
  db.get(query, function (err, row) {
    if (err) {
      console.log(err)
    } else {
      db.close()
      if (row) callback([`${row.name}=${row.value};`])
    }
  })
}
