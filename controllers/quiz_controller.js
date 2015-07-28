var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find(quizId).then(
      function(quiz){
        if (quiz) {
          req.quiz = quiz;
          next();
        } else { next(new Error('No existe quizId=' + quizId));}
      }
    ).catch(function(error){next(error);});
};

//GET /quizes
exports.index = function(req, res, next){
  var search;
  if (req.query.search){
    search = "%" + req.query.search.replace(/\s/g, "%") + "%";
  } else {
    search = "%";
  }
  models.Quiz.findAll({where: ["pregunta like ?", search], order: [['pregunta', 'ASC']]}).then(function(quizes){
      res.render('quizes/index.ejs', { quizes: quizes });
  }).catch(function(error){ next(error);});
};


//GET /quizes/question
exports.show = function(req,res){
  res.render('quizes/show', { quiz: req.quiz } );
};


//GET /quizes/answer
exports.answer = function (req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz , respuesta: resultado});
};

// GET /quizes/new
exports.new = function (req,res) {
  var quiz = models.Quiz.build( //construye un objeto Quiz
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function (req, res){
  var quiz = models.Quiz.build( req.body.quiz );
  //guardar en BD los campos pregunta y respuesta de quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes'); //Redirección HTTP URL relativo lista preguntas
  })
}

