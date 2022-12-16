'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.addColumn('Users', 'exist', { type: Sequelize.BOOLEAN });
    // await queryInterface.addColumn('Users', 'deletedAt', { type: Sequelize.DATE });

    // await queryInterface.addColumn('Tickets', 'destinationCode', { type: Sequelize.STRING });
    // await queryInterface.addColumn('Tickets', 'departureCode', { type: Sequelize.STRING });
    // await queryInterface.addColumn('Tickets', 'totalChair', { type: Sequelize.INTEGER });
    // await queryInterface.addColumn('transactions', 'code', { type: Sequelize.STRING });
    // await queryInterface.addColumn('transactions', 'numChair', { type: Sequelize.INTEGER });
    // await queryInterface.addColumn('transactions', 'notCancelled', { type: Sequelize.BOOLEAN });
    // await queryInterface.addColumn('Users', 'isVerify', { type: Sequelize.BOOLEAN });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
