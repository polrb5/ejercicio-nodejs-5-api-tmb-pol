require("dotenv").config();
const fetch = require("node-fetch");
const express = require("express");
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());
