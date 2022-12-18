'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      destination: {
        type: Sequelize.STRING
      },
      destinationCode: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      class: {
        type: Sequelize.STRING
      },
      departure: {
        type: Sequelize.STRING
      },
      departureCode: {
        type: Sequelize.STRING
      },
      takeOff: {
        type: Sequelize.DATE
      },
      arrive: {
        type: Sequelize.DATE
      },
      code: {
        type: Sequelize.STRING
      },
      flight: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      totalChair: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tickets');
  }
};