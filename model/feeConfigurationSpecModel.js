const db = require('../db');
const {DataTypes, Model} = require('sequelize');
// console.log(db)

class FeeInstance extends Model {}

FeeInstance.init({
  feeId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
    
  },
  feeCurrency: {
    type: DataTypes.STRING,
    allowNull: false
    // allowNull defaults to true
  },
feeLocal: {
    type: DataTypes.STRING,
    allowNull: false
},
feeEntity: {
    type: DataTypes.STRING,
    allowNull: false
},
entityProperty: {
    type: DataTypes.STRING,
    allowNull: false
},
feeType: {
    type: DataTypes.STRING,
    allowNull: false
},
feeValue: {
    type: DataTypes.STRING,
    allowNull: false
}
}, {
  // Other model options go here
  sequelize: db,
  tableName: 'Fsc' // We need to choose the model name
});

module.exports = FeeInstance