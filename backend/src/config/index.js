const app = require('./app');
const { prisma, testConnection, disconnect } = require('./database');

module.exports = {
  app,
  prisma,
  testConnection,
  disconnect
};