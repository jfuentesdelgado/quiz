var models = require('../models/models.js');

// GET /quizes/statistics
exports.index = function(req, res, next){
  models.Quiz.findAll({include: [{ model: models.Subject } , { model: models.Comment }]}).then(function(quizes){
    res.render('quizes/statistics.ejs', { quizes: quizes, errors: [] });
  });

};