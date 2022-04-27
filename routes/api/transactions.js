const express = require('express');
const routes = express.Router();

const transactionController = require("../controllers/transactions-controller")

routes.get('/',transactionController.list);
routes.post('/add-comment',transactionController.add_comment);
routes.get('/delete-transaction/:tid',transactionController.delete_transaction);

module.exports = routes;