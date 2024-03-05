const md5 = require("md5");

export default function generateXAuth() {
  const password = "Valantis";
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return md5(password + "_" + timestamp);
}
