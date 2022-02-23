const express = require('express');
const routes = express.Router();

const transactionController = require("../controllers/transactions-controller")

routes.get('/',transactionController.list);

module.exports = routes;