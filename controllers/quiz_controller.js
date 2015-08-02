var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find({
    where: {
      id: Number(quizId)
    },
    include: [{
      model: models.Subject
    }]
  }).then(
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
  models.Quiz.findAll({where: ["pregunta like ?", search], order: [['pregunta', 'ASC']], include: [{
      model: models.Subject
    }]}).then(function(quizes){
      res.render('quizes/index.ejs', { quizes: quizes, errors: [] });
  }).catch(function(error){ next(error);});
};


//GET /quizes/question
exports.show = function(req,res){
  res.render('quizes/show', { quiz: req.quiz, errors: [] } );
};


//GET /quizes/answer
exports.answer = function (req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz , respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function (req, res, next) {
  var quiz = models.Quiz.build( //construye un objeto Quiz
    {pregunta: "Pregunta", respuesta: "Respuesta" , SubjectId: 1 }
  );
  models.Subject.findAll().then(function(subjects){
      res.render('quizes/new', { quiz: quiz, subjects: subjects, errors: [] });
  }).catch(function(error){ next(error);});
};

// POST /quizes/create
exports.create = function (req, res){
  var quiz = models.Quiz.build( req.body.quiz );

  err = quiz.validate();

  if(err){
    res.render('quizes/new', {quiz: quiz, errors: err});
  }else{
        //guardar en BD los campos pregunta y respuesta de quiz
    quiz.save({fields: ["pregunta", "respuesta", "SubjectId"]}).then(function(){
      res.redirect('/quizes'); //Redirección HTTP URL relativo lista preguntas
    })
  }
};

//GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz; //autoload de instancia quiz
  models.Subject.findAll().then(function(subjects){
      res.render('quizes/edit', { quiz: quiz, subjects: subjects, errors: [] });
  }).catch(function(error){ next(error);});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.SubjectId = req.body.quiz.SubjectId;
  err = req.quiz.validate();  
  if (err) {
    res.render('quizes/edit', {quiz: req.quiz, errors: err});
  }else{
    req.quiz.save( {fields: ["pregunta", "respuesta", "SubjectId"]}).then(function(){ res.redirect('/quizes');});
  }
};

// DELETE/quizes/:id
exports.destroy = function (req, res) {
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
