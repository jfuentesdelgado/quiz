module.exports = function(sequelize, DataTypes){
  return sequelize.define('Subject',
    { 
      nombre: DataTypes.STRING 
    });
}