'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;





let ArticleSchema = schema({
    'title': String,
    'content': String,
    'date': {
        type: Date,
        default: Date.now
    },
    'image': String
});


                                /*Nombre del modelo o de la coleccion(Articles) 
                                que es esquema se utilizara (ArticleSchema) */
module.exports = mongoose.model('Articles',ArticleSchema);