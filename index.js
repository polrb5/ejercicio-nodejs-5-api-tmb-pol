require("dotenv").config();
const debug = require("debug")("servidor:root");
const fetch = require("node-fetch");
const chalk = require("chalk");
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());

const port = process.env.PORT;

const server = app.listen(port, () => {
  debug(`Servidor escuchando en el port ${chalk.yellow(port)}`);
});

server.on("error", (err) => {
  debug(chalk.red("No se ha podido levantar el servidor"));
  if (err.code === "EADDRINUSE") {
    debug(chalk.red(`El port ${chalk.bold(port)} está ocupado`));
  }
});
