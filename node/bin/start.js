require("@babel/register");
require("@babel/polyfill");
require("dotenv/config");
require("../config/dbconnection.js")();

const http = require("http");
const app = require("../app.js").default;
const config = require("../config/config.js");
const configuration = config.default[process.env.NODE_ENV];

const port = configuration.API_PORT;
const server = http.createServer(app);
server.listen(port);
server.on("listening", () => {
  console.log(`app is listening to http://localhost:${port}`);
});
