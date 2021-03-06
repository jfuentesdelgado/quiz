var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller.js');
var sessionController = require('../controllers/session_controller.js');
var statisticsController = require('../controllers/statistics_controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' , errors: []});
});

//Autoloads de peticiones con parametro :
router.param('quizId', quizController.load); //autoload :quizId 
router.param('commentId', commentController.load); //autoload :commentId

//Rutas de session
router.get('/login', sessionController.new); //formulario login
router.post('/login', sessionController.create); //crear sesion
router.delete('/login', sessionController.destroy); //destruir sesión

// Rutas quizes
router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
router.get('/quizes/new',                   sessionController.loginRequired, quizController.new);
router.post('/quizes/create',               sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',    sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',         sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',      sessionController.loginRequired, quizController.destroy);

// Rutas comments
router.get('/quizes/:quizId(\\d+)/comments/new',  commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',     commentController.create);
router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

// Ruta /statistics
router.get('/quizes/statistics', statisticsController.index);

// Rutas /author
router.get('/author', function(req, res, next){
  res.render('author', {name: 'Jose Fuentes Delgado', imagen: 'CV2015.jpg', link: 'http://jfuentes.es', errors: []});
});


module.exports = router;
