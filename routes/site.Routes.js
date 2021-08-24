const express = require('express');
const Router = express.Router();
const siteController = require('../controller/site.Controller');

Router.get('/', siteController.Home)
Router.get('/getstd:id',siteController.GetStudent);
Router.post('/addstd', siteController.AddStudent);
Router.delete('/delstd:id', siteController.DeleteStudent);
Router.put('/updstd', siteController.UpdateStudent);

module.exports = Router;