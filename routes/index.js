var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

router.get('/author', function(req, res, next){
  res.render('author', {name: 'Jose Fuentes Delgado', imagen: 'CV2015.jpg', link: 'http://jfuentes.es'});
});

module.exports = router;
