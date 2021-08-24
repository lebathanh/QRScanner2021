const siteRoutes = require('./site.Routes');

function Routes(app){
    app.use('/', siteRoutes)
}

module.exports = Routes;