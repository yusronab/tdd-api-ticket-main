'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.transaction, {
        foreignKey: 'ticketId',
        as: 'bookingBy', 
        sourceKey: 'id'
      })

      this.hasMany(models.Wishlist, {
        foreignKey: 'ticketId',
        as: 'wishlist', 
        sourceKey: 'id'
      })
    }
  }
  Ticket.init({
    code: DataTypes.STRING,
    departure: DataTypes.STRING,
    departureCode: DataTypes.STRING,
    destination: DataTypes.STRING,
    destinationCode: DataTypes.STRING,
    type: DataTypes.STRING,
    class: DataTypes.STRING,
    takeOff: DataTypes.DATE,
    arrive: DataTypes.DATE,
    price: DataTypes.INTEGER,
    totalChair: DataTypes.INTEGER,
    flight: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};