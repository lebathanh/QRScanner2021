const express = require('express');
const app = express();
const Routes = require('./routes/index.Routes');
const db = require('./config/mongodb');

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Routes(app);
db.connect();

var port = process.env.PORT || 8080;
app.listen(port, function(){
    console.log('App listening on port:', port)
})