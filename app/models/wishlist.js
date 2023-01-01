'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Ticket, {
        foreignKey: 'ticketId',
        as: 'detailTicket',
        targetKey: 'id'
      })
    }
  }
  Wishlist.init({
    userId: DataTypes.INTEGER,
    ticketId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Wishlist',
  });
  return Wishlist;
};