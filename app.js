'use strict'

// CARGAR MODULOS
const express = require('express');
const bodyParser = require('body-parser');
const conectarDB = require("./config/db");

// EJECUTAR EXPRESS
var app = express();

// CONECTAR A BD
conectarDB();


// CARGAR FICHEROS  DE RUTAS
const routes = require('./routes/routes');


// MIDDLEWARES
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());     /*ESTO ES PARA QUE CUALQUIER TIPO DE PETICION LLEGUE AL SERVIDOR SEA 
                                CONVERTIDA A UN ARCHIVO JSON */
app.set('port', process.env.PORT | 3000);



// CORS     (ACCESO CRUZADO ENTRE DOMINIOS) 
            /* PERMITIR EL ACCESO O PERMITIR LAS LLAMADAS HTTP A LA API
            DESDE EL FRONT-END*/

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
            


// AGREGAR PREJIJOS A RUTAS / CARGAR RUTAS
app.use('/api', routes);


app.listen(app.get('port'),"0.0.0.0",()=>{
    console.log('servidor ejecutandose en el puerto: ' + app.get('port'));
});


// EXPORTAR MODULO (FICHERO ACTUAL)
module.exports = app;


