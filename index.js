require("dotenv").config();
const debug = require("debug")("servidor:root");
const chalk = require("chalk");
const express = require("express");
const morgan = require("morgan");
const { getLineasMetro, getParadasLinea } = require("./api");

const app = express();

const port = process.env.PORT;

const server = app.listen(port, () => {
  debug(`Servidor activo en el port ${chalk.yellow(port)}`);
});

server.on("error", (err) => {
  debug(chalk.red("No se ha podido levantar el servidor"));
  if (err.code === "EADDRINUSE") {
    debug(chalk.red(`El port ${chalk.bgRed.white.bold(port)} está ocupado`));
  }
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());

app.get("/despedida", (req, res, next) => {
  res.send("<h1>Adéu</h1>");
});

const lineasMetro = async () => {
  const { features } = await getLineasMetro();
  const lineas = features.map((linea) => {
    const {
      properties: { NOM_LINIA, DESC_LINIA, CODI_LINIA },
    } = linea;

    return {
      id: CODI_LINIA,
      linea: NOM_LINIA,
      descripcion: DESC_LINIA,
    };
  });
  return lineas;
};

const paradasMetro = async (codiLinea) => {
  const { features } = await getParadasLinea(codiLinea);
  const paradas = features.map((parada) => {
    const {
      properties: { NOM_ESTACIO, CODI_ESTACIO },
    } = parada;
    return {
      id: CODI_ESTACIO,
      nombre: NOM_ESTACIO,
    };
  });
  return paradas;
};

app.get("/metro/lineas", async (req, res, next) => {
  try {
    const lineasMetroTmb = await lineasMetro();
    res.json(lineasMetroTmb);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      error.message = "No hemos podido obtener las lineas";
    }
    res.status(500).json({ error: true, mensaje: "error.message" });
  }
});

app.get("/metro/linea/:nomLinea", async (req, res, next) => {
  try {
    const nom = req.params.nomLinea;
    const lineas = await lineasMetro();
    const linea = lineas.find(
      (linea) => nom.toLowerCase() === linea.linea.toLowerCase()
    );
    const paradasObtenidas = await paradasMetro(linea.id);
    res.json({
      nombre: linea.nombre,
      descripcion: linea.descripcion,
      paradas: paradasObtenidas,
    });
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      error.message = "No hemos podido obtener las lineas";
    }
    res.status(500).json({ error: true });
  }
});

app.use((req, res, next) => {
  if (
    req.method === "POST" ||
    req.method === "PUT" ||
    req.method === "DELETE"
  ) {
    res
      .status(403)
      .json({ error: true, mensaje: "Te pensabas que podías jaquearme" });
  }
  next();
});

app.use((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
});
