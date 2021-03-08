



const validator = require('validator');
const ArticleModel = require('../models/article');

const fs = require('fs');
const path = require('path');




let controller = {
    datosCurso: (req,res)=>{
        return res.status(200).send({
            'curso': 'master en frameworks',
            'autor': 'victor',
            'estudiante': 'ramses ayala'
        });
    },

    test: (req,res)=>{
        return res.status(200).send({
            mensaje: 'Hola soy la accion de test del controlador '
        });
    },

    save: (req,res)=>{

        // 1 - CAPTURAR DATOS POR PARAMETRO POR POST
        let params = req.body;
        // 2 - VALIDAR LOS DATOS CON EL MODULO (VALIDATOR)
        let validate_titulo;
        let validate_contenido;

        try
        {
             validate_titulo = !validator.isEmpty(params.title);
            /* console.log("valor de validate titulo", validate_titulo); */
            validate_contenido = !validator.isEmpty(params.content);
        }   
        catch(err){
            return res.status(404).send({
                'message': 'FALTAN DATOS POR PASAR'
            });
        }
        
        if(validate_titulo && validate_contenido){
            
            // 3 - CREAR EL OBJETO PARA GUARDARLO EN LA BD
            let article_model = new ArticleModel();
            // 4 -  ASIGNAR VALORES
            article_model.title = params.title;
            article_model.content = params.content;

            if(params.imagen){
                article_model.image = params.image
            }else{
                article_model.image = null;
            }

            //  5 - GUARDAR EL ARTICULO
            article_model.save((err,articleSuccess)=>{
                if(err || !articleSuccess){
                    return res.status(404).send({
                        'status': 'error',
                        'message': 'No se ha guardado el articulo'
                    });
                
                }

                // 6 - DEVOLVER UNA RESPUESTA
                return res.status(200).send({
                    
                    'status': 'success',
                    'resultado': articleSuccess
                    
                });

            });
        }
        else{
            return res.status(200).send({
                'message': 'Los datos no son validos'
            })
        }
    }, // save
    
    getArticles: (req,res)=>{
        /* despues del find().sort('-_id') para ordenar del mas reciente al mas viejo articulo*/
        let query = ArticleModel.find();
        let ultimo = req.params.last;

        if(ultimo || ultimo != undefined){
            query.limit(5);
        }

        query.exec((err,articles)=>{
            if(err){
                return res.status(500).send({
                    'status': 'error servidor',
                    'message': 'error al devolver los articulos'
                });
            }

            if(!articles){
                return res.status(404).send({
                    'status': 'error',
                    'message': 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                'status': 'success',
                'lista': articles
            });
        });
    },

    getArticle: (req,res)=>{
        // CAPTURAR EL PARAMETRO
        let articleId = req.params.id;

        // SI NO/SI EXISTE QUE HAGA ALGO
        if(articleId == null){
            return res.status(404).send({
                'status': 'error',
                'message': 'El articulo no existe'
            });
        }

        // BUSCAR EL ARTICULO
        ArticleModel.findById(articleId, (err,article) => {

            if(err){
                return res.status(500).send({
                    'status': 'error',
                    'message': 'HUBO ERROR',
                    err
                });
            }

            if(!article){
                return res.status(404).send({
                    'status': 'error',
                    'message': 'Hubo un error al devolver los datos',
                    
                });
            }

            // MOSTRAR EL DATO EN JSON
            return res.status(200).send({
                'status': 'success',
                article
            });

        });
    },

    update: (req,res)=>{

        // CAPTURAR LOS PARAMETROS
        let articleId = req.params.id;
        
        //RECOGER LOS DATOS POR PUT
        let params = req.body;
        /* console.log(params); */

        // VALIDAR
        let validate_title;
        let validate_content;

        try {
             validate_title = !validator.isEmpty(params.title);
             validate_content = !validator.isEmpty(params.content);
             /* console.log("TITULO: ",params.titulo);
             console.log("CONTENIDO: ",params.contenido); */
        } catch (error) {
            return res.status(500).send({
                'status': 'error',
                'message': 'FALTAN DATOS POR PASAR'
            });
        }

        /* console.log("VALOR TITULO: ",validate_title);
        console.log("VALOR CONTENIDO: ",validate_content); */
        if(validate_title && validate_content){
            // FIND Y UPDATE
            /* params -  los datos que se vana actualzar 
                {new: true}  - devuelve el objeto actualizado
            */

            ArticleModel.findByIdAndUpdate({'_id': articleId}, params, {new: true}, (err,articleUpdated)=>{

               if(err || !articleUpdated){
                    res.status(400).send({
                       'status': 'error',
                       'message': 'ERROR AL ACTUALIZAR'
                    });
                }
                
                console.log("PARAMETROS: ", params);
                console.log("articulo actualizado: ", articleUpdated);


                return res.status(200).send({
                    'status': 'success',
                    articleUpdated
                });

            }); 
        }
        else{
               return res.status(200).send({
                   'status': 'error',
                   'message': 'error en la validacion'
               });
        }

    },  // update

    delete: (req,res)=>{
        
        //ACAPTURAR EL ID DE LA URL
        let article_id = req.params.id;
        // FIND AND REMOVE
        ArticleModel.findByIdAndRemove({'_id': article_id}, (err,articleRemoved) => {

            if(err){
                res.status(500).send({
                    'status': 'error en el servidor',
                    'message': 'Ocurrio un error'
                });
            }

            if(!articleRemoved){
                res.status(404).send({
                    'status': 'error',
                    'message': 'Ocurrio un error, el articulo no existe'
                });
            }

            res.status(200).send({
                'status': 'deleted',
                articleRemoved
            });
        });

    },

    upload: (req,res)=>{
        
        // 1 - RECOGER EL ARCHIVO DE LA PETICION

        let msj = "Imagen no subido :'(";

        if(!req.files){
            res.status(200).send({
                'status': 'error',
                'message': msj
            });
        }

        // 2 - CONSEGUIR NOMBRE Y LA EXTENSION DEL ARCHIVO
        let file_path = req.files.file0.path;
        
        // - DESCOMPONE LA RUTA Y SEPARA CADA CARPETA Y ARCHIVOS EN UN MISMO ARREGLO
        let file_split = file_path.split('\\'); // NOTA: EN LINUX O MAC let file_split = file_path.split('/'); 
        // - LONGITUD DEL ARREGLO
        let file_longitud = file_split.length;
        // - ULTIMO ELEMENTO (IMAGEN) EN ESTE CASO TAMBIEN SE DEVIELVE UN ARREGLO
        let file_ultimo = file_split[file_longitud-1];

        console.log(file_ultimo);
        // - SEPARA EL ULTIMO ELEMENTO POR EL . Y SE DEVUELVE UN ARREGLO
        let ultimo_split = file_ultimo.split('.');
        // - SE ACCEDE AL NOMBRE Y A LA EXTENSION DEL ARCHIVO
        let file_name = ultimo_split[0];
        let file_extension = ultimo_split[1];

       

        // 3 - COMPROBAR LA EXTENSION, (SOLO IMAGANES), 
        if(file_extension != 'jpg' && file_extension != 'JPG' && file_extension != 'jpeg' && file_extension != 'png' && file_extension != 'gif'){
            // 4 - SI NO ES VALIDA BORRAR EL ARCHIVO
            fs.unlink(file_path, (err) => {
                res.status(200).send({
                    'status': 'error',
                    'message': 'LA EXTENSION DEL ARCHIVO NO ES VALIDA'
                });
            });  
        }
        else{
            // 5 - SI TODO ES VALIDO, BUSCAR EL ARTICULO, ASIGNARLE EL NOMBRE DE LA IMAGEN Y ACTUALIZARLO
                
                // SACAR EL ID POR PARAMETRO
            let article_id = req.params.id;

            if(article_id){

                ArticleModel.findByIdAndUpdate({_id: article_id}, {image: file_ultimo}, {new: true}, (err,articleUpdated) => {

                    if(err || !articleUpdated){
                        res.status(404).send({
                            'status': 'error',
                            'message': 'hubo un error posiblemente el articulo no exista'
                        });
                    }
    
                    /* res.status(200).send({
                        'articulo actualizado': articleUpdated
                    }); */
    
                    res.status(200).send({
                        'file_path': file_path,
                        'split': file_split,
                        'longitud': file_longitud,
                        'ultimo': file_ultimo,
                        'img': ultimo_split,
                        'nombre': file_name,
                        'extension': file_extension,
                        '----': '-----',
                        'status': 'success',
                        'articuloActualizado': articleUpdated
                    }); 
                });
            }else{
                res.status(200).send({
                    'status': 'success',
                    'image': file_ultimo
                });
            }


        }   // else
        
    },   // end upload

    getImage: (req,res) => {

        // CAPTURAR EL NOMBRE JUNTO CON LA EXTENSION DE LA IMAGEN POR PARAMETRO
        let file_image = req.params.image;
        // RUTA AL ARCHIVO (IMAGEN)
        let path_image = './upload-image/article-imgs/' + file_image;
        // SE COMPROBARA CON EL MODULO fs SI EXISTE EL ARCHIVO EN LA CARPETA O EN LA RUTA QUE SE ESPECIFICA
        fs.exists(path_image, (exists) => { // CALLBACK SI EXISTE SE ENVIARA LA IMAGEN

            if(exists){
               res.status(200).sendFile(path.resolve(path_image));  // RESUELVE LA RUTA Y SACA EL ARCHIVO COMO TAL
            }
            else{
                res.status(404).send({
                    'status': 'error',
                    'message': 'El archivo de imagen no existe'
                });
            }

        });
    
        /* res.status(200).send({
            'status': 'success',
            file_image
        }); */
    },

    search: (req,res) => {

        // CAPTURAR CADENA A BUSCAR
        let cadena = req.params.cadena;
        // FIND OR
        ArticleModel.find({
            "$or": [
                {"title": {"$regex": cadena, "$options": "i"}},
                {"content": {"$regex": cadena, "$options": "i"}}  
            ]
        }).sort([["date", "descending"]]).exec((err,articles) => {
            
            if(err){
                return res.status(500).send({
                    'status': 'error servidor',
                    'message': 'hay un error'
                });
            }

            if(!articles || articles.length <=0){
                return res.status(404).send({
                    'status': 'error',
                    'message': 'No hay articulos --'
                });
            }

            return res.status(200).send({
                'status': 'success',
                articles
            });
        });

        cadena = null;

    }   // search
};

module.exports = controller;