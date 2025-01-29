const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();


const Patient = require(__dirname +'/routes/patients');
const Physio = require(__dirname +'/routes/physios');
const Record = require(__dirname +'/routes/records');
const Auth = require(__dirname +'/routes/auth');
const { autenticacion, rol } = require(__dirname + '/utils/auth');



mongoose.connect(process.env.URLDB).then(() => console.log('Conexión exitosa a la base de datos'))
.catch((error) => console.error('Error al conectar a la base de datos:', error));

let app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'njk');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000 
    }
}));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/public/uploads'));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
  });
  
app.get('/', (req, res) => {
    res.redirect('/public/index.html');
});


app.use('/patients', Patient);
app.use('/physios', Physio);
app.use('/records', Record);
app.use('/auth', Auth);

app.listen(process.env.PORT);