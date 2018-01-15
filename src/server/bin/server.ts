import app from "../app";
import * as http from "http";
import { normalize } from "path";

const debug = require("debug")("app:server");

/**
 * Get Port from environment and store in Express
 */
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create Http Server
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize port into a number, string, or false
 */
function normalizePort (val: any): number | string | boolean {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

/**
 * Event listener for Http Server 'error' event
 */
function onError (err: any) {
  if (err.syscall !== "listen") {
    throw err;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (err.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw err;
  }
}

/**
 * Event listener for Http server 'listening' event
 */
function onListening () {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

  debug("Listening on " + bind);
}
