'use strict'

const express = require('express');
const Articlecontroller = require('../controllers/article');

const router = express.Router();

const multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './upload-image/article-imgs'});


// RUTAS DE PRUEBA
router.get('/test', Articlecontroller.test);
router.post('/datos-curso', Articlecontroller.datosCurso);



// RUTAS UTILES
router.post('/save', Articlecontroller.save);
router.get('/articles/:last?', Articlecontroller.getArticles);
router.get('/article/:id?', Articlecontroller.getArticle);
router.put('/update/:id', Articlecontroller.update);
router.delete('/delete/:id', Articlecontroller.delete);
router.post('/upload-image/:id?', md_upload, Articlecontroller.upload);
router.get('/get-image/:image', Articlecontroller.getImage);
router.get('/search/:cadena', Articlecontroller.search);


/*CON ESTO SE EXPORTAN LAS RUTAS Y SE PUEDEN CARGAR EN CUALQUIER ARCHIVO */
module.exports = router;