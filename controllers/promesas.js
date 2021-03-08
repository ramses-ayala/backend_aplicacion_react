/*

    UNA PROMESA TIENE TRES ESTADOS PUEDE ESTAR PENDIENTE, RESULETA O RECHAZADA
*/


/* let promesa = new Promise((resolve,reject)=>{
    if(true){
        resolve("BIEN");
    }

    else{
        reject("ERROR");
    }
});


promesa.then((response)=>{
    console.log("RESPUESTA: " + response);
})

.catch((e)=>{
    console.log("ERROR: " + e);
}) */



/* let promesa2 = new Promise((resolve,reject)=>{
    
    console.log("PENDIENTE.......");

    setTimeout(() => {
        resolve("PROMESA RESUELTA");
    }, 2000);

    setTimeout(() => {
        reject("OCURRIO UN ERROR");
    }, 4000);
});

promesa2
    .then((respuesta)=>{
        console.log(" RESULTADO RESPUESTA: ", respuesta);
    })
    .catch((error)=>{
        console.log("RESULTADO ERROR: ", error);
    }); */





    /* promise.all */

    
