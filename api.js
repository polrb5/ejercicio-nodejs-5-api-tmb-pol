require("dotenv").config();
const fetch = require("node-fetch");

const appKey = process.env.APP_KEY;
const appId = process.env.APP_ID;
const urlAPILineas = `${process.env.API_URL}?app_key=${appKey}&app_id=${appId}`;

const getLineasMetro = async () => {
  const resp = await fetch(urlAPILineas);
  const lineas = await resp.json();
  return lineas;
};

module.exports = {
  getLineasMetro,
};
