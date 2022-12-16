'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Ticket, {
        foreignKey: 'ticketId',
        as: 'ticket',
        targetKey: 'id'
      })
    }
  }
  transaction.init({
    code: DataTypes.STRING,
    ticketId: DataTypes.INTEGER,
    ticketCode: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    orderBy: DataTypes.STRING,
    ktp: DataTypes.STRING,
    isPaid: DataTypes.BOOLEAN,
    notCancelled: DataTypes.BOOLEAN,
    numChair: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};