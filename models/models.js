var path = require('path');

//Cargar Modulo ORM
var Sequelize = require('sequelize');

//User BBDD SQLite:
var sequelize = new Sequelize(null, null, null, 
                      {dialect: "sqlite", storage: "quiz.sqlite"}
                    );

//Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import( path.join(__dirname,'quiz'));
exports.Quiz = Quiz; //exporta definición de tabla Quiz

//sequelize.sync() crea e inicia tabla de preguntas en DB
sequelize.sync().success(function(coutn){
  // sucess(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().success(function (count){ //la tabla se inicializa solo si está vacia
    if(count===0){
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'})
      .success(function(){console.log('Base de datos inicializada')});
    };
  });
});