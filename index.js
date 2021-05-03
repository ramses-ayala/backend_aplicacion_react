const mongoose = require('mongoose');
const app = require('./app');



mongoose.set('useFindAndModify',false); /* DESACTIVAR METODOS ANTIGUOS DE MONGOOSE Y UTILIZAR METODOS
                                        QUE ESTAN DISPONIBLES EN LA DOCUMENTACION*/
                                        
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/api_rest_blog',{useNewUrlParser: true, useUnifiedTopology:true})
    .then(()=>{
        console.log('CONEXION A LA BASE DE DATOS EXITOSA');


        
        // PONER SERVIDOR A ESCUCHAR
        app.listen(app.get('port'),()=>{
            console.log('servidor ejecutandose en http://localhost: ' + app.get('port'));
        });
    });





