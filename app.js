'use strict'

// CARGAR MODULOS
const express = require('express');
const bodyParser = require('body-parser');


// EJECUTAR EXPRESS
var app = express();



// CARGAR FICHEROS  DE RUTAS
const routes = require('./routes/routes');



// MIDDLEWARES
app.use(bodyParser.urlencoded({exteded:false}));
app.use(bodyParser.json());     /*ESTO ES PARA QUE CUALQUIER TIPO DE PETICION LLEGUE AL SERVIDOR SEA 
                                CONVERTIDA A UN ARCHIVO JSON */
app.set('port', process.env.PORT | 3001);



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


// EXPORTAR MODULO (FICHERO ACTUAL)
module.exports = app;


