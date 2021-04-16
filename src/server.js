const Express = require('express');
const CookieParser = require('cookie-parser');
const Path = require('path');
const Fs = require('fs');
require('dotenv').config({ path: Path.join(__dirname, ".env") })
const PORT = process.env.PORT;


if ( !PORT ) throw new Error("Port is not defined!")


const application = Express();


// middlewares
application.use(Express.json());
application.use(Express.urlencoded({ extended: true }));
application.use(CookieParser());


// settings
application.listen(PORT, () => {
    console.log(`You are working at PORT 80
http://localhost:80/
 `)
})
application.set("view engine", "ejs" );
application.set("views", Path.join(__dirname, "views"));
application.use(Express.static(Path.join(__dirname, "public")))

// Routes

const RoutesPath = Path.join(__dirname, "routes");

Fs.readdir(RoutesPath, (err, files) => {
    if ( err ) throw new Error(err);
    files.forEach(route => {
        const RoutesPath = Path.join(__dirname, "routes", route);
        const Route = require(RoutesPath);
        if ( Route.path && Route.router ) application.use(  Route.path, Route.router );
    })
})


application.get('/', (req, res) => res.redirect('/profile'))
