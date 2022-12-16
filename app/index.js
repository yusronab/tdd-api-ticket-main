require('dotenv').config({})

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const methodOverride = require('method-override')
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = YAML.load('./openapi.yaml');

const router = require("../config/routes")

const app = express()

/** Install request logger */
// app.use(morgan("dev"));

app.set('view engine', 'ejs')

app.use(methodOverride('_method'))

/** Install JSON request parser */
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

/** Install Router */
app.use(router);

module.exports = app;