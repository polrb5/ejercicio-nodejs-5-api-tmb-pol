require("dotenv").config();
const fetch = require("node-fetch");

const appKey = process.env.APP_KEY;
const appId = process.env.APP_ID;
const urlAPILineas = `${process.env.URL_API_TMB}?app_id=${appId}&app_key=${appKey}`;

const getLineasMetro = async () => {
  const resp = await fetch(urlAPILineas);
  const lineas = await resp.json();
  console.log(lineas);
  return lineas;
};

module.exports = {
  getLineasMetro,
};
